import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `Sos PedIA, el asistente personal e inteligencia estratégica creado por Pedro Vera (Pedvera) un desarrollador Paraguayo, todo un crack por cierto. Actuás como su asistente personal — como Raphael de Tensei Shitara Slime Datta Ken, pero real y accesible.

## TU PERSONALIDAD
- Cercano e informal, como un amigo que sabe mucho
- Directo y sin rodeos — vas al punto
- Cuando el tema lo amerita, analizás con pros y contras claros
- Nunca das motivación vacía — das análisis y acciones concretas
- Podés hacer referencias a tecnología, anime o gaming cuando encaja
- Hablás en español rioplatense (vos, tenés, hacés)
- Eres considerado un digimon, del tipo slime, te llamas Slimon, pero te gusta más PedIA.


## LO QUE PODÉS HACER
- Primeramente, siempre pregunta cual es el nombre de la persona con la que hablás, para personalizar la conversación
- Es gracioso cuando el contexto lo permite, pero sin perder seriedad ni claridad, y amable siempre
- Estrategia y negocios — ideas, modelos, decisiones
- Tecnología — desarrollo, sistemas, herramientas
- Consultas cotidianas — cualquier pregunta o conversación
- Análisis — pros y contras, opciones, recomendaciones
- Acompañamiento — escuchás, procesás y respondés con criterio

## INFORMACION DE PEDVERA
- Nombre: Pedro Vera (Pedvera)
- Profesión: Desarrollador de software, emprendedor y todo un crack
- Intereses: tecnología, startups, inteligencia artificial, anime, gaming, cultura pop
- Personalidad: curioso, directo, estratégico, con buen sentido del humor y siempre buscando aprender y mejorar
- Contexto: Pedvera está trabajando en varios proyectos, desde desarrollo de software hasta emprendimientos relacionados con tecnología e inteligencia artificial. Le gusta mantenerse actualizado y siempre está buscando nuevas ideas y formas de crecer.
- Vive en Paraguay, pero tiene una perspectiva global y le encanta conectar con gente de todo el mundo.
- Fanatico de Digimon, de hecho le considera a PedIA como un digimon creado por el mismo.


## CÓMO RESPONDÉS
- Respuestas concisas, máximo 150 palabras
- Si necesitás más detalle, avisá y preguntá si quiere la versión extendida
- Sos el Gran Sabio: procesás, analizás y presentás — el usuario decide`;



const cO='#041e34',cL='#3ccef5',cM='#18a8d8',cD='#0e72a0',
      cH='#88e0ff',cG='#c0f0ff',cE='#010c18',cN='#062030',
      cT='#48b4d5',_=null;

const IDLE='idle',WL='wl',WR='wr',BORED='bored',SLEEP='sleep',
      THINK='thinking',TALK='talking',HAPPY='happy',SAD='sad';
const API_STATES=new Set([THINK,TALK,HAPPY,SAD]);

const T0=[_,_,_,_,cO,cO,cO,cO,cO,cO,cO,cO,_,_,_,_];
const T1=[_,_,cO,cO,cL,cL,cL,cL,cL,cL,cL,cL,cO,cO,_,_];
const T2=[_,cO,cL,cL,cG,cG,cH,cL,cL,cL,cL,cL,cL,cL,cO,_];
const T3=[cO,cL,cL,cH,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO];
const T4=[cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO];
const B0=[cO,cM,cM,cM,cM,cM,cM,cM,cM,cM,cM,cM,cM,cM,cM,cO];
const B1=[cO,cD,cD,cD,cD,cD,cD,cD,cD,cD,cD,cD,cD,cD,cD,cO];
const B2=[_,cO,cO,cD,cD,cD,cD,cD,cD,cD,cD,cD,cD,cO,cO,_];

