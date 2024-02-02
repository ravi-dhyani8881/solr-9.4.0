// https://d3js.org/d3-array/ Version 1.2.1. Copyright 2017 Mike Bostock.
!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define('d3-array',["exports"],r):r(n.d3=n.d3||{})}(this,function(n){"use strict";function r(n){return function(r,t){return f(n(r),t)}}function t(n,r){return[n,r]}function e(n,r,t){var e=(r-n)/Math.max(0,t),o=Math.floor(Math.log(e)/Math.LN10),u=e/Math.pow(10,o);return o>=0?(u>=b?10:u>=q?5:u>=L?2:1)*Math.pow(10,o):-Math.pow(10,-o)/(u>=b?10:u>=q?5:u>=L?2:1)}function o(n,r,t){var e=Math.abs(r-n)/Math.max(0,t),o=Math.pow(10,Math.floor(Math.log(e)/Math.LN10)),u=e/o;return u>=b?o*=10:u>=q?o*=5:u>=L&&(o*=2),r<n?-o:o}function u(n){return n.length}var f=function(n,r){return n<r?-1:n>r?1:n>=r?0:NaN},l=function(n){return 1===n.length&&(n=r(n)),{left:function(r,t,e,o){for(null==e&&(e=0),null==o&&(o=r.length);e<o;){var u=e+o>>>1;n(r[u],t)<0?e=u+1:o=u}return e},right:function(r,t,e,o){for(null==e&&(e=0),null==o&&(o=r.length);e<o;){var u=e+o>>>1;n(r[u],t)>0?o=u:e=u+1}return e}}},i=l(f),a=i.right,h=i.left,c=function(n,r){null==r&&(r=t);for(var e=0,o=n.length-1,u=n[0],f=new Array(o<0?0:o);e<o;)f[e]=r(u,u=n[++e]);return f},s=function(n,r,e){var o,u,f,l,i=n.length,a=r.length,h=new Array(i*a);for(null==e&&(e=t),o=f=0;o<i;++o)for(l=n[o],u=0;u<a;++u,++f)h[f]=e(l,r[u]);return h},g=function(n,r){return r<n?-1:r>n?1:r>=n?0:NaN},M=function(n){return null===n?NaN:+n},v=function(n,r){var t,e,o=n.length,u=0,f=-1,l=0,i=0;if(null==r)for(;++f<o;)isNaN(t=M(n[f]))||(e=t-l,l+=e/++u,i+=e*(t-l));else for(;++f<o;)isNaN(t=M(r(n[f],f,n)))||(e=t-l,l+=e/++u,i+=e*(t-l));if(u>1)return i/(u-1)},p=function(n,r){var t=v(n,r);return t?Math.sqrt(t):t},d=function(n,r){var t,e,o,u=n.length,f=-1;if(null==r){for(;++f<u;)if(null!=(t=n[f])&&t>=t)for(e=o=t;++f<u;)null!=(t=n[f])&&(e>t&&(e=t),o<t&&(o=t))}else for(;++f<u;)if(null!=(t=r(n[f],f,n))&&t>=t)for(e=o=t;++f<u;)null!=(t=r(n[f],f,n))&&(e>t&&(e=t),o<t&&(o=t));return[e,o]},y=Array.prototype,N=y.slice,m=y.map,w=function(n){return function(){return n}},A=function(n){return n},x=function(n,r,t){n=+n,r=+r,t=(o=arguments.length)<2?(r=n,n=0,1):o<3?1:+t;for(var e=-1,o=0|Math.max(0,Math.ceil((r-n)/t)),u=new Array(o);++e<o;)u[e]=n+e*t;return u},b=Math.sqrt(50),q=Math.sqrt(10),L=Math.sqrt(2),k=function(n,r,t){var o,u,f,l,i=-1;if(r=+r,n=+n,t=+t,n===r&&t>0)return[n];if((o=r<n)&&(u=n,n=r,r=u),0===(l=e(n,r,t))||!isFinite(l))return[];if(l>0)for(n=Math.ceil(n/l),r=Math.floor(r/l),f=new Array(u=Math.ceil(r-n+1));++i<u;)f[i]=(n+i)*l;else for(n=Math.floor(n*l),r=Math.ceil(r*l),f=new Array(u=Math.ceil(n-r+1));++i<u;)f[i]=(n-i)/l;return o&&f.reverse(),f},S=function(n){return Math.ceil(Math.log(n.length)/Math.LN2)+1},j=function(){function n(n){var u,f,l=n.length,i=new Array(l);for(u=0;u<l;++u)i[u]=r(n[u],u,n);var h=t(i),c=h[0],s=h[1],g=e(i,c,s);Array.isArray(g)||(g=o(c,s,g),g=x(Math.ceil(c/g)*g,Math.floor(s/g)*g,g));for(var M=g.length;g[0]<=c;)g.shift(),--M;for(;g[M-1]>s;)g.pop(),--M;var v,p=new Array(M+1);for(u=0;u<=M;++u)v=p[u]=[],v.x0=u>0?g[u-1]:c,v.x1=u<M?g[u]:s;for(u=0;u<l;++u)f=i[u],c<=f&&f<=s&&p[a(g,f,0,M)].push(n[u]);return p}var r=A,t=d,e=S;return n.value=function(t){return arguments.length?(r="function"==typeof t?t:w(t),n):r},n.domain=function(r){return arguments.length?(t="function"==typeof r?r:w([r[0],r[1]]),n):t},n.thresholds=function(r){return arguments.length?(e="function"==typeof r?r:w(Array.isArray(r)?N.call(r):r),n):e},n},F=function(n,r,t){if(null==t&&(t=M),e=n.length){if((r=+r)<=0||e<2)return+t(n[0],0,n);if(r>=1)return+t(n[e-1],e-1,n);var e,o=(e-1)*r,u=Math.floor(o),f=+t(n[u],u,n);return f+(+t(n[u+1],u+1,n)-f)*(o-u)}},_=function(n,r,t){return n=m.call(n,M).sort(f),Math.ceil((t-r)/(2*(F(n,.75)-F(n,.25))*Math.pow(n.length,-1/3)))},z=function(n,r,t){return Math.ceil((t-r)/(3.5*p(n)*Math.pow(n.length,-1/3)))},D=function(n,r){var t,e,o=n.length,u=-1;if(null==r){for(;++u<o;)if(null!=(t=n[u])&&t>=t)for(e=t;++u<o;)null!=(t=n[u])&&t>e&&(e=t)}else for(;++u<o;)if(null!=(t=r(n[u],u,n))&&t>=t)for(e=t;++u<o;)null!=(t=r(n[u],u,n))&&t>e&&(e=t);return e},I=function(n,r){var t,e=n.length,o=e,u=-1,f=0;if(null==r)for(;++u<e;)isNaN(t=M(n[u]))?--o:f+=t;else for(;++u<e;)isNaN(t=M(r(n[u],u,n)))?--o:f+=t;if(o)return f/o},O=function(n,r){var t,e=n.length,o=-1,u=[];if(null==r)for(;++o<e;)isNaN(t=M(n[o]))||u.push(t);else for(;++o<e;)isNaN(t=M(r(n[o],o,n)))||u.push(t);return F(u.sort(f),.5)},P=function(n){for(var r,t,e,o=n.length,u=-1,f=0;++u<o;)f+=n[u].length;for(t=new Array(f);--o>=0;)for(e=n[o],r=e.length;--r>=0;)t[--f]=e[r];return t},R=function(n,r){var t,e,o=n.length,u=-1;if(null==r){for(;++u<o;)if(null!=(t=n[u])&&t>=t)for(e=t;++u<o;)null!=(t=n[u])&&e>t&&(e=t)}else for(;++u<o;)if(null!=(t=r(n[u],u,n))&&t>=t)for(e=t;++u<o;)null!=(t=r(n[u],u,n))&&e>t&&(e=t);return e},B=function(n,r){for(var t=r.length,e=new Array(t);t--;)e[t]=n[r[t]];return e},C=function(n,r){if(t=n.length){var t,e,o=0,u=0,l=n[u];for(null==r&&(r=f);++o<t;)(r(e=n[o],l)<0||0!==r(l,l))&&(l=e,u=o);return 0===r(l,l)?u:void 0}},E=function(n,r,t){for(var e,o,u=(null==t?n.length:t)-(r=null==r?0:+r);u;)o=Math.random()*u--|0,e=n[u+r],n[u+r]=n[o+r],n[o+r]=e;return n},G=function(n,r){var t,e=n.length,o=-1,u=0;if(null==r)for(;++o<e;)(t=+n[o])&&(u+=t);else for(;++o<e;)(t=+r(n[o],o,n))&&(u+=t);return u},H=function(n){if(!(o=n.length))return[];for(var r=-1,t=R(n,u),e=new Array(t);++r<t;)for(var o,f=-1,l=e[r]=new Array(o);++f<o;)l[f]=n[f][r];return e},J=function(){return H(arguments)};n.bisect=a,n.bisectRight=a,n.bisectLeft=h,n.ascending=f,n.bisector=l,n.cross=s,n.descending=g,n.deviation=p,n.extent=d,n.histogram=j,n.thresholdFreedmanDiaconis=_,n.thresholdScott=z,n.thresholdSturges=S,n.max=D,n.mean=I,n.median=O,n.merge=P,n.min=R,n.pairs=c,n.permute=B,n.quantile=F,n.range=x,n.scan=C,n.shuffle=E,n.sum=G,n.ticks=k,n.tickIncrement=e,n.tickStep=o,n.transpose=H,n.variance=v,n.zip=J,Object.defineProperty(n,"__esModule",{value:!0})});

