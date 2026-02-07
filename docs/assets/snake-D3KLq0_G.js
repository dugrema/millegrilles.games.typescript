import{a as t,p as e,w as V}from"./chunk-EPOLDU6W-BRx3iYW4.js";import{a as o}from"./styled-components.browser.esm-AwWoiJTA.js";const Q=t.createContext(null);function Y({children:n}){const[r,a]=t.useState("playing"),[y,f]=t.useState(0),d=20,[c,g]=t.useState([]),[b,k]=t.useState({x:1,y:0}),[i,v]=t.useState(null),[u,w]=t.useState(!1),[C,R]=t.useState(!1),p=t.useRef(null),$=t.useRef([]),O=t.useRef(c),G=t.useRef(b),I=t.useRef(i),B=t.useRef(r),T=t.useRef(u),U=t.useRef(!1);t.useEffect(()=>{O.current=c,G.current=b,I.current=i,B.current=r,T.current=u},[c,b,i,r,u]);const P=t.useCallback(s=>{let l=0,x;do x={x:Math.floor(Math.random()*(d-2))+1,y:Math.floor(Math.random()*(d-2))+1},l++;while(s.some(j=>j.x===x.x&&j.y===x.y)&&l<100);v(x)},[d]),A=t.useCallback(()=>{f(0),w(!1),R(!1),a("playing");const s=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];g(s),k({x:1,y:0}),P(s),p.current&&clearInterval(p.current),p.current=setInterval(M,150)},[P]),M=t.useCallback(()=>{if(B.current!=="playing"||T.current)return;const s=O.current;if(s.length===0)return;for(;$.current.length>0;){const m=$.current.shift(),H=G.current;(m.x!==-H.x||m.y!==-H.y)&&k(m)}const h=s[0],l={x:h.x+G.current.x,y:h.y+G.current.y};if(l.x<0||l.x>=d||l.y<0||l.y>=d){w(!0);return}if(s.some(m=>m.x===l.x&&m.y===l.y)){w(!0);return}const x=[l,...s];let j=!1;const F=I.current;F&&l.x===F.x&&l.y===F.y&&(j=!0,f(m=>m+10),P(x));const N=j?x:x.slice(0,x.length-1);g(N),U.current=j},[P]),X=t.useCallback(s=>f(h=>h+s),[]),q=t.useCallback(s=>{const h=G.current;(s.x!==-h.x||s.y!==-h.y)&&$.current.push(s)},[]),E=t.useCallback(()=>{w(!1),R(!1),a("paused"),A()},[A]),_=t.useCallback(()=>{if(u||C){E();return}const s=r==="playing"?"paused":"playing";a(s),p.current&&clearInterval(p.current),s==="playing"&&(p.current=setInterval(M,150))},[r,u,C,E,M]);t.useEffect(()=>(A(),()=>{p.current&&clearInterval(p.current)}),[A]);const J={status:r,score:y,arenaSize:d,snake:c,direction:b,food:i,gameOver:u,gameWon:C,addScore:X,setDirection:q,togglePause:_,resetGame:E};return e.jsx(Q.Provider,{value:J,children:n})}function S(){const n=t.useContext(Q);if(!n)throw new Error("useSnakeGame must be used within SnakeGameProvider");return n}const Z=o.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  background-color: #2e7d32;
  border: 4px solid #4caf50;
  border-radius: 8px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
`,ee=o.div`
  width: 100%;
  height: 100%;

  ${n=>n.$isHead&&`
    background-color: #76ff03;
    border-radius: 4px;
    box-shadow: 0 0 4px rgba(118, 255, 3, 0.3);
  `}
`,te=o.div`
  width: 100%;
  height: 100%;
  background-color: #38e179;
  border-radius: 4px;
`;function ne({className:n}){const{arenaSize:r,snake:a,food:y,gameOver:f,gameWon:d,setDirection:c,togglePause:g,resetGame:b}=S();return t.useEffect(()=>{const k=i=>{switch(i.key){case"ArrowUp":c({x:0,y:-1}),i.preventDefault();break;case"ArrowDown":c({x:0,y:1}),i.preventDefault();break;case"ArrowLeft":c({x:-1,y:0}),i.preventDefault();break;case"ArrowRight":c({x:1,y:0}),i.preventDefault();break;case" ":g(),i.preventDefault();break;case"r":case"R":(f||d)&&b();break}};return window.addEventListener("keydown",k),()=>{window.removeEventListener("keydown",k)}},[c,g,b,f,d]),e.jsx(e.Fragment,{children:e.jsx(Z,{className:n,children:Array.from({length:r*r}).map((k,i)=>{const v=i%r,u=Math.floor(i/r),w=a[0]?.x===v&&a[0]?.y===u,C=a.slice(1).some(R=>R.x===v&&R.y===u);return e.jsx("div",{style:{gridRow:u+1,gridColumn:v+1},children:w?e.jsx(ee,{$isHead:!0}):C?e.jsx(te,{}):null},`${v}-${u}`)})})})}const W=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`,re=o.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  transform: translate(-50%, -50%);

  ${n=>n.$visible&&`
    animation: pulse 0.5s ease-in-out infinite;
  `}

  ${n=>!n.$visible&&`
    opacity: 0;
    animation: none;
  `}
