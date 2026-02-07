import{a as c,p as l,w as he}from"./chunk-EPOLDU6W-BRx3iYW4.js";import{a as S}from"./styled-components.browser.esm-AwWoiJTA.js";var k=(e=>(e.IDLE="idle",e.PLAYING="playing",e.PAUSED="paused",e.GAME_OVER="gameover",e.VICTORY="victory",e.LEVEL_TRANSITION="levelTransition",e))(k||{}),L=(e=>(e[e.AIR=7]="AIR",e[e.GROUND=1]="GROUND",e[e.BRICK=2]="BRICK",e[e.QUESTION_BLOCK=3]="QUESTION_BLOCK",e[e.FLAG_POLE=6]="FLAG_POLE",e[e.PIPE=4]="PIPE",e[e.BLOCK=5]="BLOCK",e))(L||{});const y=800,E=480,X={acceleration:.5,velocity:12,friction:.9},pe={force:-12},G={acceleration:.5,maxSpeed:5,runSpeed:8,runBoost:3,friction:.8,airResistance:.95},B={decayRate:.5,rechargeRate:.2,maxMeter:100},O=32,A=32,ge=32,me=.1,se=3,be=0,Se=300,ve={HIGH_SCORE:"supermario_high_score"},we={idle:6,walk:8,run:12,jump:4,duck:8},re={JUMP:"jumpBtn",RUN:"runBtn"},Ce=(e,t,n)=>e?{hat:"#E53935",shirt:"#E53935",overalls:"#1E88E5",skin:"#FFCC80"}:n?{hat:"#FDD835",shirt:"#FDD835",overalls:"#1E88E5",skin:"#FFCC80"}:{hat:"#E53935",shirt:"#E53935",overalls:"#1E88E5",skin:"#FFCC80"},Re=(e,t,n,i,r,s,o,f,d,h)=>{const p=Ce(d,h,h);e.fillStyle="rgba(0, 0, 0, 0.2)",e.fillRect(t+4,n+r-6,i-8,4);const a=i,u=r;if(s==="jump"||s==="fall"){e.fillStyle=p.shirt,e.fillRect(t,n,a,u*.6),e.fillStyle=p.overalls,e.fillRect(t+4,n+u*.3,a-8,u*.4),e.fillStyle=p.skin,e.fillRect(t+a*.2,n+(d?u*.05:u*.08),a*.6,u*.25),e.fillStyle=p.hat,f?(e.fillRect(t-4,n,8,8),e.fillRect(t,n,a*.4,8)):(e.fillRect(t+a*.6,n,a*.4,8),e.fillRect(t+a*.8,n,8,8)),e.fillStyle="#000";const b=f?t+a*.25:t+a*.55;e.fillRect(b,n+u*.12,2,3),e.fillStyle=p.overalls,e.fillRect(t-2,n+4,4,8),e.fillRect(t+a-2,n+4,4,8),e.fillStyle=p.hat,e.fillRect(t+a*.3,n+u*.7,a*.2,u*.3),e.fillRect(t+a*.5,n+u*.7,a*.2,u*.3)}else if(s==="duck"){const b=u*.6,w=u*.4;e.fillStyle=p.shirt,e.fillRect(t,n+b,a,w),e.fillStyle=p.overalls,e.fillRect(t+4,n+b+w*.3,a-8,w*.4),e.fillStyle=p.skin,e.fillRect(t+a*.2,n+b+4,a*.6,w*.25),e.fillStyle=p.hat,f?(e.fillRect(t-4,n+b,8,8),e.fillRect(t,n+b,a*.4,8)):(e.fillRect(t+a*.6,n+b,a*.4,8),e.fillRect(t+a*.8,n+b,8,8)),e.fillStyle="#000";const C=f?t+a*.25:t+a*.55;e.fillRect(C,n+b+12,2,3)}else{e.fillStyle=p.shirt,e.fillRect(t,n,a,u*.6),e.fillStyle=p.overalls,e.fillRect(t+4,n+u*.3,a-8,u*.4),e.fillStyle=p.skin,e.fillRect(t+a*.2,n+(d?u*.05:u*.08),a*.6,u*.25),e.fillStyle=p.hat,f?(e.fillRect(t-4,n,8,8),e.fillRect(t,n,a*.4,8)):(e.fillRect(t+a*.6,n,a*.4,8),e.fillRect(t+a*.8,n,8,8)),e.fillStyle="#000";const b=f?t+a*.25:t+a*.55;e.fillRect(b,n+u*.12,2,3),e.fillStyle=p.hat;const w=s==="run"?Math.sin(o*Math.PI/4)*6:0;f?(e.fillRect(t+a*.3-w,n+u*.6,a*.15,u*.4),e.fillRect(t+a*.55+w,n+u*.6,a*.15,u*.4)):(e.fillRect(t+a*.3+w,n+u*.6,a*.15,u*.4),e.fillRect(t+a*.55-w,n+u*.6,a*.15,u*.4)),e.fillStyle=p.overalls;const C=s==="run"?Math.sin(o*Math.PI/4)*3:s==="walk"?Math.sin(o*Math.PI/6)*3:0;f?(e.fillRect(t-2,n+4+C,4,8),e.fillRect(t+a-2,n+4-C,4,8)):(e.fillRect(t-2,n+4-C,4,8),e.fillRect(t+a-2,n+4+C,4,8))}if(h){e.fillStyle=`rgba(255, 100, 0, ${.3+Math.random()*.3})`;const b=8+Math.floor(o/2),w=f?t-b+4:t+i-4;e.beginPath(),e.moveTo(w,n+r/2);for(let C=0;C<b;C+=3)e.lineTo(w+(f?-C:C),n+r/2+C*.5);e.strokeStyle="#FF5722",e.lineWidth=2,e.stroke(),e.fill()}},le=(e,t,n)=>e+(t-e)*n,Pe=c.createContext(null),ke=({children:e,canvasWidth:t=800,canvasHeight:n=480,levelWidth:i=3200,levelHeight:r=480,padding:s=64})=>{const[o,f]=c.useState({x:0,y:0,targetX:0,targetY:0}),d=c.useCallback(()=>({x:o.x,y:o.y}),[o.x,o.y]),h=c.useCallback((m,v,R,P)=>{const M=le(m,R,.1),I=le(v,P,.1);f({x:M,y:I,targetX:R,targetY:P})},[]),p=c.useCallback((m,v)=>{const M=Math.max(0,Math.min(m,3200-t)),I=Math.max(0,Math.min(v,480-n));return{x:M,y:I}},[t,n]),a=c.useCallback(()=>{const{x:m,y:v}=o;return{x:Math.max(0,Math.min(m,3200-t)),y:Math.max(0,Math.min(v,480-n))}},[o.x,o.y,t,n]),u=c.useCallback(()=>({left:o.x,top:o.y,width:t,height:n}),[o.x,o.y,t,n]),b=c.useCallback((m,v,R=32,P=32)=>{const M=u(),I=64,g=M.left,T=M.left+M.width,N=M.top,q=M.top+M.height;return m+R+I>=g&&m-I<=T&&v+P+I>=N&&v-I<=q},[u]),w=c.useCallback((m,v)=>{const R=u(),P=64,M=o.x;if(m-M<P){const I=Math.max(0,m-P);f({x:I,y:o.y,targetX:I,targetY:o.y})}else if(m+R.width>M+R.width){const g=Math.min(3200-R.width,m+R.width-P);f({x:g,y:o.y,targetX:g,targetY:o.y})}v<o.y+P?f({x:o.x,y:Math.max(0,v-P),targetX:o.x,targetY:v}):v+R.height>o.y+R.height&&f({x:o.x,y:Math.min(480-R.height,v),targetX:o.x,targetY:v})},[o.x,o.y,u]),C={camera:o,setCamera:f,getCameraPosition:d,updateCamera:h,clampCamera:p,getClampedCamera:a,ensurePlayerVisible:w,getViewport:u,isInView:b};return l.jsx(Pe.Provider,{value:C,children:e})},ye=[[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,1,1,1,1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,1,3,1,1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,1,1,1,1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,6,6,6,6,6,6,7]],te={level1:{id:"level1",map:ye,width:32,height:12,tileSize:32,gravity:7.5,jumpForce:-12,moveSpeed:5,startPlayerX:57,startPlayerY:327,flagPoleX:26,flagPoleY:7}};function ae(e){return te[e]||te.level1}const Ee=ae("level1"),Q={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",Space:"start",r:"restart",Enter:"restart",Shift:"run",z:"jump",x:"run",a:"left",d:"right",w:"up",s:"down"};function fe({onInputChange:e,enabled:t=!0}){const[n,i]=c.useState({left:!1,right:!1,up:!1,down:!1,jump:!1,run:!1,duck:!1,pause:!1,restart:!1,start:!1}),r=c.useRef(new Set),s=c.useRef(null),o=c.useCallback(d=>{if(d.code!=="Space"&&!t||((["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(d.code)||Q[d.key])&&d.preventDefault(),document.activeElement?.tagName==="INPUT"))return;const p=Q[d.key];p&&!r.current.has(d.key)&&(r.current.add(d.key),i(a=>{const u={...a,[p]:!0};return e?.(u),p==="start"&&e?.({start:!0}),u}))},[t,e]),f=c.useCallback(d=>{if(!t)return;const h=Q[d.key];h&&(r.current.delete(d.key),i(p=>{const a={...p,[h]:!1};return e?.(a),h==="start"&&e?.({start:!1}),a}))},[t,e]);return c.useCallback((d,h)=>{d.preventDefault(),t&&(r.current.has(h.toString())||(r.current.add(h.toString()),i(p=>{const a={...p,[h]:!0};return e?.(a),a})))},[t,e]),c.useCallback((d,h)=>{d.preventDefault(),t&&(r.current.delete(h.toString()),i(p=>{const a={...p,[h]:!1};return e?.(a),a}))},[t,e]),c.useEffect(()=>{if(t)return window.addEventListener("keydown",o),window.addEventListener("keyup",f),()=>{window.removeEventListener("keydown",o),window.removeEventListener("keyup",f)}},[t,o,f]),l.jsx("div",{ref:s,"data-game-canvas":"true","data-input-enabled":t.toString(),style:{display:"none"},"aria-hidden":"true"})}class Me{audioContext=null;getContext(){return this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext}playTone(t,n,i="sine"){const r=this.getContext();r.state==="suspended"&&r.resume();const s=r.createOscillator(),o=r.createGain();s.connect(o),o.connect(r.destination),s.frequency.value=t,s.type=i,o.gain.setValueAtTime(.1,r.currentTime),o.gain.exponentialRampToValueAtTime(.01,r.currentTime+n),s.start(r.currentTime),s.stop(r.currentTime+n)}playJumpSound(){this.playTone(400,.1,"sine"),setTimeout(()=>this.playTone(600,.15,"sine"),100)}playCoinSound(){this.playTone(900,.05,"square"),setTimeout(()=>this.playTone(1200,.1,"square"),80)}playStompSound(){this.playTone(150,.1,"sawtooth")}playPowerUpSound(){const t=this.getContext();t.state==="suspended"&&t.resume(),[400,500,600,800].forEach((n,i)=>{setTimeout(()=>this.playTone(n,.2,"sine"),i*80)})}playBoostStartSound(){this.playTone(300,.1,"sine")}playBoostStopSound(){this.playTone(200,.15,"sawtooth")}playBoostDepletedSound(){this.playTone(100,.3,"sawtooth")}}const Ie=new Me,ne=(e,t)=>e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y,je=(e,t)=>{const n={x:e.x,y:e.y,width:e.width,height:e.height};let i=!1;for(let r=0;r<t.length&&!i;r++)for(let s=0;s<t[r].length&&!i;s++)if(t[r][s]!==L.AIR){const f={x:s*O,y:r*A,width:O,height:A};ne(n,f)&&(i=!0)}return i},Le=(e,t)=>{const n={x:e.x,y:e.y,width:e.width,height:e.height};let i=null;for(let r=0;r<t.length;r++)for(let s=0;s<t[r].length;s++){const o=t[r][s];if(o!==L.AIR){const f={x:s*O,y:r*A,width:O,height:A,type:o};if(ne(n,f)&&e.vy>=0){const d=e.y+e.height,h=f.y;d>=h&&(!i||h>i.y)&&(i=f)}}}i?(e.y=i.y-e.height,e.vy=0,e.isGrounded=!0,e.isJumping=!1,e.canJump=!0,i.type,L.QUESTION_BLOCK):e.isGrounded=!1},Z=()=>({x:50,y:E-A*2,width:O,height:A,vx:0,vy:0,state:"idle",isGrounded:!0,isSmall:!1,isBig:!1,isFire:!1,isPowerUpActive:!1,powerUpType:"none",isJumping:!1,canJump:!0,isDucking:!1,facingLeft:!0,isRunning:!1,isSprinting:!1,boostMeter:B.maxMeter,animationFrame:0,animationState:"idle",platformsCollided:[],lives:se}),Ae=(e,t={})=>{e.isGrounded||(e.vy+=X.acceleration,e.vy>X.velocity&&(e.vy=X.velocity),e.vx*=X.friction),e.vx*=G.airResistance;const n=e.isRunning?G.runSpeed+(e.isSprinting?G.runBoost:0):G.maxSpeed;return e.vx=Math.max(-n,Math.min(n,e.vx)),Math.abs(e.vx)<G.acceleration&&(e.vx=0),e.x+=e.vx,e.y+=e.vy,e.x=Math.max(0,Math.min(e.x,y-e.width)),e.y>E},Te=(e,t={})=>{const n=t.left??!1,i=t.right??!1;t.run??e.isRunning,e.isSprinting,n&&(e.vx-=G.acceleration),i&&(e.vx+=G.acceleration),e.vx*=G.friction,Math.abs(e.vx)<G.acceleration&&(e.vx=0),n?e.facingLeft=!0:i&&(e.facingLeft=!1)},Fe=(e,t)=>{if(!e.isGrounded)return e.animationState=e.vy<0?"jump":"fall",0;if(e.isDucking)return e.animationState="duck",0;const n=Math.abs(e.vx);if(n>G.acceleration){const i=n>=G.runSpeed?"run":"walk";return e.animationState=i,(e.animationFrame+1)%we[i]}else return e.animationState="idle",0},Ge=e=>{e.isRunning&&e.isSprinting?(e.boostMeter-=B.decayRate,e.boostMeter<=0&&(e.isSprinting=!1,e.isRunning=!1,e.boostMeter=0,Ie.playBoostDepletedSound())):!e.isSprinting&&e.boostMeter<B.maxMeter&&(e.boostMeter+=B.rechargeRate,e.boostMeter>B.maxMeter&&(e.boostMeter=B.maxMeter))},Oe=()=>{const e=[],t=Math.floor(E/A)-2;for(let n=0;n<E/A;n++){const i=[];for(let r=0;r<y/O;r++)n===t?i.push(L.GROUND):i.push(L.AIR);e.push(i)}return e},de=c.createContext(null);function Be({children:e}){const[t,n]=c.useState(Z()),[i,r]=c.useState({currentLevel:"level1",isPaused:!1,score:be,highScore:Number(localStorage.getItem(ve.HIGH_SCORE))||0,lives:se,level:1,gameState:k.IDLE,player:t,platforms:Oe(),enemies:[],collectibles:[],camera:{x:0,y:0,targetX:0,targetY:0},input:{left:!1,right:!1,up:!1,down:!1,jump:!1,run:!1,duck:!1,pause:!1,restart:!1,start:!1},time:Se}),s=i,o=s.isPaused;s.input;const f=c.useRef(void 0),d=c.useRef(null);d.current=c.useCallback(()=>{if(!o){const g=t.isGrounded&&!i.input.jump,T=i.input.left||i.input.right,N=i.input.run;t.isRunning=N,t.isSprinting=T&&N&&t.boostMeter>0,t.isSprinting?t.boostMeter=Math.max(0,t.boostMeter-B.decayRate):t.boostMeter=Math.min(B.maxMeter,t.boostMeter+B.rechargeRate);const q=Ae(t,i.input);if(t.isGrounded=!1,t.platformsCollided=[],je(t,i.platforms))for(let F=0;F<i.platforms.length;F++)for(let j=0;j<i.platforms[F].length;j++){const oe=i.platforms[F][j];if(oe!==L.AIR){const ue={x:t.x,y:t.y,width:t.width,height:t.height},ce={x:j*O,y:F*A,width:O,height:A};ne(ue,ce)&&t.platformsCollided.push(oe)}}if(Le(t,i.platforms),i.input.up&&g?(t.vy=pe.force,t.isJumping=!0,t.isGrounded=!1,(i.input.left||i.input.right)&&(t.facingLeft=i.input.left)):i.input.up||(i.input.left?t.facingLeft=!0:i.input.right&&(t.facingLeft=!1)),Te(t,i.input),Ge(t),q){const F=i.lives-1;if(r(j=>({...j,lives:F})),F<=0)r(j=>({...j,gameState:k.GAME_OVER}));else{const j=Z();j.x=50,j.y=E-A*2,j.width=O,j.height=A,n(j),f.current=0}}const ie=Fe(t,t.isSprinting);f.current=ie,n({...t,animationFrame:ie});let V=t.x-y/2+t.width/2;V=Math.max(0,Math.min(V,y*3)),r(F=>({...F,camera:{x:F.camera.x+(V-F.camera.x)*me,y:0,targetX:V,targetY:0}}))}f.current=requestAnimationFrame(d.current)},[t,i,o]),c.useEffect(()=>{if(o){console.log("Paused");return}return console.log("Starting gameloop"),f.current=requestAnimationFrame(d.current),()=>{d.current&&(console.log("Stopping gameloop"),cancelAnimationFrame(f.current))}},[o]);const h=c.useCallback(()=>{console.debug("Starting game"),r(g=>({...g,gameState:k.PLAYING,isPaused:!1})),b({left:!1,right:!1,up:!1,down:!1,jump:!1,run:!1,duck:!1,pause:!1,restart:!1,start:!1})},[]),p=c.useCallback(()=>{const g=Z();g.x=50,g.y=E-A*2,g.width=O,g.height=A,n(g),f.current=0,r(T=>({...T,gameState:k.PLAYING,isPaused:!1}))},[]),a=c.useCallback(()=>{r(g=>({...g,isPaused:!1}))},[]),u=c.useCallback(()=>{r(g=>({...g,isPaused:!0}))},[]),b=c.useCallback(g=>{s.gameState===k.IDLE&&(g.start===!0||g.restart===!0)&&h(),r(T=>({...T,input:{...T.input,...g}}))},[r,h,i]),w=c.useCallback(()=>{},[]),C=c.useCallback(()=>{},[]),m=c.useCallback(()=>{},[]),v=c.useCallback(()=>{const g=ae(i.currentLevel),T=g.startPlayerX+(g.flagPoleX||0)*(O*2);t.x+t.width>=T&&r(N=>({...N,gameState:k.VICTORY}))},[t.x,t.width,i.currentLevel]),R=c.useCallback(()=>{r(g=>({...g,level:g.level+1})),p()},[p]),P=c.useCallback(g=>{r(T=>({...T,score:T.score+g}))},[]),M=c.useCallback(()=>{},[]),I={startGame:h,restartLevel:p,resumeGame:a,pauseGame:u,setInput:b,updatePlayer:M,checkCollisions:w,updateEnemies:C,checkWinCondition:v,checkLoseCondition:m,nextLevel:R,addScore:P};return l.jsx(ke,{levelWidth:3200,levelHeight:480,children:l.jsxs(de.Provider,{value:{state:i,actions:I},children:[l.jsx(fe,{onInputChange:b}),e]})})}function xe(){const e=c.useContext(de);if(!e)throw new Error("useSuperMario must be used within SuperMarioGameProvider");return{...e,...e.state,...e.actions}}const J=S.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 5px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: all 0.1s ease;

  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }

  ${e=>e.$active&&`
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  `}
`;S.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(2, 60px);
  gap: 0;
`;const Ne=S.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`,De=S(J)`
  width: 80px;
  height: 80px;
  font-size: 32px;
  border-color: ${e=>e.$primary?"rgba(255, 255, 255, 0.9)":"rgba(255, 255, 255, 0.6)"};

  &:active {
    background: ${e=>e.$primary?"rgba(255, 100, 100, 0.4)":"rgba(255, 255, 255, 0.3)"};
  }
