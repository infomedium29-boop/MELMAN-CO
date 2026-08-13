
document.documentElement.classList.add('js');
(() => {
  const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const header=qs('[data-header]');
  const onScroll=()=>header?.classList.toggle('is-scrolled',scrollY>36);
  onScroll(); addEventListener('scroll',onScroll,{passive:true});

  const menu=qs('.menu-toggle'), nav=qs('#site-nav');
  const closeMenu=()=>{if(!menu||!nav)return; menu.setAttribute('aria-expanded','false'); nav.classList.remove('is-open'); document.body.style.overflow='';};
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);document.body.style.overflow=!open?'hidden':'';});
  qsa('#site-nav a').forEach(a=>a.addEventListener('click',closeMenu));

  qsa('.nav-dropdown-toggle').forEach(btn=>btn.addEventListener('click',e=>{const wrap=btn.closest('.nav-dropdown');const open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!open));wrap.classList.toggle('is-open',!open);}));
  document.addEventListener('click',e=>{qsa('.nav-dropdown.is-open').forEach(w=>{if(!w.contains(e.target)){w.classList.remove('is-open');qs('.nav-dropdown-toggle',w)?.setAttribute('aria-expanded','false')}})});

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals=qsa('.reveal');
  if(!reduced && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -5%'});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('is-visible'));

  qsa('[data-counter]').forEach(el=>{
    const target=Number(el.dataset.counter), suffix=el.dataset.suffix||'';
    if(reduced){el.textContent=target+suffix;return;}
    let started=false;
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&!started){started=true;const start=performance.now(),dur=800;const tick=t=>{const p=Math.min(1,(t-start)/dur),v=Math.round(target*(1-Math.pow(1-p,3)));el.textContent=v+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);io.disconnect()}}),{threshold:.5});io.observe(el);
  });

  // RAL preview
  qsa('.ral-block').forEach(block=>{qsa('[data-ral]',block).forEach(btn=>btn.addEventListener('click',()=>{const preview=block.closest('.section')?.querySelector('[data-ral-preview]') || qs('[data-ral-preview]'); if(preview)preview.style.setProperty('--ral-preview',btn.dataset.ral);qsa('[data-ral]',block).forEach(b=>b.classList.toggle('is-active',b===btn));}))});

  // Gallery filters and dialog
  const galleryItems=qsa('[data-gallery-item]'), filterBtns=qsa('[data-filter]');
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>{const f=btn.dataset.filter;filterBtns.forEach(b=>b.classList.toggle('is-active',b===btn));galleryItems.forEach(item=>item.hidden=!(f==='all'||item.dataset.category===f));}));
  const dialog=qs('[data-lightbox]'), lbImg=qs('[data-lightbox-img]'), lbCap=qs('[data-lightbox-caption]'); let current=-1,lastFocus=null;
  const visibleItems=()=>galleryItems.filter(i=>!i.hidden);
  const showItem=(item)=>{if(!dialog||!item)return;current=visibleItems().indexOf(item);lbImg.src=item.dataset.full;lbImg.srcset=item.dataset.srcset||'';lbImg.alt=item.dataset.alt||'';lbCap.textContent=item.dataset.caption||'';};
  galleryItems.forEach(item=>item.addEventListener('click',()=>{lastFocus=item;showItem(item);dialog.showModal();qs('.lightbox-close')?.focus();}));
  const stepLb=d=>{const arr=visibleItems();if(!arr.length)return;current=(current+d+arr.length)%arr.length;showItem(arr[current]);};
  qs('.lightbox-prev')?.addEventListener('click',()=>stepLb(-1));qs('.lightbox-next')?.addEventListener('click',()=>stepLb(1));qs('.lightbox-close')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog?.addEventListener('close',()=>lastFocus?.focus());
  dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')stepLb(-1);if(e.key==='ArrowRight')stepLb(1)});

  // Sticky process
  const processSteps=qsa('[data-process-step]'), processNum=qs('[data-process-number]');
  if(processSteps.length&&'IntersectionObserver'in window){const pio=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio).slice(0,1).forEach(e=>{processSteps.forEach(s=>s.classList.remove('is-current'));e.target.classList.add('is-current');if(processNum)processNum.textContent=e.target.querySelector('.process-number')?.textContent||'01';});},{threshold:[.3,.5,.7],rootMargin:'-20% 0px -45%'});processSteps.forEach(s=>pio.observe(s));}

  // Multi-step Web3Forms
  qsa('[data-quote-form]').forEach(form=>{
    const steps=qsa('[data-form-step]',form), progress=qsa('[data-progress]',form), status=qs('[data-form-status]',form), submit=qs('[data-submit]',form);let idx=0;
    const show=i=>{idx=Math.max(0,Math.min(steps.length-1,i));steps.forEach((s,n)=>s.classList.toggle('is-active',n===idx));progress.forEach((p,n)=>p.classList.toggle('is-active',n<=idx));steps[idx].querySelector('h2')?.focus?.({preventScroll:true});};
    const validateStep=()=>{const step=steps[idx], err=qs('[data-step-error]',step);if(err)err.textContent='';const required=qsa('[required]',step);for(const field of required){if(field.type==='radio'){const group=qsa(`input[name="${CSS.escape(field.name)}"]`,step);if(!group.some(r=>r.checked)){if(err)err.textContent='Odaberite tip nadstrešnice prije nastavka.';group[0]?.focus();return false;}}else if(field.type==='checkbox'&&!field.checked){if(err)err.textContent='Za slanje upita potrebno je prihvatiti obradu podataka.';field.focus();return false;}else if(!field.value.trim()||!field.checkValidity()){if(err)err.textContent=field.type==='email'?'Upišite ispravnu e-mail adresu.':'Ispunite označeno obvezno polje.';field.focus();return false;}}return true;};
    qsa('[data-next]',form).forEach(b=>b.addEventListener('click',()=>{if(validateStep())show(idx+1)}));qsa('[data-back]',form).forEach(b=>b.addEventListener('click',()=>show(idx-1)));
    qs('[data-file-input]',form)?.addEventListener('change',e=>{const f=e.target.files?.[0];const err=qs('[data-step-error]',steps[1]);if(f&&f.size>5*1024*1024){e.target.value='';if(err)err.textContent='Fotografija je veća od 5 MB. Smanjite datoteku i pokušajte ponovno.';}});
    form.addEventListener('submit',async e=>{e.preventDefault();if(!validateStep())return;if(status){status.className='form-status';status.textContent='Šaljem upit…';}submit.disabled=true;submit.textContent='Šaljem…';try{const res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:new FormData(form)});const data=await res.json();if(res.ok&&data.success){status.className='form-status success';status.textContent='Upit poslan. Javit ćemo vam se na navedeni kontakt.';form.reset();progress.forEach((p,n)=>p.classList.toggle('is-active',n===0));}else throw new Error(data.message||'Slanje nije uspjelo');}catch(err){status.className='form-status error';status.textContent='Upit trenutno nije moguće poslati. Provjerite vezu ili nas nazovite na +385 99 721 9548.';}finally{submit.disabled=false;submit.textContent='Pošalji upit';}});
  });
})();
