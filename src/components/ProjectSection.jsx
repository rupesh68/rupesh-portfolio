// 'use client';

// import * as React from 'react';
// import {
//   useCallback,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from 'react';
// import gsap from 'gsap';
// import {
//   AnimatePresence,
//   motion,
//   useAnimation,
//   useInView,
//   useReducedMotion,
// } from 'motion/react';
// import { cn } from '../lib/utils';

// const ARROW_VARIANTS = {
//   normal: {
//     scale: 1,
//     translateX: 0,
//     translateY: 0,
//   },
//   animate: {
//     scale: [1, 0.85, 1],
//     translateX: [0, -4, 0],
//     translateY: [0, 4, 0],
//     originX: 1,
//     originY: 0,
//     transition: {
//       duration: 0.5,
//       ease: 'easeInOut',
//     },
//   },
// };

// const ArrowUpRightIcon = React.forwardRef(function ArrowUpRightIcon(
//   {
//     onMouseEnter,
//     onMouseLeave,
//     className,
//     size,
//     active,
//     style,
//     strokeWidth,
//     ...props
//   },
//   ref,
// ) {
//   const controls = useAnimation();
//   const isControlledRef = useRef(false);

//   useImperativeHandle(ref, () => {
//     isControlledRef.current = true;
//     return {
//       startAnimation: () => controls.start('animate'),
//       stopAnimation: () => controls.start('normal'),
//     };
//   });

//   const handleMouseEnter = useCallback(
//     (e) => {
//       if (!isControlledRef.current) controls.start('animate');
//       onMouseEnter?.(e);
//     },
//     [controls, onMouseEnter],
//   );

//   const handleMouseLeave = useCallback(
//     (e) => {
//       if (!isControlledRef.current) controls.start('normal');
//       onMouseLeave?.(e);
//     },
//     [controls, onMouseLeave],
//   );

//   const wrap = useRef(null);
//   const reduced = useReducedMotion();
//   const [hosted, setHosted] = useState(false);

//   useEffect(() => {
//     const fake = {};
//     if (reduced) {
//       setHosted(true);
//       return;
//     }
//     if (active !== undefined) {
//       setHosted(true);
//       (active ? handleMouseEnter : handleMouseLeave)(fake);
//       return;
//     }
//     const host = wrap.current?.parentElement?.closest(
//       'button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label',
//     );
//     setHosted(!!host);
//     if (!host) return;
//     const on = () => handleMouseEnter(fake);
//     const off = () => handleMouseLeave(fake);
//     host.addEventListener('pointerenter', on);
//     host.addEventListener('pointerleave', off);
//     return () => {
//       host.removeEventListener('pointerenter', on);
//       host.removeEventListener('pointerleave', off);
//     };
//   }, [active, reduced, handleMouseEnter, handleMouseLeave]);

//   return (
//     <span
//       ref={wrap}
//       className={cn(
//         'inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full',
//         className,
//       )}
//       style={size ? { width: size, height: size, ...style } : style}
//       onMouseEnter={hosted ? undefined : handleMouseEnter}
//       onMouseLeave={hosted ? undefined : handleMouseLeave}
//       {...props}
//     >
//       <svg
//         fill="none"
//         height={size}
//         stroke="currentColor"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth ?? 2}
//         viewBox="0 0 24 24"
//         width={size}
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <motion.g animate={controls} variants={ARROW_VARIANTS}>
//           <path d="M7 7H17" />
//           <path d="M17 7V17" />
//           <path d="M7 17L17 7" />
//         </motion.g>
//       </svg>
//     </span>
//   );
// });

// ArrowUpRightIcon.displayName = 'ArrowUpRightIcon';

// const DEFAULT_PROJECTS = [
//   {
//     title: 'FileVerse',
//     meta: 'cloud storage app, 2025',
//     image: '/fileverse.jpg',
//     alt: 'A modern house with a pool at dusk',
//   },
//   {
//     title: 'Property Finder',
//     meta: 'real estate app, 2025',
//     image: '/property-finder.png',
//     alt: 'A modern house with a pool at dusk',
//   },
// ];

// const GLIDE = [0.22, 1, 0.36, 1];
// const POP = { type: 'spring', stiffness: 520, damping: 32 };
// const MODES = {
//   pixel: 0,
//   grain: 1,
//   gradient: 2,
//   mirror: 3,
// };

// const VERTEX = `attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