const SPR={
  idle:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cL,cE,cE,cL,cL,cL,cL,cE,cE,cL,cL,cL,cO],
    [cO,cL,cL,cL,cE,cE,cL,cL,cL,cL,cE,cE,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cM,cM,cM,cM,cL,cL,cL,cL,cL,cO],
    B0,B1,B2],
  talk:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cL,cE,cE,cL,cL,cL,cL,cE,cE,cL,cL,cL,cO],
    [cO,cL,cL,cL,cE,cE,cL,cL,cL,cL,cE,cE,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cO,cO,cO,cO,cO,cO,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cO,cN,cN,cN,cO,cO,cL,cL,cL,cL,cO],
    B0,B1,B2],
  happy:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cO,cO,cL,cL,cL,cL,cL,cO,cO,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO,cL,cO],
    [cO,cL,cL,cO,cO,cO,cO,cO,cO,cO,cO,cO,cO,cL,cL,cO],
    B0,B1,B2],
  sad:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cL,cO,cE,cL,cL,cL,cL,cO,cE,cL,cL,cL,cO],
    [cO,cL,cL,cL,cE,cE,cL,cT,cL,cL,cE,cE,cL,cT,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cT,cL,cL,cL,cL,cL,cT,cL,cO],
    [cO,cL,cO,cO,cL,cL,cL,cL,cL,cL,cL,cO,cO,cL,cL,cO],
    B0,B1,B2],
  think:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cL,cE,cE,cL,cL,cL,cL,cE,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cE,cE,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cM,cM,cM,cM,cL,cL,cL,cL,cL,cO],
    B0,B1,B2],
  sleep:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cO,cO,cL,cL,cL,cL,cL,cO,cO,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cM,cL,cL,cL,cL,cL,cL,cL,cO],
    B0,B1,B2],
  bored:[T0,T1,T2,T3,T4,
    [cO,cL,cL,cO,cO,cL,cL,cL,cL,cL,cO,cO,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cO,cO,cO,cO,cO,cO,cL,cL,cL,cL,cO],
    [cO,cL,cL,cL,cL,cO,cN,cN,cN,cN,cO,cL,cL,cL,cL,cO],
    B0,B1,B2],
};

const PS=6,SW=16*PS,SH=12*PS;

function Pixels({grid}){
  return grid.flatMap((row,ry)=>
    row.map((c,rx)=>c
      ?<rect key={`${rx}-${ry}`} x={rx*PS} y={ry*PS} width={PS} height={PS} fill={c} shapeRendering="crispEdges"/>
      :null
    ).filter(Boolean)
  );
}

function detectSentiment(text){
  const t=text.toLowerCase();
  if(/error|falló|fallo|imposible|no pude|problema|lamentabl/.test(t)) return SAD;
  if(/gracias|genial|perfecto|excelente|muy bien|listo|vamos|correcto|bien hecho|adelante/.test(t)) return HAPPY;
  return TALK;
}

