import{a as p,p as e,w as fe}from"./chunk-EPOLDU6W-BRx3iYW4.js";import{a as s}from"./styled-components.browser.esm-AwWoiJTA.js";const G={easy:{rows:9,cols:9,mines:10,cellSize:30,colors:{hidden:"#b0b0b0",revealed:"#d0d0d0",numbers:{1:"#1976d2",2:"#388e3c",3:"#d32f2f",4:"#7b1fa2",5:"#795548",6:"#0097a7",7:"#000000",8:"#9e9e9e"}},boardSize:600},medium:{rows:16,cols:16,mines:40,cellSize:30,colors:{hidden:"#b0b0b0",revealed:"#d0d0d0",numbers:{1:"#1976d2",2:"#388e3c",3:"#d32f2f",4:"#7b1fa2",5:"#795548",6:"#0097a7",7:"#000000",8:"#9e9e9e"}},boardSize:480},hard:{rows:16,cols:30,mines:99,cellSize:20,colors:{hidden:"#b0b0b0",revealed:"#d0d0d0",numbers:{1:"#1976d2",2:"#388e3c",3:"#d32f2f",4:"#7b1fa2",5:"#795548",6:"#0097a7",7:"#000000",8:"#9e9e9e"}},boardSize:600}},xe="🚩",z={HIGH_SCORES:"minesweeper_high_scores",PREFERRED_DIFFICULTY:"minesweeper_preferred_difficulty"};class ge{audioContext=null;getContext(){return this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext}playTone(r,y,h="sine"){const c=this.getContext();c.state==="suspended"&&c.resume();const x=c.createOscillator(),i=c.createGain();x.connect(i),i.connect(c.destination),x.frequency.value=r,x.type=h,i.gain.setValueAtTime(.1,c.currentTime),i.gain.exponentialRampToValueAtTime(.01,c.currentTime+y),x.start(c.currentTime),x.stop(c.currentTime+y)}playFirstClick(){this.playTone(440,.1,"sine")}playRevealEmpty(){this.playTone(523.25,.15,"sine"),setTimeout(()=>this.playTone(659.25,.15,"sine"),50)}playRevealNumber(){this.playTone(330,.1,"sine")}playFlag(){this.playTone(880,.08,"square")}playUnflag(){this.playTone(440,.08,"square")}playGameOver(){const r=this.getContext();r.state==="suspended"&&r.resume(),[392,349,330,294].forEach((h,c)=>{setTimeout(()=>this.playTone(h,.15,"sawtooth"),c*100)})}playWin(){const r=this.getContext();r.state==="suspended"&&r.resume(),[523.25,659.25,783.99,1046.5].forEach((h,c)=>{setTimeout(()=>this.playTone(h,.2,"triangle"),c*100)})}}const k=new ge,oe=p.createContext(null);function me({children:o}){const[r,y]=p.useState("easy"),[h,c]=p.useState(!1),[x,i]=p.useState("idle"),[m,j]=p.useState(-1),[v,T]=p.useState(0),[S,I]=p.useState([]),[b,R]=p.useState([]),[M,K]=p.useState([]),[$,H]=p.useState({easy:0,medium:0,hard:0}),g=p.useRef(null),E=p.useRef(!1),[Q,X]=p.useState(!1);p.useEffect(()=>{const n=localStorage.getItem(z.HIGH_SCORES),t=localStorage.getItem(z.PREFERRED_DIFFICULTY);if(n)try{H(JSON.parse(n))}catch(d){console.error("Failed to parse high scores",d)}t&&["easy","medium","hard"].includes(t)&&y(t)},[]),p.useEffect(()=>{localStorage.setItem(z.HIGH_SCORES,JSON.stringify($))},[$]);const Z=p.useCallback(n=>{localStorage.setItem(z.PREFERRED_DIFFICULTY,n),y(n)},[]),ie=p.useCallback(n=>{const t=G[r],d=[];for(let a=0;a<t.rows;a++){const l=[];for(let u=0;u<t.cols;u++)l.push({x:u,y:a,mine:!1,value:0,revealed:!1,flagged:!1,hidden:!0});d.push(l)}const C=n?Array.from({length:t.rows*t.cols},(a,l)=>l).filter(a=>{const l={x:a%t.cols,y:Math.floor(a/t.cols)};return!(l.x===n.x&&l.y===n.y)}):[];let f=0;for(;f<t.mines&&C.length>0;){const a=Math.floor(Math.random()*C.length),l=C.splice(a,1)[0],u={x:l%t.cols,y:Math.floor(l/t.rows)};d[u.y][u.x].mine=!0,f++}for(let a=0;a<t.rows;a++)for(let l=0;l<t.cols;l++)if(!d[a][l].mine){let u=0;for(let w=-1;w<=1;w++)for(let P=-1;P<=1;P++){const F=a+w,B=l+P;F>=0&&F<t.rows&&B>=0&&B<t.cols&&d[F][B].mine&&u++}d[a][l].value=u}return d},[r]),L=p.useCallback((n,t,d,C)=>{const f=G[r];if(t<0||t>=f.cols||d<0||d>=f.rows)return n;const a=n[d][t];if(a.revealed||a.flagged)return n;let l=n.map(u=>[...u]);if(l[d][t]={...a,revealed:!0,hidden:!1},a.value>0)return l;for(let u=-1;u<=1;u++)for(let w=-1;w<=1;w++)l=L(l,t+w,d+u,C);return l},[r]),_=p.useCallback(n=>{const t=G[r],d=t.rows*t.cols-t.mines;return n.flat().filter(f=>f.revealed&&!f.mine).length===d},[r]),N=p.useCallback(()=>{i("playing"),T(0),R([]),K([]),E.current=!1,X(!1),g.current&&(clearInterval(g.current),g.current=null);const n=G[r],t=[];for(let d=0;d<n.rows;d++){const C=[];for(let f=0;f<n.cols;f++)C.push({x:f,y:d,mine:!1,value:0,revealed:!1,flagged:!1,hidden:!0});t.push(C)}I(t),j(n.mines),g.current=setInterval(()=>{T(d=>d>=999?d:E.current?d+1:(E.current=!0,k.playFirstClick(),0))},1e3)},[r]),A=p.useCallback(()=>{g.current&&(clearInterval(g.current),g.current=null),k.playFirstClick(),N()},[N]),le=p.useCallback(()=>{const n=["easy","medium","hard"],t=n.indexOf(r),d=n[(t+1)%3];Z(d),A()},[r,Z,A]),ce=p.useCallback(()=>{c(n=>!n),g.current&&(h?g.current=setInterval(()=>{T(n=>n>=999?n:E.current?n+1:(E.current=!0,k.playFirstClick(),0))},1e3):g.current&&(clearInterval(g.current),g.current=null))},[h]),de=p.useCallback((n,t)=>{const d=G[r];if(n<0||n>=d.cols||t<0||t>=d.rows)return;const C=S[t][n];if(!(C.revealed||C.flagged)){if(E.current||(E.current=!0),!Q){const a=ie({x:n,y:t});I(a),R(w=>[...w,{x:n,y:t}]),X(!0);const l=a[t][n],u=[...b,{x:n,y:t}];if(_(a)){i("won"),g.current&&(clearInterval(g.current),g.current=null),k.playWin();const w=v;H(P=>{const F={...P,[r]:Math.max(P[r],w)};return localStorage.setItem(z.HIGH_SCORES,JSON.stringify(F)),F})}else{const w=L(a,n,t,u);I(w),l.value===0?k.playRevealEmpty():k.playRevealNumber()}return}if(C.mine){const f=S.map(a=>a.map(l=>({...l,revealed:!0,hidden:!1})));I(f),R(a=>[...a,{x:n,y:t}]),i("gameover"),g.current&&(clearInterval(g.current),g.current=null),k.playGameOver(),H(a=>{const l={...a,[r]:0};return localStorage.setItem(z.HIGH_SCORES,JSON.stringify(l)),l})}else{const f=[...b,{x:n,y:t}],a=L(S,n,t,f);if(I(a),R(f),C.value===0?k.playRevealEmpty():k.playRevealNumber(),_(a)){i("won"),g.current&&(clearInterval(g.current),g.current=null),k.playWin();const l=v;H(u=>{const w={...u,[r]:Math.max(u[r],l)};return localStorage.setItem(z.HIGH_SCORES,JSON.stringify(w)),w})}}}},[S,r,b,Q,L,_,g,E,v]),ue=p.useCallback((n,t)=>{const d=G[r];if(n<0||n>=d.cols||t<0||t>=d.rows||S[t][n].revealed)return;const f=M.some(u=>u.x===n&&u.y===t);if(!f&&m<=0)return;const a=f?M.filter(u=>u.x!==n||u.y!==t):[...M,{x:n,y:t}];K(a),j(u=>u+(f?1:-1));const l=S.map(u=>u.map(w=>({...w})));l[t][n].flagged=!f,I(l),f?k.playUnflag():k.playFlag()},[S,r,M,m]),pe={state:p.useMemo(()=>({grid:S,revealedCells:b,flaggedCells:M,mineCount:m,timer:v,gameStatus:x,isPaused:h,highScores:$,difficulty:r}),[S,b,M,m,v,x,h,$,r]),startGame:N,revealCell:de,flagCell:ue,toggleDifficulty:le,togglePause:ce,restartGame:A};return e.jsx(oe.Provider,{value:pe,children:o})}function O(){const o=p.useContext(oe);if(!o)throw new Error("useMinesweeper must be used within MinesweeperGameProvider");return{...o,...o.state}}const he=s.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background-color: #1a1a2e;
  border-bottom: 3px solid #16213e;
  margin-bottom: 16px;
  border-radius: 8px 8px 0 0;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
  }