// const FRAGMENT = `precision highp float;
// varying vec2 vUv;
// uniform sampler2D uA;uniform sampler2D uB;uniform vec2 uRes;uniform float uAspA;uniform float uAspB;
// uniform float uP;uniform float uMode;uniform float uInt;uniform vec2 uOff;uniform float uTime;
// float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
// vec2 cover(vec2 uv,float ta,float zoom){float pa=uRes.x/uRes.y;vec2 s=ta>pa?vec2(pa/ta,1.):vec2(1.,ta/pa);return(uv-.5)*s/zoom+.5+uOff*s;}
// vec3 A(vec2 uv,float z){return texture2D(uA,cover(uv,uAspA,z)).rgb;}
// vec3 B(vec2 uv,float z){return texture2D(uB,cover(uv,uAspB,z)).rgb;}
// void main(){
// vec2 uv=vUv;float p=uP;float k=sin(3.14159*p);vec3 c;
// float zA=1.04+.04*p;float zB=1.08-.04*p;
// if(uMode<.5){
// float cells=mix(uRes.y,mix(14.,4.,uInt),pow(k,.6));
// vec2 cell=vec2(cells*uRes.x/uRes.y,cells);
// vec2 q=(floor(uv*cell)+.5)/cell;
// c=mix(A(q,zA),B(q,zB),smoothstep(.4,.6,p));
// }else if(uMode<1.5){
// float n=hash(floor(uv*uRes/mix(1.,3.,uInt)));
// float t=p*1.3-.15;
// float m=smoothstep(t-.12,t+.12,n);
// c=mix(B(uv,zB),A(uv,zA),m);
// c+=(hash(uv*uRes+fract(uTime)*91.)-.5)*.22*uInt*k;
// }else if(uMode<2.5){
// float d=uv.x*.75+(1.-uv.y)*.25;
// float e=p*1.5-.25;
// float m=smoothstep(e-.18,e+.18,d);
// vec2 shift=vec2((1.-p)*.04,0.);
// c=mix(B(uv+shift,zB),A(uv-shift*.5,zA),m);
// float band=1.-abs(m-.5)*2.;
// c+=band*band*(.25+.35*uInt);
// }else{
// float d=abs(uv.x-.5)*2.;
// float r=p*1.02;
// if(d<r){
// c=B(vec2(.5+(uv.x-.5)*(1.-.12*(1.-p)),uv.y),zB);
// }else{
// float s=sign(uv.x-.5);
// float f=(d-r)/max(1.-r,1e-3);
// vec2 ua=vec2(.5+s*(.5-(1.-f)*.5*(1.-.5*p)),uv.y);
// c=A(ua,zA)*(1.-.25*k);
// }
// float seam=exp(-abs(d-r)*mix(60.,22.,uInt))*k;
// c+=seam*.6;
// }
// gl_FragColor=vec4(c,1.);}`;

// export const ProjectIndex = React.forwardRef(function ProjectIndex(
//   {
//     projects = DEFAULT_PROJECTS,
//     eyebrow = 'Selected projects',
//     effect = 'pixel',
//     duration = 0.9,
//     intensity = 0.6,
//     select = 'hover',
//     imageSide = 'right',
//     numbers = true,
//     meta = true,
//     autoplay = false,
//     interval = 4,
//     parallax = 0.5,
//     defaultIndex = 0,
//     onOpen,
//     className,
//   },
//   ref,
// ) {
//   const still = !!useReducedMotion();
//   const id = React.useId();
//   const root = React.useRef(null);
//   React.useImperativeHandle(ref, () => root.current);
//   const canvas = React.useRef(null);
//   const panel = React.useRef(null);
//   const seen = useInView(root, { once: true, amount: 0.3 });
//   const visible = useInView(root, { amount: 0.05 });
//   const shown = seen || still;
//   const count = projects.length;
//   const [active, setActive] = React.useState(() =>
//     Math.min(Math.max(0, defaultIndex), Math.max(0, count - 1)),
//   );
//   const [hoverRow, setHoverRow] = React.useState(null);
//   const [inside, setInside] = React.useState(false);
//   const [webgl, setWebgl] = React.useState(true);
//   const params = React.useRef({
//     effect,
//     duration,
//     intensity,
//     parallax,
//     still,
//   });
//   params.current = { effect, duration, intensity, parallax, still };
//   const lean = React.useRef({ x: 0, y: 0, tx: 0, ty: 0 });
//   const goTo = React.useRef(() => {});

//   const pad = (n) => String(n).padStart(2, '0');
//   const current = projects[active];

//   React.useEffect(() => {
//     const el = canvas.current;
//     if (!el) return;
//     const gl = el.getContext('webgl', {
//       antialias: false,
//       premultipliedAlpha: false,
//     });
//     if (!gl) {
//       setWebgl(false);
//       return;
//     }
//     const compile = (type, src) => {
//       const s = gl.createShader(type);
//       gl.shaderSource(s, src);
//       gl.compileShader(s);
//       return s;
//     };
//     const prog = gl.createProgram();
//     gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX));
//     gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT));
//     gl.linkProgram(prog);
//     gl.useProgram(prog);
//     gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//     gl.bufferData(
//       gl.ARRAY_BUFFER,
//       new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
//       gl.STATIC_DRAW,
//     );
//     const loc = gl.getAttribLocation(prog, 'p');
//     gl.enableVertexAttribArray(loc);
//     gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
//     const U = Object.fromEntries(
//       [
//         'uA',
//         'uB',
//         'uRes',
//         'uAspA',
//         'uAspB',
//         'uP',
//         'uMode',
//         'uInt',
//         'uOff',
//         'uTime',
//       ].map((n) => [n, gl.getUniformLocation(prog, n)]),
//     );
//     gl.uniform1i(U.uA, 0);
//     gl.uniform1i(U.uB, 1);
//     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

