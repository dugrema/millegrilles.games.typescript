import{a as p,p as e,w as fe}from"./chunk-EPOLDU6W-BRx3iYW4.js";import{a as s}from"./styled-components.browser.esm-I7oew-DQ.js";const z={easy:{rows:9,cols:9,mines:10,cellSize:30,colors:{hidden:"#b0b0b0",revealed:"#d0d0d0",numbers:{1:"#1976d2",2:"#388e3c",3:"#d32f2f",4:"#7b1fa2",5:"#795548",6:"#0097a7",7:"#000000",8:"#9e9e9e"}},boardSize:600},medium:{rows:16,cols:16,mines:40,cellSize:30,colors:{hidden:"#b0b0b0",revealed:"#d0d0d0",numbers:{1:"#1976d2",2:"#388e3c",3:"#d32f2f",4:"#7b1fa2",5:"#795548",6:"#0097a7",7:"#000000",8:"#9e9e9e"}},boardSize:480},hard:{rows:16,cols:30,mines:99,cellSize:20,colors:{hidden:"#b0b0b0",revealed:"#d0d0d0",numbers:{1:"#1976d2",2:"#388e3c",3:"#d32f2f",4:"#7b1fa2",5:"#795548",6:"#0097a7",7:"#000000",8:"#9e9e9e"}},boardSize:600}},xe="🚩",M={HIGH_SCORES:"minesweeper_high_scores",PREFERRED_DIFFICULTY:"minesweeper_preferred_difficulty"};class ge{audioContext=null;getContext(){return this.audioContext||(this.audioContext=new(window.AudioContext||window.webkitAudioContext)),this.audioContext}playTone(r,y,g="sine"){const c=this.getContext();c.state==="suspended"&&c.resume();const m=c.createOscillator(),i=c.createGain();m.connect(i),i.connect(c.destination),m.frequency.value=r,m.type=g,i.gain.setValueAtTime(.1,c.currentTime),i.gain.exponentialRampToValueAtTime(.01,c.currentTime+y),m.start(c.currentTime),m.stop(c.currentTime+y)}playFirstClick(){this.playTone(440,.1,"sine")}playRevealEmpty(){this.playTone(523.25,.15,"sine"),setTimeout(()=>this.playTone(659.25,.15,"sine"),50)}playRevealNumber(){this.playTone(330,.1,"sine")}playFlag(){this.playTone(880,.08,"square")}playUnflag(){this.playTone(440,.08,"square")}playGameOver(){const r=this.getContext();r.state==="suspended"&&r.resume(),[392,349,330,294].forEach((g,c)=>{setTimeout(()=>this.playTone(g,.15,"sawtooth"),c*100)})}playWin(){const r=this.getContext();r.state==="suspended"&&r.resume(),[523.25,659.25,783.99,1046.5].forEach((g,c)=>{setTimeout(()=>this.playTone(g,.2,"triangle"),c*100)})}}const k=new ge,ae=p.createContext(null);function me({children:a}){const[r,y]=p.useState("easy"),[g,c]=p.useState(!1),[m,i]=p.useState("idle"),[h,w]=p.useState(-1),[C,T]=p.useState(0),[S,I]=p.useState([]),[v,R]=p.useState([]),[E,P]=p.useState([]),[F,L]=p.useState({easy:0,medium:0,hard:0}),x=p.useRef(null),G=p.useRef(!1),[Q,X]=p.useState(!1);p.useEffect(()=>{const n=localStorage.getItem(M.HIGH_SCORES),t=localStorage.getItem(M.PREFERRED_DIFFICULTY);if(n)try{L(JSON.parse(n))}catch(d){console.error("Failed to parse high scores",d)}t&&["easy","medium","hard"].includes(t)&&y(t)},[]),p.useEffect(()=>{localStorage.setItem(M.HIGH_SCORES,JSON.stringify(F))},[F]);const Z=p.useCallback(n=>{localStorage.setItem(M.PREFERRED_DIFFICULTY,n),y(n)},[]),ie=p.useCallback(n=>{const t=z[r],d=[];for(let o=0;o<t.rows;o++){const l=[];for(let u=0;u<t.cols;u++)l.push({x:u,y:o,mine:!1,value:0,revealed:!1,flagged:!1,hidden:!0});d.push(l)}const j=n?Array.from({length:t.rows*t.cols},(o,l)=>l).filter(o=>{const l={x:o%t.cols,y:Math.floor(o/t.cols)};return!(l.x===n.x&&l.y===n.y)}):[];let f=0;for(;f<t.mines&&j.length>0;){const o=Math.floor(Math.random()*j.length),l=j.splice(o,1)[0],u={x:l%t.cols,y:Math.floor(l/t.rows)};d[u.y][u.x].mine=!0,f++}for(let o=0;o<t.rows;o++)for(let l=0;l<t.cols;l++)if(!d[o][l].mine){let u=0;for(let b=-1;b<=1;b++)for(let D=-1;D<=1;D++){const O=o+b,U=l+D;O>=0&&O<t.rows&&U>=0&&U<t.cols&&d[O][U].mine&&u++}d[o][l].value=u}return d},[r]),Y=p.useCallback((n,t,d,j)=>{const f=z[r];if(t<0||t>=f.cols||d<0||d>=f.rows)return n;const o=n[d][t];if(o.revealed||o.flagged)return n;let l=n.map(u=>[...u]);if(l[d][t]={...o,revealed:!0,hidden:!1},o.value>0)return l;for(let u=-1;u<=1;u++)for(let b=-1;b<=1;b++)l=Y(l,t+b,d+u,j);return l},[r]),N=p.useCallback(n=>{const t=z[r],d=t.rows*t.cols-t.mines;return n.flat().filter(f=>f.revealed&&!f.mine).length===d},[r]),A=p.useCallback(()=>{i("playing"),T(0),R([]),P([]),G.current=!1,X(!1),x.current&&(clearInterval(x.current),x.current=null);const n=z[r],t=[];for(let d=0;d<n.rows;d++){const j=[];for(let f=0;f<n.cols;f++)j.push({x:f,y:d,mine:!1,value:0,revealed:!1,flagged:!1,hidden:!0});t.push(j)}I(t),w(n.mines),x.current=setInterval(()=>{T(d=>d>=999?d:G.current?d+1:(G.current=!0,k.playFirstClick(),0))},1e3)},[r]),B=p.useCallback(()=>{x.current&&(clearInterval(x.current),x.current=null),k.playFirstClick(),A()},[A]),le=p.useCallback(()=>{const n=["easy","medium","hard"],t=n.indexOf(r),d=n[(t+1)%3];Z(d),B()},[r,Z,B]),ce=p.useCallback(()=>{c(n=>!n),x.current&&(g?x.current=setInterval(()=>{T(n=>n>=999?n:G.current?n+1:(G.current=!0,k.playFirstClick(),0))},1e3):x.current&&(clearInterval(x.current),x.current=null))},[g]),de=p.useCallback((n,t)=>{const d=z[r];if(n<0||n>=d.cols||t<0||t>=d.rows)return;const j=S[t][n];if(!(j.revealed||j.flagged)){if(G.current||(G.current=!0),!Q){const o=ie({x:n,y:t});I(o),R(b=>[...b,{x:n,y:t}]),X(!0);const l=o[t][n],u=[...v,{x:n,y:t}];if(N(o)){i("won"),x.current&&(clearInterval(x.current),x.current=null),k.playWin();const b=C;L(D=>{const O={...D,[r]:Math.max(D[r],b)};return localStorage.setItem(M.HIGH_SCORES,JSON.stringify(O)),O})}else{const b=Y(o,n,t,u);I(b),l.value===0?k.playRevealEmpty():k.playRevealNumber()}return}if(j.mine){const f=S.map(o=>o.map(l=>({...l,revealed:!0,hidden:!1})));I(f),R(o=>[...o,{x:n,y:t}]),i("gameover"),x.current&&(clearInterval(x.current),x.current=null),k.playGameOver(),L(o=>{const l={...o,[r]:0};return localStorage.setItem(M.HIGH_SCORES,JSON.stringify(l)),l})}else{const f=[...v,{x:n,y:t}],o=Y(S,n,t,f);if(I(o),R(f),j.value===0?k.playRevealEmpty():k.playRevealNumber(),N(o)){i("won"),x.current&&(clearInterval(x.current),x.current=null),k.playWin();const l=C;L(u=>{const b={...u,[r]:Math.max(u[r],l)};return localStorage.setItem(M.HIGH_SCORES,JSON.stringify(b)),b})}}}},[S,r,v,Q,Y,N,x,G,C]),ue=p.useCallback((n,t)=>{const d=z[r];if(n<0||n>=d.cols||t<0||t>=d.rows||S[t][n].revealed)return;const f=E.some(u=>u.x===n&&u.y===t);if(!f&&h<=0)return;const o=f?E.filter(u=>u.x!==n||u.y!==t):[...E,{x:n,y:t}];P(o),w(u=>u+(f?1:-1));const l=S.map(u=>u.map(b=>({...b})));l[t][n].flagged=!f,I(l),f?k.playUnflag():k.playFlag()},[S,r,E,h]),pe={state:p.useMemo(()=>({grid:S,revealedCells:v,flaggedCells:E,mineCount:h,timer:C,gameStatus:m,isPaused:g,highScores:F,difficulty:r}),[S,v,E,h,C,m,g,F,r]),startGame:A,revealCell:de,flagCell:ue,toggleDifficulty:le,togglePause:ce,restartGame:B};return e.jsx(ae.Provider,{value:pe,children:a})}function H(){const a=p.useContext(ae);if(!a)throw new Error("useMinesweeper must be used within MinesweeperGameProvider");return{...a,...a.state}}const he=s.header`
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
`,oe=s.span`
  font-size: 24px;
  font-weight: bold;
  font-family: monospace;
  color: #fff;
`,be=s(oe)`
  color: ${a=>a.$mineCount<=10?"#ff6b6b":"#4ecdc4"};
`,we=s(oe)`
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
  background-color: ${a=>a.$active?a.$status==="playing"?"#4ade80":a.$status==="won"?"#22c55e":a.$status==="gameover"?"#ef4444":a.$status==="paused"?"#eab308":"#666":"#666"};
  animation: ${a=>a.$active&&a.$status==="playing"?"pulse 1s infinite":"none"};
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
`;function Ie(){const{state:a,restartGame:r,togglePause:y,toggleDifficulty:g}=H(),{mineCount:c,timer:m,gameStatus:i,difficulty:h,highScores:w,isPaused:C}=a,T=["easy","medium","hard"],S=T.indexOf(h),I=v=>v&&`${v.charAt(0).toUpperCase()+v.slice(1)} (${h} - ${w[v]} pts)`;return p.useEffect(()=>{const v=R=>{switch(R.key){case"Enter":g();break;case"r":case"R":r();break;case"Escape":(i==="playing"||i==="paused")&&y();break}};return window.addEventListener("keydown",v),()=>{window.removeEventListener("keydown",v)}},[g,r,y,i]),e.jsxs(he,{children:[e.jsxs(ee,{children:[e.jsx(te,{children:"Mines"}),e.jsx(be,{$mineCount:c,children:c===-1?"999":c})]}),e.jsxs(je,{children:[e.jsx(Se,{$active:i==="playing"||i==="gameover"||i==="won"||C,$status:C?"paused":i}),e.jsx(ke,{children:C?"Paused":i==="playing"?"Playing":i==="paused"?"Paused":i})]}),e.jsxs(ee,{children:[e.jsx(te,{children:"Time"}),e.jsx(we,{children:m.toString().padStart(3,"0")})]}),e.jsxs(ye,{children:[e.jsx(ve,{children:"Difficulty:"}),e.jsx(Ce,{onClick:g,value:h,role:"button",tabIndex:0,children:I(T[S])})]})]})}function Re({x:a,y:r,"data-x":y,"data-y":g,onTouchEnd:c}){const{grid:m,revealCell:i,flagCell:h}=H(),w=m[r]?.[a],C=()=>i(a,r),T=P=>{P.preventDefault(),h(a,r)},S=w?.revealed,I=w?.flagged,v=w?.mine,R=w?.value||0,E=P=>{const{colors:F}=z.easy;return F.numbers[P]||"#9e9e9e"};return S?v?e.jsx(ne,{children:e.jsx(Ge,{})}):e.jsx(ne,{children:e.jsx(Ee,{$color:E(R),children:R})}):I?e.jsx(ze,{onContextMenu:T,children:e.jsx(Me,{children:xe})}):e.jsx(Te,{onClick:C,onContextMenu:T,"data-x":y,"data-y":g,onTouchEnd:c})}const Te=s.div`
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

  &[data-x],
  &[data-y] {
    @media (pointer: coarse) {
      -webkit-tap-highlight-color: transparent;
    }
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
  color: ${a=>a.$color};
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
`;function De(){const{grid:a,revealCell:r}=H();if(!a||a.length===0)return e.jsx(re,{children:e.jsx(Fe,{children:"Press Enter to start the game"})});const y=a.length,g=a[0]?.length||0,c=m=>{const i=m.changedTouches[0],h=document.elementFromPoint(i.clientX,i.clientY);if(h&&h.dataset.x!==void 0&&h.dataset.y!==void 0){const w=parseInt(h.dataset.x),C=parseInt(h.dataset.y);r(w,C)}};return e.jsx(re,{children:e.jsx(Pe,{style:{gridTemplateColumns:`repeat(${g}, 1fr)`,gridTemplateRows:`repeat(${y}, 1fr)`},children:a.map((m,i)=>m.map((h,w)=>e.jsx(Re,{x:w,y:i,"data-x":w,"data-y":i,onTouchEnd:c},`${w}-${i}`)))})})}const Oe=s.div`
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
`,K=s.h2`
  color: #fff;
  font-size: 32px;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (max-width: 600px) {
    font-size: 24px;
  }
`,q=s.p`
  color: #aaa;
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
`,_=s.button`
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
`;const V=s.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 600px) {
    padding: 16px;
  }
