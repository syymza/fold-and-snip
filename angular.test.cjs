const assert=require('node:assert/strict'),F=require('./fold-model.js');
for(const n of [12,16])for(const side of [-1,1]){
 const E=(t,d=0)=>F.edge(n,side,t,d);
 assert(F.angular(n,side,[E(.35),E(.52,.06),E(.42,.09),E(.25)]).ok,'direction-changing shape is allowed');
 assert(F.angular(n,side,[E(.2),E(.3,.04),E(.45,.03),E(.55,.08),E(.65,.05),E(.8)]).ok,'four corners allowed');
 assert(!F.angular(n,side,[E(.3),E(.55,.08),E(.35,.08),E(.6,.02),E(.7)]).ok,'crossed paths rejected');
 assert(!F.angular(n,side,[E(.3),E(.45,.5),E(.6)]).ok,'outside paper rejected');
 assert(!F.angular(n,side,[E(.3),E(.45,.05),E(.31)]).ok,'degenerate return rejected');
}
console.log('Angular paths: direction changes, four corners, crossing, paper bounds and degenerate return pass for both folds and edges.');