`,_e=S(J)`
  width: 50px;
  height: 50px;
  font-size: 20px;
`;S(J)`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  font-size: 16px;
  z-index: 1000;
`;const Ue=S.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(2, 60px);
  gap: 0;
`;function He({onInput:e,hideOnDesktop:t=!0}){const[n,i]=c.useState(new Set);c.useEffect(()=>{const o=f=>{t&&f.preventDefault()};return t&&(window.addEventListener("touchstart",o,{passive:!1}),window.addEventListener("touchmove",o,{passive:!1}),window.addEventListener("touchend",o,{passive:!1})),()=>{t&&(window.removeEventListener("touchstart",o),window.removeEventListener("touchmove",o),window.removeEventListener("touchend",o))}},[t]);const r=c.useCallback((o,f)=>{if(o.preventDefault(),!n.has(f)){const d=new Set(n);d.add(f),i(d),e(f,!0)}},[n,e]),s=c.useCallback((o,f)=>{o.preventDefault();const d=new Set(n);d.delete(f),i(d),e(f,!1)},[n,e]);return l.jsxs(l.Fragment,{children:[t&&l.jsx(Ue,{children:[["Up","up"],["Left","left"],["Down","down"],["Right","right"]].map(([o,f])=>l.jsxs(J,{$active:n.has(f),onTouchStart:d=>r(d,f),onTouchEnd:d=>s(d,f),"aria-label":o,children:[o==="Up"&&"↑",o==="Down"&&"↓",o==="Left"&&"←",o==="Right"&&"→"]},f))}),t&&l.jsxs(Ne,{children:[l.jsx(De,{id:re.JUMP,$primary:!0,$active:n.has("jump"),onTouchStart:o=>r(o,"jump"),onTouchEnd:o=>s(o,"jump"),"aria-label":"Jump",children:"A"}),l.jsx(_e,{id:re.RUN,$active:n.has("run"),onTouchStart:o=>r(o,"run"),onTouchEnd:o=>s(o,"run"),"aria-label":"Run",children:"B"})]})]})}const Y=S.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 20;
  padding: 20px;
  box-sizing: border-box;
  backdrop-filter: ${e=>e.gameState===k.PAUSED?"blur(4px)":"none"};
  transition: background 0.3s ease;