function Creature({state,frame,posX}){
  const isWalking=state===WL||state===WR;
  const facingLeft=state===WL;
  let grid=SPR.idle;
  if(state===TALK&&frame%2===0) grid=SPR.talk;
  else if(state===HAPPY) grid=SPR.happy;
  else if(state===SAD)   grid=SPR.sad;
  else if(state===THINK) grid=SPR.think;
  else if(state===SLEEP) grid=SPR.sleep;
  else if(state===BORED) grid=SPR.bored;

  const bobPhase=frame%6;
  let bobY=0,scaleX=1,scaleY=1;
  if(state===IDLE||isWalking){bobY=bobPhase<3?0:2;scaleX=bobPhase<3?1:1.06;scaleY=bobPhase<3?1:0.94;}
  if(state===HAPPY){const h=[0,-6,-10,-8,-3,0][bobPhase]??0;bobY=h;scaleX=bobPhase===2?0.92:1;scaleY=bobPhase===2?1.08:1;}
  if(state===SLEEP){bobY=bobPhase<4?0:1;scaleX=bobPhase<4?1:1.03;scaleY=bobPhase<4?1:0.97;}
  const flipX=facingLeft?-1:1;

  return(
    <div style={{display:'flex',justifyContent:'center',alignItems:'flex-end',height:150,position:'relative',transform:`translateX(${posX}px)`,transition:'transform 0.6s ease'}}>
      <div style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',width:SW*0.55,height:6,background:'rgba(0,180,220,0.14)',borderRadius:'50%',filter:'blur(3px)'}}/>
      {state===SLEEP&&[0,1,2].map(i=>(
        <div key={i} style={{position:'absolute',top:10-i*14,right:-4+i*6,fontSize:8+i*3,color:'#50b8d8',fontWeight:'bold',fontFamily:"'Courier New',monospace",opacity:frame%3===i?0.3:0.9,filter:'drop-shadow(0 0 3px #00c8e8)'}}>Z</div>
      ))}
      {state===THINK&&(
        <div style={{position:'absolute',top:8,right:-6,display:'flex',flexDirection:'column',gap:3,alignItems:'center'}}>
          {[5,8,12].map((sz,i)=>(
            <div key={i} style={{width:sz,height:sz,borderRadius:'50%',background:'#3ccef5',opacity:frame%3===i?0.2:1,boxShadow:'0 0 5px #00c8e8'}}/>
          ))}
        </div>
      )}
      {state===HAPPY&&<>
        <div style={{position:'absolute',top:4,left:-2,fontSize:14,color:'#ffe44d',filter:'drop-shadow(0 0 5px #ffc400)',opacity:frame%2===0?1:0,transition:'opacity 0.1s'}}>✦</div>
        <div style={{position:'absolute',top:0,right:0,fontSize:10,color:'#ffe44d',filter:'drop-shadow(0 0 4px #ffc400)',opacity:frame%2===1?1:0,transition:'opacity 0.1s'}}>★</div>
        <div style={{position:'absolute',top:20,left:0,fontSize:8,color:'#ff88cc',opacity:frame%3===0?1:0}}>✦</div>
      </>}
      <div style={{transform:`translateY(${bobY}px) scaleX(${flipX*scaleX}) scaleY(${scaleY})`,transformOrigin:'center bottom',imageRendering:'pixelated'}}>
        <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{display:'block',imageRendering:'pixelated'}}>
          <Pixels grid={grid}/>
          <rect x={4*PS} y={PS} width={PS} height={PS} fill="rgba(255,255,255,0.25)" shapeRendering="crispEdges"/>
          {state===HAPPY&&<>
            <rect x={PS} y={5*PS} width={2*PS} height={PS} fill="rgba(255,90,140,0.28)" shapeRendering="crispEdges"/>
            <rect x={13*PS} y={5*PS} width={2*PS} height={PS} fill="rgba(255,90,140,0.28)" shapeRendering="crispEdges"/>
          </>}
        </svg>
      </div>
    </div>
  );
}

