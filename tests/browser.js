window.foldQA=(async()=>{
 const checks=[],assert=(v,name)=>{if(!v)throw new Error(name);checks.push(name)},click=s=>document.querySelector(s).click(),state=()=>foldSnip.getState(),paper=document.querySelector('#paper');
 // Synthetic test pointers do not own native pointer capture.
 paper.setPointerCapture=()=>{};
 const event=(type,p,id=51)=>{const r=paper.getBoundingClientRect(),q=foldSnip.toScreen(p);paper.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:id,button:0,pointerType:'mouse',clientX:r.left+q[0],clientY:r.top+q[1]}))};
 const tap=p=>{event('pointerdown',p);event('pointerup',p)},wait=()=>new Promise(r=>setTimeout(r,1100));
 assert(!document.querySelector('#foldRange'),'Manual unfold slider removed');
 for(const preset of ['snow','rosette','webb']){
  click('[data-preset="'+preset+'"]');click('#angularMode');let n=state().n,E=(t,d=0)=>FoldModel.edge(n,-1,t,d);
  if(preset!=='webb'){
   for(const p of [E(.5),E(.54,.07),E(.43,.085)])tap(p);
   assert(state().draft.points.length===3,preset+': reversing direction accepts both real-shape corners');
   const count=state().draft.points.length;tap([-.2,.5]);assert(state().draft.points.length===count&&document.querySelector('#canvasMessage').classList.contains('error'),preset+': outside click visibly rejected without losing points');
   window.dispatchEvent(new Event('blur'));assert(state().draft.points.length===count,preset+': placed points survive focus interruption');
   event('pointerdown',E(.3));event('pointercancel',E(.3));assert(state().draft.points.length===count,preset+': canceled input keeps placed corners');
   tap(E(.3));assert(state().draft.valid,preset+': direction-changing shape reaches connected scrap preview');
  }else{click('#guided');assert(state().draft?.valid,'webb: guided angular scrap remains valid')}
  const saved=JSON.stringify(state().draft.points);tap([.6,0]);assert(JSON.stringify(state().draft.points)===saved,preset+': preview clicks never restart or discard drawing');
  assert(document.querySelector('#reveal').disabled,preset+': pending cut cannot be lost to reveal');
  click('#backPoint');assert(!state().draft.poly,preset+': Back removes only finish point');
  if(preset!=='webb')tap(E(.3));else{click('#cancelCut');click('#guided')}
  const preview=foldSnip.previewMask();assert(!!preview,preset+': preview mask present');click('#commitCut');const result=foldSnip.materialMask();assert(preview.every((v,i)=>v===result[i]),preset+': preview matches committed paper mask exactly');
  assert(state().cuts.length===1,preset+': commit adds exactly one cut');
  click('#reveal');await wait();assert(state().progress===1&&!state().animating,preset+': one-button reveal reaches fully open');
  click('#reveal');await wait();assert(state().progress===0&&!state().animating,preset+': one-button fold returns fully folded');
  click('#quickMode');click('#guided');assert(state().cuts.length===2,preset+': quick snip still works after angular cut');
  click('#undo');assert(state().cuts.length===1,preset+': undo restores only latest cut');click('#reset');assert(state().cuts.length===0&&!state().draft,preset+': reset clears cut and drawing');
  click('#angularMode');paper.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert(state().draft?.poly,preset+': keyboard angular alternative previews');window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(!state().draft,preset+': Escape cancels preview');
 }
 click('[data-preset="snow"]');click('#angularMode');tap(FoldModel.edge(12,-1,.5));tap(FoldModel.edge(12,-1,.6,.08));tap(FoldModel.edge(12,-1,.4,.09));const len=state().draft.points.length;paper.dispatchEvent(new KeyboardEvent('keydown',{key:'Backspace',bubbles:true}));assert(state().draft.points.length===len-1,'Keyboard Backspace removes one corner');
 click('[data-preset="webb"]');assert(!state().draft&&state().cuts.length===0,'Switching preset clears old points');
 click('#quickMode');click('#guided');click('#reveal');await new Promise(r=>setTimeout(r,60));click('#reset');await wait();assert(state().progress===0&&state().cuts.length===0&&!state().animating,'Reset during animation leaves no stale reveal callback');
 return {passed:checks.length,checks};
})()
