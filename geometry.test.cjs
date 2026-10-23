const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const G=require('./geometry.js');
const circle=G.outline(12,'circle'),radius=.84;
assert.equal(circle.length,66,'bounded circle resolution');
assert(circle.every(p=>G.inside(p,G.wedge(12))),'circle sector stays inside fold');
assert(circle.slice(1).every(p=>Math.abs(Math.hypot(...p)-radius)<1e-12),'constant circular rim');
assert(Math.abs(G.area(circle)*12-Math.PI*radius**2)<.00003,'circle reconstructs full disc');
for(const n of [8,12]){
 const blank=n===8?G.wedge(n):circle;
 const F=require('./fold-model.js'),cut=[F.edge(n,-1,.445),F.edge(n,-1,.555),F.edge(n,-1,.5,.075)];
 assert(cut.every(p=>G.inside(p,blank)),'same V lies in both blanks');
 const triangles=Array.from({length:n},(_,k)=>cut.map(p=>G.transform(p,k,n)));
 // Adjacent mirror partners share the two edge points and form a diamond.
 const pairs=new Set();
 for(let k=0;k<n;k++){
  const edge=triangles[k].slice(0,2).map(p=>p.map(v=>Math.abs(v)<1e-8?'0':v.toFixed(8)).join(',')).sort().join('|');pairs.add(edge);
 }
 assert.equal(pairs.size,n/2,'identical V repeats as '+n/2+' diamond openings');
 console.log(n/2+' cut repeats: same V, connected mirror pairs');
}
console.log('Circle: constant radius, bounded sector and reconstructed area');
for(const n of [8,12,16]){
 const w=G.wedge(n),area=G.area(w)*n,expected=n/2*Math.sin(4*Math.PI/n)/2;
 assert(Math.abs(area-expected)<1e-12,'regular square/hexagon/octagon area');
 for(let k=0;k<n;k++){
  const a=G.transform(w[k%2?1:2],k,n),b=G.transform(w[k%2?1:2],(k+1)%n,n);
  assert(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-12,'reflection seams meet');
 }
 const cut=[[.5,-.3],[.7,-.3],[.6,0]],clipped=G.clip(cut,w);
 assert(G.area(clipped)>0&&G.area(clipped)<G.area(cut));
 const kept=p=>G.inside(p,w)&&!G.inside(p,cut)&&!G.inside(p,cut.slice().reverse());
 assert(G.area(w)-G.area(clipped)>0);
 console.log(n+' layers: exact regular '+n/2+'-gon area, reflected seams, nonzero clipped cut passed');
}
const sandbox={};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/webb-data.js','utf8')+';this.polys=WEBB_POLYGONS;this.holes=WEBB_HOLES;',sandbox);
const polys=sandbox.polys.map(p=>G.clip(p,G.wedge(12))).filter(p=>p.length>2);
assert.equal(sandbox.polys.length,20);assert.equal(polys.length,12);
for(const poly of polys)for(const p of poly)assert(G.inside(p,G.wedge(12)));
fs.writeFileSync('/tmp/fold-webb-polys.json',JSON.stringify(polys));
fs.writeFileSync('/tmp/fold-webb-holes.json',JSON.stringify(sandbox.holes));
assert.equal(sandbox.holes.length,6);
console.log('Webb: 20 source polygons, 12 retained intersections clipped inside the physical 30° wedge');