//     let dead = false;
//     const images = [];
//     const blank = new Uint8Array([236, 236, 234, 255]);
//     const texes = projects.map((pr) => {
//       const t = { tex: gl.createTexture(), aspect: 1.5 };
//       gl.bindTexture(gl.TEXTURE_2D, t.tex);
//       gl.texImage2D(
//         gl.TEXTURE_2D,
//         0,
//         gl.RGBA,
//         1,
//         1,
//         0,
//         gl.RGBA,
//         gl.UNSIGNED_BYTE,
//         blank,
//       );
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//       const im = new Image();
//       im.crossOrigin = 'anonymous';
//       im.decoding = 'async';
//       images.push(im);
//       im.onload = () => {
//         if (dead) return;
//         gl.activeTexture(gl.TEXTURE2);
//         gl.bindTexture(gl.TEXTURE_2D, t.tex);
//         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
//         t.aspect = im.naturalWidth / im.naturalHeight;
//         draw();
//       };
//       im.src = pr.image;
//       return t;
//     });

//     const state = { from: active, to: active, p: 1, time: 0 };
//     let tween = null;
//     const draw = () => {
//       const dpr = Math.min(2, window.devicePixelRatio || 1);
//       const w = Math.max(1, Math.round(el.clientWidth * dpr));
//       const h = Math.max(1, Math.round(el.clientHeight * dpr));
//       if (el.width !== w || el.height !== h) {
//         el.width = w;
//         el.height = h;
//       }
//       const a = texes[state.from];
//       const b = texes[state.to];
//       if (!a || !b) return;
//       const pp = params.current;
//       gl.viewport(0, 0, w, h);
//       gl.activeTexture(gl.TEXTURE0);
//       gl.bindTexture(gl.TEXTURE_2D, a.tex);
//       gl.activeTexture(gl.TEXTURE1);
//       gl.bindTexture(gl.TEXTURE_2D, b.tex);
//       gl.uniform2f(U.uRes, w, h);
//       gl.uniform1f(U.uAspA, a.aspect);
//       gl.uniform1f(U.uAspB, b.aspect);
//       gl.uniform1f(U.uP, state.p);
//       gl.uniform1f(U.uMode, MODES[pp.effect]);
//       gl.uniform1f(U.uInt, pp.intensity);
//       gl.uniform2f(U.uOff, lean.current.x * 0.025, lean.current.y * 0.025);
//       gl.uniform1f(U.uTime, state.time);
//       gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//     };

//     goTo.current = (i) => {
//       if (i === state.to) return;
//       state.from = state.p > 0.5 ? state.to : state.from;
//       state.to = i;
//       state.p = 0;
//       tween?.kill();
//       const pp = params.current;
//       tween = gsap.to(state, {
//         p: 1,
//         duration: pp.still ? 0.15 : pp.duration,
//         ease: 'power2.inOut',
//         onUpdate: draw,
//         onComplete: () => {
//           state.from = state.to;
//           draw();
//         },
//       });
//     };

//     const tick = (_t, dms) => {
//       if (document.hidden || !el.isConnected) return;
//       const l = lean.current;
//       const k = 1 - Math.exp(-(dms / 1000) * 5);
//       const before = l.x + l.y;
//       l.x += (l.tx - l.x) * k;
//       l.y += (l.ty - l.y) * k;
//       state.time += dms / 1000;
//       if (
//         Math.abs(l.x + l.y - before) > 1e-4 ||
//         (state.p < 1 && params.current.effect === 'grain')
//       )
//         draw();
//     };
//     gsap.ticker.add(tick);
//     const ro = new ResizeObserver(draw);
//     ro.observe(el);
//     draw();
//     return () => {
//       dead = true;
//       images.forEach((im) => (im.onload = null));
//       gsap.ticker.remove(tick);
//       ro.disconnect();
//       tween?.kill();
//       texes.forEach((t) => gl.deleteTexture(t.tex));
//       gl.deleteProgram(prog);
//       goTo.current = () => {};
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [projects.map((p) => p.image).join('|')]);

//   React.useEffect(() => {
//     goTo.current(active);
//   }, [active]);

//   React.useEffect(() => {
//     if (!autoplay || still || !visible || inside || count < 2) return;
//     const t = window.setTimeout(
//       () => setActive((a) => (a + 1) % count),
//       interval * 1000,
//     );
//     return () => window.clearTimeout(t);
//   }, [autoplay, still, visible, inside, count, interval, active]);

//   const open = (i) => {
//     const pr = projects[i];
//     if (!pr) return;
//     onOpen?.(pr, i);
//   };

//   const onKeyDown = (e) => {
//     if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
//     e.preventDefault();
//     const next = (active + (e.key === 'ArrowDown' ? 1 : count - 1)) % count;
//     setActive(next);
//     root.current?.querySelector(`[data-row="${next}"]`)?.focus();
//   };

//   const enter = (delay) => ({
//     initial: still ? false : { opacity: 0, y: 10, filter: 'blur(4px)' },
//     animate: shown ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
//     transition: { duration: 0.5, ease: GLIDE, delay: still ? 0 : delay },
//   });

//   const RowTag = (pr) => (pr.href ? motion.a : motion.button);

