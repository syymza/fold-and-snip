'use strict';
const FoldModel=(()=>{
 const identity=()=>[1,0,0,0,1,0,0,0,1];
 const multiply=(a,b)=>Array.from({length:9},(_,i)=>{const r=Math.floor(i/3),c=i%3;return a[r*3]*b[c]+a[r*3+1]*b[3+c]+a[r*3+2]*b[6+c]});
 const apply=(m,p)=>[m[0]*p[0]+m[1]*p[1]+m[2]*(p[2]||0),m[3]*p[0]+m[4]*p[1]+m[5]*(p[2]||0),m[6]*p[0]+m[7]*p[1]+m[8]*(p[2]||0)];
 function hinge(axis,angle){const x=Math.cos(axis),y=Math.sin(axis),c=Math.cos(angle),s=Math.sin(angle),t=1-c;return [c+x*x*t,x*y*t,y*s,x*y*t,c+y*y*t,-x*s,-y*s,x*s,c]}
 function packets(n){const a=Math.PI/n,base=[[],[{axis:a,phase:0}]];
  if(n===12){const half=[...base,...base.map(p=>[{axis:-a,phase:1},...p]),...base.map(p=>[{axis:3*a,phase:2},...p])];return [...half,...half.map(p=>[{axis:7*a,phase:3},...p])];}
  let leaves=base;for(const [phase,axis] of (n===8?[[1,-a],[2,3*a]]:[[1,-a],[2,3*a],[3,-5*a]]))leaves=[...leaves,...leaves.map(p=>[{axis,phase},...p])];return leaves;
 }
 function matrix(ops,progress,stages=4){let m=identity();for(const op of ops){const f=Math.max(0,Math.min(1,progress*stages-op.phase));m=multiply(m,hinge(op.axis,Math.PI*f));}return m}
 const scene=(n,progress)=>packets(n).map(ops=>({ops,matrix:matrix(ops,progress,n===8?3:4)}));
 const phaseText=(n,p)=>{if(p<=0)return 'Folded · ready to cut';if(p>=1)return 'Open · every cut repeated';const stages=n===8?3:4,i=Math.min(stages-1,Math.floor(p*stages));if(n===8)return ['1 / Diagonal fold opens','2 / Next half fold','3 / First half fold'][i];return n===12?['1 / Last half fold','2 / First third opens','3 / Second third opens','4 / First half fold'][i]:['1 / Last half fold','2 / Next half fold','3 / Next half fold','4 / First half fold'][i]};
 function edge(n,side,t,depth=0){const a=Math.PI/n;return [Math.cos(a)*t,side*(Math.sin(a)*t-depth)]}
 function coords(n,side,p){const a=Math.PI/n,t=p[0]/Math.cos(a);return {t,depth:Math.sin(a)*t-side*p[1]}}
 const turn=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 function intersects(a,b,c,d){const t=[turn(a,b,c),turn(a,b,d),turn(c,d,a),turn(c,d,b)];return t[0]*t[1]<=1e-12&&t[2]*t[3]<=1e-12&&Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<=Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]))+1e-8&&Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<=Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]))+1e-8}
 function crossesPath(points,next){for(let i=0;i<points.length-2;i++)if(intersects(points.at(-1),next,points[i],points[i+1]))return true;return false}
 function angular(n,side,points){if(points.length<3||points.length>6)return {ok:false,reason:'Use one to four corners, then finish on the green edge.'};const c=points.map(p=>coords(n,side,p));
  if(Math.abs(c.at(-1).t-c[0].t)<.02)return {ok:false,reason:'Finish a little farther from the starting dot.'};
  if(Math.abs(c[0].depth)>.008||Math.abs(c.at(-1).depth)>.008)return {ok:false,reason:'Finish on the green edge.'};
  const a=Math.PI/n,w=[[0,0],[Math.cos(a),-Math.sin(a)],[Math.cos(2*a)*Math.cos(a),Math.cos(2*a)*Math.sin(a)]];
  for(let i=0;i<points.length;i++)if(w.some((p,j)=>turn(p,w[(j+1)%3],points[i])< -1e-8))return {ok:false,reason:'Keep the corners inside the paper.'};
  for(let i=1;i<points.length-1;i++)if(c[i].depth<.004)return {ok:false,reason:'Place a corner inside the paper, or click the green edge to finish.'};
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){if(j===i+1||(i===0&&j===points.length-1))continue;if(intersects(points[i],points[(i+1)%points.length],points[j],points[(j+1)%points.length]))return {ok:false,reason:'That line crosses the cut. Try another point or go back one point.'}}
  return {ok:true};
 }
 return {identity,multiply,apply,hinge,packets,matrix,scene,phaseText,edge,coords,angular,crossesPath};
})();
if(typeof module!=='undefined')module.exports=FoldModel;
