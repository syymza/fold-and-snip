'use strict';
const Geometry = (() => {
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 function clip(subject,boundary){
  let out=subject;
  for(let i=0;i<boundary.length;i++){
   const a=boundary[i],b=boundary[(i+1)%boundary.length],input=out;out=[];
   for(let j=0;j<input.length;j++){
    const p=input[j],q=input[(j+1)%input.length],cp=cross(a,b,p),cq=cross(a,b,q);
    if(cp>=-1e-10)out.push(p);
    if((cp>=0)!==(cq>=0)){const t=cp/(cp-cq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
   }
  }return out;
 }
 const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-a[1]*b[0]},0)/2);
 const wedge=n=>{const a=Math.PI/n;return [[0,0],[Math.cos(a),-Math.sin(a)],[Math.cos(2*a)*Math.cos(a),Math.cos(2*a)*Math.sin(a)]]};
 // Circular paper is a sampled sector inside the same physical fold.
 function outline(n,kind='polygon'){
  if(kind==='circle'){const a=Math.PI/n;return [[0,0],...Array.from({length:65},(_,i)=>{const angle=-a+2*a*i/64;return [.84*Math.cos(angle),.84*Math.sin(angle)]})]}
  return wedge(n);
 }
 const transform=(p,k,n)=>{const a=-Math.PI/2+Math.PI/n+k*2*Math.PI/n,y=p[1]*(k%2?-1:1);return [p[0]*Math.cos(a)-y*Math.sin(a),p[0]*Math.sin(a)+y*Math.cos(a)]};
 const inside=(p,poly)=>poly.every((a,i)=>cross(a,poly[(i+1)%poly.length],p)>=-1e-8);
 return {clip,area,wedge,outline,transform,inside};
})();
if(typeof module!=='undefined')module.exports=Geometry;
