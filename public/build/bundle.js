var app=function(t){"use strict";function e(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var a=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,a.get?a:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var n=e(t);function a(){}function o(t){return t()}function r(){return Object.create(null)}function l(t){t.forEach(o)}function i(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function p(t){return document.createTextNode(t)}function g(){return p(" ")}function m(t,e,n,a){return t.addEventListener(e,n,a),()=>t.removeEventListener(e,n,a)}function y(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function v(t,e,n){for(let n=0;n<t.options.length;n+=1){const a=t.options[n];if(a.__value===e)return void(a.selected=!0)}n&&void 0===e||(t.selectedIndex=-1)}let $;function b(t){$=t}function x(t){(function(){if(!$)throw new Error("Function called outside component initialization");return $})().$$.on_mount.push(t)}const w=[],_=[];let k=[];const E=[],j=Promise.resolve();let O=!1;function A(t){k.push(t)}const B=new Set;let C=0;function D(){if(0!==C)return;const t=$;do{try{for(;C<w.length;){const t=w[C];C++,b(t),S(t.$$)}}catch(t){throw w.length=0,C=0,t}for(b(null),w.length=0,C=0;_.length;)_.pop()();for(let t=0;t<k.length;t+=1){const e=k[t];B.has(e)||(B.add(e),e())}k.length=0}while(w.length);for(;E.length;)E.pop()();O=!1,B.clear(),b(t)}function S(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}const z=new Set;function M(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];k.forEach((a=>-1===t.indexOf(a)?e.push(a):n.push(a))),n.forEach((t=>t())),k=e}(n.after_update),l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function P(t,e){-1===t.$$.dirty[0]&&(w.push(t),O||(O=!0,j.then(D)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function T(t,e,n,c,s,u,f,h=[-1]){const p=$;b(t);const g=t.$$={fragment:null,ctx:[],props:u,update:a,not_equal:s,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(p?p.$$.context:[])),callbacks:r(),dirty:h,skip_bound:!1,root:e.target||p.$$.root};f&&f(g.root);let m=!1;if(g.ctx=n?n(t,e.props||{},((e,n,...a)=>{const o=a.length?a[0]:n;return g.ctx&&s(g.ctx[e],g.ctx[e]=o)&&(!g.skip_bound&&g.bound[e]&&g.bound[e](o),m&&P(t,e)),n})):[],g.update(),m=!0,l(g.before_update),g.fragment=!!c&&c(g.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);g.fragment&&g.fragment.l(t),t.forEach(d)}else g.fragment&&g.fragment.c();e.intro&&((y=t.$$.fragment)&&y.i&&(z.delete(y),y.i(v))),function(t,e,n,a){const{fragment:r,after_update:c}=t.$$;r&&r.m(e,n),a||A((()=>{const e=t.$$.on_mount.map(o).filter(i);t.$$.on_destroy?t.$$.on_destroy.push(...e):l(e),t.$$.on_mount=[]})),c.forEach(A)}(t,e.target,e.anchor,e.customElement),D()}var y,v;b(p)}class F{$destroy(){M(this,1),this.$destroy=a}$on(t,e){if(!i(e))return a;const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Y(t,e,n){const a=t.slice();return a[22]=e[n],a}function L(t,e,n){const a=t.slice();return a[25]=e[n],a}function G(t){let e,n,o=t[25]+"";return{c(){e=h("option"),n=p(o),e.__value=t[25],e.value=e.__value},m(t,a){u(t,e,a),s(e,n)},p:a,d(t){t&&d(e)}}}function N(t){let e,n,a,o,r=t[22].label+"";function l(){return t[9](t[22])}return{c(){e=h("button"),n=p(r),y(e,"class","svelte-1jh2ery")},m(t,r){u(t,e,r),s(e,n),a||(o=m(e,"click",l),a=!0)},p(e,n){t=e},d(t){t&&d(e),a=!1,o()}}}function q(t){let e,n,o,r,i,c,$,b,x,w,_,k,E,j,O,B,C,D,S,z,M=t[5][t[0]]+"",P=t[3],T=[];for(let e=0;e<P.length;e+=1)T[e]=G(L(t,P,e));let F=t[4],q=[];for(let e=0;e<F.length;e+=1)q[e]=N(Y(t,F,e));return{c(){e=h("div"),n=h("h1"),n.textContent="Recurring Investment Analysis",o=g(),r=h("p"),r.textContent="Recurring investments offer a hands-free way to grow your portfolio by automatically investing on a set schedule, eliminating the need to remember or manually manage your contributions. These visualizations are designed to help you analyze whether choosing a specific day of the week for your investments can lead to better growth over time.",i=g(),c=h("p"),c.textContent="You can explore three assets—Bitcoin, Gold, and SPY—to discover potential patterns. The bar chart above displays the average price of your selected asset for each day of the week, helping you understand daily price trends. Below, the line chart illustrates the growth of a $10 recurring investment made on each day of the week, with each line representing a specific day. This allows you to compare the potential growth of your investments and determine the most advantageous day to invest automatically.",$=g(),b=h("div"),x=h("select");for(let t=0;t<T.length;t+=1)T[t].c();w=g(),_=h("p"),k=p(M),E=g(),j=h("div");for(let t=0;t<q.length;t+=1)q[t].c();O=g(),B=h("div"),C=g(),D=h("div"),y(x,"class","svelte-1jh2ery"),void 0===t[0]&&A((()=>t[8].call(x))),y(B,"class","charts svelte-1jh2ery"),y(D,"class","charts svelte-1jh2ery"),y(e,"class","container svelte-1jh2ery")},m(a,l){u(a,e,l),s(e,n),s(e,o),s(e,r),s(e,i),s(e,c),s(e,$),s(e,b),s(b,x);for(let t=0;t<T.length;t+=1)T[t]&&T[t].m(x,null);v(x,t[0],!0),s(b,w),s(b,_),s(_,k),s(e,E),s(e,j);for(let t=0;t<q.length;t+=1)q[t]&&q[t].m(j,null);s(e,O),s(e,B),t[10](B),s(e,C),s(e,D),t[11](D),S||(z=[m(x,"change",t[8]),m(x,"change",t[6])],S=!0)},p(t,[e]){if(8&e){let n;for(P=t[3],n=0;n<P.length;n+=1){const a=L(t,P,n);T[n]?T[n].p(a,e):(T[n]=G(a),T[n].c(),T[n].m(x,null))}for(;n<T.length;n+=1)T[n].d(1);T.length=P.length}if(9&e&&v(x,t[0]),1&e&&M!==(M=t[5][t[0]]+"")&&function(t,e){e=""+e,t.data!==e&&(t.data=e)}(k,M),144&e){let n;for(F=t[4],n=0;n<F.length;n+=1){const a=Y(t,F,n);q[n]?q[n].p(a,e):(q[n]=N(a),q[n].c(),q[n].m(j,null))}for(;n<q.length;n+=1)q[n].d(1);q.length=F.length}},i:a,o:a,d(n){n&&d(e),f(T,n),f(q,n),t[10](null),t[11](null),S=!1,l(z)}}}function I(t,e,a){let o=["Gold","SPY","Bitcoin"],r="Gold",l=[{label:"1 Month",months:1},{label:"3 Months",months:3},{label:"6 Months",months:6},{label:"1 Year",months:12},{label:"5 Years",months:60}],i=l[3];let c,s,u=[],d=[],f=[],h=null,p="";function g(){if(!u||0===u.length)return;const t=new Date,e=new Date(t.setMonth(t.getMonth()-i.months)),a=u.filter((t=>{const n=new Date(t.Date);return t.Asset===r&&n>=e})),o=["Monday","Tuesday","Wednesday","Thursday","Friday"];d=o.map((t=>{const e=a.filter((e=>e.Day===t)),n=e.reduce(((t,e)=>t+e.Close),0)/e.length||0;return{day:t,average:parseFloat(n.toFixed(2))}})),h=d.reduce(((t,e)=>e.average>t.average?e:t),d[0]),function(t,e){const n=10;f=e.map((e=>{let a=0,o=10;const r=[];return t.filter((t=>t.Day===e)).forEach((t=>{const e=n/t.Close;a+=e,o=a*t.Close,r.push({date:new Date(t.Date),value:o})})),{day:e,growth:r}}))}(a,o),function(){n.select(c).selectAll("*").remove();const t={top:20,right:20,bottom:30,left:50},e=700-t.left-t.right,a=300-t.top-t.bottom,o=n.select(c).append("svg").attr("width",e+t.left+t.right).attr("height",a+t.top+t.bottom).append("g").attr("transform",`translate(${t.left},${t.top})`),r=n.scaleBand().domain(d.map((t=>t.day))).range([0,e]).padding(.2),l=.98*n.min(d,(t=>t.average)),i=1.02*n.max(d,(t=>t.average)),s=n.scaleLinear().domain([l,i]).range([a,0]);o.append("g").attr("transform",`translate(0,${a})`).call(n.axisBottom(r)),o.append("g").call(n.axisLeft(s).ticks(3)),o.selectAll(".bar").data(d).enter().append("rect").attr("class","bar").attr("x",(t=>r(t.day))).attr("y",(t=>s(t.average))).attr("width",r.bandwidth()).attr("height",(t=>a-s(t.average))).attr("fill",(t=>t.day===h.day?"green":"steelblue")),o.selectAll(".label").data(d).enter().append("text").attr("x",(t=>r(t.day)+r.bandwidth()/2)).attr("y",(t=>s(t.average)-5)).attr("text-anchor","middle").style("font-size","12px").text((t=>`$${t.average.toFixed(2)}`))}(),function(){n.select(s).selectAll("*").remove();const t={top:20,right:20,bottom:50,left:50},e=700-t.left-t.right,a=300-t.top-t.bottom,o=n.select(s).append("svg").attr("width",e+t.left+t.right).attr("height",a+t.top+t.bottom).append("g").attr("transform",`translate(${t.left},${t.top})`),r=n.scaleTime().domain([n.min(f,(t=>n.min(t.growth,(t=>t.date)))),n.max(f,(t=>n.max(t.growth,(t=>t.date))))]).range([0,e]),l=n.scaleLinear().domain([10,n.max(f,(t=>n.max(t.growth,(t=>t.value))))]).range([a,0]);o.append("g").attr("transform",`translate(0,${a})`).call(n.axisBottom(r)),o.append("g").call(n.axisLeft(l));const i=n.scaleOrdinal(n.schemeCategory10);f.forEach(((t,e)=>{o.append("path").datum(t.growth).attr("fill","none").attr("stroke",i(e)).attr("stroke-width",1.5).attr("d",n.line().x((t=>r(t.date))).y((t=>l(t.value))))}));const c=o.append("g").attr("transform",`translate(0,${a+30})`);f.forEach(((t,e)=>{c.append("rect").attr("x",100*e).attr("y",0).attr("width",10).attr("height",10).attr("fill",i(e)),c.append("text").attr("x",100*e+15).attr("y",10).text(t.day).style("font-size","12px").attr("alignment-baseline","middle")}))}()}function m(t){i=t,g()}x((async()=>{try{const t=await fetch("./normalized_prices_with_days.json");if(!t.ok)throw new Error("Failed to fetch data");u=await t.json(),g()}catch(t){p=`Error loading data: ${t.message}`,console.error(p)}}));return[r,c,s,o,l,{Gold:"Gold is a precious metal often considered a hedge against inflation.",SPY:"SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",Bitcoin:"Bitcoin is a decentralized digital currency created in 2009."},function(t){a(0,r=t.target.value),g()},m,function(){r=function(t){const e=t.querySelector(":checked");return e&&e.__value}(this),a(0,r),a(3,o)},t=>m(t),function(t){_[t?"unshift":"push"]((()=>{c=t,a(1,c)}))},function(t){_[t?"unshift":"push"]((()=>{s=t,a(2,s)}))}]}return new class extends F{constructor(t){super(),T(this,t,I,q,c,{})}}({target:document.body})}(d3);
//# sourceMappingURL=bundle.js.map
