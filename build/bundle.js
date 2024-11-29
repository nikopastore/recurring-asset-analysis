var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode&&t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function i(t){return document.createTextNode(t)}function u(){return i(" ")}function d(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function p(t,e,n){for(let n=0;n<t.options.length;n+=1){const o=t.options[n];if(o.__value===e)return void(o.selected=!0)}n&&void 0===e||(t.selectedIndex=-1)}function g(t,e,n){t.classList[n?"add":"remove"](e)}let m;function $(t){m=t}const b=[],v=[];let y=[];const _=[],k=Promise.resolve();let x=!1;function w(t){y.push(t)}const E=new Set;let P=0;function A(){if(0!==P)return;const t=m;do{try{for(;P<b.length;){const t=b[P];P++,$(t),M(t.$$)}}catch(t){throw b.length=0,P=0,t}for($(null),b.length=0,P=0;v.length;)v.pop()();for(let t=0;t<y.length;t+=1){const e=y[t];E.has(e)||(E.add(e),e())}y.length=0}while(b.length);for(;_.length;)_.pop()();x=!1,E.clear(),$(t)}function M(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(w)}}const S=new Set;function C(t,e){t&&t.i&&(S.delete(t),t.i(e))}function L(t,e){t.d(1),e.delete(t.key)}function Y(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];y.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),y=e}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function N(t,e){-1===t.$$.dirty[0]&&(b.push(t),x||(x=!0,k.then(A)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function O(s,l,c,a,i,u,d,h=[-1]){const p=m;$(s);const g=s.$$={fragment:null,ctx:[],props:u,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(p?p.$$.context:[])),callbacks:n(),dirty:h,skip_bound:!1,root:l.target||p.$$.root};d&&d(g.root);let b=!1;if(g.ctx=c?c(s,l.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return g.ctx&&i(g.ctx[t],g.ctx[t]=o)&&(!g.skip_bound&&g.bound[t]&&g.bound[t](o),b&&N(s,t)),e})):[],g.update(),b=!0,o(g.before_update),g.fragment=!!a&&a(g.ctx),l.target){if(l.hydrate){const t=function(t){return Array.from(t.childNodes)}(l.target);g.fragment&&g.fragment.l(t),t.forEach(f)}else g.fragment&&g.fragment.c();l.intro&&C(s.$$.fragment),function(t,n,s,l){const{fragment:c,after_update:f}=t.$$;c&&c.m(n,s),l||w((()=>{const n=t.$$.on_mount.map(e).filter(r);t.$$.on_destroy?t.$$.on_destroy.push(...n):o(n),t.$$.on_mount=[]})),f.forEach(w)}(s,l.target,l.anchor,l.customElement),A()}$(p)}class j{$destroy(){Y(this,1),this.$destroy=t}$on(e,n){if(!r(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function T(t,e,n){const o=t.slice();return o[6]=e[n],o}function q(t,e,n){const o=t.slice();return o[9]=e[n],o}function B(e){let n,o,r=e[9]+"";return{c(){n=a("option"),o=i(r),n.__value=e[9],n.value=n.__value},m(t,e){c(t,n,e),l(n,o)},p:t,d(t){t&&f(n)}}}function G(t,e){let n,o,r,s,p,m=e[6].label+"";function $(){return e[5](e[6])}return{key:t,first:null,c(){n=a("button"),o=i(m),r=u(),h(n,"class","svelte-1p95ff"),g(n,"selected",e[1]===e[6]),this.first=n},m(t,e){c(t,n,e),l(n,o),l(n,r),s||(p=d(n,"click",$),s=!0)},p(t,o){e=t,10&o&&g(n,"selected",e[1]===e[6])},d(t){t&&f(n),s=!1,p()}}}function z(e){let n,r,s,g,m,$,b,v,y,_,k,x,E,P,A,M,S,Y,N,O,j=[],z=new Map,F=e[1].label+"",H=e[2],I=[];for(let t=0;t<H.length;t+=1)I[t]=B(q(e,H,t));let R=e[3];const D=t=>t[6].label;for(let t=0;t<R.length;t+=1){let n=T(e,R,t),o=D(n);z.set(o,j[t]=G(o,n))}return{c(){n=a("div"),r=a("div"),r.innerHTML="<h1>Recurring Asset Analysis</h1> \n\t  <p>Analyze the impact of recurring weekly investments.</p>",s=u(),g=a("div"),m=a("div"),$=a("label"),$.textContent="Select Asset:",b=u(),v=a("select");for(let t=0;t<I.length;t+=1)I[t].c();y=u(),_=a("div"),k=a("label"),k.textContent="Time Frame:",x=u(),E=a("div");for(let t=0;t<j.length;t+=1)j[t].c();P=u(),A=a("div"),M=a("p"),S=i("Line Chart Placeholder for "),Y=i(F),h(r,"class","header svelte-1p95ff"),h($,"for","asset-select"),h($,"class","svelte-1p95ff"),h(v,"id","asset-select"),void 0===e[0]&&w((()=>e[4].call(v))),h(m,"class","filter-group svelte-1p95ff"),h(g,"class","filters svelte-1p95ff"),h(k,"for","time-frame-select"),h(k,"class","svelte-1p95ff"),h(E,"class","time-buttons svelte-1p95ff"),h(E,"id","time-frame-select"),h(_,"class","filter-group svelte-1p95ff"),h(A,"class","chart-placeholder svelte-1p95ff"),h(n,"class","app-container svelte-1p95ff")},m(t,o){c(t,n,o),l(n,r),l(n,s),l(n,g),l(g,m),l(m,$),l(m,b),l(m,v);for(let t=0;t<I.length;t+=1)I[t]&&I[t].m(v,null);p(v,e[0],!0),l(n,y),l(n,_),l(_,k),l(_,x),l(_,E);for(let t=0;t<j.length;t+=1)j[t]&&j[t].m(E,null);l(n,P),l(n,A),l(A,M),l(M,S),l(M,Y),N||(O=d(v,"change",e[4]),N=!0)},p(t,[e]){if(4&e){let n;for(H=t[2],n=0;n<H.length;n+=1){const o=q(t,H,n);I[n]?I[n].p(o,e):(I[n]=B(o),I[n].c(),I[n].m(v,null))}for(;n<I.length;n+=1)I[n].d(1);I.length=H.length}5&e&&p(v,t[0]),10&e&&(R=t[3],j=function(t,e,n,r,s,l,c,f,a,i,u,d){let h=t.length,p=l.length,g=h;const m={};for(;g--;)m[t[g].key]=g;const $=[],b=new Map,v=new Map,y=[];for(g=p;g--;){const t=d(s,l,g),o=n(t);let f=c.get(o);f?r&&y.push((()=>f.p(t,e))):(f=i(o,t),f.c()),b.set(o,$[g]=f),o in m&&v.set(o,Math.abs(g-m[o]))}const _=new Set,k=new Set;function x(t){C(t,1),t.m(f,u),c.set(t.key,t),u=t.first,p--}for(;h&&p;){const e=$[p-1],n=t[h-1],o=e.key,r=n.key;e===n?(u=e.first,h--,p--):b.has(r)?!c.has(o)||_.has(o)?x(e):k.has(r)?h--:v.get(o)>v.get(r)?(k.add(o),x(e)):(_.add(r),h--):(a(n,c),h--)}for(;h--;){const e=t[h];b.has(e.key)||a(e,c)}for(;p;)x($[p-1]);return o(y),$}(j,e,D,1,t,R,z,E,L,G,null,T)),2&e&&F!==(F=t[1].label+"")&&function(t,e){e=""+e,t.data!==e&&(t.data=e)}(Y,F)},i:t,o:t,d(t){t&&f(n),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(I,t);for(let t=0;t<j.length;t+=1)j[t].d();N=!1,O()}}}function F(t,e,n){let o=["Gold","SPY","Bitcoin"],r="Gold";const s=[{label:"Past Month",months:1},{label:"Past 6 Months",months:6},{label:"Past 1 Year",months:12},{label:"Past 5 Years",months:60},{label:"Past 10 Years",months:120},{label:"Past 25 Years",months:300}];let l=s[2];return[r,l,o,s,function(){r=function(t){const e=t.querySelector(":checked");return e&&e.__value}(this),n(0,r),n(2,o)},t=>n(1,l=t)]}return new class extends j{constructor(t){super(),O(this,t,F,z,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map