`,ee=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`,te=s.span`
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
`,ae=s.span`
  font-size: 24px;
  font-weight: bold;
  font-family: monospace;
  color: #fff;
`,be=s(ae)`
  color: ${o=>o.$mineCount<=10?"#ff6b6b":"#4ecdc4"};
`,we=s(ae)`
  color: #ffe66d;
`,ye=s.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,ve=s.span`
  font-size: 14px;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
`,Ce=s.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`,je=s.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Se=s.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${o=>o.$active?o.$status==="playing"?"#4ade80":o.$status==="won"?"#22c55e":o.$status==="gameover"?"#ef4444":o.$status==="paused"?"#eab308":"#666":"#666"};
  animation: ${o=>o.$active&&o.$status==="playing"?"pulse 1s infinite":"none"};
  box-shadow: 0 0 8px currentColor;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`,ke=s.span`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`;function Ie(){const{state:o,restartGame:r,togglePause:y,toggleDifficulty:h}=O(),{mineCount:c,timer:x,gameStatus:i,difficulty:m,highScores:j,isPaused:v}=o,T=["easy","medium","hard"],S=T.indexOf(m),I=b=>b&&`${b.charAt(0).toUpperCase()+b.slice(1)} (${m} - ${j[b]} pts)`;return p.useEffect(()=>{const b=R=>{switch(R.key){case"Enter":h();break;case"r":case"R":r();break;case"Escape":(i==="playing"||i==="paused")&&y();break}};return window.addEventListener("keydown",b),()=>{window.removeEventListener("keydown",b)}},[h,r,y,i]),e.jsxs(he,{children:[e.jsxs(ee,{children:[e.jsx(te,{children:"Mines"}),e.jsx(be,{$mineCount:c,children:c===-1?"999":c})]}),e.jsxs(je,{children:[e.jsx(Se,{$active:i==="playing"||i==="gameover"||i==="won"||v,$status:v?"paused":i}),e.jsx(ke,{children:v?"Paused":i==="playing"?"Playing":i==="paused"?"Paused":i})]}),e.jsxs(ee,{children:[e.jsx(te,{children:"Time"}),e.jsx(we,{children:x.toString().padStart(3,"0")})]}),e.jsxs(ye,{children:[e.jsx(ve,{children:"Difficulty:"}),e.jsx(Ce,{onClick:h,value:m,role:"button",tabIndex:0,children:I(T[S])})]})]})}function Re({x:o,y:r}){const{grid:y,revealCell:h,flagCell:c}=O(),x=y[r]?.[o],i=()=>h(o,r),m=b=>{b.preventDefault(),c(o,r)},j=x?.revealed,v=x?.flagged,T=x?.mine,S=x?.value||0,I=b=>{const{colors:R}=G.easy;return R.numbers[b]||"#9e9e9e"};return j?T?e.jsx(ne,{children:e.jsx(Ge,{})}):e.jsx(ne,{children:e.jsx(Ee,{$color:I(S),children:S})}):v?e.jsx(ze,{onContextMenu:m,children:e.jsx(Me,{children:xe})}):e.jsx(Te,{onClick:i,onContextMenu:m})}const Te=s.div`
  width: 100%;
  height: 100%;
  background-color: #b0b0b0;
  border: 2px solid #a0a0a0;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: #c0c0c0;
    border-color: #b0b0b0;
  }
`,ne=s.div`
  width: 100%;
  height: 100%;
  background-color: #d0d0d0;
  border: 2px solid #c0c0c0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`,Ee=s.span`
  color: ${o=>o.$color};
  font-size: 18px;
`,Ge=s.span`
  width: 20px;
  height: 20px;
  background-color: #333;
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    background-color: #333;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;
  }
`,ze=s.div`
  width: 100%;
  height: 100%;
  background-color: #d0d0d0;
  border: 2px solid #c0c0c0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`,Me=s.span`
  color: #d32f2f;
`,Pe=s.div`
  display: grid;
  gap: 2px;
  padding: 16px;
  background-color: #2a2a2a;
  border: 4px solid #4a4a4a;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
`,re=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,Fe=s.p`
  color: #888;
  font-size: 14px;
  margin: 16px 0 24px 0;
  text-align: center;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;function De(){const{grid:o,revealCell:r}=O();if(!o||o.length===0)return e.jsx(re,{children:e.jsx(Fe,{children:"Press Enter to start the game"})});const y=o.length,h=o[0]?.length||0,c=x=>{const i=x.changedTouches[0],m=document.elementFromPoint(i.clientX,i.clientY);if(m&&m.dataset.x!==void 0&&m.dataset.y!==void 0){const j=parseInt(m.dataset.x),v=parseInt(m.dataset.y);r(j,v)}};return e.jsx(re,{children:e.jsx(Pe,{style:{gridTemplateColumns:`repeat(${h}, 1fr)`,gridTemplateRows:`repeat(${y}, 1fr)`},children:o.map((x,i)=>x.map((m,j)=>e.jsx(Re,{x:j,y:i,"data-x":j,"data-y":i,onTouchEnd:c},`${j}-${i}`)))})})}const Oe=s.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`,$e=s.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 48px;
  border-radius: 16px;
  text-align: center;
  border: 2px solid #4f46e5;
  box-shadow: 0 8px 32px rgba(79, 70, 229, 0.3);
  max-width: 90%;
  width: 440px;
  animation: slideIn 0.3s ease-out;