// https://d3js.org/d3-path/ Version 1.0.5. Copyright 2017 Mike Bostock.
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define('d3-path',["exports"],i):i(t.d3=t.d3||{})}(this,function(t){"use strict";function i(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function s(){return new i}var h=Math.PI,_=2*h,e=_-1e-6;i.prototype=s.prototype={constructor:i,moveTo:function(t,i){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+i)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,i){this._+="L"+(this._x1=+t)+","+(this._y1=+i)},quadraticCurveTo:function(t,i,s,h){this._+="Q"+ +t+","+ +i+","+(this._x1=+s)+","+(this._y1=+h)},bezierCurveTo:function(t,i,s,h,_,e){this._+="C"+ +t+","+ +i+","+ +s+","+ +h+","+(this._x1=+_)+","+(this._y1=+e)},arcTo:function(t,i,s,_,e){t=+t,i=+i,s=+s,_=+_,e=+e;var n=this._x1,o=this._y1,r=s-t,a=_-i,u=n-t,c=o-i,f=u*u+c*c;if(e<0)throw new Error("negative radius: "+e);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=i);else if(f>1e-6)if(Math.abs(c*r-a*u)>1e-6&&e){var x=s-n,y=_-o,M=r*r+a*a,l=x*x+y*y,d=Math.sqrt(M),p=Math.sqrt(f),v=e*Math.tan((h-Math.acos((M+f-l)/(2*d*p)))/2),b=v/p,w=v/d;Math.abs(b-1)>1e-6&&(this._+="L"+(t+b*u)+","+(i+b*c)),this._+="A"+e+","+e+",0,0,"+ +(c*x>u*y)+","+(this._x1=t+w*r)+","+(this._y1=i+w*a)}else this._+="L"+(this._x1=t)+","+(this._y1=i);else;},arc:function(t,i,s,n,o,r){t=+t,i=+i,s=+s;var a=s*Math.cos(n),u=s*Math.sin(n),c=t+a,f=i+u,x=1^r,y=r?n-o:o-n;if(s<0)throw new Error("negative radius: "+s);null===this._x1?this._+="M"+c+","+f:(Math.abs(this._x1-c)>1e-6||Math.abs(this._y1-f)>1e-6)&&(this._+="L"+c+","+f),s&&(y<0&&(y=y%_+_),y>e?this._+="A"+s+","+s+",0,1,"+x+","+(t-a)+","+(i-u)+"A"+s+","+s+",0,1,"+x+","+(this._x1=c)+","+(this._y1=f):y>1e-6&&(this._+="A"+s+","+s+",0,"+ +(y>=h)+","+x+","+(this._x1=t+s*Math.cos(o))+","+(this._y1=i+s*Math.sin(o))))},rect:function(t,i,s,h){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+i)+"h"+ +s+"v"+ +h+"h"+-s+"Z"},toString:function(){return this._}},t.path=s,Object.defineProperty(t,"__esModule",{value:!0})});
// https://d3js.org/d3-shape/ Version 1.2.0. Copyright 2017 Mike Bostock.
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("d3-path")):"function"==typeof define&&define.amd?define('d3-shape',["exports","d3-path"],n):n(t.d3=t.d3||{},t.d3)}(this,function(t,n){"use strict";function i(t){return t>1?0:t<-1?lt:Math.acos(t)}function e(t){return t>=1?ut:t<=-1?-ut:Math.asin(t)}function s(t){return t.innerRadius}function h(t){return t.outerRadius}function o(t){return t.startAngle}function _(t){return t.endAngle}function r(t){return t&&t.padAngle}function a(t,n,i,e,s,h,o,_){var r=i-t,a=e-n,c=o-s,l=_-h,u=(c*(n-h)-l*(t-s))/(l*r-c*a);return[t+u*r,n+u*a]}function c(t,n,i,e,s,h,o){var _=t-i,r=n-e,a=(o?h:-h)/at(_*_+r*r),c=a*r,l=-a*_,u=t+c,f=n+l,x=i+c,y=e+l,p=(u+x)/2,v=(f+y)/2,d=x-u,T=y-f,g=d*d+T*T,b=s-h,w=u*y-x*f,k=(T<0?-1:1)*at(ot(0,b*b*g-w*w)),m=(w*T-d*k)/g,N=(-w*d-T*k)/g,M=(w*T+d*k)/g,S=(-w*d+T*k)/g,E=m-p,A=N-v,P=M-p,C=S-v;return E*E+A*A>P*P+C*C&&(m=M,N=S),{cx:m,cy:N,x01:-c,y01:-l,x11:m*(s/b-1),y11:N*(s/b-1)}}function l(t){this._context=t}function u(t){return t[0]}function f(t){return t[1]}function x(t){this._curve=t}function y(t){function n(n){return new x(t(n))}return n._curve=t,n}function p(t){var n=t.curve;return t.angle=t.x,delete t.x,t.radius=t.y,delete t.y,t.curve=function(t){return arguments.length?n(y(t)):n()._curve},t}function v(t){return t.source}function d(t){return t.target}function T(t){function i(){var i,r=Nt.call(arguments),a=e.apply(this,r),c=s.apply(this,r);if(_||(_=i=n.path()),t(_,+h.apply(this,(r[0]=a,r)),+o.apply(this,r),+h.apply(this,(r[0]=c,r)),+o.apply(this,r)),i)return _=null,i+""||null}var e=v,s=d,h=u,o=f,_=null;return i.source=function(t){return arguments.length?(e=t,i):e},i.target=function(t){return arguments.length?(s=t,i):s},i.x=function(t){return arguments.length?(h="function"==typeof t?t:it(+t),i):h},i.y=function(t){return arguments.length?(o="function"==typeof t?t:it(+t),i):o},i.context=function(t){return arguments.length?(_=null==t?null:t,i):_},i}function g(t,n,i,e,s){t.moveTo(n,i),t.bezierCurveTo(n=(n+e)/2,i,n,s,e,s)}function b(t,n,i,e,s){t.moveTo(n,i),t.bezierCurveTo(n,i=(i+s)/2,e,i,e,s)}function w(t,n,i,e,s){var h=mt(n,i),o=mt(n,i=(i+s)/2),_=mt(e,i),r=mt(e,s);t.moveTo(h[0],h[1]),t.bezierCurveTo(o[0],o[1],_[0],_[1],r[0],r[1])}function k(){return T(g)}function m(){return T(b)}function N(){var t=T(w);return t.angle=t.x,delete t.x,t.radius=t.y,delete t.y,t}function M(t,n,i){t._context.bezierCurveTo((2*t._x0+t._x1)/3,(2*t._y0+t._y1)/3,(t._x0+2*t._x1)/3,(t._y0+2*t._y1)/3,(t._x0+4*t._x1+n)/6,(t._y0+4*t._y1+i)/6)}function S(t){this._context=t}function E(t){this._context=t}function A(t){this._context=t}function P(t,n){this._basis=new S(t),this._beta=n}function C(t,n,i){t._context.bezierCurveTo(t._x1+t._k*(t._x2-t._x0),t._y1+t._k*(t._y2-t._y0),t._x2+t._k*(t._x1-n),t._y2+t._k*(t._y1-i),t._x2,t._y2)}function R(t,n){this._context=t,this._k=(1-n)/6}function q(t,n){this._context=t,this._k=(1-n)/6}function O(t,n){this._context=t,this._k=(1-n)/6}function z(t,n,i){var e=t._x1,s=t._y1,h=t._x2,o=t._y2;if(t._l01_a>ct){var _=2*t._l01_2a+3*t._l01_a*t._l12_a+t._l12_2a,r=3*t._l01_a*(t._l01_a+t._l12_a);e=(e*_-t._x0*t._l12_2a+t._x2*t._l01_2a)/r,s=(s*_-t._y0*t._l12_2a+t._y2*t._l01_2a)/r}if(t._l23_a>ct){var a=2*t._l23_2a+3*t._l23_a*t._l12_a+t._l12_2a,c=3*t._l23_a*(t._l23_a+t._l12_a);h=(h*a+t._x1*t._l23_2a-n*t._l12_2a)/c,o=(o*a+t._y1*t._l23_2a-i*t._l12_2a)/c}t._context.bezierCurveTo(e,s,h,o,t._x2,t._y2)}function X(t,n){this._context=t,this._alpha=n}function Y(t,n){this._context=t,this._alpha=n}function B(t,n){this._context=t,this._alpha=n}function I(t){this._context=t}function j(t){return t<0?-1:1}function D(t,n,i){var e=t._x1-t._x0,s=n-t._x1,h=(t._y1-t._y0)/(e||s<0&&-0),o=(i-t._y1)/(s||e<0&&-0),_=(h*s+o*e)/(e+s);return(j(h)+j(o))*Math.min(Math.abs(h),Math.abs(o),.5*Math.abs(_))||0}function L(t,n){var i=t._x1-t._x0;return i?(3*(t._y1-t._y0)/i-n)/2:n}function V(t,n,i){var e=t._x0,s=t._y0,h=t._x1,o=t._y1,_=(h-e)/3;t._context.bezierCurveTo(e+_,s+_*n,h-_,o-_*i,h,o)}function W(t){this._context=t}function H(t){this._context=new F(t)}function F(t){this._context=t}function G(t){return new W(t)}function J(t){return new H(t)}function K(t){this._context=t}function Q(t){var n,i,e=t.length-1,s=new Array(e),h=new Array(e),o=new Array(e);for(s[0]=0,h[0]=2,o[0]=t[0]+2*t[1],n=1;n<e-1;++n)s[n]=1,h[n]=4,o[n]=4*t[n]+2*t[n+1];for(s[e-1]=2,h[e-1]=7,o[e-1]=8*t[e-1]+t[e],n=1;n<e;++n)i=s[n]/h[n-1],h[n]-=i,o[n]-=i*o[n-1];for(s[e-1]=o[e-1]/h[e-1],n=e-2;n>=0;--n)s[n]=(o[n]-s[n+1])/h[n];for(h[e-1]=(t[e]+s[e-1])/2,n=0;n<e-1;++n)h[n]=2*t[n+1]-s[n+1];return[s,h]}function U(t,n){this._context=t,this._t=n}function Z(t){return new U(t,0)}function $(t){return new U(t,1)}function tt(t,n){return t[n]}function nt(t){for(var n,i=0,e=-1,s=t.length;++e<s;)(n=+t[e][1])&&(i+=n);return i}var it=function(t){return function(){return t}},et=Math.abs,st=Math.atan2,ht=Math.cos,ot=Math.max,_t=Math.min,rt=Math.sin,at=Math.sqrt,ct=1e-12,lt=Math.PI,ut=lt/2,ft=2*lt,xt=function(){function t(){var t,s,h=+l.apply(this,arguments),o=+u.apply(this,arguments),_=y.apply(this,arguments)-ut,r=p.apply(this,arguments)-ut,T=et(r-_),g=r>_;if(d||(d=t=n.path()),o<h&&(s=o,o=h,h=s),o>ct)if(T>ft-ct)d.moveTo(o*ht(_),o*rt(_)),d.arc(0,0,o,_,r,!g),h>ct&&(d.moveTo(h*ht(r),h*rt(r)),d.arc(0,0,h,r,_,g));else{var b,w,k=_,m=r,N=_,M=r,S=T,E=T,A=v.apply(this,arguments)/2,P=A>ct&&(x?+x.apply(this,arguments):at(h*h+o*o)),C=_t(et(o-h)/2,+f.apply(this,arguments)),R=C,q=C;if(P>ct){var O=e(P/h*rt(A)),z=e(P/o*rt(A));(S-=2*O)>ct?(O*=g?1:-1,N+=O,M-=O):(S=0,N=M=(_+r)/2),(E-=2*z)>ct?(z*=g?1:-1,k+=z,m-=z):(E=0,k=m=(_+r)/2)}var X=o*ht(k),Y=o*rt(k),B=h*ht(M),I=h*rt(M);if(C>ct){var j=o*ht(m),D=o*rt(m),L=h*ht(N),V=h*rt(N);if(T<lt){var W=S>ct?a(X,Y,L,V,j,D,B,I):[B,I],H=X-W[0],F=Y-W[1],G=j-W[0],J=D-W[1],K=1/rt(i((H*G+F*J)/(at(H*H+F*F)*at(G*G+J*J)))/2),Q=at(W[0]*W[0]+W[1]*W[1]);R=_t(C,(h-Q)/(K-1)),q=_t(C,(o-Q)/(K+1))}}E>ct?q>ct?(b=c(L,V,X,Y,o,q,g),w=c(j,D,B,I,o,q,g),d.moveTo(b.cx+b.x01,b.cy+b.y01),q<C?d.arc(b.cx,b.cy,q,st(b.y01,b.x01),st(w.y01,w.x01),!g):(d.arc(b.cx,b.cy,q,st(b.y01,b.x01),st(b.y11,b.x11),!g),d.arc(0,0,o,st(b.cy+b.y11,b.cx+b.x11),st(w.cy+w.y11,w.cx+w.x11),!g),d.arc(w.cx,w.cy,q,st(w.y11,w.x11),st(w.y01,w.x01),!g))):(d.moveTo(X,Y),d.arc(0,0,o,k,m,!g)):d.moveTo(X,Y),h>ct&&S>ct?R>ct?(b=c(B,I,j,D,h,-R,g),w=c(X,Y,L,V,h,-R,g),d.lineTo(b.cx+b.x01,b.cy+b.y01),R<C?d.arc(b.cx,b.cy,R,st(b.y01,b.x01),st(w.y01,w.x01),!g):(d.arc(b.cx,b.cy,R,st(b.y01,b.x01),st(b.y11,b.x11),!g),d.arc(0,0,h,st(b.cy+b.y11,b.cx+b.x11),st(w.cy+w.y11,w.cx+w.x11),g),d.arc(w.cx,w.cy,R,st(w.y11,w.x11),st(w.y01,w.x01),!g))):d.arc(0,0,h,M,N,g):d.lineTo(B,I)}else d.moveTo(0,0);if(d.closePath(),t)return d=null,t+""||null}var l=s,u=h,f=it(0),x=null,y=o,p=_,v=r,d=null;return t.centroid=function(){var t=(+l.apply(this,arguments)+ +u.apply(this,arguments))/2,n=(+y.apply(this,arguments)+ +p.apply(this,arguments))/2-lt/2;return[ht(n)*t,rt(n)*t]},t.innerRadius=function(n){return arguments.length?(l="function"==typeof n?n:it(+n),t):l},t.outerRadius=function(n){return arguments.length?(u="function"==typeof n?n:it(+n),t):u},t.cornerRadius=function(n){return arguments.length?(f="function"==typeof n?n:it(+n),t):f},t.padRadius=function(n){return arguments.length?(x=null==n?null:"function"==typeof n?n:it(+n),t):x},t.startAngle=function(n){return arguments.length?(y="function"==typeof n?n:it(+n),t):y},t.endAngle=function(n){return arguments.length?(p="function"==typeof n?n:it(+n),t):p},t.padAngle=function(n){return arguments.length?(v="function"==typeof n?n:it(+n),t):v},t.context=function(n){return arguments.length?(d=null==n?null:n,t):d},t};l.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:this._context.lineTo(t,n)}}};var yt=function(t){return new l(t)},pt=function(){function t(t){var r,a,c,l=t.length,u=!1;for(null==h&&(_=o(c=n.path())),r=0;r<=l;++r)!(r<l&&s(a=t[r],r,t))===u&&((u=!u)?_.lineStart():_.lineEnd()),u&&_.point(+i(a,r,t),+e(a,r,t));if(c)return _=null,c+""||null}var i=u,e=f,s=it(!0),h=null,o=yt,_=null;return t.x=function(n){return arguments.length?(i="function"==typeof n?n:it(+n),t):i},t.y=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),t):e},t.defined=function(n){return arguments.length?(s="function"==typeof n?n:it(!!n),t):s},t.curve=function(n){return arguments.length?(o=n,null!=h&&(_=o(h)),t):o},t.context=function(n){return arguments.length?(null==n?h=_=null:_=o(h=n),t):h},t},vt=function(){function t(t){var i,l,u,f,x,y=t.length,p=!1,v=new Array(y),d=new Array(y);for(null==r&&(c=a(x=n.path())),i=0;i<=y;++i){if(!(i<y&&_(f=t[i],i,t))===p)if(p=!p)l=i,c.areaStart(),c.lineStart();else{for(c.lineEnd(),c.lineStart(),u=i-1;u>=l;--u)c.point(v[u],d[u]);c.lineEnd(),c.areaEnd()}p&&(v[i]=+e(f,i,t),d[i]=+h(f,i,t),c.point(s?+s(f,i,t):v[i],o?+o(f,i,t):d[i]))}if(x)return c=null,x+""||null}function i(){return pt().defined(_).curve(a).context(r)}var e=u,s=null,h=it(0),o=f,_=it(!0),r=null,a=yt,c=null;return t.x=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),s=null,t):e},t.x0=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),t):e},t.x1=function(n){return arguments.length?(s=null==n?null:"function"==typeof n?n:it(+n),t):s},t.y=function(n){return arguments.length?(h="function"==typeof n?n:it(+n),o=null,t):h},t.y0=function(n){return arguments.length?(h="function"==typeof n?n:it(+n),t):h},t.y1=function(n){return arguments.length?(o=null==n?null:"function"==typeof n?n:it(+n),t):o},t.lineX0=t.lineY0=function(){return i().x(e).y(h)},t.lineY1=function(){return i().x(e).y(o)},t.lineX1=function(){return i().x(s).y(h)},t.defined=function(n){return arguments.length?(_="function"==typeof n?n:it(!!n),t):_},t.curve=function(n){return arguments.length?(a=n,null!=r&&(c=a(r)),t):a},t.context=function(n){return arguments.length?(null==n?r=c=null:c=a(r=n),t):r},t},dt=function(t,n){return n<t?-1:n>t?1:n>=t?0:NaN},Tt=function(t){return t},gt=function(){function t(t){var _,r,a,c,l,u=t.length,f=0,x=new Array(u),y=new Array(u),p=+s.apply(this,arguments),v=Math.min(ft,Math.max(-ft,h.apply(this,arguments)-p)),d=Math.min(Math.abs(v)/u,o.apply(this,arguments)),T=d*(v<0?-1:1);for(_=0;_<u;++_)(l=y[x[_]=_]=+n(t[_],_,t))>0&&(f+=l);for(null!=i?x.sort(function(t,n){return i(y[t],y[n])}):null!=e&&x.sort(function(n,i){return e(t[n],t[i])}),_=0,a=f?(v-u*T)/f:0;_<u;++_,p=c)r=x[_],l=y[r],c=p+(l>0?l*a:0)+T,y[r]={data:t[r],index:_,value:l,startAngle:p,endAngle:c,padAngle:d};return y}var n=Tt,i=dt,e=null,s=it(0),h=it(ft),o=it(0);return t.value=function(i){return arguments.length?(n="function"==typeof i?i:it(+i),t):n},t.sortValues=function(n){return arguments.length?(i=n,e=null,t):i},t.sort=function(n){return arguments.length?(e=n,i=null,t):e},t.startAngle=function(n){return arguments.length?(s="function"==typeof n?n:it(+n),t):s},t.endAngle=function(n){return arguments.length?(h="function"==typeof n?n:it(+n),t):h},t.padAngle=function(n){return arguments.length?(o="function"==typeof n?n:it(+n),t):o},t},bt=y(yt);x.prototype={areaStart:function(){this._curve.areaStart()},areaEnd:function(){this._curve.areaEnd()},lineStart:function(){this._curve.lineStart()},lineEnd:function(){this._curve.lineEnd()},point:function(t,n){this._curve.point(n*Math.sin(t),n*-Math.cos(t))}};var wt=function(){return p(pt().curve(bt))},kt=function(){var t=vt().curve(bt),n=t.curve,i=t.lineX0,e=t.lineX1,s=t.lineY0,h=t.lineY1;return t.angle=t.x,delete t.x,t.startAngle=t.x0,delete t.x0,t.endAngle=t.x1,delete t.x1,t.radius=t.y,delete t.y,t.innerRadius=t.y0,delete t.y0,t.outerRadius=t.y1,delete t.y1,t.lineStartAngle=function(){return p(i())},delete t.lineX0,t.lineEndAngle=function(){return p(e())},delete t.lineX1,t.lineInnerRadius=function(){return p(s())},delete t.lineY0,t.lineOuterRadius=function(){return p(h())},delete t.lineY1,t.curve=function(t){return arguments.length?n(y(t)):n()._curve},t},mt=function(t,n){return[(n=+n)*Math.cos(t-=Math.PI/2),n*Math.sin(t)]},Nt=Array.prototype.slice,Mt={draw:function(t,n){var i=Math.sqrt(n/lt);t.moveTo(i,0),t.arc(0,0,i,0,ft)}},St={draw:function(t,n){var i=Math.sqrt(n/5)/2;t.moveTo(-3*i,-i),t.lineTo(-i,-i),t.lineTo(-i,-3*i),t.lineTo(i,-3*i),t.lineTo(i,-i),t.lineTo(3*i,-i),t.lineTo(3*i,i),t.lineTo(i,i),t.lineTo(i,3*i),t.lineTo(-i,3*i),t.lineTo(-i,i),t.lineTo(-3*i,i),t.closePath()}},Et=Math.sqrt(1/3),At=2*Et,Pt={draw:function(t,n){var i=Math.sqrt(n/At),e=i*Et;t.moveTo(0,-i),t.lineTo(e,0),t.lineTo(0,i),t.lineTo(-e,0),t.closePath()}},Ct=Math.sin(lt/10)/Math.sin(7*lt/10),Rt=Math.sin(ft/10)*Ct,qt=-Math.cos(ft/10)*Ct,Ot={draw:function(t,n){var i=Math.sqrt(.8908130915292852*n),e=Rt*i,s=qt*i;t.moveTo(0,-i),t.lineTo(e,s);for(var h=1;h<5;++h){var o=ft*h/5,_=Math.cos(o),r=Math.sin(o);t.lineTo(r*i,-_*i),t.lineTo(_*e-r*s,r*e+_*s)}t.closePath()}},zt={draw:function(t,n){var i=Math.sqrt(n),e=-i/2;t.rect(e,e,i,i)}},Xt=Math.sqrt(3),Yt={draw:function(t,n){var i=-Math.sqrt(n/(3*Xt));t.moveTo(0,2*i),t.lineTo(-Xt*i,-i),t.lineTo(Xt*i,-i),t.closePath()}},Bt=-.5,It=Math.sqrt(3)/2,jt=1/Math.sqrt(12),Dt=3*(jt/2+1),Lt={draw:function(t,n){var i=Math.sqrt(n/Dt),e=i/2,s=i*jt,h=e,o=i*jt+i,_=-h,r=o;t.moveTo(e,s),t.lineTo(h,o),t.lineTo(_,r),t.lineTo(Bt*e-It*s,It*e+Bt*s),t.lineTo(Bt*h-It*o,It*h+Bt*o),t.lineTo(Bt*_-It*r,It*_+Bt*r),t.lineTo(Bt*e+It*s,Bt*s-It*e),t.lineTo(Bt*h+It*o,Bt*o-It*h),t.lineTo(Bt*_+It*r,Bt*r-It*_),t.closePath()}},Vt=[Mt,St,Pt,zt,Ot,Yt,Lt],Wt=function(){function t(){var t;if(s||(s=t=n.path()),i.apply(this,arguments).draw(s,+e.apply(this,arguments)),t)return s=null,t+""||null}var i=it(Mt),e=it(64),s=null;return t.type=function(n){return arguments.length?(i="function"==typeof n?n:it(n),t):i},t.size=function(n){return arguments.length?(e="function"==typeof n?n:it(+n),t):e},t.context=function(n){return arguments.length?(s=null==n?null:n,t):s},t},Ht=function(){};S.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){switch(this._point){case 3:M(this,this._x1,this._y1);case 2:this._context.lineTo(this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3,this._context.lineTo((5*this._x0+this._x1)/6,(5*this._y0+this._y1)/6);default:M(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Ft=function(t){return new S(t)};E.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._y0=this._y1=this._y2=this._y3=this._y4=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x2,this._y2),this._context.closePath();break;case 2:this._context.moveTo((this._x2+2*this._x3)/3,(this._y2+2*this._y3)/3),this._context.lineTo((this._x3+2*this._x2)/3,(this._y3+2*this._y2)/3),this._context.closePath();break;case 3:this.point(this._x2,this._y2),this.point(this._x3,this._y3),this.point(this._x4,this._y4)}},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._x2=t,this._y2=n;break;case 1:this._point=2,this._x3=t,this._y3=n;break;case 2:this._point=3,this._x4=t,this._y4=n,this._context.moveTo((this._x0+4*this._x1+t)/6,(this._y0+4*this._y1+n)/6);break;default:M(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Gt=function(t){return new E(t)};A.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3;var i=(this._x0+4*this._x1+t)/6,e=(this._y0+4*this._y1+n)/6;this._line?this._context.lineTo(i,e):this._context.moveTo(i,e);break;case 3:this._point=4;default:M(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Jt=function(t){return new A(t)};P.prototype={lineStart:function(){this._x=[],this._y=[],this._basis.lineStart()},lineEnd:function(){var t=this._x,n=this._y,i=t.length-1;if(i>0)for(var e,s=t[0],h=n[0],o=t[i]-s,_=n[i]-h,r=-1;++r<=i;)e=r/i,this._basis.point(this._beta*t[r]+(1-this._beta)*(s+e*o),this._beta*n[r]+(1-this._beta)*(h+e*_));this._x=this._y=null,this._basis.lineEnd()},point:function(t,n){this._x.push(+t),this._y.push(+n)}};var Kt=function t(n){function i(t){return 1===n?new S(t):new P(t,n)}return i.beta=function(n){return t(+n)},i}(.85);R.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:C(this,this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2,this._x1=t,this._y1=n;break;case 2:this._point=3;default:C(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Qt=function t(n){function i(t){return new R(t,n)}return i.tension=function(n){return t(+n)},i}(0);q.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._x3=t,this._y3=n;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=n);break;case 2:this._point=3,this._x5=t,this._y5=n;break;default:C(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Ut=function t(n){function i(t){return new q(t,n)}return i.tension=function(n){return t(+n)},i}(0);O.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:C(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Zt=function t(n){function i(t){return new O(t,n)}return i.tension=function(n){return t(+n)},i}(0);X.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:this.point(this._x2,this._y2)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){if(t=+t,n=+n,this._point){var i=this._x2-t,e=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(i*i+e*e,this._alpha))}switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3;default:z(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var $t=function t(n){function i(t){return n?new X(t,n):new R(t,0)}return i.alpha=function(n){return t(+n)},i}(.5);Y.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,n){if(t=+t,n=+n,this._point){var i=this._x2-t,e=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(i*i+e*e,this._alpha))}switch(this._point){case 0:this._point=1,this._x3=t,this._y3=n;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=n);break;case 2:this._point=3,this._x5=t,this._y5=n;break;default:z(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var tn=function t(n){function i(t){return n?new Y(t,n):new q(t,0)}return i.alpha=function(n){return t(+n)},i}(.5);B.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){if(t=+t,n=+n,this._point){var i=this._x2-t,e=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(i*i+e*e,this._alpha))}switch(this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:z(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var nn=function t(n){function i(t){return n?new B(t,n):new O(t,0)}return i.alpha=function(n){return t(+n)},i}(.5);I.prototype={areaStart:Ht,areaEnd:Ht,lineStart:function(){this._point=0},lineEnd:function(){this._point&&this._context.closePath()},point:function(t,n){t=+t,n=+n,this._point?this._context.lineTo(t,n):(this._point=1,this._context.moveTo(t,n))}};var en=function(t){return new I(t)};W.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=this._t0=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x1,this._y1);break;case 3:V(this,this._t0,L(this,this._t0))}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){var i=NaN;if(t=+t,n=+n,t!==this._x1||n!==this._y1){switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3,V(this,L(this,i=D(this,t,n)),i);break;default:V(this,this._t0,i=D(this,t,n))}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n,this._t0=i}}},(H.prototype=Object.create(W.prototype)).point=function(t,n){W.prototype.point.call(this,n,t)},F.prototype={moveTo:function(t,n){this._context.moveTo(n,t)},closePath:function(){this._context.closePath()},lineTo:function(t,n){this._context.lineTo(n,t)},bezierCurveTo:function(t,n,i,e,s,h){this._context.bezierCurveTo(n,t,e,i,h,s)}},K.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=[],this._y=[]},lineEnd:function(){var t=this._x,n=this._y,i=t.length;if(i)if(this._line?this._context.lineTo(t[0],n[0]):this._context.moveTo(t[0],n[0]),2===i)this._context.lineTo(t[1],n[1]);else for(var e=Q(t),s=Q(n),h=0,o=1;o<i;++h,++o)this._context.bezierCurveTo(e[0][h],s[0][h],e[1][h],s[1][h],t[o],n[o]);(this._line||0!==this._line&&1===i)&&this._context.closePath(),this._line=1-this._line,this._x=this._y=null},point:function(t,n){this._x.push(+t),this._y.push(+n)}};var sn=function(t){return new K(t)};U.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=this._y=NaN,this._point=0},lineEnd:function(){0<this._t&&this._t<1&&2===this._point&&this._context.lineTo(this._x,this._y),(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line>=0&&(this._t=1-this._t,this._line=1-this._line)},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:if(this._t<=0)this._context.lineTo(this._x,n),this._context.lineTo(t,n);else{var i=this._x*(1-this._t)+t*this._t;this._context.lineTo(i,this._y),this._context.lineTo(i,n)}}this._x=t,this._y=n}};var hn=function(t){return new U(t,.5)},on=function(t,n){if((s=t.length)>1)for(var i,e,s,h=1,o=t[n[0]],_=o.length;h<s;++h)for(e=o,o=t[n[h]],i=0;i<_;++i)o[i][1]+=o[i][0]=isNaN(e[i][1])?e[i][0]:e[i][1]},_n=function(t){for(var n=t.length,i=new Array(n);--n>=0;)i[n]=n;return i},rn=function(){function t(t){var h,o,_=n.apply(this,arguments),r=t.length,a=_.length,c=new Array(a);for(h=0;h<a;++h){for(var l,u=_[h],f=c[h]=new Array(r),x=0;x<r;++x)f[x]=l=[0,+s(t[x],u,x,t)],l.data=t[x];f.key=u}for(h=0,o=i(c);h<a;++h)c[o[h]].index=h;return e(c,o),c}var n=it([]),i=_n,e=on,s=tt;return t.keys=function(i){return arguments.length?(n="function"==typeof i?i:it(Nt.call(i)),t):n},t.value=function(n){return arguments.length?(s="function"==typeof n?n:it(+n),t):s},t.order=function(n){return arguments.length?(i=null==n?_n:"function"==typeof n?n:it(Nt.call(n)),t):i},t.offset=function(n){return arguments.length?(e=null==n?on:n,t):e},t},an=function(t,n){if((e=t.length)>0){for(var i,e,s,h=0,o=t[0].length;h<o;++h){for(s=i=0;i<e;++i)s+=t[i][h][1]||0;if(s)for(i=0;i<e;++i)t[i][h][1]/=s}on(t,n)}},cn=function(t,n){if((_=t.length)>1)for(var i,e,s,h,o,_,r=0,a=t[n[0]].length;r<a;++r)for(h=o=0,i=0;i<_;++i)(s=(e=t[n[i]][r])[1]-e[0])>=0?(e[0]=h,e[1]=h+=s):s<0?(e[1]=o,e[0]=o+=s):e[0]=h},ln=function(t,n){if((i=t.length)>0){for(var i,e=0,s=t[n[0]],h=s.length;e<h;++e){for(var o=0,_=0;o<i;++o)_+=t[o][e][1]||0;s[e][1]+=s[e][0]=-_/2}on(t,n)}},un=function(t,n){if((s=t.length)>0&&(e=(i=t[n[0]]).length)>0){for(var i,e,s,h=0,o=1;o<e;++o){for(var _=0,r=0,a=0;_<s;++_){for(var c=t[n[_]],l=c[o][1]||0,u=c[o-1][1]||0,f=(l-u)/2,x=0;x<_;++x){var y=t[n[x]];f+=(y[o][1]||0)-(y[o-1][1]||0)}r+=l,a+=f*l}i[o-1][1]+=i[o-1][0]=h,r&&(h-=a/r)}i[o-1][1]+=i[o-1][0]=h,on(t,n)}},fn=function(t){var n=t.map(nt);return _n(t).sort(function(t,i){return n[t]-n[i]})},xn=function(t){return fn(t).reverse()},yn=function(t){var n,i,e=t.length,s=t.map(nt),h=_n(t).sort(function(t,n){return s[n]-s[t]}),o=0,_=0,r=[],a=[];for(n=0;n<e;++n)i=h[n],o<_?(o+=s[i],r.push(i)):(_+=s[i],a.push(i));return a.reverse().concat(r)},pn=function(t){return _n(t).reverse()};t.arc=xt,t.area=vt,t.line=pt,t.pie=gt,t.areaRadial=kt,t.radialArea=kt,t.lineRadial=wt,t.radialLine=wt,t.pointRadial=mt,t.linkHorizontal=k,t.linkVertical=m,t.linkRadial=N,t.symbol=Wt,t.symbols=Vt,t.symbolCircle=Mt,t.symbolCross=St,t.symbolDiamond=Pt,t.symbolSquare=zt,t.symbolStar=Ot,t.symbolTriangle=Yt,t.symbolWye=Lt,t.curveBasisClosed=Gt,t.curveBasisOpen=Jt,t.curveBasis=Ft,t.curveBundle=Kt,t.curveCardinalClosed=Ut,t.curveCardinalOpen=Zt,t.curveCardinal=Qt,t.curveCatmullRomClosed=tn,t.curveCatmullRomOpen=nn,t.curveCatmullRom=$t,t.curveLinearClosed=en,t.curveLinear=yt,t.curveMonotoneX=G,t.curveMonotoneY=J,t.curveNatural=sn,t.curveStep=hn,t.curveStepAfter=$,t.curveStepBefore=Z,t.stack=rn,t.stackOffsetExpand=an,t.stackOffsetDiverging=cn,t.stackOffsetNone=on,t.stackOffsetSilhouette=ln,t.stackOffsetWiggle=un,t.stackOrderAscending=fn,t.stackOrderDescending=xn,t.stackOrderInsideOut=yn,t.stackOrderNone=_n,t.stackOrderReverse=pn,Object.defineProperty(t,"__esModule",{value:!0})});
// https://github.com/d3/d3-sankey v0.12.1 Copyright 2019 Mike Bostock
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-shape')) :
typeof define === 'function' && define.amd ? define('d3-sankey',['exports', 'd3-array', 'd3-shape'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3));
}(this, function (exports, d3Array, d3Shape) { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function targetDepth(d) {
  return d.target.depth;
}

function left(node) {
  return node.depth;
}
function right(node, n) {
  return n - 1 - node.height;
}
function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}
function center(node) {
  return node.targetLinks.length ? node.depth : node.sourceLinks.length ? d3Array.min(node.sourceLinks, targetDepth) - 1 : 0;
}

function constant(x) {
  return function () {
    return x;
  };
}

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function defaultId(d) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  var node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}