//   return (
//     <motion.div
//       ref={root}
//       initial={still ? false : { opacity: 0, y: 18 }}
//       animate={shown ? { opacity: 1, y: 0 } : undefined}
//       transition={{ duration: 0.6, ease: GLIDE }}
//       onPointerEnter={() => setInside(true)}
//       onPointerLeave={() => {
//         setInside(false);
//         setHoverRow(null);
//       }}
//       className={cn(
//         '@container relative mx-auto   text-foreground transition-colors duration-200 hover:border-border-hover',
//         className,
//       )}
//     >
//       <p className="font-mono text-xs tracking-widest uppercase text-subtle">
//         Projects
//       </p>
//       <div
//         className={cn(
//           'grid grid-cols-1 gap-2 @min-[640px]:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] mt-4',
//           imageSide === 'left' &&
//             '@min-[640px]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
//         )}
//       >
//         {/* Project index list */}
//         <div
//           className={cn(
//             'order-2 flex flex-col   pb-2 pt-4 @min-[640px]:pb-2',
//             imageSide === 'left'
//               ? '@min-[640px]:order-2'
//               : '@min-[640px]:order-1',
//           )}
//         >
//           <motion.div
//             {...enter(0.05)}
//             className="flex items-center justify-between px-3 pb-2 text-xs font-medium text-subtle"
//           >
//             <span>{eyebrow}</span>
//             <span className="tabular-nums">{count} projects</span>
//           </motion.div>

//           <ul
//             role="list"
//             onKeyDown={onKeyDown}
//             onPointerLeave={() => setHoverRow(null)}
//             className="flex flex-1 flex-col"
//           >
//             {projects.map((pr, i) => {
//               const on = i === active;
//               const Tag = RowTag(pr);
//               return (
//                 <motion.li key={`${pr.title}-${i}`} {...enter(0.1 + i * 0.05)}>
//                   <Tag
//                     {...(pr.href ? { href: pr.href } : { type: 'button' })}
//                     data-row={i}
//                     aria-current={on ? 'true' : undefined}
//                     onPointerEnter={() => {
//                       setHoverRow(i);
//                       if (select === 'hover') setActive(i);
//                     }}
//                     onFocus={() => setActive(i)}
//                     onClick={(e) => {
//                       if (select === 'click' && !on) {
//                         e.preventDefault();
//                         setActive(i);
//                         return;
//                       }
//                       open(i);
//                     }}
//                     whileTap={still ? undefined : { scale: 0.985 }}
//                     className="focus-ring group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
//                   >
//                     {(hoverRow ?? active) === i && (
//                       <motion.span
//                         layoutId={`${id}-row`}
//                         transition={still ? { duration: 0 } : POP}
//                         className="absolute inset-0 rounded-2xl bg-surface-hover"
//                       />
//                     )}

//                     {numbers && (
//                       <span
//                         className={cn(
//                           'relative w-5 shrink-0 self-start pt-0.5 text-xs font-medium tabular-nums transition-colors duration-300',
//                           on ? 'text-foreground' : 'text-subtle',
//                         )}
//                       >
//                         {pad(i + 1)}
//                       </span>
//                     )}

//                     <motion.span
//                       className="relative min-w-0 flex-1"
//                       animate={{ x: on && !still ? 2 : 0 }}
//                       transition={POP}
//                     >
//                       <span
//                         className={cn(
//                           'block truncate text-base font-medium leading-6 transition-colors duration-300',
//                           on
//                             ? 'text-foreground'
//                             : 'text-muted group-hover:text-foreground',
//                         )}
//                       >
//                         {pr.title}
//                       </span>

//                       {meta && pr.meta && (
//                         <span
//                           className={cn(
//                             'block truncate text-xs leading-4 transition-colors duration-300',
//                             on ? 'text-muted' : 'text-subtle',
//                           )}
//                         >
//                           {pr.meta}
//                         </span>
//                       )}

//                       {autoplay && on && !still && !inside && (
//                         <motion.span
//                           key={`bar-${active}`}
//                           aria-hidden
//                           className="absolute -bottom-1.5 left-0 h-px origin-left bg-foreground/25"
//                           initial={{ scaleX: 0 }}
//                           animate={{ scaleX: 1 }}
//                           transition={{ duration: interval, ease: 'linear' }}
//                           style={{ width: '100%' }}
//                         />
//                       )}
//                     </motion.span>

//                     <AnimatePresence initial={false}>
//                       {on && (
//                         <motion.span
//                           key="arrow"
//                           aria-hidden
//                           initial={
//                             still
//                               ? { opacity: 0 }
//                               : { opacity: 0, scale: 0.4, rotate: -45 }
//                           }
//                           animate={{ opacity: 1, scale: 1, rotate: 0 }}
//                           exit={
//                             still
//                               ? { opacity: 0 }
//                               : { opacity: 0, scale: 0.4, rotate: 45 }
//                           }
//                           transition={POP}
//                           className="relative grid size-6 shrink-0 place-items-center text-foreground"
//                         >
//                           <ArrowUpRightIcon className="size-4" />
//                         </motion.span>
//                       )}
//                     </AnimatePresence>
//                   </Tag>
//                 </motion.li>
//               );
//             })}
//           </ul>
//         </div>

//         {/* Image preview panel */}
//         <motion.div
//           {...enter(0.15)}
//           ref={panel}
//           onPointerMove={(e) => {
//             const r = e.currentTarget.getBoundingClientRect();
//             const k = still ? 0 : parallax;
//             lean.current.tx = (((e.clientX - r.left) / r.width) * 2 - 1) * k;
//             lean.current.ty = -(((e.clientY - r.top) / r.height) * 2 - 1) * k;
//           }}
//           onPointerLeave={() => {
//             lean.current.tx = 0;
//             lean.current.ty = 0;
//           }}
//           className={cn(
//             'relative isolate order-1 aspect-4/3 overflow-hidden rounded-[22px] border border-border/60 bg-surface-muted @min-[640px]:aspect-auto @min-[640px]:min-h-85',
//             imageSide === 'left'
//               ? '@min-[640px]:order-1'
//               : '@min-[640px]:order-2',
//           )}
//         >
//           <canvas
//             ref={canvas}
//             role="img"
//             aria-label={current ? (current.alt ?? current.title) : undefined}
//             className="absolute inset-0 -z-10 size-full"
//           />
//           {!webgl && current && (
//             <AnimatePresence initial={false}>
//               <motion.img
//                 key={current.image}
//                 src={current.image}
//                 alt=""
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="absolute inset-0 -z-10 size-full object-cover"
//               />
//             </AnimatePresence>
//           )}

