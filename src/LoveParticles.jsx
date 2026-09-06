import {useEffect,useState,useRef} from 'react';
import {Heart,Sparkle} from '@phosphor-icons/react';
export function LoveParticles({enabled}){
 const [bursts,setBursts]=useState([]);const timers=useRef(new Set());
 useEffect(()=>{if(!enabled){setBursts([]);return;}function burst(e){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const {x,y}=e.detail;const id=Date.now()+Math.random();setBursts(b=>[...b.slice(-2),{id,x,y}]);const t=setTimeout(()=>{setBursts(b=>b.filter(v=>v.id!==id));timers.current.delete(t);},1800);timers.current.add(t);}window.addEventListener('love-burst',burst);return()=>{window.removeEventListener('love-burst',burst);timers.current.forEach(clearTimeout);timers.current.clear();};},[enabled]);
 if(!enabled)return null;
 return <div className="love-particles" aria-hidden="true"><div className="ambient-hearts">{Array.from({length:12},(_,i)=><span className="ambient-heart" key={i} style={{left:`${4+i*8}%`,'--duration':`${16+i%5*3}s`,'--delay':`${-i*2.7}s`,'--drift':`${i%2?30:-30}px`}}>{i%3===0?<Sparkle size={12}/>:<Heart size={10+i%4*3} weight={i%2?'regular':'fill'}/>}</span>)}</div>{bursts.map(b=><div className="heart-burst" key={b.id} style={{left:b.x,top:b.y}}>{Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2;return <span key={i} style={{'--x':`${Math.cos(a)*(65+i%3*24)}px`,'--y':`${Math.sin(a)*(65+i%3*24)-28}px`,'--r':`${i*35}deg`}}><Heart size={12+i%3*5} weight={i%2?'fill':'regular'}/></span>;})}</div>)}</div>
}
export function sendLove(e){const r=e.currentTarget.getBoundingClientRect();window.dispatchEvent(new CustomEvent('love-burst',{detail:{x:r.left+r.width/2,y:r.top+r.height/2}}));}