`,Ve=S.div`
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeSlideIn 0.5s ease-out;
`,Xe=S.div`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: pulse 1s ease-in-out infinite;
`,Ye=S.div`
  background: linear-gradient(
    135deg,
    rgba(220, 38, 38, 0.9) 0%,
    rgba(153, 27, 27, 0.95) 100%
  );
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.5);
  animation: shake 0.5s ease-out;
`,Ke=S.div`
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.9) 0%,
    rgba(234, 179, 8, 0.95) 100%
  );
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: #333;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.5);
  animation: bounceIn 0.6s ease-out;
`,$e=S.div`
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.9) 0%,
    rgba(37, 99, 235, 0.95) 100%
  );
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.5);
  animation: fadeSlideIn 0.5s ease-out;
`,_=S.h1`
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 900;
  margin-bottom: 24px;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
`,U=S.p`
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 600;
  margin-bottom: 32px;
  opacity: 0.95;
`,K=S.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 32px;
`,D=S.p`
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`,$=S.p`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  color: #ffd700;
`,W=S.div`
  margin-top: 40px;
  font-size: clamp(14px, 2vw, 18px);
  opacity: 0.9;
  line-height: 1.8;
`,x=S.code`
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 6px;
  font-family: "Courier New", monospace;
  font-weight: bold;
  margin: 0 4px;
`;S.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  animation: float 6s ease-in-out infinite;
`;S.div`
  position: absolute;
  background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
  border-radius: 50% 50% 0 0;
