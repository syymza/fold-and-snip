const assert=require('node:assert/strict'),F=require('./fold-model.js'),G=require('./geometry.js');
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
for(const n of [12,16]){
 const wedge=G.wedge(n),a=-Math.PI/2+Math.PI/n,root=p=>[Math.cos(a)*p[0]-Math.sin(a)*p[1],Math.sin(a)*p[0]+Math.cos(a)*p[1]];
 const expected=Array.from({length:n},(_,k)=>wedge.map(p=>G.transform(p,k,n)));
 for(const leaf of F.scene(n,1)){
  const points=wedge.map(p=>root(F.apply(leaf.matrix,p)));
  assert(expected.some(poly=>points.every((p,i)=>distance(p,poly[i])<1e-10)),'fully open panel matches prior geometry');
 }
 for(const progress of [0,.04,.125,.249,.25,.33,.375,.5,.625,.75,.875,1])for(const leaf of F.scene(n,progress)){
  const p=wedge.map(x=>F.apply(leaf.matrix,x));
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)assert(Math.abs(distance(p[i],p[j])-distance([...wedge[i],0],[...wedge[j],0]))<1e-10,'rigid panel lengths');
  for(const op of leaf.ops){const h=[Math.cos(op.axis),Math.sin(op.axis),0];assert(distance(F.apply(F.hinge(op.axis,1.1),h),h)<1e-12,'hinge axis stays fixed')}
 }
 assert(F.scene(n,0).every(l=>distance(l.matrix,F.identity())<1e-12),'fully folded matrices coincide');
 for(const side of [-1,1]){
  const valid=[F.edge(n,side,.35),F.edge(n,side,.42,.04),F.edge(n,side,.5,.06),F.edge(n,side,.6)];assert(F.angular(n,side,valid).ok);
  const crossed=[valid[0],valid[2],valid[1],valid[3]];assert(!F.angular(n,side,crossed).ok);
  for(const t of [.01,.98])assert(!F.angular(n,side,[F.edge(n,side,t),F.edge(n,side,t+.02,.04),F.edge(n,side,t+.1)]).ok);
  assert(!F.angular(n,side,[F.edge(n,side,.4),F.edge(n,side,.45,.5),F.edge(n,side,.6)]).ok,'cannot cross opposite fold');
 }
 console.log(n+' layers: prior endpoint geometry, rigid intermediate panels, fixed hinges, folded endpoint, angular bounds and crossing rejection passed');
}
