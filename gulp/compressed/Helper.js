var Helper={firstLetterUpperCase:function(r){return r.substring(0,1).toUpperCase()+r.substring(1)},onlyFirstLetterUpperCase:function(r){return r.substring(0,1).toUpperCase()+r.substring(1).toLowerCase()},sanitize:function(r){var t,e,n=[],i=r.length;for(t=0;i>t;t++)e=parseFloat(r[t]),n[t]=isNaN(e)?0:Math.abs(e);return n},trace:function(r){var t,e=0,n=r.length;for(t=0;n>t;t++)e+=r[t];return e},normalize:function(r){var t,e=this.trace(r),n=r.length,i=[],o=r.every(function(r){return 0===r});if(o&&(r=r.map(function(){return 1}),e=n),0===e)i=r;else for(t=0;n>t;t++)i[t]=r[t]/e;return i},splitWeighted:function(r,t){var e,n=this.normalize(this.sanitize(t)),i=[],o=n.length;for(e=0;o>e;e++)i[e]=r*n[e];return i},roundUp:function(r){return r.map(function(r){return Math.round(r)})},columnWidths:function(r,t){return this.roundUp(this.splitWeighted(r,t))},columnWidths2:function(r,t){var e=this.columnWidths(r,t),n=e.reduce(function(r,t){return r+t}),i=r-n,o=t.length;return 0!==i&&o>0&&(e[o-1]+=i),e},dropProtocol:function(r){var t="://",e="^[^"+t+"]+"+t,n=new RegExp(e,"gi");return r.replace(n,"")},fileExt:function(r){var t=".";return-1!==r.indexOf(t)?r.split(t).pop():""},validateWidth:function(r){"use strict";var t,e=!1,n={integer:["px","pt"],others:["em","%"]},i=parseFloat(r);return isNaN(i)?!1:(t=r.replace(i.toString(),"").trim(),-1!==n.integer.indexOf(t)&&(e=Math.floor(i).toString()+t),-1!==n.others.indexOf(t)&&(e=i.toString()+t),e)},specialChar:function(r){var t,e,n,i,o=typeof r,a="";if("function"===o||"object"===o)return null;if("number"===o)return r;for(t=r.length,e=0;t>e;e++)n=r.charCodeAt(e),i=n>31&&126>n?r[e]:"&#"+n+";",a+=i;return a},crack:function(r,t){var e,n,i,o,a,u,s,c=[],f=r.length;for(s=0;f>s;s++)c[s]=r[s];return 0===t&&(e=c[0],n=parseInt(e/2,10),i=e-n,u=0),t>0&&t<r.length&&(e=c[t],n=parseInt(2*e/3,10),i=e-n,o=r[t-1],a=parseInt(2*o/3,10),u=o-a,c[t-1]=a),c[t]=n,c.splice(t,0,i+u),c},sandwichWith:function(r,t,e){var n,i;return"string"==typeof t||"string"==typeof r?(i=e||r,n=t.trim(),n?r+n+i:""):void 0},concatDropSpaces:function(r,t){return void 0===t&&(t=" "),r.join(t).replace(/\s+/g," ").trim()},generateId:function(r,t){var e,n=new DOMParser,i=n.parseFromString(r,"text/html"),o="0123456789abcdefghijklmnopqrstuvwxyz",a=o.length;for(e=t||o.substr(Math.floor(Math.random()*(a+1)),1)+o.substr(Math.floor(Math.random()*(a+1)),1);i.getElementById(e);)e+=o.substr(Math.floor(Math.random()*(a+1)),1);return e},pushBeforeLast:function(r,t){if(void 0!==t)if(0===r.length)r.push(t);else{var e=r.pop();r.push(t),r.push(e)}},isSemanticallyValid:function(r){var t=new DOMParser,e=Helper.generateId(r,"fakeId"),n=t.parseFromString('<div id="'+e+'">'+r+"</div>","text/html"),i=n.getElementById(e);return i.innerHTML===r.trim()},cssOfSelector:function(r,t){var e=r+"\\s*\\{([^{}]+?)\\}",n=new RegExp(e,"gi"),i=t.match(n);if(!i)return"";var o=new Properties;return o.setMode(1),n=new RegExp(e,"i"),i.forEach(function(r){var t=r.match(n);t&&t[1]&&o.appendProperty(t[1])}),o.toString()},gcd:function(r,t){if("number"!=typeof t||"number"!=typeof r)throw new Error("Arguments must be numbers!");if(!this.isInteger(r)||!this.isInteger(t))return 1;if(0===r)return 0===t?1:t;if(0===t)return r;var e=Math.abs(r),n=Math.abs(t);if(n>e){var i=n;n=e,e=i}return this.gcd(n,e%n)},isInteger:function(r){return r===parseInt(r,10)},gcdList:function(r){if(!Array.isArray(r))throw new Error("Array is expected.");var t=r.map(function(r){return 0>r?-r:r}),e=t.length;if(1===e)return this.isInteger(t[0])&&t[0]>0?t[0]:1;if(2===e)return Helper.gcd(t[0],t[1]);if(e>2){var n=t.pop(),i=t.pop();return t.push(Helper.gcd(n,i)),Helper.gcdList(t)}},divideByGcd:function(r){var t;try{t=Helper.gcdList(r)}catch(e){return void console.log("There was an error "+e.message+" when finding gcd for ",r)}return 0===t?r:r.map(function(r){return r/t})}};Array.prototype.concatDropSpaces=function(r){return Helper.concatDropSpaces(this,r)};