function computeLinkBreadths(_ref) {
  var nodes = _ref.nodes;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;
      var y0 = node.y0;
      var y1 = y0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = node.sourceLinks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var link = _step2.value;
          link.y0 = y0 + link.width / 2;
          y0 += link.width;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = node.targetLinks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _link = _step3.value;
          _link.y1 = y1 + _link.width / 2;
          y1 += _link.width;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function Sankey() {
  var x0 = 0,
      y0 = 0,
      x1 = 1,
      y1 = 1; // extent

  var dx = 24; // nodeWidth

  var py = 8; // nodePadding

  var id = defaultId;
  var align = justify;
  var sort;
  var linkSort;
  var nodes = defaultNodes;
  var links = defaultLinks;
  var iterations = 6;

  function sankey() {
    var graph = {
      nodes: nodes.apply(null, arguments),
      links: links.apply(null, arguments)
    };
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeHeights(graph);
    computeNodeBreadths(graph);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function (graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function (_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant(_), sankey) : id;
  };

  sankey.nodeAlign = function (_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant(_), sankey) : align;
  };

  sankey.nodeSort = function (_) {
    return arguments.length ? (sort = _, sankey) : sort;
  };

  sankey.nodeWidth = function (_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };

  sankey.nodePadding = function (_) {
    return arguments.length ? (py = +_, sankey) : py;
  };

  sankey.nodes = function (_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant(_), sankey) : nodes;
  };

  sankey.links = function (_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant(_), sankey) : links;
  };

  sankey.linkSort = function (_) {
    return arguments.length ? (linkSort = _, sankey) : linkSort;
  };

  sankey.size = function (_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function (_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function (_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };

  function computeNodeLinks(_ref2) {
    var nodes = _ref2.nodes,
        links = _ref2.links;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = nodes.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _step4$value = _slicedToArray(_step4.value, 2),
            i = _step4$value[0],
            node = _step4$value[1];

        node.index = i;
        node.sourceLinks = [];
        node.targetLinks = [];
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    var nodeById = new Map(nodes.map(function (d, i) {
      return [id(d, i, nodes), d];
    }));
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = links.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _step5$value = _slicedToArray(_step5.value, 2),
            i = _step5$value[0],
            link = _step5$value[1];

        link.index = i;
        var source = link.source,
            target = link.target;
        if (_typeof(source) !== "object") source = link.source = find(nodeById, source);
        if (_typeof(target) !== "object") target = link.target = find(nodeById, target);
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  } // Compute the value (size) of each node by summing the associated links.


  function computeNodeValues(_ref3) {
    var nodes = _ref3.nodes;
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = nodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var node = _step6.value;
        node.value = node.fixedValue === undefined ? Math.max(d3Array.sum(node.sourceLinks, value), d3Array.sum(node.targetLinks, value)) : node.fixedValue;
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
          _iterator6["return"]();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }
  }

  function computeNodeDepths(_ref4) {
    var nodes = _ref4.nodes;
    var n = nodes.length;
    var current = new Set(nodes);
    var next = new Set();
    var x = 0;

    while (current.size) {
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = current[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var node = _step7.value;
          node.depth = x;
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = node.sourceLinks[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var target = _step8.value.target;
              next.add(target);
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
                _iterator8["return"]();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      if (++x > n) throw new Error("circular link");
      current = next;
      next = new Set();
    }
  }

  function computeNodeHeights(_ref5) {
    var nodes = _ref5.nodes;
    var n = nodes.length;
    var current = new Set(nodes);
    var next = new Set();
    var x = 0;

    while (current.size) {
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = current[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var node = _step9.value;
          node.height = x;
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = node.targetLinks[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var source = _step10.value.source;
              next.add(source);
            }
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                _iterator10["return"]();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      if (++x > n) throw new Error("circular link");
      current = next;
      next = new Set();
    }
  }

  function computeNodeLayers(_ref6) {
    var nodes = _ref6.nodes;
    var x = d3Array.max(nodes, function (d) {
      return d.depth;
    }) + 1;
    var kx = (x1 - x0 - dx) / (x - 1);
    var columns = new Array(x);
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
      for (var _iterator11 = nodes[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
        var node = _step11.value;
        var i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
        node.layer = i;
        node.x0 = x0 + i * kx;
        node.x1 = node.x0 + dx;
        if (columns[i]) columns[i].push(node);else columns[i] = [node];
      }
    } catch (err) {
      _didIteratorError11 = true;
      _iteratorError11 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
          _iterator11["return"]();
        }
      } finally {
        if (_didIteratorError11) {
          throw _iteratorError11;
        }
      }
    }

    if (sort) {
      for (var _i = 0, _columns = columns; _i < _columns.length; _i++) {
        var column = _columns[_i];
        column.sort(sort);
      }
    }

    return columns;
  }

  function initializeNodeBreadths(columns) {
    var ky = d3Array.min(columns, function (c) {
      return (y1 - y0 - (c.length - 1) * py) / d3Array.sum(c, value);
    });
    var _iteratorNormalCompletion12 = true;
    var _didIteratorError12 = false;
    var _iteratorError12 = undefined;

    try {
      for (var _iterator12 = columns[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
        var _nodes = _step12.value;
        var y = y0;
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = _nodes[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var _node = _step13.value;
            _node.y0 = y;
            _node.y1 = y + _node.value * ky;
            y = _node.y1 + py;
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
              for (var _iterator14 = _node.sourceLinks[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var link = _step14.value;
                link.width = link.value * ky;
              }
            } catch (err) {
              _didIteratorError14 = true;
              _iteratorError14 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion14 && _iterator14["return"] != null) {
                  _iterator14["return"]();
                }
              } finally {
                if (_didIteratorError14) {
                  throw _iteratorError14;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
              _iterator13["return"]();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }

        y = (y1 - y + py) / (_nodes.length + 1);

        for (var i = 0; i < _nodes.length; ++i) {
          var node = _nodes[i];
          node.y0 += y * (i + 1);
          node.y1 += y * (i + 1);
        }

        reorderLinks(_nodes);
      }
    } catch (err) {
      _didIteratorError12 = true;
      _iteratorError12 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
          _iterator12["return"]();
        }
      } finally {
        if (_didIteratorError12) {
          throw _iteratorError12;
        }
      }
    }
  }

  function computeNodeBreadths(graph) {
    var columns = computeNodeLayers(graph);
    initializeNodeBreadths(columns);

    for (var i = 0; i < iterations; ++i) {
      var alpha = Math.pow(0.99, i);
      var beta = Math.max(1 - alpha, (i + 1) / iterations);
      relaxRightToLeft(columns, alpha, beta);
      relaxLeftToRight(columns, alpha, beta);
    }
  } // Reposition each node based on its incoming (target) links.


  function relaxLeftToRight(columns, alpha, beta) {
    for (var i = 1, n = columns.length; i < n; ++i) {
      var column = columns[i];
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = column[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var target = _step15.value;
          var y = 0;
          var w = 0;
          var _iteratorNormalCompletion16 = true;
          var _didIteratorError16 = false;
          var _iteratorError16 = undefined;

          try {
            for (var _iterator16 = target.targetLinks[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
              var _step16$value = _step16.value,
                  source = _step16$value.source,
                  _value = _step16$value.value;
              var v = _value * (target.layer - source.layer);
              y += targetTop(source, target) * v;
              w += v;
            }
          } catch (err) {
            _didIteratorError16 = true;
            _iteratorError16 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion16 && _iterator16["return"] != null) {
                _iterator16["return"]();
              }
            } finally {
              if (_didIteratorError16) {
                throw _iteratorError16;
              }
            }
          }

          if (!(w > 0)) continue;
          var dy = (y / w - target.y0) * alpha;
          target.y0 += dy;
          target.y1 += dy;
          reorderNodeLinks(target);
        }
      } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion15 && _iterator15["return"] != null) {
            _iterator15["return"]();
          }
        } finally {
          if (_didIteratorError15) {
            throw _iteratorError15;
          }
        }
      }

      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  } // Reposition each node based on its outgoing (source) links.


  function relaxRightToLeft(columns, alpha, beta) {
    for (var n = columns.length, i = n - 2; i >= 0; --i) {
      var column = columns[i];
      var _iteratorNormalCompletion17 = true;
      var _didIteratorError17 = false;
      var _iteratorError17 = undefined;

      try {
        for (var _iterator17 = column[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
          var source = _step17.value;
          var y = 0;
          var w = 0;
          var _iteratorNormalCompletion18 = true;
          var _didIteratorError18 = false;
          var _iteratorError18 = undefined;

          try {
            for (var _iterator18 = source.sourceLinks[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
              var _step18$value = _step18.value,
                  target = _step18$value.target,
                  _value2 = _step18$value.value;
              var v = _value2 * (target.layer - source.layer);
              y += sourceTop(source, target) * v;
              w += v;
            }
          } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion18 && _iterator18["return"] != null) {
                _iterator18["return"]();
              }
            } finally {
              if (_didIteratorError18) {
                throw _iteratorError18;
              }
            }
          }

          if (!(w > 0)) continue;
          var dy = (y / w - source.y0) * alpha;
          source.y0 += dy;
          source.y1 += dy;
          reorderNodeLinks(source);
        }
      } catch (err) {
        _didIteratorError17 = true;
        _iteratorError17 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion17 && _iterator17["return"] != null) {
            _iterator17["return"]();
          }
        } finally {
          if (_didIteratorError17) {
            throw _iteratorError17;
          }
        }
      }

      if (sort === undefined) column.sort(ascendingBreadth);
      resolveCollisions(column, beta);
    }
  }

  function resolveCollisions(nodes, alpha) {
    var i = nodes.length >> 1;
    var subject = nodes[i];
    resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
    resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
    resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
    resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
  } // Push any overlapping nodes down.


  function resolveCollisionsTopToBottom(nodes, y, i, alpha) {
    for (; i < nodes.length; ++i) {
      var node = nodes[i];
      var dy = (y - node.y0) * alpha;
      if (dy > 1e-6) node.y0 += dy, node.y1 += dy;
      y = node.y1 + py;
    }
  } // Push any overlapping nodes up.


  function resolveCollisionsBottomToTop(nodes, y, i, alpha) {
    for (; i >= 0; --i) {
      var node = nodes[i];
      var dy = (node.y1 - y) * alpha;
      if (dy > 1e-6) node.y0 -= dy, node.y1 -= dy;
      y = node.y0 - py;
    }
  }

  function reorderNodeLinks(_ref7) {
    var sourceLinks = _ref7.sourceLinks,
        targetLinks = _ref7.targetLinks;

    if (linkSort === undefined) {
      var _iteratorNormalCompletion19 = true;
      var _didIteratorError19 = false;
      var _iteratorError19 = undefined;

      try {
        for (var _iterator19 = targetLinks[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
          var _sourceLinks = _step19.value.source.sourceLinks;

          _sourceLinks.sort(ascendingTargetBreadth);
        }
      } catch (err) {
        _didIteratorError19 = true;
        _iteratorError19 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion19 && _iterator19["return"] != null) {
            _iterator19["return"]();
          }
        } finally {
          if (_didIteratorError19) {
            throw _iteratorError19;
          }
        }
      }

      var _iteratorNormalCompletion20 = true;
      var _didIteratorError20 = false;
      var _iteratorError20 = undefined;

      try {
        for (var _iterator20 = sourceLinks[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
          var _targetLinks = _step20.value.target.targetLinks;

          _targetLinks.sort(ascendingSourceBreadth);
        }
      } catch (err) {
        _didIteratorError20 = true;
        _iteratorError20 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion20 && _iterator20["return"] != null) {
            _iterator20["return"]();
          }
        } finally {
          if (_didIteratorError20) {
            throw _iteratorError20;
          }
        }
      }
    }
  }

  function reorderLinks(nodes) {
    if (linkSort === undefined) {
      var _iteratorNormalCompletion21 = true;
      var _didIteratorError21 = false;
      var _iteratorError21 = undefined;

      try {
        for (var _iterator21 = nodes[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
          var _step21$value = _step21.value,
              sourceLinks = _step21$value.sourceLinks,
              targetLinks = _step21$value.targetLinks;
          sourceLinks.sort(ascendingTargetBreadth);
          targetLinks.sort(ascendingSourceBreadth);
        }
      } catch (err) {
        _didIteratorError21 = true;
        _iteratorError21 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion21 && _iterator21["return"] != null) {
            _iterator21["return"]();
          }
        } finally {
          if (_didIteratorError21) {
            throw _iteratorError21;
          }
        }
      }
    }
  } // Returns the target.y0 that would produce an ideal link from source to target.


  function targetTop(source, target) {
    var y = source.y0 - (source.sourceLinks.length - 1) * py / 2;
    var _iteratorNormalCompletion22 = true;
    var _didIteratorError22 = false;
    var _iteratorError22 = undefined;

    try {
      for (var _iterator22 = source.sourceLinks[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
        var _step22$value = _step22.value,
            node = _step22$value.target,
            width = _step22$value.width;
        if (node === target) break;
        y += width + py;
      }
    } catch (err) {
      _didIteratorError22 = true;
      _iteratorError22 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion22 && _iterator22["return"] != null) {
          _iterator22["return"]();
        }
      } finally {
        if (_didIteratorError22) {
          throw _iteratorError22;
        }
      }
    }

    var _iteratorNormalCompletion23 = true;
    var _didIteratorError23 = false;
    var _iteratorError23 = undefined;

    try {
      for (var _iterator23 = target.targetLinks[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
        var _step23$value = _step23.value,
            node = _step23$value.source,
            width = _step23$value.width;
        if (node === source) break;
        y -= width;
      }
    } catch (err) {
      _didIteratorError23 = true;
      _iteratorError23 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion23 && _iterator23["return"] != null) {
          _iterator23["return"]();
        }
      } finally {
        if (_didIteratorError23) {
          throw _iteratorError23;
        }
      }
    }

    return y;
  } // Returns the source.y0 that would produce an ideal link from source to target.


  function sourceTop(source, target) {
    var y = target.y0 - (target.targetLinks.length - 1) * py / 2;
    var _iteratorNormalCompletion24 = true;
    var _didIteratorError24 = false;
    var _iteratorError24 = undefined;

    try {
      for (var _iterator24 = target.targetLinks[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
        var _step24$value = _step24.value,
            node = _step24$value.source,
            width = _step24$value.width;
        if (node === source) break;
        y += width + py;
      }
    } catch (err) {
      _didIteratorError24 = true;
      _iteratorError24 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion24 && _iterator24["return"] != null) {
          _iterator24["return"]();
        }
      } finally {
        if (_didIteratorError24) {
          throw _iteratorError24;
        }
      }
    }

    var _iteratorNormalCompletion25 = true;
    var _didIteratorError25 = false;
    var _iteratorError25 = undefined;

    try {
      for (var _iterator25 = source.sourceLinks[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
        var _step25$value = _step25.value,
            node = _step25$value.target,
            width = _step25$value.width;
        if (node === target) break;
        y -= width;
      }
    } catch (err) {
      _didIteratorError25 = true;
      _iteratorError25 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion25 && _iterator25["return"] != null) {
          _iterator25["return"]();
        }
      } finally {
        if (_didIteratorError25) {
          throw _iteratorError25;
        }
      }
    }

    return y;
  }

  return sankey;
}

