"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});class Edge{constructor(e,n,i){this.start=e,this.end=n,this.data={...i}}}class Graph{constructor(e,n){this.nodes=e,this.edges=n}printData(){const e="This is a graph with "+this.nodes.size+" nodes and "+this.edges.size+" edges";console.log(e)}async initialize(){await this.constructAdjacencyList()}static async create(e,n){const i=new Graph(e,n);return await i.initialize(),i}async constructAdjacencyList(){this.edges.forEach(e=>{const n=e.start,i=e.end;this.nodes.get(n)&&this.nodes.get(n).neighbours.push(i),this.nodes.get(i)&&this.nodes.get(i).neighbours.push(n)});for(const e of this.nodes.keys()){const n=this.nodes.get(e).neighbours,i=[...new Set(n)],r=i.indexOf(e);r>-1&&i.splice(r,1),this.nodes.get(e).neighbours=i}}add_node(e,n){this.nodes.set(e,n)}add_edge(e,n,i){const r=new Edge(e,n,i);this.edges.set(this.edges.size,r);const a=this.nodes.get(e),s=this.nodes.get(n);a&&a.neighbours.push(n),s&&s.neighbours.push(e)}get_adjacency(){const e=new Map;for(const n of this.nodes.keys())e.set(n,this.nodes.get(n).neighbours);return e}apply_position_map(e){for(let n of e.keys())this.nodes.get(n).data={...this.nodes.get(n).data,pos:e.get(n)}}apply_edge_pos_maps(e){for(let n of e.keys())this.edges.get(n).data={...this.edges.get(n).data,ldata:e.get(n)}}get_edge_map(){const e=new Map;for(const n of this.edges.keys()){const i=this.edges.get(n).data.ldata;i!=null&&e.set(n,i)}return e}apply_drawing_maps(e){e.pmap&&this.apply_position_map(e.pmap),e.emap&&this.apply_edge_pos_maps(e.emap)}get_map(){return{pmap:this.get_position_map(),emap:this.get_edge_map()}}get_position_map(){const e=new Map;for(const n of this.nodes.keys())e.set(n,this.nodes.get(n).data.pos);return e}get_node_ids_order(){return Array.from(this.nodes.keys())}get_adjacency_matrix(){const e=this.get_node_ids_order(),n=e.length,i=new Float32Array(n*n),r=this.get_adjacency(),a=new Map;e.forEach((s,o)=>a.set(s,o));for(let s=0;s<n;s++){const o=e[s],c=r.get(o)??[];for(const l of c){const h=a.get(l);h!==void 0&&(i[s*n+h]=1)}}return{matrix:i,nodeIds:e}}}async function BFSSearch(t,e){const n=t.get_adjacency(),i=new Map,r=new Set([e]),a=[e];for(i.set(e,-1);a.length>0;){const s=a.shift(),o=n.get(s);for(let c=0;c<o.length;c++){const l=o[c];r.has(l)||(r.add(l),a.push(l),i.set(l,s))}}return i}async function Dijkstra(t,e){const n=t.get_adjacency(),i=new Map,r=await BFSSearch(t,e);for(const a of n.keys()){if(!r.has(a))continue;let s=0,o=r.get(a);for(;o!==void 0&&o!==-1;)o=r.get(o),s+=1;i.set(a,s)}return i}async function GraphDiameter(t){const e=[...t.nodes.keys()];if(e.length===0)return{start:0,end:0,distance:0};if(e.length===1)return{start:e[0],end:e[0],distance:0};const n=t.get_adjacency(),i=e.filter(l=>{var h;return(((h=n.get(l))==null?void 0:h.length)??0)>0}),r=i.length>0?i:e;let a=r[Math.floor(Math.random()*r.length)],s=await Dijkstra(t,a),o=-1;for(const l of s.keys()){const h=s.get(l);h>o&&(a=l,o=h)}const c=a;s=await Dijkstra(t,a),o=-1;for(const l of s.keys()){const h=s.get(l);h>o&&(a=l,o=h)}return{start:c,end:a,distance:o}}async function SelectSubgraph(t,e){const n=new Map,i=new Map;e.forEach(s=>{const o=t.nodes.get(s);n.set(s,o)});let r=0;for(const s of t.edges.keys()){const o=t.edges.get(s);e.includes(o.start)&&e.includes(o.end)&&(i.set(r,o),r+=1)}return await Graph.create(n,i)}const GraphMethods={GraphDiameter,Dijkstra,BFSSearch,SelectSubgraph},zkc={nodes:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],edges:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,10],[0,11],[0,12],[0,13],[0,17],[0,19],[0,21],[0,31],[1,2],[1,3],[1,7],[1,13],[1,17],[1,19],[1,21],[1,30],[2,3],[2,7],[2,8],[2,9],[2,13],[2,27],[2,28],[2,32],[3,7],[3,12],[3,13],[4,6],[4,10],[5,6],[5,10],[5,16],[6,16],[8,30],[8,32],[8,33],[9,33],[13,33],[14,32],[14,33],[15,32],[15,33],[18,32],[18,33],[19,33],[20,32],[20,33],[22,32],[22,33],[23,25],[23,27],[23,29],[23,32],[23,33],[24,25],[24,27],[24,31],[25,31],[26,29],[26,33],[27,33],[28,31],[28,33],[29,32],[29,33],[30,32],[30,33],[31,32],[31,33],[32,33]]},zkc_simulated={nodes:[{id:0,px:.09083423378081436,py:1.164162667707135,member:0},{id:1,px:-.5395391223661004,py:.8787097882002372,member:0},{id:2,px:.25483951690897244,py:-.011894166387290125,member:0},{id:3,px:.5292273814873625,py:.8137715604013231,member:0},{id:4,px:.6759740200024705,py:2.010590015934319,member:3},{id:5,px:.6648725961138767,py:2.3765595730406712,member:3},{id:6,px:-.015476857282255526,py:2.421851366492045,member:3},{id:7,px:.9923183157183725,py:.7358251458599251,member:0},{id:8,px:-.6148021363450372,py:-.03465499210385469,member:1},{id:9,px:.24714516178546894,py:-1.012380550604274,member:0},{id:10,px:1.3293288757439443,py:1.8641805845025743,member:3},{id:11,px:-.6571791278403557,py:2.2163816367270526,member:0},{id:12,px:1.5181044222926994,py:1.3282665066698078,member:0},{id:13,px:-.2979203330003603,py:.18438685313887027,member:0},{id:14,px:-1.7502345807734376,py:-1.0935551887354324,member:1},{id:15,px:-1.630224787934251,py:-1.5015879850995024,member:1},{id:16,px:.5585243394360673,py:3.5,member:3},{id:17,px:-.9776584881745712,py:1.799718659872538,member:0},{id:18,px:-1.385649185975611,py:-1.870388302312794,member:1},{id:19,px:-.9638464461397331,py:.24226946279518707,member:0},{id:20,px:-1.0268125129631975,py:-2.1543990524894148,member:1},{id:21,px:-1.3061680833745626,py:1.527228276383933,member:0},{id:22,px:-.5552461198316926,py:-2.2498070887997685,member:1},{id:23,px:.8262268914348979,py:-1.804253160744954,member:2},{id:24,px:1.9952840970427212,py:-1.0382885070400036,member:2},{id:25,px:1.9207660053211613,py:-.5823795272244723,member:2},{id:26,px:-.1664715343791652,py:-2.6527209168204373,member:1},{id:27,px:.9961959436268844,py:-1.0143754028553023,member:2},{id:28,px:.6488880579857091,py:-1.024671500275854,member:2},{id:29,px:.2398196340697841,py:-2.171491081802323,member:1},{id:30,px:-1.3348117368940753,py:-.31290471156377053,member:1},{id:31,px:.6901260074375327,py:-.2526601933356052,member:2},{id:32,px:-.6030949145287146,py:-1.0927507849665647,member:1},{id:33,px:-.3533395323856202,py:-1.1887389845640028,member:1}],edges:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,10],[0,11],[0,12],[0,13],[0,17],[0,19],[0,21],[0,31],[1,2],[1,3],[1,7],[1,13],[1,17],[1,19],[1,21],[1,30],[2,3],[2,7],[2,8],[2,9],[2,13],[2,27],[2,28],[2,32],[3,7],[3,12],[3,13],[4,6],[4,10],[5,6],[5,10],[5,16],[6,16],[8,30],[8,32],[8,33],[9,33],[13,33],[14,32],[14,33],[15,32],[15,33],[18,32],[18,33],[19,33],[20,32],[20,33],[22,32],[22,33],[23,25],[23,27],[23,29],[23,32],[23,33],[24,25],[24,27],[24,31],[25,31],[26,29],[26,33],[27,33],[28,31],[28,33],[29,32],[29,33],[30,32],[30,33],[31,32],[31,33],[32,33]]};class _Node{constructor(e){this.data={...e},this.neighbours=[]}}async function ConstructGraphNodeEdgesList(t,e){const n=new Map;for(let a=0;a<t.length;a++){const s=new _Node(t[a].data);n.set(t[a],s)}const i=new Map;for(let a=0;a<e.length;a++){const s=new Edge(e[a][0],e[a][1],e[a].data);i.set(a,s)}return await Graph.create(n,i)}const GraphConstructors={ConstructGraphNodeEdgesList};class Point{constructor(e,n,i){this.x=e,this.y=n,this.z=i}translate(e){this.x=this.x+e.x,this.y=this.y+e.y,this.z=this.z+e.z}}function calculateAverage(t){let e=0;for(let i=0;i<t.length;i++)e=e+t[i];const n=e/t.length;return Number.isNaN(n)?0:n}function calculateDistance(t,e){return Math.pow(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)+Math.pow(t.z-e.z,2),.5)}function calculateSquaredDistance(t,e){return Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)+Math.pow(t.z-e.z,2)}function getRandomSubset(t,e){var n=new Array(e),i=t.length,r=new Array(i);if(e>i)throw new RangeError("getRandom: more elements taken than available");for(;e--;){var a=Math.floor(Math.random()*i);n[e]=t[a in r?r[a]:a],r[a]=--i in r?r[i]:i}return n}function getRandomSubset_map(t,e){const n=new Map;let i;for(const r of t.keys())i=Math.random(),i<e&&n.set(r,t.get(r));return n}const Utilities={calculateAverage,calculateDistance,calculateSquaredDistance,getRandomSubset,getRandomSubset_map};let Line$1=class{constructor(e){this.points=[],e.forEach(n=>{const i=new Point(n.x,n.y,n.z);this.points.push(i)})}};function line_from_start_end_divisions(t,e,n){const i=new Point(t.x,t.y,t.z),r=new Point(e.x,e.y,e.z),a=[];for(let o=0;o<=n;o++){const c=o/n,l=c*i.x+(1-c)*r.x,h=c*i.y+(1-c)*r.y,d=c*i.z+(1-c)*r.z,f=new Point(l,h,d);a.push(f)}return new Line$1(a)}function line_from_start_end_distance(t,e,n){const i=Utilities.calculateDistance(t,e),r=Math.round(i/n)+2;return line_from_start_end_divisions(t,e,r)}function centroid(t){let e=0,n=0,i=0;return t.forEach(a=>{e+=a.x,n+=a.y,i+=a.z}),e=e/t.length,n=n/t.length,i=i/t.length,new Point(e,n,i)}const GeometryHelpers={line_from_start_end_divisions,line_from_start_end_distance,centroid};async function SimulateKamadaKawai(t,e,n=100,i=1,r=1){const a=t.get_adjacency(),s=new Map,o=new Map;let c,l;for(const S of a.keys())c=Math.random()*n,l=Math.random()*n,s.set(S,c),o.set(S,l);for(let S=0;S<e;S++){let x,C,A,R,P,E,v,w,O,I,F,H,$,K;for(const G of a.keys()){const ee=a.get(G);x=s.get(G),C=o.get(G),A=[],R=[],ee.forEach(ce=>{const te=s.get(ce),xe=o.get(ce);A.push(te),R.push(xe)}),F=Utilities.calculateAverage(A),H=Utilities.calculateAverage(R),P=[],E=[];let oe,me,Re,Fe;for(const ce of t.nodes.keys())ce!=G&&(Re=s.get(ce),Fe=o.get(ce),oe=Re-x,me=Fe-C,E.push(oe),P.push(me));O=r*1/(Utilities.calculateAverage(E)*Utilities.calculateAverage(E)),I=r*1/(Utilities.calculateAverage(P)*Utilities.calculateAverage(P)),v=i*(F-x),w=i*(H-C),$=i*(0-x),K=i*(0-C);const W=O+$+v+x,J=I+K+w+C;s.set(G,W),o.set(G,J)}}let h=new Map;for(const S of s.keys())h.set(S,new Point(s.get(S),0,o.get(S)));const d=[],f=[],u=[];let _;for(const S of h.keys())_=h.get(S),d.push(_.x),f.push(_.y),u.push(_.z);const g=Utilities.calculateAverage(d),m=Utilities.calculateAverage(f),p=Utilities.calculateAverage(u),T=new Point(-g,-m,-p);return h=MovePmap(h,T),h}function InstanciateRandomPositions(t){const e=t.get_adjacency(),n=new Map,i=new Map;for(const a of e.keys())n.set(a,Math.random()*200),i.set(a,Math.random()*200);const r=new Map;for(const a of n.keys())r.set(a,new Point(n.get(a),0,i.get(a)));return r}function DrawEdgeLines(t,e){const n=new Map;let i,r,a;for(const s of t.edges.keys()){i=t.edges.get(s),r=t.nodes.get(i.start).data.pos,a=t.nodes.get(i.end).data.pos;const o=GeometryHelpers.line_from_start_end_distance(r,a,e);n.set(s,o)}return n}function DrawEdgeLinesDivisions(t,e){const n=new Map;let i,r,a;for(const s of t.edges.keys()){i=t.edges.get(s),r=t.nodes.get(i.start).data.pos,a=t.nodes.get(i.end).data.pos;const o=GeometryHelpers.line_from_start_end_divisions(r,a,e);n.set(s,o)}return n}async function DrawEdgeBundling(t,e,n){const i=new Map;for(let T of t.keys())i.set(T,structuredClone(t.get(T)));let r,a,s,o,c,l,h,d,f,u,_,g,m,p;for(let T=0;T<e;T++)for(let S of i.keys()){r=i.get(S);for(let x=1;x<r.points.length-1;x++){s=[],o=[],c=[],l=r.points[x];for(let A of i.keys())if(A!=S){a=i.get(A);for(let R=1;R<a.points.length-1;R++)h=a.points[R],d=Utilities.calculateSquaredDistance(l,h),d<=Math.pow(n,2)&&(f=h.x-l.x,u=h.y-l.y,_=h.z-l.z,s.push(f),o.push(u),c.push(_))}g=l.x+.8*(Utilities.calculateAverage(s)||0),m=l.y+.8*(Utilities.calculateAverage(o)||0),p=l.z+.8*(Utilities.calculateAverage(c)||0);const C=new Point(g,m,p);r.points[x]=C}}return i}function DisplaceEdgeInY(t,e){const n=new Map;for(let i of t.keys())n.set(i,structuredClone(t.get(i)));for(const i of n.keys()){const r=n.get(i);let a,s;for(let o=0;o<r.points.length;o++)a=r.points[o],s=e*Math.sin(Math.PI*o/(r.points.length-1)),a.y=a.y+s}return n}function DisplaceVertices(Graph,parameter,displacement){let max=0,value,ydisplacement;for(let node of Graph.nodes.values())value=eval("node.data."+parameter),value>=max&&(max=value);for(const node of Graph.nodes.values())value=eval("node.data."+parameter),ydisplacement=value/max*displacement,ydisplacement=Math.max(0,ydisplacement),ydisplacement=Math.min(displacement,ydisplacement),node.data.pos.y=ydisplacement}async function HivePlot(t,e,n,i){const r=t.get_adjacency(),a=await GraphMethods.Dijkstra(t,e),s=Math.max(...a.values()),o=new Map;for(let _=0;_<=s;_++){const g=[];for(const m of a.keys())_==a.get(m)&&g.push(m);o.set(_,g)}const c=new Map,l=i.x||0,h=i.y||0,d=i.z||0;for(const _ of r.keys()){const g=a.get(_)*n,m=o.get(a.get(_)),p=2*Math.PI*(m.indexOf(_)/m.length),T=Math.sin(p)*g,S=Math.cos(p)*g,x=new Point(T+l,-g+h,S+d);c.set(_,x)}t.apply_position_map(c);const f=DrawEdgeLines(t,1),u=await DrawEdgeBundling(f,12,5);return{pmap:c,emap:u}}function MoveGraph(t,e){const n=t.get_map(),i=MovePmap(n.pmap,e),r=MoveEmap(n.emap,e);t.apply_drawing_maps({pmap:i,emap:r})}function MovePmap(t,e){const n=new Map;for(let i of t.keys()){const r=t.get(i);r.translate(e),n.set(i,r)}return n}function MoveEmap(t,e){const n=new Map;let i,r,a;for(let s of t.keys()){i=[],r=t.get(s);for(let o of r.points)o.translate(e),i.push(o);a=new Line$1(i),n.set(s,a)}return n}function UpdateEdgeLinesDist(t,e){let n,i,r,a;for(const s of t.edges.keys())n=t.edges.get(s),i=t.nodes.get(n.start).data.pos,r=t.nodes.get(n.end).data.pos,a=GeometryHelpers.line_from_start_end_distance(i,r,e),n.data.ldata=a}function UpdateEdgeLinesDivs(t,e){let n,i,r,a;for(const s of t.edges.keys())n=t.edges.get(s),i=t.nodes.get(n.start).data.pos,r=t.nodes.get(n.end).data.pos,a=GeometryHelpers.line_from_start_end_divisions(i,r,e),n.data.ldata=a}const Drawing={SimulateKamadaKawai,DrawEdgeLines,DrawEdgeLinesDivisions,DrawEdgeBundling,HivePlot,DisplaceEdgeInY,MoveGraph,InstanciateRandomPositions,DisplaceVertices,UpdateEdgeLinesDist,UpdateEdgeLinesDivs};async function LoadZKC(){const t=zkc;return await GraphConstructors.ConstructGraphNodeEdgesList(t.nodes,t.edges)}async function LoadZKCSimulated(){const t=zkc_simulated,e=new Map,n=new Map;t.nodes.forEach(a=>{const s=a.id,o=new Point(a.px*50,0,a.py*50),c=a.member,l=new _Node({pos:o,size:10,info:"Node Info",modularity:c});e.set(s,l)});for(let a=0;a<t.edges.length;a++){const s=t.edges[a],o=s[0],c=s[1],l=new Edge(o,c,{});n.set(a,l)}const i=await Graph.create(e,n),r=Drawing.DrawEdgeLines(i,20);return i.apply_edge_pos_maps(r),i}const DataLoader={LoadZKC,LoadZKCSimulated};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const REVISION="170",MOUSE={ROTATE:0,DOLLY:1,PAN:2},TOUCH={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},CullFaceNone=0,CullFaceBack=1,CullFaceFront=2,PCFShadowMap=1,PCFSoftShadowMap=2,VSMShadowMap=3,FrontSide=0,BackSide=1,DoubleSide=2,NoBlending=0,NormalBlending=1,AdditiveBlending=2,SubtractiveBlending=3,MultiplyBlending=4,CustomBlending=5,AddEquation=100,SubtractEquation=101,ReverseSubtractEquation=102,MinEquation=103,MaxEquation=104,ZeroFactor=200,OneFactor=201,SrcColorFactor=202,OneMinusSrcColorFactor=203,SrcAlphaFactor=204,OneMinusSrcAlphaFactor=205,DstAlphaFactor=206,OneMinusDstAlphaFactor=207,DstColorFactor=208,OneMinusDstColorFactor=209,SrcAlphaSaturateFactor=210,ConstantColorFactor=211,OneMinusConstantColorFactor=212,ConstantAlphaFactor=213,OneMinusConstantAlphaFactor=214,NeverDepth=0,AlwaysDepth=1,LessDepth=2,LessEqualDepth=3,EqualDepth=4,GreaterEqualDepth=5,GreaterDepth=6,NotEqualDepth=7,MultiplyOperation=0,MixOperation=1,AddOperation=2,NoToneMapping=0,LinearToneMapping=1,ReinhardToneMapping=2,CineonToneMapping=3,ACESFilmicToneMapping=4,CustomToneMapping=5,AgXToneMapping=6,NeutralToneMapping=7,UVMapping=300,CubeReflectionMapping=301,CubeRefractionMapping=302,EquirectangularReflectionMapping=303,EquirectangularRefractionMapping=304,CubeUVReflectionMapping=306,RepeatWrapping=1e3,ClampToEdgeWrapping=1001,MirroredRepeatWrapping=1002,NearestFilter=1003,NearestMipmapNearestFilter=1004,NearestMipmapLinearFilter=1005,LinearFilter=1006,LinearMipmapNearestFilter=1007,LinearMipmapLinearFilter=1008,UnsignedByteType=1009,ByteType=1010,ShortType=1011,UnsignedShortType=1012,IntType=1013,UnsignedIntType=1014,FloatType=1015,HalfFloatType=1016,UnsignedShort4444Type=1017,UnsignedShort5551Type=1018,UnsignedInt248Type=1020,UnsignedInt5999Type=35902,AlphaFormat=1021,RGBFormat=1022,RGBAFormat=1023,LuminanceFormat=1024,LuminanceAlphaFormat=1025,DepthFormat=1026,DepthStencilFormat=1027,RedFormat=1028,RedIntegerFormat=1029,RGFormat=1030,RGIntegerFormat=1031,RGBAIntegerFormat=1033,RGB_S3TC_DXT1_Format=33776,RGBA_S3TC_DXT1_Format=33777,RGBA_S3TC_DXT3_Format=33778,RGBA_S3TC_DXT5_Format=33779,RGB_PVRTC_4BPPV1_Format=35840,RGB_PVRTC_2BPPV1_Format=35841,RGBA_PVRTC_4BPPV1_Format=35842,RGBA_PVRTC_2BPPV1_Format=35843,RGB_ETC1_Format=36196,RGB_ETC2_Format=37492,RGBA_ETC2_EAC_Format=37496,RGBA_ASTC_4x4_Format=37808,RGBA_ASTC_5x4_Format=37809,RGBA_ASTC_5x5_Format=37810,RGBA_ASTC_6x5_Format=37811,RGBA_ASTC_6x6_Format=37812,RGBA_ASTC_8x5_Format=37813,RGBA_ASTC_8x6_Format=37814,RGBA_ASTC_8x8_Format=37815,RGBA_ASTC_10x5_Format=37816,RGBA_ASTC_10x6_Format=37817,RGBA_ASTC_10x8_Format=37818,RGBA_ASTC_10x10_Format=37819,RGBA_ASTC_12x10_Format=37820,RGBA_ASTC_12x12_Format=37821,RGBA_BPTC_Format=36492,RGB_BPTC_SIGNED_Format=36494,RGB_BPTC_UNSIGNED_Format=36495,RED_RGTC1_Format=36283,SIGNED_RED_RGTC1_Format=36284,RED_GREEN_RGTC2_Format=36285,SIGNED_RED_GREEN_RGTC2_Format=36286,BasicDepthPacking=3200,RGBADepthPacking=3201,TangentSpaceNormalMap=0,ObjectSpaceNormalMap=1,NoColorSpace="",SRGBColorSpace="srgb",LinearSRGBColorSpace="srgb-linear",LinearTransfer="linear",SRGBTransfer="srgb",KeepStencilOp=7680,AlwaysStencilFunc=519,NeverCompare=512,LessCompare=513,EqualCompare=514,LessEqualCompare=515,GreaterCompare=516,NotEqualCompare=517,GreaterEqualCompare=518,AlwaysCompare=519,StaticDrawUsage=35044,GLSL3="300 es",WebGLCoordinateSystem=2e3,WebGPUCoordinateSystem=2001;class EventDispatcher{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const a=r.indexOf(n);a!==-1&&r.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let a=0,s=r.length;a<s;a++)r[a].call(this,e);e.target=null}}}const _lut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],DEG2RAD=Math.PI/180,RAD2DEG=180/Math.PI;function generateUUID(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(_lut[t&255]+_lut[t>>8&255]+_lut[t>>16&255]+_lut[t>>24&255]+"-"+_lut[e&255]+_lut[e>>8&255]+"-"+_lut[e>>16&15|64]+_lut[e>>24&255]+"-"+_lut[n&63|128]+_lut[n>>8&255]+"-"+_lut[n>>16&255]+_lut[n>>24&255]+_lut[i&255]+_lut[i>>8&255]+_lut[i>>16&255]+_lut[i>>24&255]).toLowerCase()}function clamp(t,e,n){return Math.max(e,Math.min(n,t))}function euclideanModulo(t,e){return(t%e+e)%e}function lerp$5(t,e,n){return(1-n)*t+n*e}function denormalize(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function normalize$5(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const MathUtils={DEG2RAD};class Vector2{constructor(e=0,n=0){Vector2.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(clamp(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),a=this.x-e.x,s=this.y-e.y;return this.x=a*i-s*r+e.x,this.y=a*r+s*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Matrix3{constructor(e,n,i,r,a,s,o,c,l){Matrix3.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,a,s,o,c,l)}set(e,n,i,r,a,s,o,c,l){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=n,h[4]=a,h[5]=c,h[6]=i,h[7]=s,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,a=this.elements,s=i[0],o=i[3],c=i[6],l=i[1],h=i[4],d=i[7],f=i[2],u=i[5],_=i[8],g=r[0],m=r[3],p=r[6],T=r[1],S=r[4],x=r[7],C=r[2],A=r[5],R=r[8];return a[0]=s*g+o*T+c*C,a[3]=s*m+o*S+c*A,a[6]=s*p+o*x+c*R,a[1]=l*g+h*T+d*C,a[4]=l*m+h*S+d*A,a[7]=l*p+h*x+d*R,a[2]=f*g+u*T+_*C,a[5]=f*m+u*S+_*A,a[8]=f*p+u*x+_*R,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return n*s*h-n*o*l-i*a*h+i*o*c+r*a*l-r*s*c}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*s-o*l,f=o*c-h*a,u=l*a-s*c,_=n*d+i*f+r*u;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return e[0]=d*g,e[1]=(r*l-h*i)*g,e[2]=(o*i-r*s)*g,e[3]=f*g,e[4]=(h*n-r*c)*g,e[5]=(r*a-o*n)*g,e[6]=u*g,e[7]=(i*c-l*n)*g,e[8]=(s*n-i*a)*g,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,a,s,o){const c=Math.cos(a),l=Math.sin(a);return this.set(i*c,i*l,-i*(c*s+l*o)+s+e,-r*l,r*c,-r*(-l*s+c*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(_m3.makeScale(e,n)),this}rotate(e){return this.premultiply(_m3.makeRotation(-e)),this}translate(e,n){return this.premultiply(_m3.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _m3=new Matrix3;function arrayNeedsUint32(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function createElementNS(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function createCanvasElement(){const t=createElementNS("canvas");return t.style.display="block",t}const _cache={};function warnOnce(t){t in _cache||(_cache[t]=!0,console.warn(t))}function probeAsync(t,e,n){return new Promise(function(i,r){function a(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:i()}}setTimeout(a,n)})}function toNormalizedProjectionMatrix(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function toReversedProjectionMatrix(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const ColorManagement={enabled:!0,workingColorSpace:LinearSRGBColorSpace,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===SRGBTransfer&&(t.r=SRGBToLinear(t.r),t.g=SRGBToLinear(t.g),t.b=SRGBToLinear(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===SRGBTransfer&&(t.r=LinearToSRGB(t.r),t.g=LinearToSRGB(t.g),t.b=LinearToSRGB(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===NoColorSpace?LinearTransfer:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function SRGBToLinear(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function LinearToSRGB(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const REC709_PRIMARIES=[.64,.33,.3,.6,.15,.06],REC709_LUMINANCE_COEFFICIENTS=[.2126,.7152,.0722],D65=[.3127,.329],LINEAR_REC709_TO_XYZ=new Matrix3().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),XYZ_TO_LINEAR_REC709=new Matrix3().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ColorManagement.define({[LinearSRGBColorSpace]:{primaries:REC709_PRIMARIES,whitePoint:D65,transfer:LinearTransfer,toXYZ:LINEAR_REC709_TO_XYZ,fromXYZ:XYZ_TO_LINEAR_REC709,luminanceCoefficients:REC709_LUMINANCE_COEFFICIENTS,workingColorSpaceConfig:{unpackColorSpace:SRGBColorSpace},outputColorSpaceConfig:{drawingBufferColorSpace:SRGBColorSpace}},[SRGBColorSpace]:{primaries:REC709_PRIMARIES,whitePoint:D65,transfer:SRGBTransfer,toXYZ:LINEAR_REC709_TO_XYZ,fromXYZ:XYZ_TO_LINEAR_REC709,luminanceCoefficients:REC709_LUMINANCE_COEFFICIENTS,outputColorSpaceConfig:{drawingBufferColorSpace:SRGBColorSpace}}});let _canvas;class ImageUtils{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_canvas===void 0&&(_canvas=createElementNS("canvas")),_canvas.width=e.width,_canvas.height=e.height;const i=_canvas.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=_canvas}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=createElementNS("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),a=r.data;for(let s=0;s<a.length;s++)a[s]=SRGBToLinear(a[s]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(SRGBToLinear(n[i]/255)*255):n[i]=SRGBToLinear(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _sourceId=0;class Source{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_sourceId++}),this.uuid=generateUUID(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let a;if(Array.isArray(r)){a=[];for(let s=0,o=r.length;s<o;s++)r[s].isDataTexture?a.push(serializeImage(r[s].image)):a.push(serializeImage(r[s]))}else a=serializeImage(r);i.url=a}return n||(e.images[this.uuid]=i),i}}function serializeImage(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?ImageUtils.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _textureId=0;class Texture extends EventDispatcher{constructor(e=Texture.DEFAULT_IMAGE,n=Texture.DEFAULT_MAPPING,i=ClampToEdgeWrapping,r=ClampToEdgeWrapping,a=LinearFilter,s=LinearMipmapLinearFilter,o=RGBAFormat,c=UnsignedByteType,l=Texture.DEFAULT_ANISOTROPY,h=NoColorSpace){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_textureId++}),this.uuid=generateUUID(),this.name="",this.source=new Source(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=a,this.minFilter=s,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Vector2(0,0),this.repeat=new Vector2(1,1),this.center=new Vector2(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Matrix3,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==UVMapping)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case RepeatWrapping:e.x=e.x-Math.floor(e.x);break;case ClampToEdgeWrapping:e.x=e.x<0?0:1;break;case MirroredRepeatWrapping:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case RepeatWrapping:e.y=e.y-Math.floor(e.y);break;case ClampToEdgeWrapping:e.y=e.y<0?0:1;break;case MirroredRepeatWrapping:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Texture.DEFAULT_IMAGE=null;Texture.DEFAULT_MAPPING=UVMapping;Texture.DEFAULT_ANISOTROPY=1;class Vector4{constructor(e=0,n=0,i=0,r=1){Vector4.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,a=this.w,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r+s[12]*a,this.y=s[1]*n+s[5]*i+s[9]*r+s[13]*a,this.z=s[2]*n+s[6]*i+s[10]*r+s[14]*a,this.w=s[3]*n+s[7]*i+s[11]*r+s[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,a;const c=e.elements,l=c[0],h=c[4],d=c[8],f=c[1],u=c[5],_=c[9],g=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+g)<.1&&Math.abs(_+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const S=(l+1)/2,x=(u+1)/2,C=(p+1)/2,A=(h+f)/4,R=(d+g)/4,P=(_+m)/4;return S>x&&S>C?S<.01?(i=0,r=.707106781,a=.707106781):(i=Math.sqrt(S),r=A/i,a=R/i):x>C?x<.01?(i=.707106781,r=0,a=.707106781):(r=Math.sqrt(x),i=A/r,a=P/r):C<.01?(i=.707106781,r=.707106781,a=0):(a=Math.sqrt(C),i=R/a,r=P/a),this.set(i,r,a,n),this}let T=Math.sqrt((m-_)*(m-_)+(d-g)*(d-g)+(f-h)*(f-h));return Math.abs(T)<.001&&(T=1),this.x=(m-_)/T,this.y=(d-g)/T,this.z=(f-h)/T,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class RenderTarget extends EventDispatcher{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Vector4(0,0,e,n),this.scissorTest=!1,this.viewport=new Vector4(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:LinearFilter,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new Texture(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const s=i.count;for(let o=0;o<s;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,a=this.textures.length;r<a;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Source(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class WebGLRenderTarget extends RenderTarget{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class DataArrayTexture extends Texture{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=NearestFilter,this.minFilter=NearestFilter,this.wrapR=ClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Data3DTexture extends Texture{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=NearestFilter,this.minFilter=NearestFilter,this.wrapR=ClampToEdgeWrapping,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Quaternion{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,a,s,o){let c=i[r+0],l=i[r+1],h=i[r+2],d=i[r+3];const f=a[s+0],u=a[s+1],_=a[s+2],g=a[s+3];if(o===0){e[n+0]=c,e[n+1]=l,e[n+2]=h,e[n+3]=d;return}if(o===1){e[n+0]=f,e[n+1]=u,e[n+2]=_,e[n+3]=g;return}if(d!==g||c!==f||l!==u||h!==_){let m=1-o;const p=c*f+l*u+h*_+d*g,T=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const C=Math.sqrt(S),A=Math.atan2(C,p*T);m=Math.sin(m*A)/C,o=Math.sin(o*A)/C}const x=o*T;if(c=c*m+f*x,l=l*m+u*x,h=h*m+_*x,d=d*m+g*x,m===1-o){const C=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=C,l*=C,h*=C,d*=C}}e[n]=c,e[n+1]=l,e[n+2]=h,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,r,a,s){const o=i[r],c=i[r+1],l=i[r+2],h=i[r+3],d=a[s],f=a[s+1],u=a[s+2],_=a[s+3];return e[n]=o*_+h*d+c*u-l*f,e[n+1]=c*_+h*f+l*d-o*u,e[n+2]=l*_+h*u+o*f-c*d,e[n+3]=h*_-o*d-c*f-l*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,a=e._z,s=e._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(r/2),d=o(a/2),f=c(i/2),u=c(r/2),_=c(a/2);switch(s){case"XYZ":this._x=f*h*d+l*u*_,this._y=l*u*d-f*h*_,this._z=l*h*_+f*u*d,this._w=l*h*d-f*u*_;break;case"YXZ":this._x=f*h*d+l*u*_,this._y=l*u*d-f*h*_,this._z=l*h*_-f*u*d,this._w=l*h*d+f*u*_;break;case"ZXY":this._x=f*h*d-l*u*_,this._y=l*u*d+f*h*_,this._z=l*h*_+f*u*d,this._w=l*h*d-f*u*_;break;case"ZYX":this._x=f*h*d-l*u*_,this._y=l*u*d+f*h*_,this._z=l*h*_-f*u*d,this._w=l*h*d+f*u*_;break;case"YZX":this._x=f*h*d+l*u*_,this._y=l*u*d+f*h*_,this._z=l*h*_-f*u*d,this._w=l*h*d-f*u*_;break;case"XZY":this._x=f*h*d-l*u*_,this._y=l*u*d-f*h*_,this._z=l*h*_+f*u*d,this._w=l*h*d+f*u*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],a=n[8],s=n[1],o=n[5],c=n[9],l=n[2],h=n[6],d=n[10],f=i+o+d;if(f>0){const u=.5/Math.sqrt(f+1);this._w=.25/u,this._x=(h-c)*u,this._y=(a-l)*u,this._z=(s-r)*u}else if(i>o&&i>d){const u=2*Math.sqrt(1+i-o-d);this._w=(h-c)/u,this._x=.25*u,this._y=(r+s)/u,this._z=(a+l)/u}else if(o>d){const u=2*Math.sqrt(1+o-i-d);this._w=(a-l)/u,this._x=(r+s)/u,this._y=.25*u,this._z=(c+h)/u}else{const u=2*Math.sqrt(1+d-i-o);this._w=(s-r)/u,this._x=(a+l)/u,this._y=(c+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(clamp(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,a=e._z,s=e._w,o=n._x,c=n._y,l=n._z,h=n._w;return this._x=i*h+s*o+r*l-a*c,this._y=r*h+s*c+a*o-i*l,this._z=a*h+s*l+i*c-r*o,this._w=s*h-i*o-r*c-a*l,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,a=this._z,s=this._w;let o=s*e._w+i*e._x+r*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=s,this._x=i,this._y=r,this._z=a,this;const c=1-o*o;if(c<=Number.EPSILON){const u=1-n;return this._w=u*s+n*this._w,this._x=u*i+n*this._x,this._y=u*r+n*this._y,this._z=u*a+n*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),d=Math.sin((1-n)*h)/l,f=Math.sin(n*h)/l;return this._w=s*d+this._w*f,this._x=i*d+this._x*f,this._y=r*d+this._y*f,this._z=a*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),a*Math.sin(n),a*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Vector3{constructor(e=0,n=0,i=0){Vector3.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(_quaternion$4.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(_quaternion$4.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,a=e.elements;return this.x=a[0]*n+a[3]*i+a[6]*r,this.y=a[1]*n+a[4]*i+a[7]*r,this.z=a[2]*n+a[5]*i+a[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,a=e.elements,s=1/(a[3]*n+a[7]*i+a[11]*r+a[15]);return this.x=(a[0]*n+a[4]*i+a[8]*r+a[12])*s,this.y=(a[1]*n+a[5]*i+a[9]*r+a[13])*s,this.z=(a[2]*n+a[6]*i+a[10]*r+a[14])*s,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,a=e.x,s=e.y,o=e.z,c=e.w,l=2*(s*r-o*i),h=2*(o*n-a*r),d=2*(a*i-s*n);return this.x=n+c*l+s*d-o*h,this.y=i+c*h+o*l-a*d,this.z=r+c*d+a*h-s*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r,this.y=a[1]*n+a[5]*i+a[9]*r,this.z=a[2]*n+a[6]*i+a[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,a=e.z,s=n.x,o=n.y,c=n.z;return this.x=r*c-a*o,this.y=a*s-i*c,this.z=i*o-r*s,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return _vector$c.copy(this).projectOnVector(e),this.sub(_vector$c)}reflect(e){return this.sub(_vector$c.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(clamp(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const _vector$c=new Vector3,_quaternion$4=new Quaternion;class Box3{constructor(e=new Vector3(1/0,1/0,1/0),n=new Vector3(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(_vector$b.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(_vector$b.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=_vector$b.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(n===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=a.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,_vector$b):_vector$b.fromBufferAttribute(a,s),_vector$b.applyMatrix4(e.matrixWorld),this.expandByPoint(_vector$b);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_box$4.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_box$4.copy(i.boundingBox)),_box$4.applyMatrix4(e.matrixWorld),this.union(_box$4)}const r=e.children;for(let a=0,s=r.length;a<s;a++)this.expandByObject(r[a],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,_vector$b),_vector$b.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_center),_extents.subVectors(this.max,_center),_v0$3.subVectors(e.a,_center),_v1$7.subVectors(e.b,_center),_v2$4.subVectors(e.c,_center),_f0.subVectors(_v1$7,_v0$3),_f1.subVectors(_v2$4,_v1$7),_f2.subVectors(_v0$3,_v2$4);let n=[0,-_f0.z,_f0.y,0,-_f1.z,_f1.y,0,-_f2.z,_f2.y,_f0.z,0,-_f0.x,_f1.z,0,-_f1.x,_f2.z,0,-_f2.x,-_f0.y,_f0.x,0,-_f1.y,_f1.x,0,-_f2.y,_f2.x,0];return!satForAxes(n,_v0$3,_v1$7,_v2$4,_extents)||(n=[1,0,0,0,1,0,0,0,1],!satForAxes(n,_v0$3,_v1$7,_v2$4,_extents))?!1:(_triangleNormal.crossVectors(_f0,_f1),n=[_triangleNormal.x,_triangleNormal.y,_triangleNormal.z],satForAxes(n,_v0$3,_v1$7,_v2$4,_extents))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,_vector$b).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(_vector$b).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_points[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_points[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_points[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_points[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_points[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_points[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_points[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_points[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_points),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _points=[new Vector3,new Vector3,new Vector3,new Vector3,new Vector3,new Vector3,new Vector3,new Vector3],_vector$b=new Vector3,_box$4=new Box3,_v0$3=new Vector3,_v1$7=new Vector3,_v2$4=new Vector3,_f0=new Vector3,_f1=new Vector3,_f2=new Vector3,_center=new Vector3,_extents=new Vector3,_triangleNormal=new Vector3,_testAxis=new Vector3;function satForAxes(t,e,n,i,r){for(let a=0,s=t.length-3;a<=s;a+=3){_testAxis.fromArray(t,a);const o=r.x*Math.abs(_testAxis.x)+r.y*Math.abs(_testAxis.y)+r.z*Math.abs(_testAxis.z),c=e.dot(_testAxis),l=n.dot(_testAxis),h=i.dot(_testAxis);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const _box$3=new Box3,_v1$6=new Vector3,_v2$3=new Vector3;class Sphere{constructor(e=new Vector3,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):_box$3.setFromPoints(e).getCenter(i);let r=0;for(let a=0,s=e.length;a<s;a++)r=Math.max(r,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_v1$6.subVectors(e,this.center);const n=_v1$6.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(_v1$6,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_v2$3.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_v1$6.copy(e.center).add(_v2$3)),this.expandByPoint(_v1$6.copy(e.center).sub(_v2$3))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _vector$a=new Vector3,_segCenter=new Vector3,_segDir=new Vector3,_diff=new Vector3,_edge1=new Vector3,_edge2=new Vector3,_normal$1=new Vector3;class Ray{constructor(e=new Vector3,n=new Vector3(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_vector$a)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=_vector$a.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(_vector$a.copy(this.origin).addScaledVector(this.direction,n),_vector$a.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){_segCenter.copy(e).add(n).multiplyScalar(.5),_segDir.copy(n).sub(e).normalize(),_diff.copy(this.origin).sub(_segCenter);const a=e.distanceTo(n)*.5,s=-this.direction.dot(_segDir),o=_diff.dot(this.direction),c=-_diff.dot(_segDir),l=_diff.lengthSq(),h=Math.abs(1-s*s);let d,f,u,_;if(h>0)if(d=s*c-o,f=s*o-c,_=a*h,d>=0)if(f>=-_)if(f<=_){const g=1/h;d*=g,f*=g,u=d*(d+s*f+2*o)+f*(s*d+f+2*c)+l}else f=a,d=Math.max(0,-(s*f+o)),u=-d*d+f*(f+2*c)+l;else f=-a,d=Math.max(0,-(s*f+o)),u=-d*d+f*(f+2*c)+l;else f<=-_?(d=Math.max(0,-(-s*a+o)),f=d>0?-a:Math.min(Math.max(-a,-c),a),u=-d*d+f*(f+2*c)+l):f<=_?(d=0,f=Math.min(Math.max(-a,-c),a),u=f*(f+2*c)+l):(d=Math.max(0,-(s*a+o)),f=d>0?a:Math.min(Math.max(-a,-c),a),u=-d*d+f*(f+2*c)+l);else f=s>0?-a:a,d=Math.max(0,-(s*f+o)),u=-d*d+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(_segCenter).addScaledVector(_segDir,f),u}intersectSphere(e,n){_vector$a.subVectors(e.center,this.origin);const i=_vector$a.dot(this.direction),r=_vector$a.dot(_vector$a)-i*i,a=e.radius*e.radius;if(r>a)return null;const s=Math.sqrt(a-r),o=i-s,c=i+s;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,a,s,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),h>=0?(a=(e.min.y-f.y)*h,s=(e.max.y-f.y)*h):(a=(e.max.y-f.y)*h,s=(e.min.y-f.y)*h),i>s||a>r||((a>i||isNaN(i))&&(i=a),(s<r||isNaN(r))&&(r=s),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,_vector$a)!==null}intersectTriangle(e,n,i,r,a){_edge1.subVectors(n,e),_edge2.subVectors(i,e),_normal$1.crossVectors(_edge1,_edge2);let s=this.direction.dot(_normal$1),o;if(s>0){if(r)return null;o=1}else if(s<0)o=-1,s=-s;else return null;_diff.subVectors(this.origin,e);const c=o*this.direction.dot(_edge2.crossVectors(_diff,_edge2));if(c<0)return null;const l=o*this.direction.dot(_edge1.cross(_diff));if(l<0||c+l>s)return null;const h=-o*_diff.dot(_normal$1);return h<0?null:this.at(h/s,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Matrix4{constructor(e,n,i,r,a,s,o,c,l,h,d,f,u,_,g,m){Matrix4.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,a,s,o,c,l,h,d,f,u,_,g,m)}set(e,n,i,r,a,s,o,c,l,h,d,f,u,_,g,m){const p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=a,p[5]=s,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=f,p[3]=u,p[7]=_,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Matrix4().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/_v1$5.setFromMatrixColumn(e,0).length(),a=1/_v1$5.setFromMatrixColumn(e,1).length(),s=1/_v1$5.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*a,n[5]=i[5]*a,n[6]=i[6]*a,n[7]=0,n[8]=i[8]*s,n[9]=i[9]*s,n[10]=i[10]*s,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,a=e.z,s=Math.cos(i),o=Math.sin(i),c=Math.cos(r),l=Math.sin(r),h=Math.cos(a),d=Math.sin(a);if(e.order==="XYZ"){const f=s*h,u=s*d,_=o*h,g=o*d;n[0]=c*h,n[4]=-c*d,n[8]=l,n[1]=u+_*l,n[5]=f-g*l,n[9]=-o*c,n[2]=g-f*l,n[6]=_+u*l,n[10]=s*c}else if(e.order==="YXZ"){const f=c*h,u=c*d,_=l*h,g=l*d;n[0]=f+g*o,n[4]=_*o-u,n[8]=s*l,n[1]=s*d,n[5]=s*h,n[9]=-o,n[2]=u*o-_,n[6]=g+f*o,n[10]=s*c}else if(e.order==="ZXY"){const f=c*h,u=c*d,_=l*h,g=l*d;n[0]=f-g*o,n[4]=-s*d,n[8]=_+u*o,n[1]=u+_*o,n[5]=s*h,n[9]=g-f*o,n[2]=-s*l,n[6]=o,n[10]=s*c}else if(e.order==="ZYX"){const f=s*h,u=s*d,_=o*h,g=o*d;n[0]=c*h,n[4]=_*l-u,n[8]=f*l+g,n[1]=c*d,n[5]=g*l+f,n[9]=u*l-_,n[2]=-l,n[6]=o*c,n[10]=s*c}else if(e.order==="YZX"){const f=s*c,u=s*l,_=o*c,g=o*l;n[0]=c*h,n[4]=g-f*d,n[8]=_*d+u,n[1]=d,n[5]=s*h,n[9]=-o*h,n[2]=-l*h,n[6]=u*d+_,n[10]=f-g*d}else if(e.order==="XZY"){const f=s*c,u=s*l,_=o*c,g=o*l;n[0]=c*h,n[4]=-d,n[8]=l*h,n[1]=f*d+g,n[5]=s*h,n[9]=u*d-_,n[2]=_*d-u,n[6]=o*h,n[10]=g*d+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_zero,e,_one)}lookAt(e,n,i){const r=this.elements;return _z.subVectors(e,n),_z.lengthSq()===0&&(_z.z=1),_z.normalize(),_x.crossVectors(i,_z),_x.lengthSq()===0&&(Math.abs(i.z)===1?_z.x+=1e-4:_z.z+=1e-4,_z.normalize(),_x.crossVectors(i,_z)),_x.normalize(),_y.crossVectors(_z,_x),r[0]=_x.x,r[4]=_y.x,r[8]=_z.x,r[1]=_x.y,r[5]=_y.y,r[9]=_z.y,r[2]=_x.z,r[6]=_y.z,r[10]=_z.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,a=this.elements,s=i[0],o=i[4],c=i[8],l=i[12],h=i[1],d=i[5],f=i[9],u=i[13],_=i[2],g=i[6],m=i[10],p=i[14],T=i[3],S=i[7],x=i[11],C=i[15],A=r[0],R=r[4],P=r[8],E=r[12],v=r[1],w=r[5],O=r[9],I=r[13],F=r[2],H=r[6],$=r[10],K=r[14],G=r[3],ee=r[7],oe=r[11],me=r[15];return a[0]=s*A+o*v+c*F+l*G,a[4]=s*R+o*w+c*H+l*ee,a[8]=s*P+o*O+c*$+l*oe,a[12]=s*E+o*I+c*K+l*me,a[1]=h*A+d*v+f*F+u*G,a[5]=h*R+d*w+f*H+u*ee,a[9]=h*P+d*O+f*$+u*oe,a[13]=h*E+d*I+f*K+u*me,a[2]=_*A+g*v+m*F+p*G,a[6]=_*R+g*w+m*H+p*ee,a[10]=_*P+g*O+m*$+p*oe,a[14]=_*E+g*I+m*K+p*me,a[3]=T*A+S*v+x*F+C*G,a[7]=T*R+S*w+x*H+C*ee,a[11]=T*P+S*O+x*$+C*oe,a[15]=T*E+S*I+x*K+C*me,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],a=e[12],s=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],f=e[10],u=e[14],_=e[3],g=e[7],m=e[11],p=e[15];return _*(+a*c*d-r*l*d-a*o*f+i*l*f+r*o*u-i*c*u)+g*(+n*c*u-n*l*f+a*s*f-r*s*u+r*l*h-a*c*h)+m*(+n*l*d-n*o*u-a*s*d+i*s*u+a*o*h-i*l*h)+p*(-r*o*h-n*c*d+n*o*f+r*s*d-i*s*f+i*c*h)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],f=e[10],u=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=d*m*l-g*f*l+g*c*u-o*m*u-d*c*p+o*f*p,S=_*f*l-h*m*l-_*c*u+s*m*u+h*c*p-s*f*p,x=h*g*l-_*d*l+_*o*u-s*g*u-h*o*p+s*d*p,C=_*d*c-h*g*c-_*o*f+s*g*f+h*o*m-s*d*m,A=n*T+i*S+r*x+a*C;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=T*R,e[1]=(g*f*a-d*m*a-g*r*u+i*m*u+d*r*p-i*f*p)*R,e[2]=(o*m*a-g*c*a+g*r*l-i*m*l-o*r*p+i*c*p)*R,e[3]=(d*c*a-o*f*a-d*r*l+i*f*l+o*r*u-i*c*u)*R,e[4]=S*R,e[5]=(h*m*a-_*f*a+_*r*u-n*m*u-h*r*p+n*f*p)*R,e[6]=(_*c*a-s*m*a-_*r*l+n*m*l+s*r*p-n*c*p)*R,e[7]=(s*f*a-h*c*a+h*r*l-n*f*l-s*r*u+n*c*u)*R,e[8]=x*R,e[9]=(_*d*a-h*g*a-_*i*u+n*g*u+h*i*p-n*d*p)*R,e[10]=(s*g*a-_*o*a+_*i*l-n*g*l-s*i*p+n*o*p)*R,e[11]=(h*o*a-s*d*a-h*i*l+n*d*l+s*i*u-n*o*u)*R,e[12]=C*R,e[13]=(h*g*r-_*d*r+_*i*f-n*g*f-h*i*m+n*d*m)*R,e[14]=(_*o*r-s*g*r-_*i*c+n*g*c+s*i*m-n*o*m)*R,e[15]=(s*d*r-h*o*r+h*i*c-n*d*c-s*i*f+n*o*f)*R,this}scale(e){const n=this.elements,i=e.x,r=e.y,a=e.z;return n[0]*=i,n[4]*=r,n[8]*=a,n[1]*=i,n[5]*=r,n[9]*=a,n[2]*=i,n[6]*=r,n[10]*=a,n[3]*=i,n[7]*=r,n[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),a=1-i,s=e.x,o=e.y,c=e.z,l=a*s,h=a*o;return this.set(l*s+i,l*o-r*c,l*c+r*o,0,l*o+r*c,h*o+i,h*c-r*s,0,l*c-r*o,h*c+r*s,a*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,a,s){return this.set(1,i,a,0,e,1,s,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,a=n._x,s=n._y,o=n._z,c=n._w,l=a+a,h=s+s,d=o+o,f=a*l,u=a*h,_=a*d,g=s*h,m=s*d,p=o*d,T=c*l,S=c*h,x=c*d,C=i.x,A=i.y,R=i.z;return r[0]=(1-(g+p))*C,r[1]=(u+x)*C,r[2]=(_-S)*C,r[3]=0,r[4]=(u-x)*A,r[5]=(1-(f+p))*A,r[6]=(m+T)*A,r[7]=0,r[8]=(_+S)*R,r[9]=(m-T)*R,r[10]=(1-(f+g))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let a=_v1$5.set(r[0],r[1],r[2]).length();const s=_v1$5.set(r[4],r[5],r[6]).length(),o=_v1$5.set(r[8],r[9],r[10]).length();this.determinant()<0&&(a=-a),e.x=r[12],e.y=r[13],e.z=r[14],_m1$4.copy(this);const l=1/a,h=1/s,d=1/o;return _m1$4.elements[0]*=l,_m1$4.elements[1]*=l,_m1$4.elements[2]*=l,_m1$4.elements[4]*=h,_m1$4.elements[5]*=h,_m1$4.elements[6]*=h,_m1$4.elements[8]*=d,_m1$4.elements[9]*=d,_m1$4.elements[10]*=d,n.setFromRotationMatrix(_m1$4),i.x=a,i.y=s,i.z=o,this}makePerspective(e,n,i,r,a,s,o=WebGLCoordinateSystem){const c=this.elements,l=2*a/(n-e),h=2*a/(i-r),d=(n+e)/(n-e),f=(i+r)/(i-r);let u,_;if(o===WebGLCoordinateSystem)u=-(s+a)/(s-a),_=-2*s*a/(s-a);else if(o===WebGPUCoordinateSystem)u=-s/(s-a),_=-s*a/(s-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=u,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,a,s,o=WebGLCoordinateSystem){const c=this.elements,l=1/(n-e),h=1/(i-r),d=1/(s-a),f=(n+e)*l,u=(i+r)*h;let _,g;if(o===WebGLCoordinateSystem)_=(s+a)*d,g=-2*d;else if(o===WebGPUCoordinateSystem)_=a*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-u,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const _v1$5=new Vector3,_m1$4=new Matrix4,_zero=new Vector3(0,0,0),_one=new Vector3(1,1,1),_x=new Vector3,_y=new Vector3,_z=new Vector3,_matrix$2=new Matrix4,_quaternion$3=new Quaternion;class Euler{constructor(e=0,n=0,i=0,r=Euler.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,a=r[0],s=r[4],o=r[8],c=r[1],l=r[5],h=r[9],d=r[2],f=r[6],u=r[10];switch(n){case"XYZ":this._y=Math.asin(clamp(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-clamp(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,a),this._z=0);break;case"ZXY":this._x=Math.asin(clamp(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-s,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-clamp(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,u),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-s,l));break;case"YZX":this._z=Math.asin(clamp(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,a)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-clamp(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return _matrix$2.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_matrix$2,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return _quaternion$3.setFromEuler(this),this.setFromQuaternion(_quaternion$3,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Euler.DEFAULT_ORDER="XYZ";class Layers{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _object3DId=0;const _v1$4=new Vector3,_q1=new Quaternion,_m1$3=new Matrix4,_target=new Vector3,_position$3=new Vector3,_scale$2=new Vector3,_quaternion$2=new Quaternion,_xAxis=new Vector3(1,0,0),_yAxis=new Vector3(0,1,0),_zAxis=new Vector3(0,0,1),_addedEvent={type:"added"},_removedEvent={type:"removed"},_childaddedEvent={type:"childadded",child:null},_childremovedEvent={type:"childremoved",child:null};class Object3D extends EventDispatcher{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_object3DId++}),this.uuid=generateUUID(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Object3D.DEFAULT_UP.clone();const e=new Vector3,n=new Euler,i=new Quaternion,r=new Vector3(1,1,1);function a(){i.setFromEuler(n,!1)}function s(){n.setFromQuaternion(i,void 0,!1)}n._onChange(a),i._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Matrix4},normalMatrix:{value:new Matrix3}}),this.matrix=new Matrix4,this.matrixWorld=new Matrix4,this.matrixAutoUpdate=Object3D.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Layers,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return _q1.setFromAxisAngle(e,n),this.quaternion.multiply(_q1),this}rotateOnWorldAxis(e,n){return _q1.setFromAxisAngle(e,n),this.quaternion.premultiply(_q1),this}rotateX(e){return this.rotateOnAxis(_xAxis,e)}rotateY(e){return this.rotateOnAxis(_yAxis,e)}rotateZ(e){return this.rotateOnAxis(_zAxis,e)}translateOnAxis(e,n){return _v1$4.copy(e).applyQuaternion(this.quaternion),this.position.add(_v1$4.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(_xAxis,e)}translateY(e){return this.translateOnAxis(_yAxis,e)}translateZ(e){return this.translateOnAxis(_zAxis,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_m1$3.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?_target.copy(e):_target.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),_position$3.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_m1$3.lookAt(_position$3,_target,this.up):_m1$3.lookAt(_target,_position$3,this.up),this.quaternion.setFromRotationMatrix(_m1$3),r&&(_m1$3.extractRotation(r.matrixWorld),_q1.setFromRotationMatrix(_m1$3),this.quaternion.premultiply(_q1.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_addedEvent),_childaddedEvent.child=e,this.dispatchEvent(_childaddedEvent),_childaddedEvent.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(_removedEvent),_childremovedEvent.child=e,this.dispatchEvent(_childremovedEvent),_childremovedEvent.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_m1$3.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_m1$3.multiply(e.parent.matrixWorld)),e.applyMatrix4(_m1$3),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_addedEvent),_childaddedEvent.child=e,this.dispatchEvent(_childaddedEvent),_childaddedEvent.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const s=this.children[i].getObjectByProperty(e,n);if(s!==void 0)return s}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_position$3,e,_scale$2),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_position$3,_quaternion$2,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let a=0,s=r.length;a<s;a++)r[a].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];a(e.shapes,d)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(e.materials,this.material[c]));r.material=o}else r.material=a(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(a(e.animations,c))}}if(n){const o=s(e.geometries),c=s(e.materials),l=s(e.textures),h=s(e.images),d=s(e.shapes),f=s(e.skeletons),u=s(e.animations),_=s(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),u.length>0&&(i.animations=u),_.length>0&&(i.nodes=_)}return i.object=r,i;function s(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Object3D.DEFAULT_UP=new Vector3(0,1,0);Object3D.DEFAULT_MATRIX_AUTO_UPDATE=!0;Object3D.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _v0$2=new Vector3,_v1$3=new Vector3,_v2$2=new Vector3,_v3$2=new Vector3,_vab=new Vector3,_vac=new Vector3,_vbc=new Vector3,_vap=new Vector3,_vbp=new Vector3,_vcp=new Vector3,_v40=new Vector4,_v41=new Vector4,_v42=new Vector4;class Triangle{constructor(e=new Vector3,n=new Vector3,i=new Vector3){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),_v0$2.subVectors(e,n),r.cross(_v0$2);const a=r.lengthSq();return a>0?r.multiplyScalar(1/Math.sqrt(a)):r.set(0,0,0)}static getBarycoord(e,n,i,r,a){_v0$2.subVectors(r,n),_v1$3.subVectors(i,n),_v2$2.subVectors(e,n);const s=_v0$2.dot(_v0$2),o=_v0$2.dot(_v1$3),c=_v0$2.dot(_v2$2),l=_v1$3.dot(_v1$3),h=_v1$3.dot(_v2$2),d=s*l-o*o;if(d===0)return a.set(0,0,0),null;const f=1/d,u=(l*c-o*h)*f,_=(s*h-o*c)*f;return a.set(1-u-_,_,u)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,_v3$2)===null?!1:_v3$2.x>=0&&_v3$2.y>=0&&_v3$2.x+_v3$2.y<=1}static getInterpolation(e,n,i,r,a,s,o,c){return this.getBarycoord(e,n,i,r,_v3$2)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,_v3$2.x),c.addScaledVector(s,_v3$2.y),c.addScaledVector(o,_v3$2.z),c)}static getInterpolatedAttribute(e,n,i,r,a,s){return _v40.setScalar(0),_v41.setScalar(0),_v42.setScalar(0),_v40.fromBufferAttribute(e,n),_v41.fromBufferAttribute(e,i),_v42.fromBufferAttribute(e,r),s.setScalar(0),s.addScaledVector(_v40,a.x),s.addScaledVector(_v41,a.y),s.addScaledVector(_v42,a.z),s}static isFrontFacing(e,n,i,r){return _v0$2.subVectors(i,n),_v1$3.subVectors(e,n),_v0$2.cross(_v1$3).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _v0$2.subVectors(this.c,this.b),_v1$3.subVectors(this.a,this.b),_v0$2.cross(_v1$3).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Triangle.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Triangle.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,a){return Triangle.getInterpolation(e,this.a,this.b,this.c,n,i,r,a)}containsPoint(e){return Triangle.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Triangle.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,a=this.c;let s,o;_vab.subVectors(r,i),_vac.subVectors(a,i),_vap.subVectors(e,i);const c=_vab.dot(_vap),l=_vac.dot(_vap);if(c<=0&&l<=0)return n.copy(i);_vbp.subVectors(e,r);const h=_vab.dot(_vbp),d=_vac.dot(_vbp);if(h>=0&&d<=h)return n.copy(r);const f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return s=c/(c-h),n.copy(i).addScaledVector(_vab,s);_vcp.subVectors(e,a);const u=_vab.dot(_vcp),_=_vac.dot(_vcp);if(_>=0&&u<=_)return n.copy(a);const g=u*l-c*_;if(g<=0&&l>=0&&_<=0)return o=l/(l-_),n.copy(i).addScaledVector(_vac,o);const m=h*_-u*d;if(m<=0&&d-h>=0&&u-_>=0)return _vbc.subVectors(a,r),o=(d-h)/(d-h+(u-_)),n.copy(r).addScaledVector(_vbc,o);const p=1/(m+g+f);return s=g*p,o=f*p,n.copy(i).addScaledVector(_vab,s).addScaledVector(_vac,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const _colorKeywords={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_hslA={h:0,s:0,l:0},_hslB={h:0,s:0,l:0};function hue2rgb(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Color{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=SRGBColorSpace){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ColorManagement.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=ColorManagement.workingColorSpace){return this.r=e,this.g=n,this.b=i,ColorManagement.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=ColorManagement.workingColorSpace){if(e=euclideanModulo(e,1),n=clamp(n,0,1),i=clamp(i,0,1),n===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+n):i+n-i*n,s=2*i-a;this.r=hue2rgb(s,a,e+1/3),this.g=hue2rgb(s,a,e),this.b=hue2rgb(s,a,e-1/3)}return ColorManagement.toWorkingColorSpace(this,r),this}setStyle(e,n=SRGBColorSpace){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,n);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,n);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=r[1],s=a.length;if(s===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,n);if(s===6)return this.setHex(parseInt(a,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=SRGBColorSpace){const i=_colorKeywords[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=SRGBToLinear(e.r),this.g=SRGBToLinear(e.g),this.b=SRGBToLinear(e.b),this}copyLinearToSRGB(e){return this.r=LinearToSRGB(e.r),this.g=LinearToSRGB(e.g),this.b=LinearToSRGB(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=SRGBColorSpace){return ColorManagement.fromWorkingColorSpace(_color.copy(this),e),Math.round(clamp(_color.r*255,0,255))*65536+Math.round(clamp(_color.g*255,0,255))*256+Math.round(clamp(_color.b*255,0,255))}getHexString(e=SRGBColorSpace){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=ColorManagement.workingColorSpace){ColorManagement.fromWorkingColorSpace(_color.copy(this),n);const i=_color.r,r=_color.g,a=_color.b,s=Math.max(i,r,a),o=Math.min(i,r,a);let c,l;const h=(o+s)/2;if(o===s)c=0,l=0;else{const d=s-o;switch(l=h<=.5?d/(s+o):d/(2-s-o),s){case i:c=(r-a)/d+(r<a?6:0);break;case r:c=(a-i)/d+2;break;case a:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,n=ColorManagement.workingColorSpace){return ColorManagement.fromWorkingColorSpace(_color.copy(this),n),e.r=_color.r,e.g=_color.g,e.b=_color.b,e}getStyle(e=SRGBColorSpace){ColorManagement.fromWorkingColorSpace(_color.copy(this),e);const n=_color.r,i=_color.g,r=_color.b;return e!==SRGBColorSpace?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(_hslA),this.setHSL(_hslA.h+e,_hslA.s+n,_hslA.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(_hslA),e.getHSL(_hslB);const i=lerp$5(_hslA.h,_hslB.h,n),r=lerp$5(_hslA.s,_hslB.s,n),a=lerp$5(_hslA.l,_hslB.l,n);return this.setHSL(i,r,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,a=e.elements;return this.r=a[0]*n+a[3]*i+a[6]*r,this.g=a[1]*n+a[4]*i+a[7]*r,this.b=a[2]*n+a[5]*i+a[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _color=new Color;Color.NAMES=_colorKeywords;let _materialId=0;class Material extends EventDispatcher{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_materialId++}),this.uuid=generateUUID(),this.name="",this.blending=NormalBlending,this.side=FrontSide,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=SrcAlphaFactor,this.blendDst=OneMinusSrcAlphaFactor,this.blendEquation=AddEquation,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Color(0,0,0),this.blendAlpha=0,this.depthFunc=LessEqualDepth,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=AlwaysStencilFunc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=KeepStencilOp,this.stencilZFail=KeepStencilOp,this.stencilZPass=KeepStencilOp,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==NormalBlending&&(i.blending=this.blending),this.side!==FrontSide&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==SrcAlphaFactor&&(i.blendSrc=this.blendSrc),this.blendDst!==OneMinusSrcAlphaFactor&&(i.blendDst=this.blendDst),this.blendEquation!==AddEquation&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==LessEqualDepth&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==AlwaysStencilFunc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==KeepStencilOp&&(i.stencilFail=this.stencilFail),this.stencilZFail!==KeepStencilOp&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==KeepStencilOp&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(a){const s=[];for(const o in a){const c=a[o];delete c.metadata,s.push(c)}return s}if(n){const a=r(e.textures),s=r(e.images);a.length>0&&(i.textures=a),s.length>0&&(i.images=s)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let a=0;a!==r;++a)i[a]=n[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class MeshBasicMaterial extends Material{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Color(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Euler,this.combine=MultiplyOperation,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _vector$9=new Vector3,_vector2$1=new Vector2;class BufferAttribute{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=StaticDrawUsage,this.updateRanges=[],this.gpuType=FloatType,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,a=this.itemSize;r<a;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)_vector2$1.fromBufferAttribute(this,n),_vector2$1.applyMatrix3(e),this.setXY(n,_vector2$1.x,_vector2$1.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)_vector$9.fromBufferAttribute(this,n),_vector$9.applyMatrix3(e),this.setXYZ(n,_vector$9.x,_vector$9.y,_vector$9.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)_vector$9.fromBufferAttribute(this,n),_vector$9.applyMatrix4(e),this.setXYZ(n,_vector$9.x,_vector$9.y,_vector$9.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)_vector$9.fromBufferAttribute(this,n),_vector$9.applyNormalMatrix(e),this.setXYZ(n,_vector$9.x,_vector$9.y,_vector$9.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)_vector$9.fromBufferAttribute(this,n),_vector$9.transformDirection(e),this.setXYZ(n,_vector$9.x,_vector$9.y,_vector$9.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=denormalize(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=normalize$5(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=denormalize(n,this.array)),n}setX(e,n){return this.normalized&&(n=normalize$5(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=denormalize(n,this.array)),n}setY(e,n){return this.normalized&&(n=normalize$5(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=denormalize(n,this.array)),n}setZ(e,n){return this.normalized&&(n=normalize$5(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=denormalize(n,this.array)),n}setW(e,n){return this.normalized&&(n=normalize$5(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=normalize$5(n,this.array),i=normalize$5(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=normalize$5(n,this.array),i=normalize$5(i,this.array),r=normalize$5(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,a){return e*=this.itemSize,this.normalized&&(n=normalize$5(n,this.array),i=normalize$5(i,this.array),r=normalize$5(r,this.array),a=normalize$5(a,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==StaticDrawUsage&&(e.usage=this.usage),e}}class Uint16BufferAttribute extends BufferAttribute{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Int32BufferAttribute extends BufferAttribute{constructor(e,n,i){super(new Int32Array(e),n,i)}}class Uint32BufferAttribute extends BufferAttribute{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Float32BufferAttribute extends BufferAttribute{constructor(e,n,i){super(new Float32Array(e),n,i)}}let _id$2=0;const _m1$2=new Matrix4,_obj=new Object3D,_offset=new Vector3,_box$2=new Box3,_boxMorphTargets=new Box3,_vector$8=new Vector3;class BufferGeometry extends EventDispatcher{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_id$2++}),this.uuid=generateUUID(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(arrayNeedsUint32(e)?Uint32BufferAttribute:Uint16BufferAttribute)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new Matrix3().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return _m1$2.makeRotationFromQuaternion(e),this.applyMatrix4(_m1$2),this}rotateX(e){return _m1$2.makeRotationX(e),this.applyMatrix4(_m1$2),this}rotateY(e){return _m1$2.makeRotationY(e),this.applyMatrix4(_m1$2),this}rotateZ(e){return _m1$2.makeRotationZ(e),this.applyMatrix4(_m1$2),this}translate(e,n,i){return _m1$2.makeTranslation(e,n,i),this.applyMatrix4(_m1$2),this}scale(e,n,i){return _m1$2.makeScale(e,n,i),this.applyMatrix4(_m1$2),this}lookAt(e){return _obj.lookAt(e),_obj.updateMatrix(),this.applyMatrix4(_obj.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_offset).negate(),this.translate(_offset.x,_offset.y,_offset.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,a=e.length;r<a;r++){const s=e[r];i.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Float32BufferAttribute(i,3))}else{for(let i=0,r=n.count;i<r;i++){const a=e[i];n.setXYZ(i,a.x,a.y,a.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Box3);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Vector3(-1/0,-1/0,-1/0),new Vector3(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const a=n[i];_box$2.setFromBufferAttribute(a),this.morphTargetsRelative?(_vector$8.addVectors(this.boundingBox.min,_box$2.min),this.boundingBox.expandByPoint(_vector$8),_vector$8.addVectors(this.boundingBox.max,_box$2.max),this.boundingBox.expandByPoint(_vector$8)):(this.boundingBox.expandByPoint(_box$2.min),this.boundingBox.expandByPoint(_box$2.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sphere);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Vector3,1/0);return}if(e){const i=this.boundingSphere.center;if(_box$2.setFromBufferAttribute(e),n)for(let a=0,s=n.length;a<s;a++){const o=n[a];_boxMorphTargets.setFromBufferAttribute(o),this.morphTargetsRelative?(_vector$8.addVectors(_box$2.min,_boxMorphTargets.min),_box$2.expandByPoint(_vector$8),_vector$8.addVectors(_box$2.max,_boxMorphTargets.max),_box$2.expandByPoint(_vector$8)):(_box$2.expandByPoint(_boxMorphTargets.min),_box$2.expandByPoint(_boxMorphTargets.max))}_box$2.getCenter(i);let r=0;for(let a=0,s=e.count;a<s;a++)_vector$8.fromBufferAttribute(e,a),r=Math.max(r,i.distanceToSquared(_vector$8));if(n)for(let a=0,s=n.length;a<s;a++){const o=n[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)_vector$8.fromBufferAttribute(o,l),c&&(_offset.fromBufferAttribute(e,l),_vector$8.add(_offset)),r=Math.max(r,i.distanceToSquared(_vector$8))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,a=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new BufferAttribute(new Float32Array(4*i.count),4));const s=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<i.count;P++)o[P]=new Vector3,c[P]=new Vector3;const l=new Vector3,h=new Vector3,d=new Vector3,f=new Vector2,u=new Vector2,_=new Vector2,g=new Vector3,m=new Vector3;function p(P,E,v){l.fromBufferAttribute(i,P),h.fromBufferAttribute(i,E),d.fromBufferAttribute(i,v),f.fromBufferAttribute(a,P),u.fromBufferAttribute(a,E),_.fromBufferAttribute(a,v),h.sub(l),d.sub(l),u.sub(f),_.sub(f);const w=1/(u.x*_.y-_.x*u.y);isFinite(w)&&(g.copy(h).multiplyScalar(_.y).addScaledVector(d,-u.y).multiplyScalar(w),m.copy(d).multiplyScalar(u.x).addScaledVector(h,-_.x).multiplyScalar(w),o[P].add(g),o[E].add(g),o[v].add(g),c[P].add(m),c[E].add(m),c[v].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let P=0,E=T.length;P<E;++P){const v=T[P],w=v.start,O=v.count;for(let I=w,F=w+O;I<F;I+=3)p(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const S=new Vector3,x=new Vector3,C=new Vector3,A=new Vector3;function R(P){C.fromBufferAttribute(r,P),A.copy(C);const E=o[P];S.copy(E),S.sub(C.multiplyScalar(C.dot(E))).normalize(),x.crossVectors(A,E);const w=x.dot(c[P])<0?-1:1;s.setXYZW(P,S.x,S.y,S.z,w)}for(let P=0,E=T.length;P<E;++P){const v=T[P],w=v.start,O=v.count;for(let I=w,F=w+O;I<F;I+=3)R(e.getX(I+0)),R(e.getX(I+1)),R(e.getX(I+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new BufferAttribute(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,u=i.count;f<u;f++)i.setXYZ(f,0,0,0);const r=new Vector3,a=new Vector3,s=new Vector3,o=new Vector3,c=new Vector3,l=new Vector3,h=new Vector3,d=new Vector3;if(e)for(let f=0,u=e.count;f<u;f+=3){const _=e.getX(f+0),g=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,_),a.fromBufferAttribute(n,g),s.fromBufferAttribute(n,m),h.subVectors(s,a),d.subVectors(r,a),h.cross(d),o.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(g,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,u=n.count;f<u;f+=3)r.fromBufferAttribute(n,f+0),a.fromBufferAttribute(n,f+1),s.fromBufferAttribute(n,f+2),h.subVectors(s,a),d.subVectors(r,a),h.cross(d),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)_vector$8.fromBufferAttribute(e,n),_vector$8.normalize(),e.setXYZ(n,_vector$8.x,_vector$8.y,_vector$8.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,f=new l.constructor(c.length*h);let u=0,_=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?u=c[g]*o.data.stride+o.offset:u=c[g]*h;for(let p=0;p<h;p++)f[_++]=l[u++]}return new BufferAttribute(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new BufferGeometry,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,i);n.setAttribute(o,l)}const a=this.morphAttributes;for(const o in a){const c=[],l=a[o];for(let h=0,d=l.length;h<d;h++){const f=l[h],u=e(f,i);c.push(u)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,c=s.length;o<c;o++){const l=s[o];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let a=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){const u=l[d];h.push(u.toJSON(e.data))}h.length>0&&(r[c]=h,a=!0)}a&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(n))}const a=e.morphAttributes;for(const l in a){const h=[],d=a[l];for(let f=0,u=d.length;f<u;f++)h.push(d[f].clone(n));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let l=0,h=s.length;l<h;l++){const d=s[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _inverseMatrix$3=new Matrix4,_ray$3=new Ray,_sphere$6=new Sphere,_sphereHitAt=new Vector3,_vA$1=new Vector3,_vB$1=new Vector3,_vC$1=new Vector3,_tempA=new Vector3,_morphA=new Vector3,_intersectionPoint=new Vector3,_intersectionPointWorld=new Vector3;class Mesh extends Object3D{constructor(e=new BufferGeometry,n=new MeshBasicMaterial){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,a=i.morphAttributes.position,s=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(a&&o){_morphA.set(0,0,0);for(let c=0,l=a.length;c<l;c++){const h=o[c],d=a[c];h!==0&&(_tempA.fromBufferAttribute(d,e),s?_morphA.addScaledVector(_tempA,h):_morphA.addScaledVector(_tempA.sub(n),h))}n.add(_morphA)}return n}raycast(e,n){const i=this.geometry,r=this.material,a=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),_sphere$6.copy(i.boundingSphere),_sphere$6.applyMatrix4(a),_ray$3.copy(e.ray).recast(e.near),!(_sphere$6.containsPoint(_ray$3.origin)===!1&&(_ray$3.intersectSphere(_sphere$6,_sphereHitAt)===null||_ray$3.origin.distanceToSquared(_sphereHitAt)>(e.far-e.near)**2))&&(_inverseMatrix$3.copy(a).invert(),_ray$3.copy(e.ray).applyMatrix4(_inverseMatrix$3),!(i.boundingBox!==null&&_ray$3.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,_ray$3)))}_computeIntersections(e,n,i){let r;const a=this.geometry,s=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,d=a.attributes.normal,f=a.groups,u=a.drawRange;if(o!==null)if(Array.isArray(s))for(let _=0,g=f.length;_<g;_++){const m=f[_],p=s[m.materialIndex],T=Math.max(m.start,u.start),S=Math.min(o.count,Math.min(m.start+m.count,u.start+u.count));for(let x=T,C=S;x<C;x+=3){const A=o.getX(x),R=o.getX(x+1),P=o.getX(x+2);r=checkGeometryIntersection(this,p,e,i,l,h,d,A,R,P),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,u.start),g=Math.min(o.count,u.start+u.count);for(let m=_,p=g;m<p;m+=3){const T=o.getX(m),S=o.getX(m+1),x=o.getX(m+2);r=checkGeometryIntersection(this,s,e,i,l,h,d,T,S,x),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(s))for(let _=0,g=f.length;_<g;_++){const m=f[_],p=s[m.materialIndex],T=Math.max(m.start,u.start),S=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let x=T,C=S;x<C;x+=3){const A=x,R=x+1,P=x+2;r=checkGeometryIntersection(this,p,e,i,l,h,d,A,R,P),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,u.start),g=Math.min(c.count,u.start+u.count);for(let m=_,p=g;m<p;m+=3){const T=m,S=m+1,x=m+2;r=checkGeometryIntersection(this,s,e,i,l,h,d,T,S,x),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function checkIntersection$1(t,e,n,i,r,a,s,o){let c;if(e.side===BackSide?c=i.intersectTriangle(s,a,r,!0,o):c=i.intersectTriangle(r,a,s,e.side===FrontSide,o),c===null)return null;_intersectionPointWorld.copy(o),_intersectionPointWorld.applyMatrix4(t.matrixWorld);const l=n.ray.origin.distanceTo(_intersectionPointWorld);return l<n.near||l>n.far?null:{distance:l,point:_intersectionPointWorld.clone(),object:t}}function checkGeometryIntersection(t,e,n,i,r,a,s,o,c,l){t.getVertexPosition(o,_vA$1),t.getVertexPosition(c,_vB$1),t.getVertexPosition(l,_vC$1);const h=checkIntersection$1(t,e,n,i,_vA$1,_vB$1,_vC$1,_intersectionPoint);if(h){const d=new Vector3;Triangle.getBarycoord(_intersectionPoint,_vA$1,_vB$1,_vC$1,d),r&&(h.uv=Triangle.getInterpolatedAttribute(r,o,c,l,d,new Vector2)),a&&(h.uv1=Triangle.getInterpolatedAttribute(a,o,c,l,d,new Vector2)),s&&(h.normal=Triangle.getInterpolatedAttribute(s,o,c,l,d,new Vector3),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new Vector3,materialIndex:0};Triangle.getNormal(_vA$1,_vB$1,_vC$1,f.normal),h.face=f,h.barycoord=d}return h}class BoxGeometry extends BufferGeometry{constructor(e=1,n=1,i=1,r=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:a,depthSegments:s};const o=this;r=Math.floor(r),a=Math.floor(a),s=Math.floor(s);const c=[],l=[],h=[],d=[];let f=0,u=0;_("z","y","x",-1,-1,i,n,e,s,a,0),_("z","y","x",1,-1,i,n,-e,s,a,1),_("x","z","y",1,1,e,i,n,r,s,2),_("x","z","y",1,-1,e,i,-n,r,s,3),_("x","y","z",1,-1,e,n,i,r,a,4),_("x","y","z",-1,-1,e,n,-i,r,a,5),this.setIndex(c),this.setAttribute("position",new Float32BufferAttribute(l,3)),this.setAttribute("normal",new Float32BufferAttribute(h,3)),this.setAttribute("uv",new Float32BufferAttribute(d,2));function _(g,m,p,T,S,x,C,A,R,P,E){const v=x/R,w=C/P,O=x/2,I=C/2,F=A/2,H=R+1,$=P+1;let K=0,G=0;const ee=new Vector3;for(let oe=0;oe<$;oe++){const me=oe*w-I;for(let Re=0;Re<H;Re++){const Fe=Re*v-O;ee[g]=Fe*T,ee[m]=me*S,ee[p]=F,l.push(ee.x,ee.y,ee.z),ee[g]=0,ee[m]=0,ee[p]=A>0?1:-1,h.push(ee.x,ee.y,ee.z),d.push(Re/R),d.push(1-oe/P),K+=1}}for(let oe=0;oe<P;oe++)for(let me=0;me<R;me++){const Re=f+me+H*oe,Fe=f+me+H*(oe+1),W=f+(me+1)+H*(oe+1),J=f+(me+1)+H*oe;c.push(Re,Fe,J),c.push(Fe,W,J),G+=6}o.addGroup(u,G,E),u+=G,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new BoxGeometry(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function cloneUniforms(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function mergeUniforms(t){const e={};for(let n=0;n<t.length;n++){const i=cloneUniforms(t[n]);for(const r in i)e[r]=i[r]}return e}function cloneUniformsGroups(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function getUnlitUniformColorSpace(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ColorManagement.workingColorSpace}const UniformsUtils={clone:cloneUniforms,merge:mergeUniforms};var default_vertex=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,default_fragment=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ShaderMaterial extends Material{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=default_vertex,this.fragmentShader=default_fragment,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=cloneUniforms(e.uniforms),this.uniformsGroups=cloneUniformsGroups(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?n.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?n.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?n.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?n.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?n.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?n.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?n.uniforms[r]={type:"m4",value:s.toArray()}:n.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Camera extends Object3D{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Matrix4,this.projectionMatrix=new Matrix4,this.projectionMatrixInverse=new Matrix4,this.coordinateSystem=WebGLCoordinateSystem}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const _v3$1=new Vector3,_minTarget=new Vector2,_maxTarget=new Vector2;class PerspectiveCamera extends Camera{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=RAD2DEG*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(DEG2RAD*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return RAD2DEG*2*Math.atan(Math.tan(DEG2RAD*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){_v3$1.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_v3$1.x,_v3$1.y).multiplyScalar(-e/_v3$1.z),_v3$1.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_v3$1.x,_v3$1.y).multiplyScalar(-e/_v3$1.z)}getViewSize(e,n){return this.getViewBounds(e,_minTarget,_maxTarget),n.subVectors(_maxTarget,_minTarget)}setViewOffset(e,n,i,r,a,s){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(DEG2RAD*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,a=-.5*r;const s=this.view;if(this.view!==null&&this.view.enabled){const c=s.fullWidth,l=s.fullHeight;a+=s.offsetX*r/c,n-=s.offsetY*i/l,r*=s.width/c,i*=s.height/l}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const fov=-90,aspect=1;class CubeCamera extends Object3D{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new PerspectiveCamera(fov,aspect,e,n);r.layers=this.layers,this.add(r);const a=new PerspectiveCamera(fov,aspect,e,n);a.layers=this.layers,this.add(a);const s=new PerspectiveCamera(fov,aspect,e,n);s.layers=this.layers,this.add(s);const o=new PerspectiveCamera(fov,aspect,e,n);o.layers=this.layers,this.add(o);const c=new PerspectiveCamera(fov,aspect,e,n);c.layers=this.layers,this.add(c);const l=new PerspectiveCamera(fov,aspect,e,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,a,s,o,c]=n;for(const l of n)this.remove(l);if(e===WebGLCoordinateSystem)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===WebGPUCoordinateSystem)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of n)this.add(l),l.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,s,o,c,l,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,a),e.setRenderTarget(i,1,r),e.render(n,s),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,c),e.setRenderTarget(i,4,r),e.render(n,l),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,r),e.render(n,h),e.setRenderTarget(d,f,u),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class CubeTexture extends Texture{constructor(e,n,i,r,a,s,o,c,l,h){e=e!==void 0?e:[],n=n!==void 0?n:CubeReflectionMapping,super(e,n,i,r,a,s,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class WebGLCubeRenderTarget extends WebGLRenderTarget{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new CubeTexture(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:LinearFilter}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new BoxGeometry(5,5,5),a=new ShaderMaterial({name:"CubemapFromEquirect",uniforms:cloneUniforms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:BackSide,blending:NoBlending});a.uniforms.tEquirect.value=n;const s=new Mesh(r,a),o=n.minFilter;return n.minFilter===LinearMipmapLinearFilter&&(n.minFilter=LinearFilter),new CubeCamera(1,10,this).update(e,s),n.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,n,i,r){const a=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(n,i,r);e.setRenderTarget(a)}}const _vector1=new Vector3,_vector2=new Vector3,_normalMatrix=new Matrix3;class Plane{constructor(e=new Vector3(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=_vector1.subVectors(i,n).cross(_vector2.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(_vector1),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return a<0||a>1?null:n.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||_normalMatrix.getNormalMatrix(e),r=this.coplanarPoint(_vector1).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _sphere$5=new Sphere,_vector$7=new Vector3;class Frustum{constructor(e=new Plane,n=new Plane,i=new Plane,r=new Plane,a=new Plane,s=new Plane){this.planes=[e,n,i,r,a,s]}set(e,n,i,r,a,s){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(a),o[5].copy(s),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=WebGLCoordinateSystem){const i=this.planes,r=e.elements,a=r[0],s=r[1],o=r[2],c=r[3],l=r[4],h=r[5],d=r[6],f=r[7],u=r[8],_=r[9],g=r[10],m=r[11],p=r[12],T=r[13],S=r[14],x=r[15];if(i[0].setComponents(c-a,f-l,m-u,x-p).normalize(),i[1].setComponents(c+a,f+l,m+u,x+p).normalize(),i[2].setComponents(c+s,f+h,m+_,x+T).normalize(),i[3].setComponents(c-s,f-h,m-_,x-T).normalize(),i[4].setComponents(c-o,f-d,m-g,x-S).normalize(),n===WebGLCoordinateSystem)i[5].setComponents(c+o,f+d,m+g,x+S).normalize();else if(n===WebGPUCoordinateSystem)i[5].setComponents(o,d,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_sphere$5.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),_sphere$5.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_sphere$5)}intersectsSprite(e){return _sphere$5.center.set(0,0,0),_sphere$5.radius=.7071067811865476,_sphere$5.applyMatrix4(e.matrixWorld),this.intersectsSphere(_sphere$5)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let a=0;a<6;a++)if(n[a].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(_vector$7.x=r.normal.x>0?e.max.x:e.min.x,_vector$7.y=r.normal.y>0?e.max.y:e.min.y,_vector$7.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(_vector$7)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function WebGLAnimation(){let t=null,e=!1,n=null,i=null;function r(a,s){n(a,s),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){n=a},setContext:function(a){t=a}}}function WebGLAttributes(t){const e=new WeakMap;function n(o,c){const l=o.array,h=o.usage,d=l.byteLength,f=t.createBuffer();t.bindBuffer(c,f),t.bufferData(c,l,h),o.onUploadCallback();let u;if(l instanceof Float32Array)u=t.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?u=t.HALF_FLOAT:u=t.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=t.SHORT;else if(l instanceof Uint32Array)u=t.UNSIGNED_INT;else if(l instanceof Int32Array)u=t.INT;else if(l instanceof Int8Array)u=t.BYTE;else if(l instanceof Uint8Array)u=t.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const h=c.array,d=c.updateRanges;if(t.bindBuffer(l,o),d.length===0)t.bufferSubData(l,0,h);else{d.sort((u,_)=>u.start-_.start);let f=0;for(let u=1;u<d.length;u++){const _=d[f],g=d[u];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++f,d[f]=g)}d.length=f+1;for(let u=0,_=d.length;u<_;u++){const g=d[u];t.bufferSubData(l,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function s(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,n(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:r,remove:a,update:s}}class PlaneGeometry extends BufferGeometry{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const a=e/2,s=n/2,o=Math.floor(i),c=Math.floor(r),l=o+1,h=c+1,d=e/o,f=n/c,u=[],_=[],g=[],m=[];for(let p=0;p<h;p++){const T=p*f-s;for(let S=0;S<l;S++){const x=S*d-a;_.push(x,-T,0),g.push(0,0,1),m.push(S/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let T=0;T<o;T++){const S=T+l*p,x=T+l*(p+1),C=T+1+l*(p+1),A=T+1+l*p;u.push(S,x,A),u.push(x,C,A)}this.setIndex(u),this.setAttribute("position",new Float32BufferAttribute(_,3)),this.setAttribute("normal",new Float32BufferAttribute(g,3)),this.setAttribute("uv",new Float32BufferAttribute(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new PlaneGeometry(e.width,e.height,e.widthSegments,e.heightSegments)}}var alphahash_fragment=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment=`#ifdef USE_ALPHAHASH
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
#endif`,alphamap_fragment=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment=`#ifdef USE_AOMAP
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
#endif`,aomap_pars_fragment=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex=`#ifdef USE_BATCHING
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
#endif`,batching_vertex=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iridescence_fragment=`#ifdef USE_IRIDESCENCE
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
#endif`,bumpmap_pars_fragment=`#ifdef USE_BUMPMAP
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
#endif`,clipping_planes_fragment=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,clipping_planes_pars_fragment=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex=`#if defined( USE_COLOR_ALPHA )
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
#endif`,common$1=`#define PI 3.141592653589793
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
} // validated`,cube_uv_reflection_fragment=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,defaultnormal_vertex=`vec3 transformedNormal = objectNormal;
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
#endif`,displacementmap_pars_vertex=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment="gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment=`#ifdef USE_ENVMAP
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
#endif`,envmap_common_pars_fragment=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment=`#ifdef USE_ENVMAP
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
#endif`,envmap_pars_vertex=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_vertex=`#ifdef USE_ENVMAP
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
#endif`,fog_vertex=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment=`#ifdef USE_GRADIENTMAP
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
}`,lightmap_pars_fragment=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin=`uniform bool receiveShadow;
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
#endif`,envmap_physical_pars_fragment=`#ifdef USE_ENVMAP
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
#endif`,lights_toon_fragment=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment=`PhysicalMaterial material;
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
#endif`,lights_physical_pars_fragment=`struct PhysicalMaterial {
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
}`,lights_fragment_begin=`
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
#endif`,lights_fragment_maps=`#if defined( RE_IndirectDiffuse )
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
#endif`,lights_fragment_end=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,map_particle_pars_fragment=`#if defined( USE_POINTS_UV )
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
#endif`,metalnessmap_fragment=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex=`#ifdef USE_MORPHTARGETS
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
#endif`,morphtarget_vertex=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,normal_pars_fragment=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment=`#ifdef USE_NORMALMAP
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
#endif`,clearcoat_normal_fragment_begin=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,premultiplied_alpha_fragment=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,shadowmap_pars_vertex=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,shadowmap_vertex=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,shadowmask_pars_fragment=`float getShadowMask() {
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
}`,skinbase_vertex=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex=`#ifdef USE_SKINNING
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
#endif`,skinning_vertex=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex=`#ifdef USE_SKINNING
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
#endif`,specularmap_fragment=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment=`#ifdef USE_TRANSMISSION
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
#endif`,transmission_pars_fragment=`#ifdef USE_TRANSMISSION
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
#endif`,uv_pars_fragment=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_pars_vertex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_vertex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,worldpos_vertex=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vertex$h=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fragment$h=`uniform sampler2D t2D;
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
}`,vertex$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fragment$g=`#ifdef ENVMAP_TYPE_CUBE
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
}`,vertex$f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fragment$f=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$e=`#include <common>
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
}`,fragment$e=`#if DEPTH_PACKING == 3200
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
}`,vertex$d=`#define DISTANCE
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
}`,fragment$d=`#define DISTANCE
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
}`,vertex$c=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fragment$c=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vertex$b=`uniform float scale;
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
}`,fragment$b=`uniform vec3 diffuse;
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
}`,vertex$a=`#include <common>
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
}`,fragment$a=`uniform vec3 diffuse;
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
}`,vertex$9=`#define LAMBERT
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
}`,fragment$9=`#define LAMBERT
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
}`,vertex$8=`#define MATCAP
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
}`,fragment$8=`#define MATCAP
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
}`,vertex$7=`#define NORMAL
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
}`,fragment$7=`#define NORMAL
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
}`,vertex$6=`#define PHONG
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
}`,fragment$6=`#define PHONG
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
}`,vertex$5=`#define STANDARD
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
}`,fragment$5=`#define STANDARD
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
}`,vertex$4=`#define TOON
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
}`,fragment$4=`#define TOON
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
}`,vertex$3=`uniform float size;
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
}`,fragment$3=`uniform vec3 diffuse;
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
}`,vertex$2=`#include <common>
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
}`,fragment$2=`uniform vec3 color;
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
}`,vertex$1=`uniform float rotation;
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
}`,fragment$1=`uniform vec3 diffuse;
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
}`,ShaderChunk={alphahash_fragment,alphahash_pars_fragment,alphamap_fragment,alphamap_pars_fragment,alphatest_fragment,alphatest_pars_fragment,aomap_fragment,aomap_pars_fragment,batching_pars_vertex,batching_vertex,begin_vertex,beginnormal_vertex,bsdfs,iridescence_fragment,bumpmap_pars_fragment,clipping_planes_fragment,clipping_planes_pars_fragment,clipping_planes_pars_vertex,clipping_planes_vertex,color_fragment,color_pars_fragment,color_pars_vertex,color_vertex,common:common$1,cube_uv_reflection_fragment,defaultnormal_vertex,displacementmap_pars_vertex,displacementmap_vertex,emissivemap_fragment,emissivemap_pars_fragment,colorspace_fragment,colorspace_pars_fragment,envmap_fragment,envmap_common_pars_fragment,envmap_pars_fragment,envmap_pars_vertex,envmap_physical_pars_fragment,envmap_vertex,fog_vertex,fog_pars_vertex,fog_fragment,fog_pars_fragment,gradientmap_pars_fragment,lightmap_pars_fragment,lights_lambert_fragment,lights_lambert_pars_fragment,lights_pars_begin,lights_toon_fragment,lights_toon_pars_fragment,lights_phong_fragment,lights_phong_pars_fragment,lights_physical_fragment,lights_physical_pars_fragment,lights_fragment_begin,lights_fragment_maps,lights_fragment_end,logdepthbuf_fragment,logdepthbuf_pars_fragment,logdepthbuf_pars_vertex,logdepthbuf_vertex,map_fragment,map_pars_fragment,map_particle_fragment,map_particle_pars_fragment,metalnessmap_fragment,metalnessmap_pars_fragment,morphinstance_vertex,morphcolor_vertex,morphnormal_vertex,morphtarget_pars_vertex,morphtarget_vertex,normal_fragment_begin,normal_fragment_maps,normal_pars_fragment,normal_pars_vertex,normal_vertex,normalmap_pars_fragment,clearcoat_normal_fragment_begin,clearcoat_normal_fragment_maps,clearcoat_pars_fragment,iridescence_pars_fragment,opaque_fragment,packing,premultiplied_alpha_fragment,project_vertex,dithering_fragment,dithering_pars_fragment,roughnessmap_fragment,roughnessmap_pars_fragment,shadowmap_pars_fragment,shadowmap_pars_vertex,shadowmap_vertex,shadowmask_pars_fragment,skinbase_vertex,skinning_pars_vertex,skinning_vertex,skinnormal_vertex,specularmap_fragment,specularmap_pars_fragment,tonemapping_fragment,tonemapping_pars_fragment,transmission_fragment,transmission_pars_fragment,uv_pars_fragment,uv_pars_vertex,uv_vertex,worldpos_vertex,background_vert:vertex$h,background_frag:fragment$h,backgroundCube_vert:vertex$g,backgroundCube_frag:fragment$g,cube_vert:vertex$f,cube_frag:fragment$f,depth_vert:vertex$e,depth_frag:fragment$e,distanceRGBA_vert:vertex$d,distanceRGBA_frag:fragment$d,equirect_vert:vertex$c,equirect_frag:fragment$c,linedashed_vert:vertex$b,linedashed_frag:fragment$b,meshbasic_vert:vertex$a,meshbasic_frag:fragment$a,meshlambert_vert:vertex$9,meshlambert_frag:fragment$9,meshmatcap_vert:vertex$8,meshmatcap_frag:fragment$8,meshnormal_vert:vertex$7,meshnormal_frag:fragment$7,meshphong_vert:vertex$6,meshphong_frag:fragment$6,meshphysical_vert:vertex$5,meshphysical_frag:fragment$5,meshtoon_vert:vertex$4,meshtoon_frag:fragment$4,points_vert:vertex$3,points_frag:fragment$3,shadow_vert:vertex$2,shadow_frag:fragment$2,sprite_vert:vertex$1,sprite_frag:fragment$1},UniformsLib={common:{diffuse:{value:new Color(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Matrix3}},envmap:{envMap:{value:null},envMapRotation:{value:new Matrix3},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Matrix3}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Matrix3}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Matrix3},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Matrix3},normalScale:{value:new Vector2(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Matrix3},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Matrix3}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Matrix3}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Matrix3}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Color(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Color(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0},uvTransform:{value:new Matrix3}},sprite:{diffuse:{value:new Color(16777215)},opacity:{value:1},center:{value:new Vector2(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Matrix3},alphaMap:{value:null},alphaMapTransform:{value:new Matrix3},alphaTest:{value:0}}},ShaderLib={basic:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.fog]),vertexShader:ShaderChunk.meshbasic_vert,fragmentShader:ShaderChunk.meshbasic_frag},lambert:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)}}]),vertexShader:ShaderChunk.meshlambert_vert,fragmentShader:ShaderChunk.meshlambert_frag},phong:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.specularmap,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},specular:{value:new Color(1118481)},shininess:{value:30}}]),vertexShader:ShaderChunk.meshphong_vert,fragmentShader:ShaderChunk.meshphong_frag},standard:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.envmap,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.roughnessmap,UniformsLib.metalnessmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ShaderChunk.meshphysical_vert,fragmentShader:ShaderChunk.meshphysical_frag},toon:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.aomap,UniformsLib.lightmap,UniformsLib.emissivemap,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.gradientmap,UniformsLib.fog,UniformsLib.lights,{emissive:{value:new Color(0)}}]),vertexShader:ShaderChunk.meshtoon_vert,fragmentShader:ShaderChunk.meshtoon_frag},matcap:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,UniformsLib.fog,{matcap:{value:null}}]),vertexShader:ShaderChunk.meshmatcap_vert,fragmentShader:ShaderChunk.meshmatcap_frag},points:{uniforms:mergeUniforms([UniformsLib.points,UniformsLib.fog]),vertexShader:ShaderChunk.points_vert,fragmentShader:ShaderChunk.points_frag},dashed:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ShaderChunk.linedashed_vert,fragmentShader:ShaderChunk.linedashed_frag},depth:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.displacementmap]),vertexShader:ShaderChunk.depth_vert,fragmentShader:ShaderChunk.depth_frag},normal:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.bumpmap,UniformsLib.normalmap,UniformsLib.displacementmap,{opacity:{value:1}}]),vertexShader:ShaderChunk.meshnormal_vert,fragmentShader:ShaderChunk.meshnormal_frag},sprite:{uniforms:mergeUniforms([UniformsLib.sprite,UniformsLib.fog]),vertexShader:ShaderChunk.sprite_vert,fragmentShader:ShaderChunk.sprite_frag},background:{uniforms:{uvTransform:{value:new Matrix3},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ShaderChunk.background_vert,fragmentShader:ShaderChunk.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Matrix3}},vertexShader:ShaderChunk.backgroundCube_vert,fragmentShader:ShaderChunk.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ShaderChunk.cube_vert,fragmentShader:ShaderChunk.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ShaderChunk.equirect_vert,fragmentShader:ShaderChunk.equirect_frag},distanceRGBA:{uniforms:mergeUniforms([UniformsLib.common,UniformsLib.displacementmap,{referencePosition:{value:new Vector3},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ShaderChunk.distanceRGBA_vert,fragmentShader:ShaderChunk.distanceRGBA_frag},shadow:{uniforms:mergeUniforms([UniformsLib.lights,UniformsLib.fog,{color:{value:new Color(0)},opacity:{value:1}}]),vertexShader:ShaderChunk.shadow_vert,fragmentShader:ShaderChunk.shadow_frag}};ShaderLib.physical={uniforms:mergeUniforms([ShaderLib.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Matrix3},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Matrix3},clearcoatNormalScale:{value:new Vector2(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Matrix3},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Matrix3},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Matrix3},sheen:{value:0},sheenColor:{value:new Color(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Matrix3},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Matrix3},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Matrix3},transmissionSamplerSize:{value:new Vector2},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Matrix3},attenuationDistance:{value:0},attenuationColor:{value:new Color(0)},specularColor:{value:new Color(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Matrix3},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Matrix3},anisotropyVector:{value:new Vector2},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Matrix3}}]),vertexShader:ShaderChunk.meshphysical_vert,fragmentShader:ShaderChunk.meshphysical_frag};const _rgb={r:0,b:0,g:0},_e1$1=new Euler,_m1$1=new Matrix4;function WebGLBackground(t,e,n,i,r,a,s){const o=new Color(0);let c=a===!0?0:1,l,h,d=null,f=0,u=null;function _(T){let S=T.isScene===!0?T.background:null;return S&&S.isTexture&&(S=(T.backgroundBlurriness>0?n:e).get(S)),S}function g(T){let S=!1;const x=_(T);x===null?p(o,c):x&&x.isColor&&(p(x,1),S=!0);const C=t.xr.getEnvironmentBlendMode();C==="additive"?i.buffers.color.setClear(0,0,0,1,s):C==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,s),(t.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(T,S){const x=_(S);x&&(x.isCubeTexture||x.mapping===CubeUVReflectionMapping)?(h===void 0&&(h=new Mesh(new BoxGeometry(1,1,1),new ShaderMaterial({name:"BackgroundCubeMaterial",uniforms:cloneUniforms(ShaderLib.backgroundCube.uniforms),vertexShader:ShaderLib.backgroundCube.vertexShader,fragmentShader:ShaderLib.backgroundCube.fragmentShader,side:BackSide,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),_e1$1.copy(S.backgroundRotation),_e1$1.x*=-1,_e1$1.y*=-1,_e1$1.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(_e1$1.y*=-1,_e1$1.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(_m1$1.makeRotationFromEuler(_e1$1)),h.material.toneMapped=ColorManagement.getTransfer(x.colorSpace)!==SRGBTransfer,(d!==x||f!==x.version||u!==t.toneMapping)&&(h.material.needsUpdate=!0,d=x,f=x.version,u=t.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Mesh(new PlaneGeometry(2,2),new ShaderMaterial({name:"BackgroundMaterial",uniforms:cloneUniforms(ShaderLib.background.uniforms),vertexShader:ShaderLib.background.vertexShader,fragmentShader:ShaderLib.background.fragmentShader,side:FrontSide,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=ColorManagement.getTransfer(x.colorSpace)!==SRGBTransfer,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||f!==x.version||u!==t.toneMapping)&&(l.material.needsUpdate=!0,d=x,f=x.version,u=t.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function p(T,S){T.getRGB(_rgb,getUnlitUniformColorSpace(t)),i.buffers.color.setClear(_rgb.r,_rgb.g,_rgb.b,S,s)}return{getClearColor:function(){return o},setClearColor:function(T,S=1){o.set(T),c=S,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,p(o,c)},render:g,addToRenderList:m}}function WebGLBindingStates(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let a=r,s=!1;function o(v,w,O,I,F){let H=!1;const $=d(I,O,w);a!==$&&(a=$,l(a.object)),H=u(v,I,O,F),H&&_(v,I,O,F),F!==null&&e.update(F,t.ELEMENT_ARRAY_BUFFER),(H||s)&&(s=!1,x(v,w,O,I),F!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function c(){return t.createVertexArray()}function l(v){return t.bindVertexArray(v)}function h(v){return t.deleteVertexArray(v)}function d(v,w,O){const I=O.wireframe===!0;let F=i[v.id];F===void 0&&(F={},i[v.id]=F);let H=F[w.id];H===void 0&&(H={},F[w.id]=H);let $=H[I];return $===void 0&&($=f(c()),H[I]=$),$}function f(v){const w=[],O=[],I=[];for(let F=0;F<n;F++)w[F]=0,O[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:O,attributeDivisors:I,object:v,attributes:{},index:null}}function u(v,w,O,I){const F=a.attributes,H=w.attributes;let $=0;const K=O.getAttributes();for(const G in K)if(K[G].location>=0){const oe=F[G];let me=H[G];if(me===void 0&&(G==="instanceMatrix"&&v.instanceMatrix&&(me=v.instanceMatrix),G==="instanceColor"&&v.instanceColor&&(me=v.instanceColor)),oe===void 0||oe.attribute!==me||me&&oe.data!==me.data)return!0;$++}return a.attributesNum!==$||a.index!==I}function _(v,w,O,I){const F={},H=w.attributes;let $=0;const K=O.getAttributes();for(const G in K)if(K[G].location>=0){let oe=H[G];oe===void 0&&(G==="instanceMatrix"&&v.instanceMatrix&&(oe=v.instanceMatrix),G==="instanceColor"&&v.instanceColor&&(oe=v.instanceColor));const me={};me.attribute=oe,oe&&oe.data&&(me.data=oe.data),F[G]=me,$++}a.attributes=F,a.attributesNum=$,a.index=I}function g(){const v=a.newAttributes;for(let w=0,O=v.length;w<O;w++)v[w]=0}function m(v){p(v,0)}function p(v,w){const O=a.newAttributes,I=a.enabledAttributes,F=a.attributeDivisors;O[v]=1,I[v]===0&&(t.enableVertexAttribArray(v),I[v]=1),F[v]!==w&&(t.vertexAttribDivisor(v,w),F[v]=w)}function T(){const v=a.newAttributes,w=a.enabledAttributes;for(let O=0,I=w.length;O<I;O++)w[O]!==v[O]&&(t.disableVertexAttribArray(O),w[O]=0)}function S(v,w,O,I,F,H,$){$===!0?t.vertexAttribIPointer(v,w,O,F,H):t.vertexAttribPointer(v,w,O,I,F,H)}function x(v,w,O,I){g();const F=I.attributes,H=O.getAttributes(),$=w.defaultAttributeValues;for(const K in H){const G=H[K];if(G.location>=0){let ee=F[K];if(ee===void 0&&(K==="instanceMatrix"&&v.instanceMatrix&&(ee=v.instanceMatrix),K==="instanceColor"&&v.instanceColor&&(ee=v.instanceColor)),ee!==void 0){const oe=ee.normalized,me=ee.itemSize,Re=e.get(ee);if(Re===void 0)continue;const Fe=Re.buffer,W=Re.type,J=Re.bytesPerElement,ce=W===t.INT||W===t.UNSIGNED_INT||ee.gpuType===IntType;if(ee.isInterleavedBufferAttribute){const te=ee.data,xe=te.stride,Te=ee.offset;if(te.isInstancedInterleavedBuffer){for(let Ce=0;Ce<G.locationSize;Ce++)p(G.location+Ce,te.meshPerAttribute);v.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ce=0;Ce<G.locationSize;Ce++)m(G.location+Ce);t.bindBuffer(t.ARRAY_BUFFER,Fe);for(let Ce=0;Ce<G.locationSize;Ce++)S(G.location+Ce,me/G.locationSize,W,oe,xe*J,(Te+me/G.locationSize*Ce)*J,ce)}else{if(ee.isInstancedBufferAttribute){for(let te=0;te<G.locationSize;te++)p(G.location+te,ee.meshPerAttribute);v.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<G.locationSize;te++)m(G.location+te);t.bindBuffer(t.ARRAY_BUFFER,Fe);for(let te=0;te<G.locationSize;te++)S(G.location+te,me/G.locationSize,W,oe,me*J,me/G.locationSize*te*J,ce)}}else if($!==void 0){const oe=$[K];if(oe!==void 0)switch(oe.length){case 2:t.vertexAttrib2fv(G.location,oe);break;case 3:t.vertexAttrib3fv(G.location,oe);break;case 4:t.vertexAttrib4fv(G.location,oe);break;default:t.vertexAttrib1fv(G.location,oe)}}}}T()}function C(){P();for(const v in i){const w=i[v];for(const O in w){const I=w[O];for(const F in I)h(I[F].object),delete I[F];delete w[O]}delete i[v]}}function A(v){if(i[v.id]===void 0)return;const w=i[v.id];for(const O in w){const I=w[O];for(const F in I)h(I[F].object),delete I[F];delete w[O]}delete i[v.id]}function R(v){for(const w in i){const O=i[w];if(O[v.id]===void 0)continue;const I=O[v.id];for(const F in I)h(I[F].object),delete I[F];delete O[v.id]}}function P(){E(),s=!0,a!==r&&(a=r,l(a.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:P,resetDefaultState:E,dispose:C,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:g,enableAttribute:m,disableUnusedAttributes:T}}function WebGLBufferRenderer(t,e,n){let i;function r(l){i=l}function a(l,h){t.drawArrays(i,l,h),n.update(h,i,1)}function s(l,h,d){d!==0&&(t.drawArraysInstanced(i,l,h,d),n.update(h,i,d))}function o(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,d);let u=0;for(let _=0;_<d;_++)u+=h[_];n.update(u,i,1)}function c(l,h,d,f){if(d===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let _=0;_<l.length;_++)s(l[_],h[_],f[_]);else{u.multiDrawArraysInstancedWEBGL(i,l,0,h,0,f,0,d);let _=0;for(let g=0;g<d;g++)_+=h[g]*f[g];n.update(_,i,1)}}this.setMode=r,this.render=a,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function WebGLCapabilities(t,e,n,i){let r;function a(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function s(R){return!(R!==RGBAFormat&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const P=R===HalfFloatType&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==UnsignedByteType&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==FloatType&&!P)}function c(R){if(R==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),u=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),T=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),S=t.getParameter(t.MAX_VARYING_VECTORS),x=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),C=_>0,A=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:s,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:u,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:C,maxSamples:A}}function WebGLClipping(t){const e=this;let n=null,i=0,r=!1,a=!1;const s=new Plane,o=new Matrix3,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const u=d.length!==0||f||i!==0||r;return r=f,i=d.length,u},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(d,f){n=h(d,f,0)},this.setState=function(d,f,u){const _=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,p=t.get(d);if(!r||_===null||_.length===0||a&&!m)a?h(null):l();else{const T=a?0:i,S=T*4;let x=p.clippingState||null;c.value=x,x=h(_,f,S,u);for(let C=0;C!==S;++C)x[C]=n[C];p.clippingState=x,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,f,u,_){const g=d!==null?d.length:0;let m=null;if(g!==0){if(m=c.value,_!==!0||m===null){const p=u+g*4,T=f.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,x=u;S!==g;++S,x+=4)s.copy(d[S]).applyMatrix4(T,o),s.normal.toArray(m,x),m[x+3]=s.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function WebGLCubeMaps(t){let e=new WeakMap;function n(s,o){return o===EquirectangularReflectionMapping?s.mapping=CubeReflectionMapping:o===EquirectangularRefractionMapping&&(s.mapping=CubeRefractionMapping),s}function i(s){if(s&&s.isTexture){const o=s.mapping;if(o===EquirectangularReflectionMapping||o===EquirectangularRefractionMapping)if(e.has(s)){const c=e.get(s).texture;return n(c,s.mapping)}else{const c=s.image;if(c&&c.height>0){const l=new WebGLCubeRenderTarget(c.height);return l.fromEquirectangularTexture(t,s),e.set(s,l),s.addEventListener("dispose",r),n(l.texture,s.mapping)}else return null}}return s}function r(s){const o=s.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}class OrthographicCamera extends Camera{constructor(e=-1,n=1,i=1,r=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,a,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let a=i-e,s=i+e,o=r+n,c=r-n;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,s=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const LOD_MIN=4,EXTRA_LOD_SIGMA=[.125,.215,.35,.446,.526,.582],MAX_SAMPLES=20,_flatCamera=new OrthographicCamera,_clearColor=new Color;let _oldTarget=null,_oldActiveCubeFace=0,_oldActiveMipmapLevel=0,_oldXrEnabled=!1;const PHI=(1+Math.sqrt(5))/2,INV_PHI=1/PHI,_axisDirections=[new Vector3(-PHI,INV_PHI,0),new Vector3(PHI,INV_PHI,0),new Vector3(-INV_PHI,0,PHI),new Vector3(INV_PHI,0,PHI),new Vector3(0,PHI,-INV_PHI),new Vector3(0,PHI,INV_PHI),new Vector3(-1,1,-1),new Vector3(1,1,-1),new Vector3(-1,1,1),new Vector3(1,1,1)];class PMREMGenerator{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){_oldTarget=this._renderer.getRenderTarget(),_oldActiveCubeFace=this._renderer.getActiveCubeFace(),_oldActiveMipmapLevel=this._renderer.getActiveMipmapLevel(),_oldXrEnabled=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,i,r,a),n>0&&this._blur(a,0,0,n),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_getCubemapMaterial(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_getEquirectMaterial(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_oldTarget,_oldActiveCubeFace,_oldActiveMipmapLevel),this._renderer.xr.enabled=_oldXrEnabled,e.scissorTest=!1,_setViewport(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===CubeReflectionMapping||e.mapping===CubeRefractionMapping?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_oldTarget=this._renderer.getRenderTarget(),_oldActiveCubeFace=this._renderer.getActiveCubeFace(),_oldActiveMipmapLevel=this._renderer.getActiveMipmapLevel(),_oldXrEnabled=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:LinearFilter,minFilter:LinearFilter,generateMipmaps:!1,type:HalfFloatType,format:RGBAFormat,colorSpace:LinearSRGBColorSpace,depthBuffer:!1},r=_createRenderTarget(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_createRenderTarget(e,n,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_createPlanes(a)),this._blurMaterial=_getBlurShader(a,e,n)}return r}_compileMaterial(e){const n=new Mesh(this._lodPlanes[0],e);this._renderer.compile(n,_flatCamera)}_sceneToCubeUV(e,n,i,r){const o=new PerspectiveCamera(90,1,n,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(_clearColor),h.toneMapping=NoToneMapping,h.autoClear=!1;const u=new MeshBasicMaterial({name:"PMREM.Background",side:BackSide,depthWrite:!1,depthTest:!1}),_=new Mesh(new BoxGeometry,u);let g=!1;const m=e.background;m?m.isColor&&(u.color.copy(m),e.background=null,g=!0):(u.color.copy(_clearColor),g=!0);for(let p=0;p<6;p++){const T=p%3;T===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):T===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const S=this._cubeSize;_setViewport(r,T*S,p>2?S:0,S,S),h.setRenderTarget(r),g&&h.render(_,o),h.render(e,o)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===CubeReflectionMapping||e.mapping===CubeRefractionMapping;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=_getCubemapMaterial()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_getEquirectMaterial());const a=r?this._cubemapMaterial:this._equirectMaterial,s=new Mesh(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const c=this._cubeSize;_setViewport(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(s,_flatCamera)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let a=1;a<r;a++){const s=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=_axisDirections[(r-a-1)%_axisDirections.length];this._blur(e,a-1,a,s,o)}n.autoClear=i}_blur(e,n,i,r,a){const s=this._pingPongRenderTarget;this._halfBlur(e,s,n,i,r,"latitudinal",a),this._halfBlur(s,e,i,i,r,"longitudinal",a)}_halfBlur(e,n,i,r,a,s,o){const c=this._renderer,l=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Mesh(this._lodPlanes[r],l),f=l.uniforms,u=this._sizeLods[i]-1,_=isFinite(a)?Math.PI/(2*u):2*Math.PI/(2*MAX_SAMPLES-1),g=a/_,m=isFinite(a)?1+Math.floor(h*g):MAX_SAMPLES;m>MAX_SAMPLES&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${MAX_SAMPLES}`);const p=[];let T=0;for(let R=0;R<MAX_SAMPLES;++R){const P=R/g,E=Math.exp(-P*P/2);p.push(E),R===0?T+=E:R<m&&(T+=2*E)}for(let R=0;R<p.length;R++)p[R]=p[R]/T;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=s==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=_,f.mipInt.value=S-i;const x=this._sizeLods[r],C=3*x*(r>S-LOD_MIN?r-S+LOD_MIN:0),A=4*(this._cubeSize-x);_setViewport(n,C,A,3*x,2*x),c.setRenderTarget(n),c.render(d,_flatCamera)}}function _createPlanes(t){const e=[],n=[],i=[];let r=t;const a=t-LOD_MIN+1+EXTRA_LOD_SIGMA.length;for(let s=0;s<a;s++){const o=Math.pow(2,r);n.push(o);let c=1/o;s>t-LOD_MIN?c=EXTRA_LOD_SIGMA[s-t+LOD_MIN-1]:s===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,_=6,g=3,m=2,p=1,T=new Float32Array(g*_*u),S=new Float32Array(m*_*u),x=new Float32Array(p*_*u);for(let A=0;A<u;A++){const R=A%3*2/3-1,P=A>2?0:-1,E=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];T.set(E,g*_*A),S.set(f,m*_*A);const v=[A,A,A,A,A,A];x.set(v,p*_*A)}const C=new BufferGeometry;C.setAttribute("position",new BufferAttribute(T,g)),C.setAttribute("uv",new BufferAttribute(S,m)),C.setAttribute("faceIndex",new BufferAttribute(x,p)),e.push(C),r>LOD_MIN&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function _createRenderTarget(t,e,n){const i=new WebGLRenderTarget(t,e,n);return i.texture.mapping=CubeUVReflectionMapping,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _setViewport(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function _getBlurShader(t,e,n){const i=new Float32Array(MAX_SAMPLES),r=new Vector3(0,1,0);return new ShaderMaterial({name:"SphericalGaussianBlur",defines:{n:MAX_SAMPLES,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:_getCommonVertexShader(),fragmentShader:`

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
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getEquirectMaterial(){return new ShaderMaterial({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_getCommonVertexShader(),fragmentShader:`

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
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getCubemapMaterial(){return new ShaderMaterial({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_getCommonVertexShader(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:NoBlending,depthTest:!1,depthWrite:!1})}function _getCommonVertexShader(){return`

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
	`}function WebGLCubeUVMaps(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===EquirectangularReflectionMapping||c===EquirectangularRefractionMapping,h=c===CubeReflectionMapping||c===CubeRefractionMapping;if(l||h){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new PMREMGenerator(t)),d=l?n.fromEquirectangular(o,d):n.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const u=o.image;return l&&u&&u.height>0||h&&u&&r(u)?(n===null&&(n=new PMREMGenerator(t)),d=l?n.fromEquirectangular(o):n.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",a),d.texture):null}}}return o}function r(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function a(o){const c=o.target;c.removeEventListener("dispose",a);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function s(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:s}}function WebGLExtensions(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&warnOnce("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function WebGLGeometries(t,e,n,i){const r={},a=new WeakMap;function s(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const g=f.morphAttributes[_];for(let m=0,p=g.length;m<p;m++)e.remove(g[m])}f.removeEventListener("dispose",s),delete r[f.id];const u=a.get(f);u&&(e.remove(u),a.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",s),r[f.id]=!0,n.memory.geometries++),f}function c(d){const f=d.attributes;for(const _ in f)e.update(f[_],t.ARRAY_BUFFER);const u=d.morphAttributes;for(const _ in u){const g=u[_];for(let m=0,p=g.length;m<p;m++)e.update(g[m],t.ARRAY_BUFFER)}}function l(d){const f=[],u=d.index,_=d.attributes.position;let g=0;if(u!==null){const T=u.array;g=u.version;for(let S=0,x=T.length;S<x;S+=3){const C=T[S+0],A=T[S+1],R=T[S+2];f.push(C,A,A,R,R,C)}}else if(_!==void 0){const T=_.array;g=_.version;for(let S=0,x=T.length/3-1;S<x;S+=3){const C=S+0,A=S+1,R=S+2;f.push(C,A,A,R,R,C)}}else return;const m=new(arrayNeedsUint32(f)?Uint32BufferAttribute:Uint16BufferAttribute)(f,1);m.version=g;const p=a.get(d);p&&e.remove(p),a.set(d,m)}function h(d){const f=a.get(d);if(f){const u=d.index;u!==null&&f.version<u.version&&l(d)}else l(d);return a.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function WebGLIndexedBufferRenderer(t,e,n){let i;function r(f){i=f}let a,s;function o(f){a=f.type,s=f.bytesPerElement}function c(f,u){t.drawElements(i,u,a,f*s),n.update(u,i,1)}function l(f,u,_){_!==0&&(t.drawElementsInstanced(i,u,a,f*s,_),n.update(u,i,_))}function h(f,u,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,a,f,0,_);let m=0;for(let p=0;p<_;p++)m+=u[p];n.update(m,i,1)}function d(f,u,_,g){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/s,u[p],g[p]);else{m.multiDrawElementsInstancedWEBGL(i,u,0,a,f,0,g,0,_);let p=0;for(let T=0;T<_;T++)p+=u[T]*g[T];n.update(p,i,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function WebGLInfo(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,s,o){switch(n.calls++,s){case t.TRIANGLES:n.triangles+=o*(a/3);break;case t.LINES:n.lines+=o*(a/2);break;case t.LINE_STRIP:n.lines+=o*(a-1);break;case t.LINE_LOOP:n.lines+=o*a;break;case t.POINTS:n.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function WebGLMorphtargets(t,e,n){const i=new WeakMap,r=new Vector4;function a(s,o,c){const l=s.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==d){let E=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const u=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let S=0;u===!0&&(S=1),_===!0&&(S=2),g===!0&&(S=3);let x=o.attributes.position.count*S,C=1;x>e.maxTextureSize&&(C=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const A=new Float32Array(x*C*4*d),R=new DataArrayTexture(A,x,C,d);R.type=FloatType,R.needsUpdate=!0;const P=S*4;for(let v=0;v<d;v++){const w=m[v],O=p[v],I=T[v],F=x*C*4*v;for(let H=0;H<w.count;H++){const $=H*P;u===!0&&(r.fromBufferAttribute(w,H),A[F+$+0]=r.x,A[F+$+1]=r.y,A[F+$+2]=r.z,A[F+$+3]=0),_===!0&&(r.fromBufferAttribute(O,H),A[F+$+4]=r.x,A[F+$+5]=r.y,A[F+$+6]=r.z,A[F+$+7]=0),g===!0&&(r.fromBufferAttribute(I,H),A[F+$+8]=r.x,A[F+$+9]=r.y,A[F+$+10]=r.z,A[F+$+11]=I.itemSize===4?r.w:1)}}f={count:d,texture:R,size:new Vector2(x,C)},i.set(o,f),o.addEventListener("dispose",E)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",s.morphTexture,n);else{let u=0;for(let g=0;g<l.length;g++)u+=l[g];const _=o.morphTargetsRelative?1:1-u;c.getUniforms().setValue(t,"morphTargetBaseInfluence",_),c.getUniforms().setValue(t,"morphTargetInfluences",l)}c.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:a}}function WebGLObjects(t,e,n,i){let r=new WeakMap;function a(c){const l=i.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return d}function s(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),n.remove(l.instanceMatrix),l.instanceColor!==null&&n.remove(l.instanceColor)}return{update:a,dispose:s}}class DepthTexture extends Texture{constructor(e,n,i,r,a,s,o,c,l,h=DepthFormat){if(h!==DepthFormat&&h!==DepthStencilFormat)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===DepthFormat&&(i=UnsignedIntType),i===void 0&&h===DepthStencilFormat&&(i=UnsignedInt248Type),super(null,r,a,s,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:NearestFilter,this.minFilter=c!==void 0?c:NearestFilter,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const emptyTexture=new Texture,emptyShadowTexture=new DepthTexture(1,1),emptyArrayTexture=new DataArrayTexture,empty3dTexture=new Data3DTexture,emptyCubeTexture=new CubeTexture,arrayCacheF32=[],arrayCacheI32=[],mat4array=new Float32Array(16),mat3array=new Float32Array(9),mat2array=new Float32Array(4);function flatten(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let a=arrayCacheF32[r];if(a===void 0&&(a=new Float32Array(r),arrayCacheF32[r]=a),e!==0){i.toArray(a,0);for(let s=1,o=0;s!==e;++s)o+=n,t[s].toArray(a,o)}return a}function arraysEqual(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function copyArray(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function allocTexUnits(t,e){let n=arrayCacheI32[e];n===void 0&&(n=new Int32Array(e),arrayCacheI32[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function setValueV1f(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function setValueV2f(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(arraysEqual(n,e))return;t.uniform2fv(this.addr,e),copyArray(n,e)}}function setValueV3f(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(arraysEqual(n,e))return;t.uniform3fv(this.addr,e),copyArray(n,e)}}function setValueV4f(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(arraysEqual(n,e))return;t.uniform4fv(this.addr,e),copyArray(n,e)}}function setValueM2(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(arraysEqual(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),copyArray(n,e)}else{if(arraysEqual(n,i))return;mat2array.set(i),t.uniformMatrix2fv(this.addr,!1,mat2array),copyArray(n,i)}}function setValueM3(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(arraysEqual(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),copyArray(n,e)}else{if(arraysEqual(n,i))return;mat3array.set(i),t.uniformMatrix3fv(this.addr,!1,mat3array),copyArray(n,i)}}function setValueM4(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(arraysEqual(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),copyArray(n,e)}else{if(arraysEqual(n,i))return;mat4array.set(i),t.uniformMatrix4fv(this.addr,!1,mat4array),copyArray(n,i)}}function setValueV1i(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function setValueV2i(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(arraysEqual(n,e))return;t.uniform2iv(this.addr,e),copyArray(n,e)}}function setValueV3i(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(arraysEqual(n,e))return;t.uniform3iv(this.addr,e),copyArray(n,e)}}function setValueV4i(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(arraysEqual(n,e))return;t.uniform4iv(this.addr,e),copyArray(n,e)}}function setValueV1ui(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function setValueV2ui(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(arraysEqual(n,e))return;t.uniform2uiv(this.addr,e),copyArray(n,e)}}function setValueV3ui(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(arraysEqual(n,e))return;t.uniform3uiv(this.addr,e),copyArray(n,e)}}function setValueV4ui(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(arraysEqual(n,e))return;t.uniform4uiv(this.addr,e),copyArray(n,e)}}function setValueT1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let a;this.type===t.SAMPLER_2D_SHADOW?(emptyShadowTexture.compareFunction=LessEqualCompare,a=emptyShadowTexture):a=emptyTexture,n.setTexture2D(e||a,r)}function setValueT3D1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||empty3dTexture,r)}function setValueT6(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||emptyCubeTexture,r)}function setValueT2DArray1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||emptyArrayTexture,r)}function getSingularSetter(t){switch(t){case 5126:return setValueV1f;case 35664:return setValueV2f;case 35665:return setValueV3f;case 35666:return setValueV4f;case 35674:return setValueM2;case 35675:return setValueM3;case 35676:return setValueM4;case 5124:case 35670:return setValueV1i;case 35667:case 35671:return setValueV2i;case 35668:case 35672:return setValueV3i;case 35669:case 35673:return setValueV4i;case 5125:return setValueV1ui;case 36294:return setValueV2ui;case 36295:return setValueV3ui;case 36296:return setValueV4ui;case 35678:case 36198:case 36298:case 36306:case 35682:return setValueT1;case 35679:case 36299:case 36307:return setValueT3D1;case 35680:case 36300:case 36308:case 36293:return setValueT6;case 36289:case 36303:case 36311:case 36292:return setValueT2DArray1}}function setValueV1fArray(t,e){t.uniform1fv(this.addr,e)}function setValueV2fArray(t,e){const n=flatten(e,this.size,2);t.uniform2fv(this.addr,n)}function setValueV3fArray(t,e){const n=flatten(e,this.size,3);t.uniform3fv(this.addr,n)}function setValueV4fArray(t,e){const n=flatten(e,this.size,4);t.uniform4fv(this.addr,n)}function setValueM2Array(t,e){const n=flatten(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function setValueM3Array(t,e){const n=flatten(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function setValueM4Array(t,e){const n=flatten(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function setValueV1iArray(t,e){t.uniform1iv(this.addr,e)}function setValueV2iArray(t,e){t.uniform2iv(this.addr,e)}function setValueV3iArray(t,e){t.uniform3iv(this.addr,e)}function setValueV4iArray(t,e){t.uniform4iv(this.addr,e)}function setValueV1uiArray(t,e){t.uniform1uiv(this.addr,e)}function setValueV2uiArray(t,e){t.uniform2uiv(this.addr,e)}function setValueV3uiArray(t,e){t.uniform3uiv(this.addr,e)}function setValueV4uiArray(t,e){t.uniform4uiv(this.addr,e)}function setValueT1Array(t,e,n){const i=this.cache,r=e.length,a=allocTexUnits(n,r);arraysEqual(i,a)||(t.uniform1iv(this.addr,a),copyArray(i,a));for(let s=0;s!==r;++s)n.setTexture2D(e[s]||emptyTexture,a[s])}function setValueT3DArray(t,e,n){const i=this.cache,r=e.length,a=allocTexUnits(n,r);arraysEqual(i,a)||(t.uniform1iv(this.addr,a),copyArray(i,a));for(let s=0;s!==r;++s)n.setTexture3D(e[s]||empty3dTexture,a[s])}function setValueT6Array(t,e,n){const i=this.cache,r=e.length,a=allocTexUnits(n,r);arraysEqual(i,a)||(t.uniform1iv(this.addr,a),copyArray(i,a));for(let s=0;s!==r;++s)n.setTextureCube(e[s]||emptyCubeTexture,a[s])}function setValueT2DArrayArray(t,e,n){const i=this.cache,r=e.length,a=allocTexUnits(n,r);arraysEqual(i,a)||(t.uniform1iv(this.addr,a),copyArray(i,a));for(let s=0;s!==r;++s)n.setTexture2DArray(e[s]||emptyArrayTexture,a[s])}function getPureArraySetter(t){switch(t){case 5126:return setValueV1fArray;case 35664:return setValueV2fArray;case 35665:return setValueV3fArray;case 35666:return setValueV4fArray;case 35674:return setValueM2Array;case 35675:return setValueM3Array;case 35676:return setValueM4Array;case 5124:case 35670:return setValueV1iArray;case 35667:case 35671:return setValueV2iArray;case 35668:case 35672:return setValueV3iArray;case 35669:case 35673:return setValueV4iArray;case 5125:return setValueV1uiArray;case 36294:return setValueV2uiArray;case 36295:return setValueV3uiArray;case 36296:return setValueV4uiArray;case 35678:case 36198:case 36298:case 36306:case 35682:return setValueT1Array;case 35679:case 36299:case 36307:return setValueT3DArray;case 35680:case 36300:case 36308:case 36293:return setValueT6Array;case 36289:case 36303:case 36311:case 36292:return setValueT2DArrayArray}}class SingleUniform{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=getSingularSetter(n.type)}}class PureArrayUniform{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=getPureArraySetter(n.type)}}class StructuredUniform{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let a=0,s=r.length;a!==s;++a){const o=r[a];o.setValue(e,n[o.id],i)}}}const RePathPart=/(\w+)(\])?(\[|\.)?/g;function addUniform(t,e){t.seq.push(e),t.map[e.id]=e}function parseUniform(t,e,n){const i=t.name,r=i.length;for(RePathPart.lastIndex=0;;){const a=RePathPart.exec(i),s=RePathPart.lastIndex;let o=a[1];const c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&s+2===r){addUniform(n,l===void 0?new SingleUniform(o,t,e):new PureArrayUniform(o,t,e));break}else{let d=n.map[o];d===void 0&&(d=new StructuredUniform(o),addUniform(n,d)),n=d}}}class WebGLUniforms{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const a=e.getActiveUniform(n,r),s=e.getUniformLocation(n,a.name);parseUniform(a,s,this)}}setValue(e,n,i,r){const a=this.map[n];a!==void 0&&a.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let a=0,s=n.length;a!==s;++a){const o=n[a],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,a=e.length;r!==a;++r){const s=e[r];s.id in n&&i.push(s)}return i}}function WebGLShader(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const COMPLETION_STATUS_KHR=37297;let programIdCount=0;function handleSource(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),a=Math.min(e+6,n.length);for(let s=r;s<a;s++){const o=s+1;i.push(`${o===e?">":" "} ${o}: ${n[s]}`)}return i.join(`
`)}const _m0=new Matrix3;function getEncodingComponents(t){ColorManagement._getMatrix(_m0,ColorManagement.workingColorSpace,t);const e=`mat3( ${_m0.elements.map(n=>n.toFixed(4))} )`;switch(ColorManagement.getTransfer(t)){case LinearTransfer:return[e,"LinearTransferOETF"];case SRGBTransfer:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function getShaderErrors(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const s=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+handleSource(t.getShaderSource(e),s)}else return r}function getTexelEncodingFunction(t,e){const n=getEncodingComponents(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function getToneMappingFunction(t,e){let n;switch(e){case LinearToneMapping:n="Linear";break;case ReinhardToneMapping:n="Reinhard";break;case CineonToneMapping:n="Cineon";break;case ACESFilmicToneMapping:n="ACESFilmic";break;case AgXToneMapping:n="AgX";break;case NeutralToneMapping:n="Neutral";break;case CustomToneMapping:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const _v0$1=new Vector3;function getLuminanceFunction(){ColorManagement.getLuminanceCoefficients(_v0$1);const t=_v0$1.x.toFixed(4),e=_v0$1.y.toFixed(4),n=_v0$1.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function generateVertexExtensions(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(filterEmptyLine).join(`
`)}function generateDefines(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function fetchAttributeLocations(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const a=t.getActiveAttrib(e,r),s=a.name;let o=1;a.type===t.FLOAT_MAT2&&(o=2),a.type===t.FLOAT_MAT3&&(o=3),a.type===t.FLOAT_MAT4&&(o=4),n[s]={type:a.type,location:t.getAttribLocation(e,s),locationSize:o}}return n}function filterEmptyLine(t){return t!==""}function replaceLightNums(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function replaceClippingPlaneNums(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const includePattern=/^[ \t]*#include +<([\w\d./]+)>/gm;function resolveIncludes(t){return t.replace(includePattern,includeReplacer)}const shaderChunkMap=new Map;function includeReplacer(t,e){let n=ShaderChunk[e];if(n===void 0){const i=shaderChunkMap.get(e);if(i!==void 0)n=ShaderChunk[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return resolveIncludes(n)}const unrollLoopPattern=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function unrollLoops(t){return t.replace(unrollLoopPattern,loopReplacer)}function loopReplacer(t,e,n,i){let r="";for(let a=parseInt(e);a<parseInt(n);a++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function generatePrecision(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function generateShadowMapTypeDefine(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===PCFShadowMap?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===PCFSoftShadowMap?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===VSMShadowMap&&(e="SHADOWMAP_TYPE_VSM"),e}function generateEnvMapTypeDefine(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case CubeReflectionMapping:case CubeRefractionMapping:e="ENVMAP_TYPE_CUBE";break;case CubeUVReflectionMapping:e="ENVMAP_TYPE_CUBE_UV";break}return e}function generateEnvMapModeDefine(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case CubeRefractionMapping:e="ENVMAP_MODE_REFRACTION";break}return e}function generateEnvMapBlendingDefine(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case MultiplyOperation:e="ENVMAP_BLENDING_MULTIPLY";break;case MixOperation:e="ENVMAP_BLENDING_MIX";break;case AddOperation:e="ENVMAP_BLENDING_ADD";break}return e}function generateCubeUVSize(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function WebGLProgram(t,e,n,i){const r=t.getContext(),a=n.defines;let s=n.vertexShader,o=n.fragmentShader;const c=generateShadowMapTypeDefine(n),l=generateEnvMapTypeDefine(n),h=generateEnvMapModeDefine(n),d=generateEnvMapBlendingDefine(n),f=generateCubeUVSize(n),u=generateVertexExtensions(n),_=generateDefines(a),g=r.createProgram();let m,p,T=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(filterEmptyLine).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(filterEmptyLine).join(`
`),p.length>0&&(p+=`
`)):(m=[generatePrecision(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(filterEmptyLine).join(`
`),p=[generatePrecision(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+h:"",n.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==NoToneMapping?"#define TONE_MAPPING":"",n.toneMapping!==NoToneMapping?ShaderChunk.tonemapping_pars_fragment:"",n.toneMapping!==NoToneMapping?getToneMappingFunction("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ShaderChunk.colorspace_pars_fragment,getTexelEncodingFunction("linearToOutputTexel",n.outputColorSpace),getLuminanceFunction(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(filterEmptyLine).join(`
`)),s=resolveIncludes(s),s=replaceLightNums(s,n),s=replaceClippingPlaneNums(s,n),o=resolveIncludes(o),o=replaceLightNums(o,n),o=replaceClippingPlaneNums(o,n),s=unrollLoops(s),o=unrollLoops(o),n.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===GLSL3?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===GLSL3?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=T+m+s,x=T+p+o,C=WebGLShader(r,r.VERTEX_SHADER,S),A=WebGLShader(r,r.FRAGMENT_SHADER,x);r.attachShader(g,C),r.attachShader(g,A),n.index0AttributeName!==void 0?r.bindAttribLocation(g,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function R(w){if(t.debug.checkShaderErrors){const O=r.getProgramInfoLog(g).trim(),I=r.getShaderInfoLog(C).trim(),F=r.getShaderInfoLog(A).trim();let H=!0,$=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(H=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,g,C,A);else{const K=getShaderErrors(r,C,"vertex"),G=getShaderErrors(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+O+`
`+K+`
`+G)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(I===""||F==="")&&($=!1);$&&(w.diagnostics={runnable:H,programLog:O,vertexShader:{log:I,prefix:m},fragmentShader:{log:F,prefix:p}})}r.deleteShader(C),r.deleteShader(A),P=new WebGLUniforms(r,g),E=fetchAttributeLocations(r,g)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let v=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(g,COMPLETION_STATUS_KHR)),v},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=programIdCount++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=C,this.fragmentShader=A,this}let _id$1=0;class WebGLShaderCache{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),a=this._getShaderStage(i),s=this._getShaderCacheForMaterial(e);return s.has(r)===!1&&(s.add(r),r.usedTimes++),s.has(a)===!1&&(s.add(a),a.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new WebGLShaderStage(e),n.set(e,i)),i}}class WebGLShaderStage{constructor(e){this.id=_id$1++,this.code=e,this.usedTimes=0}}function WebGLPrograms(t,e,n,i,r,a,s){const o=new Layers,c=new WebGLShaderCache,l=new Set,h=[],d=r.logarithmicDepthBuffer,f=r.vertexTextures;let u=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(E){return l.add(E),E===0?"uv":`uv${E}`}function m(E,v,w,O,I){const F=O.fog,H=I.geometry,$=E.isMeshStandardMaterial?O.environment:null,K=(E.isMeshStandardMaterial?n:e).get(E.envMap||$),G=K&&K.mapping===CubeUVReflectionMapping?K.image.height:null,ee=_[E.type];E.precision!==null&&(u=r.getMaxPrecision(E.precision),u!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",u,"instead."));const oe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,me=oe!==void 0?oe.length:0;let Re=0;H.morphAttributes.position!==void 0&&(Re=1),H.morphAttributes.normal!==void 0&&(Re=2),H.morphAttributes.color!==void 0&&(Re=3);let Fe,W,J,ce;if(ee){const ze=ShaderLib[ee];Fe=ze.vertexShader,W=ze.fragmentShader}else Fe=E.vertexShader,W=E.fragmentShader,c.update(E),J=c.getVertexShaderID(E),ce=c.getFragmentShaderID(E);const te=t.getRenderTarget(),xe=t.state.buffers.depth.getReversed(),Te=I.isInstancedMesh===!0,Ce=I.isBatchedMesh===!0,We=!!E.map,Ue=!!E.matcap,qe=!!K,N=!!E.aoMap,Ze=!!E.lightMap,Pe=!!E.bumpMap,Le=!!E.normalMap,Me=!!E.displacementMap,$e=!!E.emissiveMap,ve=!!E.metalnessMap,b=!!E.roughnessMap,M=E.anisotropy>0,B=E.clearcoat>0,q=E.dispersion>0,j=E.iridescence>0,X=E.sheen>0,_e=E.transmission>0,ie=M&&!!E.anisotropyMap,le=B&&!!E.clearcoatMap,Ie=B&&!!E.clearcoatNormalMap,Z=B&&!!E.clearcoatRoughnessMap,he=j&&!!E.iridescenceMap,Se=j&&!!E.iridescenceThicknessMap,ye=X&&!!E.sheenColorMap,de=X&&!!E.sheenRoughnessMap,De=!!E.specularMap,we=!!E.specularColorMap,Ve=!!E.specularIntensityMap,L=_e&&!!E.transmissionMap,ne=_e&&!!E.thicknessMap,k=!!E.gradientMap,Y=!!E.alphaMap,se=E.alphaTest>0,re=!!E.alphaHash,Ae=!!E.extensions;let Xe=NoToneMapping;E.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Xe=t.toneMapping);const Ye={shaderID:ee,shaderType:E.type,shaderName:E.name,vertexShader:Fe,fragmentShader:W,defines:E.defines,customVertexShaderID:J,customFragmentShaderID:ce,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:u,batching:Ce,batchingColor:Ce&&I._colorsTexture!==null,instancing:Te,instancingColor:Te&&I.instanceColor!==null,instancingMorph:Te&&I.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?t.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:LinearSRGBColorSpace,alphaToCoverage:!!E.alphaToCoverage,map:We,matcap:Ue,envMap:qe,envMapMode:qe&&K.mapping,envMapCubeUVHeight:G,aoMap:N,lightMap:Ze,bumpMap:Pe,normalMap:Le,displacementMap:f&&Me,emissiveMap:$e,normalMapObjectSpace:Le&&E.normalMapType===ObjectSpaceNormalMap,normalMapTangentSpace:Le&&E.normalMapType===TangentSpaceNormalMap,metalnessMap:ve,roughnessMap:b,anisotropy:M,anisotropyMap:ie,clearcoat:B,clearcoatMap:le,clearcoatNormalMap:Ie,clearcoatRoughnessMap:Z,dispersion:q,iridescence:j,iridescenceMap:he,iridescenceThicknessMap:Se,sheen:X,sheenColorMap:ye,sheenRoughnessMap:de,specularMap:De,specularColorMap:we,specularIntensityMap:Ve,transmission:_e,transmissionMap:L,thicknessMap:ne,gradientMap:k,opaque:E.transparent===!1&&E.blending===NormalBlending&&E.alphaToCoverage===!1,alphaMap:Y,alphaTest:se,alphaHash:re,combine:E.combine,mapUv:We&&g(E.map.channel),aoMapUv:N&&g(E.aoMap.channel),lightMapUv:Ze&&g(E.lightMap.channel),bumpMapUv:Pe&&g(E.bumpMap.channel),normalMapUv:Le&&g(E.normalMap.channel),displacementMapUv:Me&&g(E.displacementMap.channel),emissiveMapUv:$e&&g(E.emissiveMap.channel),metalnessMapUv:ve&&g(E.metalnessMap.channel),roughnessMapUv:b&&g(E.roughnessMap.channel),anisotropyMapUv:ie&&g(E.anisotropyMap.channel),clearcoatMapUv:le&&g(E.clearcoatMap.channel),clearcoatNormalMapUv:Ie&&g(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&g(E.clearcoatRoughnessMap.channel),iridescenceMapUv:he&&g(E.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&g(E.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&g(E.sheenColorMap.channel),sheenRoughnessMapUv:de&&g(E.sheenRoughnessMap.channel),specularMapUv:De&&g(E.specularMap.channel),specularColorMapUv:we&&g(E.specularColorMap.channel),specularIntensityMapUv:Ve&&g(E.specularIntensityMap.channel),transmissionMapUv:L&&g(E.transmissionMap.channel),thicknessMapUv:ne&&g(E.thicknessMap.channel),alphaMapUv:Y&&g(E.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Le||M),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!H.attributes.uv&&(We||Y),fog:!!F,useFog:E.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:xe,skinning:I.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Re,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:E.dithering,shadowMapEnabled:t.shadowMap.enabled&&w.length>0,shadowMapType:t.shadowMap.type,toneMapping:Xe,decodeVideoTexture:We&&E.map.isVideoTexture===!0&&ColorManagement.getTransfer(E.map.colorSpace)===SRGBTransfer,decodeVideoTextureEmissive:$e&&E.emissiveMap.isVideoTexture===!0&&ColorManagement.getTransfer(E.emissiveMap.colorSpace)===SRGBTransfer,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===DoubleSide,flipSided:E.side===BackSide,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ae&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&E.extensions.multiDraw===!0||Ce)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Ye.vertexUv1s=l.has(1),Ye.vertexUv2s=l.has(2),Ye.vertexUv3s=l.has(3),l.clear(),Ye}function p(E){const v=[];if(E.shaderID?v.push(E.shaderID):(v.push(E.customVertexShaderID),v.push(E.customFragmentShaderID)),E.defines!==void 0)for(const w in E.defines)v.push(w),v.push(E.defines[w]);return E.isRawShaderMaterial===!1&&(T(v,E),S(v,E),v.push(t.outputColorSpace)),v.push(E.customProgramCacheKey),v.join()}function T(E,v){E.push(v.precision),E.push(v.outputColorSpace),E.push(v.envMapMode),E.push(v.envMapCubeUVHeight),E.push(v.mapUv),E.push(v.alphaMapUv),E.push(v.lightMapUv),E.push(v.aoMapUv),E.push(v.bumpMapUv),E.push(v.normalMapUv),E.push(v.displacementMapUv),E.push(v.emissiveMapUv),E.push(v.metalnessMapUv),E.push(v.roughnessMapUv),E.push(v.anisotropyMapUv),E.push(v.clearcoatMapUv),E.push(v.clearcoatNormalMapUv),E.push(v.clearcoatRoughnessMapUv),E.push(v.iridescenceMapUv),E.push(v.iridescenceThicknessMapUv),E.push(v.sheenColorMapUv),E.push(v.sheenRoughnessMapUv),E.push(v.specularMapUv),E.push(v.specularColorMapUv),E.push(v.specularIntensityMapUv),E.push(v.transmissionMapUv),E.push(v.thicknessMapUv),E.push(v.combine),E.push(v.fogExp2),E.push(v.sizeAttenuation),E.push(v.morphTargetsCount),E.push(v.morphAttributeCount),E.push(v.numDirLights),E.push(v.numPointLights),E.push(v.numSpotLights),E.push(v.numSpotLightMaps),E.push(v.numHemiLights),E.push(v.numRectAreaLights),E.push(v.numDirLightShadows),E.push(v.numPointLightShadows),E.push(v.numSpotLightShadows),E.push(v.numSpotLightShadowsWithMaps),E.push(v.numLightProbes),E.push(v.shadowMapType),E.push(v.toneMapping),E.push(v.numClippingPlanes),E.push(v.numClipIntersection),E.push(v.depthPacking)}function S(E,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),E.push(o.mask)}function x(E){const v=_[E.type];let w;if(v){const O=ShaderLib[v];w=UniformsUtils.clone(O.uniforms)}else w=E.uniforms;return w}function C(E,v){let w;for(let O=0,I=h.length;O<I;O++){const F=h[O];if(F.cacheKey===v){w=F,++w.usedTimes;break}}return w===void 0&&(w=new WebGLProgram(t,v,E,a),h.push(w)),w}function A(E){if(--E.usedTimes===0){const v=h.indexOf(E);h[v]=h[h.length-1],h.pop(),E.destroy()}}function R(E){c.remove(E)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:C,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:P}}function WebGLProperties(){let t=new WeakMap;function e(s){return t.has(s)}function n(s){let o=t.get(s);return o===void 0&&(o={},t.set(s,o)),o}function i(s){t.delete(s)}function r(s,o,c){t.get(s)[o]=c}function a(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:a}}function painterSortStable(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function reversePainterSortStable(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function WebGLRenderList(){const t=[];let e=0;const n=[],i=[],r=[];function a(){e=0,n.length=0,i.length=0,r.length=0}function s(d,f,u,_,g,m){let p=t[e];return p===void 0?(p={id:d.id,object:d,geometry:f,material:u,groupOrder:_,renderOrder:d.renderOrder,z:g,group:m},t[e]=p):(p.id=d.id,p.object=d,p.geometry=f,p.material=u,p.groupOrder=_,p.renderOrder=d.renderOrder,p.z=g,p.group=m),e++,p}function o(d,f,u,_,g,m){const p=s(d,f,u,_,g,m);u.transmission>0?i.push(p):u.transparent===!0?r.push(p):n.push(p)}function c(d,f,u,_,g,m){const p=s(d,f,u,_,g,m);u.transmission>0?i.unshift(p):u.transparent===!0?r.unshift(p):n.unshift(p)}function l(d,f){n.length>1&&n.sort(d||painterSortStable),i.length>1&&i.sort(f||reversePainterSortStable),r.length>1&&r.sort(f||reversePainterSortStable)}function h(){for(let d=e,f=t.length;d<f;d++){const u=t[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:n,transmissive:i,transparent:r,init:a,push:o,unshift:c,finish:h,sort:l}}function WebGLRenderLists(){let t=new WeakMap;function e(i,r){const a=t.get(i);let s;return a===void 0?(s=new WebGLRenderList,t.set(i,[s])):r>=a.length?(s=new WebGLRenderList,a.push(s)):s=a[r],s}function n(){t=new WeakMap}return{get:e,dispose:n}}function UniformsCache(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new Vector3,color:new Color};break;case"SpotLight":n={position:new Vector3,direction:new Vector3,color:new Color,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new Vector3,color:new Color,distance:0,decay:0};break;case"HemisphereLight":n={direction:new Vector3,skyColor:new Color,groundColor:new Color};break;case"RectAreaLight":n={color:new Color,position:new Vector3,halfWidth:new Vector3,halfHeight:new Vector3};break}return t[e.id]=n,n}}}function ShadowUniformsCache(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Vector2,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let nextVersion=0;function shadowCastingAndTexturingLightsFirst(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function WebGLLights(t){const e=new UniformsCache,n=ShadowUniformsCache(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new Vector3);const r=new Vector3,a=new Matrix4,s=new Matrix4;function o(l){let h=0,d=0,f=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let u=0,_=0,g=0,m=0,p=0,T=0,S=0,x=0,C=0,A=0,R=0;l.sort(shadowCastingAndTexturingLightsFirst);for(let E=0,v=l.length;E<v;E++){const w=l[E],O=w.color,I=w.intensity,F=w.distance,H=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=O.r*I,d+=O.g*I,f+=O.b*I;else if(w.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(w.sh.coefficients[$],I);R++}else if(w.isDirectionalLight){const $=e.get(w);if($.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const K=w.shadow,G=n.get(w);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,i.directionalShadow[u]=G,i.directionalShadowMap[u]=H,i.directionalShadowMatrix[u]=w.shadow.matrix,T++}i.directional[u]=$,u++}else if(w.isSpotLight){const $=e.get(w);$.position.setFromMatrixPosition(w.matrixWorld),$.color.copy(O).multiplyScalar(I),$.distance=F,$.coneCos=Math.cos(w.angle),$.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),$.decay=w.decay,i.spot[g]=$;const K=w.shadow;if(w.map&&(i.spotLightMap[C]=w.map,C++,K.updateMatrices(w),w.castShadow&&A++),i.spotLightMatrix[g]=K.matrix,w.castShadow){const G=n.get(w);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,i.spotShadow[g]=G,i.spotShadowMap[g]=H,x++}g++}else if(w.isRectAreaLight){const $=e.get(w);$.color.copy(O).multiplyScalar(I),$.halfWidth.set(w.width*.5,0,0),$.halfHeight.set(0,w.height*.5,0),i.rectArea[m]=$,m++}else if(w.isPointLight){const $=e.get(w);if($.color.copy(w.color).multiplyScalar(w.intensity),$.distance=w.distance,$.decay=w.decay,w.castShadow){const K=w.shadow,G=n.get(w);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,G.shadowCameraNear=K.camera.near,G.shadowCameraFar=K.camera.far,i.pointShadow[_]=G,i.pointShadowMap[_]=H,i.pointShadowMatrix[_]=w.shadow.matrix,S++}i.point[_]=$,_++}else if(w.isHemisphereLight){const $=e.get(w);$.skyColor.copy(w.color).multiplyScalar(I),$.groundColor.copy(w.groundColor).multiplyScalar(I),i.hemi[p]=$,p++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=UniformsLib.LTC_FLOAT_1,i.rectAreaLTC2=UniformsLib.LTC_FLOAT_2):(i.rectAreaLTC1=UniformsLib.LTC_HALF_1,i.rectAreaLTC2=UniformsLib.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=f;const P=i.hash;(P.directionalLength!==u||P.pointLength!==_||P.spotLength!==g||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==T||P.numPointShadows!==S||P.numSpotShadows!==x||P.numSpotMaps!==C||P.numLightProbes!==R)&&(i.directional.length=u,i.spot.length=g,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=x+C-A,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,P.directionalLength=u,P.pointLength=_,P.spotLength=g,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=T,P.numPointShadows=S,P.numSpotShadows=x,P.numSpotMaps=C,P.numLightProbes=R,i.version=nextVersion++)}function c(l,h){let d=0,f=0,u=0,_=0,g=0;const m=h.matrixWorldInverse;for(let p=0,T=l.length;p<T;p++){const S=l[p];if(S.isDirectionalLight){const x=i.directional[d];x.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),d++}else if(S.isSpotLight){const x=i.spot[u];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),u++}else if(S.isRectAreaLight){const x=i.rectArea[_];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),s.identity(),a.copy(S.matrixWorld),a.premultiply(m),s.extractRotation(a),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(s),x.halfHeight.applyMatrix4(s),_++}else if(S.isPointLight){const x=i.point[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){const x=i.hemi[g];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:i}}function WebGLRenderState(t){const e=new WebGLLights(t),n=[],i=[];function r(h){l.camera=h,n.length=0,i.length=0}function a(h){n.push(h)}function s(h){i.push(h)}function o(){e.setup(n)}function c(h){e.setupView(n,h)}const l={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:a,pushShadow:s}}function WebGLRenderStates(t){let e=new WeakMap;function n(r,a=0){const s=e.get(r);let o;return s===void 0?(o=new WebGLRenderState(t),e.set(r,[o])):a>=s.length?(o=new WebGLRenderState(t),s.push(o)):o=s[a],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class MeshDepthMaterial extends Material{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=BasicDepthPacking,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class MeshDistanceMaterial extends Material{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const vertex=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fragment=`uniform sampler2D shadow_pass;
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
}`;function WebGLShadowMap(t,e,n){let i=new Frustum;const r=new Vector2,a=new Vector2,s=new Vector4,o=new MeshDepthMaterial({depthPacking:RGBADepthPacking}),c=new MeshDistanceMaterial,l={},h=n.maxTextureSize,d={[FrontSide]:BackSide,[BackSide]:FrontSide,[DoubleSide]:DoubleSide},f=new ShaderMaterial({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Vector2},radius:{value:4}},vertexShader:vertex,fragmentShader:fragment}),u=f.clone();u.defines.HORIZONTAL_PASS=1;const _=new BufferGeometry;_.setAttribute("position",new BufferAttribute(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Mesh(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=PCFShadowMap;let p=this.type;this.render=function(A,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const E=t.getRenderTarget(),v=t.getActiveCubeFace(),w=t.getActiveMipmapLevel(),O=t.state;O.setBlending(NoBlending),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const I=p!==VSMShadowMap&&this.type===VSMShadowMap,F=p===VSMShadowMap&&this.type!==VSMShadowMap;for(let H=0,$=A.length;H<$;H++){const K=A[H],G=K.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;r.copy(G.mapSize);const ee=G.getFrameExtents();if(r.multiply(ee),a.copy(G.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(a.x=Math.floor(h/ee.x),r.x=a.x*ee.x,G.mapSize.x=a.x),r.y>h&&(a.y=Math.floor(h/ee.y),r.y=a.y*ee.y,G.mapSize.y=a.y)),G.map===null||I===!0||F===!0){const me=this.type!==VSMShadowMap?{minFilter:NearestFilter,magFilter:NearestFilter}:{};G.map!==null&&G.map.dispose(),G.map=new WebGLRenderTarget(r.x,r.y,me),G.map.texture.name=K.name+".shadowMap",G.camera.updateProjectionMatrix()}t.setRenderTarget(G.map),t.clear();const oe=G.getViewportCount();for(let me=0;me<oe;me++){const Re=G.getViewport(me);s.set(a.x*Re.x,a.y*Re.y,a.x*Re.z,a.y*Re.w),O.viewport(s),G.updateMatrices(K,me),i=G.getFrustum(),x(R,P,G.camera,K,this.type)}G.isPointLightShadow!==!0&&this.type===VSMShadowMap&&T(G,P),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,t.setRenderTarget(E,v,w)};function T(A,R){const P=e.update(g);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,u.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,u.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new WebGLRenderTarget(r.x,r.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(R,null,P,f,g,null),u.uniforms.shadow_pass.value=A.mapPass.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(R,null,P,u,g,null)}function S(A,R,P,E){let v=null;const w=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(w!==void 0)v=w;else if(v=P.isPointLight===!0?c:o,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const O=v.uuid,I=R.uuid;let F=l[O];F===void 0&&(F={},l[O]=F);let H=F[I];H===void 0&&(H=v.clone(),F[I]=H,R.addEventListener("dispose",C)),v=H}if(v.visible=R.visible,v.wireframe=R.wireframe,E===VSMShadowMap?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:d[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,P.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const O=t.properties.get(v);O.light=P}return v}function x(A,R,P,E,v){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===VSMShadowMap)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const I=e.update(A),F=A.material;if(Array.isArray(F)){const H=I.groups;for(let $=0,K=H.length;$<K;$++){const G=H[$],ee=F[G.materialIndex];if(ee&&ee.visible){const oe=S(A,ee,E,v);A.onBeforeShadow(t,A,R,P,I,oe,G),t.renderBufferDirect(P,null,I,oe,A,G),A.onAfterShadow(t,A,R,P,I,oe,G)}}}else if(F.visible){const H=S(A,F,E,v);A.onBeforeShadow(t,A,R,P,I,H,null),t.renderBufferDirect(P,null,I,H,A,null),A.onAfterShadow(t,A,R,P,I,H,null)}}const O=A.children;for(let I=0,F=O.length;I<F;I++)x(O[I],R,P,E,v)}function C(A){A.target.removeEventListener("dispose",C);for(const P in l){const E=l[P],v=A.target.uuid;v in E&&(E[v].dispose(),delete E[v])}}}const reversedFuncs={[NeverDepth]:AlwaysDepth,[LessDepth]:GreaterDepth,[EqualDepth]:NotEqualDepth,[LessEqualDepth]:GreaterEqualDepth,[AlwaysDepth]:NeverDepth,[GreaterDepth]:LessDepth,[NotEqualDepth]:EqualDepth,[GreaterEqualDepth]:LessEqualDepth};function WebGLState(t,e){function n(){let L=!1;const ne=new Vector4;let k=null;const Y=new Vector4(0,0,0,0);return{setMask:function(se){k!==se&&!L&&(t.colorMask(se,se,se,se),k=se)},setLocked:function(se){L=se},setClear:function(se,re,Ae,Xe,Ye){Ye===!0&&(se*=Xe,re*=Xe,Ae*=Xe),ne.set(se,re,Ae,Xe),Y.equals(ne)===!1&&(t.clearColor(se,re,Ae,Xe),Y.copy(ne))},reset:function(){L=!1,k=null,Y.set(-1,0,0,0)}}}function i(){let L=!1,ne=!1,k=null,Y=null,se=null;return{setReversed:function(re){if(ne!==re){const Ae=e.get("EXT_clip_control");ne?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT);const Xe=se;se=null,this.setClear(Xe)}ne=re},getReversed:function(){return ne},setTest:function(re){re?te(t.DEPTH_TEST):xe(t.DEPTH_TEST)},setMask:function(re){k!==re&&!L&&(t.depthMask(re),k=re)},setFunc:function(re){if(ne&&(re=reversedFuncs[re]),Y!==re){switch(re){case NeverDepth:t.depthFunc(t.NEVER);break;case AlwaysDepth:t.depthFunc(t.ALWAYS);break;case LessDepth:t.depthFunc(t.LESS);break;case LessEqualDepth:t.depthFunc(t.LEQUAL);break;case EqualDepth:t.depthFunc(t.EQUAL);break;case GreaterEqualDepth:t.depthFunc(t.GEQUAL);break;case GreaterDepth:t.depthFunc(t.GREATER);break;case NotEqualDepth:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Y=re}},setLocked:function(re){L=re},setClear:function(re){se!==re&&(ne&&(re=1-re),t.clearDepth(re),se=re)},reset:function(){L=!1,k=null,Y=null,se=null,ne=!1}}}function r(){let L=!1,ne=null,k=null,Y=null,se=null,re=null,Ae=null,Xe=null,Ye=null;return{setTest:function(ze){L||(ze?te(t.STENCIL_TEST):xe(t.STENCIL_TEST))},setMask:function(ze){ne!==ze&&!L&&(t.stencilMask(ze),ne=ze)},setFunc:function(ze,Qe,nt){(k!==ze||Y!==Qe||se!==nt)&&(t.stencilFunc(ze,Qe,nt),k=ze,Y=Qe,se=nt)},setOp:function(ze,Qe,nt){(re!==ze||Ae!==Qe||Xe!==nt)&&(t.stencilOp(ze,Qe,nt),re=ze,Ae=Qe,Xe=nt)},setLocked:function(ze){L=ze},setClear:function(ze){Ye!==ze&&(t.clearStencil(ze),Ye=ze)},reset:function(){L=!1,ne=null,k=null,Y=null,se=null,re=null,Ae=null,Xe=null,Ye=null}}}const a=new n,s=new i,o=new r,c=new WeakMap,l=new WeakMap;let h={},d={},f=new WeakMap,u=[],_=null,g=!1,m=null,p=null,T=null,S=null,x=null,C=null,A=null,R=new Color(0,0,0),P=0,E=!1,v=null,w=null,O=null,I=null,F=null;const H=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,K=0;const G=t.getParameter(t.VERSION);G.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(G)[1]),$=K>=1):G.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),$=K>=2);let ee=null,oe={};const me=t.getParameter(t.SCISSOR_BOX),Re=t.getParameter(t.VIEWPORT),Fe=new Vector4().fromArray(me),W=new Vector4().fromArray(Re);function J(L,ne,k,Y){const se=new Uint8Array(4),re=t.createTexture();t.bindTexture(L,re),t.texParameteri(L,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(L,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ae=0;Ae<k;Ae++)L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?t.texImage3D(ne,0,t.RGBA,1,1,Y,0,t.RGBA,t.UNSIGNED_BYTE,se):t.texImage2D(ne+Ae,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,se);return re}const ce={};ce[t.TEXTURE_2D]=J(t.TEXTURE_2D,t.TEXTURE_2D,1),ce[t.TEXTURE_CUBE_MAP]=J(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[t.TEXTURE_2D_ARRAY]=J(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ce[t.TEXTURE_3D]=J(t.TEXTURE_3D,t.TEXTURE_3D,1,1),a.setClear(0,0,0,1),s.setClear(1),o.setClear(0),te(t.DEPTH_TEST),s.setFunc(LessEqualDepth),Pe(!1),Le(CullFaceBack),te(t.CULL_FACE),N(NoBlending);function te(L){h[L]!==!0&&(t.enable(L),h[L]=!0)}function xe(L){h[L]!==!1&&(t.disable(L),h[L]=!1)}function Te(L,ne){return d[L]!==ne?(t.bindFramebuffer(L,ne),d[L]=ne,L===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=ne),L===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=ne),!0):!1}function Ce(L,ne){let k=u,Y=!1;if(L){k=f.get(ne),k===void 0&&(k=[],f.set(ne,k));const se=L.textures;if(k.length!==se.length||k[0]!==t.COLOR_ATTACHMENT0){for(let re=0,Ae=se.length;re<Ae;re++)k[re]=t.COLOR_ATTACHMENT0+re;k.length=se.length,Y=!0}}else k[0]!==t.BACK&&(k[0]=t.BACK,Y=!0);Y&&t.drawBuffers(k)}function We(L){return _!==L?(t.useProgram(L),_=L,!0):!1}const Ue={[AddEquation]:t.FUNC_ADD,[SubtractEquation]:t.FUNC_SUBTRACT,[ReverseSubtractEquation]:t.FUNC_REVERSE_SUBTRACT};Ue[MinEquation]=t.MIN,Ue[MaxEquation]=t.MAX;const qe={[ZeroFactor]:t.ZERO,[OneFactor]:t.ONE,[SrcColorFactor]:t.SRC_COLOR,[SrcAlphaFactor]:t.SRC_ALPHA,[SrcAlphaSaturateFactor]:t.SRC_ALPHA_SATURATE,[DstColorFactor]:t.DST_COLOR,[DstAlphaFactor]:t.DST_ALPHA,[OneMinusSrcColorFactor]:t.ONE_MINUS_SRC_COLOR,[OneMinusSrcAlphaFactor]:t.ONE_MINUS_SRC_ALPHA,[OneMinusDstColorFactor]:t.ONE_MINUS_DST_COLOR,[OneMinusDstAlphaFactor]:t.ONE_MINUS_DST_ALPHA,[ConstantColorFactor]:t.CONSTANT_COLOR,[OneMinusConstantColorFactor]:t.ONE_MINUS_CONSTANT_COLOR,[ConstantAlphaFactor]:t.CONSTANT_ALPHA,[OneMinusConstantAlphaFactor]:t.ONE_MINUS_CONSTANT_ALPHA};function N(L,ne,k,Y,se,re,Ae,Xe,Ye,ze){if(L===NoBlending){g===!0&&(xe(t.BLEND),g=!1);return}if(g===!1&&(te(t.BLEND),g=!0),L!==CustomBlending){if(L!==m||ze!==E){if((p!==AddEquation||x!==AddEquation)&&(t.blendEquation(t.FUNC_ADD),p=AddEquation,x=AddEquation),ze)switch(L){case NormalBlending:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case AdditiveBlending:t.blendFunc(t.ONE,t.ONE);break;case SubtractiveBlending:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case MultiplyBlending:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case NormalBlending:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case AdditiveBlending:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case SubtractiveBlending:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case MultiplyBlending:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}T=null,S=null,C=null,A=null,R.set(0,0,0),P=0,m=L,E=ze}return}se=se||ne,re=re||k,Ae=Ae||Y,(ne!==p||se!==x)&&(t.blendEquationSeparate(Ue[ne],Ue[se]),p=ne,x=se),(k!==T||Y!==S||re!==C||Ae!==A)&&(t.blendFuncSeparate(qe[k],qe[Y],qe[re],qe[Ae]),T=k,S=Y,C=re,A=Ae),(Xe.equals(R)===!1||Ye!==P)&&(t.blendColor(Xe.r,Xe.g,Xe.b,Ye),R.copy(Xe),P=Ye),m=L,E=!1}function Ze(L,ne){L.side===DoubleSide?xe(t.CULL_FACE):te(t.CULL_FACE);let k=L.side===BackSide;ne&&(k=!k),Pe(k),L.blending===NormalBlending&&L.transparent===!1?N(NoBlending):N(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),s.setFunc(L.depthFunc),s.setTest(L.depthTest),s.setMask(L.depthWrite),a.setMask(L.colorWrite);const Y=L.stencilWrite;o.setTest(Y),Y&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),$e(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?te(t.SAMPLE_ALPHA_TO_COVERAGE):xe(t.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(L){v!==L&&(L?t.frontFace(t.CW):t.frontFace(t.CCW),v=L)}function Le(L){L!==CullFaceNone?(te(t.CULL_FACE),L!==w&&(L===CullFaceBack?t.cullFace(t.BACK):L===CullFaceFront?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):xe(t.CULL_FACE),w=L}function Me(L){L!==O&&($&&t.lineWidth(L),O=L)}function $e(L,ne,k){L?(te(t.POLYGON_OFFSET_FILL),(I!==ne||F!==k)&&(t.polygonOffset(ne,k),I=ne,F=k)):xe(t.POLYGON_OFFSET_FILL)}function ve(L){L?te(t.SCISSOR_TEST):xe(t.SCISSOR_TEST)}function b(L){L===void 0&&(L=t.TEXTURE0+H-1),ee!==L&&(t.activeTexture(L),ee=L)}function M(L,ne,k){k===void 0&&(ee===null?k=t.TEXTURE0+H-1:k=ee);let Y=oe[k];Y===void 0&&(Y={type:void 0,texture:void 0},oe[k]=Y),(Y.type!==L||Y.texture!==ne)&&(ee!==k&&(t.activeTexture(k),ee=k),t.bindTexture(L,ne||ce[L]),Y.type=L,Y.texture=ne)}function B(){const L=oe[ee];L!==void 0&&L.type!==void 0&&(t.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function q(){try{t.compressedTexImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{t.compressedTexImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{t.texSubImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function _e(){try{t.texSubImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function le(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ie(){try{t.texStorage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{t.texStorage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function he(){try{t.texImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Se(){try{t.texImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(L){Fe.equals(L)===!1&&(t.scissor(L.x,L.y,L.z,L.w),Fe.copy(L))}function de(L){W.equals(L)===!1&&(t.viewport(L.x,L.y,L.z,L.w),W.copy(L))}function De(L,ne){let k=l.get(ne);k===void 0&&(k=new WeakMap,l.set(ne,k));let Y=k.get(L);Y===void 0&&(Y=t.getUniformBlockIndex(ne,L.name),k.set(L,Y))}function we(L,ne){const Y=l.get(ne).get(L);c.get(ne)!==Y&&(t.uniformBlockBinding(ne,Y,L.__bindingPointIndex),c.set(ne,Y))}function Ve(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),s.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},ee=null,oe={},d={},f=new WeakMap,u=[],_=null,g=!1,m=null,p=null,T=null,S=null,x=null,C=null,A=null,R=new Color(0,0,0),P=0,E=!1,v=null,w=null,O=null,I=null,F=null,Fe.set(0,0,t.canvas.width,t.canvas.height),W.set(0,0,t.canvas.width,t.canvas.height),a.reset(),s.reset(),o.reset()}return{buffers:{color:a,depth:s,stencil:o},enable:te,disable:xe,bindFramebuffer:Te,drawBuffers:Ce,useProgram:We,setBlending:N,setMaterial:Ze,setFlipSided:Pe,setCullFace:Le,setLineWidth:Me,setPolygonOffset:$e,setScissorTest:ve,activeTexture:b,bindTexture:M,unbindTexture:B,compressedTexImage2D:q,compressedTexImage3D:j,texImage2D:he,texImage3D:Se,updateUBOMapping:De,uniformBlockBinding:we,texStorage2D:Ie,texStorage3D:Z,texSubImage2D:X,texSubImage3D:_e,compressedTexSubImage2D:ie,compressedTexSubImage3D:le,scissor:ye,viewport:de,reset:Ve}}function getByteLength(t,e,n,i){const r=getTextureTypeByteLength(i);switch(n){case AlphaFormat:return t*e;case LuminanceFormat:return t*e;case LuminanceAlphaFormat:return t*e*2;case RedFormat:return t*e/r.components*r.byteLength;case RedIntegerFormat:return t*e/r.components*r.byteLength;case RGFormat:return t*e*2/r.components*r.byteLength;case RGIntegerFormat:return t*e*2/r.components*r.byteLength;case RGBFormat:return t*e*3/r.components*r.byteLength;case RGBAFormat:return t*e*4/r.components*r.byteLength;case RGBAIntegerFormat:return t*e*4/r.components*r.byteLength;case RGB_S3TC_DXT1_Format:case RGBA_S3TC_DXT1_Format:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case RGBA_S3TC_DXT3_Format:case RGBA_S3TC_DXT5_Format:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case RGB_PVRTC_2BPPV1_Format:case RGBA_PVRTC_2BPPV1_Format:return Math.max(t,16)*Math.max(e,8)/4;case RGB_PVRTC_4BPPV1_Format:case RGBA_PVRTC_4BPPV1_Format:return Math.max(t,8)*Math.max(e,8)/2;case RGB_ETC1_Format:case RGB_ETC2_Format:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case RGBA_ETC2_EAC_Format:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case RGBA_ASTC_4x4_Format:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case RGBA_ASTC_5x4_Format:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case RGBA_ASTC_5x5_Format:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case RGBA_ASTC_6x5_Format:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case RGBA_ASTC_6x6_Format:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case RGBA_ASTC_8x5_Format:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case RGBA_ASTC_8x6_Format:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case RGBA_ASTC_8x8_Format:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case RGBA_ASTC_10x5_Format:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case RGBA_ASTC_10x6_Format:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case RGBA_ASTC_10x8_Format:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case RGBA_ASTC_10x10_Format:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case RGBA_ASTC_12x10_Format:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case RGBA_ASTC_12x12_Format:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case RGBA_BPTC_Format:case RGB_BPTC_SIGNED_Format:case RGB_BPTC_UNSIGNED_Format:return Math.ceil(t/4)*Math.ceil(e/4)*16;case RED_RGTC1_Format:case SIGNED_RED_RGTC1_Format:return Math.ceil(t/4)*Math.ceil(e/4)*8;case RED_GREEN_RGTC2_Format:case SIGNED_RED_GREEN_RGTC2_Format:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function getTextureTypeByteLength(t){switch(t){case UnsignedByteType:case ByteType:return{byteLength:1,components:1};case UnsignedShortType:case ShortType:case HalfFloatType:return{byteLength:2,components:1};case UnsignedShort4444Type:case UnsignedShort5551Type:return{byteLength:2,components:4};case UnsignedIntType:case IntType:case FloatType:return{byteLength:4,components:1};case UnsignedInt5999Type:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function WebGLTextures(t,e,n,i,r,a,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Vector2,h=new WeakMap;let d;const f=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(b,M){return u?new OffscreenCanvas(b,M):createElementNS("canvas")}function g(b,M,B){let q=1;const j=ve(b);if((j.width>B||j.height>B)&&(q=B/Math.max(j.width,j.height)),q<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const X=Math.floor(q*j.width),_e=Math.floor(q*j.height);d===void 0&&(d=_(X,_e));const ie=M?_(X,_e):d;return ie.width=X,ie.height=_e,ie.getContext("2d").drawImage(b,0,0,X,_e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+X+"x"+_e+")."),ie}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),b;return b}function m(b){return b.generateMipmaps}function p(b){t.generateMipmap(b)}function T(b){return b.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?t.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function S(b,M,B,q,j=!1){if(b!==null){if(t[b]!==void 0)return t[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let X=M;if(M===t.RED&&(B===t.FLOAT&&(X=t.R32F),B===t.HALF_FLOAT&&(X=t.R16F),B===t.UNSIGNED_BYTE&&(X=t.R8)),M===t.RED_INTEGER&&(B===t.UNSIGNED_BYTE&&(X=t.R8UI),B===t.UNSIGNED_SHORT&&(X=t.R16UI),B===t.UNSIGNED_INT&&(X=t.R32UI),B===t.BYTE&&(X=t.R8I),B===t.SHORT&&(X=t.R16I),B===t.INT&&(X=t.R32I)),M===t.RG&&(B===t.FLOAT&&(X=t.RG32F),B===t.HALF_FLOAT&&(X=t.RG16F),B===t.UNSIGNED_BYTE&&(X=t.RG8)),M===t.RG_INTEGER&&(B===t.UNSIGNED_BYTE&&(X=t.RG8UI),B===t.UNSIGNED_SHORT&&(X=t.RG16UI),B===t.UNSIGNED_INT&&(X=t.RG32UI),B===t.BYTE&&(X=t.RG8I),B===t.SHORT&&(X=t.RG16I),B===t.INT&&(X=t.RG32I)),M===t.RGB_INTEGER&&(B===t.UNSIGNED_BYTE&&(X=t.RGB8UI),B===t.UNSIGNED_SHORT&&(X=t.RGB16UI),B===t.UNSIGNED_INT&&(X=t.RGB32UI),B===t.BYTE&&(X=t.RGB8I),B===t.SHORT&&(X=t.RGB16I),B===t.INT&&(X=t.RGB32I)),M===t.RGBA_INTEGER&&(B===t.UNSIGNED_BYTE&&(X=t.RGBA8UI),B===t.UNSIGNED_SHORT&&(X=t.RGBA16UI),B===t.UNSIGNED_INT&&(X=t.RGBA32UI),B===t.BYTE&&(X=t.RGBA8I),B===t.SHORT&&(X=t.RGBA16I),B===t.INT&&(X=t.RGBA32I)),M===t.RGB&&B===t.UNSIGNED_INT_5_9_9_9_REV&&(X=t.RGB9_E5),M===t.RGBA){const _e=j?LinearTransfer:ColorManagement.getTransfer(q);B===t.FLOAT&&(X=t.RGBA32F),B===t.HALF_FLOAT&&(X=t.RGBA16F),B===t.UNSIGNED_BYTE&&(X=_e===SRGBTransfer?t.SRGB8_ALPHA8:t.RGBA8),B===t.UNSIGNED_SHORT_4_4_4_4&&(X=t.RGBA4),B===t.UNSIGNED_SHORT_5_5_5_1&&(X=t.RGB5_A1)}return(X===t.R16F||X===t.R32F||X===t.RG16F||X===t.RG32F||X===t.RGBA16F||X===t.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function x(b,M){let B;return b?M===null||M===UnsignedIntType||M===UnsignedInt248Type?B=t.DEPTH24_STENCIL8:M===FloatType?B=t.DEPTH32F_STENCIL8:M===UnsignedShortType&&(B=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===UnsignedIntType||M===UnsignedInt248Type?B=t.DEPTH_COMPONENT24:M===FloatType?B=t.DEPTH_COMPONENT32F:M===UnsignedShortType&&(B=t.DEPTH_COMPONENT16),B}function C(b,M){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==NearestFilter&&b.minFilter!==LinearFilter?Math.log2(Math.max(M.width,M.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?M.mipmaps.length:1}function A(b){const M=b.target;M.removeEventListener("dispose",A),P(M),M.isVideoTexture&&h.delete(M)}function R(b){const M=b.target;M.removeEventListener("dispose",R),v(M)}function P(b){const M=i.get(b);if(M.__webglInit===void 0)return;const B=b.source,q=f.get(B);if(q){const j=q[M.__cacheKey];j.usedTimes--,j.usedTimes===0&&E(b),Object.keys(q).length===0&&f.delete(B)}i.remove(b)}function E(b){const M=i.get(b);t.deleteTexture(M.__webglTexture);const B=b.source,q=f.get(B);delete q[M.__cacheKey],s.memory.textures--}function v(b){const M=i.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),i.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(M.__webglFramebuffer[q]))for(let j=0;j<M.__webglFramebuffer[q].length;j++)t.deleteFramebuffer(M.__webglFramebuffer[q][j]);else t.deleteFramebuffer(M.__webglFramebuffer[q]);M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer[q])}else{if(Array.isArray(M.__webglFramebuffer))for(let q=0;q<M.__webglFramebuffer.length;q++)t.deleteFramebuffer(M.__webglFramebuffer[q]);else t.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&t.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let q=0;q<M.__webglColorRenderbuffer.length;q++)M.__webglColorRenderbuffer[q]&&t.deleteRenderbuffer(M.__webglColorRenderbuffer[q]);M.__webglDepthRenderbuffer&&t.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const B=b.textures;for(let q=0,j=B.length;q<j;q++){const X=i.get(B[q]);X.__webglTexture&&(t.deleteTexture(X.__webglTexture),s.memory.textures--),i.remove(B[q])}i.remove(b)}let w=0;function O(){w=0}function I(){const b=w;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),w+=1,b}function F(b){const M=[];return M.push(b.wrapS),M.push(b.wrapT),M.push(b.wrapR||0),M.push(b.magFilter),M.push(b.minFilter),M.push(b.anisotropy),M.push(b.internalFormat),M.push(b.format),M.push(b.type),M.push(b.generateMipmaps),M.push(b.premultiplyAlpha),M.push(b.flipY),M.push(b.unpackAlignment),M.push(b.colorSpace),M.join()}function H(b,M){const B=i.get(b);if(b.isVideoTexture&&Me(b),b.isRenderTargetTexture===!1&&b.version>0&&B.__version!==b.version){const q=b.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(B,b,M);return}}n.bindTexture(t.TEXTURE_2D,B.__webglTexture,t.TEXTURE0+M)}function $(b,M){const B=i.get(b);if(b.version>0&&B.__version!==b.version){W(B,b,M);return}n.bindTexture(t.TEXTURE_2D_ARRAY,B.__webglTexture,t.TEXTURE0+M)}function K(b,M){const B=i.get(b);if(b.version>0&&B.__version!==b.version){W(B,b,M);return}n.bindTexture(t.TEXTURE_3D,B.__webglTexture,t.TEXTURE0+M)}function G(b,M){const B=i.get(b);if(b.version>0&&B.__version!==b.version){J(B,b,M);return}n.bindTexture(t.TEXTURE_CUBE_MAP,B.__webglTexture,t.TEXTURE0+M)}const ee={[RepeatWrapping]:t.REPEAT,[ClampToEdgeWrapping]:t.CLAMP_TO_EDGE,[MirroredRepeatWrapping]:t.MIRRORED_REPEAT},oe={[NearestFilter]:t.NEAREST,[NearestMipmapNearestFilter]:t.NEAREST_MIPMAP_NEAREST,[NearestMipmapLinearFilter]:t.NEAREST_MIPMAP_LINEAR,[LinearFilter]:t.LINEAR,[LinearMipmapNearestFilter]:t.LINEAR_MIPMAP_NEAREST,[LinearMipmapLinearFilter]:t.LINEAR_MIPMAP_LINEAR},me={[NeverCompare]:t.NEVER,[AlwaysCompare]:t.ALWAYS,[LessCompare]:t.LESS,[LessEqualCompare]:t.LEQUAL,[EqualCompare]:t.EQUAL,[GreaterEqualCompare]:t.GEQUAL,[GreaterCompare]:t.GREATER,[NotEqualCompare]:t.NOTEQUAL};function Re(b,M){if(M.type===FloatType&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===LinearFilter||M.magFilter===LinearMipmapNearestFilter||M.magFilter===NearestMipmapLinearFilter||M.magFilter===LinearMipmapLinearFilter||M.minFilter===LinearFilter||M.minFilter===LinearMipmapNearestFilter||M.minFilter===NearestMipmapLinearFilter||M.minFilter===LinearMipmapLinearFilter)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(b,t.TEXTURE_WRAP_S,ee[M.wrapS]),t.texParameteri(b,t.TEXTURE_WRAP_T,ee[M.wrapT]),(b===t.TEXTURE_3D||b===t.TEXTURE_2D_ARRAY)&&t.texParameteri(b,t.TEXTURE_WRAP_R,ee[M.wrapR]),t.texParameteri(b,t.TEXTURE_MAG_FILTER,oe[M.magFilter]),t.texParameteri(b,t.TEXTURE_MIN_FILTER,oe[M.minFilter]),M.compareFunction&&(t.texParameteri(b,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(b,t.TEXTURE_COMPARE_FUNC,me[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===NearestFilter||M.minFilter!==NearestMipmapLinearFilter&&M.minFilter!==LinearMipmapLinearFilter||M.type===FloatType&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");t.texParameterf(b,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Fe(b,M){let B=!1;b.__webglInit===void 0&&(b.__webglInit=!0,M.addEventListener("dispose",A));const q=M.source;let j=f.get(q);j===void 0&&(j={},f.set(q,j));const X=F(M);if(X!==b.__cacheKey){j[X]===void 0&&(j[X]={texture:t.createTexture(),usedTimes:0},s.memory.textures++,B=!0),j[X].usedTimes++;const _e=j[b.__cacheKey];_e!==void 0&&(j[b.__cacheKey].usedTimes--,_e.usedTimes===0&&E(M)),b.__cacheKey=X,b.__webglTexture=j[X].texture}return B}function W(b,M,B){let q=t.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(q=t.TEXTURE_2D_ARRAY),M.isData3DTexture&&(q=t.TEXTURE_3D);const j=Fe(b,M),X=M.source;n.bindTexture(q,b.__webglTexture,t.TEXTURE0+B);const _e=i.get(X);if(X.version!==_e.__version||j===!0){n.activeTexture(t.TEXTURE0+B);const ie=ColorManagement.getPrimaries(ColorManagement.workingColorSpace),le=M.colorSpace===NoColorSpace?null:ColorManagement.getPrimaries(M.colorSpace),Ie=M.colorSpace===NoColorSpace||ie===le?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let Z=g(M.image,!1,r.maxTextureSize);Z=$e(M,Z);const he=a.convert(M.format,M.colorSpace),Se=a.convert(M.type);let ye=S(M.internalFormat,he,Se,M.colorSpace,M.isVideoTexture);Re(q,M);let de;const De=M.mipmaps,we=M.isVideoTexture!==!0,Ve=_e.__version===void 0||j===!0,L=X.dataReady,ne=C(M,Z);if(M.isDepthTexture)ye=x(M.format===DepthStencilFormat,M.type),Ve&&(we?n.texStorage2D(t.TEXTURE_2D,1,ye,Z.width,Z.height):n.texImage2D(t.TEXTURE_2D,0,ye,Z.width,Z.height,0,he,Se,null));else if(M.isDataTexture)if(De.length>0){we&&Ve&&n.texStorage2D(t.TEXTURE_2D,ne,ye,De[0].width,De[0].height);for(let k=0,Y=De.length;k<Y;k++)de=De[k],we?L&&n.texSubImage2D(t.TEXTURE_2D,k,0,0,de.width,de.height,he,Se,de.data):n.texImage2D(t.TEXTURE_2D,k,ye,de.width,de.height,0,he,Se,de.data);M.generateMipmaps=!1}else we?(Ve&&n.texStorage2D(t.TEXTURE_2D,ne,ye,Z.width,Z.height),L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Z.width,Z.height,he,Se,Z.data)):n.texImage2D(t.TEXTURE_2D,0,ye,Z.width,Z.height,0,he,Se,Z.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){we&&Ve&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ne,ye,De[0].width,De[0].height,Z.depth);for(let k=0,Y=De.length;k<Y;k++)if(de=De[k],M.format!==RGBAFormat)if(he!==null)if(we){if(L)if(M.layerUpdates.size>0){const se=getByteLength(de.width,de.height,M.format,M.type);for(const re of M.layerUpdates){const Ae=de.data.subarray(re*se/de.data.BYTES_PER_ELEMENT,(re+1)*se/de.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,k,0,0,re,de.width,de.height,1,he,Ae)}M.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,k,0,0,0,de.width,de.height,Z.depth,he,de.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,k,ye,de.width,de.height,Z.depth,0,de.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else we?L&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,k,0,0,0,de.width,de.height,Z.depth,he,Se,de.data):n.texImage3D(t.TEXTURE_2D_ARRAY,k,ye,de.width,de.height,Z.depth,0,he,Se,de.data)}else{we&&Ve&&n.texStorage2D(t.TEXTURE_2D,ne,ye,De[0].width,De[0].height);for(let k=0,Y=De.length;k<Y;k++)de=De[k],M.format!==RGBAFormat?he!==null?we?L&&n.compressedTexSubImage2D(t.TEXTURE_2D,k,0,0,de.width,de.height,he,de.data):n.compressedTexImage2D(t.TEXTURE_2D,k,ye,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):we?L&&n.texSubImage2D(t.TEXTURE_2D,k,0,0,de.width,de.height,he,Se,de.data):n.texImage2D(t.TEXTURE_2D,k,ye,de.width,de.height,0,he,Se,de.data)}else if(M.isDataArrayTexture)if(we){if(Ve&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ne,ye,Z.width,Z.height,Z.depth),L)if(M.layerUpdates.size>0){const k=getByteLength(Z.width,Z.height,M.format,M.type);for(const Y of M.layerUpdates){const se=Z.data.subarray(Y*k/Z.data.BYTES_PER_ELEMENT,(Y+1)*k/Z.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Y,Z.width,Z.height,1,he,Se,se)}M.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,he,Se,Z.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,ye,Z.width,Z.height,Z.depth,0,he,Se,Z.data);else if(M.isData3DTexture)we?(Ve&&n.texStorage3D(t.TEXTURE_3D,ne,ye,Z.width,Z.height,Z.depth),L&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,he,Se,Z.data)):n.texImage3D(t.TEXTURE_3D,0,ye,Z.width,Z.height,Z.depth,0,he,Se,Z.data);else if(M.isFramebufferTexture){if(Ve)if(we)n.texStorage2D(t.TEXTURE_2D,ne,ye,Z.width,Z.height);else{let k=Z.width,Y=Z.height;for(let se=0;se<ne;se++)n.texImage2D(t.TEXTURE_2D,se,ye,k,Y,0,he,Se,null),k>>=1,Y>>=1}}else if(De.length>0){if(we&&Ve){const k=ve(De[0]);n.texStorage2D(t.TEXTURE_2D,ne,ye,k.width,k.height)}for(let k=0,Y=De.length;k<Y;k++)de=De[k],we?L&&n.texSubImage2D(t.TEXTURE_2D,k,0,0,he,Se,de):n.texImage2D(t.TEXTURE_2D,k,ye,he,Se,de);M.generateMipmaps=!1}else if(we){if(Ve){const k=ve(Z);n.texStorage2D(t.TEXTURE_2D,ne,ye,k.width,k.height)}L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,he,Se,Z)}else n.texImage2D(t.TEXTURE_2D,0,ye,he,Se,Z);m(M)&&p(q),_e.__version=X.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function J(b,M,B){if(M.image.length!==6)return;const q=Fe(b,M),j=M.source;n.bindTexture(t.TEXTURE_CUBE_MAP,b.__webglTexture,t.TEXTURE0+B);const X=i.get(j);if(j.version!==X.__version||q===!0){n.activeTexture(t.TEXTURE0+B);const _e=ColorManagement.getPrimaries(ColorManagement.workingColorSpace),ie=M.colorSpace===NoColorSpace?null:ColorManagement.getPrimaries(M.colorSpace),le=M.colorSpace===NoColorSpace||_e===ie?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const Ie=M.isCompressedTexture||M.image[0].isCompressedTexture,Z=M.image[0]&&M.image[0].isDataTexture,he=[];for(let Y=0;Y<6;Y++)!Ie&&!Z?he[Y]=g(M.image[Y],!0,r.maxCubemapSize):he[Y]=Z?M.image[Y].image:M.image[Y],he[Y]=$e(M,he[Y]);const Se=he[0],ye=a.convert(M.format,M.colorSpace),de=a.convert(M.type),De=S(M.internalFormat,ye,de,M.colorSpace),we=M.isVideoTexture!==!0,Ve=X.__version===void 0||q===!0,L=j.dataReady;let ne=C(M,Se);Re(t.TEXTURE_CUBE_MAP,M);let k;if(Ie){we&&Ve&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ne,De,Se.width,Se.height);for(let Y=0;Y<6;Y++){k=he[Y].mipmaps;for(let se=0;se<k.length;se++){const re=k[se];M.format!==RGBAFormat?ye!==null?we?L&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se,0,0,re.width,re.height,ye,re.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se,De,re.width,re.height,0,re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):we?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se,0,0,re.width,re.height,ye,de,re.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se,De,re.width,re.height,0,ye,de,re.data)}}}else{if(k=M.mipmaps,we&&Ve){k.length>0&&ne++;const Y=ve(he[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ne,De,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(Z){we?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,he[Y].width,he[Y].height,ye,de,he[Y].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,De,he[Y].width,he[Y].height,0,ye,de,he[Y].data);for(let se=0;se<k.length;se++){const Ae=k[se].image[Y].image;we?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se+1,0,0,Ae.width,Ae.height,ye,de,Ae.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se+1,De,Ae.width,Ae.height,0,ye,de,Ae.data)}}else{we?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ye,de,he[Y]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,De,ye,de,he[Y]);for(let se=0;se<k.length;se++){const re=k[se];we?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se+1,0,0,ye,de,re.image[Y]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Y,se+1,De,ye,de,re.image[Y])}}}m(M)&&p(t.TEXTURE_CUBE_MAP),X.__version=j.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function ce(b,M,B,q,j,X){const _e=a.convert(B.format,B.colorSpace),ie=a.convert(B.type),le=S(B.internalFormat,_e,ie,B.colorSpace),Ie=i.get(M),Z=i.get(B);if(Z.__renderTarget=M,!Ie.__hasExternalTextures){const he=Math.max(1,M.width>>X),Se=Math.max(1,M.height>>X);j===t.TEXTURE_3D||j===t.TEXTURE_2D_ARRAY?n.texImage3D(j,X,le,he,Se,M.depth,0,_e,ie,null):n.texImage2D(j,X,le,he,Se,0,_e,ie,null)}n.bindFramebuffer(t.FRAMEBUFFER,b),Le(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,q,j,Z.__webglTexture,0,Pe(M)):(j===t.TEXTURE_2D||j>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,q,j,Z.__webglTexture,X),n.bindFramebuffer(t.FRAMEBUFFER,null)}function te(b,M,B){if(t.bindRenderbuffer(t.RENDERBUFFER,b),M.depthBuffer){const q=M.depthTexture,j=q&&q.isDepthTexture?q.type:null,X=x(M.stencilBuffer,j),_e=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ie=Pe(M);Le(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ie,X,M.width,M.height):B?t.renderbufferStorageMultisample(t.RENDERBUFFER,ie,X,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,X,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,_e,t.RENDERBUFFER,b)}else{const q=M.textures;for(let j=0;j<q.length;j++){const X=q[j],_e=a.convert(X.format,X.colorSpace),ie=a.convert(X.type),le=S(X.internalFormat,_e,ie,X.colorSpace),Ie=Pe(M);B&&Le(M)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ie,le,M.width,M.height):Le(M)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ie,le,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,le,M.width,M.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function xe(b,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,b),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=i.get(M.depthTexture);q.__renderTarget=M,(!q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),H(M.depthTexture,0);const j=q.__webglTexture,X=Pe(M);if(M.depthTexture.format===DepthFormat)Le(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,j,0,X):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,j,0);else if(M.depthTexture.format===DepthStencilFormat)Le(M)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,j,0,X):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Te(b){const M=i.get(b),B=b.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==b.depthTexture){const q=b.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),q){const j=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,q.removeEventListener("dispose",j)};q.addEventListener("dispose",j),M.__depthDisposeCallback=j}M.__boundDepthTexture=q}if(b.depthTexture&&!M.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");xe(M.__webglFramebuffer,b)}else if(B){M.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[q]),M.__webglDepthbuffer[q]===void 0)M.__webglDepthbuffer[q]=t.createRenderbuffer(),te(M.__webglDepthbuffer[q],b,!1);else{const j=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,X=M.__webglDepthbuffer[q];t.bindRenderbuffer(t.RENDERBUFFER,X),t.framebufferRenderbuffer(t.FRAMEBUFFER,j,t.RENDERBUFFER,X)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=t.createRenderbuffer(),te(M.__webglDepthbuffer,b,!1);else{const q=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,j=M.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,j),t.framebufferRenderbuffer(t.FRAMEBUFFER,q,t.RENDERBUFFER,j)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ce(b,M,B){const q=i.get(b);M!==void 0&&ce(q.__webglFramebuffer,b,b.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),B!==void 0&&Te(b)}function We(b){const M=b.texture,B=i.get(b),q=i.get(M);b.addEventListener("dispose",R);const j=b.textures,X=b.isWebGLCubeRenderTarget===!0,_e=j.length>1;if(_e||(q.__webglTexture===void 0&&(q.__webglTexture=t.createTexture()),q.__version=M.version,s.memory.textures++),X){B.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0){B.__webglFramebuffer[ie]=[];for(let le=0;le<M.mipmaps.length;le++)B.__webglFramebuffer[ie][le]=t.createFramebuffer()}else B.__webglFramebuffer[ie]=t.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){B.__webglFramebuffer=[];for(let ie=0;ie<M.mipmaps.length;ie++)B.__webglFramebuffer[ie]=t.createFramebuffer()}else B.__webglFramebuffer=t.createFramebuffer();if(_e)for(let ie=0,le=j.length;ie<le;ie++){const Ie=i.get(j[ie]);Ie.__webglTexture===void 0&&(Ie.__webglTexture=t.createTexture(),s.memory.textures++)}if(b.samples>0&&Le(b)===!1){B.__webglMultisampledFramebuffer=t.createFramebuffer(),B.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ie=0;ie<j.length;ie++){const le=j[ie];B.__webglColorRenderbuffer[ie]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,B.__webglColorRenderbuffer[ie]);const Ie=a.convert(le.format,le.colorSpace),Z=a.convert(le.type),he=S(le.internalFormat,Ie,Z,le.colorSpace,b.isXRRenderTarget===!0),Se=Pe(b);t.renderbufferStorageMultisample(t.RENDERBUFFER,Se,he,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ie,t.RENDERBUFFER,B.__webglColorRenderbuffer[ie])}t.bindRenderbuffer(t.RENDERBUFFER,null),b.depthBuffer&&(B.__webglDepthRenderbuffer=t.createRenderbuffer(),te(B.__webglDepthRenderbuffer,b,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(X){n.bindTexture(t.TEXTURE_CUBE_MAP,q.__webglTexture),Re(t.TEXTURE_CUBE_MAP,M);for(let ie=0;ie<6;ie++)if(M.mipmaps&&M.mipmaps.length>0)for(let le=0;le<M.mipmaps.length;le++)ce(B.__webglFramebuffer[ie][le],b,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,le);else ce(B.__webglFramebuffer[ie],b,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(M)&&p(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(_e){for(let ie=0,le=j.length;ie<le;ie++){const Ie=j[ie],Z=i.get(Ie);n.bindTexture(t.TEXTURE_2D,Z.__webglTexture),Re(t.TEXTURE_2D,Ie),ce(B.__webglFramebuffer,b,Ie,t.COLOR_ATTACHMENT0+ie,t.TEXTURE_2D,0),m(Ie)&&p(t.TEXTURE_2D)}n.unbindTexture()}else{let ie=t.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ie=b.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ie,q.__webglTexture),Re(ie,M),M.mipmaps&&M.mipmaps.length>0)for(let le=0;le<M.mipmaps.length;le++)ce(B.__webglFramebuffer[le],b,M,t.COLOR_ATTACHMENT0,ie,le);else ce(B.__webglFramebuffer,b,M,t.COLOR_ATTACHMENT0,ie,0);m(M)&&p(ie),n.unbindTexture()}b.depthBuffer&&Te(b)}function Ue(b){const M=b.textures;for(let B=0,q=M.length;B<q;B++){const j=M[B];if(m(j)){const X=T(b),_e=i.get(j).__webglTexture;n.bindTexture(X,_e),p(X),n.unbindTexture()}}}const qe=[],N=[];function Ze(b){if(b.samples>0){if(Le(b)===!1){const M=b.textures,B=b.width,q=b.height;let j=t.COLOR_BUFFER_BIT;const X=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,_e=i.get(b),ie=M.length>1;if(ie)for(let le=0;le<M.length;le++)n.bindFramebuffer(t.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+le,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,_e.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+le,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let le=0;le<M.length;le++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(j|=t.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(j|=t.STENCIL_BUFFER_BIT)),ie){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,_e.__webglColorRenderbuffer[le]);const Ie=i.get(M[le]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ie,0)}t.blitFramebuffer(0,0,B,q,0,0,B,q,j,t.NEAREST),c===!0&&(qe.length=0,N.length=0,qe.push(t.COLOR_ATTACHMENT0+le),b.depthBuffer&&b.resolveDepthBuffer===!1&&(qe.push(X),N.push(X),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,N)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,qe))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ie)for(let le=0;le<M.length;le++){n.bindFramebuffer(t.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+le,t.RENDERBUFFER,_e.__webglColorRenderbuffer[le]);const Ie=i.get(M[le]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,_e.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+le,t.TEXTURE_2D,Ie,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&c){const M=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[M])}}}function Pe(b){return Math.min(r.maxSamples,b.samples)}function Le(b){const M=i.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Me(b){const M=s.render.frame;h.get(b)!==M&&(h.set(b,M),b.update())}function $e(b,M){const B=b.colorSpace,q=b.format,j=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||B!==LinearSRGBColorSpace&&B!==NoColorSpace&&(ColorManagement.getTransfer(B)===SRGBTransfer?(q!==RGBAFormat||j!==UnsignedByteType)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),M}function ve(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(l.width=b.naturalWidth||b.width,l.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(l.width=b.displayWidth,l.height=b.displayHeight):(l.width=b.width,l.height=b.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=O,this.setTexture2D=H,this.setTexture2DArray=$,this.setTexture3D=K,this.setTextureCube=G,this.rebindTextures=Ce,this.setupRenderTarget=We,this.updateRenderTargetMipmap=Ue,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=Le}function WebGLUtils(t,e){function n(i,r=NoColorSpace){let a;const s=ColorManagement.getTransfer(r);if(i===UnsignedByteType)return t.UNSIGNED_BYTE;if(i===UnsignedShort4444Type)return t.UNSIGNED_SHORT_4_4_4_4;if(i===UnsignedShort5551Type)return t.UNSIGNED_SHORT_5_5_5_1;if(i===UnsignedInt5999Type)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===ByteType)return t.BYTE;if(i===ShortType)return t.SHORT;if(i===UnsignedShortType)return t.UNSIGNED_SHORT;if(i===IntType)return t.INT;if(i===UnsignedIntType)return t.UNSIGNED_INT;if(i===FloatType)return t.FLOAT;if(i===HalfFloatType)return t.HALF_FLOAT;if(i===AlphaFormat)return t.ALPHA;if(i===RGBFormat)return t.RGB;if(i===RGBAFormat)return t.RGBA;if(i===LuminanceFormat)return t.LUMINANCE;if(i===LuminanceAlphaFormat)return t.LUMINANCE_ALPHA;if(i===DepthFormat)return t.DEPTH_COMPONENT;if(i===DepthStencilFormat)return t.DEPTH_STENCIL;if(i===RedFormat)return t.RED;if(i===RedIntegerFormat)return t.RED_INTEGER;if(i===RGFormat)return t.RG;if(i===RGIntegerFormat)return t.RG_INTEGER;if(i===RGBAIntegerFormat)return t.RGBA_INTEGER;if(i===RGB_S3TC_DXT1_Format||i===RGBA_S3TC_DXT1_Format||i===RGBA_S3TC_DXT3_Format||i===RGBA_S3TC_DXT5_Format)if(s===SRGBTransfer)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===RGB_S3TC_DXT1_Format)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT1_Format)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT3_Format)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===RGBA_S3TC_DXT5_Format)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===RGB_S3TC_DXT1_Format)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT1_Format)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===RGBA_S3TC_DXT3_Format)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===RGBA_S3TC_DXT5_Format)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===RGB_PVRTC_4BPPV1_Format||i===RGB_PVRTC_2BPPV1_Format||i===RGBA_PVRTC_4BPPV1_Format||i===RGBA_PVRTC_2BPPV1_Format)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===RGB_PVRTC_4BPPV1_Format)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===RGB_PVRTC_2BPPV1_Format)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===RGBA_PVRTC_4BPPV1_Format)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===RGBA_PVRTC_2BPPV1_Format)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===RGB_ETC1_Format||i===RGB_ETC2_Format||i===RGBA_ETC2_EAC_Format)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===RGB_ETC1_Format||i===RGB_ETC2_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===RGBA_ETC2_EAC_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===RGBA_ASTC_4x4_Format||i===RGBA_ASTC_5x4_Format||i===RGBA_ASTC_5x5_Format||i===RGBA_ASTC_6x5_Format||i===RGBA_ASTC_6x6_Format||i===RGBA_ASTC_8x5_Format||i===RGBA_ASTC_8x6_Format||i===RGBA_ASTC_8x8_Format||i===RGBA_ASTC_10x5_Format||i===RGBA_ASTC_10x6_Format||i===RGBA_ASTC_10x8_Format||i===RGBA_ASTC_10x10_Format||i===RGBA_ASTC_12x10_Format||i===RGBA_ASTC_12x12_Format)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===RGBA_ASTC_4x4_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===RGBA_ASTC_5x4_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===RGBA_ASTC_5x5_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===RGBA_ASTC_6x5_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===RGBA_ASTC_6x6_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===RGBA_ASTC_8x5_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===RGBA_ASTC_8x6_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===RGBA_ASTC_8x8_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===RGBA_ASTC_10x5_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===RGBA_ASTC_10x6_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===RGBA_ASTC_10x8_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===RGBA_ASTC_10x10_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===RGBA_ASTC_12x10_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===RGBA_ASTC_12x12_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===RGBA_BPTC_Format||i===RGB_BPTC_SIGNED_Format||i===RGB_BPTC_UNSIGNED_Format)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===RGBA_BPTC_Format)return s===SRGBTransfer?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===RGB_BPTC_SIGNED_Format)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===RGB_BPTC_UNSIGNED_Format)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===RED_RGTC1_Format||i===SIGNED_RED_RGTC1_Format||i===RED_GREEN_RGTC2_Format||i===SIGNED_RED_GREEN_RGTC2_Format)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===RGBA_BPTC_Format)return a.COMPRESSED_RED_RGTC1_EXT;if(i===SIGNED_RED_RGTC1_Format)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===RED_GREEN_RGTC2_Format)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===SIGNED_RED_GREEN_RGTC2_Format)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===UnsignedInt248Type?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class ArrayCamera extends PerspectiveCamera{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Group extends Object3D{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _moveEvent={type:"move"};class WebXRController{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Group,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Group,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Vector3,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Vector3),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Group,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Vector3,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Vector3),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,a=null,s=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(l&&e.hand){s=!0;for(const g of e.hand.values()){const m=n.getJointPose(g,i),p=this._getHandJoint(l,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),u=.02,_=.005;l.inputState.pinching&&f>u+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=u-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=n.getPose(e.gripSpace,i),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&a!==null&&(r=a),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(_moveEvent)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=s!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Group;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const _occlusion_vertex=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_occlusion_fragment=`
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

}`;class WebXRDepthSensing{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new Texture,a=e.properties.get(r);a.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new ShaderMaterial({vertexShader:_occlusion_vertex,fragmentShader:_occlusion_fragment,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Mesh(new PlaneGeometry(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class WebXRManager extends EventDispatcher{constructor(e,n){super();const i=this;let r=null,a=1,s=null,o="local-floor",c=1,l=null,h=null,d=null,f=null,u=null,_=null;const g=new WebXRDepthSensing,m=n.getContextAttributes();let p=null,T=null;const S=[],x=[],C=new Vector2;let A=null;const R=new PerspectiveCamera;R.viewport=new Vector4;const P=new PerspectiveCamera;P.viewport=new Vector4;const E=[R,P],v=new ArrayCamera;let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let J=S[W];return J===void 0&&(J=new WebXRController,S[W]=J),J.getTargetRaySpace()},this.getControllerGrip=function(W){let J=S[W];return J===void 0&&(J=new WebXRController,S[W]=J),J.getGripSpace()},this.getHand=function(W){let J=S[W];return J===void 0&&(J=new WebXRController,S[W]=J),J.getHandSpace()};function I(W){const J=x.indexOf(W.inputSource);if(J===-1)return;const ce=S[J];ce!==void 0&&(ce.update(W.inputSource,W.frame,l||s),ce.dispatchEvent({type:W.type,data:W.inputSource}))}function F(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",F),r.removeEventListener("inputsourceschange",H);for(let W=0;W<S.length;W++){const J=x[W];J!==null&&(x[W]=null,S[W].disconnect(J))}w=null,O=null,g.reset(),e.setRenderTarget(p),u=null,f=null,d=null,r=null,T=null,Fe.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){a=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||s},this.setReferenceSpace=function(W){l=W},this.getBaseLayer=function(){return f!==null?f:u},this.getBinding=function(){return d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",F),r.addEventListener("inputsourceschange",H),m.xrCompatible!==!0&&await n.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(C),r.renderState.layers===void 0){const J={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:a};u=new XRWebGLLayer(r,n,J),r.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),T=new WebGLRenderTarget(u.framebufferWidth,u.framebufferHeight,{format:RGBAFormat,type:UnsignedByteType,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let J=null,ce=null,te=null;m.depth&&(te=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,J=m.stencil?DepthStencilFormat:DepthFormat,ce=m.stencil?UnsignedInt248Type:UnsignedIntType);const xe={colorFormat:n.RGBA8,depthFormat:te,scaleFactor:a};d=new XRWebGLBinding(r,n),f=d.createProjectionLayer(xe),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),T=new WebGLRenderTarget(f.textureWidth,f.textureHeight,{format:RGBAFormat,type:UnsignedByteType,depthTexture:new DepthTexture(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(c),l=null,s=await r.requestReferenceSpace(o),Fe.setContext(r),Fe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function H(W){for(let J=0;J<W.removed.length;J++){const ce=W.removed[J],te=x.indexOf(ce);te>=0&&(x[te]=null,S[te].disconnect(ce))}for(let J=0;J<W.added.length;J++){const ce=W.added[J];let te=x.indexOf(ce);if(te===-1){for(let Te=0;Te<S.length;Te++)if(Te>=x.length){x.push(ce),te=Te;break}else if(x[Te]===null){x[Te]=ce,te=Te;break}if(te===-1)break}const xe=S[te];xe&&xe.connect(ce)}}const $=new Vector3,K=new Vector3;function G(W,J,ce){$.setFromMatrixPosition(J.matrixWorld),K.setFromMatrixPosition(ce.matrixWorld);const te=$.distanceTo(K),xe=J.projectionMatrix.elements,Te=ce.projectionMatrix.elements,Ce=xe[14]/(xe[10]-1),We=xe[14]/(xe[10]+1),Ue=(xe[9]+1)/xe[5],qe=(xe[9]-1)/xe[5],N=(xe[8]-1)/xe[0],Ze=(Te[8]+1)/Te[0],Pe=Ce*N,Le=Ce*Ze,Me=te/(-N+Ze),$e=Me*-N;if(J.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX($e),W.translateZ(Me),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),xe[10]===-1)W.projectionMatrix.copy(J.projectionMatrix),W.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const ve=Ce+Me,b=We+Me,M=Pe-$e,B=Le+(te-$e),q=Ue*We/b*ve,j=qe*We/b*ve;W.projectionMatrix.makePerspective(M,B,q,j,ve,b),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ee(W,J){J===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(J.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let J=W.near,ce=W.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(ce=g.depthFar)),v.near=P.near=R.near=J,v.far=P.far=R.far=ce,(w!==v.near||O!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),w=v.near,O=v.far),R.layers.mask=W.layers.mask|2,P.layers.mask=W.layers.mask|4,v.layers.mask=R.layers.mask|P.layers.mask;const te=W.parent,xe=v.cameras;ee(v,te);for(let Te=0;Te<xe.length;Te++)ee(xe[Te],te);xe.length===2?G(v,R,P):v.projectionMatrix.copy(R.projectionMatrix),oe(W,v,te)};function oe(W,J,ce){ce===null?W.matrix.copy(J.matrixWorld):(W.matrix.copy(ce.matrixWorld),W.matrix.invert(),W.matrix.multiply(J.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(J.projectionMatrix),W.projectionMatrixInverse.copy(J.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=RAD2DEG*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(f===null&&u===null))return c},this.setFoveation=function(W){c=W,f!==null&&(f.fixedFoveation=W),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=W)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(v)};let me=null;function Re(W,J){if(h=J.getViewerPose(l||s),_=J,h!==null){const ce=h.views;u!==null&&(e.setRenderTargetFramebuffer(T,u.framebuffer),e.setRenderTarget(T));let te=!1;ce.length!==v.cameras.length&&(v.cameras.length=0,te=!0);for(let Te=0;Te<ce.length;Te++){const Ce=ce[Te];let We=null;if(u!==null)We=u.getViewport(Ce);else{const qe=d.getViewSubImage(f,Ce);We=qe.viewport,Te===0&&(e.setRenderTargetTextures(T,qe.colorTexture,f.ignoreDepthValues?void 0:qe.depthStencilTexture),e.setRenderTarget(T))}let Ue=E[Te];Ue===void 0&&(Ue=new PerspectiveCamera,Ue.layers.enable(Te),Ue.viewport=new Vector4,E[Te]=Ue),Ue.matrix.fromArray(Ce.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(Ce.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(We.x,We.y,We.width,We.height),Te===0&&(v.matrix.copy(Ue.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),te===!0&&v.cameras.push(Ue)}const xe=r.enabledFeatures;if(xe&&xe.includes("depth-sensing")){const Te=d.getDepthInformation(ce[0]);Te&&Te.isValid&&Te.texture&&g.init(e,Te,r.renderState)}}for(let ce=0;ce<S.length;ce++){const te=x[ce],xe=S[ce];te!==null&&xe!==void 0&&xe.update(te,J,l||s)}me&&me(W,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),_=null}const Fe=new WebGLAnimation;Fe.setAnimationLoop(Re),this.setAnimationLoop=function(W){me=W},this.dispose=function(){}}}const _e1=new Euler,_m1=new Matrix4;function WebGLMaterials(t,e){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,getUnlitUniformColorSpace(t)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,T,S,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(m,p):p.isMeshToonMaterial?(a(m,p),d(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p)):p.isMeshStandardMaterial?(a(m,p),f(m,p),p.isMeshPhysicalMaterial&&u(m,p,x)):p.isMeshMatcapMaterial?(a(m,p),_(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),g(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(s(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,T,S):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===BackSide&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===BackSide&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const T=e.get(p),S=T.envMap,x=T.envMapRotation;S&&(m.envMap.value=S,_e1.copy(x),_e1.x*=-1,_e1.y*=-1,_e1.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(_e1.y*=-1,_e1.z*=-1),m.envMapRotation.value.setFromMatrix4(_m1.makeRotationFromEuler(_e1)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function s(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,T,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=S*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===BackSide&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const T=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function WebGLUniformsGroups(t,e,n,i){let r={},a={},s=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,S){const x=S.program;i.uniformBlockBinding(T,x)}function l(T,S){let x=r[T.id];x===void 0&&(_(T),x=h(T),r[T.id]=x,T.addEventListener("dispose",m));const C=S.program;i.updateUBOMapping(T,C);const A=e.render.frame;a[T.id]!==A&&(f(T),a[T.id]=A)}function h(T){const S=d();T.__bindingPointIndex=S;const x=t.createBuffer(),C=T.__size,A=T.usage;return t.bindBuffer(t.UNIFORM_BUFFER,x),t.bufferData(t.UNIFORM_BUFFER,C,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,x),x}function d(){for(let T=0;T<o;T++)if(s.indexOf(T)===-1)return s.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(T){const S=r[T.id],x=T.uniforms,C=T.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let A=0,R=x.length;A<R;A++){const P=Array.isArray(x[A])?x[A]:[x[A]];for(let E=0,v=P.length;E<v;E++){const w=P[E];if(u(w,A,E,C)===!0){const O=w.__offset,I=Array.isArray(w.value)?w.value:[w.value];let F=0;for(let H=0;H<I.length;H++){const $=I[H],K=g($);typeof $=="number"||typeof $=="boolean"?(w.__data[0]=$,t.bufferSubData(t.UNIFORM_BUFFER,O+F,w.__data)):$.isMatrix3?(w.__data[0]=$.elements[0],w.__data[1]=$.elements[1],w.__data[2]=$.elements[2],w.__data[3]=0,w.__data[4]=$.elements[3],w.__data[5]=$.elements[4],w.__data[6]=$.elements[5],w.__data[7]=0,w.__data[8]=$.elements[6],w.__data[9]=$.elements[7],w.__data[10]=$.elements[8],w.__data[11]=0):($.toArray(w.__data,F),F+=K.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,O,w.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function u(T,S,x,C){const A=T.value,R=S+"_"+x;if(C[R]===void 0)return typeof A=="number"||typeof A=="boolean"?C[R]=A:C[R]=A.clone(),!0;{const P=C[R];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return C[R]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function _(T){const S=T.uniforms;let x=0;const C=16;for(let R=0,P=S.length;R<P;R++){const E=Array.isArray(S[R])?S[R]:[S[R]];for(let v=0,w=E.length;v<w;v++){const O=E[v],I=Array.isArray(O.value)?O.value:[O.value];for(let F=0,H=I.length;F<H;F++){const $=I[F],K=g($),G=x%C,ee=G%K.boundary,oe=G+ee;x+=ee,oe!==0&&C-oe<K.storage&&(x+=C-oe),O.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=x,x+=K.storage}}}const A=x%C;return A>0&&(x+=C-A),T.__size=x,T.__cache={},this}function g(T){const S={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(S.boundary=4,S.storage=4):T.isVector2?(S.boundary=8,S.storage=8):T.isVector3||T.isColor?(S.boundary=16,S.storage=12):T.isVector4?(S.boundary=16,S.storage=16):T.isMatrix3?(S.boundary=48,S.storage=48):T.isMatrix4?(S.boundary=64,S.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),S}function m(T){const S=T.target;S.removeEventListener("dispose",m);const x=s.indexOf(S.__bindingPointIndex);s.splice(x,1),t.deleteBuffer(r[S.id]),delete r[S.id],delete a[S.id]}function p(){for(const T in r)t.deleteBuffer(r[T]);s=[],r={},a={}}return{bind:c,update:l,dispose:p}}class WebGLRenderer{constructor(e={}){const{canvas:n=createCanvasElement(),context:i=null,depth:r=!0,stencil:a=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=s;const _=new Uint32Array(4),g=new Int32Array(4);let m=null,p=null;const T=[],S=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=SRGBColorSpace,this.toneMapping=NoToneMapping,this.toneMappingExposure=1;const x=this;let C=!1,A=0,R=0,P=null,E=-1,v=null;const w=new Vector4,O=new Vector4;let I=null;const F=new Color(0);let H=0,$=n.width,K=n.height,G=1,ee=null,oe=null;const me=new Vector4(0,0,$,K),Re=new Vector4(0,0,$,K);let Fe=!1;const W=new Frustum;let J=!1,ce=!1;const te=new Matrix4,xe=new Matrix4,Te=new Vector3,Ce=new Vector4,We={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ue=!1;function qe(){return P===null?G:1}let N=i;function Ze(y,D){return n.getContext(y,D)}try{const y={alpha:!0,depth:r,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${REVISION}`),n.addEventListener("webglcontextlost",Y,!1),n.addEventListener("webglcontextrestored",se,!1),n.addEventListener("webglcontextcreationerror",re,!1),N===null){const D="webgl2";if(N=Ze(D,y),N===null)throw Ze(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Pe,Le,Me,$e,ve,b,M,B,q,j,X,_e,ie,le,Ie,Z,he,Se,ye,de,De,we,Ve,L;function ne(){Pe=new WebGLExtensions(N),Pe.init(),we=new WebGLUtils(N,Pe),Le=new WebGLCapabilities(N,Pe,e,we),Me=new WebGLState(N,Pe),Le.reverseDepthBuffer&&f&&Me.buffers.depth.setReversed(!0),$e=new WebGLInfo(N),ve=new WebGLProperties,b=new WebGLTextures(N,Pe,Me,ve,Le,we,$e),M=new WebGLCubeMaps(x),B=new WebGLCubeUVMaps(x),q=new WebGLAttributes(N),Ve=new WebGLBindingStates(N,q),j=new WebGLGeometries(N,q,$e,Ve),X=new WebGLObjects(N,j,q,$e),ye=new WebGLMorphtargets(N,Le,b),Z=new WebGLClipping(ve),_e=new WebGLPrograms(x,M,B,Pe,Le,Ve,Z),ie=new WebGLMaterials(x,ve),le=new WebGLRenderLists,Ie=new WebGLRenderStates(Pe),Se=new WebGLBackground(x,M,B,Me,X,u,c),he=new WebGLShadowMap(x,X,Le),L=new WebGLUniformsGroups(N,$e,Le,Me),de=new WebGLBufferRenderer(N,Pe,$e),De=new WebGLIndexedBufferRenderer(N,Pe,$e),$e.programs=_e.programs,x.capabilities=Le,x.extensions=Pe,x.properties=ve,x.renderLists=le,x.shadowMap=he,x.state=Me,x.info=$e}ne();const k=new WebXRManager(x,N);this.xr=k,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const y=Pe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Pe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(y){y!==void 0&&(G=y,this.setSize($,K,!1))},this.getSize=function(y){return y.set($,K)},this.setSize=function(y,D,z=!0){if(k.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=y,K=D,n.width=Math.floor(y*G),n.height=Math.floor(D*G),z===!0&&(n.style.width=y+"px",n.style.height=D+"px"),this.setViewport(0,0,y,D)},this.getDrawingBufferSize=function(y){return y.set($*G,K*G).floor()},this.setDrawingBufferSize=function(y,D,z){$=y,K=D,G=z,n.width=Math.floor(y*z),n.height=Math.floor(D*z),this.setViewport(0,0,y,D)},this.getCurrentViewport=function(y){return y.copy(w)},this.getViewport=function(y){return y.copy(me)},this.setViewport=function(y,D,z,V){y.isVector4?me.set(y.x,y.y,y.z,y.w):me.set(y,D,z,V),Me.viewport(w.copy(me).multiplyScalar(G).round())},this.getScissor=function(y){return y.copy(Re)},this.setScissor=function(y,D,z,V){y.isVector4?Re.set(y.x,y.y,y.z,y.w):Re.set(y,D,z,V),Me.scissor(O.copy(Re).multiplyScalar(G).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(y){Me.setScissorTest(Fe=y)},this.setOpaqueSort=function(y){ee=y},this.setTransparentSort=function(y){oe=y},this.getClearColor=function(y){return y.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor.apply(Se,arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha.apply(Se,arguments)},this.clear=function(y=!0,D=!0,z=!0){let V=0;if(y){let U=!1;if(P!==null){const Q=P.texture.format;U=Q===RGBAIntegerFormat||Q===RGIntegerFormat||Q===RedIntegerFormat}if(U){const Q=P.texture.type,ae=Q===UnsignedByteType||Q===UnsignedIntType||Q===UnsignedShortType||Q===UnsignedInt248Type||Q===UnsignedShort4444Type||Q===UnsignedShort5551Type,fe=Se.getClearColor(),ue=Se.getClearAlpha(),Ee=fe.r,be=fe.g,pe=fe.b;ae?(_[0]=Ee,_[1]=be,_[2]=pe,_[3]=ue,N.clearBufferuiv(N.COLOR,0,_)):(g[0]=Ee,g[1]=be,g[2]=pe,g[3]=ue,N.clearBufferiv(N.COLOR,0,g))}else V|=N.COLOR_BUFFER_BIT}D&&(V|=N.DEPTH_BUFFER_BIT),z&&(V|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Y,!1),n.removeEventListener("webglcontextrestored",se,!1),n.removeEventListener("webglcontextcreationerror",re,!1),le.dispose(),Ie.dispose(),ve.dispose(),M.dispose(),B.dispose(),X.dispose(),Ve.dispose(),L.dispose(),_e.dispose(),k.dispose(),k.removeEventListener("sessionstart",ut),k.removeEventListener("sessionend",pt),st.stop()};function Y(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function se(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const y=$e.autoReset,D=he.enabled,z=he.autoUpdate,V=he.needsUpdate,U=he.type;ne(),$e.autoReset=y,he.enabled=D,he.autoUpdate=z,he.needsUpdate=V,he.type=U}function re(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ae(y){const D=y.target;D.removeEventListener("dispose",Ae),Xe(D)}function Xe(y){Ye(y),ve.remove(y)}function Ye(y){const D=ve.get(y).programs;D!==void 0&&(D.forEach(function(z){_e.releaseProgram(z)}),y.isShaderMaterial&&_e.releaseShaderCache(y))}this.renderBufferDirect=function(y,D,z,V,U,Q){D===null&&(D=We);const ae=U.isMesh&&U.matrixWorld.determinant()<0,fe=St(y,D,z,V,U);Me.setMaterial(V,ae);let ue=z.index,Ee=1;if(V.wireframe===!0){if(ue=j.getWireframeAttribute(z),ue===void 0)return;Ee=2}const be=z.drawRange,pe=z.attributes.position;let Ne=be.start*Ee,Ge=(be.start+be.count)*Ee;Q!==null&&(Ne=Math.max(Ne,Q.start*Ee),Ge=Math.min(Ge,(Q.start+Q.count)*Ee)),ue!==null?(Ne=Math.max(Ne,0),Ge=Math.min(Ge,ue.count)):pe!=null&&(Ne=Math.max(Ne,0),Ge=Math.min(Ge,pe.count));const ke=Ge-Ne;if(ke<0||ke===1/0)return;Ve.setup(U,V,fe,z,ue);let je,Oe=de;if(ue!==null&&(je=q.get(ue),Oe=De,Oe.setIndex(je)),U.isMesh)V.wireframe===!0?(Me.setLineWidth(V.wireframeLinewidth*qe()),Oe.setMode(N.LINES)):Oe.setMode(N.TRIANGLES);else if(U.isLine){let ge=V.linewidth;ge===void 0&&(ge=1),Me.setLineWidth(ge*qe()),U.isLineSegments?Oe.setMode(N.LINES):U.isLineLoop?Oe.setMode(N.LINE_LOOP):Oe.setMode(N.LINE_STRIP)}else U.isPoints?Oe.setMode(N.POINTS):U.isSprite&&Oe.setMode(N.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Oe.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Pe.get("WEBGL_multi_draw"))Oe.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const ge=U._multiDrawStarts,it=U._multiDrawCounts,Be=U._multiDrawCount,et=ue?q.get(ue).bytesPerElement:1,ot=ve.get(V).currentProgram.getUniforms();for(let Ke=0;Ke<Be;Ke++)ot.setValue(N,"_gl_DrawID",Ke),Oe.render(ge[Ke]/et,it[Ke])}else if(U.isInstancedMesh)Oe.renderInstances(Ne,ke,U.count);else if(z.isInstancedBufferGeometry){const ge=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,it=Math.min(z.instanceCount,ge);Oe.renderInstances(Ne,ke,it)}else Oe.render(Ne,ke)};function ze(y,D,z){y.transparent===!0&&y.side===DoubleSide&&y.forceSinglePass===!1?(y.side=BackSide,y.needsUpdate=!0,dt(y,D,z),y.side=FrontSide,y.needsUpdate=!0,dt(y,D,z),y.side=DoubleSide):dt(y,D,z)}this.compile=function(y,D,z=null){z===null&&(z=y),p=Ie.get(z),p.init(D),S.push(p),z.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),y!==z&&y.traverseVisible(function(U){U.isLight&&U.layers.test(D.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const V=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const Q=U.material;if(Q)if(Array.isArray(Q))for(let ae=0;ae<Q.length;ae++){const fe=Q[ae];ze(fe,z,U),V.add(fe)}else ze(Q,z,U),V.add(Q)}),S.pop(),p=null,V},this.compileAsync=function(y,D,z=null){const V=this.compile(y,D,z);return new Promise(U=>{function Q(){if(V.forEach(function(ae){ve.get(ae).currentProgram.isReady()&&V.delete(ae)}),V.size===0){U(y);return}setTimeout(Q,10)}Pe.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Qe=null;function nt(y){Qe&&Qe(y)}function ut(){st.stop()}function pt(){st.start()}const st=new WebGLAnimation;st.setAnimationLoop(nt),typeof self<"u"&&st.setContext(self),this.setAnimationLoop=function(y){Qe=y,k.setAnimationLoop(y),y===null?st.stop():st.start()},k.addEventListener("sessionstart",ut),k.addEventListener("sessionend",pt),this.render=function(y,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),k.enabled===!0&&k.isPresenting===!0&&(k.cameraAutoUpdate===!0&&k.updateCamera(D),D=k.getCamera()),y.isScene===!0&&y.onBeforeRender(x,y,D,P),p=Ie.get(y,S.length),p.init(D),S.push(p),xe.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),W.setFromProjectionMatrix(xe),ce=this.localClippingEnabled,J=Z.init(this.clippingPlanes,ce),m=le.get(y,T.length),m.init(),T.push(m),k.enabled===!0&&k.isPresenting===!0){const Q=x.xr.getDepthSensingMesh();Q!==null&&ft(Q,D,-1/0,x.sortObjects)}ft(y,D,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(ee,oe),Ue=k.enabled===!1||k.isPresenting===!1||k.hasDepthSensing()===!1,Ue&&Se.addToRenderList(m,y),this.info.render.frame++,J===!0&&Z.beginShadows();const z=p.state.shadowsArray;he.render(z,y,D),J===!0&&Z.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,U=m.transmissive;if(p.setupLights(),D.isArrayCamera){const Q=D.cameras;if(U.length>0)for(let ae=0,fe=Q.length;ae<fe;ae++){const ue=Q[ae];_t(V,U,y,ue)}Ue&&Se.render(y);for(let ae=0,fe=Q.length;ae<fe;ae++){const ue=Q[ae];mt(m,y,ue,ue.viewport)}}else U.length>0&&_t(V,U,y,D),Ue&&Se.render(y),mt(m,y,D);P!==null&&(b.updateMultisampleRenderTarget(P),b.updateRenderTargetMipmap(P)),y.isScene===!0&&y.onAfterRender(x,y,D),Ve.resetDefaultState(),E=-1,v=null,S.pop(),S.length>0?(p=S[S.length-1],J===!0&&Z.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function ft(y,D,z,V){if(y.visible===!1)return;if(y.layers.test(D.layers)){if(y.isGroup)z=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(D);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||W.intersectsSprite(y)){V&&Ce.setFromMatrixPosition(y.matrixWorld).applyMatrix4(xe);const ae=X.update(y),fe=y.material;fe.visible&&m.push(y,ae,fe,z,Ce.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||W.intersectsObject(y))){const ae=X.update(y),fe=y.material;if(V&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ce.copy(y.boundingSphere.center)):(ae.boundingSphere===null&&ae.computeBoundingSphere(),Ce.copy(ae.boundingSphere.center)),Ce.applyMatrix4(y.matrixWorld).applyMatrix4(xe)),Array.isArray(fe)){const ue=ae.groups;for(let Ee=0,be=ue.length;Ee<be;Ee++){const pe=ue[Ee],Ne=fe[pe.materialIndex];Ne&&Ne.visible&&m.push(y,ae,Ne,z,Ce.z,pe)}}else fe.visible&&m.push(y,ae,fe,z,Ce.z,null)}}const Q=y.children;for(let ae=0,fe=Q.length;ae<fe;ae++)ft(Q[ae],D,z,V)}function mt(y,D,z,V){const U=y.opaque,Q=y.transmissive,ae=y.transparent;p.setupLightsView(z),J===!0&&Z.setGlobalState(x.clippingPlanes,z),V&&Me.viewport(w.copy(V)),U.length>0&&ht(U,D,z),Q.length>0&&ht(Q,D,z),ae.length>0&&ht(ae,D,z),Me.buffers.depth.setTest(!0),Me.buffers.depth.setMask(!0),Me.buffers.color.setMask(!0),Me.setPolygonOffset(!1)}function _t(y,D,z,V){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[V.id]===void 0&&(p.state.transmissionRenderTarget[V.id]=new WebGLRenderTarget(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?HalfFloatType:UnsignedByteType,minFilter:LinearMipmapLinearFilter,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ColorManagement.workingColorSpace}));const Q=p.state.transmissionRenderTarget[V.id],ae=V.viewport||w;Q.setSize(ae.z,ae.w);const fe=x.getRenderTarget();x.setRenderTarget(Q),x.getClearColor(F),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),Ue&&Se.render(z);const ue=x.toneMapping;x.toneMapping=NoToneMapping;const Ee=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),p.setupLightsView(V),J===!0&&Z.setGlobalState(x.clippingPlanes,V),ht(y,z,V),b.updateMultisampleRenderTarget(Q),b.updateRenderTargetMipmap(Q),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let pe=0,Ne=D.length;pe<Ne;pe++){const Ge=D[pe],ke=Ge.object,je=Ge.geometry,Oe=Ge.material,ge=Ge.group;if(Oe.side===DoubleSide&&ke.layers.test(V.layers)){const it=Oe.side;Oe.side=BackSide,Oe.needsUpdate=!0,gt(ke,z,V,je,Oe,ge),Oe.side=it,Oe.needsUpdate=!0,be=!0}}be===!0&&(b.updateMultisampleRenderTarget(Q),b.updateRenderTargetMipmap(Q))}x.setRenderTarget(fe),x.setClearColor(F,H),Ee!==void 0&&(V.viewport=Ee),x.toneMapping=ue}function ht(y,D,z){const V=D.isScene===!0?D.overrideMaterial:null;for(let U=0,Q=y.length;U<Q;U++){const ae=y[U],fe=ae.object,ue=ae.geometry,Ee=V===null?ae.material:V,be=ae.group;fe.layers.test(z.layers)&&gt(fe,D,z,ue,Ee,be)}}function gt(y,D,z,V,U,Q){y.onBeforeRender(x,D,z,V,U,Q),y.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(x,D,z,V,y,Q),U.transparent===!0&&U.side===DoubleSide&&U.forceSinglePass===!1?(U.side=BackSide,U.needsUpdate=!0,x.renderBufferDirect(z,D,V,U,y,Q),U.side=FrontSide,U.needsUpdate=!0,x.renderBufferDirect(z,D,V,U,y,Q),U.side=DoubleSide):x.renderBufferDirect(z,D,V,U,y,Q),y.onAfterRender(x,D,z,V,U,Q)}function dt(y,D,z){D.isScene!==!0&&(D=We);const V=ve.get(y),U=p.state.lights,Q=p.state.shadowsArray,ae=U.state.version,fe=_e.getParameters(y,U.state,Q,D,z),ue=_e.getProgramCacheKey(fe);let Ee=V.programs;V.environment=y.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(y.isMeshStandardMaterial?B:M).get(y.envMap||V.environment),V.envMapRotation=V.environment!==null&&y.envMap===null?D.environmentRotation:y.envMapRotation,Ee===void 0&&(y.addEventListener("dispose",Ae),Ee=new Map,V.programs=Ee);let be=Ee.get(ue);if(be!==void 0){if(V.currentProgram===be&&V.lightsStateVersion===ae)return xt(y,fe),be}else fe.uniforms=_e.getUniforms(y),y.onBeforeCompile(fe,x),be=_e.acquireProgram(fe,ue),Ee.set(ue,be),V.uniforms=fe.uniforms;const pe=V.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(pe.clippingPlanes=Z.uniform),xt(y,fe),V.needsLights=Et(y),V.lightsStateVersion=ae,V.needsLights&&(pe.ambientLightColor.value=U.state.ambient,pe.lightProbe.value=U.state.probe,pe.directionalLights.value=U.state.directional,pe.directionalLightShadows.value=U.state.directionalShadow,pe.spotLights.value=U.state.spot,pe.spotLightShadows.value=U.state.spotShadow,pe.rectAreaLights.value=U.state.rectArea,pe.ltc_1.value=U.state.rectAreaLTC1,pe.ltc_2.value=U.state.rectAreaLTC2,pe.pointLights.value=U.state.point,pe.pointLightShadows.value=U.state.pointShadow,pe.hemisphereLights.value=U.state.hemi,pe.directionalShadowMap.value=U.state.directionalShadowMap,pe.directionalShadowMatrix.value=U.state.directionalShadowMatrix,pe.spotShadowMap.value=U.state.spotShadowMap,pe.spotLightMatrix.value=U.state.spotLightMatrix,pe.spotLightMap.value=U.state.spotLightMap,pe.pointShadowMap.value=U.state.pointShadowMap,pe.pointShadowMatrix.value=U.state.pointShadowMatrix),V.currentProgram=be,V.uniformsList=null,be}function vt(y){if(y.uniformsList===null){const D=y.currentProgram.getUniforms();y.uniformsList=WebGLUniforms.seqWithValue(D.seq,y.uniforms)}return y.uniformsList}function xt(y,D){const z=ve.get(y);z.outputColorSpace=D.outputColorSpace,z.batching=D.batching,z.batchingColor=D.batchingColor,z.instancing=D.instancing,z.instancingColor=D.instancingColor,z.instancingMorph=D.instancingMorph,z.skinning=D.skinning,z.morphTargets=D.morphTargets,z.morphNormals=D.morphNormals,z.morphColors=D.morphColors,z.morphTargetsCount=D.morphTargetsCount,z.numClippingPlanes=D.numClippingPlanes,z.numIntersection=D.numClipIntersection,z.vertexAlphas=D.vertexAlphas,z.vertexTangents=D.vertexTangents,z.toneMapping=D.toneMapping}function St(y,D,z,V,U){D.isScene!==!0&&(D=We),b.resetTextureUnits();const Q=D.fog,ae=V.isMeshStandardMaterial?D.environment:null,fe=P===null?x.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:LinearSRGBColorSpace,ue=(V.isMeshStandardMaterial?B:M).get(V.envMap||ae),Ee=V.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,be=!!z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),pe=!!z.morphAttributes.position,Ne=!!z.morphAttributes.normal,Ge=!!z.morphAttributes.color;let ke=NoToneMapping;V.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(ke=x.toneMapping);const je=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Oe=je!==void 0?je.length:0,ge=ve.get(V),it=p.state.lights;if(J===!0&&(ce===!0||y!==v)){const Je=y===v&&V.id===E;Z.setState(V,y,Je)}let Be=!1;V.version===ge.__version?(ge.needsLights&&ge.lightsStateVersion!==it.state.version||ge.outputColorSpace!==fe||U.isBatchedMesh&&ge.batching===!1||!U.isBatchedMesh&&ge.batching===!0||U.isBatchedMesh&&ge.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&ge.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&ge.instancing===!1||!U.isInstancedMesh&&ge.instancing===!0||U.isSkinnedMesh&&ge.skinning===!1||!U.isSkinnedMesh&&ge.skinning===!0||U.isInstancedMesh&&ge.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&ge.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&ge.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&ge.instancingMorph===!1&&U.morphTexture!==null||ge.envMap!==ue||V.fog===!0&&ge.fog!==Q||ge.numClippingPlanes!==void 0&&(ge.numClippingPlanes!==Z.numPlanes||ge.numIntersection!==Z.numIntersection)||ge.vertexAlphas!==Ee||ge.vertexTangents!==be||ge.morphTargets!==pe||ge.morphNormals!==Ne||ge.morphColors!==Ge||ge.toneMapping!==ke||ge.morphTargetsCount!==Oe)&&(Be=!0):(Be=!0,ge.__version=V.version);let et=ge.currentProgram;Be===!0&&(et=dt(V,D,U));let ot=!1,Ke=!1,ct=!1;const He=et.getUniforms(),tt=ge.uniforms;if(Me.useProgram(et.program)&&(ot=!0,Ke=!0,ct=!0),V.id!==E&&(E=V.id,Ke=!0),ot||v!==y){Me.buffers.depth.getReversed()?(te.copy(y.projectionMatrix),toNormalizedProjectionMatrix(te),toReversedProjectionMatrix(te),He.setValue(N,"projectionMatrix",te)):He.setValue(N,"projectionMatrix",y.projectionMatrix),He.setValue(N,"viewMatrix",y.matrixWorldInverse);const rt=He.map.cameraPosition;rt!==void 0&&rt.setValue(N,Te.setFromMatrixPosition(y.matrixWorld)),Le.logarithmicDepthBuffer&&He.setValue(N,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&He.setValue(N,"isOrthographic",y.isOrthographicCamera===!0),v!==y&&(v=y,Ke=!0,ct=!0)}if(U.isSkinnedMesh){He.setOptional(N,U,"bindMatrix"),He.setOptional(N,U,"bindMatrixInverse");const Je=U.skeleton;Je&&(Je.boneTexture===null&&Je.computeBoneTexture(),He.setValue(N,"boneTexture",Je.boneTexture,b))}U.isBatchedMesh&&(He.setOptional(N,U,"batchingTexture"),He.setValue(N,"batchingTexture",U._matricesTexture,b),He.setOptional(N,U,"batchingIdTexture"),He.setValue(N,"batchingIdTexture",U._indirectTexture,b),He.setOptional(N,U,"batchingColorTexture"),U._colorsTexture!==null&&He.setValue(N,"batchingColorTexture",U._colorsTexture,b));const lt=z.morphAttributes;if((lt.position!==void 0||lt.normal!==void 0||lt.color!==void 0)&&ye.update(U,z,et),(Ke||ge.receiveShadow!==U.receiveShadow)&&(ge.receiveShadow=U.receiveShadow,He.setValue(N,"receiveShadow",U.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(tt.envMap.value=ue,tt.flipEnvMap.value=ue.isCubeTexture&&ue.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(tt.envMapIntensity.value=D.environmentIntensity),Ke&&(He.setValue(N,"toneMappingExposure",x.toneMappingExposure),ge.needsLights&&yt(tt,ct),Q&&V.fog===!0&&ie.refreshFogUniforms(tt,Q),ie.refreshMaterialUniforms(tt,V,G,K,p.state.transmissionRenderTarget[y.id]),WebGLUniforms.upload(N,vt(ge),tt,b)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(WebGLUniforms.upload(N,vt(ge),tt,b),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&He.setValue(N,"center",U.center),He.setValue(N,"modelViewMatrix",U.modelViewMatrix),He.setValue(N,"normalMatrix",U.normalMatrix),He.setValue(N,"modelMatrix",U.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Je=V.uniformsGroups;for(let rt=0,at=Je.length;rt<at;rt++){const Mt=Je[rt];L.update(Mt,et),L.bind(Mt,et)}}return et}function yt(y,D){y.ambientLightColor.needsUpdate=D,y.lightProbe.needsUpdate=D,y.directionalLights.needsUpdate=D,y.directionalLightShadows.needsUpdate=D,y.pointLights.needsUpdate=D,y.pointLightShadows.needsUpdate=D,y.spotLights.needsUpdate=D,y.spotLightShadows.needsUpdate=D,y.rectAreaLights.needsUpdate=D,y.hemisphereLights.needsUpdate=D}function Et(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(y,D,z){ve.get(y.texture).__webglTexture=D,ve.get(y.depthTexture).__webglTexture=z;const V=ve.get(y);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=z===void 0,V.__autoAllocateDepthBuffer||Pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,D){const z=ve.get(y);z.__webglFramebuffer=D,z.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(y,D=0,z=0){P=y,A=D,R=z;let V=!0,U=null,Q=!1,ae=!1;if(y){const ue=ve.get(y);if(ue.__useDefaultFramebuffer!==void 0)Me.bindFramebuffer(N.FRAMEBUFFER,null),V=!1;else if(ue.__webglFramebuffer===void 0)b.setupRenderTarget(y);else if(ue.__hasExternalTextures)b.rebindTextures(y,ve.get(y.texture).__webglTexture,ve.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const pe=y.depthTexture;if(ue.__boundDepthTexture!==pe){if(pe!==null&&ve.has(pe)&&(y.width!==pe.image.width||y.height!==pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(y)}}const Ee=y.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(ae=!0);const be=ve.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(be[D])?U=be[D][z]:U=be[D],Q=!0):y.samples>0&&b.useMultisampledRTT(y)===!1?U=ve.get(y).__webglMultisampledFramebuffer:Array.isArray(be)?U=be[z]:U=be,w.copy(y.viewport),O.copy(y.scissor),I=y.scissorTest}else w.copy(me).multiplyScalar(G).floor(),O.copy(Re).multiplyScalar(G).floor(),I=Fe;if(Me.bindFramebuffer(N.FRAMEBUFFER,U)&&V&&Me.drawBuffers(y,U),Me.viewport(w),Me.scissor(O),Me.setScissorTest(I),Q){const ue=ve.get(y.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+D,ue.__webglTexture,z)}else if(ae){const ue=ve.get(y.texture),Ee=D||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,ue.__webglTexture,z||0,Ee)}E=-1},this.readRenderTargetPixels=function(y,D,z,V,U,Q,ae){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ve.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe){Me.bindFramebuffer(N.FRAMEBUFFER,fe);try{const ue=y.texture,Ee=ue.format,be=ue.type;if(!Le.textureFormatReadable(Ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Le.textureTypeReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=y.width-V&&z>=0&&z<=y.height-U&&N.readPixels(D,z,V,U,we.convert(Ee),we.convert(be),Q)}finally{const ue=P!==null?ve.get(P).__webglFramebuffer:null;Me.bindFramebuffer(N.FRAMEBUFFER,ue)}}},this.readRenderTargetPixelsAsync=async function(y,D,z,V,U,Q,ae){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ve.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ae!==void 0&&(fe=fe[ae]),fe){const ue=y.texture,Ee=ue.format,be=ue.type;if(!Le.textureFormatReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Le.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=y.width-V&&z>=0&&z<=y.height-U){Me.bindFramebuffer(N.FRAMEBUFFER,fe);const pe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,pe),N.bufferData(N.PIXEL_PACK_BUFFER,Q.byteLength,N.STREAM_READ),N.readPixels(D,z,V,U,we.convert(Ee),we.convert(be),0);const Ne=P!==null?ve.get(P).__webglFramebuffer:null;Me.bindFramebuffer(N.FRAMEBUFFER,Ne);const Ge=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await probeAsync(N,Ge,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,pe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Q),N.deleteBuffer(pe),N.deleteSync(Ge),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,D=null,z=0){y.isTexture!==!0&&(warnOnce("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,y=arguments[1]);const V=Math.pow(2,-z),U=Math.floor(y.image.width*V),Q=Math.floor(y.image.height*V),ae=D!==null?D.x:0,fe=D!==null?D.y:0;b.setTexture2D(y,0),N.copyTexSubImage2D(N.TEXTURE_2D,z,0,0,ae,fe,U,Q),Me.unbindTexture()},this.copyTextureToTexture=function(y,D,z=null,V=null,U=0){y.isTexture!==!0&&(warnOnce("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,y=arguments[1],D=arguments[2],U=arguments[3]||0,z=null);let Q,ae,fe,ue,Ee,be,pe,Ne,Ge;const ke=y.isCompressedTexture?y.mipmaps[U]:y.image;z!==null?(Q=z.max.x-z.min.x,ae=z.max.y-z.min.y,fe=z.isBox3?z.max.z-z.min.z:1,ue=z.min.x,Ee=z.min.y,be=z.isBox3?z.min.z:0):(Q=ke.width,ae=ke.height,fe=ke.depth||1,ue=0,Ee=0,be=0),V!==null?(pe=V.x,Ne=V.y,Ge=V.z):(pe=0,Ne=0,Ge=0);const je=we.convert(D.format),Oe=we.convert(D.type);let ge;D.isData3DTexture?(b.setTexture3D(D,0),ge=N.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(b.setTexture2DArray(D,0),ge=N.TEXTURE_2D_ARRAY):(b.setTexture2D(D,0),ge=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,D.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,D.unpackAlignment);const it=N.getParameter(N.UNPACK_ROW_LENGTH),Be=N.getParameter(N.UNPACK_IMAGE_HEIGHT),et=N.getParameter(N.UNPACK_SKIP_PIXELS),ot=N.getParameter(N.UNPACK_SKIP_ROWS),Ke=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,ke.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ke.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ue),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ee),N.pixelStorei(N.UNPACK_SKIP_IMAGES,be);const ct=y.isDataArrayTexture||y.isData3DTexture,He=D.isDataArrayTexture||D.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const tt=ve.get(y),lt=ve.get(D),Je=ve.get(tt.__renderTarget),rt=ve.get(lt.__renderTarget);Me.bindFramebuffer(N.READ_FRAMEBUFFER,Je.__webglFramebuffer),Me.bindFramebuffer(N.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let at=0;at<fe;at++)ct&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ve.get(y).__webglTexture,U,be+at),y.isDepthTexture?(He&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ve.get(D).__webglTexture,U,Ge+at),N.blitFramebuffer(ue,Ee,Q,ae,pe,Ne,Q,ae,N.DEPTH_BUFFER_BIT,N.NEAREST)):He?N.copyTexSubImage3D(ge,U,pe,Ne,Ge+at,ue,Ee,Q,ae):N.copyTexSubImage2D(ge,U,pe,Ne,Ge+at,ue,Ee,Q,ae);Me.bindFramebuffer(N.READ_FRAMEBUFFER,null),Me.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else He?y.isDataTexture||y.isData3DTexture?N.texSubImage3D(ge,U,pe,Ne,Ge,Q,ae,fe,je,Oe,ke.data):D.isCompressedArrayTexture?N.compressedTexSubImage3D(ge,U,pe,Ne,Ge,Q,ae,fe,je,ke.data):N.texSubImage3D(ge,U,pe,Ne,Ge,Q,ae,fe,je,Oe,ke):y.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,U,pe,Ne,Q,ae,je,Oe,ke.data):y.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,U,pe,Ne,ke.width,ke.height,je,ke.data):N.texSubImage2D(N.TEXTURE_2D,U,pe,Ne,Q,ae,je,Oe,ke);N.pixelStorei(N.UNPACK_ROW_LENGTH,it),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Be),N.pixelStorei(N.UNPACK_SKIP_PIXELS,et),N.pixelStorei(N.UNPACK_SKIP_ROWS,ot),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ke),U===0&&D.generateMipmaps&&N.generateMipmap(ge),Me.unbindTexture()},this.copyTextureToTexture3D=function(y,D,z=null,V=null,U=0){return y.isTexture!==!0&&(warnOnce("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,V=arguments[1]||null,y=arguments[2],D=arguments[3],U=arguments[4]||0),warnOnce('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,D,z,V,U)},this.initRenderTarget=function(y){ve.get(y).__webglFramebuffer===void 0&&b.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?b.setTextureCube(y,0):y.isData3DTexture?b.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?b.setTexture2DArray(y,0):b.setTexture2D(y,0),Me.unbindTexture()},this.resetState=function(){A=0,R=0,P=null,Me.reset(),Ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return WebGLCoordinateSystem}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=ColorManagement._getDrawingBufferColorSpace(e),n.unpackColorSpace=ColorManagement._getUnpackColorSpace()}}class Scene extends Object3D{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Euler,this.environmentIntensity=1,this.environmentRotation=new Euler,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class LineBasicMaterial extends Material{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Color(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const _vStart=new Vector3,_vEnd=new Vector3,_inverseMatrix$1=new Matrix4,_ray$1=new Ray,_sphere$1=new Sphere,_intersectPointOnRay=new Vector3,_intersectPointOnSegment=new Vector3;class Line extends Object3D{constructor(e=new BufferGeometry,n=new LineBasicMaterial){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,a=n.count;r<a;r++)_vStart.fromBufferAttribute(n,r-1),_vEnd.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=_vStart.distanceTo(_vEnd);e.setAttribute("lineDistance",new Float32BufferAttribute(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,a=e.params.Line.threshold,s=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_sphere$1.copy(i.boundingSphere),_sphere$1.applyMatrix4(r),_sphere$1.radius+=a,e.ray.intersectsSphere(_sphere$1)===!1)return;_inverseMatrix$1.copy(r).invert(),_ray$1.copy(e.ray).applyMatrix4(_inverseMatrix$1);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const u=Math.max(0,s.start),_=Math.min(h.count,s.start+s.count);for(let g=u,m=_-1;g<m;g+=l){const p=h.getX(g),T=h.getX(g+1),S=checkIntersection(this,e,_ray$1,c,p,T);S&&n.push(S)}if(this.isLineLoop){const g=h.getX(_-1),m=h.getX(u),p=checkIntersection(this,e,_ray$1,c,g,m);p&&n.push(p)}}else{const u=Math.max(0,s.start),_=Math.min(f.count,s.start+s.count);for(let g=u,m=_-1;g<m;g+=l){const p=checkIntersection(this,e,_ray$1,c,g,g+1);p&&n.push(p)}if(this.isLineLoop){const g=checkIntersection(this,e,_ray$1,c,_-1,u);g&&n.push(g)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function checkIntersection(t,e,n,i,r,a){const s=t.geometry.attributes.position;if(_vStart.fromBufferAttribute(s,r),_vEnd.fromBufferAttribute(s,a),n.distanceSqToSegment(_vStart,_vEnd,_intersectPointOnRay,_intersectPointOnSegment)>i)return;_intersectPointOnRay.applyMatrix4(t.matrixWorld);const c=e.ray.origin.distanceTo(_intersectPointOnRay);if(!(c<e.near||c>e.far))return{distance:c,point:_intersectPointOnSegment.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}class PointsMaterial extends Material{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Color(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const _inverseMatrix=new Matrix4,_ray$2=new Ray,_sphere=new Sphere,_position$2=new Vector3;class Points extends Object3D{constructor(e=new BufferGeometry,n=new PointsMaterial){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,a=e.params.Points.threshold,s=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),_sphere.copy(i.boundingSphere),_sphere.applyMatrix4(r),_sphere.radius+=a,e.ray.intersectsSphere(_sphere)===!1)return;_inverseMatrix.copy(r).invert(),_ray$2.copy(e.ray).applyMatrix4(_inverseMatrix);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,d=i.attributes.position;if(l!==null){const f=Math.max(0,s.start),u=Math.min(l.count,s.start+s.count);for(let _=f,g=u;_<g;_++){const m=l.getX(_);_position$2.fromBufferAttribute(d,m),testPoint(_position$2,m,c,r,e,n,this)}}else{const f=Math.max(0,s.start),u=Math.min(d.count,s.start+s.count);for(let _=f,g=u;_<g;_++)_position$2.fromBufferAttribute(d,_),testPoint(_position$2,_,c,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,s=r.length;a<s;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function testPoint(t,e,n,i,r,a,s){const o=_ray$2.distanceSqToPoint(t);if(o<n){const c=new Vector3;_ray$2.closestPointToPoint(t,c),c.applyMatrix4(i);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;a.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class CylinderGeometry extends BufferGeometry{constructor(e=1,n=1,i=1,r=32,a=1,s=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),a=Math.floor(a);const h=[],d=[],f=[],u=[];let _=0;const g=[],m=i/2;let p=0;T(),s===!1&&(e>0&&S(!0),n>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new Float32BufferAttribute(d,3)),this.setAttribute("normal",new Float32BufferAttribute(f,3)),this.setAttribute("uv",new Float32BufferAttribute(u,2));function T(){const x=new Vector3,C=new Vector3;let A=0;const R=(n-e)/i;for(let P=0;P<=a;P++){const E=[],v=P/a,w=v*(n-e)+e;for(let O=0;O<=r;O++){const I=O/r,F=I*c+o,H=Math.sin(F),$=Math.cos(F);C.x=w*H,C.y=-v*i+m,C.z=w*$,d.push(C.x,C.y,C.z),x.set(H,R,$).normalize(),f.push(x.x,x.y,x.z),u.push(I,1-v),E.push(_++)}g.push(E)}for(let P=0;P<r;P++)for(let E=0;E<a;E++){const v=g[E][P],w=g[E+1][P],O=g[E+1][P+1],I=g[E][P+1];(e>0||E!==0)&&(h.push(v,w,I),A+=3),(n>0||E!==a-1)&&(h.push(w,O,I),A+=3)}l.addGroup(p,A,0),p+=A}function S(x){const C=_,A=new Vector2,R=new Vector3;let P=0;const E=x===!0?e:n,v=x===!0?1:-1;for(let O=1;O<=r;O++)d.push(0,m*v,0),f.push(0,v,0),u.push(.5,.5),_++;const w=_;for(let O=0;O<=r;O++){const F=O/r*c+o,H=Math.cos(F),$=Math.sin(F);R.x=E*$,R.y=m*v,R.z=E*H,d.push(R.x,R.y,R.z),f.push(0,v,0),A.x=H*.5+.5,A.y=$*.5*v+.5,u.push(A.x,A.y),_++}for(let O=0;O<r;O++){const I=C+O,F=w+O;x===!0?h.push(F,F+1,I):h.push(F+1,F,I),P+=3}l.addGroup(p,P,x===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new CylinderGeometry(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Cache={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class LoadingManager{constructor(e,n,i){const r=this;let a=!1,s=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(h){o++,a===!1&&r.onStart!==void 0&&r.onStart(h,s,o),a=!0},this.itemEnd=function(h){s++,r.onProgress!==void 0&&r.onProgress(h,s,o),s===o&&(a=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){const u=l[d],_=l[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return _}return null}}}const DefaultLoadingManager=new LoadingManager;class Loader{constructor(e){this.manager=e!==void 0?e:DefaultLoadingManager,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,a){i.load(e,r,n,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Loader.DEFAULT_MATERIAL_NAME="__DEFAULT";class ImageLoader extends Loader{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const a=this,s=Cache.get(e);if(s!==void 0)return a.manager.itemStart(e),setTimeout(function(){n&&n(s),a.manager.itemEnd(e)},0),s;const o=createElementNS("img");function c(){h(),Cache.add(e,this),n&&n(this),a.manager.itemEnd(e)}function l(d){h(),r&&r(d),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),a.manager.itemStart(e),o.src=e,o}}class TextureLoader extends Loader{constructor(e){super(e)}load(e,n,i,r){const a=new Texture,s=new ImageLoader(this.manager);return s.setCrossOrigin(this.crossOrigin),s.setPath(this.path),s.load(e,function(o){a.image=o,a.needsUpdate=!0,n!==void 0&&n(a)},i,r),a}}class Light extends Object3D{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Color(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const _projScreenMatrix$1=new Matrix4,_lightPositionWorld$1=new Vector3,_lookTarget$1=new Vector3;class LightShadow{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Vector2(512,512),this.map=null,this.mapPass=null,this.matrix=new Matrix4,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Frustum,this._frameExtents=new Vector2(1,1),this._viewportCount=1,this._viewports=[new Vector4(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;_lightPositionWorld$1.setFromMatrixPosition(e.matrixWorld),n.position.copy(_lightPositionWorld$1),_lookTarget$1.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(_lookTarget$1),n.updateMatrixWorld(),_projScreenMatrix$1.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_projScreenMatrix$1),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(_projScreenMatrix$1)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class DirectionalLightShadow extends LightShadow{constructor(){super(new OrthographicCamera(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class DirectionalLight extends Light{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Object3D.DEFAULT_UP),this.updateMatrix(),this.target=new Object3D,this.shadow=new DirectionalLightShadow}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class AmbientLight extends Light{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class Spherical{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(clamp(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Controls extends EventDispatcher{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:REVISION}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=REVISION);function buildMeshLineGeometry(t){const e=t.length;if(e<2)return new BufferGeometry;const n=[],i=[],r=[],a=[];for(let c=0;c<e;c++){const l=t[c],h=c>0?t[c-1]:l,d=c<e-1?t[c+1]:l;n.push(l.x,l.y,l.z),i.push(h.x,h.y,h.z),r.push(d.x,d.y,d.z),a.push(-1),n.push(l.x,l.y,l.z),i.push(h.x,h.y,h.z),r.push(d.x,d.y,d.z),a.push(1)}const s=new BufferGeometry;s.setAttribute("position",new Float32BufferAttribute(n,3)),s.setAttribute("positionPrev",new Float32BufferAttribute(i,3)),s.setAttribute("positionNext",new Float32BufferAttribute(r,3)),s.setAttribute("side",new Float32BufferAttribute(a,1));const o=[];for(let c=0;c<e-1;c++){const l=c*2;o.push(l,l+1,l+2,l+2,l+1,l+3)}return s.setIndex(o),s.computeBoundingSphere(),s}const MESHLINE_VERTEX=`
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
`,MESHLINE_FRAGMENT=`
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;function createMeshLineMaterial(t={}){const e=t.color??16777215,n=t.lineWidth??2,i=t.resolution??new Vector2(800,700),r=new Color(e);return new ShaderMaterial({uniforms:{resolution:{value:i},lineWidth:{value:n},color:{value:new Vector3(r.r,r.g,r.b)}},vertexShader:MESHLINE_VERTEX,fragmentShader:MESHLINE_FRAGMENT,transparent:!1,depthTest:!0,side:DoubleSide})}const DEFAULT_LINE_WIDTH_PX=2,DEFAULT_RESOLUTION=new Vector2(800,700);function createThickLineMesh(t,e,n,i=DEFAULT_LINE_WIDTH_PX,r){if(t.points.length<2){const c=new BufferGeometry;return new Mesh(c,new MeshBasicMaterial({color:n}))}const a=t.points.map(c=>new Vector3(c.x*e,c.y*e,c.z*e)),s=buildMeshLineGeometry(a),o=createMeshLineMaterial({color:n,lineWidth:i,resolution:DEFAULT_RESOLUTION});return new Mesh(s,o)}function toPixelWidth(t){return t>=1?Math.max(1,Math.round(t)):Math.max(1,Math.round(t*100))}function createThickEdgesGroup(t,e,n,i=DEFAULT_LINE_WIDTH_PX,r){const a=toPixelWidth(i),s=new Group;for(const o of t.values())!(o!=null&&o.points)||o.points.length<2||s.add(createThickLineMesh(o,e,n,a));return s}const vertexShader=`
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`,fragmentShader=`
uniform vec3 color;
uniform sampler2D pointTexture;
uniform float alphaTest;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    if ( gl_FragColor.a < alphaTest ) discard;
}
`;function DrawTHREEGraphVertices(t,e=1,n=1,i=16777215,r=1){const a=[],s=t.get_position_map();let o,c;typeof n=="number"?o=Array(t.nodes.size).fill(n):o=n,c=Array(t.nodes.size).fill(i);const l=[],h=new Color;h.setRGB(255,255,255);let d=0,f;for(let m of t.nodes.keys())f=s.get(m),a.push(f.x*e,f.y*e,f.z*e),h.toArray(c,d*3),l.push(m),d+=1;const u=new BufferGeometry;u.setAttribute("position",new Float32BufferAttribute(a,3)),u.setAttribute("customColor",new Float32BufferAttribute(c,3)),u.setAttribute("size",new Float32BufferAttribute(o,1)),u.setAttribute("label",new Int32BufferAttribute(l,1)),u.name="nodes";const _=new ShaderMaterial({uniforms:{color:{value:new Color(16777215)},pointTexture:{value:new TextureLoader().load("./Textures/Square.png")},alphaTest:{value:r}},vertexShader,fragmentShader}),g=new Group;return g.add(new Points(u,_)),g}function DrawTHREEGraphVerticesMutable(t,e=1,n=1,i=16777215,r=1){const a=t.get_node_ids_order(),s=a.length,o=t.get_position_map(),c=[];let l;const h=Array(s).fill(i),d=a.slice(),f=new Color;f.setRGB(255,255,255);for(let T=0;T<s;T++){const S=o.get(a[T]);c.push(S.x*e,S.y*e,S.z*e),f.toArray(h,T*3)}typeof n=="number"?l=Array(s).fill(n):l=n;const u=new BufferGeometry;u.setAttribute("position",new Float32BufferAttribute(c,3)),u.setAttribute("customColor",new Float32BufferAttribute(h,3)),u.setAttribute("size",new Float32BufferAttribute(l,1)),u.setAttribute("label",new Int32BufferAttribute(d,1)),u.name="nodes";const _=new ShaderMaterial({uniforms:{color:{value:new Color(16777215)},pointTexture:{value:new TextureLoader().load("./Textures/Square.png")},alphaTest:{value:r}},vertexShader,fragmentShader}),g=new Group;g.add(new Points(u,_));const m=u.getAttribute("position");function p(T){if(T instanceof Float32Array)m.array.set(T);else{const S=m.array;for(let x=0;x<s;x++){const C=T.get(a[x]);S[x*3]=C.x*e,S[x*3+1]=C.y*e,S[x*3+2]=C.z*e}}m.needsUpdate=!0}return{group:g,updatePositions:p}}function DrawTHREEGraphEdgesThick(t,e=1,n=16777215,i=.4){const r=t.get_edge_map();return DrawThickEdgesFromEdgeMap(r,e,n,i)}function DrawThickEdgesFromEdgeMap(t,e,n=16777215,i=.4){return createThickEdgesGroup(t,e,n,i)}function DrawTHREEGraphEdgesThin(t,e=1,n=16777215){const i=t.get_edge_map();return DrawThinEdgesFromEdgeMap(i,e,n)}function DrawThickPathFromNodeIds(t,e,n,i=16777215,r=5){const a=t.get_position_map(),s=n.map(c=>a.get(c)).filter(c=>c!=null);if(s.length<2)return new Group;const o=new Line$1(s);return createThickEdgesGroup(new Map([[0,o]]),e,i,r)}function DrawThinEdgesFromEdgeMap(t,e=1,n=16777215){const i=new LineBasicMaterial({color:n}),r=new Group;let a;for(const s of t.values()){a=[],s.points.forEach(h=>{a.push(new Vector3(h.x*e,h.y*e,h.z*e))});const c=new BufferGeometry().setFromPoints(a),l=new Line(c,i);r.add(l)}return r}function AddBoxBasedImaging(t,e=1,n=16777215,i=10){let r;typeof i=="number"?r=Array(t.size).fill(i):r=i;const a=new Group,s=new MeshBasicMaterial({color:n});let o=0;for(const[c,l]of t){const h=typeof r=="number"?r:r[o],d=new BoxGeometry(h,h,h);d.name=String(c);const f=new Mesh(d,s);f.position.set(l.x*e,l.y*e,l.z*e),a.add(f),o+=1}return a}function DrawTHREEBoxBasedVertices(t,e=1,n=16777215,i=10){const r=t.get_position_map();return AddBoxBasedImaging(r,e,n,i)}function AddCylinderBasedImaging(t,e=16,n=16777215,i=10){let r;typeof i=="number"?r=Array(t.size).fill(i):r=i;const a=new Group,s=new MeshBasicMaterial({color:n});let o=0;for(const[c,l]of t){const h=typeof r=="number"?r:r[o],d=2*h*Math.PI,f=Math.ceil(d/e),u=new CylinderGeometry(h,h,10,f);u.name=String(c);const _=new Mesh(u,s);_.position.set(l.x,l.y,l.z),a.add(_),o+=1}return a}async function AddInModularityBasedPointGroups(Graph,propertyName){const groups=new Map;let modularity;for(let node of Graph.nodes.keys())Graph.nodes.get(node),modularity=eval(`ndata.data.${propertyName}`),groups.has(modularity)?groups.get(modularity).push(node):groups.set(modularity,[node]);const meshGraphVertices=new Map,meshGraphEdges=new Map;let subgraphGroup,subgraph,pointRep,edges;for(let t of groups.keys())subgraphGroup=groups.get(t),subgraph=await GraphMethods.SelectSubgraph(Graph,subgraphGroup),pointRep=DrawTHREEGraphVertices(subgraph,1),meshGraphVertices.set(t,pointRep),edges=DrawSimplifiedEdges(subgraph,.03),meshGraphEdges.set(t,edges);const ROBJ={nodeGroups:meshGraphVertices,EdgeGroups:meshGraphEdges};return ROBJ}function DrawSimplifiedEdges(t,e,n=16777215){const i=new Group,r=new LineBasicMaterial({color:n});let a,s,o;for(let c of t.edges.values())if(Math.random()<=e){a=t.nodes.get(c.start).data.pos,s=t.nodes.get(c.end).data.pos,o=[],o.push(new Vector3(a.x,a.y,a.z)),o.push(new Vector3(s.x,s.y,s.z));const l=new BufferGeometry().setFromPoints(o),h=new Line(l,r);i.add(h)}return i}function ChangeTheVertexColours(t,e,n){try{const i=t instanceof Group?t.children[0]:t,r=i==null?void 0:i.geometry;if(!(r!=null&&r.attributes))return;const a=r.attributes.customColor,s=a==null?void 0:a.array;if(!s||s.length===0)return;const o=new Color(n),c=r.attributes.label,l=c==null?void 0:c.array;l&&l.length>0?e.forEach(h=>{for(let d=0;d<l.length;d++)if(l[d]===h){const f=d*3;f+2<s.length&&(s[f]=o.r,s[f+1]=o.g,s[f+2]=o.b);break}}):e.forEach(h=>{const d=h*3;d+2<s.length&&(s[d]=o.r,s[d+1]=o.g,s[d+2]=o.b)}),a&&(a.needsUpdate=!0)}catch{}}function ResetVertexColors(t){var e,n;try{const i=t instanceof Group?t.children[0]:t,r=(n=(e=i==null?void 0:i.geometry)==null?void 0:e.attributes)==null?void 0:n.customColor,a=r==null?void 0:r.array;if(!a||a.length===0)return;const s=(r==null?void 0:r.count)??Math.floor(a.length/3);for(let o=0;o<s;o++){const c=o*3;a[c]=1,a[c+1]=1,a[c+2]=1}r&&(r.needsUpdate=!0)}catch{}}const ThreeJSDrawer={DrawTHREEGraphVertices,DrawTHREEGraphVerticesMutable,DrawTHREEGraphEdgesThick,DrawTHREEGraphEdgesThin,DrawThickPathFromNodeIds,AddBoxBasedImaging,AddInModularityBasedPointGroups,DrawThinEdgesFromEdgeMap,DrawThickEdgesFromEdgeMap,AddCylinderBasedImaging,DrawSimplifiedEdges,ChangeTheVertexColours,ResetVertexColors,DrawTHREEBoxBasedVertices},_changeEvent={type:"change"},_startEvent={type:"start"},_endEvent={type:"end"},_ray=new Ray,_plane=new Plane,_TILT_LIMIT=Math.cos(70*MathUtils.DEG2RAD),_v=new Vector3,_twoPI=2*Math.PI,_STATE={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},_EPS=1e-6;class OrbitControls extends Controls{constructor(e,n=null){super(e,n),this.state=_STATE.NONE,this.enabled=!0,this.target=new Vector3,this.cursor=new Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.PAN},this.touches={ONE:TOUCH.ROTATE,TWO:TOUCH.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new Vector3,this._lastQuaternion=new Quaternion,this._lastTargetPosition=new Vector3,this._quat=new Quaternion().setFromUnitVectors(e.up,new Vector3(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Spherical,this._sphericalDelta=new Spherical,this._scale=1,this._panOffset=new Vector3,this._rotateStart=new Vector2,this._rotateEnd=new Vector2,this._rotateDelta=new Vector2,this._panStart=new Vector2,this._panEnd=new Vector2,this._panDelta=new Vector2,this._dollyStart=new Vector2,this._dollyEnd=new Vector2,this._dollyDelta=new Vector2,this._dollyDirection=new Vector3,this._mouse=new Vector2,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=onPointerMove.bind(this),this._onPointerDown=onPointerDown.bind(this),this._onPointerUp=onPointerUp.bind(this),this._onContextMenu=onContextMenu.bind(this),this._onMouseWheel=onMouseWheel.bind(this),this._onKeyDown=onKeyDown.bind(this),this._onTouchStart=onTouchStart.bind(this),this._onTouchMove=onTouchMove.bind(this),this._onMouseDown=onMouseDown.bind(this),this._onMouseMove=onMouseMove.bind(this),this._interceptControlDown=interceptControlDown.bind(this),this._interceptControlUp=interceptControlUp.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_changeEvent),this.update(),this.state=_STATE.NONE}update(e=null){const n=this.object.position;_v.copy(n).sub(this.target),_v.applyQuaternion(this._quat),this._spherical.setFromVector3(_v),this.autoRotate&&this.state===_STATE.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=_twoPI:i>Math.PI&&(i-=_twoPI),r<-Math.PI?r+=_twoPI:r>Math.PI&&(r-=_twoPI),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=s!=this._spherical.radius}if(_v.setFromSpherical(this._spherical),_v.applyQuaternion(this._quatInverse),n.copy(this.target).add(_v),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const o=_v.length();s=this._clampDistance(o*this._scale);const c=o-s;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),a=!!c}else if(this.object.isOrthographicCamera){const o=new Vector3(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=c!==this.object.zoom;const l=new Vector3(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),s=_v.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(_ray.origin.copy(this.object.position),_ray.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(_ray.direction))<_TILT_LIMIT?this.object.lookAt(this.target):(_plane.setFromNormalAndCoplanarPoint(this.object.up,this.target),_ray.intersectPlane(_plane,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>_EPS||8*(1-this._lastQuaternion.dot(this.object.quaternion))>_EPS||this._lastTargetPosition.distanceToSquared(this.target)>_EPS?(this.dispatchEvent(_changeEvent),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?_twoPI/60*this.autoRotateSpeed*e:_twoPI/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){_v.setFromMatrixColumn(n,0),_v.multiplyScalar(-e),this._panOffset.add(_v)}_panUp(e,n){this.screenSpacePanning===!0?_v.setFromMatrixColumn(n,1):(_v.setFromMatrixColumn(n,0),_v.crossVectors(this.object.up,_v)),_v.multiplyScalar(e),this._panOffset.add(_v)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;_v.copy(r).sub(this.target);let a=_v.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/i.clientHeight,this.object.matrix),this._panUp(2*n*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,a=n-i.top,s=i.width,o=i.height;this._mouse.x=r/s*2-1,this._mouse.y=-(a/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(_twoPI*this._rotateDelta.x/n.clientHeight),this._rotateUp(_twoPI*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(_twoPI*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-_twoPI*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(_twoPI*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-_twoPI*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,a=Math.sqrt(i*i+r*r);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),a=.5*(e.pageY+i.y);this._rotateEnd.set(r,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(_twoPI*this._rotateDelta.x/n.clientHeight),this._rotateUp(_twoPI*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,a=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(s,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Vector2,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function onPointerDown(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function onPointerMove(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function onPointerUp(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_endEvent),this.state=_STATE.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function onMouseDown(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case MOUSE.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=_STATE.DOLLY;break;case MOUSE.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=_STATE.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=_STATE.ROTATE}break;case MOUSE.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=_STATE.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=_STATE.PAN}break;default:this.state=_STATE.NONE}this.state!==_STATE.NONE&&this.dispatchEvent(_startEvent)}function onMouseMove(t){switch(this.state){case _STATE.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case _STATE.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case _STATE.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function onMouseWheel(t){this.enabled===!1||this.enableZoom===!1||this.state!==_STATE.NONE||(t.preventDefault(),this.dispatchEvent(_startEvent),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(_endEvent))}function onKeyDown(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function onTouchStart(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case TOUCH.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=_STATE.TOUCH_ROTATE;break;case TOUCH.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=_STATE.TOUCH_PAN;break;default:this.state=_STATE.NONE}break;case 2:switch(this.touches.TWO){case TOUCH.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=_STATE.TOUCH_DOLLY_PAN;break;case TOUCH.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=_STATE.TOUCH_DOLLY_ROTATE;break;default:this.state=_STATE.NONE}break;default:this.state=_STATE.NONE}this.state!==_STATE.NONE&&this.dispatchEvent(_startEvent)}function onTouchMove(t){switch(this._trackPointer(t),this.state){case _STATE.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case _STATE.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case _STATE.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case _STATE.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=_STATE.NONE}}function onContextMenu(t){this.enabled!==!1&&t.preventDefault()}function interceptControlDown(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function interceptControlUp(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class GraphDrawer3d{constructor(e){this.canvas=e.canvas,this.width=e.width,this.height=e.height,this.geometryMap=new Map,this.materialMap=new Map,this.meshMap=new Map,this.controls,this.renderer,this.camera,this.scene,this.graphs=new Map}async init(){const e=performance.now();this.camera=new PerspectiveCamera,this.scene=new Scene,this.renderer=new WebGLRenderer({canvas:this.canvas,antialias:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(16711935,0),this.scene.add(new AmbientLight(16777215));const n=new DirectionalLight(16777215,1);n.position.set(0,10,0),this.scene.add(n),this.controls=new OrbitControls(this.camera,this.renderer.domElement),this.camera.position.set(0,100,100),this.controls.autoRotate=!0,this.controls.maxPolarAngle=Math.PI*.5,this.controls.maxDistance=1e4,this.controls.minDistance=10,this.controls.update();const i=performance.now();console.log("initialization has finished"),console.log(`Time to initialize ${i-e} milliseconds`)}addVisElement(e){this.scene.add(e)}rendercall(){this.renderer.render(this.scene,this.camera),this.controls.update()}}const GraphDrawer={GraphDrawer3d};async function GenerateErdosReyni_n_p(t,e){const n=new Map,i=new Map;let r;for(let l=0;l<t;l++)r=new _Node({}),n.set(l,r);let a,s,o=0;for(let l=0;l<t;l++)for(let h=0;h<t;h++)l!=h&&(a=Math.random(),e>a&&(s=new Edge(l,h,{}),i.set(o,s),o+=1));return new Graph(n,i)}const ErdosRenyiModel={GenerateErdosReyni_n_p};function sqDist(t,e){const n=t.x-e.x,i=t.y-e.y,r=t.z-e.z;return n*n+i*i+r*r}function selectAxis(t){return["x","y","z"][t%3]}function buildKDT(t,e){if(t.length===0)return null;if(t.length===1)return{item:t[0]};const n=selectAxis(e),i=[...t].sort((c,l)=>c.point[n]-l.point[n]),r=Math.floor(i.length/2),a=i[r],s=r>0?buildKDT(i.slice(0,r),e+1):null,o=r+1<i.length?buildKDT(i.slice(r+1),e+1):null;return{left:s??void 0,right:o??void 0,item:a}}function rangeQuery(t,e,n,i,r){if(t===null)return;const a=selectAxis(i);sqDist(e,t.item.point)<=n&&r.push(t.item.nodeId);const o=e[a]-t.item.point[a],c=o*o;o<=0?(t.left&&rangeQuery(t.left,e,n,i+1,r),t.right&&c<=n&&rangeQuery(t.right,e,n,i+1,r)):(t.right&&rangeQuery(t.right,e,n,i+1,r),t.left&&c<=n&&rangeQuery(t.left,e,n,i+1,r))}function pointsWithinRadius(t,e){const n=buildKDT(t,0),i=e*e,r=new Map;for(const{point:a,nodeId:s}of t){const o=[];n&&rangeQuery(n,a,i,0,o),r.set(s,o)}return r}class UnionFind{constructor(){this.parent=new Map}find(e){return this.parent.has(e)||this.parent.set(e,e),this.parent.get(e)!==e&&this.parent.set(e,this.find(this.parent.get(e))),this.parent.get(e)}union(e,n){const i=this.find(e),r=this.find(n);i!==r&&this.parent.set(i,r)}}function createKDDistanceStrategy(){return{cluster(t,e){const{distanceThreshold:n}=e,i=t.get_position_map(),r=[];for(const[u,_]of i)r.push({point:_,nodeId:u});if(r.length===0)return{nodeToCluster:new Map,clusterCentroids:new Map,clusterIds:[]};const a=pointsWithinRadius(r,n),s=new UnionFind;for(const[u,_]of a)for(const g of _)s.union(u,g);const o=new Map;let c=0;const l=new Map,h=new Map;for(const{nodeId:u}of r){const _=s.find(u);o.has(_)||o.set(_,c++);const g=o.get(_);l.set(u,g),h.has(g)||h.set(g,[]),h.get(g).push(u)}const d=new Map;for(const[u,_]of h){const g=_.map(m=>i.get(m));d.set(u,GeometryHelpers.centroid(g))}const f=[...h.keys()];return{nodeToCluster:l,clusterCentroids:d,clusterIds:f}}}}async function buildSimplifiedGraph(t,e){const{nodeToCluster:n,clusterCentroids:i,clusterIds:r}=e,a=new Map,s=new Map;for(const d of r){const f=i.get(d),u=new _Node({pos:f});a.set(d,u)}const o=new Map,c=(d,f)=>d<=f?`${d},${f}`:`${f},${d}`;for(const[,d]of t.edges){const f=n.get(d.start),u=n.get(d.end);if(f===void 0||u===void 0||f===u)continue;const _=c(f,u);o.set(_,(o.get(_)??0)+1)}let l=0;for(const[d,f]of o){const[u,_]=d.split(",").map(Number);s.set(l++,new Edge(u,_,{count:f}))}const h=new Graph(a,s);return await h.initialize(),h}async function clusterByDistance(t,e){const i=createKDDistanceStrategy().cluster(t,e);return buildSimplifiedGraph(t,i)}async function clusterByStrategy(t,e,n){const i=e.cluster(t,n);return buildSimplifiedGraph(t,i)}const index={clusterByDistance,clusterByStrategy};function matrixVectorMultiply(t,e,n,i){for(let r=0;r<e;r++){let a=0;for(let s=0;s<e;s++)a+=t[r*e+s]*n[s];i[r]=a}}function normalizeVector(t){let e=0;for(let i=0;i<t.length;i++)e+=t[i]*t[i];const n=Math.sqrt(e);if(n>0)for(let i=0;i<t.length;i++)t[i]/=n}var EPSILON=1e-6,ARRAY_TYPE=typeof Float32Array<"u"?Float32Array:Array,RANDOM=Math.random,ANGLE_ORDER="zyx";function round$3(t){return t>=0?Math.round(t):t%.5===0?Math.floor(t):Math.round(t)}function setMatrixArrayType(t){ARRAY_TYPE=t}var degree=Math.PI/180,radian=180/Math.PI;function toRadian(t){return t*degree}function toDegree(t){return t*radian}function equals$9(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:EPSILON;return Math.abs(t-e)<=n*Math.max(1,Math.abs(t),Math.abs(e))}const common=Object.freeze(Object.defineProperty({__proto__:null,ANGLE_ORDER,get ARRAY_TYPE(){return ARRAY_TYPE},EPSILON,RANDOM,equals:equals$9,round:round$3,setMatrixArrayType,toDegree,toRadian},Symbol.toStringTag,{value:"Module"}));function create$8(){var t=new ARRAY_TYPE(4);return ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0),t[0]=1,t[3]=1,t}function clone$8(t){var e=new ARRAY_TYPE(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function copy$8(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function identity$5(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t}function fromValues$8(t,e,n,i){var r=new ARRAY_TYPE(4);return r[0]=t,r[1]=e,r[2]=n,r[3]=i,r}function set$8(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t}function transpose$2(t,e){if(t===e){var n=e[1];t[1]=e[2],t[2]=n}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t}function invert$5(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=n*a-r*i;return s?(s=1/s,t[0]=a*s,t[1]=-i*s,t[2]=-r*s,t[3]=n*s,t):null}function adjoint$2(t,e){var n=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=n,t}function determinant$3(t){return t[0]*t[3]-t[2]*t[1]}function multiply$8(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=n[0],c=n[1],l=n[2],h=n[3];return t[0]=i*o+a*c,t[1]=r*o+s*c,t[2]=i*l+a*h,t[3]=r*l+s*h,t}function rotate$4(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c+a*o,t[1]=r*c+s*o,t[2]=i*-o+a*c,t[3]=r*-o+s*c,t}function scale$8(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=n[0],c=n[1];return t[0]=i*o,t[1]=r*o,t[2]=a*c,t[3]=s*c,t}function fromRotation$4(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=-n,t[3]=i,t}function fromScaling$3(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t}function str$8(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function frob$3(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3])}function LDU(t,e,n,i){return t[2]=i[2]/i[0],n[0]=i[0],n[1]=i[1],n[3]=i[3]-t[2]*n[1],[t,e,n]}function add$8(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t}function subtract$6(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t}function exactEquals$8(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function equals$8(t,e){var n=t[0],i=t[1],r=t[2],a=t[3],s=e[0],o=e[1],c=e[2],l=e[3];return Math.abs(n-s)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(i-o)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(o))&&Math.abs(r-c)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(a-l)<=EPSILON*Math.max(1,Math.abs(a),Math.abs(l))}function multiplyScalar$3(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t}function multiplyScalarAndAdd$3(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t}var mul$8=multiply$8,sub$6=subtract$6;const mat2=Object.freeze(Object.defineProperty({__proto__:null,LDU,add:add$8,adjoint:adjoint$2,clone:clone$8,copy:copy$8,create:create$8,determinant:determinant$3,equals:equals$8,exactEquals:exactEquals$8,frob:frob$3,fromRotation:fromRotation$4,fromScaling:fromScaling$3,fromValues:fromValues$8,identity:identity$5,invert:invert$5,mul:mul$8,multiply:multiply$8,multiplyScalar:multiplyScalar$3,multiplyScalarAndAdd:multiplyScalarAndAdd$3,rotate:rotate$4,scale:scale$8,set:set$8,str:str$8,sub:sub$6,subtract:subtract$6,transpose:transpose$2},Symbol.toStringTag,{value:"Module"}));function create$7(){var t=new ARRAY_TYPE(6);return ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[4]=0,t[5]=0),t[0]=1,t[3]=1,t}function clone$7(t){var e=new ARRAY_TYPE(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e}function copy$7(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t}function identity$4(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t}function fromValues$7(t,e,n,i,r,a){var s=new ARRAY_TYPE(6);return s[0]=t,s[1]=e,s[2]=n,s[3]=i,s[4]=r,s[5]=a,s}function set$7(t,e,n,i,r,a,s){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=a,t[5]=s,t}function invert$4(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=n*a-i*r;return c?(c=1/c,t[0]=a*c,t[1]=-i*c,t[2]=-r*c,t[3]=n*c,t[4]=(r*o-a*s)*c,t[5]=(i*s-n*o)*c,t):null}function determinant$2(t){return t[0]*t[3]-t[1]*t[2]}function multiply$7(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=n[0],h=n[1],d=n[2],f=n[3],u=n[4],_=n[5];return t[0]=i*l+a*h,t[1]=r*l+s*h,t[2]=i*d+a*f,t[3]=r*d+s*f,t[4]=i*u+a*_+o,t[5]=r*u+s*_+c,t}function rotate$3(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=Math.sin(n),h=Math.cos(n);return t[0]=i*h+a*l,t[1]=r*h+s*l,t[2]=i*-l+a*h,t[3]=r*-l+s*h,t[4]=o,t[5]=c,t}function scale$7(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=n[0],h=n[1];return t[0]=i*l,t[1]=r*l,t[2]=a*h,t[3]=s*h,t[4]=o,t[5]=c,t}function translate$3(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=n[0],h=n[1];return t[0]=i,t[1]=r,t[2]=a,t[3]=s,t[4]=i*l+a*h+o,t[5]=r*l+s*h+c,t}function fromRotation$3(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=-n,t[3]=i,t[4]=0,t[5]=0,t}function fromScaling$2(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t[4]=0,t[5]=0,t}function fromTranslation$3(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=e[0],t[5]=e[1],t}function str$7(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"}function frob$2(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+1)}function add$7(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t}function subtract$5(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t}function multiplyScalar$2(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t}function multiplyScalarAndAdd$2(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t}function exactEquals$7(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]}function equals$7(t,e){var n=t[0],i=t[1],r=t[2],a=t[3],s=t[4],o=t[5],c=e[0],l=e[1],h=e[2],d=e[3],f=e[4],u=e[5];return Math.abs(n-c)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(c))&&Math.abs(i-l)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(l))&&Math.abs(r-h)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(h))&&Math.abs(a-d)<=EPSILON*Math.max(1,Math.abs(a),Math.abs(d))&&Math.abs(s-f)<=EPSILON*Math.max(1,Math.abs(s),Math.abs(f))&&Math.abs(o-u)<=EPSILON*Math.max(1,Math.abs(o),Math.abs(u))}var mul$7=multiply$7,sub$5=subtract$5;const mat2d=Object.freeze(Object.defineProperty({__proto__:null,add:add$7,clone:clone$7,copy:copy$7,create:create$7,determinant:determinant$2,equals:equals$7,exactEquals:exactEquals$7,frob:frob$2,fromRotation:fromRotation$3,fromScaling:fromScaling$2,fromTranslation:fromTranslation$3,fromValues:fromValues$7,identity:identity$4,invert:invert$4,mul:mul$7,multiply:multiply$7,multiplyScalar:multiplyScalar$2,multiplyScalarAndAdd:multiplyScalarAndAdd$2,rotate:rotate$3,scale:scale$7,set:set$7,str:str$7,sub:sub$5,subtract:subtract$5,translate:translate$3},Symbol.toStringTag,{value:"Module"}));function create$6(){var t=new ARRAY_TYPE(9);return ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function fromMat4$1(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t}function clone$6(t){var e=new ARRAY_TYPE(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function copy$6(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function fromValues$6(t,e,n,i,r,a,s,o,c){var l=new ARRAY_TYPE(9);return l[0]=t,l[1]=e,l[2]=n,l[3]=i,l[4]=r,l[5]=a,l[6]=s,l[7]=o,l[8]=c,l}function set$6(t,e,n,i,r,a,s,o,c,l){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=a,t[5]=s,t[6]=o,t[7]=c,t[8]=l,t}function identity$3(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function transpose$1(t,e){if(t===e){var n=e[1],i=e[2],r=e[5];t[1]=e[3],t[2]=e[6],t[3]=n,t[5]=e[7],t[6]=i,t[7]=r}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t}function invert$3(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*s-o*l,f=-h*a+o*c,u=l*a-s*c,_=n*d+i*f+r*u;return _?(_=1/_,t[0]=d*_,t[1]=(-h*i+r*l)*_,t[2]=(o*i-r*s)*_,t[3]=f*_,t[4]=(h*n-r*c)*_,t[5]=(-o*n+r*a)*_,t[6]=u*_,t[7]=(-l*n+i*c)*_,t[8]=(s*n-i*a)*_,t):null}function adjoint$1(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t[0]=s*h-o*l,t[1]=r*l-i*h,t[2]=i*o-r*s,t[3]=o*c-a*h,t[4]=n*h-r*c,t[5]=r*a-n*o,t[6]=a*l-s*c,t[7]=i*c-n*l,t[8]=n*s-i*a,t}function determinant$1(t){var e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],s=t[5],o=t[6],c=t[7],l=t[8];return e*(l*a-s*c)+n*(-l*r+s*o)+i*(c*r-a*o)}function multiply$6(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=e[8],f=n[0],u=n[1],_=n[2],g=n[3],m=n[4],p=n[5],T=n[6],S=n[7],x=n[8];return t[0]=f*i+u*s+_*l,t[1]=f*r+u*o+_*h,t[2]=f*a+u*c+_*d,t[3]=g*i+m*s+p*l,t[4]=g*r+m*o+p*h,t[5]=g*a+m*c+p*d,t[6]=T*i+S*s+x*l,t[7]=T*r+S*o+x*h,t[8]=T*a+S*c+x*d,t}function translate$2(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=e[8],f=n[0],u=n[1];return t[0]=i,t[1]=r,t[2]=a,t[3]=s,t[4]=o,t[5]=c,t[6]=f*i+u*s+l,t[7]=f*r+u*o+h,t[8]=f*a+u*c+d,t}function rotate$2(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=e[8],f=Math.sin(n),u=Math.cos(n);return t[0]=u*i+f*s,t[1]=u*r+f*o,t[2]=u*a+f*c,t[3]=u*s-f*i,t[4]=u*o-f*r,t[5]=u*c-f*a,t[6]=l,t[7]=h,t[8]=d,t}function scale$6(t,e,n){var i=n[0],r=n[1];return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=r*e[3],t[4]=r*e[4],t[5]=r*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function fromTranslation$2(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=e[0],t[7]=e[1],t[8]=1,t}function fromRotation$2(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=0,t[3]=-n,t[4]=i,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function fromScaling$1(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=e[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function fromMat2d(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t}function fromQuat$1(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=n+n,o=i+i,c=r+r,l=n*s,h=i*s,d=i*o,f=r*s,u=r*o,_=r*c,g=a*s,m=a*o,p=a*c;return t[0]=1-d-_,t[3]=h-p,t[6]=f+m,t[1]=h+p,t[4]=1-l-_,t[7]=u-g,t[2]=f-m,t[5]=u+g,t[8]=1-l-d,t}function normalFromMat4(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],f=e[10],u=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=n*o-i*s,S=n*c-r*s,x=n*l-a*s,C=i*c-r*o,A=i*l-a*o,R=r*l-a*c,P=h*g-d*_,E=h*m-f*_,v=h*p-u*_,w=d*m-f*g,O=d*p-u*g,I=f*p-u*m,F=T*I-S*O+x*w+C*v-A*E+R*P;return F?(F=1/F,t[0]=(o*I-c*O+l*w)*F,t[1]=(c*v-s*I-l*E)*F,t[2]=(s*O-o*v+l*P)*F,t[3]=(r*O-i*I-a*w)*F,t[4]=(n*I-r*v+a*E)*F,t[5]=(i*v-n*O-a*P)*F,t[6]=(g*R-m*A+p*C)*F,t[7]=(m*x-_*R-p*S)*F,t[8]=(_*A-g*x+p*T)*F,t):null}function projection(t,e,n){return t[0]=2/e,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/n,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t}function str$6(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"}function frob$1(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8])}function add$6(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t[8]=e[8]+n[8],t}function subtract$4(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t[6]=e[6]-n[6],t[7]=e[7]-n[7],t[8]=e[8]-n[8],t}function multiplyScalar$1(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*n,t}function multiplyScalarAndAdd$1(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t[6]=e[6]+n[6]*i,t[7]=e[7]+n[7]*i,t[8]=e[8]+n[8]*i,t}function exactEquals$6(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]}function equals$6(t,e){var n=t[0],i=t[1],r=t[2],a=t[3],s=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=e[0],f=e[1],u=e[2],_=e[3],g=e[4],m=e[5],p=e[6],T=e[7],S=e[8];return Math.abs(n-d)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(d))&&Math.abs(i-f)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(f))&&Math.abs(r-u)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(a-_)<=EPSILON*Math.max(1,Math.abs(a),Math.abs(_))&&Math.abs(s-g)<=EPSILON*Math.max(1,Math.abs(s),Math.abs(g))&&Math.abs(o-m)<=EPSILON*Math.max(1,Math.abs(o),Math.abs(m))&&Math.abs(c-p)<=EPSILON*Math.max(1,Math.abs(c),Math.abs(p))&&Math.abs(l-T)<=EPSILON*Math.max(1,Math.abs(l),Math.abs(T))&&Math.abs(h-S)<=EPSILON*Math.max(1,Math.abs(h),Math.abs(S))}var mul$6=multiply$6,sub$4=subtract$4;const mat3=Object.freeze(Object.defineProperty({__proto__:null,add:add$6,adjoint:adjoint$1,clone:clone$6,copy:copy$6,create:create$6,determinant:determinant$1,equals:equals$6,exactEquals:exactEquals$6,frob:frob$1,fromMat2d,fromMat4:fromMat4$1,fromQuat:fromQuat$1,fromRotation:fromRotation$2,fromScaling:fromScaling$1,fromTranslation:fromTranslation$2,fromValues:fromValues$6,identity:identity$3,invert:invert$3,mul:mul$6,multiply:multiply$6,multiplyScalar:multiplyScalar$1,multiplyScalarAndAdd:multiplyScalarAndAdd$1,normalFromMat4,projection,rotate:rotate$2,scale:scale$6,set:set$6,str:str$6,sub:sub$4,subtract:subtract$4,translate:translate$2,transpose:transpose$1},Symbol.toStringTag,{value:"Module"}));function create$5(){var t=new ARRAY_TYPE(16);return ARRAY_TYPE!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function clone$5(t){var e=new ARRAY_TYPE(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function copy$5(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function fromValues$5(t,e,n,i,r,a,s,o,c,l,h,d,f,u,_,g){var m=new ARRAY_TYPE(16);return m[0]=t,m[1]=e,m[2]=n,m[3]=i,m[4]=r,m[5]=a,m[6]=s,m[7]=o,m[8]=c,m[9]=l,m[10]=h,m[11]=d,m[12]=f,m[13]=u,m[14]=_,m[15]=g,m}function set$5(t,e,n,i,r,a,s,o,c,l,h,d,f,u,_,g,m){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=a,t[5]=s,t[6]=o,t[7]=c,t[8]=l,t[9]=h,t[10]=d,t[11]=f,t[12]=u,t[13]=_,t[14]=g,t[15]=m,t}function identity$2(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function transpose(t,e){if(t===e){var n=e[1],i=e[2],r=e[3],a=e[6],s=e[7],o=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=n,t[6]=e[9],t[7]=e[13],t[8]=i,t[9]=a,t[11]=e[14],t[12]=r,t[13]=s,t[14]=o}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function invert$2(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],f=e[10],u=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=n*o-i*s,S=n*c-r*s,x=n*l-a*s,C=i*c-r*o,A=i*l-a*o,R=r*l-a*c,P=h*g-d*_,E=h*m-f*_,v=h*p-u*_,w=d*m-f*g,O=d*p-u*g,I=f*p-u*m,F=T*I-S*O+x*w+C*v-A*E+R*P;return F?(F=1/F,t[0]=(o*I-c*O+l*w)*F,t[1]=(r*O-i*I-a*w)*F,t[2]=(g*R-m*A+p*C)*F,t[3]=(f*A-d*R-u*C)*F,t[4]=(c*v-s*I-l*E)*F,t[5]=(n*I-r*v+a*E)*F,t[6]=(m*x-_*R-p*S)*F,t[7]=(h*R-f*x+u*S)*F,t[8]=(s*O-o*v+l*P)*F,t[9]=(i*v-n*O-a*P)*F,t[10]=(_*A-g*x+p*T)*F,t[11]=(d*x-h*A-u*T)*F,t[12]=(o*E-s*w-c*P)*F,t[13]=(n*w-i*E+r*P)*F,t[14]=(g*S-_*C-m*T)*F,t[15]=(h*C-d*S+f*T)*F,t):null}function adjoint(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],f=e[10],u=e[11],_=e[12],g=e[13],m=e[14],p=e[15],T=n*o-i*s,S=n*c-r*s,x=n*l-a*s,C=i*c-r*o,A=i*l-a*o,R=r*l-a*c,P=h*g-d*_,E=h*m-f*_,v=h*p-u*_,w=d*m-f*g,O=d*p-u*g,I=f*p-u*m;return t[0]=o*I-c*O+l*w,t[1]=r*O-i*I-a*w,t[2]=g*R-m*A+p*C,t[3]=f*A-d*R-u*C,t[4]=c*v-s*I-l*E,t[5]=n*I-r*v+a*E,t[6]=m*x-_*R-p*S,t[7]=h*R-f*x+u*S,t[8]=s*O-o*v+l*P,t[9]=i*v-n*O-a*P,t[10]=_*A-g*x+p*T,t[11]=d*x-h*A-u*T,t[12]=o*E-s*w-c*P,t[13]=n*w-i*E+r*P,t[14]=g*S-_*C-m*T,t[15]=h*C-d*S+f*T,t}function determinant(t){var e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],s=t[5],o=t[6],c=t[7],l=t[8],h=t[9],d=t[10],f=t[11],u=t[12],_=t[13],g=t[14],m=t[15],p=e*s-n*a,T=e*o-i*a,S=n*o-i*s,x=l*_-h*u,C=l*g-d*u,A=h*g-d*_,R=e*A-n*C+i*x,P=a*A-s*C+o*x,E=l*S-h*T+d*p,v=u*S-_*T+g*p;return c*R-r*P+m*E-f*v}function multiply$5(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=e[8],f=e[9],u=e[10],_=e[11],g=e[12],m=e[13],p=e[14],T=e[15],S=n[0],x=n[1],C=n[2],A=n[3];return t[0]=S*i+x*o+C*d+A*g,t[1]=S*r+x*c+C*f+A*m,t[2]=S*a+x*l+C*u+A*p,t[3]=S*s+x*h+C*_+A*T,S=n[4],x=n[5],C=n[6],A=n[7],t[4]=S*i+x*o+C*d+A*g,t[5]=S*r+x*c+C*f+A*m,t[6]=S*a+x*l+C*u+A*p,t[7]=S*s+x*h+C*_+A*T,S=n[8],x=n[9],C=n[10],A=n[11],t[8]=S*i+x*o+C*d+A*g,t[9]=S*r+x*c+C*f+A*m,t[10]=S*a+x*l+C*u+A*p,t[11]=S*s+x*h+C*_+A*T,S=n[12],x=n[13],C=n[14],A=n[15],t[12]=S*i+x*o+C*d+A*g,t[13]=S*r+x*c+C*f+A*m,t[14]=S*a+x*l+C*u+A*p,t[15]=S*s+x*h+C*_+A*T,t}function translate$1(t,e,n){var i=n[0],r=n[1],a=n[2],s,o,c,l,h,d,f,u,_,g,m,p;return e===t?(t[12]=e[0]*i+e[4]*r+e[8]*a+e[12],t[13]=e[1]*i+e[5]*r+e[9]*a+e[13],t[14]=e[2]*i+e[6]*r+e[10]*a+e[14],t[15]=e[3]*i+e[7]*r+e[11]*a+e[15]):(s=e[0],o=e[1],c=e[2],l=e[3],h=e[4],d=e[5],f=e[6],u=e[7],_=e[8],g=e[9],m=e[10],p=e[11],t[0]=s,t[1]=o,t[2]=c,t[3]=l,t[4]=h,t[5]=d,t[6]=f,t[7]=u,t[8]=_,t[9]=g,t[10]=m,t[11]=p,t[12]=s*i+h*r+_*a+e[12],t[13]=o*i+d*r+g*a+e[13],t[14]=c*i+f*r+m*a+e[14],t[15]=l*i+u*r+p*a+e[15]),t}function scale$5(t,e,n){var i=n[0],r=n[1],a=n[2];return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*a,t[9]=e[9]*a,t[10]=e[10]*a,t[11]=e[11]*a,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function rotate$1(t,e,n,i){var r=i[0],a=i[1],s=i[2],o=Math.sqrt(r*r+a*a+s*s),c,l,h,d,f,u,_,g,m,p,T,S,x,C,A,R,P,E,v,w,O,I,F,H;return o<EPSILON?null:(o=1/o,r*=o,a*=o,s*=o,c=Math.sin(n),l=Math.cos(n),h=1-l,d=e[0],f=e[1],u=e[2],_=e[3],g=e[4],m=e[5],p=e[6],T=e[7],S=e[8],x=e[9],C=e[10],A=e[11],R=r*r*h+l,P=a*r*h+s*c,E=s*r*h-a*c,v=r*a*h-s*c,w=a*a*h+l,O=s*a*h+r*c,I=r*s*h+a*c,F=a*s*h-r*c,H=s*s*h+l,t[0]=d*R+g*P+S*E,t[1]=f*R+m*P+x*E,t[2]=u*R+p*P+C*E,t[3]=_*R+T*P+A*E,t[4]=d*v+g*w+S*O,t[5]=f*v+m*w+x*O,t[6]=u*v+p*w+C*O,t[7]=_*v+T*w+A*O,t[8]=d*I+g*F+S*H,t[9]=f*I+m*F+x*H,t[10]=u*I+p*F+C*H,t[11]=_*I+T*F+A*H,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function rotateX$3(t,e,n){var i=Math.sin(n),r=Math.cos(n),a=e[4],s=e[5],o=e[6],c=e[7],l=e[8],h=e[9],d=e[10],f=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=a*r+l*i,t[5]=s*r+h*i,t[6]=o*r+d*i,t[7]=c*r+f*i,t[8]=l*r-a*i,t[9]=h*r-s*i,t[10]=d*r-o*i,t[11]=f*r-c*i,t}function rotateY$3(t,e,n){var i=Math.sin(n),r=Math.cos(n),a=e[0],s=e[1],o=e[2],c=e[3],l=e[8],h=e[9],d=e[10],f=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=a*r-l*i,t[1]=s*r-h*i,t[2]=o*r-d*i,t[3]=c*r-f*i,t[8]=a*i+l*r,t[9]=s*i+h*r,t[10]=o*i+d*r,t[11]=c*i+f*r,t}function rotateZ$3(t,e,n){var i=Math.sin(n),r=Math.cos(n),a=e[0],s=e[1],o=e[2],c=e[3],l=e[4],h=e[5],d=e[6],f=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=a*r+l*i,t[1]=s*r+h*i,t[2]=o*r+d*i,t[3]=c*r+f*i,t[4]=l*r-a*i,t[5]=h*r-s*i,t[6]=d*r-o*i,t[7]=f*r-c*i,t}function fromTranslation$1(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t}function fromScaling(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fromRotation$1(t,e,n){var i=n[0],r=n[1],a=n[2],s=Math.sqrt(i*i+r*r+a*a),o,c,l;return s<EPSILON?null:(s=1/s,i*=s,r*=s,a*=s,o=Math.sin(e),c=Math.cos(e),l=1-c,t[0]=i*i*l+c,t[1]=r*i*l+a*o,t[2]=a*i*l-r*o,t[3]=0,t[4]=i*r*l-a*o,t[5]=r*r*l+c,t[6]=a*r*l+i*o,t[7]=0,t[8]=i*a*l+r*o,t[9]=r*a*l-i*o,t[10]=a*a*l+c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}function fromXRotation(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=n,t[7]=0,t[8]=0,t[9]=-n,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fromYRotation(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=0,t[2]=-n,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=n,t[9]=0,t[10]=i,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fromZRotation(t,e){var n=Math.sin(e),i=Math.cos(e);return t[0]=i,t[1]=n,t[2]=0,t[3]=0,t[4]=-n,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function fromRotationTranslation$1(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=i+i,c=r+r,l=a+a,h=i*o,d=i*c,f=i*l,u=r*c,_=r*l,g=a*l,m=s*o,p=s*c,T=s*l;return t[0]=1-(u+g),t[1]=d+T,t[2]=f-p,t[3]=0,t[4]=d-T,t[5]=1-(h+g),t[6]=_+m,t[7]=0,t[8]=f+p,t[9]=_-m,t[10]=1-(h+u),t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function fromQuat2(t,e){var n=new ARRAY_TYPE(3),i=-e[0],r=-e[1],a=-e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=i*i+r*r+a*a+s*s;return d>0?(n[0]=(o*s+h*i+c*a-l*r)*2/d,n[1]=(c*s+h*r+l*i-o*a)*2/d,n[2]=(l*s+h*a+o*r-c*i)*2/d):(n[0]=(o*s+h*i+c*a-l*r)*2,n[1]=(c*s+h*r+l*i-o*a)*2,n[2]=(l*s+h*a+o*r-c*i)*2),fromRotationTranslation$1(t,e,n),t}function getTranslation$1(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t}function getScaling(t,e){var n=e[0],i=e[1],r=e[2],a=e[4],s=e[5],o=e[6],c=e[8],l=e[9],h=e[10];return t[0]=Math.sqrt(n*n+i*i+r*r),t[1]=Math.sqrt(a*a+s*s+o*o),t[2]=Math.sqrt(c*c+l*l+h*h),t}function getRotation(t,e){var n=new ARRAY_TYPE(3);getScaling(n,e);var i=1/n[0],r=1/n[1],a=1/n[2],s=e[0]*i,o=e[1]*r,c=e[2]*a,l=e[4]*i,h=e[5]*r,d=e[6]*a,f=e[8]*i,u=e[9]*r,_=e[10]*a,g=s+h+_,m=0;return g>0?(m=Math.sqrt(g+1)*2,t[3]=.25*m,t[0]=(d-u)/m,t[1]=(f-c)/m,t[2]=(o-l)/m):s>h&&s>_?(m=Math.sqrt(1+s-h-_)*2,t[3]=(d-u)/m,t[0]=.25*m,t[1]=(o+l)/m,t[2]=(f+c)/m):h>_?(m=Math.sqrt(1+h-s-_)*2,t[3]=(f-c)/m,t[0]=(o+l)/m,t[1]=.25*m,t[2]=(d+u)/m):(m=Math.sqrt(1+_-s-h)*2,t[3]=(o-l)/m,t[0]=(f+c)/m,t[1]=(d+u)/m,t[2]=.25*m),t}function decompose(t,e,n,i){e[0]=i[12],e[1]=i[13],e[2]=i[14];var r=i[0],a=i[1],s=i[2],o=i[4],c=i[5],l=i[6],h=i[8],d=i[9],f=i[10];n[0]=Math.sqrt(r*r+a*a+s*s),n[1]=Math.sqrt(o*o+c*c+l*l),n[2]=Math.sqrt(h*h+d*d+f*f);var u=1/n[0],_=1/n[1],g=1/n[2],m=r*u,p=a*_,T=s*g,S=o*u,x=c*_,C=l*g,A=h*u,R=d*_,P=f*g,E=m+x+P,v=0;return E>0?(v=Math.sqrt(E+1)*2,t[3]=.25*v,t[0]=(C-R)/v,t[1]=(A-T)/v,t[2]=(p-S)/v):m>x&&m>P?(v=Math.sqrt(1+m-x-P)*2,t[3]=(C-R)/v,t[0]=.25*v,t[1]=(p+S)/v,t[2]=(A+T)/v):x>P?(v=Math.sqrt(1+x-m-P)*2,t[3]=(A-T)/v,t[0]=(p+S)/v,t[1]=.25*v,t[2]=(C+R)/v):(v=Math.sqrt(1+P-m-x)*2,t[3]=(p-S)/v,t[0]=(A+T)/v,t[1]=(C+R)/v,t[2]=.25*v),t}function fromRotationTranslationScale(t,e,n,i){var r=e[0],a=e[1],s=e[2],o=e[3],c=r+r,l=a+a,h=s+s,d=r*c,f=r*l,u=r*h,_=a*l,g=a*h,m=s*h,p=o*c,T=o*l,S=o*h,x=i[0],C=i[1],A=i[2];return t[0]=(1-(_+m))*x,t[1]=(f+S)*x,t[2]=(u-T)*x,t[3]=0,t[4]=(f-S)*C,t[5]=(1-(d+m))*C,t[6]=(g+p)*C,t[7]=0,t[8]=(u+T)*A,t[9]=(g-p)*A,t[10]=(1-(d+_))*A,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function fromRotationTranslationScaleOrigin(t,e,n,i,r){var a=e[0],s=e[1],o=e[2],c=e[3],l=a+a,h=s+s,d=o+o,f=a*l,u=a*h,_=a*d,g=s*h,m=s*d,p=o*d,T=c*l,S=c*h,x=c*d,C=i[0],A=i[1],R=i[2],P=r[0],E=r[1],v=r[2],w=(1-(g+p))*C,O=(u+x)*C,I=(_-S)*C,F=(u-x)*A,H=(1-(f+p))*A,$=(m+T)*A,K=(_+S)*R,G=(m-T)*R,ee=(1-(f+g))*R;return t[0]=w,t[1]=O,t[2]=I,t[3]=0,t[4]=F,t[5]=H,t[6]=$,t[7]=0,t[8]=K,t[9]=G,t[10]=ee,t[11]=0,t[12]=n[0]+P-(w*P+F*E+K*v),t[13]=n[1]+E-(O*P+H*E+G*v),t[14]=n[2]+v-(I*P+$*E+ee*v),t[15]=1,t}function fromQuat(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=n+n,o=i+i,c=r+r,l=n*s,h=i*s,d=i*o,f=r*s,u=r*o,_=r*c,g=a*s,m=a*o,p=a*c;return t[0]=1-d-_,t[1]=h+p,t[2]=f-m,t[3]=0,t[4]=h-p,t[5]=1-l-_,t[6]=u+g,t[7]=0,t[8]=f+m,t[9]=u-g,t[10]=1-l-d,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function frustum(t,e,n,i,r,a,s){var o=1/(n-e),c=1/(r-i),l=1/(a-s);return t[0]=a*2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a*2*c,t[6]=0,t[7]=0,t[8]=(n+e)*o,t[9]=(r+i)*c,t[10]=(s+a)*l,t[11]=-1,t[12]=0,t[13]=0,t[14]=s*a*2*l,t[15]=0,t}function perspectiveNO(t,e,n,i,r){var a=1/Math.tan(e/2);if(t[0]=a/n,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,r!=null&&r!==1/0){var s=1/(i-r);t[10]=(r+i)*s,t[14]=2*r*i*s}else t[10]=-1,t[14]=-2*i;return t}var perspective=perspectiveNO;function perspectiveZO(t,e,n,i,r){var a=1/Math.tan(e/2);if(t[0]=a/n,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,r!=null&&r!==1/0){var s=1/(i-r);t[10]=r*s,t[14]=r*i*s}else t[10]=-1,t[14]=-i;return t}function perspectiveFromFieldOfView(t,e,n,i){var r=Math.tan(e.upDegrees*Math.PI/180),a=Math.tan(e.downDegrees*Math.PI/180),s=Math.tan(e.leftDegrees*Math.PI/180),o=Math.tan(e.rightDegrees*Math.PI/180),c=2/(s+o),l=2/(r+a);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=l,t[6]=0,t[7]=0,t[8]=-((s-o)*c*.5),t[9]=(r-a)*l*.5,t[10]=i/(n-i),t[11]=-1,t[12]=0,t[13]=0,t[14]=i*n/(n-i),t[15]=0,t}function orthoNO(t,e,n,i,r,a,s){var o=1/(e-n),c=1/(i-r),l=1/(a-s);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*l,t[11]=0,t[12]=(e+n)*o,t[13]=(r+i)*c,t[14]=(s+a)*l,t[15]=1,t}var ortho=orthoNO;function orthoZO(t,e,n,i,r,a,s){var o=1/(e-n),c=1/(i-r),l=1/(a-s);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=l,t[11]=0,t[12]=(e+n)*o,t[13]=(r+i)*c,t[14]=a*l,t[15]=1,t}function lookAt(t,e,n,i){var r,a,s,o,c,l,h,d,f,u,_=e[0],g=e[1],m=e[2],p=i[0],T=i[1],S=i[2],x=n[0],C=n[1],A=n[2];return Math.abs(_-x)<EPSILON&&Math.abs(g-C)<EPSILON&&Math.abs(m-A)<EPSILON?identity$2(t):(h=_-x,d=g-C,f=m-A,u=1/Math.sqrt(h*h+d*d+f*f),h*=u,d*=u,f*=u,r=T*f-S*d,a=S*h-p*f,s=p*d-T*h,u=Math.sqrt(r*r+a*a+s*s),u?(u=1/u,r*=u,a*=u,s*=u):(r=0,a=0,s=0),o=d*s-f*a,c=f*r-h*s,l=h*a-d*r,u=Math.sqrt(o*o+c*c+l*l),u?(u=1/u,o*=u,c*=u,l*=u):(o=0,c=0,l=0),t[0]=r,t[1]=o,t[2]=h,t[3]=0,t[4]=a,t[5]=c,t[6]=d,t[7]=0,t[8]=s,t[9]=l,t[10]=f,t[11]=0,t[12]=-(r*_+a*g+s*m),t[13]=-(o*_+c*g+l*m),t[14]=-(h*_+d*g+f*m),t[15]=1,t)}function targetTo(t,e,n,i){var r=e[0],a=e[1],s=e[2],o=i[0],c=i[1],l=i[2],h=r-n[0],d=a-n[1],f=s-n[2],u=h*h+d*d+f*f;u>0&&(u=1/Math.sqrt(u),h*=u,d*=u,f*=u);var _=c*f-l*d,g=l*h-o*f,m=o*d-c*h;return u=_*_+g*g+m*m,u>0&&(u=1/Math.sqrt(u),_*=u,g*=u,m*=u),t[0]=_,t[1]=g,t[2]=m,t[3]=0,t[4]=d*m-f*g,t[5]=f*_-h*m,t[6]=h*g-d*_,t[7]=0,t[8]=h,t[9]=d,t[10]=f,t[11]=0,t[12]=r,t[13]=a,t[14]=s,t[15]=1,t}function str$5(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"}function frob(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]+t[3]*t[3]+t[4]*t[4]+t[5]*t[5]+t[6]*t[6]+t[7]*t[7]+t[8]*t[8]+t[9]*t[9]+t[10]*t[10]+t[11]*t[11]+t[12]*t[12]+t[13]*t[13]+t[14]*t[14]+t[15]*t[15])}function add$5(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t[8]=e[8]+n[8],t[9]=e[9]+n[9],t[10]=e[10]+n[10],t[11]=e[11]+n[11],t[12]=e[12]+n[12],t[13]=e[13]+n[13],t[14]=e[14]+n[14],t[15]=e[15]+n[15],t}function subtract$3(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t[4]=e[4]-n[4],t[5]=e[5]-n[5],t[6]=e[6]-n[6],t[7]=e[7]-n[7],t[8]=e[8]-n[8],t[9]=e[9]-n[9],t[10]=e[10]-n[10],t[11]=e[11]-n[11],t[12]=e[12]-n[12],t[13]=e[13]-n[13],t[14]=e[14]-n[14],t[15]=e[15]-n[15],t}function multiplyScalar(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*n,t[9]=e[9]*n,t[10]=e[10]*n,t[11]=e[11]*n,t[12]=e[12]*n,t[13]=e[13]*n,t[14]=e[14]*n,t[15]=e[15]*n,t}function multiplyScalarAndAdd(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t[4]=e[4]+n[4]*i,t[5]=e[5]+n[5]*i,t[6]=e[6]+n[6]*i,t[7]=e[7]+n[7]*i,t[8]=e[8]+n[8]*i,t[9]=e[9]+n[9]*i,t[10]=e[10]+n[10]*i,t[11]=e[11]+n[11]*i,t[12]=e[12]+n[12]*i,t[13]=e[13]+n[13]*i,t[14]=e[14]+n[14]*i,t[15]=e[15]+n[15]*i,t}function exactEquals$5(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]}function equals$5(t,e){var n=t[0],i=t[1],r=t[2],a=t[3],s=t[4],o=t[5],c=t[6],l=t[7],h=t[8],d=t[9],f=t[10],u=t[11],_=t[12],g=t[13],m=t[14],p=t[15],T=e[0],S=e[1],x=e[2],C=e[3],A=e[4],R=e[5],P=e[6],E=e[7],v=e[8],w=e[9],O=e[10],I=e[11],F=e[12],H=e[13],$=e[14],K=e[15];return Math.abs(n-T)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(T))&&Math.abs(i-S)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(S))&&Math.abs(r-x)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(x))&&Math.abs(a-C)<=EPSILON*Math.max(1,Math.abs(a),Math.abs(C))&&Math.abs(s-A)<=EPSILON*Math.max(1,Math.abs(s),Math.abs(A))&&Math.abs(o-R)<=EPSILON*Math.max(1,Math.abs(o),Math.abs(R))&&Math.abs(c-P)<=EPSILON*Math.max(1,Math.abs(c),Math.abs(P))&&Math.abs(l-E)<=EPSILON*Math.max(1,Math.abs(l),Math.abs(E))&&Math.abs(h-v)<=EPSILON*Math.max(1,Math.abs(h),Math.abs(v))&&Math.abs(d-w)<=EPSILON*Math.max(1,Math.abs(d),Math.abs(w))&&Math.abs(f-O)<=EPSILON*Math.max(1,Math.abs(f),Math.abs(O))&&Math.abs(u-I)<=EPSILON*Math.max(1,Math.abs(u),Math.abs(I))&&Math.abs(_-F)<=EPSILON*Math.max(1,Math.abs(_),Math.abs(F))&&Math.abs(g-H)<=EPSILON*Math.max(1,Math.abs(g),Math.abs(H))&&Math.abs(m-$)<=EPSILON*Math.max(1,Math.abs(m),Math.abs($))&&Math.abs(p-K)<=EPSILON*Math.max(1,Math.abs(p),Math.abs(K))}var mul$5=multiply$5,sub$3=subtract$3;const mat4=Object.freeze(Object.defineProperty({__proto__:null,add:add$5,adjoint,clone:clone$5,copy:copy$5,create:create$5,decompose,determinant,equals:equals$5,exactEquals:exactEquals$5,frob,fromQuat,fromQuat2,fromRotation:fromRotation$1,fromRotationTranslation:fromRotationTranslation$1,fromRotationTranslationScale,fromRotationTranslationScaleOrigin,fromScaling,fromTranslation:fromTranslation$1,fromValues:fromValues$5,fromXRotation,fromYRotation,fromZRotation,frustum,getRotation,getScaling,getTranslation:getTranslation$1,identity:identity$2,invert:invert$2,lookAt,mul:mul$5,multiply:multiply$5,multiplyScalar,multiplyScalarAndAdd,ortho,orthoNO,orthoZO,perspective,perspectiveFromFieldOfView,perspectiveNO,perspectiveZO,rotate:rotate$1,rotateX:rotateX$3,rotateY:rotateY$3,rotateZ:rotateZ$3,scale:scale$5,set:set$5,str:str$5,sub:sub$3,subtract:subtract$3,targetTo,translate:translate$1,transpose},Symbol.toStringTag,{value:"Module"}));function create$4(){var t=new ARRAY_TYPE(3);return ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function clone$4(t){var e=new ARRAY_TYPE(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function length$4(t){var e=t[0],n=t[1],i=t[2];return Math.sqrt(e*e+n*n+i*i)}function fromValues$4(t,e,n){var i=new ARRAY_TYPE(3);return i[0]=t,i[1]=e,i[2]=n,i}function copy$4(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function set$4(t,e,n,i){return t[0]=e,t[1]=n,t[2]=i,t}function add$4(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t}function subtract$2(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t}function multiply$4(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t}function divide$2(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t}function ceil$2(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t}function floor$2(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t}function min$2(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t}function max$2(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t}function round$2(t,e){return t[0]=round$3(e[0]),t[1]=round$3(e[1]),t[2]=round$3(e[2]),t}function scale$4(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t}function scaleAndAdd$2(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t}function distance$2(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return Math.sqrt(n*n+i*i+r*r)}function squaredDistance$2(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return n*n+i*i+r*r}function squaredLength$4(t){var e=t[0],n=t[1],i=t[2];return e*e+n*n+i*i}function negate$2(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function inverse$2(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t}function normalize$4(t,e){var n=e[0],i=e[1],r=e[2],a=n*n+i*i+r*r;return a>0&&(a=1/Math.sqrt(a)),t[0]=e[0]*a,t[1]=e[1]*a,t[2]=e[2]*a,t}function dot$4(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function cross$2(t,e,n){var i=e[0],r=e[1],a=e[2],s=n[0],o=n[1],c=n[2];return t[0]=r*c-a*o,t[1]=a*s-i*c,t[2]=i*o-r*s,t}function lerp$4(t,e,n,i){var r=e[0],a=e[1],s=e[2];return t[0]=r+i*(n[0]-r),t[1]=a+i*(n[1]-a),t[2]=s+i*(n[2]-s),t}function slerp$1(t,e,n,i){var r=Math.acos(Math.min(Math.max(dot$4(e,n),-1),1)),a=Math.sin(r),s=Math.sin((1-i)*r)/a,o=Math.sin(i*r)/a;return t[0]=s*e[0]+o*n[0],t[1]=s*e[1]+o*n[1],t[2]=s*e[2]+o*n[2],t}function hermite(t,e,n,i,r,a){var s=a*a,o=s*(2*a-3)+1,c=s*(a-2)+a,l=s*(a-1),h=s*(3-2*a);return t[0]=e[0]*o+n[0]*c+i[0]*l+r[0]*h,t[1]=e[1]*o+n[1]*c+i[1]*l+r[1]*h,t[2]=e[2]*o+n[2]*c+i[2]*l+r[2]*h,t}function bezier(t,e,n,i,r,a){var s=1-a,o=s*s,c=a*a,l=o*s,h=3*a*o,d=3*c*s,f=c*a;return t[0]=e[0]*l+n[0]*h+i[0]*d+r[0]*f,t[1]=e[1]*l+n[1]*h+i[1]*d+r[1]*f,t[2]=e[2]*l+n[2]*h+i[2]*d+r[2]*f,t}function random$3(t,e){e=e===void 0?1:e;var n=RANDOM()*2*Math.PI,i=RANDOM()*2-1,r=Math.sqrt(1-i*i)*e;return t[0]=Math.cos(n)*r,t[1]=Math.sin(n)*r,t[2]=i*e,t}function transformMat4$2(t,e,n){var i=e[0],r=e[1],a=e[2],s=n[3]*i+n[7]*r+n[11]*a+n[15];return s=s||1,t[0]=(n[0]*i+n[4]*r+n[8]*a+n[12])/s,t[1]=(n[1]*i+n[5]*r+n[9]*a+n[13])/s,t[2]=(n[2]*i+n[6]*r+n[10]*a+n[14])/s,t}function transformMat3$1(t,e,n){var i=e[0],r=e[1],a=e[2];return t[0]=i*n[0]+r*n[3]+a*n[6],t[1]=i*n[1]+r*n[4]+a*n[7],t[2]=i*n[2]+r*n[5]+a*n[8],t}function transformQuat$1(t,e,n){var i=n[0],r=n[1],a=n[2],s=n[3],o=e[0],c=e[1],l=e[2],h=r*l-a*c,d=a*o-i*l,f=i*c-r*o;return h=h+h,d=d+d,f=f+f,t[0]=o+s*h+r*f-a*d,t[1]=c+s*d+a*h-i*f,t[2]=l+s*f+i*d-r*h,t}function rotateX$2(t,e,n,i){var r=[],a=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],a[0]=r[0],a[1]=r[1]*Math.cos(i)-r[2]*Math.sin(i),a[2]=r[1]*Math.sin(i)+r[2]*Math.cos(i),t[0]=a[0]+n[0],t[1]=a[1]+n[1],t[2]=a[2]+n[2],t}function rotateY$2(t,e,n,i){var r=[],a=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],a[0]=r[2]*Math.sin(i)+r[0]*Math.cos(i),a[1]=r[1],a[2]=r[2]*Math.cos(i)-r[0]*Math.sin(i),t[0]=a[0]+n[0],t[1]=a[1]+n[1],t[2]=a[2]+n[2],t}function rotateZ$2(t,e,n,i){var r=[],a=[];return r[0]=e[0]-n[0],r[1]=e[1]-n[1],r[2]=e[2]-n[2],a[0]=r[0]*Math.cos(i)-r[1]*Math.sin(i),a[1]=r[0]*Math.sin(i)+r[1]*Math.cos(i),a[2]=r[2],t[0]=a[0]+n[0],t[1]=a[1]+n[1],t[2]=a[2]+n[2],t}function angle$1(t,e){var n=t[0],i=t[1],r=t[2],a=e[0],s=e[1],o=e[2],c=Math.sqrt((n*n+i*i+r*r)*(a*a+s*s+o*o)),l=c&&dot$4(t,e)/c;return Math.acos(Math.min(Math.max(l,-1),1))}function zero$2(t){return t[0]=0,t[1]=0,t[2]=0,t}function str$4(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"}function exactEquals$4(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}function equals$4(t,e){var n=t[0],i=t[1],r=t[2],a=e[0],s=e[1],o=e[2];return Math.abs(n-a)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(a))&&Math.abs(i-s)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(s))&&Math.abs(r-o)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(o))}var sub$2=subtract$2,mul$4=multiply$4,div$2=divide$2,dist$2=distance$2,sqrDist$2=squaredDistance$2,len$4=length$4,sqrLen$4=squaredLength$4,forEach$2=(function(){var t=create$4();return function(e,n,i,r,a,s){var o,c;for(n||(n=3),i||(i=0),r?c=Math.min(r*n+i,e.length):c=e.length,o=i;o<c;o+=n)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],a(t,t,s),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2];return e}})();const vec3$1=Object.freeze(Object.defineProperty({__proto__:null,add:add$4,angle:angle$1,bezier,ceil:ceil$2,clone:clone$4,copy:copy$4,create:create$4,cross:cross$2,dist:dist$2,distance:distance$2,div:div$2,divide:divide$2,dot:dot$4,equals:equals$4,exactEquals:exactEquals$4,floor:floor$2,forEach:forEach$2,fromValues:fromValues$4,hermite,inverse:inverse$2,len:len$4,length:length$4,lerp:lerp$4,max:max$2,min:min$2,mul:mul$4,multiply:multiply$4,negate:negate$2,normalize:normalize$4,random:random$3,rotateX:rotateX$2,rotateY:rotateY$2,rotateZ:rotateZ$2,round:round$2,scale:scale$4,scaleAndAdd:scaleAndAdd$2,set:set$4,slerp:slerp$1,sqrDist:sqrDist$2,sqrLen:sqrLen$4,squaredDistance:squaredDistance$2,squaredLength:squaredLength$4,str:str$4,sub:sub$2,subtract:subtract$2,transformMat3:transformMat3$1,transformMat4:transformMat4$2,transformQuat:transformQuat$1,zero:zero$2},Symbol.toStringTag,{value:"Module"}));function create$3(){var t=new ARRAY_TYPE(4);return ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function clone$3(t){var e=new ARRAY_TYPE(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function fromValues$3(t,e,n,i){var r=new ARRAY_TYPE(4);return r[0]=t,r[1]=e,r[2]=n,r[3]=i,r}function copy$3(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function set$3(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t}function add$3(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t}function subtract$1(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t[3]=e[3]-n[3],t}function multiply$3(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t[3]=e[3]*n[3],t}function divide$1(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t[3]=e[3]/n[3],t}function ceil$1(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t[3]=Math.ceil(e[3]),t}function floor$1(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t[3]=Math.floor(e[3]),t}function min$1(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t[2]=Math.min(e[2],n[2]),t[3]=Math.min(e[3],n[3]),t}function max$1(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t[2]=Math.max(e[2],n[2]),t[3]=Math.max(e[3],n[3]),t}function round$1(t,e){return t[0]=round$3(e[0]),t[1]=round$3(e[1]),t[2]=round$3(e[2]),t[3]=round$3(e[3]),t}function scale$3(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t}function scaleAndAdd$1(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t[2]=e[2]+n[2]*i,t[3]=e[3]+n[3]*i,t}function distance$1(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2],a=e[3]-t[3];return Math.sqrt(n*n+i*i+r*r+a*a)}function squaredDistance$1(t,e){var n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2],a=e[3]-t[3];return n*n+i*i+r*r+a*a}function length$3(t){var e=t[0],n=t[1],i=t[2],r=t[3];return Math.sqrt(e*e+n*n+i*i+r*r)}function squaredLength$3(t){var e=t[0],n=t[1],i=t[2],r=t[3];return e*e+n*n+i*i+r*r}function negate$1(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t}function inverse$1(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t}function normalize$3(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=n*n+i*i+r*r+a*a;return s>0&&(s=1/Math.sqrt(s)),t[0]=n*s,t[1]=i*s,t[2]=r*s,t[3]=a*s,t}function dot$3(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function cross$1(t,e,n,i){var r=n[0]*i[1]-n[1]*i[0],a=n[0]*i[2]-n[2]*i[0],s=n[0]*i[3]-n[3]*i[0],o=n[1]*i[2]-n[2]*i[1],c=n[1]*i[3]-n[3]*i[1],l=n[2]*i[3]-n[3]*i[2],h=e[0],d=e[1],f=e[2],u=e[3];return t[0]=d*l-f*c+u*o,t[1]=-(h*l)+f*s-u*a,t[2]=h*c-d*s+u*r,t[3]=-(h*o)+d*a-f*r,t}function lerp$3(t,e,n,i){var r=e[0],a=e[1],s=e[2],o=e[3];return t[0]=r+i*(n[0]-r),t[1]=a+i*(n[1]-a),t[2]=s+i*(n[2]-s),t[3]=o+i*(n[3]-o),t}function random$2(t,e){e=e===void 0?1:e;var n,i,r,a,s,o,c;c=RANDOM(),n=c*2-1,i=(4*RANDOM()-2)*Math.sqrt(c*-c+c),s=n*n+i*i,c=RANDOM(),r=c*2-1,a=(4*RANDOM()-2)*Math.sqrt(c*-c+c),o=r*r+a*a;var l=Math.sqrt((1-s)/o);return t[0]=e*n,t[1]=e*i,t[2]=e*r*l,t[3]=e*a*l,t}function transformMat4$1(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3];return t[0]=n[0]*i+n[4]*r+n[8]*a+n[12]*s,t[1]=n[1]*i+n[5]*r+n[9]*a+n[13]*s,t[2]=n[2]*i+n[6]*r+n[10]*a+n[14]*s,t[3]=n[3]*i+n[7]*r+n[11]*a+n[15]*s,t}function transformQuat(t,e,n){var i=n[0],r=n[1],a=n[2],s=n[3],o=e[0],c=e[1],l=e[2],h=r*l-a*c,d=a*o-i*l,f=i*c-r*o;return h=h+h,d=d+d,f=f+f,t[0]=o+s*h+r*f-a*d,t[1]=c+s*d+a*h-i*f,t[2]=l+s*f+i*d-r*h,t[3]=e[3],t}function zero$1(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function str$3(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function exactEquals$3(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function equals$3(t,e){var n=t[0],i=t[1],r=t[2],a=t[3],s=e[0],o=e[1],c=e[2],l=e[3];return Math.abs(n-s)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(i-o)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(o))&&Math.abs(r-c)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(a-l)<=EPSILON*Math.max(1,Math.abs(a),Math.abs(l))}var sub$1=subtract$1,mul$3=multiply$3,div$1=divide$1,dist$1=distance$1,sqrDist$1=squaredDistance$1,len$3=length$3,sqrLen$3=squaredLength$3,forEach$1=(function(){var t=create$3();return function(e,n,i,r,a,s){var o,c;for(n||(n=4),i||(i=0),r?c=Math.min(r*n+i,e.length):c=e.length,o=i;o<c;o+=n)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],t[3]=e[o+3],a(t,t,s),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2],e[o+3]=t[3];return e}})();const vec4=Object.freeze(Object.defineProperty({__proto__:null,add:add$3,ceil:ceil$1,clone:clone$3,copy:copy$3,create:create$3,cross:cross$1,dist:dist$1,distance:distance$1,div:div$1,divide:divide$1,dot:dot$3,equals:equals$3,exactEquals:exactEquals$3,floor:floor$1,forEach:forEach$1,fromValues:fromValues$3,inverse:inverse$1,len:len$3,length:length$3,lerp:lerp$3,max:max$1,min:min$1,mul:mul$3,multiply:multiply$3,negate:negate$1,normalize:normalize$3,random:random$2,round:round$1,scale:scale$3,scaleAndAdd:scaleAndAdd$1,set:set$3,sqrDist:sqrDist$1,sqrLen:sqrLen$3,squaredDistance:squaredDistance$1,squaredLength:squaredLength$3,str:str$3,sub:sub$1,subtract:subtract$1,transformMat4:transformMat4$1,transformQuat,zero:zero$1},Symbol.toStringTag,{value:"Module"}));function create$2(){var t=new ARRAY_TYPE(4);return ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function identity$1(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function setAxisAngle(t,e,n){n=n*.5;var i=Math.sin(n);return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=Math.cos(n),t}function getAxisAngle(t,e){var n=Math.acos(e[3])*2,i=Math.sin(n/2);return i>EPSILON?(t[0]=e[0]/i,t[1]=e[1]/i,t[2]=e[2]/i):(t[0]=1,t[1]=0,t[2]=0),n}function getAngle(t,e){var n=dot$2(t,e);return Math.acos(2*n*n-1)}function multiply$2(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=n[0],c=n[1],l=n[2],h=n[3];return t[0]=i*h+s*o+r*l-a*c,t[1]=r*h+s*c+a*o-i*l,t[2]=a*h+s*l+i*c-r*o,t[3]=s*h-i*o-r*c-a*l,t}function rotateX$1(t,e,n){n*=.5;var i=e[0],r=e[1],a=e[2],s=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c+s*o,t[1]=r*c+a*o,t[2]=a*c-r*o,t[3]=s*c-i*o,t}function rotateY$1(t,e,n){n*=.5;var i=e[0],r=e[1],a=e[2],s=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c-a*o,t[1]=r*c+s*o,t[2]=a*c+i*o,t[3]=s*c-r*o,t}function rotateZ$1(t,e,n){n*=.5;var i=e[0],r=e[1],a=e[2],s=e[3],o=Math.sin(n),c=Math.cos(n);return t[0]=i*c+r*o,t[1]=r*c-i*o,t[2]=a*c+s*o,t[3]=s*c-a*o,t}function calculateW(t,e){var n=e[0],i=e[1],r=e[2];return t[0]=n,t[1]=i,t[2]=r,t[3]=Math.sqrt(Math.abs(1-n*n-i*i-r*r)),t}function exp(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=Math.sqrt(n*n+i*i+r*r),o=Math.exp(a),c=s>0?o*Math.sin(s)/s:0;return t[0]=n*c,t[1]=i*c,t[2]=r*c,t[3]=o*Math.cos(s),t}function ln(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=Math.sqrt(n*n+i*i+r*r),o=s>0?Math.atan2(s,a)/s:0;return t[0]=n*o,t[1]=i*o,t[2]=r*o,t[3]=.5*Math.log(n*n+i*i+r*r+a*a),t}function pow(t,e,n){return ln(t,e),scale$2(t,t,n),exp(t,t),t}function slerp(t,e,n,i){var r=e[0],a=e[1],s=e[2],o=e[3],c=n[0],l=n[1],h=n[2],d=n[3],f,u,_,g,m;return u=r*c+a*l+s*h+o*d,u<0&&(u=-u,c=-c,l=-l,h=-h,d=-d),1-u>EPSILON?(f=Math.acos(u),_=Math.sin(f),g=Math.sin((1-i)*f)/_,m=Math.sin(i*f)/_):(g=1-i,m=i),t[0]=g*r+m*c,t[1]=g*a+m*l,t[2]=g*s+m*h,t[3]=g*o+m*d,t}function random$1(t){var e=RANDOM(),n=RANDOM(),i=RANDOM(),r=Math.sqrt(1-e),a=Math.sqrt(e);return t[0]=r*Math.sin(2*Math.PI*n),t[1]=r*Math.cos(2*Math.PI*n),t[2]=a*Math.sin(2*Math.PI*i),t[3]=a*Math.cos(2*Math.PI*i),t}function invert$1(t,e){var n=e[0],i=e[1],r=e[2],a=e[3],s=n*n+i*i+r*r+a*a,o=s?1/s:0;return t[0]=-n*o,t[1]=-i*o,t[2]=-r*o,t[3]=a*o,t}function conjugate$1(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t}function fromMat3(t,e){var n=e[0]+e[4]+e[8],i;if(n>0)i=Math.sqrt(n+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{var r=0;e[4]>e[0]&&(r=1),e[8]>e[r*3+r]&&(r=2);var a=(r+1)%3,s=(r+2)%3;i=Math.sqrt(e[r*3+r]-e[a*3+a]-e[s*3+s]+1),t[r]=.5*i,i=.5/i,t[3]=(e[a*3+s]-e[s*3+a])*i,t[a]=(e[a*3+r]+e[r*3+a])*i,t[s]=(e[s*3+r]+e[r*3+s])*i}return t}function fromEuler(t,e,n,i){var r=arguments.length>4&&arguments[4]!==void 0?arguments[4]:ANGLE_ORDER,a=Math.PI/360;e*=a,i*=a,n*=a;var s=Math.sin(e),o=Math.cos(e),c=Math.sin(n),l=Math.cos(n),h=Math.sin(i),d=Math.cos(i);switch(r){case"xyz":t[0]=s*l*d+o*c*h,t[1]=o*c*d-s*l*h,t[2]=o*l*h+s*c*d,t[3]=o*l*d-s*c*h;break;case"xzy":t[0]=s*l*d-o*c*h,t[1]=o*c*d-s*l*h,t[2]=o*l*h+s*c*d,t[3]=o*l*d+s*c*h;break;case"yxz":t[0]=s*l*d+o*c*h,t[1]=o*c*d-s*l*h,t[2]=o*l*h-s*c*d,t[3]=o*l*d+s*c*h;break;case"yzx":t[0]=s*l*d+o*c*h,t[1]=o*c*d+s*l*h,t[2]=o*l*h-s*c*d,t[3]=o*l*d-s*c*h;break;case"zxy":t[0]=s*l*d-o*c*h,t[1]=o*c*d+s*l*h,t[2]=o*l*h+s*c*d,t[3]=o*l*d-s*c*h;break;case"zyx":t[0]=s*l*d-o*c*h,t[1]=o*c*d+s*l*h,t[2]=o*l*h-s*c*d,t[3]=o*l*d+s*c*h;break;default:throw new Error("Unknown angle order "+r)}return t}function str$2(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}var clone$2=clone$3,fromValues$2=fromValues$3,copy$2=copy$3,set$2=set$3,add$2=add$3,mul$2=multiply$2,scale$2=scale$3,dot$2=dot$3,lerp$2=lerp$3,length$2=length$3,len$2=length$2,squaredLength$2=squaredLength$3,sqrLen$2=squaredLength$2,normalize$2=normalize$3,exactEquals$2=exactEquals$3;function equals$2(t,e){return Math.abs(dot$3(t,e))>=1-EPSILON}var rotationTo=(function(){var t=create$4(),e=fromValues$4(1,0,0),n=fromValues$4(0,1,0);return function(i,r,a){var s=dot$4(r,a);return s<-.999999?(cross$2(t,e,r),len$4(t)<1e-6&&cross$2(t,n,r),normalize$4(t,t),setAxisAngle(i,t,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(cross$2(t,r,a),i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=1+s,normalize$2(i,i))}})(),sqlerp=(function(){var t=create$2(),e=create$2();return function(n,i,r,a,s,o){return slerp(t,i,s,o),slerp(e,r,a,o),slerp(n,t,e,2*o*(1-o)),n}})(),setAxes=(function(){var t=create$6();return function(e,n,i,r){return t[0]=i[0],t[3]=i[1],t[6]=i[2],t[1]=r[0],t[4]=r[1],t[7]=r[2],t[2]=-n[0],t[5]=-n[1],t[8]=-n[2],normalize$2(e,fromMat3(e,t))}})();const quat=Object.freeze(Object.defineProperty({__proto__:null,add:add$2,calculateW,clone:clone$2,conjugate:conjugate$1,copy:copy$2,create:create$2,dot:dot$2,equals:equals$2,exactEquals:exactEquals$2,exp,fromEuler,fromMat3,fromValues:fromValues$2,getAngle,getAxisAngle,identity:identity$1,invert:invert$1,len:len$2,length:length$2,lerp:lerp$2,ln,mul:mul$2,multiply:multiply$2,normalize:normalize$2,pow,random:random$1,rotateX:rotateX$1,rotateY:rotateY$1,rotateZ:rotateZ$1,rotationTo,scale:scale$2,set:set$2,setAxes,setAxisAngle,slerp,sqlerp,sqrLen:sqrLen$2,squaredLength:squaredLength$2,str:str$2},Symbol.toStringTag,{value:"Module"}));function create$1(){var t=new ARRAY_TYPE(8);return ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0),t[3]=1,t}function clone$1(t){var e=new ARRAY_TYPE(8);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e}function fromValues$1(t,e,n,i,r,a,s,o){var c=new ARRAY_TYPE(8);return c[0]=t,c[1]=e,c[2]=n,c[3]=i,c[4]=r,c[5]=a,c[6]=s,c[7]=o,c}function fromRotationTranslationValues(t,e,n,i,r,a,s){var o=new ARRAY_TYPE(8);o[0]=t,o[1]=e,o[2]=n,o[3]=i;var c=r*.5,l=a*.5,h=s*.5;return o[4]=c*i+l*n-h*e,o[5]=l*i+h*t-c*n,o[6]=h*i+c*e-l*t,o[7]=-c*t-l*e-h*n,o}function fromRotationTranslation(t,e,n){var i=n[0]*.5,r=n[1]*.5,a=n[2]*.5,s=e[0],o=e[1],c=e[2],l=e[3];return t[0]=s,t[1]=o,t[2]=c,t[3]=l,t[4]=i*l+r*c-a*o,t[5]=r*l+a*s-i*c,t[6]=a*l+i*o-r*s,t[7]=-i*s-r*o-a*c,t}function fromTranslation(t,e){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=e[0]*.5,t[5]=e[1]*.5,t[6]=e[2]*.5,t[7]=0,t}function fromRotation(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=0,t[5]=0,t[6]=0,t[7]=0,t}function fromMat4(t,e){var n=create$2();getRotation(n,e);var i=new ARRAY_TYPE(3);return getTranslation$1(i,e),fromRotationTranslation(t,n,i),t}function copy$1(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t}function identity(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t}function set$1(t,e,n,i,r,a,s,o,c){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=a,t[5]=s,t[6]=o,t[7]=c,t}var getReal=copy$2;function getDual(t,e){return t[0]=e[4],t[1]=e[5],t[2]=e[6],t[3]=e[7],t}var setReal=copy$2;function setDual(t,e){return t[4]=e[0],t[5]=e[1],t[6]=e[2],t[7]=e[3],t}function getTranslation(t,e){var n=e[4],i=e[5],r=e[6],a=e[7],s=-e[0],o=-e[1],c=-e[2],l=e[3];return t[0]=(n*l+a*s+i*c-r*o)*2,t[1]=(i*l+a*o+r*s-n*c)*2,t[2]=(r*l+a*c+n*o-i*s)*2,t}function translate(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=n[0]*.5,c=n[1]*.5,l=n[2]*.5,h=e[4],d=e[5],f=e[6],u=e[7];return t[0]=i,t[1]=r,t[2]=a,t[3]=s,t[4]=s*o+r*l-a*c+h,t[5]=s*c+a*o-i*l+d,t[6]=s*l+i*c-r*o+f,t[7]=-i*o-r*c-a*l+u,t}function rotateX(t,e,n){var i=-e[0],r=-e[1],a=-e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=o*s+h*i+c*a-l*r,f=c*s+h*r+l*i-o*a,u=l*s+h*a+o*r-c*i,_=h*s-o*i-c*r-l*a;return rotateX$1(t,e,n),i=t[0],r=t[1],a=t[2],s=t[3],t[4]=d*s+_*i+f*a-u*r,t[5]=f*s+_*r+u*i-d*a,t[6]=u*s+_*a+d*r-f*i,t[7]=_*s-d*i-f*r-u*a,t}function rotateY(t,e,n){var i=-e[0],r=-e[1],a=-e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=o*s+h*i+c*a-l*r,f=c*s+h*r+l*i-o*a,u=l*s+h*a+o*r-c*i,_=h*s-o*i-c*r-l*a;return rotateY$1(t,e,n),i=t[0],r=t[1],a=t[2],s=t[3],t[4]=d*s+_*i+f*a-u*r,t[5]=f*s+_*r+u*i-d*a,t[6]=u*s+_*a+d*r-f*i,t[7]=_*s-d*i-f*r-u*a,t}function rotateZ(t,e,n){var i=-e[0],r=-e[1],a=-e[2],s=e[3],o=e[4],c=e[5],l=e[6],h=e[7],d=o*s+h*i+c*a-l*r,f=c*s+h*r+l*i-o*a,u=l*s+h*a+o*r-c*i,_=h*s-o*i-c*r-l*a;return rotateZ$1(t,e,n),i=t[0],r=t[1],a=t[2],s=t[3],t[4]=d*s+_*i+f*a-u*r,t[5]=f*s+_*r+u*i-d*a,t[6]=u*s+_*a+d*r-f*i,t[7]=_*s-d*i-f*r-u*a,t}function rotateByQuatAppend(t,e,n){var i=n[0],r=n[1],a=n[2],s=n[3],o=e[0],c=e[1],l=e[2],h=e[3];return t[0]=o*s+h*i+c*a-l*r,t[1]=c*s+h*r+l*i-o*a,t[2]=l*s+h*a+o*r-c*i,t[3]=h*s-o*i-c*r-l*a,o=e[4],c=e[5],l=e[6],h=e[7],t[4]=o*s+h*i+c*a-l*r,t[5]=c*s+h*r+l*i-o*a,t[6]=l*s+h*a+o*r-c*i,t[7]=h*s-o*i-c*r-l*a,t}function rotateByQuatPrepend(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=n[0],c=n[1],l=n[2],h=n[3];return t[0]=i*h+s*o+r*l-a*c,t[1]=r*h+s*c+a*o-i*l,t[2]=a*h+s*l+i*c-r*o,t[3]=s*h-i*o-r*c-a*l,o=n[4],c=n[5],l=n[6],h=n[7],t[4]=i*h+s*o+r*l-a*c,t[5]=r*h+s*c+a*o-i*l,t[6]=a*h+s*l+i*c-r*o,t[7]=s*h-i*o-r*c-a*l,t}function rotateAroundAxis(t,e,n,i){if(Math.abs(i)<EPSILON)return copy$1(t,e);var r=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);i=i*.5;var a=Math.sin(i),s=a*n[0]/r,o=a*n[1]/r,c=a*n[2]/r,l=Math.cos(i),h=e[0],d=e[1],f=e[2],u=e[3];t[0]=h*l+u*s+d*c-f*o,t[1]=d*l+u*o+f*s-h*c,t[2]=f*l+u*c+h*o-d*s,t[3]=u*l-h*s-d*o-f*c;var _=e[4],g=e[5],m=e[6],p=e[7];return t[4]=_*l+p*s+g*c-m*o,t[5]=g*l+p*o+m*s-_*c,t[6]=m*l+p*c+_*o-g*s,t[7]=p*l-_*s-g*o-m*c,t}function add$1(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t[3]=e[3]+n[3],t[4]=e[4]+n[4],t[5]=e[5]+n[5],t[6]=e[6]+n[6],t[7]=e[7]+n[7],t}function multiply$1(t,e,n){var i=e[0],r=e[1],a=e[2],s=e[3],o=n[4],c=n[5],l=n[6],h=n[7],d=e[4],f=e[5],u=e[6],_=e[7],g=n[0],m=n[1],p=n[2],T=n[3];return t[0]=i*T+s*g+r*p-a*m,t[1]=r*T+s*m+a*g-i*p,t[2]=a*T+s*p+i*m-r*g,t[3]=s*T-i*g-r*m-a*p,t[4]=i*h+s*o+r*l-a*c+d*T+_*g+f*p-u*m,t[5]=r*h+s*c+a*o-i*l+f*T+_*m+u*g-d*p,t[6]=a*h+s*l+i*c-r*o+u*T+_*p+d*m-f*g,t[7]=s*h-i*o-r*c-a*l+_*T-d*g-f*m-u*p,t}var mul$1=multiply$1;function scale$1(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t}var dot$1=dot$2;function lerp$1(t,e,n,i){var r=1-i;return dot$1(e,n)<0&&(i=-i),t[0]=e[0]*r+n[0]*i,t[1]=e[1]*r+n[1]*i,t[2]=e[2]*r+n[2]*i,t[3]=e[3]*r+n[3]*i,t[4]=e[4]*r+n[4]*i,t[5]=e[5]*r+n[5]*i,t[6]=e[6]*r+n[6]*i,t[7]=e[7]*r+n[7]*i,t}function invert(t,e){var n=squaredLength$1(e);return t[0]=-e[0]/n,t[1]=-e[1]/n,t[2]=-e[2]/n,t[3]=e[3]/n,t[4]=-e[4]/n,t[5]=-e[5]/n,t[6]=-e[6]/n,t[7]=e[7]/n,t}function conjugate(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t[4]=-e[4],t[5]=-e[5],t[6]=-e[6],t[7]=e[7],t}var length$1=length$2,len$1=length$1,squaredLength$1=squaredLength$2,sqrLen$1=squaredLength$1;function normalize$1(t,e){var n=squaredLength$1(e);if(n>0){n=Math.sqrt(n);var i=e[0]/n,r=e[1]/n,a=e[2]/n,s=e[3]/n,o=e[4],c=e[5],l=e[6],h=e[7],d=i*o+r*c+a*l+s*h;t[0]=i,t[1]=r,t[2]=a,t[3]=s,t[4]=(o-i*d)/n,t[5]=(c-r*d)/n,t[6]=(l-a*d)/n,t[7]=(h-s*d)/n}return t}function str$1(t){return"quat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+")"}function exactEquals$1(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]}function equals$1(t,e){var n=t[0],i=t[1],r=t[2],a=t[3],s=t[4],o=t[5],c=t[6],l=t[7],h=e[0],d=e[1],f=e[2],u=e[3],_=e[4],g=e[5],m=e[6],p=e[7];return Math.abs(n-h)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(h))&&Math.abs(i-d)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(d))&&Math.abs(r-f)<=EPSILON*Math.max(1,Math.abs(r),Math.abs(f))&&Math.abs(a-u)<=EPSILON*Math.max(1,Math.abs(a),Math.abs(u))&&Math.abs(s-_)<=EPSILON*Math.max(1,Math.abs(s),Math.abs(_))&&Math.abs(o-g)<=EPSILON*Math.max(1,Math.abs(o),Math.abs(g))&&Math.abs(c-m)<=EPSILON*Math.max(1,Math.abs(c),Math.abs(m))&&Math.abs(l-p)<=EPSILON*Math.max(1,Math.abs(l),Math.abs(p))}const quat2=Object.freeze(Object.defineProperty({__proto__:null,add:add$1,clone:clone$1,conjugate,copy:copy$1,create:create$1,dot:dot$1,equals:equals$1,exactEquals:exactEquals$1,fromMat4,fromRotation,fromRotationTranslation,fromRotationTranslationValues,fromTranslation,fromValues:fromValues$1,getDual,getReal,getTranslation,identity,invert,len:len$1,length:length$1,lerp:lerp$1,mul:mul$1,multiply:multiply$1,normalize:normalize$1,rotateAroundAxis,rotateByQuatAppend,rotateByQuatPrepend,rotateX,rotateY,rotateZ,scale:scale$1,set:set$1,setDual,setReal,sqrLen:sqrLen$1,squaredLength:squaredLength$1,str:str$1,translate},Symbol.toStringTag,{value:"Module"}));function create(){var t=new ARRAY_TYPE(2);return ARRAY_TYPE!=Float32Array&&(t[0]=0,t[1]=0),t}function clone(t){var e=new ARRAY_TYPE(2);return e[0]=t[0],e[1]=t[1],e}function fromValues(t,e){var n=new ARRAY_TYPE(2);return n[0]=t,n[1]=e,n}function copy(t,e){return t[0]=e[0],t[1]=e[1],t}function set(t,e,n){return t[0]=e,t[1]=n,t}function add(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}function subtract(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t}function multiply(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t}function divide(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t}function ceil(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t}function floor(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t}function min(t,e,n){return t[0]=Math.min(e[0],n[0]),t[1]=Math.min(e[1],n[1]),t}function max(t,e,n){return t[0]=Math.max(e[0],n[0]),t[1]=Math.max(e[1],n[1]),t}function round(t,e){return t[0]=round$3(e[0]),t[1]=round$3(e[1]),t}function scale(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t}function scaleAndAdd(t,e,n,i){return t[0]=e[0]+n[0]*i,t[1]=e[1]+n[1]*i,t}function distance(t,e){var n=e[0]-t[0],i=e[1]-t[1];return Math.sqrt(n*n+i*i)}function squaredDistance(t,e){var n=e[0]-t[0],i=e[1]-t[1];return n*n+i*i}function length(t){var e=t[0],n=t[1];return Math.sqrt(e*e+n*n)}function squaredLength(t){var e=t[0],n=t[1];return e*e+n*n}function negate(t,e){return t[0]=-e[0],t[1]=-e[1],t}function inverse(t,e){return t[0]=1/e[0],t[1]=1/e[1],t}function normalize(t,e){var n=e[0],i=e[1],r=n*n+i*i;return r>0&&(r=1/Math.sqrt(r)),t[0]=e[0]*r,t[1]=e[1]*r,t}function dot(t,e){return t[0]*e[0]+t[1]*e[1]}function cross(t,e,n){var i=e[0]*n[1]-e[1]*n[0];return t[0]=t[1]=0,t[2]=i,t}function lerp(t,e,n,i){var r=e[0],a=e[1];return t[0]=r+i*(n[0]-r),t[1]=a+i*(n[1]-a),t}function random(t,e){e=e===void 0?1:e;var n=RANDOM()*2*Math.PI;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t}function transformMat2(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r,t[1]=n[1]*i+n[3]*r,t}function transformMat2d(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[2]*r+n[4],t[1]=n[1]*i+n[3]*r+n[5],t}function transformMat3(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[3]*r+n[6],t[1]=n[1]*i+n[4]*r+n[7],t}function transformMat4(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[4]*r+n[12],t[1]=n[1]*i+n[5]*r+n[13],t}function rotate(t,e,n,i){var r=e[0]-n[0],a=e[1]-n[1],s=Math.sin(i),o=Math.cos(i);return t[0]=r*o-a*s+n[0],t[1]=r*s+a*o+n[1],t}function angle(t,e){var n=t[0],i=t[1],r=e[0],a=e[1];return Math.abs(Math.atan2(i*r-n*a,n*r+i*a))}function signedAngle(t,e){var n=t[0],i=t[1],r=e[0],a=e[1];return Math.atan2(n*a-i*r,n*r+i*a)}function zero(t){return t[0]=0,t[1]=0,t}function str(t){return"vec2("+t[0]+", "+t[1]+")"}function exactEquals(t,e){return t[0]===e[0]&&t[1]===e[1]}function equals(t,e){var n=t[0],i=t[1],r=e[0],a=e[1];return Math.abs(n-r)<=EPSILON*Math.max(1,Math.abs(n),Math.abs(r))&&Math.abs(i-a)<=EPSILON*Math.max(1,Math.abs(i),Math.abs(a))}var len=length,sub=subtract,mul=multiply,div=divide,dist=distance,sqrDist=squaredDistance,sqrLen=squaredLength,forEach=(function(){var t=create();return function(e,n,i,r,a,s){var o,c;for(n||(n=2),i||(i=0),r?c=Math.min(r*n+i,e.length):c=e.length,o=i;o<c;o+=n)t[0]=e[o],t[1]=e[o+1],a(t,t,s),e[o]=t[0],e[o+1]=t[1];return e}})();const vec2=Object.freeze(Object.defineProperty({__proto__:null,add,angle,ceil,clone,copy,create,cross,dist,distance,div,divide,dot,equals,exactEquals,floor,forEach,fromValues,inverse,len,length,lerp,max,min,mul,multiply,negate,normalize,random,rotate,round,scale,scaleAndAdd,set,signedAngle,sqrDist,sqrLen,squaredDistance,squaredLength,str,sub,subtract,transformMat2,transformMat2d,transformMat3,transformMat4,zero},Symbol.toStringTag,{value:"Module"})),glMatrix=Object.freeze(Object.defineProperty({__proto__:null,glMatrix:common,mat2,mat2d,mat3,mat4,quat,quat2,vec2,vec3:vec3$1,vec4},Symbol.toStringTag,{value:"Module"})),{vec3}=glMatrix,DEFAULT_OPTIONS={simulationBound:100,cohesionValue:1,repulsionValue:1,centerPull:.1,iterationsPerStep:1};function createKamadaKawai3D(t,e={}){const n={...DEFAULT_OPTIONS,...e},i=t.get_node_ids_order(),r=i.length,a=t.get_adjacency(),s=new Map;i.forEach((f,u)=>s.set(f,u));const o=new Float32Array(r*3);for(let f=0;f<r;f++)o[f*3]=Math.random()*n.simulationBound,o[f*3+1]=Math.random()*n.simulationBound,o[f*3+2]=Math.random()*n.simulationBound;const c={force:vec3.create(),diff:vec3.create(),neighborAvg:vec3.create(),posI:vec3.create(),posJ:vec3.create()};function l(f){const u=Math.max(1,n.iterationsPerStep);for(let _=0;_<u;_++)for(let g=0;g<r;g++){vec3.set(c.posI,o[g*3],o[g*3+1],o[g*3+2]),vec3.set(c.force,0,0,0);const m=a.get(i[g])??[];if(m.length>0){c.neighborAvg[0]=0,c.neighborAvg[1]=0,c.neighborAvg[2]=0;for(const p of m){const T=s.get(p);T!==void 0&&(c.neighborAvg[0]+=o[T*3],c.neighborAvg[1]+=o[T*3+1],c.neighborAvg[2]+=o[T*3+2])}c.neighborAvg[0]/=m.length,c.neighborAvg[1]/=m.length,c.neighborAvg[2]/=m.length,vec3.subtract(c.diff,c.neighborAvg,c.posI),vec3.scale(c.diff,c.diff,n.cohesionValue),vec3.add(c.force,c.force,c.diff)}for(let p=0;p<r;p++){if(p===g)continue;vec3.set(c.posJ,o[p*3],o[p*3+1],o[p*3+2]),vec3.subtract(c.diff,c.posJ,c.posI);const T=vec3.squaredLength(c.diff);T<1e-10||(vec3.scale(c.diff,c.diff,n.repulsionValue/T),vec3.subtract(c.force,c.force,c.diff))}c.force[0]-=n.centerPull*c.posI[0],c.force[1]-=n.centerPull*c.posI[1],c.force[2]-=n.centerPull*c.posI[2],o[g*3]+=c.force[0],o[g*3+1]+=c.force[1],o[g*3+2]+=c.force[2]}}function h(){return o}function d(){const f=new Map;for(let u=0;u<r;u++)f.set(i[u],new Point(o[u*3],o[u*3+1],o[u*3+2]));return f}return{step:l,getPositions:h,getPositionMap:d}}exports.Constructors=GraphConstructors;exports.Drawing=Drawing;exports.Geometry=GeometryHelpers;exports.Graph=Graph;exports.GraphDrawer=GraphDrawer;exports.GraphMethods=GraphMethods;exports.Hierarchy=index;exports.Models=ErdosRenyiModel;exports.SampleData=DataLoader;exports.ThreeWrapper=ThreeJSDrawer;exports.Utilities=Utilities;exports.createKamadaKawai3D=createKamadaKawai3D;exports.glMatrix=glMatrix;exports.matrixVectorMultiply=matrixVectorMultiply;exports.normalizeVector=normalizeVector;
//# sourceMappingURL=pgl.js.map
