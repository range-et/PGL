"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});class qi{constructor(e,n,i){this.start=e,this.end=n,this.data={...i}}}class Ln{constructor(e,n){this.nodes=e,this.edges=n}printData(){const e="This is a graph with "+this.nodes.size+" nodes and "+this.edges.size+" edges";console.log(e)}async initialize(){await this.constructAdjacencyList()}static async create(e,n){const i=new Ln(e,n);return await i.initialize(),i}async constructAdjacencyList(){this.edges.forEach(e=>{const n=e.start,i=e.end;this.nodes.get(n)&&this.nodes.get(n).neighbours.push(i),this.nodes.get(i)&&this.nodes.get(i).neighbours.push(n)});for(const e of this.nodes.keys()){const n=this.nodes.get(e).neighbours,i=[...new Set(n)],r=i.indexOf(e);r>-1&&i.splice(r,1),this.nodes.get(e).neighbours=i}}add_node(e,n){this.nodes.set(e,n)}add_edge(e,n,i){const r=new qi(e,n,i);this.edges.set(this.edges.size,r);const s=this.nodes.get(e),a=this.nodes.get(n);s&&s.neighbours.push(n),a&&a.neighbours.push(e)}get_adjacency(){const e=new Map;for(const n of this.nodes.keys())e.set(n,this.nodes.get(n).neighbours);return e}apply_position_map(e){for(let n of e.keys())this.nodes.get(n).data={...this.nodes.get(n).data,pos:e.get(n)}}apply_edge_pos_maps(e){for(let n of e.keys())this.edges.get(n).data={...this.edges.get(n).data,ldata:e.get(n)}}get_edge_map(){const e=new Map;for(const n of this.edges.keys()){const i=this.edges.get(n).data.ldata;i!=null&&e.set(n,i)}return e}apply_drawing_maps(e){e.pmap&&this.apply_position_map(e.pmap),e.emap&&this.apply_edge_pos_maps(e.emap)}get_map(){return{pmap:this.get_position_map(),emap:this.get_edge_map()}}get_position_map(){const e=new Map;for(const n of this.nodes.keys())e.set(n,this.nodes.get(n).data.pos);return e}get_node_ids_order(){return Array.from(this.nodes.keys())}get_adjacency_matrix(){const e=this.get_node_ids_order(),n=e.length,i=new Float32Array(n*n),r=this.get_adjacency(),s=new Map;e.forEach((a,o)=>s.set(a,o));for(let a=0;a<n;a++){const o=e[a],c=r.get(o)??[];for(const l of c){const h=s.get(l);h!==void 0&&(i[a*n+h]=1)}}return{matrix:i,nodeIds:e}}}async function cc(t,e){const n=t.get_adjacency(),i=new Map,r=new Set([e]),s=[e];for(i.set(e,-1);s.length>0;){const a=s.shift(),o=n.get(a);for(let c=0;c<o.length;c++){const l=o[c];r.has(l)||(r.add(l),s.push(l),i.set(l,a))}}return i}async function ws(t,e){const n=t.get_adjacency(),i=new Map,r=await cc(t,e);for(const s of n.keys()){if(!r.has(s))continue;let a=0,o=r.get(s);for(;o!==void 0&&o!==-1;)o=r.get(o),a+=1;i.set(s,a)}return i}async function Mh(t){const e=[...t.nodes.keys()];if(e.length===0)return{start:0,end:0,distance:0};if(e.length===1)return{start:e[0],end:e[0],distance:0};const n=t.get_adjacency(),i=e.filter(l=>{var h;return(((h=n.get(l))==null?void 0:h.length)??0)>0}),r=i.length>0?i:e;let s=r[Math.floor(Math.random()*r.length)],a=await ws(t,s),o=-1;for(const l of a.keys()){const h=a.get(l);h>o&&(s=l,o=h)}const c=s;a=await ws(t,s),o=-1;for(const l of a.keys()){const h=a.get(l);h>o&&(s=l,o=h)}return{start:c,end:s,distance:o}}async function yh(t,e){const n=new Map,i=new Map;e.forEach(a=>{const o=t.nodes.get(a);n.set(a,o)});let r=0;for(const a of t.edges.keys()){const o=t.edges.get(a);e.includes(o.start)&&e.includes(o.end)&&(i.set(r,o),r+=1)}return await Ln.create(n,i)}const zr={GraphDiameter:Mh,Dijkstra:ws,BFSSearch:cc,SelectSubgraph:yh},Sh={nodes:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],edges:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,10],[0,11],[0,12],[0,13],[0,17],[0,19],[0,21],[0,31],[1,2],[1,3],[1,7],[1,13],[1,17],[1,19],[1,21],[1,30],[2,3],[2,7],[2,8],[2,9],[2,13],[2,27],[2,28],[2,32],[3,7],[3,12],[3,13],[4,6],[4,10],[5,6],[5,10],[5,16],[6,16],[8,30],[8,32],[8,33],[9,33],[13,33],[14,32],[14,33],[15,32],[15,33],[18,32],[18,33],[19,33],[20,32],[20,33],[22,32],[22,33],[23,25],[23,27],[23,29],[23,32],[23,33],[24,25],[24,27],[24,31],[25,31],[26,29],[26,33],[27,33],[28,31],[28,33],[29,32],[29,33],[30,32],[30,33],[31,32],[31,33],[32,33]]},Eh={nodes:[{id:0,px:.09083423378081436,py:1.164162667707135,member:0},{id:1,px:-.5395391223661004,py:.8787097882002372,member:0},{id:2,px:.25483951690897244,py:-.011894166387290125,member:0},{id:3,px:.5292273814873625,py:.8137715604013231,member:0},{id:4,px:.6759740200024705,py:2.010590015934319,member:3},{id:5,px:.6648725961138767,py:2.3765595730406712,member:3},{id:6,px:-.015476857282255526,py:2.421851366492045,member:3},{id:7,px:.9923183157183725,py:.7358251458599251,member:0},{id:8,px:-.6148021363450372,py:-.03465499210385469,member:1},{id:9,px:.24714516178546894,py:-1.012380550604274,member:0},{id:10,px:1.3293288757439443,py:1.8641805845025743,member:3},{id:11,px:-.6571791278403557,py:2.2163816367270526,member:0},{id:12,px:1.5181044222926994,py:1.3282665066698078,member:0},{id:13,px:-.2979203330003603,py:.18438685313887027,member:0},{id:14,px:-1.7502345807734376,py:-1.0935551887354324,member:1},{id:15,px:-1.630224787934251,py:-1.5015879850995024,member:1},{id:16,px:.5585243394360673,py:3.5,member:3},{id:17,px:-.9776584881745712,py:1.799718659872538,member:0},{id:18,px:-1.385649185975611,py:-1.870388302312794,member:1},{id:19,px:-.9638464461397331,py:.24226946279518707,member:0},{id:20,px:-1.0268125129631975,py:-2.1543990524894148,member:1},{id:21,px:-1.3061680833745626,py:1.527228276383933,member:0},{id:22,px:-.5552461198316926,py:-2.2498070887997685,member:1},{id:23,px:.8262268914348979,py:-1.804253160744954,member:2},{id:24,px:1.9952840970427212,py:-1.0382885070400036,member:2},{id:25,px:1.9207660053211613,py:-.5823795272244723,member:2},{id:26,px:-.1664715343791652,py:-2.6527209168204373,member:1},{id:27,px:.9961959436268844,py:-1.0143754028553023,member:2},{id:28,px:.6488880579857091,py:-1.024671500275854,member:2},{id:29,px:.2398196340697841,py:-2.171491081802323,member:1},{id:30,px:-1.3348117368940753,py:-.31290471156377053,member:1},{id:31,px:.6901260074375327,py:-.2526601933356052,member:2},{id:32,px:-.6030949145287146,py:-1.0927507849665647,member:1},{id:33,px:-.3533395323856202,py:-1.1887389845640028,member:1}],edges:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,10],[0,11],[0,12],[0,13],[0,17],[0,19],[0,21],[0,31],[1,2],[1,3],[1,7],[1,13],[1,17],[1,19],[1,21],[1,30],[2,3],[2,7],[2,8],[2,9],[2,13],[2,27],[2,28],[2,32],[3,7],[3,12],[3,13],[4,6],[4,10],[5,6],[5,10],[5,16],[6,16],[8,30],[8,32],[8,33],[9,33],[13,33],[14,32],[14,33],[15,32],[15,33],[18,32],[18,33],[19,33],[20,32],[20,33],[22,32],[22,33],[23,25],[23,27],[23,29],[23,32],[23,33],[24,25],[24,27],[24,31],[25,31],[26,29],[26,33],[27,33],[28,31],[28,33],[29,32],[29,33],[30,32],[30,33],[31,32],[31,33],[32,33]]};class Br{constructor(e){this.data={...e},this.neighbours=[]}}async function Th(t,e){const n=new Map;for(let s=0;s<t.length;s++){const a=new Br(t[s].data);n.set(t[s],a)}const i=new Map;for(let s=0;s<e.length;s++){const a=new qi(e[s][0],e[s][1],e[s].data);i.set(s,a)}return await Ln.create(n,i)}const lc={ConstructGraphNodeEdgesList:Th};class Rt{constructor(e,n,i){this.x=e,this.y=n,this.z=i}translate(e){this.x=this.x+e.x,this.y=this.y+e.y,this.z=this.z+e.z}}function bh(t){let e=0;for(let i=0;i<t.length;i++)e=e+t[i];const n=e/t.length;return Number.isNaN(n)?0:n}function Ah(t,e){return Math.pow(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)+Math.pow(t.z-e.z,2),.5)}function wh(t,e){return Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)+Math.pow(t.z-e.z,2)}function Rh(t,e){var n=new Array(e),i=t.length,r=new Array(i);if(e>i)throw new RangeError("getRandom: more elements taken than available");for(;e--;){var s=Math.floor(Math.random()*i);n[e]=t[s in r?r[s]:s],r[s]=--i in r?r[i]:i}return n}function Ch(t,e){const n=new Map;let i;for(const r of t.keys())i=Math.random(),i<e&&n.set(r,t.get(r));return n}const St={calculateAverage:bh,calculateDistance:Ah,calculateSquaredDistance:wh,getRandomSubset:Rh,getRandomSubset_map:Ch};let va=class{constructor(e){this.points=[],e.forEach(n=>{const i=new Rt(n.x,n.y,n.z);this.points.push(i)})}};function hc(t,e,n){const i=new Rt(t.x,t.y,t.z),r=new Rt(e.x,e.y,e.z),s=[];for(let o=0;o<=n;o++){const c=o/n,l=c*i.x+(1-c)*r.x,h=c*i.y+(1-c)*r.y,f=c*i.z+(1-c)*r.z,u=new Rt(l,h,f);s.push(u)}return new va(s)}function Ph(t,e,n){const i=St.calculateDistance(t,e),r=Math.round(i/n)+2;return hc(t,e,r)}function Dh(t){let e=0,n=0,i=0;return t.forEach(s=>{e+=s.x,n+=s.y,i+=s.z}),e=e/t.length,n=n/t.length,i=i/t.length,new Rt(e,n,i)}const Ai={line_from_start_end_divisions:hc,line_from_start_end_distance:Ph,centroid:Dh};async function Lh(t,e,n=100,i=1,r=1){const s=t.get_adjacency(),a=new Map,o=new Map;let c,l;for(const S of s.keys())c=Math.random()*n,l=Math.random()*n,a.set(S,c),o.set(S,l);for(let S=0;S<e;S++){let v,P,b,w,R,y,x,C,z,I,N,X,G,K;for(const k of s.keys()){const te=s.get(k);v=a.get(k),P=o.get(k),b=[],w=[],te.forEach(he=>{const ie=a.get(he),Se=o.get(he);b.push(ie),w.push(Se)}),N=St.calculateAverage(b),X=St.calculateAverage(w),R=[],y=[];let le,ve,Le,Xe;for(const he of t.nodes.keys())he!=k&&(Le=a.get(he),Xe=o.get(he),le=Le-v,ve=Xe-P,y.push(le),R.push(ve));z=r*1/(St.calculateAverage(y)*St.calculateAverage(y)),I=r*1/(St.calculateAverage(R)*St.calculateAverage(R)),x=i*(N-v),C=i*(X-P),G=i*(0-v),K=i*(0-P);const q=z+G+x+v,Q=I+K+C+P;a.set(k,q),o.set(k,Q)}}let h=new Map;for(const S of a.keys())h.set(S,new Rt(a.get(S),0,o.get(S)));const f=[],u=[],d=[];let _;for(const S of h.keys())_=h.get(S),f.push(_.x),u.push(_.y),d.push(_.z);const g=St.calculateAverage(f),m=St.calculateAverage(u),p=St.calculateAverage(d),T=new Rt(-g,-m,-p);return h=uc(h,T),h}function Ih(t){const e=t.get_adjacency(),n=new Map,i=new Map;for(const s of e.keys())n.set(s,Math.random()*200),i.set(s,Math.random()*200);const r=new Map;for(const s of n.keys())r.set(s,new Rt(n.get(s),0,i.get(s)));return r}function fc(t,e){const n=new Map;let i,r,s;for(const a of t.edges.keys()){i=t.edges.get(a),r=t.nodes.get(i.start).data.pos,s=t.nodes.get(i.end).data.pos;const o=Ai.line_from_start_end_distance(r,s,e);n.set(a,o)}return n}function Uh(t,e){const n=new Map;let i,r,s;for(const a of t.edges.keys()){i=t.edges.get(a),r=t.nodes.get(i.start).data.pos,s=t.nodes.get(i.end).data.pos;const o=Ai.line_from_start_end_divisions(r,s,e);n.set(a,o)}return n}async function dc(t,e,n){const i=new Map;for(let T of t.keys())i.set(T,structuredClone(t.get(T)));let r,s,a,o,c,l,h,f,u,d,_,g,m,p;for(let T=0;T<e;T++)for(let S of i.keys()){r=i.get(S);for(let v=1;v<r.points.length-1;v++){a=[],o=[],c=[],l=r.points[v];for(let b of i.keys())if(b!=S){s=i.get(b);for(let w=1;w<s.points.length-1;w++)h=s.points[w],f=St.calculateSquaredDistance(l,h),f<=Math.pow(n,2)&&(u=h.x-l.x,d=h.y-l.y,_=h.z-l.z,a.push(u),o.push(d),c.push(_))}g=l.x+.8*(St.calculateAverage(a)||0),m=l.y+.8*(St.calculateAverage(o)||0),p=l.z+.8*(St.calculateAverage(c)||0);const P=new Rt(g,m,p);r.points[v]=P}}return i}function Nh(t,e){const n=new Map;for(let i of t.keys())n.set(i,structuredClone(t.get(i)));for(const i of n.keys()){const r=n.get(i);let s,a;for(let o=0;o<r.points.length;o++)s=r.points[o],a=e*Math.sin(Math.PI*o/(r.points.length-1)),s.y=s.y+a}return n}function Fh(t,e,n){let i=0,r,s;const a=o=>{const c=o[e];return typeof c=="number"?c:Number(c)||0};for(let o of t.nodes.values())r=a(o.data),r>=i&&(i=r);for(const o of t.nodes.values())r=a(o.data),s=i>0?r/i*n:0,s=Math.max(0,s),s=Math.min(n,s),o.data.pos.y=s}async function Oh(t,e,n,i){const r=t.get_adjacency(),s=await zr.Dijkstra(t,e),a=Math.max(...s.values()),o=new Map;for(let _=0;_<=a;_++){const g=[];for(const m of s.keys())_==s.get(m)&&g.push(m);o.set(_,g)}const c=new Map,l=i.x||0,h=i.y||0,f=i.z||0;for(const _ of r.keys()){const g=s.get(_)*n,m=o.get(s.get(_)),p=2*Math.PI*(m.indexOf(_)/m.length),T=Math.sin(p)*g,S=Math.cos(p)*g,v=new Rt(T+l,-g+h,S+f);c.set(_,v)}t.apply_position_map(c);const u=fc(t,1),d=await dc(u,12,5);return{pmap:c,emap:d}}function zh(t,e){const n=t.get_map(),i=uc(n.pmap,e),r=Bh(n.emap,e);t.apply_drawing_maps({pmap:i,emap:r})}function uc(t,e){const n=new Map;for(let i of t.keys()){const r=t.get(i);r.translate(e),n.set(i,r)}return n}function Bh(t,e){const n=new Map;let i,r,s;for(let a of t.keys()){i=[],r=t.get(a);for(let o of r.points)o.translate(e),i.push(o);s=new va(i),n.set(a,s)}return n}function Hh(t,e){let n,i,r,s;for(const a of t.edges.keys())n=t.edges.get(a),i=t.nodes.get(n.start).data.pos,r=t.nodes.get(n.end).data.pos,s=Ai.line_from_start_end_distance(i,r,e),n.data.ldata=s}function Vh(t,e){let n,i,r,s;for(const a of t.edges.keys())n=t.edges.get(a),i=t.nodes.get(n.start).data.pos,r=t.nodes.get(n.end).data.pos,s=Ai.line_from_start_end_divisions(i,r,e),n.data.ldata=s}const pc={SimulateKamadaKawai:Lh,DrawEdgeLines:fc,DrawEdgeLinesDivisions:Uh,DrawEdgeBundling:dc,HivePlot:Oh,DisplaceEdgeInY:Nh,MoveGraph:zh,InstanciateRandomPositions:Ih,DisplaceVertices:Fh,UpdateEdgeLinesDist:Hh,UpdateEdgeLinesDivs:Vh};async function kh(){const t=Sh;return await lc.ConstructGraphNodeEdgesList(t.nodes,t.edges)}async function Gh(){const t=Eh,e=new Map,n=new Map;t.nodes.forEach(s=>{const a=s.id,o=new Rt(s.px*50,0,s.py*50),c=s.member,l=new Br({pos:o,size:10,info:"Node Info",modularity:c});e.set(a,l)});for(let s=0;s<t.edges.length;s++){const a=t.edges[s],o=a[0],c=a[1],l=new qi(o,c,{});n.set(s,l)}const i=await Ln.create(e,n),r=pc.DrawEdgeLines(i,20);return i.apply_edge_pos_maps(r),i}const Wh={LoadZKC:kh,LoadZKCSimulated:Gh};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xa="170",_i={ROTATE:0,DOLLY:1,PAN:2},ui={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Xh=0,Za=1,qh=2,mc=1,$h=2,hn=3,Pn=0,Ct=1,Kt=2,Rn=0,gi=1,Ka=2,Ja=3,Qa=4,Yh=5,Vn=100,jh=101,Zh=102,Kh=103,Jh=104,Qh=200,ef=201,tf=202,nf=203,Rs=204,Cs=205,rf=206,sf=207,af=208,of=209,cf=210,lf=211,hf=212,ff=213,df=214,Ps=0,Ds=1,Ls=2,Mi=3,Is=4,Us=5,Ns=6,Fs=7,_c=0,uf=1,pf=2,Cn=0,mf=1,_f=2,gf=3,vf=4,xf=5,Mf=6,yf=7,gc=300,yi=301,Si=302,Os=303,zs=304,Hr=306,Bs=1e3,Gn=1001,Hs=1002,It=1003,Sf=1004,Ki=1005,Jt=1006,jr=1007,Wn=1008,un=1009,vc=1010,xc=1011,Wi=1012,Ma=1013,Xn=1014,Qt=1015,$i=1016,ya=1017,Sa=1018,Ei=1020,Mc=35902,yc=1021,Sc=1022,qt=1023,Ec=1024,Tc=1025,vi=1026,Ti=1027,Ea=1028,Ta=1029,bc=1030,ba=1031,Aa=1033,Tr=33776,br=33777,Ar=33778,wr=33779,Vs=35840,ks=35841,Gs=35842,Ws=35843,Xs=36196,qs=37492,$s=37496,Ys=37808,js=37809,Zs=37810,Ks=37811,Js=37812,Qs=37813,ea=37814,ta=37815,na=37816,ia=37817,ra=37818,sa=37819,aa=37820,oa=37821,Rr=36492,ca=36494,la=36495,Ac=36283,ha=36284,fa=36285,da=36286,Ef=3200,Tf=3201,bf=0,Af=1,wn="",Ot="srgb",wi="srgb-linear",Vr="linear",je="srgb",Jn=7680,eo=519,wf=512,Rf=513,Cf=514,wc=515,Pf=516,Df=517,Lf=518,If=519,to=35044,no="300 es",fn=2e3,Ir=2001;class $n{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const _t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Cr=Math.PI/180,ua=180/Math.PI;function Yi(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_t[t&255]+_t[t>>8&255]+_t[t>>16&255]+_t[t>>24&255]+"-"+_t[e&255]+_t[e>>8&255]+"-"+_t[e>>16&15|64]+_t[e>>24&255]+"-"+_t[n&63|128]+_t[n>>8&255]+"-"+_t[n>>16&255]+_t[n>>24&255]+_t[i&255]+_t[i>>8&255]+_t[i>>16&255]+_t[i>>24&255]).toLowerCase()}function Et(t,e,n){return Math.max(e,Math.min(n,t))}function Uf(t,e){return(t%e+e)%e}function Zr(t,e,n){return(1-n)*t+n*e}function Ii(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function bt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const Nf={DEG2RAD:Cr};class we{constructor(e=0,n=0){we.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class De{constructor(e,n,i,r,s,a,o,c,l){De.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,c,l)}set(e,n,i,r,s,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=n,h[4]=s,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],f=i[7],u=i[2],d=i[5],_=i[8],g=r[0],m=r[3],p=r[6],T=r[1],S=r[4],v=r[7],P=r[2],b=r[5],w=r[8];return s[0]=a*g+o*T+c*P,s[3]=a*m+o*S+c*b,s[6]=a*p+o*v+c*w,s[1]=l*g+h*T+f*P,s[4]=l*m+h*S+f*b,s[7]=l*p+h*v+f*w,s[2]=u*g+d*T+_*P,s[5]=u*m+d*S+_*b,s[8]=u*p+d*v+_*w,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return n*a*h-n*o*l-i*s*h+i*o*c+r*s*l-r*a*c}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=h*a-o*l,u=o*c-h*s,d=l*s-a*c,_=n*f+i*u+r*d;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return e[0]=f*g,e[1]=(r*l-h*i)*g,e[2]=(o*i-r*a)*g,e[3]=u*g,e[4]=(h*n-r*c)*g,e[5]=(r*s-o*n)*g,e[6]=d*g,e[7]=(i*c-l*n)*g,e[8]=(a*n-i*s)*g,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Kr.makeScale(e,n)),this}rotate(e){return this.premultiply(Kr.makeRotation(-e)),this}translate(e,n){return this.premultiply(Kr.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Kr=new De;function Rc(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Xi(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Ff(){const t=Xi("canvas");return t.style.display="block",t}const io={};function Vi(t){t in io||(io[t]=!0,console.warn(t))}function Of(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function zf(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Bf(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ge={enabled:!0,workingColorSpace:wi,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===je&&(t.r=dn(t.r),t.g=dn(t.g),t.b=dn(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===je&&(t.r=xi(t.r),t.g=xi(t.g),t.b=xi(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===wn?Vr:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function dn(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function xi(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const ro=[.64,.33,.3,.6,.15,.06],so=[.2126,.7152,.0722],ao=[.3127,.329],oo=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),co=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ge.define({[wi]:{primaries:ro,whitePoint:ao,transfer:Vr,toXYZ:oo,fromXYZ:co,luminanceCoefficients:so,workingColorSpaceConfig:{unpackColorSpace:Ot},outputColorSpaceConfig:{drawingBufferColorSpace:Ot}},[Ot]:{primaries:ro,whitePoint:ao,transfer:je,toXYZ:oo,fromXYZ:co,luminanceCoefficients:so,outputColorSpaceConfig:{drawingBufferColorSpace:Ot}}});let Qn;class Hf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qn===void 0&&(Qn=Xi("canvas")),Qn.width=e.width,Qn.height=e.height;const i=Qn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Qn}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Xi("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=dn(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(dn(n[i]/255)*255):n[i]=dn(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vf=0;class Cc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=Yi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Jr(r[a].image)):s.push(Jr(r[a]))}else s=Jr(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Jr(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Hf.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let kf=0;class xt extends $n{constructor(e=xt.DEFAULT_IMAGE,n=xt.DEFAULT_MAPPING,i=Gn,r=Gn,s=Jt,a=Wn,o=qt,c=un,l=xt.DEFAULT_ANISOTROPY,h=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=Yi(),this.name="",this.source=new Cc(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new we(0,0),this.repeat=new we(1,1),this.center=new we(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Bs:e.x=e.x-Math.floor(e.x);break;case Gn:e.x=e.x<0?0:1;break;case Hs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Bs:e.y=e.y-Math.floor(e.y);break;case Gn:e.y=e.y<0?0:1;break;case Hs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}xt.DEFAULT_IMAGE=null;xt.DEFAULT_MAPPING=gc;xt.DEFAULT_ANISOTROPY=1;class st{constructor(e=0,n=0,i=0,r=1){st.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const c=e.elements,l=c[0],h=c[4],f=c[8],u=c[1],d=c[5],_=c[9],g=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+g)<.1&&Math.abs(_+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const S=(l+1)/2,v=(d+1)/2,P=(p+1)/2,b=(h+u)/4,w=(f+g)/4,R=(_+m)/4;return S>v&&S>P?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=b/i,s=w/i):v>P?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=b/r,s=R/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=w/s,r=R/s),this.set(i,r,s,n),this}let T=Math.sqrt((m-_)*(m-_)+(f-g)*(f-g)+(u-h)*(u-h));return Math.abs(T)<.001&&(T=1),this.x=(m-_)/T,this.y=(f-g)/T,this.z=(u-h)/T,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Gf extends $n{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new st(0,0,e,n),this.scissorTest=!1,this.viewport=new st(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new xt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Cc(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qn extends Gf{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Pc extends xt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=It,this.minFilter=It,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wf extends xt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=It,this.minFilter=It,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Dn{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let c=i[r+0],l=i[r+1],h=i[r+2],f=i[r+3];const u=s[a+0],d=s[a+1],_=s[a+2],g=s[a+3];if(o===0){e[n+0]=c,e[n+1]=l,e[n+2]=h,e[n+3]=f;return}if(o===1){e[n+0]=u,e[n+1]=d,e[n+2]=_,e[n+3]=g;return}if(f!==g||c!==u||l!==d||h!==_){let m=1-o;const p=c*u+l*d+h*_+f*g,T=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const P=Math.sqrt(S),b=Math.atan2(P,p*T);m=Math.sin(m*b)/P,o=Math.sin(o*b)/P}const v=o*T;if(c=c*m+u*v,l=l*m+d*v,h=h*m+_*v,f=f*m+g*v,m===1-o){const P=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=P,l*=P,h*=P,f*=P}}e[n]=c,e[n+1]=l,e[n+2]=h,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],c=i[r+1],l=i[r+2],h=i[r+3],f=s[a],u=s[a+1],d=s[a+2],_=s[a+3];return e[n]=o*_+h*f+c*d-l*u,e[n+1]=c*_+h*u+l*f-o*d,e[n+2]=l*_+h*d+o*u-c*f,e[n+3]=h*_-o*f-c*u-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(r/2),f=o(s/2),u=c(i/2),d=c(r/2),_=c(s/2);switch(a){case"XYZ":this._x=u*h*f+l*d*_,this._y=l*d*f-u*h*_,this._z=l*h*_+u*d*f,this._w=l*h*f-u*d*_;break;case"YXZ":this._x=u*h*f+l*d*_,this._y=l*d*f-u*h*_,this._z=l*h*_-u*d*f,this._w=l*h*f+u*d*_;break;case"ZXY":this._x=u*h*f-l*d*_,this._y=l*d*f+u*h*_,this._z=l*h*_+u*d*f,this._w=l*h*f-u*d*_;break;case"ZYX":this._x=u*h*f-l*d*_,this._y=l*d*f+u*h*_,this._z=l*h*_-u*d*f,this._w=l*h*f+u*d*_;break;case"YZX":this._x=u*h*f+l*d*_,this._y=l*d*f+u*h*_,this._z=l*h*_-u*d*f,this._w=l*h*f-u*d*_;break;case"XZY":this._x=u*h*f-l*d*_,this._y=l*d*f-u*h*_,this._z=l*h*_+u*d*f,this._w=l*h*f+u*d*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],c=n[9],l=n[2],h=n[6],f=n[10],u=i+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-c)*d,this._y=(s-l)*d,this._z=(a-r)*d}else if(i>o&&i>f){const d=2*Math.sqrt(1+i-o-f);this._w=(h-c)/d,this._x=.25*d,this._y=(r+a)/d,this._z=(s+l)/d}else if(o>f){const d=2*Math.sqrt(1+o-i-f);this._w=(s-l)/d,this._x=(r+a)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-i-o);this._w=(a-r)/d,this._x=(s+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Et(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,c=n._y,l=n._z,h=n._w;return this._x=i*h+a*o+r*l-s*c,this._y=r*h+a*c+s*o-i*l,this._z=s*h+a*l+i*c-r*o,this._w=a*h-i*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const d=1-n;return this._w=d*a+n*this._w,this._x=d*i+n*this._x,this._y=d*r+n*this._y,this._z=d*s+n*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),f=Math.sin((1-n)*h)/l,u=Math.sin(n*h)/l;return this._w=a*f+this._w*u,this._x=i*f+this._x*u,this._y=r*f+this._y*u,this._z=s*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(e=0,n=0,i=0){O.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(lo.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(lo.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*i),h=2*(o*n-s*r),f=2*(s*i-a*n);return this.x=n+c*l+a*f-o*h,this.y=i+c*h+o*l-s*f,this.z=r+c*f+s*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,c=n.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Qr.copy(this).projectOnVector(e),this.sub(Qr)}reflect(e){return this.sub(Qr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qr=new O,lo=new Dn;class Yn{constructor(e=new O(1/0,1/0,1/0),n=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(kt.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(kt.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=kt.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,kt):kt.fromBufferAttribute(s,a),kt.applyMatrix4(e.matrixWorld),this.expandByPoint(kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ji.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ji.copy(i.boundingBox)),Ji.applyMatrix4(e.matrixWorld),this.union(Ji)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kt),kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ui),Qi.subVectors(this.max,Ui),ei.subVectors(e.a,Ui),ti.subVectors(e.b,Ui),ni.subVectors(e.c,Ui),gn.subVectors(ti,ei),vn.subVectors(ni,ti),Un.subVectors(ei,ni);let n=[0,-gn.z,gn.y,0,-vn.z,vn.y,0,-Un.z,Un.y,gn.z,0,-gn.x,vn.z,0,-vn.x,Un.z,0,-Un.x,-gn.y,gn.x,0,-vn.y,vn.x,0,-Un.y,Un.x,0];return!es(n,ei,ti,ni,Qi)||(n=[1,0,0,0,1,0,0,0,1],!es(n,ei,ti,ni,Qi))?!1:(er.crossVectors(gn,vn),n=[er.x,er.y,er.z],es(n,ei,ti,ni,Qi))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const rn=[new O,new O,new O,new O,new O,new O,new O,new O],kt=new O,Ji=new Yn,ei=new O,ti=new O,ni=new O,gn=new O,vn=new O,Un=new O,Ui=new O,Qi=new O,er=new O,Nn=new O;function es(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){Nn.fromArray(t,s);const o=r.x*Math.abs(Nn.x)+r.y*Math.abs(Nn.y)+r.z*Math.abs(Nn.z),c=e.dot(Nn),l=n.dot(Nn),h=i.dot(Nn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Xf=new Yn,Ni=new O,ts=new O;class jn{constructor(e=new O,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):Xf.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ni.subVectors(e,this.center);const n=Ni.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Ni,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ts.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ni.copy(e.center).add(ts)),this.expandByPoint(Ni.copy(e.center).sub(ts))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const sn=new O,ns=new O,tr=new O,xn=new O,is=new O,nr=new O,rs=new O;class kr{constructor(e=new O,n=new O(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,sn)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=sn.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(sn.copy(this.origin).addScaledVector(this.direction,n),sn.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){ns.copy(e).add(n).multiplyScalar(.5),tr.copy(n).sub(e).normalize(),xn.copy(this.origin).sub(ns);const s=e.distanceTo(n)*.5,a=-this.direction.dot(tr),o=xn.dot(this.direction),c=-xn.dot(tr),l=xn.lengthSq(),h=Math.abs(1-a*a);let f,u,d,_;if(h>0)if(f=a*c-o,u=a*o-c,_=s*h,f>=0)if(u>=-_)if(u<=_){const g=1/h;f*=g,u*=g,d=f*(f+a*u+2*o)+u*(a*f+u+2*c)+l}else u=s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*c)+l;else u=-s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*c)+l;else u<=-_?(f=Math.max(0,-(-a*s+o)),u=f>0?-s:Math.min(Math.max(-s,-c),s),d=-f*f+u*(u+2*c)+l):u<=_?(f=0,u=Math.min(Math.max(-s,-c),s),d=u*(u+2*c)+l):(f=Math.max(0,-(a*s+o)),u=f>0?s:Math.min(Math.max(-s,-c),s),d=-f*f+u*(u+2*c)+l);else u=a>0?-s:s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(ns).addScaledVector(tr,u),d}intersectSphere(e,n){sn.subVectors(e.center,this.origin);const i=sn.dot(this.direction),r=sn.dot(sn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,r=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,r=(e.min.x-u.x)*l),h>=0?(s=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-u.z)*f,c=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,c=(e.min.z-u.z)*f),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,sn)!==null}intersectTriangle(e,n,i,r,s){is.subVectors(n,e),nr.subVectors(i,e),rs.crossVectors(is,nr);let a=this.direction.dot(rs),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;xn.subVectors(this.origin,e);const c=o*this.direction.dot(nr.crossVectors(xn,nr));if(c<0)return null;const l=o*this.direction.dot(is.cross(xn));if(l<0||c+l>a)return null;const h=-o*xn.dot(rs);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ke{constructor(e,n,i,r,s,a,o,c,l,h,f,u,d,_,g,m){Ke.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,c,l,h,f,u,d,_,g,m)}set(e,n,i,r,s,a,o,c,l,h,f,u,d,_,g,m){const p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=_,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ke().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ii.setFromMatrixColumn(e,0).length(),s=1/ii.setFromMatrixColumn(e,1).length(),a=1/ii.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const u=a*h,d=a*f,_=o*h,g=o*f;n[0]=c*h,n[4]=-c*f,n[8]=l,n[1]=d+_*l,n[5]=u-g*l,n[9]=-o*c,n[2]=g-u*l,n[6]=_+d*l,n[10]=a*c}else if(e.order==="YXZ"){const u=c*h,d=c*f,_=l*h,g=l*f;n[0]=u+g*o,n[4]=_*o-d,n[8]=a*l,n[1]=a*f,n[5]=a*h,n[9]=-o,n[2]=d*o-_,n[6]=g+u*o,n[10]=a*c}else if(e.order==="ZXY"){const u=c*h,d=c*f,_=l*h,g=l*f;n[0]=u-g*o,n[4]=-a*f,n[8]=_+d*o,n[1]=d+_*o,n[5]=a*h,n[9]=g-u*o,n[2]=-a*l,n[6]=o,n[10]=a*c}else if(e.order==="ZYX"){const u=a*h,d=a*f,_=o*h,g=o*f;n[0]=c*h,n[4]=_*l-d,n[8]=u*l+g,n[1]=c*f,n[5]=g*l+u,n[9]=d*l-_,n[2]=-l,n[6]=o*c,n[10]=a*c}else if(e.order==="YZX"){const u=a*c,d=a*l,_=o*c,g=o*l;n[0]=c*h,n[4]=g-u*f,n[8]=_*f+d,n[1]=f,n[5]=a*h,n[9]=-o*h,n[2]=-l*h,n[6]=d*f+_,n[10]=u-g*f}else if(e.order==="XZY"){const u=a*c,d=a*l,_=o*c,g=o*l;n[0]=c*h,n[4]=-f,n[8]=l*h,n[1]=u*f+g,n[5]=a*h,n[9]=d*f-_,n[2]=_*f-d,n[6]=o*h,n[10]=g*f+u}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qf,e,$f)}lookAt(e,n,i){const r=this.elements;return Dt.subVectors(e,n),Dt.lengthSq()===0&&(Dt.z=1),Dt.normalize(),Mn.crossVectors(i,Dt),Mn.lengthSq()===0&&(Math.abs(i.z)===1?Dt.x+=1e-4:Dt.z+=1e-4,Dt.normalize(),Mn.crossVectors(i,Dt)),Mn.normalize(),ir.crossVectors(Dt,Mn),r[0]=Mn.x,r[4]=ir.x,r[8]=Dt.x,r[1]=Mn.y,r[5]=ir.y,r[9]=Dt.y,r[2]=Mn.z,r[6]=ir.z,r[10]=Dt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],f=i[5],u=i[9],d=i[13],_=i[2],g=i[6],m=i[10],p=i[14],T=i[3],S=i[7],v=i[11],P=i[15],b=r[0],w=r[4],R=r[8],y=r[12],x=r[1],C=r[5],z=r[9],I=r[13],N=r[2],X=r[6],G=r[10],K=r[14],k=r[3],te=r[7],le=r[11],ve=r[15];return s[0]=a*b+o*x+c*N+l*k,s[4]=a*w+o*C+c*X+l*te,s[8]=a*R+o*z+c*G+l*le,s[12]=a*y+o*I+c*K+l*ve,s[1]=h*b+f*x+u*N+d*k,s[5]=h*w+f*C+u*X+d*te,s[9]=h*R+f*z+u*G+d*le,s[13]=h*y+f*I+u*K+d*ve,s[2]=_*b+g*x+m*N+p*k,s[6]=_*w+g*C+m*X+p*te,s[10]=_*R+g*z+m*G+p*le,s[14]=_*y+g*I+m*K+p*ve,s[3]=T*b+S*x+v*N+P*k,s[7]=T*w+S*C+v*X+P*te,s[11]=T*R+S*z+v*G+P*le,s[15]=T*y+S*I+v*K+P*ve,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],f=e[6],u=e[10],d=e[14],_=e[3],g=e[7],m=e[11],p=e[15];return _*(+s*c*f-r*l*f-s*o*u+i*l*u+r*o*d-i*c*d)+g*(+n*c*d-n*l*u+s*a*u-r*a*d+r*l*h-s*c*h)+m*(+n*l*f-n*o*d-s*a*f+i*a*d+s*o*h-i*l*h)+p*(-r*o*h-n*c*f+n*o*u+r*a*f-i*a*u+i*c*h)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],d=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=f*m*l-g*u*l+g*c*d-o*m*d-f*c*p+o*u*p,S=_*u*l-h*m*l-_*c*d+a*m*d+h*c*p-a*u*p,v=h*g*l-_*f*l+_*o*d-a*g*d-h*o*p+a*f*p,P=_*f*c-h*g*c-_*o*u+a*g*u+h*o*m-a*f*m,b=n*T+i*S+r*v+s*P;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return e[0]=T*w,e[1]=(g*u*s-f*m*s-g*r*d+i*m*d+f*r*p-i*u*p)*w,e[2]=(o*m*s-g*c*s+g*r*l-i*m*l-o*r*p+i*c*p)*w,e[3]=(f*c*s-o*u*s-f*r*l+i*u*l+o*r*d-i*c*d)*w,e[4]=S*w,e[5]=(h*m*s-_*u*s+_*r*d-n*m*d-h*r*p+n*u*p)*w,e[6]=(_*c*s-a*m*s-_*r*l+n*m*l+a*r*p-n*c*p)*w,e[7]=(a*u*s-h*c*s+h*r*l-n*u*l-a*r*d+n*c*d)*w,e[8]=v*w,e[9]=(_*f*s-h*g*s-_*i*d+n*g*d+h*i*p-n*f*p)*w,e[10]=(a*g*s-_*o*s+_*i*l-n*g*l-a*i*p+n*o*p)*w,e[11]=(h*o*s-a*f*s-h*i*l+n*f*l+a*i*d-n*o*d)*w,e[12]=P*w,e[13]=(h*g*r-_*f*r+_*i*u-n*g*u-h*i*m+n*f*m)*w,e[14]=(_*o*r-a*g*r-_*i*c+n*g*c+a*i*m-n*o*m)*w,e[15]=(a*f*r-h*o*r+h*i*c-n*f*c-a*i*u+n*o*u)*w,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,c=e.z,l=s*a,h=s*o;return this.set(l*a+i,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+i,h*c-r*a,0,l*c-r*o,h*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,c=n._w,l=s+s,h=a+a,f=o+o,u=s*l,d=s*h,_=s*f,g=a*h,m=a*f,p=o*f,T=c*l,S=c*h,v=c*f,P=i.x,b=i.y,w=i.z;return r[0]=(1-(g+p))*P,r[1]=(d+v)*P,r[2]=(_-S)*P,r[3]=0,r[4]=(d-v)*b,r[5]=(1-(u+p))*b,r[6]=(m+T)*b,r[7]=0,r[8]=(_+S)*w,r[9]=(m-T)*w,r[10]=(1-(u+g))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ii.set(r[0],r[1],r[2]).length();const a=ii.set(r[4],r[5],r[6]).length(),o=ii.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Gt.copy(this);const l=1/s,h=1/a,f=1/o;return Gt.elements[0]*=l,Gt.elements[1]*=l,Gt.elements[2]*=l,Gt.elements[4]*=h,Gt.elements[5]*=h,Gt.elements[6]*=h,Gt.elements[8]*=f,Gt.elements[9]*=f,Gt.elements[10]*=f,n.setFromRotationMatrix(Gt),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=fn){const c=this.elements,l=2*s/(n-e),h=2*s/(i-r),f=(n+e)/(n-e),u=(i+r)/(i-r);let d,_;if(o===fn)d=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Ir)d=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=fn){const c=this.elements,l=1/(n-e),h=1/(i-r),f=1/(a-s),u=(n+e)*l,d=(i+r)*h;let _,g;if(o===fn)_=(a+s)*f,g=-2*f;else if(o===Ir)_=s*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ii=new O,Gt=new Ke,qf=new O(0,0,0),$f=new O(1,1,1),Mn=new O,ir=new O,Dt=new O,ho=new Ke,fo=new Dn;class pn{constructor(e=0,n=0,i=0,r=pn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],h=r[9],f=r[2],u=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(Et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Et(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Et(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return ho.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ho,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return fo.setFromEuler(this),this.setFromQuaternion(fo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pn.DEFAULT_ORDER="XYZ";class Dc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Yf=0;const uo=new O,ri=new Dn,an=new Ke,rr=new O,Fi=new O,jf=new O,Zf=new Dn,po=new O(1,0,0),mo=new O(0,1,0),_o=new O(0,0,1),go={type:"added"},Kf={type:"removed"},si={type:"childadded",child:null},ss={type:"childremoved",child:null};class ut extends $n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ut.DEFAULT_UP.clone();const e=new O,n=new pn,i=new Dn,r=new O(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ke},normalMatrix:{value:new De}}),this.matrix=new Ke,this.matrixWorld=new Ke,this.matrixAutoUpdate=ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ri.setFromAxisAngle(e,n),this.quaternion.multiply(ri),this}rotateOnWorldAxis(e,n){return ri.setFromAxisAngle(e,n),this.quaternion.premultiply(ri),this}rotateX(e){return this.rotateOnAxis(po,e)}rotateY(e){return this.rotateOnAxis(mo,e)}rotateZ(e){return this.rotateOnAxis(_o,e)}translateOnAxis(e,n){return uo.copy(e).applyQuaternion(this.quaternion),this.position.add(uo.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(po,e)}translateY(e){return this.translateOnAxis(mo,e)}translateZ(e){return this.translateOnAxis(_o,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?rr.copy(e):rr.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Fi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(Fi,rr,this.up):an.lookAt(rr,Fi,this.up),this.quaternion.setFromRotationMatrix(an),r&&(an.extractRotation(r.matrixWorld),ri.setFromRotationMatrix(an),this.quaternion.premultiply(ri.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(go),si.child=e,this.dispatchEvent(si),si.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Kf),ss.child=e,this.dispatchEvent(ss),ss.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),an.multiply(e.parent.matrixWorld)),e.applyMatrix4(an),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(go),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,e,jf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,Zf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];s(e.shapes,f)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(n){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),d=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}ut.DEFAULT_UP=new O(0,1,0);ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Wt=new O,on=new O,as=new O,cn=new O,ai=new O,oi=new O,vo=new O,os=new O,cs=new O,ls=new O,hs=new st,fs=new st,ds=new st;class Xt{constructor(e=new O,n=new O,i=new O){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Wt.subVectors(e,n),r.cross(Wt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Wt.subVectors(r,n),on.subVectors(i,n),as.subVectors(e,n);const a=Wt.dot(Wt),o=Wt.dot(on),c=Wt.dot(as),l=on.dot(on),h=on.dot(as),f=a*l-o*o;if(f===0)return s.set(0,0,0),null;const u=1/f,d=(l*c-o*h)*u,_=(a*h-o*c)*u;return s.set(1-d-_,_,d)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,cn)===null?!1:cn.x>=0&&cn.y>=0&&cn.x+cn.y<=1}static getInterpolation(e,n,i,r,s,a,o,c){return this.getBarycoord(e,n,i,r,cn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,cn.x),c.addScaledVector(a,cn.y),c.addScaledVector(o,cn.z),c)}static getInterpolatedAttribute(e,n,i,r,s,a){return hs.setScalar(0),fs.setScalar(0),ds.setScalar(0),hs.fromBufferAttribute(e,n),fs.fromBufferAttribute(e,i),ds.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(hs,s.x),a.addScaledVector(fs,s.y),a.addScaledVector(ds,s.z),a}static isFrontFacing(e,n,i,r){return Wt.subVectors(i,n),on.subVectors(e,n),Wt.cross(on).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wt.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Wt.cross(on).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Xt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Xt.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Xt.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Xt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Xt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;ai.subVectors(r,i),oi.subVectors(s,i),os.subVectors(e,i);const c=ai.dot(os),l=oi.dot(os);if(c<=0&&l<=0)return n.copy(i);cs.subVectors(e,r);const h=ai.dot(cs),f=oi.dot(cs);if(h>=0&&f<=h)return n.copy(r);const u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),n.copy(i).addScaledVector(ai,a);ls.subVectors(e,s);const d=ai.dot(ls),_=oi.dot(ls);if(_>=0&&d<=_)return n.copy(s);const g=d*l-c*_;if(g<=0&&l>=0&&_<=0)return o=l/(l-_),n.copy(i).addScaledVector(oi,o);const m=h*_-d*f;if(m<=0&&f-h>=0&&d-_>=0)return vo.subVectors(s,r),o=(f-h)/(f-h+(d-_)),n.copy(r).addScaledVector(vo,o);const p=1/(m+g+u);return a=g*p,o=u*p,n.copy(i).addScaledVector(ai,a).addScaledVector(oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Lc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yn={h:0,s:0,l:0},sr={h:0,s:0,l:0};function us(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Oe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Ge.workingColorSpace){return this.r=e,this.g=n,this.b=i,Ge.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Ge.workingColorSpace){if(e=Uf(e,1),n=Et(n,0,1),i=Et(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=us(a,s,e+1/3),this.g=us(a,s,e),this.b=us(a,s,e-1/3)}return Ge.toWorkingColorSpace(this,r),this}setStyle(e,n=Ot){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ot){const i=Lc[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=dn(e.r),this.g=dn(e.g),this.b=dn(e.b),this}copyLinearToSRGB(e){return this.r=xi(e.r),this.g=xi(e.g),this.b=xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return Ge.fromWorkingColorSpace(gt.copy(this),e),Math.round(Et(gt.r*255,0,255))*65536+Math.round(Et(gt.g*255,0,255))*256+Math.round(Et(gt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Ge.workingColorSpace){Ge.fromWorkingColorSpace(gt.copy(this),n);const i=gt.r,r=gt.g,s=gt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const f=a-o;switch(l=h<=.5?f/(a+o):f/(2-a-o),a){case i:c=(r-s)/f+(r<s?6:0);break;case r:c=(s-i)/f+2;break;case s:c=(i-r)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,n=Ge.workingColorSpace){return Ge.fromWorkingColorSpace(gt.copy(this),n),e.r=gt.r,e.g=gt.g,e.b=gt.b,e}getStyle(e=Ot){Ge.fromWorkingColorSpace(gt.copy(this),e);const n=gt.r,i=gt.g,r=gt.b;return e!==Ot?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(yn),this.setHSL(yn.h+e,yn.s+n,yn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(yn),e.getHSL(sr);const i=Zr(yn.h,sr.h,n),r=Zr(yn.s,sr.s,n),s=Zr(yn.l,sr.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const gt=new Oe;Oe.NAMES=Lc;let Jf=0;class Ri extends $n{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=Yi(),this.name="",this.blending=gi,this.side=Pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rs,this.blendDst=Cs,this.blendEquation=Vn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=Mi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=eo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jn,this.stencilZFail=Jn,this.stencilZPass=Jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==gi&&(i.blending=this.blending),this.side!==Pn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Rs&&(i.blendSrc=this.blendSrc),this.blendDst!==Cs&&(i.blendDst=this.blendDst),this.blendEquation!==Vn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Mi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==eo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Jn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Jn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ci extends Ri{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.combine=_c,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new O,ar=new we;class Bt{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=to,this.updateRanges=[],this.gpuType=Qt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)ar.fromBufferAttribute(this,n),ar.applyMatrix3(e),this.setXY(n,ar.x,ar.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)ct.fromBufferAttribute(this,n),ct.applyMatrix3(e),this.setXYZ(n,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)ct.fromBufferAttribute(this,n),ct.applyMatrix4(e),this.setXYZ(n,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)ct.fromBufferAttribute(this,n),ct.applyNormalMatrix(e),this.setXYZ(n,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)ct.fromBufferAttribute(this,n),ct.transformDirection(e),this.setXYZ(n,ct.x,ct.y,ct.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Ii(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=bt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ii(n,this.array)),n}setX(e,n){return this.normalized&&(n=bt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ii(n,this.array)),n}setY(e,n){return this.normalized&&(n=bt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ii(n,this.array)),n}setZ(e,n){return this.normalized&&(n=bt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ii(n,this.array)),n}setW(e,n){return this.normalized&&(n=bt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=bt(n,this.array),i=bt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=bt(n,this.array),i=bt(i,this.array),r=bt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=bt(n,this.array),i=bt(i,this.array),r=bt(r,this.array),s=bt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==to&&(e.usage=this.usage),e}}class Ic extends Bt{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Uc extends Bt{constructor(e,n,i){super(new Int32Array(e),n,i)}}class Nc extends Bt{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ot extends Bt{constructor(e,n,i){super(new Float32Array(e),n,i)}}let Qf=0;const Ft=new Ke,ps=new ut,ci=new O,Lt=new Yn,Oi=new Yn,dt=new O;class pt extends $n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rc(e)?Nc:Ic)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new De().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ft.makeRotationFromQuaternion(e),this.applyMatrix4(Ft),this}rotateX(e){return Ft.makeRotationX(e),this.applyMatrix4(Ft),this}rotateY(e){return Ft.makeRotationY(e),this.applyMatrix4(Ft),this}rotateZ(e){return Ft.makeRotationZ(e),this.applyMatrix4(Ft),this}translate(e,n,i){return Ft.makeTranslation(e,n,i),this.applyMatrix4(Ft),this}scale(e,n,i){return Ft.makeScale(e,n,i),this.applyMatrix4(Ft),this}lookAt(e){return ps.lookAt(e),ps.updateMatrix(),this.applyMatrix4(ps.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ci).negate(),this.translate(ci.x,ci.y,ci.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ot(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yn);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Lt.setFromBufferAttribute(s),this.morphTargetsRelative?(dt.addVectors(this.boundingBox.min,Lt.min),this.boundingBox.expandByPoint(dt),dt.addVectors(this.boundingBox.max,Lt.max),this.boundingBox.expandByPoint(dt)):(this.boundingBox.expandByPoint(Lt.min),this.boundingBox.expandByPoint(Lt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jn);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const i=this.boundingSphere.center;if(Lt.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];Oi.setFromBufferAttribute(o),this.morphTargetsRelative?(dt.addVectors(Lt.min,Oi.min),Lt.expandByPoint(dt),dt.addVectors(Lt.max,Oi.max),Lt.expandByPoint(dt)):(Lt.expandByPoint(Oi.min),Lt.expandByPoint(Oi.max))}Lt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)dt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(dt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)dt.fromBufferAttribute(o,l),c&&(ci.fromBufferAttribute(e,l),dt.add(ci)),r=Math.max(r,i.distanceToSquared(dt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bt(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<i.count;R++)o[R]=new O,c[R]=new O;const l=new O,h=new O,f=new O,u=new we,d=new we,_=new we,g=new O,m=new O;function p(R,y,x){l.fromBufferAttribute(i,R),h.fromBufferAttribute(i,y),f.fromBufferAttribute(i,x),u.fromBufferAttribute(s,R),d.fromBufferAttribute(s,y),_.fromBufferAttribute(s,x),h.sub(l),f.sub(l),d.sub(u),_.sub(u);const C=1/(d.x*_.y-_.x*d.y);isFinite(C)&&(g.copy(h).multiplyScalar(_.y).addScaledVector(f,-d.y).multiplyScalar(C),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-_.x).multiplyScalar(C),o[R].add(g),o[y].add(g),o[x].add(g),c[R].add(m),c[y].add(m),c[x].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let R=0,y=T.length;R<y;++R){const x=T[R],C=x.start,z=x.count;for(let I=C,N=C+z;I<N;I+=3)p(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const S=new O,v=new O,P=new O,b=new O;function w(R){P.fromBufferAttribute(r,R),b.copy(P);const y=o[R];S.copy(y),S.sub(P.multiplyScalar(P.dot(y))).normalize(),v.crossVectors(b,y);const C=v.dot(c[R])<0?-1:1;a.setXYZW(R,S.x,S.y,S.z,C)}for(let R=0,y=T.length;R<y;++R){const x=T[R],C=x.start,z=x.count;for(let I=C,N=C+z;I<N;I+=3)w(e.getX(I+0)),w(e.getX(I+1)),w(e.getX(I+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Bt(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const r=new O,s=new O,a=new O,o=new O,c=new O,l=new O,h=new O,f=new O;if(e)for(let u=0,d=e.count;u<d;u+=3){const _=e.getX(u+0),g=e.getX(u+1),m=e.getX(u+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,g),a.fromBufferAttribute(n,m),h.subVectors(a,s),f.subVectors(r,s),h.cross(f),o.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(g,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,d=n.count;u<d;u+=3)r.fromBufferAttribute(n,u+0),s.fromBufferAttribute(n,u+1),a.fromBufferAttribute(n,u+2),h.subVectors(a,s),f.subVectors(r,s),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)dt.fromBufferAttribute(e,n),dt.normalize(),e.setXYZ(n,dt.x,dt.y,dt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,f=o.normalized,u=new l.constructor(c.length*h);let d=0,_=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?d=c[g]*o.data.stride+o.offset:d=c[g]*h;for(let p=0;p<h;p++)u[_++]=l[d++]}return new Bt(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new pt,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,i);n.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,f=l.length;h<f;h++){const u=l[h],d=e(u,i);c.push(d)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){const d=l[f];h.push(d.toJSON(e.data))}h.length>0&&(r[c]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(n))}const s=e.morphAttributes;for(const l in s){const h=[],f=s[l];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(n));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const f=a[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xo=new Ke,Fn=new kr,or=new jn,Mo=new O,cr=new O,lr=new O,hr=new O,ms=new O,fr=new O,yo=new O,dr=new O;class wt extends ut{constructor(e=new pt,n=new Ci){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){fr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],f=s[c];h!==0&&(ms.fromBufferAttribute(f,e),a?fr.addScaledVector(ms,h):fr.addScaledVector(ms.sub(n),h))}n.add(fr)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),or.copy(i.boundingSphere),or.applyMatrix4(s),Fn.copy(e.ray).recast(e.near),!(or.containsPoint(Fn.origin)===!1&&(Fn.intersectSphere(or,Mo)===null||Fn.origin.distanceToSquared(Mo)>(e.far-e.near)**2))&&(xo.copy(s).invert(),Fn.copy(e.ray).applyMatrix4(xo),!(i.boundingBox!==null&&Fn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Fn)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,u=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=u.length;_<g;_++){const m=u[_],p=a[m.materialIndex],T=Math.max(m.start,d.start),S=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let v=T,P=S;v<P;v+=3){const b=o.getX(v),w=o.getX(v+1),R=o.getX(v+2);r=ur(this,p,e,i,l,h,f,b,w,R),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,d.start),g=Math.min(o.count,d.start+d.count);for(let m=_,p=g;m<p;m+=3){const T=o.getX(m),S=o.getX(m+1),v=o.getX(m+2);r=ur(this,a,e,i,l,h,f,T,S,v),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,g=u.length;_<g;_++){const m=u[_],p=a[m.materialIndex],T=Math.max(m.start,d.start),S=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let v=T,P=S;v<P;v+=3){const b=v,w=v+1,R=v+2;r=ur(this,p,e,i,l,h,f,b,w,R),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,d.start),g=Math.min(c.count,d.start+d.count);for(let m=_,p=g;m<p;m+=3){const T=m,S=m+1,v=m+2;r=ur(this,a,e,i,l,h,f,T,S,v),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function ed(t,e,n,i,r,s,a,o){let c;if(e.side===Ct?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===Pn,o),c===null)return null;dr.copy(o),dr.applyMatrix4(t.matrixWorld);const l=n.ray.origin.distanceTo(dr);return l<n.near||l>n.far?null:{distance:l,point:dr.clone(),object:t}}function ur(t,e,n,i,r,s,a,o,c,l){t.getVertexPosition(o,cr),t.getVertexPosition(c,lr),t.getVertexPosition(l,hr);const h=ed(t,e,n,i,cr,lr,hr,yo);if(h){const f=new O;Xt.getBarycoord(yo,cr,lr,hr,f),r&&(h.uv=Xt.getInterpolatedAttribute(r,o,c,l,f,new we)),s&&(h.uv1=Xt.getInterpolatedAttribute(s,o,c,l,f,new we)),a&&(h.normal=Xt.getInterpolatedAttribute(a,o,c,l,f,new O),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new O,materialIndex:0};Xt.getNormal(cr,lr,hr,u.normal),h.face=u,h.barycoord=f}return h}class Zn extends pt{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],f=[];let u=0,d=0;_("z","y","x",-1,-1,i,n,e,a,s,0),_("z","y","x",1,-1,i,n,-e,a,s,1),_("x","z","y",1,1,e,i,n,r,a,2),_("x","z","y",1,-1,e,i,-n,r,a,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new ot(l,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(f,2));function _(g,m,p,T,S,v,P,b,w,R,y){const x=v/w,C=P/R,z=v/2,I=P/2,N=b/2,X=w+1,G=R+1;let K=0,k=0;const te=new O;for(let le=0;le<G;le++){const ve=le*C-I;for(let Le=0;Le<X;Le++){const Xe=Le*x-z;te[g]=Xe*T,te[m]=ve*S,te[p]=N,l.push(te.x,te.y,te.z),te[g]=0,te[m]=0,te[p]=b>0?1:-1,h.push(te.x,te.y,te.z),f.push(Le/w),f.push(1-le/R),K+=1}}for(let le=0;le<R;le++)for(let ve=0;ve<w;ve++){const Le=u+ve+X*le,Xe=u+ve+X*(le+1),q=u+(ve+1)+X*(le+1),Q=u+(ve+1)+X*le;c.push(Le,Xe,Q),c.push(Xe,q,Q),k+=6}o.addGroup(d,k,y),d+=k,u+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function bi(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function yt(t){const e={};for(let n=0;n<t.length;n++){const i=bi(t[n]);for(const r in i)e[r]=i[r]}return e}function td(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Fc(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const nd={clone:bi,merge:yt};var id=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yt extends Ri{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=id,this.fragmentShader=rd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bi(e.uniforms),this.uniformsGroups=td(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Oc extends ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ke,this.projectionMatrix=new Ke,this.projectionMatrixInverse=new Ke,this.coordinateSystem=fn}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Sn=new O,So=new we,Eo=new we;class zt extends Oc{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=ua*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Cr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ua*2*Math.atan(Math.tan(Cr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Sn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Sn.x,Sn.y).multiplyScalar(-e/Sn.z),Sn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Sn.x,Sn.y).multiplyScalar(-e/Sn.z)}getViewSize(e,n){return this.getViewBounds(e,So,Eo),n.subVectors(Eo,So)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Cr*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,n-=a.offsetY*i/l,r*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const li=-90,hi=1;class sd extends ut{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new zt(li,hi,e,n);r.layers=this.layers,this.add(r);const s=new zt(li,hi,e,n);s.layers=this.layers,this.add(s);const a=new zt(li,hi,e,n);a.layers=this.layers,this.add(a);const o=new zt(li,hi,e,n);o.layers=this.layers,this.add(o);const c=new zt(li,hi,e,n);c.layers=this.layers,this.add(c);const l=new zt(li,hi,e,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,c]=n;for(const l of n)this.remove(l);if(e===fn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ir)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of n)this.add(l),l.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,c),e.setRenderTarget(i,4,r),e.render(n,l),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,r),e.render(n,h),e.setRenderTarget(f,u,d),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class zc extends xt{constructor(e,n,i,r,s,a,o,c,l,h){e=e!==void 0?e:[],n=n!==void 0?n:yi,super(e,n,i,r,s,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ad extends qn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new zc(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Jt}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Zn(5,5,5),s=new Yt({name:"CubemapFromEquirect",uniforms:bi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ct,blending:Rn});s.uniforms.tEquirect.value=n;const a=new wt(r,s),o=n.minFilter;return n.minFilter===Wn&&(n.minFilter=Jt),new sd(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const _s=new O,od=new O,cd=new De;class En{constructor(e=new O(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=_s.subVectors(i,n).cross(od.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(_s),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||cd.getNormalMatrix(e),r=this.coplanarPoint(_s).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const On=new jn,pr=new O;class wa{constructor(e=new En,n=new En,i=new En,r=new En,s=new En,a=new En){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=fn){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],c=r[3],l=r[4],h=r[5],f=r[6],u=r[7],d=r[8],_=r[9],g=r[10],m=r[11],p=r[12],T=r[13],S=r[14],v=r[15];if(i[0].setComponents(c-s,u-l,m-d,v-p).normalize(),i[1].setComponents(c+s,u+l,m+d,v+p).normalize(),i[2].setComponents(c+a,u+h,m+_,v+T).normalize(),i[3].setComponents(c-a,u-h,m-_,v-T).normalize(),i[4].setComponents(c-o,u-f,m-g,v-S).normalize(),n===fn)i[5].setComponents(c+o,u+f,m+g,v+S).normalize();else if(n===Ir)i[5].setComponents(o,f,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),On.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),On.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(On)}intersectsSprite(e){return On.center.set(0,0,0),On.radius=.7071067811865476,On.applyMatrix4(e.matrixWorld),this.intersectsSphere(On)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(pr.x=r.normal.x>0?e.max.x:e.min.x,pr.y=r.normal.y>0?e.max.y:e.min.y,pr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(pr)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Bc(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function ld(t){const e=new WeakMap;function n(o,c){const l=o.array,h=o.usage,f=l.byteLength,u=t.createBuffer();t.bindBuffer(c,u),t.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=t.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=t.SHORT;else if(l instanceof Uint32Array)d=t.UNSIGNED_INT;else if(l instanceof Int32Array)d=t.INT;else if(l instanceof Int8Array)d=t.BYTE;else if(l instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,l){const h=c.array,f=c.updateRanges;if(t.bindBuffer(l,o),f.length===0)t.bufferSubData(l,0,h);else{f.sort((d,_)=>d.start-_.start);let u=0;for(let d=1;d<f.length;d++){const _=f[u],g=f[d];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++u,f[u]=g)}f.length=u+1;for(let d=0,_=f.length;d<_;d++){const g=f[d];t.bufferSubData(l,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,n(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}class Gr extends pt{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),c=Math.floor(r),l=o+1,h=c+1,f=e/o,u=n/c,d=[],_=[],g=[],m=[];for(let p=0;p<h;p++){const T=p*u-a;for(let S=0;S<l;S++){const v=S*f-s;_.push(v,-T,0),g.push(0,0,1),m.push(S/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let T=0;T<o;T++){const S=T+l*p,v=T+l*(p+1),P=T+1+l*(p+1),b=T+1+l*p;d.push(S,v,b),d.push(v,P,b)}this.setIndex(d),this.setAttribute("position",new ot(_,3)),this.setAttribute("normal",new ot(g,3)),this.setAttribute("uv",new ot(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.width,e.height,e.widthSegments,e.heightSegments)}}var hd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,dd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ud=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,md=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_d=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,xd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Md=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ed=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Td=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ld=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Id=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ud=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Nd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Od=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Gd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Xd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$d=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,eu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,nu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,iu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ru=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,su=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,au=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ou=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,fu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,du=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_u=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,xu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Su=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Eu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bu=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Au=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ru=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Cu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Du=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lu=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Iu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Uu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ou=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zu=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Bu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ku=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,qu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$u=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Yu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ju=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zu=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ku=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ju=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ep=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,np=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ip=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,rp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_p=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,gp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ep=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Tp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ap=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Rp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Pp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ip=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Up=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Np=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,zp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:hd,alphahash_pars_fragment:fd,alphamap_fragment:dd,alphamap_pars_fragment:ud,alphatest_fragment:pd,alphatest_pars_fragment:md,aomap_fragment:_d,aomap_pars_fragment:gd,batching_pars_vertex:vd,batching_vertex:xd,begin_vertex:Md,beginnormal_vertex:yd,bsdfs:Sd,iridescence_fragment:Ed,bumpmap_pars_fragment:Td,clipping_planes_fragment:bd,clipping_planes_pars_fragment:Ad,clipping_planes_pars_vertex:wd,clipping_planes_vertex:Rd,color_fragment:Cd,color_pars_fragment:Pd,color_pars_vertex:Dd,color_vertex:Ld,common:Id,cube_uv_reflection_fragment:Ud,defaultnormal_vertex:Nd,displacementmap_pars_vertex:Fd,displacementmap_vertex:Od,emissivemap_fragment:zd,emissivemap_pars_fragment:Bd,colorspace_fragment:Hd,colorspace_pars_fragment:Vd,envmap_fragment:kd,envmap_common_pars_fragment:Gd,envmap_pars_fragment:Wd,envmap_pars_vertex:Xd,envmap_physical_pars_fragment:nu,envmap_vertex:qd,fog_vertex:$d,fog_pars_vertex:Yd,fog_fragment:jd,fog_pars_fragment:Zd,gradientmap_pars_fragment:Kd,lightmap_pars_fragment:Jd,lights_lambert_fragment:Qd,lights_lambert_pars_fragment:eu,lights_pars_begin:tu,lights_toon_fragment:iu,lights_toon_pars_fragment:ru,lights_phong_fragment:su,lights_phong_pars_fragment:au,lights_physical_fragment:ou,lights_physical_pars_fragment:cu,lights_fragment_begin:lu,lights_fragment_maps:hu,lights_fragment_end:fu,logdepthbuf_fragment:du,logdepthbuf_pars_fragment:uu,logdepthbuf_pars_vertex:pu,logdepthbuf_vertex:mu,map_fragment:_u,map_pars_fragment:gu,map_particle_fragment:vu,map_particle_pars_fragment:xu,metalnessmap_fragment:Mu,metalnessmap_pars_fragment:yu,morphinstance_vertex:Su,morphcolor_vertex:Eu,morphnormal_vertex:Tu,morphtarget_pars_vertex:bu,morphtarget_vertex:Au,normal_fragment_begin:wu,normal_fragment_maps:Ru,normal_pars_fragment:Cu,normal_pars_vertex:Pu,normal_vertex:Du,normalmap_pars_fragment:Lu,clearcoat_normal_fragment_begin:Iu,clearcoat_normal_fragment_maps:Uu,clearcoat_pars_fragment:Nu,iridescence_pars_fragment:Fu,opaque_fragment:Ou,packing:zu,premultiplied_alpha_fragment:Bu,project_vertex:Hu,dithering_fragment:Vu,dithering_pars_fragment:ku,roughnessmap_fragment:Gu,roughnessmap_pars_fragment:Wu,shadowmap_pars_fragment:Xu,shadowmap_pars_vertex:qu,shadowmap_vertex:$u,shadowmask_pars_fragment:Yu,skinbase_vertex:ju,skinning_pars_vertex:Zu,skinning_vertex:Ku,skinnormal_vertex:Ju,specularmap_fragment:Qu,specularmap_pars_fragment:ep,tonemapping_fragment:tp,tonemapping_pars_fragment:np,transmission_fragment:ip,transmission_pars_fragment:rp,uv_pars_fragment:sp,uv_pars_vertex:ap,uv_vertex:op,worldpos_vertex:cp,background_vert:lp,background_frag:hp,backgroundCube_vert:fp,backgroundCube_frag:dp,cube_vert:up,cube_frag:pp,depth_vert:mp,depth_frag:_p,distanceRGBA_vert:gp,distanceRGBA_frag:vp,equirect_vert:xp,equirect_frag:Mp,linedashed_vert:yp,linedashed_frag:Sp,meshbasic_vert:Ep,meshbasic_frag:Tp,meshlambert_vert:bp,meshlambert_frag:Ap,meshmatcap_vert:wp,meshmatcap_frag:Rp,meshnormal_vert:Cp,meshnormal_frag:Pp,meshphong_vert:Dp,meshphong_frag:Lp,meshphysical_vert:Ip,meshphysical_frag:Up,meshtoon_vert:Np,meshtoon_frag:Fp,points_vert:Op,points_frag:zp,shadow_vert:Bp,shadow_frag:Hp,sprite_vert:Vp,sprite_frag:kp},ne={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new we(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new we(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},Zt={basic:{uniforms:yt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:yt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:yt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:yt([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:yt([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:yt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:yt([ne.points,ne.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:yt([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:yt([ne.common,ne.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:yt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:yt([ne.sprite,ne.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:yt([ne.common,ne.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:yt([ne.lights,ne.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};Zt.physical={uniforms:yt([Zt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new we(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new we},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new we},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const mr={r:0,b:0,g:0},zn=new pn,Gp=new Ke;function Wp(t,e,n,i,r,s,a){const o=new Oe(0);let c=s===!0?0:1,l,h,f=null,u=0,d=null;function _(T){let S=T.isScene===!0?T.background:null;return S&&S.isTexture&&(S=(T.backgroundBlurriness>0?n:e).get(S)),S}function g(T){let S=!1;const v=_(T);v===null?p(o,c):v&&v.isColor&&(p(v,1),S=!0);const P=t.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(T,S){const v=_(S);v&&(v.isCubeTexture||v.mapping===Hr)?(h===void 0&&(h=new wt(new Zn(1,1,1),new Yt({name:"BackgroundCubeMaterial",uniforms:bi(Zt.backgroundCube.uniforms),vertexShader:Zt.backgroundCube.vertexShader,fragmentShader:Zt.backgroundCube.fragmentShader,side:Ct,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),zn.copy(S.backgroundRotation),zn.x*=-1,zn.y*=-1,zn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(zn.y*=-1,zn.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gp.makeRotationFromEuler(zn)),h.material.toneMapped=Ge.getTransfer(v.colorSpace)!==je,(f!==v||u!==v.version||d!==t.toneMapping)&&(h.material.needsUpdate=!0,f=v,u=v.version,d=t.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new wt(new Gr(2,2),new Yt({name:"BackgroundMaterial",uniforms:bi(Zt.background.uniforms),vertexShader:Zt.background.vertexShader,fragmentShader:Zt.background.fragmentShader,side:Pn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Ge.getTransfer(v.colorSpace)!==je,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||u!==v.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,f=v,u=v.version,d=t.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function p(T,S){T.getRGB(mr,Fc(t)),i.buffers.color.setClear(mr.r,mr.g,mr.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(T,S=1){o.set(T),c=S,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,p(o,c)},render:g,addToRenderList:m}}function Xp(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=u(null);let s=r,a=!1;function o(x,C,z,I,N){let X=!1;const G=f(I,z,C);s!==G&&(s=G,l(s.object)),X=d(x,I,z,N),X&&_(x,I,z,N),N!==null&&e.update(N,t.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(x,C,z,I),N!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return t.createVertexArray()}function l(x){return t.bindVertexArray(x)}function h(x){return t.deleteVertexArray(x)}function f(x,C,z){const I=z.wireframe===!0;let N=i[x.id];N===void 0&&(N={},i[x.id]=N);let X=N[C.id];X===void 0&&(X={},N[C.id]=X);let G=X[I];return G===void 0&&(G=u(c()),X[I]=G),G}function u(x){const C=[],z=[],I=[];for(let N=0;N<n;N++)C[N]=0,z[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:z,attributeDivisors:I,object:x,attributes:{},index:null}}function d(x,C,z,I){const N=s.attributes,X=C.attributes;let G=0;const K=z.getAttributes();for(const k in K)if(K[k].location>=0){const le=N[k];let ve=X[k];if(ve===void 0&&(k==="instanceMatrix"&&x.instanceMatrix&&(ve=x.instanceMatrix),k==="instanceColor"&&x.instanceColor&&(ve=x.instanceColor)),le===void 0||le.attribute!==ve||ve&&le.data!==ve.data)return!0;G++}return s.attributesNum!==G||s.index!==I}function _(x,C,z,I){const N={},X=C.attributes;let G=0;const K=z.getAttributes();for(const k in K)if(K[k].location>=0){let le=X[k];le===void 0&&(k==="instanceMatrix"&&x.instanceMatrix&&(le=x.instanceMatrix),k==="instanceColor"&&x.instanceColor&&(le=x.instanceColor));const ve={};ve.attribute=le,le&&le.data&&(ve.data=le.data),N[k]=ve,G++}s.attributes=N,s.attributesNum=G,s.index=I}function g(){const x=s.newAttributes;for(let C=0,z=x.length;C<z;C++)x[C]=0}function m(x){p(x,0)}function p(x,C){const z=s.newAttributes,I=s.enabledAttributes,N=s.attributeDivisors;z[x]=1,I[x]===0&&(t.enableVertexAttribArray(x),I[x]=1),N[x]!==C&&(t.vertexAttribDivisor(x,C),N[x]=C)}function T(){const x=s.newAttributes,C=s.enabledAttributes;for(let z=0,I=C.length;z<I;z++)C[z]!==x[z]&&(t.disableVertexAttribArray(z),C[z]=0)}function S(x,C,z,I,N,X,G){G===!0?t.vertexAttribIPointer(x,C,z,N,X):t.vertexAttribPointer(x,C,z,I,N,X)}function v(x,C,z,I){g();const N=I.attributes,X=z.getAttributes(),G=C.defaultAttributeValues;for(const K in X){const k=X[K];if(k.location>=0){let te=N[K];if(te===void 0&&(K==="instanceMatrix"&&x.instanceMatrix&&(te=x.instanceMatrix),K==="instanceColor"&&x.instanceColor&&(te=x.instanceColor)),te!==void 0){const le=te.normalized,ve=te.itemSize,Le=e.get(te);if(Le===void 0)continue;const Xe=Le.buffer,q=Le.type,Q=Le.bytesPerElement,he=q===t.INT||q===t.UNSIGNED_INT||te.gpuType===Ma;if(te.isInterleavedBufferAttribute){const ie=te.data,Se=ie.stride,Re=te.offset;if(ie.isInstancedInterleavedBuffer){for(let Fe=0;Fe<k.locationSize;Fe++)p(k.location+Fe,ie.meshPerAttribute);x.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Fe=0;Fe<k.locationSize;Fe++)m(k.location+Fe);t.bindBuffer(t.ARRAY_BUFFER,Xe);for(let Fe=0;Fe<k.locationSize;Fe++)S(k.location+Fe,ve/k.locationSize,q,le,Se*Q,(Re+ve/k.locationSize*Fe)*Q,he)}else{if(te.isInstancedBufferAttribute){for(let ie=0;ie<k.locationSize;ie++)p(k.location+ie,te.meshPerAttribute);x.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ie=0;ie<k.locationSize;ie++)m(k.location+ie);t.bindBuffer(t.ARRAY_BUFFER,Xe);for(let ie=0;ie<k.locationSize;ie++)S(k.location+ie,ve/k.locationSize,q,le,ve*Q,ve/k.locationSize*ie*Q,he)}}else if(G!==void 0){const le=G[K];if(le!==void 0)switch(le.length){case 2:t.vertexAttrib2fv(k.location,le);break;case 3:t.vertexAttrib3fv(k.location,le);break;case 4:t.vertexAttrib4fv(k.location,le);break;default:t.vertexAttrib1fv(k.location,le)}}}}T()}function P(){R();for(const x in i){const C=i[x];for(const z in C){const I=C[z];for(const N in I)h(I[N].object),delete I[N];delete C[z]}delete i[x]}}function b(x){if(i[x.id]===void 0)return;const C=i[x.id];for(const z in C){const I=C[z];for(const N in I)h(I[N].object),delete I[N];delete C[z]}delete i[x.id]}function w(x){for(const C in i){const z=i[C];if(z[x.id]===void 0)continue;const I=z[x.id];for(const N in I)h(I[N].object),delete I[N];delete z[x.id]}}function R(){y(),a=!0,s!==r&&(s=r,l(s.object))}function y(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:y,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:g,enableAttribute:m,disableUnusedAttributes:T}}function qp(t,e,n){let i;function r(l){i=l}function s(l,h){t.drawArrays(i,l,h),n.update(h,i,1)}function a(l,h,f){f!==0&&(t.drawArraysInstanced(i,l,h,f),n.update(h,i,f))}function o(l,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,f);let d=0;for(let _=0;_<f;_++)d+=h[_];n.update(d,i,1)}function c(l,h,f,u){if(f===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let _=0;_<l.length;_++)a(l[_],h[_],u[_]);else{d.multiDrawArraysInstancedWEBGL(i,l,0,h,0,u,0,f);let _=0;for(let g=0;g<f;g++)_+=h[g]*u[g];n.update(_,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function $p(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(w){return!(w!==qt&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const R=w===$i&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==un&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Qt&&!R)}function c(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=n.logarithmicDepthBuffer===!0,u=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),T=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),S=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=_>0,b=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reverseDepthBuffer:u,maxTextures:d,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:P,maxSamples:b}}function Yp(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new En,o=new De,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||r;return r=u,i=f.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,u){n=h(f,u,0)},this.setState=function(f,u,d){const _=f.clippingPlanes,g=f.clipIntersection,m=f.clipShadows,p=t.get(f);if(!r||_===null||_.length===0||s&&!m)s?h(null):l();else{const T=s?0:i,S=T*4;let v=p.clippingState||null;c.value=v,v=h(_,u,S,d);for(let P=0;P!==S;++P)v[P]=n[P];p.clippingState=v,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,u,d,_){const g=f!==null?f.length:0;let m=null;if(g!==0){if(m=c.value,_!==!0||m===null){const p=d+g*4,T=u.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,v=d;S!==g;++S,v+=4)a.copy(f[S]).applyMatrix4(T,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function jp(t){let e=new WeakMap;function n(a,o){return o===Os?a.mapping=yi:o===zs&&(a.mapping=Si),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Os||o===zs)if(e.has(a)){const c=e.get(a).texture;return n(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new ad(c.height);return l.fromEquirectangularTexture(t,a),e.set(a,l),a.addEventListener("dispose",r),n(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Hc extends Oc{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,c=r-n;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const pi=4,To=[.125,.215,.35,.446,.526,.582],kn=20,gs=new Hc,bo=new Oe;let vs=null,xs=0,Ms=0,ys=!1;const Hn=(1+Math.sqrt(5))/2,fi=1/Hn,Ao=[new O(-Hn,fi,0),new O(Hn,fi,0),new O(-fi,0,Hn),new O(fi,0,Hn),new O(0,Hn,-fi),new O(0,Hn,fi),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class wo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){vs=this._renderer.getRenderTarget(),xs=this._renderer.getActiveCubeFace(),Ms=this._renderer.getActiveMipmapLevel(),ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Po(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Co(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(vs,xs,Ms),this._renderer.xr.enabled=ys,e.scissorTest=!1,_r(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===yi||e.mapping===Si?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vs=this._renderer.getRenderTarget(),xs=this._renderer.getActiveCubeFace(),Ms=this._renderer.getActiveMipmapLevel(),ys=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Jt,minFilter:Jt,generateMipmaps:!1,type:$i,format:qt,colorSpace:wi,depthBuffer:!1},r=Ro(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ro(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zp(s)),this._blurMaterial=Kp(s,e,n)}return r}_compileMaterial(e){const n=new wt(this._lodPlanes[0],e);this._renderer.compile(n,gs)}_sceneToCubeUV(e,n,i,r){const o=new zt(90,1,n,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(bo),h.toneMapping=Cn,h.autoClear=!1;const d=new Ci({name:"PMREM.Background",side:Ct,depthWrite:!1,depthTest:!1}),_=new wt(new Zn,d);let g=!1;const m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,g=!0):(d.color.copy(bo),g=!0);for(let p=0;p<6;p++){const T=p%3;T===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):T===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const S=this._cubeSize;_r(r,T*S,p>2?S:0,S,S),h.setRenderTarget(r),g&&h.render(_,o),h.render(e,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=u,h.autoClear=f,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===yi||e.mapping===Si;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Po()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Co());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new wt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;_r(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,gs)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ao[(r-s-1)%Ao.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new wt(this._lodPlanes[r],l),u=l.uniforms,d=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*kn-1),g=s/_,m=isFinite(s)?1+Math.floor(h*g):kn;m>kn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${kn}`);const p=[];let T=0;for(let w=0;w<kn;++w){const R=w/g,y=Math.exp(-R*R/2);p.push(y),w===0?T+=y:w<m&&(T+=2*y)}for(let w=0;w<p.length;w++)p[w]=p[w]/T;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:S}=this;u.dTheta.value=_,u.mipInt.value=S-i;const v=this._sizeLods[r],P=3*v*(r>S-pi?r-S+pi:0),b=4*(this._cubeSize-v);_r(n,P,b,3*v,2*v),c.setRenderTarget(n),c.render(f,gs)}}function Zp(t){const e=[],n=[],i=[];let r=t;const s=t-pi+1+To.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let c=1/o;a>t-pi?c=To[a-t+pi-1]:a===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,f=1+l,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,_=6,g=3,m=2,p=1,T=new Float32Array(g*_*d),S=new Float32Array(m*_*d),v=new Float32Array(p*_*d);for(let b=0;b<d;b++){const w=b%3*2/3-1,R=b>2?0:-1,y=[w,R,0,w+2/3,R,0,w+2/3,R+1,0,w,R,0,w+2/3,R+1,0,w,R+1,0];T.set(y,g*_*b),S.set(u,m*_*b);const x=[b,b,b,b,b,b];v.set(x,p*_*b)}const P=new pt;P.setAttribute("position",new Bt(T,g)),P.setAttribute("uv",new Bt(S,m)),P.setAttribute("faceIndex",new Bt(v,p)),e.push(P),r>pi&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Ro(t,e,n){const i=new qn(t,e,n);return i.texture.mapping=Hr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _r(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function Kp(t,e,n){const i=new Float32Array(kn),r=new O(0,1,0);return new Yt({name:"SphericalGaussianBlur",defines:{n:kn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Co(){return new Yt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Po(){return new Yt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Ra(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Jp(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===Os||c===zs,h=c===yi||c===Si;if(l||h){let f=e.get(o);const u=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return n===null&&(n=new wo(t)),f=l?n.fromEquirectangular(o,f):n.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const d=o.image;return l&&d&&d.height>0||h&&d&&r(d)?(n===null&&(n=new wo(t)),f=l?n.fromEquirectangular(o):n.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function Qp(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Vi("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function em(t,e,n,i){const r={},s=new WeakMap;function a(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const _ in u.attributes)e.remove(u.attributes[_]);for(const _ in u.morphAttributes){const g=u.morphAttributes[_];for(let m=0,p=g.length;m<p;m++)e.remove(g[m])}u.removeEventListener("dispose",a),delete r[u.id];const d=s.get(u);d&&(e.remove(d),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,n.memory.geometries--}function o(f,u){return r[u.id]===!0||(u.addEventListener("dispose",a),r[u.id]=!0,n.memory.geometries++),u}function c(f){const u=f.attributes;for(const _ in u)e.update(u[_],t.ARRAY_BUFFER);const d=f.morphAttributes;for(const _ in d){const g=d[_];for(let m=0,p=g.length;m<p;m++)e.update(g[m],t.ARRAY_BUFFER)}}function l(f){const u=[],d=f.index,_=f.attributes.position;let g=0;if(d!==null){const T=d.array;g=d.version;for(let S=0,v=T.length;S<v;S+=3){const P=T[S+0],b=T[S+1],w=T[S+2];u.push(P,b,b,w,w,P)}}else if(_!==void 0){const T=_.array;g=_.version;for(let S=0,v=T.length/3-1;S<v;S+=3){const P=S+0,b=S+1,w=S+2;u.push(P,b,b,w,w,P)}}else return;const m=new(Rc(u)?Nc:Ic)(u,1);m.version=g;const p=s.get(f);p&&e.remove(p),s.set(f,m)}function h(f){const u=s.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&l(f)}else l(f);return s.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function tm(t,e,n){let i;function r(u){i=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function c(u,d){t.drawElements(i,d,s,u*a),n.update(d,i,1)}function l(u,d,_){_!==0&&(t.drawElementsInstanced(i,d,s,u*a,_),n.update(d,i,_))}function h(u,d,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,u,0,_);let m=0;for(let p=0;p<_;p++)m+=d[p];n.update(m,i,1)}function f(u,d,_,g){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/a,d[p],g[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,s,u,0,g,0,_);let p=0;for(let T=0;T<_;T++)p+=d[T]*g[T];n.update(p,i,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function nm(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function im(t,e,n){const i=new WeakMap,r=new st;function s(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let y=function(){w.dispose(),i.delete(o),o.removeEventListener("dispose",y)};u!==void 0&&u.texture.dispose();const d=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let S=0;d===!0&&(S=1),_===!0&&(S=2),g===!0&&(S=3);let v=o.attributes.position.count*S,P=1;v>e.maxTextureSize&&(P=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const b=new Float32Array(v*P*4*f),w=new Pc(b,v,P,f);w.type=Qt,w.needsUpdate=!0;const R=S*4;for(let x=0;x<f;x++){const C=m[x],z=p[x],I=T[x],N=v*P*4*x;for(let X=0;X<C.count;X++){const G=X*R;d===!0&&(r.fromBufferAttribute(C,X),b[N+G+0]=r.x,b[N+G+1]=r.y,b[N+G+2]=r.z,b[N+G+3]=0),_===!0&&(r.fromBufferAttribute(z,X),b[N+G+4]=r.x,b[N+G+5]=r.y,b[N+G+6]=r.z,b[N+G+7]=0),g===!0&&(r.fromBufferAttribute(I,X),b[N+G+8]=r.x,b[N+G+9]=r.y,b[N+G+10]=r.z,b[N+G+11]=I.itemSize===4?r.w:1)}}u={count:f,texture:w,size:new we(v,P)},i.set(o,u),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let d=0;for(let g=0;g<l.length;g++)d+=l[g];const _=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(t,"morphTargetBaseInfluence",_),c.getUniforms().setValue(t,"morphTargetInfluences",l)}c.getUniforms().setValue(t,"morphTargetsTexture",u.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",u.size)}return{update:s}}function rm(t,e,n,i){let r=new WeakMap;function s(c){const l=i.render.frame,h=c.geometry,f=e.get(c,h);if(r.get(f)!==l&&(e.update(f),r.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;r.get(u)!==l&&(u.update(),r.set(u,l))}return f}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),n.remove(l.instanceMatrix),l.instanceColor!==null&&n.remove(l.instanceColor)}return{update:s,dispose:a}}class Vc extends xt{constructor(e,n,i,r,s,a,o,c,l,h=vi){if(h!==vi&&h!==Ti)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===vi&&(i=Xn),i===void 0&&h===Ti&&(i=Ei),super(null,r,s,a,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:It,this.minFilter=c!==void 0?c:It,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const kc=new xt,Do=new Vc(1,1),Gc=new Pc,Wc=new Wf,Xc=new zc,Lo=[],Io=[],Uo=new Float32Array(16),No=new Float32Array(9),Fo=new Float32Array(4);function Pi(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Lo[r];if(s===void 0&&(s=new Float32Array(r),Lo[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function ht(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function ft(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Wr(t,e){let n=Io[e];n===void 0&&(n=new Int32Array(e),Io[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function sm(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function am(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(ht(n,e))return;t.uniform2fv(this.addr,e),ft(n,e)}}function om(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(ht(n,e))return;t.uniform3fv(this.addr,e),ft(n,e)}}function cm(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(ht(n,e))return;t.uniform4fv(this.addr,e),ft(n,e)}}function lm(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(ht(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),ft(n,e)}else{if(ht(n,i))return;Fo.set(i),t.uniformMatrix2fv(this.addr,!1,Fo),ft(n,i)}}function hm(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(ht(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),ft(n,e)}else{if(ht(n,i))return;No.set(i),t.uniformMatrix3fv(this.addr,!1,No),ft(n,i)}}function fm(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(ht(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),ft(n,e)}else{if(ht(n,i))return;Uo.set(i),t.uniformMatrix4fv(this.addr,!1,Uo),ft(n,i)}}function dm(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function um(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(ht(n,e))return;t.uniform2iv(this.addr,e),ft(n,e)}}function pm(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(ht(n,e))return;t.uniform3iv(this.addr,e),ft(n,e)}}function mm(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(ht(n,e))return;t.uniform4iv(this.addr,e),ft(n,e)}}function _m(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function gm(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(ht(n,e))return;t.uniform2uiv(this.addr,e),ft(n,e)}}function vm(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(ht(n,e))return;t.uniform3uiv(this.addr,e),ft(n,e)}}function xm(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(ht(n,e))return;t.uniform4uiv(this.addr,e),ft(n,e)}}function Mm(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Do.compareFunction=wc,s=Do):s=kc,n.setTexture2D(e||s,r)}function ym(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Wc,r)}function Sm(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Xc,r)}function Em(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Gc,r)}function Tm(t){switch(t){case 5126:return sm;case 35664:return am;case 35665:return om;case 35666:return cm;case 35674:return lm;case 35675:return hm;case 35676:return fm;case 5124:case 35670:return dm;case 35667:case 35671:return um;case 35668:case 35672:return pm;case 35669:case 35673:return mm;case 5125:return _m;case 36294:return gm;case 36295:return vm;case 36296:return xm;case 35678:case 36198:case 36298:case 36306:case 35682:return Mm;case 35679:case 36299:case 36307:return ym;case 35680:case 36300:case 36308:case 36293:return Sm;case 36289:case 36303:case 36311:case 36292:return Em}}function bm(t,e){t.uniform1fv(this.addr,e)}function Am(t,e){const n=Pi(e,this.size,2);t.uniform2fv(this.addr,n)}function wm(t,e){const n=Pi(e,this.size,3);t.uniform3fv(this.addr,n)}function Rm(t,e){const n=Pi(e,this.size,4);t.uniform4fv(this.addr,n)}function Cm(t,e){const n=Pi(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Pm(t,e){const n=Pi(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Dm(t,e){const n=Pi(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Lm(t,e){t.uniform1iv(this.addr,e)}function Im(t,e){t.uniform2iv(this.addr,e)}function Um(t,e){t.uniform3iv(this.addr,e)}function Nm(t,e){t.uniform4iv(this.addr,e)}function Fm(t,e){t.uniform1uiv(this.addr,e)}function Om(t,e){t.uniform2uiv(this.addr,e)}function zm(t,e){t.uniform3uiv(this.addr,e)}function Bm(t,e){t.uniform4uiv(this.addr,e)}function Hm(t,e,n){const i=this.cache,r=e.length,s=Wr(n,r);ht(i,s)||(t.uniform1iv(this.addr,s),ft(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||kc,s[a])}function Vm(t,e,n){const i=this.cache,r=e.length,s=Wr(n,r);ht(i,s)||(t.uniform1iv(this.addr,s),ft(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||Wc,s[a])}function km(t,e,n){const i=this.cache,r=e.length,s=Wr(n,r);ht(i,s)||(t.uniform1iv(this.addr,s),ft(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||Xc,s[a])}function Gm(t,e,n){const i=this.cache,r=e.length,s=Wr(n,r);ht(i,s)||(t.uniform1iv(this.addr,s),ft(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||Gc,s[a])}function Wm(t){switch(t){case 5126:return bm;case 35664:return Am;case 35665:return wm;case 35666:return Rm;case 35674:return Cm;case 35675:return Pm;case 35676:return Dm;case 5124:case 35670:return Lm;case 35667:case 35671:return Im;case 35668:case 35672:return Um;case 35669:case 35673:return Nm;case 5125:return Fm;case 36294:return Om;case 36295:return zm;case 36296:return Bm;case 35678:case 36198:case 36298:case 36306:case 35682:return Hm;case 35679:case 36299:case 36307:return Vm;case 35680:case 36300:case 36308:case 36293:return km;case 36289:case 36303:case 36311:case 36292:return Gm}}class Xm{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Tm(n.type)}}class qm{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=Wm(n.type)}}class $m{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const Ss=/(\w+)(\])?(\[|\.)?/g;function Oo(t,e){t.seq.push(e),t.map[e.id]=e}function Ym(t,e,n){const i=t.name,r=i.length;for(Ss.lastIndex=0;;){const s=Ss.exec(i),a=Ss.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Oo(n,l===void 0?new Xm(o,t,e):new qm(o,t,e));break}else{let f=n.map[o];f===void 0&&(f=new $m(o),Oo(n,f)),n=f}}}class Pr{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);Ym(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function zo(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const jm=37297;let Zm=0;function Km(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Bo=new De;function Jm(t){Ge._getMatrix(Bo,Ge.workingColorSpace,t);const e=`mat3( ${Bo.elements.map(n=>n.toFixed(4))} )`;switch(Ge.getTransfer(t)){case Vr:return[e,"LinearTransferOETF"];case je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Ho(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+Km(t.getShaderSource(e),a)}else return r}function Qm(t,e){const n=Jm(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function e0(t,e){let n;switch(e){case mf:n="Linear";break;case _f:n="Reinhard";break;case gf:n="Cineon";break;case vf:n="ACESFilmic";break;case Mf:n="AgX";break;case yf:n="Neutral";break;case xf:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const gr=new O;function t0(){Ge.getLuminanceCoefficients(gr);const t=gr.x.toFixed(4),e=gr.y.toFixed(4),n=gr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function n0(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ki).join(`
`)}function i0(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function r0(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function ki(t){return t!==""}function Vo(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ko(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const s0=/^[ \t]*#include +<([\w\d./]+)>/gm;function pa(t){return t.replace(s0,o0)}const a0=new Map;function o0(t,e){let n=Ue[e];if(n===void 0){const i=a0.get(e);if(i!==void 0)n=Ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return pa(n)}const c0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Go(t){return t.replace(c0,l0)}function l0(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Wo(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function h0(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===mc?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===$h?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===hn&&(e="SHADOWMAP_TYPE_VSM"),e}function f0(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case yi:case Si:e="ENVMAP_TYPE_CUBE";break;case Hr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function d0(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Si:e="ENVMAP_MODE_REFRACTION";break}return e}function u0(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case _c:e="ENVMAP_BLENDING_MULTIPLY";break;case uf:e="ENVMAP_BLENDING_MIX";break;case pf:e="ENVMAP_BLENDING_ADD";break}return e}function p0(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function m0(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const c=h0(n),l=f0(n),h=d0(n),f=u0(n),u=p0(n),d=n0(n),_=i0(s),g=r.createProgram();let m,p,T=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ki).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(ki).join(`
`),p.length>0&&(p+=`
`)):(m=[Wo(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ki).join(`
`),p=[Wo(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+h:"",n.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Cn?"#define TONE_MAPPING":"",n.toneMapping!==Cn?Ue.tonemapping_pars_fragment:"",n.toneMapping!==Cn?e0("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,Qm("linearToOutputTexel",n.outputColorSpace),t0(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ki).join(`
`)),a=pa(a),a=Vo(a,n),a=ko(a,n),o=pa(o),o=Vo(o,n),o=ko(o,n),a=Go(a),o=Go(o),n.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===no?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===no?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=T+m+a,v=T+p+o,P=zo(r,r.VERTEX_SHADER,S),b=zo(r,r.FRAGMENT_SHADER,v);r.attachShader(g,P),r.attachShader(g,b),n.index0AttributeName!==void 0?r.bindAttribLocation(g,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function w(C){if(t.debug.checkShaderErrors){const z=r.getProgramInfoLog(g).trim(),I=r.getShaderInfoLog(P).trim(),N=r.getShaderInfoLog(b).trim();let X=!0,G=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(X=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,g,P,b);else{const K=Ho(r,P,"vertex"),k=Ho(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+z+`
`+K+`
`+k)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||N==="")&&(G=!1);G&&(C.diagnostics={runnable:X,programLog:z,vertexShader:{log:I,prefix:m},fragmentShader:{log:N,prefix:p}})}r.deleteShader(P),r.deleteShader(b),R=new Pr(r,g),y=r0(r,g)}let R;this.getUniforms=function(){return R===void 0&&w(this),R};let y;this.getAttributes=function(){return y===void 0&&w(this),y};let x=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(g,jm)),x},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Zm++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=P,this.fragmentShader=b,this}let _0=0;class g0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new v0(e),n.set(e,i)),i}}class v0{constructor(e){this.id=_0++,this.code=e,this.usedTimes=0}}function x0(t,e,n,i,r,s,a){const o=new Dc,c=new g0,l=new Set,h=[],f=r.logarithmicDepthBuffer,u=r.vertexTextures;let d=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,x,C,z,I){const N=z.fog,X=I.geometry,G=y.isMeshStandardMaterial?z.environment:null,K=(y.isMeshStandardMaterial?n:e).get(y.envMap||G),k=K&&K.mapping===Hr?K.image.height:null,te=_[y.type];y.precision!==null&&(d=r.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const le=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ve=le!==void 0?le.length:0;let Le=0;X.morphAttributes.position!==void 0&&(Le=1),X.morphAttributes.normal!==void 0&&(Le=2),X.morphAttributes.color!==void 0&&(Le=3);let Xe,q,Q,he;if(te){const Ye=Zt[te];Xe=Ye.vertexShader,q=Ye.fragmentShader}else Xe=y.vertexShader,q=y.fragmentShader,c.update(y),Q=c.getVertexShaderID(y),he=c.getFragmentShaderID(y);const ie=t.getRenderTarget(),Se=t.state.buffers.depth.getReversed(),Re=I.isInstancedMesh===!0,Fe=I.isBatchedMesh===!0,it=!!y.map,Ve=!!y.matcap,at=!!K,F=!!y.aoMap,Ut=!!y.lightMap,ze=!!y.bumpMap,Be=!!y.normalMap,Ee=!!y.displacementMap,et=!!y.emissiveMap,ye=!!y.metalnessMap,A=!!y.roughnessMap,M=y.anisotropy>0,B=y.clearcoat>0,Y=y.dispersion>0,Z=y.iridescence>0,$=y.sheen>0,xe=y.transmission>0,se=M&&!!y.anisotropyMap,fe=B&&!!y.clearcoatMap,ke=B&&!!y.clearcoatNormalMap,J=B&&!!y.clearcoatRoughnessMap,de=Z&&!!y.iridescenceMap,Te=Z&&!!y.iridescenceThicknessMap,be=$&&!!y.sheenColorMap,ue=$&&!!y.sheenRoughnessMap,He=!!y.specularMap,Ie=!!y.specularColorMap,Je=!!y.specularIntensityMap,D=xe&&!!y.transmissionMap,re=xe&&!!y.thicknessMap,W=!!y.gradientMap,j=!!y.alphaMap,ce=y.alphaTest>0,ae=!!y.alphaHash,Ce=!!y.extensions;let rt=Cn;y.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(rt=t.toneMapping);const mt={shaderID:te,shaderType:y.type,shaderName:y.name,vertexShader:Xe,fragmentShader:q,defines:y.defines,customVertexShaderID:Q,customFragmentShaderID:he,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Fe,batchingColor:Fe&&I._colorsTexture!==null,instancing:Re,instancingColor:Re&&I.instanceColor!==null,instancingMorph:Re&&I.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:wi,alphaToCoverage:!!y.alphaToCoverage,map:it,matcap:Ve,envMap:at,envMapMode:at&&K.mapping,envMapCubeUVHeight:k,aoMap:F,lightMap:Ut,bumpMap:ze,normalMap:Be,displacementMap:u&&Ee,emissiveMap:et,normalMapObjectSpace:Be&&y.normalMapType===Af,normalMapTangentSpace:Be&&y.normalMapType===bf,metalnessMap:ye,roughnessMap:A,anisotropy:M,anisotropyMap:se,clearcoat:B,clearcoatMap:fe,clearcoatNormalMap:ke,clearcoatRoughnessMap:J,dispersion:Y,iridescence:Z,iridescenceMap:de,iridescenceThicknessMap:Te,sheen:$,sheenColorMap:be,sheenRoughnessMap:ue,specularMap:He,specularColorMap:Ie,specularIntensityMap:Je,transmission:xe,transmissionMap:D,thicknessMap:re,gradientMap:W,opaque:y.transparent===!1&&y.blending===gi&&y.alphaToCoverage===!1,alphaMap:j,alphaTest:ce,alphaHash:ae,combine:y.combine,mapUv:it&&g(y.map.channel),aoMapUv:F&&g(y.aoMap.channel),lightMapUv:Ut&&g(y.lightMap.channel),bumpMapUv:ze&&g(y.bumpMap.channel),normalMapUv:Be&&g(y.normalMap.channel),displacementMapUv:Ee&&g(y.displacementMap.channel),emissiveMapUv:et&&g(y.emissiveMap.channel),metalnessMapUv:ye&&g(y.metalnessMap.channel),roughnessMapUv:A&&g(y.roughnessMap.channel),anisotropyMapUv:se&&g(y.anisotropyMap.channel),clearcoatMapUv:fe&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:ke&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:de&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:be&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:ue&&g(y.sheenRoughnessMap.channel),specularMapUv:He&&g(y.specularMap.channel),specularColorMapUv:Ie&&g(y.specularColorMap.channel),specularIntensityMapUv:Je&&g(y.specularIntensityMap.channel),transmissionMapUv:D&&g(y.transmissionMap.channel),thicknessMapUv:re&&g(y.thicknessMap.channel),alphaMapUv:j&&g(y.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Be||M),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!X.attributes.uv&&(it||j),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Se,skinning:I.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Le,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&C.length>0,shadowMapType:t.shadowMap.type,toneMapping:rt,decodeVideoTexture:it&&y.map.isVideoTexture===!0&&Ge.getTransfer(y.map.colorSpace)===je,decodeVideoTextureEmissive:et&&y.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(y.emissiveMap.colorSpace)===je,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Kt,flipSided:y.side===Ct,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ce&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&y.extensions.multiDraw===!0||Fe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return mt.vertexUv1s=l.has(1),mt.vertexUv2s=l.has(2),mt.vertexUv3s=l.has(3),l.clear(),mt}function p(y){const x=[];if(y.shaderID?x.push(y.shaderID):(x.push(y.customVertexShaderID),x.push(y.customFragmentShaderID)),y.defines!==void 0)for(const C in y.defines)x.push(C),x.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(T(x,y),S(x,y),x.push(t.outputColorSpace)),x.push(y.customProgramCacheKey),x.join()}function T(y,x){y.push(x.precision),y.push(x.outputColorSpace),y.push(x.envMapMode),y.push(x.envMapCubeUVHeight),y.push(x.mapUv),y.push(x.alphaMapUv),y.push(x.lightMapUv),y.push(x.aoMapUv),y.push(x.bumpMapUv),y.push(x.normalMapUv),y.push(x.displacementMapUv),y.push(x.emissiveMapUv),y.push(x.metalnessMapUv),y.push(x.roughnessMapUv),y.push(x.anisotropyMapUv),y.push(x.clearcoatMapUv),y.push(x.clearcoatNormalMapUv),y.push(x.clearcoatRoughnessMapUv),y.push(x.iridescenceMapUv),y.push(x.iridescenceThicknessMapUv),y.push(x.sheenColorMapUv),y.push(x.sheenRoughnessMapUv),y.push(x.specularMapUv),y.push(x.specularColorMapUv),y.push(x.specularIntensityMapUv),y.push(x.transmissionMapUv),y.push(x.thicknessMapUv),y.push(x.combine),y.push(x.fogExp2),y.push(x.sizeAttenuation),y.push(x.morphTargetsCount),y.push(x.morphAttributeCount),y.push(x.numDirLights),y.push(x.numPointLights),y.push(x.numSpotLights),y.push(x.numSpotLightMaps),y.push(x.numHemiLights),y.push(x.numRectAreaLights),y.push(x.numDirLightShadows),y.push(x.numPointLightShadows),y.push(x.numSpotLightShadows),y.push(x.numSpotLightShadowsWithMaps),y.push(x.numLightProbes),y.push(x.shadowMapType),y.push(x.toneMapping),y.push(x.numClippingPlanes),y.push(x.numClipIntersection),y.push(x.depthPacking)}function S(y,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),y.push(o.mask)}function v(y){const x=_[y.type];let C;if(x){const z=Zt[x];C=nd.clone(z.uniforms)}else C=y.uniforms;return C}function P(y,x){let C;for(let z=0,I=h.length;z<I;z++){const N=h[z];if(N.cacheKey===x){C=N,++C.usedTimes;break}}return C===void 0&&(C=new m0(t,x,y,s),h.push(C)),C}function b(y){if(--y.usedTimes===0){const x=h.indexOf(y);h[x]=h[h.length-1],h.pop(),y.destroy()}}function w(y){c.remove(y)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:P,releaseProgram:b,releaseShaderCache:w,programs:h,dispose:R}}function M0(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,c){t.get(a)[o]=c}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function y0(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Xo(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function qo(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(f,u,d,_,g,m){let p=t[e];return p===void 0?(p={id:f.id,object:f,geometry:u,material:d,groupOrder:_,renderOrder:f.renderOrder,z:g,group:m},t[e]=p):(p.id=f.id,p.object=f,p.geometry=u,p.material=d,p.groupOrder=_,p.renderOrder=f.renderOrder,p.z=g,p.group=m),e++,p}function o(f,u,d,_,g,m){const p=a(f,u,d,_,g,m);d.transmission>0?i.push(p):d.transparent===!0?r.push(p):n.push(p)}function c(f,u,d,_,g,m){const p=a(f,u,d,_,g,m);d.transmission>0?i.unshift(p):d.transparent===!0?r.unshift(p):n.unshift(p)}function l(f,u){n.length>1&&n.sort(f||y0),i.length>1&&i.sort(u||Xo),r.length>1&&r.sort(u||Xo)}function h(){for(let f=e,u=t.length;f<u;f++){const d=t[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:c,finish:h,sort:l}}function S0(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new qo,t.set(i,[a])):r>=s.length?(a=new qo,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function E0(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new O,color:new Oe};break;case"SpotLight":n={position:new O,direction:new O,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new O,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new O,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":n={color:new Oe,position:new O,halfWidth:new O,halfHeight:new O};break}return t[e.id]=n,n}}}function T0(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new we,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let b0=0;function A0(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function w0(t){const e=new E0,n=T0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new O);const r=new O,s=new Ke,a=new Ke;function o(l){let h=0,f=0,u=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let d=0,_=0,g=0,m=0,p=0,T=0,S=0,v=0,P=0,b=0,w=0;l.sort(A0);for(let y=0,x=l.length;y<x;y++){const C=l[y],z=C.color,I=C.intensity,N=C.distance,X=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=z.r*I,f+=z.g*I,u+=z.b*I;else if(C.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(C.sh.coefficients[G],I);w++}else if(C.isDirectionalLight){const G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const K=C.shadow,k=n.get(C);k.shadowIntensity=K.intensity,k.shadowBias=K.bias,k.shadowNormalBias=K.normalBias,k.shadowRadius=K.radius,k.shadowMapSize=K.mapSize,i.directionalShadow[d]=k,i.directionalShadowMap[d]=X,i.directionalShadowMatrix[d]=C.shadow.matrix,T++}i.directional[d]=G,d++}else if(C.isSpotLight){const G=e.get(C);G.position.setFromMatrixPosition(C.matrixWorld),G.color.copy(z).multiplyScalar(I),G.distance=N,G.coneCos=Math.cos(C.angle),G.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),G.decay=C.decay,i.spot[g]=G;const K=C.shadow;if(C.map&&(i.spotLightMap[P]=C.map,P++,K.updateMatrices(C),C.castShadow&&b++),i.spotLightMatrix[g]=K.matrix,C.castShadow){const k=n.get(C);k.shadowIntensity=K.intensity,k.shadowBias=K.bias,k.shadowNormalBias=K.normalBias,k.shadowRadius=K.radius,k.shadowMapSize=K.mapSize,i.spotShadow[g]=k,i.spotShadowMap[g]=X,v++}g++}else if(C.isRectAreaLight){const G=e.get(C);G.color.copy(z).multiplyScalar(I),G.halfWidth.set(C.width*.5,0,0),G.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=G,m++}else if(C.isPointLight){const G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),G.distance=C.distance,G.decay=C.decay,C.castShadow){const K=C.shadow,k=n.get(C);k.shadowIntensity=K.intensity,k.shadowBias=K.bias,k.shadowNormalBias=K.normalBias,k.shadowRadius=K.radius,k.shadowMapSize=K.mapSize,k.shadowCameraNear=K.camera.near,k.shadowCameraFar=K.camera.far,i.pointShadow[_]=k,i.pointShadowMap[_]=X,i.pointShadowMatrix[_]=C.shadow.matrix,S++}i.point[_]=G,_++}else if(C.isHemisphereLight){const G=e.get(C);G.skyColor.copy(C.color).multiplyScalar(I),G.groundColor.copy(C.groundColor).multiplyScalar(I),i.hemi[p]=G,p++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ne.LTC_FLOAT_1,i.rectAreaLTC2=ne.LTC_FLOAT_2):(i.rectAreaLTC1=ne.LTC_HALF_1,i.rectAreaLTC2=ne.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const R=i.hash;(R.directionalLength!==d||R.pointLength!==_||R.spotLength!==g||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==T||R.numPointShadows!==S||R.numSpotShadows!==v||R.numSpotMaps!==P||R.numLightProbes!==w)&&(i.directional.length=d,i.spot.length=g,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=v+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=w,R.directionalLength=d,R.pointLength=_,R.spotLength=g,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=T,R.numPointShadows=S,R.numSpotShadows=v,R.numSpotMaps=P,R.numLightProbes=w,i.version=b0++)}function c(l,h){let f=0,u=0,d=0,_=0,g=0;const m=h.matrixWorldInverse;for(let p=0,T=l.length;p<T;p++){const S=l[p];if(S.isDirectionalLight){const v=i.directional[f];v.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),f++}else if(S.isSpotLight){const v=i.spot[d];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),d++}else if(S.isRectAreaLight){const v=i.rectArea[_];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(S.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){const v=i.point[u];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),u++}else if(S.isHemisphereLight){const v=i.hemi[g];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:i}}function $o(t){const e=new w0(t),n=[],i=[];function r(h){l.camera=h,n.length=0,i.length=0}function s(h){n.push(h)}function a(h){i.push(h)}function o(){e.setup(n)}function c(h){e.setupView(n,h)}const l={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function R0(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new $o(t),e.set(r,[o])):s>=a.length?(o=new $o(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class C0 extends Ri{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Ef,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class P0 extends Ri{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const D0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,L0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function I0(t,e,n){let i=new wa;const r=new we,s=new we,a=new st,o=new C0({depthPacking:Tf}),c=new P0,l={},h=n.maxTextureSize,f={[Pn]:Ct,[Ct]:Pn,[Kt]:Kt},u=new Yt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new we},radius:{value:4}},vertexShader:D0,fragmentShader:L0}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const _=new pt;_.setAttribute("position",new Bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new wt(_,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mc;let p=this.type;this.render=function(b,w,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const y=t.getRenderTarget(),x=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),z=t.state;z.setBlending(Rn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const I=p!==hn&&this.type===hn,N=p===hn&&this.type!==hn;for(let X=0,G=b.length;X<G;X++){const K=b[X],k=K.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);const te=k.getFrameExtents();if(r.multiply(te),s.copy(k.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/te.x),r.x=s.x*te.x,k.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/te.y),r.y=s.y*te.y,k.mapSize.y=s.y)),k.map===null||I===!0||N===!0){const ve=this.type!==hn?{minFilter:It,magFilter:It}:{};k.map!==null&&k.map.dispose(),k.map=new qn(r.x,r.y,ve),k.map.texture.name=K.name+".shadowMap",k.camera.updateProjectionMatrix()}t.setRenderTarget(k.map),t.clear();const le=k.getViewportCount();for(let ve=0;ve<le;ve++){const Le=k.getViewport(ve);a.set(s.x*Le.x,s.y*Le.y,s.x*Le.z,s.y*Le.w),z.viewport(a),k.updateMatrices(K,ve),i=k.getFrustum(),v(w,R,k.camera,K,this.type)}k.isPointLightShadow!==!0&&this.type===hn&&T(k,R),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,t.setRenderTarget(y,x,C)};function T(b,w){const R=e.update(g);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new qn(r.x,r.y)),u.uniforms.shadow_pass.value=b.map.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,t.setRenderTarget(b.mapPass),t.clear(),t.renderBufferDirect(w,null,R,u,g,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,t.setRenderTarget(b.map),t.clear(),t.renderBufferDirect(w,null,R,d,g,null)}function S(b,w,R,y){let x=null;const C=R.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)x=C;else if(x=R.isPointLight===!0?c:o,t.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const z=x.uuid,I=w.uuid;let N=l[z];N===void 0&&(N={},l[z]=N);let X=N[I];X===void 0&&(X=x.clone(),N[I]=X,w.addEventListener("dispose",P)),x=X}if(x.visible=w.visible,x.wireframe=w.wireframe,y===hn?x.side=w.shadowSide!==null?w.shadowSide:w.side:x.side=w.shadowSide!==null?w.shadowSide:f[w.side],x.alphaMap=w.alphaMap,x.alphaTest=w.alphaTest,x.map=w.map,x.clipShadows=w.clipShadows,x.clippingPlanes=w.clippingPlanes,x.clipIntersection=w.clipIntersection,x.displacementMap=w.displacementMap,x.displacementScale=w.displacementScale,x.displacementBias=w.displacementBias,x.wireframeLinewidth=w.wireframeLinewidth,x.linewidth=w.linewidth,R.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const z=t.properties.get(x);z.light=R}return x}function v(b,w,R,y,x){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&x===hn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld);const I=e.update(b),N=b.material;if(Array.isArray(N)){const X=I.groups;for(let G=0,K=X.length;G<K;G++){const k=X[G],te=N[k.materialIndex];if(te&&te.visible){const le=S(b,te,y,x);b.onBeforeShadow(t,b,w,R,I,le,k),t.renderBufferDirect(R,null,I,le,b,k),b.onAfterShadow(t,b,w,R,I,le,k)}}}else if(N.visible){const X=S(b,N,y,x);b.onBeforeShadow(t,b,w,R,I,X,null),t.renderBufferDirect(R,null,I,X,b,null),b.onAfterShadow(t,b,w,R,I,X,null)}}const z=b.children;for(let I=0,N=z.length;I<N;I++)v(z[I],w,R,y,x)}function P(b){b.target.removeEventListener("dispose",P);for(const R in l){const y=l[R],x=b.target.uuid;x in y&&(y[x].dispose(),delete y[x])}}}const U0={[Ps]:Ds,[Ls]:Ns,[Is]:Fs,[Mi]:Us,[Ds]:Ps,[Ns]:Ls,[Fs]:Is,[Us]:Mi};function N0(t,e){function n(){let D=!1;const re=new st;let W=null;const j=new st(0,0,0,0);return{setMask:function(ce){W!==ce&&!D&&(t.colorMask(ce,ce,ce,ce),W=ce)},setLocked:function(ce){D=ce},setClear:function(ce,ae,Ce,rt,mt){mt===!0&&(ce*=rt,ae*=rt,Ce*=rt),re.set(ce,ae,Ce,rt),j.equals(re)===!1&&(t.clearColor(ce,ae,Ce,rt),j.copy(re))},reset:function(){D=!1,W=null,j.set(-1,0,0,0)}}}function i(){let D=!1,re=!1,W=null,j=null,ce=null;return{setReversed:function(ae){if(re!==ae){const Ce=e.get("EXT_clip_control");re?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT);const rt=ce;ce=null,this.setClear(rt)}re=ae},getReversed:function(){return re},setTest:function(ae){ae?ie(t.DEPTH_TEST):Se(t.DEPTH_TEST)},setMask:function(ae){W!==ae&&!D&&(t.depthMask(ae),W=ae)},setFunc:function(ae){if(re&&(ae=U0[ae]),j!==ae){switch(ae){case Ps:t.depthFunc(t.NEVER);break;case Ds:t.depthFunc(t.ALWAYS);break;case Ls:t.depthFunc(t.LESS);break;case Mi:t.depthFunc(t.LEQUAL);break;case Is:t.depthFunc(t.EQUAL);break;case Us:t.depthFunc(t.GEQUAL);break;case Ns:t.depthFunc(t.GREATER);break;case Fs:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}j=ae}},setLocked:function(ae){D=ae},setClear:function(ae){ce!==ae&&(re&&(ae=1-ae),t.clearDepth(ae),ce=ae)},reset:function(){D=!1,W=null,j=null,ce=null,re=!1}}}function r(){let D=!1,re=null,W=null,j=null,ce=null,ae=null,Ce=null,rt=null,mt=null;return{setTest:function(Ye){D||(Ye?ie(t.STENCIL_TEST):Se(t.STENCIL_TEST))},setMask:function(Ye){re!==Ye&&!D&&(t.stencilMask(Ye),re=Ye)},setFunc:function(Ye,Ht,tn){(W!==Ye||j!==Ht||ce!==tn)&&(t.stencilFunc(Ye,Ht,tn),W=Ye,j=Ht,ce=tn)},setOp:function(Ye,Ht,tn){(ae!==Ye||Ce!==Ht||rt!==tn)&&(t.stencilOp(Ye,Ht,tn),ae=Ye,Ce=Ht,rt=tn)},setLocked:function(Ye){D=Ye},setClear:function(Ye){mt!==Ye&&(t.clearStencil(Ye),mt=Ye)},reset:function(){D=!1,re=null,W=null,j=null,ce=null,ae=null,Ce=null,rt=null,mt=null}}}const s=new n,a=new i,o=new r,c=new WeakMap,l=new WeakMap;let h={},f={},u=new WeakMap,d=[],_=null,g=!1,m=null,p=null,T=null,S=null,v=null,P=null,b=null,w=new Oe(0,0,0),R=0,y=!1,x=null,C=null,z=null,I=null,N=null;const X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,K=0;const k=t.getParameter(t.VERSION);k.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(k)[1]),G=K>=1):k.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),G=K>=2);let te=null,le={};const ve=t.getParameter(t.SCISSOR_BOX),Le=t.getParameter(t.VIEWPORT),Xe=new st().fromArray(ve),q=new st().fromArray(Le);function Q(D,re,W,j){const ce=new Uint8Array(4),ae=t.createTexture();t.bindTexture(D,ae),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ce=0;Ce<W;Ce++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(re,0,t.RGBA,1,1,j,0,t.RGBA,t.UNSIGNED_BYTE,ce):t.texImage2D(re+Ce,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ce);return ae}const he={};he[t.TEXTURE_2D]=Q(t.TEXTURE_2D,t.TEXTURE_2D,1),he[t.TEXTURE_CUBE_MAP]=Q(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[t.TEXTURE_2D_ARRAY]=Q(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),he[t.TEXTURE_3D]=Q(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(t.DEPTH_TEST),a.setFunc(Mi),ze(!1),Be(Za),ie(t.CULL_FACE),F(Rn);function ie(D){h[D]!==!0&&(t.enable(D),h[D]=!0)}function Se(D){h[D]!==!1&&(t.disable(D),h[D]=!1)}function Re(D,re){return f[D]!==re?(t.bindFramebuffer(D,re),f[D]=re,D===t.DRAW_FRAMEBUFFER&&(f[t.FRAMEBUFFER]=re),D===t.FRAMEBUFFER&&(f[t.DRAW_FRAMEBUFFER]=re),!0):!1}function Fe(D,re){let W=d,j=!1;if(D){W=u.get(re),W===void 0&&(W=[],u.set(re,W));const ce=D.textures;if(W.length!==ce.length||W[0]!==t.COLOR_ATTACHMENT0){for(let ae=0,Ce=ce.length;ae<Ce;ae++)W[ae]=t.COLOR_ATTACHMENT0+ae;W.length=ce.length,j=!0}}else W[0]!==t.BACK&&(W[0]=t.BACK,j=!0);j&&t.drawBuffers(W)}function it(D){return _!==D?(t.useProgram(D),_=D,!0):!1}const Ve={[Vn]:t.FUNC_ADD,[jh]:t.FUNC_SUBTRACT,[Zh]:t.FUNC_REVERSE_SUBTRACT};Ve[Kh]=t.MIN,Ve[Jh]=t.MAX;const at={[Qh]:t.ZERO,[ef]:t.ONE,[tf]:t.SRC_COLOR,[Rs]:t.SRC_ALPHA,[cf]:t.SRC_ALPHA_SATURATE,[af]:t.DST_COLOR,[rf]:t.DST_ALPHA,[nf]:t.ONE_MINUS_SRC_COLOR,[Cs]:t.ONE_MINUS_SRC_ALPHA,[of]:t.ONE_MINUS_DST_COLOR,[sf]:t.ONE_MINUS_DST_ALPHA,[lf]:t.CONSTANT_COLOR,[hf]:t.ONE_MINUS_CONSTANT_COLOR,[ff]:t.CONSTANT_ALPHA,[df]:t.ONE_MINUS_CONSTANT_ALPHA};function F(D,re,W,j,ce,ae,Ce,rt,mt,Ye){if(D===Rn){g===!0&&(Se(t.BLEND),g=!1);return}if(g===!1&&(ie(t.BLEND),g=!0),D!==Yh){if(D!==m||Ye!==y){if((p!==Vn||v!==Vn)&&(t.blendEquation(t.FUNC_ADD),p=Vn,v=Vn),Ye)switch(D){case gi:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Ka:t.blendFunc(t.ONE,t.ONE);break;case Ja:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Qa:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case gi:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Ka:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Ja:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Qa:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}T=null,S=null,P=null,b=null,w.set(0,0,0),R=0,m=D,y=Ye}return}ce=ce||re,ae=ae||W,Ce=Ce||j,(re!==p||ce!==v)&&(t.blendEquationSeparate(Ve[re],Ve[ce]),p=re,v=ce),(W!==T||j!==S||ae!==P||Ce!==b)&&(t.blendFuncSeparate(at[W],at[j],at[ae],at[Ce]),T=W,S=j,P=ae,b=Ce),(rt.equals(w)===!1||mt!==R)&&(t.blendColor(rt.r,rt.g,rt.b,mt),w.copy(rt),R=mt),m=D,y=!1}function Ut(D,re){D.side===Kt?Se(t.CULL_FACE):ie(t.CULL_FACE);let W=D.side===Ct;re&&(W=!W),ze(W),D.blending===gi&&D.transparent===!1?F(Rn):F(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const j=D.stencilWrite;o.setTest(j),j&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),et(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):Se(t.SAMPLE_ALPHA_TO_COVERAGE)}function ze(D){x!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),x=D)}function Be(D){D!==Xh?(ie(t.CULL_FACE),D!==C&&(D===Za?t.cullFace(t.BACK):D===qh?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Se(t.CULL_FACE),C=D}function Ee(D){D!==z&&(G&&t.lineWidth(D),z=D)}function et(D,re,W){D?(ie(t.POLYGON_OFFSET_FILL),(I!==re||N!==W)&&(t.polygonOffset(re,W),I=re,N=W)):Se(t.POLYGON_OFFSET_FILL)}function ye(D){D?ie(t.SCISSOR_TEST):Se(t.SCISSOR_TEST)}function A(D){D===void 0&&(D=t.TEXTURE0+X-1),te!==D&&(t.activeTexture(D),te=D)}function M(D,re,W){W===void 0&&(te===null?W=t.TEXTURE0+X-1:W=te);let j=le[W];j===void 0&&(j={type:void 0,texture:void 0},le[W]=j),(j.type!==D||j.texture!==re)&&(te!==W&&(t.activeTexture(W),te=W),t.bindTexture(D,re||he[D]),j.type=D,j.texture=re)}function B(){const D=le[te];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Y(){try{t.compressedTexImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{t.compressedTexImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{t.texSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{t.texSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function fe(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ke(){try{t.texStorage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{t.texStorage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function de(){try{t.texImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Te(){try{t.texImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function be(D){Xe.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),Xe.copy(D))}function ue(D){q.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),q.copy(D))}function He(D,re){let W=l.get(re);W===void 0&&(W=new WeakMap,l.set(re,W));let j=W.get(D);j===void 0&&(j=t.getUniformBlockIndex(re,D.name),W.set(D,j))}function Ie(D,re){const j=l.get(re).get(D);c.get(re)!==j&&(t.uniformBlockBinding(re,j,D.__bindingPointIndex),c.set(re,j))}function Je(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},te=null,le={},f={},u=new WeakMap,d=[],_=null,g=!1,m=null,p=null,T=null,S=null,v=null,P=null,b=null,w=new Oe(0,0,0),R=0,y=!1,x=null,C=null,z=null,I=null,N=null,Xe.set(0,0,t.canvas.width,t.canvas.height),q.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ie,disable:Se,bindFramebuffer:Re,drawBuffers:Fe,useProgram:it,setBlending:F,setMaterial:Ut,setFlipSided:ze,setCullFace:Be,setLineWidth:Ee,setPolygonOffset:et,setScissorTest:ye,activeTexture:A,bindTexture:M,unbindTexture:B,compressedTexImage2D:Y,compressedTexImage3D:Z,texImage2D:de,texImage3D:Te,updateUBOMapping:He,uniformBlockBinding:Ie,texStorage2D:ke,texStorage3D:J,texSubImage2D:$,texSubImage3D:xe,compressedTexSubImage2D:se,compressedTexSubImage3D:fe,scissor:be,viewport:ue,reset:Je}}function Yo(t,e,n,i){const r=F0(i);switch(n){case yc:return t*e;case Ec:return t*e;case Tc:return t*e*2;case Ea:return t*e/r.components*r.byteLength;case Ta:return t*e/r.components*r.byteLength;case bc:return t*e*2/r.components*r.byteLength;case ba:return t*e*2/r.components*r.byteLength;case Sc:return t*e*3/r.components*r.byteLength;case qt:return t*e*4/r.components*r.byteLength;case Aa:return t*e*4/r.components*r.byteLength;case Tr:case br:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Ar:case wr:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case ks:case Ws:return Math.max(t,16)*Math.max(e,8)/4;case Vs:case Gs:return Math.max(t,8)*Math.max(e,8)/2;case Xs:case qs:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case $s:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ys:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case js:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Zs:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Ks:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Js:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Qs:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case ea:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case ta:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case na:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case ia:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case ra:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case sa:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case aa:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case oa:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Rr:case ca:case la:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Ac:case ha:return Math.ceil(t/4)*Math.ceil(e/4)*8;case fa:case da:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function F0(t){switch(t){case un:case vc:return{byteLength:1,components:1};case Wi:case xc:case $i:return{byteLength:2,components:1};case ya:case Sa:return{byteLength:2,components:4};case Xn:case Ma:case Qt:return{byteLength:4,components:1};case Mc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function O0(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new we,h=new WeakMap;let f;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,M){return d?new OffscreenCanvas(A,M):Xi("canvas")}function g(A,M,B){let Y=1;const Z=ye(A);if((Z.width>B||Z.height>B)&&(Y=B/Math.max(Z.width,Z.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const $=Math.floor(Y*Z.width),xe=Math.floor(Y*Z.height);f===void 0&&(f=_($,xe));const se=M?_($,xe):f;return se.width=$,se.height=xe,se.getContext("2d").drawImage(A,0,0,$,xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+$+"x"+xe+")."),se}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){t.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?t.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function S(A,M,B,Y,Z=!1){if(A!==null){if(t[A]!==void 0)return t[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let $=M;if(M===t.RED&&(B===t.FLOAT&&($=t.R32F),B===t.HALF_FLOAT&&($=t.R16F),B===t.UNSIGNED_BYTE&&($=t.R8)),M===t.RED_INTEGER&&(B===t.UNSIGNED_BYTE&&($=t.R8UI),B===t.UNSIGNED_SHORT&&($=t.R16UI),B===t.UNSIGNED_INT&&($=t.R32UI),B===t.BYTE&&($=t.R8I),B===t.SHORT&&($=t.R16I),B===t.INT&&($=t.R32I)),M===t.RG&&(B===t.FLOAT&&($=t.RG32F),B===t.HALF_FLOAT&&($=t.RG16F),B===t.UNSIGNED_BYTE&&($=t.RG8)),M===t.RG_INTEGER&&(B===t.UNSIGNED_BYTE&&($=t.RG8UI),B===t.UNSIGNED_SHORT&&($=t.RG16UI),B===t.UNSIGNED_INT&&($=t.RG32UI),B===t.BYTE&&($=t.RG8I),B===t.SHORT&&($=t.RG16I),B===t.INT&&($=t.RG32I)),M===t.RGB_INTEGER&&(B===t.UNSIGNED_BYTE&&($=t.RGB8UI),B===t.UNSIGNED_SHORT&&($=t.RGB16UI),B===t.UNSIGNED_INT&&($=t.RGB32UI),B===t.BYTE&&($=t.RGB8I),B===t.SHORT&&($=t.RGB16I),B===t.INT&&($=t.RGB32I)),M===t.RGBA_INTEGER&&(B===t.UNSIGNED_BYTE&&($=t.RGBA8UI),B===t.UNSIGNED_SHORT&&($=t.RGBA16UI),B===t.UNSIGNED_INT&&($=t.RGBA32UI),B===t.BYTE&&($=t.RGBA8I),B===t.SHORT&&($=t.RGBA16I),B===t.INT&&($=t.RGBA32I)),M===t.RGB&&B===t.UNSIGNED_INT_5_9_9_9_REV&&($=t.RGB9_E5),M===t.RGBA){const xe=Z?Vr:Ge.getTransfer(Y);B===t.FLOAT&&($=t.RGBA32F),B===t.HALF_FLOAT&&($=t.RGBA16F),B===t.UNSIGNED_BYTE&&($=xe===je?t.SRGB8_ALPHA8:t.RGBA8),B===t.UNSIGNED_SHORT_4_4_4_4&&($=t.RGBA4),B===t.UNSIGNED_SHORT_5_5_5_1&&($=t.RGB5_A1)}return($===t.R16F||$===t.R32F||$===t.RG16F||$===t.RG32F||$===t.RGBA16F||$===t.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(A,M){let B;return A?M===null||M===Xn||M===Ei?B=t.DEPTH24_STENCIL8:M===Qt?B=t.DEPTH32F_STENCIL8:M===Wi&&(B=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Xn||M===Ei?B=t.DEPTH_COMPONENT24:M===Qt?B=t.DEPTH_COMPONENT32F:M===Wi&&(B=t.DEPTH_COMPONENT16),B}function P(A,M){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==It&&A.minFilter!==Jt?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function b(A){const M=A.target;M.removeEventListener("dispose",b),R(M),M.isVideoTexture&&h.delete(M)}function w(A){const M=A.target;M.removeEventListener("dispose",w),x(M)}function R(A){const M=i.get(A);if(M.__webglInit===void 0)return;const B=A.source,Y=u.get(B);if(Y){const Z=Y[M.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&y(A),Object.keys(Y).length===0&&u.delete(B)}i.remove(A)}function y(A){const M=i.get(A);t.deleteTexture(M.__webglTexture);const B=A.source,Y=u.get(B);delete Y[M.__cacheKey],a.memory.textures--}function x(A){const M=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(M.__webglFramebuffer[Y]))for(let Z=0;Z<M.__webglFramebuffer[Y].length;Z++)t.deleteFramebuffer(M.__webglFramebuffer[Y][Z]);else t.deleteFramebuffer(M.__webglFramebuffer[Y]);M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer[Y])}else{if(Array.isArray(M.__webglFramebuffer))for(let Y=0;Y<M.__webglFramebuffer.length;Y++)t.deleteFramebuffer(M.__webglFramebuffer[Y]);else t.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&t.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Y=0;Y<M.__webglColorRenderbuffer.length;Y++)M.__webglColorRenderbuffer[Y]&&t.deleteRenderbuffer(M.__webglColorRenderbuffer[Y]);M.__webglDepthRenderbuffer&&t.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const B=A.textures;for(let Y=0,Z=B.length;Y<Z;Y++){const $=i.get(B[Y]);$.__webglTexture&&(t.deleteTexture($.__webglTexture),a.memory.textures--),i.remove(B[Y])}i.remove(A)}let C=0;function z(){C=0}function I(){const A=C;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),C+=1,A}function N(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function X(A,M){const B=i.get(A);if(A.isVideoTexture&&Ee(A),A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){const Y=A.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(B,A,M);return}}n.bindTexture(t.TEXTURE_2D,B.__webglTexture,t.TEXTURE0+M)}function G(A,M){const B=i.get(A);if(A.version>0&&B.__version!==A.version){q(B,A,M);return}n.bindTexture(t.TEXTURE_2D_ARRAY,B.__webglTexture,t.TEXTURE0+M)}function K(A,M){const B=i.get(A);if(A.version>0&&B.__version!==A.version){q(B,A,M);return}n.bindTexture(t.TEXTURE_3D,B.__webglTexture,t.TEXTURE0+M)}function k(A,M){const B=i.get(A);if(A.version>0&&B.__version!==A.version){Q(B,A,M);return}n.bindTexture(t.TEXTURE_CUBE_MAP,B.__webglTexture,t.TEXTURE0+M)}const te={[Bs]:t.REPEAT,[Gn]:t.CLAMP_TO_EDGE,[Hs]:t.MIRRORED_REPEAT},le={[It]:t.NEAREST,[Sf]:t.NEAREST_MIPMAP_NEAREST,[Ki]:t.NEAREST_MIPMAP_LINEAR,[Jt]:t.LINEAR,[jr]:t.LINEAR_MIPMAP_NEAREST,[Wn]:t.LINEAR_MIPMAP_LINEAR},ve={[wf]:t.NEVER,[If]:t.ALWAYS,[Rf]:t.LESS,[wc]:t.LEQUAL,[Cf]:t.EQUAL,[Lf]:t.GEQUAL,[Pf]:t.GREATER,[Df]:t.NOTEQUAL};function Le(A,M){if(M.type===Qt&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Jt||M.magFilter===jr||M.magFilter===Ki||M.magFilter===Wn||M.minFilter===Jt||M.minFilter===jr||M.minFilter===Ki||M.minFilter===Wn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(A,t.TEXTURE_WRAP_S,te[M.wrapS]),t.texParameteri(A,t.TEXTURE_WRAP_T,te[M.wrapT]),(A===t.TEXTURE_3D||A===t.TEXTURE_2D_ARRAY)&&t.texParameteri(A,t.TEXTURE_WRAP_R,te[M.wrapR]),t.texParameteri(A,t.TEXTURE_MAG_FILTER,le[M.magFilter]),t.texParameteri(A,t.TEXTURE_MIN_FILTER,le[M.minFilter]),M.compareFunction&&(t.texParameteri(A,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(A,t.TEXTURE_COMPARE_FUNC,ve[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===It||M.minFilter!==Ki&&M.minFilter!==Wn||M.type===Qt&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");t.texParameterf(A,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Xe(A,M){let B=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",b));const Y=M.source;let Z=u.get(Y);Z===void 0&&(Z={},u.set(Y,Z));const $=N(M);if($!==A.__cacheKey){Z[$]===void 0&&(Z[$]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,B=!0),Z[$].usedTimes++;const xe=Z[A.__cacheKey];xe!==void 0&&(Z[A.__cacheKey].usedTimes--,xe.usedTimes===0&&y(M)),A.__cacheKey=$,A.__webglTexture=Z[$].texture}return B}function q(A,M,B){let Y=t.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Y=t.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Y=t.TEXTURE_3D);const Z=Xe(A,M),$=M.source;n.bindTexture(Y,A.__webglTexture,t.TEXTURE0+B);const xe=i.get($);if($.version!==xe.__version||Z===!0){n.activeTexture(t.TEXTURE0+B);const se=Ge.getPrimaries(Ge.workingColorSpace),fe=M.colorSpace===wn?null:Ge.getPrimaries(M.colorSpace),ke=M.colorSpace===wn||se===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let J=g(M.image,!1,r.maxTextureSize);J=et(M,J);const de=s.convert(M.format,M.colorSpace),Te=s.convert(M.type);let be=S(M.internalFormat,de,Te,M.colorSpace,M.isVideoTexture);Le(Y,M);let ue;const He=M.mipmaps,Ie=M.isVideoTexture!==!0,Je=xe.__version===void 0||Z===!0,D=$.dataReady,re=P(M,J);if(M.isDepthTexture)be=v(M.format===Ti,M.type),Je&&(Ie?n.texStorage2D(t.TEXTURE_2D,1,be,J.width,J.height):n.texImage2D(t.TEXTURE_2D,0,be,J.width,J.height,0,de,Te,null));else if(M.isDataTexture)if(He.length>0){Ie&&Je&&n.texStorage2D(t.TEXTURE_2D,re,be,He[0].width,He[0].height);for(let W=0,j=He.length;W<j;W++)ue=He[W],Ie?D&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,ue.width,ue.height,de,Te,ue.data):n.texImage2D(t.TEXTURE_2D,W,be,ue.width,ue.height,0,de,Te,ue.data);M.generateMipmaps=!1}else Ie?(Je&&n.texStorage2D(t.TEXTURE_2D,re,be,J.width,J.height),D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,J.width,J.height,de,Te,J.data)):n.texImage2D(t.TEXTURE_2D,0,be,J.width,J.height,0,de,Te,J.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ie&&Je&&n.texStorage3D(t.TEXTURE_2D_ARRAY,re,be,He[0].width,He[0].height,J.depth);for(let W=0,j=He.length;W<j;W++)if(ue=He[W],M.format!==qt)if(de!==null)if(Ie){if(D)if(M.layerUpdates.size>0){const ce=Yo(ue.width,ue.height,M.format,M.type);for(const ae of M.layerUpdates){const Ce=ue.data.subarray(ae*ce/ue.data.BYTES_PER_ELEMENT,(ae+1)*ce/ue.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,ae,ue.width,ue.height,1,de,Ce)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,ue.width,ue.height,J.depth,de,ue.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,W,be,ue.width,ue.height,J.depth,0,ue.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,ue.width,ue.height,J.depth,de,Te,ue.data):n.texImage3D(t.TEXTURE_2D_ARRAY,W,be,ue.width,ue.height,J.depth,0,de,Te,ue.data)}else{Ie&&Je&&n.texStorage2D(t.TEXTURE_2D,re,be,He[0].width,He[0].height);for(let W=0,j=He.length;W<j;W++)ue=He[W],M.format!==qt?de!==null?Ie?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,W,0,0,ue.width,ue.height,de,ue.data):n.compressedTexImage2D(t.TEXTURE_2D,W,be,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?D&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,ue.width,ue.height,de,Te,ue.data):n.texImage2D(t.TEXTURE_2D,W,be,ue.width,ue.height,0,de,Te,ue.data)}else if(M.isDataArrayTexture)if(Ie){if(Je&&n.texStorage3D(t.TEXTURE_2D_ARRAY,re,be,J.width,J.height,J.depth),D)if(M.layerUpdates.size>0){const W=Yo(J.width,J.height,M.format,M.type);for(const j of M.layerUpdates){const ce=J.data.subarray(j*W/J.data.BYTES_PER_ELEMENT,(j+1)*W/J.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,j,J.width,J.height,1,de,Te,ce)}M.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,de,Te,J.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,be,J.width,J.height,J.depth,0,de,Te,J.data);else if(M.isData3DTexture)Ie?(Je&&n.texStorage3D(t.TEXTURE_3D,re,be,J.width,J.height,J.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,de,Te,J.data)):n.texImage3D(t.TEXTURE_3D,0,be,J.width,J.height,J.depth,0,de,Te,J.data);else if(M.isFramebufferTexture){if(Je)if(Ie)n.texStorage2D(t.TEXTURE_2D,re,be,J.width,J.height);else{let W=J.width,j=J.height;for(let ce=0;ce<re;ce++)n.texImage2D(t.TEXTURE_2D,ce,be,W,j,0,de,Te,null),W>>=1,j>>=1}}else if(He.length>0){if(Ie&&Je){const W=ye(He[0]);n.texStorage2D(t.TEXTURE_2D,re,be,W.width,W.height)}for(let W=0,j=He.length;W<j;W++)ue=He[W],Ie?D&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,de,Te,ue):n.texImage2D(t.TEXTURE_2D,W,be,de,Te,ue);M.generateMipmaps=!1}else if(Ie){if(Je){const W=ye(J);n.texStorage2D(t.TEXTURE_2D,re,be,W.width,W.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,de,Te,J)}else n.texImage2D(t.TEXTURE_2D,0,be,de,Te,J);m(M)&&p(Y),xe.__version=$.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Q(A,M,B){if(M.image.length!==6)return;const Y=Xe(A,M),Z=M.source;n.bindTexture(t.TEXTURE_CUBE_MAP,A.__webglTexture,t.TEXTURE0+B);const $=i.get(Z);if(Z.version!==$.__version||Y===!0){n.activeTexture(t.TEXTURE0+B);const xe=Ge.getPrimaries(Ge.workingColorSpace),se=M.colorSpace===wn?null:Ge.getPrimaries(M.colorSpace),fe=M.colorSpace===wn||xe===se?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const ke=M.isCompressedTexture||M.image[0].isCompressedTexture,J=M.image[0]&&M.image[0].isDataTexture,de=[];for(let j=0;j<6;j++)!ke&&!J?de[j]=g(M.image[j],!0,r.maxCubemapSize):de[j]=J?M.image[j].image:M.image[j],de[j]=et(M,de[j]);const Te=de[0],be=s.convert(M.format,M.colorSpace),ue=s.convert(M.type),He=S(M.internalFormat,be,ue,M.colorSpace),Ie=M.isVideoTexture!==!0,Je=$.__version===void 0||Y===!0,D=Z.dataReady;let re=P(M,Te);Le(t.TEXTURE_CUBE_MAP,M);let W;if(ke){Ie&&Je&&n.texStorage2D(t.TEXTURE_CUBE_MAP,re,He,Te.width,Te.height);for(let j=0;j<6;j++){W=de[j].mipmaps;for(let ce=0;ce<W.length;ce++){const ae=W[ce];M.format!==qt?be!==null?Ie?D&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,0,0,ae.width,ae.height,be,ae.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,He,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,0,0,ae.width,ae.height,be,ue,ae.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,He,ae.width,ae.height,0,be,ue,ae.data)}}}else{if(W=M.mipmaps,Ie&&Je){W.length>0&&re++;const j=ye(de[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,re,He,j.width,j.height)}for(let j=0;j<6;j++)if(J){Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,de[j].width,de[j].height,be,ue,de[j].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,He,de[j].width,de[j].height,0,be,ue,de[j].data);for(let ce=0;ce<W.length;ce++){const Ce=W[ce].image[j].image;Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,0,0,Ce.width,Ce.height,be,ue,Ce.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,He,Ce.width,Ce.height,0,be,ue,Ce.data)}}else{Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,be,ue,de[j]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,He,be,ue,de[j]);for(let ce=0;ce<W.length;ce++){const ae=W[ce];Ie?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,0,0,be,ue,ae.image[j]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,He,be,ue,ae.image[j])}}}m(M)&&p(t.TEXTURE_CUBE_MAP),$.__version=Z.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function he(A,M,B,Y,Z,$){const xe=s.convert(B.format,B.colorSpace),se=s.convert(B.type),fe=S(B.internalFormat,xe,se,B.colorSpace),ke=i.get(M),J=i.get(B);if(J.__renderTarget=M,!ke.__hasExternalTextures){const de=Math.max(1,M.width>>$),Te=Math.max(1,M.height>>$);Z===t.TEXTURE_3D||Z===t.TEXTURE_2D_ARRAY?n.texImage3D(Z,$,fe,de,Te,M.depth,0,xe,se,null):n.texImage2D(Z,$,fe,de,Te,0,xe,se,null)}n.bindFramebuffer(t.FRAMEBUFFER,A),Be(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Y,Z,J.__webglTexture,0,ze(M)):(Z===t.TEXTURE_2D||Z>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Y,Z,J.__webglTexture,$),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ie(A,M,B){if(t.bindRenderbuffer(t.RENDERBUFFER,A),M.depthBuffer){const Y=M.depthTexture,Z=Y&&Y.isDepthTexture?Y.type:null,$=v(M.stencilBuffer,Z),xe=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=ze(M);Be(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,se,$,M.width,M.height):B?t.renderbufferStorageMultisample(t.RENDERBUFFER,se,$,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,$,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,xe,t.RENDERBUFFER,A)}else{const Y=M.textures;for(let Z=0;Z<Y.length;Z++){const $=Y[Z],xe=s.convert($.format,$.colorSpace),se=s.convert($.type),fe=S($.internalFormat,xe,se,$.colorSpace),ke=ze(M);B&&Be(M)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,ke,fe,M.width,M.height):Be(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ke,fe,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,fe,M.width,M.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Se(A,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=i.get(M.depthTexture);Y.__renderTarget=M,(!Y.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X(M.depthTexture,0);const Z=Y.__webglTexture,$=ze(M);if(M.depthTexture.format===vi)Be(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Z,0,$):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Z,0);else if(M.depthTexture.format===Ti)Be(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Z,0,$):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Re(A){const M=i.get(A),B=A.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==A.depthTexture){const Y=A.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Y){const Z=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Y.removeEventListener("dispose",Z)};Y.addEventListener("dispose",Z),M.__depthDisposeCallback=Z}M.__boundDepthTexture=Y}if(A.depthTexture&&!M.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Se(M.__webglFramebuffer,A)}else if(B){M.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[Y]),M.__webglDepthbuffer[Y]===void 0)M.__webglDepthbuffer[Y]=t.createRenderbuffer(),ie(M.__webglDepthbuffer[Y],A,!1);else{const Z=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,$=M.__webglDepthbuffer[Y];t.bindRenderbuffer(t.RENDERBUFFER,$),t.framebufferRenderbuffer(t.FRAMEBUFFER,Z,t.RENDERBUFFER,$)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=t.createRenderbuffer(),ie(M.__webglDepthbuffer,A,!1);else{const Y=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=M.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,Y,t.RENDERBUFFER,Z)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Fe(A,M,B){const Y=i.get(A);M!==void 0&&he(Y.__webglFramebuffer,A,A.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),B!==void 0&&Re(A)}function it(A){const M=A.texture,B=i.get(A),Y=i.get(M);A.addEventListener("dispose",w);const Z=A.textures,$=A.isWebGLCubeRenderTarget===!0,xe=Z.length>1;if(xe||(Y.__webglTexture===void 0&&(Y.__webglTexture=t.createTexture()),Y.__version=M.version,a.memory.textures++),$){B.__webglFramebuffer=[];for(let se=0;se<6;se++)if(M.mipmaps&&M.mipmaps.length>0){B.__webglFramebuffer[se]=[];for(let fe=0;fe<M.mipmaps.length;fe++)B.__webglFramebuffer[se][fe]=t.createFramebuffer()}else B.__webglFramebuffer[se]=t.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){B.__webglFramebuffer=[];for(let se=0;se<M.mipmaps.length;se++)B.__webglFramebuffer[se]=t.createFramebuffer()}else B.__webglFramebuffer=t.createFramebuffer();if(xe)for(let se=0,fe=Z.length;se<fe;se++){const ke=i.get(Z[se]);ke.__webglTexture===void 0&&(ke.__webglTexture=t.createTexture(),a.memory.textures++)}if(A.samples>0&&Be(A)===!1){B.__webglMultisampledFramebuffer=t.createFramebuffer(),B.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let se=0;se<Z.length;se++){const fe=Z[se];B.__webglColorRenderbuffer[se]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,B.__webglColorRenderbuffer[se]);const ke=s.convert(fe.format,fe.colorSpace),J=s.convert(fe.type),de=S(fe.internalFormat,ke,J,fe.colorSpace,A.isXRRenderTarget===!0),Te=ze(A);t.renderbufferStorageMultisample(t.RENDERBUFFER,Te,de,A.width,A.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+se,t.RENDERBUFFER,B.__webglColorRenderbuffer[se])}t.bindRenderbuffer(t.RENDERBUFFER,null),A.depthBuffer&&(B.__webglDepthRenderbuffer=t.createRenderbuffer(),ie(B.__webglDepthRenderbuffer,A,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if($){n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),Le(t.TEXTURE_CUBE_MAP,M);for(let se=0;se<6;se++)if(M.mipmaps&&M.mipmaps.length>0)for(let fe=0;fe<M.mipmaps.length;fe++)he(B.__webglFramebuffer[se][fe],A,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+se,fe);else he(B.__webglFramebuffer[se],A,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);m(M)&&p(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(xe){for(let se=0,fe=Z.length;se<fe;se++){const ke=Z[se],J=i.get(ke);n.bindTexture(t.TEXTURE_2D,J.__webglTexture),Le(t.TEXTURE_2D,ke),he(B.__webglFramebuffer,A,ke,t.COLOR_ATTACHMENT0+se,t.TEXTURE_2D,0),m(ke)&&p(t.TEXTURE_2D)}n.unbindTexture()}else{let se=t.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(se=A.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(se,Y.__webglTexture),Le(se,M),M.mipmaps&&M.mipmaps.length>0)for(let fe=0;fe<M.mipmaps.length;fe++)he(B.__webglFramebuffer[fe],A,M,t.COLOR_ATTACHMENT0,se,fe);else he(B.__webglFramebuffer,A,M,t.COLOR_ATTACHMENT0,se,0);m(M)&&p(se),n.unbindTexture()}A.depthBuffer&&Re(A)}function Ve(A){const M=A.textures;for(let B=0,Y=M.length;B<Y;B++){const Z=M[B];if(m(Z)){const $=T(A),xe=i.get(Z).__webglTexture;n.bindTexture($,xe),p($),n.unbindTexture()}}}const at=[],F=[];function Ut(A){if(A.samples>0){if(Be(A)===!1){const M=A.textures,B=A.width,Y=A.height;let Z=t.COLOR_BUFFER_BIT;const $=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,xe=i.get(A),se=M.length>1;if(se)for(let fe=0;fe<M.length;fe++)n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,xe.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,xe.__webglFramebuffer);for(let fe=0;fe<M.length;fe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Z|=t.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Z|=t.STENCIL_BUFFER_BIT)),se){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,xe.__webglColorRenderbuffer[fe]);const ke=i.get(M[fe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,ke,0)}t.blitFramebuffer(0,0,B,Y,0,0,B,Y,Z,t.NEAREST),c===!0&&(at.length=0,F.length=0,at.push(t.COLOR_ATTACHMENT0+fe),A.depthBuffer&&A.resolveDepthBuffer===!1&&(at.push($),F.push($),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,F)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,at))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),se)for(let fe=0;fe<M.length;fe++){n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,xe.__webglColorRenderbuffer[fe]);const ke=i.get(M[fe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,ke,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,xe.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const M=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[M])}}}function ze(A){return Math.min(r.maxSamples,A.samples)}function Be(A){const M=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Ee(A){const M=a.render.frame;h.get(A)!==M&&(h.set(A,M),A.update())}function et(A,M){const B=A.colorSpace,Y=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||B!==wi&&B!==wn&&(Ge.getTransfer(B)===je?(Y!==qt||Z!==un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),M}function ye(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=z,this.setTexture2D=X,this.setTexture2DArray=G,this.setTexture3D=K,this.setTextureCube=k,this.rebindTextures=Fe,this.setupRenderTarget=it,this.updateRenderTargetMipmap=Ve,this.updateMultisampleRenderTarget=Ut,this.setupDepthRenderbuffer=Re,this.setupFrameBufferTexture=he,this.useMultisampledRTT=Be}function z0(t,e){function n(i,r=wn){let s;const a=Ge.getTransfer(r);if(i===un)return t.UNSIGNED_BYTE;if(i===ya)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Sa)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Mc)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===vc)return t.BYTE;if(i===xc)return t.SHORT;if(i===Wi)return t.UNSIGNED_SHORT;if(i===Ma)return t.INT;if(i===Xn)return t.UNSIGNED_INT;if(i===Qt)return t.FLOAT;if(i===$i)return t.HALF_FLOAT;if(i===yc)return t.ALPHA;if(i===Sc)return t.RGB;if(i===qt)return t.RGBA;if(i===Ec)return t.LUMINANCE;if(i===Tc)return t.LUMINANCE_ALPHA;if(i===vi)return t.DEPTH_COMPONENT;if(i===Ti)return t.DEPTH_STENCIL;if(i===Ea)return t.RED;if(i===Ta)return t.RED_INTEGER;if(i===bc)return t.RG;if(i===ba)return t.RG_INTEGER;if(i===Aa)return t.RGBA_INTEGER;if(i===Tr||i===br||i===Ar||i===wr)if(a===je)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Tr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===br)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ar)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===wr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Tr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===br)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ar)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===wr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Vs||i===ks||i===Gs||i===Ws)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Vs)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ks)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Gs)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ws)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Xs||i===qs||i===$s)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Xs||i===qs)return a===je?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===$s)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ys||i===js||i===Zs||i===Ks||i===Js||i===Qs||i===ea||i===ta||i===na||i===ia||i===ra||i===sa||i===aa||i===oa)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ys)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===js)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Zs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ks)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Js)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qs)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ea)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ta)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===na)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ia)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ra)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sa)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===aa)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===oa)return a===je?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rr||i===ca||i===la)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Rr)return a===je?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ca)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===la)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ac||i===ha||i===fa||i===da)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Rr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ha)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===fa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===da)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ei?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class B0 extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class vt extends ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}const H0={type:"move"};class Es{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const g of e.hand.values()){const m=n.getJointPose(g,i),p=this._getHandJoint(l,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,_=.005;l.inputState.pinching&&u>d+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=d-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(H0)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new vt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const V0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,k0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class G0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new xt,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Yt({vertexShader:V0,fragmentShader:k0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new wt(new Gr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class W0 extends $n{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,h=null,f=null,u=null,d=null,_=null;const g=new G0,m=n.getContextAttributes();let p=null,T=null;const S=[],v=[],P=new we;let b=null;const w=new zt;w.viewport=new st;const R=new zt;R.viewport=new st;const y=[w,R],x=new B0;let C=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Q=S[q];return Q===void 0&&(Q=new Es,S[q]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(q){let Q=S[q];return Q===void 0&&(Q=new Es,S[q]=Q),Q.getGripSpace()},this.getHand=function(q){let Q=S[q];return Q===void 0&&(Q=new Es,S[q]=Q),Q.getHandSpace()};function I(q){const Q=v.indexOf(q.inputSource);if(Q===-1)return;const he=S[Q];he!==void 0&&(he.update(q.inputSource,q.frame,l||a),he.dispatchEvent({type:q.type,data:q.inputSource}))}function N(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",N),r.removeEventListener("inputsourceschange",X);for(let q=0;q<S.length;q++){const Q=v[q];Q!==null&&(v[q]=null,S[q].disconnect(Q))}C=null,z=null,g.reset(),e.setRenderTarget(p),d=null,u=null,f=null,r=null,T=null,Xe.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",N),r.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await n.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Q),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),T=new qn(d.framebufferWidth,d.framebufferHeight,{format:qt,type:un,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,he=null,ie=null;m.depth&&(ie=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Q=m.stencil?Ti:vi,he=m.stencil?Ei:Xn);const Se={colorFormat:n.RGBA8,depthFormat:ie,scaleFactor:s};f=new XRWebGLBinding(r,n),u=f.createProjectionLayer(Se),r.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),T=new qn(u.textureWidth,u.textureHeight,{format:qt,type:un,depthTexture:new Vc(u.textureWidth,u.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Xe.setContext(r),Xe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function X(q){for(let Q=0;Q<q.removed.length;Q++){const he=q.removed[Q],ie=v.indexOf(he);ie>=0&&(v[ie]=null,S[ie].disconnect(he))}for(let Q=0;Q<q.added.length;Q++){const he=q.added[Q];let ie=v.indexOf(he);if(ie===-1){for(let Re=0;Re<S.length;Re++)if(Re>=v.length){v.push(he),ie=Re;break}else if(v[Re]===null){v[Re]=he,ie=Re;break}if(ie===-1)break}const Se=S[ie];Se&&Se.connect(he)}}const G=new O,K=new O;function k(q,Q,he){G.setFromMatrixPosition(Q.matrixWorld),K.setFromMatrixPosition(he.matrixWorld);const ie=G.distanceTo(K),Se=Q.projectionMatrix.elements,Re=he.projectionMatrix.elements,Fe=Se[14]/(Se[10]-1),it=Se[14]/(Se[10]+1),Ve=(Se[9]+1)/Se[5],at=(Se[9]-1)/Se[5],F=(Se[8]-1)/Se[0],Ut=(Re[8]+1)/Re[0],ze=Fe*F,Be=Fe*Ut,Ee=ie/(-F+Ut),et=Ee*-F;if(Q.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(et),q.translateZ(Ee),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Se[10]===-1)q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const ye=Fe+Ee,A=it+Ee,M=ze-et,B=Be+(ie-et),Y=Ve*it/A*ye,Z=at*it/A*ye;q.projectionMatrix.makePerspective(M,B,Y,Z,ye,A),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function te(q,Q){Q===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Q.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let Q=q.near,he=q.far;g.texture!==null&&(g.depthNear>0&&(Q=g.depthNear),g.depthFar>0&&(he=g.depthFar)),x.near=R.near=w.near=Q,x.far=R.far=w.far=he,(C!==x.near||z!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),C=x.near,z=x.far),w.layers.mask=q.layers.mask|2,R.layers.mask=q.layers.mask|4,x.layers.mask=w.layers.mask|R.layers.mask;const ie=q.parent,Se=x.cameras;te(x,ie);for(let Re=0;Re<Se.length;Re++)te(Se[Re],ie);Se.length===2?k(x,w,R):x.projectionMatrix.copy(w.projectionMatrix),le(q,x,ie)};function le(q,Q,he){he===null?q.matrix.copy(Q.matrixWorld):(q.matrix.copy(he.matrixWorld),q.matrix.invert(),q.matrix.multiply(Q.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ua*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(u===null&&d===null))return c},this.setFoveation=function(q){c=q,u!==null&&(u.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(x)};let ve=null;function Le(q,Q){if(h=Q.getViewerPose(l||a),_=Q,h!==null){const he=h.views;d!==null&&(e.setRenderTargetFramebuffer(T,d.framebuffer),e.setRenderTarget(T));let ie=!1;he.length!==x.cameras.length&&(x.cameras.length=0,ie=!0);for(let Re=0;Re<he.length;Re++){const Fe=he[Re];let it=null;if(d!==null)it=d.getViewport(Fe);else{const at=f.getViewSubImage(u,Fe);it=at.viewport,Re===0&&(e.setRenderTargetTextures(T,at.colorTexture,u.ignoreDepthValues?void 0:at.depthStencilTexture),e.setRenderTarget(T))}let Ve=y[Re];Ve===void 0&&(Ve=new zt,Ve.layers.enable(Re),Ve.viewport=new st,y[Re]=Ve),Ve.matrix.fromArray(Fe.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(Fe.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(it.x,it.y,it.width,it.height),Re===0&&(x.matrix.copy(Ve.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ie===!0&&x.cameras.push(Ve)}const Se=r.enabledFeatures;if(Se&&Se.includes("depth-sensing")){const Re=f.getDepthInformation(he[0]);Re&&Re.isValid&&Re.texture&&g.init(e,Re,r.renderState)}}for(let he=0;he<S.length;he++){const ie=v[he],Se=S[he];ie!==null&&Se!==void 0&&Se.update(ie,Q,l||a)}ve&&ve(q,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),_=null}const Xe=new Bc;Xe.setAnimationLoop(Le),this.setAnimationLoop=function(q){ve=q},this.dispose=function(){}}}const Bn=new pn,X0=new Ke;function q0(t,e){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Fc(t)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,T,S,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),u(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),_(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),g(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,T,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ct&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ct&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const T=e.get(p),S=T.envMap,v=T.envMapRotation;S&&(m.envMap.value=S,Bn.copy(v),Bn.x*=-1,Bn.y*=-1,Bn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Bn.y*=-1,Bn.z*=-1),m.envMapRotation.value.setFromMatrix4(X0.makeRotationFromEuler(Bn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,T,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=S*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ct&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const T=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function $0(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,S){const v=S.program;i.uniformBlockBinding(T,v)}function l(T,S){let v=r[T.id];v===void 0&&(_(T),v=h(T),r[T.id]=v,T.addEventListener("dispose",m));const P=S.program;i.updateUBOMapping(T,P);const b=e.render.frame;s[T.id]!==b&&(u(T),s[T.id]=b)}function h(T){const S=f();T.__bindingPointIndex=S;const v=t.createBuffer(),P=T.__size,b=T.usage;return t.bindBuffer(t.UNIFORM_BUFFER,v),t.bufferData(t.UNIFORM_BUFFER,P,b),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,v),v}function f(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(T){const S=r[T.id],v=T.uniforms,P=T.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let b=0,w=v.length;b<w;b++){const R=Array.isArray(v[b])?v[b]:[v[b]];for(let y=0,x=R.length;y<x;y++){const C=R[y];if(d(C,b,y,P)===!0){const z=C.__offset,I=Array.isArray(C.value)?C.value:[C.value];let N=0;for(let X=0;X<I.length;X++){const G=I[X],K=g(G);typeof G=="number"||typeof G=="boolean"?(C.__data[0]=G,t.bufferSubData(t.UNIFORM_BUFFER,z+N,C.__data)):G.isMatrix3?(C.__data[0]=G.elements[0],C.__data[1]=G.elements[1],C.__data[2]=G.elements[2],C.__data[3]=0,C.__data[4]=G.elements[3],C.__data[5]=G.elements[4],C.__data[6]=G.elements[5],C.__data[7]=0,C.__data[8]=G.elements[6],C.__data[9]=G.elements[7],C.__data[10]=G.elements[8],C.__data[11]=0):(G.toArray(C.__data,N),N+=K.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,z,C.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function d(T,S,v,P){const b=T.value,w=S+"_"+v;if(P[w]===void 0)return typeof b=="number"||typeof b=="boolean"?P[w]=b:P[w]=b.clone(),!0;{const R=P[w];if(typeof b=="number"||typeof b=="boolean"){if(R!==b)return P[w]=b,!0}else if(R.equals(b)===!1)return R.copy(b),!0}return!1}function _(T){const S=T.uniforms;let v=0;const P=16;for(let w=0,R=S.length;w<R;w++){const y=Array.isArray(S[w])?S[w]:[S[w]];for(let x=0,C=y.length;x<C;x++){const z=y[x],I=Array.isArray(z.value)?z.value:[z.value];for(let N=0,X=I.length;N<X;N++){const G=I[N],K=g(G),k=v%P,te=k%K.boundary,le=k+te;v+=te,le!==0&&P-le<K.storage&&(v+=P-le),z.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=K.storage}}}const b=v%P;return b>0&&(v+=P-b),T.__size=v,T.__cache={},this}function g(T){const S={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(S.boundary=4,S.storage=4):T.isVector2?(S.boundary=8,S.storage=8):T.isVector3||T.isColor?(S.boundary=16,S.storage=12):T.isVector4?(S.boundary=16,S.storage=16):T.isMatrix3?(S.boundary=48,S.storage=48):T.isMatrix4?(S.boundary=64,S.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),S}function m(T){const S=T.target;S.removeEventListener("dispose",m);const v=a.indexOf(S.__bindingPointIndex);a.splice(v,1),t.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function p(){for(const T in r)t.deleteBuffer(r[T]);a=[],r={},s={}}return{bind:c,update:l,dispose:p}}class Y0{constructor(e={}){const{canvas:n=Ff(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const _=new Uint32Array(4),g=new Int32Array(4);let m=null,p=null;const T=[],S=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ot,this.toneMapping=Cn,this.toneMappingExposure=1;const v=this;let P=!1,b=0,w=0,R=null,y=-1,x=null;const C=new st,z=new st;let I=null;const N=new Oe(0);let X=0,G=n.width,K=n.height,k=1,te=null,le=null;const ve=new st(0,0,G,K),Le=new st(0,0,G,K);let Xe=!1;const q=new wa;let Q=!1,he=!1;const ie=new Ke,Se=new Ke,Re=new O,Fe=new st,it={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ve=!1;function at(){return R===null?k:1}let F=i;function Ut(E,L){return n.getContext(E,L)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${xa}`),n.addEventListener("webglcontextlost",j,!1),n.addEventListener("webglcontextrestored",ce,!1),n.addEventListener("webglcontextcreationerror",ae,!1),F===null){const L="webgl2";if(F=Ut(L,E),F===null)throw Ut(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let ze,Be,Ee,et,ye,A,M,B,Y,Z,$,xe,se,fe,ke,J,de,Te,be,ue,He,Ie,Je,D;function re(){ze=new Qp(F),ze.init(),Ie=new z0(F,ze),Be=new $p(F,ze,e,Ie),Ee=new N0(F,ze),Be.reverseDepthBuffer&&u&&Ee.buffers.depth.setReversed(!0),et=new nm(F),ye=new M0,A=new O0(F,ze,Ee,ye,Be,Ie,et),M=new jp(v),B=new Jp(v),Y=new ld(F),Je=new Xp(F,Y),Z=new em(F,Y,et,Je),$=new rm(F,Z,Y,et),be=new im(F,Be,A),J=new Yp(ye),xe=new x0(v,M,B,ze,Be,Je,J),se=new q0(v,ye),fe=new S0,ke=new R0(ze),Te=new Wp(v,M,B,Ee,$,d,c),de=new I0(v,$,Be),D=new $0(F,et,Be,Ee),ue=new qp(F,ze,et),He=new tm(F,ze,et),et.programs=xe.programs,v.capabilities=Be,v.extensions=ze,v.properties=ye,v.renderLists=fe,v.shadowMap=de,v.state=Ee,v.info=et}re();const W=new W0(v,F);this.xr=W,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=ze.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=ze.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(E){E!==void 0&&(k=E,this.setSize(G,K,!1))},this.getSize=function(E){return E.set(G,K)},this.setSize=function(E,L,H=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,K=L,n.width=Math.floor(E*k),n.height=Math.floor(L*k),H===!0&&(n.style.width=E+"px",n.style.height=L+"px"),this.setViewport(0,0,E,L)},this.getDrawingBufferSize=function(E){return E.set(G*k,K*k).floor()},this.setDrawingBufferSize=function(E,L,H){G=E,K=L,k=H,n.width=Math.floor(E*H),n.height=Math.floor(L*H),this.setViewport(0,0,E,L)},this.getCurrentViewport=function(E){return E.copy(C)},this.getViewport=function(E){return E.copy(ve)},this.setViewport=function(E,L,H,V){E.isVector4?ve.set(E.x,E.y,E.z,E.w):ve.set(E,L,H,V),Ee.viewport(C.copy(ve).multiplyScalar(k).round())},this.getScissor=function(E){return E.copy(Le)},this.setScissor=function(E,L,H,V){E.isVector4?Le.set(E.x,E.y,E.z,E.w):Le.set(E,L,H,V),Ee.scissor(z.copy(Le).multiplyScalar(k).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(E){Ee.setScissorTest(Xe=E)},this.setOpaqueSort=function(E){te=E},this.setTransparentSort=function(E){le=E},this.getClearColor=function(E){return E.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor.apply(Te,arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha.apply(Te,arguments)},this.clear=function(E=!0,L=!0,H=!0){let V=0;if(E){let U=!1;if(R!==null){const ee=R.texture.format;U=ee===Aa||ee===ba||ee===Ta}if(U){const ee=R.texture.type,oe=ee===un||ee===Xn||ee===Wi||ee===Ei||ee===ya||ee===Sa,me=Te.getClearColor(),_e=Te.getClearAlpha(),Ae=me.r,Pe=me.g,ge=me.b;oe?(_[0]=Ae,_[1]=Pe,_[2]=ge,_[3]=_e,F.clearBufferuiv(F.COLOR,0,_)):(g[0]=Ae,g[1]=Pe,g[2]=ge,g[3]=_e,F.clearBufferiv(F.COLOR,0,g))}else V|=F.COLOR_BUFFER_BIT}L&&(V|=F.DEPTH_BUFFER_BIT),H&&(V|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",j,!1),n.removeEventListener("webglcontextrestored",ce,!1),n.removeEventListener("webglcontextcreationerror",ae,!1),fe.dispose(),ke.dispose(),ye.dispose(),M.dispose(),B.dispose(),$.dispose(),Je.dispose(),D.dispose(),xe.dispose(),W.dispose(),W.removeEventListener("sessionstart",ka),W.removeEventListener("sessionend",Ga),In.stop()};function j(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function ce(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const E=et.autoReset,L=de.enabled,H=de.autoUpdate,V=de.needsUpdate,U=de.type;re(),et.autoReset=E,de.enabled=L,de.autoUpdate=H,de.needsUpdate=V,de.type=U}function ae(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ce(E){const L=E.target;L.removeEventListener("dispose",Ce),rt(L)}function rt(E){mt(E),ye.remove(E)}function mt(E){const L=ye.get(E).programs;L!==void 0&&(L.forEach(function(H){xe.releaseProgram(H)}),E.isShaderMaterial&&xe.releaseShaderCache(E))}this.renderBufferDirect=function(E,L,H,V,U,ee){L===null&&(L=it);const oe=U.isMesh&&U.matrixWorld.determinant()<0,me=gh(E,L,H,V,U);Ee.setMaterial(V,oe);let _e=H.index,Ae=1;if(V.wireframe===!0){if(_e=Z.getWireframeAttribute(H),_e===void 0)return;Ae=2}const Pe=H.drawRange,ge=H.attributes.position;let We=Pe.start*Ae,Qe=(Pe.start+Pe.count)*Ae;ee!==null&&(We=Math.max(We,ee.start*Ae),Qe=Math.min(Qe,(ee.start+ee.count)*Ae)),_e!==null?(We=Math.max(We,0),Qe=Math.min(Qe,_e.count)):ge!=null&&(We=Math.max(We,0),Qe=Math.min(Qe,ge.count));const tt=Qe-We;if(tt<0||tt===1/0)return;Je.setup(U,V,me,H,_e);let Tt,qe=ue;if(_e!==null&&(Tt=Y.get(_e),qe=He,qe.setIndex(Tt)),U.isMesh)V.wireframe===!0?(Ee.setLineWidth(V.wireframeLinewidth*at()),qe.setMode(F.LINES)):qe.setMode(F.TRIANGLES);else if(U.isLine){let Me=V.linewidth;Me===void 0&&(Me=1),Ee.setLineWidth(Me*at()),U.isLineSegments?qe.setMode(F.LINES):U.isLineLoop?qe.setMode(F.LINE_LOOP):qe.setMode(F.LINE_STRIP)}else U.isPoints?qe.setMode(F.POINTS):U.isSprite&&qe.setMode(F.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)qe.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ze.get("WEBGL_multi_draw"))qe.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Me=U._multiDrawStarts,nn=U._multiDrawCounts,$e=U._multiDrawCount,Vt=_e?Y.get(_e).bytesPerElement:1,Kn=ye.get(V).currentProgram.getUniforms();for(let Pt=0;Pt<$e;Pt++)Kn.setValue(F,"_gl_DrawID",Pt),qe.render(Me[Pt]/Vt,nn[Pt])}else if(U.isInstancedMesh)qe.renderInstances(We,tt,U.count);else if(H.isInstancedBufferGeometry){const Me=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,nn=Math.min(H.instanceCount,Me);qe.renderInstances(We,tt,nn)}else qe.render(We,tt)};function Ye(E,L,H){E.transparent===!0&&E.side===Kt&&E.forceSinglePass===!1?(E.side=Ct,E.needsUpdate=!0,Zi(E,L,H),E.side=Pn,E.needsUpdate=!0,Zi(E,L,H),E.side=Kt):Zi(E,L,H)}this.compile=function(E,L,H=null){H===null&&(H=E),p=ke.get(H),p.init(L),S.push(p),H.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),E!==H&&E.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const V=new Set;return E.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ee=U.material;if(ee)if(Array.isArray(ee))for(let oe=0;oe<ee.length;oe++){const me=ee[oe];Ye(me,H,U),V.add(me)}else Ye(ee,H,U),V.add(ee)}),S.pop(),p=null,V},this.compileAsync=function(E,L,H=null){const V=this.compile(E,L,H);return new Promise(U=>{function ee(){if(V.forEach(function(oe){ye.get(oe).currentProgram.isReady()&&V.delete(oe)}),V.size===0){U(E);return}setTimeout(ee,10)}ze.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let Ht=null;function tn(E){Ht&&Ht(E)}function ka(){In.stop()}function Ga(){In.start()}const In=new Bc;In.setAnimationLoop(tn),typeof self<"u"&&In.setContext(self),this.setAnimationLoop=function(E){Ht=E,W.setAnimationLoop(E),E===null?In.stop():In.start()},W.addEventListener("sessionstart",ka),W.addEventListener("sessionend",Ga),this.render=function(E,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(L),L=W.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,L,R),p=ke.get(E,S.length),p.init(L),S.push(p),Se.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),q.setFromProjectionMatrix(Se),he=this.localClippingEnabled,Q=J.init(this.clippingPlanes,he),m=fe.get(E,T.length),m.init(),T.push(m),W.enabled===!0&&W.isPresenting===!0){const ee=v.xr.getDepthSensingMesh();ee!==null&&Yr(ee,L,-1/0,v.sortObjects)}Yr(E,L,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(te,le),Ve=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Ve&&Te.addToRenderList(m,E),this.info.render.frame++,Q===!0&&J.beginShadows();const H=p.state.shadowsArray;de.render(H,E,L),Q===!0&&J.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,U=m.transmissive;if(p.setupLights(),L.isArrayCamera){const ee=L.cameras;if(U.length>0)for(let oe=0,me=ee.length;oe<me;oe++){const _e=ee[oe];Xa(V,U,E,_e)}Ve&&Te.render(E);for(let oe=0,me=ee.length;oe<me;oe++){const _e=ee[oe];Wa(m,E,_e,_e.viewport)}}else U.length>0&&Xa(V,U,E,L),Ve&&Te.render(E),Wa(m,E,L);R!==null&&(A.updateMultisampleRenderTarget(R),A.updateRenderTargetMipmap(R)),E.isScene===!0&&E.onAfterRender(v,E,L),Je.resetDefaultState(),y=-1,x=null,S.pop(),S.length>0?(p=S[S.length-1],Q===!0&&J.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function Yr(E,L,H,V){if(E.visible===!1)return;if(E.layers.test(L.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(L);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||q.intersectsSprite(E)){V&&Fe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Se);const oe=$.update(E),me=E.material;me.visible&&m.push(E,oe,me,H,Fe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||q.intersectsObject(E))){const oe=$.update(E),me=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Fe.copy(E.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),Fe.copy(oe.boundingSphere.center)),Fe.applyMatrix4(E.matrixWorld).applyMatrix4(Se)),Array.isArray(me)){const _e=oe.groups;for(let Ae=0,Pe=_e.length;Ae<Pe;Ae++){const ge=_e[Ae],We=me[ge.materialIndex];We&&We.visible&&m.push(E,oe,We,H,Fe.z,ge)}}else me.visible&&m.push(E,oe,me,H,Fe.z,null)}}const ee=E.children;for(let oe=0,me=ee.length;oe<me;oe++)Yr(ee[oe],L,H,V)}function Wa(E,L,H,V){const U=E.opaque,ee=E.transmissive,oe=E.transparent;p.setupLightsView(H),Q===!0&&J.setGlobalState(v.clippingPlanes,H),V&&Ee.viewport(C.copy(V)),U.length>0&&ji(U,L,H),ee.length>0&&ji(ee,L,H),oe.length>0&&ji(oe,L,H),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function Xa(E,L,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[V.id]===void 0&&(p.state.transmissionRenderTarget[V.id]=new qn(1,1,{generateMipmaps:!0,type:ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float")?$i:un,minFilter:Wn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace}));const ee=p.state.transmissionRenderTarget[V.id],oe=V.viewport||C;ee.setSize(oe.z,oe.w);const me=v.getRenderTarget();v.setRenderTarget(ee),v.getClearColor(N),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),Ve&&Te.render(H);const _e=v.toneMapping;v.toneMapping=Cn;const Ae=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),p.setupLightsView(V),Q===!0&&J.setGlobalState(v.clippingPlanes,V),ji(E,H,V),A.updateMultisampleRenderTarget(ee),A.updateRenderTargetMipmap(ee),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let ge=0,We=L.length;ge<We;ge++){const Qe=L[ge],tt=Qe.object,Tt=Qe.geometry,qe=Qe.material,Me=Qe.group;if(qe.side===Kt&&tt.layers.test(V.layers)){const nn=qe.side;qe.side=Ct,qe.needsUpdate=!0,qa(tt,H,V,Tt,qe,Me),qe.side=nn,qe.needsUpdate=!0,Pe=!0}}Pe===!0&&(A.updateMultisampleRenderTarget(ee),A.updateRenderTargetMipmap(ee))}v.setRenderTarget(me),v.setClearColor(N,X),Ae!==void 0&&(V.viewport=Ae),v.toneMapping=_e}function ji(E,L,H){const V=L.isScene===!0?L.overrideMaterial:null;for(let U=0,ee=E.length;U<ee;U++){const oe=E[U],me=oe.object,_e=oe.geometry,Ae=V===null?oe.material:V,Pe=oe.group;me.layers.test(H.layers)&&qa(me,L,H,_e,Ae,Pe)}}function qa(E,L,H,V,U,ee){E.onBeforeRender(v,L,H,V,U,ee),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),U.onBeforeRender(v,L,H,V,E,ee),U.transparent===!0&&U.side===Kt&&U.forceSinglePass===!1?(U.side=Ct,U.needsUpdate=!0,v.renderBufferDirect(H,L,V,U,E,ee),U.side=Pn,U.needsUpdate=!0,v.renderBufferDirect(H,L,V,U,E,ee),U.side=Kt):v.renderBufferDirect(H,L,V,U,E,ee),E.onAfterRender(v,L,H,V,U,ee)}function Zi(E,L,H){L.isScene!==!0&&(L=it);const V=ye.get(E),U=p.state.lights,ee=p.state.shadowsArray,oe=U.state.version,me=xe.getParameters(E,U.state,ee,L,H),_e=xe.getProgramCacheKey(me);let Ae=V.programs;V.environment=E.isMeshStandardMaterial?L.environment:null,V.fog=L.fog,V.envMap=(E.isMeshStandardMaterial?B:M).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?L.environmentRotation:E.envMapRotation,Ae===void 0&&(E.addEventListener("dispose",Ce),Ae=new Map,V.programs=Ae);let Pe=Ae.get(_e);if(Pe!==void 0){if(V.currentProgram===Pe&&V.lightsStateVersion===oe)return Ya(E,me),Pe}else me.uniforms=xe.getUniforms(E),E.onBeforeCompile(me,v),Pe=xe.acquireProgram(me,_e),Ae.set(_e,Pe),V.uniforms=me.uniforms;const ge=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(ge.clippingPlanes=J.uniform),Ya(E,me),V.needsLights=xh(E),V.lightsStateVersion=oe,V.needsLights&&(ge.ambientLightColor.value=U.state.ambient,ge.lightProbe.value=U.state.probe,ge.directionalLights.value=U.state.directional,ge.directionalLightShadows.value=U.state.directionalShadow,ge.spotLights.value=U.state.spot,ge.spotLightShadows.value=U.state.spotShadow,ge.rectAreaLights.value=U.state.rectArea,ge.ltc_1.value=U.state.rectAreaLTC1,ge.ltc_2.value=U.state.rectAreaLTC2,ge.pointLights.value=U.state.point,ge.pointLightShadows.value=U.state.pointShadow,ge.hemisphereLights.value=U.state.hemi,ge.directionalShadowMap.value=U.state.directionalShadowMap,ge.directionalShadowMatrix.value=U.state.directionalShadowMatrix,ge.spotShadowMap.value=U.state.spotShadowMap,ge.spotLightMatrix.value=U.state.spotLightMatrix,ge.spotLightMap.value=U.state.spotLightMap,ge.pointShadowMap.value=U.state.pointShadowMap,ge.pointShadowMatrix.value=U.state.pointShadowMatrix),V.currentProgram=Pe,V.uniformsList=null,Pe}function $a(E){if(E.uniformsList===null){const L=E.currentProgram.getUniforms();E.uniformsList=Pr.seqWithValue(L.seq,E.uniforms)}return E.uniformsList}function Ya(E,L){const H=ye.get(E);H.outputColorSpace=L.outputColorSpace,H.batching=L.batching,H.batchingColor=L.batchingColor,H.instancing=L.instancing,H.instancingColor=L.instancingColor,H.instancingMorph=L.instancingMorph,H.skinning=L.skinning,H.morphTargets=L.morphTargets,H.morphNormals=L.morphNormals,H.morphColors=L.morphColors,H.morphTargetsCount=L.morphTargetsCount,H.numClippingPlanes=L.numClippingPlanes,H.numIntersection=L.numClipIntersection,H.vertexAlphas=L.vertexAlphas,H.vertexTangents=L.vertexTangents,H.toneMapping=L.toneMapping}function gh(E,L,H,V,U){L.isScene!==!0&&(L=it),A.resetTextureUnits();const ee=L.fog,oe=V.isMeshStandardMaterial?L.environment:null,me=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:wi,_e=(V.isMeshStandardMaterial?B:M).get(V.envMap||oe),Ae=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Pe=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),ge=!!H.morphAttributes.position,We=!!H.morphAttributes.normal,Qe=!!H.morphAttributes.color;let tt=Cn;V.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(tt=v.toneMapping);const Tt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,qe=Tt!==void 0?Tt.length:0,Me=ye.get(V),nn=p.state.lights;if(Q===!0&&(he===!0||E!==x)){const Nt=E===x&&V.id===y;J.setState(V,E,Nt)}let $e=!1;V.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==nn.state.version||Me.outputColorSpace!==me||U.isBatchedMesh&&Me.batching===!1||!U.isBatchedMesh&&Me.batching===!0||U.isBatchedMesh&&Me.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Me.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Me.instancing===!1||!U.isInstancedMesh&&Me.instancing===!0||U.isSkinnedMesh&&Me.skinning===!1||!U.isSkinnedMesh&&Me.skinning===!0||U.isInstancedMesh&&Me.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Me.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Me.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Me.instancingMorph===!1&&U.morphTexture!==null||Me.envMap!==_e||V.fog===!0&&Me.fog!==ee||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==J.numPlanes||Me.numIntersection!==J.numIntersection)||Me.vertexAlphas!==Ae||Me.vertexTangents!==Pe||Me.morphTargets!==ge||Me.morphNormals!==We||Me.morphColors!==Qe||Me.toneMapping!==tt||Me.morphTargetsCount!==qe)&&($e=!0):($e=!0,Me.__version=V.version);let Vt=Me.currentProgram;$e===!0&&(Vt=Zi(V,L,U));let Kn=!1,Pt=!1,Di=!1;const nt=Vt.getUniforms(),jt=Me.uniforms;if(Ee.useProgram(Vt.program)&&(Kn=!0,Pt=!0,Di=!0),V.id!==y&&(y=V.id,Pt=!0),Kn||x!==E){Ee.buffers.depth.getReversed()?(ie.copy(E.projectionMatrix),zf(ie),Bf(ie),nt.setValue(F,"projectionMatrix",ie)):nt.setValue(F,"projectionMatrix",E.projectionMatrix),nt.setValue(F,"viewMatrix",E.matrixWorldInverse);const mn=nt.map.cameraPosition;mn!==void 0&&mn.setValue(F,Re.setFromMatrixPosition(E.matrixWorld)),Be.logarithmicDepthBuffer&&nt.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&nt.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,Pt=!0,Di=!0)}if(U.isSkinnedMesh){nt.setOptional(F,U,"bindMatrix"),nt.setOptional(F,U,"bindMatrixInverse");const Nt=U.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),nt.setValue(F,"boneTexture",Nt.boneTexture,A))}U.isBatchedMesh&&(nt.setOptional(F,U,"batchingTexture"),nt.setValue(F,"batchingTexture",U._matricesTexture,A),nt.setOptional(F,U,"batchingIdTexture"),nt.setValue(F,"batchingIdTexture",U._indirectTexture,A),nt.setOptional(F,U,"batchingColorTexture"),U._colorsTexture!==null&&nt.setValue(F,"batchingColorTexture",U._colorsTexture,A));const Li=H.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&be.update(U,H,Vt),(Pt||Me.receiveShadow!==U.receiveShadow)&&(Me.receiveShadow=U.receiveShadow,nt.setValue(F,"receiveShadow",U.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(jt.envMap.value=_e,jt.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&L.environment!==null&&(jt.envMapIntensity.value=L.environmentIntensity),Pt&&(nt.setValue(F,"toneMappingExposure",v.toneMappingExposure),Me.needsLights&&vh(jt,Di),ee&&V.fog===!0&&se.refreshFogUniforms(jt,ee),se.refreshMaterialUniforms(jt,V,k,K,p.state.transmissionRenderTarget[E.id]),Pr.upload(F,$a(Me),jt,A)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Pr.upload(F,$a(Me),jt,A),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&nt.setValue(F,"center",U.center),nt.setValue(F,"modelViewMatrix",U.modelViewMatrix),nt.setValue(F,"normalMatrix",U.normalMatrix),nt.setValue(F,"modelMatrix",U.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Nt=V.uniformsGroups;for(let mn=0,_n=Nt.length;mn<_n;mn++){const ja=Nt[mn];D.update(ja,Vt),D.bind(ja,Vt)}}return Vt}function vh(E,L){E.ambientLightColor.needsUpdate=L,E.lightProbe.needsUpdate=L,E.directionalLights.needsUpdate=L,E.directionalLightShadows.needsUpdate=L,E.pointLights.needsUpdate=L,E.pointLightShadows.needsUpdate=L,E.spotLights.needsUpdate=L,E.spotLightShadows.needsUpdate=L,E.rectAreaLights.needsUpdate=L,E.hemisphereLights.needsUpdate=L}function xh(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(E,L,H){ye.get(E.texture).__webglTexture=L,ye.get(E.depthTexture).__webglTexture=H;const V=ye.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=H===void 0,V.__autoAllocateDepthBuffer||ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,L){const H=ye.get(E);H.__webglFramebuffer=L,H.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(E,L=0,H=0){R=E,b=L,w=H;let V=!0,U=null,ee=!1,oe=!1;if(E){const _e=ye.get(E);if(_e.__useDefaultFramebuffer!==void 0)Ee.bindFramebuffer(F.FRAMEBUFFER,null),V=!1;else if(_e.__webglFramebuffer===void 0)A.setupRenderTarget(E);else if(_e.__hasExternalTextures)A.rebindTextures(E,ye.get(E.texture).__webglTexture,ye.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const ge=E.depthTexture;if(_e.__boundDepthTexture!==ge){if(ge!==null&&ye.has(ge)&&(E.width!==ge.image.width||E.height!==ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(E)}}const Ae=E.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(oe=!0);const Pe=ye.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Pe[L])?U=Pe[L][H]:U=Pe[L],ee=!0):E.samples>0&&A.useMultisampledRTT(E)===!1?U=ye.get(E).__webglMultisampledFramebuffer:Array.isArray(Pe)?U=Pe[H]:U=Pe,C.copy(E.viewport),z.copy(E.scissor),I=E.scissorTest}else C.copy(ve).multiplyScalar(k).floor(),z.copy(Le).multiplyScalar(k).floor(),I=Xe;if(Ee.bindFramebuffer(F.FRAMEBUFFER,U)&&V&&Ee.drawBuffers(E,U),Ee.viewport(C),Ee.scissor(z),Ee.setScissorTest(I),ee){const _e=ye.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+L,_e.__webglTexture,H)}else if(oe){const _e=ye.get(E.texture),Ae=L||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,_e.__webglTexture,H||0,Ae)}y=-1},this.readRenderTargetPixels=function(E,L,H,V,U,ee,oe){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=ye.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&oe!==void 0&&(me=me[oe]),me){Ee.bindFramebuffer(F.FRAMEBUFFER,me);try{const _e=E.texture,Ae=_e.format,Pe=_e.type;if(!Be.textureFormatReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=E.width-V&&H>=0&&H<=E.height-U&&F.readPixels(L,H,V,U,Ie.convert(Ae),Ie.convert(Pe),ee)}finally{const _e=R!==null?ye.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(F.FRAMEBUFFER,_e)}}},this.readRenderTargetPixelsAsync=async function(E,L,H,V,U,ee,oe){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=ye.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&oe!==void 0&&(me=me[oe]),me){const _e=E.texture,Ae=_e.format,Pe=_e.type;if(!Be.textureFormatReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=E.width-V&&H>=0&&H<=E.height-U){Ee.bindFramebuffer(F.FRAMEBUFFER,me);const ge=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,ge),F.bufferData(F.PIXEL_PACK_BUFFER,ee.byteLength,F.STREAM_READ),F.readPixels(L,H,V,U,Ie.convert(Ae),Ie.convert(Pe),0);const We=R!==null?ye.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(F.FRAMEBUFFER,We);const Qe=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Of(F,Qe,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,ge),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ee),F.deleteBuffer(ge),F.deleteSync(Qe),ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,L=null,H=0){E.isTexture!==!0&&(Vi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,E=arguments[1]);const V=Math.pow(2,-H),U=Math.floor(E.image.width*V),ee=Math.floor(E.image.height*V),oe=L!==null?L.x:0,me=L!==null?L.y:0;A.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,H,0,0,oe,me,U,ee),Ee.unbindTexture()},this.copyTextureToTexture=function(E,L,H=null,V=null,U=0){E.isTexture!==!0&&(Vi("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],L=arguments[2],U=arguments[3]||0,H=null);let ee,oe,me,_e,Ae,Pe,ge,We,Qe;const tt=E.isCompressedTexture?E.mipmaps[U]:E.image;H!==null?(ee=H.max.x-H.min.x,oe=H.max.y-H.min.y,me=H.isBox3?H.max.z-H.min.z:1,_e=H.min.x,Ae=H.min.y,Pe=H.isBox3?H.min.z:0):(ee=tt.width,oe=tt.height,me=tt.depth||1,_e=0,Ae=0,Pe=0),V!==null?(ge=V.x,We=V.y,Qe=V.z):(ge=0,We=0,Qe=0);const Tt=Ie.convert(L.format),qe=Ie.convert(L.type);let Me;L.isData3DTexture?(A.setTexture3D(L,0),Me=F.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(A.setTexture2DArray(L,0),Me=F.TEXTURE_2D_ARRAY):(A.setTexture2D(L,0),Me=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,L.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,L.unpackAlignment);const nn=F.getParameter(F.UNPACK_ROW_LENGTH),$e=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Vt=F.getParameter(F.UNPACK_SKIP_PIXELS),Kn=F.getParameter(F.UNPACK_SKIP_ROWS),Pt=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,tt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,tt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,_e),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ae),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Pe);const Di=E.isDataArrayTexture||E.isData3DTexture,nt=L.isDataArrayTexture||L.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const jt=ye.get(E),Li=ye.get(L),Nt=ye.get(jt.__renderTarget),mn=ye.get(Li.__renderTarget);Ee.bindFramebuffer(F.READ_FRAMEBUFFER,Nt.__webglFramebuffer),Ee.bindFramebuffer(F.DRAW_FRAMEBUFFER,mn.__webglFramebuffer);for(let _n=0;_n<me;_n++)Di&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ye.get(E).__webglTexture,U,Pe+_n),E.isDepthTexture?(nt&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ye.get(L).__webglTexture,U,Qe+_n),F.blitFramebuffer(_e,Ae,ee,oe,ge,We,ee,oe,F.DEPTH_BUFFER_BIT,F.NEAREST)):nt?F.copyTexSubImage3D(Me,U,ge,We,Qe+_n,_e,Ae,ee,oe):F.copyTexSubImage2D(Me,U,ge,We,Qe+_n,_e,Ae,ee,oe);Ee.bindFramebuffer(F.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else nt?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(Me,U,ge,We,Qe,ee,oe,me,Tt,qe,tt.data):L.isCompressedArrayTexture?F.compressedTexSubImage3D(Me,U,ge,We,Qe,ee,oe,me,Tt,tt.data):F.texSubImage3D(Me,U,ge,We,Qe,ee,oe,me,Tt,qe,tt):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,U,ge,We,ee,oe,Tt,qe,tt.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,U,ge,We,tt.width,tt.height,Tt,tt.data):F.texSubImage2D(F.TEXTURE_2D,U,ge,We,ee,oe,Tt,qe,tt);F.pixelStorei(F.UNPACK_ROW_LENGTH,nn),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,$e),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Vt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Kn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Pt),U===0&&L.generateMipmaps&&F.generateMipmap(Me),Ee.unbindTexture()},this.copyTextureToTexture3D=function(E,L,H=null,V=null,U=0){return E.isTexture!==!0&&(Vi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,V=arguments[1]||null,E=arguments[2],L=arguments[3],U=arguments[4]||0),Vi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,L,H,V,U)},this.initRenderTarget=function(E){ye.get(E).__webglFramebuffer===void 0&&A.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?A.setTextureCube(E,0):E.isData3DTexture?A.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?A.setTexture2DArray(E,0):A.setTexture2D(E,0),Ee.unbindTexture()},this.resetState=function(){b=0,w=0,R=null,Ee.reset(),Je.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Ge._getDrawingBufferColorSpace(e),n.unpackColorSpace=Ge._getUnpackColorSpace()}}class j0 extends ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pn,this.environmentIntensity=1,this.environmentRotation=new pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class Z0 extends xt{constructor(e=null,n=1,i=1,r,s,a,o,c,l=It,h=It,f,u){super(null,a,o,c,l,h,r,s,f,u),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jo extends Bt{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const di=new Ke,Zo=new Ke,vr=[],Ko=new Yn,K0=new Ke,zi=new wt,Bi=new jn;class qc extends wt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new jo(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,K0)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Yn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,di),Ko.copy(e.boundingBox).applyMatrix4(di),this.boundingBox.union(Ko)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new jn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,di),Bi.copy(e.boundingSphere).applyMatrix4(di),this.boundingSphere.union(Bi)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(zi.geometry=this.geometry,zi.material=this.material,zi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Bi.copy(this.boundingSphere),Bi.applyMatrix4(i),e.ray.intersectsSphere(Bi)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,di),Zo.multiplyMatrices(i,di),zi.matrixWorld=Zo,zi.raycast(e,vr);for(let a=0,o=vr.length;a<o;a++){const c=vr[a];c.instanceId=s,c.object=this,n.push(c)}vr.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new jo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Z0(new Float32Array(r*this.count),r,this.count,Ea,Qt));const s=this.morphTexture.source.data.data;let a=0;for(let l=0;l<i.length;l++)a+=i[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=r*e;s[c]=o,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Xr extends Ri{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ur=new O,Nr=new O,Jo=new Ke,Hi=new kr,xr=new jn,Ts=new O,Qo=new O;class Fr extends ut{constructor(e=new pt,n=new Xr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Ur.fromBufferAttribute(n,r-1),Nr.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Ur.distanceTo(Nr);e.setAttribute("lineDistance",new ot(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),xr.copy(i.boundingSphere),xr.applyMatrix4(r),xr.radius+=s,e.ray.intersectsSphere(xr)===!1)return;Jo.copy(r).invert(),Hi.copy(e.ray).applyMatrix4(Jo);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let g=d,m=_-1;g<m;g+=l){const p=h.getX(g),T=h.getX(g+1),S=Mr(this,e,Hi,c,p,T);S&&n.push(S)}if(this.isLineLoop){const g=h.getX(_-1),m=h.getX(d),p=Mr(this,e,Hi,c,g,m);p&&n.push(p)}}else{const d=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let g=d,m=_-1;g<m;g+=l){const p=Mr(this,e,Hi,c,g,g+1);p&&n.push(p)}if(this.isLineLoop){const g=Mr(this,e,Hi,c,_-1,d);g&&n.push(g)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Mr(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(Ur.fromBufferAttribute(a,r),Nr.fromBufferAttribute(a,s),n.distanceSqToSegment(Ur,Nr,Ts,Qo)>i)return;Ts.applyMatrix4(t.matrixWorld);const c=e.ray.origin.distanceTo(Ts);if(!(c<e.near||c>e.far))return{distance:c,point:Qo.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}class J0 extends Ri{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ec=new Ke,ma=new kr,yr=new jn,Sr=new O;class $c extends ut{constructor(e=new pt,n=new J0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),yr.copy(i.boundingSphere),yr.applyMatrix4(r),yr.radius+=s,e.ray.intersectsSphere(yr)===!1)return;ec.copy(r).invert(),ma.copy(e.ray).applyMatrix4(ec);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,f=i.attributes.position;if(l!==null){const u=Math.max(0,a.start),d=Math.min(l.count,a.start+a.count);for(let _=u,g=d;_<g;_++){const m=l.getX(_);Sr.fromBufferAttribute(f,m),tc(Sr,m,c,r,e,n,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let _=u,g=d;_<g;_++)Sr.fromBufferAttribute(f,_),tc(Sr,_,c,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function tc(t,e,n,i,r,s,a){const o=ma.distanceSqToPoint(t);if(o<n){const c=new O;ma.closestPointToPoint(t,c),c.applyMatrix4(i);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Ca extends pt{constructor(e=1,n=1,i=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],f=[],u=[],d=[];let _=0;const g=[],m=i/2;let p=0;T(),a===!1&&(e>0&&S(!0),n>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new ot(f,3)),this.setAttribute("normal",new ot(u,3)),this.setAttribute("uv",new ot(d,2));function T(){const v=new O,P=new O;let b=0;const w=(n-e)/i;for(let R=0;R<=s;R++){const y=[],x=R/s,C=x*(n-e)+e;for(let z=0;z<=r;z++){const I=z/r,N=I*c+o,X=Math.sin(N),G=Math.cos(N);P.x=C*X,P.y=-x*i+m,P.z=C*G,f.push(P.x,P.y,P.z),v.set(X,w,G).normalize(),u.push(v.x,v.y,v.z),d.push(I,1-x),y.push(_++)}g.push(y)}for(let R=0;R<r;R++)for(let y=0;y<s;y++){const x=g[y][R],C=g[y+1][R],z=g[y+1][R+1],I=g[y][R+1];(e>0||y!==0)&&(h.push(x,C,I),b+=3),(n>0||y!==s-1)&&(h.push(C,z,I),b+=3)}l.addGroup(p,b,0),p+=b}function S(v){const P=_,b=new we,w=new O;let R=0;const y=v===!0?e:n,x=v===!0?1:-1;for(let z=1;z<=r;z++)f.push(0,m*x,0),u.push(0,x,0),d.push(.5,.5),_++;const C=_;for(let z=0;z<=r;z++){const N=z/r*c+o,X=Math.cos(N),G=Math.sin(N);w.x=y*G,w.y=m*x,w.z=y*X,f.push(w.x,w.y,w.z),u.push(0,x,0),b.x=X*.5+.5,b.y=G*.5*x+.5,d.push(b.x,b.y),_++}for(let z=0;z<r;z++){const I=P+z,N=C+z;v===!0?h.push(N,N+1,I):h.push(N+1,N,I),R+=3}l.addGroup(p,R,v===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ca(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const nc={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class Q0{constructor(e,n,i){const r=this;let s=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(h){o++,s===!1&&r.onStart!==void 0&&r.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,r.onProgress!==void 0&&r.onProgress(h,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,f){return l.push(h,f),this},this.removeHandler=function(h){const f=l.indexOf(h);return f!==-1&&l.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=l.length;f<u;f+=2){const d=l[f],_=l[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return _}return null}}}const e_=new Q0;class Pa{constructor(e){this.manager=e!==void 0?e:e_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Pa.DEFAULT_MATERIAL_NAME="__DEFAULT";class t_ extends Pa{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=nc.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(a),s.manager.itemEnd(e)},0),a;const o=Xi("img");function c(){h(),nc.add(e,this),n&&n(this),s.manager.itemEnd(e)}function l(f){h(),r&&r(f),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class Yc extends Pa{constructor(e){super(e)}load(e,n,i,r){const s=new xt,a=new t_(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class jc extends ut{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const bs=new Ke,ic=new O,rc=new O;class n_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new we(512,512),this.map=null,this.mapPass=null,this.matrix=new Ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wa,this._frameExtents=new we(1,1),this._viewportCount=1,this._viewports=[new st(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;ic.setFromMatrixPosition(e.matrixWorld),n.position.copy(ic),rc.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(rc),n.updateMatrixWorld(),bs.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bs),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(bs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class i_ extends n_{constructor(){super(new Hc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class r_ extends jc{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ut.DEFAULT_UP),this.updateMatrix(),this.target=new ut,this.shadow=new i_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class s_ extends jc{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class sc{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Et(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class a_ extends $n{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xa);function o_(t){const e=t.length;if(e<2)return new pt;const n=[],i=[],r=[],s=[];for(let c=0;c<e;c++){const l=t[c],h=c>0?t[c-1]:l,f=c<e-1?t[c+1]:l;n.push(l.x,l.y,l.z),i.push(h.x,h.y,h.z),r.push(f.x,f.y,f.z),s.push(-1),n.push(l.x,l.y,l.z),i.push(h.x,h.y,h.z),r.push(f.x,f.y,f.z),s.push(1)}const a=new pt;a.setAttribute("position",new ot(n,3)),a.setAttribute("positionPrev",new ot(i,3)),a.setAttribute("positionNext",new ot(r,3)),a.setAttribute("side",new ot(s,1));const o=[];for(let c=0;c<e-1;c++){const l=c*2;o.push(l,l+1,l+2,l+2,l+1,l+3)}return a.setIndex(o),a.computeBoundingSphere(),a}const c_=`
attribute vec3 positionPrev;
attribute vec3 positionNext;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;

void main() {
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec4 clipPrev = projectionMatrix * modelViewMatrix * vec4(positionPrev, 1.0);
  vec4 clipNext = projectionMatrix * modelViewMatrix * vec4(positionNext, 1.0);

  vec2 ndcCurr = clipPos.xy / clipPos.w;
  vec2 ndcPrev = clipPrev.xy / clipPrev.w;
  vec2 ndcNext = clipNext.xy / clipNext.w;

  vec2 dir = normalize(ndcNext - ndcPrev);
  vec2 perp = vec2(-dir.y, dir.x);

  float w = clipPos.w;
  float pixelScale = min(resolution.x, resolution.y);
  float ndcPerPixel = 2.0 / pixelScale;
  vec2 offsetNdc = perp * side * (lineWidth * 0.5 * ndcPerPixel);
  clipPos.xy += offsetNdc * w;

  gl_Position = clipPos;
}
`,l_=`
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;function h_(t={}){const e=t.color??16777215,n=t.lineWidth??2,i=t.resolution??new we(800,700),r=new Oe(e);return new Yt({uniforms:{resolution:{value:i},lineWidth:{value:n},color:{value:new O(r.r,r.g,r.b)}},vertexShader:c_,fragmentShader:l_,transparent:!1,depthTest:!0,side:Kt})}const Zc=2,f_=new we(800,700);function d_(t,e,n,i=Zc,r){if(t.points.length<2){const c=new pt;return new wt(c,new Ci({color:n}))}const s=t.points.map(c=>new O(c.x*e,c.y*e,c.z*e)),a=o_(s),o=h_({color:n,lineWidth:i,resolution:f_});return new wt(a,o)}function u_(t){return t>=1?Math.max(1,Math.round(t)):Math.max(1,Math.round(t*100))}function Kc(t,e,n,i=Zc,r){const s=u_(i),a=new vt;for(const o of t.values())!(o!=null&&o.points)||o.points.length<2||a.add(d_(o,e,n,s));return a}const Jc=`
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`,Qc=`
uniform vec3 color;
uniform sampler2D pointTexture;
uniform float alphaTest;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    if ( gl_FragColor.a < alphaTest ) discard;
}
`;function el(t,e=1,n=1,i=16777215,r=1){const s=[],a=t.get_position_map();let o,c;typeof n=="number"?o=Array(t.nodes.size).fill(n):o=n,c=Array(t.nodes.size).fill(i);const l=[],h=new Oe;h.setRGB(255,255,255);let f=0,u;for(let m of t.nodes.keys())u=a.get(m),s.push(u.x*e,u.y*e,u.z*e),h.toArray(c,f*3),l.push(m),f+=1;const d=new pt;d.setAttribute("position",new ot(s,3)),d.setAttribute("customColor",new ot(c,3)),d.setAttribute("size",new ot(o,1)),d.setAttribute("label",new Uc(l,1)),d.name="nodes";const _=new Yt({uniforms:{color:{value:new Oe(16777215)},pointTexture:{value:new Yc().load("./Textures/Square.png")},alphaTest:{value:r}},vertexShader:Jc,fragmentShader:Qc}),g=new vt;return g.add(new $c(d,_)),g}function p_(t,e=1,n=1,i=16777215,r=1){const s=t.get_node_ids_order(),a=s.length,o=t.get_position_map(),c=[];let l;const h=Array(a).fill(i),f=s.slice(),u=new Oe;u.setRGB(255,255,255);for(let T=0;T<a;T++){const S=o.get(s[T]);c.push(S.x*e,S.y*e,S.z*e),u.toArray(h,T*3)}typeof n=="number"?l=Array(a).fill(n):l=n;const d=new pt;d.setAttribute("position",new ot(c,3)),d.setAttribute("customColor",new ot(h,3)),d.setAttribute("size",new ot(l,1)),d.setAttribute("label",new Uc(f,1)),d.name="nodes";const _=new Yt({uniforms:{color:{value:new Oe(16777215)},pointTexture:{value:new Yc().load("./Textures/Square.png")},alphaTest:{value:r}},vertexShader:Jc,fragmentShader:Qc}),g=new vt;g.add(new $c(d,_));const m=d.getAttribute("position");function p(T){const S=m.array;if(T instanceof Float32Array)for(let v=0;v<a*3;v++)S[v]=T[v]*e;else for(let v=0;v<a;v++){const P=T.get(s[v]);S[v*3]=P.x*e,S[v*3+1]=P.y*e,S[v*3+2]=P.z*e}m.needsUpdate=!0}return{group:g,updatePositions:p}}function m_(t,e=1,n=16777215,i=.4){const r=t.get_edge_map();return tl(r,e,n,i)}function tl(t,e,n=16777215,i=.4){return Kc(t,e,n,i)}function __(t,e=1,n=16777215){const i=t.get_edge_map();return nl(i,e,n)}function g_(t,e=1,n=16777215){const i=new Xr({color:n}),r=new vt;function s(){for(;r.children.length>0;){const o=r.children[0];r.remove(o),o instanceof Fr&&o.geometry&&o.geometry.dispose()}const a=t.get_edge_map();for(const o of a.values()){const c=[];o.points.forEach(f=>{c.push(new O(f.x*e,f.y*e,f.z*e))});const l=new pt().setFromPoints(c),h=new Fr(l,i);r.add(h)}}return s(),{group:r,updateEdges:s}}function v_(t,e,n,i=16777215,r=5){const s=t.get_position_map(),a=n.map(c=>s.get(c)).filter(c=>c!=null);if(a.length<2)return new vt;const o=new va(a);return Kc(new Map([[0,o]]),e,i,r)}function nl(t,e=1,n=16777215){const i=new Xr({color:n}),r=new vt;let s;for(const a of t.values()){s=[],a.points.forEach(h=>{s.push(new O(h.x*e,h.y*e,h.z*e))});const c=new pt().setFromPoints(s),l=new Fr(c,i);r.add(l)}return r}const Tn=new Ke,bn=new O,mi=new Dn,An=new O;function il(t,e=1,n=16777215,i=10){const r=t.size,s=Array.from(t.entries()),a=typeof i=="number"?Array(r).fill(i):i,o=new Zn(1,1,1),c=new Ci({color:n}),l=new qc(o,c,r);l.name="boxVertices",mi.identity();for(let f=0;f<r;f++){const u=s[f][1],d=a[f];bn.set(u.x*e,u.y*e,u.z*e),An.set(d,d,d),Tn.compose(bn,mi,An),l.setMatrixAt(f,Tn)}l.instanceMatrix.needsUpdate=!0;const h=new vt;return h.add(l),h}function x_(t,e=1,n=16777215,i=10){const r=t.get_node_ids_order(),s=r.length,a=t.get_position_map(),o=typeof i=="number"?Array(s).fill(i):i,c=new Zn(1,1,1),l=new Ci({color:n}),h=new qc(c,l,s);h.name="boxVertices",mi.identity();for(let d=0;d<s;d++){const _=a.get(r[d]),g=o[d];bn.set(_.x*e,_.y*e,_.z*e),An.set(g,g,g),Tn.compose(bn,mi,An),h.setMatrixAt(d,Tn)}h.instanceMatrix.needsUpdate=!0;const f=new vt;f.add(h);function u(d){if(d instanceof Float32Array)for(let _=0;_<s;_++)bn.set(d[_*3]*e,d[_*3+1]*e,d[_*3+2]*e),An.set(o[_],o[_],o[_]),Tn.compose(bn,mi,An),h.setMatrixAt(_,Tn);else for(let _=0;_<s;_++){const g=d.get(r[_]);bn.set(g.x*e,g.y*e,g.z*e),An.set(o[_],o[_],o[_]),Tn.compose(bn,mi,An),h.setMatrixAt(_,Tn)}h.instanceMatrix.needsUpdate=!0}return{group:f,updatePositions:u}}function M_(t,e=1,n=16777215,i=10){const r=t.get_position_map();return il(r,e,n,i)}function y_(t,e=16,n=16777215,i=10){let r;typeof i=="number"?r=Array(t.size).fill(i):r=i;const s=new vt,a=new Ci({color:n});let o=0;for(const[c,l]of t){const h=typeof r=="number"?r:r[o],f=2*h*Math.PI,u=Math.ceil(f/e),d=new Ca(h,h,10,u);d.name=String(c);const _=new wt(d,a);_.position.set(l.x,l.y,l.z),s.add(_),o+=1}return s}async function S_(t,e){const n=new Map;let i,r;for(let u of t.nodes.keys()){i=t.nodes.get(u);const d=i.data[e];r=typeof d=="number"?d:d!=null?Number(d):void 0,r!==void 0&&(n.has(r)?n.get(r).push(u):n.set(r,[u]))}const s=new Map,a=new Map;let o,c,l,h;for(let u of n.keys())o=n.get(u),c=await zr.SelectSubgraph(t,o),l=el(c,1),s.set(u,l),h=rl(c,.03),a.set(u,h);return{nodeGroups:s,EdgeGroups:a}}function rl(t,e,n=16777215){const i=new vt,r=new Xr({color:n});let s,a,o;for(let c of t.edges.values())if(Math.random()<=e){s=t.nodes.get(c.start).data.pos,a=t.nodes.get(c.end).data.pos,o=[],o.push(new O(s.x,s.y,s.z)),o.push(new O(a.x,a.y,a.z));const l=new pt().setFromPoints(o),h=new Fr(l,r);i.add(h)}return i}function E_(t,e,n){try{const i=t instanceof vt?t.children[0]:t,r=i==null?void 0:i.geometry;if(!(r!=null&&r.attributes))return;const s=r.attributes.customColor,a=s==null?void 0:s.array;if(!a||a.length===0)return;const o=new Oe(n),c=r.attributes.label,l=c==null?void 0:c.array;l&&l.length>0?e.forEach(h=>{for(let f=0;f<l.length;f++)if(l[f]===h){const u=f*3;u+2<a.length&&(a[u]=o.r,a[u+1]=o.g,a[u+2]=o.b);break}}):e.forEach(h=>{const f=h*3;f+2<a.length&&(a[f]=o.r,a[f+1]=o.g,a[f+2]=o.b)}),s&&(s.needsUpdate=!0)}catch{}}function T_(t){var e,n;try{const i=t instanceof vt?t.children[0]:t,r=(n=(e=i==null?void 0:i.geometry)==null?void 0:e.attributes)==null?void 0:n.customColor,s=r==null?void 0:r.array;if(!s||s.length===0)return;const a=(r==null?void 0:r.count)??Math.floor(s.length/3);for(let o=0;o<a;o++){const c=o*3;s[c]=1,s[c+1]=1,s[c+2]=1}r&&(r.needsUpdate=!0)}catch{}}const b_={DrawTHREEGraphVertices:el,DrawTHREEGraphVerticesMutable:p_,DrawTHREEGraphEdgesThick:m_,DrawTHREEGraphEdgesThin:__,DrawTHREEGraphEdgesThinMutable:g_,DrawThickPathFromNodeIds:v_,AddBoxBasedImaging:il,AddInModularityBasedPointGroups:S_,DrawThinEdgesFromEdgeMap:nl,DrawThickEdgesFromEdgeMap:tl,AddCylinderBasedImaging:y_,DrawSimplifiedEdges:rl,ChangeTheVertexColours:E_,ResetVertexColors:T_,DrawTHREEBoxBasedVertices:M_,DrawTHREEBoxBasedVerticesMutable:x_},ac={type:"change"},Da={type:"start"},sl={type:"end"},Er=new kr,oc=new En,A_=Math.cos(70*Nf.DEG2RAD),lt=new O,At=2*Math.PI,Ze={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},As=1e-6;class w_ extends a_{constructor(e,n=null){super(e,n),this.state=Ze.NONE,this.enabled=!0,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:_i.ROTATE,MIDDLE:_i.DOLLY,RIGHT:_i.PAN},this.touches={ONE:ui.ROTATE,TWO:ui.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new Dn,this._lastTargetPosition=new O,this._quat=new Dn().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new sc,this._sphericalDelta=new sc,this._scale=1,this._panOffset=new O,this._rotateStart=new we,this._rotateEnd=new we,this._rotateDelta=new we,this._panStart=new we,this._panEnd=new we,this._panDelta=new we,this._dollyStart=new we,this._dollyEnd=new we,this._dollyDelta=new we,this._dollyDirection=new O,this._mouse=new we,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=C_.bind(this),this._onPointerDown=R_.bind(this),this._onPointerUp=P_.bind(this),this._onContextMenu=O_.bind(this),this._onMouseWheel=I_.bind(this),this._onKeyDown=U_.bind(this),this._onTouchStart=N_.bind(this),this._onTouchMove=F_.bind(this),this._onMouseDown=D_.bind(this),this._onMouseMove=L_.bind(this),this._interceptControlDown=z_.bind(this),this._interceptControlUp=B_.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ac),this.update(),this.state=Ze.NONE}update(e=null){const n=this.object.position;lt.copy(n).sub(this.target),lt.applyQuaternion(this._quat),this._spherical.setFromVector3(lt),this.autoRotate&&this.state===Ze.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=At:i>Math.PI&&(i-=At),r<-Math.PI?r+=At:r>Math.PI&&(r-=At),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(lt.setFromSpherical(this._spherical),lt.applyQuaternion(this._quatInverse),n.copy(this.target).add(lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=lt.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const o=new O(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new O(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Er.origin.copy(this.object.position),Er.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Er.direction))<A_?this.object.lookAt(this.target):(oc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Er.intersectPlane(oc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>As||8*(1-this._lastQuaternion.dot(this.object.quaternion))>As||this._lastTargetPosition.distanceToSquared(this.target)>As?(this.dispatchEvent(ac),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?At/60*this.autoRotateSpeed*e:At/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){lt.setFromMatrixColumn(n,0),lt.multiplyScalar(-e),this._panOffset.add(lt)}_panUp(e,n){this.screenSpacePanning===!0?lt.setFromMatrixColumn(n,1):(lt.setFromMatrixColumn(n,0),lt.crossVectors(this.object.up,lt)),lt.multiplyScalar(e),this._panOffset.add(lt)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;lt.copy(r).sub(this.target);let s=lt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,a=i.width,o=i.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(At*this._rotateDelta.x/n.clientHeight),this._rotateUp(At*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(At*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-At*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(At*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-At*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(At*this._rotateDelta.x/n.clientHeight),this._rotateUp(At*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new we,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function R_(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function C_(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function P_(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(sl),this.state=Ze.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function D_(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case _i.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=Ze.DOLLY;break;case _i.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Ze.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Ze.ROTATE}break;case _i.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Ze.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Ze.PAN}break;default:this.state=Ze.NONE}this.state!==Ze.NONE&&this.dispatchEvent(Da)}function L_(t){switch(this.state){case Ze.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case Ze.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case Ze.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function I_(t){this.enabled===!1||this.enableZoom===!1||this.state!==Ze.NONE||(t.preventDefault(),this.dispatchEvent(Da),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(sl))}function U_(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function N_(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case ui.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=Ze.TOUCH_ROTATE;break;case ui.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=Ze.TOUCH_PAN;break;default:this.state=Ze.NONE}break;case 2:switch(this.touches.TWO){case ui.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=Ze.TOUCH_DOLLY_PAN;break;case ui.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=Ze.TOUCH_DOLLY_ROTATE;break;default:this.state=Ze.NONE}break;default:this.state=Ze.NONE}this.state!==Ze.NONE&&this.dispatchEvent(Da)}function F_(t){switch(this._trackPointer(t),this.state){case Ze.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case Ze.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case Ze.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case Ze.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=Ze.NONE}}function O_(t){this.enabled!==!1&&t.preventDefault()}function z_(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function B_(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class H_{constructor(e){this.canvas=e.canvas,this.width=e.width,this.height=e.height,this.geometryMap=new Map,this.materialMap=new Map,this.meshMap=new Map,this.controls,this.renderer,this.camera,this.scene,this.graphs=new Map}async init(){const e=performance.now();this.camera=new zt,this.scene=new j0,this.renderer=new Y0({canvas:this.canvas,antialias:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(16711935,0),this.scene.add(new s_(16777215));const n=new r_(16777215,1);n.position.set(0,10,0),this.scene.add(n),this.controls=new w_(this.camera,this.renderer.domElement),this.camera.position.set(0,100,100),this.controls.autoRotate=!0,this.controls.maxPolarAngle=Math.PI*.5,this.controls.maxDistance=1e4,this.controls.minDistance=10,this.controls.update();const i=performance.now();console.log("initialization has finished"),console.log(`Time to initialize ${i-e} milliseconds`)}addVisElement(e){this.scene.add(e)}rendercall(){this.renderer.render(this.scene,this.camera),this.controls.update()}}const V_={GraphDrawer3d:H_};async function k_(t,e){const n=new Map,i=new Map;let r;for(let l=0;l<t;l++)r=new Br({}),n.set(l,r);let s,a,o=0;for(let l=0;l<t;l++)for(let h=0;h<t;h++)l!=h&&(s=Math.random(),e>s&&(a=new qi(l,h,{}),i.set(o,a),o+=1));return new Ln(n,i)}const G_={GenerateErdosReyni_n_p:k_};function W_(t,e){const n=t.x-e.x,i=t.y-e.y,r=t.z-e.z;return n*n+i*i+r*r}function al(t){return["x","y","z"][t%3]}function _a(t,e){if(t.length===0)return null;if(t.length===1)return{item:t[0]};const n=al(e),i=[...t].sort((c,l)=>c.point[n]-l.point[n]),r=Math.floor(i.length/2),s=i[r],a=r>0?_a(i.slice(0,r),e+1):null,o=r+1<i.length?_a(i.slice(r+1),e+1):null;return{left:a??void 0,right:o??void 0,item:s}}function Gi(t,e,n,i,r){if(t===null)return;const s=al(i);W_(e,t.item.point)<=n&&r.push(t.item.nodeId);const o=e[s]-t.item.point[s],c=o*o;o<=0?(t.left&&Gi(t.left,e,n,i+1,r),t.right&&c<=n&&Gi(t.right,e,n,i+1,r)):(t.right&&Gi(t.right,e,n,i+1,r),t.left&&c<=n&&Gi(t.left,e,n,i+1,r))}function X_(t,e){const n=_a(t,0),i=e*e,r=new Map;for(const{point:s,nodeId:a}of t){const o=[];n&&Gi(n,s,i,0,o),r.set(a,o)}return r}class q_{constructor(){this.parent=new Map}find(e){return this.parent.has(e)||this.parent.set(e,e),this.parent.get(e)!==e&&this.parent.set(e,this.find(this.parent.get(e))),this.parent.get(e)}union(e,n){const i=this.find(e),r=this.find(n);i!==r&&this.parent.set(i,r)}}function $_(){return{cluster(t,e){const{distanceThreshold:n}=e,i=t.get_position_map(),r=[];for(const[d,_]of i)r.push({point:_,nodeId:d});if(r.length===0)return{nodeToCluster:new Map,clusterCentroids:new Map,clusterIds:[]};const s=X_(r,n),a=new q_;for(const[d,_]of s)for(const g of _)a.union(d,g);const o=new Map;let c=0;const l=new Map,h=new Map;for(const{nodeId:d}of r){const _=a.find(d);o.has(_)||o.set(_,c++);const g=o.get(_);l.set(d,g),h.has(g)||h.set(g,[]),h.get(g).push(d)}const f=new Map;for(const[d,_]of h){const g=_.map(m=>i.get(m));f.set(d,Ai.centroid(g))}const u=[...h.keys()];return{nodeToCluster:l,clusterCentroids:f,clusterIds:u}}}}async function ol(t,e){const{nodeToCluster:n,clusterCentroids:i,clusterIds:r}=e,s=new Map,a=new Map;for(const f of r){const u=i.get(f),d=new Br({pos:u});s.set(f,d)}const o=new Map,c=(f,u)=>f<=u?`${f},${u}`:`${u},${f}`;for(const[,f]of t.edges){const u=n.get(f.start),d=n.get(f.end);if(u===void 0||d===void 0||u===d)continue;const _=c(u,d);o.set(_,(o.get(_)??0)+1)}let l=0;for(const[f,u]of o){const[d,_]=f.split(",").map(Number);a.set(l++,new qi(d,_,{count:u}))}const h=new Ln(s,a);return await h.initialize(),h}async function Y_(t,e){const i=$_().cluster(t,e);return ol(t,i)}async function j_(t,e,n){const i=e.cluster(t,n);return ol(t,i)}const Z_={clusterByDistance:Y_,clusterByStrategy:j_};function K_(t,e,n,i){for(let r=0;r<e;r++){let s=0;for(let a=0;a<e;a++)s+=t[r*e+a]*n[a];i[r]=s}}function J_(t){let e=0;for(let i=0;i<t.length;i++)e+=t[i]*t[i];const n=Math.sqrt(e);if(n>0)for(let i=0;i<t.length;i++)t[i]/=n}var pe=1e-6,Ne=typeof Float32Array<"u"?Float32Array:Array,$t=Math.random,cl="zyx";function en(t){return t>=0?Math.round(t):t%.5===0?Math.floor(t):Math.round(t)}function Q_(t){Ne=t}var eg=Math.PI/180,tg=180/Math.PI;function ng(t){return t*eg}function ig(t){return t*tg}function rg(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:pe;return Math.abs(t-e)<=n*Math.max(1,Math.abs(t),Math.abs(e))}const sg=Object.freeze(Object.defineProperty({__proto__:null,ANGLE_ORDER:cl,get ARRAY_TYPE(){return Ne},EPSILON:pe,RANDOM:$t,equals:rg,round:en,setMatrixArrayType:Q_,toDegree:ig,toRadian:ng},Symbol.toStringTag,{value:"Module"}));function ag(){var t=new Ne(4);return Ne!=Float32Array&&(t[1]=0,t[2]=0),t[0]=1,t[3]=1,t}function og(t){var e=new Ne(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function cg(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function lg(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t}function hg(t,e,n,i){var r=new Ne(4);return r[0]=t,r[1]=e,r[2]=n,r[3]=i,r}function fg(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t}function dg(t,e){if(t===e){var n=e[1];t[1]=e[2],t[2]=n}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t}function ug(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*s-r*i;return a?(a=1/a,t[0]=s*a,t[1]=-i*a,t[2]=-r*a,t[3]=n*a,t):null}function pg(t,e){var n=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=n,t}function mg(t){return t[0]*t[3]-t[2]*t[1]}function ll(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],c=n[1],l=n[2],h=n[3];return t[0]=i*o+s*c,t[1]=r*o+a*c,t[2]=i*l+s*h,t[3]=r*l+a*h,t}function _g(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c+s*o,t[1]=r*c+a*o,t[2]=i*-o+s*c,t[3]=r*-o+a*c,t}function gg(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],c=n[1];return t[0]=i*o,t[1]=r*o,t[2]=s*c,t[3]=a*c,t}function vg(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=-n,t[3]=i,t}function xg(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t}function Mg(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function yg(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3])}function Sg(t,e,n,i){return t[2]=i[2]/i[0],n[0]=i[0],n[1]=i[1],n[3]=i[3]-t[2]*n[1],[t,e,n]}function Eg(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t}function hl(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t}function Tg(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function bg(t,e){var n=t[0],i=t[1],r=t[2],s=t[3],a=e[0],o=e[1],c=e[2],l=e[3];return Math.abs(n-a)<=pe*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(i-o)<=pe*Math.max(1,Math.abs(i),Math.abs(o))&&Math.abs(r-c)<=pe*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(s-l)<=pe*Math.max(1,Math.abs(s),Math.abs(l))}function Ag(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t}function wg(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t}var Rg=ll,Cg=hl;const Pg=Object.freeze(Object.defineProperty({__proto__:null,LDU:Sg,add:Eg,adjoint:pg,clone:og,copy:cg,create:ag,determinant:mg,equals:bg,exactEquals:Tg,frob:yg,fromRotation:vg,fromScaling:xg,fromValues:hg,identity:lg,invert:ug,mul:Rg,multiply:ll,multiplyScalar:Ag,multiplyScalarAndAdd:wg,rotate:_g,scale:gg,set:fg,str:Mg,sub:Cg,subtract:hl,transpose:dg},Symbol.toStringTag,{value:"Module"}));function Dg(){var t=new Ne(6);return Ne!=Float32Array&&(t[1]=0,t[2]=0,t[4]=0,t[5]=0),t[0]=1,t[3]=1,t}function Lg(t){var e=new Ne(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e}function Ig(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t}function Ug(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t}function Ng(t,e,n,i,r,s){var a=new Ne(6);return a[0]=t,a[1]=e,a[2]=n,a[3]=i,a[4]=r,a[5]=s,a}function Fg(t,e,n,i,r,s,a){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t}function Og(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=n*s-i*r;return c?(c=1/c,t[0]=s*c,t[1]=-i*c,t[2]=-r*c,t[3]=n*c,t[4]=(r*o-s*a)*c,t[5]=(i*a-n*o)*c,t):null}function zg(t){return t[0]*t[3]-t[1]*t[2]}function fl(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=n[0],h=n[1],f=n[2],u=n[3],d=n[4],_=n[5];return t[0]=i*l+s*h,t[1]=r*l+a*h,t[2]=i*f+s*u,t[3]=r*f+a*u,t[4]=i*d+s*_+o,t[5]=r*d+a*_+c,t}function Bg(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=Math.sin(n),h=Math.cos(n);return t[0]=i*h+s*l,t[1]=r*h+a*l,t[2]=i*-l+s*h,t[3]=r*-l+a*h,t[4]=o,t[5]=c,t}function Hg(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=n[0],h=n[1];return t[0]=i*l,t[1]=r*l,t[2]=s*h,t[3]=a*h,t[4]=o,t[5]=c,t}function Vg(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=n[0],h=n[1];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=i*l+s*h+o,t[5]=r*l+a*h+c,t}function kg(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=-n,t[3]=i,t[4]=0,t[5]=0,t}function Gg(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t[4]=0,t[5]=0,t}function Wg(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=e[0],t[5]=e[1],t}function Xg(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"}function qg(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+1)}function $g(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t}function dl(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t}function Yg(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t}function jg(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t}function Zg(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]}function Kg(t,e){var n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=e[0],l=e[1],h=e[2],f=e[3],u=e[4],d=e[5];return Math.abs(n-c)<=pe*Math.max(1,Math.abs(n),Math.abs(c))&&Math.abs(i-l)<=pe*Math.max(1,Math.abs(i),Math.abs(l))&&Math.abs(r-h)<=pe*Math.max(1,Math.abs(r),Math.abs(h))&&Math.abs(s-f)<=pe*Math.max(1,Math.abs(s),Math.abs(f))&&Math.abs(a-u)<=pe*Math.max(1,Math.abs(a),Math.abs(u))&&Math.abs(o-d)<=pe*Math.max(1,Math.abs(o),Math.abs(d))}var Jg=fl,Qg=dl;const ev=Object.freeze(Object.defineProperty({__proto__:null,add:$g,clone:Lg,copy:Ig,create:Dg,determinant:zg,equals:Kg,exactEquals:Zg,frob:qg,fromRotation:kg,fromScaling:Gg,fromTranslation:Wg,fromValues:Ng,identity:Ug,invert:Og,mul:Jg,multiply:fl,multiplyScalar:Yg,multiplyScalarAndAdd:jg,rotate:Bg,scale:Hg,set:Fg,str:Xg,sub:Qg,subtract:dl,translate:Vg},Symbol.toStringTag,{value:"Module"}));function ul(){var t=new Ne(9);return Ne!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function tv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t}function nv(t){var e=new Ne(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function iv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function rv(t,e,n,i,r,s,a,o,c){var l=new Ne(9);return l[0]=t,l[1]=e,l[2]=n,l[3]=i,l[4]=r,l[5]=s,l[6]=a,l[7]=o,l[8]=c,l}function sv(t,e,n,i,r,s,a,o,c,l){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=c,t[8]=l,t}function av(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function ov(t,e){if(t===e){var n=e[1],i=e[2],r=e[5];t[1]=e[3],t[2]=e[6],t[3]=n,t[5]=e[7],t[6]=i,t[7]=r}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t}function cv(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=h*a-o*l,u=-h*s+o*c,d=l*s-a*c,_=n*f+i*u+r*d;return _?(_=1/_,t[0]=f*_,t[1]=(-h*i+r*l)*_,t[2]=(o*i-r*a)*_,t[3]=u*_,t[4]=(h*n-r*c)*_,t[5]=(-o*n+r*s)*_,t[6]=d*_,t[7]=(-l*n+i*c)*_,t[8]=(a*n-i*s)*_,t):null}function lv(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t[0]=a*h-o*l,t[1]=r*l-i*h,t[2]=i*o-r*a,t[3]=o*c-s*h,t[4]=n*h-r*c,t[5]=r*s-n*o,t[6]=s*l-a*c,t[7]=i*c-n*l,t[8]=n*a-i*s,t}function hv(t){var e=t[0],n=t[1],i=t[2],r=t[3],s=t[4],a=t[5],o=t[6],c=t[7],l=t[8];return e*(l*s-a*c)+n*(-l*r+a*o)+i*(c*r-s*o)}function pl(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=e[8],u=n[0],d=n[1],_=n[2],g=n[3],m=n[4],p=n[5],T=n[6],S=n[7],v=n[8];return t[0]=u*i+d*a+_*l,t[1]=u*r+d*o+_*h,t[2]=u*s+d*c+_*f,t[3]=g*i+m*a+p*l,t[4]=g*r+m*o+p*h,t[5]=g*s+m*c+p*f,t[6]=T*i+S*a+v*l,t[7]=T*r+S*o+v*h,t[8]=T*s+S*c+v*f,t}function fv(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=e[8],u=n[0],d=n[1];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=o,t[5]=c,t[6]=u*i+d*a+l,t[7]=u*r+d*o+h,t[8]=u*s+d*c+f,t}function dv(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=e[8],u=Math.sin(n),d=Math.cos(n);return t[0]=d*i+u*a,t[1]=d*r+u*o,t[2]=d*s+u*c,t[3]=d*a-u*i,t[4]=d*o-u*r,t[5]=d*c-u*s,t[6]=l,t[7]=h,t[8]=f,t}function uv(t,e,n){var i=n[0],r=n[1];return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=r*e[3],t[4]=r*e[4],t[5]=r*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function pv(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=e[0],t[7]=e[1],t[8]=1,t}function mv(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=0,t[3]=-n,t[4]=i,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function _v(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=e[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function gv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t}function vv(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n+n,o=i+i,c=r+r,l=n*a,h=i*a,f=i*o,u=r*a,d=r*o,_=r*c,g=s*a,m=s*o,p=s*c;return t[0]=1-f-_,t[3]=h-p,t[6]=u+m,t[1]=h+p,t[4]=1-l-_,t[7]=d-g,t[2]=u-m,t[5]=d+g,t[8]=1-l-f,t}function xv(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],d=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=n*o-i*a,S=n*c-r*a,v=n*l-s*a,P=i*c-r*o,b=i*l-s*o,w=r*l-s*c,R=h*g-f*_,y=h*m-u*_,x=h*p-d*_,C=f*m-u*g,z=f*p-d*g,I=u*p-d*m,N=T*I-S*z+v*C+P*x-b*y+w*R;return N?(N=1/N,t[0]=(o*I-c*z+l*C)*N,t[1]=(c*x-a*I-l*y)*N,t[2]=(a*z-o*x+l*R)*N,t[3]=(r*z-i*I-s*C)*N,t[4]=(n*I-r*x+s*y)*N,t[5]=(i*x-n*z-s*R)*N,t[6]=(g*w-m*b+p*P)*N,t[7]=(m*v-_*w-p*S)*N,t[8]=(_*b-g*v+p*T)*N,t):null}function Mv(t,e,n){return t[0]=2/e,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/n,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t}function yv(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"}function Sv(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8])}function Ev(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t[8]=e[8]+n[8],t}function ml(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t[6]=e[6]-n[6],t[7]=e[7]-n[7],t[8]=e[8]-n[8],t}function Tv(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*n,t}function bv(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t[6]=e[6]+n[6]*i,t[7]=e[7]+n[7]*i,t[8]=e[8]+n[8]*i,t}function Av(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]}function wv(t,e){var n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=e[0],u=e[1],d=e[2],_=e[3],g=e[4],m=e[5],p=e[6],T=e[7],S=e[8];return Math.abs(n-f)<=pe*Math.max(1,Math.abs(n),Math.abs(f))&&Math.abs(i-u)<=pe*Math.max(1,Math.abs(i),Math.abs(u))&&Math.abs(r-d)<=pe*Math.max(1,Math.abs(r),Math.abs(d))&&Math.abs(s-_)<=pe*Math.max(1,Math.abs(s),Math.abs(_))&&Math.abs(a-g)<=pe*Math.max(1,Math.abs(a),Math.abs(g))&&Math.abs(o-m)<=pe*Math.max(1,Math.abs(o),Math.abs(m))&&Math.abs(c-p)<=pe*Math.max(1,Math.abs(c),Math.abs(p))&&Math.abs(l-T)<=pe*Math.max(1,Math.abs(l),Math.abs(T))&&Math.abs(h-S)<=pe*Math.max(1,Math.abs(h),Math.abs(S))}var Rv=pl,Cv=ml;const Pv=Object.freeze(Object.defineProperty({__proto__:null,add:Ev,adjoint:lv,clone:nv,copy:iv,create:ul,determinant:hv,equals:wv,exactEquals:Av,frob:Sv,fromMat2d:gv,fromMat4:tv,fromQuat:vv,fromRotation:mv,fromScaling:_v,fromTranslation:pv,fromValues:rv,identity:av,invert:cv,mul:Rv,multiply:pl,multiplyScalar:Tv,multiplyScalarAndAdd:bv,normalFromMat4:xv,projection:Mv,rotate:dv,scale:uv,set:sv,str:yv,sub:Cv,subtract:ml,translate:fv,transpose:ov},Symbol.toStringTag,{value:"Module"}));function Dv(){var t=new Ne(16);return Ne!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function Lv(t){var e=new Ne(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Iv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Uv(t,e,n,i,r,s,a,o,c,l,h,f,u,d,_,g){var m=new Ne(16);return m[0]=t,m[1]=e,m[2]=n,m[3]=i,m[4]=r,m[5]=s,m[6]=a,m[7]=o,m[8]=c,m[9]=l,m[10]=h,m[11]=f,m[12]=u,m[13]=d,m[14]=_,m[15]=g,m}function Nv(t,e,n,i,r,s,a,o,c,l,h,f,u,d,_,g,m){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=c,t[8]=l,t[9]=h,t[10]=f,t[11]=u,t[12]=d,t[13]=_,t[14]=g,t[15]=m,t}function _l(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Fv(t,e){if(t===e){var n=e[1],i=e[2],r=e[3],s=e[6],a=e[7],o=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=n,t[6]=e[9],t[7]=e[13],t[8]=i,t[9]=s,t[11]=e[14],t[12]=r,t[13]=a,t[14]=o}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function Ov(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],d=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=n*o-i*a,S=n*c-r*a,v=n*l-s*a,P=i*c-r*o,b=i*l-s*o,w=r*l-s*c,R=h*g-f*_,y=h*m-u*_,x=h*p-d*_,C=f*m-u*g,z=f*p-d*g,I=u*p-d*m,N=T*I-S*z+v*C+P*x-b*y+w*R;return N?(N=1/N,t[0]=(o*I-c*z+l*C)*N,t[1]=(r*z-i*I-s*C)*N,t[2]=(g*w-m*b+p*P)*N,t[3]=(u*b-f*w-d*P)*N,t[4]=(c*x-a*I-l*y)*N,t[5]=(n*I-r*x+s*y)*N,t[6]=(m*v-_*w-p*S)*N,t[7]=(h*w-u*v+d*S)*N,t[8]=(a*z-o*x+l*R)*N,t[9]=(i*x-n*z-s*R)*N,t[10]=(_*b-g*v+p*T)*N,t[11]=(f*v-h*b-d*T)*N,t[12]=(o*y-a*C-c*R)*N,t[13]=(n*C-i*y+r*R)*N,t[14]=(g*S-_*P-m*T)*N,t[15]=(h*P-f*S+u*T)*N,t):null}function zv(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],d=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=n*o-i*a,S=n*c-r*a,v=n*l-s*a,P=i*c-r*o,b=i*l-s*o,w=r*l-s*c,R=h*g-f*_,y=h*m-u*_,x=h*p-d*_,C=f*m-u*g,z=f*p-d*g,I=u*p-d*m;return t[0]=o*I-c*z+l*C,t[1]=r*z-i*I-s*C,t[2]=g*w-m*b+p*P,t[3]=u*b-f*w-d*P,t[4]=c*x-a*I-l*y,t[5]=n*I-r*x+s*y,t[6]=m*v-_*w-p*S,t[7]=h*w-u*v+d*S,t[8]=a*z-o*x+l*R,t[9]=i*x-n*z-s*R,t[10]=_*b-g*v+p*T,t[11]=f*v-h*b-d*T,t[12]=o*y-a*C-c*R,t[13]=n*C-i*y+r*R,t[14]=g*S-_*P-m*T,t[15]=h*P-f*S+u*T,t}function Bv(t){var e=t[0],n=t[1],i=t[2],r=t[3],s=t[4],a=t[5],o=t[6],c=t[7],l=t[8],h=t[9],f=t[10],u=t[11],d=t[12],_=t[13],g=t[14],m=t[15],p=e*a-n*s,T=e*o-i*s,S=n*o-i*a,v=l*_-h*d,P=l*g-f*d,b=h*g-f*_,w=e*b-n*P+i*v,R=s*b-a*P+o*v,y=l*S-h*T+f*p,x=d*S-_*T+g*p;return c*w-r*R+m*y-u*x}function gl(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=e[8],u=e[9],d=e[10],_=e[11],g=e[12],m=e[13],p=e[14],T=e[15],S=n[0],v=n[1],P=n[2],b=n[3];return t[0]=S*i+v*o+P*f+b*g,t[1]=S*r+v*c+P*u+b*m,t[2]=S*s+v*l+P*d+b*p,t[3]=S*a+v*h+P*_+b*T,S=n[4],v=n[5],P=n[6],b=n[7],t[4]=S*i+v*o+P*f+b*g,t[5]=S*r+v*c+P*u+b*m,t[6]=S*s+v*l+P*d+b*p,t[7]=S*a+v*h+P*_+b*T,S=n[8],v=n[9],P=n[10],b=n[11],t[8]=S*i+v*o+P*f+b*g,t[9]=S*r+v*c+P*u+b*m,t[10]=S*s+v*l+P*d+b*p,t[11]=S*a+v*h+P*_+b*T,S=n[12],v=n[13],P=n[14],b=n[15],t[12]=S*i+v*o+P*f+b*g,t[13]=S*r+v*c+P*u+b*m,t[14]=S*s+v*l+P*d+b*p,t[15]=S*a+v*h+P*_+b*T,t}function Hv(t,e,n){var i=n[0],r=n[1],s=n[2],a,o,c,l,h,f,u,d,_,g,m,p;return e===t?(t[12]=e[0]*i+e[4]*r+e[8]*s+e[12],t[13]=e[1]*i+e[5]*r+e[9]*s+e[13],t[14]=e[2]*i+e[6]*r+e[10]*s+e[14],t[15]=e[3]*i+e[7]*r+e[11]*s+e[15]):(a=e[0],o=e[1],c=e[2],l=e[3],h=e[4],f=e[5],u=e[6],d=e[7],_=e[8],g=e[9],m=e[10],p=e[11],t[0]=a,t[1]=o,t[2]=c,t[3]=l,t[4]=h,t[5]=f,t[6]=u,t[7]=d,t[8]=_,t[9]=g,t[10]=m,t[11]=p,t[12]=a*i+h*r+_*s+e[12],t[13]=o*i+f*r+g*s+e[13],t[14]=c*i+u*r+m*s+e[14],t[15]=l*i+d*r+p*s+e[15]),t}function Vv(t,e,n){var i=n[0],r=n[1],s=n[2];return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function kv(t,e,n,i){var r=i[0],s=i[1],a=i[2],o=Math.sqrt(r*r+s*s+a*a),c,l,h,f,u,d,_,g,m,p,T,S,v,P,b,w,R,y,x,C,z,I,N,X;return o<pe?null:(o=1/o,r*=o,s*=o,a*=o,c=Math.sin(n),l=Math.cos(n),h=1-l,f=e[0],u=e[1],d=e[2],_=e[3],g=e[4],m=e[5],p=e[6],T=e[7],S=e[8],v=e[9],P=e[10],b=e[11],w=r*r*h+l,R=s*r*h+a*c,y=a*r*h-s*c,x=r*s*h-a*c,C=s*s*h+l,z=a*s*h+r*c,I=r*a*h+s*c,N=s*a*h-r*c,X=a*a*h+l,t[0]=f*w+g*R+S*y,t[1]=u*w+m*R+v*y,t[2]=d*w+p*R+P*y,t[3]=_*w+T*R+b*y,t[4]=f*x+g*C+S*z,t[5]=u*x+m*C+v*z,t[6]=d*x+p*C+P*z,t[7]=_*x+T*C+b*z,t[8]=f*I+g*N+S*X,t[9]=u*I+m*N+v*X,t[10]=d*I+p*N+P*X,t[11]=_*I+T*N+b*X,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function Gv(t,e,n){var i=Math.sin(n),r=Math.cos(n),s=e[4],a=e[5],o=e[6],c=e[7],l=e[8],h=e[9],f=e[10],u=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=s*r+l*i,t[5]=a*r+h*i,t[6]=o*r+f*i,t[7]=c*r+u*i,t[8]=l*r-s*i,t[9]=h*r-a*i,t[10]=f*r-o*i,t[11]=u*r-c*i,t}function Wv(t,e,n){var i=Math.sin(n),r=Math.cos(n),s=e[0],a=e[1],o=e[2],c=e[3],l=e[8],h=e[9],f=e[10],u=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*r-l*i,t[1]=a*r-h*i,t[2]=o*r-f*i,t[3]=c*r-u*i,t[8]=s*i+l*r,t[9]=a*i+h*r,t[10]=o*i+f*r,t[11]=c*i+u*r,t}function Xv(t,e,n){var i=Math.sin(n),r=Math.cos(n),s=e[0],a=e[1],o=e[2],c=e[3],l=e[4],h=e[5],f=e[6],u=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*r+l*i,t[1]=a*r+h*i,t[2]=o*r+f*i,t[3]=c*r+u*i,t[4]=l*r-s*i,t[5]=h*r-a*i,t[6]=f*r-o*i,t[7]=u*r-c*i,t}function qv(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t}function $v(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Yv(t,e,n){var i=n[0],r=n[1],s=n[2],a=Math.sqrt(i*i+r*r+s*s),o,c,l;return a<pe?null:(a=1/a,i*=a,r*=a,s*=a,o=Math.sin(e),c=Math.cos(e),l=1-c,t[0]=i*i*l+c,t[1]=r*i*l+s*o,t[2]=s*i*l-r*o,t[3]=0,t[4]=i*r*l-s*o,t[5]=r*r*l+c,t[6]=s*r*l+i*o,t[7]=0,t[8]=i*s*l+r*o,t[9]=r*s*l-i*o,t[10]=s*s*l+c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}function jv(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=n,t[7]=0,t[8]=0,t[9]=-n,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Zv(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=0,t[2]=-n,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=n,t[9]=0,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Kv(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=0,t[3]=0,t[4]=-n,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function vl(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=i+i,c=r+r,l=s+s,h=i*o,f=i*c,u=i*l,d=r*c,_=r*l,g=s*l,m=a*o,p=a*c,T=a*l;return t[0]=1-(d+g),t[1]=f+T,t[2]=u-p,t[3]=0,t[4]=f-T,t[5]=1-(h+g),t[6]=_+m,t[7]=0,t[8]=u+p,t[9]=_-m,t[10]=1-(h+d),t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function Jv(t,e){var n=new Ne(3),i=-e[0],r=-e[1],s=-e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=i*i+r*r+s*s+a*a;return f>0?(n[0]=(o*a+h*i+c*s-l*r)*2/f,n[1]=(c*a+h*r+l*i-o*s)*2/f,n[2]=(l*a+h*s+o*r-c*i)*2/f):(n[0]=(o*a+h*i+c*s-l*r)*2,n[1]=(c*a+h*r+l*i-o*s)*2,n[2]=(l*a+h*s+o*r-c*i)*2),vl(t,e,n),t}function xl(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t}function Ml(t,e){var n=e[0],i=e[1],r=e[2],s=e[4],a=e[5],o=e[6],c=e[8],l=e[9],h=e[10];return t[0]=Math.sqrt(n*n+i*i+r*r),t[1]=Math.sqrt(s*s+a*a+o*o),t[2]=Math.sqrt(c*c+l*l+h*h),t}function yl(t,e){var n=new Ne(3);Ml(n,e);var i=1/n[0],r=1/n[1],s=1/n[2],a=e[0]*i,o=e[1]*r,c=e[2]*s,l=e[4]*i,h=e[5]*r,f=e[6]*s,u=e[8]*i,d=e[9]*r,_=e[10]*s,g=a+h+_,m=0;return g>0?(m=Math.sqrt(g+1)*2,t[3]=.25*m,t[0]=(f-d)/m,t[1]=(u-c)/m,t[2]=(o-l)/m):a>h&&a>_?(m=Math.sqrt(1+a-h-_)*2,t[3]=(f-d)/m,t[0]=.25*m,t[1]=(o+l)/m,t[2]=(u+c)/m):h>_?(m=Math.sqrt(1+h-a-_)*2,t[3]=(u-c)/m,t[0]=(o+l)/m,t[1]=.25*m,t[2]=(f+d)/m):(m=Math.sqrt(1+_-a-h)*2,t[3]=(o-l)/m,t[0]=(u+c)/m,t[1]=(f+d)/m,t[2]=.25*m),t}function Qv(t,e,n,i){e[0]=i[12],e[1]=i[13],e[2]=i[14];var r=i[0],s=i[1],a=i[2],o=i[4],c=i[5],l=i[6],h=i[8],f=i[9],u=i[10];n[0]=Math.sqrt(r*r+s*s+a*a),n[1]=Math.sqrt(o*o+c*c+l*l),n[2]=Math.sqrt(h*h+f*f+u*u);var d=1/n[0],_=1/n[1],g=1/n[2],m=r*d,p=s*_,T=a*g,S=o*d,v=c*_,P=l*g,b=h*d,w=f*_,R=u*g,y=m+v+R,x=0;return y>0?(x=Math.sqrt(y+1)*2,t[3]=.25*x,t[0]=(P-w)/x,t[1]=(b-T)/x,t[2]=(p-S)/x):m>v&&m>R?(x=Math.sqrt(1+m-v-R)*2,t[3]=(P-w)/x,t[0]=.25*x,t[1]=(p+S)/x,t[2]=(b+T)/x):v>R?(x=Math.sqrt(1+v-m-R)*2,t[3]=(b-T)/x,t[0]=(p+S)/x,t[1]=.25*x,t[2]=(P+w)/x):(x=Math.sqrt(1+R-m-v)*2,t[3]=(p-S)/x,t[0]=(b+T)/x,t[1]=(P+w)/x,t[2]=.25*x),t}function ex(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3],c=r+r,l=s+s,h=a+a,f=r*c,u=r*l,d=r*h,_=s*l,g=s*h,m=a*h,p=o*c,T=o*l,S=o*h,v=i[0],P=i[1],b=i[2];return t[0]=(1-(_+m))*v,t[1]=(u+S)*v,t[2]=(d-T)*v,t[3]=0,t[4]=(u-S)*P,t[5]=(1-(f+m))*P,t[6]=(g+p)*P,t[7]=0,t[8]=(d+T)*b,t[9]=(g-p)*b,t[10]=(1-(f+_))*b,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function tx(t,e,n,i,r){var s=e[0],a=e[1],o=e[2],c=e[3],l=s+s,h=a+a,f=o+o,u=s*l,d=s*h,_=s*f,g=a*h,m=a*f,p=o*f,T=c*l,S=c*h,v=c*f,P=i[0],b=i[1],w=i[2],R=r[0],y=r[1],x=r[2],C=(1-(g+p))*P,z=(d+v)*P,I=(_-S)*P,N=(d-v)*b,X=(1-(u+p))*b,G=(m+T)*b,K=(_+S)*w,k=(m-T)*w,te=(1-(u+g))*w;return t[0]=C,t[1]=z,t[2]=I,t[3]=0,t[4]=N,t[5]=X,t[6]=G,t[7]=0,t[8]=K,t[9]=k,t[10]=te,t[11]=0,t[12]=n[0]+R-(C*R+N*y+K*x),t[13]=n[1]+y-(z*R+X*y+k*x),t[14]=n[2]+x-(I*R+G*y+te*x),t[15]=1,t}function nx(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n+n,o=i+i,c=r+r,l=n*a,h=i*a,f=i*o,u=r*a,d=r*o,_=r*c,g=s*a,m=s*o,p=s*c;return t[0]=1-f-_,t[1]=h+p,t[2]=u-m,t[3]=0,t[4]=h-p,t[5]=1-l-_,t[6]=d+g,t[7]=0,t[8]=u+m,t[9]=d-g,t[10]=1-l-f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function ix(t,e,n,i,r,s,a){var o=1/(n-e),c=1/(r-i),l=1/(s-a);return t[0]=s*2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s*2*c,t[6]=0,t[7]=0,t[8]=(n+e)*o,t[9]=(r+i)*c,t[10]=(a+s)*l,t[11]=-1,t[12]=0,t[13]=0,t[14]=a*s*2*l,t[15]=0,t}function Sl(t,e,n,i,r){var s=1/Math.tan(e/2);if(t[0]=s/n,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,r!=null&&r!==1/0){var a=1/(i-r);t[10]=(r+i)*a,t[14]=2*r*i*a}else t[10]=-1,t[14]=-2*i;return t}var rx=Sl;function sx(t,e,n,i,r){var s=1/Math.tan(e/2);if(t[0]=s/n,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,r!=null&&r!==1/0){var a=1/(i-r);t[10]=r*a,t[14]=r*i*a}else t[10]=-1,t[14]=-i;return t}function ax(t,e,n,i){var r=Math.tan(e.upDegrees*Math.PI/180),s=Math.tan(e.downDegrees*Math.PI/180),a=Math.tan(e.leftDegrees*Math.PI/180),o=Math.tan(e.rightDegrees*Math.PI/180),c=2/(a+o),l=2/(r+s);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=l,t[6]=0,t[7]=0,t[8]=-((a-o)*c*.5),t[9]=(r-s)*l*.5,t[10]=i/(n-i),t[11]=-1,t[12]=0,t[13]=0,t[14]=i*n/(n-i),t[15]=0,t}function El(t,e,n,i,r,s,a){var o=1/(e-n),c=1/(i-r),l=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*l,t[11]=0,t[12]=(e+n)*o,t[13]=(r+i)*c,t[14]=(a+s)*l,t[15]=1,t}var ox=El;function cx(t,e,n,i,r,s,a){var o=1/(e-n),c=1/(i-r),l=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=l,t[11]=0,t[12]=(e+n)*o,t[13]=(r+i)*c,t[14]=s*l,t[15]=1,t}function lx(t,e,n,i){var r,s,a,o,c,l,h,f,u,d,_=e[0],g=e[1],m=e[2],p=i[0],T=i[1],S=i[2],v=n[0],P=n[1],b=n[2];return Math.abs(_-v)<pe&&Math.abs(g-P)<pe&&Math.abs(m-b)<pe?_l(t):(h=_-v,f=g-P,u=m-b,d=1/Math.sqrt(h*h+f*f+u*u),h*=d,f*=d,u*=d,r=T*u-S*f,s=S*h-p*u,a=p*f-T*h,d=Math.sqrt(r*r+s*s+a*a),d?(d=1/d,r*=d,s*=d,a*=d):(r=0,s=0,a=0),o=f*a-u*s,c=u*r-h*a,l=h*s-f*r,d=Math.sqrt(o*o+c*c+l*l),d?(d=1/d,o*=d,c*=d,l*=d):(o=0,c=0,l=0),t[0]=r,t[1]=o,t[2]=h,t[3]=0,t[4]=s,t[5]=c,t[6]=f,t[7]=0,t[8]=a,t[9]=l,t[10]=u,t[11]=0,t[12]=-(r*_+s*g+a*m),t[13]=-(o*_+c*g+l*m),t[14]=-(h*_+f*g+u*m),t[15]=1,t)}function hx(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=i[0],c=i[1],l=i[2],h=r-n[0],f=s-n[1],u=a-n[2],d=h*h+f*f+u*u;d>0&&(d=1/Math.sqrt(d),h*=d,f*=d,u*=d);var _=c*u-l*f,g=l*h-o*u,m=o*f-c*h;return d=_*_+g*g+m*m,d>0&&(d=1/Math.sqrt(d),_*=d,g*=d,m*=d),t[0]=_,t[1]=g,t[2]=m,t[3]=0,t[4]=f*m-u*g,t[5]=u*_-h*m,t[6]=h*g-f*_,t[7]=0,t[8]=h,t[9]=f,t[10]=u,t[11]=0,t[12]=r,t[13]=s,t[14]=a,t[15]=1,t}function fx(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"}function dx(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8]+t[9]*t[9]+t[10]*t[10]+t[11]*t[11]+t[12]*t[12]+t[13]*t[13]+t[14]*t[14]+t[15]*t[15])}function ux(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t[8]=e[8]+n[8],t[9]=e[9]+n[9],t[10]=e[10]+n[10],t[11]=e[11]+n[11],t[12]=e[12]+n[12],t[13]=e[13]+n[13],t[14]=e[14]+n[14],t[15]=e[15]+n[15],t}function Tl(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t[6]=e[6]-n[6],t[7]=e[7]-n[7],t[8]=e[8]-n[8],t[9]=e[9]-n[9],t[10]=e[10]-n[10],t[11]=e[11]-n[11],t[12]=e[12]-n[12],t[13]=e[13]-n[13],t[14]=e[14]-n[14],t[15]=e[15]-n[15],t}function px(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*n,t[9]=e[9]*n,t[10]=e[10]*n,t[11]=e[11]*n,t[12]=e[12]*n,t[13]=e[13]*n,t[14]=e[14]*n,t[15]=e[15]*n,t}function mx(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t[6]=e[6]+n[6]*i,t[7]=e[7]+n[7]*i,t[8]=e[8]+n[8]*i,t[9]=e[9]+n[9]*i,t[10]=e[10]+n[10]*i,t[11]=e[11]+n[11]*i,t[12]=e[12]+n[12]*i,t[13]=e[13]+n[13]*i,t[14]=e[14]+n[14]*i,t[15]=e[15]+n[15]*i,t}function _x(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]}function gx(t,e){var n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],f=t[9],u=t[10],d=t[11],_=t[12],g=t[13],m=t[14],p=t[15],T=e[0],S=e[1],v=e[2],P=e[3],b=e[4],w=e[5],R=e[6],y=e[7],x=e[8],C=e[9],z=e[10],I=e[11],N=e[12],X=e[13],G=e[14],K=e[15];return Math.abs(n-T)<=pe*Math.max(1,Math.abs(n),Math.abs(T))&&Math.abs(i-S)<=pe*Math.max(1,Math.abs(i),Math.abs(S))&&Math.abs(r-v)<=pe*Math.max(1,Math.abs(r),Math.abs(v))&&Math.abs(s-P)<=pe*Math.max(1,Math.abs(s),Math.abs(P))&&Math.abs(a-b)<=pe*Math.max(1,Math.abs(a),Math.abs(b))&&Math.abs(o-w)<=pe*Math.max(1,Math.abs(o),Math.abs(w))&&Math.abs(c-R)<=pe*Math.max(1,Math.abs(c),Math.abs(R))&&Math.abs(l-y)<=pe*Math.max(1,Math.abs(l),Math.abs(y))&&Math.abs(h-x)<=pe*Math.max(1,Math.abs(h),Math.abs(x))&&Math.abs(f-C)<=pe*Math.max(1,Math.abs(f),Math.abs(C))&&Math.abs(u-z)<=pe*Math.max(1,Math.abs(u),Math.abs(z))&&Math.abs(d-I)<=pe*Math.max(1,Math.abs(d),Math.abs(I))&&Math.abs(_-N)<=pe*Math.max(1,Math.abs(_),Math.abs(N))&&Math.abs(g-X)<=pe*Math.max(1,Math.abs(g),Math.abs(X))&&Math.abs(m-G)<=pe*Math.max(1,Math.abs(m),Math.abs(G))&&Math.abs(p-K)<=pe*Math.max(1,Math.abs(p),Math.abs(K))}var vx=gl,xx=Tl;const Mx=Object.freeze(Object.defineProperty({__proto__:null,add:ux,adjoint:zv,clone:Lv,copy:Iv,create:Dv,decompose:Qv,determinant:Bv,equals:gx,exactEquals:_x,frob:dx,fromQuat:nx,fromQuat2:Jv,fromRotation:Yv,fromRotationTranslation:vl,fromRotationTranslationScale:ex,fromRotationTranslationScaleOrigin:tx,fromScaling:$v,fromTranslation:qv,fromValues:Uv,fromXRotation:jv,fromYRotation:Zv,fromZRotation:Kv,frustum:ix,getRotation:yl,getScaling:Ml,getTranslation:xl,identity:_l,invert:Ov,lookAt:lx,mul:vx,multiply:gl,multiplyScalar:px,multiplyScalarAndAdd:mx,ortho:ox,orthoNO:El,orthoZO:cx,perspective:rx,perspectiveFromFieldOfView:ax,perspectiveNO:Sl,perspectiveZO:sx,rotate:kv,rotateX:Gv,rotateY:Wv,rotateZ:Xv,scale:Vv,set:Nv,str:fx,sub:xx,subtract:Tl,targetTo:hx,translate:Hv,transpose:Fv},Symbol.toStringTag,{value:"Module"}));function La(){var t=new Ne(3);return Ne!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function yx(t){var e=new Ne(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function bl(t){var e=t[0],n=t[1],i=t[2];return Math.sqrt(e*e+n*n+i*i)}function ga(t,e,n){var i=new Ne(3);return i[0]=t,i[1]=e,i[2]=n,i}function Sx(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function Ex(t,e,n,i){return t[0]=e,t[1]=n,t[2]=i,t}function Tx(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t}function Al(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t}function wl(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t}function Rl(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t}function bx(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t}function Ax(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t}function wx(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t}function Rx(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t}function Cx(t,e){return t[0]=en(e[0]),t[1]=en(e[1]),t[2]=en(e[2]),t}function Px(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t}function Dx(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t}function Cl(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return Math.sqrt(n*n+i*i+r*r)}function Pl(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return n*n+i*i+r*r}function Dl(t){var e=t[0],n=t[1],i=t[2];return e*e+n*n+i*i}function Lx(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function Ix(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t}function Ll(t,e){var n=e[0],i=e[1],r=e[2],s=n*n+i*i+r*r;return s>0&&(s=1/Math.sqrt(s)),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t}function qr(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Dr(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],c=n[2];return t[0]=r*c-s*o,t[1]=s*a-i*c,t[2]=i*o-r*a,t}function Ux(t,e,n,i){var r=e[0],s=e[1],a=e[2];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t[2]=a+i*(n[2]-a),t}function Nx(t,e,n,i){var r=Math.acos(Math.min(Math.max(qr(e,n),-1),1)),s=Math.sin(r),a=Math.sin((1-i)*r)/s,o=Math.sin(i*r)/s;return t[0]=a*e[0]+o*n[0],t[1]=a*e[1]+o*n[1],t[2]=a*e[2]+o*n[2],t}function Fx(t,e,n,i,r,s){var a=s*s,o=a*(2*s-3)+1,c=a*(s-2)+s,l=a*(s-1),h=a*(3-2*s);return t[0]=e[0]*o+n[0]*c+i[0]*l+r[0]*h,t[1]=e[1]*o+n[1]*c+i[1]*l+r[1]*h,t[2]=e[2]*o+n[2]*c+i[2]*l+r[2]*h,t}function Ox(t,e,n,i,r,s){var a=1-s,o=a*a,c=s*s,l=o*a,h=3*s*o,f=3*c*a,u=c*s;return t[0]=e[0]*l+n[0]*h+i[0]*f+r[0]*u,t[1]=e[1]*l+n[1]*h+i[1]*f+r[1]*u,t[2]=e[2]*l+n[2]*h+i[2]*f+r[2]*u,t}function zx(t,e){e=e===void 0?1:e;var n=$t()*2*Math.PI,i=$t()*2-1,r=Math.sqrt(1-i*i)*e;return t[0]=Math.cos(n)*r,t[1]=Math.sin(n)*r,t[2]=i*e,t}function Bx(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[3]*i+n[7]*r+n[11]*s+n[15];return a=a||1,t[0]=(n[0]*i+n[4]*r+n[8]*s+n[12])/a,t[1]=(n[1]*i+n[5]*r+n[9]*s+n[13])/a,t[2]=(n[2]*i+n[6]*r+n[10]*s+n[14])/a,t}function Hx(t,e,n){var i=e[0],r=e[1],s=e[2];return t[0]=i*n[0]+r*n[3]+s*n[6],t[1]=i*n[1]+r*n[4]+s*n[7],t[2]=i*n[2]+r*n[5]+s*n[8],t}function Vx(t,e,n){var i=n[0],r=n[1],s=n[2],a=n[3],o=e[0],c=e[1],l=e[2],h=r*l-s*c,f=s*o-i*l,u=i*c-r*o;return h=h+h,f=f+f,u=u+u,t[0]=o+a*h+r*u-s*f,t[1]=c+a*f+s*h-i*u,t[2]=l+a*u+i*f-r*h,t}function kx(t,e,n,i){var r=[],s=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],s[0]=r[0],s[1]=r[1]*Math.cos(i)-r[2]*Math.sin(i),s[2]=r[1]*Math.sin(i)+r[2]*Math.cos(i),t[0]=s[0]+n[0],t[1]=s[1]+n[1],t[2]=s[2]+n[2],t}function Gx(t,e,n,i){var r=[],s=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],s[0]=r[2]*Math.sin(i)+r[0]*Math.cos(i),s[1]=r[1],s[2]=r[2]*Math.cos(i)-r[0]*Math.sin(i),t[0]=s[0]+n[0],t[1]=s[1]+n[1],t[2]=s[2]+n[2],t}function Wx(t,e,n,i){var r=[],s=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],s[0]=r[0]*Math.cos(i)-r[1]*Math.sin(i),s[1]=r[0]*Math.sin(i)+r[1]*Math.cos(i),s[2]=r[2],t[0]=s[0]+n[0],t[1]=s[1]+n[1],t[2]=s[2]+n[2],t}function Xx(t,e){var n=t[0],i=t[1],r=t[2],s=e[0],a=e[1],o=e[2],c=Math.sqrt((n*n+i*i+r*r)*(s*s+a*a+o*o)),l=c&&qr(t,e)/c;return Math.acos(Math.min(Math.max(l,-1),1))}function qx(t){return t[0]=0,t[1]=0,t[2]=0,t}function $x(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"}function Yx(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}function jx(t,e){var n=t[0],i=t[1],r=t[2],s=e[0],a=e[1],o=e[2];return Math.abs(n-s)<=pe*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(i-a)<=pe*Math.max(1,Math.abs(i),Math.abs(a))&&Math.abs(r-o)<=pe*Math.max(1,Math.abs(r),Math.abs(o))}var Zx=Al,Kx=wl,Jx=Rl,Qx=Cl,e1=Pl,Il=bl,t1=Dl,n1=(function(){var t=La();return function(e,n,i,r,s,a){var o,c;for(n||(n=3),i||(i=0),r?c=Math.min(r*n+i,e.length):c=e.length,o=i;o<c;o+=n)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2];return e}})();const i1=Object.freeze(Object.defineProperty({__proto__:null,add:Tx,angle:Xx,bezier:Ox,ceil:bx,clone:yx,copy:Sx,create:La,cross:Dr,dist:Qx,distance:Cl,div:Jx,divide:Rl,dot:qr,equals:jx,exactEquals:Yx,floor:Ax,forEach:n1,fromValues:ga,hermite:Fx,inverse:Ix,len:Il,length:bl,lerp:Ux,max:Rx,min:wx,mul:Kx,multiply:wl,negate:Lx,normalize:Ll,random:zx,rotateX:kx,rotateY:Gx,rotateZ:Wx,round:Cx,scale:Px,scaleAndAdd:Dx,set:Ex,slerp:Nx,sqrDist:e1,sqrLen:t1,squaredDistance:Pl,squaredLength:Dl,str:$x,sub:Zx,subtract:Al,transformMat3:Hx,transformMat4:Bx,transformQuat:Vx,zero:qx},Symbol.toStringTag,{value:"Module"}));function Ul(){var t=new Ne(4);return Ne!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function Nl(t){var e=new Ne(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function Fl(t,e,n,i){var r=new Ne(4);return r[0]=t,r[1]=e,r[2]=n,r[3]=i,r}function Ol(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function zl(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t}function Bl(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t}function Hl(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t}function Vl(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t[3]=e[3]*n[3],t}function kl(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t[3]=e[3]/n[3],t}function r1(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t[3]=Math.ceil(e[3]),t}function s1(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t[3]=Math.floor(e[3]),t}function a1(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t[3]=Math.min(e[3],n[3]),t}function o1(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t[3]=Math.max(e[3],n[3]),t}function c1(t,e){return t[0]=en(e[0]),t[1]=en(e[1]),t[2]=en(e[2]),t[3]=en(e[3]),t}function Gl(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t}function l1(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t}function Wl(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2],s=e[3]-t[3];return Math.sqrt(n*n+i*i+r*r+s*s)}function Xl(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2],s=e[3]-t[3];return n*n+i*i+r*r+s*s}function Ia(t){var e=t[0],n=t[1],i=t[2],r=t[3];return Math.sqrt(e*e+n*n+i*i+r*r)}function Ua(t){var e=t[0],n=t[1],i=t[2],r=t[3];return e*e+n*n+i*i+r*r}function h1(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t}function f1(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t}function ql(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s;return a>0&&(a=1/Math.sqrt(a)),t[0]=n*a,t[1]=i*a,t[2]=r*a,t[3]=s*a,t}function Na(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function d1(t,e,n,i){var r=n[0]*i[1]-n[1]*i[0],s=n[0]*i[2]-n[2]*i[0],a=n[0]*i[3]-n[3]*i[0],o=n[1]*i[2]-n[2]*i[1],c=n[1]*i[3]-n[3]*i[1],l=n[2]*i[3]-n[3]*i[2],h=e[0],f=e[1],u=e[2],d=e[3];return t[0]=f*l-u*c+d*o,t[1]=-(h*l)+u*a-d*s,t[2]=h*c-f*a+d*r,t[3]=-(h*o)+f*s-u*r,t}function $l(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t[2]=a+i*(n[2]-a),t[3]=o+i*(n[3]-o),t}function u1(t,e){e=e===void 0?1:e;var n,i,r,s,a,o,c;c=$t(),n=c*2-1,i=(4*$t()-2)*Math.sqrt(c*-c+c),a=n*n+i*i,c=$t(),r=c*2-1,s=(4*$t()-2)*Math.sqrt(c*-c+c),o=r*r+s*s;var l=Math.sqrt((1-a)/o);return t[0]=e*n,t[1]=e*i,t[2]=e*r*l,t[3]=e*s*l,t}function p1(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3];return t[0]=n[0]*i+n[4]*r+n[8]*s+n[12]*a,t[1]=n[1]*i+n[5]*r+n[9]*s+n[13]*a,t[2]=n[2]*i+n[6]*r+n[10]*s+n[14]*a,t[3]=n[3]*i+n[7]*r+n[11]*s+n[15]*a,t}function m1(t,e,n){var i=n[0],r=n[1],s=n[2],a=n[3],o=e[0],c=e[1],l=e[2],h=r*l-s*c,f=s*o-i*l,u=i*c-r*o;return h=h+h,f=f+f,u=u+u,t[0]=o+a*h+r*u-s*f,t[1]=c+a*f+s*h-i*u,t[2]=l+a*u+i*f-r*h,t[3]=e[3],t}function _1(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function g1(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function Yl(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function v1(t,e){var n=t[0],i=t[1],r=t[2],s=t[3],a=e[0],o=e[1],c=e[2],l=e[3];return Math.abs(n-a)<=pe*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(i-o)<=pe*Math.max(1,Math.abs(i),Math.abs(o))&&Math.abs(r-c)<=pe*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(s-l)<=pe*Math.max(1,Math.abs(s),Math.abs(l))}var x1=Hl,M1=Vl,y1=kl,S1=Wl,E1=Xl,T1=Ia,b1=Ua,A1=(function(){var t=Ul();return function(e,n,i,r,s,a){var o,c;for(n||(n=4),i||(i=0),r?c=Math.min(r*n+i,e.length):c=e.length,o=i;o<c;o+=n)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],t[3]=e[o+3],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2],e[o+3]=t[3];return e}})();const w1=Object.freeze(Object.defineProperty({__proto__:null,add:Bl,ceil:r1,clone:Nl,copy:Ol,create:Ul,cross:d1,dist:S1,distance:Wl,div:y1,divide:kl,dot:Na,equals:v1,exactEquals:Yl,floor:s1,forEach:A1,fromValues:Fl,inverse:f1,len:T1,length:Ia,lerp:$l,max:o1,min:a1,mul:M1,multiply:Vl,negate:h1,normalize:ql,random:u1,round:c1,scale:Gl,scaleAndAdd:l1,set:zl,sqrDist:E1,sqrLen:b1,squaredDistance:Xl,squaredLength:Ua,str:g1,sub:x1,subtract:Hl,transformMat4:p1,transformQuat:m1,zero:_1},Symbol.toStringTag,{value:"Module"}));function Or(){var t=new Ne(4);return Ne!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function R1(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function jl(t,e,n){n=n*.5;var i=Math.sin(n);return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=Math.cos(n),t}function C1(t,e){var n=Math.acos(e[3])*2,i=Math.sin(n/2);return i>pe?(t[0]=e[0]/i,t[1]=e[1]/i,t[2]=e[2]/i):(t[0]=1,t[1]=0,t[2]=0),n}function P1(t,e){var n=Oa(t,e);return Math.acos(2*n*n-1)}function Zl(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],c=n[1],l=n[2],h=n[3];return t[0]=i*h+a*o+r*l-s*c,t[1]=r*h+a*c+s*o-i*l,t[2]=s*h+a*l+i*c-r*o,t[3]=a*h-i*o-r*c-s*l,t}function Kl(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c+a*o,t[1]=r*c+s*o,t[2]=s*c-r*o,t[3]=a*c-i*o,t}function Jl(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c-s*o,t[1]=r*c+a*o,t[2]=s*c+i*o,t[3]=a*c-r*o,t}function Ql(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c+r*o,t[1]=r*c-i*o,t[2]=s*c+a*o,t[3]=a*c-s*o,t}function D1(t,e){var n=e[0],i=e[1],r=e[2];return t[0]=n,t[1]=i,t[2]=r,t[3]=Math.sqrt(Math.abs(1-n*n-i*i-r*r)),t}function eh(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=Math.sqrt(n*n+i*i+r*r),o=Math.exp(s),c=a>0?o*Math.sin(a)/a:0;return t[0]=n*c,t[1]=i*c,t[2]=r*c,t[3]=o*Math.cos(a),t}function th(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=Math.sqrt(n*n+i*i+r*r),o=a>0?Math.atan2(a,s)/a:0;return t[0]=n*o,t[1]=i*o,t[2]=r*o,t[3]=.5*Math.log(n*n+i*i+r*r+s*s),t}function L1(t,e,n){return th(t,e),ih(t,t,n),eh(t,t),t}function Lr(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3],c=n[0],l=n[1],h=n[2],f=n[3],u,d,_,g,m;return d=r*c+s*l+a*h+o*f,d<0&&(d=-d,c=-c,l=-l,h=-h,f=-f),1-d>pe?(u=Math.acos(d),_=Math.sin(u),g=Math.sin((1-i)*u)/_,m=Math.sin(i*u)/_):(g=1-i,m=i),t[0]=g*r+m*c,t[1]=g*s+m*l,t[2]=g*a+m*h,t[3]=g*o+m*f,t}function I1(t){var e=$t(),n=$t(),i=$t(),r=Math.sqrt(1-e),s=Math.sqrt(e);return t[0]=r*Math.sin(2*Math.PI*n),t[1]=r*Math.cos(2*Math.PI*n),t[2]=s*Math.sin(2*Math.PI*i),t[3]=s*Math.cos(2*Math.PI*i),t}function U1(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s,o=a?1/a:0;return t[0]=-n*o,t[1]=-i*o,t[2]=-r*o,t[3]=s*o,t}function N1(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t}function nh(t,e){var n=e[0]+e[4]+e[8],i;if(n>0)i=Math.sqrt(n+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{var r=0;e[4]>e[0]&&(r=1),e[8]>e[r*3+r]&&(r=2);var s=(r+1)%3,a=(r+2)%3;i=Math.sqrt(e[r*3+r]-e[s*3+s]-e[a*3+a]+1),t[r]=.5*i,i=.5/i,t[3]=(e[s*3+a]-e[a*3+s])*i,t[s]=(e[s*3+r]+e[r*3+s])*i,t[a]=(e[a*3+r]+e[r*3+a])*i}return t}function F1(t,e,n,i){var r=arguments.length>4&&arguments[4]!==void 0?arguments[4]:cl,s=Math.PI/360;e*=s,i*=s,n*=s;var a=Math.sin(e),o=Math.cos(e),c=Math.sin(n),l=Math.cos(n),h=Math.sin(i),f=Math.cos(i);switch(r){case"xyz":t[0]=a*l*f+o*c*h,t[1]=o*c*f-a*l*h,t[2]=o*l*h+a*c*f,t[3]=o*l*f-a*c*h;break;case"xzy":t[0]=a*l*f-o*c*h,t[1]=o*c*f-a*l*h,t[2]=o*l*h+a*c*f,t[3]=o*l*f+a*c*h;break;case"yxz":t[0]=a*l*f+o*c*h,t[1]=o*c*f-a*l*h,t[2]=o*l*h-a*c*f,t[3]=o*l*f+a*c*h;break;case"yzx":t[0]=a*l*f+o*c*h,t[1]=o*c*f+a*l*h,t[2]=o*l*h-a*c*f,t[3]=o*l*f-a*c*h;break;case"zxy":t[0]=a*l*f-o*c*h,t[1]=o*c*f+a*l*h,t[2]=o*l*h+a*c*f,t[3]=o*l*f-a*c*h;break;case"zyx":t[0]=a*l*f-o*c*h,t[1]=o*c*f+a*l*h,t[2]=o*l*h-a*c*f,t[3]=o*l*f+a*c*h;break;default:throw new Error("Unknown angle order "+r)}return t}function O1(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}var z1=Nl,B1=Fl,Fa=Ol,H1=zl,V1=Bl,k1=Zl,ih=Gl,Oa=Na,G1=$l,za=Ia,W1=za,Ba=Ua,X1=Ba,Ha=ql,q1=Yl;function $1(t,e){return Math.abs(Na(t,e))>=1-pe}var Y1=(function(){var t=La(),e=ga(1,0,0),n=ga(0,1,0);return function(i,r,s){var a=qr(r,s);return a<-.999999?(Dr(t,e,r),Il(t)<1e-6&&Dr(t,n,r),Ll(t,t),jl(i,t,Math.PI),i):a>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(Dr(t,r,s),i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=1+a,Ha(i,i))}})(),j1=(function(){var t=Or(),e=Or();return function(n,i,r,s,a,o){return Lr(t,i,a,o),Lr(e,r,s,o),Lr(n,t,e,2*o*(1-o)),n}})(),Z1=(function(){var t=ul();return function(e,n,i,r){return t[0]=i[0],t[3]=i[1],t[6]=i[2],t[1]=r[0],t[4]=r[1],t[7]=r[2],t[2]=-n[0],t[5]=-n[1],t[8]=-n[2],Ha(e,nh(e,t))}})();const K1=Object.freeze(Object.defineProperty({__proto__:null,add:V1,calculateW:D1,clone:z1,conjugate:N1,copy:Fa,create:Or,dot:Oa,equals:$1,exactEquals:q1,exp:eh,fromEuler:F1,fromMat3:nh,fromValues:B1,getAngle:P1,getAxisAngle:C1,identity:R1,invert:U1,len:W1,length:za,lerp:G1,ln:th,mul:k1,multiply:Zl,normalize:Ha,pow:L1,random:I1,rotateX:Kl,rotateY:Jl,rotateZ:Ql,rotationTo:Y1,scale:ih,set:H1,setAxes:Z1,setAxisAngle:jl,slerp:Lr,sqlerp:j1,sqrLen:X1,squaredLength:Ba,str:O1},Symbol.toStringTag,{value:"Module"}));function J1(){var t=new Ne(8);return Ne!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0),t[3]=1,t}function Q1(t){var e=new Ne(8);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e}function eM(t,e,n,i,r,s,a,o){var c=new Ne(8);return c[0]=t,c[1]=e,c[2]=n,c[3]=i,c[4]=r,c[5]=s,c[6]=a,c[7]=o,c}function tM(t,e,n,i,r,s,a){var o=new Ne(8);o[0]=t,o[1]=e,o[2]=n,o[3]=i;var c=r*.5,l=s*.5,h=a*.5;return o[4]=c*i+l*n-h*e,o[5]=l*i+h*t-c*n,o[6]=h*i+c*e-l*t,o[7]=-c*t-l*e-h*n,o}function rh(t,e,n){var i=n[0]*.5,r=n[1]*.5,s=n[2]*.5,a=e[0],o=e[1],c=e[2],l=e[3];return t[0]=a,t[1]=o,t[2]=c,t[3]=l,t[4]=i*l+r*c-s*o,t[5]=r*l+s*a-i*c,t[6]=s*l+i*o-r*a,t[7]=-i*a-r*o-s*c,t}function nM(t,e){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=e[0]*.5,t[5]=e[1]*.5,t[6]=e[2]*.5,t[7]=0,t}function iM(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=0,t[5]=0,t[6]=0,t[7]=0,t}function rM(t,e){var n=Or();yl(n,e);var i=new Ne(3);return xl(i,e),rh(t,n,i),t}function sh(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t}function sM(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t}function aM(t,e,n,i,r,s,a,o,c){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=c,t}var oM=Fa;function cM(t,e){return t[0]=e[4],t[1]=e[5],t[2]=e[6],t[3]=e[7],t}var lM=Fa;function hM(t,e){return t[4]=e[0],t[5]=e[1],t[6]=e[2],t[7]=e[3],t}function fM(t,e){var n=e[4],i=e[5],r=e[6],s=e[7],a=-e[0],o=-e[1],c=-e[2],l=e[3];return t[0]=(n*l+s*a+i*c-r*o)*2,t[1]=(i*l+s*o+r*a-n*c)*2,t[2]=(r*l+s*c+n*o-i*a)*2,t}function dM(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0]*.5,c=n[1]*.5,l=n[2]*.5,h=e[4],f=e[5],u=e[6],d=e[7];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=a*o+r*l-s*c+h,t[5]=a*c+s*o-i*l+f,t[6]=a*l+i*c-r*o+u,t[7]=-i*o-r*c-s*l+d,t}function uM(t,e,n){var i=-e[0],r=-e[1],s=-e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=o*a+h*i+c*s-l*r,u=c*a+h*r+l*i-o*s,d=l*a+h*s+o*r-c*i,_=h*a-o*i-c*r-l*s;return Kl(t,e,n),i=t[0],r=t[1],s=t[2],a=t[3],t[4]=f*a+_*i+u*s-d*r,t[5]=u*a+_*r+d*i-f*s,t[6]=d*a+_*s+f*r-u*i,t[7]=_*a-f*i-u*r-d*s,t}function pM(t,e,n){var i=-e[0],r=-e[1],s=-e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=o*a+h*i+c*s-l*r,u=c*a+h*r+l*i-o*s,d=l*a+h*s+o*r-c*i,_=h*a-o*i-c*r-l*s;return Jl(t,e,n),i=t[0],r=t[1],s=t[2],a=t[3],t[4]=f*a+_*i+u*s-d*r,t[5]=u*a+_*r+d*i-f*s,t[6]=d*a+_*s+f*r-u*i,t[7]=_*a-f*i-u*r-d*s,t}function mM(t,e,n){var i=-e[0],r=-e[1],s=-e[2],a=e[3],o=e[4],c=e[5],l=e[6],h=e[7],f=o*a+h*i+c*s-l*r,u=c*a+h*r+l*i-o*s,d=l*a+h*s+o*r-c*i,_=h*a-o*i-c*r-l*s;return Ql(t,e,n),i=t[0],r=t[1],s=t[2],a=t[3],t[4]=f*a+_*i+u*s-d*r,t[5]=u*a+_*r+d*i-f*s,t[6]=d*a+_*s+f*r-u*i,t[7]=_*a-f*i-u*r-d*s,t}function _M(t,e,n){var i=n[0],r=n[1],s=n[2],a=n[3],o=e[0],c=e[1],l=e[2],h=e[3];return t[0]=o*a+h*i+c*s-l*r,t[1]=c*a+h*r+l*i-o*s,t[2]=l*a+h*s+o*r-c*i,t[3]=h*a-o*i-c*r-l*s,o=e[4],c=e[5],l=e[6],h=e[7],t[4]=o*a+h*i+c*s-l*r,t[5]=c*a+h*r+l*i-o*s,t[6]=l*a+h*s+o*r-c*i,t[7]=h*a-o*i-c*r-l*s,t}function gM(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],c=n[1],l=n[2],h=n[3];return t[0]=i*h+a*o+r*l-s*c,t[1]=r*h+a*c+s*o-i*l,t[2]=s*h+a*l+i*c-r*o,t[3]=a*h-i*o-r*c-s*l,o=n[4],c=n[5],l=n[6],h=n[7],t[4]=i*h+a*o+r*l-s*c,t[5]=r*h+a*c+s*o-i*l,t[6]=s*h+a*l+i*c-r*o,t[7]=a*h-i*o-r*c-s*l,t}function vM(t,e,n,i){if(Math.abs(i)<pe)return sh(t,e);var r=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);i=i*.5;var s=Math.sin(i),a=s*n[0]/r,o=s*n[1]/r,c=s*n[2]/r,l=Math.cos(i),h=e[0],f=e[1],u=e[2],d=e[3];t[0]=h*l+d*a+f*c-u*o,t[1]=f*l+d*o+u*a-h*c,t[2]=u*l+d*c+h*o-f*a,t[3]=d*l-h*a-f*o-u*c;var _=e[4],g=e[5],m=e[6],p=e[7];return t[4]=_*l+p*a+g*c-m*o,t[5]=g*l+p*o+m*a-_*c,t[6]=m*l+p*c+_*o-g*a,t[7]=p*l-_*a-g*o-m*c,t}function xM(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t}function ah(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=n[4],c=n[5],l=n[6],h=n[7],f=e[4],u=e[5],d=e[6],_=e[7],g=n[0],m=n[1],p=n[2],T=n[3];return t[0]=i*T+a*g+r*p-s*m,t[1]=r*T+a*m+s*g-i*p,t[2]=s*T+a*p+i*m-r*g,t[3]=a*T-i*g-r*m-s*p,t[4]=i*h+a*o+r*l-s*c+f*T+_*g+u*p-d*m,t[5]=r*h+a*c+s*o-i*l+u*T+_*m+d*g-f*p,t[6]=s*h+a*l+i*c-r*o+d*T+_*p+f*m-u*g,t[7]=a*h-i*o-r*c-s*l+_*T-f*g-u*m-d*p,t}var MM=ah;function yM(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t}var oh=Oa;function SM(t,e,n,i){var r=1-i;return oh(e,n)<0&&(i=-i),t[0]=e[0]*r+n[0]*i,t[1]=e[1]*r+n[1]*i,t[2]=e[2]*r+n[2]*i,t[3]=e[3]*r+n[3]*i,t[4]=e[4]*r+n[4]*i,t[5]=e[5]*r+n[5]*i,t[6]=e[6]*r+n[6]*i,t[7]=e[7]*r+n[7]*i,t}function EM(t,e){var n=$r(e);return t[0]=-e[0]/n,t[1]=-e[1]/n,t[2]=-e[2]/n,t[3]=e[3]/n,t[4]=-e[4]/n,t[5]=-e[5]/n,t[6]=-e[6]/n,t[7]=e[7]/n,t}function TM(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t[4]=-e[4],t[5]=-e[5],t[6]=-e[6],t[7]=e[7],t}var ch=za,bM=ch,$r=Ba,AM=$r;function wM(t,e){var n=$r(e);if(n>0){n=Math.sqrt(n);var i=e[0]/n,r=e[1]/n,s=e[2]/n,a=e[3]/n,o=e[4],c=e[5],l=e[6],h=e[7],f=i*o+r*c+s*l+a*h;t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=(o-i*f)/n,t[5]=(c-r*f)/n,t[6]=(l-s*f)/n,t[7]=(h-a*f)/n}return t}function RM(t){return"quat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+")"}function CM(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]}function PM(t,e){var n=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=e[0],f=e[1],u=e[2],d=e[3],_=e[4],g=e[5],m=e[6],p=e[7];return Math.abs(n-h)<=pe*Math.max(1,Math.abs(n),Math.abs(h))&&Math.abs(i-f)<=pe*Math.max(1,Math.abs(i),Math.abs(f))&&Math.abs(r-u)<=pe*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(s-d)<=pe*Math.max(1,Math.abs(s),Math.abs(d))&&Math.abs(a-_)<=pe*Math.max(1,Math.abs(a),Math.abs(_))&&Math.abs(o-g)<=pe*Math.max(1,Math.abs(o),Math.abs(g))&&Math.abs(c-m)<=pe*Math.max(1,Math.abs(c),Math.abs(m))&&Math.abs(l-p)<=pe*Math.max(1,Math.abs(l),Math.abs(p))}const DM=Object.freeze(Object.defineProperty({__proto__:null,add:xM,clone:Q1,conjugate:TM,copy:sh,create:J1,dot:oh,equals:PM,exactEquals:CM,fromMat4:rM,fromRotation:iM,fromRotationTranslation:rh,fromRotationTranslationValues:tM,fromTranslation:nM,fromValues:eM,getDual:cM,getReal:oM,getTranslation:fM,identity:sM,invert:EM,len:bM,length:ch,lerp:SM,mul:MM,multiply:ah,normalize:wM,rotateAroundAxis:vM,rotateByQuatAppend:_M,rotateByQuatPrepend:gM,rotateX:uM,rotateY:pM,rotateZ:mM,scale:yM,set:aM,setDual:hM,setReal:lM,sqrLen:AM,squaredLength:$r,str:RM,translate:dM},Symbol.toStringTag,{value:"Module"}));function lh(){var t=new Ne(2);return Ne!=Float32Array&&(t[0]=0,t[1]=0),t}function LM(t){var e=new Ne(2);return e[0]=t[0],e[1]=t[1],e}function IM(t,e){var n=new Ne(2);return n[0]=t,n[1]=e,n}function UM(t,e){return t[0]=e[0],t[1]=e[1],t}function NM(t,e,n){return t[0]=e,t[1]=n,t}function FM(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}function hh(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t}function fh(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t}function dh(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t}function OM(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t}function zM(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t}function BM(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t}function HM(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t}function VM(t,e){return t[0]=en(e[0]),t[1]=en(e[1]),t}function kM(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t}function GM(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t}function uh(t,e){var n=e[0]-t[0],i=e[1]-t[1];return Math.sqrt(n*n+i*i)}function ph(t,e){var n=e[0]-t[0],i=e[1]-t[1];return n*n+i*i}function mh(t){var e=t[0],n=t[1];return Math.sqrt(e*e+n*n)}function _h(t){var e=t[0],n=t[1];return e*e+n*n}function WM(t,e){return t[0]=-e[0],t[1]=-e[1],t}function XM(t,e){return t[0]=1/e[0],t[1]=1/e[1],t}function qM(t,e){var n=e[0],i=e[1],r=n*n+i*i;return r>0&&(r=1/Math.sqrt(r)),t[0]=e[0]*r,t[1]=e[1]*r,t}function $M(t,e){return t[0]*e[0]+t[1]*e[1]}function YM(t,e,n){var i=e[0]*n[1]-e[1]*n[0];return t[0]=t[1]=0,t[2]=i,t}function jM(t,e,n,i){var r=e[0],s=e[1];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t}function ZM(t,e){e=e===void 0?1:e;var n=$t()*2*Math.PI;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t}function KM(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r,t[1]=n[1]*i+n[3]*r,t}function JM(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r+n[4],t[1]=n[1]*i+n[3]*r+n[5],t}function QM(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[3]*r+n[6],t[1]=n[1]*i+n[4]*r+n[7],t}function ey(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[4]*r+n[12],t[1]=n[1]*i+n[5]*r+n[13],t}function ty(t,e,n,i){var r=e[0]-n[0],s=e[1]-n[1],a=Math.sin(i),o=Math.cos(i);return t[0]=r*o-s*a+n[0],t[1]=r*a+s*o+n[1],t}function ny(t,e){var n=t[0],i=t[1],r=e[0],s=e[1];return Math.abs(Math.atan2(i*r-n*s,n*r+i*s))}function iy(t,e){var n=t[0],i=t[1],r=e[0],s=e[1];return Math.atan2(n*s-i*r,n*r+i*s)}function ry(t){return t[0]=0,t[1]=0,t}function sy(t){return"vec2("+t[0]+", "+t[1]+")"}function ay(t,e){return t[0]===e[0]&&t[1]===e[1]}function oy(t,e){var n=t[0],i=t[1],r=e[0],s=e[1];return Math.abs(n-r)<=pe*Math.max(1,Math.abs(n),Math.abs(r))&&Math.abs(i-s)<=pe*Math.max(1,Math.abs(i),Math.abs(s))}var cy=mh,ly=hh,hy=fh,fy=dh,dy=uh,uy=ph,py=_h,my=(function(){var t=lh();return function(e,n,i,r,s,a){var o,c;for(n||(n=2),i||(i=0),r?c=Math.min(r*n+i,e.length):c=e.length,o=i;o<c;o+=n)t[0]=e[o],t[1]=e[o+1],s(t,t,a),e[o]=t[0],e[o+1]=t[1];return e}})();const _y=Object.freeze(Object.defineProperty({__proto__:null,add:FM,angle:ny,ceil:OM,clone:LM,copy:UM,create:lh,cross:YM,dist:dy,distance:uh,div:fy,divide:dh,dot:$M,equals:oy,exactEquals:ay,floor:zM,forEach:my,fromValues:IM,inverse:XM,len:cy,length:mh,lerp:jM,max:HM,min:BM,mul:hy,multiply:fh,negate:WM,normalize:qM,random:ZM,rotate:ty,round:VM,scale:kM,scaleAndAdd:GM,set:NM,signedAngle:iy,sqrDist:uy,sqrLen:py,squaredDistance:ph,squaredLength:_h,str:sy,sub:ly,subtract:hh,transformMat2:KM,transformMat2d:JM,transformMat3:QM,transformMat4:ey,zero:ry},Symbol.toStringTag,{value:"Module"})),Va=Object.freeze(Object.defineProperty({__proto__:null,glMatrix:sg,mat2:Pg,mat2d:ev,mat3:Pv,mat4:Mx,quat:K1,quat2:DM,vec2:_y,vec3:i1,vec4:w1},Symbol.toStringTag,{value:"Module"})),{vec3:Mt}=Va,gy={simulationBound:100,cohesionValue:1,repulsionValue:1,centerPull:.1,iterationsPerStep:1};function vy(t,e={}){const n={...gy,...e},i=t.get_node_ids_order(),r=i.length,s=t.get_adjacency(),a=new Map;i.forEach((u,d)=>a.set(u,d));const o=new Float32Array(r*3);for(let u=0;u<r;u++)o[u*3]=Math.random()*n.simulationBound,o[u*3+1]=Math.random()*n.simulationBound,o[u*3+2]=Math.random()*n.simulationBound;const c={force:Mt.create(),diff:Mt.create(),neighborAvg:Mt.create(),posI:Mt.create(),posJ:Mt.create()};function l(u){const d=Math.max(1,n.iterationsPerStep);for(let _=0;_<d;_++)for(let g=0;g<r;g++){Mt.set(c.posI,o[g*3],o[g*3+1],o[g*3+2]),Mt.set(c.force,0,0,0);const m=s.get(i[g])??[];if(m.length>0){c.neighborAvg[0]=0,c.neighborAvg[1]=0,c.neighborAvg[2]=0;for(const p of m){const T=a.get(p);T!==void 0&&(c.neighborAvg[0]+=o[T*3],c.neighborAvg[1]+=o[T*3+1],c.neighborAvg[2]+=o[T*3+2])}c.neighborAvg[0]/=m.length,c.neighborAvg[1]/=m.length,c.neighborAvg[2]/=m.length,Mt.subtract(c.diff,c.neighborAvg,c.posI),Mt.scale(c.diff,c.diff,n.cohesionValue),Mt.add(c.force,c.force,c.diff)}for(let p=0;p<r;p++){if(p===g)continue;Mt.set(c.posJ,o[p*3],o[p*3+1],o[p*3+2]),Mt.subtract(c.diff,c.posJ,c.posI);const T=Mt.squaredLength(c.diff);T<1e-10||(Mt.scale(c.diff,c.diff,n.repulsionValue/T),Mt.subtract(c.force,c.force,c.diff))}c.force[0]-=n.centerPull*c.posI[0],c.force[1]-=n.centerPull*c.posI[1],c.force[2]-=n.centerPull*c.posI[2],o[g*3]+=c.force[0],o[g*3+1]+=c.force[1],o[g*3+2]+=c.force[2]}}function h(){return o}function f(){const u=new Map;for(let d=0;d<r;d++)u.set(i[d],new Rt(o[d*3],o[d*3+1],o[d*3+2]));return u}return{step:l,getPositions:h,getPositionMap:f}}const{vec3:ln}=Va,xy={simulationBound:100,iterationsPerStep:50,centerPull:.04,scaleBound:150,useSchedule:!0,learningRate:.08,tMax:80,eps:.01,scheduleSpeed:.25};async function My(t,e,n){const i=e.length,r=new Map;for(let a=0;a<i;a++){const o=e[a],c=await zr.Dijkstra(t,o);r.set(o,c)}const s=[];for(let a=0;a<i;a++)for(let o=a+1;o<i;o++){const c=r.get(e[a]);if(!c)continue;const l=c.get(e[o]);if(l===void 0||l<=0)continue;const h=1/(l*l);s.push({i:a,j:o,d:l,w:h})}return s}async function yy(t,e={}){const n={...xy,...e},i=t.get_node_ids_order(),r=i.length,s=new Map;i.forEach((v,P)=>s.set(v,P));const a=await My(t,i);a.length;let o=1/0,c=-1/0;for(const v of a)v.w<o&&(o=v.w),v.w>c&&(c=v.w);(o<=0||c<=0)&&(o=1),c<=0&&(c=1);const l=1/o,h=n.eps/c,f=n.tMax>1?Math.log(l/h)/(n.tMax-1):0,u=v=>v>=n.tMax?h:l*Math.exp(-f*v),d=new Float32Array(r*3);for(let v=0;v<r;v++)d[v*3]=(Math.random()*2-1)*n.simulationBound,d[v*3+1]=(Math.random()*2-1)*n.simulationBound,d[v*3+2]=(Math.random()*2-1)*n.simulationBound;let _=0;const g={pi:ln.create(),pj:ln.create(),diff:ln.create(),centroid:ln.create()},m=1e-10;function p(v){const P=Math.max(1,n.iterationsPerStep),b=n.useSchedule?u(_):n.learningRate;_+=n.scheduleSpeed;for(let w=0;w<P&&a.length!==0;w++){const R=a[Math.floor(Math.random()*a.length)],{i:y,j:x,d:C,w:z}=R;ln.set(g.pi,d[y*3],d[y*3+1],d[y*3+2]),ln.set(g.pj,d[x*3],d[x*3+1],d[x*3+2]),ln.subtract(g.diff,g.pj,g.pi);const I=Math.max(ln.length(g.diff),m);let N=b*z;N>1&&(N=1);const X=N*(I-C)/(2*I);ln.scale(g.diff,g.diff,X),d[y*3]-=g.diff[0],d[y*3+1]-=g.diff[1],d[y*3+2]-=g.diff[2],d[x*3]+=g.diff[0],d[x*3+1]+=g.diff[1],d[x*3+2]+=g.diff[2]}if(n.centerPull>0)for(let w=0;w<r;w++)d[w*3]-=n.centerPull*d[w*3],d[w*3+1]-=n.centerPull*d[w*3+1],d[w*3+2]-=n.centerPull*d[w*3+2];if(n.scaleBound>0&&r>0){g.centroid[0]=0,g.centroid[1]=0,g.centroid[2]=0;for(let R=0;R<r;R++)g.centroid[0]+=d[R*3],g.centroid[1]+=d[R*3+1],g.centroid[2]+=d[R*3+2];g.centroid[0]/=r,g.centroid[1]/=r,g.centroid[2]/=r;let w=0;for(let R=0;R<r;R++){d[R*3]-=g.centroid[0],d[R*3+1]-=g.centroid[1],d[R*3+2]-=g.centroid[2];const y=Math.sqrt(d[R*3]*d[R*3]+d[R*3+1]*d[R*3+1]+d[R*3+2]*d[R*3+2]);y>w&&(w=y)}if(w>n.scaleBound){const R=n.scaleBound/w;for(let y=0;y<r*3;y++)d[y]*=R}}}function T(){return d}function S(){const v=new Map;for(let P=0;P<r;P++)v.set(i[P],new Rt(d[P*3],d[P*3+1],d[P*3+2]));return v}return{step:p,getPositions:T,getPositionMap:S}}exports.Constructors=lc;exports.Drawing=pc;exports.Geometry=Ai;exports.Graph=Ln;exports.GraphDrawer=V_;exports.GraphMethods=zr;exports.Hierarchy=Z_;exports.Models=G_;exports.Point=Rt;exports.SampleData=Wh;exports.ThreeWrapper=b_;exports.Utilities=St;exports.createKamadaKawai3D=vy;exports.createStressSGD3D=yy;exports.glMatrix=Va;exports.matrixVectorMultiply=K_;exports.normalizeVector=J_;
//# sourceMappingURL=pgl.js.map
