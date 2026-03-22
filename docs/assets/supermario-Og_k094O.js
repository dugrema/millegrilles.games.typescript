const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/levelManager-ChVatFqO.js","assets/chunk-EPOLDU6W-BRx3iYW4.js","assets/styled-components.browser.esm-I7oew-DQ.js"])))=>i.map(i=>d[i]);
import{R as Se,a as x,p as r,w as rt}from"./chunk-EPOLDU6W-BRx3iYW4.js";import{a as d,l as nt,r as st}from"./styled-components.browser.esm-I7oew-DQ.js";const at="modulepreload",lt=function(e){return"/"+e},Ce={},U=function(o,n,a){let c=Promise.resolve();if(n&&n.length>0){let R=function(E){return Promise.all(E.map(S=>Promise.resolve(S).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const w=document.querySelector("meta[property=csp-nonce]"),p=w?.nonce||w?.getAttribute("nonce");c=R(n.map(E=>{if(E=lt(E),E in Ce)return;Ce[E]=!0;const S=E.endsWith(".css"),h=S?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${E}"]${h}`))return;const l=document.createElement("link");if(l.rel=S?"stylesheet":at,S||(l.as="script"),l.crossOrigin="",l.href=E,p&&l.setAttribute("nonce",p),document.head.appendChild(l),S)return new Promise((A,T)=>{l.addEventListener("load",A),l.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${E}`)))})}))}function m(w){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=w,window.dispatchEvent(p),!p.defaultPrevented)throw w}return c.then(w=>{for(const p of w||[])p.status==="rejected"&&m(p.reason);return o().catch(m)})},re=800,O=600,be=.5,ke=-10,Pe=5,Oe=9,ct=.8,oe=15,xe=32,F=40,ut="#FF0000",V=80,dt=50,pe=10,De=250,ht=30,pt=20,xt="#FF0000",Ye=30,Ne=20,mt="#6B8E23",ft="#6B8E23",yt=20,gt="#DEB887",vt="#73BF2E",bt=40,wt=40,Rt="#CD853F",Et="#FFD700",_e="#D3D3D3",Tt=32,Lt=32,At=2,Ie=7e3,St="#FF0000",Ct="#F5DEB3",we="#FFFFFF",Pt="#00FF00",Ot="#FFFFFF",Ee=56,Be=32,Te=32,Ue="#8B4513",_t=2,Ve=20,He=20,Ge="#FFD700",N={SKY_TOP:"#5c94fc",SKY_BOTTOM:"#87ceeb",MARIO_RED:"#FF0000",MARIO_OVERALL:"#4169E1",GROUND_BROWN:"#8B4513",GROUND_GRASS:"#73BF2E",PIPE_GREEN:"#4CAF50",PIPE_DARK_GREEN:"#2E7D32"},Xe=Se.createContext(null),It={MUSHROOM_BURST:{count:12,spread:120,speed:3,lifetime:45,colors:["#FFD700","#FFA500","#FFF8DC"],size:6},TRANSFORM_BURST:{count:20,spread:150,speed:4,lifetime:60,colors:["#FF69B4","#FF1493","#FF4500","#FFD700"],size:8},BRICK_BREAK:{count:8,spread:60,speed:2,lifetime:50,colors:["#CD853F","#A0522D","#8B4513"],size:10},MUSHROOM_COLLECT:{count:6,spread:80,speed:2.5,lifetime:30,colors:["#FFFFFF","#FFD700","#FF69B4"],size:5},COIN_SPARKLE:{count:4,spread:40,speed:1.5,lifetime:25,colors:["#FFD700","#FFFACD"],size:4},LIFE_UPGRADE:{count:8,spread:100,speed:3,lifetime:40,colors:["#00FF00","#FFFF00","#FFD700"],size:6}};function We(){const e=Se.useContext(Xe);if(!e)throw new Error("useParticleSystem must be used within ParticleSystemProvider");return e}function Gt({children:e}){const[o,n]=x.useState({particles:[],nextId:1});x.useEffect(()=>{if(o.particles.length===0)return;const c=setInterval(()=>{n(m=>{const w=m.particles.map(p=>({...p,x:p.x+p.velocityX,y:p.y+p.velocityY,velocityY:p.velocityY+.15,lifetime:p.lifetime-1})).filter(p=>p.lifetime>0);return{...m,particles:w}})},1e3/60);return()=>clearInterval(c)},[o.particles.length]);const a=(c,m,w,p)=>{const R=It[c],E=p??R.count,S=[];for(let h=0;h<E;h++){const l=Math.PI*2*h/E;R.spread/2;const A=R.speed;S.push({id:o.nextId+h,x:m,y:w,velocityX:Math.cos(l)*A+(Math.random()-.5)*2,velocityY:Math.sin(l)*A-Math.abs(Math.sin(l)*A*.5)+(Math.random()-.5)*2,lifetime:R.lifetime,color:R.colors[Math.floor(Math.random()*R.colors.length)],size:R.size,type:c})}n(h=>({...h,particles:[...h.particles,...S],nextId:h.nextId+E}))};return r.jsx(Xe.Provider,{value:{particles:o.particles,spawnParticles:a},children:e})}const Mt=(e,o,n)=>{const a=e[o];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((c,m)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(m.bind(null,new Error("Unknown variable dynamic import: "+o+(o.split("/").length!==n?". Note that variables only represent file names one level deep.":""))))})},le=new Map;async function Le(e){if(le.has(e))return le.get(e);try{const n=(await Mt(Object.assign({"./levels/1-1.json":()=>U(()=>import("./1-1-B2mfD33Z.js"),[]),"./levels/1-2.json":()=>U(()=>import("./1-2-YVlXWZuI.js"),[]),"./levels/1-3.json":()=>U(()=>import("./1-3-DCUeduXE.js"),[]),"./levels/1-4.json":()=>U(()=>import("./1-4-DjPsxEEs.js"),[])}),`./levels/${e}.json`,3)).default,a=Ke(n);return le.set(e,a),a}catch(o){console.warn(`Failed to load level "${e}":`,o),console.warn("Falling back to default level configuration");const n=qe();return le.set(e,n),n}}function Ke(e){const o=["id","name","width","height","groundHeight","skyColor","marioStart","flagpole","pipes","enemies","coins"];for(const n of o)if(!(n in e))throw new Error(`Missing required field: ${n}`);if(typeof e.id!="string")throw new Error("Level id must be a string");if(typeof e.name!="string")throw new Error("Level name must be a string");if(typeof e.width!="number"||e.width<=0)throw new Error("Level width must be a positive number");if(typeof e.height!="number"||e.height<=0)throw new Error("Level height must be a positive number");if(typeof e.groundHeight!="number"||e.groundHeight<=0)throw new Error("Ground height must be a positive number");if(!e.skyColor||typeof e.skyColor.top!="string"||typeof e.skyColor.bottom!="string")throw new Error("Invalid skyColor structure");if(!e.marioStart||typeof e.marioStart.x!="number"||typeof e.marioStart.y!="number")throw new Error("Invalid marioStart structure");if(!e.flagpole||typeof e.flagpole.x!="number"||typeof e.flagpole.height!="number")throw new Error("Invalid flagpole structure");if(!Array.isArray(e.pipes))throw new Error("Pipes must be an array");if(!Array.isArray(e.enemies))throw new Error("Enemies must be an array");if(!Array.isArray(e.coins))throw new Error("Coins must be an array");if(e.platforms&&!Array.isArray(e.platforms))throw new Error("Platforms must be an array");if(e.blocks&&!Array.isArray(e.blocks))throw new Error("Blocks must be an array");return e.platforms&&e.platforms.forEach((n,a)=>{if(typeof n.x!="number")throw new Error(`Platform ${a}: x must be a number`);if(typeof n.y!="number")throw new Error(`Platform ${a}: y must be a number`);if(typeof n.width!="number"||n.width<=0)throw new Error(`Platform ${a}: width must be a positive number`);if(typeof n.height!="number"||n.height<=0)throw new Error(`Platform ${a}: height must be a positive number`)}),e.blocks&&e.blocks.forEach((n,a)=>{if(typeof n.x!="number")throw new Error(`Block ${a}: x must be a number`);if(typeof n.y!="number")throw new Error(`Block ${a}: y must be a number`);if(!n.type||typeof n.type!="string")throw new Error(`Block ${a}: type must be a string`);if(n.contents&&typeof n.contents!="string")throw new Error(`Block ${a}: contents must be a string`)}),e}function qe(){return{id:"default",name:"Default Level",width:3e3,height:600,groundHeight:80,skyColor:{top:"#5c94fc",bottom:"#87ceeb"},marioStart:{x:100,y:480},flagpole:{x:2900,height:250},pipes:[{x:450,height:80},{x:650,height:100},{x:900,height:60},{x:1200,height:120},{x:1500,height:80},{x:1800,height:100},{x:2200,height:80},{x:2500,height:100}],enemies:[{x:600,walkRange:150,type:"GOOMBA"},{x:1100,walkRange:150,type:"GOOMBA"},{x:1600,walkRange:150,type:"GOOMBA"},{x:2100,walkRange:150,type:"GOOMBA"}],coins:[{x:300,y:400},{x:500,y:420},{x:900,y:400},{x:1300,y:420},{x:1700,y:400},{x:2e3,y:420},{x:2300,y:400},{x:2600,y:420}]}}const jt=Object.freeze(Object.defineProperty({__proto__:null,getDefaultLevel:qe,loadLevel:Le,validateLevelConfig:Ke},Symbol.toStringTag,{value:"Module"}));function Ae(e){const o=Ft(e),n=$t(e),a=kt(e),c=Dt(e),m=Yt(e),w=Nt(e),p=Bt(e),R=Vt(e),E=Ut(e);return{pipes:o,enemies:n,coins:a,platforms:c,blocks:m,grounds:w,mushrooms:[],oneUpMushrooms:E,flagpole:p,marioStart:R,levelWidth:e.width}}function Ft(e){return e.pipes.map((o,n)=>{const a=O-e.groundHeight-o.height,c=O-e.groundHeight-a;return{id:`pipe-${e.id}-${n}`,x:o.x,y:a,width:dt,height:c}})}function $t(e){return e.enemies.map((o,n)=>({id:`enemy-${e.id}-${n}`,x:o.x,y:O-e.groundHeight-Te,width:Be,height:Te,velocityX:_t,velocityY:0,walkStart:o.x,walkRange:o.walkRange,color:Ue,alive:!0}))}function kt(e){return e.coins.map((o,n)=>({id:`coin-${e.id}-${n}`,x:o.x,y:o.y,width:Ve,height:He,collected:!1}))}function Dt(e){return e.platforms?e.platforms.map((o,n)=>({id:`platform-${e.id}-${n}`,x:o.x,y:o.y,width:o.width,height:o.height||yt,type:o.type||"BRICK"})):[]}function Yt(e){return e.blocks?e.blocks.map((o,n)=>({id:`block-${e.id}-${n}`,x:o.x,y:o.y,width:bt,height:wt,type:o.type,contents:o.contents||null,used:!1})):[]}function Nt(e){return!e.ground||e.ground.length===0?[{id:`ground-${e.id}-0`,x:0,y:O-e.groundHeight,width:e.width,height:e.groundHeight}]:e.ground.map((o,n)=>({id:`ground-${e.id}-${n}`,x:o.x,y:O-e.groundHeight,width:o.width,height:e.groundHeight}))}function Bt(e){const o=O-e.groundHeight-e.flagpole.height;return{x:e.flagpole.x,y:o,width:pe,height:De}}function Ut(e){return!e.oneUpMushrooms||e.oneUpMushrooms.length===0?[]:e.oneUpMushrooms.map((o,n)=>({id:`1up-${e.id}-${n}`,x:o.x,y:o.y,width:32,height:32,velocityX:2,velocityY:0,active:!0,spawnTime:0,type:"1UP"}))}function Vt(e){return{x:e.marioStart.x,y:e.marioStart.y,width:xe,height:F,velocityX:0,velocityY:0,isGrounded:!1,isJumping:!1,facingRight:!0,color:ut}}const Ht=Object.freeze(Object.defineProperty({__proto__:null,renderLevel:Ae},Symbol.toStringTag,{value:"Module"}));function Xt(){return typeof window>"u"||!window.localStorage?0:parseInt(window.localStorage.getItem("superMarioHighScore")||"0",10)}const B={mario:{x:100,y:O-V-F,width:xe,height:F,velocityX:0,velocityY:0,isGrounded:!0,isJumping:!1,facingRight:!0,color:"#FF0000",isBig:!1,invulnerable:0},pipes:[],platforms:[],blocks:[],grounds:[],enemies:[],coins:[],mushrooms:[],flagpole:null,currentLevelId:"1-1",levelConfig:null,score:{coins:0,score:0,highScore:Xt(),lives:3,currentTime:400},camera:{x:0,scrollSpeed:5},status:{state:"IDLE",currentWorld:1,currentLevel:1}};function Wt(e,o){switch(o.type){case"START":return{...e,status:"PLAYING"};case"MOVE_LEFT":return{...e,mario:{...e.mario,facingRight:!1}};case"MOVE_RIGHT":return{...e,mario:{...e.mario,facingRight:!0}};case"STOP":return{...e,mario:{...e.mario,velocityX:0}};case"JUMP":return e.status!=="PLAYING"||!e.mario.isGrounded?e:{...e,mario:{...e.mario,velocityY:ke,isGrounded:!1,isJumping:!0}};case"GAME_START":if(o.payload){const C=[...o.payload.mushrooms||[],...o.payload.oneUpMushrooms||[]];return{...B,mario:{...B.mario,...o.payload.marioStart,velocityX:0,velocityY:0},pipes:o.payload.pipes||[],platforms:o.payload.platforms||[],blocks:o.payload.blocks||[],grounds:o.payload.grounds||[],enemies:o.payload.enemies||[],coins:o.payload.coins||[],mushrooms:C,flagpole:o.payload.flagpole||null,currentLevelId:o.payload.currentLevelId||"1-1",levelConfig:o.payload.levelConfig||null,status:{state:"PLAYING",currentWorld:o.payload.levelConfig?.world??1,currentLevel:o.payload.levelConfig?.level??1}}}return{...B,status:{state:"PLAYING",currentWorld:1,currentLevel:1},score:{...B.score,currentTime:o.payload?.levelConfig?.timeLimit||400},mushrooms:o.payload.oneUpMushrooms||[]};case"PAUSE":return{...e,status:{...e.status,state:"PAUSED"}};case"RESUME":return{...e,status:{...e.status,state:"PLAYING"}};case"GAME_OVER":const n={...e.score,score:e.score.score};return e.score.score>e.score.highScore&&(n.highScore=e.score.score,typeof window<"u"&&window.localStorage&&window.localStorage.setItem("superMarioHighScore",e.score.score.toString())),{...e,score:n,status:{...e.status,state:"GAME_OVER",gameOverReason:o.payload||""}};case"GAME_WIN":const a={...e.score,score:e.score.score+(o.payload||0)};return a.score>a.highScore&&(a.highScore=a.score,typeof window<"u"&&window.localStorage&&window.localStorage.setItem("superMarioHighScore",a.score.toString())),{...e,score:a,status:{...e.status,state:"WIN",gameOverReason:o.payload||"You reached the flag! You win!"}};case"ADD_SCORE":return{...e,score:{...e.score,score:e.score.score+(o.payload||100)}};case"ADD_COIN":const c=e.score.coins+1,m=e.score.score+50,w=e.score.coins,p=100,R=w>0&&w<p&&c>=p&&Math.floor(c/p)>Math.floor(w/p);return{...e,score:{...e.score,coins:c,score:m,lives:R?e.score.lives+1:e.score.lives}};case"UPDATE_LOCAL_STATE":return{...e,mario:o.payload?.mario||e.mario,pipes:o.payload?.pipes||e.pipes,platforms:o.payload?.platforms||e.platforms,blocks:o.payload?.blocks||e.blocks,grounds:o.payload?.grounds||e.grounds,enemies:o.payload?.enemies||e.enemies,coins:o.payload?.coins||e.coins,mushrooms:o.payload?.mushrooms||e.mushrooms,camera:o.payload?.camera||e.camera};case"RESET":return{...B,mario:{...B.mario,x:100,y:O-V-F},status:{state:"IDLE",currentWorld:1,currentLevel:1},mushrooms:[]};case"ACTIVATE_BLOCK":const E=e.blocks.map(C=>C.x===o.payload.x&&C.y===o.payload.y?{...C,used:!0}:C);return{...e,blocks:E};case"SPAWN_MUSHROOM":return e;case"COLLECT_MUSHROOM":return e;case"TRANSFORM_MARIO":return{...e,mario:{...e.mario,height:56,isBig:!0,invulnerable:60},score:{...e.score,score:e.score.score+200}};case"SHRINK_MARIO":return{...e,mario:{...e.mario,height:40,isBig:!1,invulnerable:90}};case"BREAK_BRICK":const S=e.blocks.filter(C=>!(C.x===o.payload.x&&C.y===o.payload.y));return{...e,blocks:S,score:{...e.score,score:e.score.score+100}};case"UPDATE_TIME":const h=e.score.currentTime-(o.payload||1/60);return{...e,score:{...e.score,currentTime:h}};case"LOSE_LIFE":const l=e.score.lives-1;if(l<=0){const C={...e.score,score:e.score.score};return e.score.score>e.score.highScore&&(C.highScore=e.score.score,typeof window<"u"&&window.localStorage&&window.localStorage.setItem("superMarioHighScore",e.score.score.toString())),{...e,score:C,status:{...e.status,state:"GAME_OVER",gameOverReason:"No lives left!"}}}const A=e.levelConfig?.marioStart?.x||100,T=e.levelConfig?.marioStart?.y||O-V-F;return{...e,score:{...e.score,lives:l},status:{...e.status,state:"RESPAWNING"},mario:{...e.mario,x:A,y:T,velocityX:0,velocityY:0,isGrounded:!0,isBig:!1,height:F,invulnerable:120}};case"GIVE_EXTRA_LIFE":return{...e,score:{...e.score,lives:e.score.lives+1,score:e.score.score+1e3}};case"RESPAWN_MARIO":const v=e.levelConfig?.marioStart?.x||100,M=e.levelConfig?.marioStart?.y||O-V-F;return{...e,mario:{...e.mario,x:v,y:M,velocityX:0,velocityY:0,isGrounded:!0,isBig:!1,height:F,invulnerable:120}};case"RESPAWN_DELAY":const I=e.levelConfig?.marioStart?.x||100,H=e.levelConfig?.marioStart?.y||O-V-F;return{...e,mario:{...e.mario,x:I,y:H,velocityX:0,velocityY:0,isGrounded:!0,isBig:!1,height:F,invulnerable:120},camera:{x:0,scrollSpeed:5}};case"RESPAWN_COMPLETE":return{...e,status:{...e.status,state:"PLAYING"}};case"LEVEL_COMPLETE":return{...e,status:{...e.status,state:"TRANSITIONING"}};case"NEXT_LEVEL":if(o.payload){const C=[...o.payload.mushrooms||[],...o.payload.oneUpMushrooms||[]];return{...B,mario:{...B.mario,...o.payload.marioStart,velocityX:0,velocityY:0},pipes:o.payload.pipes||[],platforms:o.payload.platforms||[],blocks:o.payload.blocks||[],grounds:o.payload.grounds||[],enemies:o.payload.enemies||[],coins:o.payload.coins||[],mushrooms:C,flagpole:o.payload.flagpole||null,currentLevelId:o.payload.currentLevelId||"1-1",levelConfig:o.payload.levelConfig||null,score:{...e.score},status:{state:"PLAYING",currentWorld:o.payload.levelConfig?.world??1,currentLevel:o.payload.levelConfig?.level??1}}}return e;case"GAME_COMPLETE":const k={...e.score,score:e.score.score+(o.payload?.bonusScore||0)};return k.score>k.highScore&&(k.highScore=k.score,typeof window<"u"&&window.localStorage&&window.localStorage.setItem("superMarioHighScore",k.score.toString())),{...e,score:k,status:{...e.status,state:"WIN",gameOverReason:"Congratulations! You completed all levels!"}};default:return e}}const ze=x.createContext(void 0);function Kt({children:e}){const[o,n]=x.useReducer(Wt,B),[a,c]=x.useState({isVisible:!1,levelInfo:{world:1,level:1}}),m=()=>n({type:"LOSE_LIFE"}),w=P=>n({type:"UPDATE_TIME",payload:P}),p=async P=>{const G=await Le(P||"1-1"),b=Ae(G);n({type:"GAME_START",payload:{pipes:b.pipes,platforms:b.platforms,blocks:b.blocks,grounds:b.grounds,enemies:b.enemies,coins:b.coins,mushrooms:b.mushrooms||[],oneUpMushrooms:b.oneUpMushrooms||[],flagpole:b.flagpole,marioStart:b.marioStart,currentLevelId:P||"1-1",levelConfig:G}})},R=async P=>{const G=await Le(P),b=Ae(G);n({type:"GAME_START",payload:{pipes:b.pipes,platforms:b.platforms,blocks:b.blocks,grounds:b.grounds,enemies:b.enemies,coins:b.coins,mushrooms:b.mushrooms||[],oneUpMushrooms:b.oneUpMushrooms||[],flagpole:b.flagpole,marioStart:b.marioStart,currentLevelId:P,levelConfig:G}})},E=()=>{o.status.state==="PLAYING"?n({type:"PAUSE"}):o.status.state==="PAUSED"&&n({type:"RESUME"})},S=()=>n({type:"RESUME"}),h=()=>n({type:"JUMP"}),l=()=>n({type:"MOVE_LEFT"}),A=()=>n({type:"MOVE_RIGHT"}),T=()=>n({type:"STOP"}),v=P=>n({type:"GAME_OVER",payload:P}),M=async()=>{const{getNextLevelId:P,isFinalLevel:G}=await U(async()=>{const{getNextLevelId:X,isFinalLevel:_}=await import("./levelManager-ChVatFqO.js");return{getNextLevelId:X,isFinalLevel:_}},__vite__mapDeps([0,1,2])),b=await P(o.currentLevelId);return!await G(o.currentLevelId)&&!!b},I=async()=>{if(!await M()){c({isVisible:!0,levelInfo:{world:o.status.currentWorld||1,level:o.status.currentLevel||1}}),n({type:"GAME_COMPLETE"}),setTimeout(()=>{c($=>({...$,isVisible:!1}))},3e3);return}const G=await U(()=>import("./levelManager-ChVatFqO.js"),__vite__mapDeps([0,1,2])).then($=>$.getNextLevelId(o.currentLevelId));if(!G)return;const{loadLevel:b}=await U(async()=>{const{loadLevel:$}=await Promise.resolve().then(()=>jt);return{loadLevel:$}},void 0),{renderLevel:q}=await U(async()=>{const{renderLevel:$}=await Promise.resolve().then(()=>Ht);return{renderLevel:$}},void 0),X=await b(G),_=q(X),{getLevelInfo:ne}=await U(async()=>{const{getLevelInfo:$}=await import("./levelManager-ChVatFqO.js");return{getLevelInfo:$}},__vite__mapDeps([0,1,2])),z=await ne(G),ie=z?.world||1,fe=z?.level||1;c({isVisible:!0,levelInfo:{world:o.status.currentWorld||1,level:o.status.currentLevel||1,nextWorld:ie,nextLevel:fe}}),setTimeout(()=>{n({type:"NEXT_LEVEL",payload:{pipes:_.pipes,platforms:_.platforms,blocks:_.blocks,grounds:_.grounds,enemies:_.enemies,coins:_.coins,mushrooms:_.mushrooms||[],oneUpMushrooms:_.oneUpMushrooms||[],flagpole:_.flagpole,marioStart:_.marioStart,currentLevelId:G,levelConfig:X}})},500),setTimeout(()=>{c($=>({...$,isVisible:!1}))},3e3)},H=(P,G)=>n({type:"GAME_WIN",payload:P}),k=()=>n({type:"RESET"}),C=()=>({...a});return r.jsx(ze.Provider,{value:{state:o,dispatch:n,startGame:p,pauseGame:E,resumeGame:S,jump:h,moveLeft:l,moveRight:A,stop:T,handleGameOver:v,handleGameWin:H,handleLevelComplete:I,checkNextLevel:M,resetGame:k,switchLevel:R,loseLife:m,updateTime:w,getTransitionState:C},children:r.jsx(Gt,{children:e})})}function me(){const e=x.useContext(ze);if(e===void 0)throw new Error("useGameContext must be used within a GameProvider");return e}class qt{audioContext=null;masterGain=null;volume=.3;enabled=!1;async enableAudio(){this.enabled||(this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.masterGain=this.audioContext.createGain(),this.masterGain.gain.value=this.volume,this.masterGain.connect(this.audioContext.destination),this.enabled=!0)}setVolume(o){this.volume=Math.max(0,Math.min(1,o)),this.masterGain&&(this.masterGain.gain.value=this.volume)}getVolume(){return this.volume}toggleAudio(){return this.enabled?(this.enabled=!1,this.masterGain&&(this.masterGain.gain.value=0),!1):(this.enableAudio(),!0)}playJump(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="square",o.frequency.value=180,o.frequency.exponentialRampToValueAtTime(220,this.audioContext.currentTime+.1),o.frequency.exponentialRampToValueAtTime(150,this.audioContext.currentTime+.2),n.gain.value=0,n.gain.linearRampToValueAtTime(.15,this.audioContext.currentTime+.02),n.gain.linearRampToValueAtTime(0,this.audioContext.currentTime+.2),o.start(),o.stop(this.audioContext.currentTime+.2)}playCoin(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="square",o.frequency.setValueAtTime(1e3,this.audioContext.currentTime),o.frequency.linearRampToValueAtTime(1200,this.audioContext.currentTime+.05),o.frequency.linearRampToValueAtTime(1800,this.audioContext.currentTime+.1),n.gain.value=0,n.gain.linearRampToValueAtTime(.1,this.audioContext.currentTime+.02),n.gain.linearRampToValueAtTime(0,this.audioContext.currentTime+.15),o.start(),o.stop(this.audioContext.currentTime+.15)}playPowerUp(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.currentTime;for(let n=0;n<4;n++){const a=this.audioContext.createOscillator(),c=this.audioContext.createGain();a.connect(c),c.connect(this.masterGain),a.type="triangle",a.frequency.value=440+n*220,c.gain.setValueAtTime(0,o+n*.08),c.gain.linearRampToValueAtTime(.15,o+n*.08+.02),c.gain.linearRampToValueAtTime(0,o+n*.08+.1),a.start(o+n*.08),a.stop(o+n*.08+.1)}}playShrink(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="sawtooth",o.frequency.value=600,o.frequency.linearRampToValueAtTime(500,this.audioContext.currentTime+.1),o.frequency.linearRampToValueAtTime(400,this.audioContext.currentTime+.2),o.frequency.linearRampToValueAtTime(300,this.audioContext.currentTime+.3),n.gain.value=0,n.gain.linearRampToValueAtTime(.2,this.audioContext.currentTime+.02),n.gain.linearRampToValueAtTime(0,this.audioContext.currentTime+.4),o.start(),o.stop(this.audioContext.currentTime+.4)}playBrickBreak(){if(!this.audioContext||!this.masterGain)return;const o=3;for(let n=0;n<o;n++){const a=this.audioContext.createOscillator(),c=this.audioContext.createGain();a.connect(c),c.connect(this.masterGain),a.type="square",a.frequency.value=200+n*80+Math.random()*40,c.gain.value=0,c.gain.linearRampToValueAtTime(.1,this.audioContext.currentTime+.01),c.gain.exponentialRampToValueAtTime(.01,this.audioContext.currentTime+.15),a.start(),a.stop(this.audioContext.currentTime+.15)}}playMushroomSpawn(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="triangle";const a=this.audioContext.currentTime;o.frequency.setValueAtTime(440,a),o.frequency.linearRampToValueAtTime(520,a+.05),o.frequency.linearRampToValueAtTime(440,a+.1),o.frequency.linearRampToValueAtTime(520,a+.15),o.frequency.linearRampToValueAtTime(600,a+.2),n.gain.value=0,n.gain.linearRampToValueAtTime(.15,a+.02),n.gain.linearRampToValueAtTime(0,a+.25),o.start(),o.stop(a+.25)}playStomp(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="sawtooth",o.frequency.value=300,o.frequency.linearRampToValueAtTime(200,this.audioContext.currentTime+.08),n.gain.value=0,n.gain.linearRampToValueAtTime(.2,this.audioContext.currentTime+.01),n.gain.exponentialRampToValueAtTime(.01,this.audioContext.currentTime+.1),o.start(),o.stop(this.audioContext.currentTime+.1)}playVictory(){if(!this.audioContext||!this.masterGain)return;const o=[{freq:523.25,duration:.15},{freq:659.25,duration:.15},{freq:783.99,duration:.15},{freq:1046.5,duration:.3},{freq:783.99,duration:.15},{freq:659.25,duration:.15},{freq:523.25,duration:.4}];let n=this.audioContext.currentTime;o.forEach(a=>{if(!this.audioContext||!this.masterGain)return;const c=this.audioContext.createOscillator(),m=this.audioContext.createGain();c.connect(m),m.connect(this.masterGain),c.type="square",c.frequency.value=a.freq,m.gain.setValueAtTime(0,n),m.gain.linearRampToValueAtTime(.1,n+.02),m.gain.linearRampToValueAtTime(0,n+a.duration),c.start(n),c.stop(n+a.duration),n+=a.duration})}playMushroomCollect(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="sine";const a=this.audioContext.currentTime;o.frequency.setValueAtTime(880,a),o.frequency.linearRampToValueAtTime(1200,a+.1),n.gain.value=0,n.gain.linearRampToValueAtTime(.1,a+.02),n.gain.linearRampToValueAtTime(0,a+.2),o.start(),o.stop(a+.2)}playExplosion(){if(!(!this.audioContext||!this.masterGain))for(let o=0;o<4;o++){const n=this.audioContext.createOscillator(),a=this.audioContext.createGain();n.connect(a),a.connect(this.masterGain),n.type="sawtooth",n.frequency.value=100+o*50+Math.random()*30,a.gain.value=0,a.gain.linearRampToValueAtTime(.1,this.audioContext.currentTime+.01),a.gain.exponentialRampToValueAtTime(.01,this.audioContext.currentTime+.2+o*.02),n.start(),n.stop(this.audioContext.currentTime+.2+o*.02)}}playDeath(){if(!this.audioContext||!this.masterGain)return;const o=this.audioContext.createOscillator(),n=this.audioContext.createGain();o.connect(n),n.connect(this.masterGain),o.type="square",o.frequency.value=400,o.frequency.linearRampToValueAtTime(300,this.audioContext.currentTime+.15),o.frequency.linearRampToValueAtTime(200,this.audioContext.currentTime+.3),n.gain.value=0,n.gain.linearRampToValueAtTime(.15,this.audioContext.currentTime+.02),n.gain.linearRampToValueAtTime(0,this.audioContext.currentTime+.5),o.start(),o.stop(this.audioContext.currentTime+.5)}}const j=new qt;function zt(){const{state:e,dispatch:o,jump:n,startGame:a,handleGameOver:c,handleGameWin:m,handleLevelComplete:w,resetGame:p,updateTime:R,loseLife:E,getTransitionState:S}=me(),{spawnParticles:h}=We();x.useEffect(()=>{e.status.state==="PLAYING"&&j.enableAudio()},[e.status.state]);const l=x.useRef(null),A=2e3,T=x.useCallback(()=>{o({type:"RESPAWN_DELAY"}),h("BRICK_BREAK",I.current.x+xe/2,I.current.y+F/2,8),j.playDeath(),l.current=window.setTimeout(()=>{o({type:"RESPAWN_COMPLETE"})},A)},[o,h]),v=x.useRef(void 0);x.useEffect(()=>()=>{l.current&&window.clearTimeout(l.current)},[]);const M=x.useRef(!1),I=x.useRef({...e.mario}),H=x.useRef([...e.pipes]),k=x.useRef([]),C=x.useRef([]),P=x.useRef([]),G=x.useRef([]),b=x.useRef([]),q=x.useRef([]),X=x.useRef(null),_=x.useRef({x:0,scrollSpeed:5});x.useEffect(()=>{I.current={...e.mario},H.current=[...e.pipes],C.current=[...e.platforms],P.current=[...e.blocks],k.current=[...e.grounds||[]],G.current=[...e.enemies],b.current=[...e.coins],q.current=[...e.mushrooms||[]],X.current=e.flagpole,_.current={...e.camera}},[e.mario,e.pipes,e.platforms,e.blocks,e.grounds,e.enemies,e.coins,e.mushrooms,e.flagpole,e.camera]);const ne=x.useCallback(()=>{if(e.status.state!=="PLAYING")return;const i=I.current,ye=H.current,se=C.current,ge=P.current,ve=k.current,ae=G.current,tt=b.current,ot=q.current;i.velocityY+=be,i.velocityY>oe&&(i.velocityY=oe),Math.abs(i.velocityX)<.5&&(i.velocityX*=ct),i.x+=i.velocityX,i.x<0&&(i.x=0,i.velocityX=0);for(const t of ye){const f=i.x-4,y=i.x+i.width+4,g=i.y-4,L=i.y+i.height+4;f<t.x+t.width&&y>t.x&&g<t.y+t.height&&L>t.y&&(L-4<=t.y+10&&i.velocityY>=0?(i.y=t.y-i.height,i.velocityY=0,i.isGrounded=!0,i.isJumping=!1):i.velocityY>=0&&i.x+i.width/2<t.x+t.width/2?(i.x=t.x-i.width,i.velocityX=0):i.velocityY>=0&&i.x+i.width/2>=t.x+t.width/2&&(i.x=t.x+t.width,i.velocityX=0))}for(const t of se){const f=i.x-4,y=i.x+i.width+4,g=i.y-4,L=i.y+i.height+4;f<t.x+t.width&&y>t.x&&g<t.y+t.height&&L>t.y&&(L-4<=t.y+10&&i.velocityY>=0?(i.y=t.y-i.height,i.velocityY=0,i.isGrounded=!0,i.isJumping=!1):i.velocityY>=0&&i.x+i.width/2<t.x+t.width/2?(i.x=t.x-i.width,i.velocityX=0):i.velocityY>=0&&i.x+i.width/2>=t.x+t.width/2&&(i.x=t.x+t.width,i.velocityX=0))}i.y+=i.velocityY,i.isGrounded=!1;for(const t of ve){const s=i.x,f=i.x+i.width,y=i.y+i.height;if(s<t.x+t.width&&f>t.x&&y>=t.y&&y<=t.y+50&&i.velocityY>=0){i.y=t.y-i.height,i.velocityY=0,i.isGrounded=!0,i.isJumping=!1;break}}for(const t of ye){const s=i.x,f=i.x+i.width,y=i.y+i.height,g=i.y;s<t.x+t.width&&f>t.x&&(y>=t.y&&y<=t.y+10&&i.velocityY>=0?(i.y=t.y-i.height,i.velocityY=0,i.isGrounded=!0,i.isJumping=!1):g<=t.y+t.height&&g>=t.y&&i.velocityY<0?(i.y=t.y+t.height,i.velocityY=0):g<t.y+t.height&&y>t.y&&(f>t.x&&s<t.x||s<t.x+t.width&&f>t.x+t.width)&&(i.x+i.width/2<t.x+t.width/2?(i.x=t.x-i.width,i.velocityX=0):(i.x=t.x+t.width,i.velocityX=0)))}for(const t of se){const s=i.x,f=i.x+i.width,y=i.y+i.height,g=i.y;s<t.x+t.width&&f>t.x&&(y>=t.y&&y<=t.y+10&&i.velocityY>=0?(i.y=t.y-i.height,i.velocityY=0,i.isGrounded=!0,i.isJumping=!1):g<=t.y+t.height&&g>=t.y&&i.velocityY<0?(i.y=t.y+t.height,i.velocityY=0):g<t.y+t.height&&y>t.y&&(f>t.x&&s<t.x||s<t.x+t.width&&f>t.x+t.width)&&(i.x+i.width/2<t.x+t.width/2?(i.x=t.x-i.width,i.velocityX=0):(i.x=t.x+t.width,i.velocityX=0)))}for(const t of ge){if(t.y>=O-V-t.height)continue;const s=i.x,f=i.x+i.width,y=i.y,g=i.y+i.height;if(s<t.x+t.width&&f>t.x)if(g>=t.y&&g<=t.y+10&&i.velocityY>=0)i.y=t.y-i.height,i.velocityY=0,i.isGrounded=!0,i.isJumping=!1;else if(y<=t.y+t.height&&y>=t.y&&i.velocityY<0)if(i.y=t.y+t.height,i.velocityY=0,t.type==="QUESTION"&&!t.used)if(t.used=!0,t.contents==="COIN")o({type:"ADD_COIN"}),j.playCoin(),h("COIN_SPARKLE",t.x+20,t.y+20);else if(t.contents==="MUSHROOM"){const L={id:`mushroom-${t.id}-${Date.now()}`,x:t.x,y:t.y-32,width:32,height:32,velocityX:At,velocityY:0,active:!0,spawnTime:Date.now(),type:"SUPER"};q.current.push(L),j.playMushroomSpawn(),h("MUSHROOM_BURST",t.x+20,t.y+20)}else t.contents===null&&(o({type:"ADD_SCORE",payload:100}),j.playMushroomSpawn(),h("MUSHROOM_BURST",t.x+20,t.y+20));else t.type==="BRICK"&&i.isBig&&(P.current=P.current.filter(L=>L.x!==t.x||L.y!==t.y),o({type:"BREAK_BRICK",payload:{x:t.x,y:t.y}}),j.playBrickBreak(),h("BRICK_BREAK",t.x+20,t.y+20),o({type:"ADD_SCORE",payload:100}));else y<t.y+t.height&&g>t.y&&(f>t.x&&s<t.x||s<t.x+t.width&&f>t.x+t.width)&&(i.x+i.width/2<t.x+t.width/2?(i.x=t.x-i.width,i.velocityX=0):(i.x=t.x+t.width,i.velocityX=0))}i.y+=i.velocityY;for(const t of ae)if(t.alive){t.velocityY+=be,t.velocityY>oe&&(t.velocityY=oe),t.x+=t.velocityX,t.y+=t.velocityY,(t.x>t.walkStart+t.walkRange||t.x<t.walkStart-t.walkRange)&&(t.velocityX=-t.velocityX);for(const s of ye)if(t.x<s.x+s.width&&t.x+t.width>s.x&&t.y<s.y+s.height&&t.y+t.height>s.y){const f=t.x+t.width/2,y=s.x+s.width/2,g=f<y;t.velocityX=-t.velocityX,g?t.x=s.x-t.width-5:t.x=s.x+s.width+5}for(const s of ae)!s.alive||s===t||t.x<s.x+s.width&&t.x+t.width>s.x&&t.y<s.y+s.height&&t.y+t.height>s.y&&(t.velocityX=-t.velocityX,s.velocityX=-s.velocityX,t.x<s.x?t.x=s.x-t.width-5:t.x=s.x+s.width+5);for(const s of se){const y=t.x-4,g=t.x+t.width+4,L=t.y-4,u=t.y+t.height+4;y<s.x+s.width&&g>s.x&&L<s.y+s.height&&u>s.y&&(u-4<=s.y+10&&t.velocityY>=0?(t.y=s.y-t.height,t.velocityY=0):L>=s.y+s.height-10&&t.velocityY<0&&(t.y=s.y+s.height,t.velocityY=0))}for(const s of ge){if(s.y>=O-V-s.height)continue;const f=1,y=t.x-f,g=t.x+t.width+f,L=t.y-f,u=t.y+t.height+f;y<s.x+s.width&&g>s.x&&u>=s.y&&u<=s.y+10&&t.velocityY>=0?(t.y=s.y-t.height,t.velocityY=0):y<s.x+s.width&&g>s.x&&L<s.y+s.height&&u>s.y+s.height&&t.velocityY<0&&(t.y=s.y+s.height,t.velocityY=0)}for(const s of ve){const y=t.x-4,g=t.x+t.width+4,L=t.y-4,u=t.y+t.height+4;y<s.x+s.width&&g>s.x&&L<s.y+s.height&&u>s.y&&u-4<=s.y+10&&t.velocityY>=0&&(t.y=s.y-t.height,t.velocityY=0)}}for(const t of ae)if(t.alive&&i.x<t.x+t.width&&i.x+i.width>t.x&&i.y<t.y+t.height&&i.y+i.height>t.y){const s=i.y+i.height,f=t.y;if(i.velocityY>0&&s<=f+15&&i.y+i.height/2<t.y)t.alive=!1,i.velocityY=-8,o({type:"ADD_SCORE",payload:200});else{T();return}}for(const t of tt){if(t.collected)continue;const s=4,f=i.x-s,y=i.x+i.width+s,g=i.y-s,L=i.y+i.height+s;f<t.x+t.width&&y>t.x&&g<t.y+t.height&&L>t.y&&(t.collected=!0,o({type:"ADD_COIN"}),j.playCoin(),h("COIN_SPARKLE",t.x+10,t.y+10))}for(const t of ot){if(!t.active)continue;if(Date.now()-t.spawnTime>Ie){t.active=!1;continue}t.velocityY+=be,t.velocityY>oe&&(t.velocityY=oe),t.x+=t.velocityX,t.y+=t.velocityY,t.x>re*2&&(t.active=!1);for(const u of se){const Z=t.x-4,ee=t.x+t.width+4,Q=t.y-4,te=t.y+t.height+4;Z<u.x+u.width&&ee>u.x&&Q<u.y+u.height&&te>u.y&&(te-4<=u.y+10&&t.velocityY>=0?(t.y=u.y-t.height,t.velocityY=0):Q>=u.y+u.height-10&&t.velocityY<0?(t.y=u.y+u.height,t.velocityY=0):t.velocityY>=0&&(t.x+t.width/2<u.x+u.width/2?t.x=u.x-t.width:t.x=u.x+u.width,t.velocityX=-t.velocityX))}for(const u of ge){if(u.y>=O-V-u.height)continue;const J=1,Z=t.x-J,ee=t.x+t.width+J,Q=t.y-J,te=t.y+t.height+J;Z<u.x+u.width&&ee>u.x&&te>=u.y&&te<=u.y+10&&t.velocityY>=0?(t.y=u.y-t.height,t.velocityY=0):Z<u.x+u.width&&ee>u.x&&Q<u.y+u.height&&te>u.y+u.height&&t.velocityY<0&&(t.y=u.y+u.height,t.velocityY=0)}for(const u of ve){const Z=t.x-4,ee=t.x+t.width+4,Q=t.y+t.height;Z<u.x+u.width&&ee>u.x&&Q>=u.y&&Q<=u.y+50&&t.velocityY>=0&&(t.y=u.y-t.height,t.velocityY=0)}const s=4,f=i.x-s,y=i.x+i.width+s,g=i.y-s,L=i.y+i.height+s;f<t.x+t.width&&y>t.x&&g<t.y+t.height&&L>t.y&&(t.active=!1,t.type==="1UP"?(o({type:"GIVE_EXTRA_LIFE"}),j.playMushroomCollect(),h("MUSHROOM_COLLECT",i.x+i.width/2,i.y+i.height/2)):i.isBig?(o({type:"ADD_SCORE",payload:100}),j.playMushroomCollect(),h("MUSHROOM_COLLECT",i.x+i.width/2,i.y+i.height/2)):(o({type:"TRANSFORM_MARIO"}),i.height=Ee,i.isBig=!0,i.invulnerable=60,j.playPowerUp(),h("TRANSFORM_BURST",i.x+i.width/2,i.y+i.height/2)))}i.invulnerable>0&&i.invulnerable--;for(const t of ae){if(!t.alive||i.invulnerable>0&&Math.floor(Date.now()/100)%2===0)continue;const s=4,f=i.x-s,y=i.x+i.width+s,g=i.y-s,L=i.y+i.height+s;if(f<t.x+t.width&&y>t.x&&g<t.y+t.height&&L>t.y){const u=t.y;if(i.velocityY>0&&L<=u+15&&i.y+i.height/2<t.y)t.alive=!1,i.velocityY=-8,o({type:"ADD_SCORE",payload:200}),j.playStomp(),h("BRICK_BREAK",t.x+16,t.y+16,6);else if(i.isBig&&i.invulnerable===0)t.alive=!1,o({type:"SHRINK_MARIO"}),i.height=F,i.isBig=!1,i.invulnerable=90,i.velocityX=i.x<t.x?-5:5,j.playShrink(),h("MUSHROOM_BURST",i.x+i.width/2,i.y+i.height/2,8);else{T();return}}}if(i.y>O){T();return}if(X.current){const t=X.current,s=4,f=i.x-s,y=i.x+i.width+s,g=i.y-s,L=i.y+i.height+s;if(f<t.x+t.width&&y>t.x&&g<t.y+t.height&&L>t.y){j.playVictory(),w();return}}if(e.score.currentTime<=0){T();return}if(e.status.state==="PLAYING"&&R(1/60),e.status.state==="PLAYING"){const t=re/3,s=i.x-t;s>_.current.x&&(_.current.x=s)}const it=e.status.state==="PLAYING"?{camera:{..._.current}}:{};o({type:"UPDATE_LOCAL_STATE",payload:{mario:{...i},pipes:[...H.current],platforms:[...C.current],blocks:[...P.current],enemies:[...G.current],coins:[...b.current],mushrooms:[...q.current],...it}})},[e.status,o,T,m,Ie,Ee,F]),z=x.useRef(null);z.current=x.useCallback(i=>{if(e.status.state==="PLAYING"){if(M.current){M.current=!1,v.current=requestAnimationFrame(z.current);return}ne(),v.current=requestAnimationFrame(z.current)}},[e.status,ne]),x.useEffect(()=>(e.status.state==="PLAYING"?v.current||(v.current=requestAnimationFrame(z.current)):(e.status.state==="PAUSED"||e.status.state==="GAME_OVER"||e.status.state==="IDLE")&&v.current&&(cancelAnimationFrame(v.current),v.current=void 0),()=>{v.current&&cancelAnimationFrame(v.current)}),[e.status.state]);const ie=x.useCallback(async()=>{e.status.state!=="PLAYING"&&(_.current={x:0,scrollSpeed:5},H.current=[],await a("1-1"))},[e.status.state,a]),fe=x.useCallback(()=>{e.status.state==="PLAYING"?o({type:"PAUSE"}):e.status.state==="PAUSED"&&(M.current=!0,o({type:"RESUME"}))},[e.status.state,o]),$=x.useCallback(()=>{e.status.state==="GAME_OVER"&&(v.current&&(cancelAnimationFrame(v.current),v.current=void 0),p(),ie())},[p,ie,e.status.state]),Je=x.useCallback((i=!1)=>{e.status.state==="PLAYING"&&(I.current.velocityX=i?-Oe:-Pe,I.current.facingRight=!1)},[e.status.state]),Qe=x.useCallback((i=!1)=>{e.status.state==="PLAYING"&&(I.current.velocityX=i?Oe:Pe,I.current.facingRight=!0)},[e.status.state]),Ze=x.useCallback(()=>{e.status.state==="PLAYING"&&(I.current.velocityX=0)},[e.status.state]),et=x.useCallback(()=>{e.status.state==="PLAYING"&&I.current.isGrounded&&(I.current.velocityY=ke,I.current.isGrounded=!1,I.current.isJumping=!0,n(),j.playJump())},[e.status.state,n]);return{state:e,jump:et,moveLeft:Je,moveRight:Qe,stop:Ze,startGame:ie,pauseGame:fe,restartGame:$,die:T,getTransitionState:S}}const Jt=d.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`,Me=d.button`
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  min-width: 96px;
  text-align: center;

  &:hover {
    background: #45a049;
  }

  &:active {
    background: #3d8b40;
  }
`,Qt=d.span`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`,Zt=()=>{const{state:e,pauseGame:o}=me(),n=()=>{o()},a=()=>{window.history.back()};return r.jsxs(Jt,{children:[r.jsx(Me,{onClick:a,children:"Exit"}),r.jsx(Qt,{children:"Super Mario"}),r.jsx(Me,{onClick:n,children:e.status==="PAUSED"?"Resume":"Pause"})]})},eo=d.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
`,W=d.h1`
  color: #ffd700;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow:
    3px 3px 0 #ff0000,
    -1px -1px 0 #0000ff;
  text-transform: uppercase;
  letter-spacing: 3px;
`,K=d.p`
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
`,ce=d.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 20px 30px;
  margin-bottom: 30px;
  min-width: 200px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`,D=d.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
`,ue=d.button`
  background: linear-gradient(to bottom, #4caf50, #3d8b40);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 40px;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow:
    0 4px 0 #2e7d32,
    0 6px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 #2e7d32,
      0 8px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 #2e7d32,
      0 4px 8px rgba(0, 0, 0, 0.3);
  }
`,je=d.div`
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  text-align: center;
  line-height: 1.8;
`,Y=d.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  margin: 0 2px;
`,to=({currentScore:e,coinCount:o,highScore:n,lives:a,gameState:c,gameOverReason:m,onStartGame:w,onRestart:p,isFinalLevel:R})=>c.state==="PLAYING"?null:r.jsxs(eo,{children:[c.state==="IDLE"&&r.jsxs(r.Fragment,{children:[r.jsx(W,{children:"Super Mario"}),r.jsx(K,{children:"Platform Adventure Game"}),r.jsx(ue,{onClick:w,children:"Start Game"}),r.jsxs(je,{children:[r.jsxs("p",{children:[r.jsx(Y,{children:"←"})," ",r.jsx(Y,{children:"→"})," Move"]}),r.jsxs("p",{children:[r.jsx(Y,{children:"Space"})," or ",r.jsx(Y,{children:"↑"})," Jump"]}),r.jsxs("p",{children:[r.jsx(Y,{children:"P"})," Pause/Resume"]})]})]}),c.state==="RESPAWNING"&&r.jsxs(r.Fragment,{children:[r.jsx(W,{children:"Respawning..."}),r.jsx(K,{children:"Get ready!"}),r.jsx(ce,{children:r.jsxs(D,{children:[r.jsx("span",{children:"Lives:"}),r.jsx("span",{children:a})]})}),r.jsxs(je,{children:[r.jsxs("p",{children:[r.jsx(Y,{children:"←"})," ",r.jsx(Y,{children:"→"})," Move"]}),r.jsxs("p",{children:[r.jsx(Y,{children:"Space"})," or ",r.jsx(Y,{children:"↑"})," Jump"]}),r.jsxs("p",{children:[r.jsx(Y,{children:"P"})," Pause"]})]})]}),c.state==="GAME_OVER"&&r.jsxs(r.Fragment,{children:[r.jsx(W,{children:"Game Over"}),m&&r.jsx(K,{children:m}),r.jsxs(ce,{children:[r.jsxs(D,{children:[r.jsx("span",{children:"Score:"}),r.jsx("span",{children:e})]}),r.jsxs(D,{children:[r.jsx("span",{children:"Coins:"}),r.jsx("span",{children:o})]}),r.jsxs(D,{children:[r.jsx("span",{children:"High Score:"}),r.jsx("span",{children:n})]})]}),r.jsx(ue,{onClick:p,children:"Play Again"})]}),c.state==="PAUSED"&&r.jsxs(r.Fragment,{children:[r.jsx(W,{children:"Paused"}),r.jsx(K,{children:"Game temporarily stopped"}),r.jsx(ue,{onClick:p,children:"Restart Game"})]}),c.state==="TRANSITIONING"&&r.jsxs(r.Fragment,{children:[R?r.jsxs(r.Fragment,{children:[r.jsx(W,{style:{color:"#FFD700",textShadow:"3px 3px 0 #FF0000"},children:"Game Complete!"}),r.jsx(K,{children:"You've beaten the game!"})]}):r.jsxs(r.Fragment,{children:[r.jsx(W,{style:{color:"#00FF00"},children:"Level Complete!"}),r.jsx(K,{children:"Transitioning to next level..."})]}),r.jsxs(ce,{children:[!R&&r.jsxs(D,{children:[r.jsx("span",{children:"World:"}),r.jsxs("span",{children:[c.currentWorld,"-",c.currentLevel]})]}),r.jsxs(D,{children:[r.jsx("span",{children:"Score:"}),r.jsx("span",{children:e})]}),r.jsxs(D,{children:[r.jsx("span",{children:"Coins:"}),r.jsx("span",{children:o})]})]})]}),c.state==="WIN"&&r.jsxs(r.Fragment,{children:[R?r.jsxs(r.Fragment,{children:[r.jsx(W,{style:{color:"#FFD700",textShadow:"3px 3px 0 #FF0000"},children:"Game Complete!"}),r.jsx(K,{children:"You've beaten the game!"})]}):r.jsxs(r.Fragment,{children:[r.jsx(W,{style:{color:"#FFD700",textShadow:"3px 3px 0 #FF0000"},children:"Level Complete!"}),m&&r.jsx(K,{children:m})]}),r.jsxs(ce,{children:[!R&&r.jsxs(D,{children:[r.jsx("span",{children:"High Score:"}),r.jsx("span",{children:n})]}),r.jsxs(D,{children:[r.jsx("span",{children:"Score:"}),r.jsx("span",{children:e})]}),r.jsxs(D,{children:[r.jsx("span",{children:"Coins:"}),r.jsx("span",{children:o})]})]}),r.jsx(ue,{onClick:p,children:"Play Again"})]})]}),oo=d.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  z-index: 40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  border-bottom: 2px solid #ffd700;
`,de=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
`,Re=d.span`
  color: #87ceeb;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,he=d.span`
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  font-family: "Press Start 2P", monospace;
  min-width: 80px;
  text-align: right;
  letter-spacing: 1px;
`,io=d.span`
  color: #ffd700;
  font-size: 16px;
`,ro=d.span`
  color: #98fb98;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`,no=({currentScore:e,coinCount:o,highScore:n,currentTime:a})=>r.jsxs(oo,{children:[r.jsxs(de,{children:[r.jsx(Re,{children:"Score"}),r.jsx(he,{children:e})]}),r.jsxs(de,{children:[r.jsx(io,{children:"●"}),r.jsx(Re,{children:"Coins"}),r.jsx(he,{children:o})]}),r.jsxs(de,{children:[r.jsx(ro,{children:"High"}),r.jsx(he,{children:n})]}),r.jsxs(de,{children:[r.jsx(Re,{children:"Time"}),r.jsx(he,{children:Math.ceil(a)})]})]}),so=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  font-family: Arial, sans-serif;
  font-weight: bold;
`,ao=d.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #FF0000;
  border-radius: 2px;
  position: relative;
  transform: scale(${e=>e.$scale||1});
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  /* Mario's overall/blue pants */
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 6px;
    background: #4169E1;
    border-radius: 1px;
  }

  /* Mario's hat brim */
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: 3px;
    background: #FF0000;
    border-radius: 1px;
  }
`,lo=d.span`
  font-size: 14px;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;function co(){const{state:e}=me(),o=e.score.lives||3;return e.status==="IDLE"||e.status==="GAME_OVER"?null:r.jsxs(so,{children:[r.jsx(lo,{children:"x"}),Array.from({length:o}).map((n,a)=>r.jsx(ao,{$scale:a===0?1.2:1},a))]})}const uo=d.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  border: 2px solid #ffd700;
`;d.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
`;const ho=d.span`
  color: #87ceeb;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,po=d.span`
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  font-family: "Press Start 2P", monospace;
  min-width: 80px;
  text-align: right;
  letter-spacing: 1px;
`,xo=d.span`
  color: #ff6b6b;
  font-size: 16px;
  font-weight: bold;
  background: rgba(255, 107, 107, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ff6b6b;
  margin-right: 8px;
`,mo=({world:e,level:o})=>r.jsxs(uo,{children:[r.jsxs(xo,{children:["W",e]}),r.jsx(ho,{children:"Level"}),r.jsxs(po,{children:["L",o]})]}),fo=d.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(30, 60, 100, 0.95) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: ${e=>e.$visible?1:0};
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${e=>e.$visible?"auto":"none"};
`,yo=d.div`
  text-align: center;
  transform: ${e=>e.$visible?"scale(1)":"scale(0.8)"};
  transition: transform 0.3s ease-in-out;
`,go=d.h1`
  font-size: 64px;
  font-weight: bold;
  color: #00ff00;
  text-shadow:
    4px 4px 0 #006600,
    -2px -2px 0 #00cc00,
    0 0 20px rgba(0, 255, 0, 0.5);
  margin-bottom: 20px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`,vo=d.p`
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`,bo=d.div`
  background: rgba(255, 215, 0, 0.15);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 30px 50px;
  margin-bottom: 40px;
  box-shadow:
    0 8px 32px rgba(255, 215, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
`,Fe=d.span`
  font-size: 18px;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
  display: block;
`,$e=d.span`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  font-family: "Press Start 2P", monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
`,wo=d.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`,Ro=d.span`
  font-size: 20px;
  color: #ffd700;
  font-weight: bold;
`,Eo=d.span`
  font-size: 48px;
  font-weight: bold;
  color: #ff6b6b;
  font-family: "Press Start 2P", monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  animation: bounce 0.6s ease-in-out;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`,To=d.div`
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 30px;
`,Lo=d.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    #00ff00 0%,
    #00cc00 50%,
    #00ff00 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1s linear infinite;
  width: ${e=>e.$progress}%;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`,Ao=({isVisible:e,levelInfo:o})=>{const[n,a]=x.useState(3),[c,m]=x.useState(0);if(x.useEffect(()=>{if(!e){a(3),m(0);return}const h=Date.now(),l=3e3,A=setInterval(()=>{const T=Date.now()-h,v=Math.max(0,Math.ceil((l-T)/1e3));a(v),m(T/l*100),T>=l&&clearInterval(A)},100);return()=>clearInterval(A)},[e]),!e)return null;const{world:w,level:p,nextWorld:R,nextLevel:E}=o,S=R!==void 0&&E!==void 0?`World ${R}-${E}`:"Game Complete!";return r.jsx(fo,{$visible:e,children:r.jsxs(yo,{$visible:e,children:[r.jsx(go,{children:"Level Complete!"}),r.jsx(vo,{children:"Preparing next stage..."}),r.jsxs(bo,{children:[r.jsx(Fe,{children:"Current Level"}),r.jsxs($e,{children:["World ",w,"-",p]}),r.jsx("br",{}),r.jsx(Fe,{style:{marginTop:"20px"},children:S==="Game Complete!"?"Congratulations!":"Next Level"}),r.jsx($e,{children:S})]}),r.jsxs(wo,{children:[r.jsx(Ro,{children:"Starting in:"}),r.jsx(Eo,{$countdown:n,children:n})]}),r.jsx(To,{children:r.jsx(Lo,{$progress:c})})]})})},So=d.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`,Co=d.div`
  position: absolute;
  transform: translate(-50%, -50%);
  border-radius: ${e=>e.$type==="COIN_SPARKLE"?"50%":e.$type==="BRICK_BREAK"?"2px":"50%"};
`;function Po(){const{particles:e,spawnParticles:o}=We(),{state:n}=me();return Se.useEffect(()=>{},[o]),e.length===0?null:r.jsx(So,{children:e.map(a=>{const c=a.x-n.camera.x,m=a.y;return r.jsx(Co,{$type:a.type,style:{left:c,top:m,width:a.size,height:a.size,background:a.color,opacity:Math.max(0,a.lifetime/30),boxShadow:`0 0 ${a.size*.5}px ${a.color}`}},a.id)})})}const Oo=d.div`
  position: relative;
  width: ${re}px;
  height: ${O}px;
  background: linear-gradient(
    to bottom,
    ${N.SKY_TOP},
    ${N.SKY_BOTTOM}
  );
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  user-select: none;
`,_o=nt`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.3; }
`,Io=d.div`
  position: absolute;
  width: ${xe}px;
  height: ${e=>e.$isBig?Ee:F}px;
  background: ${N.MARIO_RED};
  border-radius: 4px;
  transform: ${e=>e.$facingRight?"scaleX(1)":"scaleX(-1)"};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  ${e=>e.$invulnerable&&e.$invulnerable>0&&st`
      animation: ${_o} 0.1s linear infinite;
    `}

  /* Mario's overall/blue pants */
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 4px;
    right: 4px;
    height: 12px;
    background: ${N.MARIO_OVERALL};
    border-radius: 2px;
  }

  /* Mario's hat brim */
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 0;
    width: 100%;
    height: 6px;
    background: ${N.MARIO_RED};
    border-radius: 2px;
  }
`,Go=d.div`
  position: absolute;
  width: ${Tt}px;
  height: ${Lt}px;
  pointer-events: none;

  /* Mushroom cap - red for SUPER, green for 1UP */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 16px;
    background: ${e=>e.$type==="1UP"?Pt:St};
    border-radius: 16px 16px 0 0;

    /* White spots on cap (only for SUPER) */
    ${e=>e.$type!=="1UP"&&`
      &::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 6px;
        width: 6px;
        height: 6px;
        background: ${we};
        border-radius: 50%;
        box-shadow:
          12px 0 0 ${we},
          6px 6px 0 ${we};
      }
    `}
  }

  /* Mushroom stem (beige) */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 16px;
    background: ${Ct};
    border-radius: 0 0 4px 4px;
  }

  /* 1UP text indicator */
  ${e=>e.$type==="1UP"&&`
    &::before {
      content: "1UP";
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: ${Ot};
    }
    &::after {
      content: none;
    }
  `}
`,Mo=d.div`
  position: absolute;
  width: ${e=>e.$width}px;
  height: ${e=>e.$height}px;
  background: ${N.GROUND_BROWN};
  border-top: 8px solid ${N.GROUND_GRASS};
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`,jo=d.div`
  position: absolute;
  width: 50px;
  height: ${e=>e.height}px;
  background: ${N.PIPE_GREEN};
  border: 3px solid ${N.PIPE_DARK_GREEN};
  border-radius: 4px;
`,Fo=d.div`
  position: absolute;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  width: ${pe}px;
  height: ${De}px;
  background: ${ft}; // Olive green pole
`,$o=d.div`
  position: absolute;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  width: ${Ye}px;
  height: ${Ne}px;
  background: ${mt}; // Olive green base
  border: 3px solid ${N.PIPE_DARK_GREEN};
  border-radius: 4px 4px 0 0;
`,ko=d.div`
  position: absolute;
  left: ${e=>e.x}px;
  top: ${e=>e.y}px;
  width: ${ht}px;
  height: ${pt}px;
  background: ${xt};
  border-radius: 2px;
`,Do=d.div`
  position: absolute;
  width: ${Be}px;
  height: ${Te}px;
  background: ${Ue};
  border-radius: 4px 4px 0 0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  /* Enemy eyes */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 8px;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
  }

  &::before {
    left: 6px;
  }

  &::after {
    right: 6px;
  }
`,Yo=d.div`
  position: absolute;
  width: ${Ve}px;
  height: ${He}px;
  background: ${Ge};
  border: 2px solid #ffa500;
  border-radius: 50%;
  box-shadow: 0 0 8px ${Ge};
`,No=d.div`
  position: absolute;
  width: ${e=>e.$width}px;
  height: ${e=>e.$height}px;
  background: ${gt};
  border-top: 4px solid ${vt};
  border-radius: 2px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`,Bo=d.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${e=>e.$used&&e.$type==="QUESTION"?_e:e.$type==="QUESTION"?Et:e.$type==="BRICK"?Rt:_e};
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 2px;

  ${e=>e.$type==="QUESTION"&&!e.$used&&`
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      content: "?";
      font-size: 24px;
      font-weight: bold;
      color: #8B4513;
    }
  `}

  ${e=>e.$type==="BRICK"&&`
    background-image: linear-gradient(
      45deg,
      transparent 48%,
      rgba(0, 0, 0, 0.1) 48%,
      rgba(0, 0, 0, 0.1) 52%,
      transparent 52%
    );
    background-size: 10px 10px;
  `}
`,Uo=d.div`
  will-change: transform;
`,Vo=()=>{const{state:e,jump:o,moveLeft:n,moveRight:a,stop:c,startGame:m,pauseGame:w,restartGame:p,getTransitionState:R}=zt(),E=x.useRef(null),S=x.useRef(null),h=x.useRef(new Set);return x.useEffect(()=>{const l=v=>{switch(h.current.add(v.code),v.code){case"ArrowLeft":case"KeyA":if(v.preventDefault(),e.status.state==="PLAYING"){const M=h.current.has("ShiftRight")||h.current.has("ShiftLeft");n(M)}break;case"ArrowRight":case"KeyD":if(v.preventDefault(),e.status.state==="PLAYING"){const M=h.current.has("ShiftRight")||h.current.has("ShiftLeft");a(M)}break;case"ArrowUp":case"Space":case"KeyW":v.preventDefault(),e.status.state==="IDLE"||e.status.state==="GAME_OVER"?m():e.status.state==="PLAYING"&&o();break;case"KeyP":case"Escape":v.preventDefault(),(e.status.state==="PLAYING"||e.status.state==="PAUSED")&&w();break;case"Enter":v.preventDefault(),(e.status.state==="GAME_OVER"||e.status.state==="IDLE")&&p();break}},A=v=>{switch(h.current.delete(v.code),v.code){case"ArrowLeft":case"KeyA":case"ArrowRight":case"KeyD":e.status.state==="PLAYING"&&c();break}},T=E.current;return T&&(T.addEventListener("keydown",l),T.addEventListener("keyup",A),T.focus()),()=>{T&&(T.removeEventListener("keydown",l),T.removeEventListener("keyup",A))}},[e.status,o,n,a,c,m,w,p]),x.useEffect(()=>{if(e.status!=="PLAYING")return;const l=setInterval(()=>{const A=h.current.has("ShiftRight")||h.current.has("ShiftLeft");(h.current.has("ArrowLeft")||h.current.has("KeyA"))&&n(A),(h.current.has("ArrowRight")||h.current.has("KeyD"))&&a(A)},50);return()=>clearInterval(l)},[e.status,n,a]),x.useEffect(()=>{const l=()=>{const A=S.current;if(A){const T=Math.min(window.innerWidth-32,re),v=Math.min(window.innerHeight-32,O),M=Math.min(T/re,v/O);A.style.transform=`scale(${M})`}};return l(),window.addEventListener("resize",l),()=>window.removeEventListener("resize",l)},[]),r.jsx("div",{ref:S,style:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"80vh",background:"#2c3e50",padding:"16px",overflow:"hidden"},children:r.jsxs(Oo,{ref:E,tabIndex:0,role:"application","aria-label":"Super Mario Game",children:[r.jsx(Zt,{}),r.jsxs("div",{style:{position:"absolute",top:"8px",left:"50%",transform:"translateX(-50%)",display:"flex",gap:"16px",zIndex:10},children:[r.jsx(no,{currentScore:e.score.score,coinCount:e.score.coins,highScore:e.score.highScore,currentTime:e.score.currentTime||400}),r.jsx(mo,{world:e.status.currentWorld,level:e.status.currentLevel}),r.jsx(co,{})]}),r.jsx(Po,{}),r.jsxs(Uo,{style:{transform:`translateX(${-e.camera.x}px)`},children:[r.jsx(Io,{$facingRight:e.mario.facingRight,$isBig:e.mario.isBig,$invulnerable:e.mario.invulnerable,style:{left:e.mario.x,top:e.mario.y}}),e.pipes.map(l=>r.jsx(jo,{height:l.height,style:{left:l.x,top:l.y}},l.id)),e.enemies.filter(l=>l.alive).map(l=>r.jsx(Do,{style:{left:l.x,top:l.y}},l.id)),e.coins.filter(l=>!l.collected).map(l=>r.jsx(Yo,{style:{left:l.x,top:l.y}},l.id)),(e.mushrooms||[]).map(l=>l.active?r.jsx(Go,{$type:l.type,style:{left:l.x,top:l.y}},l.id):null),e.platforms.map(l=>r.jsx(No,{$type:l.type,$width:l.width,$height:l.height,style:{left:l.x,top:l.y}},l.id)),e.blocks.map(l=>r.jsx(Bo,{$type:l.type,$used:l.used,style:{left:l.x,top:l.y}},l.id)),e.flagpole&&r.jsxs(r.Fragment,{children:[r.jsx(Fo,{x:e.flagpole.x,y:e.flagpole.y}),r.jsx($o,{x:e.flagpole.x-Ye/2+pe/2,y:O-V-Ne}),r.jsx(ko,{x:e.flagpole.x+pe,y:e.flagpole.y+20})]}),e.grounds.map(l=>r.jsx(Mo,{$width:l.width,$height:l.height,style:{left:l.x,top:l.y}},l.id))]}),r.jsx(to,{currentScore:e.score.score,coinCount:e.score.coins,highScore:e.score.highScore,lives:e.score.lives,gameState:e.status,gameOverReason:e.status.gameOverReason,onStartGame:m,onRestart:p}),r.jsx(Ao,{isVisible:R().isVisible,levelInfo:R().levelInfo})]})})};function Ho({children:e}){return r.jsx(Kt,{children:e})}const Xo=d.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
`,Wo=d.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`,zo=rt(function(){return r.jsx(Xo,{children:r.jsx(Wo,{children:r.jsx(Ho,{children:r.jsx(Vo,{})})})})});export{Mt as _,U as a,zo as s};
