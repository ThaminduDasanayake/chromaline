# Seenry fluid renderer

Original React + browser SVG implementation. No third-party fluid package is required. Copy `FluidSurface.jsx` into your React project under the repository's Apache-2.0 license.

FluidSurface owns the visual silhouette; your existing DOM owns labels, events, focus and accessibility. It measures registered items, renders a shared alpha-threshold SVG surface and follows changing rectangles during transitions. It sleeps after settling, cleans up observers and animation frames on unmount, and switches to ordinary DOM when reduced motion is enabled.

```jsx
import { FluidSurface, FluidItem } from './FluidSurface';
<FluidSurface fill="var(--surface)" blur={6} contrast={18}>
  <FluidItem x={open ? -54 : 0} y={open ? -34 : 0}
    transition={{ duration: 550, ease: 'cubic-bezier(.34,1.56,.64,1)' }}>
    <button aria-label="Add file" tabIndex={open ? 0 : -1}>…</button>
  </FluidItem>
</FluidSurface>
```

The fragment needs a stationary trigger, closed pointer gating, action handlers, Escape and focus return. Position the group to contain the whole travel region. Use one shared fill for a connected mass. Keep backgrounds in the visual layer and text in the unfiltered foreground.

Supported effects: `merge` (default) tracks already-animated DOM geometry directly; `morph` smooths resizing geometry; `move` anchors the leading edge to the target and stretches a bounded trailing body; `bend` curves both axes using filtered target velocity and settles after stopping; `melt` combines clipped images through a shared alpha-threshold surface, increasing color blur as the edge gap closes. These are Seenry implementations, not drop-in reproductions of another library's physics. Engine-specific advanced options from earlier examples are not supported.

Supported presentation: fill, blur, contrast and x/y/scale with duration/ease/delay. A resize is followed geometrically; it does not currently reproduce the previous engine's content cross-blur or shadow parsing. Browser verification for this version covers Chromium. Safari and Firefox remain unverified.

## Focus search

Copy `FluidSearch.jsx`, `fluid-search.css` and `FluidSurface.jsx` into the project. Import FluidSearch and provide the controlled `value` and `onChange`. Focus separates the field and close circle; Close/Escape clears and merges them. The bundled implementation uses React and browser primitives, with no additional package installation.

import React, { useId, useRef, useState, useEffect } from 'react';
import { useFluidReducedMotion } from './FluidSurface';
import './fluid-search.css';

// Original Seenry search disclosure. Filter only the silhouette, never content.
export default function FluidSearch({value,onChange,label='Search',placeholder='Search…'}) {
const [focused,setFocused]=useState(false), host=useRef(null);
const reduced=useFluidReducedMotion(), id='search-'+useId().replace(/:/g,'');
const [keyboard,K]=useState(false);
useEffect(()=>{const key=e=>{if(e.key==='Tab')K(true)};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[]);
const open=focused||Boolean(value);
function close(){onChange('');setFocused(false);host.current.focus()}
return <div ref={host} tabIndex={-1} className={'seenry-fluid-search'+(open?' is-open':'')} data-reduced={reduced} data-keyboard={keyboard} onPointerDownCapture={()=>K(false)} onFocusCapture={e=>{if(e.target!==host.current)setFocused(true)}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close()}}}>
<svg aria-hidden="true" className="sfs-defs"><defs><filter id={id} x="-20%" y="-100%" width="140%" height="300%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="5"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8.5"/></filter></defs></svg>
 <div className="sfs-shapes" aria-hidden="true" style={{filter:reduced?'none':`url(#${id})`}}><div className="sfs-pill"/><div className="sfs-circle"/></div>
 <label className="sfs-field"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input aria-label={label} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/></label>
 <button className="sfs-close" type="button" aria-label="Close search" aria-hidden={!open} tabIndex={open?0:-1} onClick={close}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
 </div>
}

import ImageBlend from './ImageBlend';
import React, { createContext, useContext, useEffect, useId, useLayoutEffect, useMemo, useCallback, useRef, useState } from 'react';

