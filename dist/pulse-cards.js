function e(e,t,o,i){var n,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,o,i);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,o,s):n(t,o))||s);return a>3&&s&&Object.defineProperty(t,o,s),s}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,o=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let a=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&n.set(t,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new a(o,e,i)},r=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,g=_?_.emptyScript:"",f=m.reactiveElementPolyfillSupport,v=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},y=(e,t)=>!c(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:n}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const a=i?.call(this);n?.call(this,t),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(o)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=o.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const n=(void 0!==o.converter?.toAttribute?o.converter:b).toAttribute(t,o.type);this._$Em=e,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const a=n.fromAttribute(t,e.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,o,i=!1,n){if(void 0!==e){const a=this.constructor;if(!1===i&&(n=this[e]),o??=a.getPropertyOptions(e),!((o.hasChanged??y)(n,t)||o.useDefault&&o.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:n},a){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==n||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,o,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+E,O=`<${M}>`,N=document,z=()=>N.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,L="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,I=/>/g,H=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,U=/"/g,q=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...o)=>({_$litType$:e,strings:t,values:o}))(1),W=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),G=new WeakMap,V=N.createTreeWalker(N,129);function Y(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const J=(e,t)=>{const o=e.length-1,i=[];let n,a=2===t?"<svg>":3===t?"<math>":"",s=j;for(let t=0;t<o;t++){const o=e[t];let r,c,l=-1,d=0;for(;d<o.length&&(s.lastIndex=d,c=s.exec(o),null!==c);)d=s.lastIndex,s===j?"!--"===c[1]?s=D:void 0!==c[1]?s=I:void 0!==c[2]?(q.test(c[2])&&(n=RegExp("</"+c[2],"g")),s=H):void 0!==c[3]&&(s=H):s===H?">"===c[0]?(s=n??j,l=-1):void 0===c[1]?l=-2:(l=s.lastIndex-c[2].length,r=c[1],s=void 0===c[3]?H:'"'===c[3]?U:R):s===U||s===R?s=H:s===D||s===I?s=j:(s=H,n=void 0);const h=s===H&&e[t+1].startsWith("/>")?" ":"";a+=s===j?o+O:l>=0?(i.push(r),o.slice(0,l)+C+o.slice(l)+E+h):o+E+(-2===l?t:h)}return[Y(e,a+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let n=0,a=0;const s=e.length-1,r=this.parts,[c,l]=J(e,t);if(this.el=X.createElement(c,o),V.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=V.nextNode())&&r.length<s;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(C)){const t=l[a++],o=i.getAttribute(e).split(E),s=/([.?@])?(.*)/.exec(t);r.push({type:1,index:n,name:s[2],strings:o,ctor:"."===s[1]?te:"?"===s[1]?oe:"@"===s[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(E)&&(r.push({type:6,index:n}),i.removeAttribute(e));if(q.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=A?A.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],z()),V.nextNode(),r.push({type:2,index:++n});i.append(e[t],z())}}}else if(8===i.nodeType)if(i.data===M)r.push({type:2,index:n});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)r.push({type:7,index:n}),e+=E.length-1}n++}}static createElement(e,t){const o=N.createElement("template");return o.innerHTML=e,o}}function K(e,t,o=e,i){if(t===W)return t;let n=void 0!==i?o._$Co?.[i]:o._$Cl;const a=T(t)?void 0:t._$litDirective$;return n?.constructor!==a&&(n?._$AO?.(!1),void 0===a?n=void 0:(n=new a(e),n._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=n:o._$Cl=n),void 0!==n&&(t=K(e,n._$AS(e,t.values),n,i)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??N).importNode(t,!0);V.currentNode=i;let n=V.nextNode(),a=0,s=0,r=o[0];for(;void 0!==r;){if(a===r.index){let t;2===r.type?t=new Q(n,n.nextSibling,this,e):1===r.type?t=new r.ctor(n,r.name,r.strings,this,e):6===r.type&&(t=new ne(n,this,e)),this._$AV.push(t),r=o[++s]}a!==r?.index&&(n=V.nextNode(),a++)}return V.currentNode=N,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),T(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=X.createElement(Y(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Z(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new X(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const n of e)i===t.length?t.push(o=new Q(this.O(z()),this.O(z()),this,this.options)):o=t[i],o._$AI(n),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=B}_$AI(e,t=this,o,i){const n=this.strings;let a=!1;if(void 0===n)e=K(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==W,a&&(this._$AH=e);else{const i=e;let s,r;for(e=n[0],s=0;s<n.length-1;s++)r=K(this,i[o+s],t,s),r===W&&(r=this._$AH[s]),a||=!T(r)||r!==this._$AH[s],r===B?e=B:e!==B&&(e+=(r??"")+n[s+1]),this._$AH[s]=r}a&&!i&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class oe extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class ie extends ee{constructor(e,t,o,i,n){super(e,t,o,i,n),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??B)===W)return;const o=this._$AH,i=e===B&&o!==B||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,n=e!==B&&(o===B||i);i&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const ae=$.litHtmlPolyfillSupport;ae?.(X,Q),($.litHtmlVersions??=[]).push("3.3.3");const se=globalThis;let re=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let n=i._$litPart$;if(void 0===n){const e=o?.renderBefore??null;i._$litPart$=n=new Q(t.insertBefore(z(),e),e,void 0,o??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};re._$litElement$=!0,re.finalized=!0,se.litElementHydrateSupport?.({LitElement:re});const ce=se.litElementPolyfillSupport;ce?.({LitElement:re}),(se.litElementVersions??=[]).push("4.2.2");const le={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},de=(e=le,t,o)=>{const{kind:i,metadata:n}=o;let a=globalThis.litPropertyMetadata.get(n);if(void 0===a&&globalThis.litPropertyMetadata.set(n,a=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),a.set(o.name,e),"accessor"===i){const{name:i}=o;return{set(o){const n=t.get.call(this);t.set.call(this,o),this.requestUpdate(i,n,e,!0,o)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=o;return function(o){const n=this[i];t.call(this,o),this.requestUpdate(i,n,e,!0,o)}}throw Error("Unsupported decorator location: "+i)};function he(e){return(t,o)=>"object"==typeof o?de(e,t,o):((e,t,o)=>{const i=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),i?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function pe(e){return he({...e,state:!0,attribute:!1})}const ue=1,me=6,_e=e=>(...t)=>({_$litDirective$:e,values:t});let ge=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const fe=_e(class extends ge{constructor(e){if(super(e),e.type!==ue||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const o=e.element.classList;for(const e of this.st)e in t||(o.remove(e),this.st.delete(e));for(const e in t){const i=!!t[e];i===this.st.has(e)||this.nt?.has(e)||(i?(o.add(e),this.st.add(e)):(o.remove(e),this.st.delete(e)))}return W}}),ve={},be=_e(class extends ge{constructor(){super(...arguments),this.key=B}render(e,t){return this.key=e,t}update(e,[t,o]){return t!==this.key&&(((e,t=ve)=>{e._$AH=t})(e),this.key=t),o}}),ye="important",we=" !"+ye,xe=_e(class extends ge{constructor(e){if(super(e),e.type!==ue||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,o)=>{const i=e[o];return null==i?t:t+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(e,[t]){const{style:o}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?o.removeProperty(e):o[e]=null);for(const e in t){const i=t[e];if(null!=i){this.ft.add(e);const t="string"==typeof i&&i.endsWith(we);e.includes("-")||t?o.setProperty(e,t?i.slice(0,-11):i,t?ye:""):o[e]=i}}return W}}),$e={active:!1,include:new Set,exclude:new Set,match:"any",fromDevice:!0,includeNames:[]};function ke(e){return(Array.isArray(e)?e:null==e?[]:[e]).map(e=>String(e).trim()).filter(Boolean)}function Ae(e){return!!e&&(ke(e.include).length>0||ke(e.exclude).length>0)}function Se(e,t){if(!t)return e;const o=t.find(t=>t.label_id===e);if(o)return o.label_id;const i=e.toLowerCase(),n=t.find(e=>e.name.toLowerCase()===i);return n?n.label_id:e}function Ce(e,t){if(!Ae(e))return $e;const o=ke(e.include),i=ke(e.exclude);return{active:!0,include:new Set(o.map(e=>Se(e,t))),exclude:new Set(i.map(e=>Se(e,t))),match:"all"===e.match?"all":"any",fromDevice:!1!==e.from_device,includeNames:o}}function Ee(e,t,o){if(!o.active)return!0;const i=new Set(e??[]);if(o.fromDevice)for(const e of t??[])i.add(e);for(const e of o.exclude)if(i.has(e))return!1;if(0===o.include.size)return!0;const n=[...o.include];return"all"===o.match?n.every(e=>i.has(e)):n.some(e=>i.has(e))}let Me;const Oe=["moisture","smoke","gas","carbon_monoxide","safety","problem","tamper"],Ne=["alerts","motion","doors","windows","climate","lights","switches","fans","covers","locks","media","batteries"],ze=["motion","doors","windows"],Te=["illuminance","carbon_dioxide","pm25","volatile_organic_compounds","pressure","power","energy","sound_pressure"],Pe=new Set(["power","energy","gas","water","current"]),Le=new Set(["unavailable","unknown"]);function je(e,t,o=[],i=$e){const n=[],a=[];let s=0;const r=new Set(o);for(const o of Object.values(e.entities||{})){if(o.hidden||r.has(o.entity_id))continue;if(!e.states[o.entity_id])continue;const c=o.device_id?e.devices?.[o.device_id]:void 0;if((o.area_id??c?.area_id)!==t)continue;if("config"===o.entity_category)continue;const l="diagnostic"!==o.entity_category;l&&s++,Ee(o.labels,c?.labels,i)&&(a.push(o.entity_id),l&&n.push(o.entity_id))}return{primary:n,withDiagnostic:a,unfilteredCount:s}}const De=e=>e.split(".")[0],Ie=e=>e.attributes.device_class,He=e=>!!e&&!Le.has(e.state);function Re(e,t,o){return t.filter(t=>{const i=e.states[t];return"binary_sensor"===De(t)&&!!i&&o.includes(Ie(i)??"")})}function Ue(e,t,o,i){const n=o.filter(t=>{const o=e.states[t];return He(o)&&i(o)});let a;for(const t of o){const o=Date.parse(e.states[t]?.last_changed??"");!Number.isNaN(o)&&(void 0===a||o>a)&&(a=o)}return{id:t,entities:o,active:n,lastChanged:a}}function qe(e,t,o){const i=o.primary,n=e=>i.filter(t=>De(t)===e),a={},s=e=>{e.entities.length&&(a[e.id]=e)},r=t.presence_entities?.length?t.presence_entities.filter(t=>e.states[t]):Re(e,i,["occupancy","presence"]),c=Re(e,i,["motion"]);s(Ue(e,"presence",r.length?r:c,e=>["on","home","detected"].includes(e.state))),s(Ue(e,"motion",c,e=>"on"===e.state)),s(Ue(e,"doors",Re(e,i,["door","garage_door","opening"]),e=>"on"===e.state)),s(Ue(e,"windows",Re(e,i,["window"]),e=>"on"===e.state)),s(Ue(e,"covers",n("cover"),e=>["open","opening"].includes(e.state))),s(Ue(e,"locks",n("lock"),e=>["unlocked","open","opening","jammed"].includes(e.state))),s(Ue(e,"lights",n("light"),e=>"on"===e.state)),s(Ue(e,"fans",n("fan"),e=>"on"===e.state)),s(Ue(e,"switches",n("switch"),e=>"on"===e.state)),s(Ue(e,"media",n("media_player"),e=>"playing"===e.state)),s(Ue(e,"climate",n("climate"),e=>["heating","cooling","drying","fan"].includes(String(e.attributes.hvac_action??""))||!e.attributes.hvac_action&&"off"!==e.state)),s(Ue(e,"alerts",Re(e,i,t.alert_classes??Oe),e=>"on"===e.state));const l=t.battery_threshold??20,d=o.withDiagnostic.filter(t=>{const o=e.states[t];return"battery"===Ie(o)&&("sensor"===De(t)||"binary_sensor"===De(t))});return s(Ue(e,"batteries",d,e=>"binary_sensor"===De(e.entity_id)?"on"===e.state:Number(e.state)<=l)),a}function Fe(e,t,o,i){if(i&&e.states[i]){const t=e.states[i],n=Number(t.state);if(!He(t)||Number.isNaN(n))return;return{deviceClass:o,value:n,unit:String(t.attributes.unit_of_measurement??""),entities:[i]}}const n=t.primary.map(t=>e.states[t]).filter(e=>"sensor"===De(e.entity_id)&&Ie(e)===o&&He(e)&&!Number.isNaN(Number(e.state)));if(!n.length)return;const a=String(n[0].attributes.unit_of_measurement??""),s=n.filter(e=>String(e.attributes.unit_of_measurement??"")===a),r=s.map(e=>Number(e.state)),c=Pe.has(o)?r.reduce((e,t)=>e+t,0):function(e){const t=[...e].sort((e,t)=>e-t),o=Math.floor(t.length/2);return t.length%2?t[o]:(t[o-1]+t[o])/2}(r);return{deviceClass:o,value:c,unit:a,entities:s.map(e=>e.entity_id)}}function We(e,t,o){const[i,n]=Array.isArray(t)?t:[t?.min??o[0],t?.max??o[1]];return e<i?"low":e>n?"high":"ok"}const Be=["alerts","batteries","locks","doors","windows","lights","climate","media","covers","fans","switches","motion"];function Ge(e,t){if(t<=0)return{shown:e,hidden:[]};const o=e=>{const t=Be.indexOf(e.group);return t<0?Be.length:t},i=e=>e.map((e,t)=>({c:e,i:t,r:o(e)})).sort((e,t)=>e.r-t.r||e.i-t.i).map(e=>e.c),n=i(e.filter(e=>e.active)),a=i(e.filter(e=>!e.active));return n.length>t+1?{shown:n.slice(0,t),hidden:n.slice(t)}:{shown:[...n,...a.slice(0,Math.max(0,t-n.length))],hidden:[]}}const Ve=/ceiling|main|overhead|central|chandelier|κεντρικ|ταβάν|οροφ/i;function Ye(e,t,o){if(!1===t.link_main_light)return;if(t.main_light)return e.states[t.main_light]?t.main_light:void 0;const i=o.primary.filter(e=>"light"===De(e));return 1===i.length?i[0]:i.find(t=>Ve.test(`${t} ${e.states[t]?.attributes.friendly_name??""}`))}function Je(e){if(!e||"on"!==e.state)return;const t=e.attributes.rgb_color;if(Array.isArray(t)&&3===t.length)return[t[0],t[1],t[2]];const o=e.attributes.color_temp_kelvin;if("number"==typeof o)return function(e){const t=e/100,o=t<=66?255:329.698727446*Math.pow(t-60,-.1332047592),i=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-.0755148492),n=t>=66?255:t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307;return[Xe(o),Xe(i),Xe(n)]}(o);const i=e.attributes.hs_color;return Array.isArray(i)&&2===i.length?function(e,t){const o=t/100,i=t=>{const i=(t+e/60)%6;return 255*(1-o*Math.max(0,Math.min(i,4-i,1)))};return[Xe(i(5)),Xe(i(3)),Xe(i(1))]}(i[0],i[1]):void 0}function Xe(e){return Math.max(0,Math.min(255,Math.round(e)))}const Ke={occupied:"Occupied",clear:"Clear",motion:"Motion",no_motion:"No motion",door_open:"{n} door open",doors_open:"{n} doors open",doors_closed:"Doors closed",window_open:"{n} window open",windows_open:"{n} windows open",windows_closed:"Windows closed",cover_open:"{n} cover open",covers_open_n:"{n} covers open",covers_closed:"Covers closed",lock_unlocked:"{n} unlocked",locks_locked:"Locked",light_on:"{n} light on",lights_on_n:"{n} lights on",more_n:"{n} more",lights_off_all:"Lights off",fan_on:"{n} fan on",fans_on_n:"{n} fans on",fans_off_all:"Fans off",media_playing:"Playing",media_idle:"Media idle",climate_heating:"Heating",climate_cooling:"Cooling",climate_drying:"Drying",climate_fan:"Fan",climate_idle:"Idle",climate_off:"Climate off",alert:"Alert",alerts_n:"{n} alerts",battery_low:"{n} low battery",batteries_low:"{n} low batteries",for:"for {t}",since_now:"just now",last_run:"Last run: {ago}",area_not_found:'Area "{area}" was not found.',no_label_match:"No entity in this area has the label {labels}. Add it in Settings → Areas, labels & zones → Labels.",pick_area:"Pick an area in the card editor.",switch_on:"{n} switch on",switches_on_n:"{n} switches on",switches_off_all:"Switches off",turn_all_on:"All on",turn_all_off:"All off",open_all:"Open all",close_all:"Close all",pause_all:"Pause all",n_of_m_active:"{n} of {m} active",close:"Close",toggle_light:"Toggle {name}",ed_section_labels:"Filter by labels",ed_label_include:"Only show entities with these labels",ed_label_exclude:"Hide entities with these labels",ed_label_match:"An entity needs",ed_label_match_any:"At least one of the labels",ed_label_match_all:"All of the labels",ed_label_from_device:"Also use the device's labels",ed_main_light:"Main light (default: auto-detect)",ed_link_main_light:"Area icon toggles the main light",ed_top_groups:"First row (the rest go in the second row)",ed_color_temp_low:"Cold temperature color",ed_color_temp_high:"Warm temperature color",ed_color_hum_low:"Dry air color",ed_color_hum_high:"Humid air color",g_switches:"Switches & plugs",preset_lights_toggle:"Lights",preset_lights_on:"Lights on",preset_lights_off:"Lights off",preset_covers_open:"Open covers",preset_covers_close:"Close covers",preset_fans_off:"Fans off",preset_media_stop:"Stop media",preset_vacuum_area:"Vacuum",preset_everything_off:"All off",confirm_vacuum:"Send the vacuum to clean {area}?",confirm_everything_off:"Turn off everything in {area}?",ed_area:"Area",ed_name:"Name",ed_icon:"Icon",ed_color:"Accent color",ed_layout:"Layout",ed_layout_default:"Default",ed_layout_compact:"Compact",ed_show_picture:"Show area picture",ed_show_inactive:'Show inactive groups (e.g. "Windows closed")',ed_chip_colors:"Chip colours",ed_chip_colors_state:"Only what needs attention, and lights",ed_chip_colors_category:"One colour per kind of device",ed_max_chips:"Chips on the card (0 = all; the rest open the room)",ed_section_climate:"Climate & sensors",ed_section_status:"Status & alerts",ed_section_interactions:"Card interactions",ed_section_actions:"Quick actions",ed_temperature_entity:"Temperature sensor (default: area setting or median)",ed_humidity_entity:"Humidity sensor (default: area setting or median)",ed_sensor_classes:"Extra sensor readings",ed_comfort_temp_min:"Comfort temperature min",ed_comfort_temp_max:"Comfort temperature max",ed_comfort_hum_min:"Comfort humidity min",ed_comfort_hum_max:"Comfort humidity max",ed_groups:"Status groups",ed_alert_classes:"Alert device classes",ed_presence_entities:"Presence entities (default: auto-detect)",ed_exclude_entities:"Exclude entities",ed_battery_threshold:"Low battery threshold (%)",ed_tap_action:"Tap action",ed_hold_action:"Hold action",ed_double_tap_action:"Double tap action",ed_preset:"Preset",ed_preset_none:"Custom",ed_entity:"Entity",ed_add_action:"Add quick action",ed_remove:"Remove",ed_move_up:"Move up",ed_move_down:"Move down",ed_action_n:"Action {n}",ed_vacuum_hint:"Pick the vacuum entity. Uses vacuum.clean_area (HA 2026.3+), so map the vacuum's segments to areas first.",room_attention:"Needs attention",room_status:"Presence & openings",room_sensors:"Sensors",room_other:"Other",room_search:"Search this room",room_clear_search:"Clear search",room_show_more:"Show {n} more",room_show_less:"Show less",room_no_results:"Nothing matches “{q}”",room_empty:"No entities to show in this room.",reason_low_battery:"Low battery",reason_unavailable:"Unavailable",ed_room_popup:"Open the room popup when the card is tapped",g_presence:"Presence",g_motion:"Motion",g_doors:"Doors",g_windows:"Windows",g_covers:"Covers",g_locks:"Locks",g_lights:"Lights",g_fans:"Fans",g_media:"Media",g_climate:"Climate",g_alerts:"Safety alerts",g_batteries:"Batteries"},Ze={en:Ke,el:{occupied:"Κατειλημμένο",clear:"Άδειο",motion:"Κίνηση",no_motion:"Χωρίς κίνηση",door_open:"{n} πόρτα ανοιχτή",doors_open:"{n} πόρτες ανοιχτές",doors_closed:"Πόρτες κλειστές",window_open:"{n} παράθυρο ανοιχτό",windows_open:"{n} παράθυρα ανοιχτά",windows_closed:"Παράθυρα κλειστά",cover_open:"{n} ρολό ανοιχτό",covers_open_n:"{n} ρολά ανοιχτά",covers_closed:"Ρολά κλειστά",lock_unlocked:"{n} ξεκλείδωτη",locks_locked:"Κλειδωμένο",light_on:"{n} φως αναμμένο",lights_on_n:"{n} φώτα αναμμένα",more_n:"{n} ακόμη",ed_chip_colors:"Χρώματα ενδείξεων",ed_chip_colors_state:"Μόνο ό,τι θέλει προσοχή, και τα φώτα",ed_chip_colors_category:"Ένα χρώμα για κάθε είδος συσκευής",ed_max_chips:"Ενδείξεις στην κάρτα (0 = όλες· οι υπόλοιπες ανοίγουν το δωμάτιο)",lights_off_all:"Φώτα σβηστά",fan_on:"{n} ανεμιστήρας",fans_on_n:"{n} ανεμιστήρες",fans_off_all:"Ανεμιστήρες off",media_playing:"Αναπαραγωγή",media_idle:"Media σε αναμονή",climate_heating:"Θέρμανση",climate_cooling:"Ψύξη",climate_drying:"Αφύγρανση",climate_fan:"Ανεμιστήρας",climate_idle:"Αδρανές",climate_off:"Κλιματισμός off",alert:"Συναγερμός",alerts_n:"{n} ειδοποιήσεις",battery_low:"{n} χαμηλή μπαταρία",batteries_low:"{n} χαμηλές μπαταρίες",for:"εδώ και {t}",since_now:"μόλις τώρα",last_run:"Τελευταία φορά: {ago}",area_not_found:'Ο χώρος "{area}" δεν βρέθηκε.',no_label_match:"Καμία οντότητα σε αυτόν τον χώρο δεν έχει την ετικέτα {labels}. Πρόσθεσέ την από Ρυθμίσεις → Χώροι, ετικέτες & ζώνες → Ετικέτες.",pick_area:"Επίλεξε χώρο στον επεξεργαστή της κάρτας.",switch_on:"{n} διακόπτης on",switches_on_n:"{n} διακόπτες on",switches_off_all:"Διακόπτες off",turn_all_on:"Όλα on",turn_all_off:"Όλα off",open_all:"Άνοιγμα όλων",close_all:"Κλείσιμο όλων",pause_all:"Παύση όλων",n_of_m_active:"{n} από {m} ενεργά",close:"Κλείσιμο",toggle_light:"Εναλλαγή {name}",g_switches:"Διακόπτες & πρίζες",preset_lights_toggle:"Φώτα",preset_lights_on:"Άναμμα φώτων",preset_lights_off:"Σβήσιμο φώτων",preset_covers_open:"Άνοιγμα ρολών",preset_covers_close:"Κλείσιμο ρολών",preset_fans_off:"Ανεμιστήρες off",preset_media_stop:"Stop media",preset_vacuum_area:"Σκούπισμα",preset_everything_off:"Όλα off",confirm_vacuum:"Να σκουπίσει η σκούπα τον χώρο {area};",confirm_everything_off:"Να σβήσουν όλα στον χώρο {area};",room_attention:"Χρειάζονται προσοχή",room_status:"Παρουσία & ανοίγματα",room_sensors:"Αισθητήρες",room_other:"Άλλα",room_search:"Αναζήτηση στον χώρο",room_clear_search:"Καθαρισμός αναζήτησης",room_show_more:"Εμφάνιση άλλων {n}",room_show_less:"Λιγότερα",room_no_results:"Κανένα αποτέλεσμα για «{q}»",room_empty:"Δεν υπάρχουν οντότητες για εμφάνιση σε αυτόν τον χώρο.",reason_low_battery:"Χαμηλή μπαταρία",reason_unavailable:"Μη διαθέσιμο",g_presence:"Παρουσία",g_motion:"Κίνηση",g_doors:"Πόρτες",g_windows:"Παράθυρα",g_covers:"Ρολά",g_locks:"Κλειδαριές",g_lights:"Φώτα",g_fans:"Ανεμιστήρες",g_media:"Media",g_climate:"Κλιματισμός",g_alerts:"Ειδοποιήσεις ασφαλείας",g_batteries:"Μπαταρίες"}};function Qe(e,t,o={}){const i=(e?.locale?.language||e?.language||"en").split("-")[0];let n=Ze[i]?.[t]??Ke[t]??t;for(const[e,t]of Object.entries(o))n=n.replace(`{${e}}`,String(t));return n}const et=["lights_toggle","lights_on","lights_off","covers_open","covers_close","fans_off","media_stop","vacuum_area","everything_off"],tt=new Set(["on","open","opening","playing","unlocked","cleaning","heat","cool","auto","heat_cool","dry","fan_only"]);function ot(e,t,o={}){return{action:"perform-action",perform_action:e,target:{area_id:t},...o}}const it=new Set(["light","switch","fan","media_player","input_boolean","climate"]);function nt(e){const t=e.split(".")[0];return"scene"===t||"script"===t?{action:"perform-action",perform_action:`${t}.turn_on`,target:{entity_id:e}}:"button"===t||"input_button"===t?{action:"perform-action",perform_action:`${t}.press`,target:{entity_id:e}}:"vacuum"===t?{action:"more-info",entity:e}:{action:"toggle",entity:e}}const at={light:"mdi:lightbulb",switch:"mdi:toggle-switch-variant",fan:"mdi:fan",cover:"mdi:window-shutter",scene:"mdi:palette",script:"mdi:script-text-play",media_player:"mdi:speaker",vacuum:"mdi:robot-vacuum",climate:"mdi:thermostat",lock:"mdi:lock",button:"mdi:gesture-tap-button"};function st(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function rt(e,t){return!t||e.active?e.color:"var(--secondary-text-color)"}function ct(e){return/^(#|rgb|hsl|var\()/i.test(e)?e:"primary"===e||"accent"===e?`var(--${e}-color)`:`var(--${e}-color, ${e})`}const lt=["attention","lights","climate","media","covers","locks","fans","switches","other","status","sensors"],dt={light:"lights",climate:"climate",humidifier:"climate",water_heater:"climate",media_player:"media",cover:"covers",valve:"covers",lock:"locks",fan:"fans",switch:"switches",binary_sensor:"status",person:"status",device_tracker:"status",sensor:"sensors"},ht=new Set(["update","automation","event","conversation","tts","stt","wake_word","todo","notify","ai_task"]),pt=new Set(["media_player"]),ut=e=>e.split(".")[0],mt=e=>e?.attributes.device_class;function _t(e){return!!e&&["on","playing","open","opening","closing","unlocked","cleaning","heat","cool","heat_cool","auto","dry","fan_only","home","detected"].includes(e.state)}const gt={occupancy:0,presence:0,motion:0,door:1,garage_door:1,window:1,opening:1},ft=["temperature","humidity","carbon_dioxide","pm25","pm10","volatile_organic_compounds","volatile_organic_compounds_parts","illuminance","pressure","sound_pressure","power","energy"];function vt(e,t){return e.states[t]?.attributes.friendly_name??t}const bt=e=>(t,o)=>vt(e,t).localeCompare(vt(e,o),void 0,{numeric:!0,sensitivity:"base"});function yt(e,t){const o=bt(e),i=t=>Number(_t(e.states[t]));switch(t.kind){case"tiles":t.entities.sort((e,t)=>i(t)-i(e)||o(e,t));break;case"status":{const n=t=>gt[mt(e.states[t])??""]??2;t.entities.sort((e,t)=>i(t)-i(e)||n(e)-n(t)||o(e,t));break}case"stats":{const i=t=>{const o=e.states[t],i=ft.indexOf(mt(o)??"");return((e=>""!==e.state.trim()&&!Number.isNaN(Number(e.state)))(o)?0:100)+(-1===i?ft.length:i)};t.entities.sort((e,t)=>i(e)-i(t)||o(e,t));break}}}function wt(e,t){if(!e||"battery"!==mt(e))return!1;if("binary_sensor"===ut(e.entity_id))return"on"===e.state;if("sensor"!==ut(e.entity_id))return!1;const o=Number(e.state);return!Number.isNaN(o)&&""!==e.state.trim()&&o<=t}const xt={scene:"scene.turn_on",script:"script.turn_on",button:"button.press",input_button:"input_button.press"};function $t(e,t,o){const i=ut(e),n={type:"tile",entity:e,name:o},a=xt[i];if(a){const o={action:"perform-action",perform_action:a,target:{entity_id:e}};let s={};return"script"===i?"off"===t?.state&&(s=t.attributes.last_triggered?{state_content:"last_triggered"}:{hide_state:!0}):"unknown"===t?.state&&(s={hide_state:!0}),{...n,...s,tap_action:o,icon_tap_action:o,hold_action:{action:"more-info"}}}const s=[];if("light"===i){const e=t?.attributes.supported_color_modes??[];"on"===t?.state&&e.some(e=>"onoff"!==e)&&s.push({type:"light-brightness"})}else"cover"===i?s.push({type:"cover-open-close"}):"climate"===i?s.push({type:"target-temperature"}):"media_player"===i&&s.push({type:"media-player-playback"});return{...n,...s.length?{features:s,features_position:"light"===i||"climate"===i?"inline":"bottom"}:{}}}function kt(e,t){if(!t)return e;const o=t.trim();if(!o||e.length<=o.length)return e;if(e.toLowerCase().startsWith(o.toLowerCase())&&/[\s:\-–]/.test(e.charAt(o.length))){const t=e.slice(o.length).replace(/^[\s:\-–]+/,"").trim();return t?(e=>e?e.charAt(0).toUpperCase()+e.slice(1):e)(t):e}return e}function At(e,t,o,i){const n=e.areas?.[t]?.name,a={};for(const t of i)a[t]={name:kt(vt(e,t),n)};const s=o.map(t=>{const o=kt(vt(e,t),n),i=(t=>{const o=e.entities?.[t]?.device_id,i=o?e.devices?.[o]:void 0;return i?.name_by_user??i?.name??void 0})(t);return{id:t,short:kt(o,i),noArea:o,device:i}}),r=new Map;for(const e of s)r.set(e.short.toLowerCase(),(r.get(e.short.toLowerCase())??0)+1);for(const e of s){const t=(r.get(e.short.toLowerCase())??0)>1;a[e.id]=t&&e.device&&e.short!==e.noArea?{name:e.short,sub:e.device}:{name:t?e.noArea:e.short}}return a}const St=_e(class extends ge{constructor(e){if(super(e),e.type!==me)throw new Error("actionHandler must be used on an element")}update(e,[t]){const o=e.element;return o.__apcOptions=t??{},function(e){if(e.__apcBound)return;let t,o;e.__apcBound=!0;let i=!1,n=0,a=0;const s=t=>e.dispatchEvent(new CustomEvent("apc-action",{detail:{action:t},bubbles:!1,composed:!1})),r=()=>{t&&window.clearTimeout(t),t=void 0};e.addEventListener("pointerdown",o=>{e.__apcOptions?.disabled||0!==o.button||(i=!1,n=o.clientX,a=o.clientY,e.__apcOptions?.hasHold&&(t=window.setTimeout(()=>{i=!0,t=void 0,navigator.vibrate&&navigator.vibrate(30),s("hold")},500)))}),e.addEventListener("pointermove",e=>{t&&(Math.abs(e.clientX-n)>10||Math.abs(e.clientY-a)>10)&&r()}),e.addEventListener("pointercancel",r),e.addEventListener("pointerleave",r),e.addEventListener("contextmenu",t=>{e.__apcOptions?.hasHold&&t.preventDefault()}),e.addEventListener("pointerup",n=>{if(e.__apcOptions?.disabled||0!==n.button)return;const a=!!t;r(),i?i=!1:!a&&e.__apcOptions?.hasHold||(e.__apcOptions?.hasDoubleTap?o?(window.clearTimeout(o),o=void 0,s("double_tap")):o=window.setTimeout(()=>{o=void 0,s("tap")},250):s("tap"))}),e.addEventListener("keydown",t=>{e.__apcOptions?.disabled||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),s("tap"))})}(o),W}render(e){return W}}),Ct=s`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then the value this card always used. Without the Pulse theme nothing changes. */
    --apc-accent: var(--pulse-accent, var(--primary-color));
    /* Colours with a meaning: on (lights), needs a look, problem, all good, information. */
    --apc-amber: var(--pulse-active, var(--amber-color, #ffc107));
    --apc-orange: var(--pulse-warn, var(--orange-color, #ff9800));
    --apc-red: var(--pulse-bad, var(--red-color, #f44336));
    --apc-green: var(--pulse-ok, var(--green-color, #4caf50));
    --apc-blue: var(--pulse-info, var(--blue-color, #2196f3));
    /* Category colours: Home Assistant's palette (the Pulse theme mutes it). */
    --apc-deep-orange: var(--deep-orange-color, #ff6f22);
    --apc-light-blue: var(--light-blue-color, #03a9f4);
    --apc-cyan: var(--cyan-color, #00bcd4);
    --apc-teal: var(--teal-color, #009688);
    --apc-indigo: var(--indigo-color, #3f51b5);
    --apc-purple: var(--purple-color, #926bc7);
    /* Climate colouring: cold / warm, dry / humid. */
    --apc-temp-low: var(--pulse-cold, var(--apc-blue));
    --apc-temp-high: var(--pulse-warm, var(--apc-red));
    --apc-hum-low: var(--pulse-dry, #8fa4ae); /* white is invisible on a light card, so light themes get a pale blue-grey */
    --apc-hum-high: var(--pulse-humid, var(--apc-blue));
    /* Glow and the main light's icon when the light has no colour of its own; the card sets both inline
       when it does. --apc-glow-scale lets the theme soften every glow (Pulse's glow-alpha vs. our 0.16). */
    --apc-glow-rgb: var(--rgb-pulse-active, 255, 193, 7);
    --apc-light-rgb: var(--rgb-pulse-active, 255, 193, 7);
    --apc-glow-alpha: 0.16;
    --apc-glow-scale: calc(var(--pulse-glow-alpha, 0.16) / 0.16);
    --apc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --apc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    --apc-neutral-bg-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --apc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --apc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --apc-chip-height: var(--pulse-chip-height, 30px);
    --apc-gap: var(--pulse-gap, 12px);
    --apc-pad: var(--pulse-pad, 12px);
    /* Motion: the theme's rhythm, else the durations the card always used. */
    --apc-motion-fast: var(--pulse-motion-fast, 120ms);
    --apc-motion-normal: var(--pulse-motion-normal, 200ms);
    --apc-motion-slow: var(--pulse-motion-slow, 300ms);
    --apc-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }
  :host([dark]) {
    --apc-hum-low: var(--pulse-dry, #ffffff);
  }

  ha-card {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    container-type: inline-size;
    transition: box-shadow var(--apc-motion-slow) var(--apc-ease), border-color var(--apc-motion-slow) var(--apc-ease);
  }
  /* The banner carries the alert; the card's own edge (if the theme draws one) only turns red. */
  ha-card.alerting {
    border-color: var(--apc-red);
  }

  /* Ambient layers */
  .picture {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.32;
    -webkit-mask-image: linear-gradient(to left, #000 0%, transparent 75%);
    mask-image: linear-gradient(to left, #000 0%, transparent 75%);
    pointer-events: none;
  }
  .glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity calc(var(--apc-motion-slow) * 2) var(--apc-ease);
    background: radial-gradient(
      140% 100% at 0% 0%,
      rgba(var(--apc-glow-rgb), calc(var(--apc-glow-alpha) * var(--apc-glow-scale))) 0%,
      transparent 58%
    );
  }
  .glow.on {
    opacity: 1;
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--apc-gap);
    padding: var(--apc-pad);
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    border-radius: var(--apc-control-radius);
    outline: none;
  }
  .header.clickable {
    cursor: pointer;
  }
  .header.clickable:focus-visible {
    box-shadow: 0 0 0 2px var(--apc-accent);
  }
  .area-icon {
    position: relative;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    transition: background-color var(--apc-motion-slow) var(--apc-ease), color var(--apc-motion-slow) var(--apc-ease);
    --mdc-icon-size: 24px;
  }
  .area-icon.occupied {
    background: color-mix(in srgb, var(--apc-accent) 20%, transparent);
    color: var(--apc-accent);
  }
  .area-icon.linked {
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color var(--apc-motion-slow) var(--apc-ease), color var(--apc-motion-slow) var(--apc-ease),
      transform var(--apc-motion-fast) var(--apc-ease);
  }
  .area-icon.linked:hover { background: var(--apc-neutral-bg-hover); }
  .area-icon.linked:active { transform: scale(0.94); }
  .area-icon.linked:focus-visible { box-shadow: 0 0 0 2px var(--apc-accent); }
  .area-icon.light-on,
  .area-icon.light-on:hover {
    background: rgba(var(--apc-light-rgb), 0.24);
    color: rgb(var(--apc-light-rgb));
  }
  .presence-dot {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--apc-green);
    border: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
    box-sizing: border-box;
  }
  .presence-dot::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid var(--apc-green);
    opacity: 0;
    /* Once, when presence starts (the dot is created then); a constant ping is decoration. */
    animation: apc-ping 2.4s cubic-bezier(0, 0, 0.2, 1) 1;
  }
  @keyframes apc-ping {
    0% { transform: scale(1); opacity: 0.7; }
    80%, 100% { transform: scale(2.2); opacity: 0; }
  }
  .titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .name {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary .dot {
    margin: 0 4px;
    opacity: 0.6;
  }

  .climate {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    font-variant-numeric: tabular-nums;
  }
  .temp {
    display: flex;
    align-items: flex-start;
    font-size: 24px;
    line-height: 26px;
    font-weight: 400;
    letter-spacing: -0.5px;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .temp .unit {
    font-size: 13px;
    line-height: 18px;
    margin-left: 1px;
    color: var(--secondary-text-color);
    letter-spacing: 0;
  }
  .temp.low { color: var(--apc-temp-low); }
  .temp.high { color: var(--apc-temp-high); }
  .hum {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    cursor: pointer;
    --mdc-icon-size: 14px;
  }
  .hum.low { color: var(--apc-hum-low); }
  .hum.high { color: var(--apc-hum-high); }
  /* Humidity and the sensor_classes readings: one small line under the temperature that wraps. */
  .readings {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    column-gap: 8px;
    row-gap: 0;
    max-width: 150px;
  }
  .hum { white-space: nowrap; }
  .reading.warn { color: var(--apc-orange); }
  .reading.bad { color: var(--apc-red); }

  /* Alert banner */
  .alert-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: var(--apc-control-radius);
    background: color-mix(in srgb, var(--apc-red) 14%, transparent);
    color: var(--apc-red);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    --mdc-icon-size: 20px;
  }
  .alert-banner ha-icon {
    /* A few blinks when the alert appears, then still: the banner itself keeps the attention. */
    animation: apc-blink 1.4s ease-in-out 3;
  }
  .alert-banner .text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @keyframes apc-blink {
    50% { opacity: 0.35; }
  }

  /* Status chips: one row capped at max_chips, or (max_chips: 0) two rows: openings & motion, then everything else */
  .chip-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    --c: var(--secondary-text-color);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--apc-chip-height);
    padding: 0 12px 0 9px;
    border-radius: calc(var(--apc-chip-height) / 2);
    border: none;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    background: var(--apc-neutral-bg);
    cursor: pointer;
    white-space: nowrap;
    max-width: 100%;
    box-sizing: border-box;
    transition: background-color var(--apc-motion-normal) var(--apc-ease), color var(--apc-motion-normal) var(--apc-ease),
      transform var(--apc-motion-fast) var(--apc-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover { background: var(--apc-neutral-bg-hover); }
  .chip:active { transform: scale(0.96); }
  .chip:focus-visible { outline: 2px solid var(--c); outline-offset: 1px; }
  .chip.active {
    /* Pull the hue toward the text colour so labels stay legible in light and dark themes. */
    color: color-mix(in srgb, var(--c) 72%, var(--primary-text-color));
    background: color-mix(in srgb, var(--c) 16%, transparent);
  }
  .chip.active:hover { background: color-mix(in srgb, var(--c) 24%, transparent); }
  .chip.selected { box-shadow: inset 0 0 0 1.5px var(--c); }
  /* chip_colors: state (default). Neutral fill and text; only the icon carries the meaning (--c). */
  .chip.calm.active {
    color: var(--primary-text-color);
    background: var(--apc-neutral-bg);
  }
  .chip.calm.active:hover { background: var(--apc-neutral-bg-hover); }
  .chip.calm.active ha-icon { color: var(--c); }
  /* "+N": the chips that didn't fit on the face; opens the room popup. */
  .chip.more { padding: 0 11px; font-variant-numeric: tabular-nums; }
  .chip .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Quick actions */
  .actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
    gap: 8px;
  }
  .action {
    --c: var(--apc-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 42px;
    padding: 0 10px;
    border: none;
    border-radius: var(--apc-control-radius);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--apc-neutral-bg);
    cursor: pointer;
    min-width: 0;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color var(--apc-motion-normal) var(--apc-ease), color var(--apc-motion-normal) var(--apc-ease),
      transform var(--apc-motion-fast) var(--apc-ease);
    --mdc-icon-size: 20px;
  }
  /* --apc-action-icon: neutral when idle with chip_colors: state (actionIconColor). */
  .action ha-icon { color: var(--apc-action-icon, var(--c)); flex: none; }
  .action:hover { background: var(--apc-neutral-bg-hover); }
  .action:active { transform: scale(0.96); }
  .action:focus-visible { outline: 2px solid var(--c); outline-offset: 1px; }
  /* Like an active tile: a stronger neutral fill, colour stays on the icon. */
  .action.active,
  .action.active:hover {
    background: var(--apc-neutral-bg-strong);
  }
  .action[disabled] { opacity: 0.4; cursor: default; pointer-events: none; }
  .action .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Four or more actions: stacked icon-over-label buttons so a row of 4–5 fits */
  .actions.dense { grid-template-columns: repeat(auto-fit, minmax(64px, 1fr)); gap: 6px; }
  .actions.dense .action {
    flex-direction: column;
    height: 58px;
    gap: 3px;
    padding: 0 4px;
    font-size: 11px;
  }
  .actions.dense .action .label { max-width: 100%; }

  /* Narrow cards: icon-only actions */
  @container (max-width: 300px) {
    .actions, .actions.dense { grid-template-columns: repeat(auto-fit, minmax(44px, 1fr)); }
    .action, .actions.dense .action { height: 42px; }
    .action .label { display: none; }
  }

  /* Compact layout */
  :host([layout="compact"]) .content { gap: 8px; padding: 10px; }
  :host([layout="compact"]) .area-icon { width: 36px; height: 36px; --mdc-icon-size: 20px; }
  :host([layout="compact"]) .name { font-size: 14px; line-height: 20px; }
  :host([layout="compact"]) .temp { font-size: 18px; line-height: 20px; }
  :host([layout="compact"]) .chip { height: 26px; padding: 0 9px 0 7px; }
  :host([layout="compact"]) .chip:not(.active) .label { display: none; }
  :host([layout="compact"]) .chip:not(.active) { padding: 0 6px; }
  :host([layout="compact"]) .chip.more { padding: 0 9px; }
  :host([layout="compact"]) .chip.more .label { display: inline; }
  :host([layout="compact"]) .action { height: 36px; }
  :host([layout="compact"]) .actions,
  :host([layout="compact"]) .actions.dense { grid-template-columns: repeat(auto-fit, minmax(40px, 1fr)); }
  :host([layout="compact"]) .actions.dense .action { height: 36px; }
  :host([layout="compact"]) .action .label { display: none; }

  .hint {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: var(--apc-control-radius);
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    line-height: 16px;
    --mdc-icon-size: 18px;
  }
  .hint ha-icon { flex: none; }

  .warning {
    padding: 16px;
    color: var(--warning-color, #ffa600);
    display: flex;
    gap: 8px;
    align-items: center;
  }

  @media (prefers-reduced-motion: reduce) {
    .presence-dot::after, .alert-banner ha-icon { animation: none; }
  }
`,Et=s`
  dialog.apc-popup {
    --c: var(--apc-accent);
    padding: 0;
    border: none;
    background: transparent;
    width: min(640px, calc(100vw - 32px));
    max-width: none;
    max-height: min(80vh, 760px);
    color: var(--primary-text-color);
    overflow: visible;
  }
  dialog.apc-popup::backdrop {
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  dialog.apc-popup[open] .popup-surface {
    animation: apc-pop var(--apc-motion-normal, 200ms) cubic-bezier(0.2, 0.9, 0.3, 1.1);
  }
  @keyframes apc-pop {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
  }
  .popup-surface {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: min(80vh, 760px);
    padding: 20px;
    box-sizing: border-box;
    border-radius: var(--ha-dialog-border-radius, 28px);
    background: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
  .popup-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .popup-icon {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 22px;
  }
  .popup-icon.active {
    background: color-mix(in srgb, var(--c) 18%, transparent);
    color: var(--c);
  }
  .popup-titles { flex: 1; min-width: 0; }
  .popup-title { font-size: 20px; line-height: 26px; font-weight: 500; }
  .popup-sub { font-size: 13px; color: var(--secondary-text-color); }
  .popup-close {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 22px;
  }
  .popup-close:hover { background: var(--apc-neutral-bg); }
  .popup-bulk { display: flex; gap: 8px; flex-wrap: wrap; }
  .bulk {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px 0 10px;
    border: none;
    border-radius: 18px;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: color-mix(in srgb, var(--c) 72%, var(--primary-text-color));
    background: color-mix(in srgb, var(--c) 16%, transparent);
    cursor: pointer;
    --mdc-icon-size: 18px;
  }
  .bulk:hover { background: color-mix(in srgb, var(--c) 24%, transparent); }
  /* chip_colors: state: a bulk button is an action, not a state. Neutral fill and text, the icon in the accent. */
  .bulk.calm { color: var(--primary-text-color); background: var(--apc-neutral-bg); }
  .bulk.calm:hover { background: var(--apc-neutral-bg-hover); }
  .bulk.calm ha-icon { color: var(--apc-accent); }
  .popup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
    gap: 8px;
    overflow-y: auto;
    padding: 2px;
    margin: -2px;
  }

  /* Fallback tiles (only when HA's card helpers are unavailable) */
  .mini-tile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color);
    background: var(--ha-card-background, var(--card-background-color));
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    outline: none;
    --mdc-icon-size: 20px;
  }
  .mini-tile:focus-visible { box-shadow: 0 0 0 2px var(--c); }
  .mt-icon {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
  }
  .mini-tile.active .mt-icon {
    background: color-mix(in srgb, var(--c) 20%, transparent);
    color: var(--c);
  }
  .mt-text { min-width: 0; }
  .mt-name, .mt-state { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mt-name { font-size: 14px; font-weight: 500; line-height: 20px; }
  .mt-state { font-size: 12px; color: var(--secondary-text-color); line-height: 16px; }


  /* ---- Room popup -------------------------------------------------------- */
  dialog.apc-popup.room {
    width: min(760px, calc(100vw - 32px));
    max-height: none;
    height: min(88vh, 880px);
  }
  .room-surface {
    height: 100%;
    max-height: none;
    padding: 0;
    gap: 0;
    overflow: hidden;
  }
  .sheet-handle { display: none; }
  .room-head {
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 12px 12px 20px;
  }
  .room-icon {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 24px;
  }
  .room-icon.light-on {
    color: rgb(var(--room-rgb, var(--rgb-pulse-active, 255, 193, 7)));
    background: rgba(var(--room-rgb, var(--rgb-pulse-active, 255, 193, 7)), 0.18);
  }
  .room-head .climate { flex: none; }
  .room-head .popup-close { width: 44px; height: 44px; }
  .popup-sub .dot { margin: 0 4px; }

  .room-search {
    flex: none;
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 20px 8px;
    height: 44px;
    border-radius: 22px;
    background: var(--apc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  .room-search > ha-icon { position: absolute; left: 14px; pointer-events: none; }
  .room-search input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 0 44px 0 44px;
    font: inherit;
    font-size: 15px;
    color: var(--primary-text-color);
    -webkit-appearance: none;
    appearance: none;
  }
  .room-search input::-webkit-search-cancel-button { display: none; }
  .room-search:focus-within { box-shadow: 0 0 0 2px color-mix(in srgb, var(--apc-accent) 70%, transparent); }
  .search-clear {
    position: absolute;
    right: 2px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .room-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 20px 20px;
    -webkit-overflow-scrolling: touch;
  }
  .room-empty {
    padding: 40px 12px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 14px;
  }

  .room-sec { padding-bottom: 8px; }
  /* Not sticky: a sticky header needs a painted background, which stacks on a translucent dialog
     (Pulse Glass) and shows as a lighter band, and backdrop blur doesn't apply inside the dialog. */
  .sec-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
  }
  .sec-toggle {
    flex: 1;
    min-width: 0;
    min-height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 4px 0 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--primary-text-color);
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    --mdc-icon-size: 20px;
  }
  .sec-toggle:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
  /* chip_colors: state sets --apc-sec-icon (neutral, red for attention); category keeps the section colour. */
  .sec-icon { color: var(--apc-sec-icon, var(--c)); flex: none; }
  .sec-title { font-size: 15px; font-weight: 500; letter-spacing: 0.01em; }
  .sec-count { font-size: 12px; color: var(--secondary-text-color); }
  .sec-chevron { margin-left: auto; color: var(--secondary-text-color); flex: none; }
  .bulk.small { height: 32px; padding: 0 12px 0 8px; font-size: 12px; flex: none; --mdc-icon-size: 16px; }

  .sec-grid { display: grid; gap: 8px; padding: 2px 0 4px; }
  .sec-grid.tiles { grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); }
  .sec-grid.status { grid-template-columns: repeat(auto-fill, minmax(min(230px, 100%), 1fr)); }
  .sec-grid.stats { grid-template-columns: repeat(auto-fill, minmax(min(140px, 100%), 1fr)); }
  .sec-grid.status .mini-tile { padding: 6px 10px; min-height: 44px; box-sizing: border-box; }
  .sec-grid.status .mt-icon { width: 32px; height: 32px; }
  .tile-skel {
    min-height: 56px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--apc-neutral-bg);
    animation: apc-pulse 1.2s ease-in-out infinite alternate;
  }
  @keyframes apc-pulse { to { opacity: 0.5; } }
  .sec-more {
    display: block;
    width: 100%;
    min-height: 40px;
    margin-top: 4px;
    border: none;
    border-radius: 12px;
    background: none;
    color: var(--apc-accent);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }
  .sec-more:hover { background: var(--apc-neutral-bg); }

  /* Stat cells: the value is what you look for. */
  .stat-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    min-height: 64px;
    padding: 8px 12px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--apc-neutral-bg);
    color: var(--primary-text-color);
    font: inherit;
    text-align: left;
    cursor: pointer;
    min-width: 0;
    --mdc-icon-size: 16px;
  }
  .stat-cell:hover { background: var(--apc-neutral-bg-hover); }
  .stat-cell:focus-visible { outline: 2px solid var(--apc-accent); outline-offset: 1px; }
  .sc-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    min-width: 0;
  }
  .sc-label ha-state-icon { flex: none; }
  .sc-name, .sc-sub, .sc-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sc-value { font-size: 18px; line-height: 24px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .sc-sub { font-size: 11px; line-height: 14px; color: var(--secondary-text-color); opacity: 0.8; }
  .stat-cell.t-low .sc-value { color: var(--apc-temp-low); }
  .stat-cell.t-high .sc-value { color: var(--apc-temp-high); }
  .stat-cell.h-low .sc-value { color: var(--apc-hum-low); }
  .stat-cell.h-high .sc-value { color: var(--apc-hum-high); }
  .stat-cell.warn .sc-value { color: var(--apc-orange); }
  .stat-cell.bad .sc-value { color: var(--apc-red); }

  /* Phones: bottom sheet */
  @media (max-width: 600px) {
    dialog.apc-popup {
      width: 100vw;
      max-height: 85vh;
      margin: auto 0 0 0;
    }
    .popup-surface {
      max-height: 85vh;
      border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0;
      padding-bottom: calc(20px + env(safe-area-inset-bottom));
    }
    .popup-grid { grid-template-columns: 1fr 1fr; }

    /* Room popup: nearly full height, one column of controls, two columns of sensor values. */
    dialog.apc-popup.room {
      width: 100vw;
      height: 92vh;
      height: 92dvh;
      max-height: none;
      margin: auto 0 0 0;
    }
    .room-surface { padding-bottom: 0; border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0; }
    .sheet-handle {
      display: block;
      flex: none;
      width: 36px;
      height: 4px;
      margin: 8px auto 0;
      border-radius: 2px;
      background: var(--divider-color);
    }
    .room-head { padding: 8px 8px 8px 16px; gap: 8px; }
    .room-head .temp { font-size: 20px; line-height: 22px; }
    .room-search { margin: 0 16px 8px; }
    .room-body { padding: 0 16px calc(16px + env(safe-area-inset-bottom)); }
    .sec-grid.tiles, .sec-grid.status { grid-template-columns: 1fr; }
    .sec-grid.stats { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 360px) {
    .popup-grid { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog.apc-popup[open] .popup-surface { animation: none; }
  }
`,Mt=[...Oe,"vibration","cold","heat","sound","light"];function Ot(e){const t={};for(const[o,i]of Object.entries(e))null!=i&&""!==i&&(Array.isArray(i)&&0===i.length||(t[o]=i));return t}class Nt extends re{constructor(){super(...arguments),this._open=new Set,this._ready=!1,this._t=(e,t)=>Qe(this.hass,e,t),this._label=e=>{const t={area:"ed_area",name:"ed_name",icon:"ed_icon",color:"ed_color",layout:"ed_layout",show_picture:"ed_show_picture",room_popup:"ed_room_popup",show_inactive:"ed_show_inactive",chip_colors:"ed_chip_colors",max_chips:"ed_max_chips",temperature_entity:"ed_temperature_entity",humidity_entity:"ed_humidity_entity",sensor_classes:"ed_sensor_classes",comfort_temp_min:"ed_comfort_temp_min",comfort_temp_max:"ed_comfort_temp_max",comfort_hum_min:"ed_comfort_hum_min",comfort_hum_max:"ed_comfort_hum_max",groups:"ed_groups",top_groups:"ed_top_groups",label_include:"ed_label_include",label_exclude:"ed_label_exclude",label_match:"ed_label_match",label_from_device:"ed_label_from_device",main_light:"ed_main_light",link_main_light:"ed_link_main_light",color_temp_low:"ed_color_temp_low",color_temp_high:"ed_color_temp_high",color_hum_low:"ed_color_hum_low",color_hum_high:"ed_color_hum_high",alert_classes:"ed_alert_classes",presence_entities:"ed_presence_entities",exclude_entities:"ed_exclude_entities",battery_threshold:"ed_battery_threshold",tap_action:"ed_tap_action",hold_action:"ed_hold_action",double_tap_action:"ed_double_tap_action",preset:"ed_preset",entity:"ed_entity"};return t[e.name]?this._t(t[e.name]):e.name}}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const e=await(window.loadCardHelpers?.()),t=await(e?.createCardElement({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch{}}().then(()=>this._ready=!0)}setConfig(e){this._config=e}_mainSchema(){const e=this._t;return[{name:"area",required:!0,selector:{area:{}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"color",selector:{ui_color:{}}},{name:"layout",selector:{select:{mode:"dropdown",options:[{value:"default",label:e("ed_layout_default")},{value:"compact",label:e("ed_layout_compact")}]}}}]},{name:"show_picture",selector:{boolean:{}}},{name:"room_popup",selector:{boolean:{}}},{name:"link_main_light",selector:{boolean:{}}},{name:"main_light",selector:{entity:{filter:{domain:"light"}}}},{type:"expandable",name:"",title:e("ed_section_climate"),icon:"mdi:thermometer",flatten:!0,schema:[{name:"temperature_entity",selector:{entity:{filter:{domain:"sensor",device_class:"temperature"}}}},{name:"humidity_entity",selector:{entity:{filter:{domain:"sensor",device_class:"humidity"}}}},{type:"grid",name:"",schema:[{name:"comfort_temp_min",selector:{number:{mode:"box",step:.5}}},{name:"comfort_temp_max",selector:{number:{mode:"box",step:.5}}},{name:"comfort_hum_min",selector:{number:{mode:"box",min:0,max:100}}},{name:"comfort_hum_max",selector:{number:{mode:"box",min:0,max:100}}}]},{type:"grid",name:"",schema:[{name:"color_temp_low",selector:{ui_color:{}}},{name:"color_temp_high",selector:{ui_color:{}}},{name:"color_hum_low",selector:{ui_color:{}}},{name:"color_hum_high",selector:{ui_color:{}}}]},{name:"sensor_classes",selector:{select:{multiple:!0,mode:"list",options:Te.map(e=>({value:e,label:e.replace(/_/g," ")}))}}}]},{type:"expandable",name:"",title:e("ed_section_status"),icon:"mdi:list-status",flatten:!0,schema:[{name:"show_inactive",selector:{boolean:{}}},{name:"chip_colors",selector:{select:{mode:"dropdown",options:[{value:"state",label:e("ed_chip_colors_state")},{value:"category",label:e("ed_chip_colors_category")}]}}},{name:"max_chips",selector:{number:{min:0,max:12,mode:"box"}}},{name:"groups",selector:{select:{multiple:!0,reorder:!0,mode:"list",options:Ne.filter(e=>"presence"!==e).map(t=>({value:t,label:e(`g_${t}`)}))}}},{name:"top_groups",selector:{select:{multiple:!0,reorder:!0,mode:"list",options:Ne.filter(e=>"presence"!==e&&"alerts"!==e).map(t=>({value:t,label:e(`g_${t}`)}))}}},{name:"alert_classes",selector:{select:{multiple:!0,mode:"dropdown",options:Mt.map(e=>({value:e,label:e.replace(/_/g," ")}))}}},{name:"presence_entities",selector:{entity:{multiple:!0,filter:[{domain:"binary_sensor"},{domain:"person"},{domain:"input_boolean"}]}}},{name:"exclude_entities",selector:{entity:{multiple:!0}}},{name:"battery_threshold",selector:{number:{min:1,max:100,mode:"slider",unit_of_measurement:"%"}}}]},{type:"expandable",name:"",title:e("ed_section_labels"),icon:"mdi:label-multiple-outline",flatten:!0,schema:[{name:"label_include",selector:{label:{multiple:!0}}},{name:"label_exclude",selector:{label:{multiple:!0}}},{name:"label_match",selector:{select:{mode:"dropdown",options:[{value:"any",label:e("ed_label_match_any")},{value:"all",label:e("ed_label_match_all")}]}}},{name:"label_from_device",selector:{boolean:{}}}]},{type:"expandable",name:"",title:e("ed_section_interactions"),icon:"mdi:gesture-tap",flatten:!0,schema:[{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}]}_actionSchema(e){const t=this._t;return[{name:"preset",selector:{select:{mode:"dropdown",options:[{value:"",label:t("ed_preset_none")},...et.map(e=>({value:e,label:t(`preset_${e}`)}))]}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"entity",selector:{entity:"vacuum_area"===e.preset?{filter:{domain:"vacuum"}}:{}}},{name:"color",selector:{ui_color:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}}]}_formData(){const e=this._config,t=e=>Array.isArray(e)?{min:e[0],max:e[1]}:e??{},o=t(e.comfort_temperature),i=t(e.comfort_humidity);return{layout:"default",show_picture:!0,room_popup:!0,show_inactive:!1,chip_colors:"state",max_chips:3,battery_threshold:20,link_main_light:!0,top_groups:ze,...e,label_include:ke(e.label_filter?.include),label_exclude:ke(e.label_filter?.exclude),label_match:e.label_filter?.match??"any",label_from_device:e.label_filter?.from_device??!0,color_temp_low:e.colors?.temperature_low,color_temp_high:e.colors?.temperature_high,color_hum_low:e.colors?.humidity_low,color_hum_high:e.colors?.humidity_high,comfort_temp_min:o.min,comfort_temp_max:o.max,comfort_hum_min:i.min,comfort_hum_max:i.max}}_mainChanged(e){e.stopPropagation();const t={...e.detail.value},o=(e,t)=>void 0===e&&void 0===t?void 0:Ot({min:e,max:t}),i=o(t.comfort_temp_min,t.comfort_temp_max),n=o(t.comfort_hum_min,t.comfort_hum_max);delete t.comfort_temp_min,delete t.comfort_temp_max,delete t.comfort_hum_min,delete t.comfort_hum_max;const a=Ot({temperature_low:t.color_temp_low,temperature_high:t.color_temp_high,humidity_low:t.color_hum_low,humidity_high:t.color_hum_high});for(const e of["color_temp_low","color_temp_high","color_hum_low","color_hum_high"])delete t[e];const s=Ot({include:t.label_include,exclude:t.label_exclude,match:"all"===t.label_match?"all":void 0,from_device:!1!==t.label_from_device&&void 0});for(const e of["label_include","label_exclude","label_match","label_from_device"])delete t[e];t.label_filter=Object.keys(s).length?s:void 0,t.colors=Object.keys(a).length?a:void 0,JSON.stringify(t.top_groups)===JSON.stringify(ze)&&delete t.top_groups;const r=Ot({...t,comfort_temperature:i&&Object.keys(i).length?i:void 0,comfort_humidity:n&&Object.keys(n).length?n:void 0,actions:this._config?.actions});"default"===r.layout&&delete r.layout,!0===r.show_picture&&delete r.show_picture,!0===r.room_popup&&delete r.room_popup,!1===r.show_inactive&&delete r.show_inactive,"state"===r.chip_colors&&delete r.chip_colors,3===r.max_chips&&delete r.max_chips,20===r.battery_threshold&&delete r.battery_threshold,!0===r.link_main_light&&delete r.link_main_light,this._commit(r)}_actionChanged(e,t){t.stopPropagation();const o=[...this._config?.actions??[]];o[e]=Ot({...t.detail.value}),this._commit({...this._config,actions:o})}_addAction(){const e=[...this._config?.actions??[],{preset:"lights_toggle"}];this._open=new Set([...this._open,e.length-1]),this._commit({...this._config,actions:e})}_removeAction(e){const t=[...this._config?.actions??[]];t.splice(e,1),this._open=new Set,this._commit(Ot({...this._config,actions:t}))}_moveAction(e,t){const o=[...this._config?.actions??[]],i=e+t;i<0||i>=o.length||([o[e],o[i]]=[o[i],o[e]],this._open=new Set,this._commit({...this._config,actions:o}))}_toggleOpen(e){const t=new Set(this._open);t.has(e)?t.delete(e):t.add(e),this._open=t}_commit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config||!this._ready)return B;const e=this._config.actions??[];return F`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._mainSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>

      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:gesture-tap-button"></ha-icon>${this._t("ed_section_actions")}</div>
        ${e.map((t,o)=>this._renderAction(t,o,e.length))}
        <button class="add" @click=${this._addAction}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_action")}
        </button>
      </div>
    `}_renderAction(e,t,o){const i=this._open.has(t),n=e.name||(e.preset?this._t(`preset_${e.preset}`):e.entity)||this._t("ed_action_n",{n:t+1});return F`
      <div class="action-item">
        <div class="action-head">
          <button class="head-main" @click=${()=>this._toggleOpen(t)} aria-expanded=${String(i)}>
            <ha-icon .icon=${i?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
            <span>${n}</span>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_up")} ?disabled=${0===t} @click=${()=>this._moveAction(t,-1)}>
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_down")} ?disabled=${t===o-1} @click=${()=>this._moveAction(t,1)}>
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
          <button class="icon-btn danger" title=${this._t("ed_remove")} @click=${()=>this._removeAction(t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${i?F`
              <div class="action-body">
                ${"vacuum_area"===e.preset?F`<p class="hint">${this._t("ed_vacuum_hint")}</p>`:B}
                <ha-form
                  .hass=${this.hass}
                  .data=${{preset:"",...e}}
                  .schema=${this._actionSchema(e)}
                  .computeLabel=${this._label}
                  @value-changed=${e=>this._actionChanged(t,e)}
                ></ha-form>
              </div>
            `:B}
      </div>
    `}}Nt.styles=s`
    :host { display: block; }
    .section { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-weight: 500; font-size: 15px; color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-title ha-icon { color: var(--secondary-text-color); }
    .action-item {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
    }
    .action-head { display: flex; align-items: center; gap: 2px; padding: 4px; }
    button {
      font: inherit; color: var(--primary-text-color); background: none; border: none; cursor: pointer;
      border-radius: 8px; --mdc-icon-size: 20px;
    }
    button:hover:not([disabled]) { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    button[disabled] { opacity: 0.35; cursor: default; }
    .head-main {
      flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px; text-align: left; min-width: 0;
    }
    .head-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .icon-btn.danger ha-icon { color: var(--error-color, #db4437); }
    .action-body { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
    .hint { margin: 8px 0; font-size: 13px; color: var(--secondary-text-color); }
    .add {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; border: 1px dashed var(--divider-color); border-radius: 12px; color: var(--primary-color);
      font-weight: 500;
    }
  `,e([he({attribute:!1})],Nt.prototype,"hass",void 0),e([pe()],Nt.prototype,"_config",void 0),e([pe()],Nt.prototype,"_open",void 0),e([pe()],Nt.prototype,"_ready",void 0),customElements.get("area-pulse-card-editor")||customElements.define("area-pulse-card-editor",Nt);const zt={"":"var(--secondary-text-color)",on:"var(--apc-amber)",warn:"var(--apc-orange)",bad:"var(--apc-red)"},Tt={presence:{icon:"mdi:account",iconOff:"mdi:account-outline",color:"var(--apc-green)"},motion:{icon:"mdi:motion-sensor",iconOff:"mdi:motion-sensor-off",color:"var(--apc-cyan)"},doors:{icon:"mdi:door-open",iconOff:"mdi:door-closed",color:"var(--apc-orange)"},windows:{icon:"mdi:window-open-variant",iconOff:"mdi:window-closed-variant",color:"var(--apc-orange)"},covers:{icon:"mdi:window-shutter-open",iconOff:"mdi:window-shutter",color:"var(--apc-purple)"},locks:{icon:"mdi:lock-open-variant",iconOff:"mdi:lock",color:"var(--apc-deep-orange)"},lights:{icon:"mdi:lightbulb-on",iconOff:"mdi:lightbulb-outline",color:"var(--apc-amber)"},fans:{icon:"mdi:fan",iconOff:"mdi:fan-off",color:"var(--apc-light-blue)"},switches:{icon:"mdi:power-socket-eu",iconOff:"mdi:power-plug-off-outline",color:"var(--apc-teal)"},media:{icon:"mdi:play-circle",iconOff:"mdi:speaker",color:"var(--apc-indigo)"},climate:{icon:"mdi:thermostat",iconOff:"mdi:thermostat",color:"var(--apc-deep-orange)"},alerts:{icon:"mdi:alert",iconOff:"mdi:shield-check",color:"var(--apc-red)"},batteries:{icon:"mdi:battery-alert-variant-outline",iconOff:"mdi:battery",color:"var(--apc-red)"}},Pt={illuminance:"mdi:brightness-5",carbon_dioxide:"mdi:molecule-co2",pm25:"mdi:blur",pm10:"mdi:blur-radial",volatile_organic_compounds:"mdi:air-filter",volatile_organic_compounds_parts:"mdi:air-filter",pressure:"mdi:gauge",power:"mdi:flash",energy:"mdi:lightning-bolt",sound_pressure:"mdi:waveform",temperature:"mdi:thermometer",humidity:"mdi:water-percent"},Lt="mdi:texture-box";class jt extends re{constructor(){super(...arguments),this.layout="default",this.dark=!1,this._onDialogClosed=()=>{if(this._reopen){const e=this._reopen;this._reopen=void 0,"room"===e?this._openRoom(!0):this._openPopup(e)}},this._room=!1,this._roomLabels={},this._roomUi={query:"",collapsed:new Set,expanded:new Set},this._roomScroll=0,this._labelsRequested=!1,this._indexDeps=[],this._watched=new Set,this._stop=e=>e.stopPropagation(),this._tileSources=new WeakMap}static getConfigElement(){return document.createElement("area-pulse-card-editor")}static getStubConfig(e){const t=Object.values(e?.areas??{});return{area:t[0]?.area_id??"",actions:[{preset:"lights_toggle"},{preset:"everything_off"}]}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(e.actions&&!Array.isArray(e.actions))throw new Error("`actions` must be a list");if(e.label_filter&&("object"!=typeof e.label_filter||Array.isArray(e.label_filter)))throw new Error("`label_filter` must be a map with `include` and/or `exclude`");if(void 0!==e.chip_colors&&"state"!==e.chip_colors&&"category"!==e.chip_colors)throw new Error("`chip_colors` must be `state` or `category`");if(void 0!==e.max_chips&&!(Number.isInteger(e.max_chips)&&e.max_chips>=0))throw new Error("`max_chips` must be a whole number, 0 or more (0 shows every chip)");this._config={...e},this.layout="compact"===e.layout?"compact":"default",this._popup=void 0,this._room=!1,this._indexDeps=[]}getCardSize(){const e=this._config?.actions?.length?1:0;return"compact"===this.layout?2+e:3+e}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),3e4),window.addEventListener("dialog-closed",this._onDialogClosed)}disconnectedCallback(){super.disconnectedCallback(),this._ticker&&window.clearInterval(this._ticker),window.removeEventListener("dialog-closed",this._onDialogClosed)}shouldUpdate(e){if(!this._config)return!1;if(e.has("hass")&&this.hass){const e=this.hass;for(const t of this._tiles??[])this._syncTile(t,e);for(const t of this._roomTiles?.values()??[])this._syncTile(t,e)}if(!e.has("hass")||e.size>1)return!0;const t=e.get("hass"),o=this.hass;if(!t||!o)return!0;if(t.entities!==o.entities||t.devices!==o.devices||t.areas!==o.areas||t.locale!==o.locale||t.language!==o.language||t.themes!==o.themes)return!0;for(const e of this._watched)if(t.states[e]!==o.states[e])return!0;return!1}willUpdate(){const e=this.hass,t=this._config;if(!e||!t)return;this.dark=!!e.themes?.darkMode,this._ensureLabelRegistry();const o=[e.entities,e.devices,e.areas,t,this._labelRegistry];if(!this._index||o.some((e,t)=>e!==this._indexDeps[t])){this._labelFilter=Ce(t.label_filter,this._labelRegistry),this._index=je(e,t.area,t.exclude_entities??[],this._labelFilter),this._indexDeps=o;const i=e.areas?.[t.area];this._watched=function(e,t){const o=new Set(t.withDiagnostic);for(const t of[e.temperature_entity,e.humidity_entity,e.main_light,...e.presence_entities??[]])t&&o.add(t);for(const t of e.actions??[])t.entity&&o.add(t.entity);return o}(t,this._index),i?.temperature_entity_id&&this._watched.add(i.temperature_entity_id),i?.humidity_entity_id&&this._watched.add(i.humidity_entity_id)}}_ensureLabelRegistry(){var e;!this._labelsRequested&&this.hass&&Ae(this._config?.label_filter)&&(this._labelsRequested=!0,(e=this.hass,Me||(Me=e.callWS({type:"config/label_registry/list"}).catch(e=>{throw Me=void 0,e})),Me).then(e=>this._labelRegistry=e).catch(()=>{}))}_getIndex(){const{hass:e,_config:t}=this;return this._index??je(e,t.area,t.exclude_entities??[],Ce(t.label_filter,this._labelRegistry))}render(){const e=this.hass,t=this._config;if(!e||!t)return B;if(!t.area)return this._warning(Qe(e,"pick_area"));const o=e.areas?.[t.area];if(!o)return this._warning(Qe(e,"area_not_found",{area:t.area}));const i=this._getIndex(),n=qe(e,t,i),a=Fe(e,i,"temperature",t.temperature_entity??o.temperature_entity_id),s=Fe(e,i,"humidity",t.humidity_entity??o.humidity_entity_id),r=(t.sensor_classes??[]).map(t=>Fe(e,i,t)).filter(e=>!!e),c=(t.actions??[]).map(t=>function(e,t,o,i,n,a=!1){const s=o.name,r=(e,t,n={})=>a?{action:"perform-action",perform_action:e,target:{entity_id:[...i[t]?.entities??[]]},...n}:ot(e,o.area_id,n),c=(i.lights?.active.length??0)>0,l=t.entity?e.states[t.entity]:void 0;let d;switch(t.preset){case"lights_toggle":d={name:Qe(e,"preset_lights_toggle"),icon:c?"mdi:lightbulb-group":"mdi:lightbulb-group-off-outline",active:c,color:"var(--apc-amber)",disabled:!i.lights,tap_action:r(c?"light.turn_off":"light.turn_on","lights")};break;case"lights_on":d={name:Qe(e,"preset_lights_on"),icon:"mdi:lightbulb-on-outline",active:!1,color:"var(--apc-amber)",disabled:!i.lights,tap_action:r("light.turn_on","lights")};break;case"lights_off":d={name:Qe(e,"preset_lights_off"),icon:"mdi:lightbulb-off-outline",active:!1,color:"var(--apc-amber)",disabled:!i.lights,tap_action:r("light.turn_off","lights")};break;case"covers_open":d={name:Qe(e,"preset_covers_open"),icon:"mdi:window-shutter-open",active:!1,color:"var(--apc-purple)",disabled:!i.covers,tap_action:r("cover.open_cover","covers")};break;case"covers_close":d={name:Qe(e,"preset_covers_close"),icon:"mdi:window-shutter",active:!1,color:"var(--apc-purple)",disabled:!i.covers,tap_action:r("cover.close_cover","covers")};break;case"fans_off":d={name:Qe(e,"preset_fans_off"),icon:"mdi:fan-off",active:!1,color:"var(--apc-cyan)",disabled:!i.fans,tap_action:r("fan.turn_off","fans")};break;case"media_stop":d={name:Qe(e,"preset_media_stop"),icon:"mdi:stop-circle-outline",active:(i.media?.active.length??0)>0,color:"var(--apc-indigo)",disabled:!i.media,tap_action:r("media_player.media_stop","media")};break;case"vacuum_area":{const i="cleaning"===l?.state;d={name:Qe(e,"preset_vacuum_area"),icon:i?"mdi:robot-vacuum-variant":"mdi:robot-vacuum",active:i,color:"var(--apc-teal)",disabled:!t.entity,tap_action:{action:"perform-action",perform_action:"vacuum.clean_area",target:{entity_id:t.entity},data:{cleaning_area_id:[o.area_id]},confirmation:{text:Qe(e,"confirm_vacuum",{area:s})}}};break}case"everything_off":d={name:Qe(e,"preset_everything_off"),icon:"mdi:power",active:!1,color:"var(--apc-red)",disabled:!1,tap_action:{...a?{action:"perform-action",perform_action:"homeassistant.turn_off",target:{entity_id:n.primary.filter(e=>it.has(e.split(".")[0]))}}:ot("homeassistant.turn_off",o.area_id),confirmation:{text:Qe(e,"confirm_everything_off",{area:s})}}};break;default:{const e=t.entity?.split(".")[0]??"";d={name:l?.attributes.friendly_name?.replace(new RegExp(`^${st(s)}\\s*`,"i"),"")||t.entity||"Action",icon:l?.attributes.icon||at[e]||"mdi:gesture-tap",active:!!l&&tt.has(l.state),color:"var(--apc-accent)",disabled:!(!t.entity||l&&"unavailable"!==l.state),tap_action:t.entity?nt(t.entity):{action:"none"}}}}return{...d,name:t.name??d.name,icon:t.icon??d.icon,color:t.color?ct(t.color):d.color,tap_action:t.tap_action??d.tap_action,hold_action:t.hold_action??(t.entity?{action:"more-info",entity:t.entity}:void 0),double_tap_action:t.double_tap_action,entity:t.entity}}(e,t,o,n,i,!!this._labelFilter?.active)),l=n.presence,d=!!l?.active.length,h=n.alerts?.active??[],p=t.color?ct(t.color):void 0,u=!1!==t.show_picture&&!!o.picture,m=this._roomEnabled(i),_=this._hasAction(t.tap_action)||this._hasAction(t.hold_action)||m&&!t.tap_action,g=Ye(e,t,i),f=g?e.states[g]:void 0,v="on"===f?.state,b=v?f:(n.lights?.active??[]).map(t=>e.states[t]).find(e=>!!e),y=b?Je(b):void 0,w=Number(b?.attributes.brightness??255),x=.1+.12*Math.min(1,Math.max(0,w/255)),$=v?Je(f):void 0,k={};p&&(k["--apc-accent"]=p),y&&(k["--apc-glow-rgb"]=y.join(",")),b&&(k["--apc-glow-alpha"]=x.toFixed(3)),$&&(k["--apc-light-rgb"]=$.join(","));const A=t.colors??{};A.temperature_low&&(k["--apc-temp-low"]=ct(A.temperature_low)),A.temperature_high&&(k["--apc-temp-high"]=ct(A.temperature_high)),A.humidity_low&&(k["--apc-hum-low"]=ct(A.humidity_low)),A.humidity_high&&(k["--apc-hum-high"]=ct(A.humidity_high));const S={"area-icon":!0,occupied:d&&!g,linked:!!g,"light-on":v},C=this._chipModel(n,m),E=new Set(C.shown.map(e=>e.group).filter(e=>!!e)),M=F`<ha-icon .icon=${t.icon||o.icon||Lt}></ha-icon>`,O=d?F`<span class="presence-dot"></span>`:B;return F`
      <ha-card class=${fe({alerting:h.length>0})} style=${xe(k)}>
        ${u?F`<div class="picture" style=${xe({backgroundImage:`url("${o.picture}")`})}></div>`:B}
        <div class=${fe({glow:!0,on:!!b})}></div>
        <div class="content">
          <div
            class=${fe({header:!0,clickable:_})}
            role=${_?"button":B}
            tabindex=${_?"0":B}
            ${St({hasHold:this._hasAction(t.hold_action),hasDoubleTap:this._hasAction(t.double_tap_action),disabled:!_})}
            @apc-action=${e=>this._cardAction(e.detail.action)}
          >
            ${g?F`<div
                  class=${fe(S)}
                  role="button"
                  tabindex="0"
                  aria-pressed=${String(v)}
                  aria-label=${Qe(e,"toggle_light",{name:this._entityName(f)})}
                  title=${this._entityName(f)}
                  ${St({hasHold:!0})}
                  @apc-action=${e=>this._mainLightAction(g,e.detail.action)}
                  @pointerdown=${this._stop}
                  @pointerup=${this._stop}
                  @click=${this._stop}
                  @keydown=${this._stop}
                >
                  ${M}${O}
                </div>`:F`<div class=${fe(S)}>${M}${O}</div>`}
            <div class="titles">
              <div class="name">${t.name||o.name}</div>
              <div class="secondary">${this._secondary(n,E)}</div>
            </div>
            ${this._renderClimate(a,s,r)}
          </div>
          ${this._renderLabelHint(i)}
          ${h.length?be(h.join(),this._renderAlertBanner(h)):B}
          ${this._renderChips(C)}
          ${c.length?this._renderActions(c):B}
        </div>
      </ha-card>
      ${this._popup&&n[this._popup]?this._renderPopup(n[this._popup],o):B}
      ${this._room?this._renderRoom(o,n,a,s):B}
    `}_renderLabelHint(e){const t=this._labelFilter;return t?.active&&0!==t.include.size?e.primary.length>0||0===e.unfilteredCount?B:F`
      <div class="hint">
        <ha-icon icon="mdi:label-off-outline"></ha-icon>
        <span>${Qe(this.hass,"no_label_match",{labels:t.includeNames.join(", ")})}</span>
      </div>
    `:B}_warning(e){return F`<ha-card><div class="warning"><ha-icon icon="mdi:alert-outline"></ha-icon>${e}</div></ha-card>`}_secondary(e,t=new Set){const o=this.hass,i=[],n=e.presence;if(n){const e=n.active.length>0,t=this._lastChange(e?n.active:n.entities),a=Qe(o,e?"occupied":"clear");i.push(void 0!==t?`${a} ${Qe(o,"for",{t:this._ago(t)})}`:a)}const a=e.lights;if(a?.active.length&&!t.has("lights")&&i.push(Qe(o,1===a.active.length?"light_on":"lights_on_n",{n:a.active.length})),!i.length){const n=e.media;n?.active.length&&!t.has("media")&&i.push(Qe(o,"media_playing"))}return i.map((e,t)=>F`${t?F`<span class="dot">·</span>`:B}${e}`)}_renderClimate(e,t,o=[]){if(!e&&!t&&!o.length)return B;const i=this._config,n=e?.unit||"°",a=e?We(e.value,i.comfort_temperature,n.includes("F")?[68,76]:[19,25]):"ok",s=t?We(t.value,i.comfort_humidity,[35,65]):"ok";return F`
      <div class="climate">
        ${e?F`<div
              class="temp ${a}"
              title=${e.entities.length>1?`Median of ${e.entities.length} sensors`:""}
              @click=${t=>this._moreInfo(e.entities[0],t)}
            >
              ${this._num(e.value,1)}<span class="unit">${n}</span>
            </div>`:B}
        ${t||o.length?F`<div class="readings">
              ${t?F`<div class="hum ${s}" @click=${e=>this._moreInfo(t.entities[0],e)}>
                    <ha-icon .icon=${"low"===s?"mdi:water-percent-alert":"mdi:water-percent"}></ha-icon>${this._num(t.value,0)}${t.unit}
                  </div>`:B}
              ${o.map(e=>{const t=function(e){return"carbon_dioxide"===e.deviceClass?e.value>=1500?"bad":e.value>=1e3?"warn":"":"pm25"===e.deviceClass?e.value>=35?"bad":e.value>=12?"warn":"":""}(e);return F`<div
                  class="hum reading ${t}"
                  title=${this._entityName(this.hass.states[e.entities[0]])}
                  @click=${t=>this._moreInfo(e.entities[0],t)}
                >
                  <ha-icon .icon=${Pt[e.deviceClass]??"mdi:gauge"}></ha-icon>${this._num(e.value,Math.abs(e.value)>=100?0:1)}${e.unit?` ${e.unit}`:""}
                </div>`})}
            </div>`:B}
      </div>
    `}_renderAlertBanner(e){const t=this.hass,o=t.states[e[0]],i=1===e.length?`${this._entityName(o)} · ${this._formatState(o)}`:`${Qe(t,"alerts_n",{n:e.length})}: ${e.map(e=>this._entityName(t.states[e])).join(", ")}`;return F`
      <div
        class="alert-banner"
        role="alert"
        @click=${()=>1===e.length?this._moreInfo(e[0]):this._openPopup("alerts")}
      >
        <ha-icon icon="mdi:alert"></ha-icon>
        <span class="text">${i}</span>
      </div>
    `}_chipModel(e,t){const o=this._config,i=(o.groups??Ne).filter(e=>"presence"!==e),n=new Set(o.top_groups??ze),a=!0===o.show_inactive,s=[];for(const t of i){const o=e[t];o&&(("alerts"!==t||"compact"===this.layout&&o.active.length)&&("batteries"!==t||o.active.length)&&(o.active.length||a)&&s.push({group:t,active:o.active.length>0,top:n.has(t),render:()=>this._groupChip(o)}))}const r=t?o.max_chips??3:0;return{...Ge(s,r),capped:r>0}}_renderChips(e){const{shown:t,hidden:o,capped:i}=e;if(!t.length)return B;if(i){const e=this.hass;return F`
        <div class="chip-rows">
          <div class="chips">
            ${t.map(e=>e.render())}
            ${o.length?F`<button
                  class="chip more"
                  aria-haspopup="dialog"
                  aria-label=${Qe(e,"more_n",{n:o.length})}
                  title=${Qe(e,"more_n",{n:o.length})}
                  @click=${()=>this._openRoom()}
                >
                  <span class="label">+${o.length}</span>
                </button>`:B}
          </div>
        </div>
      `}const n=t.filter(e=>e.top).map(e=>e.render()),a=t.filter(e=>!e.top).map(e=>e.render());return F`
      <div class="chip-rows">
        ${n.length?F`<div class="chips">${n}</div>`:B}
        ${a.length?F`<div class="chips">${a}</div>`:B}
      </div>
    `}get _calmChips(){return"category"!==this._config?.chip_colors}_groupChip(e){const t=Tt[e.id],o=e.active.length>0,i=this._calmChips;let n=i?zt[function(e){switch(e){case"alerts":case"batteries":case"locks":return"bad";case"doors":case"windows":return"warn";case"lights":return"on";default:return""}}(e.id)]:t.color,a=o?t.icon:t.iconOff,s=this._groupLabel(e);if("climate"===e.id){const t=this.hass.states[e.active[0]??e.entities[0]],o=String(t?.attributes.hvac_action??("off"===t?.state?"off":"idle"));"cooling"===o?(i||(n="var(--apc-blue)"),a="mdi:snowflake"):"heating"===o?a="mdi:fire":"drying"===o?(i||(n="var(--apc-amber)"),a="mdi:water-percent"):"fan"===o&&(i||(n="var(--apc-light-blue)"),a="mdi:fan"),s=this._climateLabel(t,o)}return F`
      <button
        class=${fe({chip:!0,active:o,calm:i,selected:this._popup===e.id})}
        style=${xe({"--c":n})}
        aria-haspopup=${e.entities.length>1?"dialog":B}
        @click=${()=>this._chipClick(e)}
      >
        <ha-icon .icon=${a}></ha-icon>
        <span class="label">${s}</span>
      </button>
    `}_groupLabel(e){const t=this.hass,o=e.active.length,i=(e,i,n)=>0===o?Qe(t,n):Qe(t,1===o?e:i,{n:o});switch(e.id){case"motion":return Qe(t,o?"motion":"no_motion");case"doors":return i("door_open","doors_open","doors_closed");case"windows":return i("window_open","windows_open","windows_closed");case"covers":return i("cover_open","covers_open_n","covers_closed");case"locks":return i("lock_unlocked","lock_unlocked","locks_locked");case"lights":return i("light_on","lights_on_n","lights_off_all");case"fans":return i("fan_on","fans_on_n","fans_off_all");case"switches":return i("switch_on","switches_on_n","switches_off_all");case"media":{if(!o)return Qe(t,"media_idle");const i=t.states[e.active[0]].attributes.media_title;return 1===o&&i?i:Qe(t,"media_playing")}case"alerts":return 1===o?Qe(t,"alert"):Qe(t,"alerts_n",{n:o});case"batteries":return Qe(t,1===o?"battery_low":"batteries_low",{n:o});default:return""}}_climateLabel(e,t){const o=this.hass;if(!e)return"";const i=`climate_${t}`,n=["heating","cooling","drying","fan","idle","off"].includes(t)?Qe(o,i):this._formatState(e),a=e.attributes.temperature,s=e.attributes.target_temp_low,r=e.attributes.target_temp_high;return"off"===e.state?n:"number"==typeof a?`${n} · ${this._num(a,1)}°`:"number"==typeof s&&"number"==typeof r?`${n} · ${this._num(s,0)}–${this._num(r,0)}°`:n}_renderActions(e){return F`
      <div class=${fe({actions:!0,dense:e.length>=4})}>
        ${e.map(e=>F`
            <button
              class=${fe({action:!0,active:e.active})}
              style=${xe({"--c":e.color,"--apc-action-icon":rt(e,this._calmChips)})}
              title=${e.name}
              aria-label=${e.name}
              ?disabled=${e.disabled}
              ${St({hasHold:this._hasAction(e.hold_action),hasDoubleTap:this._hasAction(e.double_tap_action),disabled:e.disabled})}
              @apc-action=${t=>this._quickAction(e,t.detail.action)}
            >
              <ha-icon .icon=${e.icon}></ha-icon>
              <span class="label">${e.name}</span>
            </button>
          `)}
      </div>
    `}_hasAction(e){return!!e&&"none"!==e.action}_chipClick(e){1!==e.entities.length?this._openPopup(e.id):this._moreInfo(e.entities[0])}_mainLightAction(e,t){"hold"===t?this._moreInfo(e):this._fireAction({entity:e,tap_action:{action:"toggle"}},"tap")}_cardAction(e){const t=this._config;"tap"!==e||t.tap_action||!this._roomEnabled(this._getIndex())?this._fireAction({tap_action:t.tap_action,hold_action:t.hold_action,double_tap_action:t.double_tap_action},e):this._openRoom()}_quickAction(e,t){this._fireAction({entity:e.entity,tap_action:e.tap_action,hold_action:e.hold_action,double_tap_action:e.double_tap_action},t)}_fireAction(e,t){const o=e[`${t}_action`];this._hasAction(o)&&this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:e,action:t}}))}_moreInfo(e,t){t?.stopPropagation(),e&&((this._popup||this._room)&&this._onPopupMoreInfo(),this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}})))}_currentGroups(){return this.hass&&this._config?qe(this.hass,this._config,this._getIndex()):{}}_sortedEntities(e){return[...e.entities].sort((t,o)=>Number(e.active.includes(o))-Number(e.active.includes(t))||this._entityName(this.hass.states[t]).localeCompare(this._entityName(this.hass.states[o])))}async _loadHelpers(){try{return await(window.loadCardHelpers?.())??void 0}catch{return}}async _openPopup(e){const t=this._currentGroups()[e];if(!t)return;this._popup=e,this._room=!1,this._tiles=void 0;const o=await this._loadHelpers();if(this._popup!==e)return;if(!o)return void(this._tiles=null);const i=await Promise.all(this._sortedEntities(t).map(e=>this._createTile(o,e)));this._popup===e&&(this._tiles=i)}async _createTile(e,t,o){const i=this.hass.states[t],n=o??this._entityName(i),a=$t(t,i,n),s=await e.createCardElement(a);return this._tileSources.set(s,{entity:t,name:n,state:i,key:JSON.stringify(a)}),s.hass=this.hass,s}_syncTile(e,t){const o=this._tileSources.get(e),i=t.states[o?.entity??""];if(o&&i!==o.state){o.state=i;const t=$t(o.entity,i,o.name),n=JSON.stringify(t),a=e;if(n!==o.key&&a.setConfig){o.key=n;try{a.setConfig(t)}catch{}}}e.hass=t}_closePopup(){this.renderRoot.querySelector("dialog.apc-popup")?.close()}_onPopupClosed(){this._popup=void 0,this._tiles=void 0,this._room=!1,this._roomTiles=void 0,this._roomModel=void 0}_onPopupClick(e){e.target===e.currentTarget&&this._closePopup()}_onPopupMoreInfo(){this._room?(this._roomScroll=this.renderRoot.querySelector(".room-body")?.scrollTop??0,this._reopen="room"):this._reopen=this._popup,this._closePopup()}updated(){const e=this.renderRoot.querySelector("dialog.apc-popup");if(e&&!e.open){try{e.showModal()}catch{e.setAttribute("open","")}if(this._room&&this._roomScroll){const t=e.querySelector(".room-body");t&&(t.scrollTop=this._roomScroll),this._roomScroll=0}}}_bulkActions(e){const t=e.active.length>0,o=e=>Qe(this.hass,e);switch(e.id){case"lights":return[t?{label:o("turn_all_off"),icon:"mdi:lightbulb-group-off-outline",service:"light.turn_off"}:{label:o("turn_all_on"),icon:"mdi:lightbulb-group",service:"light.turn_on"}];case"switches":return[t?{label:o("turn_all_off"),icon:"mdi:power-plug-off-outline",service:"switch.turn_off"}:{label:o("turn_all_on"),icon:"mdi:power-plug-outline",service:"switch.turn_on"}];case"fans":return[t?{label:o("turn_all_off"),icon:"mdi:fan-off",service:"fan.turn_off"}:{label:o("turn_all_on"),icon:"mdi:fan",service:"fan.turn_on"}];case"covers":return[{label:o("open_all"),icon:"mdi:arrow-up",service:"cover.open_cover"},{label:o("close_all"),icon:"mdi:arrow-down",service:"cover.close_cover"}];case"media":return t?[{label:o("pause_all"),icon:"mdi:pause",service:"media_player.media_pause"}]:[];default:return[]}}_bulk(e,t){this._fireAction({tap_action:{action:"perform-action",perform_action:t,target:{entity_id:[...e.entities]}}},"tap")}_renderPopup(e,t){const o=this.hass,i=Tt[e.id],n=e.active.length>0,a="alerts"===e.id?Qe(o,"g_alerts"):Qe(o,`g_${e.id}`),s=`${this._config.name||t.name} · ${Qe(o,"n_of_m_active",{n:e.active.length,m:e.entities.length})}`;return F`
      <dialog
        class="apc-popup"
        aria-label=${a}
        style=${xe({"--c":i.color})}
        @close=${this._onPopupClosed}
        @click=${this._onPopupClick}
        @hass-more-info=${this._onPopupMoreInfo}
      >
        <div class="popup-surface">
          <header class="popup-head">
            <div class=${fe({"popup-icon":!0,active:n})}>
              <ha-icon .icon=${n?i.icon:i.iconOff}></ha-icon>
            </div>
            <div class="popup-titles">
              <div class="popup-title">${a}</div>
              <div class="popup-sub">${s}</div>
            </div>
            <button class="popup-close" aria-label=${Qe(o,"close")} @click=${()=>this._closePopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${this._bulkActions(e).length?F`<div class="popup-bulk">
                ${this._bulkActions(e).map(t=>F`<button class=${fe({bulk:!0,calm:this._calmChips})} @click=${()=>this._bulk(e,t.service)}>
                    <ha-icon .icon=${t.icon}></ha-icon>${t.label}
                  </button>`)}
              </div>`:B}
          <div class="popup-grid">
            ${void 0===this._tiles?B:null===this._tiles?this._sortedEntities(e).map(t=>this._fallbackTile(t,e)):this._tiles}
          </div>
        </div>
      </dialog>
    `}_fallbackTile(e,t){return this._miniTile(e,{color:Tt[t.id].color,active:t.active.includes(e)})}_miniTile(e,t){const o=this.hass,i=o.states[e];if(!i)return B;const n=e.startsWith("light.")?Je(i):void 0,a=n?`rgb(${n.join(",")})`:t.color,s=Date.parse(i.last_changed),r=e.split(".")[0],c=["light","switch","fan","input_boolean","cover","media_player","lock"].includes(r),l=xt[r],d=t.sub??(l?this._lastRun(i):`${this._formatState(i)}${Number.isNaN(s)?"":` · ${this._ago(s)}`}`);return F`
      <div
        class=${fe({"mini-tile":!0,active:t.active})}
        style=${xe({"--c":a})}
        role="button"
        tabindex="0"
        ${St({hasHold:!0})}
        @apc-action=${t=>{"hold"===t.detail.action||!c&&!l?this._moreInfo(e):l?this._fireAction({tap_action:{action:"perform-action",perform_action:l,target:{entity_id:e}}},"tap"):this._fireAction({entity:e,tap_action:{action:"toggle"}},"tap")}}
      >
        <div class="mt-icon"><ha-state-icon .hass=${o} .stateObj=${i}></ha-state-icon></div>
        <div class="mt-text">
          <div class="mt-name" title=${this._entityName(i)}>${t.name??this._entityName(i)}</div>
          <div class="mt-state">${d}</div>
        </div>
      </div>
    `}_lastRun(e){if("unavailable"===e.state)return this._formatState(e);const t=e.entity_id.startsWith("script.")?e.attributes.last_triggered:e.state,o=t?Date.parse(t):NaN;return Number.isNaN(o)?"":Qe(this.hass,"last_run",{ago:this._ago(o)})}_roomEnabled(e){return!1!==this._config?.room_popup&&e.primary.length>0}async _openRoom(e=!1){const{hass:t,_config:o}=this;if(!t||!o)return;e||(this._roomUi={query:"",collapsed:new Set,expanded:new Set});const i=function(e,t,o){const i=new Set(t.alert_classes??Oe),n=t.battery_threshold??20,a=new Map,s=(e,t)=>{let o=a.get(e);return o||(o={id:e,kind:t,entities:[]},a.set(e,o)),o},r={},c=[],l=[],d=[];for(const t of o.withDiagnostic)wt(e.states[t],n)&&(l.push(t),r[t]="battery");for(const t of o.primary){const o=e.states[t];if(!o||r[t])continue;const n=ut(t);if(ht.has(n))continue;if("unavailable"===o.state&&!pt.has(n)){d.push(t),r[t]="unavailable";continue}if("binary_sensor"===n&&"on"===o.state&&i.has(mt(o)??"")){c.push(t),r[t]="alert";continue}const a=dt[n]??"other";s(a,"status"===a?"status":"sensors"===a?"stats":"tiles").entities.push(t)}const h=bt(e),p=s("attention","status");p.entities=[...c.sort(h),...l.sort(h),...d.sort(h)],p.reasons=r;const u=[];for(const t of lt){const o=a.get(t);o&&0!==o.entities.length&&("attention"!==t&&yt(e,o),u.push(o))}return{sections:u,total:u.reduce((e,t)=>e+t.entities.length,0)}}(t,o,this._getIndex()),n=e=>i.sections.filter(t=>t.kind===e).flatMap(e=>e.entities);this._roomModel=i,this._roomLabels=At(t,o.area,n("stats"),[...n("tiles"),...n("status")]),this._popup=void 0,this._tiles=void 0,this._roomTiles=void 0,this._room=!0,this._helpers=await this._loadHelpers(),this._room&&this._roomModel===i&&(this._helpers?(this._roomTiles=new Map,await this._ensureRoomTiles()):this._roomTiles=null)}_roomName(e){return this._roomLabels[e]?.name??this._entityName(this.hass?.states[e])}_roomMatches(e){const t=this._roomUi.query;if(!t.trim())return!0;const o=this.hass?.states[e];return function(e,...t){const o=e.trim().toLowerCase();return!o||o.split(/\s+/).every(e=>t.some(t=>!!t&&t.toLowerCase().includes(e)))}(t,this._roomName(e),o?.attributes.friendly_name,e,this._roomLabels[e]?.sub)}_roomVisible(e){return this._roomUi.query.trim()?e.entities.filter(e=>this._roomMatches(e)):this._roomUi.expanded.has(e.id)?e.entities:e.entities.slice(0,jt.ROOM_LIMIT)}async _ensureRoomTiles(){const e=this._roomTiles,t=this._helpers;if(!(e&&t&&this._roomModel&&this.hass))return;const o=!!this._roomUi.query.trim(),i=[];for(const t of this._roomModel.sections)if("tiles"===t.kind&&(o||!this._roomUi.collapsed.has(t.id)))for(const o of this._roomVisible(t))e.has(o)||i.push(o);if(!i.length)return;const n=await Promise.all(i.map(async e=>[e,await this._createTile(t,e,this._roomName(e))]));if(this._roomTiles===e){for(const[t,o]of n)e.has(t)||e.set(t,o);this.requestUpdate()}}_updateRoomUi(e){this._roomUi={...this._roomUi,...e},this._ensureRoomTiles()}_toggleIn(e,t){const o=new Set(e);return o.delete(t)||o.add(t),o}_sectionStyle(e,t){const o={"--c":t};return this._calmChips&&(o["--apc-sec-icon"]="attention"===e?"var(--apc-red)":"var(--secondary-text-color)"),o}_sectionMeta(e){const t=e=>Qe(this.hass,e);switch(e){case"attention":return{icon:"mdi:alert-circle-outline",color:"var(--apc-red)",title:t("room_attention")};case"status":return{icon:"mdi:motion-sensor",color:"var(--apc-green)",title:t("room_status")};case"sensors":return{icon:"mdi:gauge",color:"var(--apc-blue)",title:t("room_sensors")};case"other":return{icon:"mdi:dots-grid",color:"var(--apc-accent)",title:t("room_other")};default:{const o=Tt[e];return{icon:o.icon,color:o.color,title:t(`g_${e}`)}}}}_statusColor(e,t){if("alert"===t)return"var(--apc-red)";if("battery"===t)return"var(--apc-orange)";if("unavailable"===t)return"var(--secondary-text-color)";switch(this.hass?.states[e]?.attributes.device_class){case"motion":case"occupancy":case"presence":return"var(--apc-green)";case"door":case"garage_door":case"window":case"opening":return"var(--apc-orange)";default:return"var(--apc-accent)"}}_renderRoom(e,t,o,i){const n=this.hass,a=this._config,s=this._roomModel;if(!s)return B;const r=this._roomUi,c=!!r.query.trim(),l=a.name||e.name,d=Ye(n,a,this._getIndex()),h=d?Je(n.states[d]):void 0,p=s.sections.map(e=>this._renderRoomSection(e,t)).filter(e=>e!==B);return F`
      <dialog
        class="apc-popup room"
        aria-label=${l}
        style=${xe(h?{"--room-rgb":h.join(",")}:{})}
        @close=${this._onPopupClosed}
        @click=${this._onPopupClick}
        @hass-more-info=${this._onPopupMoreInfo}
      >
        <div class="popup-surface room-surface">
          <div class="sheet-handle" aria-hidden="true"></div>
          <header class="room-head">
            <div class=${fe({"room-icon":!0,"light-on":!!h})}>
              <ha-icon .icon=${a.icon||e.icon||Lt}></ha-icon>
            </div>
            <div class="popup-titles">
              <div class="popup-title">${l}</div>
              <div class="popup-sub">${this._secondary(t)}</div>
            </div>
            ${this._renderClimate(o,i)}
            <button class="popup-close" aria-label=${Qe(n,"close")} @click=${()=>this._closePopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${s.total>12?F`<div class="room-search">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input
                  type="search"
                  enterkeyhint="search"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder=${Qe(n,"room_search")}
                  aria-label=${Qe(n,"room_search")}
                  .value=${r.query}
                  @input=${e=>this._updateRoomUi({query:e.target.value})}
                />
                ${c?F`<button
                      class="search-clear"
                      aria-label=${Qe(n,"room_clear_search")}
                      @click=${()=>this._updateRoomUi({query:""})}
                    >
                      <ha-icon icon="mdi:close-circle"></ha-icon>
                    </button>`:B}
              </div>`:B}
          <div class="room-body">
            ${p.length?p:F`<div class="room-empty">
                  ${c?Qe(n,"room_no_results",{q:r.query.trim()}):Qe(n,"room_empty")}
                </div>`}
          </div>
        </div>
      </dialog>
    `}_renderRoomSection(e,t){const o=this.hass,i=this._roomUi,n=!!i.query.trim(),a=this._roomVisible(e);if(n&&!a.length)return B;const s=this._sectionMeta(e.id),r=!n&&i.collapsed.has(e.id),c=e.entities.length,l=e.entities.filter(e=>_t(o.states[e])).length,d=n?String(a.length):("tiles"===e.kind||"status"===e.kind)&&"attention"!==e.id&&l>0?Qe(o,"n_of_m_active",{n:l,m:c}):String(c),h=t[e.id],p=h&&"tiles"===e.kind&&!r?this._bulkActions(h):[],u=c>jt.ROOM_LIMIT&&!n,m=i.expanded.has(e.id);return F`
      <section class="room-sec" style=${xe(this._sectionStyle(e.id,s.color))} data-section=${e.id}>
        <div class="sec-head">
          <button
            class="sec-toggle"
            aria-expanded=${String(!r)}
            @click=${()=>this._updateRoomUi({collapsed:this._toggleIn(i.collapsed,e.id)})}
          >
            <ha-icon class="sec-icon" .icon=${s.icon}></ha-icon>
            <span class="sec-title">${s.title}</span>
            <span class="sec-count">${d}</span>
            <ha-icon class="sec-chevron" .icon=${r?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>
          </button>
          ${p.map(e=>F`<button
              class=${fe({bulk:!0,small:!0,calm:this._calmChips})}
              @click=${()=>this._bulk(h,e.service)}
            >
              <ha-icon .icon=${e.icon}></ha-icon>${e.label}
            </button>`)}
        </div>
        ${r?B:F`<div class=${`sec-grid ${e.kind}`}>${a.map(t=>this._renderRoomItem(e,t))}</div>
              ${u?F`<button
                    class="sec-more"
                    @click=${()=>this._updateRoomUi({expanded:this._toggleIn(i.expanded,e.id)})}
                  >
                    ${m?Qe(o,"room_show_less"):Qe(o,"room_show_more",{n:c-jt.ROOM_LIMIT})}
                  </button>`:B}`}
      </section>
    `}_renderRoomItem(e,t){const o=this.hass,i=o.states[t];if(!i)return B;const n=this._roomName(t);if("stats"===e.kind)return this._statCell(t);if("status"===e.kind){const a=e.reasons?.[t];let s;return"battery"===a?s=`${Qe(o,"reason_low_battery")} · ${this._formatState(i)}`:"unavailable"===a&&(s=Qe(o,"reason_unavailable")),this._miniTile(t,{color:this._statusColor(t,a),active:a?"unavailable"!==a:_t(i),name:n,sub:s})}const a=this._roomTiles,s=a?.get(t);if(s)return s;if(null===a){const o=Tt[e.id];return this._miniTile(t,{color:o?.color??"var(--apc-accent)",active:_t(i),name:n})}return F`<div class="tile-skel" aria-hidden="true"></div>`}_statCell(e){const t=this.hass,o=t.states[e],i=this._roomLabels[e]??{name:this._entityName(o)},n=this._config,a=Number(o.state),s=""!==o.state.trim()&&!Number.isNaN(a),r=o.attributes.device_class;let c="";if(s&&"temperature"===r){const e=String(o.attributes.unit_of_measurement??""),t=We(a,n.comfort_temperature,e.includes("F")?[68,76]:[19,25]);c="ok"===t?"":`t-${t}`}else if(s&&"humidity"===r){const e=We(a,n.comfort_humidity,[35,65]);c="ok"===e?"":`h-${e}`}else s&&"carbon_dioxide"===r?c=a>=1500?"bad":a>=1e3?"warn":"":s&&"pm25"===r&&(c=a>=35?"bad":a>=12?"warn":"");return F`
      <button
        class=${fe({"stat-cell":!0,[c]:!!c})}
        title=${o.attributes.friendly_name??e}
        @click=${()=>this._moreInfo(e)}
      >
        <span class="sc-label">
          <ha-state-icon .hass=${t} .stateObj=${o}></ha-state-icon>
          <span class="sc-name">${i.name}</span>
        </span>
        <span class="sc-value">${this._formatState(o)}</span>
        ${i.sub?F`<span class="sc-sub">${i.sub}</span>`:B}
      </button>
    `}_lang(){return this.hass?.locale?.language||this.hass?.language||"en"}_num(e,t){return new Intl.NumberFormat(this._lang(),{maximumFractionDigits:t}).format(e)}_lastChange(e){let t;for(const o of e){const e=Date.parse(this.hass.states[o]?.last_changed??"");!Number.isNaN(e)&&(void 0===t||e>t)&&(t=e)}return t}_ago(e){const t=Math.max(0,(Date.now()-e)/1e3),o=this._lang(),i=(e,t)=>new Intl.NumberFormat(o,{style:"unit",unit:t,unitDisplay:"short"}).format(e);return t<60?Qe(this.hass,"since_now"):t<3600?i(Math.floor(t/60),"minute"):t<86400?i(Math.floor(t/3600),"hour"):i(Math.floor(t/86400),"day")}_formatState(e){try{return this.hass?.formatEntityState?.(e)??e.state}catch{return e.state}}_entityName(e){if(!e)return"";const t=e.attributes.friendly_name??e.entity_id,o=this.hass?.areas?.[this._config.area]?.name;if(o&&t.toLowerCase().startsWith(o.toLowerCase()+" ")){const e=t.slice(o.length+1).trim();return e?e.charAt(0).toUpperCase()+e.slice(1):t}return t}}jt.styles=[Ct,Et],jt.ROOM_LIMIT=8,e([he({attribute:!1})],jt.prototype,"hass",void 0),e([he({reflect:!0})],jt.prototype,"layout",void 0),e([he({type:Boolean,reflect:!0})],jt.prototype,"dark",void 0),e([pe()],jt.prototype,"_config",void 0),e([pe()],jt.prototype,"_popup",void 0),e([pe()],jt.prototype,"_tiles",void 0),e([pe()],jt.prototype,"_room",void 0),e([pe()],jt.prototype,"_roomTiles",void 0),e([pe()],jt.prototype,"_roomUi",void 0),e([pe()],jt.prototype,"_labelRegistry",void 0),customElements.get("area-pulse-card")||(customElements.define("area-pulse-card",jt),window.customCards=window.customCards||[],window.customCards.push({type:"area-pulse-card",name:"Area Pulse Card",description:"Presence, climate, openings, alerts and quick actions for an area.",preview:!0}));const Dt={active:!1,include:new Set,exclude:new Set,match:"any",fromDevice:!0,includeNames:[]};function It(e){return(Array.isArray(e)?e:null==e?[]:[e]).map(e=>String(e).trim()).filter(Boolean)}function Ht(e){return!!e&&(It(e.include).length>0||It(e.exclude).length>0)}function Rt(e,t){if(!t)return e;const o=t.find(t=>t.label_id===e);if(o)return o.label_id;const i=e.toLowerCase(),n=t.find(e=>e.name.toLowerCase()===i);return n?n.label_id:e}function Ut(e,t,o){if(!o.active)return!0;const i=new Set(e??[]);if(o.fromDevice)for(const e of t??[])i.add(e);for(const e of o.exclude)if(i.has(e))return!1;if(0===o.include.size)return!0;const n=[...o.include];return"all"===o.match?n.every(e=>i.has(e)):n.some(e=>i.has(e))}let qt;const Ft=["greeting","status","alerts","nudges","modes","alarm","pulse","shortcuts"],Wt=["greeting","status","alerts","nudges","modes","shortcuts"],Bt=["moisture","smoke","gas","carbon_monoxide","safety","problem","tamper"],Gt=["alerts","lights","doors","windows","covers","locks","fans","switches","media","climate","batteries"],Vt=["alerts","lights","doors","windows","locks","media","climate","batteries"],Yt=["arm_home","arm_away","arm_night","arm_vacation","arm_custom_bypass"],Jt=["arm_home","arm_away"],Xt={arm_home:1,arm_away:2,arm_night:4,arm_custom_bypass:16,arm_vacation:32},Kt=e=>e.split(".")[0],Zt=e=>e?.attributes.device_class;function Qt(e){const t=(e??"").trim().split(/\s+/)[0]??"";return t?t.charAt(0).toUpperCase()+t.slice(1):""}function eo(e,t,o=!1){const i=e.entities?.[t];return!i||!i.hidden&&("config"!==i.entity_category&&!("diagnostic"===i.entity_category&&!o))}const to=e=>(t,o)=>String(e.states[t]?.attributes.friendly_name??t).localeCompare(String(e.states[o]?.attributes.friendly_name??o));function oo(e,t,o){if("none"!==o)return o||Object.keys(e.states).filter(o=>Kt(o)===t&&eo(e,o)&&"unavailable"!==e.states[o].state).sort(to(e))[0]}function io(e){return"home"===e?.state}function no(e,t,o=Dt){const i=Object.fromEntries(Gt.map(e=>[e,[]])),n=new Set(t.exclude_entities??[]),a=new Set(t.alert_classes??Bt);for(const t of Object.keys(e.states)){if(n.has(t))continue;if(o.active){const i=e.entities?.[t],n=i?.device_id?e.devices?.[i.device_id]:void 0;if(!Ut(i?.labels,n?.labels,o))continue}const s=e.states[t],r=Kt(t),c=Zt(s);if("sensor"!==r&&"binary_sensor"!==r||"battery"!==c){if(eo(e,t)&&!Array.isArray(s.attributes.entity_id))switch(r){case"light":i.lights.push(t);break;case"fan":i.fans.push(t);break;case"switch":i.switches.push(t);break;case"cover":i.covers.push(t);break;case"lock":i.locks.push(t);break;case"media_player":i.media.push(t);break;case"climate":i.climate.push(t);break;case"binary_sensor":"window"===c?i.windows.push(t):"door"===c||"garage_door"===c||"opening"===c?i.doors.push(t):c&&a.has(c)&&i.alerts.push(t)}}else eo(e,t,!0)&&i.batteries.push(t)}for(const t of Gt)i[t].sort(to(e));return i}function ao(e,t,o=20){if(!t)return!1;switch(e){case"lights":case"fans":case"switches":case"doors":case"windows":case"alerts":return"on"===t.state;case"covers":return"open"===t.state||"opening"===t.state;case"locks":return["unlocked","open","opening","jammed"].includes(t.state);case"media":return"playing"===t.state;case"climate":{const e=t.attributes.hvac_action;return e?["heating","cooling","drying","fan"].includes(e):"off"!==t.state&&"unavailable"!==t.state&&"unknown"!==t.state}case"batteries":return"binary_sensor"===Kt(t.entity_id)?"on"===t.state:""!==t.state&&!Number.isNaN(Number(t.state))&&Number(t.state)<=o}}function so(e){switch(e){case"alerts":case"batteries":case"locks":return"bad";case"doors":case"windows":return"warn";case"lights":return"on";default:return""}}function ro(e,t,o){const i=t.battery_threshold??20;return(t.pulse??Vt).filter(e=>Gt.includes(e)).map(t=>{const n=o[t];return{id:t,entities:n,active:n.filter(o=>ao(t,e.states[o],i))}}).filter(e=>e.entities.length>0)}function co(e,t){const o=e.entities?.[t],i=o?.area_id??(o?.device_id?e.devices?.[o.device_id]?.area_id:void 0);return i?e.areas?.[i]?.name??void 0:void 0}function lo(e,t=Jt){if(!e)return;const o=e.state,i="disarmed"===o?"disarmed":"triggered"===o?"triggered":"arming"===o||"pending"===o||"disarming"===o?"pending":o.startsWith("armed")?"armed":"unknown",n=null!=e.attributes.code_format,a=e.attributes.supported_features;let s=[];if("disarmed"===i){const o=n&&!1!==e.attributes.code_arm_required;s=t.filter(e=>void 0!==Xt[e]).filter(e=>void 0===a||0!==(a&Xt[e])).map(e=>({mode:e,service:`alarm_control_panel.alarm_${e}`,needsCode:o}))}else"unknown"!==i&&(s=[{mode:"disarm",service:"alarm_control_panel.alarm_disarm",needsCode:n}]);return{state:o,tone:i,buttons:s}}const ho=["doors","windows","locks","lights","media"];function po(e,t){if(!e||e.startsWith("/")||e.startsWith("#")||e.startsWith("?"))return e;return`/${t.split("/").filter(Boolean)[0]??"lovelace"}/${e}`}function uo(e,t){return e.tap_action?e.tap_action:e.navigation_path?{action:"navigate",navigation_path:po(e.navigation_path,t)}:e.entity?{action:"more-info",entity:e.entity}:void 0}const mo=new Set(["on","open","opening","playing","unlocked","cleaning","home","heat","cool","heat_cool","auto","dry","fan_only"]);function _o(e,t){return!!t.entity&&mo.has(e.states[t.entity]?.state??"")}function go(e){return e.badge&&Gt.includes(e.badge)?so(e.badge):""}function fo(e){return/^(#|rgb|hsl|var\()/i.test(e)?e:"primary"===e||"accent"===e?`var(--${e}-color)`:`var(--${e}-color, ${e})`}const vo={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"};function bo(e){return vo[e]??"mdi:weather-partly-cloudy"}function yo(e){const t=e?.attributes.temperature;if("number"==typeof t)return`${Math.round(t)}°`}const wo={daily:1,hourly:2,twice_daily:4};function xo(e){const t=Number(e?.attributes.supported_features??0);return["daily","twice_daily","hourly"].find(e=>0!==(t&wo[e]))}const $o=e=>e.split(".")[0],ko=[[/away|leave|εκτός|έξω|απουσ/i,"mdi:home-export-outline"],[/night|sleep|bed|νύχτ|ύπνο|βράδ/i,"mdi:weather-night"],[/movie|cinema|film|tv|ταινί|σινεμ/i,"mdi:movie-open-outline"],[/guest|visit|επισκ|καλεσμ/i,"mdi:account-group-outline"],[/vacation|holiday|travel|διακοπ|ταξίδ/i,"mdi:airplane"],[/morning|wake|πρωί|ξύπνη/i,"mdi:weather-sunset-up"],[/work|office|focus|δουλει|γραφεί/i,"mdi:briefcase-outline"],[/party|πάρτ/i,"mdi:party-popper"],[/dinner|eat|φαγητ|δείπν/i,"mdi:silverware-fork-knife"],[/home|σπίτι|normal|κανονικ|day|ημέρα/i,"mdi:home-outline"]];function Ao(e,t){if("none"!==t.mode_entity)return t.mode_entity?t.mode_entity:Object.keys(e.states).find(t=>("input_select"===$o(t)||"select"===$o(t))&&/(^|\.|_)(house|home)_mode$/.test(t)&&!e.entities?.[t]?.hidden)}function So(e){const t=e?Date.parse(e.state):NaN;return Number.isNaN(t)?-1/0:t}const Co=(e,t)=>({action:"perform-action",perform_action:`${$o(e)}.select_option`,target:{entity_id:e},data:{option:t}});function Eo(e,t){const o=Ao(e,t),i=o?e.states[o]:void 0,n=function(e,t,o){const i=t.mode_default?.trim();if(!i||!o)return;const n=e.states[o]?.attributes.options;return!Array.isArray(n)||n.includes(i)?i:void 0}(e,t,o),a=(t.modes??[]).filter(e=>e&&(e.name||e.option||e.entity||e.tap_action)),s=a.length?a:(i?.attributes.options??[]).filter(e=>e!==n).map(e=>({option:e})),r=s.map(e=>e.entity).filter(e=>!!e&&"scene"===$o(e)),c=r.reduce((t,o)=>So(e.states[o])>So(t?e.states[t]:void 0)?o:t,void 0);return s.map(t=>{const a=t.option??(!o||t.entity||t.tap_action?void 0:t.name),s=t.entity?e.states[t.entity]:void 0,r=t.name??a??String(s?.attributes.friendly_name??t.entity??""),l=t.icon??s?.attributes.icon??function(e){for(const[t,o]of ko)if(t.test(e))return o;return"mdi:circle-outline"}(r);let d=!1;void 0!==a&&i?d=i.state===a:t.entity&&"scene"===$o(t.entity)?d=t.entity===c&&So(s)>-1/0:s&&(d="on"===s.state);const h=void 0!==n&&o&&void 0!==a&&a!==n&&d?n:void 0;let p={action:"none"};return t.tap_action?p=t.tap_action:void 0!==h?p=Co(o,h):void 0!==a&&o?p=Co(o,a):t.entity&&(p=function(e){const t=$o(e);return"scene"===t||"script"===t?{action:"perform-action",perform_action:`${t}.turn_on`,target:{entity_id:e}}:"button"===t||"input_button"===t?{action:"perform-action",perform_action:`${t}.press`,target:{entity_id:e}}:"input_select"===t||"select"===t||"automation"===t?{action:"more-info",entity:e}:{action:"toggle",entity:e}}(t.entity)),{name:r,icon:l,color:t.color,active:d,...void 0===h||t.tap_action?{}:{resetTo:h},entity:t.entity??o,tap_action:p,hold_action:t.hold_action}})}function Mo(e,t){const o=[],i=Ao(e,t);i&&o.push(i);for(const e of t.modes??[])e.entity&&o.push(e.entity);return o}const Oo=new Set(["","unknown","unavailable","none","off","0"]);function No(e){if(!1!==e.today)return!0===e.today||void 0===e.today?{}:e.today}function zo(e,t){const o=No(t);return o?o.calendars?.length?o.calendars:Object.keys(e.states).filter(t=>"calendar"===(e=>e.split(".")[0])(t)&&!e.entities?.[t]?.hidden).sort():[]}function To(e){const t=No(e);return(t?.entities??[]).map(e=>"string"==typeof e?{entity:e}:e)}function Po(e){if("string"!=typeof e||!e)return;const t=new Date(/^\d{4}-\d{2}-\d{2}$/.test(e)?`${e}T00:00:00`:e.replace(" ","T"));return Number.isNaN(t.getTime())?void 0:t}function Lo(e,t){const o=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),i=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime();return Math.round((i-o)/864e5)}const jo=(e,t)=>0===e?0:1===e&&t?1:void 0;function Do(e,t,o){const i=String(e.attributes.message??"").trim(),n=Po(e.attributes.start_time);if(!i||!n)return;const a=!!e.attributes.all_day,s=Po(e.attributes.end_time);if("on"===e.state)return{entity:e.entity_id,title:i,day:0,until:a?void 0:s,allDay:a,dated:!1};if(s&&s.getTime()<=t.getTime())return;const r=jo(Lo(t,n),o);return void 0!==r?{entity:e.entity_id,title:i,day:r,start:a?void 0:n,allDay:a,dated:!1}:void 0}const Io=new Set(["d","day","days","ημέρες","μέρες"]);function Ho(e,t,o,i){const n=t??String(e.attributes.friendly_name??e.entity_id),a=(t,o)=>{const a=jo(t,i);return void 0===a?void 0:{entity:e.entity_id,title:n,day:a,start:o,allDay:!o,dated:!0}},s=e.attributes.daysTo??e.attributes.days_to;if("number"==typeof s)return a(s);const r=e.attributes.device_class;if("date"===r){const t=Po(e.state);return t?a(Lo(o,t)):void 0}if("timestamp"===r){const t=Po(e.state);if(!t||t.getTime()<o.getTime())return;return a(Lo(o,t),t)}return Io.has(String(e.attributes.unit_of_measurement??"").toLowerCase())&&!Number.isNaN(Number(e.state))?a(Number(e.state)):Oo.has(e.state.trim().toLowerCase())?void 0:{entity:e.entity_id,title:t?`${t}: ${e.state}`:e.state,allDay:!0,dated:!1}}const Ro=_e(class extends ge{constructor(e){if(super(e),e.type!==me)throw new Error("actionHandler must be used on an element")}update(e,[t]){const o=e.element;return o.__hpcOptions=t??{},function(e){if(e.__hpcBound)return;let t,o;e.__hpcBound=!0;let i=!1,n=0,a=0;const s=t=>e.dispatchEvent(new CustomEvent("hpc-action",{detail:{action:t},bubbles:!1,composed:!1})),r=()=>{t&&window.clearTimeout(t),t=void 0};e.addEventListener("pointerdown",o=>{e.__hpcOptions?.disabled||0!==o.button||(i=!1,n=o.clientX,a=o.clientY,e.__hpcOptions?.hasHold&&(t=window.setTimeout(()=>{i=!0,t=void 0,navigator.vibrate&&navigator.vibrate(30),s("hold")},500)))}),e.addEventListener("pointermove",e=>{t&&(Math.abs(e.clientX-n)>10||Math.abs(e.clientY-a)>10)&&r()}),e.addEventListener("pointercancel",r),e.addEventListener("pointerleave",r),e.addEventListener("contextmenu",t=>{e.__hpcOptions?.hasHold&&t.preventDefault()}),e.addEventListener("pointerup",n=>{if(e.__hpcOptions?.disabled||0!==n.button)return;const a=!!t;r(),i?i=!1:!a&&e.__hpcOptions?.hasHold||(e.__hpcOptions?.hasDoubleTap?o?(window.clearTimeout(o),o=void 0,s("double_tap")):o=window.setTimeout(()=>{o=void 0,s("tap")},250):s("tap"))}),e.addEventListener("keydown",t=>{e.__hpcOptions?.disabled||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),s("tap"))})}(o),W}render(e){return W}}),Uo={greet_morning:"Good morning",greet_afternoon:"Good afternoon",greet_evening:"Good evening",greet_night:"Good night",greet_with_name:"{greet}, {name}",home:"Home",away:"Away",alarm_disarmed:"Disarmed",alarm_armed_home:"Armed home",alarm_armed_away:"Armed away",alarm_armed_night:"Armed night",alarm_armed_vacation:"Armed vacation",alarm_armed_custom_bypass:"Armed custom",alarm_arming:"Arming",alarm_pending:"Pending",alarm_disarming:"Disarming",alarm_triggered:"Triggered",alarm_btn_arm_home:"Home",alarm_btn_arm_away:"Away",alarm_btn_arm_night:"Night",alarm_btn_arm_vacation:"Vacation",alarm_btn_arm_custom_bypass:"Custom",alarm_btn_disarm:"Disarm",just_now:"just now",today_today:"today",today_tomorrow:"tomorrow",today_until:"until {time}",door_open:"{n} door open",doors_open:"{n} doors open",doors_closed:"Doors closed",window_open:"{n} window open",windows_open:"{n} windows open",windows_closed:"Windows closed",cover_open:"{n} cover open",covers_open_n:"{n} covers open",covers_closed:"Covers closed",lock_unlocked:"{n} unlocked",locks_locked:"Locked",light_on:"{n} light on",lights_on_n:"{n} lights on",lights_off_all:"Lights off",fan_on:"{n} fan on",fans_on_n:"{n} fans on",fans_off_all:"Fans off",switch_on:"{n} switch on",switches_on_n:"{n} switches on",switches_off_all:"Switches off",media_playing_n:"{n} playing",media_idle:"Media idle",climate_on:"{n} climate running",climate_on_n:"{n} climate running",climate_off:"Climate off",alert:"Alert",alerts_n:"{n} alerts",alerts_none:"No alerts",battery_low:"{n} low battery",batteries_low:"{n} low batteries",batteries_ok:"Batteries OK",all_quiet:"All quiet",nudge_nobody_home:"Nobody's home",nudge_away_alarm:"Alarm is off",nudge_fix_lights:"Lights off",nudge_fix_media:"Pause media",nudge_fix_alarm:"Arm away",nudge_unlocked:"{n} lock unlocked",nudge_unlocked_n:"{n} locks unlocked",nudge_fix_locks:"Lock",nudge_fix_doors:"Show doors",nudge_fix_windows:"Show windows",weather_range:"High {high}, low {low}",weather_high:"High {high}",shortcuts_empty:"Add shortcuts in the card editor",ed_shortcuts_own_card:"Shortcuts have their own card: add a “Home Pulse Shortcuts” card next to this one.",ed_shortcuts_move:"These shortcuts keep working here. To give them their own card, add a “Home Pulse Shortcuts” card and move them there.",ed_appearance_tiles:"Separate tiles (like native tile cards)",ed_appearance_one_card:"All in one card",g_alerts:"Safety alerts",g_lights:"Lights",g_doors:"Doors",g_windows:"Windows",g_covers:"Covers",g_locks:"Locks",g_fans:"Fans",g_switches:"Switches & plugs",g_media:"Media",g_climate:"Climate",g_batteries:"Batteries",n_of_m_active:"{n} of {m} active",no_area:"No area",turn_all_on:"All on",turn_all_off:"All off",open_all:"Open all",close_all:"Close all",lock_all:"Lock all",pause_all:"Pause all",close:"Close",ed_section_greeting:"Greeting",ed_section_status:"People, weather & chips",ed_section_alarm:"Alarm",ed_section_modes:"House modes",ed_sec_modes:"House modes",ed_mode_entity:"Mode selector (input_select or select)",ed_modes_hint:"Pick a mode selector to get one button per option, or add modes that run a scene, a script or any action.",ed_modes_hint_auto:"One button per option of the selector. Add modes here to rename, reorder or pick icons and colours.",ed_add_mode:"Add mode",ed_mode_n:"Mode {n}",ed_option:"Option it selects (default: the name)",ed_option_required:"Option it selects (needed without a name)",ed_show_mode_names:"Show names on the mode buttons",ed_mode_default:"Back to normal: the option a second tap on the lit mode selects",ed_modes_hint_names:"Without a name a mode shows only its icon; then pick the option it selects.",mode_back_to:"tap again for {mode}",ed_today_show:"Today line under the date",ed_today_tomorrow:"Include tomorrow",ed_today_calendars:"Calendars (empty = all)",ed_today_entities:"Extra sensors (waste collection, dates, text)",ed_section_pulse:"Home pulse",ed_section_shortcuts:"Shortcuts",ed_sections:"Blocks to show, in order",ed_sec_greeting:"Greeting",ed_sec_status:"People & alarm",ed_sec_alerts:"Safety alerts (only when one trips)",ed_sec_nudges:"Nobody's home hints (only when needed)",ed_sec_alarm:"Alarm panel with buttons",ed_sec_pulse:"Home pulse (lights, windows, …)",ed_sec_shortcuts:"Shortcuts",ed_layout:"Layout",ed_layout_default:"Default",ed_layout_compact:"Compact",ed_appearance:"Appearance",ed_appearance_card:"Card",ed_appearance_flat:"Flat (no background)",ed_title:"Greeting text ({name} = your first name)",ed_show_date:"Show today's date",ed_center_greeting:"Centre the greeting",ed_persons:"People (empty = everyone)",ed_show_away:"Show people who are away",ed_weather_entity:"Weather",ed_alarm_entity:"Alarm panel",ed_alarm_modes:"Arm buttons",ed_pulse:"Groups, in order",ed_show_inactive:"Show groups with nothing active",ed_nudges:"Hints when nobody is home",ed_alert_classes:"Alert device classes",ed_exclude_entities:"Exclude entities",ed_section_labels:"Filter by labels",ed_label_include:"Only count entities with these labels",ed_label_exclude:"Leave out entities with these labels",ed_label_match:"An entity needs",ed_label_match_any:"At least one of the labels",ed_label_match_all:"All of the labels",ed_label_from_device:"Also use the device's labels",ed_battery_threshold:"Low battery threshold (%)",ed_columns:"Tiles per row",ed_show_names:"Show names under icons",ed_add_shortcut:"Add shortcut",ed_shortcut_n:"Shortcut {n}",ed_name:"Name",ed_icon:"Icon",ed_color:"Icon colour",ed_navigation_path:"Open view (pick one, or type e.g. lights)",ed_entity:"Entity (tints the tile when on)",ed_badge:"Badge",ed_badge_none:"None",ed_badge_entity:"Or a badge from an entity (its state, e.g. a count)",ed_tap_action:"Tap action (overrides the view)",ed_hold_action:"Hold action",ed_double_tap_action:"Double tap action",ed_remove:"Remove",ed_move_up:"Move up",ed_move_down:"Move down",ed_none:"None",ed_auto:"Automatic",ed_chips_yaml:"Extra chips are set in YAML (chips:). See the README."},qo={en:Uo,el:{greet_morning:"Καλημέρα",greet_afternoon:"Καλό απόγευμα",greet_evening:"Καλησπέρα",greet_night:"Καληνύχτα",greet_with_name:"{greet}, {name}",home:"Σπίτι",away:"Εκτός",alarm_disarmed:"Αφοπλισμένος",alarm_armed_home:"Οπλισμένος (σπίτι)",alarm_armed_away:"Οπλισμένος (εκτός)",alarm_armed_night:"Οπλισμένος (νύχτα)",alarm_armed_vacation:"Οπλισμένος (διακοπές)",alarm_armed_custom_bypass:"Οπλισμένος (προσαρμ.)",alarm_arming:"Όπλιση",alarm_pending:"Σε αναμονή",alarm_disarming:"Αφόπλιση",alarm_triggered:"Ενεργοποιήθηκε",alarm_btn_arm_home:"Σπίτι",alarm_btn_arm_away:"Εκτός",alarm_btn_arm_night:"Νύχτα",alarm_btn_arm_vacation:"Διακοπές",alarm_btn_arm_custom_bypass:"Προσαρμ.",alarm_btn_disarm:"Αφόπλιση",just_now:"μόλις τώρα",today_today:"σήμερα",today_tomorrow:"αύριο",today_until:"έως {time}",door_open:"{n} πόρτα ανοιχτή",doors_open:"{n} πόρτες ανοιχτές",doors_closed:"Πόρτες κλειστές",window_open:"{n} παράθυρο ανοιχτό",windows_open:"{n} παράθυρα ανοιχτά",windows_closed:"Παράθυρα κλειστά",cover_open:"{n} ρολό ανοιχτό",covers_open_n:"{n} ρολά ανοιχτά",covers_closed:"Ρολά κλειστά",lock_unlocked:"{n} ξεκλείδωτη",locks_locked:"Κλειδωμένα",light_on:"{n} φως αναμμένο",lights_on_n:"{n} φώτα αναμμένα",lights_off_all:"Φώτα σβηστά",fan_on:"{n} ανεμιστήρας",fans_on_n:"{n} ανεμιστήρες",fans_off_all:"Ανεμιστήρες off",switch_on:"{n} διακόπτης on",switches_on_n:"{n} διακόπτες on",switches_off_all:"Διακόπτες off",media_playing_n:"{n} σε αναπαραγωγή",media_idle:"Media σε αδράνεια",climate_on:"{n} κλιματισμός σε λειτουργία",climate_on_n:"{n} κλιματισμοί σε λειτουργία",climate_off:"Κλιματισμός off",alert:"Συναγερμός",alerts_n:"{n} ειδοποιήσεις",alerts_none:"Καμία ειδοποίηση",battery_low:"{n} χαμηλή μπαταρία",batteries_low:"{n} χαμηλές μπαταρίες",batteries_ok:"Μπαταρίες εντάξει",all_quiet:"Όλα ήσυχα",nudge_nobody_home:"Δεν είναι κανείς σπίτι",nudge_away_alarm:"Ο συναγερμός είναι κλειστός",nudge_fix_lights:"Σβήσε τα φώτα",nudge_fix_media:"Παύση media",nudge_fix_alarm:"Όπλιση εκτός",nudge_unlocked:"{n} κλειδαριά ξεκλείδωτη",nudge_unlocked_n:"{n} κλειδαριές ξεκλείδωτες",nudge_fix_locks:"Κλείδωσε",nudge_fix_doors:"Δες τις πόρτες",nudge_fix_windows:"Δες τα παράθυρα",weather_range:"Μέγιστη {high}, ελάχιστη {low}",weather_high:"Μέγιστη {high}",shortcuts_empty:"Πρόσθεσε συντομεύσεις από τον επεξεργαστή της κάρτας",ed_shortcuts_own_card:"Οι συντομεύσεις έχουν δική τους κάρτα: πρόσθεσε μια κάρτα «Home Pulse Shortcuts» δίπλα σε αυτή.",ed_shortcuts_move:"Αυτές οι συντομεύσεις συνεχίζουν να δουλεύουν εδώ. Για δική τους κάρτα, πρόσθεσε μια κάρτα «Home Pulse Shortcuts» και μετάφερέ τες εκεί.",ed_appearance_tiles:"Ξεχωριστά πλακίδια (όπως οι εγγενείς κάρτες tile)",ed_appearance_one_card:"Όλα σε μία κάρτα",g_alerts:"Ειδοποιήσεις ασφαλείας",g_lights:"Φώτα",g_doors:"Πόρτες",g_windows:"Παράθυρα",g_covers:"Ρολά",g_locks:"Κλειδαριές",g_fans:"Ανεμιστήρες",g_switches:"Διακόπτες & πρίζες",g_media:"Media",g_climate:"Κλιματισμός",g_batteries:"Μπαταρίες",n_of_m_active:"{n} από {m} ενεργά",no_area:"Χωρίς χώρο",turn_all_on:"Όλα on",turn_all_off:"Όλα off",open_all:"Άνοιγμα όλων",close_all:"Κλείσιμο όλων",lock_all:"Κλείδωμα όλων",pause_all:"Παύση όλων",close:"Κλείσιμο",ed_section_greeting:"Χαιρετισμός",ed_section_status:"Άτομα, καιρός & chips",ed_section_alarm:"Συναγερμός",ed_section_modes:"Λειτουργίες σπιτιού",ed_sec_modes:"Λειτουργίες σπιτιού",ed_mode_entity:"Επιλογέας λειτουργίας (input_select ή select)",ed_modes_hint:"Διάλεξε επιλογέα για ένα κουμπί ανά επιλογή, ή πρόσθεσε λειτουργίες που τρέχουν σκηνή, script ή οποιαδήποτε ενέργεια.",ed_modes_hint_auto:"Ένα κουμπί ανά επιλογή του επιλογέα. Πρόσθεσε λειτουργίες εδώ για μετονομασία, σειρά, εικονίδια και χρώματα.",ed_add_mode:"Προσθήκη λειτουργίας",ed_mode_n:"Λειτουργία {n}",ed_option:"Επιλογή που ενεργοποιεί (προεπιλογή: το όνομα)",ed_option_required:"Επιλογή που ενεργοποιεί (απαραίτητη χωρίς όνομα)",ed_show_mode_names:"Ονόματα στα κουμπιά λειτουργιών",ed_mode_default:"Επιστροφή στο κανονικό: η επιλογή που διαλέγει το δεύτερο πάτημα στην ενεργή λειτουργία",ed_modes_hint_names:"Χωρίς όνομα μια λειτουργία δείχνει μόνο το εικονίδιό της· τότε διάλεξε την επιλογή που ενεργοποιεί.",mode_back_to:"πάτα ξανά για {mode}",ed_today_show:"Γραμμή «Σήμερα» κάτω από την ημερομηνία",ed_today_tomorrow:"Και τα αυριανά",ed_today_calendars:"Ημερολόγια (κενό = όλα)",ed_today_entities:"Επιπλέον αισθητήρες (απορρίμματα, ημερομηνίες, κείμενο)",ed_section_pulse:"Παλμός σπιτιού",ed_section_shortcuts:"Συντομεύσεις",ed_sections:"Τμήματα προς εμφάνιση, με σειρά",ed_sec_greeting:"Χαιρετισμός",ed_sec_status:"Άτομα & συναγερμός",ed_sec_alerts:"Ειδοποιήσεις ασφαλείας (μόνο όταν ενεργοποιηθούν)",ed_sec_nudges:"Υποδείξεις όταν δεν είναι κανείς σπίτι (μόνο όταν χρειάζεται)",ed_sec_alarm:"Πίνακας συναγερμού με κουμπιά",ed_sec_pulse:"Παλμός σπιτιού (φώτα, παράθυρα, …)",ed_sec_shortcuts:"Συντομεύσεις",ed_layout:"Διάταξη",ed_layout_default:"Κανονική",ed_layout_compact:"Συμπαγής",ed_appearance:"Εμφάνιση",ed_appearance_card:"Κάρτα",ed_appearance_flat:"Επίπεδη (χωρίς φόντο)",ed_title:"Κείμενο χαιρετισμού ({name} = το μικρό σου όνομα)",ed_show_date:"Εμφάνιση σημερινής ημερομηνίας",ed_center_greeting:"Χαιρετισμός στο κέντρο",ed_persons:"Άτομα (κενό = όλοι)",ed_show_away:"Εμφάνιση όσων είναι εκτός",ed_weather_entity:"Καιρός",ed_alarm_entity:"Πίνακας συναγερμού",ed_alarm_modes:"Κουμπιά όπλισης",ed_pulse:"Ομάδες, με σειρά",ed_show_inactive:"Εμφάνιση ομάδων χωρίς ενεργά",ed_nudges:"Υποδείξεις όταν δεν είναι κανείς σπίτι",ed_alert_classes:"Κλάσεις συσκευών ειδοποίησης",ed_exclude_entities:"Εξαίρεση οντοτήτων",ed_section_labels:"Φιλτράρισμα με ετικέτες",ed_label_include:"Μέτρα μόνο οντότητες με αυτές τις ετικέτες",ed_label_exclude:"Άφησε έξω οντότητες με αυτές τις ετικέτες",ed_label_match:"Μια οντότητα χρειάζεται",ed_label_match_any:"Τουλάχιστον μία από τις ετικέτες",ed_label_match_all:"Όλες τις ετικέτες",ed_label_from_device:"Χρήση και των ετικετών της συσκευής",ed_battery_threshold:"Όριο χαμηλής μπαταρίας (%)",ed_columns:"Πλακίδια ανά σειρά",ed_show_names:"Ονόματα κάτω από τα εικονίδια",ed_add_shortcut:"Προσθήκη συντόμευσης",ed_shortcut_n:"Συντόμευση {n}",ed_name:"Όνομα",ed_icon:"Εικονίδιο",ed_color:"Χρώμα εικονιδίου",ed_navigation_path:"Άνοιγμα προβολής (διάλεξε, ή γράψε π.χ. lights)",ed_entity:"Οντότητα (χρωματίζει το πλακίδιο όταν είναι on)",ed_badge:"Σήμα",ed_badge_none:"Κανένα",ed_badge_entity:"Ή σήμα από οντότητα (η κατάστασή της, π.χ. ένας αριθμός)",ed_tap_action:"Ενέργεια πατήματος (αντί για την προβολή)",ed_hold_action:"Ενέργεια παρατεταμένου πατήματος",ed_double_tap_action:"Ενέργεια διπλού πατήματος",ed_remove:"Αφαίρεση",ed_move_up:"Πάνω",ed_move_down:"Κάτω",ed_none:"Κανένα",ed_auto:"Αυτόματα",ed_chips_yaml:"Τα επιπλέον chips ορίζονται σε YAML (chips:). Δες το README."}};function Fo(e,t,o={}){const i=function(e){return(e?.locale?.language||e?.language||"en").split("-")[0]}(e);let n=qo[i]?.[t]??Uo[t]??t;for(const[e,t]of Object.entries(o))n=n.replace(`{${e}}`,String(t));return n}function Wo(e,t,o=Date.now()){const i=Date.parse(t);if(Number.isNaN(i))return"";const n=Math.round((i-o)/1e3);if(Math.abs(n)<45)return Fo(e,"just_now");const a=new Intl.RelativeTimeFormat(e?.locale?.language||e?.language||"en",{numeric:"auto"}),s=[["day",86400],["hour",3600],["minute",60]];for(const[e,t]of s)if(Math.abs(n)>=t)return a.format(Math.round(n/t),e);return a.format(Math.round(n/60),"minute")}const Bo=s`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then the value this card always used. Without the Pulse theme nothing changes. */
    --hpc-accent: var(--pulse-accent, var(--primary-color));
    /* Colours with a meaning: on (lights), needs a look, problem, all good, information. */
    --hpc-amber: var(--pulse-active, var(--amber-color, #ffc107));
    --hpc-orange: var(--pulse-warn, var(--orange-color, #ff9800));
    --hpc-red: var(--pulse-bad, var(--red-color, #f44336));
    --hpc-green: var(--pulse-ok, var(--green-color, #4caf50));
    --hpc-blue: var(--pulse-info, var(--blue-color, #2196f3));
    /* Category colours: Home Assistant's palette (the Pulse theme mutes it). */
    --hpc-deep-orange: var(--deep-orange-color, #ff6f22);
    --hpc-light-blue: var(--light-blue-color, #03a9f4);
    --hpc-cyan: var(--cyan-color, #00bcd4);
    --hpc-teal: var(--teal-color, #009688);
    --hpc-indigo: var(--indigo-color, #3f51b5);
    --hpc-purple: var(--purple-color, #926bc7);
    /* Surfaces: the same two neutral steps Area Pulse uses. */
    --hpc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 5%, transparent));
    --hpc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 9%, transparent));
    --hpc-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --hpc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --hpc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --hpc-chip-height: var(--pulse-chip-height, 30px);
    /* An overview breathes a little more than a room card: the family's gap and padding plus 4px. */
    --hpc-gap: calc(var(--pulse-gap, 12px) + 4px);
    /* Corner glow: warm sun by day, cool moon by night, at the theme's glow strength. Override per theme if you like. */
    --hpc-glow-day: var(--pulse-glow-day, var(--hpc-orange));
    --hpc-glow-night: var(--pulse-glow-night, var(--hpc-blue));
    --hpc-glow-strength: calc(var(--pulse-glow-alpha, 0.16) * 100%);
    --hpc-pad: calc(var(--pulse-pad, 12px) + 4px);
    /* Weather: the sun in the theme's gold (the glow colour is too pale for an icon on a light card),
       the moon in the night glow, snow and hail cold. */
    --hpc-sun: var(--hpc-amber);
    --hpc-moon: var(--pulse-glow-night, var(--hpc-light-blue));
    --hpc-cold: var(--pulse-cold, var(--hpc-light-blue));
    /* Motion: the theme's rhythm, else the durations the card always used. */
    --hpc-motion-fast: var(--pulse-motion-fast, 120ms);
    --hpc-motion-normal: var(--pulse-motion-normal, 200ms);
    --hpc-motion-slow: var(--pulse-motion-slow, 250ms);
    --hpc-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }

  ha-card {
    position: relative;
    height: 100%;
    overflow: hidden;
    container-type: inline-size;
  }
  :host([appearance="flat"]) ha-card {
    background: none;
    border: none;
    box-shadow: none;
    overflow: visible;
  }
  .glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      130% 95% at 0% 0%,
      color-mix(in srgb, var(--hpc-glow) var(--hpc-glow-strength), transparent) 0%,
      transparent 58%
    );
    transition: background 1s ease;
  }
  ha-card.day {
    --hpc-glow: var(--hpc-glow-day);
  }
  ha-card.night {
    --hpc-glow: var(--hpc-glow-night);
  }
  :host([appearance="flat"]) .glow {
    display: none;
  }
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--hpc-gap);
    padding: var(--hpc-pad);
  }
  :host([appearance="flat"]) .content {
    padding: 0;
  }

  button {
    font: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  /* ---- Greeting ---- */
  .greeting {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    padding: 2px 2px 4px;
  }
  .hello-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .hello {
    margin: 0;
    font-size: 24px;
    line-height: 30px;
    font-weight: 500;
    letter-spacing: -0.4px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .date {
    font-size: 14px;
    line-height: 20px;
    color: var(--secondary-text-color);
  }
  .greeting.center {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }
  .greeting.center .hello-text {
    align-items: center;
  }
  .greeting.center .hello {
    font-size: 28px;
    line-height: 34px;
    white-space: normal;
  }
  .greeting.center .weather {
    align-items: center;
  }

  .weather {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    padding: 4px 6px;
    margin: -4px -6px;
    border: none;
    border-radius: var(--hpc-control-radius);
    background: none;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .weather:hover {
    background: var(--hpc-neutral-bg);
  }
  .weather:focus-visible {
    outline: 2px solid var(--hpc-accent);
  }
  .weather-main {
    display: flex;
    align-items: center;
    gap: 6px;
    --mdc-icon-size: 24px;
  }
  .weather-main ha-icon {
    color: var(--c, var(--secondary-text-color));
  }
  .temp {
    font-size: 24px;
    line-height: 30px;
    font-weight: 400;
    letter-spacing: -0.5px;
    font-variant-numeric: tabular-nums;
  }
  .weather-cond {
    font-size: 13px;
    line-height: 18px;
    color: var(--secondary-text-color);
  }
  /* Today's high and low from the forecast, one quiet line. */
  .weather-range {
    display: flex;
    gap: 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    --mdc-icon-size: 12px;
  }
  .weather-range > span {
    display: inline-flex;
    align-items: center;
    gap: 1px;
  }
  .greeting.center .weather-range {
    justify-content: center;
  }

  /* ---- Status row: people, alarm, extra chips ---- */
  .status {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 calc(-1 * var(--hpc-pad));
    padding: 0 var(--hpc-pad);
    scroll-padding: 0 var(--hpc-pad);
    scroll-snap-type: x proximity;
  }
  .status::-webkit-scrollbar {
    display: none;
  }
  .status.overflow {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
    mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
  }
  :host([appearance="flat"]) .status {
    margin: 0;
    padding: 0;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    --c: var(--primary-text-color);
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--hpc-chip-height);
    padding: 0 12px 0 9px;
    border-radius: calc(var(--hpc-chip-height) / 2);
    border: none;
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--hpc-neutral-bg);
    cursor: pointer;
    white-space: nowrap;
    max-width: 100%;
    box-sizing: border-box;
    scroll-snap-align: start;
    user-select: none;
    -webkit-user-select: none;
    transition: background-color var(--hpc-motion-normal) var(--hpc-ease), transform var(--hpc-motion-fast) var(--hpc-ease);
    --mdc-icon-size: 16px;
  }
  .chip ha-icon,
  .chip ha-state-icon {
    color: var(--secondary-text-color);
  }
  .chip:hover {
    background: var(--hpc-neutral-bg-hover);
  }
  .chip:active {
    transform: scale(0.96);
  }
  .chip:focus-visible {
    outline: 2px solid var(--hpc-accent);
    outline-offset: 1px;
  }
  /* Home pulse: neutral fill and text, only the icon carries the meaning (Area Pulse's chip_colors: state). */
  .chip.active ha-icon {
    color: var(--c);
  }
  .chip.idle {
    color: var(--secondary-text-color);
  }
  .chip.colored ha-icon,
  .chip.colored ha-state-icon {
    color: var(--c);
  }
  .chip.calm {
    color: var(--secondary-text-color);
    cursor: default;
  }
  .chip.calm:active {
    transform: none;
  }
  .chip.alarm.loud {
    color: color-mix(in srgb, var(--c) 80%, var(--primary-text-color));
    background: color-mix(in srgb, var(--c) 16%, transparent);
  }
  .chip.alarm.loud ha-icon {
    color: var(--c);
    /* A few blinks when it starts, then still: the tinted chip keeps the attention. */
    animation: hpc-blink 1.4s ease-in-out 3;
  }
  .chip .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chip .muted {
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  /* People: green when home, quieter when away. */
  .chip.person {
    padding-left: 4px;
  }
  .avatar {
    flex: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--hpc-neutral-strong);
    color: var(--primary-text-color);
    background-size: cover;
    background-position: center;
    font-size: 11px;
    font-weight: 600;
  }
  .avatar {
    position: relative;
  }
  .person.home .avatar:not(.pic) {
    background: color-mix(in srgb, var(--hpc-green) 22%, transparent);
    color: var(--hpc-green);
  }
  .person.home .avatar::after {
    content: "";
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--hpc-green);
    border: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
    box-sizing: border-box;
  }
  .person.away {
    color: var(--secondary-text-color);
  }
  .person.away .avatar {
    opacity: 0.55;
    filter: grayscale(1);
  }

  /* ---- Alarm block (opt-in) ---- */
  .alarm-row {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 8px 8px 10px;
    border-radius: var(--hpc-control-radius);
    background: var(--hpc-neutral-bg);
    min-width: 0;
  }
  .alarm-row.triggered {
    background: color-mix(in srgb, var(--hpc-red) 14%, transparent);
  }
  .alarm-main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    border-radius: var(--hpc-control-radius);
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .alarm-main:focus-visible {
    box-shadow: 0 0 0 2px var(--hpc-accent);
  }
  .alarm-icon {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--c) 20%, transparent);
    color: var(--c);
    --mdc-icon-size: 22px;
  }
  .alarm-row.triggered .alarm-icon,
  .alarm-row.pending .alarm-icon {
    background: color-mix(in srgb, var(--c) 20%, transparent);
  }
  .alarm-row.triggered .alarm-icon ha-icon,
  .alarm-row.pending .alarm-icon ha-icon {
    animation: hpc-blink 1.4s ease-in-out 3;
  }
  .alarm-titles {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .alarm-state {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .alarm-sub {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .alarm-buttons {
    flex: none;
    display: flex;
    gap: 6px;
  }
  .alarm-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 40px;
    height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--hpc-control-radius);
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--hpc-neutral-bg-hover);
    cursor: pointer;
    transition: background-color var(--hpc-motion-normal) var(--hpc-ease), transform var(--hpc-motion-fast) var(--hpc-ease);
    --mdc-icon-size: 20px;
  }
  .alarm-btn ha-icon {
    color: var(--b);
  }
  .alarm-btn:hover {
    background: var(--hpc-neutral-strong);
  }
  .alarm-btn:active {
    transform: scale(0.94);
  }
  .alarm-btn:focus-visible {
    outline: 2px solid var(--hpc-accent);
    outline-offset: 1px;
  }
  .alarm-btn .label {
    display: none;
  }
  @container (min-width: 460px) {
    .alarm-btn .label {
      display: inline;
    }
    .alarm-btn {
      padding: 0 14px 0 10px;
    }
  }

  /* ---- Alerts and pulse (pulse is opt-in) ---- */
  .pulse {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  /* The alert line is Area Pulse's alert banner: the one red block, a few blinks, then still. */
  .banner {
    --c: var(--hpc-red);
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 8px 12px;
    box-sizing: border-box;
    border-radius: var(--hpc-control-radius);
    background: color-mix(in srgb, var(--c) 14%, transparent);
    color: var(--c);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    --mdc-icon-size: 20px;
  }
  .banner.alert ha-icon.lead {
    animation: hpc-blink 1.4s ease-in-out 3;
  }
  .banner .text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* "Nobody's home": neutral block and text, the icon says it needs a look; the fixes are actions. */
  .banner.nudge {
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    background: var(--hpc-neutral-bg);
    color: var(--primary-text-color);
    cursor: default;
  }
  .banner.nudge ha-icon.lead {
    margin-top: 1px;
    color: var(--hpc-orange);
  }
  .nudge-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .nudge-title {
    font-weight: 500;
  }
  .nudge-what {
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .nudge-fixes {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }
  .banner .fix {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--hpc-chip-height);
    padding: 0 12px 0 9px;
    border: none;
    border-radius: calc(var(--hpc-chip-height) / 2);
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
    background: var(--hpc-neutral-bg-hover);
    cursor: pointer;
    transition: background-color var(--hpc-motion-normal) var(--hpc-ease), transform var(--hpc-motion-fast) var(--hpc-ease);
    --mdc-icon-size: 16px;
  }
  .banner .fix ha-icon {
    color: var(--hpc-accent);
  }
  .banner .fix:hover {
    background: var(--hpc-neutral-strong);
  }
  .banner .fix:active {
    transform: scale(0.96);
  }
  .banner .fix:focus-visible {
    outline: 2px solid var(--hpc-accent);
    outline-offset: 1px;
  }
  @keyframes hpc-blink {
    50% {
      opacity: 0.35;
    }
  }

  /* ---- Today line (under the date) ---- */
  .today {
    display: flex;
    align-items: center;
    gap: 5px;
    max-width: 100%;
    margin: 3px 0 0 -4px;
    padding: 2px 6px 2px 4px;
    border: none;
    border-radius: 8px;
    background: none;
    font-size: 13px;
    line-height: 18px;
    color: var(--primary-text-color);
    text-align: left;
    cursor: pointer;
    --mdc-icon-size: 15px;
  }
  .today ha-icon {
    flex: none;
    color: var(--hpc-accent);
  }
  .today:hover {
    background: var(--hpc-neutral-bg);
  }
  .today:focus-visible {
    outline: 2px solid var(--hpc-accent);
  }
  .today {
    align-items: flex-start;
  }
  .today ha-icon {
    margin-top: 1px;
  }
  /* Up to two lines, then an ellipsis. */
  .today-text {
    min-width: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .greeting.center .today {
    align-self: center;
    margin-left: 0;
  }

  /* ---- House modes: a segmented control ---- */
  .modes {
    display: flex;
    gap: 4px;
    padding: 4px;
    border-radius: calc(var(--hpc-control-radius) + 4px);
    background: var(--hpc-neutral-bg);
  }
  .mode {
    --c: var(--hpc-accent);
    flex: 1 1 0;
    min-width: 0;
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0 4px;
    border: none;
    border-radius: var(--hpc-control-radius);
    background: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: background-color var(--hpc-motion-slow) var(--hpc-ease), color var(--hpc-motion-slow) var(--hpc-ease),
      transform var(--hpc-motion-fast) var(--hpc-ease);
    --mdc-icon-size: 20px;
  }
  .mode:hover {
    background: var(--hpc-neutral-bg-hover);
  }
  .mode:active {
    transform: scale(0.96);
  }
  .mode:focus-visible {
    outline: 2px solid var(--c);
    outline-offset: -2px;
  }
  /* Like an active tile: a stronger neutral fill and the text colour; the mode's colour stays on the icon. */
  .mode.active,
  .mode.active:hover {
    color: var(--primary-text-color);
    background: var(--hpc-neutral-strong);
  }
  .mode.active ha-icon {
    color: var(--c);
  }
  /* Icons only (show_mode_names: false): a lower row with a slightly larger icon. */
  .mode.icon-only {
    height: 46px;
    --mdc-icon-size: 22px;
  }
  .mode-name {
    max-width: 100%;
    font-size: 11px;
    line-height: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* Wide cards: icon beside the name. */
  @container (min-width: 480px) {
    .mode {
      flex-direction: row;
      gap: 8px;
      height: 46px;
    }
    .mode-name {
      font-size: 13px;
    }
  }

  /* ---- Shortcuts: the main feature ---- */
  .shortcuts {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  /* Rows are balanced in code (7 → 4 + 3); every tile in a row shares the width. */
  .shortcut-row {
    display: flex;
    gap: 10px;
  }
  .shortcut {
    --c: var(--hpc-accent);
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    height: 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 6px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--hpc-control-radius);
    color: var(--primary-text-color);
    background: var(--hpc-neutral-bg);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: background-color var(--hpc-motion-normal) var(--hpc-ease), transform var(--hpc-motion-fast) var(--hpc-ease);
    --mdc-icon-size: 26px;
  }
  .shortcut.named {
    height: 92px;
  }
  .shortcut ha-icon,
  .shortcut ha-state-icon {
    color: var(--c);
  }
  .shortcut:hover {
    background: var(--hpc-neutral-bg-hover);
  }
  .shortcut:active {
    transform: scale(0.97);
  }
  .shortcut:focus-visible {
    outline: 2px solid var(--hpc-accent);
    outline-offset: 1px;
  }
  /* Its entity is on: like an active tile, a stronger neutral fill; the colour stays on the icon. */
  .shortcut.active,
  .shortcut.active:hover {
    background: var(--hpc-neutral-strong);
  }
  /* Flat (the shortcuts card's default): every tile is drawn like a native tile card, with the theme's
     card fill, edge, shadow and blur, so the row sits in a section like HA's own tiles. */
  :host([appearance="flat"]) .shortcut {
    --hpc-tile-bg: var(--ha-card-background, var(--card-background-color, #fff));
    background: var(--hpc-tile-bg);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    border-radius: var(--hpc-radius);
    box-shadow: var(--ha-card-box-shadow, none);
    -webkit-backdrop-filter: var(--ha-card-backdrop-filter, none);
    backdrop-filter: var(--ha-card-backdrop-filter, none);
  }
  :host([appearance="flat"]) .shortcut:hover {
    background: linear-gradient(var(--hpc-neutral-bg), var(--hpc-neutral-bg)), var(--hpc-tile-bg);
  }
  :host([appearance="flat"]) .shortcut.active,
  :host([appearance="flat"]) .shortcut.active:hover {
    background: linear-gradient(var(--hpc-neutral-strong), var(--hpc-neutral-strong)), var(--hpc-tile-bg);
  }
  .shortcut .name {
    max-width: 100%;
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .badge {
    position: absolute;
    top: 8px;
    right: 8px;
    min-width: 20px;
    height: 20px;
    max-width: calc(100% - 16px);
    padding: 0 6px;
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    /* Neutral, unless the count means something (lights on, open, problems): then its tone. */
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 16%, var(--ha-card-background, var(--card-background-color, #fff)));
  }
  .badge.toned {
    color: color-mix(in srgb, var(--t) 70%, var(--primary-text-color));
    background: color-mix(in srgb, var(--t) 26%, var(--ha-card-background, var(--card-background-color, #fff)));
  }

  /* Home Pulse Shortcuts with nothing configured yet: a normal card, even when flat. */
  :host([appearance="flat"]) ha-card.empty-card {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    box-shadow: var(--ha-card-box-shadow, none);
  }
  .empty {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    font-size: 14px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }

  .warning {
    padding: 16px;
    color: var(--warning-color, #ffa600);
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* ---- Compact ---- */
  :host([layout="compact"]) {
    --hpc-gap: 10px;
    --hpc-pad: 10px;
  }
  :host([layout="compact"]) .greeting {
    gap: 12px;
    padding: 0;
  }
  :host([layout="compact"]) .hello {
    font-size: 18px;
    line-height: 24px;
  }
  :host([layout="compact"]) .date,
  :host([layout="compact"]) .weather-cond {
    font-size: 12px;
    line-height: 16px;
  }
  :host([layout="compact"]) .temp {
    font-size: 18px;
    line-height: 24px;
  }
  :host([layout="compact"]) .weather-main {
    --mdc-icon-size: 20px;
  }
  :host([layout="compact"]) .status,
  :host([layout="compact"]) .shortcuts,
  :host([layout="compact"]) .shortcut-row {
    gap: 6px;
  }
  :host([layout="compact"]) .chip {
    height: 26px;
  }
  :host([layout="compact"]) .avatar {
    width: 18px;
    height: 18px;
  }
  :host([layout="compact"]) .mode {
    height: 40px;
    --mdc-icon-size: 18px;
  }
  :host([layout="compact"]) .mode-name {
    font-size: 10px;
  }
  :host([layout="compact"]) .shortcut {
    height: 52px;
    --mdc-icon-size: 22px;
  }
  :host([layout="compact"]) .shortcut.named {
    height: 64px;
    gap: 4px;
    --mdc-icon-size: 22px;
  }
  :host([layout="compact"]) .badge {
    top: 6px;
    right: 6px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
  }
  :host([layout="compact"]) .banner.nudge {
    padding: 10px 12px;
  }
  :host([layout="compact"]) .shortcut .name {
    font-size: 11px;
  }

  @media (prefers-reduced-motion: reduce) {
    .banner.alert ha-icon.lead,
    .alarm-row ha-icon,
    .chip.alarm.loud ha-icon {
      animation: none !important;
    }
    .glow,
    .chip,
    .mode,
    .shortcut,
    .banner .fix,
    .alarm-btn {
      transition: none;
    }
  }
`,Go=s`
  dialog.hpc-popup {
    --c: var(--hpc-accent);
    padding: 0;
    border: none;
    background: transparent;
    width: min(640px, calc(100vw - 32px));
    max-width: none;
    max-height: min(80vh, 760px);
    color: var(--primary-text-color);
    overflow: visible;
  }
  dialog.hpc-popup::backdrop {
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  dialog.hpc-popup[open] .popup-surface {
    animation: hpc-pop 200ms cubic-bezier(0.2, 0.9, 0.3, 1.1);
  }
  @keyframes hpc-pop {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
  }
  .popup-surface {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: min(80vh, 760px);
    padding: 20px;
    box-sizing: border-box;
    border-radius: var(--ha-dialog-border-radius, 28px);
    background: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
  .popup-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .popup-icon {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--hpc-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 22px;
  }
  .popup-icon.active {
    background: color-mix(in srgb, var(--c) 18%, transparent);
    color: var(--c);
  }
  .popup-titles { flex: 1; min-width: 0; }
  .popup-title { font-size: 20px; line-height: 26px; font-weight: 500; }
  .popup-sub { font-size: 13px; color: var(--secondary-text-color); }
  .popup-close {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 22px;
  }
  .popup-close:hover { background: var(--hpc-neutral-bg); }
  .popup-bulk { display: flex; gap: 8px; flex-wrap: wrap; }
  .bulk {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px 0 10px;
    border: none;
    border-radius: 18px;
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    /* A bulk button is an action, not a state: neutral fill and text, the icon in the accent (as in Area Pulse). */
    color: var(--primary-text-color);
    background: var(--hpc-neutral-bg);
    cursor: pointer;
    --mdc-icon-size: 18px;
  }
  .bulk ha-icon { color: var(--hpc-accent); }
  .bulk:hover { background: var(--hpc-neutral-bg-hover); }
  .popup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
    gap: 8px;
    overflow-y: auto;
    padding: 2px;
    margin: -2px;
  }

  /* Fallback tiles (only when HA's card helpers are unavailable) */
  .mini-tile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color);
    background: var(--ha-card-background, var(--card-background-color));
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    outline: none;
    --mdc-icon-size: 20px;
  }
  .mini-tile:focus-visible { box-shadow: 0 0 0 2px var(--c); }
  .mt-icon {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--hpc-neutral-bg);
    color: var(--secondary-text-color);
  }
  .mini-tile.active .mt-icon {
    background: color-mix(in srgb, var(--c) 20%, transparent);
    color: var(--c);
  }
  .mt-text { min-width: 0; }
  .mt-name, .mt-state { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mt-name { font-size: 14px; font-weight: 500; line-height: 20px; }
  .mt-state { font-size: 12px; color: var(--secondary-text-color); line-height: 16px; }

  .popup-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    padding: 2px;
    margin: -2px;
  }
  .popup-body .popup-grid {
    overflow: visible;
  }
  .area-head {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin: 0 2px -6px;
  }

  @media (max-width: 600px) {
    dialog.hpc-popup {
      width: 100vw;
      max-width: 100vw;
      margin: auto 0 0;
    }
    .popup-surface {
      max-height: 86vh;
      border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0;
    }
  }
`,Vo=[...Bt,"vibration","cold","heat","sound","light"],Yo={layout:"default",appearance:"card",sections:Wt,show_date:!0,center_greeting:!1,show_away:!0,alarm_modes:Jt,pulse:Vt,show_inactive:!1,nudges:!0,battery_threshold:20,columns:4,show_names:!0,show_mode_names:!0},Jo=["label_include","label_exclude","label_match","label_from_device"];function Xo(e){const t={};for(const[o,i]of Object.entries(e))null!=i&&""!==i&&(Array.isArray(i)&&0===i.length||(t[o]=i));return t}const Ko=(e,t)=>JSON.stringify(e)===JSON.stringify(t);class Zo extends re{constructor(){super(...arguments),this.kind="overview",this._open=new Set,this._ready=!1,this._t=(e,t)=>Fo(this.hass,e,t),this._label=e=>{if("option"===e.name&&e.required)return this._t("ed_option_required");return["layout","appearance","sections","title","show_date","center_greeting","persons","show_away","weather_entity","alarm_entity","alarm_modes","pulse","show_inactive","nudges","battery_threshold","alert_classes","exclude_entities","columns","show_names","name","icon","color","navigation_path","entity","badge","tap_action","hold_action","double_tap_action","today_show","today_tomorrow","today_calendars","today_entities","mode_entity","option","mode_default","show_mode_names","badge_entity",...Jo].includes(e.name)?this._t(`ed_${e.name}`):e.name}}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const e=await(window.loadCardHelpers?.()),t=await(e?.createCardElement({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch{}}().then(()=>this._ready=!0)}setConfig(e){this._config=e}get _defaults(){return"shortcuts"===this.kind?{...Yo,appearance:"flat"}:Yo}_hasShortcuts(){return!!this._config?.shortcuts?.length}_layoutGrid(){const e=this._t,t=e=>({select:{mode:"dropdown",options:e}}),o="shortcuts"===this.kind;return{type:"grid",name:"",schema:[{name:"layout",selector:t([{value:"default",label:e("ed_layout_default")},{value:"compact",label:e("ed_layout_compact")}])},{name:"appearance",selector:t([{value:"card",label:e(o?"ed_appearance_one_card":"ed_appearance_card")},{value:"flat",label:e(o?"ed_appearance_tiles":"ed_appearance_flat")}])}]}}_tileGrid(){return{type:"grid",name:"",schema:[{name:"columns",selector:{number:{min:1,max:8,mode:"slider"}}},{name:"show_names",selector:{boolean:{}}}]}}_mainSchema(){const e=this._t;return"shortcuts"===this.kind?[this._layoutGrid(),this._tileGrid()]:[this._layoutGrid(),{name:"sections",selector:{select:{multiple:!0,reorder:!0,mode:"list",options:Ft.map(t=>({value:t,label:e(`ed_sec_${t}`)}))}}},{type:"expandable",name:"",title:e("ed_section_greeting"),icon:"mdi:hand-wave-outline",flatten:!0,schema:[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"show_date",selector:{boolean:{}}},{name:"center_greeting",selector:{boolean:{}}}]},{type:"grid",name:"",schema:[{name:"today_show",selector:{boolean:{}}},{name:"today_tomorrow",selector:{boolean:{}}}]},{name:"today_calendars",selector:{entity:{multiple:!0,filter:{domain:"calendar"}}}},{name:"today_entities",selector:{entity:{multiple:!0}}}]},{type:"expandable",name:"",title:e("ed_section_status"),icon:"mdi:account-group-outline",flatten:!0,schema:[{name:"persons",selector:{entity:{multiple:!0,filter:{domain:"person"}}}},{name:"show_away",selector:{boolean:{}}},{name:"weather_entity",selector:{entity:{filter:{domain:"weather"}}}}]},{type:"expandable",name:"",title:e("ed_section_modes"),icon:"mdi:home-switch-outline",flatten:!0,schema:[{name:"mode_entity",selector:{entity:{filter:[{domain:"input_select"},{domain:"select"}]}}},{name:"mode_default",selector:{select:{mode:"dropdown",custom_value:!0,options:this._modeOptions()}}},{name:"show_mode_names",selector:{boolean:{}}}]},{type:"expandable",name:"",title:e("ed_section_alarm"),icon:"mdi:shield-home-outline",flatten:!0,schema:[{name:"alarm_entity",selector:{entity:{filter:{domain:"alarm_control_panel"}}}},{name:"alarm_modes",selector:{select:{multiple:!0,mode:"list",options:Yt.map(t=>({value:t,label:e(`alarm_btn_${t}`)}))}}}]},{type:"expandable",name:"",title:e("ed_section_pulse"),icon:"mdi:heart-pulse",flatten:!0,schema:[{name:"pulse",selector:{select:{multiple:!0,reorder:!0,mode:"list",options:Gt.map(t=>({value:t,label:e(`g_${t}`)}))}}},{name:"show_inactive",selector:{boolean:{}}},{name:"nudges",selector:{boolean:{}}},{name:"battery_threshold",selector:{number:{min:1,max:100,mode:"box",unit_of_measurement:"%"}}},{name:"alert_classes",selector:{select:{multiple:!0,custom_value:!0,mode:"dropdown",options:Vo.map(e=>({value:e,label:e.replace(/_/g," ")}))}}},{name:"exclude_entities",selector:{entity:{multiple:!0}}}]},{type:"expandable",name:"",title:e("ed_section_labels"),icon:"mdi:label-multiple-outline",flatten:!0,schema:[{name:"label_include",selector:{label:{multiple:!0}}},{name:"label_exclude",selector:{label:{multiple:!0}}},{name:"label_match",selector:{select:{mode:"dropdown",options:[{value:"any",label:e("ed_label_match_any")},{value:"all",label:e("ed_label_match_all")}]}}},{name:"label_from_device",selector:{boolean:{}}}]},...this._hasShortcuts()?[this._tileGrid()]:[]]}_shortcutSchema(){const e=this._t;return[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"navigation_path",selector:{navigation:{}}},{type:"grid",name:"",schema:[{name:"color",selector:{ui_color:{}}},{name:"badge",selector:{select:{mode:"dropdown",options:[{value:"none",label:e("ed_badge_none")},...Gt.map(t=>({value:t,label:e(`g_${t}`)}))]}}}]},{name:"badge_entity",selector:{entity:{}}},{name:"entity",selector:{entity:{}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}_modeOptions(){const e=this.hass&&this._config?Ao(this.hass,this._config):void 0,t=e?this.hass.states[e]?.attributes.options:void 0;return(Array.isArray(t)?t:[]).map(e=>({value:e,label:e}))}_modeSchema(e){return[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"option",required:!e.name&&!e.entity&&!e.tap_action,selector:{select:{mode:"dropdown",custom_value:!0,options:this._modeOptions()}}},{name:"color",selector:{ui_color:{}}}]},{name:"entity",selector:{entity:{filter:[{domain:"scene"},{domain:"script"},{domain:"input_boolean"},{domain:"switch"}]}}},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}}]}_formData(){const e=this._config;if("shortcuts"===this.kind)return{...this._defaults,...e};const t="object"==typeof e.today?e.today:{};return{...this._defaults,...e,label_include:It(e.label_filter?.include),label_exclude:It(e.label_filter?.exclude),label_match:e.label_filter?.match??"any",label_from_device:e.label_filter?.from_device??!0,today_show:!1!==e.today,today_tomorrow:!1!==t.tomorrow,today_calendars:t.calendars??[],today_entities:(t.entities??[]).map(e=>"string"==typeof e?e:e.entity)}}_todayFrom(e){const t="object"==typeof this._config?.today?this._config.today:{};if(!1===e.today_show)return!1;const o=new Map((t.entities??[]).filter(e=>"object"==typeof e).map(e=>[e.entity,e])),i=(e.today_entities??[]).map(e=>o.get(e)??e),n=Xo({...t,calendars:e.today_calendars,entities:i,tomorrow:!1!==e.today_tomorrow&&void 0});return Object.keys(n).length?n:void 0}_mainChanged(e){e.stopPropagation();const t={...e.detail.value};if("shortcuts"===this.kind){for(const[e,o]of Object.entries(this._defaults))Ko(t[e],o)&&delete t[e];return void this._commit(Xo({...t,shortcuts:this._config?.shortcuts}))}const o=this._todayFrom(t);for(const e of["today_show","today_tomorrow","today_calendars","today_entities"])delete t[e];const i=Xo({include:t.label_include,exclude:t.label_exclude,match:"all"===t.label_match?"all":void 0,from_device:!1!==t.label_from_device&&void 0});for(const e of Jo)delete t[e];t.label_filter=Object.keys(i).length?i:void 0;for(const[e,o]of Object.entries(this._defaults))Ko(t[e],o)&&delete t[e];const n=Xo({...t,today:o,shortcuts:this._config?.shortcuts,modes:this._config?.modes});!1===o&&(n.today=!1),this._commit(n)}_items(e){return[...this._config?.[e]??[]]}_setItems(e,t){this._commit(Xo({...this._config,[e]:t}))}_itemChanged(e,t,o){o.stopPropagation();const i=this._items(e),n={...o.detail.value};"shortcuts"===e&&this._foldBadge(n,i[t]),i[t]=Xo(n),this._setItems(e,i)}_foldBadge(e,t){const o=t.badge?.includes(".")?t.badge:void 0,i=o?"none":t.badge??"none",n=e.badge??"none",a=e.badge_entity;delete e.badge_entity,e.badge=n!==i?n:(a||void 0)!==o?a||"none":t.badge??"none","none"===e.badge&&delete e.badge}_shortcutData(e){const t=e.badge?.includes(".")?e.badge:void 0;return{...e,badge:t?"none":e.badge??"none",badge_entity:t}}_addItem(e){const t=this._items(e);t.push("shortcuts"===e?{icon:"mdi:view-dashboard-outline"}:{}),this._open=new Set([...this._open,`${e}:${t.length-1}`]),this._setItems(e,t)}_removeItem(e,t){const o=this._items(e);o.splice(t,1),this._open=new Set,this._setItems(e,o)}_moveItem(e,t,o){const i=this._items(e),n=t+o;n<0||n>=i.length||([i[t],i[n]]=[i[n],i[t]],this._open=new Set,this._setItems(e,i))}_toggleOpen(e){const t=new Set(this._open);t.has(e)?t.delete(e):t.add(e),this._open=t}_commit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config||!this._ready)return B;const e=this._config.modes??[],t=F`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._mainSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>
    `;return"shortcuts"===this.kind?F`${t}${this._renderShortcutList()}`:F`
      ${t}
      ${this._config.chips?.length?B:F`<p class="hint">${this._t("ed_chips_yaml")}</p>`}

      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:home-switch-outline"></ha-icon>${this._t("ed_section_modes")}</div>
        <p class="hint">${this._t(this._config.mode_entity&&!e.length?"ed_modes_hint_auto":"ed_modes_hint")}</p>
        ${e.length?F`<p class="hint">${this._t("ed_modes_hint_names")}</p>`:B}
        ${e.map((t,o)=>this._renderItem("modes",t,o,e.length,t.name||t.option||t.entity||this._t("ed_mode_n",{n:o+1}),t.icon,this._modeSchema(t),{}))}
        <button class="add" @click=${()=>this._addItem("modes")}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_mode")}
        </button>
      </div>

      ${this._hasShortcuts()?this._renderShortcutList(this._t("ed_shortcuts_move")):F`<div class="section">
            <div class="section-title"><ha-icon icon="mdi:view-grid-outline"></ha-icon>${this._t("ed_section_shortcuts")}</div>
            <p class="hint">${this._t("ed_shortcuts_own_card")}</p>
          </div>`}
    `}_renderShortcutList(e){const t=this._config?.shortcuts??[];return F`
      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:view-grid-outline"></ha-icon>${this._t("ed_section_shortcuts")}</div>
        ${e?F`<p class="hint">${e}</p>`:B}
        ${t.map((e,o)=>this._renderItem("shortcuts",this._shortcutData(e),o,t.length,e.name||e.navigation_path||e.entity||this._t("ed_shortcut_n",{n:o+1}),e.icon,this._shortcutSchema(),{}))}
        <button class="add" @click=${()=>this._addItem("shortcuts")}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_shortcut")}
        </button>
      </div>
    `}_renderItem(e,t,o,i,n,a,s,r){const c=`${e}:${o}`,l=this._open.has(c);return F`
      <div class="item">
        <div class="item-head">
          <button class="head-main" @click=${()=>this._toggleOpen(c)} aria-expanded=${String(l)}>
            <ha-icon .icon=${l?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
            ${a?F`<ha-icon class="sc-icon" .icon=${a}></ha-icon>`:B}
            <span>${n}</span>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_up")} ?disabled=${0===o} @click=${()=>this._moveItem(e,o,-1)}>
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
          <button class="icon-btn" title=${this._t("ed_move_down")} ?disabled=${o===i-1} @click=${()=>this._moveItem(e,o,1)}>
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
          <button class="icon-btn danger" title=${this._t("ed_remove")} @click=${()=>this._removeItem(e,o)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${l?F`
              <div class="item-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${{...r,...t}}
                  .schema=${s}
                  .computeLabel=${this._label}
                  @value-changed=${t=>this._itemChanged(e,o,t)}
                ></ha-form>
              </div>
            `:B}
      </div>
    `}}Zo.styles=s`
    :host { display: block; }
    .section { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-weight: 500; font-size: 15px; color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-title ha-icon { color: var(--secondary-text-color); }
    .item { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; }
    .item-head { display: flex; align-items: center; gap: 2px; padding: 4px; }
    button {
      font: inherit; color: var(--primary-text-color); background: none; border: none; cursor: pointer;
      border-radius: 8px; --mdc-icon-size: 20px;
    }
    button:hover:not([disabled]) { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    button[disabled] { opacity: 0.35; cursor: default; }
    .head-main { flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px; text-align: left; min-width: 0; }
    .head-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sc-icon { color: var(--secondary-text-color); }
    .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .icon-btn.danger ha-icon { color: var(--error-color, #db4437); }
    .item-body { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
    .hint { margin: 8px 0 0; font-size: 13px; color: var(--secondary-text-color); }
    .add {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; border: 1px dashed var(--divider-color); border-radius: 12px; color: var(--primary-color);
      font-weight: 500;
    }
  `,e([he({attribute:!1})],Zo.prototype,"hass",void 0),e([pe()],Zo.prototype,"_config",void 0),e([pe()],Zo.prototype,"_open",void 0),e([pe()],Zo.prototype,"_ready",void 0);class Qo extends Zo{constructor(){super(...arguments),this.kind="shortcuts"}}customElements.get("home-pulse-card-editor")||(customElements.define("home-pulse-card-editor",Zo),customElements.define("home-pulse-shortcuts-card-editor",Qo));const ei={alerts:{icon:"mdi:alert",iconOff:"mdi:shield-check",keys:["alert","alerts_n","alerts_none"]},lights:{icon:"mdi:lightbulb-on",iconOff:"mdi:lightbulb-outline",keys:["light_on","lights_on_n","lights_off_all"]},doors:{icon:"mdi:door-open",iconOff:"mdi:door-closed",keys:["door_open","doors_open","doors_closed"]},windows:{icon:"mdi:window-open-variant",iconOff:"mdi:window-closed-variant",keys:["window_open","windows_open","windows_closed"]},covers:{icon:"mdi:window-shutter-open",iconOff:"mdi:window-shutter",keys:["cover_open","covers_open_n","covers_closed"]},locks:{icon:"mdi:lock-open-variant",iconOff:"mdi:lock",keys:["lock_unlocked","lock_unlocked","locks_locked"]},fans:{icon:"mdi:fan",iconOff:"mdi:fan-off",keys:["fan_on","fans_on_n","fans_off_all"]},switches:{icon:"mdi:power-socket-eu",iconOff:"mdi:power-plug-off-outline",keys:["switch_on","switches_on_n","switches_off_all"]},media:{icon:"mdi:play-circle",iconOff:"mdi:speaker",keys:["media_playing_n","media_playing_n","media_idle"]},climate:{icon:"mdi:thermostat",iconOff:"mdi:thermostat",keys:["climate_on","climate_on_n","climate_off"]},batteries:{icon:"mdi:battery-alert-variant-outline",iconOff:"mdi:battery",keys:["battery_low","batteries_low","batteries_ok"]}},ti={"":"var(--secondary-text-color)",on:"var(--hpc-amber)",warn:"var(--hpc-orange)",bad:"var(--hpc-red)"},oi={disarmed:"mdi:shield-off-outline",armed_home:"mdi:shield-home",armed_away:"mdi:shield-lock",armed_night:"mdi:shield-moon",armed_vacation:"mdi:shield-airplane",armed_custom_bypass:"mdi:shield-star",arming:"mdi:shield-sync",pending:"mdi:shield-sync",disarming:"mdi:shield-sync",triggered:"mdi:bell-ring"},ii={arm_home:"mdi:shield-home",arm_away:"mdi:shield-lock",arm_night:"mdi:shield-moon",arm_vacation:"mdi:shield-airplane",arm_custom_bypass:"mdi:shield-star",disarm:"mdi:shield-off"},ni={sunny:"var(--hpc-sun)",partlycloudy:"var(--hpc-sun)","clear-night":"var(--hpc-moon)",rainy:"var(--hpc-blue)",pouring:"var(--hpc-blue)",lightning:"var(--hpc-orange)","lightning-rainy":"var(--hpc-orange)",snowy:"var(--hpc-cold)","snowy-rainy":"var(--hpc-cold)",hail:"var(--hpc-cold)"},ai=e=>ni[e]??"var(--secondary-text-color)";function si(e){const t="triggered"===e?"var(--hpc-red)":["arming","pending","disarming"].includes(e)?"var(--hpc-orange)":e.startsWith("armed")?"var(--hpc-green)":"var(--hpc-blue)";return`var(--state-alarm_control_panel-${e}-color, ${t})`}class ri extends re{constructor(){super(...arguments),this.layout="default",this.appearance="card",this._popupEntities=[],this._onDialogClosed=()=>{if(this._reopen){const e=this._reopen;this._reopen=void 0,this._openPopup(e)}},this._indexDeps=[],this._labelsRequested=!1,this._persons=[],this._calendars=[],this._watched=new Set,this._checkStatusOverflow=()=>{const e=this.renderRoot.querySelector(".status");e&&e.classList.toggle("overflow",e.scrollLeft+e.clientWidth<e.scrollWidth-4)},this._t=(e,t)=>Fo(this.hass,e,t)}static getConfigElement(){return document.createElement("home-pulse-card-editor")}static getStubConfig(){return{}}setConfig(e){if(!e)throw new Error("Invalid configuration");for(const t of["shortcuts","chips","persons","sections","pulse","alarm_modes","exclude_entities"])if(void 0!==e[t]&&!Array.isArray(e[t]))throw new Error(`\`${t}\` must be a list`);for(const t of e.chips??[])if(!t||"object"!=typeof t||!t.entity)throw new Error("Every item in `chips` needs an `entity`");if(void 0!==e.label_filter&&("object"!=typeof e.label_filter||Array.isArray(e.label_filter)))throw new Error("`label_filter` must be a map with `include` and/or `exclude`");const t=(e.sections??[]).filter(e=>!Ft.includes(e));if(t.length)throw new Error(`Unknown section(s): ${t.join(", ")}. Use ${Ft.join(", ")}.`);this._config={...e},this.layout="compact"===e.layout?"compact":"default",this.appearance="flat"===e.appearance?"flat":"card",this._popup=void 0,this._indexDeps=[]}getCardSize(){const e=this._config?.sections??Wt;return Math.max(1,e.length+("compact"===this.layout?0:1))}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),6e4),window.addEventListener("dialog-closed",this._onDialogClosed)}disconnectedCallback(){super.disconnectedCallback(),this._ticker&&window.clearInterval(this._ticker),window.removeEventListener("dialog-closed",this._onDialogClosed),this._unsubscribeForecast()}_syncForecast(){const e=this.hass,t=this._config?.sections??Wt,o=(t.includes("greeting")||t.includes("status"))&&this.isConnected?this._weather:void 0,i=o?xo(e?.states[o]):void 0,n=o&&i?`${o}|${i}`:void 0;n!==this._forecastFor&&(this._unsubscribeForecast(),n&&e?.connection&&(this._forecastFor=n,this._forecastUnsub=e.connection.subscribeMessage(e=>{this._forecast=Array.isArray(e?.forecast)?e.forecast:void 0,this.requestUpdate()},{type:"weather/subscribe_forecast",forecast_type:i,entity_id:o}).catch(()=>{})))}_unsubscribeForecast(){this._forecastUnsub?.then(e=>e?.()),this._forecastUnsub=void 0,this._forecastFor=void 0,this._forecast=void 0}shouldUpdate(e){if(!this._config)return!1;if(e.has("hass")&&this.hass)for(const e of this._tiles?.values()??[])e.hass=this.hass;if(!e.has("hass")||e.size>1)return!0;const t=e.get("hass"),o=this.hass;if(!t||!o)return!0;if(t.entities!==o.entities||t.devices!==o.devices||t.areas!==o.areas||t.user!==o.user||t.locale!==o.locale||t.language!==o.language||t.themes!==o.themes)return!0;for(const e of this._watched)if(t.states[e]!==o.states[e])return!0;return!1}willUpdate(){const e=this.hass,t=this._config;if(!e||!t)return;this._ensureLabelRegistry();const o=[e.entities,e.devices,t,this._labelRegistry];if(!this._index||o.some((e,t)=>e!==this._indexDeps[t])){const i=t.sections??Wt,n=(...e)=>e.some(e=>i.includes(e));this._index=no(e,t,this._labelFilter()),this._persons=n("status","nudges")?function(e,t){return t.persons?.length?t.persons.filter(t=>e.states[t]):Object.keys(e.states).filter(t=>"person"===Kt(t)&&eo(e,t)).sort(to(e))}(e,t):[],this._weather=n("greeting","status")?oo(e,"weather",t.weather_entity):void 0,this._alarm=n("status","alarm","nudges")?oo(e,"alarm_control_panel",t.alarm_entity):void 0,this._modeEntity=n("modes")?Ao(e,t):void 0,this._calendars=n("greeting")?zo(e,t):[],this._watched=function(e,t,o,i){const n=new Set(o);for(const e of i)e&&n.add(e);for(const t of e.chips??[])t.entity&&n.add(t.entity);for(const t of e.shortcuts??[])t.entity&&n.add(t.entity),t.badge&&t.badge.includes(".")&&n.add(t.badge);const a=e.sections??Wt,s=new Set;if(a.includes("pulse"))for(const t of e.pulse??Vt)s.add(t);if(a.includes("alerts")&&s.add("alerts"),a.includes("nudges")&&!1!==e.nudges)for(const e of ho)s.add(e);for(const t of e.shortcuts??[])t.badge&&Gt.includes(t.badge)&&s.add(t.badge);for(const e of s)for(const o of t[e]??[])n.add(o);return n}(t,this._index,this._persons,[this._weather,this._alarm,this._showGlow?"sun.sun":void 0,...n("modes")?Mo(e,{...t,mode_entity:this._modeEntity??"none"}):[],...this._calendars,...n("greeting")?To(t).map(e=>e.entity):[]]),this._indexDeps=o}}_labelFilter(){return function(e,t){if(!Ht(e))return Dt;const o=It(e.include),i=It(e.exclude);return{active:!0,include:new Set(o.map(e=>Rt(e,t))),exclude:new Set(i.map(e=>Rt(e,t))),match:"all"===e.match?"all":"any",fromDevice:!1!==e.from_device,includeNames:o}}(this._config?.label_filter,this._labelRegistry)}_ensureLabelRegistry(){var e;!this._labelsRequested&&this.hass&&Ht(this._config?.label_filter)&&(this._labelsRequested=!0,(e=this.hass,e.callWS?(qt||(qt=e.callWS({type:"config/label_registry/list"}).catch(e=>{throw qt=void 0,e})),qt):Promise.resolve([])).then(e=>this._labelRegistry=e).catch(()=>{}).finally(()=>this.requestUpdate()))}get _showGlow(){return!0}updated(){this._syncForecast(),this._checkStatusOverflow();const e=this.renderRoot.querySelector("dialog.hpc-popup");if(e&&!e.open)try{e.showModal()}catch{e.setAttribute("open","")}}render(){const e=this.hass,t=this._config;if(!e||!t)return B;const o=this._index??no(e,t,this._labelFilter()),i=(t.sections??Wt).filter(e=>Ft.includes(e)),n=i.includes("greeting"),a=!i.includes("alarm"),s=i.includes("pulse")?ro(e,t,o):[],r=(c=e.states["sun.sun"],l=(new Date).getHours(),"below_horizon"===c?.state||"above_horizon"!==c?.state&&(l>=20||l<7));var c,l;const d={greeting:()=>this._renderGreeting(function(e){return e>=5&&e<12?"greet_morning":e>=12&&e<17?"greet_afternoon":e>=17&&e<22?"greet_evening":"greet_night"}((new Date).getHours())),status:()=>this._renderStatus(!n,a),alerts:()=>this._renderAlerts(o),nudges:()=>this._renderNudgeBlock(o),modes:()=>this._renderModes(),alarm:()=>this._renderAlarm(),pulse:()=>this._renderPulse(s),shortcuts:()=>this._renderShortcuts(o)};return F`
      <ha-card class=${r?"night":"day"}>
        ${this._showGlow?F`<div class="glow"></div>`:B}
        <div class="content">${i.map(e=>d[e]())}</div>
      </ha-card>
      ${this._popup?this._renderPopup(ro(e,{...t,pulse:[this._popup]},o)[0]??this._groupFromIndex(this._popup,o)):B}
    `}_renderGreeting(e){const t=this._config,o=Qt(this.hass.user?.name),i=this._t(e),n=t.title?t.title.replace("{name}",o).replace("{greeting}",i):o?this._t("greet_with_name",{greet:i,name:o}):i,a=!1===t.show_date?void 0:new Intl.DateTimeFormat(this.hass.locale?.language||this.hass.language||"en",{weekday:"long",day:"numeric",month:"long"}).format(new Date),s=this._weather?this.hass.states[this._weather]:void 0;return F`
      <div class=${fe({greeting:!0,center:!!t.center_greeting})}>
        <div class="hello-text">
          <h2 class="hello">${n}</h2>
          ${a?F`<div class="date">${a}</div>`:B}
          ${this._renderToday()}
        </div>
        ${s?this._renderWeather(s):B}
      </div>
    `}_renderToday(){const e=this.hass,t=this._config,o=function(e,t,o,i=zo(e,t)){const n=No(t);if(!n)return[];const a=!1!==n.tomorrow,s=[];for(const t of i){const i=e.states[t],n=i&&Do(i,o,a);n&&s.push(n)}for(const{entity:i,name:n}of To(t)){const t=e.states[i],r=t&&Ho(t,n,o,a);r&&s.push(r)}const r=e=>e.until?0:0===e.day?1:1===e.day?2:3;return s.sort((e,t)=>r(e)-r(t)||(e.start?.getTime()??0)-(t.start?.getTime()??0))}(e,t,new Date,this._calendars);if(!o.length)return B;const i=e.locale?.language||e.language||"en",n=e.locale?.time_format,a=new Intl.DateTimeFormat(i,{hour:"numeric",minute:"2-digit",..."24"===n?{hourCycle:"h23"}:"12"===n?{hourCycle:"h12"}:{}}),s=e=>a.format(e),r=o.map(e=>function(e,t,o){if(e.until)return`${e.title} ${t("today_until",{time:o(e.until)})}`;const i=[e.title];return 1===e.day?i.push(t("today_tomorrow")):0===e.day&&e.dated&&i.push(t("today_today")),e.start&&i.push(o(e.start)),i.join(" ")}(e,this._t,s)).join(" · "),c="object"==typeof t.today&&t.today.tap_action||{action:"more-info"};return F`
      <button
        class="today"
        title=${r}
        @click=${()=>this._fireAction({entity:o[0].entity,tap_action:c},"tap")}
      >
        <ha-icon icon="mdi:calendar-today-outline"></ha-icon><span class="today-text">${r}</span>
      </button>
    `}_renderModes(){const e=Eo(this.hass,{...this._config,mode_entity:this._modeEntity??"none"});return e.length?F`
      <div class="modes" role="group">
        ${e.map(e=>this._renderMode(e))}
      </div>
    `:B}_renderMode(e){const t=!1!==this._config.show_mode_names&&!!e.name,o=void 0!==e.resetTo?`${e.name} · ${this._t("mode_back_to",{mode:e.resetTo})}`:e.name;return F`
      <button
        class=${fe({mode:!0,active:e.active,"icon-only":!t})}
        style=${xe({"--c":e.color?fo(e.color):"var(--hpc-accent)"})}
        aria-pressed=${String(e.active)}
        aria-label=${o}
        title=${o}
        ${Ro({hasHold:!!e.hold_action})}
        @hpc-action=${t=>this._fireAction({entity:e.entity,tap_action:e.tap_action,hold_action:e.hold_action},t.detail.action)}
      >
        <ha-icon .icon=${e.icon}></ha-icon>
        ${t?F`<span class="mode-name">${e.name}</span>`:B}
      </button>
    `}_renderStatus(e,t){const o=this.hass,i=this._config,n=this._persons.filter(e=>!1!==i.show_away||io(o.states[e])),a=e&&this._weather?o.states[this._weather]:void 0,s=t&&this._alarm?o.states[this._alarm]:void 0,r=i.chips??[];return n.length||a||s||r.length?F`
      <div class="status" @scroll=${this._checkStatusOverflow}>
        ${a?this._renderWeatherChip(a):B}
        ${s?this._renderAlarmChip(s):B}
        ${n.map(e=>this._renderPerson(o.states[e]))}
        ${r.map(e=>this._renderExtraChip(e))}
      </div>
    `:B}_renderWeather(e){const t=yo(e),o=xo(e),i=o&&this._forecastFor?.startsWith(`${e.entity_id}|`)?function(e,t,o=new Date){if(!Array.isArray(e)||!e.length)return;const i=e.map(e=>({i:e,d:new Date(e.datetime)})).filter(({i:e,d:t})=>"number"==typeof e.temperature&&!Number.isNaN(t.getTime())),n=i.filter(({d:e})=>((e,t)=>e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate())(e,o)).map(({i:e})=>e);let a;if(a="daily"===t?n.length?[n[0]]:i.length?[i[0].i]:[]:"twice_daily"===t||n.length>=3?n:[],!a.length)return;const s=a.map(e=>e.temperature),r=a.map(e=>"number"==typeof e.templow?e.templow:"daily"===t?void 0:e.temperature),c=r.filter(e=>"number"==typeof e),l=Math.round(Math.max(...s)),d=c.length?Math.round(Math.min(...c)):void 0;return void 0!==d&&d<l?{high:l,low:d}:{high:l}}(this._forecast,o):void 0,n=i?void 0===i.low?this._t("weather_high",{high:`${i.high}°`}):this._t("weather_range",{high:`${i.high}°`,low:`${i.low}°`}):"";return F`
      <button
        class="weather"
        title=${n?`${this._format(e)} · ${n}`:this._format(e)}
        style=${xe({"--c":ai(e.state)})}
        @click=${()=>this._moreInfo(e.entity_id)}
      >
        <span class="weather-main">
          <ha-icon .icon=${bo(e.state)}></ha-icon>${t?F`<span class="temp">${t}</span>`:B}
        </span>
        <span class="weather-cond">${this._format(e)}</span>
        ${i?F`<span class="weather-range" aria-label=${n}>
              <span><ha-icon icon="mdi:arrow-up"></ha-icon>${i.high}°</span>
              ${void 0!==i.low?F`<span><ha-icon icon="mdi:arrow-down"></ha-icon>${i.low}°</span>`:B}
            </span>`:B}
      </button>
    `}_renderWeatherChip(e){const t=yo(e);return F`
      <button class="chip colored" style=${xe({"--c":ai(e.state)})} @click=${()=>this._moreInfo(e.entity_id)}>
        <ha-icon .icon=${bo(e.state)}></ha-icon>
        <span class="label">${t?F`${t}<span class="muted"> · ${this._format(e)}</span>`:this._format(e)}</span>
      </button>
    `}_renderAlarmChip(e){const t=lo(e,this._config.alarm_modes),o=this.hass.formatEntityState?.(e)??this._t(`alarm_${e.state}`);return F`
      <button
        class=${fe({chip:!0,colored:!0,alarm:!0,loud:"triggered"===t?.tone||"pending"===t?.tone})}
        style=${xe({"--c":si(e.state)})}
        @click=${()=>this._moreInfo(e.entity_id)}
      >
        <ha-icon .icon=${oi[e.state]??"mdi:shield-outline"}></ha-icon>
        <span class="label">${o}</span>
      </button>
    `}_renderAlerts(e){const t=this.hass,o=e.alerts.filter(e=>"on"===t.states[e]?.state);return o.length?this._renderAlertBanner({id:"alerts",entities:e.alerts,active:o}):B}_renderPerson(e){if(!e)return B;const t=io(e),o=Qt(String(e.attributes.friendly_name??e.entity_id.split(".")[1])),i=e.attributes.entity_picture,n=t?"":"not_home"===e.state?this._t("away"):this._format(e);return F`
      <button
        class=${fe({chip:!0,person:!0,home:t,away:!t})}
        title=${`${e.attributes.friendly_name??o}: ${t?this._t("home"):n}`}
        @click=${()=>this._moreInfo(e.entity_id)}
      >
        <span
          class=${fe({avatar:!0,pic:!!i})}
          style=${xe(i?{backgroundImage:`url("${i}")`}:{})}
          >${i?B:o.charAt(0)}</span
        >
        <span class="label">${o}${n?F`<span class="muted"> · ${n}</span>`:B}</span>
      </button>
    `}_renderExtraChip(e){const t=this.hass.states[e.entity];if(!t)return B;const o=this._format(t),i=e.color?fo(e.color):"var(--secondary-text-color)";return F`
      <button
        class=${fe({chip:!0,colored:!!e.color})}
        style=${xe({"--c":i})}
        ${Ro({hasHold:!!e.hold_action})}
        @hpc-action=${t=>this._fireAction({entity:e.entity,tap_action:e.tap_action??{action:"more-info"},hold_action:e.hold_action},t.detail.action)}
      >
        ${e.icon?F`<ha-icon .icon=${e.icon}></ha-icon>`:F`<ha-state-icon .hass=${this.hass} .stateObj=${t}></ha-state-icon>`}
        <span class="label">${e.name?F`${e.name}<span class="muted"> · ${o}</span>`:o}</span>
      </button>
    `}_renderAlarm(){if(!this._alarm)return B;const e=this.hass.states[this._alarm],t=lo(e,this._config.alarm_modes);if(!e||!t)return B;const o=this.hass.formatEntityState?.(e)??this._t(`alarm_${e.state}`);return F`
      <div class=${fe({"alarm-row":!0,[t.tone]:!0})} style=${xe({"--c":si(e.state)})}>
        <div
          class="alarm-main"
          role="button"
          tabindex="0"
          @click=${()=>this._moreInfo(e.entity_id)}
          @keydown=${t=>("Enter"===t.key||" "===t.key)&&this._moreInfo(e.entity_id)}
        >
          <div class="alarm-icon"><ha-icon .icon=${oi[e.state]??"mdi:shield-outline"}></ha-icon></div>
          <div class="alarm-titles">
            <span class="alarm-state">${o}</span>
            <span class="alarm-sub">${Wo(this.hass,e.last_changed)}</span>
          </div>
        </div>
        <div class="alarm-buttons">${t.buttons.map(t=>this._renderAlarmButton(t,e.entity_id))}</div>
      </div>
    `}_renderAlarmButton(e,t){const o=this._t(`alarm_btn_${e.mode}`),i="disarm"===e.mode?"disarmed":`armed_${e.mode.replace("arm_","")}`;return F`
      <button
        class="alarm-btn"
        style=${xe({"--b":si(i)})}
        title=${o}
        aria-label=${o}
        @click=${()=>e.needsCode?this._moreInfo(t):this._fireAction({tap_action:{action:"perform-action",perform_action:e.service,target:{entity_id:t}}},"tap")}
      >
        <ha-icon .icon=${ii[e.mode]}></ha-icon><span class="label">${o}</span>
      </button>
    `}_renderPulse(e){const t=this._config;this.hass;const o=e.filter(e=>e.active.length>0||t.show_inactive),i=!o.some(e=>e.active.length);return F`
      <div class="pulse">
        <div class="chips">
          ${i?F`<span class="chip calm"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this._t("all_quiet")}</span>`:B}
          ${o.map(e=>this._renderPulseChip(e))}
        </div>
      </div>
    `}_renderAlertBanner(e){const t=1===e.active.length?this.hass.states[e.active[0]]:void 0,o=t?String(t.attributes.friendly_name??t.entity_id):this._t("alerts_n",{n:e.active.length});return F`
      <div class="banner alert" role="button" tabindex="0" @click=${()=>this._groupClick(e)}>
        <ha-icon class="lead" icon="mdi:alert"></ha-icon>
        <span class="text">${o}</span>
      </div>
    `}_renderNudgeBlock(e){if(!1===this._config.nudges)return B;const t=this.hass,o=ro(t,{...this._config,pulse:ho},e),i=function(e,t,o,i){if(!t.length||t.some(t=>io(e.states[t])))return[];const n=[],a=e=>o.find(t=>t.id===e)?.active??[];for(const e of["doors","windows"]){const t=a(e);t.length&&n.push({id:`away_${e}`,n:t.length,entities:t,popup:e})}const s=a("locks");s.length&&n.push({id:"away_locks",n:s.length,entities:s,action:{action:"perform-action",perform_action:"lock.lock",target:{entity_id:s}}});const r=a("lights");r.length&&n.push({id:"away_lights",n:r.length,entities:r,action:{action:"perform-action",perform_action:"light.turn_off",target:{entity_id:r}}});const c=a("media");c.length&&n.push({id:"away_media",n:c.length,entities:c,action:{action:"perform-action",perform_action:"media_player.media_pause",target:{entity_id:c}}});const l=i?lo(e.states[i]):void 0,d=l?.buttons.find(e=>"arm_away"===e.mode);return"disarmed"===l?.tone&&d&&n.push({id:"away_alarm",n:1,entities:[i],action:d.needsCode?{action:"more-info",entity:i}:{action:"perform-action",perform_action:d.service,target:{entity_id:i}}}),n}(t,this._persons,o,this._alarm);return i.length?this._renderNudges(i):B}_renderNudges(e){const t={away_doors:["door_open","doors_open"],away_windows:["window_open","windows_open"],away_locks:["nudge_unlocked","nudge_unlocked_n"],away_lights:["light_on","lights_on_n"],away_media:["media_playing_n","media_playing_n"],away_alarm:["nudge_away_alarm","nudge_away_alarm"]},o=e.map(e=>this._t(t[e.id][1===e.n?0:1],{n:e.n})),i={away_doors:{key:"nudge_fix_doors",icon:"mdi:door-open"},away_windows:{key:"nudge_fix_windows",icon:"mdi:window-open-variant"},away_locks:{key:"nudge_fix_locks",icon:"mdi:lock"},away_lights:{key:"nudge_fix_lights",icon:"mdi:lightbulb-group-off-outline"},away_media:{key:"nudge_fix_media",icon:"mdi:pause"},away_alarm:{key:"nudge_fix_alarm",icon:"mdi:shield-lock"}};return F`
      <div class="banner nudge">
        <ha-icon class="lead" icon="mdi:home-export-outline"></ha-icon>
        <div class="nudge-body">
          <div class="nudge-title">${this._t("nudge_nobody_home")}</div>
          <div class="nudge-what">${o.join(" · ")}</div>
          <div class="nudge-fixes">
            ${e.map(e=>F`<button
                class="fix"
                @click=${()=>e.popup?this._groupClick({id:e.popup,entities:e.entities,active:e.entities}):this._fireAction({entity:e.entities[0],tap_action:e.action},"tap")}
              >
                <ha-icon .icon=${i[e.id].icon}></ha-icon>${this._t(i[e.id].key)}
              </button>`)}
          </div>
        </div>
      </div>
    `}_renderPulseChip(e){const t=ei[e.id],o=e.active.length,i=this._t(0===o?t.keys[2]:1===o?t.keys[0]:t.keys[1],{n:o});return F`
      <button
        class=${fe({chip:!0,active:o>0,idle:0===o})}
        style=${xe({"--c":ti[so(e.id)]})}
        @click=${()=>this._groupClick(e)}
      >
        <ha-icon .icon=${o?t.icon:t.iconOff}></ha-icon>
        <span class="label">${i}</span>
      </button>
    `}_groupColor(e){const t=so(e);return t?ti[t]:"var(--hpc-accent)"}_renderShortcuts(e){const t=this._config,o=t.shortcuts??[];if(!o.length)return B;const i=Math.min(8,Math.max(1,Math.round(t.columns??4)));let n=0;return F`
      <div class="shortcuts">
        ${function(e,t){if(e<=0)return[];const o=Math.max(1,Math.floor(t)),i=Math.ceil(e/o),n=Math.floor(e/i),a=e%i;return Array.from({length:i},(e,t)=>n+(t<a?1:0))}(o.length,i).map(t=>{const i=o.slice(n,n+=t);return F`<div class="shortcut-row">${i.map(t=>this._renderShortcut(t,e))}</div>`})}
      </div>
    `}_renderShortcut(e,t){const o=this.hass,i=function(e,t,o,i=20){const n=t.badge;if(!n)return;if(Gt.includes(n)){const t=o[n].filter(t=>ao(n,e.states[t],i)).length;return t?String(t):void 0}const a=e.states[n];if(!a||"unavailable"===a.state||"unknown"===a.state)return;if("0"===a.state||"off"===a.state)return;const s=a.attributes.unit_of_measurement;return"%"===s?`${a.state}%`:"°C"===s||"°F"===s?`${a.state}°`:a.state}(o,e,t,this._config.battery_threshold??20),n=e.entity?o.states[e.entity]:void 0,a=e.name??(n?String(n.attributes.friendly_name??""):e.navigation_path??""),s=!1!==this._config.show_names&&!!a;return F`
      <button
        class=${fe({shortcut:!0,active:_o(o,e),named:s})}
        style=${xe({"--c":e.color?fo(e.color):"var(--hpc-accent)"})}
        title=${a}
        aria-label=${i?`${a} (${i})`:a}
        ${Ro({hasHold:!!e.hold_action,hasDoubleTap:!!e.double_tap_action})}
        @hpc-action=${t=>this._shortcutAction(e,t.detail.action)}
      >
        ${e.icon||!n?F`<ha-icon .icon=${e.icon??"mdi:gesture-tap-button"}></ha-icon>`:F`<ha-state-icon .hass=${o} .stateObj=${n}></ha-state-icon>`}
        ${s?F`<span class="name">${a}</span>`:B}
        ${i?F`<span
              class=${fe({badge:!0,toned:!!go(e)})}
              style=${xe(go(e)?{"--t":ti[go(e)]}:{})}
              >${i}</span
            >`:B}
      </button>
    `}_shortcutAction(e,t){this._fireAction({entity:e.entity,tap_action:uo(e,window.location.pathname),hold_action:e.hold_action,double_tap_action:e.double_tap_action},t)}_groupClick(e){const t=e.active.length?e.active:e.entities;1===t.length?this._moreInfo(t[0]):this._openPopup(e.id)}_fireAction(e,t){const o=e[`${t}_action`];o&&"none"!==o.action&&this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:e,action:t}}))}_moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_format(e){if(this.hass?.formatEntityState)return this.hass.formatEntityState(e);const t=e.attributes.unit_of_measurement,o=e.state.replace(/[_-]/g," ");return t?`${e.state} ${t}`:o.charAt(0).toUpperCase()+o.slice(1)}_groupFromIndex(e,t){return{id:e,entities:t[e]??[],active:[]}}async _openPopup(e){const t=this.hass,o=ro(t,{...this._config,pulse:[e]},this._index??no(t,this._config,this._labelFilter()))[0];if(!o)return;let i;this._popupEntities=o.active.length?[...o.active]:[...o.entities],this._popup=e,this._tiles=void 0;try{i=await(window.loadCardHelpers?.())}catch{i=void 0}if(this._popup!==e)return;if(!i)return void(this._tiles=null);const n=new Map;await Promise.all(this._popupEntities.map(async e=>{const t=await i.createCardElement(this._tileConfig(e));t.hass=this.hass,n.set(e,t)})),this._popup===e&&(this._tiles=n)}_tileConfig(e){const t=this.hass.states[e],o=e.split(".")[0],i=[];if("light"===o){(t?.attributes.supported_color_modes??[]).some(e=>"onoff"!==e)&&i.push({type:"light-brightness"})}else"cover"===o?i.push({type:"cover-open-close"}):"climate"===o?i.push({type:"target-temperature"}):"media_player"===o&&i.push({type:"media-player-playback"});return{type:"tile",entity:e,...i.length?{features:i,features_position:"light"===o||"climate"===o?"inline":"bottom"}:{}}}_closePopup(){this.renderRoot.querySelector("dialog.hpc-popup")?.close()}_onPopupClosed(){this._popup=void 0,this._tiles=void 0}_onPopupClick(e){e.target===e.currentTarget&&this._closePopup()}_onPopupMoreInfo(){this._reopen=this._popup,this._closePopup()}_bulkActions(e){if(!e.active.length)return[];const t=this._t;switch(e.id){case"lights":return[{label:t("turn_all_off"),icon:"mdi:lightbulb-group-off-outline",service:"light.turn_off"}];case"switches":return[{label:t("turn_all_off"),icon:"mdi:power-plug-off-outline",service:"switch.turn_off"}];case"fans":return[{label:t("turn_all_off"),icon:"mdi:fan-off",service:"fan.turn_off"}];case"covers":return[{label:t("close_all"),icon:"mdi:arrow-down",service:"cover.close_cover"}];case"locks":return[{label:t("lock_all"),icon:"mdi:lock",service:"lock.lock"}];case"media":return[{label:t("pause_all"),icon:"mdi:pause",service:"media_player.media_pause"}];default:return[]}}_renderPopup(e){const t=this.hass,o=ei[e.id],i=e.active.length>0,n=this._t(`g_${e.id}`),a=this._t("n_of_m_active",{n:e.active.length,m:e.entities.length}),s=this._bulkActions(e),r=function(e,t){const o=new Map;for(const i of t){const t=co(e,i);o.has(t)||o.set(t,[]),o.get(t).push(i)}return[...o.entries()].sort(([e],[t])=>void 0===e?1:void 0===t?-1:e.localeCompare(t)).map(([e,t])=>({area:e,entities:t}))}(t,this._popupEntities);return F`
      <dialog
        class="hpc-popup"
        aria-label=${n}
        style=${xe({"--c":this._groupColor(e.id)})}
        @close=${this._onPopupClosed}
        @click=${this._onPopupClick}
        @hass-more-info=${this._onPopupMoreInfo}
      >
        <div class="popup-surface">
          <header class="popup-head">
            <div class=${fe({"popup-icon":!0,active:i})}>
              <ha-icon .icon=${i?o.icon:o.iconOff}></ha-icon>
            </div>
            <div class="popup-titles">
              <div class="popup-title">${n}</div>
              <div class="popup-sub">${a}</div>
            </div>
            <button class="popup-close" aria-label=${this._t("close")} @click=${()=>this._closePopup()}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${s.length?F`<div class="popup-bulk">
                ${s.map(t=>F`<button
                    class="bulk"
                    @click=${()=>this._fireAction({tap_action:{action:"perform-action",perform_action:t.service,target:{entity_id:[...e.active]}}},"tap")}
                  >
                    <ha-icon .icon=${t.icon}></ha-icon>${t.label}
                  </button>`)}
              </div>`:B}
          <div class="popup-body">
            ${void 0===this._tiles?B:r.map(t=>F`
                    ${r.length>1||t.area?F`<div class="area-head">${t.area??this._t("no_area")}</div>`:B}
                    <div class="popup-grid">
                      ${t.entities.map(t=>this._tiles?this._tiles.get(t)??B:this._miniTile(t,e.active.includes(t),this._groupColor(e.id)))}
                    </div>
                  `)}
          </div>
        </div>
      </dialog>
    `}_miniTile(e,t,o){const i=this.hass.states[e];return i?F`
      <div
        class=${fe({"mini-tile":!0,active:t})}
        style=${xe({"--c":o})}
        role="button"
        tabindex="0"
        @click=${()=>this._moreInfo(e)}
      >
        <div class="mt-icon"><ha-state-icon .hass=${this.hass} .stateObj=${i}></ha-state-icon></div>
        <div class="mt-text">
          <div class="mt-name">${i.attributes.friendly_name??e}</div>
          <div class="mt-state">${this._format(i)} · ${Wo(this.hass,i.last_changed)}</div>
        </div>
      </div>
    `:B}}ri.styles=[Bo,Go],e([he({attribute:!1})],ri.prototype,"hass",void 0),e([he({reflect:!0})],ri.prototype,"layout",void 0),e([he({reflect:!0})],ri.prototype,"appearance",void 0),e([pe()],ri.prototype,"_config",void 0),e([pe()],ri.prototype,"_popup",void 0),e([pe()],ri.prototype,"_tiles",void 0);class ci extends ri{static getConfigElement(){return document.createElement("home-pulse-shortcuts-card-editor")}static getStubConfig(){return{shortcuts:[{name:"Lights",icon:"mdi:lightbulb-group",navigation_path:"lights",badge:"lights"},{name:"Climate",icon:"mdi:thermostat",navigation_path:"climate"},{name:"Security",icon:"mdi:shield-half-full",navigation_path:"security",badge:"locks"},{name:"Energy",icon:"mdi:lightning-bolt",navigation_path:"/energy"}]}}setConfig(e){if(!e)throw new Error("Invalid configuration");super.setConfig({...e,appearance:e.appearance??"flat",sections:["shortcuts"]})}getCardSize(){const e=this._config?.shortcuts?.length??0,t=Math.min(8,Math.max(1,Math.round(this._config?.columns??4)));return Math.max(1,2*Math.ceil(e/t))}getGridOptions(){return{columns:12,min_columns:3,rows:"auto"}}get _showGlow(){return!1}render(){return this.hass&&this._config&&!this._config.shortcuts?.length?F`<ha-card class="empty-card"
        ><div class="empty"><ha-icon icon="mdi:view-grid-outline"></ha-icon>${Fo(this.hass,"shortcuts_empty")}</div></ha-card
      >`:super.render()}}customElements.get("home-pulse-card")||(customElements.define("home-pulse-card",ri),customElements.define("home-pulse-shortcuts-card",ci),window.customCards=window.customCards||[],window.customCards.push({type:"home-pulse-card",name:"Home Pulse Card",description:"The overview for the top of your dashboard: greeting, weather, today, people, alarm, house modes and quiet home hints.",preview:!0},{type:"home-pulse-shortcuts-card",name:"Home Pulse Shortcuts",description:"Large shortcut tiles to your other views, with live badges. The companion of Home Pulse Card.",preview:!0}));const li=e=>e.split(".")[0],di=["state","last_changed"],hi=new Set(["unavailable","unknown"]),pi=new Set(["off","unavailable","unknown","closed","locked","idle","standby","not_home","docked","disarmed"]),ui=new Set(["sensor","select","input_select","input_number","input_text","number","text","weather","sun","event","date","datetime","time","button","input_button","scene","script"]),mi=e=>!e||hi.has(e.state);function _i(e){return!(!e||pi.has(e.state))&&!ui.has(li(e.entity_id))}function gi(e){const{min:t,max:o,step:i}=e.attributes;if("number"!=typeof t||"number"!=typeof o||o<=t)return;const n="number"==typeof i&&i>0?i:1,a=Math.round((o-t)/n)+1;return a<2||a>6?void 0:Array.from({length:a},(e,o)=>String(Number((t+o*n).toFixed(6))))}const fi=e=>({list:gi,current:e=>e.state,service:`${e}.set_value`,field:"value",same:(e,t)=>null!=e&&""!==e&&Number(e)===Number(t),value:e=>Number.isNaN(Number(e))?e:Number(e)}),vi={select:{list:e=>e.attributes.options,current:e=>e.state,service:"select.select_option",field:"option"},input_select:{list:e=>e.attributes.options,current:e=>e.state,service:"input_select.select_option",field:"option"},fan:{list:e=>e.attributes.preset_modes,current:e=>e.attributes.preset_mode,attribute:"preset_mode",service:"fan.set_preset_mode",field:"preset_mode"},climate:{list:e=>e.attributes.hvac_modes,current:e=>e.state,service:"climate.set_hvac_mode",field:"hvac_mode"},humidifier:{list:e=>e.attributes.available_modes,current:e=>e.attributes.mode,attribute:"mode",service:"humidifier.set_mode",field:"mode"},water_heater:{list:e=>e.attributes.operation_list,current:e=>e.state,service:"water_heater.set_operation_mode",field:"operation_mode"},media_player:{list:e=>e.attributes.source_list,current:e=>e.attributes.source,attribute:"source",service:"media_player.select_source",field:"source"},number:fi("number"),input_number:fi("input_number")},bi={list:e=>e.attributes.preset_modes,current:e=>e.attributes.preset_mode,attribute:"preset_mode",service:"climate.set_preset_mode",field:"preset_mode"};function yi(e,t){const o=vi[li(e.entity_id)];if(o)return"climate"===li(e.entity_id)&&void 0!==t&&!(o.list(e)??[]).includes(t)&&(bi.list(e)??[]).includes(t)?bi:o}function wi(e){if(!e)return[];const t=yi(e)?.list(e);return Array.isArray(t)?t.filter(e=>"string"==typeof e):[]}function xi(e){const t=e.replace(/_/g," ").trim();return t.charAt(0).toUpperCase()+t.slice(1)}function $i(e,t,o){if(t&&e){const i=yi(t,o);try{const n=i?.attribute?e.formatEntityAttributeValue?.(t,i.attribute,o):e.formatEntityState?.(t,o);if(n)return n}catch{}}return xi(o)}const ki=[[/sleep|night|ύπνο|νύχτ|βράδ/i,"mdi:power-sleep"],[/^off$|κλειστ|σβηστ/i,"mdi:power"],[/turbo|boost|max|full|ενισχ|μέγιστ/i,"mdi:rocket-launch-outline"],[/auto|smart|αυτόματ/i,"mdi:fan-auto"],[/manual|favou?rite|custom|χειροκίνητ|αγαπημ/i,"mdi:hand-back-right-outline"],[/silent|quiet|σιγ|αθόρυβ/i,"mdi:volume-off"],[/^low$|^1$|χαμηλ/i,"mdi:fan-speed-1"],[/medium|middle|^mid$|^2$|μεσαί/i,"mdi:fan-speed-2"],[/^high$|^3$|υψηλ/i,"mdi:fan-speed-3"],[/eco|leaf|οικολ/i,"mdi:leaf"],[/heat_cool|heat-cool/i,"mdi:sun-snowflake-variant"],[/heat|warm|θέρμ|ζεστ/i,"mdi:fire"],[/cool|cold|ψύξ|δροσ/i,"mdi:snowflake"],[/dry|αφύγρ|ξηρ/i,"mdi:water-percent"],[/fan|ανεμ/i,"mdi:fan"],[/away|έξω|απουσ/i,"mdi:home-export-outline"],[/home|σπίτι/i,"mdi:home-outline"],[/comfort|άνεσ/i,"mdi:sofa-outline"],[/baby|child|παιδ|μωρ/i,"mdi:baby-face-outline"],[/pet|κατοικ/i,"mdi:paw"],[/tv|τηλεόρ/i,"mdi:television"],[/music|μουσικ/i,"mdi:music"]];function Ai(e){for(const[t,o]of ki)if(t.test(e))return o;return"mdi:tune-variant"}const Si=e=>e>=2&&e<=6;function Ci(e,t){if(t.action_entity)return"none"===t.action_entity?void 0:t.action_entity;const o=e.states[t.entity];if(o&&Si(wi(o).length))return t.entity;const i=e.entities[t.entity]?.device_id;if(!i)return;const n=Object.values(e.entities).filter(o=>{if(o.device_id!==i||o.entity_id===t.entity||o.hidden||"diagnostic"===o.entity_category)return!1;const n=li(o.entity_id);return("select"===n||"input_select"===n)&&Si(wi(e.states[o.entity_id]).length)});if(1===n.length)return n[0].entity_id;const a=n.filter(e=>/mode|preset|λειτουργ/i.test(`${e.entity_id} ${e.name??""}`));return 1===a.length?a[0].entity_id:void 0}const Ei={scene:"scene.turn_on",script:"script.turn_on",button:"button.press",input_button:"input_button.press"},Mi=new Set(["light","switch","fan","input_boolean","automation","humidifier","siren","media_player","climate","remote","group"]),Oi=e=>Mi.has(li(e));function Ni(e,t,o){return zi(e,t.actions,o,o??t.entity,"")}function zi(e,t,o,i,n){if(Array.isArray(t))return t.map((t,o)=>Pi(e,t,i,`${n}${o}`));if(!o)return[];const a=wi(e.states[o]);return Si(a.length)?a.map((t,i)=>Pi(e,{option:t},o,`${n}${i}`)):[]}const Ti=(e,t=4)=>Math.min(6,Math.max(1,Math.round("number"!=typeof e||Number.isNaN(e)?t:e)));function Pi(e,t,o,i){const n=void 0!==t.option&&null!==t.option&&""!==t.option,a=n?String(t.option):void 0,s=t.entity??(n?o:void 0),r=s?e.states[s]:void 0;let c;c=t.tap_action?t.tap_action:s&&void 0!==a?function(e,t,o){const i=(t&&yi(t,o))??vi[li(e)]??vi.select;return{action:"perform-action",perform_action:i.service,target:{entity_id:e},data:{[i.field]:i.value?i.value(o):o}}}(s,r,a):s?function(e){const t=Ei[li(e)];return t?{action:"perform-action",perform_action:t,target:{entity_id:e}}:Oi(e)?{action:"toggle"}:{action:"more-info"}}(s):{action:"none"};const l=!!s&&(void 0!==a?function(e,t){if(!e||mi(e))return!1;const o=yi(e,t);return!!o&&(o.same?o.same(o.current(e),t):o.current(e)===t)}(r,a):!Ei[li(s)]&&_i(r)),d=void 0!==a?$i(e,r,a):r?String(r.attributes.friendly_name??s):"",h=void 0!==a?Ai(a):r?.attributes.icon??(s?"":"mdi:gesture-tap-button");return{key:`${i}:${s??""}:${a??""}`,name:t.name??d,icon:t.icon??h,entity:s,option:a,color:t.color,tap_action:c,hold_action:t.hold_action??(s?{action:"more-info"}:void 0),double_tap_action:t.double_tap_action,active:l,disabled:!!s&&mi(r)}}function Li(e){const t=e.state_content;return null==t?di:(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e&&""!==e)}const ji=e=>/^[a-z_]+\.[a-z0-9_]+$/.test(e);function Di(e,t){try{const o=e?.formatEntityState?.(t);if(o)return o}catch{}const o=t.attributes.unit_of_measurement;return o?`${t.state} ${o}`:xi(t.state)}function Ii(e,t){if(e<=0)return[];const o=Math.max(1,Math.floor(t)),i=Math.ceil(e/o),n=Math.floor(e/i),a=e%i;return Array.from({length:i},(e,t)=>n+(t<a?1:0))}function Hi(e){return/^(#|rgb|hsl|var\()/i.test(e)?e:"primary"===e||"accent"===e?`var(--${e}-color)`:`var(--${e}-color, ${e})`}function Ri(e,t){if(t)return Hi(t);const o=li(e.entity_id);return`var(--state-${o}-${e.state.replace(/[^a-z0-9_]/gi,"_")}-color, var(--state-${o}-active-color, var(--state-active-color, var(--tpc-active))))`}const Ui=_e(class extends ge{constructor(e){if(super(e),e.type!==me)throw new Error("actionHandler must be used on an element")}update(e,[t]){const o=e.element;return o.__tpcOptions=t??{},function(e){if(e.__tpcBound)return;let t,o;e.__tpcBound=!0;let i=!1,n=0,a=0;const s=t=>e.dispatchEvent(new CustomEvent("tpc-action",{detail:{action:t},bubbles:!1,composed:!1})),r=()=>{t&&window.clearTimeout(t),t=void 0};e.addEventListener("pointerdown",o=>{e.__tpcOptions?.disabled||0!==o.button||(i=!1,n=o.clientX,a=o.clientY,e.__tpcOptions?.hasHold&&(t=window.setTimeout(()=>{i=!0,t=void 0,navigator.vibrate&&navigator.vibrate(30),s("hold")},500)))}),e.addEventListener("pointermove",e=>{t&&(Math.abs(e.clientX-n)>10||Math.abs(e.clientY-a)>10)&&r()}),e.addEventListener("pointercancel",r),e.addEventListener("pointerleave",r),e.addEventListener("contextmenu",t=>{e.__tpcOptions?.hasHold&&t.preventDefault()}),e.addEventListener("pointerup",n=>{if(e.__tpcOptions?.disabled||0!==n.button)return;const a=!!t;r(),i?i=!1:!a&&e.__tpcOptions?.hasHold||(e.__tpcOptions?.hasDoubleTap?o?(window.clearTimeout(o),o=void 0,s("double_tap")):o=window.setTimeout(()=>{o=void 0,s("tap")},250):s("tap"))}),e.addEventListener("keydown",t=>{e.__tpcOptions?.disabled||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),s("tap"))})}(o),W}render(e){return W}}),qi={just_now:"just now",unavailable:"Unavailable",missing_entity:"Entity not found: {entity}",pick_entity:"Pick an entity in the editor",ed_entity:"Entity",ed_name:"Name",ed_icon:"Icon",ed_color:"Colour while on",ed_vertical:"Icon above the name",ed_state_content:"Line under the name",ed_info_entities:"Also show the state of",ed_content_state:"State",ed_content_last_changed:"Last changed",ed_content_last_updated:"Last updated",ed_tap_action:"Tap",ed_hold_action:"Hold",ed_double_tap_action:"Double tap",ed_icon_tap_action:"Tap on the icon",ed_section_tile:"Tile",ed_section_interactions:"Interactions",ed_section_actions:"Buttons",ed_action_entity:"Options from",ed_columns:"Buttons per row",ed_show_names:"Show names",ed_hide_actions_when_off:"Hide buttons while off",ed_option:"Option",ed_action_n:"Button {n}",ed_add_action:"Add button",ed_remove:"Remove",ed_move_up:"Up",ed_move_down:"Down",ed_auto_hint:"One button per option of {entity}. Add or customise to choose your own.",ed_auto_none:"Add buttons that set an option, run a scene or script, toggle an entity or do any action.",ed_customize:"Customise these buttons",ed_actions_hint:"A button with an option sets it on its entity (or on “Options from”). Without an option it toggles or runs its entity.",ed_section_rows:"More rows of buttons",ed_rows_hint:"Each row takes its buttons from its own entity: the mode on top, the fan level under it.",ed_row_n:"Row {n}",ed_add_row:"Add a row",ed_row_none:"Pick “Options from” for one button per option, or add buttons of your own."},Fi={en:qi,el:{just_now:"μόλις τώρα",unavailable:"Μη διαθέσιμο",missing_entity:"Δεν βρέθηκε η οντότητα: {entity}",pick_entity:"Διάλεξε οντότητα στον επεξεργαστή",ed_entity:"Οντότητα",ed_name:"Όνομα",ed_icon:"Εικονίδιο",ed_color:"Χρώμα όταν είναι αναμμένο",ed_vertical:"Εικονίδιο πάνω από το όνομα",ed_state_content:"Γραμμή κάτω από το όνομα",ed_info_entities:"Δείξε και την κατάσταση των",ed_content_state:"Κατάσταση",ed_content_last_changed:"Τελευταία αλλαγή",ed_content_last_updated:"Τελευταία ενημέρωση",ed_tap_action:"Πάτημα",ed_hold_action:"Παρατεταμένο πάτημα",ed_double_tap_action:"Διπλό πάτημα",ed_icon_tap_action:"Πάτημα στο εικονίδιο",ed_section_tile:"Πλακίδιο",ed_section_interactions:"Αλληλεπιδράσεις",ed_section_actions:"Κουμπιά",ed_action_entity:"Επιλογές από",ed_columns:"Κουμπιά ανά σειρά",ed_show_names:"Εμφάνιση ονομάτων",ed_hide_actions_when_off:"Κρύψε τα κουμπιά όταν είναι σβηστό",ed_option:"Επιλογή",ed_action_n:"Κουμπί {n}",ed_add_action:"Προσθήκη κουμπιού",ed_remove:"Αφαίρεση",ed_move_up:"Πάνω",ed_move_down:"Κάτω",ed_auto_hint:"Ένα κουμπί για κάθε επιλογή του {entity}. Πρόσθεσε ή προσάρμοσε για να διαλέξεις τα δικά σου.",ed_auto_none:"Πρόσθεσε κουμπιά που αλλάζουν μια επιλογή, τρέχουν σκηνή ή script, ανάβουν/σβήνουν μια οντότητα ή κάνουν οποιαδήποτε ενέργεια.",ed_customize:"Προσάρμοσε αυτά τα κουμπιά",ed_actions_hint:"Ένα κουμπί με επιλογή την ορίζει στην οντότητά του (ή στο «Επιλογές από»). Χωρίς επιλογή ανάβει/σβήνει ή τρέχει την οντότητά του.",ed_section_rows:"Περισσότερες σειρές κουμπιών",ed_rows_hint:"Κάθε σειρά παίρνει τα κουμπιά της από τη δική της οντότητα: η λειτουργία πάνω, η ταχύτητα ανεμιστήρα από κάτω.",ed_row_n:"Σειρά {n}",ed_add_row:"Προσθήκη σειράς",ed_row_none:"Διάλεξε «Επιλογές από» για ένα κουμπί ανά επιλογή, ή πρόσθεσε δικά σου κουμπιά."}};function Wi(e,t,o={}){const i=function(e){return(e?.locale?.language||e?.language||"en").split("-")[0]}(e);let n=Fi[i]?.[t]??qi[t]??t;for(const[e,t]of Object.entries(o))n=n.replace(`{${e}}`,String(t));return n}const Bi=s`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then a plain literal. Without the Pulse theme the card follows HA's theme. */
    --tpc-accent: var(--pulse-accent, var(--primary-color));
    --tpc-active: var(--pulse-active, var(--amber-color, #ffc107));
    --tpc-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 5%, transparent));
    --tpc-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 9%, transparent));
    --tpc-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --tpc-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --tpc-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --tpc-gap: var(--pulse-gap, 12px);
    --tpc-pad: var(--pulse-pad, 12px);
    --tpc-motion-fast: var(--pulse-motion-fast, 120ms);
    --tpc-motion-normal: var(--pulse-motion-normal, 200ms);
    --tpc-motion-slow: var(--pulse-motion-slow, 250ms);
    --tpc-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--tpc-gap) - 2px);
    padding: var(--tpc-pad);
    overflow: hidden;
  }

  button {
    font: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  /* ---- The tile ---- */
  .tile {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 6px;
    margin: -6px;
    border-radius: var(--tpc-control-radius);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    outline: none;
    transition: background-color var(--tpc-motion-normal) var(--tpc-ease);
  }
  .tile:hover {
    background: var(--tpc-neutral-bg);
  }
  .tile:focus-visible {
    box-shadow: inset 0 0 0 2px var(--tpc-accent);
  }
  .tile.vertical {
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 10px 6px 6px;
    text-align: center;
  }

  .icon {
    flex: none;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: var(--tile-icon-border-radius, 50%);
    color: var(--c);
    background: var(--tpc-neutral-bg);
    cursor: pointer;
    transition: background-color var(--tpc-motion-slow) var(--tpc-ease), color var(--tpc-motion-slow) var(--tpc-ease),
      transform var(--tpc-motion-fast) var(--tpc-ease);
    --mdc-icon-size: 22px;
  }
  .vertical .icon {
    width: 42px;
    height: 42px;
    --mdc-icon-size: 24px;
  }
  .icon:hover {
    background: var(--tpc-neutral-bg-hover);
  }
  .icon:active {
    transform: scale(0.94);
  }
  .icon:focus-visible {
    outline: 2px solid var(--tpc-accent);
    outline-offset: 2px;
  }
  /* On: the entity's colour on the icon and, softly, behind it (like the native tile). */
  .tile.on .icon {
    background: color-mix(in srgb, var(--c) 18%, transparent);
  }
  .tile.on .icon:hover {
    background: color-mix(in srgb, var(--c) 26%, transparent);
  }
  .tile.unavailable .icon {
    opacity: 0.5;
  }

  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .vertical .text {
    flex: none;
    width: 100%;
    align-items: center;
  }
  .name {
    max-width: 100%;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .secondary {
    max-width: 100%;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* ---- The buttons ---- */
  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .row {
    display: flex;
    gap: 8px;
  }
  .act {
    --c: var(--tpc-accent);
    flex: 1 1 0;
    min-width: 0;
    height: 48px;
    padding: 0 6px;
    box-sizing: border-box;
    border: none;
    border-radius: var(--tpc-control-radius);
    background: var(--tpc-neutral-bg);
    color: var(--secondary-text-color);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    /* Each button decides by its own width whether the name fits beside the icon. */
    container-type: inline-size;
    transition: background-color var(--tpc-motion-slow) var(--tpc-ease), color var(--tpc-motion-slow) var(--tpc-ease),
      transform var(--tpc-motion-fast) var(--tpc-ease);
    --mdc-icon-size: 20px;
  }
  .act.icon-only {
    height: 44px;
  }
  .act:hover:not(.disabled) {
    background: var(--tpc-neutral-bg-hover);
  }
  .act:active:not(.disabled) {
    transform: scale(0.97);
  }
  .act:focus-visible {
    outline: 2px solid var(--tpc-accent);
    outline-offset: -2px;
  }
  /* Lit (the current mode, or its entity is on): a stronger neutral fill and the text colour; the colour
     stays on the icon. Never a tinted fill, the family rule. */
  .act.active,
  .act.active:hover {
    color: var(--primary-text-color);
    background: var(--tpc-neutral-strong);
  }
  .act.active ha-icon,
  .act.active ha-state-icon {
    color: var(--c);
  }
  .act.disabled {
    opacity: 0.4;
    cursor: default;
  }
  /* A tap on its way: the icon breathes until the entity answers (at most a few seconds). */
  .act.pending ha-icon,
  .act.pending ha-state-icon {
    animation: tpc-breathe 900ms var(--tpc-ease) infinite alternate;
  }
  @keyframes tpc-breathe {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.35;
    }
  }

  .act-in {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 0;
  }
  .act-name {
    max-width: 100%;
    font-size: 11px;
    line-height: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* Wide enough: icon beside the name, like the buttons of a native tile's features. */
  @container (min-width: 96px) {
    .act-in {
      flex-direction: row;
      gap: 8px;
    }
    .act-name {
      font-size: 13px;
      line-height: 18px;
    }
  }

  .warning {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    font-size: 14px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  .warning ha-icon {
    color: var(--warning-color, #ffa600);
  }

  @media (prefers-reduced-motion: reduce) {
    .tile,
    .icon,
    .act {
      transition: none;
    }
    .act.pending ha-icon,
    .act.pending ha-state-icon {
      animation: none;
      opacity: 0.6;
    }
  }
`,Gi={vertical:!0,columns:4,show_names:!0,hide_actions_when_off:!1},Vi=["select","input_select","fan","climate","humidifier","water_heater","media_player","number","input_number"],Yi=-1,Ji=["state","last_changed","last_updated"],Xi=e=>/^[a-z_]+\.[a-z0-9_]+$/.test(e);function Ki(e){const t={};for(const[o,i]of Object.entries(e))null!=i&&""!==i&&(Array.isArray(i)&&0===i.length||(t[o]=i));return t}const Zi=(e,t)=>JSON.stringify(e)===JSON.stringify(t);class Qi extends re{constructor(){super(...arguments),this._open=new Set,this._ready=!1,this._t=(e,t)=>Wi(this.hass,e,t),this._label=e=>{const t=`ed_${e.name}`,o=this._t(t);return o===t?e.name:o}}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const e=await(window.loadCardHelpers?.()),t=await(e?.createCardElement({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch{}}().then(()=>this._ready=!0)}setConfig(e){this._config=e}_actionEntity(){if(this.hass&&this._config?.entity)return Ci(this.hass,this._config)}_mainSchema(){const e=this._t,t=this._config?.entity?this.hass?.states[this._config.entity]:void 0,o=t?Object.keys(t.attributes).filter(e=>!["friendly_name","icon","entity_picture","supported_features"].includes(e)):[],i=[...Ji.map(t=>({value:t,label:e(`ed_content_${t}`)})),...o.map(e=>({value:e,label:t&&this.hass?.formatEntityAttributeName?.(t,e)||e}))];return[{name:"entity",required:!0,selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]},{type:"expandable",name:"",title:e("ed_section_tile"),icon:"mdi:card-outline",flatten:!0,schema:[{type:"grid",name:"",schema:[{name:"vertical",selector:{boolean:{}}},{name:"color",selector:{ui_color:{}}}]},{name:"state_content",selector:{select:{multiple:!0,reorder:!0,mode:"list",options:i}}},{name:"info_entities",selector:{entity:{multiple:!0}}}]},{type:"expandable",name:"",title:e("ed_section_interactions"),icon:"mdi:gesture-tap",flatten:!0,schema:[{name:"tap_action",selector:{ui_action:{}}},{name:"icon_tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]},{type:"expandable",name:"",title:e("ed_section_actions"),icon:"mdi:gesture-tap-button",flatten:!0,schema:[{name:"action_entity",selector:{entity:{filter:Vi.map(e=>({domain:e}))}}},{type:"grid",name:"",schema:[{name:"columns",selector:{number:{min:1,max:6,mode:"slider"}}},{name:"show_names",selector:{boolean:{}}}]},{name:"hide_actions_when_off",selector:{boolean:{}}}]}]}_rowSchema(){return[{name:"action_entity",selector:{entity:{filter:Vi.map(e=>({domain:e}))}}},{name:"columns",selector:{number:{min:1,max:6,mode:"slider"}}}]}_buttonRows(){return[...this._config?.button_rows??[]]}_rowTarget(e){return(e===Yi?void 0:this._config?.button_rows?.[e]?.action_entity)||this._actionEntity()||this._config?.entity}_actionSchema(e,t){const o=e.entity??this._rowTarget(t),i=wi(o?this.hass?.states[o]:void 0).map(e=>({value:e,label:e}));return[{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{name:"entity",selector:{entity:{}}},{type:"grid",name:"",schema:[{name:"option",selector:{select:{mode:"dropdown",custom_value:!0,options:i}}},{name:"color",selector:{ui_color:{}}}]},{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}_formData(){const e=this._config,t=void 0===e.state_content?di:Li(e);return{...Gi,...e,state_content:t.filter(e=>!Xi(e)),info_entities:t.filter(Xi)}}_mainChanged(e){e.stopPropagation();const t={...e.detail.value},o=[...t.state_content??[],...t.info_entities??[]];delete t.info_entities,t.state_content=Zi(o,di)?void 0:o;for(const[e,o]of Object.entries(Gi))Zi(t[e],o)&&delete t[e];const i=Ki({...t,actions:void 0,button_rows:void 0});Array.isArray(t.state_content)&&!t.state_content.length&&(i.state_content=[]),this._config?.actions&&(i.actions=this._config.actions),this._config?.button_rows?.length&&(i.button_rows=this._config.button_rows),this._commit(i)}_autoActions(e){const t=e===Yi?this._actionEntity():this._config?.button_rows?.[e]?.action_entity;return t&&this.hass?wi(this.hass.states[t]).map(e=>({option:e,icon:Ai(e)})):[]}_rowActions(e){return e===Yi?this._config?.actions:this._config?.button_rows?.[e]?.actions}_items(e){return[...this._rowActions(e)??[]]}_setItems(e,t){if(e===Yi)return void this._commit({...this._config,actions:t});const o=this._buttonRows();o[e]={...o[e],actions:t},this._commit({...this._config,button_rows:o})}_itemChanged(e,t,o){o.stopPropagation();const i=this._items(e);i[t]=Ki({...o.detail.value}),this._setItems(e,i)}_customize(e){this._open=new Set,this._setItems(e,this._autoActions(e))}_addItem(e){const t=this._rowActions(e)?this._items(e):this._autoActions(e);t.push({}),this._open=new Set([...this._open,`${e}:${t.length-1}`]),this._setItems(e,t)}_removeItem(e,t){const o=this._items(e);o.splice(t,1),this._open=new Set([...this._open].filter(e=>e.startsWith("row:"))),this._setItems(e,o)}_moveItem(e,t,o){const i=this._items(e),n=t+o;n<0||n>=i.length||([i[t],i[n]]=[i[n],i[t]],this._open=new Set([...this._open].filter(e=>e.startsWith("row:"))),this._setItems(e,i))}_toggleOpen(e){const t=new Set(this._open);t.has(e)?t.delete(e):t.add(e),this._open=t}_addRow(){const e=this._buttonRows();e.push({}),this._open=new Set([...this._open,"row:"+(e.length-1)]),this._commit({...this._config,button_rows:e})}_removeRow(e){const t=this._buttonRows();t.splice(e,1),this._open=new Set,this._commit(Ki({...this._config,button_rows:t}))}_moveRow(e,t){const o=this._buttonRows(),i=e+t;i<0||i>=o.length||([o[e],o[i]]=[o[i],o[e]],this._open=new Set,this._commit({...this._config,button_rows:o}))}_rowChanged(e,t){t.stopPropagation();const o=this._buttonRows(),i={...t.detail.value};Zi(i.columns,this._config?.columns??4)&&delete i.columns;const n=i.action_entity!==o[e]?.action_entity?void 0:o[e]?.actions;o[e]=Ki({...i,actions:n}),this._commit({...this._config,button_rows:o})}_commit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return this.hass&&this._config&&this._ready?F`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._mainSchema()}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>
      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:gesture-tap-button"></ha-icon>${this._t("ed_section_actions")}</div>
        ${this._renderActionList(Yi)}
      </div>
      ${this._renderRows()}
    `:B}_entityName(e){return e?String(this.hass.states[e]?.attributes.friendly_name??e):""}_renderActionList(e){const t=this._rowActions(e),o=e===Yi?this._actionEntity():this._config.button_rows?.[e]?.action_entity,i=t?0:this._autoActions(e).length;return F`
      ${t?F`<p class="hint">${this._t("ed_actions_hint")}</p>`:i?F`<p class="hint">${this._t("ed_auto_hint",{entity:this._entityName(o)})}</p>
            <button class="add" @click=${()=>this._customize(e)}>
              <ha-icon icon="mdi:pencil-outline"></ha-icon>${this._t("ed_customize")}
            </button>`:F`<p class="hint">${this._t(e===Yi?"ed_auto_none":"ed_row_none")}</p>`}
      ${(t??[]).map((o,i)=>this._renderItem(o,e,i,t.length))}
      <button class="add" @click=${()=>this._addItem(e)}>
        <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_action")}
      </button>
    `}_renderRows(){const e=this._config.button_rows??[];return F`
      <div class="section">
        <div class="section-title"><ha-icon icon="mdi:table-row-plus-after"></ha-icon>${this._t("ed_section_rows")}</div>
        <p class="hint">${this._t("ed_rows_hint")}</p>
        ${e.map((t,o)=>{const i=`row:${o}`,n=this._open.has(i),a=t.action_entity?this._entityName(t.action_entity):this._t("ed_row_n",{n:o+2});return F`
            <div class="item">
              ${this._itemHead(i,n,a,void 0,o,e.length,e=>this._moveRow(o,e),()=>this._removeRow(o))}
              ${n?F`<div class="item-body rows">
                    <ha-form
                      .hass=${this.hass}
                      .data=${{columns:this._config.columns??4,...t}}
                      .schema=${this._rowSchema()}
                      .computeLabel=${this._label}
                      @value-changed=${e=>this._rowChanged(o,e)}
                    ></ha-form>
                    ${this._renderActionList(o)}
                  </div>`:B}
            </div>
          `})}
        <button class="add" @click=${this._addRow}>
          <ha-icon icon="mdi:plus"></ha-icon>${this._t("ed_add_row")}
        </button>
      </div>
    `}_itemTitle(e,t,o){if(e.name)return e.name;if(void 0!==e.option){const o=e.entity??this._rowTarget(t)??this._config.entity;return $i(this.hass,this.hass.states[o],String(e.option))}return e.entity?this._entityName(e.entity):this._t("ed_action_n",{n:o+1})}_itemHead(e,t,o,i,n,a,s,r){return F`
      <div class="item-head">
        <button class="head-main" @click=${()=>this._toggleOpen(e)} aria-expanded=${String(t)}>
          <ha-icon .icon=${t?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
          ${i?F`<ha-icon class="sc-icon" .icon=${i}></ha-icon>`:B}
          <span>${o}</span>
        </button>
        <button class="icon-btn" title=${this._t("ed_move_up")} ?disabled=${0===n} @click=${()=>s(-1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button class="icon-btn" title=${this._t("ed_move_down")} ?disabled=${n===a-1} @click=${()=>s(1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button class="icon-btn danger" title=${this._t("ed_remove")} @click=${r}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
    `}_renderItem(e,t,o,i){const n=`${t}:${o}`,a=this._open.has(n);return F`
      <div class="item">
        ${this._itemHead(n,a,this._itemTitle(e,t,o),e.icon,o,i,e=>this._moveItem(t,o,e),()=>this._removeItem(t,o))}
        ${a?F`
              <div class="item-body">
                <ha-form
                  .hass=${this.hass}
                  .data=${e}
                  .schema=${this._actionSchema(e,t)}
                  .computeLabel=${this._label}
                  @value-changed=${e=>this._itemChanged(t,o,e)}
                ></ha-form>
              </div>
            `:B}
      </div>
    `}}Qi.styles=s`
    :host { display: block; }
    .section { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-weight: 500; font-size: 15px; color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-title ha-icon { color: var(--secondary-text-color); }
    .item { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; }
    .item-head { display: flex; align-items: center; gap: 2px; padding: 4px; }
    button {
      font: inherit; color: var(--primary-text-color); background: none; border: none; cursor: pointer;
      border-radius: 8px; --mdc-icon-size: 20px;
    }
    button:hover:not([disabled]) { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    button[disabled] { opacity: 0.35; cursor: default; }
    .head-main { flex: 1; display: flex; align-items: center; gap: 6px; padding: 8px; text-align: left; min-width: 0; }
    .head-main span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sc-icon { color: var(--secondary-text-color); }
    .icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
    .icon-btn.danger ha-icon { color: var(--error-color, #db4437); }
    .item-body { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
    .item-body.rows { display: flex; flex-direction: column; gap: 8px; }
    .hint { margin: 0; font-size: 13px; color: var(--secondary-text-color); }
    .add {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px; border: 1px dashed var(--divider-color); border-radius: 12px; color: var(--primary-color);
      font-weight: 500;
    }
  `,e([he({attribute:!1})],Qi.prototype,"hass",void 0),e([pe()],Qi.prototype,"_config",void 0),e([pe()],Qi.prototype,"_open",void 0),e([pe()],Qi.prototype,"_ready",void 0),customElements.get("tile-pulse-card-editor")||customElements.define("tile-pulse-card-editor",Qi);const en=["fan","climate","humidifier","media_player","light","switch"];class tn extends re{constructor(){super(...arguments),this._deps=[],this._watched=new Set,this._pending=new Map,this._t=(e,t)=>Wi(this.hass,e,t)}static getConfigElement(){return document.createElement("tile-pulse-card-editor")}static getStubConfig(e){const t=Object.keys(e?.states??{});for(const o of en){const i=t.find(t=>t.startsWith(`${o}.`)&&!e?.entities?.[t]?.hidden);if(i)return{entity:i}}return{entity:t[0]??""}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(!e.entity||"string"!=typeof e.entity)throw new Error("`entity` is required");if(void 0!==e.actions&&!Array.isArray(e.actions))throw new Error("`actions` must be a list");for(const t of e.actions??[])if(!t||"object"!=typeof t)throw new Error("Every item in `actions` must be an object");if(void 0!==e.button_rows&&!Array.isArray(e.button_rows))throw new Error("`button_rows` must be a list");for(const t of e.button_rows??[]){if(!t||"object"!=typeof t)throw new Error("Every item in `button_rows` must be an object");if(void 0!==t.actions&&!Array.isArray(t.actions))throw new Error("`actions` in `button_rows` must be a list")}if(void 0!==e.state_content&&"string"!=typeof e.state_content&&!Array.isArray(e.state_content))throw new Error("`state_content` must be a text or a list");this._config={...e},this._deps=[],this._clearPending()}getCardSize(){const e=this._config?.actions?.length??3,t=(this._config?.button_rows??[]).reduce((e,t)=>e+Math.max(1,Math.ceil((t?.actions?.length??3)/6)),0);return 2+(e?Ii(e,Ti(this._config?.columns)).length:0)+t}getGridOptions(){return{columns:6,min_columns:3,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>{Li(this._config??{}).some(e=>e.startsWith("last"))&&this.requestUpdate()},6e4)}disconnectedCallback(){super.disconnectedCallback(),this._ticker&&window.clearInterval(this._ticker),this._clearPending()}shouldUpdate(e){if(!this._config)return!1;if(!e.has("hass")||e.size>1)return!0;const t=e.get("hass"),o=this.hass;if(!t||!o)return!0;if(t.entities!==o.entities||t.locale!==o.locale||t.language!==o.language||t.themes!==o.themes)return!0;for(const e of this._watched)if(t.states[e]!==o.states[e])return!0;return!1}willUpdate(){const e=this.hass,t=this._config;if(!e||!t)return;const o=[e.entities,t,wi(e.states[t.entity]).length];o.some((e,t)=>e!==this._deps[t])&&(this._deps=o,this._actionEntity=Ci(e,t),this._watched=function(e,t){const o=new Set;e.entity&&o.add(e.entity),t&&o.add(t);for(const t of e.actions??[])t?.entity&&o.add(t.entity);for(const t of e.button_rows??[]){t?.action_entity&&o.add(t.action_entity);for(const e of t?.actions??[])e?.entity&&o.add(e.entity)}for(const t of Li(e))ji(t)&&o.add(t);return o}(t,this._actionEntity));for(const[t,o]of this._pending)e.states[o.entity]!==o.snapshot&&(window.clearTimeout(o.timer),this._pending.delete(t))}render(){const e=this.hass,t=this._config;if(!e||!t)return B;const o=e.states[t.entity];if(!o)return F`<ha-card
        ><div class="warning"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._t("missing_entity",{entity:t.entity})}</div></ha-card
      >`;const i=!(t.hide_actions_when_off&&function(e){return!(e&&!hi.has(e.state))||!ui.has(li(e.entity_id))&&pi.has(e.state)}(o)),n=i?this._rows():[];return F`<ha-card>${this._renderTile(o)}${n.length?this._renderActions(n):B}</ha-card>`}_renderTile(e){const t=this.hass,o=this._config,i=_i(e),n=o.name??String(e.attributes.friendly_name??e.entity_id),a=function(e,t,o){if(!t)return[];if(mi(t))return[{kind:"text",value:Di(e,t)}];const i=[];for(const n of o)if("state"===n)i.push({kind:"text",value:Di(e,t)});else if("last_changed"===n||"last-changed"===n)i.push({kind:"time",value:t.last_changed});else if("last_updated"===n||"last-updated"===n)i.push({kind:"time",value:t.last_updated});else if(ji(n)){const t=e.states[n];t&&!mi(t)&&i.push({kind:"text",value:Di(e,t)})}else if(void 0!==t.attributes[n]&&null!==t.attributes[n]){const o=t.attributes[n],a=e.formatEntityAttributeValue?.(t,n,o)??String(o);i.push({kind:"text",value:a})}return i.filter(e=>""!==e.value)}(t,e,Li(o)).map(e=>"time"===e.kind?function(e,t,o=Date.now()){const i=Date.parse(t);if(Number.isNaN(i))return"";const n=Math.round((i-o)/1e3);if(Math.abs(n)<45)return Wi(e,"just_now");const a=new Intl.RelativeTimeFormat(e?.locale?.language||e?.language||"en",{numeric:"auto"}),s=[["day",86400],["hour",3600],["minute",60]];for(const[e,t]of s)if(Math.abs(n)>=t)return a.format(Math.round(n/t),e);return a.format(Math.round(n/60),"minute")}(t,e.value):e.value).filter(Boolean).join(" · "),s=!1!==o.vertical,r=o.icon_tap_action??(c=o.entity,Oi(c)?{action:"toggle"}:{action:"more-info"});var c;return F`
      <div
        class=${fe({tile:!0,vertical:s,on:i,unavailable:mi(e)})}
        style=${xe({"--c":i?Ri(e,o.color):"var(--secondary-text-color)"})}
        role="button"
        tabindex="0"
        aria-label=${a?`${n}, ${a}`:n}
        ${Ui({hasHold:!0,hasDoubleTap:!!o.double_tap_action})}
        @tpc-action=${e=>this._fire({entity:o.entity,tap_action:o.tap_action??{action:"more-info"},hold_action:o.hold_action??{action:"more-info"},double_tap_action:o.double_tap_action},e.detail.action)}
      >
        <button
          class="icon"
          aria-label=${n}
          ${Ui({})}
          @pointerdown=${on}
          @pointerup=${on}
          @keydown=${on}
          @click=${on}
          @tpc-action=${()=>this._fire({entity:o.entity,tap_action:r},"tap")}
        >
          ${o.icon?F`<ha-icon .icon=${o.icon}></ha-icon>`:F`<ha-state-icon .hass=${t} .stateObj=${e}></ha-state-icon>`}
        </button>
        <div class="text">
          <span class="name">${n}</span>
          ${a?F`<span class="secondary">${a}</span>`:B}
        </div>
      </div>
    `}_rows(){const e=new Map;for(const t of this._pending.values())void 0!==t.option&&e.set(t.entity,t.option);return function(e,t,o){const i=Ti(t.columns),n=[{actions:Ni(e,t,o),columns:i}];return(t.button_rows??[]).forEach((a,s)=>{if(!a||"object"!=typeof a)return;const r=a.action_entity||o||t.entity;n.push({actions:zi(e,a.actions,a.action_entity||void 0,r,`r${s+1}/`),columns:Ti(a.columns,i)})}),n.filter(e=>e.actions.length)}(this.hass,this._config,this._actionEntity).map(t=>{return{...t,actions:(o=t.actions,i=e,i.size?o.map(e=>e.entity&&void 0!==e.option&&i.has(e.entity)?{...e,active:i.get(e.entity)===e.option}:e):o)};var o,i})}_renderActions(e){const t=!1!==this._config.show_names;return F`
      <div class="actions">
        ${e.map(({actions:e,columns:o})=>{let i=0;return Ii(e.length,o).map(o=>{const n=e.slice(i,i+=o);return F`<div class="row">${n.map(e=>this._renderAction(e,t))}</div>`})})}
      </div>
    `}_renderAction(e,t){const o=this.hass,i=e.entity?o.states[e.entity]:void 0,n=t&&!!e.name;return F`
      <button
        class=${fe({act:!0,active:e.active,disabled:e.disabled,pending:this._pending.has(e.key),"icon-only":!n})}
        style=${xe(e.color?{"--c":Hi(e.color)}:{})}
        title=${e.name}
        aria-label=${e.name}
        aria-pressed=${e.active?"true":"false"}
        aria-disabled=${e.disabled?"true":"false"}
        ${Ui({hasHold:!!e.hold_action,hasDoubleTap:!!e.double_tap_action,disabled:e.disabled})}
        @tpc-action=${t=>this._actionTapped(e,t.detail.action)}
      >
        <span class="act-in">
          ${e.icon||!i?F`<ha-icon .icon=${e.icon||"mdi:gesture-tap-button"}></ha-icon>`:F`<ha-state-icon .hass=${o} .stateObj=${i}></ha-state-icon>`}
          ${n?F`<span class="act-name">${e.name}</span>`:B}
        </span>
      </button>
    `}_actionTapped(e,t){if(e.disabled)return;const o=this._fire({entity:e.entity,tap_action:e.tap_action,hold_action:e.hold_action,double_tap_action:e.double_tap_action},t),i="toggle"===e.tap_action.action||void 0!==e.option&&"perform-action"===e.tap_action.action;o&&"tap"===t&&e.entity&&i&&!e.active&&this._setPending(e)}_setPending(e){const t=e.entity;for(const[e,o]of this._pending)o.entity===t&&(window.clearTimeout(o.timer),this._pending.delete(e));const o=window.setTimeout(()=>{this._pending.delete(e.key),this.requestUpdate()},8e3);this._pending.set(e.key,{entity:t,option:e.option,snapshot:this.hass?.states[t],timer:o}),this.requestUpdate()}_clearPending(){for(const e of this._pending.values())window.clearTimeout(e.timer);this._pending.clear()}_fire(e,t){const o=e[`${t}_action`];return!(!o||"none"===o.action)&&(this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:e,action:t}})),!0)}}function on(e){e.stopPropagation()}tn.styles=Bi,e([he({attribute:!1})],tn.prototype,"hass",void 0),e([pe()],tn.prototype,"_config",void 0),customElements.get("tile-pulse-card")||(customElements.define("tile-pulse-card",tn),window.customCards=window.customCards||[],window.customCards.push({type:"tile-pulse-card",name:"Tile Pulse Card",description:"A tile for one entity with a row of buttons under it: its modes, a select on the same device, scenes or any action, with the current one lit.",preview:!0}));const nn="scene",an="scene_pulse_undo",sn=`${nn}.${an}`,rn=e=>void 0===e?[]:Array.isArray(e)?e:[e],cn=e=>e.startsWith(`${nn}.`),ln=e=>e.split(".")[0],dn=e=>e.startsWith(`${nn}.scene_pulse_`);function hn(e,t){const o=e.states[t];return String(e.entities[t]?.name||o?.attributes.friendly_name||t.split(".")[1]?.replace(/_/g," ")||t)}const pn=e=>(t,o)=>hn(e,t).localeCompare(hn(e,o),void 0,{sensitivity:"base",numeric:!0});const un=e=>!e||"unavailable"===e.state;function mn(e){if(e)return Number.isNaN(Date.parse(e.state))?void 0:e.state}const _n=e=>Array.isArray(e?.attributes.entity_id)?e.attributes.entity_id:[],gn={brightness:5,color_temp_kelvin:150,current_position:3,current_tilt_position:3,percentage:3,temperature:.1,target_temp_low:.1,target_temp_high:.1,volume_level:.03},fn=["preset_mode","hvac_mode","fan_mode","swing_mode","option","source"];function vn(e,t,o){if(!o||"unavailable"===o.state||"unknown"===o.state)return!1;const i=ln(e);if(void 0!==t.state&&!function(e,t,o){return t===o||"cover"===e&&("open"===t&&"opening"===o||"closed"===t&&"closing"===o)}(i,String(t.state),o.state))return!1;if("off"===t.state||"off"===o.state)return!0;for(const[e,i]of Object.entries(gn)){const n=t[e];if("number"!=typeof n)continue;if("color_temp_kelvin"===e&&void 0!==t.color_mode&&"color_temp"!==t.color_mode)continue;const a=o.attributes[e];if("number"!=typeof a||Math.abs(a-n)>i)return!1}for(const e of fn){const i=t[e];if("string"==typeof i&&o.attributes[e]!==i)return!1}return!0}function bn(e,t){const o=Object.entries(t.entities??{});return!!o.length&&o.every(([t,o])=>vn(t,o??{},e.states[t]))}const yn=new Set(["light","cover","fan","climate","media_player"]);function wn(e,t,o=15e3){const i=Date.parse(t.state);if(Number.isNaN(i))return!1;const n=_n(t);return!!n.length&&n.every(t=>{const n=e.states[t];if(!n||"unavailable"===n.state)return!1;const a=Date.parse(yn.has(ln(t))?n.last_updated:n.last_changed);return Number.isNaN(a)||a<=i+o})}const xn=e=>e.normalize("NFD").replace(/\p{M}/gu,"").toLowerCase().replace(/[\s_-]+/g,"");const $n=e=>1e3*Math.max(0,Number(e.transition??0));const kn=new Set(["light","switch","fan","cover","climate","media_player"]);function An(e,t){const o=e.entities[t];return o?.area_id??(o?.device_id?e.devices?.[o.device_id]?.area_id??void 0:void 0)}const Sn=new Set(["friendly_name","icon","entity_picture","supported_features","supported_color_modes","attribution","device_class","unit_of_measurement","restored","editable","id","min_color_temp_kelvin","max_color_temp_kelvin","min_mireds","max_mireds","effect_list","preset_modes","hvac_modes","fan_modes","swing_modes","source_list","sound_mode_list","options","min_temp","max_temp","target_temp_step"]);const Cn=_e(class extends ge{constructor(e){if(super(e),e.type!==me)throw new Error("actionHandler must be used on an element")}update(e,[t]){const o=e.element;return o.__scpOptions=t??{},function(e){if(e.__scpBound)return;let t,o;e.__scpBound=!0;let i=!1,n=0,a=0;const s=t=>e.dispatchEvent(new CustomEvent("scp-action",{detail:{action:t},bubbles:!1,composed:!1})),r=()=>{t&&window.clearTimeout(t),t=void 0};e.addEventListener("pointerdown",o=>{e.__scpOptions?.disabled||0!==o.button||(i=!1,n=o.clientX,a=o.clientY,e.__scpOptions?.hasHold&&(t=window.setTimeout(()=>{i=!0,t=void 0,navigator.vibrate&&navigator.vibrate(30),s("hold")},500)))}),e.addEventListener("pointermove",e=>{t&&(Math.abs(e.clientX-n)>10||Math.abs(e.clientY-a)>10)&&r()}),e.addEventListener("pointercancel",r),e.addEventListener("pointerleave",r),e.addEventListener("contextmenu",t=>{e.__scpOptions?.hasHold&&t.preventDefault()}),e.addEventListener("pointerup",n=>{if(e.__scpOptions?.disabled||0!==n.button)return;const a=!!t;r(),i?i=!1:!a&&e.__scpOptions?.hasHold||(e.__scpOptions?.hasDoubleTap?o?(window.clearTimeout(o),o=void 0,s("double_tap")):o=window.setTimeout(()=>{o=void 0,s("tap")},250):s("tap"))}),e.addEventListener("keydown",t=>{e.__scpOptions?.disabled||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),s("tap"))})}(o),W}render(e){return W}}),En={title:"Scenes",just_now:"just now",never_ran:"Never run",active:"Active",running:"Running…",done:"Done",unavailable:"Needs a look",for_mode:"For {mode}",more_scenes:"More scenes",other:"Other",empty:"No scenes here yet.",empty_hint:"Pick some in the card editor, or give them the card's label.",empty_new:"New scene",new_scene:"New scene",mode_chip:"House mode: {mode}",run:"Run {name}",more:"More actions for {name}",menu_run:"Run",menu_undo:"Undo last run",menu_show:"What it sets",menu_update:"Update from now",menu_update_sure:"Tap again to replace it",menu_edit:"Edit scene",menu_more_info:"More info",back:"Back",targets_unknown:"Targets are visible to admins for scenes made in the UI.",matches_now:"Already like this",confirm_run:"Run {name}?",ran:"{name} is on",undo:"Undo",undo_chip:"Undo {name}: put back how it was before",undone:"Put back as it was",updated:"{name} now holds how things are",error:"Couldn't do that: {error}",ed_title:"Title",ed_label:"Show scenes with these labels",ed_entities:"Show these scenes first",ed_exclude:"Never show",ed_group_by:"Group by",ed_group_none:"Nothing",ed_group_area:"Area",ed_group_label:"Label",ed_confirm:"Ask before running",ed_transition:"Fade lights in over (seconds)",ed_mode_entity:"House mode selector",ed_undo:"Offer Undo after a run",ed_hint:"The scenes you pick come first, then every scene with one of the labels. With neither, the card shows all your scenes.",ed_mode_hint:"Scenes with a label named like the current house mode (for example “Night”) are shown first.",ed_section_more:"More"},Mn={en:En,el:{title:"Σκηνές",just_now:"μόλις τώρα",never_ran:"Δεν έχει τρέξει",active:"Ενεργή",running:"Εκτελείται…",done:"Έγινε",unavailable:"Θέλει έλεγχο",for_mode:"Για {mode}",more_scenes:"Άλλες σκηνές",other:"Άλλες",empty:"Δεν υπάρχουν ακόμη σκηνές εδώ.",empty_hint:"Διάλεξε κάποιες στον επεξεργαστή της κάρτας ή δώσ' τους την ετικέτα της κάρτας.",empty_new:"Νέα σκηνή",new_scene:"Νέα σκηνή",mode_chip:"Λειτουργία σπιτιού: {mode}",run:"Εκτέλεση: {name}",more:"Περισσότερες ενέργειες για {name}",menu_run:"Εκτέλεση",menu_undo:"Αναίρεση τελευταίας εκτέλεσης",menu_show:"Τι ρυθμίζει",menu_update:"Ενημέρωση από τώρα",menu_update_sure:"Πάτα ξανά για αντικατάσταση",menu_edit:"Επεξεργασία σκηνής",menu_more_info:"Πληροφορίες",back:"Πίσω",targets_unknown:"Οι τιμές φαίνονται στους διαχειριστές για σκηνές που φτιάχτηκαν από το UI.",matches_now:"Ήδη έτσι",confirm_run:"Εκτέλεση της σκηνής «{name}»;",ran:"Ενεργή: {name}",undo:"Αναίρεση",undo_chip:"Αναίρεση {name}: επαναφορά όπως ήταν πριν",undone:"Επανήλθαν όπως ήταν",updated:"Η σκηνή «{name}» κράτησε ό,τι ισχύει τώρα",error:"Δεν έγινε: {error}",ed_title:"Τίτλος",ed_label:"Δείξε σκηνές με αυτές τις ετικέτες",ed_entities:"Δείξε πρώτα αυτές τις σκηνές",ed_exclude:"Να μην εμφανίζονται ποτέ",ed_group_by:"Ομαδοποίηση κατά",ed_group_none:"Καμία",ed_group_area:"Χώρο",ed_group_label:"Ετικέτα",ed_confirm:"Ερώτηση πριν την εκτέλεση",ed_transition:"Σταδιακό άναμμα φώτων (δευτερόλεπτα)",ed_mode_entity:"Επιλογέας λειτουργίας σπιτιού",ed_undo:"Πρόταση αναίρεσης μετά την εκτέλεση",ed_hint:"Πρώτα εμφανίζονται οι σκηνές που διαλέγεις, μετά όσες έχουν μία από τις ετικέτες. Χωρίς κανένα από τα δύο, η κάρτα δείχνει όλες τις σκηνές σου.",ed_mode_hint:"Οι σκηνές με ετικέτα που λέγεται όπως η τρέχουσα λειτουργία του σπιτιού (π.χ. «Νύχτα») εμφανίζονται πρώτες.",ed_section_more:"Περισσότερα"}};function On(e,t,o={}){const i=function(e){return(e?.locale?.language||e?.language||"en").split("-")[0]}(e),n=Mn[i]??En,a=1===o.n&&(n[`${t}_one`]??En[`${t}_one`])?`${t}_one`:t;let s=n[a]??En[a]??t;for(const[e,t]of Object.entries(o))s=s.replace(`{${e}}`,String(t));return s}function Nn(e,t,o,i){!function(e,t,o){e.dispatchEvent(new CustomEvent(t,{detail:o,bubbles:!0,composed:!0}))}(e,"hass-notification",{message:t,...o?{action:o}:{},...i?{duration:i}:{}})}function zn(e){return String(e&&"object"==typeof e&&"message"in e?e.message:e)}const Tn=s`
  :host {
    /* Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then a plain literal. Without the Pulse theme the card follows HA's theme. */
    --scp-accent: var(--pulse-accent, var(--primary-color));
    --scp-on-accent: var(--pulse-on-accent, var(--text-primary-color, #fff));
    --scp-ok: var(--pulse-ok, var(--green-color, #4caf50));
    --scp-warn: var(--pulse-warn, var(--orange-color, #ff9800));
    --scp-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --scp-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    --scp-neutral-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --scp-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --scp-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --scp-chip-height: var(--pulse-chip-height, 30px);
    --scp-row-height: var(--pulse-row-height, 56px);
    --scp-gap: var(--pulse-gap, 12px);
    --scp-pad: var(--pulse-pad, 12px);
    --scp-motion-fast: var(--pulse-motion-fast, 120ms);
    --scp-motion-normal: var(--pulse-motion-normal, 200ms);
    --scp-motion-slow: var(--pulse-motion-slow, 250ms);
    --scp-ease: var(--pulse-ease, ease);
    /* Fills inside the menu: a share of the text colour, because the menu sits on HA's dialog surface,
       where a frosted-white fill (Pulse Glass light) would vanish. */
    --scp-menu-fill: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    --scp-menu-fill-hover: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
    display: block;
    height: 100%;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: calc(var(--scp-gap) - 4px);
    padding: var(--scp-pad);
    overflow: hidden;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--scp-accent);
    outline-offset: 2px;
  }

  /* ---- Header: title, the house mode, "new scene" ---- */
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--scp-chip-height);
    padding: 0 2px;
  }
  .title {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chips {
    display: flex;
    gap: 6px;
    flex: none;
    margin-inline-start: auto;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--scp-chip-height);
    padding: 0 12px 0 10px;
    border-radius: calc(var(--scp-chip-height) / 2);
    background: var(--scp-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color var(--scp-motion-normal) var(--scp-ease), color var(--scp-motion-normal) var(--scp-ease),
      transform var(--scp-motion-fast) var(--scp-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover {
    background: var(--scp-neutral-bg-hover);
    color: var(--primary-text-color);
  }
  .chip:active {
    transform: scale(0.96);
  }
  .chip.icon-only {
    width: var(--scp-chip-height);
    padding: 0;
    justify-content: center;
  }
  /* A 44px touch target around the 30px chip, without making it look bigger. */
  .chip {
    position: relative;
  }
  .chip::after {
    content: "";
    position: absolute;
    inset: -7px -2px;
  }

  /* ---- Sections ---- */
  .section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 6px 4px 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 14px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* ---- Rows ---- */
  .row {
    --c: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: var(--scp-row-height);
    border-radius: var(--scp-control-radius);
    transition: background-color var(--scp-motion-normal) var(--scp-ease);
  }
  .row:hover {
    background: var(--scp-neutral-bg);
  }
  .main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    padding: 0 4px 0 8px;
    border-radius: var(--scp-control-radius);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    outline: none;
  }
  .main:focus-visible {
    box-shadow: inset 0 0 0 2px var(--scp-accent);
  }
  .disc {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--scp-neutral-bg);
    color: var(--c);
    transition: color var(--scp-motion-slow) var(--scp-ease), background-color var(--scp-motion-slow) var(--scp-ease);
    --mdc-icon-size: 20px;
  }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    letter-spacing: 0.1px;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Colour by status: only the icon, and the word "Active". */
  .row.active {
    --c: var(--scp-accent);
  }
  .row.active .disc {
    background: color-mix(in srgb, var(--scp-accent) 16%, transparent);
  }
  .row.active .secondary {
    color: var(--scp-accent);
  }
  .row.unavailable {
    --c: var(--scp-warn);
  }
  .row.unavailable .secondary {
    color: var(--scp-warn);
  }
  /* Running: the icon breathes until Home Assistant answers (meaningful motion only). */
  .row.running .disc ha-icon {
    animation: scp-breathe 700ms var(--scp-ease) infinite alternate;
  }
  .row.done {
    --c: var(--scp-ok);
  }
  @keyframes scp-breathe {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.35;
    }
  }

  /* ---- Run and ⋯ buttons ---- */
  .run,
  .more {
    flex: none;
    width: 40px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--scp-control-radius);
    color: var(--secondary-text-color);
    transition: background-color var(--scp-motion-normal) var(--scp-ease), color var(--scp-motion-normal) var(--scp-ease),
      transform var(--scp-motion-fast) var(--scp-ease);
    --mdc-icon-size: 20px;
  }
  .run:hover,
  .more:hover,
  .more[aria-expanded="true"] {
    background: var(--scp-neutral-bg-hover);
    color: var(--primary-text-color);
  }
  .run:active {
    transform: scale(0.92);
  }
  .run[disabled] {
    cursor: default;
    opacity: 0.4;
  }

  /* ---- Menu (a popover in the top layer, so no card can clip it) ---- */
  .menu {
    position: fixed;
    inset: auto;
    margin: 0;
    box-sizing: border-box;
    min-width: 230px;
    max-width: min(320px, calc(100vw - 16px));
    max-height: min(480px, calc(100vh - 16px));
    overflow-y: auto;
    padding: 6px;
    border: 1px solid var(--divider-color);
    border-radius: var(--scp-control-radius);
    /* HA's own surface for things that float (dialogs): frosted in Pulse Glass, solid elsewhere. */
    background: var(--ha-dialog-surface-background, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
    -webkit-backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
  }
  .menu:not(:popover-open):not(.open) {
    display: none;
  }
  .menu-head {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    --mdc-icon-size: 16px;
  }
  .menu-head button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px 4px 2px;
    margin: -4px 0;
    border-radius: 8px;
  }
  .menu-head button:hover {
    background: var(--scp-menu-fill);
  }
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: calc(var(--scp-control-radius) - 4px);
    font-size: 14px;
    text-align: start;
    transition: background-color var(--scp-motion-fast) var(--scp-ease), color var(--scp-motion-fast) var(--scp-ease);
    --mdc-icon-size: 20px;
  }
  .item ha-icon {
    color: var(--secondary-text-color);
  }
  .item:hover,
  .item:focus-visible {
    outline: none;
    background: var(--scp-menu-fill);
  }
  .item.sure,
  .item.sure:hover {
    background: var(--scp-accent);
    color: var(--scp-on-accent);
  }
  .item.sure ha-icon {
    color: inherit;
  }
  .sep {
    height: 1px;
    margin: 4px 6px;
    background: var(--divider-color);
  }

  /* "What it sets": one quiet line per entity. */
  .targets {
    display: flex;
    flex-direction: column;
    padding: 0 4px 4px;
  }
  .target {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 36px;
    padding: 0 6px;
    font-size: 13px;
    --mdc-icon-size: 18px;
  }
  .target ha-icon {
    color: var(--secondary-text-color);
    flex: none;
  }
  .target .t-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .target .t-state {
    flex: none;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .target.matches .t-state {
    color: var(--scp-accent);
  }
  .note {
    padding: 6px 10px 8px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }

  /* ---- Empty ---- */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px 8px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    --mdc-icon-size: 28px;
  }
  .empty > ha-icon {
    opacity: 0.6;
    margin-bottom: 4px;
  }
  .empty .hint {
    font-size: 12px;
    opacity: 0.85;
  }
  .empty .chip {
    margin-top: 8px;
  }

  @media (prefers-reduced-motion: reduce) {
    .row,
    .disc,
    .chip,
    .run,
    .more,
    .item {
      transition: none;
    }
    .row.running .disc ha-icon {
      animation: none;
      opacity: 0.6;
    }
  }
`,Pn={entity:{multiple:!0,filter:[{domain:"scene"}]}};function Ln(e){const t={};for(const[o,i]of Object.entries(e))null!=i&&""!==i&&(Array.isArray(i)&&!i.length||"group_by"===o&&"none"===i||"undo"===o&&!0===i||"transition"===o&&0===i||(t[o]=i));return t}class jn extends re{constructor(){super(...arguments),this._ready=!1,this._t=e=>On(this.hass,e),this._label=e=>{const t=`ed_${e.name}`,o=this._t(t);return o===t?e.name:o},this._helper=e=>"mode_entity"===e.name?this._t("ed_mode_hint"):void 0}connectedCallback(){super.connectedCallback(),async function(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const e=await(window.loadCardHelpers?.()),t=await(e?.createCardElement({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch{}}().then(()=>this._ready=!0)}setConfig(e){this._config=e}_schema(){const e=this._t;return[{name:"title",selector:{text:{}}},{name:"label",selector:{label:{multiple:!0}}},{name:"entities",selector:Pn},{type:"expandable",name:"",title:e("ed_section_more"),icon:"mdi:tune-variant",flatten:!0,schema:[{name:"group_by",selector:{select:{mode:"dropdown",options:["none","area","label"].map(t=>({value:t,label:e(`ed_group_${t}`)}))}}},{name:"mode_entity",selector:{entity:{filter:[{domain:"input_select"},{domain:"select"}]}}},{name:"transition",selector:{number:{min:0,max:300,step:.5,mode:"box",unit_of_measurement:"s"}}},{name:"undo",selector:{boolean:{}}},{name:"confirm",selector:Pn},{name:"exclude",selector:Pn}]}]}_changed(e){e.stopPropagation();const t={...e.detail.value},o=rn(t.label);t.label=1===o.length?o[0]:o,"none"!==this._config.mode_entity||t.mode_entity||(t.mode_entity="none");const i={...Ln(t),type:this._config.type};this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){if(!this.hass||!this._config)return B;if(!this._ready)return B;const e="none"===this._config.mode_entity?void 0:this._config.mode_entity,t={group_by:"none",undo:!0,...this._config,mode_entity:e,label:rn(this._config.label)};return F`
      <p class="hint">${this._t("ed_hint")}</p>
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._schema()}
        .computeLabel=${this._label}
        .computeHelper=${this._helper}
        @value-changed=${this._changed}
      ></ha-form>
    `}}jn.styles=s`
    :host {
      display: block;
    }
    .hint {
      margin: 0 0 12px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
  `,e([he({attribute:!1})],jn.prototype,"hass",void 0),e([pe()],jn.prototype,"_config",void 0),e([pe()],jn.prototype,"_ready",void 0);const Dn={light:"mdi:lightbulb-outline",switch:"mdi:toggle-switch-outline",cover:"mdi:blinds",climate:"mdi:thermostat",fan:"mdi:fan",media_player:"mdi:speaker",input_boolean:"mdi:toggle-switch-outline",input_select:"mdi:format-list-bulleted",select:"mdi:format-list-bulleted",number:"mdi:ray-vertex",input_number:"mdi:ray-vertex",lock:"mdi:lock-outline",vacuum:"mdi:robot-vacuum",humidifier:"mdi:air-humidifier"};class In extends re{constructor(){super(...arguments),this._configs=new Map,this._labelNames={},this._menuView="main",this._sure=!1,this._ids=[],this._deps=[],this._watched=new Set,this._running=new Map,this._done=new Map,this._awaiting=new Map,this._undoChip=!1,this._configKeys=new Map,this._labelsLoaded=!1,this._t=(e,t)=>On(this.hass,e,t),this._menuToggled=e=>{"closed"===e.newState&&(this._menu=void 0,this._sure=!1)}}static getConfigElement(){return document.createElement("scene-pulse-card-editor")}static getStubConfig(e){const t=function(e,t=4){if(!e)return[];const o=e=>Date.parse(e.state)||0;return Object.values(e.states).filter(t=>cn(t.entity_id)&&!dn(t.entity_id)&&!e.entities?.[t.entity_id]?.hidden).sort((e,t)=>o(t)-o(e)).slice(0,t).map(e=>e.entity_id)}(e);return t.length?{entities:t}:{}}setConfig(e){if(!e)throw new Error("Invalid configuration");for(const t of["entities","exclude","confirm"]){const o=e[t];if(void 0!==o&&(!Array.isArray(o)||o.some(e=>"string"!=typeof e)))throw new Error(`\`${t}\` must be a list of scene entity ids`)}if(void 0!==e.label&&rn(e.label).some(e=>"string"!=typeof e))throw new Error("`label` must be a label id or a list of them");if(void 0!==e.group_by&&!["none","area","label"].includes(e.group_by))throw new Error("`group_by` must be none, area or label");if(void 0!==e.transition&&("number"!=typeof e.transition||e.transition<0||e.transition>300))throw new Error("`transition` must be a number of seconds between 0 and 300");if(void 0!==e.mode_entity&&"string"!=typeof e.mode_entity)throw new Error("`mode_entity` must be an input_select or select entity id, or none");if(void 0!==e.undo&&"boolean"!=typeof e.undo)throw new Error("`undo` must be true or false");this._config={...e},this._deps=[]}getCardSize(){return 1+Math.max(1,this._ids.length)}getGridOptions(){return{columns:6,min_columns:4,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._ticker=window.setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._undoTimer),this._undoChip=!1,this._ticker&&window.clearInterval(this._ticker);for(const e of this._running.values())window.clearTimeout(e.timer);for(const e of this._done.values())window.clearTimeout(e);for(const e of this._awaiting.values())window.clearTimeout(e.timer);this._running.clear(),this._done.clear(),this._awaiting.clear()}shouldUpdate(e){if(!this._config)return!1;if(!e.has("hass")||e.size>1)return!0;const t=e.get("hass"),o=this.hass;if(!t||!o)return!0;if(t.entities!==o.entities||t.areas!==o.areas||t.language!==o.language||t.locale!==o.locale)return!0;if(t.states[sn]!==o.states[sn])return!0;for(const e of this._watched)if(t.states[e]!==o.states[e])return!0;return!1}willUpdate(){const e=this.hass,t=this._config;if(!e||!t)return;const o=[e.entities,t];o.some((e,t)=>e!==this._deps[t])&&(this._deps=o,this._ids=function(e,t){const o=new Set(t.exclude??[]),i=e=>cn(e)&&!o.has(e)&&!dn(e),n=(t.entities??[]).filter(i),a=rn(t.label),s=new Set(n),r=Object.keys(e.states).filter(e=>i(e)&&!s.has(e));let c;return c=a.length?r.filter(t=>(e.entities[t]?.labels??[]).some(e=>a.includes(e))):n.length?[]:r.filter(t=>!e.entities[t]?.hidden),[...new Set([...n,...c.sort(pn(e))])]}(e,t),this._modeEntity=function(e,t){if("none"!==t.mode_entity)return t.mode_entity?t.mode_entity:Object.keys(e.states).find(t=>("input_select"===ln(t)||"select"===ln(t))&&/(^|\.|_)(house|home)_mode$/.test(t)&&!e.entities?.[t]?.hidden)}(e,t)),this._watched=function(e,t,o,i){const n=new Set(t);for(const i of t){const t=e.states[i];for(const e of _n(t))n.add(e);const a=t?.attributes.id?o.get(String(t.attributes.id)):void 0;for(const e of Object.keys(a?.entities??{}))n.add(e)}return i&&n.add(i),n}(e,this._ids,this._configs,this._modeEntity);for(const[t,o]of this._running)e.states[t]?.state!==o.before&&(window.clearTimeout(o.timer),this._running.delete(t),this._markDone(t));for(const[t,o]of this._awaiting)e.states[t]?.state!==o.before&&(window.clearTimeout(o.timer),this._awaiting.delete(t),this._markDone(t),o.undo&&this._offerUndo(t),this._ranToast(t,o.undo))}updated(){this.hass&&this._config&&(this._loadConfigs(),this._loadLabels())}get _admin(){return!0===this.hass?.user?.is_admin}get _undoOn(){return!1!==this._config?.undo}_loadConfigs(){if(this._admin&&this.hass.callApi)for(const e of this._ids){const t=this.hass.states[e],o=t?.attributes.id?String(t.attributes.id):void 0;if(!o)continue;const i=t.last_updated;this._configKeys.get(o)!==i&&(this._configKeys.set(o,i),this.hass.callApi("GET",`config/scene/config/${encodeURIComponent(o)}`).then(e=>{e&&"object"==typeof e.entities&&(this._configs=new Map(this._configs).set(o,e))}).catch(()=>{}))}}async _loadLabels(){if(!this._labelsLoaded&&(this._modeEntity||"label"===this._config.group_by)){this._labelsLoaded=!0;try{const e=await this.hass.callWS({type:"config/label_registry/list"});this._labelNames=Object.fromEntries(e.map(e=>[e.label_id,e.name]))}catch{}}}_modeLabels(e){return function(e,t){const o=new Set;if(!e)return o;const i=xn(e);if(!i)return o;for(const[e,n]of Object.entries(t))xn(n)===i&&o.add(e);return o.add(i),o}(e,this._labelNames)}render(){const e=this.hass,t=this._config;if(!e||!t)return B;const o=function(e,t){const o=t?e.states[t]:void 0;if(o&&"unavailable"!==o.state&&"unknown"!==o.state)return o.state}(e,this._modeEntity),i=this._modeLabels(o),n=function(e,t,o,i){const n=new Set(t.confirm??[]),a=new Set([...i.modeLabels].map(xn)),s=o.map(t=>{const o=e.states[t],s=o?.attributes.id?String(o.attributes.id):void 0,r=e.entities[t]?.labels??[];return{entity_id:t,name:hn(e,t),status:un(o)?"unavailable":"idle",last:mn(o),id:s,members:_n(o),confirm:n.has(t),forMode:r.some(e=>i.modeLabels.has(e)||a.has(xn(e)))}}),r=s.filter(e=>e.last&&"unavailable"!==e.status).sort((e,t)=>Date.parse(t.last)-Date.parse(e.last))[0];for(const o of s){if("unavailable"===o.status)continue;const n=o.id?i.configs.get(o.id):void 0;n?bn(e,n)&&(o.status="active",o.activeBy="targets"):o===r&&wn(e,e.states[o.entity_id],15e3+$n(t))&&(o.status="active",o.activeBy="untouched")}return s}(e,t,this._ids,{configs:this._configs,modeLabels:i}),a=function(e,t,o,i,n,a=new Set){const s=n.modeTitle?o.filter(e=>e.forMode):[],r=s.length?o.filter(e=>!e.forMode):o,c=s.length?[{key:"__mode",title:n.modeTitle,rows:s}]:[];if(!r.length)return c.length?c:[{key:"",title:"",rows:o}];let l;if("none"===i)l=[{key:"",title:"",rows:r}];else{const o=new Set([...rn(t.label),...a]),s=t=>{const a=e.entities[t.entity_id];if("area"===i){const t=a?.area_id;return t?{key:t,title:e.areas?.[t]?.name??t}:void 0}const s=n.labelNames??{};return(a?.labels??[]).filter(e=>!o.has(e)).map(e=>({key:e,title:s[e]??e})).sort((e,t)=>e.title.localeCompare(t.title))[0]},c=new Map,d={key:"__other",title:n.other,rows:[]};for(const e of r){const t=s(e);t?(c.has(t.key)||c.set(t.key,{key:t.key,title:t.title,rows:[]}),c.get(t.key).rows.push(e)):d.rows.push(e)}l=[...c.values()].sort((e,t)=>e.title.localeCompare(t.title,void 0,{numeric:!0})),d.rows.length&&l.push(d),1===l.length&&(l=[{key:"",title:"",rows:l[0].rows}])}return c.length&&1===l.length&&!l[0].title&&(l[0]={...l[0],key:"__rest",title:n.rest}),[...c,...l]}(e,t,n,t.group_by??"none",{labelNames:this._labelNames,other:this._t("other"),rest:this._t("more_scenes"),modeTitle:o?this._t("for_mode",{mode:this._modeName(o)}):void 0},i);return F`<ha-card>
      ${this._renderHeader(o)}
      ${n.length?a.map(e=>this._renderGroup(e)):F`<div class="empty">
            <ha-icon icon="mdi:palette-outline"></ha-icon>
            <span>${this._t("empty")}</span>
            <span class="hint">${this._t("empty_hint")}</span>
            ${this._admin?F`<button class="chip" @click=${()=>this._navigate("/config/scene/edit/new")}>
                  <ha-icon icon="mdi:plus"></ha-icon>${this._t("empty_new")}
                </button>`:B}
          </div>`}
      ${this._renderMenu(n)}
    </ha-card>`}_modeName(e){const t=this.hass.states[this._modeEntity];return t&&this.hass.formatEntityState?this.hass.formatEntityState(t,e):e}_renderHeader(e){const t=this._config.title??this._t("title"),o=!!t&&this._admin&&this._ids.length>0,i=this._undoChip&&this._undoOn&&!!this._undoFor&&!!this.hass.states[sn];if(!(t||e||o||i))return B;const n=e?this._modeName(e):"",a=i?this._t("undo_chip",{name:hn(this.hass,this._undoFor)}):"";return F`<div class="header">
      ${t?F`<span class="title">${t}</span>`:B}
      <div class="chips">
        ${i?F`<button class="chip" title=${a} aria-label=${a} @click=${()=>this._undo()}>
              <ha-icon icon="mdi:undo-variant"></ha-icon>${this._t("undo")}
            </button>`:B}
        ${e?F`<button class="chip" title=${this._t("mode_chip",{mode:n})} aria-label=${this._t("mode_chip",{mode:n})}
              @click=${()=>this._fire(this._modeEntity,{action:"more-info"})}>
              <ha-icon icon="mdi:home-switch-outline"></ha-icon>${n}
            </button>`:B}
        ${o?F`<button class="chip icon-only" title=${this._t("new_scene")} aria-label=${this._t("new_scene")}
              @click=${()=>this._navigate("/config/scene/edit/new")}>
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>`:B}
      </div>
    </div>`}_renderGroup(e){return F`${e.title?F`<div class="section-title">
            ${"__mode"===e.key?F`<ha-icon icon="mdi:home-switch-outline"></ha-icon>`:B}${e.title}
          </div>`:B}
      <div class="list">${e.rows.map(e=>this._renderRow(e))}</div>`}_phase(e){return this._running.has(e.entity_id)?"running":this._done.has(e.entity_id)?"done":void 0}_icon(e){const t=this.hass.states[e.entity_id]?.attributes.icon;return"done"===this._phase(e)?"mdi:check":"unavailable"===e.status?"mdi:alert-outline":t?String(t):"active"===e.status?"mdi:palette":"mdi:palette-outline"}_secondary(e){const t=this._phase(e);return"running"===t?this._t("running"):"done"===t?this._t("done"):"unavailable"===e.status?this._t("unavailable"):"active"===e.status?this._t("active"):e.last?function(e,t,o=Date.now()){const i=Date.parse(t);if(Number.isNaN(i))return"";const n=Math.round((i-o)/1e3);if(Math.abs(n)<45)return On(e,"just_now");const a=new Intl.RelativeTimeFormat((e=>e?.locale?.language||e?.language||"en")(e),{numeric:"auto"}),s=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60]];for(const[e,t]of s)if(Math.abs(n)>=t)return a.format(Math.round(n/t),e);return a.format(Math.round(n/60),"minute")}(this.hass,e.last):this._t("never_ran")}_renderRow(e){const t=this._secondary(e),o=this._phase(e),i="unavailable"===e.status;return F`<div class=${fe({row:!0,[e.status]:!0,[o??"rest"]:!0})} data-eid=${e.entity_id}>
      <div
        class="main"
        role="button"
        tabindex="0"
        aria-label=${`${this._t("run",{name:e.name})}, ${t}`}
        ${Cn({hasHold:!0})}
        @scp-action=${t=>"hold"===t.detail.action?this._openMenu(e.entity_id):i?this._moreInfo(e.entity_id):this._run(e)}
      >
        <div class="disc"><ha-icon .icon=${this._icon(e)}></ha-icon></div>
        <div class="text">
          <span class="name">${e.name}</span>
          <span class="secondary">${t}</span>
        </div>
      </div>
      <button class="run" aria-label=${this._t("run",{name:e.name})} ?disabled=${i} @click=${()=>this._run(e)}>
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
      <button
        class="more"
        aria-label=${this._t("more",{name:e.name})}
        aria-haspopup="menu"
        aria-expanded=${this._menu===e.entity_id?"true":"false"}
        @click=${()=>this._openMenu(e.entity_id)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    </div>`}_renderMenu(e){const t=this._menu?e.find(e=>e.entity_id===this._menu):void 0;return F`<div class="menu" popover="auto" role="menu" @toggle=${this._menuToggled}>
      ${t?"show"===this._menuView?this._renderTargets(t):this._renderMenuMain(t):B}
    </div>`}_renderMenuMain(e){const t=e.id?this._configs.get(e.id):void 0,o=function(e,t){const o=[];return"unavailable"!==e.status&&o.push("run"),t.canUndo&&o.push("undo"),(e.members.length||t.hasConfig)&&o.push("show"),t.admin&&e.id&&t.hasConfig&&o.push("update"),t.admin&&e.id&&o.push("edit"),o.push("more_info"),o}(e,{admin:this._admin,canUndo:this._undoOn&&this._undoFor===e.entity_id&&!!this.hass.states[sn],hasConfig:!!t}),i=e=>o.includes(e),n=(t,o,i=this._t(`menu_${t}`),n="")=>F`<button class="item ${n}" role="menuitem" @click=${()=>this._menuAction(e,t)}>
        <ha-icon .icon=${o}></ha-icon><span>${i}</span>
      </button>`;return F`<div class="menu-head">${e.name}</div>
      ${i("run")?n("run","mdi:play"):B}
      ${i("undo")?n("undo","mdi:undo-variant"):B}
      ${i("show")?n("show","mdi:format-list-checks"):B}
      ${i("update")||i("edit")?F`<div class="sep"></div>`:B}
      ${i("update")?this._sure?n("update","mdi:camera-retake-outline",this._t("menu_update_sure"),"sure"):n("update","mdi:camera-retake-outline"):B}
      ${i("edit")?n("edit","mdi:pencil-outline"):B}
      ${i("more_info")?n("more_info","mdi:information-outline"):B}`}_renderTargets(e){const t=this.hass,o=e.id?this._configs.get(e.id):void 0,i=function(e,t,o){return(o?Object.keys(o.entities??{}):t).map(t=>{const i=o?.entities?.[t];if(!i)return{entity_id:t};const n=ln(t);let a;return"off"!==i.state&&("light"===n&&"number"==typeof i.brightness?a=`${Math.round(i.brightness/255*100)}%`:"cover"===n&&"number"==typeof i.current_position?a=`${i.current_position}%`:"fan"===n&&"number"==typeof i.percentage?a=`${i.percentage}%`:"climate"===n&&"number"==typeof i.temperature?a=`${i.temperature}°`:"media_player"===n&&"number"==typeof i.volume_level&&(a=`${Math.round(100*i.volume_level)}%`)),{entity_id:t,state:void 0===i.state?void 0:String(i.state),extra:a,matches:vn(t,i,e.states[t])}})}(t,e.members,o);return F`<div class="menu-head">
        <button @click=${e=>this._back(e)} aria-label=${this._t("back")}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>${e.name}
        </button>
      </div>
      <div class="targets">
        ${i.map(e=>{const o=t.states[e.entity_id],i=o?.attributes.icon??Dn[e.entity_id.split(".")[0]]??"mdi:circle-small",n=[void 0!==e.state?o&&t.formatEntityState?t.formatEntityState(o,e.state):e.state:"",e.extra].filter(Boolean).join(" · ");return F`<div class=${fe({target:!0,matches:!!e.matches})} title=${e.matches?this._t("matches_now"):""}>
            <ha-icon .icon=${i}></ha-icon>
            <span class="t-name">${hn(t,e.entity_id)}</span>
            ${n?F`<span class="t-state">${n}</span>`:B}
          </div>`})}
      </div>
      ${o?B:F`<div class="note">${this._t("targets_unknown")}</div>`}`}async _back(e){e.stopPropagation(),this._menuView="main",await this.updateComplete,this._placeMenu()}async _openMenu(e){if(this._menu===e)return void this._closeMenu();this._menu=e,this._menuView="main",this._sure=!1,await this.updateComplete;const t=this.renderRoot.querySelector(".menu");if(t){try{t.matches(":popover-open")||t.showPopover()}catch{t.classList.add("open")}this._placeMenu(),t.querySelector("button")?.focus()}}_placeMenu(){const e=this.renderRoot.querySelector(".menu"),t=this._menu?this.renderRoot.querySelector(`.row[data-eid="${CSS.escape(this._menu)}"] .more`):null;if(!e||!t)return;const o=t.getBoundingClientRect(),i=e.getBoundingClientRect(),n=Math.min(Math.max(8,o.right-i.width),window.innerWidth-i.width-8);let a=o.bottom+4;a+i.height>window.innerHeight-8&&(a=Math.max(8,o.top-i.height-4)),e.style.left=`${n}px`,e.style.top=`${a}px`}_closeMenu(){const e=this.renderRoot.querySelector(".menu");try{e?.matches(":popover-open")&&e.hidePopover()}catch{}e?.classList.remove("open"),this._menu=void 0,this._sure=!1}async _menuAction(e,t){if("show"===t)return this._menuView="show",await this.updateComplete,void this._placeMenu();if("update"!==t||this._sure)switch(this._closeMenu(),t){case"run":return this._run(e);case"undo":return this._undo();case"update":return this._update(e);case"edit":return this._navigate(`/config/scene/edit/${encodeURIComponent(e.id??"")}`);case"more_info":return this._moreInfo(e.entity_id);default:return}else this._sure=!0}_markDone(e){const t=this._done.get(e);t&&window.clearTimeout(t),this._done.set(e,window.setTimeout(()=>{this._done.delete(e),this.requestUpdate()},1600))}async _snapshot(e){if(!this._undoOn)return!1;const t=e.id?this._configs.get(e.id):void 0,o=function(e){const t=e.filter(e=>!cn(e));return t.length?{scene_id:an,snapshot_entities:t}:void 0}(function(e,t,o,i){if(o.length)return o;const n=Object.keys(i?.entities??{});if(n.length)return n;const a=An(e,t);return a?Object.keys(e.states).filter(t=>kn.has(ln(t))&&An(e,t)===a).sort():[]}(this.hass,e.entity_id,e.members,t));if(!o)return!1;try{return await this.hass.callService("scene","create",o),!0}catch{return!1}}_runData(){const e=this._config.transition;return e?{transition:e}:{}}async _run(e){if("unavailable"===e.status)return;const t=this.hass.states[e.entity_id]?.state,o=await this._snapshot(e);if(e.confirm){const i=this._awaiting.get(e.entity_id);i&&window.clearTimeout(i.timer);const n=window.setTimeout(()=>this._awaiting.delete(e.entity_id),6e4);return this._awaiting.set(e.entity_id,{before:t,undo:o,timer:n}),void this._fire(e.entity_id,{action:"perform-action",perform_action:"scene.turn_on",data:this._runData(),target:{entity_id:e.entity_id},confirmation:{text:this._t("confirm_run",{name:e.name})}})}const i=this._running.get(e.entity_id);i&&window.clearTimeout(i.timer);const n=window.setTimeout(()=>{this._running.delete(e.entity_id),this.requestUpdate()},8e3);this._running.set(e.entity_id,{before:t,timer:n}),this.requestUpdate();try{await this.hass.callService("scene","turn_on",this._runData(),{entity_id:e.entity_id}),o&&this._offerUndo(e.entity_id),this._ranToast(e.entity_id,o)}catch(t){window.clearTimeout(n),this._running.delete(e.entity_id),this.requestUpdate(),Nn(this,this._t("error",{error:zn(t)}))}}_offerUndo(e){this._undoFor=e,this._undoChip=!0,window.clearTimeout(this._undoTimer),this._undoTimer=window.setTimeout(()=>this._undoChip=!1,12e4)}_ranToast(e,t){const o=hn(this.hass,e);t&&this._undoFor===e?Nn(this,this._t("ran",{name:o}),{text:this._t("undo"),action:()=>this._undo()},1e4):Nn(this,this._t("ran",{name:o}))}async _undo(){if(this.hass.states[sn])try{await this.hass.callService("scene","turn_on",{},{entity_id:sn}),this._undoFor=void 0,this._undoChip=!1,window.clearTimeout(this._undoTimer),Nn(this,this._t("undone")),this.requestUpdate()}catch(e){Nn(this,this._t("error",{error:zn(e)}))}}async _update(e){if(!e.id)return;const t=`config/scene/config/${encodeURIComponent(e.id)}`;try{const o=await this.hass.callApi("GET",t),i=function(e,t){const o={};for(const[i,n]of Object.entries(t.entities??{})){const t=e.states[i];if(!t||"unavailable"===t.state||"unknown"===t.state){o[i]=n;continue}const a={};for(const[e,o]of Object.entries(t.attributes))Sn.has(e)||(a[e]=o);o[i]={...a,state:t.state}}return{...t,entities:o}}(this.hass,o);await this.hass.callApi("POST",t,i),this._configs=new Map(this._configs).set(e.id,i),Nn(this,this._t("updated",{name:e.name}))}catch(e){Nn(this,this._t("error",{error:zn(e)}))}}_moreInfo(e){this._fire(e,{action:"more-info"})}_navigate(e){this._fire("",{action:"navigate",navigation_path:e})}_fire(e,t){this.dispatchEvent(new CustomEvent("hass-action",{bubbles:!0,composed:!0,detail:{config:{entity:e,tap_action:t},action:"tap"}}))}}In.styles=Tn,e([he({attribute:!1})],In.prototype,"hass",void 0),e([pe()],In.prototype,"_config",void 0),e([pe()],In.prototype,"_configs",void 0),e([pe()],In.prototype,"_labelNames",void 0),e([pe()],In.prototype,"_menu",void 0),e([pe()],In.prototype,"_menuView",void 0),e([pe()],In.prototype,"_sure",void 0),e([pe()],In.prototype,"_undoChip",void 0),customElements.get("scene-pulse-card")||(customElements.define("scene-pulse-card",In),customElements.define("scene-pulse-card-editor",jn),window.customCards=window.customCards||[],window.customCards.push({type:"scene-pulse-card",name:"Scene Pulse Card",description:"Your scenes in a calm list: run them, undo, see which one is active, edit or re-capture them. The current house mode's scenes come first.",preview:!0}));console.info("%c PULSE-CARDS %c v1.1.0 ","color:#fff;background:#03a9f4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px","color:#03a9f4;background:#fff0;font-weight:700;padding:2px 4px");
