import {Heart,BookOpen} from '@phosphor-icons/react';

export function PagesNotice(){return <>
 <section id="together" className="couple-section">
  <div className="section-heading"><div><div className="eyebrow">ALWAYS TOGETHER / 异地互动</div><h2>隔着距离，也想靠近你。</h2><p>先收藏我们的回忆，双人房间等待下一次更新。</p></div><Heart size={32} weight="duotone"/></div>
  <div className="play-panel"><h3>这份心意，先留在这里。</h3><p>当前是 GitHub 公开纪念页。默契问答、交换心里话和双人同步暂未开放。</p><a className="primary-button" href="#letter">读一封写给你的信 <Heart/></a></div>
 </section>
 <section id="diary" className="journal-section">
  <div className="section-heading"><div><div className="eyebrow">DEAR DIARY / 恋爱日记</div><h2>把今天，留给以后的我们。</h2><p>日记写入与两人共享，将在连接同步服务后开放。</p></div><BookOpen size={32} weight="duotone"/></div>
  <div className="diary-empty"><h3>我们的下一页，慢慢续写。</h3><p>这里不会上传或保存你的日记，也不会展示已有的私人记录。</p></div>
 </section>
 </>;}