// Seenry surface renderer. Original implementation using browser SVG primitives.
// No external fluid runtime. Rendering only; the application owns semantics.
export function useFluidReducedMotion() {
const [reduced,S]=useState(()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>S(m.matches);update();m.addEventListener('change',update);return()=>m.removeEventListener('change',update)},[]);return reduced;
}
const Context=createContext(null);
export function FluidSurface({children,fill='#202020',blur=6,contrast=18,shadow,filterPadding=32,...props}) {
const host=useRef(),items=useRef(new Map()),memory=useRef(new Map()),wake=useRef(()=>{});const [shapes,S]=useState([]);const reduced=useFluidReducedMotion();const id='seenry-'+useId().replace(/:/g,'');
const context=useMemo(()=>({reduced,register(key,node,effect){items.current.set(key,{node,effect});wake.current();return()=>{items.current.delete(key);wake.current()}},wake:()=>wake.current()}),[reduced]);
useLayoutEffect(()=>{
if(reduced){memory.current.clear();S([]);return}
let frame=0,until=0,previous=0;const positions=memory.current;
const tick=time=>{
frame=0;if(!host.current)return;const base=host.current.getBoundingClientRect();const dt=Math.min((time-previous)/1000||.016,.032);previous=time;const result=[];let moving=false;
for(const [key,{node,effect}] of items.current){
if(!node.isConnected)continue;const box=node.getBoundingClientRect(),style=getComputedStyle(node);
const target={x:box.left-base.left,y:box.top-base.top,w:box.width,h:box.height};
let last=positions.get(key);if(!last)last={...target,vx:0,vy:0,tx:target.x,ty:target.y,bx:0,by:0};
const dx=target.x-last.x,dy=target.y-last.y;
const smoothing=effect==='morph'?1-Math.exp(-dt*32):1;
const tailRate=1-Math.exp(-dt*18);
const tailX=effect==='move'?last.x+dx*tailRate:target.x;
const tailY=effect==='move'?last.y+dy*tailRate:target.y;
const velocityX=(target.x-last.tx)/Math.max(dt,.008),velocityY=(target.y-last.ty)/Math.max(dt,.008);
const decay=1-Math.exp(-dt*14);
const bx=last.bx+(Math.max(-18,Math.min(18,-velocityX*.025))-last.bx)*decay;
const by=last.by+(Math.max(-18,Math.min(18,-velocityY*.025))-last.by)*decay;
const current={x:effect==='move'?tailX:last.x+dx*smoothing,y:effect==='move'?tailY:last.y+dy*smoothing,w:last.w+(target.w-last.w)*smoothing,h:last.h+(target.h-last.h)*smoothing,vx:target.x-tailX,vy:target.y-tailY,tx:target.x,ty:target.y,bx,by};
moving ||= Math.abs(dx)+Math.abs(dy)+Math.abs(target.w-current.w)+Math.abs(target.h-current.h)+Math.abs(bx)+Math.abs(by)>.12;
positions.set(key,current);
const painted=effect==='move'?{...current,x:target.x,y:target.y}:current;
const parsed=parseFloat(style.borderRadius)||0;const radius=style.borderRadius.includes('%')?Math.min(current.w,current.h)/2:Math.min(parsed,current.w/2,current.h/2);
const img=node.querySelector('img');result.push({...painted,key,effect,radius,src:img?.currentSrc||img?.src,opacity:parseFloat(style.opacity)||0});
}
S(result);if(time<until||moving)frame=requestAnimationFrame(tick);
};
const run=()=>{until=performance.now()+1000;if(!frame)frame=requestAnimationFrame(tick)};wake.current=run;
const resize=new ResizeObserver(run);resize.observe(host.current);
// Only watch the content branch, never our SVG frame updates.
const observers=[];for(const {node} of items.current.values()){resize.observe(node);const o=new MutationObserver(run);o.observe(node,{attributes:true,childList:true,subtree:true,attributeFilter:['style','class']});observers.push(o)}
host.current.addEventListener('transitionrun',run);host.current.addEventListener('pointerdown',run);run();
return()=>{cancelAnimationFrame(frame);resize.disconnect();observers.forEach(o=>o.disconnect());host.current?.removeEventListener('transitionrun',run);host.current?.removeEventListener('pointerdown',run);wake.current=()=>{}};
},[reduced,children]);
const solid=shapes.filter(s=>s.effect!=='melt');const images=shapes.filter(s=>s.effect==='melt');
return <Context.Provider value={context}><div {...props} ref={host} style={{position:'relative',isolation:'isolate',...props.style,'--fluid-fill':fill}}>
{!reduced&&<svg aria-hidden="true" width="100%" height="100%" style={{position:'absolute',inset:0,overflow:'visible',pointerEvents:'none',zIndex:0}}>
<defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={blur}/><feColorMatrix type="matrix" values={`1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${contrast} ${-(contrast-1)/2}`}/></filter><filter id={id+'-seam'} x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
<g filter={`url(#${id})`} fill={fill}>{solid.map(s=>{
const bend=s.effect==='bend'?s.by:0;
const stretchX=s.effect==='move'?Math.max(-s.w*.7,Math.min(s.w*.7,s.vx)) : 0;
const stretchY=s.effect==='move'?Math.max(-s.h*.6,Math.min(s.h*.6,s.vy)) : 0;
const x=s.x-Math.max(0,stretchX),y=s.y-Math.max(0,stretchY),w=s.w+Math.abs(stretchX),h=s.h+Math.abs(stretchY);
const r=s.radius,side=s.effect==='bend'?s.bx:0;
return <g key={s.key}>{s.effect==='bend'?<path d={`M${s.x+r},${s.y} Q${s.x+s.w/2},${s.y+bend} ${s.x+s.w-r},${s.y} Q${s.x+s.w},${s.y} ${s.x+s.w},${s.y+r} Q${s.x+s.w+side},${s.y+s.h/2} ${s.x+s.w},${s.y+s.h-r} Q${s.x+s.w},${s.y+s.h} ${s.x+s.w-r},${s.y+s.h} Q${s.x+s.w/2},${s.y+s.h+bend} ${s.x+r},${s.y+s.h} Q${s.x},${s.y+s.h} ${s.x},${s.y+s.h-r} Q${s.x+side},${s.y+s.h/2} ${s.x},${s.y+r} Q${s.x},${s.y} ${s.x+r},${s.y} Z`}/>:<rect x={x} y={y} width={w} height={h} rx={r}/>}</g>
})}</g>
{images.length>0&&<ImageBlend images={images} id={id+"-blend"}/>}

</svg>}{children}</div></Context.Provider>
}
export function FluidItem({children,x=0,y=0,scale=1,effect='merge',transition,delay=0,morph}) {
const ctx=useContext(Context);const ref=useRef();const key=useId().replace(/:/g,'');const animated=transition!==undefined||x!==0||y!==0;
useLayoutEffect(()=>{const node=ref.current;if(!node||!ctx)return;const original={background:node.style.background,opacity:node.style.opacity,position:node.style.position,zIndex:node.style.zIndex};if(getComputedStyle(node).position==='static')node.style.position='relative';node.style.zIndex='1';if(!ctx.reduced){if(effect==='melt')node.style.opacity='0';else node.style.background='transparent'}const unregister=ctx.register(key,node,effect);return()=>{unregister();node.style.background=original.background;node.style.opacity=original.opacity;node.style.position=original.position;node.style.zIndex=original.zIndex}},[ctx,key,effect]);
useLayoutEffect(()=>{ctx?.wake()},[x,y,scale,children]);
const element=React.Children.only(children);const originalRef=element.props.ref;const assign=useCallback(node=>{ref.current=node;if(typeof originalRef==='function')originalRef(node);else if(originalRef)originalRef.current=node},[originalRef]);
const child=React.cloneElement(element,{ref:assign});
const duration=ctx?.reduced?0:typeof transition==='object'?(transition.duration||420):420;
return animated?<div style={{position:'relative',zIndex:1,transform:`translate(${x}px,${y}px) scale(${scale})`,transition:`transform ${duration}ms ${transition?.ease||'cubic-bezier(.22,1,.36,1)'} ${ctx?.reduced?0:delay}ms`}}>{child}</div>:<div style={{display:'contents'}}>{child}</div>
}

