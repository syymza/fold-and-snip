'use strict';
const FoldModel=(()=>{
 const identity=()=>[1,0,0,0,1,0,0,0,1];
 const multiply=(a,b)=>Array.from({length:9},(_,i)=>{const r=Math.floor(i/3),c=i%3;return a[r*3]*b[c]+a[r*3+1]*b[3+c]+a[r*3+2]*b[6+c]});
 const apply=(m,p)=>[m[0]*p[0]+m[1]*p[1]+m[2]*(p[2]||0),m[3]*p[0]+m[4]*p[1]+m[5]*(p[2]||0),m[6]*p[0]+m[7]*p[1]+m[8]*(p[2]||0)];
 function hinge(axis,angle){const x=Math.cos(axis),y=Math.sin(axis),c=Math.cos(angle),s=Math.sin(angle),t=1-c;return [c+x*x*t,x*y*t,y*s,x*y*t,c+y*y*t,-x*s,-y*s,x*s,c]}
 function packets(n){const a=Math.PI/n,base=[[],[{axis:a,phase:0}]];
  if(n===12){const half=[...base,...base.map(p=>[{axis:-a,phase:1},...p]),...base.map(p=>[{axis:3*a,phase:2},...p])];return [...half,...half.map(p=>[{axis:7*a,phase:3},...p])];}
  let leaves=base;for(const [phase,axis] of [[1,-a],[2,3*a],[3,-5*a]])leaves=[...leaves,...leaves.map(p=>[{axis,phase},...p])];return leaves;
 }
 function matrix(ops,progress){let m=identity();for(const op of ops){const f=Math.max(0,Math.min(1,progress*4-op.phase));m=multiply(m,hinge(op.axis,Math.PI*f));}return m}
 const scene=(n,progress)=>packets(n).map(ops=>({ops,matrix:matrix(ops,progress)}));
 const phaseText=(n,p)=>{if(p<=0)return 'Folded · ready to cut';if(p>=1)return 'Open · every cut repeated';const i=Math.min(3,Math.floor(p*4));return n===12?['1 / Last half fold','2 / First third opens','3 / Second third opens','4 / First half fold'][i]:['1 / Last half fold','2 / Next half fold','3 / Next half fold','4 / First half fold'][i]};
 function edge(n,side,t,depth=0){const a=Math.PI/n;return [Math.cos(a)*t,side*(Math.sin(a)*t-depth)]}
 function coords(n,side,p){const a=Math.PI/n,t=p[0]/Math.cos(a);return {t,depth:Math.sin(a)*t-side*p[1]}}
 function angular(n,side,points){if(points.length<3||points.length>4)return {ok:false,reason:'Use one or two inner corners.'};const c=points.map(p=>coords(n,side,p)),span=c.at(-1).t-c[0].t,dir=Math.sign(span);
  if(Math.abs(span)<.055||Math.abs(span)>.34)return {ok:false,reason:'Return to the same edge, a little farther along (up to a third of its length).'};
  if(c.some(v=>v.t<.09||v.t>(side===1?Math.cos(2*Math.PI/n):1)-.045))return {ok:false,reason:'Leave a little paper at the tip and outer corner.'};
  if(Math.abs(c[0].depth)>.008||Math.abs(c.at(-1).depth)>.008)return {ok:false,reason:'Finish on the same long edge.'};
  for(let i=1;i<c.length-1;i++)if((c[i].t-c[i-1].t)*dir<.012||(c.at(-1).t-c[i].t)*dir<.012||c[i].depth<.016||c[i].depth>1.45*Math.sin(Math.PI/n)*c[i].t)return {ok:false,reason:'Keep the corners moving along the edge, leaving the opposite fold intact.'};
  return {ok:true};
 }
 return {identity,multiply,apply,hinge,packets,matrix,scene,phaseText,edge,coords,angular};
})();
if(typeof module!=='undefined')module.exports=FoldModel;
