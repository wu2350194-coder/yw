import {useState,useEffect} from 'react';
import {Heart,LockKey,SignOut} from '@phosphor-icons/react';
export function LoginGate({children}) {
 if(import.meta.env.VITE_GITHUB_PAGES==='true') return <><div className="account-bar"><Heart weight="fill"/><span>我们的公开纪念页</span><a href="#memories">翻开回忆</a><a href="#diary">关于日记同步</a></div>{children}</>;
 return <ServerLoginGate>{children}</ServerLoginGate>;
}
function ServerLoginGate({children}){const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[role,setRole]=useState('him'),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
useEffect(()=>{fetch('/api/auth/me').then(r=>r.json()).then(d=>setUser(d.user)).catch(()=>setError('登录服务暂时不可用，请稍后刷新。')).finally(()=>setLoading(false));},[]);
async function login(e){e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role,password})});const d=await r.json();if(!r.ok)throw Error(d.error);setUser(d.user);setPassword('');location.hash='together';}catch(e){setError(e.message||'登录未成功');}finally{setBusy(false);}}
async function logout(){try{const r=await fetch('/api/auth/logout',{method:'POST'});if(!r.ok)throw Error();setUser(null);setPassword('');}catch{setError('退出未成功，请重试。');}}
if(loading)return <div className="login-page">正在打开我们的日常……</div>;
if(user)return <><div className="account-bar"><img src={'/photos/avatar-'+user.role+'.jpg'} alt=""/><span>{user.name}，欢迎回来</span><a href="#together">去互动</a><button onClick={logout}><SignOut/> 退出</button>{error&&<span role="alert">{error}</span>}</div>{children}</>;
return <main className="login-page"><section className="login-card"><Heart size={32} weight="fill"/><div className="eyebrow">OUR EVERYDAY JOURNAL</div><h1>欢迎回到<br/>我们的日常。</h1><p>这里，收藏着只属于我们的故事。</p><div className="login-roles" role="group" aria-label="选择登录身份">{[['him','男方'],['her','女方']].map(([id,label])=><button key={id} aria-pressed={role===id} onClick={()=>{setRole(id);setPassword('');setError('');}}><img src={'/photos/avatar-'+id+'.jpg'} alt=""/>{label}</button>)}</div><form onSubmit={login}><label>我们的专属密码<input autoComplete="current-password" type="password" required maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} placeholder="输入密码，打开小世界"/></label><p className="login-error" role="alert">{error}</p><button className="primary-button" disabled={busy}><LockKey/>{busy?'正在打开……':'登录，开始互动'}</button></form><small>选择你的身份，一起续写日常。</small></section></main>;
}
