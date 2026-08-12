
(() => {
  const body = document.body;
  body.classList.add('page-enter');
  const loader = document.querySelector('.site-loader');
  if (loader) {
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('is-hidden'), 480));
    setTimeout(() => loader.classList.add('is-hidden'), 1400);
  }

  const nav = document.querySelector('.nav');
  const syncNav = () => { if (nav && !nav.classList.contains('light-mode')) nav.classList.toggle('scrolled', scrollY > 30); };
  syncNav(); addEventListener('scroll', syncNav, {passive:true});

  const menuBtn = document.querySelector('.menu-btn');
  const panel = document.querySelector('.mobile-panel');
  const closeMenu = () => { if (!menuBtn || !panel) return; menuBtn.classList.remove('open'); panel.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); body.style.overflow=''; };
  if (menuBtn && panel) {
    menuBtn.addEventListener('click', () => {
      const open = panel.classList.toggle('open'); menuBtn.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); body.style.overflow=open?'hidden':'';
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  const io = new IntersectionObserver((entries) => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in-view'); io.unobserve(e.target);} }), {threshold:.12, rootMargin:'0px 0px -4% 0px'});
  document.querySelectorAll('.reveal,.mask-reveal,.step').forEach(el => io.observe(el));

  // Parallax only on capable desktops
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  if (parallax.length && matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)').matches) {
    let ticking = false;
    const run = () => { parallax.forEach(el => { const r=el.getBoundingClientRect(); const y=(window.innerHeight/2-(r.top+r.height/2))*.035; el.style.transform=`translate3d(0,${y}px,0) scale(1.035)`; }); ticking=false; };
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(run);ticking=true;}},{passive:true}); run();
  }

  // Gallery lightbox
  const items=[...document.querySelectorAll('.gallery-item')];
  const lb=document.querySelector('.lightbox');
  if(items.length && lb){
    const image=lb.querySelector('img'); let idx=0;
    const show=i=>{idx=(i+items.length)%items.length; image.src=items[idx].dataset.full || items[idx].querySelector('img').src; lb.classList.add('open'); body.style.overflow='hidden';};
    const close=()=>{lb.classList.remove('open'); body.style.overflow='';};
    items.forEach((el,i)=>el.addEventListener('click',()=>show(i)));
    lb.querySelector('.lightbox-close').addEventListener('click',close); lb.querySelector('.lightbox-prev').addEventListener('click',()=>show(idx-1)); lb.querySelector('.lightbox-next').addEventListener('click',()=>show(idx+1));
    lb.addEventListener('click',e=>{if(e.target===lb)close();});
    addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')show(idx-1); if(e.key==='ArrowRight')show(idx+1);});
  }

  // Contact form: opens the visitor's default mail app with a prepared message.
  const form=document.querySelector('[data-mail-form]');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault(); const fd=new FormData(form);
      const subject='Upit za metalnu nadstrešnicu – '+(fd.get('lokacija')||'web stranica');
      const bodyText=`Ime i prezime: ${fd.get('ime')||''}\nTelefon: ${fd.get('telefon')||''}\nE-mail: ${fd.get('email')||''}\nLokacija objekta: ${fd.get('lokacija')||''}\nOkvirne dimenzije: ${fd.get('dimenzije')||''}\n\nPoruka:\n${fd.get('poruka')||''}`;
      location.href=`mailto:info.melman@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      const status=form.querySelector('.form-status'); if(status){status.textContent='Otvara se Vaša e-mail aplikacija s pripremljenim upitom.';status.classList.add('show');}
    });
  }
  // Privacy / cookie notice. No analytics or marketing cookies are loaded on this site.
  const privacyKey = 'melman_privacy_ack';
  const showPrivacyNotice = () => {
    try { if (localStorage.getItem(privacyKey)) return; } catch (_) {}
    const notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('role','dialog');
    notice.setAttribute('aria-live','polite');
    notice.setAttribute('aria-label','Privatnost i kolačići');
    notice.innerHTML = `
      <div class="cookie-notice__eyebrow">Privatnost i kolačići</div>
      <h2>Koristimo samo nužnu pohranu.</h2>
      <p>Ova stranica trenutačno ne koristi analitičke ni marketinške kolačiće. Lokalna pohrana služi samo za pamćenje ove obavijesti.</p>
      <div class="cookie-notice__actions">
        <button class="btn btn-dark" type="button" data-cookie-ack>U redu</button>
        <a class="cookie-notice__link" href="/kolacici/">Politika kolačića</a>
      </div>`;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add('show'));
    notice.querySelector('[data-cookie-ack]').addEventListener('click', () => {
      try { localStorage.setItem(privacyKey, 'acknowledged'); } catch (_) {}
      notice.classList.remove('show');
      setTimeout(() => notice.remove(), 380);
    });
  };
  showPrivacyNotice();

})();
