import {useEffect,useRef,useState} from 'react';
import {Heart,Shuffle,ArrowRight} from '@phosphor-icons/react';
const questions=[{q:'空闲的一天，最想一起做什么？',a:['逛书店','看电影','散步拍照','宅家打游戏']},{q:'下次约会想选什么氛围？',a:['安静舒服','热闹有趣','有点冒险','随心就好']},{q:'最喜欢怎样表达想念？',a:['分享日常','直接说想你','打个电话','准备小惊喜']}];
const dates=['一起去书店，各选一本想送给对方的书。','散步半小时，拍下今天最喜欢的三个画面。','各选一部电影，抽签决定今晚看哪部。','一起做一顿简单的饭，给它起一个可爱的名字。','交换三首歌，讲讲为什么想分享给对方。','一起玩一局游戏，给今天留一张合照。'];

export function CouplePlay(){
 const [mode,setMode]=useState('quiz'),[room,setRoom]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[note,setNote]=useState(''),[synced,setSynced]=useState(false);
 const generation=useRef(0);
 useEffect(()=>{const g=++generation.current;setRoom(null);setError('');setSynced(false);let running=false;
 async function sync(){if(running||document.hidden)return;running=true;try{const r=await fetch('/api/together?mode='+mode);const d=await r.json();if(!r.ok)throw Error(d.error||'暂时无法同步');if(g===generation.current){setRoom(d);setSynced(true);}}catch(e){if(g===generation.current){setSynced(false);setError(e.message);}}finally{running=false;}}
 sync();const timer=setInterval(sync,3000);window.addEventListener('focus',sync);return()=>{generation.current++;clearInterval(timer);window.removeEventListener('focus',sync);};
 },[mode]);
 async function send(action,answer){if(!room||busy)return;const g=generation.current;setBusy(true);setError('');try{const r=await fetch('/api/together',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,round:room.round,action,answer})});const d=await r.json();if(!r.ok)throw Error(d.error||'未能保存，请重试');if(g===generation.current){setRoom(d);setSynced(true);if(mode==='notes')setNote('');}}catch(e){if(g===generation.current)setError(e.message);}finally{setBusy(false);}}
 const q=questions[(room?.round||0)%questions.length],mine=room?.submitted[room.role],partner=room?.role==='him'?'her':'him';
 return <section className="couple-section" id="together"><div className="section-heading"><div><div className="eyebrow">ALWAYS TOGETHER / 异地互动</div><h2>隔着距离，也能靠近你。</h2><p>各自登录，就会来到同一个双人小房间。</p></div><div className="play-avatars"><img src="/photos/avatar-him.jpg" alt="男方头像"/><Heart weight="fill"/><img src="/photos/avatar-her.jpg" alt="女方头像"/></div></div>
 <div className="filters" aria-label="互动玩法">{[['quiz','默契问答'],['date','约会抽签'],['notes','交换心里话']].map(([id,label])=><button key={id} disabled={busy} className={mode===id?'active':''} aria-pressed={mode===id} onClick={()=>setMode(id)}>{label}</button>)}</div>
 <div className="play-panel"><span className="play-label">{synced?'♡ 已连接双人房间 · 每 3 秒同步':'正在连接我们的房间…'}</span>{error&&<p role="alert">{error}</p>}
 {!room?<p>等待同步…</p>:<><p>你是{room.role==='him'?'男方':'女方'} · 第 {room.round+1} 轮</p>
 {mode==='date'?<><h3>下一次见面，或者今晚一起。</h3><p className="date-result">{room.plan===null?'抽一个小计划，两边都会收到同一张签。':dates[room.plan]}</p><button disabled={busy} className="primary-button" onClick={()=>send('next')}><Shuffle/> {busy?'正在同步…':room.plan===null?'一起抽签':'换一个计划'}</button></>:<>
 <h3>{mode==='quiz'?q.q:'今天，有一句话想给你。'}</h3>
 <div className="answer-pair">{['him','her'].map(role=><p key={role}>{role==='him'?'男方':'女方'}<span>{room.submitted[role]?'已提交 ♡':'等你写下答案'}</span></p>)}</div>
 {room.answers?<><h4>{mode==='quiz'?(room.answers.him===room.answers.her?'我们想到一起了。':'不同的答案，也想听你慢慢说。'):'两份心意，都收到啦。'}</h4><div className="notes-pair">{['him','her'].map(role=><article key={role}><span>{role==='him'?'男方':'女方'}的{mode==='quiz'?'答案':'心里话'}</span><p style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{mode==='quiz'?q.a[Number(room.answers[role])]:room.answers[role]}</p></article>)}</div><button disabled={busy} className="primary-button" onClick={()=>send('next')}>开启下一轮 <ArrowRight/></button></>:mine?<p aria-live="polite">你的答案已存好，等{partner==='him'?'他':'她'}提交后，就会一起揭晓。刷新页面也不会丢失。</p>:mode==='quiz'?<div className="answer-options">{q.a.map((a,i)=><button disabled={busy} key={a} onClick={()=>send('answer',String(i))}>{a}</button>)}</div>:<form onSubmit={e=>{e.preventDefault();send('answer',note);}}><label className="note-label">提交前，对方看不到你的文字<textarea required maxLength={1000} rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="最近，想对你说……"/></label><button className="primary-button" disabled={busy||!note.trim()}>藏好这份心意 <Heart/></button></form>}
 </>}</>}</div><p className="local-note">答案保存在服务器。两个人都提交才揭晓；下一轮由任意一方开启。日记也会同步到同一空间。</p></section>;
}