`,L=`
  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      box-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      box-shadow: 0 0 16px rgba(255, 0, 0, 0.8);
    }
  }
`;function oe({className:n}){const{arenaSize:r,food:a,gameOver:y,gameWon:f}=S();if(!a)return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:L}),e.jsx(W,{className:n})]});const d=(a.x+.5)/r*100,c=(a.y+.5)/r*100,g={left:`${d}%`,top:`${c}%`};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:L}),e.jsx(W,{className:n,children:e.jsx(re,{$visible:!y&&!f,style:g})})]})}const se=o.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 20;
  letter-spacing: 2px;
`,ae=o.div`
  background: rgba(46, 125, 50, 0.9);
  padding: 8px 24px;
  border-radius: 8px;
  border: 2px solid #4caf50;
  backdrop-filter: blur(4px);
`;function ie(){const{status:n}=S();return e.jsx(se,{children:e.jsx(ae,{children:n==="paused"?"PAUSED":"SNAKE GAME"})})}const ce=o.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-family: monospace;
  z-index: 200;
  pointer-events: auto;
`,le=o.p`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
`,de=o.button`
  background: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #45a049;
  }
`,ue=o.p`
  font-size: 14px;
  margin-top: 8px;
`;function xe(){const{gameOver:n,score:r,resetGame:a}=S();return n?e.jsxs(ce,{children:[e.jsxs(le,{children:["Game Over! Final Score: ",e.jsx("span",{children:r})]}),e.jsx(de,{onClick:a,children:"Play Again"}),e.jsx(ue,{children:"Press R or click button to restart"})]}):null}const fe=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  margin: 8px;
  background: rgba(46, 125, 50, 0.85);
  color: #fff;
  border-radius: 4px;

  /* Desktop / Tablet */
  @media (min-width: 650px) {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 200px;
    height: auto;
  }

  /* Mobile – panel moves to the bottom */
  @media (max-width: 649px) {
    width: calc(100% - 32px);
    position: fixed;
    bottom: 0;
    left: 0;
  }
`,pe=o.div`
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  flex: 1;
`,K=o.button`
  background: #76ff03;
  color: #2e7d32;
  font-weight: 700;
  border: none;
  border-radius: 3px;
  padding: 6px 10px;
  cursor: pointer;
  min-width: 70px;

  &:hover {
    background: #a9ff40;
  }

  &:disabled {
    background: #9e9e9e;
    cursor: default;
  }
`;function he(){const{score:n,status:r,togglePause:a,resetGame:y}=S();return e.jsxs(fe,{children:[e.jsxs(pe,{children:["Score: ",n]}),e.jsx(K,{onClick:a,children:r==="paused"?"Resume":"Pause"}),e.jsx(K,{onClick:y,children:"Restart"})]})}const me=o.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  @media (max-width: 649px) {
    display: flex;
  }
`,z=o.div`
  display: flex;
  gap: 8px;
`,D=o.button`
  background: #76ff03;
  color: #2e7d32;
  border: none;
  border-radius: 3px;
  padding: 8px 12px;
  cursor: pointer;
  min-width: 48px;
  font-size: 18px;
  font-weight: 600;

  &:hover {
    background: #a9ff40;
  }
`;function ge(){const{setDirection:n}=S(),r=a=>{n(a)};return e.jsxs(me,{children:[e.jsx(z,{children:e.jsx(D,{onClick:()=>r({x:0,y:-1}),"aria-label":"Move up",children:"↑"})}),e.jsxs(z,{children:[e.jsx(D,{onClick:()=>r({x:-1,y:0}),"aria-label":"Move left",children:"←"}),e.jsx(D,{onClick:()=>r({x:1,y:0}),"aria-label":"Move right",children:"→"})]}),e.jsx(z,{children:e.jsx(D,{onClick:()=>r({x:0,y:1}),"aria-label":"Move down",children:"↓"})})]})}const be=o.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(180deg, #1b5e4e 0%, #2e7d32 100%);
`,ye=o.div`
  position: relative;
  max-width: 400px;
  width: 100%;
`;function ke(){return e.jsx(Y,{children:e.jsxs(be,{children:[e.jsx(ie,{}),e.jsxs(ye,{children:[e.jsx(ne,{}),e.jsx(oe,{}),e.jsx(xe,{})]}),e.jsx(ge,{}),e.jsx(he,{})]})})}function je(){return[{title:"Snake – Quick Match"},{name:"description",content:"Play Snake in the browser"}]}const Se=V(function(){return e.jsx(ke,{})});export{Se as default,je as meta};