//           <div
//             aria-hidden
//             className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent"
//           />

//           {current && (
//             <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
//               <div className="min-w-0 text-white">
//                 <p className="text-xs font-medium text-white/75">
//                   Project{' '}
//                   <span className="relative inline-grid overflow-hidden align-bottom tabular-nums">
//                     <AnimatePresence mode="popLayout" initial={false}>
//                       <motion.span
//                         key={active}
//                         initial={
//                           still ? { opacity: 0 } : { y: '100%', opacity: 0 }
//                         }
//                         animate={{ y: 0, opacity: 1 }}
//                         exit={
//                           still ? { opacity: 0 } : { y: '-100%', opacity: 0 }
//                         }
//                         transition={{ duration: 0.35, ease: GLIDE }}
//                       >
//                         {pad(active + 1)}
//                       </motion.span>
//                     </AnimatePresence>
//                   </span>{' '}
//                   / {pad(count)}
//                 </p>

//                 <div className="relative mt-1 overflow-hidden">
//                   <AnimatePresence mode="popLayout" initial={false}>
//                     <motion.p
//                       key={current.title}
//                       initial={
//                         still
//                           ? { opacity: 0 }
//                           : { y: '60%', opacity: 0, filter: 'blur(6px)' }
//                       }
//                       animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
//                       exit={
//                         still
//                           ? { opacity: 0 }
//                           : { y: '-60%', opacity: 0, filter: 'blur(6px)' }
//                       }
//                       transition={{ duration: 0.5, ease: GLIDE }}
//                       className="truncate text-xl font-medium leading-7 tracking-tight"
//                     >
//                       {current.title}
//                     </motion.p>
//                   </AnimatePresence>
//                 </div>
//               </div>

//               <motion.button
//                 type="button"
//                 aria-label={`Open ${current.title}`}
//                 onClick={() => {
//                   open(active);
//                   if (current.href) window.location.assign(current.href);
//                 }}
//                 whileHover={still ? undefined : { scale: 1.08 }}
//                 whileTap={still ? undefined : { scale: 0.92 }}
//                 transition={POP}
//                 className="group grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white/95 text-zinc-900 shadow-md backdrop-blur-xs transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
//               >
//                 <ArrowUpRightIcon className="size-4" />
//               </motion.button>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// });
'use client';

import * as React from 'react';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
  useReducedMotion,
} from 'motion/react';
import { cn } from '../lib/utils';

const ARROW_VARIANTS = {
  normal: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  animate: {
    scale: [1, 0.85, 1],
    translateX: [0, -4, 0],
    translateY: [0, 4, 0],
    originX: 1,
    originY: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

const ArrowUpRightIcon = React.forwardRef(function ArrowUpRightIcon(
  {
    onMouseEnter,
    onMouseLeave,
    className,
    size,
    active,
    style,
    strokeWidth,
    ...props
  },
  ref,
) {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;
    return {
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    };
  });

  const handleMouseEnter = useCallback(
    (e) => {
      if (!isControlledRef.current) controls.start('animate');
      onMouseEnter?.(e);
    },
    [controls, onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (e) => {
      if (!isControlledRef.current) controls.start('normal');
      onMouseLeave?.(e);
    },
    [controls, onMouseLeave],
  );

  const wrap = useRef(null);
  const reduced = useReducedMotion();
  const [hosted, setHosted] = useState(false);

  useEffect(() => {
    const fake = {};
    if (reduced) {
      setHosted(true);
      return;
    }
    if (active !== undefined) {
      setHosted(true);
      (active ? handleMouseEnter : handleMouseLeave)(fake);
      return;
    }
    const host = wrap.current?.parentElement?.closest(
      'button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label',
    );
    setHosted(!!host);
    if (!host) return;
    const on = () => handleMouseEnter(fake);
    const off = () => handleMouseLeave(fake);
    host.addEventListener('pointerenter', on);
    host.addEventListener('pointerleave', off);
    return () => {
      host.removeEventListener('pointerenter', on);
      host.removeEventListener('pointerleave', off);
    };
  }, [active, reduced, handleMouseEnter, handleMouseLeave]);

  return (
    <span
      ref={wrap}
      className={cn(
        'inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full',
        className,
      )}
      style={size ? { width: size, height: size, ...style } : style}
      onMouseEnter={hosted ? undefined : handleMouseEnter}
      onMouseLeave={hosted ? undefined : handleMouseLeave}
      {...props}
    >
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth ?? 2}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.g animate={controls} variants={ARROW_VARIANTS}>
          <path d="M7 7H17" />
          <path d="M17 7V17" />
          <path d="M7 17L17 7" />
        </motion.g>
      </svg>
    </span>
  );
});