`,J=s.h2`
  color: #fff;
  font-size: 32px;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 600px) {
    font-size: 24px;
  }
`,U=s.p`
  color: #aaa;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
`,Y=s.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    background: linear-gradient(135deg, #7b68ee 0%, #8b5cf6 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  @media (max-width: 600px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`,se=s.div`
  color: #888;
  font-size: 14px;
  line-height: 2;
  margin-bottom: 32px;
  text-align: left;

  @media (max-width: 600px) {
    font-size: 12px;
    line-height: 1.8;
  }
`;s.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  color: #4ecdc4;
  font-family: "Courier New", monospace;
  font-weight: bold;
`;const q=s.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 600px) {
    padding: 16px;
  }
`,V=s.p`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
`,W=s.div`
  color: #4ecdc4;
  font-size: 28px;
  font-weight: bold;
  font-family: "Courier New", monospace;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`,He=s(J)`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Le=s(J)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Ye=`
• Left Click: Reveal a cell
• Right Click (or Long Press): Place/Remove a flag
• Press R: Restart game
• Press Enter: Start new game
• Press Esc: Pause/Resume
`,_e=`
• Tap: Reveal a cell
• Long Press: Place/Remove a flag
• Use the Difficulty button to change games
`;function Ne({className:o}){const{state:{gameStatus:r,grid:y,timer:h,difficulty:c,highScores:x},restartGame:i}=O(),m=G[c],j=()=>r==="idle"?Ye:"",v=()=>r==="idle"?_e:"";return r==="idle"||r==="gameover"||r==="won"?e.jsx(Oe,{className:o,children:e.jsxs($e,{children:[r==="idle"&&e.jsxs(e.Fragment,{children:[e.jsx(J,{children:"Minesweeper"}),e.jsx(U,{children:"Classic Minesweeper - Test Your Logic"}),e.jsxs(q,{children:[e.jsxs(V,{children:["Best Score (",c,"):"]}),e.jsxs(W,{children:[x[c]," seconds"]})]}),e.jsx(se,{children:j()}),e.jsx(se,{className:"mobile-only",children:v()}),e.jsx(Y,{onClick:i,children:"Start Game"})]}),r==="gameover"&&e.jsxs(e.Fragment,{children:[e.jsx(Le,{children:"Game Over!"}),e.jsx(U,{children:"You hit a mine!"}),e.jsxs(q,{children:[e.jsxs(V,{children:["Best Score (",c,"):"]}),e.jsxs(W,{children:[x[c]," seconds"]})]}),e.jsx(Y,{onClick:i,children:"Try Again"}),e.jsx(Y,{onClick:i,disabled:!0,children:"Play Again"})]}),r==="won"&&e.jsxs(e.Fragment,{children:[e.jsx(He,{children:"You Won!"}),e.jsxs(U,{children:["Excellent! You cleared the ",m.rows,"x",m.cols," board!"]}),e.jsxs(q,{children:[e.jsxs(V,{children:["Best Score (",c,"):"]}),e.jsxs(W,{children:[x[c]," seconds"]})]}),e.jsx(Y,{onClick:i,children:"Play Again"})]})]})}):null}const Ae=s.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
`,Be=s.h1`
  text-align: center;
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 32px;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.5s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`,Ue=s.div`
  text-align: center;
  color: white;
  opacity: 0.9;
  margin-top: 12px;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`,D=s.code`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
`;function qe(){const{state:o}=O(),{gameStatus:r,timer:y,mineCount:h,difficulty:c}=o;return e.jsxs(Ae,{children:[e.jsx(Be,{children:"💣 Minesweeper"}),e.jsx(Ie,{}),e.jsx(De,{}),e.jsx(Ne,{}),e.jsxs(Ue,{children:[e.jsxs("div",{children:[e.jsx("span",{children:"Controls:"})," ",e.jsx(D,{children:"Left Click"})," reveal •",e.jsx(D,{children:"Right Click"})," flag •",e.jsx(D,{children:"R"})," restart •",e.jsx(D,{children:"Esc"})," pause"]}),e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("span",{children:"Mobile:"})," ",e.jsx(D,{children:"Tap"})," reveal •",e.jsx(D,{children:"Long Press"})," flag"]})]})]})}const Ve=s.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
`,We=s.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;function Xe(){return[{title:"Minesweeper – Quick Match"},{name:"description",content:"Play Minesweeper in your browser. Test your logic and speed with this classic puzzle game."},{name:"viewport",content:"width=device-width, initial-scale=1"}]}const Ze=fe(function(){return e.jsx(Ve,{children:e.jsx(We,{children:e.jsx(me,{children:e.jsx(qe,{})})})})});export{Ze as default,Xe as meta};
