/* TechChoice home page interactions. Runs once after the page has hydrated. */
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
    const h=hero.offsetHeight, y=window.scrollY;
    const vh=innerHeight;
    if(!reduce){ // slow parallax inside the parachute frame
      const r=cVis.getBoundingClientRect(); const k=Math.min(Math.max((vh-r.top)/(vh+r.height),0),1);
      cVis.style.setProperty('--py',((k-.5)*-60).toFixed(1)+'px'); cVis.style.setProperty('--ps',(1.12-k*.08).toFixed(3));
    }
    if(!reduce){
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
      } else if(n.nodeType===1 && n.tagName!=='BR') walk(n);
    })};
    walk(el);
  });

  // Reveal on enter
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
  document.querySelectorAll('.rv,.c-title,.c-visual,.split:not(.live)').forEach(el=>io.observe(el));
  // hero content shows immediately
  requestAnimationFrame(()=>document.querySelectorAll('.hero .rv,.hero .split').forEach(el=>el.classList.add('in')));

  // ---------- Canvas fallback: same dotted waves, drawn live ----------
  const cv=document.getElementById('bgCanvas'), ctx=cv.getContext('2d');
  const glowC=document.createElement('canvas'), gctx=glowC.getContext('2d');
  let useCanvas=false, canvasPaused=false, raf=0, t0=performance.now(), tPaused=0;
  const ribbons=[
    {nu:200,nv:110,u0:-1.2,u1:1.6,ph:0,c1:[205,60,255],c2:[70,110,255],tw:.9,ys:.05,xs:.62,yc:.48,br:.9},
    {nu:180,nv:76,u0:-.6,u1:1.8,ph:1.7,c1:[120,70,255],c2:[60,170,255],tw:-.7,ys:-.35,xs:.70,yc:.40,br:.6},
    {nu:170,nv:66,u0:-.4,u1:1.8,ph:3.1,c1:[170,60,255],c2:[90,120,255],tw:.5,ys:.55,xs:.66,yc:.52,br:.55}];
  let img=null, buf=null;
  function size(){
    const k=Math.min(1,1280/innerWidth);
    cv.width=glowC.width=Math.max(2,Math.round(innerWidth*k));
    cv.height=glowC.height=Math.max(2,Math.round(innerHeight*k));
    img=gctx.createImageData(cv.width,cv.height); buf=img.data;
  }
  function draw(now){
    raf=requestAnimationFrame(draw);
    if(canvasPaused) return;
    const W=cv.width,H=cv.height, th=((now-t0)/12000)*Math.PI*2;
    const S=Math.max(W,H*16/9), ox=(W-S)/2, h=S*9/16, oy=(H-h)/2;
    buf.fill(0);
    for(const r of ribbons){
      for(let i=0;i<r.nu;i++){
        const u=r.u0+(r.u1-r.u0)*i/(r.nu-1), t=i/(r.nu-1);
        const cr=r.c1[0]*(1-t)+r.c2[0]*t, cg=r.c1[1]*(1-t)+r.c2[1]*t, cb=r.c1[2]*(1-t)+r.c2[2]*t;
        const ub=.3+.7*Math.min(Math.max(u+1,0),1);
        for(let j=0;j<r.nv;j++){
          const v=j/(r.nv-1);
          const s1=Math.sin(3*u+2.2*v+th+r.ph);
          const y=.22*s1+.14*Math.sin(5*v-1.5*u+2*th+r.ph)+.08*Math.cos(7*u+3*v-th+r.ph)+r.tw*(v-.5)*(u-.2);
          const X=u*.9+.35*v, Z=1.6+v*2.2;
          const sx=(ox+X/Z*1.25*S*.5+S*r.xs)|0, sy=(oy-(y-r.ys)/Z*1.25*S*.5+h*r.yc)|0;
          if(sx<0||sx>=W||sy<0||sy>=H) continue;
          const hl=s1>0?Math.pow(s1,6)*.5:0, b=(1.15-v)*r.br*ub*1.25;
          const k=(sy*W+sx)*4;
          buf[k]+=((cr*(1-hl)+170*hl)*b); buf[k+1]+=((cg*(1-hl)+200*hl)*b); buf[k+2]+=((cb*(1-hl)+255*hl)*b); buf[k+3]=255;
        }
      }
    }
    gctx.putImageData(img,0,0);
    ctx.globalCompositeOperation='source-over';ctx.filter='none';ctx.globalAlpha=1;
    ctx.fillStyle='#050508';ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';ctx.drawImage(glowC,0,0);
    ctx.filter=`blur(${Math.max(2,Math.round(5*W/1280))}px)`;ctx.drawImage(glowC,0,0);ctx.drawImage(glowC,0,0);
    ctx.filter='none';ctx.globalCompositeOperation='source-over';
  }
  function startCanvas(){
    if(useCanvas) return; useCanvas=true;
    v.hidden=true; cv.hidden=false; size(); addEventListener('resize',size);
    if(reduce){canvasPaused=false;draw(performance.now());cancelAnimationFrame(raf);canvasPaused=true}
    else raf=requestAnimationFrame(draw);
    sync();
  }
  function stopCanvas(){useCanvas=false;cancelAnimationFrame(raf);cv.hidden=true;v.hidden=false}

  // ---------- Blurred copies of the background for white sections ----------
  const mio=new IntersectionObserver(es=>es.forEach(e=>{const m=mirrors.find(x=>x.sec===e.target);if(m)m.on=e.isIntersecting}),{rootMargin:'10% 0px'});
  mirrors.forEach(m=>mio.observe(m.sec));
  function sizeMirrors(){const W=Math.min(1280,Math.round(innerWidth*.75)),H=Math.max(60,Math.round(W*innerHeight/innerWidth));mirrors.forEach(m=>{m.c.width=W;m.c.height=H})}
  sizeMirrors(); addEventListener('resize',sizeMirrors);
  (function mirrorLoop(){
    requestAnimationFrame(mirrorLoop);
    const src=useCanvas?cv:v; const sw=useCanvas?cv.width:v.videoWidth, sh=useCanvas?cv.height:v.videoHeight;
    if(!sw||!sh) return;
    for(const m of mirrors){ if(!m.on) continue;
      const W=m.c.width,H=m.c.height, k=Math.max(W/sw,H/sh), dw=sw*k, dh=sh*k;
      try{m.ctx.drawImage(src,(W-dw)/2,(H-dh)/2,dw,dh)}catch(e){}
    }
  })();

  // ---------- Pause / play (works for video and canvas) ----------
  const btn=document.getElementById('pauseBtn'), ip=document.getElementById('icoPause'), ipl=document.getElementById('icoPlay');
  const isPaused=()=>useCanvas?canvasPaused:v.paused;
  function sync(){const p=isPaused();ip.hidden=p;ipl.hidden=!p;btn.setAttribute('aria-label',p?'Play background video':'Pause background video')}
  btn.addEventListener('click',()=>{
    if(useCanvas){canvasPaused=!canvasPaused;if(canvasPaused)tPaused=performance.now();else t0+=performance.now()-tPaused;sync();return}
    v.paused?v.play():v.pause()});
  v.addEventListener('play',sync);v.addEventListener('pause',sync);

  // Try the video; if it can't play within 2.5s, switch to the canvas version
  v.muted=true;
  if(!reduce){const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{})}
  v.addEventListener('error',startCanvas,true);
  setTimeout(()=>{if(!reduce && (v.readyState<2||v.paused||v.currentTime===0)) startCanvas()},2500);
  sync();



  // ---------- How we work slider ----------
  const slider=document.getElementById('slider');
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
    bars.forEach((b,i)=>{b.classList.remove('on');b.classList.toggle('done',i<cur);const ii=b.querySelector('i');ii.style.animation='none';void ii.offsetWidth;ii.style.animation=''});
    bars[cur].classList.add('on');
    count.textContent=String(cur+1).padStart(2,'0')+' — '+String(n).padStart(2,'0');
    schedule();
  }
  function go(i){cur=((i%n)+n)%n;render()}
  function schedule(){clearTimeout(timer);if(reduce||!inView||hovering)return;timer=setTimeout(()=>go(cur+1),DUR)}
  document.documentElement.style.setProperty('--dur',DUR/1000+'s');
  document.getElementById('prev').addEventListener('click',e=>{e.stopPropagation();go(cur-1)});
  document.getElementById('next').addEventListener('click',e=>{e.stopPropagation();go(cur+1)});
  slides.forEach((s,i)=>s.addEventListener('click',()=>{if(i!==cur)go(i)}));
  bars.forEach((b,i)=>b.addEventListener('click',()=>go(i)));
  slider.addEventListener('mouseenter',()=>{hovering=true;clearTimeout(timer)});
  slider.addEventListener('mouseleave',()=>{hovering=false;render()});
  // swipe / drag
  let sx=null;
  slider.addEventListener('pointerdown',e=>{sx=e.clientX});
  addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>50)go(cur+(dx<0?1:-1))});
  // keyboard when section is focused/in view
  addEventListener('keydown',e=>{if(!inView)return;if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1)});
  // autoplay only while the section is on screen
  new IntersectionObserver(es=>{inView=es[0].isIntersecting;inView?render():clearTimeout(timer);slider.classList.toggle('paused',!inView)},{threshold:.35}).observe(slider);
  render();

  document.getElementById('toTop').addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));

  // ---------- Smooth scroll (Lenis if it loaded, native otherwise) ----------
  let lenis=null;
  if(window.Lenis && !reduce){
    lenis=new Lenis({lerp:.085,wheelMultiplier:.95,smoothWheel:true});
    (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
  }
  function scrollToEl(el){
    if(!el) return;
    if(lenis) lenis.scrollTo(el,{duration:1.6,easing:t=>1-Math.pow(1-t,4)});
    else el.scrollIntoView({behavior:reduce?'auto':'smooth'});
  }
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href')); if(!t) return;
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
    for(const el of themed){const r=el.getBoundingClientRect(); if(r.top<=probe && r.bottom>probe){light=el.dataset.bg==='white'||el.tagName==='FOOTER';break}}
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

  // ---------- Buttons: rolling label + swapping arrow + magnetic pull ----------
  document.querySelectorAll('.btn').forEach(b=>{
    const svg=b.querySelector('svg'); const txt=[...b.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
    [...b.childNodes].forEach(n=>{if(n.nodeType===3)n.remove()});
    const roll=document.createElement('span');roll.className='roll';roll.innerHTML='<span></span><span aria-hidden="true"></span>';
    roll.children[0].textContent=txt;roll.children[1].textContent=txt;
    b.prepend(roll);
    if(svg){const ico=document.createElement('span');ico.className='ico';svg.replaceWith(ico);ico.appendChild(svg);ico.appendChild(svg.cloneNode(true))}
  });
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(fine && !reduce){
    document.querySelectorAll('.btn,.burger,.arrow,.pause,.totop').forEach(el=>{
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