`;const H=S.div`
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-5px);
    }
    40%,
    80% {
      transform: translateX(5px);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;function We({gameState:e,score:t,highScore:n=0,level:i,inputActions:r={},onRestart:s,onResume:o,onNextLevel:f,onStart:d}){const h=t.toLocaleString();n.toLocaleString();const p=t>=n,a=()=>{r?.setInput&&r.setInput({start:!0}),d&&d()},u=()=>l.jsx(Ve,{gameState:e,children:l.jsxs(H,{onClick:a,children:[l.jsx(_,{children:"🍄 Super Mario 🍄"}),l.jsx(U,{children:"Arcade Platformer Adventure"}),l.jsxs(K,{children:[l.jsx(D,{children:"Final Score"}),l.jsx($,{children:h}),p&&l.jsx(D,{style:{marginTop:"8px",color:"#ffd700"},children:"🏆 New High Score!"})]})]})}),b=()=>l.jsx(Y,{gameState:e,children:l.jsx(Xe,{gameState:e,children:l.jsxs(H,{children:[l.jsx(_,{children:"⏸️ PAUSED"}),l.jsx(U,{children:"Press SPACE to Resume"}),l.jsx(W,{children:l.jsxs("div",{children:[l.jsx("span",{children:"Use arrow keys to move:"}),l.jsx(x,{children:"←"}),l.jsx(x,{children:"→"})," to move |",l.jsx(x,{children:"↑"})," to jump |",l.jsx(x,{children:"SHIFT"})," to run"]})})]})})}),w=()=>l.jsx(Y,{gameState:e,children:l.jsx(Ye,{gameState:e,children:l.jsxs(H,{children:[l.jsx(_,{children:"💀 Game Over 💀"}),l.jsx(U,{children:"Don't worry, you can try again!"}),l.jsxs(K,{children:[l.jsx(D,{children:"Final Score"}),l.jsx($,{children:h}),p&&l.jsx(D,{style:{marginTop:"8px",color:"#ffd700"},children:"🏆 New High Score!"})]}),l.jsxs(W,{children:["Press ",l.jsx(x,{children:"SPACE"})," to Restart"]})]})})}),C=()=>l.jsx(Y,{gameState:e,children:l.jsx(Ke,{gameState:e,children:l.jsxs(H,{children:[l.jsx(_,{children:"🎉 Victory! 🎉"}),l.jsxs(U,{children:["Level ",i," Complete!"]}),l.jsxs(K,{children:[l.jsx(D,{children:"Score"}),l.jsx($,{children:h})]}),l.jsxs(W,{children:["Press ",l.jsx(x,{children:"SPACE"})," to Continue"]})]})})}),m=()=>l.jsx(Y,{gameState:e,children:l.jsx($e,{gameState:e,children:l.jsxs(H,{children:[l.jsxs(_,{children:["⭐ Level ",i," Complete!"]}),l.jsx(U,{children:"Great job! Keep it up!"}),l.jsxs(K,{children:[l.jsx(D,{children:"Score"}),l.jsx($,{children:h})]}),l.jsxs(W,{children:["Press ",l.jsx(x,{children:"SPACE"})," for Next Level"]})]})})});return l.jsxs(l.Fragment,{children:[e===k.IDLE&&u(),e===k.PAUSED&&b(),e===k.GAME_OVER&&w(),e===k.VICTORY&&C(),e===k.LEVEL_TRANSITION&&m()]})}function Je({width:e,height:t,renderCallback:n}){const i=c.useRef(null);return c.useEffect(()=>{const s=i.current?.getContext("2d");if(s){const o=requestAnimationFrame(()=>{n(s)});return()=>{cancelAnimationFrame(o)}}},[e,t,n]),l.jsx("canvas",{ref:i,width:e,height:t,style:{width:"100%",height:"100%"}})}function qe(e,t,n,i,r=!1){if(r)return;e.save(),e.translate(t+16,n+16);const s=i*.15,o=1+Math.sin(i*.1)*.1;e.scale(o,o),e.rotate(s);const f=e.createRadialGradient(0,0,0,0,0,16);f.addColorStop(0,"#ffd700"),f.addColorStop(.7,"#daa520"),f.addColorStop(1,"#b8860b"),e.fillStyle=f,e.beginPath(),e.arc(0,0,16,0,Math.PI*2),e.fill(),e.strokeStyle="#b8860b",e.lineWidth=2,e.stroke(),e.fillStyle="rgba(255, 255, 255, 0.7)",e.beginPath(),e.ellipse(-6,-6,4,4,0,0,Math.PI*2),e.fill(),e.fillStyle="#daa520",e.beginPath(),e.ellipse(0,0,8,8,0,0,Math.PI*2),e.fill(),e.fillStyle="#8b4513",e.font="bold 10px Arial",e.textAlign="center",e.textBaseline="middle",e.fillText("$",0,1),e.restore()}function Qe(e,t,n,i,r=!1){const s=r?1+i*5e-4:1;e.save(),e.translate(t+20,n+30),e.scale(s,s),e.fillStyle="rgba(0, 0, 0, 0.2)",e.beginPath(),e.ellipse(0,55,15,5,0,0,Math.PI*2),e.fill();const o=e.createLinearGradient(0,0,0,60);o.addColorStop(0,"#f5deb3"),o.addColorStop(.5,"#e6be8a"),o.addColorStop(1,"#d4a574"),e.fillStyle=o,e.beginPath(),e.roundRect(-8,20,16,40,4),e.fill();const f=e.createLinearGradient(-15,0,15,0);f.addColorStop(0,"#c0392b"),f.addColorStop(.5,"#e74c3c"),f.addColorStop(1,"#c0392b"),e.fillStyle=f,e.beginPath(),e.arc(0,0,20,.5,Math.PI,!0),e.fill(),e.fillStyle="white",e.beginPath(),e.ellipse(-4,-3,6,4,-.3,0,Math.PI*2),e.fill(),e.beginPath(),e.ellipse(4,-3,6,4,.3,0,Math.PI*2),e.fill(),e.restore()}function Ze(e,t,n,i){const r=i*.02;e.save(),e.translate(t+20,n+40),e.rotate(r),e.fillStyle="rgba(0, 0, 0, 0.2)",e.beginPath(),e.ellipse(0,55,18,5,0,0,Math.PI*2);const s=[["#ff6b6b","#ff8e8e","#ffd93d","#ff6b6b"],["#ffd93d","#ff6b6b","#ffd93d","#ff6b6b"],["#ff6b6b","#ffd93d","#ff6b6b","#ffd93d"],["#ff6b6b","#ff6b6b","#ffd93d","#ff6b6b"]];for(let o=0;o<4;o++)e.fillStyle=s[o][1],e.beginPath(),e.ellipse(0,-o*16,16,10,0,0,Math.PI),e.fill(),e.fillStyle=s[o][3],e.beginPath(),e.ellipse(0,-o*16,16,10,0,Math.PI,Math.PI*2),e.fill(),e.fillStyle=s[o][0],e.beginPath(),e.arc(0,-o*16-10,8,0,Math.PI*2),e.fill(),e.fillStyle=s[o][2],e.beginPath(),e.ellipse(0,-o*16-10,6,8,0,0,Math.PI*2),e.fill();e.fillStyle="#2ecc71",e.beginPath(),e.roundRect(-4,0,8,20,2),e.fill(),e.restore()}function z(e,t,n,i,r,s=0){e.save(),e.fillStyle="rgba(255, 255, 255, 0.9)",e.beginPath(),e.arc(t,n,i/3,0,Math.PI*2),e.arc(t+i/3,n-10,i/2.5,0,Math.PI*2),e.arc(t+i/2,n,i/2.5,0,Math.PI*2),e.arc(t+i*2/3,n-5,i/3,0,Math.PI*2),e.fill();const o=Math.sin(s*.05)*20;o!==0&&e.translate(o,0),e.restore()}function ee(e,t,n,i,r,s="#4a7c4e"){e.save(),e.fillStyle=s,e.beginPath(),e.moveTo(t-i/2,n),e.quadraticCurveTo(t,n-r,t+i/2,n),e.closePath(),e.fill(),e.restore()}function ze(e,t,n,i,r){e.save(),e.fillStyle="#2d5a3d",e.beginPath(),e.arc(t,n,i/2,0,Math.PI*2),e.arc(t-i/3,n+5,i/3,0,Math.PI*2),e.arc(t+i/3,n+5,i/3,0,Math.PI*2),e.fill(),e.restore()}function et(){const{gameState:e,actions:t,state:n}=xe(),{score:i,highScore:r,lives:s,level:o,time:f,player:d,camera:h,platforms:p,enemies:a,collectibles:u,currentLevel:b}=n,w=c.useCallback(m=>{m.clearRect(0,0,y,E);const v=te[b]||Ee;tt(m,e,d.animationFrame),nt(m,e,v,n.platforms,h,ge),at(m,e,b,u,h,d.animationFrame);const R=d.x-h.x,P=d.y-h.y;Re(m,R,P,d.width,d.height,d.state,d.animationFrame,d.facingLeft,d.isSmall,d.isFire),ft(m,i,r,s,o,f)},[n,e,d,h,u,a]),C=c.useCallback((m,v)=>{v?t.setInput({[m]:!0}):t.setInput({[m]:!1})},[t.setInput]);return l.jsxs(l.Fragment,{children:[l.jsx(Je,{width:y,height:E,renderCallback:w}),l.jsx(He,{onInput:C,hideOnDesktop:!0}),l.jsx(We,{gameState:e,score:i,highScore:r,level:o,inputActions:{setInput:t.setInput},onRestart:t.restartLevel,onResume:t.resumeGame,onNextLevel:t.nextLevel,onStart:t.startGame}),l.jsx(fe,{onInputChange:t.setInput,enabled:e===k.PLAYING||e===k.PAUSED||e===k.IDLE})]})}function tt(e,t,n){const i=e.createLinearGradient(0,0,0,E);i.addColorStop(0,"#5c94fc"),i.addColorStop(1,"#87CEEB"),e.fillStyle=i,e.fillRect(0,0,y,E),z(e,0,50,100,30,n*.02),z(e,y*.3,80,80,25,n*.03),z(e,y*.6,60,120,35,n*.01),ee(e,0,E-40,200,60,"#4a7c4e"),ee(e,y*.25,E-30,150,45,"#5a8c5e"),ee(e,y*.5,E-50,180,55,"#3a6c3e"),ze(e,0,E-40,y)}function nt(e,t,n,i,r,s){if(!t||!n||!i)return;e.save();const o=r.x-n.width*s,f=r.y-n.height*s;for(let d=0;d<n.height;d++)for(let h=0;h<n.width;h++){const p=i[d]?.[h]??void 0;if(!p)continue;const a=h*s+o,u=d*s+f;if(a+s>r.x&&a<r.x+y&&u+s>r.y&&u<r.y+E)switch(p){case L.AIR:break;case L.GROUND:it(e,a,u,s);break;case L.BRICK:ot(e,a,u,s);break;case L.QUESTION_BLOCK:rt(e,a,u,s);break;case L.PIPE:lt(e,a,u,s);break;case L.FLAG_POLE:st(e,a,u,s);break;case L.BLOCK:break}}e.restore()}function it(e,t,n,i){e.fillStyle="#8B4513",e.fillRect(t,n,i,i),e.fillStyle="#654321",e.fillRect(t+2,n+2,i-4,i-4)}function ot(e,t,n,i){e.fillStyle="#C0392B",e.fillRect(t,n,i,i),e.strokeStyle="#8B0000",e.lineWidth=2,e.strokeRect(t,n,i,i),e.fillStyle="#E74C3C",e.fillRect(t+4,n+4,i-8,i-8)}function rt(e,t,n,i){e.fillStyle="#F1C40F",e.fillRect(t,n,i,i),e.strokeStyle="#DAA520",e.lineWidth=2,e.strokeRect(t,n,i,i),e.fillStyle="#DAA520",e.font="bold 20px Arial",e.textAlign="center",e.textBaseline="middle",e.fillText("?",t+i/2,n+i/2)}function lt(e,t,n,i){const r=i*3;e.fillStyle="#228B22",e.fillRect(t+4,n,i-8,r),e.fillStyle="#32CD32",e.fillRect(t,n-10,i,16),e.strokeStyle="#006400",e.lineWidth=2,e.strokeRect(t,n-10,i,16),e.strokeRect(t+4,n,i-8,r)}function st(e,t,n,i){e.fillStyle="#90EE90",e.fillRect(t+i/2-3,n,6,i*5),e.fillStyle="#FFD700",e.beginPath(),e.arc(t+i/2,n+15,8,0,Math.PI*2),e.fill(),e.fillStyle="#FF0000",e.beginPath(),e.moveTo(t+i/2+3,n+25),e.lineTo(t+i*3,n+i*1.5),e.lineTo(t+i/2+3,n+i*2),e.closePath(),e.fill()}function at(e,t,n,i,r,s){!t||!n||!i||i.forEach(o=>{if(o.collected)return;const f=o.x-r.x,d=o.y-r.y;if(f>-50&&f<y+50&&d>-50&&d<E+50)switch(o.type){case"coin":qe(e,f,d,s,!1);break;case"mushroom":Qe(e,f,d,s,!1);break;case"fire-flower":Ze(e,f,d,s);break}})}function ft(e,t,n,i,r,s,o){e.save(),e.fillStyle="#FFD700",e.font="bold 24px Arial",e.textAlign="left",e.textBaseline="top",e.fillText(`Score: ${t.toLocaleString()}`,20,25),e.fillStyle="#CCCCCC",e.font="18px Arial",e.fillText(`High Score: ${n.toLocaleString()}`,20,50),e.fillStyle="#FFD700",e.font="bold 20px Arial",e.fillText(`🍄 Lives: ${i}`,20,75),e.textAlign="right",e.fillStyle="#FFA500",e.font="bold 24px Arial",e.fillText(`Level: ${r}`,y-150,25),e.fillStyle=s<=30?"#FF6B6B":"#4CAF50",e.font="bold 24px Arial",e.fillText(`Time: ${s}s`,y-150,50),e.restore()}const dt=S.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
`,ut=S.div`
  width: 100%;
  max-width: 832px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;function gt(){return[{title:"Super Mario – Arcade Style Game"},{name:"description",content:"Play Super Mario clone in your browser. Classic platformer action with smooth gameplay."},{name:"viewport",content:"width=device-width, initial-scale=1"}]}const mt=he(function(){return l.jsx(dt,{children:l.jsx(ut,{children:l.jsx(Be,{children:l.jsx(et,{})})})})});export{mt as default,gt as meta};