import React from 'react';

// Original Seenry renderer: contact-local mixing with unfiltered outer faces.
// Research and limitations are recorded in references/surface-effects.md.
export default function ImageBlend({images,id}) {
const pair=images.slice(0,2),[a,b]=pair;
if(!a)return null;
const cx=s=>s.x+s.w/2,cy=s=>s.y+s.h/2;
const gap=b?Math.hypot(Math.max(0,Math.abs(cx(b)-cx(a))-(a.w+b.w)/2),Math.max(0,Math.abs(cy(b)-cy(a))-(a.h+b.h)/2)):100;
const near=Math.max(0,1-gap/22),contact=near*near*(3-2*near);
const x=b?(cx(a)+cx(b))/2:cx(a),y=b?(cy(a)+cy(b))/2:cy(a);
const angle=b?Math.atan2(cy(b)-cy(a),cx(b)-cx(a))*180/Math.PI:0;
const overlap=b?Math.max(0,(a.w+b.w)/2-Math.hypot(cx(b)-cx(a),cy(b)-cy(a))):0;
const breadth=(18+overlap*.55)*contact;
const extent=Math.min(a.h,b?.h||a.h)*.64;
const bounds={x:Math.min(...pair.map(s=>s.x))-70,y:Math.min(...pair.map(s=>s.y))-70,width:Math.max(...pair.map(s=>s.x+s.w))-Math.min(...pair.map(s=>s.x))+140,height:Math.max(...pair.map(s=>s.y+s.h))-Math.min(...pair.map(s=>s.y))+140};
const faces=()=>pair.map(s=><image key={s.key} href={s.src} x={s.x} y={s.y} width={s.w} height={s.h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-clip-${s.key})`}/>);
return <g data-seenry-blend="contact">
<defs>
{pair.map(s=><clipPath key={s.key} id={`${id}-clip-${s.key}`}><rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.radius}/></clipPath>)}
<filter id={id+'-body'} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={1+contact*6} result="soft"/><feColorMatrix in="soft" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 26 -11" result="shape"/><feGaussianBlur in="SourceGraphic" stdDeviation={1+contact*13} result="color"/><feComposite in="color" in2="shape" operator="in"/></filter>
<filter id={id+'-fold'} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="5" result="palette"/><feTurbulence type="fractalNoise" baseFrequency=".017 .032" numOctaves="2" seed="8" result="field"/><feDisplacementMap in="palette" in2="field" scale={contact*46} xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id={id+'-fade'} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10"/></filter>
<mask id={id+'-contact'} maskUnits="userSpaceOnUse" {...bounds}><ellipse cx={x} cy={y} rx={breadth} ry={extent} transform={`rotate(${angle},${x},${y})`} fill="white" filter={`url(#${id}-fade)`}/></mask>
<mask id={id+'-sharp'} maskUnits="userSpaceOnUse" {...bounds}><rect {...bounds} fill="white"/><ellipse cx={x} cy={y} rx={breadth} ry={extent} transform={`rotate(${angle},${x},${y})`} fill="black" filter={`url(#${id}-fade)`}/></mask>
<mask id={id+'-outline'} maskUnits="userSpaceOnUse" {...bounds}><g filter={`url(#${id}-body)`}>{pair.map(s=><rect key={s.key} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.radius} fill="white"/>)}</g></mask>
</defs>
{contact>0&&<><g filter={`url(#${id}-body)`}>{faces()}</g><g mask={`url(#${id}-outline)`}><g mask={`url(#${id}-contact)`}><g filter={`url(#${id}-fold)`}>{faces()}</g></g></g></>}
<g mask={contact>0?`url(#${id}-sharp)`:undefined}>{faces()}</g>
</g>;
}

.seenry-fluid-search{--search-fill:#e9e9e9;position:relative;isolation:isolate;width:100%;height:52px;outline:none;--search-ease:cubic-bezier(.22,1,.36,1)}
.sfs-defs{position:absolute;width:0;height:0;pointer-events:none}
.sfs-shapes{position:absolute;inset:0;pointer-events:none;z-index:0}
.sfs-pill,.sfs-circle{position:absolute;background:var(--search-fill);height:52px;border-radius:999px;transition:width 460ms var(--search-ease),transform 460ms var(--search-ease)}
.sfs-pill{left:0;top:0;width:100%}.sfs-circle{right:0;top:0;width:52px;transform:translateX(-28px) scale(.8)}
.is-open>.sfs-shapes>.sfs-pill{width:calc(100% - 64px)}.is-open>.sfs-shapes>.sfs-circle{transform:translateX(0) scale(1)}
.sfs-field{position:relative;z-index:1;display:flex;align-items:center;gap:12px;width:100%;height:52px;box-sizing:border-box;padding:0 18px;border-radius:999px;transition:width 460ms var(--search-ease)}
.is-open>.sfs-field{width:calc(100% - 64px)}.sfs-field>svg{flex-shrink:0;color:#666}
.sfs-field input{width:100%;min-width:0;border:0!important;outline:none!important;background:transparent!important;box-shadow:none!important;padding:0!important;font:inherit;font-size:14px;color:#222}
.sfs-close{position:absolute;z-index:2;right:0;top:0;width:52px;height:52px;display:grid;place-items:center;border:0!important;border-radius:50%;background:transparent!important;box-shadow:none!important;color:#222;cursor:pointer;opacity:0;transform:translateX(-28px) scale(.8);pointer-events:none;transition:transform 460ms var(--search-ease),opacity 140ms ease}
.is-open>.sfs-close{opacity:1;transform:translateX(0) scale(1);pointer-events:auto}.seenry-fluid-search[data-keyboard=true] .sfs-field:has(input:focus-visible),.seenry-fluid-search[data-keyboard=true] .sfs-close:focus-visible{outline:2px solid #888;outline-offset:3px}
.seenry-fluid-search[data-reduced=true] *{transition:none!important}

.seenry-fluid-search .sfs-close:focus{outline:none}.seenry-fluid-search[data-keyboard=true] .sfs-close:focus-visible{outline:2px solid #888;outline-offset:3px}