ArrowUpRightIcon.displayName = 'ArrowUpRightIcon';

const GLIDE = [0.22, 1, 0.36, 1];
const POP = { type: 'spring', stiffness: 520, damping: 32 };
const MODES = {
  pixel: 0,
  grain: 1,
  gradient: 2,
  mirror: 3,
};

const VERTEX = `attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

const FRAGMENT = `precision highp float;
varying vec2 vUv;
uniform sampler2D uA;uniform sampler2D uB;uniform vec2 uRes;uniform float uAspA;uniform float uAspB;
uniform float uP;uniform float uMode;uniform float uInt;uniform vec2 uOff;uniform float uTime;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 cover(vec2 uv,float ta,float zoom){float pa=uRes.x/uRes.y;vec2 s=ta>pa?vec2(pa/ta,1.):vec2(1.,ta/pa);return(uv-.5)*s/zoom+.5+uOff*s;}
vec3 A(vec2 uv,float z){return texture2D(uA,cover(uv,uAspA,z)).rgb;}
vec3 B(vec2 uv,float z){return texture2D(uB,cover(uv,uAspB,z)).rgb;}
void main(){
vec2 uv=vUv;float p=uP;float k=sin(3.14159*p);vec3 c;
float zA=1.04+.04*p;float zB=1.08-.04*p;
if(uMode<.5){
float cells=mix(uRes.y,mix(14.,4.,uInt),pow(k,.6));
vec2 cell=vec2(cells*uRes.x/uRes.y,cells);
vec2 q=(floor(uv*cell)+.5)/cell;
c=mix(A(q,zA),B(q,zB),smoothstep(.4,.6,p));
}else if(uMode<1.5){
float n=hash(floor(uv*uRes/mix(1.,3.,uInt)));
float t=p*1.3-.15;
float m=smoothstep(t-.12,t+.12,n);
c=mix(B(uv,zB),A(uv,zA),m);
c+=(hash(uv*uRes+fract(uTime)*91.)-.5)*.22*uInt*k;
}else if(uMode<2.5){
float d=uv.x*.75+(1.-uv.y)*.25;
float e=p*1.5-.25;
float m=smoothstep(e-.18,e+.18,d);
vec2 shift=vec2((1.-p)*.04,0.);
c=mix(B(uv+shift,zB),A(uv-shift*.5,zA),m);
float band=1.-abs(m-.5)*2.;
c+=band*band*(.25+.35*uInt);
}else{
float d=abs(uv.x-.5)*2.;
float r=p*1.02;
if(d<r){
c=B(vec2(.5+(uv.x-.5)*(1.-.12*(1.-p)),uv.y),zB);
}else{
float s=sign(uv.x-.5);
float f=(d-r)/max(1.-r,1e-3);
vec2 ua=vec2(.5+s*(.5-(1.-f)*.5*(1.-.5*p)),uv.y);
c=A(ua,zA)*(1.-.25*k);
}
float seam=exp(-abs(d-r)*mix(60.,22.,uInt))*k;
c+=seam*.6;
}
gl_FragColor=vec4(c,1.);}`;

export const ProjectIndex = React.forwardRef(function ProjectIndex(
  {
    projects = [],
    eyebrow = 'Selected projects',
    effect = 'pixel',
    duration = 0.9,
    intensity = 0.6,
    select = 'hover',
    imageSide = 'right',
    numbers = true,
    meta = true,
    autoplay = false,
    interval = 4,
    parallax = 0.5,
    defaultIndex = 0,
    onOpen,
    className,
  },
  ref,
) {
  const still = !!useReducedMotion();
  const id = React.useId();
  const root = React.useRef(null);
  React.useImperativeHandle(ref, () => root.current);
  const canvas = React.useRef(null);
  const panel = React.useRef(null);
  const seen = useInView(root, { once: true, amount: 0.3 });
  const visible = useInView(root, { amount: 0.05 });
  const shown = seen || still;
  const count = projects.length;
  const [active, setActive] = React.useState(() =>
    Math.min(Math.max(0, defaultIndex), Math.max(0, count - 1)),
  );
  const [hoverRow, setHoverRow] = React.useState(null);
  const [inside, setInside] = React.useState(false);
  const [webgl, setWebgl] = React.useState(true);
  const params = React.useRef({
    effect,
    duration,
    intensity,
    parallax,
    still,
  });
  params.current = { effect, duration, intensity, parallax, still };
  const lean = React.useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const goTo = React.useRef(() => {});

  const pad = (n) => String(n).padStart(2, '0');
  const current = projects[active];

  React.useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext('webgl', {
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setWebgl(false);
      return;
    }
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(
      [
        'uA',
        'uB',
        'uRes',
        'uAspA',
        'uAspB',
        'uP',
        'uMode',
        'uInt',
        'uOff',
        'uTime',
      ].map((n) => [n, gl.getUniformLocation(prog, n)]),
    );
    gl.uniform1i(U.uA, 0);
    gl.uniform1i(U.uB, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let dead = false;
    const images = [];
    const blank = new Uint8Array([236, 236, 234, 255]);
    const texes = projects.map((pr) => {
      const t = { tex: gl.createTexture(), aspect: 1.5 };
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        blank,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.decoding = 'async';
      images.push(im);
      im.onload = () => {
        if (dead) return;
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        t.aspect = im.naturalWidth / im.naturalHeight;
        draw();
      };
      im.src = pr.image;
      return t;
    });

    const state = { from: active, to: active, p: 1, time: 0 };
    let tween = null;
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      const a = texes[state.from];
      const b = texes[state.to];
      if (!a || !b) return;
      const pp = params.current;
      gl.viewport(0, 0, w, h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, a.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, b.tex);
      gl.uniform2f(U.uRes, w, h);
      gl.uniform1f(U.uAspA, a.aspect);
      gl.uniform1f(U.uAspB, b.aspect);
      gl.uniform1f(U.uP, state.p);
      gl.uniform1f(U.uMode, MODES[pp.effect]);
      gl.uniform1f(U.uInt, pp.intensity);
      gl.uniform2f(U.uOff, lean.current.x * 0.025, lean.current.y * 0.025);
      gl.uniform1f(U.uTime, state.time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    goTo.current = (i) => {
      if (i === state.to) return;
      state.from = state.p > 0.5 ? state.to : state.from;
      state.to = i;
      state.p = 0;
      tween?.kill();
      const pp = params.current;
      tween = gsap.to(state, {
        p: 1,
        duration: pp.still ? 0.15 : pp.duration,
        ease: 'power2.inOut',
        onUpdate: draw,
        onComplete: () => {
          state.from = state.to;
          draw();
        },
      });
    };

    const tick = (_t, dms) => {
      if (document.hidden || !el.isConnected) return;
      const l = lean.current;
      const k = 1 - Math.exp(-(dms / 1000) * 5);
      const before = l.x + l.y;
      l.x += (l.tx - l.x) * k;
      l.y += (l.ty - l.y) * k;
      state.time += dms / 1000;
      if (
        Math.abs(l.x + l.y - before) > 1e-4 ||
        (state.p < 1 && params.current.effect === 'grain')
      )
        draw();
    };
    gsap.ticker.add(tick);
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    draw();
    return () => {
      dead = true;
      images.forEach((im) => (im.onload = null));
      gsap.ticker.remove(tick);
      ro.disconnect();
      tween?.kill();
      texes.forEach((t) => gl.deleteTexture(t.tex));
      gl.deleteProgram(prog);
      goTo.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.map((p) => p.image).join('|')]);

  React.useEffect(() => {
    goTo.current(active);
  }, [active]);

  React.useEffect(() => {
    if (!autoplay || still || !visible || inside || count < 2) return;
    const t = window.setTimeout(
      () => setActive((a) => (a + 1) % count),
      interval * 1000,
    );
    return () => window.clearTimeout(t);
  }, [autoplay, still, visible, inside, count, interval, active]);

  const open = (i) => {
    const pr = projects[i];
    if (!pr) return;
    onOpen?.(pr, i);
  };

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowDown' ? 1 : count - 1)) % count;
    setActive(next);
    root.current?.querySelector(`[data-row="${next}"]`)?.focus();
  };

  const enter = (delay) => ({
    initial: still ? false : { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: shown ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 0.5, ease: GLIDE, delay: still ? 0 : delay },
  });

  const RowTag = (pr) => (pr.href ? motion.a : motion.button);

  return (
    <motion.div
      ref={root}
      initial={still ? false : { opacity: 0, y: 18 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: GLIDE }}
      onPointerEnter={() => setInside(true)}
      onPointerLeave={() => {
        setInside(false);
        setHoverRow(null);
      }}
      className={cn(
        '@container relative mx-auto   text-foreground transition-colors duration-200 hover:border-border-hover',
        className,
      )}
    >
      <p className="font-mono text-xs tracking-widest uppercase text-subtle">
        Projects
      </p>
      <div
        className={cn(
          'grid grid-cols-1 gap-2 @min-[640px]:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] mt-4 sidebar-0',
          imageSide === 'left' &&
            '@min-[640px]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
        )}
      >
        {/* Project index list */}
        <div
          className={cn(
            'order-2 flex flex-col   pb-2 pt-4 @min-[640px]:pb-2',
            imageSide === 'left'
              ? '@min-[640px]:order-2'
              : '@min-[640px]:order-1',
          )}
        >
          <motion.div
            {...enter(0.05)}
            className="flex items-center justify-between px-3 pb-2 text-xs font-medium text-subtle"
          >
            <span>{eyebrow}</span>
            {/* <span className="tabular-nums">{count} projects</span> */}
          </motion.div>

          {/* <motion.ul
            layoutScroll
            role="list"
            onKeyDown={onKeyDown}
            onPointerLeave={() => setHoverRow(null)}
            className="flex max-h-96 flex-1 flex-col overflow-y-auto overscroll-contain"
          > */}
          <motion.ul
            layoutScroll
            role="list"
            onKeyDown={onKeyDown}
            onPointerLeave={() => setHoverRow(null)}
            className="flex max-h-96 flex-1 flex-col overflow-y-auto overscroll-contain scrollbar-none"
          >
            {projects.map((pr, i) => {
              const on = i === active;
              const Tag = RowTag(pr);
              return (
                <motion.li
                  key={`${pr.title}-${i}`}
                  {...enter(0.1 + Math.min(i, 8) * 0.05)}
                >
                  <Tag
                    {...(pr.href
                      ? {
                          href: pr.href,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        }
                      : { type: 'button' })}
                    data-row={i}
                    aria-current={on ? 'true' : undefined}
                    onPointerEnter={() => {
                      setHoverRow(i);
                      if (select === 'hover') setActive(i);
                    }}
                    onFocus={() => setActive(i)}
                    onClick={(e) => {
                      if (select === 'click' && !on) {
                        e.preventDefault();
                        setActive(i);
                        return;
                      }
                      open(i);
                    }}
                    whileTap={still ? undefined : { scale: 0.985 }}
                    className="focus-ring group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left"
                  >
                    {(hoverRow ?? active) === i && (
                      <motion.span
                        layoutId={`${id}-row`}
                        transition={still ? { duration: 0 } : POP}
                        className="absolute inset-0 rounded-2xl bg-surface-hover"
                      />
                    )}

                    {/* {numbers && (
                      <span
                        className={cn(
                          'relative w-5 shrink-0 self-start pt-0.5 text-xs font-medium tabular-nums transition-colors duration-300',
                          on ? 'text-foreground' : 'text-subtle',
                        )}
                      >
                        {pad(i + 1)}
                      </span>
                    )} */}

                    <motion.span
                      className="relative min-w-0 flex-1"
                      animate={{ x: on && !still ? 2 : 0 }}
                      transition={POP}
                    >
                      <span
                        className={cn(
                          'block truncate text-base font-medium leading-6 transition-colors duration-300',
                          on
                            ? 'text-foreground'
                            : 'text-muted group-hover:text-foreground',
                        )}
                      >
                        {pr.title}
                      </span>

                      {meta && pr.meta && (
                        <span
                          className={cn(
                            'block truncate text-xs leading-4 transition-colors duration-300',
                            on ? 'text-muted' : 'text-subtle',
                          )}
                        >
                          {pr.meta}
                        </span>
                      )}

                      {autoplay && on && !still && !inside && (
                        <motion.span
                          key={`bar-${active}`}
                          aria-hidden
                          className="absolute -bottom-1.5 left-0 h-px origin-left bg-foreground/25"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: interval, ease: 'linear' }}
                          style={{ width: '100%' }}
                        />
                      )}
                    </motion.span>

                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          key="arrow"
                          aria-hidden
                          initial={
                            still
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.4, rotate: -45 }
                          }
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={
                            still
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.4, rotate: 45 }
                          }
                          transition={POP}
                          className="relative grid size-6 shrink-0 place-items-center text-foreground"
                        >
                          <ArrowUpRightIcon className="size-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Tag>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        {/* Image preview panel */}
        <motion.div
          {...enter(0.15)}
          ref={panel}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const k = still ? 0 : parallax;
            lean.current.tx = (((e.clientX - r.left) / r.width) * 2 - 1) * k;
            lean.current.ty = -(((e.clientY - r.top) / r.height) * 2 - 1) * k;
          }}
          onPointerLeave={() => {
            lean.current.tx = 0;
            lean.current.ty = 0;
          }}
          className={cn(
            'relative isolate order-1 aspect-4/3 overflow-hidden rounded-[22px] border border-border/60 bg-surface-muted @min-[640px]:aspect-auto @min-[640px]:min-h-85',
            imageSide === 'left'
              ? '@min-[640px]:order-1'
              : '@min-[640px]:order-2',
          )}
        >
          <canvas
            ref={canvas}
            role="img"
            aria-label={current ? (current.alt ?? current.title) : undefined}
            className="absolute inset-0 -z-10 size-full"
          />
          {!webgl && current && (
            <AnimatePresence initial={false}>
              <motion.img
                key={current.image}
                src={current.image}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 -z-10 size-full object-cover"
              />
            </AnimatePresence>
          )}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent"
          />

          {current && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <div className="min-w-0 text-white">
                {/* <p className="text-xs font-medium text-white/75">
                  Project{' '}
                  <span className="relative inline-grid overflow-hidden align-bottom tabular-nums">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={active}
                        initial={
                          still ? { opacity: 0 } : { y: '100%', opacity: 0 }
                        }
                        animate={{ y: 0, opacity: 1 }}
                        exit={
                          still ? { opacity: 0 } : { y: '-100%', opacity: 0 }
                        }
                        transition={{ duration: 0.35, ease: GLIDE }}
                      >
                        {pad(active + 1)}
                      </motion.span>
                    </AnimatePresence>
                  </span>{' '}
                  / {pad(count)}
                </p> */}

                <div className="relative mt-1 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={current.title}
                      initial={
                        still
                          ? { opacity: 0 }
                          : { y: '60%', opacity: 0, filter: 'blur(6px)' }
                      }
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={
                        still
                          ? { opacity: 0 }
                          : { y: '-60%', opacity: 0, filter: 'blur(6px)' }
                      }
                      transition={{ duration: 0.5, ease: GLIDE }}
                      className="truncate text-xl font-medium leading-7 tracking-tight"
                    >
                      {current.title}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                type="button"
                aria-label={`Open ${current.title}`}
                onClick={() => {
                  open(active);
                  if (current.href) {
                    window.open(current.href, '_blank', 'noopener,noreferrer');
                  }
                }}
                whileHover={still ? undefined : { scale: 1.08 }}
                whileTap={still ? undefined : { scale: 0.92 }}
                transition={POP}
                className="group grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white/95 text-zinc-900 shadow-md backdrop-blur-xs transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <ArrowUpRightIcon className="size-4" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});