function horizontalSource(d) {
  return [d.source.x1, d.y0];
}

function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}

function sankeyLinkHorizontal () {
  return d3Shape.linkHorizontal().source(horizontalSource).target(horizontalTarget);
}

exports.sankey = Sankey;
exports.sankeyCenter = center;
exports.sankeyJustify = justify;
exports.sankeyLeft = left;
exports.sankeyLinkHorizontal = sankeyLinkHorizontal;
exports.sankeyRight = right;

Object.defineProperty(exports, '__esModule', { value: true });

}));

/*
  ## Sankey Diagram Integrated with Banana.
*/
define('panels/sankey/module',[
    'angular',
    'app',
    'underscore',
    'jquery',
    'kbn',
    'd3',
    'd3-sankey'
  ],
  function (angular, app, _, $, kbn, d3, d3sankey) {
    'use strict';

    var module = angular.module('kibana.panels.sankey', []);
    app.useModule(module);

    module.controller('sankey', function ($scope, querySrv, dashboard, filterSrv) {
      $scope.panelMeta = {
        modals: [{
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        }],
        editorTabs: [{
          title: 'Queries',
          src: 'app/partials/querySelect.html'
        }],
        status: "Experimental",
        description: "Display a Sankey diagram."
      };

      // default values
      var _d = {
        queries: {
          mode: 'all',
          ids: [],
          query: '*:*',
          custom: ''
        },
        facet_limit: 1000, // maximum number of rows returned from Solr
        spyable: true,
        show_queries: true,
      };

      _.defaults($scope.panel, _d);
      var DEBUG = false;

      $scope.init = function () {
        $scope.$on('refresh', function () {
          $scope.get_data();

        });
        $scope.get_data();
      };

      $scope.parse_facet_pivot = function (data) {
        var nodes = {};
        var links = [];
        var count = 0;

        var addNode = function(key, fcount, category) {
          var k = category + "-" + key;
          var existing = nodes[k];
          if (!!existing) {
            return existing.node;
          }

          var id = count++;
          nodes[k] = {
            node: id,
            name: key,
            category: category
          };

          return id;
        };

        var processNodes = function(parent, parentCount, data, category) {
          for (var ob in data) {
            var id1 = addNode(data[ob].value, data[ob].count, category + 1);

            if (parent !== null) {
              links.push({
                source: parent,
                target: id1,
                value: data[ob].count,
                key: parent + "-" + id1
              });
            }

            processNodes(id1, data[ob].count, data[ob].pivot, category + 1);
          }
        };

        processNodes(null, 0, data, 0);

        return {
          nodes: _.map(_.keys(nodes), function(key) {
            return nodes[key];
          }),
          links: links
        };
      };

      $scope.parse_item = function (doc) {
        var t = {'name': doc.value, 'size': doc.count, 'children': []};
        for (var piv in doc.pivot) {
          t.children.push($scope.parse_item(doc.pivot[piv]));
        }
        return t;
      };

      $scope.get_data = function () {
        // Show progress by displaying a spinning wheel icon on panel
        $scope.panelMeta.loading = true;
        delete $scope.panel.error;

        var request, results;
        // Set Solr server
        $scope.sjs.client.server(dashboard.current.solr.server + dashboard.current.solr.core_name);
        // -------------------- TODO: REMOVE ALL ELASTIC SEARCH AFTER FIXING SOLRJS --------------
        $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);
        // This could probably be changed to a BoolFilter
        var boolQuery = $scope.sjs.BoolQuery();
        _.each($scope.panel.queries.ids, function (id) {
          boolQuery = boolQuery.should(querySrv.getEjsObj(id));
        });
        request = $scope.sjs.Request().indices(dashboard.indices);
        request = request.query(
          $scope.sjs.FilteredQuery(
            boolQuery,
            filterSrv.getBoolFilter(filterSrv.ids)
          )); // Set the size of query result
        $scope.populate_modal(request);
        // --------------------- END OF ELASTIC SEARCH PART ---------------------------------------

        // Construct Solr query
        var fq = '';
        if (filterSrv.getSolrFq()) {
          fq = '&' + filterSrv.getSolrFq();
        }
        var wt_json = '&wt=json';
        var rows = '&rows=0';
        var facet = '&facet=true';
        var facet_pivot = '&facet.pivot=' + $scope.panel.facet_pivot_strings.join().replace(/ /g, '');
        var facet_limits = '&facet.limit=' + $scope.panel.facet_limit;
        $scope.panel.queries.query = querySrv.getORquery() + fq + wt_json + facet + facet_pivot + facet_limits + rows;
        if (DEBUG) {
          console.log($scope.panel.queries.query);
        }
        // Set the additional custom query
        if ($scope.panel.queries.custom != null) {
          request = request.setQuery($scope.panel.queries.query + $scope.panel.queries.custom);
        } else {
          request = request.setQuery($scope.panel.queries.query);
        }

        // Execute the search and get results
        results = request.doSearch();
        results.then(function (results) {
          $scope.data = $scope.parse_facet_pivot(results.facet_counts.facet_pivot[$scope.panel.facet_pivot_strings.join().replace(/ /g, '')]);
          $scope.render();
        });


      };

      $scope.dash = dashboard;
      $scope.set_refresh = function (state) {
        $scope.refresh = state;
      };

      $scope.close_edit = function () {
        if ($scope.refresh) {
          $scope.get_data();
        }
        $scope.refresh = false;
        $scope.$emit('render');
      };

      $scope.render = function () {
        $scope.$emit('render');
      };

      $scope.populate_modal = function (request) {
        $scope.inspector = angular.toJson(JSON.parse(request.toString()), true);
      };

      $scope.pad = function (n) {
        return (n < 10 ? '0' : '') + n;
      };

      $scope.set_filters = function (d) {
        if (DEBUG) {
          console.log("Setting Filters to " + d);
        }
        for (var i = 0; i < d.length; i++) {
          filterSrv.set({
            type: 'terms',
            field: $scope.panel.facet_pivot_strings[i].replace(/ /g, ''),
            mandate: 'must',
            value: d[i]
          });
          console.log($scope.panel.facet_pivot_strings[i].replace(/ /g, '') + ' - ' + d[i]);

        }

        dashboard.refresh();
      };

    });

    module.directive('sankeyChart', function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          // Receive render events
          scope.$on('render', function () {
            render_panel();
          });

          // Re-render if the window is resized
          angular.element(window).bind('resize', function () {
            render_panel();
          });

          // Function for rendering panel
          function render_panel() {
            element.html("");

            var width = element.parent().width();
            var height = parseInt(scope.row.height);

             var margin = {top: 20, right: 20, bottom: 20, left: 20};
              width = width - margin.left - margin.right;
              height = height - margin.top - margin.bottom;


            var svg = d3.select(element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

            var sankey = d3sankey.sankey().nodeWidth(15).nodePadding(10).extent([[1, 1], [width - 1, height - 5]])(scope.data);
            var nodes = sankey.nodes;
            var links = sankey.links;

            var format = function (d) {
              var f = d3.format(",.0f");
              return f(d) + "";
            };
            var color = d3.scale.category10();

            var node = svg.append("g").attr("stroke-width", 0).selectAll("rect").data(nodes).enter().append("rect").attr("x", function (d) {
              return d.x0;
            }).attr("y", function (d) {
              return d.y0;
            }).attr("height", function (d) {
              return d.y1 - d.y0;
            }).attr("width", function (d) {
              return d.x1 - d.x0;
            }).attr("fill", function (d) {
              return color(d.category);
            });

            node.append("title").text(function (d) {
              return d.name + "\n" + format(d.value);
            });

            var labels = svg.append("g").style("font", "10px sans-serif").selectAll("text").data(nodes).enter().append("text").attr("x", function (d) {
              return d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6;
            }).attr("y", function (d) {
              return (d.y1 + d.y0) / 2;
            }).attr("dy", "0.35em").attr("text-anchor", function (d) {
              return d.x0 < width / 2 ? "start" : "end";
            }).text(function (d) {
              return d.name;
            });

            var link = svg.append("g")
              .attr("fill", "none")
              .attr("stroke-opacity", 0.5)
              .selectAll("g")
              .data(links)
              .enter()
              .append("g")
              .style("mix-blend-mode", "multiply");

            link.append("path").attr("d", d3sankey.sankeyLinkHorizontal())
              .attr("fill", "none")
              .attr("stroke", "#777777")
              .attr("stroke-opacity", "0.2")
              .attr("stroke-width", function (d) {
              return Math.max(1, d.width);
            });

            link.append("title").text(function (d) {
              return d.source.name + " \u2192 " + d.target.name + ", " + d.value;
            });

            var hoverLinksNodes = function(ns, ls, on) {
              node.each(function(n) {
                if (!_.contains(ns, n.node)) {
                  d3.select(this).attr("opacity", on ? 0.3 : 1);
                }
              });
              labels.each(function(n) {
                if (!_.contains(ns, n.node)) {
                  d3.select(this).attr("opacity", on ? 0.3 : 1);
                }
              });
              link.each(function(ll) {
                if (!_.contains(ls, ll.key)) {
                  d3.select(this).attr("opacity", on ? 0.3 : 1);
                }
              });
            };

            var hoverLink = function(l, on) {
              hoverLinksNodes([l.source.node, l.target.node], [l.key], on);
            };

            link.on("mouseover", function(d) {
              hoverLink(d, true);
            }).on("mouseout", function(d) {
              hoverLink(d, false);
            });

            var hoverNode = function(n, on) {
              var nlist = [n.node];
              var llist = [];
              var parseOut = function(ns) {
                _.each(ns, function(nn) {
                  nlist.push(nn.source.node);
                  llist.push(nn.key);
                });
              };
              var parseIn = function(ns) {
                _.each(ns, function(nn) {
                  nlist.push(nn.target.node);
                  llist.push(nn.key);
                  parseIn(nn.target.sourceLinks);
                });
              };
              _.each(nodes, function(nn) {
                if (n.node === nn.node) {
                  parseOut(n.targetLinks);
                  parseIn(n.sourceLinks);
                }
              });
              hoverLinksNodes(nlist, llist, on);
            };

            node.on("mouseover", function(d) {
              hoverNode(d, true);
            }).on("mouseout", function(d) {
              hoverNode(d, false);
            });

            scope.panelMeta.loading = false;
          }
        }
      };
    });
  });

