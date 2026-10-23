const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const G=require('./geometry.js');
for(const n of [12,16]){
 const w=G.wedge(n),area=G.area(w)*n,expected=n/2*Math.sin(4*Math.PI/n)/2;
 assert(Math.abs(area-expected)<1e-12,'regular hexagon/octagon area');
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
