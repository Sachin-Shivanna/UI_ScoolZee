"use strict";(self.webpackChunkscoolzee=self.webpackChunkscoolzee||[]).push([[5892],{5892:function(e,t,n){n.d(t,{Z:function(){return Be}});var r=n(7462),o=n(885),i=n(3366),a=n(7563),s=n(5721),f=n(9723);function c(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function p(e){return e instanceof c(e).Element||e instanceof Element}function u(e){return e instanceof c(e).HTMLElement||e instanceof HTMLElement}function l(e){return"undefined"!==typeof ShadowRoot&&(e instanceof c(e).ShadowRoot||e instanceof ShadowRoot)}var d=Math.max,m=Math.min,h=Math.round;function v(e,t){void 0===t&&(t=!1);var n=e.getBoundingClientRect(),r=1,o=1;if(u(e)&&t){var i=e.offsetHeight,a=e.offsetWidth;a>0&&(r=h(n.width)/a||1),i>0&&(o=h(n.height)/i||1)}return{width:n.width/r,height:n.height/o,top:n.top/o,right:n.right/r,bottom:n.bottom/o,left:n.left/r,x:n.left/r,y:n.top/o}}function y(e){var t=c(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function g(e){return e?(e.nodeName||"").toLowerCase():null}function b(e){return((p(e)?e.ownerDocument:e.document)||window.document).documentElement}function w(e){return v(b(e)).left+y(e).scrollLeft}function x(e){return c(e).getComputedStyle(e)}function O(e){var t=x(e),n=t.overflow,r=t.overflowX,o=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+o+r)}function E(e,t,n){void 0===n&&(n=!1);var r=u(t),o=u(t)&&function(e){var t=e.getBoundingClientRect(),n=h(t.width)/e.offsetWidth||1,r=h(t.height)/e.offsetHeight||1;return 1!==n||1!==r}(t),i=b(t),a=v(e,o),s={scrollLeft:0,scrollTop:0},f={x:0,y:0};return(r||!r&&!n)&&(("body"!==g(t)||O(i))&&(s=function(e){return e!==c(e)&&u(e)?{scrollLeft:(t=e).scrollLeft,scrollTop:t.scrollTop}:y(e);var t}(t)),u(t)?((f=v(t,!0)).x+=t.clientLeft,f.y+=t.clientTop):i&&(f.x=w(i))),{x:a.left+s.scrollLeft-f.x,y:a.top+s.scrollTop-f.y,width:a.width,height:a.height}}function j(e){var t=v(e),n=e.offsetWidth,r=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-r)<=1&&(r=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:r}}function P(e){return"html"===g(e)?e:e.assignedSlot||e.parentNode||(l(e)?e.host:null)||b(e)}function D(e){return["html","body","#document"].indexOf(g(e))>=0?e.ownerDocument.body:u(e)&&O(e)?e:D(P(e))}function R(e,t){var n;void 0===t&&(t=[]);var r=D(e),o=r===(null==(n=e.ownerDocument)?void 0:n.body),i=c(r),a=o?[i].concat(i.visualViewport||[],O(r)?r:[]):r,s=t.concat(a);return o?s:s.concat(R(P(a)))}function k(e){return["table","td","th"].indexOf(g(e))>=0}function A(e){return u(e)&&"fixed"!==x(e).position?e.offsetParent:null}function M(e){for(var t=c(e),n=A(e);n&&k(n)&&"static"===x(n).position;)n=A(n);return n&&("html"===g(n)||"body"===g(n)&&"static"===x(n).position)?t:n||function(e){var t=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");if(-1!==navigator.userAgent.indexOf("Trident")&&u(e)&&"fixed"===x(e).position)return null;var n=P(e);for(l(n)&&(n=n.host);u(n)&&["html","body"].indexOf(g(n))<0;){var r=x(n);if("none"!==r.transform||"none"!==r.perspective||"paint"===r.contain||-1!==["transform","perspective"].indexOf(r.willChange)||t&&"filter"===r.willChange||t&&r.filter&&"none"!==r.filter)return n;n=n.parentNode}return null}(e)||t}var L="top",W="bottom",B="right",Z="left",T="auto",H=[L,W,B,Z],S="start",C="end",q="viewport",V="popper",N=H.reduce((function(e,t){return e.concat([t+"-"+S,t+"-"+C])}),[]),I=[].concat(H,[T]).reduce((function(e,t){return e.concat([t,t+"-"+S,t+"-"+C])}),[]),U=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function z(e){var t=new Map,n=new Set,r=[];function o(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!n.has(e)){var r=t.get(e);r&&o(r)}})),r.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||o(e)})),r}function F(e){var t;return function(){return t||(t=new Promise((function(n){Promise.resolve().then((function(){t=void 0,n(e())}))}))),t}}var _={placement:"bottom",modifiers:[],strategy:"absolute"};function X(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"===typeof e.getBoundingClientRect)}))}function Y(e){void 0===e&&(e={});var t=e,n=t.defaultModifiers,r=void 0===n?[]:n,o=t.defaultOptions,i=void 0===o?_:o;return function(e,t,n){void 0===n&&(n=i);var o={placement:"bottom",orderedModifiers:[],options:Object.assign({},_,i),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},a=[],s=!1,f={state:o,setOptions:function(n){var s="function"===typeof n?n(o.options):n;c(),o.options=Object.assign({},i,o.options,s),o.scrollParents={reference:p(e)?R(e):e.contextElement?R(e.contextElement):[],popper:R(t)};var u=function(e){var t=z(e);return U.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}(function(e){var t=e.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{});return Object.keys(t).map((function(e){return t[e]}))}([].concat(r,o.options.modifiers)));return o.orderedModifiers=u.filter((function(e){return e.enabled})),o.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,r=void 0===n?{}:n,i=e.effect;if("function"===typeof i){var s=i({state:o,name:t,instance:f,options:r}),c=function(){};a.push(s||c)}})),f.update()},forceUpdate:function(){if(!s){var e=o.elements,t=e.reference,n=e.popper;if(X(t,n)){o.rects={reference:E(t,M(n),"fixed"===o.options.strategy),popper:j(n)},o.reset=!1,o.placement=o.options.placement,o.orderedModifiers.forEach((function(e){return o.modifiersData[e.name]=Object.assign({},e.data)}));for(var r=0;r<o.orderedModifiers.length;r++)if(!0!==o.reset){var i=o.orderedModifiers[r],a=i.fn,c=i.options,p=void 0===c?{}:c,u=i.name;"function"===typeof a&&(o=a({state:o,options:p,name:u,instance:f})||o)}else o.reset=!1,r=-1}}},update:F((function(){return new Promise((function(e){f.forceUpdate(),e(o)}))})),destroy:function(){c(),s=!0}};if(!X(e,t))return f;function c(){a.forEach((function(e){return e()})),a=[]}return f.setOptions(n).then((function(e){!s&&n.onFirstUpdate&&n.onFirstUpdate(e)})),f}}var G={passive:!0};function J(e){return e.split("-")[0]}function K(e){return e.split("-")[1]}function Q(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function $(e){var t,n=e.reference,r=e.element,o=e.placement,i=o?J(o):null,a=o?K(o):null,s=n.x+n.width/2-r.width/2,f=n.y+n.height/2-r.height/2;switch(i){case L:t={x:s,y:n.y-r.height};break;case W:t={x:s,y:n.y+n.height};break;case B:t={x:n.x+n.width,y:f};break;case Z:t={x:n.x-r.width,y:f};break;default:t={x:n.x,y:n.y}}var c=i?Q(i):null;if(null!=c){var p="y"===c?"height":"width";switch(a){case S:t[c]=t[c]-(n[p]/2-r[p]/2);break;case C:t[c]=t[c]+(n[p]/2-r[p]/2)}}return t}var ee={top:"auto",right:"auto",bottom:"auto",left:"auto"};function te(e){var t,n=e.popper,r=e.popperRect,o=e.placement,i=e.variation,a=e.offsets,s=e.position,f=e.gpuAcceleration,p=e.adaptive,u=e.roundOffsets,l=e.isFixed,d=a.x,m=void 0===d?0:d,v=a.y,y=void 0===v?0:v,g="function"===typeof u?u({x:m,y:y}):{x:m,y:y};m=g.x,y=g.y;var w=a.hasOwnProperty("x"),O=a.hasOwnProperty("y"),E=Z,j=L,P=window;if(p){var D=M(n),R="clientHeight",k="clientWidth";if(D===c(n)&&"static"!==x(D=b(n)).position&&"absolute"===s&&(R="scrollHeight",k="scrollWidth"),o===L||(o===Z||o===B)&&i===C)j=W,y-=(l&&D===P&&P.visualViewport?P.visualViewport.height:D[R])-r.height,y*=f?1:-1;if(o===Z||(o===L||o===W)&&i===C)E=B,m-=(l&&D===P&&P.visualViewport?P.visualViewport.width:D[k])-r.width,m*=f?1:-1}var A,T=Object.assign({position:s},p&&ee),H=!0===u?function(e){var t=e.x,n=e.y,r=window.devicePixelRatio||1;return{x:h(t*r)/r||0,y:h(n*r)/r||0}}({x:m,y:y}):{x:m,y:y};return m=H.x,y=H.y,f?Object.assign({},T,((A={})[j]=O?"0":"",A[E]=w?"0":"",A.transform=(P.devicePixelRatio||1)<=1?"translate("+m+"px, "+y+"px)":"translate3d("+m+"px, "+y+"px, 0)",A)):Object.assign({},T,((t={})[j]=O?y+"px":"",t[E]=w?m+"px":"",t.transform="",t))}var ne={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.offset,i=void 0===o?[0,0]:o,a=I.reduce((function(e,n){return e[n]=function(e,t,n){var r=J(e),o=[Z,L].indexOf(r)>=0?-1:1,i="function"===typeof n?n(Object.assign({},t,{placement:e})):n,a=i[0],s=i[1];return a=a||0,s=(s||0)*o,[Z,B].indexOf(r)>=0?{x:s,y:a}:{x:a,y:s}}(n,t.rects,i),e}),{}),s=a[t.placement],f=s.x,c=s.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=f,t.modifiersData.popperOffsets.y+=c),t.modifiersData[r]=a}},re={left:"right",right:"left",bottom:"top",top:"bottom"};function oe(e){return e.replace(/left|right|bottom|top/g,(function(e){return re[e]}))}var ie={start:"end",end:"start"};function ae(e){return e.replace(/start|end/g,(function(e){return ie[e]}))}function se(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&l(n)){var r=t;do{if(r&&e.isSameNode(r))return!0;r=r.parentNode||r.host}while(r)}return!1}function fe(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function ce(e,t){return t===q?fe(function(e){var t=c(e),n=b(e),r=t.visualViewport,o=n.clientWidth,i=n.clientHeight,a=0,s=0;return r&&(o=r.width,i=r.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(a=r.offsetLeft,s=r.offsetTop)),{width:o,height:i,x:a+w(e),y:s}}(e)):p(t)?function(e){var t=v(e);return t.top=t.top+e.clientTop,t.left=t.left+e.clientLeft,t.bottom=t.top+e.clientHeight,t.right=t.left+e.clientWidth,t.width=e.clientWidth,t.height=e.clientHeight,t.x=t.left,t.y=t.top,t}(t):fe(function(e){var t,n=b(e),r=y(e),o=null==(t=e.ownerDocument)?void 0:t.body,i=d(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),a=d(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),s=-r.scrollLeft+w(e),f=-r.scrollTop;return"rtl"===x(o||n).direction&&(s+=d(n.clientWidth,o?o.clientWidth:0)-i),{width:i,height:a,x:s,y:f}}(b(e)))}function pe(e,t,n){var r="clippingParents"===t?function(e){var t=R(P(e)),n=["absolute","fixed"].indexOf(x(e).position)>=0&&u(e)?M(e):e;return p(n)?t.filter((function(e){return p(e)&&se(e,n)&&"body"!==g(e)})):[]}(e):[].concat(t),o=[].concat(r,[n]),i=o[0],a=o.reduce((function(t,n){var r=ce(e,n);return t.top=d(r.top,t.top),t.right=m(r.right,t.right),t.bottom=m(r.bottom,t.bottom),t.left=d(r.left,t.left),t}),ce(e,i));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}function ue(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function le(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}function de(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=void 0===r?e.placement:r,i=n.boundary,a=void 0===i?"clippingParents":i,s=n.rootBoundary,f=void 0===s?q:s,c=n.elementContext,u=void 0===c?V:c,l=n.altBoundary,d=void 0!==l&&l,m=n.padding,h=void 0===m?0:m,y=ue("number"!==typeof h?h:le(h,H)),g=u===V?"reference":V,w=e.rects.popper,x=e.elements[d?g:u],O=pe(p(x)?x:x.contextElement||b(e.elements.popper),a,f),E=v(e.elements.reference),j=$({reference:E,element:w,strategy:"absolute",placement:o}),P=fe(Object.assign({},w,j)),D=u===V?P:E,R={top:O.top-D.top+y.top,bottom:D.bottom-O.bottom+y.bottom,left:O.left-D.left+y.left,right:D.right-O.right+y.right},k=e.modifiersData.offset;if(u===V&&k){var A=k[o];Object.keys(R).forEach((function(e){var t=[B,W].indexOf(e)>=0?1:-1,n=[L,W].indexOf(e)>=0?"y":"x";R[e]+=A[n]*t}))}return R}function me(e,t,n){return d(e,m(t,n))}var he={name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name,o=n.mainAxis,i=void 0===o||o,a=n.altAxis,s=void 0!==a&&a,f=n.boundary,c=n.rootBoundary,p=n.altBoundary,u=n.padding,l=n.tether,h=void 0===l||l,v=n.tetherOffset,y=void 0===v?0:v,g=de(t,{boundary:f,rootBoundary:c,padding:u,altBoundary:p}),b=J(t.placement),w=K(t.placement),x=!w,O=Q(b),E="x"===O?"y":"x",P=t.modifiersData.popperOffsets,D=t.rects.reference,R=t.rects.popper,k="function"===typeof y?y(Object.assign({},t.rects,{placement:t.placement})):y,A="number"===typeof k?{mainAxis:k,altAxis:k}:Object.assign({mainAxis:0,altAxis:0},k),T=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,H={x:0,y:0};if(P){if(i){var C,q="y"===O?L:Z,V="y"===O?W:B,N="y"===O?"height":"width",I=P[O],U=I+g[q],z=I-g[V],F=h?-R[N]/2:0,_=w===S?D[N]:R[N],X=w===S?-R[N]:-D[N],Y=t.elements.arrow,G=h&&Y?j(Y):{width:0,height:0},$=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},ee=$[q],te=$[V],ne=me(0,D[N],G[N]),re=x?D[N]/2-F-ne-ee-A.mainAxis:_-ne-ee-A.mainAxis,oe=x?-D[N]/2+F+ne+te+A.mainAxis:X+ne+te+A.mainAxis,ie=t.elements.arrow&&M(t.elements.arrow),ae=ie?"y"===O?ie.clientTop||0:ie.clientLeft||0:0,se=null!=(C=null==T?void 0:T[O])?C:0,fe=I+oe-se,ce=me(h?m(U,I+re-se-ae):U,I,h?d(z,fe):z);P[O]=ce,H[O]=ce-I}if(s){var pe,ue="x"===O?L:Z,le="x"===O?W:B,he=P[E],ve="y"===E?"height":"width",ye=he+g[ue],ge=he-g[le],be=-1!==[L,Z].indexOf(b),we=null!=(pe=null==T?void 0:T[E])?pe:0,xe=be?ye:he-D[ve]-R[ve]-we+A.altAxis,Oe=be?he+D[ve]+R[ve]-we-A.altAxis:ge,Ee=h&&be?function(e,t,n){var r=me(e,t,n);return r>n?n:r}(xe,he,Oe):me(h?xe:ye,he,h?Oe:ge);P[E]=Ee,H[E]=Ee-he}t.modifiersData[r]=H}},requiresIfExists:["offset"]};var ve={name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,r=e.name,o=e.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,s=J(n.placement),f=Q(s),c=[Z,B].indexOf(s)>=0?"height":"width";if(i&&a){var p=function(e,t){return ue("number"!==typeof(e="function"===typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:le(e,H))}(o.padding,n),u=j(i),l="y"===f?L:Z,d="y"===f?W:B,m=n.rects.reference[c]+n.rects.reference[f]-a[f]-n.rects.popper[c],h=a[f]-n.rects.reference[f],v=M(i),y=v?"y"===f?v.clientHeight||0:v.clientWidth||0:0,g=m/2-h/2,b=p[l],w=y-u[c]-p[d],x=y/2-u[c]/2+g,O=me(b,x,w),E=f;n.modifiersData[r]=((t={})[E]=O,t.centerOffset=O-x,t)}},effect:function(e){var t=e.state,n=e.options.element,r=void 0===n?"[data-popper-arrow]":n;null!=r&&("string"!==typeof r||(r=t.elements.popper.querySelector(r)))&&se(t.elements.popper,r)&&(t.elements.arrow=r)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function ye(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function ge(e){return[L,B,W,Z].some((function(t){return e[t]>=0}))}var be=Y({defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,n=e.instance,r=e.options,o=r.scroll,i=void 0===o||o,a=r.resize,s=void 0===a||a,f=c(t.elements.popper),p=[].concat(t.scrollParents.reference,t.scrollParents.popper);return i&&p.forEach((function(e){e.addEventListener("scroll",n.update,G)})),s&&f.addEventListener("resize",n.update,G),function(){i&&p.forEach((function(e){e.removeEventListener("scroll",n.update,G)})),s&&f.removeEventListener("resize",n.update,G)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=$({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,r=n.gpuAcceleration,o=void 0===r||r,i=n.adaptive,a=void 0===i||i,s=n.roundOffsets,f=void 0===s||s,c={placement:J(t.placement),variation:K(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,te(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:f})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,te(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:f})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},r=t.attributes[e]||{},o=t.elements[e];u(o)&&g(o)&&(Object.assign(o.style,n),Object.keys(r).forEach((function(e){var t=r[e];!1===t?o.removeAttribute(e):o.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var r=t.elements[e],o=t.attributes[e]||{},i=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{});u(r)&&g(r)&&(Object.assign(r.style,i),Object.keys(o).forEach((function(e){r.removeAttribute(e)})))}))}},requires:["computeStyles"]},ne,{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name;if(!t.modifiersData[r]._skip){for(var o=n.mainAxis,i=void 0===o||o,a=n.altAxis,s=void 0===a||a,f=n.fallbackPlacements,c=n.padding,p=n.boundary,u=n.rootBoundary,l=n.altBoundary,d=n.flipVariations,m=void 0===d||d,h=n.allowedAutoPlacements,v=t.options.placement,y=J(v),g=f||(y===v||!m?[oe(v)]:function(e){if(J(e)===T)return[];var t=oe(e);return[ae(e),t,ae(t)]}(v)),b=[v].concat(g).reduce((function(e,n){return e.concat(J(n)===T?function(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=n.boundary,i=n.rootBoundary,a=n.padding,s=n.flipVariations,f=n.allowedAutoPlacements,c=void 0===f?I:f,p=K(r),u=p?s?N:N.filter((function(e){return K(e)===p})):H,l=u.filter((function(e){return c.indexOf(e)>=0}));0===l.length&&(l=u);var d=l.reduce((function(t,n){return t[n]=de(e,{placement:n,boundary:o,rootBoundary:i,padding:a})[J(n)],t}),{});return Object.keys(d).sort((function(e,t){return d[e]-d[t]}))}(t,{placement:n,boundary:p,rootBoundary:u,padding:c,flipVariations:m,allowedAutoPlacements:h}):n)}),[]),w=t.rects.reference,x=t.rects.popper,O=new Map,E=!0,j=b[0],P=0;P<b.length;P++){var D=b[P],R=J(D),k=K(D)===S,A=[L,W].indexOf(R)>=0,M=A?"width":"height",C=de(t,{placement:D,boundary:p,rootBoundary:u,altBoundary:l,padding:c}),q=A?k?B:Z:k?W:L;w[M]>x[M]&&(q=oe(q));var V=oe(q),U=[];if(i&&U.push(C[R]<=0),s&&U.push(C[q]<=0,C[V]<=0),U.every((function(e){return e}))){j=D,E=!1;break}O.set(D,U)}if(E)for(var z=function(e){var t=b.find((function(t){var n=O.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return j=t,"break"},F=m?3:1;F>0;F--){if("break"===z(F))break}t.placement!==j&&(t.modifiersData[r]._skip=!0,t.placement=j,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},he,ve,{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,r=t.rects.reference,o=t.rects.popper,i=t.modifiersData.preventOverflow,a=de(t,{elementContext:"reference"}),s=de(t,{altBoundary:!0}),f=ye(a,r),c=ye(s,o,i),p=ge(f),u=ge(c);t.modifiersData[n]={referenceClippingOffsets:f,popperEscapeOffsets:c,isReferenceHidden:p,hasPopperEscaped:u},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":p,"data-popper-escaped":u})}}]}),we=n(2791),xe=n(6174),Oe=n(184),Ee=["anchorEl","children","direction","disablePortal","modifiers","open","ownerState","placement","popperOptions","popperRef","TransitionProps"],je=["anchorEl","children","container","direction","disablePortal","keepMounted","modifiers","open","placement","popperOptions","popperRef","style","transition"];function Pe(e){return"function"===typeof e?e():e}var De={},Re=we.forwardRef((function(e,t){var n=e.anchorEl,f=e.children,c=e.direction,p=e.disablePortal,u=e.modifiers,l=e.open,d=e.placement,m=e.popperOptions,h=e.popperRef,v=e.TransitionProps,y=(0,i.Z)(e,Ee),g=we.useRef(null),b=(0,a.Z)(g,t),w=we.useRef(null),x=(0,a.Z)(w,h),O=we.useRef(x);(0,s.Z)((function(){O.current=x}),[x]),we.useImperativeHandle(h,(function(){return w.current}),[]);var E=function(e,t){if("ltr"===t)return e;switch(e){case"bottom-end":return"bottom-start";case"bottom-start":return"bottom-end";case"top-end":return"top-start";case"top-start":return"top-end";default:return e}}(d,c),j=we.useState(E),P=(0,o.Z)(j,2),D=P[0],R=P[1];we.useEffect((function(){w.current&&w.current.forceUpdate()})),(0,s.Z)((function(){if(n&&l){Pe(n);var e=[{name:"preventOverflow",options:{altBoundary:p}},{name:"flip",options:{altBoundary:p}},{name:"onUpdate",enabled:!0,phase:"afterWrite",fn:function(e){var t=e.state;R(t.placement)}}];null!=u&&(e=e.concat(u)),m&&null!=m.modifiers&&(e=e.concat(m.modifiers));var t=be(Pe(n),g.current,(0,r.Z)({placement:E},m,{modifiers:e}));return O.current(t),function(){t.destroy(),O.current(null)}}}),[n,p,u,l,m,E]);var k={placement:D};return null!==v&&(k.TransitionProps=v),(0,Oe.jsx)("div",(0,r.Z)({ref:b,role:"tooltip"},y,{children:"function"===typeof f?f(k):f}))})),ke=we.forwardRef((function(e,t){var n=e.anchorEl,a=e.children,s=e.container,c=e.direction,p=void 0===c?"ltr":c,u=e.disablePortal,l=void 0!==u&&u,d=e.keepMounted,m=void 0!==d&&d,h=e.modifiers,v=e.open,y=e.placement,g=void 0===y?"bottom":y,b=e.popperOptions,w=void 0===b?De:b,x=e.popperRef,O=e.style,E=e.transition,j=void 0!==E&&E,P=(0,i.Z)(e,je),D=we.useState(!0),R=(0,o.Z)(D,2),k=R[0],A=R[1];if(!m&&!v&&(!j||k))return null;var M=s||(n?(0,f.Z)(Pe(n)).body:void 0);return(0,Oe.jsx)(xe.Z,{disablePortal:l,container:M,children:(0,Oe.jsx)(Re,(0,r.Z)({anchorEl:n,direction:p,disablePortal:l,modifiers:h,ref:t,open:j?!k:v,placement:g,popperOptions:w,popperRef:x},P,{style:(0,r.Z)({position:"fixed",top:0,left:0,display:v||!m||j&&!k?null:"none"},O),TransitionProps:j?{in:v,onEnter:function(){A(!1)},onExited:function(){A(!0)}}:null,children:a}))})})),Ae=n(7301),Me=n(7630),Le=n(3736),We=(0,Me.ZP)(ke,{name:"MuiPopper",slot:"Root",overridesResolver:function(e,t){return t.root}})({}),Be=we.forwardRef((function(e,t){var n=(0,Ae.Z)(),o=(0,Le.Z)({props:e,name:"MuiPopper"});return(0,Oe.jsx)(We,(0,r.Z)({direction:null==n?void 0:n.direction},o,{ref:t}))}))}}]);
//# sourceMappingURL=5892.78d1e622.chunk.js.map