import{D as B,s as C,g as S,n as D,o as T,b as E,c as F,_ as u,E as m,F as P,v as z,l as w,I as A,k as W}from"./mermaid.core-BG9tycmz.js";import{p as _}from"./chunk-4BX2VUAB-DItaIKqJ.js";import{p as N}from"./wardley-RL74JXVD-DGS9-ij3.js";import"./index-CFjuIQBf.js";import"./min-ieLz85f6.js";import"./_baseUniq-BrkKwOJs.js";var I=B.packet,b,x=(b=class{constructor(){this.packet=[],this.setAccTitle=C,this.getAccTitle=S,this.setDiagramTitle=D,this.getDiagramTitle=T,this.getAccDescription=E,this.setAccDescription=F}getConfig(){const t=m({...I,...P().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){z(),this.packet=[]}},u(b,"PacketDB"),b),L=1e4,M=u((e,t)=>{_(e,t);let s=-1,r=[],n=1;const{bitsPerRow:l}=t.getConfig();for(let{start:a,end:i,bits:d,label:c}of e.blocks){if(a!==void 0&&i!==void 0&&i<a)throw new Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a??(a=s+1),a!==s+1)throw new Error(`Packet block ${a} - ${i??a} is not contiguous. It should start from ${s+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i??(i=a+(d??1)-1),d??(d=i-a+1),s=i,w.debug(`Packet block ${a} - ${s} with label ${c}`);r.length<=l+1&&t.getPacket().length<L;){const[p,o]=Y({start:a,end:i,bits:d,label:c},n,l);if(r.push(p),p.end+1===n*l&&(t.pushWord(r),r=[],n++),!o)break;({start:a,end:i,bits:d,label:c}=o)}}t.pushWord(r)},"populate"),Y=u((e,t,s)=>{if(e.start===void 0)throw new Error("start should have been set during first phase");if(e.end===void 0)throw new Error("end should have been set during first phase");if(e.start>e.end)throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*s)return[e,void 0];const r=t*s-1,n=t*s;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:n,end:e.end,label:e.label,bits:e.end-n}]},"getNextFittingBlock"),y={parser:{yy:void 0},parse:u(async e=>{var r;const t=await N("packet",e),s=(r=y.parser)==null?void 0:r.yy;if(!(s instanceof x))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(t),M(t,s)},"parse")},O=u((e,t,s,r)=>{const n=r.db,l=n.getConfig(),{rowHeight:a,paddingY:i,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),o=n.getDiagramTitle(),h=a+i,g=h*(p.length+1)-(o?0:a),f=d*c+2,k=A(t);k.attr("viewBox",`0 0 ${f} ${g}`),W(k,g,f,l.useMaxWidth);for(const[v,$]of p.entries())j(k,$,v,l);k.append("text").text(o).attr("x",f/2).attr("y",g-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),j=u((e,t,s,{rowHeight:r,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:i,showBits:d})=>{const c=e.append("g"),p=s*(r+l)+l;for(const o of t){const h=o.start%i*a+1,g=(o.end-o.start+1)*a-n;if(c.append("rect").attr("x",h).attr("y",p).attr("width",g).attr("height",r).attr("class","packetBlock"),c.append("text").attr("x",h+g/2).attr("y",p+r/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(o.label),!d)continue;const f=o.end===o.start,k=p-2;c.append("text").attr("x",h+(f?g/2:0)).attr("y",k).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",f?"middle":"start").text(o.start),f||c.append("text").attr("x",h+g).attr("y",k).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(o.end)}},"drawWord"),G={draw:O},H={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},K=u(({packet:e}={})=>{const t=m(H,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},"styles"),V={parser:y,get db(){return new x},renderer:G,styles:K};export{V as diagram};