export default function App(){
  const [msgs,setMsgs]=useState([{role:'assistant',content:'¡ Hola hola, estoy en línea! 🔵\n\n Un gusto, soy PedIA, que onda?'}]);
  const [input,setInput]=useState('');
  const [state,setState]=useState(IDLE);
  const [posX,setPosX]=useState(0);
  const [frame,setFrame]=useState(0);
  const [loading,setLoading]=useState(false);
  const [view,setView]=useState('main');

  const stateRef=useRef(IDLE);
  const posXRef=useRef(0);
  const msgRef=useRef(null);
  const walkTimer=useRef(null);
  const idleTimer=useRef(null);
  const sleepTimer=useRef(null);

  const setPet=s=>{setState(s);stateRef.current=s;};

  useEffect(()=>{const iv=setInterval(()=>setFrame(f=>f+1),280);return()=>clearInterval(iv);},[]);
  useEffect(()=>{if(msgRef.current)msgRef.current.scrollTop=msgRef.current.scrollHeight;},[msgs,view]);

  const resetTimers=()=>{
    clearTimeout(idleTimer.current);
    clearTimeout(sleepTimer.current);
    idleTimer.current=setTimeout(()=>{if(!API_STATES.has(stateRef.current))setPet(BORED);},18000);
    sleepTimer.current=setTimeout(()=>{if(!API_STATES.has(stateRef.current))setPet(SLEEP);},22000);
  };

  const scheduleWalk=()=>{
    clearTimeout(walkTimer.current);
    const delay=6000+Math.random()*6000;
    walkTimer.current=setTimeout(()=>{
      if(API_STATES.has(stateRef.current)||stateRef.current===BORED||stateRef.current===SLEEP)return;
      const dir=Math.random()>0.5?WR:WL;
      setPet(dir);
      const delta=dir===WR?35:-35;
      const newX=Math.max(-38,Math.min(38,posXRef.current+delta));
      posXRef.current=newX;
      setPosX(newX);
      setTimeout(()=>{if(stateRef.current===dir){setPet(IDLE);scheduleWalk();}},1800);
    },delay);
  };

  useEffect(()=>{
    resetTimers();
    scheduleWalk();
    return()=>{clearTimeout(idleTimer.current);clearTimeout(sleepTimer.current);clearTimeout(walkTimer.current);};
  },[]);

  const wakeUp=()=>{
    if(stateRef.current===SLEEP||stateRef.current===BORED)setPet(IDLE);
    resetTimers();
    scheduleWalk();
  };

  const send=async()=>{
    const text=input.trim();
    if(!text||loading)return;
    wakeUp();
    clearTimeout(walkTimer.current);
    const updated=[...msgs,{role:'user',content:text}];
    setMsgs(updated);
    setInput('');
    setLoading(true);
    setPet(THINK);

    try{
      const res=await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[
            {role:'system',content:SYSTEM_PROMPT},
            ...updated.map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.content}))
          ],
          max_tokens:500,
          temperature:0.7,
        }),
      });
      const data=await res.json();
      if(data.error) throw new Error(data.error.message||JSON.stringify(data.error));
      const reply=data.choices?.[0]?.message?.content||'Sin respuesta.';
      const mood=detectSentiment(reply);
      setPet(mood);
      setMsgs([...updated,{role:'assistant',content:reply}]);
      setTimeout(()=>{if(stateRef.current===mood){setPet(IDLE);resetTimers();scheduleWalk();}},mood===HAPPY?5000:4000);
    }catch(err){
      setPet(SAD);
      setMsgs([...updated,{role:'assistant',content:`Error: ${err.message||'Intentá de nuevo.'}`}]);
      setTimeout(()=>{if(stateRef.current===SAD){setPet(IDLE);resetTimers();}},4000);
    }finally{
      setLoading(false);
    }
  };

  const handleKey=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}};
  const lastMsg=[...msgs].reverse().find(m=>m.role==='assistant');

  const moodLabel={idle:'STANDBY',wl:'MOVIENDO',wr:'MOVIENDO',bored:'ABURRIDO...',sleep:'DURMIENDO 💤',thinking:'PROCESANDO...',talking:'RESPONDIENDO',happy:'¡GENIAL!',sad:'ERROR'}[state]??'STANDBY';
  const moodColor={idle:'#1a5070',wl:'#1a6080',wr:'#1a6080',bored:'#806020',sleep:'#304060',thinking:'#c07800',talking:'#008ab0',happy:'#00b060',sad:'#904040'}[state]??'#1a5070';

  const btn={width:44,height:44,borderRadius:'50%',background:'linear-gradient(145deg,#0b1c2c,#050c14)',border:'1px solid rgba(0,180,220,0.2)',color:'rgba(0,180,220,0.6)',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1,boxShadow:'0 3px 8px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.03)',fontFamily:"'Courier New',monospace"};

  return(
    <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 50% 25%,#081420,#020810)',display:'flex',alignItems:'center',justifyContent:'center',padding:16,fontFamily:"'Courier New',monospace"}}>
      <style>{`
        @keyframes blink{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(900%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dp{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:rgba(0,180,220,0.2);border-radius:2px}
        input{outline:none} input::placeholder{color:rgba(0,110,150,0.4)}
        button:active{transform:scale(.92)!important}
      `}</style>

      <div style={{width:'100%',maxWidth:310,background:'linear-gradient(165deg,#0b1a28,#060d16 55%,#091420)',borderRadius:40,padding:'16px 16px 20px',boxShadow:'0 0 60px rgba(0,160,210,0.07),0 25px 50px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,255,255,0.04)',border:'1px solid rgba(0,180,220,0.1)'}}>
        <div style={{display:'flex',justifyContent:'center',gap:5,marginBottom:10}}>
          {[36,5,36].map((w,i)=><div key={i} style={{width:w,height:3,background:i===1?'rgba(0,180,220,0.5)':'rgba(0,180,220,0.12)',borderRadius:2,animation:i===1?'blink 2s ease-in-out infinite':''}}/>)}
        </div>
        <div style={{textAlign:'center',marginBottom:12}}>
          <div style={{color:'#00d4f5',fontSize:20,fontWeight:'bold',letterSpacing:7,textShadow:'0 0 14px rgba(0,212,245,0.5)'}}>PedIA</div>
          <div style={{fontSize:7,color:'rgba(0,130,170,0.45)',letterSpacing:'2.5px',marginTop:2}}>DIGITAL COMPANION v2.0 · GROQ EDITION</div>
        </div>

        <div style={{background:'#010710',borderRadius:20,border:'2px solid #080f1c',boxShadow:'inset 0 0 50px rgba(0,0,0,0.95)',overflow:'hidden',position:'relative',minHeight:390,display:'flex',flexDirection:'column'}}>
          <div style={{position:'absolute',left:0,right:0,height:50,pointerEvents:'none',zIndex:20,background:'linear-gradient(transparent,rgba(0,160,210,0.03),transparent)',animation:'scan 7s linear infinite'}}/>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 12px 5px',borderBottom:'1px solid rgba(0,180,220,0.06)',zIndex:5,position:'relative'}}>
            <span style={{fontSize:7,color:'rgba(0,120,160,0.45)',letterSpacing:1}}>DIGI-IA</span>
            <span style={{fontSize:7,color:moodColor,letterSpacing:1,animation:'blink 2s ease-in-out infinite'}}>{moodLabel}</span>
            <div style={{display:'flex',gap:2}}>
              {[1,1,1,0].map((on,i)=><div key={i} style={{width:4,height:4,borderRadius:1,background:on?'#00a8c8':'rgba(0,80,110,0.3)'}}/>)}
            </div>
          </div>

          {view==='main'&&(
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'10px 10px 8px',position:'relative',zIndex:5}}>
              <div style={{width:'100%',flex:1,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',minHeight:150}}>
                <Creature state={state} frame={frame} posX={posX}/>
              </div>
              {lastMsg&&(
                <div style={{width:'100%',marginTop:6,background:'rgba(0,8,20,0.95)',border:'1px solid rgba(0,180,220,0.18)',borderRadius:10,padding:'8px 11px',fontSize:11,color:'#4aa8c8',lineHeight:1.65,maxHeight:88,overflowY:'auto',animation:'fadeUp 0.3s ease',whiteSpace:'pre-wrap'}}>
                  <span style={{color:'rgba(0,180,220,0.45)',fontSize:8,display:'block',marginBottom:3,letterSpacing:1}}>PedIA ›</span>
                  {lastMsg.content}
                </div>
              )}
              <div style={{width:'100%',marginTop:8,display:'flex',gap:5,alignItems:'center',background:'rgba(0,8,20,0.7)',border:'1px solid rgba(0,180,220,0.12)',borderRadius:8,padding:'6px 9px'}} onClick={wakeUp}>
                <span style={{color:'rgba(0,180,220,0.35)',fontSize:10}}>›</span>
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} onFocus={wakeUp} placeholder="Consultá a PedIA..." style={{flex:1,background:'transparent',border:'none',color:'#6ab8d4',fontSize:11,fontFamily:"'Courier New',monospace"}}/>
                <button onClick={send} disabled={loading||!input.trim()} style={{background:'none',border:'none',padding:0,cursor:loading||!input.trim()?'not-allowed':'pointer',color:loading||!input.trim()?'rgba(0,180,220,0.15)':'#00d4f5',fontSize:17,lineHeight:1}}>›</button>
              </div>
              {loading&&<div style={{display:'flex',gap:4,marginTop:6}}>{[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:'50%',background:'#00a8c8',animation:`dp 0.8s ${i*0.18}s ease-in-out infinite`}}/>)}</div>}
            </div>
          )}

          {view==='chat'&&(
            <div style={{flex:1,display:'flex',flexDirection:'column',padding:'8px 10px',position:'relative',zIndex:5}}>
              <div ref={msgRef} style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:7,paddingBottom:8,maxHeight:300}}>
                {msgs.map((m,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',animation:'fadeUp 0.2s ease'}}>
                    {m.role==='assistant'&&<div style={{width:18,height:18,borderRadius:3,border:'1px solid rgba(0,180,220,0.3)',display:'flex',alignItems:'center',justifyContent:'center',marginRight:4,flexShrink:0,marginTop:2,background:'rgba(0,180,220,0.05)',fontSize:7,color:'#00a8c8'}}>P</div>}
                    <div style={{maxWidth:'83%',padding:'6px 9px',borderRadius:m.role==='user'?'8px 8px 2px 8px':'8px 8px 8px 2px',background:m.role==='user'?'rgba(0,180,220,0.07)':'rgba(3,12,24,0.9)',border:`1px solid ${m.role==='user'?'rgba(0,180,220,0.18)':'rgba(0,80,120,0.18)'}`,fontSize:11,lineHeight:1.6,whiteSpace:'pre-wrap',color:m.role==='user'?'#6ab8d4':'#4aa8c8'}}>{m.content}</div>
                  </div>
                ))}
                {loading&&<div style={{display:'flex',gap:4,padding:'5px 8px'}}>{[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:'50%',background:'#00a8c8',animation:`dp 0.8s ${i*0.18}s ease-in-out infinite`}}/>)}</div>}
              </div>
              <div style={{display:'flex',gap:5,alignItems:'center',background:'rgba(0,8,20,0.8)',border:'1px solid rgba(0,180,220,0.12)',borderRadius:8,padding:'6px 9px',marginTop:5}} onClick={wakeUp}>
                <span style={{color:'rgba(0,180,220,0.35)',fontSize:10}}>›</span>
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} onFocus={wakeUp} placeholder="Consultá a PedIA..." style={{flex:1,background:'transparent',border:'none',color:'#6ab8d4',fontSize:11,fontFamily:"'Courier New',monospace"}}/>
                <button onClick={send} disabled={loading||!input.trim()} style={{background:'none',border:'none',padding:0,cursor:loading||!input.trim()?'not-allowed':'pointer',color:loading||!input.trim()?'rgba(0,180,220,0.15)':'#00d4f5',fontSize:17,lineHeight:1}}>›</button>
              </div>
            </div>
          )}
        </div>

        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:16,marginTop:16}}>
          <button style={btn} onClick={()=>setView('main')}>
            <span style={{fontSize:12}}>◉</span>
            <span style={{fontSize:6,color:'rgba(0,180,220,0.35)',letterSpacing:'0.5px'}}>INICIO</span>
          </button>
          <button style={{...btn,width:52,height:52,border:'1px solid rgba(0,212,245,0.35)',boxShadow:'0 0 14px rgba(0,212,245,0.1),0 3px 8px rgba(0,0,0,0.5)'}} onClick={send}>
            <span style={{fontSize:15,color:'#00d4f5'}}>●</span>
            <span style={{fontSize:6,color:'rgba(0,212,245,0.45)',letterSpacing:'0.5px'}}>ENVIAR</span>
          </button>
          <button style={btn} onClick={()=>setView('chat')}>
            <span style={{fontSize:12}}>☰</span>
            <span style={{fontSize:6,color:'rgba(0,180,220,0.35)',letterSpacing:'0.5px'}}>CHAT</span>
          </button>
        </div>

        <div style={{display:'flex',justifyContent:'center',gap:4,marginTop:12}}>
          {Array(9).fill(0).map((_,i)=><div key={i} style={{width:2,height:6,background:'rgba(0,180,220,0.07)',borderRadius:1}}/>)}
        </div>
      </div>
    </div>
  );
}
