const fs=require('fs'),vm=require('vm');
const ctx=vm.createContext({console,window:{CSS:{supports:()=>true}},CSS:{supports:()=>true},Input:{left:false,right:false,jumpHeld:false,pressed:false,takeJumpPress(){let p=this.pressed;this.pressed=false;return p;}},SFX:{play(){}}});
for(const f of ['student/tuning.js','student/entities.js','student/levels.js','student/theme.js','engine/spec.js','engine/world.js','engine/actors.js','engine/validate.js']) vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..',f),'utf8'),ctx);
vm.runInContext(`globalThis.api={TUNING,LEVELS,World,Actors,Validate,Input,TUNING_SPEC,PICKUP_TYPES};`,ctx);
const {TUNING,LEVELS,World,Actors,Validate,Input,TUNING_SPEC}=ctx.api;
const validation=Validate.run();
console.log('Validation:',JSON.stringify(validation));
if(validation.errors.length||validation.warnings.length)throw Error('Level validation failed');
console.log('Nondefault tuning:',Object.keys(TUNING).filter(k=>TUNING[k]!==TUNING_SPEC[k].def));
for(let i=3;i<8;i++) {const w=World.build(LEVELS[i]);console.log(i+1,LEVELS[i].name,w.w+'x'+w.h,'treasures',w.things.pickups.filter(p=>ctx.api.PICKUP_TYPES[p.name].treasure).length);}
const fx={dust(){}};
function step(p,w,dir,jump,press){Input.left=dir<0;Input.right=dir>0;Input.jumpHeld=jump;Input.pressed=press;return Actors.updatePlayer(p,w,1/60,fx);}
// Terrain checks do not simulate moving enemies, pickup buffs or browser rendering.
// Search actual engine states for a legal route to each waypoint. No teleporting.
function route(index,targets,defaults=false){let w=World.build(LEVELS[index]),p=Actors.makePlayer(w.things.player);let path=[],total=0;TUNING.MAX_AIR_JUMPS=defaults?0:1;
 for(let tick=0;tick<3;tick++)step(p,w,0,false,false);
 for(const [tx,ty] of targets){let beam=[{p,j:false,path:[]}],seen=new Set(),found;
  for(let depth=0;depth<230&&!found;depth++){
   let next=[];
   for(const n of beam){for(const d of [-1,0,1])for(const j of [false,true]){
    let q=structuredClone(n.p),bad=false;
    for(let k=0;k<5;k++){if(step(q,w,d,j,k===0&&j&&!n.j)){bad=true;break;}}
    if(bad)continue;
    let np=n.path.concat([[d,j]]);
    if(Math.abs(q.x-tx)<15&&Math.abs(q.y-ty)<20){found={p:q,j,path:np};break;}
    let key=[Math.round(q.x/5),Math.round(q.y/5),Math.round(q.vx/40),Math.round(q.vy/50),q.airJumps,j,q.onGround].join(',');
    if(seen.has(key))continue;seen.add(key);
    let score=Math.abs(q.x-tx)+Math.abs(q.y-ty)*1.3;
    next.push({p:q,j,path:np,score});
   }if(found)break;}
   next.sort((a,b)=>a.score-b.score);beam=next.slice(0,160);if(!beam.length)break;
  }
  if(!found)throw Error('No route level '+(index+1)+' to '+tx+','+ty+' from '+p.x+','+p.y);
  p=found.p;path.push(...found.path);total+=found.path.length*5;
 }
 let replay=Actors.makePlayer(w.things.player), pickups=w.things.pickups.map(Actors.makePickup), collected=[];
 for(let i=0;i<3;i++)step(replay,w,0,false,false);
 let held=false;
 for(const [d,j] of path){for(let k=0;k<5;k++){step(replay,w,d,j,k===0&&j&&!held);collected.push(...Actors.playerVsPickups(replay,pickups));}held=j;}
 console.log('Collected treasures',index+1,collected.filter(k=>k.type.treasure).length,'/',pickups.filter(k=>k.type.treasure).length);
 if(index===4 && pickups.some(k=>k.type.treasure&&!k.taken))throw Error('Missed treasure');
 console.log('Terrain route PASS',index+1,'frames',total,'at goal',Actors.playerAtGoal(p,w.things.goals.map(Actors.makeGoal)));
 return {p,path};
}
route(3,[[20*24,6*24],[30*24,10*24-22],[34*24,10*24-22],[39*24,10*24-22],[41*24,10*24-22]],true);
route(5,[[18*24,12*24-22],[22*24,6*24-22],[28*24,7*24-22]]);
route(6,[[16*24,11*24-22],[26*24,11*24-22],[44*24,11*24-22]]);
// Default-tuning route visits every treasure location, including the preserved gem pit.
let w=World.build(LEVELS[4]);
route(4,[[10*24,10*24],[18*24,7*24],[20*24,7*24],[22*24,7*24],[23*24,16*24],[25*24,13*24-22],[28*24,12*24-22],[36*24,11*24],[37*24,11*24],[38*24,11*24],[42*24,9*24-22],[45*24,7*24-22]],true);
route(7,[[19*24,14*24-22],[28*24,16*24-22],[38*24,10*24-22],[46*24,16*24-22],[56*24,19*24-22],[60*24,17*24-22],[64*24,15*24-22],[69*24,16*24-22],[79*24,9*24-22],[86*24,14*24-22],[95*24,16*24-22],[101*24,13*24-22],[109*24,10*24-22],[117*24,10*24-22]]);
