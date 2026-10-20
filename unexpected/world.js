// THE UNEXPECTED — ORIGINAL INTERACTIVE THREE.JS STUDIO
// Uses actual GPU 3D meshes, lights, perspective cameras and particle fields.
// Falls back automatically to the site's existing animated 2D sculpture if WebGL or the module CDN is unavailable.
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const mq=matchMedia('(prefers-reduced-motion:reduce)');
const reduce=mq.matches,mobile=matchMedia('(max-width:720px)').matches;
const colors=[0xd58a55,0x9a1b68,0x642b7d,0x3c6f88,0x89a80f];
const scenes=[];
function init(id,stage){
 const cv=document.getElementById(id),host=document.querySelector(stage);
 if(!cv||!host||!T.WebGLRenderer)return null;
 let renderer;
 try{renderer=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:!mobile,powerPreference:mobile?'low-power':'high-performance'});}catch(e){return null}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.15:1.6));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,1,.1,100);camera.position.set(0,0,8.3);
 scene.add(new T.AmbientLight(0xffffff,1.8));
 const a=new T.PointLight(0xffb77d,140);a.position.set(-4,3,5);scene.add(a);
 const b=new T.PointLight(0xa568ff,120);b.position.set(3,-2,3);scene.add(b);
 const c=new T.PointLight(0x60bdff,80);c.position.set(1,4,-3);scene.add(c);
 const root=new T.Group();scene.add(root);
 const state={cv,host,renderer,scene,camera,root,mouse:{x:0,y:0},smooth:{x:0,y:0},on:true,id};
 const resize=()=>{const r=host.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
 new ResizeObserver(resize).observe(host);resize();
 host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();state.mouse.x=((e.clientX-r.left)/r.width-.5)*2;state.mouse.y=((e.clientY-r.top)/r.height-.5)*2});
 host.addEventListener('pointerleave',()=>{state.mouse.x=0;state.mouse.y=0});
 new IntersectionObserver(entries=>{state.on=entries[0].isIntersecting},{rootMargin:'100px'}).observe(host);
 cv.classList.add('ready');host.classList.add('webgl-ready');scenes.push(state);return state;
}
function mat(color,emissive=.13,wire=false){return new T.MeshPhysicalMaterial({color,metalness:.62,roughness:.23,clearcoat:1,clearcoatRoughness:.09,emissive:color,emissiveIntensity:emissive,wireframe:wire,side:T.DoubleSide})}
function mesh(geom,color,root,x=0,y=0,z=0,scale=1){const m=new T.Mesh(geom,mat(color));m.position.set(x,y,z);m.scale.setScalar(scale);root.add(m);return m}
function torus(root,color,x=0,y=0,z=0,r=1.5,t=.03,rot=0){const m=mesh(new T.TorusGeometry(r,t,12,110),color,root,x,y,z);m.rotation.x=rot;return m}
function glitter(root,n=110,r=3.6){const g=new T.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){const radius=r*(.38+Math.random()*.65),t=Math.random()*Math.PI*2,p=Math.acos(Math.random()*2-1);a[i*3]=radius*Math.sin(p)*Math.cos(t);a[i*3+1]=radius*Math.sin(p)*Math.sin(t);a[i*3+2]=radius*Math.cos(p)}g.setAttribute('position',new T.BufferAttribute(a,3));const points=new T.Points(g,new T.PointsMaterial({color:0xffe5b9,size:mobile?.024:.035,transparent:true,opacity:.65}));root.add(points)}
function shapeFor(i,root){
 // Fresh geometry per project: each portfolio chapter has a distinct interactive object.
 const group=new T.Group();root.add(group);glitter(group,70,3.9);
 if(i===0){ // LeadLanka / illuminated map-and-network globe
  mesh(new T.IcosahedronGeometry(1.35,4),0x144d60,group);
  mesh(new T.IcosahedronGeometry(1.39,2),0x8fb6af,group,0,0,0,1).material=mat(0xbbe7d4,.27,true);
  for(let j=0;j<16;j++){let a=j*2.399,z=1-2*(j+.5)/16,r=Math.sqrt(1-z*z),q=mesh(new T.SphereGeometry(.085,12,10),j%3===0?0xe8a35e:0xb1e17b,group,r*Math.cos(a)*1.5,z*1.5,r*Math.sin(a)*1.5)}
  torus(group,0xd58a55,0,0,0,1.82,.025,.42);
 }else if(i===1){ // SUNROOM / kinetic time-and-ideas solar system
  mesh(new T.SphereGeometry(1.2,56,34),0xdf8f56,group);
  torus(group,0xffd3aa,0,0,0,1.6,.11,.72);torus(group,0x9a1b68,0,0,0,2.03,.045,-.5);
  for(let k=0;k<12;k++){const a=k*Math.PI/6,block=mesh(new T.BoxGeometry(.16,.36,.17),k%2?0x56255d:0xf1bf87,group,Math.cos(a)*2.42,Math.sin(a)*2.42,0);block.rotation.z=a}
 }else if(i===2){ // Maya / friendly learning blocks
  for(let k=0;k<7;k++){const a=k*2.4;const cube=mesh(new T.BoxGeometry(.9,.9,.9),colors[k%5],group,Math.sin(a)*1.25,Math.cos(a*.68)*1.02,(k-3)*.18);cube.rotation.set(a*.18,a*.29,a*.1)}
  torus(group,0xf9db9e,0,0,0,2.12,.04,.4);
 }else if(i===3){ // MELT / metallic molten activewear sculpture
  const knot=mesh(new T.TorusKnotGeometry(1.1,.37,260,28,3,5),0xf0732d,group);knot.material.roughness=.18;
  torus(group,0x150b17,0,0,0,2.05,.15,.7);torus(group,0xffb966,0,0,0,1.92,.023,-.6);
 }else if(i===4){ // STYLE BATTLE / two opposing try-on portals
  const l=torus(group,0xd58a55,-.85,0,0,1.17,.13,.17);l.scale.x=.6;
  const r=torus(group,0x983eaf,.85,0,0,1.17,.13,-.17);r.scale.x=.6;
  mesh(new T.OctahedronGeometry(.82,1),0xe3c3f1,group);
 }else if(i===5){ // STYLE BATTLE v2 / comparison ring
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;const arc=torus(group,colors[j],Math.cos(a)*.85,Math.sin(a)*.85,(j-2)*.17,.98,.08,a*.48);arc.rotation.y=a*.3}
  mesh(new T.IcosahedronGeometry(.74,2),0xe5ffff,group);
 }else{ // PIXEL CRAFT / living voxel mosaic
  const ico=new T.BoxGeometry(.3,.3,.24);
  for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++){const wave=Math.sin(x*.72+y*.5)*.42;let m=mesh(ico,colors[(x+2*y+25)%5],group,x*.38,y*.38,wave);m.userData.wave=(x+y)*.25}
  torus(group,0xc9dcfe,0,0,-.6,2.7,.026,.24);
 }
 return group;
}
function initStory(){const st=init('worldSculpture','.object-stage');if(!st)return;
 const group=st.root;group.scale.setScalar(.82);
 const knot=mesh(new T.TorusKnotGeometry(1.23,.37,320,26,3,5),0x8b3579,group);knot.material.metalness=.83;knot.material.roughness=.11;
 for(let k=0;k<7;k++){const ring=torus(group,colors[k%5],0,0,0,1.85+k*.052,.017,(k/7)*Math.PI);ring.rotation.y=(k/7)*2.8}
 glitter(group,160,3.4);
 st.move=(t)=>{const s=Math.min(1,Math.max(0,(-document.getElementById('story').getBoundingClientRect().top)/Math.max(1,document.getElementById('story').offsetHeight-innerHeight)));group.rotation.y+=(s*3.5-group.rotation.y)*.06;group.rotation.z+=(s*1.1-group.rotation.z)*.05;knot.rotation.x=t*.1;group.scale.setScalar(.79+.13*Math.sin(s*Math.PI))};
}
function initProject(){const st=init('projectWorld','#workArt');if(!st)return;
 const display=new T.Group();st.root.add(display);st.group=display;st.active=-1;
 st.move=(t)=>{const i=Math.max(0,Math.min(6,window.__sueActiveProject||0));if(i!==st.active){st.active=i;st.group.clear();shapeFor(i,st.group)}st.group.rotation.y+=.004;st.group.rotation.x+=(st.smooth.y*.23-st.group.rotation.x)*.05;st.group.rotation.z+=(st.smooth.x*.12-st.group.rotation.z)*.05};
}
try{initStory();initProject()}catch(e){console.warn('SUE WebGL fallback active',e)}
let previous=0;
function loop(ts){requestAnimationFrame(loop);if(document.hidden)return;const t=ts*.001,dt=Math.min((ts-previous)/1000,.05);previous=ts;
 for(const st of scenes){if(!st.on)continue;
  st.smooth.x+=(st.mouse.x-st.smooth.x)*.065;st.smooth.y+=(st.mouse.y-st.smooth.y)*.065;
  if(st.move)st.move(reduce?0:t);
  st.root.rotation.x+=((reduce?0:st.smooth.y)*.13-st.root.rotation.x)*.07;
  st.root.rotation.y+=((reduce?0:st.smooth.x)*.18-st.root.rotation.y)*.07;
  if(!reduce||!st.rendered){st.renderer.render(st.scene,st.camera);st.rendered=true}
 }
}
requestAnimationFrame(loop);