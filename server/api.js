const encoder=new TextEncoder();
export async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256));}
const hex=b=>Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');
const digest=async s=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(s)));
const equal=(a,b)=>{if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;};
const json=(status,data,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
export async function sessionUser(request,env){const token=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('journal_session='))?.slice(16);if(!token||!env.DB)return null;return env.DB.prepare('SELECT role FROM sessions WHERE token = ? AND expires > ?').bind(await digest(token),Date.now()).first();}
export async function api(request,env){const url=new URL(request.url),path=url.pathname;if(!['/api/auth/me','/api/auth/login','/api/auth/logout','/api/diary','/api/together'].includes(path))return null;if(!env.DB)return json(503,{error:'日记数据库尚未连接'});
const mutation=!['GET','HEAD'].includes(request.method);if(mutation&&request.headers.get('origin')&&request.headers.get('origin')!==url.origin)return json(403,{error:'请求来源不匹配'});
if(path==='/api/auth/me'&&request.method==='GET'){const u=await sessionUser(request,env);return json(200,{user:u?{role:u.role,name:u.role==='him'?'男方':'女方'}:null});}
if(path==='/api/auth/logout'&&request.method==='POST'){const t=request.headers.get('cookie')?.match(/(?:^|;\s*)journal_session=([^;]+)/)?.[1];if(t)await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(await digest(t)).run();return json(200,{ok:true},{'Set-Cookie':'journal_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'+(url.protocol==='https:'?'; Secure':'')});}
let data;if(mutation){if(Number(request.headers.get('content-length')||0)>100000)return json(413,{error:'内容过长'});const raw=await request.text();if(raw.length>40000)return json(413,{error:'内容过长'});try{data=JSON.parse(raw);}catch{return json(400,{error:'内容格式不正确'});}}
if(path==='/api/auth/login'&&request.method==='POST'){const ip=await digest(request.headers.get('cf-connecting-ip')||request.headers.get('x-local-ip')||'unknown');const row=await env.DB.prepare('SELECT count, until FROM attempts WHERE ip = ?').bind(ip).first();if(row&&row.until>Date.now()&&row.count>=10)return json(429,{error:'尝试次数较多，请一分钟后再试。'});
const conf=data.role==='him'?env.AUTH_HIM:data.role==='her'?env.AUTH_HER:null;if(!env.AUTH_HIM||!env.AUTH_HER)return json(503,{error:'登录尚未配置'});const [salt,hash]=(conf||'invalid:invalid').split(':');const valid=typeof data.password==='string'&&data.password.length<=128&&equal(await passwordHash(data.password,salt),hash);
if(!valid){await env.DB.prepare('INSERT INTO attempts(ip,count,until) VALUES(?,1,?) ON CONFLICT(ip) DO UPDATE SET count = CASE WHEN attempts.until > ? THEN attempts.count + 1 ELSE 1 END, until = CASE WHEN attempts.until > ? THEN attempts.until ELSE excluded.until END').bind(ip,Date.now()+60000,Date.now(),Date.now()).run();return json(401,{error:'密码不正确，再试一次吧。'});}await env.DB.prepare('DELETE FROM attempts WHERE ip = ?').bind(ip).run();await env.DB.prepare('DELETE FROM sessions WHERE expires <= ?').bind(Date.now()).run();const token=hex(crypto.getRandomValues(new Uint8Array(32)));await env.DB.prepare('INSERT INTO sessions(token,role,expires) VALUES(?,?,?)').bind(await digest(token),data.role,Date.now()+86400000).run();return json(200,{user:{role:data.role,name:data.role==='him'?'男方':'女方'}},{'Set-Cookie':`journal_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${url.protocol==='https:'?'; Secure':''}`});}

if(path==='/api/together'){
 const user=await sessionUser(request,env);if(!user)return json(401,{error:'请重新登录后继续互动。'});
 const mode=request.method==='GET'?url.searchParams.get('mode'):data?.mode;
 if(!['quiz','notes','date'].includes(mode))return json(400,{error:'请选择互动玩法。'});
 await env.DB.prepare('INSERT OR IGNORE INTO together(mode,round,updated) VALUES(?,0,?)').bind(mode,Date.now()).run();
 if(request.method==='POST'){
  const old=await env.DB.prepare('SELECT * FROM together WHERE mode=?').bind(mode).first();
  if(data.round!==old.round)return json(409,{error:'对方已经开启新一轮，已为你同步。'});
  let result;
  if(data.action==='next'){
   if(mode!=='date'&&(old.him===null||old.her===null))return json(409,{error:'等两个人都提交后，再开启下一轮吧。'});
   const plan=mode==='date'?(old.plan===null?Math.floor(Math.random()*6):(old.plan+1+Math.floor(Math.random()*5))%6):null;
   result=await env.DB.prepare('UPDATE together SET round=round+1,him=NULL,her=NULL,plan=?,updated=? WHERE mode=? AND round=?').bind(plan,Date.now(),mode,old.round).run();
  }else if(data.action==='answer'&&mode!=='date'){
   const answer=data.answer;
   if(typeof answer!=='string'||(mode==='quiz'&&!['0','1','2','3'].includes(answer))||(mode==='notes'&&(!answer.trim()||answer.length>1000)))return json(400,{error:'请填写有效的答案。'});
   const column=user.role==='him'?'him':'her';
   result=await env.DB.prepare('UPDATE together SET '+column+'=?,updated=? WHERE mode=? AND round=? AND '+column+' IS NULL').bind(answer.trim(),Date.now(),mode,old.round).run();
  }else return json(400,{error:'不支持此操作。'});
  if(!result.meta.changes)return json(409,{error:'本轮已有更新，已为你同步。'});
 }else if(request.method!=='GET')return json(405,{error:'不支持此操作'});
 const row=await env.DB.prepare('SELECT * FROM together WHERE mode=?').bind(mode).first();
 const revealed=row.him!==null&&row.her!==null;
 return json(200,{mode,round:row.round,role:user.role,submitted:{him:row.him!==null,her:row.her!==null},mine:row[user.role],answers:revealed?{him:row.him,her:row.her}:null,plan:row.plan,updated:row.updated});
}

if(path==='/api/diary'){const user=await sessionUser(request,env);if(!user)return json(401,{error:'登录已过期，请刷新并重新登录。'});if(request.method==='GET'){const result=await env.DB.prepare('SELECT * FROM entries ORDER BY date DESC, updated DESC').all();return json(200,{entries:result.results,role:user.role});}
if(request.method==='PUT'){if(!data||typeof data.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(data.id)||typeof data.title!=='string'||!data.title.trim()||data.title.length>80||typeof data.body!=='string'||!data.body.trim()||data.body.length>20000||!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!['心动','开心','想念','平静','有点低落'].includes(data.mood))return json(400,{error:'请检查日期、标题和正文。'});
const old=await env.DB.prepare('SELECT author,version FROM entries WHERE id = ?').bind(data.id).first();if(old&&old.author!==user.role)return json(403,{error:'只有作者可以编辑这篇日记。'});if(old){if(data.version!==old.version)return json(409,{error:'这篇日记已有新版本。请保留当前文字，刷新列表后再编辑。'});const r=await env.DB.prepare('UPDATE entries SET date=?,title=?,body=?,mood=?,version=version+1,updated=? WHERE id=? AND version=? AND author=?').bind(data.date,data.title.trim(),data.body.trim(),data.mood,Date.now(),data.id,old.version,user.role).run();if(!r.meta.changes)return json(409,{error:'日记已更新，请刷新后重试。'});}else{if(data.version)return json(409,{error:'日记版本不匹配。'});const r=await env.DB.prepare('INSERT OR IGNORE INTO entries(id,author,date,title,body,mood,version,updated) VALUES(?,?,?,?,?,?,1,?)').bind(data.id,user.role,data.date,data.title.trim(),data.body.trim(),data.mood,Date.now()).run();if(!r.meta.changes)return json(409,{error:'日记已存在，请刷新列表。'});}const entry=await env.DB.prepare('SELECT * FROM entries WHERE id = ?').bind(data.id).first();return json(200,{entry});}}
return json(405,{error:'不支持此操作'});}
