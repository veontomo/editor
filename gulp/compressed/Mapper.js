function Mapper(){"use strict";if(!(this instanceof Mapper))return new Mapper;var t=[],i=null;this.setDefaultTarget=function(t){"function"==typeof t&&(i=t)},this.getDefaultTarget=function(){return i},this.add=function(i,n){var e,r={};return void 0!==i&&(r.criterion=i),void 0!==n&&(r.target=n),e=this.isValidMapping(r),e&&t.push(r),e},this.getMappings=function(){return t.slice(0)},this.isValidMapping=function(t){return void 0!==t&&"function"==typeof t.criterion&&"function"==typeof t.target},this.flush=function(){t=[]},this.findTargetFor=function(t,i){var n,e,r=this.getMappings(),u=r.length,a=0;for(a=0;u>a;a++)if(n=r[a],e=n.criterion(t))return n.target;return i?void 0:this.getDefaultTarget()}}