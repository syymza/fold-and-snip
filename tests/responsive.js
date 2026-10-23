'use strict';
const frame=document.querySelector('iframe'),result=document.querySelector('#result');
frame.onload=async()=>{
 const checks=[],assert=(condition,name)=>{if(!condition)throw Error(name);checks.push(name)},win=frame.contentWindow,doc=frame.contentDocument,click=selector=>doc.querySelector(selector).click();
 const settle=()=>new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(()=>setTimeout(resolve,40))));
 const layout=name=>{
  const stage=doc.querySelector('#stage').getBoundingClientRect(),buttons=[...doc.querySelectorAll('.topbar button,.toolbar button')].filter(b=>b.getClientRects().length),bounds=buttons.map(b=>b.getBoundingClientRect());
  assert(doc.documentElement.scrollHeight<=win.innerHeight+1&&doc.documentElement.scrollWidth<=win.innerWidth+1,name+': no page scrolling');
  assert(bounds.every(r=>r.left>=0&&r.right<=win.innerWidth+1&&r.top>=0&&r.bottom<=win.innerHeight+1),name+': all controls inside viewport');
  assert(bounds.every(r=>r.width>=44&&r.height>=44),name+': button targets remain at least 44px');
  assert(stage.height>=120&&doc.querySelector('.toolbar').getBoundingClientRect().top>=stage.bottom-1,name+': usable paper and separate toolbar');
  const arrows=[...doc.querySelectorAll('.fold-arrow')].map(e=>e.getBoundingClientRect()),labels=[...doc.querySelectorAll('.preset>span:last-child')].map(e=>e.getBoundingClientRect());
  assert(arrows.every(r=>Math.abs(r.top-arrows[0].top)<.1)&&labels.every(r=>Math.abs(r.bottom-labels[0].bottom)<.1),name+': arrows and label baselines align');
 };
 try{
  for(const [width,height] of [[493,801],[390,664],[320,568],[844,390]]){
   frame.style.width=width+'px';frame.style.height=height+'px';await settle();
   for(const preset of ['snow','rosette','webb']){
    click('[data-preset="'+preset+'"]');await settle();layout(width+'×'+height+' '+preset);
    click('#angularMode');click('#guided');await settle();assert(win.foldSnip.getState().draft?.valid,width+'×'+height+' '+preset+': valid preview');layout(width+'×'+height+' '+preset+' confirmation');
    click('#commitCut');click('#reveal');await new Promise(resolve=>setTimeout(resolve,1100));assert(win.foldSnip.getState().progress===1,width+'×'+height+' '+preset+': reveal completed');layout(width+'×'+height+' '+preset+' revealed');
   }
  }
  click('[data-preset="snow"]');click('#angularMode');click('#guided');const draft=JSON.stringify(win.foldSnip.getState().draft);
  for(const [width,height] of [[390,664],[664,390],[320,568]]){frame.style.width=width+'px';frame.style.height=height+'px';await settle();assert(JSON.stringify(win.foldSnip.getState().draft)===draft,width+'×'+height+': resize preserves draft');layout(width+'×'+height+' resized draft')}
  result.textContent=JSON.stringify({passed:checks.length,checks},null,2);
 }catch(error){result.textContent='FAILED: '+error.message}
};