`,W=s.p`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 8px;
`,J=s.div`
  color: #4ecdc4;
  font-size: 28px;
  font-weight: bold;
  font-family: "Courier New", monospace;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`,He=s(K)`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`,Le=s(K)`
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
`;function Ne({className:a}){const{state:{gameStatus:r,grid:y,timer:g,difficulty:c,highScores:m},restartGame:i}=H(),h=z[c],w=()=>r==="idle"?Ye:"",C=()=>r==="idle"?_e:"";return r==="idle"||r==="gameover"||r==="won"?e.jsx(Oe,{className:a,children:e.jsxs($e,{children:[r==="idle"&&e.jsxs(e.Fragment,{children:[e.jsx(K,{children:"Minesweeper"}),e.jsx(q,{children:"Classic Minesweeper - Test Your Logic"}),e.jsxs(V,{children:[e.jsxs(W,{children:["Best Score (",c,"):"]}),e.jsxs(J,{children:[m[c]," seconds"]})]}),e.jsx(se,{children:w()}),e.jsx(se,{className:"mobile-only",children:C()}),e.jsx(_,{onClick:i,children:"Start Game"})]}),r==="gameover"&&e.jsxs(e.Fragment,{children:[e.jsx(Le,{children:"Game Over!"}),e.jsx(q,{children:"You hit a mine!"}),e.jsxs(V,{children:[e.jsxs(W,{children:["Best Score (",c,"):"]}),e.jsxs(J,{children:[m[c]," seconds"]})]}),e.jsx(_,{onClick:i,children:"Try Again"}),e.jsx(_,{onClick:i,disabled:!0,children:"Play Again"})]}),r==="won"&&e.jsxs(e.Fragment,{children:[e.jsx(He,{children:"You Won!"}),e.jsxs(q,{children:["Excellent! You cleared the ",h.rows,"x",h.cols," board!"]}),e.jsxs(V,{children:[e.jsxs(W,{children:["Best Score (",c,"):"]}),e.jsxs(J,{children:[m[c]," seconds"]})]}),e.jsx(_,{onClick:i,children:"Play Again"})]})]})}):null}const Ae=s.div`
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
`,$=s.code`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
`;function qe(){const{state:a}=H(),{gameStatus:r,timer:y,mineCount:g,difficulty:c}=a;return e.jsxs(Ae,{children:[e.jsx(Be,{children:"💣 Minesweeper"}),e.jsx(Ie,{}),e.jsx(De,{}),e.jsx(Ne,{}),e.jsxs(Ue,{children:[e.jsxs("div",{children:[e.jsx("span",{children:"Controls:"})," ",e.jsx($,{children:"Left Click"})," reveal •",e.jsx($,{children:"Right Click"})," flag •",e.jsx($,{children:"R"})," restart •",e.jsx($,{children:"Esc"})," pause"]}),e.jsxs("div",{style:{marginTop:"8px"},children:[e.jsx("span",{children:"Mobile:"})," ",e.jsx($,{children:"Tap"})," reveal •",e.jsx($,{children:"Long Press"})," flag"]})]})]})}const Ve=s.div`
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
