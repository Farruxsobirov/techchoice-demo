/* TechChoice site interactions. Runs once per page load; every block checks that its elements exist,
   so the same file serves the home page (video, slider) and inner pages (no video). */
(function(){
  if(window.__tcReady) return; window.__tcReady=true;
  document.documentElement.classList.add('js');
  const root=document.documentElement;
  const hero=document.getElementById('top'), inner=document.getElementById('heroInner');
  const v=document.getElementById('bgVideo');
  const mirrors=[];
  document.querySelectorAll('[data-bg]').forEach(sec=>{
    const w=document.createElement('div');w.className='veil-wrap';w.setAttribute('aria-hidden','true');
    if(sec.dataset.bg==='white'){const c=document.createElement('canvas');c.className='veil-cv';c.width=480;c.height=270;w.appendChild(c);mirrors.push({sec,c,ctx:c.getContext('2d'),on:false})}
    const d=document.createElement('div');d.className='veil '+sec.dataset.bg;w.appendChild(d);sec.prepend(w);
  });
  const cVis=document.getElementById('cVisual');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-driven mask + hero fade
  let ticking=false;
  function update(){
    ticking=false;
    const y=window.scrollY, vh=innerHeight;
    if(!reduce && cVis){ // slow parallax inside the parachute frame
      const r=cVis.getBoundingClientRect(); const k=Math.min(Math.max((vh-r.top)/(vh+r.height),0),1);
      cVis.style.setProperty('--py',((k-.5)*-60).toFixed(1)+'px'); cVis.style.setProperty('--ps',(1.12-k*.08).toFixed(3));
    }
    if(!reduce && hero && inner){
      const h=hero.offsetHeight;
      inner.style.transform=`translate3d(0,${-y*0.25}px,0)`;
      inner.style.opacity=String(Math.max(0,1-y/(h*0.45)));
    }
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update); update();

  // ---------- Title splitter: words (or chars) inside clipping masks ----------
  document.querySelectorAll('.split').forEach(el=>{
    const chars=el.classList.contains('chars'); let i=0;
    const d=el.dataset.delay?el.dataset.delay+'ms':'0ms'; el.style.setProperty('--d',d);
    const label=el.textContent.replace(/\s+/g,' ').trim(); el.setAttribute('aria-label',label);
    const walk=node=>{[...node.childNodes].forEach(n=>{
      if(n.nodeType===3){
        const frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part=>{
          if(!part) return;
          if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(' '));return}
          const w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');
          if(chars){[...part].forEach(c=>{const ch=document.createElement('span');ch.className='ch';ch.textContent=c;ch.style.setProperty('--i',i++);w.appendChild(ch)})}
          else{const wi=document.createElement('span');wi.className='wi';wi.textContent=part;wi.style.setProperty('--i',i++);w.appendChild(wi)}
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if(n.nodeType===1 && n.tagName!=='BR' && !n.hasAttribute('data-nosplit')) walk(n);
    })};
    walk(el);
  });

  // Reveal on enter
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.rv,.c-title,.c-visual,.split:not(.live)').forEach(el=>io.observe(el));
  // hero content shows immediately
  requestAnimationFrame(()=>document.querySelectorAll('.hero .rv,.hero .split,[data-hero] .rv,[data-hero] .split').forEach(el=>el.classList.add('in')));

  // ---------- Background video (home page only) ----------
  // The video file is attached only after the page has loaded, so it never competes with the
  // first paint; until then (or if it can't play) the poster image is shown.
  if(v){
  // Blurred copies of the background for white sections: drawn at ~30 fps, only while visible.
  const mio=new IntersectionObserver(es=>es.forEach(e=>{const m=mirrors.find(x=>x.sec===e.target);if(m)m.on=e.isIntersecting}),{rootMargin:'10% 0px'});
  mirrors.forEach(m=>mio.observe(m.sec));
  function sizeMirrors(){const W=Math.min(960,Math.round(innerWidth*.5)),H=Math.max(60,Math.round(W*innerHeight/innerWidth));mirrors.forEach(m=>{m.c.width=W;m.c.height=H;m.drawn=false})}
  sizeMirrors(); addEventListener('resize',sizeMirrors);
  let poster=null;
  if(v.poster){poster=new Image();poster.decoding='async';poster.src=v.poster}
  let lastDraw=0;
  (function mirrorLoop(now){
    requestAnimationFrame(mirrorLoop);
    if(!mirrors.some(m=>m.on)) return;
    const live=v.readyState>=2 && !v.paused;
    const src=v.readyState>=2?v:(poster&&poster.complete&&poster.naturalWidth?poster:null);
    if(!src) return;
    if(live){ if(now-lastDraw<33) return; lastDraw=now }      // ~30 fps is plenty for a blurred backdrop
    const sw=src.videoWidth||src.naturalWidth, sh=src.videoHeight||src.naturalHeight;
    for(const m of mirrors){ if(!m.on || (!live && m.drawn)) continue;
      const W=m.c.width,H=m.c.height, k=Math.max(W/sw,H/sh), dw=sw*k, dh=sh*k;
      try{m.ctx.drawImage(src,(W-dw)/2,(H-dh)/2,dw,dh);m.drawn=!live}catch(e){}
    }
  })(performance.now());

  // Pause / play
  const btn=document.getElementById('pauseBtn'), ip=document.getElementById('icoPause'), ipl=document.getElementById('icoPlay');
  function sync(){const p=v.paused;ip.hidden=p;ipl.hidden=!p;btn.setAttribute('aria-label',p?'Play background video':'Pause background video')}
  btn.addEventListener('click',()=>{if(v.paused){userPaused=false;v.play().catch(()=>{})}else{userPaused=true;v.pause()}});
  v.addEventListener('play',sync);v.addEventListener('pause',sync);
  let userPaused=false;
  // Don't decode video while the hero and white sections are all off screen (e.g. reading the footer)
  document.addEventListener('visibilitychange',()=>{if(document.hidden)v.pause();else if(!userPaused&&!reduce)v.play().catch(()=>{})});

  function attachVideo(){
    if(!v.dataset.src||v.getAttribute('src')) return;
    v.src=v.dataset.src; v.muted=true;
    if(!reduce){const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{})}
  }
  if(document.readyState==='complete') setTimeout(attachVideo,200);
  else addEventListener('load',()=>setTimeout(attachVideo,200),{once:true});
  sync();
  }

  // ---------- Picture-frame videos (WordPress mp4): play only while visible ----------
  const fvids=[...document.querySelectorAll('video[data-autoplay]')];
  if(fvids.length){
    const vio=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){const p=v.play();if(p&&p.catch)p.catch(()=>{})}else v.pause()}),{threshold:.1});
    fvids.forEach(v=>{
      v.muted=true;vio.observe(v);
      const fig=v.closest('figure'), b=fig&&fig.querySelector('[data-vsound]');
      // Frame takes the video's own shape (no square crop) — except the home slider/contact frames sized by the layout
      v.addEventListener('loadedmetadata',()=>{if(fig&&fig.classList.contains('is-video')&&v.videoWidth&&v.videoHeight&&!fig.classList.contains('c-visual'))fig.style.aspectRatio=v.videoWidth+'/'+v.videoHeight},{once:true});
      if(!b) return;
      const set=on=>{b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');b.setAttribute('aria-label',on?'Turn sound off':'Turn sound on')};
      b.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const on=v.muted;
        if(on) document.dispatchEvent(new CustomEvent('tc-sound',{detail:v}));   // only one video speaks at a time
        v.muted=!on;set(on);
        if(on){const p=v.play();if(p&&p.catch)p.catch(()=>{})}
      });
      document.addEventListener('tc-sound',e=>{if(e.detail!==v&&!v.muted){v.muted=true;set(false)}});
      // No sound track in this file → no Sound button
      const noAudio=()=>{
        if(v.mozHasAudio===false||(v.audioTracks&&v.audioTracks.length===0)||(v.webkitAudioDecodedByteCount===0&&v.currentTime>1.5)){b.hidden=true;return true}
        return v.currentTime>1.5;
      };
      const chk=()=>{if(noAudio())v.removeEventListener('timeupdate',chk)};
      v.addEventListener('timeupdate',chk);
    });
  }

  // ---------- How we work slider (home page only) ----------
  const slider=document.getElementById('slider');
  if(slider){
  const slides=[...slider.querySelectorAll('.slide')], items=[...document.querySelectorAll('.p-copy .item')];
  const bars=[...document.querySelectorAll('#bars button')], count=document.getElementById('count');
  const n=slides.length, DUR=Math.max(2,+slider.dataset.autoplay||6)*1000;
  let cur=0, timer=0, hovering=false, inView=false;
  function render(){
    slides.forEach((s,i)=>{
      let off=((i-cur)%n+n)%n; if(off>n/2) off-=n;         // -1, 0, 1 (wraps around)
      const prev=s._off; s._off=off;
      if(prev!==undefined && Math.abs(prev-off)>1){ s.classList.add('jump'); s.style.setProperty('--pos',off); void s.offsetWidth; s.classList.remove('jump'); }
      else s.style.setProperty('--pos',off);
      s.classList.toggle('active',off===0);
      s.classList.toggle('far',Math.abs(off)>1);
      s.setAttribute('aria-hidden',off===0?'false':'true');
    });
    items.forEach((it,i)=>it.classList.toggle('on',i===cur));
    vids();
    bars.forEach((b,i)=>{b.classList.remove('on');b.classList.toggle('done',i<cur);const ii=b.querySelector('i');ii.style.animation='none';void ii.offsetWidth;ii.style.animation=''});
    bars[cur].classList.add('on');
    count.textContent=String(cur+1).padStart(2,'0')+' — '+String(n).padStart(2,'0');
    schedule();
  }
  function go(i){cur=((i%n)+n)%n;render()}
  // Background videos: only the active slide plays (muted, looped); nothing loads until it's shown.
  // Sound button: shown on video slides; when on, the centre slide's video plays with sound and the slider stops auto-advancing.
  const sb=document.getElementById('slideSound'); let soundOn=false;
  function vids(){
    slides.forEach((s,i)=>{const v=s.querySelector('video');if(!v)return;const act=i===cur&&inView;v.muted=!(act&&soundOn);if(act){const p=v.play();if(p&&p.catch)p.catch(()=>{})}else v.pause()});
    if(sb){const hasV=!!slides[cur].querySelector('video');sb.hidden=!hasV;sb.classList.toggle('on',soundOn&&hasV);sb.setAttribute('aria-pressed',soundOn&&hasV?'true':'false');sb.setAttribute('aria-label',soundOn&&hasV?'Turn sound off':'Turn sound on');slider.classList.toggle('paused',!inView||(soundOn&&hasV))}
  }
  if(sb){
    sb.addEventListener('pointerdown',e=>e.stopPropagation());
    sb.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();soundOn=!soundOn;if(soundOn)document.dispatchEvent(new CustomEvent('tc-sound',{detail:slider}));vids();schedule()});
    document.addEventListener('tc-sound',e=>{if(e.detail!==slider&&soundOn){soundOn=false;vids();schedule()}});
  }
  function schedule(){clearTimeout(timer);if(reduce||!inView||hovering||(soundOn&&slides[cur].querySelector('video')))return;timer=setTimeout(()=>go(cur+1),DUR)}
  document.documentElement.style.setProperty('--dur',DUR/1000+'s');
  document.getElementById('prev').addEventListener('click',e=>{e.stopPropagation();go(cur-1)});
  document.getElementById('next').addEventListener('click',e=>{e.stopPropagation();go(cur+1)});
  // Side slide → bring it to the centre; centre slide → open its page (unless the click ended a swipe).
  let dragged=false;
  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(dragged)return;if(i!==cur)go(i);else if(s.dataset.href)location.href=s.dataset.href}));
  bars.forEach((b,i)=>b.addEventListener('click',()=>go(i)));
  slider.addEventListener('mouseenter',()=>{hovering=true;clearTimeout(timer)});
  slider.addEventListener('mouseleave',()=>{hovering=false;render()});
  // swipe / drag
  let sx=null;
  slider.addEventListener('pointerdown',e=>{sx=e.clientX;dragged=false});
  addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>10)dragged=true;if(Math.abs(dx)>50)go(cur+(dx<0?1:-1))});
  // keyboard when section is focused/in view
  addEventListener('keydown',e=>{if(!inView)return;if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1)});
  // autoplay only while the section is on screen
  new IntersectionObserver(es=>{inView=es[0].isIntersecting;inView?render():(clearTimeout(timer),vids());slider.classList.toggle('paused',!inView)},{threshold:.35}).observe(slider);
  render();

  }

  const toTop=document.getElementById('toTop');
  if(toTop) toTop.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

  // ---------- Smooth scroll (Lenis if it loaded, native otherwise) ----------
  let lenis=null;
  function startLenis(){
    if(lenis||!window.Lenis||reduce) return;
    lenis=new Lenis({lerp:.085,wheelMultiplier:.95,smoothWheel:true});
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
  }
  if(window.Lenis) startLenis();
  else if(!reduce){const ls=document.createElement('script');ls.src='/vendor/lenis.min.js';ls.async=true;ls.onload=startLenis;document.head.appendChild(ls)}
  function scrollToEl(el){
    if(!el) return;
    if(lenis) lenis.scrollTo(el,{duration:1.6,easing:t=>1-Math.pow(1-t,4)});
    else el.scrollIntoView({behavior:reduce?'auto':'smooth'});
  }
  document.querySelectorAll('a[href*="#"]').forEach(a=>a.addEventListener('click',e=>{
    const u=new URL(a.getAttribute('href'),location.href);
    if(u.origin!==location.origin || u.pathname!==location.pathname || !u.hash) return; // another page: normal navigation
    let t=null; try{t=document.querySelector(u.hash)}catch(_){}
    if(!t) return;
    e.preventDefault();
    if(menu.classList.contains('open')){closeMenu();setTimeout(()=>scrollToEl(t),700)}
    else scrollToEl(t);
  }));

  // ---------- Header: hide on scroll down, show on up, colour follows the section under it ----------
  const header=document.getElementById('header');
  const themed=[...document.querySelectorAll('main > section, footer')];
  let lastY=scrollY;
  function headerUpdate(){
    const y=scrollY, hh=header.offsetHeight;
    header.classList.toggle('scrolled',y>40);
    if(!document.documentElement.classList.contains('menu-open')){
      if(y>lastY+4 && y>innerHeight*0.6) header.classList.add('hide');
      else if(y<lastY-4 || y<innerHeight*0.6) header.classList.remove('hide');
    }
    lastY=y;
    const probe=hh/2; let light=false;
    for(const el of themed){const r=el.getBoundingClientRect(); if(r.top<=probe && r.bottom>probe){light=el.dataset.bg==='white'||el.dataset.theme==='light'||el.tagName==='FOOTER';break}}
    header.classList.toggle('light',light);
  }
  addEventListener('scroll',headerUpdate,{passive:true}); headerUpdate();

  // ---------- Fullscreen menu ----------
  const menu=document.getElementById('menu'), burger=document.getElementById('burger');
  let menuT=0;
  function openMenu(byKeyboard){
    const r=burger.getBoundingClientRect();
    menu.style.setProperty('--mx',(r.left+r.width/2)+'px'); menu.style.setProperty('--my',(r.top+r.height/2)+'px');
    clearTimeout(menuT); document.documentElement.classList.add('menu-open','menu-lock'); menu.classList.add('open'); menu.setAttribute('aria-hidden','false');
    burger.setAttribute('aria-expanded','true'); burger.setAttribute('aria-label','Close menu');
    if(lenis) lenis.stop();
    if(byKeyboard) setTimeout(()=>{const f=menu.querySelector('.menu-nav a');f&&f.focus({preventScroll:true})},500);
  }
  function closeMenu(){
    menu.classList.remove('open'); menu.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('menu-lock');
    clearTimeout(menuT); menuT=setTimeout(()=>{document.documentElement.classList.remove('menu-open');headerUpdate()},1250); // header keeps menu colours until the circle has closed
    burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Open menu');
    if(lenis) lenis.start();
  }
  burger.addEventListener('click',e=>menu.classList.contains('open')?closeMenu():openMenu(e.detail===0));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();burger.focus()}});

  // ---------- Process card (inner page): steps light up one after another ----------
  const steps=[...document.querySelectorAll('.pc-step')];
  if(steps.length){
    let si=steps.length-1, stTimer=0;
    const light=i=>steps.forEach((s,k)=>{s.classList.toggle('on',k===i);s.classList.toggle('done',k<i)});
    const tick=()=>{si=(si+1)%steps.length;light(si);stTimer=setTimeout(tick,si===steps.length-1?3200:1600)};
    light(si);
    if(!reduce){
      new IntersectionObserver(es=>{clearTimeout(stTimer);if(es[0].isIntersecting)stTimer=setTimeout(tick,1400)},{threshold:.4}).observe(steps[0].parentElement);
      steps.forEach((s,k)=>s.addEventListener('mouseenter',()=>{clearTimeout(stTimer);si=k;light(k)}));
      steps[0].parentElement.addEventListener('mouseleave',()=>{clearTimeout(stTimer);stTimer=setTimeout(tick,1600)});
    }
  }

  // ---------- Control page: oversight loop lights up step by step ----------
  const cySteps=[...document.querySelectorAll('.cyc-step')], cyArrows=[...document.querySelectorAll('.cyc-arrow')];
  if(cySteps.length){
    let ci=-1, ct=0;
    const show=i=>{cySteps.forEach((s,k)=>s.classList.toggle('on',k===i));cyArrows.forEach((a,k)=>a.classList.toggle('on',k===i))};
    const next=()=>{ci=(ci+1)%cySteps.length;show(ci);ct=setTimeout(next,1900)};
    if(reduce) show(0);
    else{
      new IntersectionObserver(es=>{clearTimeout(ct);if(es[0].isIntersecting)ct=setTimeout(next,ci<0?900:400)},{threshold:.35}).observe(cySteps[0].parentElement);
      cySteps.forEach((s,k)=>s.addEventListener('mouseenter',()=>{clearTimeout(ct);ci=k;show(k)}));
      cySteps[0].parentElement.addEventListener('mouseleave',()=>{clearTimeout(ct);ct=setTimeout(next,1200)});
    }
  }

  // ---------- CONTROL+ panel: Ingest → Audit → Resolve → Optimize runs as a pipeline ----------
  const fSteps=[...document.querySelectorAll('.cx-step')], fLine=document.querySelector('.cx-flow-line');
  if(fSteps.length){
    let fi=-1, ft=0;
    const put=i=>{fSteps.forEach((s,k)=>{s.classList.toggle('on',k===i);s.classList.toggle('done',k<i)});if(fLine)fLine.style.setProperty('--p',((i+1)/fSteps.length).toFixed(3))};
    const tick=()=>{fi=(fi+1)%(fSteps.length+1);put(fi===fSteps.length?-1:fi);ft=setTimeout(tick,fi===fSteps.length?900:1500)};
    if(reduce) put(fSteps.length-1);
    else{
      new IntersectionObserver(es=>{clearTimeout(ft);if(es[0].isIntersecting)ft=setTimeout(tick,1200)},{threshold:.3}).observe(fSteps[0].parentElement);
      fSteps.forEach((s,k)=>s.addEventListener('mouseenter',()=>{clearTimeout(ft);fi=k;put(k)}));
      fSteps[0].parentElement.addEventListener('mouseleave',()=>{clearTimeout(ft);ft=setTimeout(tick,1200)});
    }
  }

  // ---------- Events: countdown to the event start ----------
  document.querySelectorAll('[data-countdown]').forEach(el=>{
    const t=Date.parse(el.dataset.countdown), out=el.querySelector('.ev-count-txt');
    if(!t||!out){el.hidden=true;return}
    const p2=n=>String(n).padStart(2,'0');
    const tick=()=>{
      const ms=t-Date.now();
      if(ms<=0){el.classList.add('live');out.textContent=el.dataset.live||'Happening now';return}
      const d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,m=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60;
      out.textContent=(el.dataset.prefix||'Starts in')+' '+(d?d+'d ':'')+p2(h)+'h '+p2(m)+'m '+p2(s)+'s';
      setTimeout(tick,1000-(Date.now()%1000));
    };
    tick();
  });

  // ---------- Full-screen menu accordion (+ / −): one open at a time ----------
  const mis=[...document.querySelectorAll('.menu-nav .mi')];
  const setMi=(mi,on)=>{const b=mi.querySelector('.mi-tog');if(!b)return;mi.classList.toggle('open',on);b.setAttribute('aria-expanded',on?'true':'false');mi.querySelectorAll('.mi-sub a').forEach(a=>a.tabIndex=on?0:-1)};
  mis.forEach(mi=>{const b=mi.querySelector('.mi-tog');if(b)b.addEventListener('click',()=>{const on=!mi.classList.contains('open');mis.forEach(o=>o!==mi&&setMi(o,false));setMi(mi,on)})});
  if(menu) new MutationObserver(()=>{if(!menu.classList.contains('open'))setTimeout(()=>mis.forEach(o=>setMi(o,false)),900)}).observe(menu,{attributes:true,attributeFilter:['class']});

  // ---------- Header dropdowns: hover on desktop, tap to open on touch screens, Esc / outside click closes ----------
  const subs=[...document.querySelectorAll('.nav .has-sub')];
  if(subs.length){
    const hoverable=matchMedia('(hover:hover)').matches;
    const close=(except)=>subs.forEach(s=>{if(s!==except){s.classList.remove('open');s.querySelector('.link').setAttribute('aria-expanded','false')}});
    subs.forEach(s=>{
      const a=s.querySelector('.link');
      s.addEventListener('mouseenter',()=>a.setAttribute('aria-expanded','true'));
      s.addEventListener('mouseleave',()=>{s.classList.remove('open');a.setAttribute('aria-expanded','false')});
      a.addEventListener('click',e=>{
        if(hoverable||s.classList.contains('open')) return;   // second tap follows the link
        e.preventDefault();close(s);s.classList.add('open');a.setAttribute('aria-expanded','true');
      });
      a.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();s.classList.add('open');const f=s.querySelector('.sub a');if(f)f.focus()}});
    });
    document.addEventListener('click',e=>{if(!e.target.closest('.has-sub'))close()});
    addEventListener('keydown',e=>{if(e.key==='Escape'){const o=subs.find(s=>s.classList.contains('open')||s.contains(document.activeElement));close();if(o)o.querySelector('.link').focus()}});
    addEventListener('scroll',()=>close(),{passive:true});
  }

  // ---------- Design page: drawn icons, card spotlight, count-up, image parallax ----------
  document.querySelectorAll('.dp-ico svg').forEach(s=>s.querySelectorAll('path,circle,rect,line,polyline').forEach(p=>{p.setAttribute('pathLength','1');p.classList.add('dl')}));
  document.querySelectorAll('.dp-card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')}));
  const counters=[...document.querySelectorAll('[data-count]')];
  if(counters.length){
    const fmt=(el,n)=>{const g=el.dataset.grouped?Math.round(n).toLocaleString('en-US'):String(Math.round(n));el.textContent=(el.dataset.pre||'')+g+(el.dataset.suf||'')};
    const run=el=>{const to=+el.dataset.count,fr=+(el.dataset.from||0),t0=performance.now(),D=1800;(function f(t){const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,4);fmt(el,fr+(to-fr)*e);if(k<1)requestAnimationFrame(f)})(t0)};
    if(!reduce){
      counters.forEach(el=>fmt(el,+(el.dataset.from||0)));
      const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run(e.target);cio.unobserve(e.target)}}),{threshold:.5});
      counters.forEach(el=>cio.observe(el));
    }
  }
  const plx=[...document.querySelectorAll('[data-parallax]')];
  if(plx.length && !reduce){
    let pr=0;
    const upd=()=>{pr=0;const vh=innerHeight;plx.forEach(el=>{const box=el.parentElement.getBoundingClientRect();if(box.bottom<0||box.top>vh)return;const c=(box.top+box.height/2-vh/2)/vh;el.style.translate='0 '+(c*-(+el.dataset.parallax||.1)*box.height).toFixed(1)+'px'})};
    addEventListener('scroll',()=>{if(!pr)pr=requestAnimationFrame(upd)},{passive:true});upd();
  }

  // ---------- Buttons: rolling label + swapping arrow + magnetic pull ----------
  document.querySelectorAll('.btn:not([data-ready])').forEach(b=>{
    const svg=b.querySelector('svg'); const txt=[...b.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
    [...b.childNodes].forEach(n=>{if(n.nodeType===3)n.remove()});
    const roll=document.createElement('span');roll.className='roll';roll.innerHTML='<span></span><span aria-hidden="true"></span>';
    roll.children[0].textContent=txt;roll.children[1].textContent=txt;
    b.prepend(roll);
    if(svg){const ico=document.createElement('span');ico.className='ico';svg.replaceWith(ico);ico.appendChild(svg);ico.appendChild(svg.cloneNode(true))}
  });
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fine && !reduce){
    document.querySelectorAll('.btn:not([data-ready]),.burger,.arrow,.pause,.totop').forEach(el=>{
      let raf=0,tx=0,ty=0,cx=0,cy=0;
      const k=el.classList.contains('btn')?0.28:0.4;
      function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;el.style.translate=cx.toFixed(2)+'px '+cy.toFixed(2)+'px';if(Math.abs(tx-cx)+Math.abs(ty-cy)>.1)raf=requestAnimationFrame(loop);else raf=0}
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();tx=(e.clientX-r.left-r.width/2)*k;ty=(e.clientY-r.top-r.height/2)*k;if(!raf)raf=requestAnimationFrame(loop)});
      el.addEventListener('pointerleave',()=>{tx=0;ty=0;if(!raf)raf=requestAnimationFrame(loop)});
    });
  }

  // ---------- Custom cursor ----------
  if(fine && !reduce){
    const cur=document.getElementById('cursor'), ring=cur.querySelector('.ring'), dot=cur.querySelector('.dot'), ctxt=document.getElementById('cursorTxt');
    document.documentElement.classList.add('has-cursor');
    let mx=-100,my=-100,rx=-100,ry=-100;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;cur.classList.add('on');dot.style.transform=`translate3d(${mx}px,${my}px,0)`},{passive:true});
    (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;requestAnimationFrame(loop)})();
    document.addEventListener('pointerleave',()=>cur.classList.remove('on'));
    addEventListener('pointerdown',()=>cur.classList.add('down'));addEventListener('pointerup',()=>cur.classList.remove('down'));
    document.addEventListener('pointerover',e=>{
      const lab=e.target.closest('[data-cursor]'), hov=e.target.closest('a,button,label,.tile');
      if(hov){cur.classList.add('hover');cur.classList.remove('label')}
      else if(lab){ctxt.textContent=lab.dataset.cursor;cur.classList.add('label');cur.classList.remove('hover')}
      else cur.classList.remove('hover','label');
    });
  }
})();
