function Unit(e,t){"use strict";var r,n;if(!(this instanceof Unit))return new Unit(e,t);var i,s;!function(e,t){if(e instanceof Unit)return s=e.getMeasure(),void(i=e.getValue());if(e||(i=0),"string"!=typeof t&&void 0!==t)throw new Error("The unit of measurement must be a string!");switch(t&&""!==t.trim()&&(s=t.trim()),typeof e){case"number":i=e;break;case"string":if(r=""===e?0:parseFloat(e),isNaN(r))throw new Error("Can not convert "+e+" into a Unit object!");n=e.replace(r.toString(),"").trim(),i=r,void 0===s&&""!==n&&(s=n)}}(e,t),this.getValue=function(){return i},this.getValueAsString=function(){var e=this.getValue();return void 0!==e?e.toString():""},this.setValue=function(e){if("number"!=typeof e)throw new Error("Value attribute of Unit instance must be a number!");i=e},this.getMeasure=function(){return s},this.setMeasure=function(e){if("string"!=typeof e||""===e.trim())throw new Error("Measure attribute of Unit instance must be a non-empty string!");s=e},this.clone=function(){return new Unit(this.getValue(),this.getMeasure())},this.isLikeAs=function(e){if(!(e instanceof Unit))try{e=new Unit(e)}catch(t){return!1}return this.getMeasure()===e.getMeasure()},this.isZero=function(){return 0===this.getValue()},this.add=function(e){if(!(e instanceof Unit))return this.add(new Unit(e));if(this.isLikeAs(e))return new Unit(this.getValue()+e.getValue(),this.getMeasure());if(this.isZero())return e.isZero()?new Unit(0):new Unit(e.getValue(),e.getMeasure());if(e.isZero())return new Unit(this.getValue(),this.getMeasure());throw new Error("These Unit instances can not be summed up!")},this.sub=function(e){var t=e instanceof Unit?e:new Unit(e),r=new Unit(-t.getValue(),t.getMeasure());return this.add(r)},this.times=function(e){if(void 0===e)throw new Error("Argument is missing!");if("number"!=typeof e)throw new Error("Argument must be a number!");return new Unit(e*this.getValue(),this.getMeasure())},this.toString=function(e){var t="",r=this.getValue();if("number"!=typeof r)return t;t+=r.toString();var n=this.getMeasure();return"string"==typeof n&&n.length>0&&(t+=(e||"")+n),t};var u=function(e,t,r){if("number"!=typeof e||"number"!=typeof t||0===t)throw new Error("Numerator must be a number, denumerator must be a non-zero number.");var n=e/t;if(void 0===r)return n;if(!this.isInteger(r)||0>r)throw new Error("Precision must be non-negative integer.");var i=Math.pow(10,r),s=parseInt(n*i,10)/i;return s}.bind(this);this.frac=function(e,t){if(void 0===e)throw new Error("Can not divide by nothing!");var r;try{r=e instanceof Unit?e:new Unit(e)}catch(n){throw new Error("Encountered error when converting argument into Unit instance: "+n)}var i=new Unit,s=r.getValue();if(0===s)throw new Error("Can not divide by zero!");if(!r.hasMeasure()&&this.hasMeasure())i.setMeasure(this.getMeasure());else if(this.getMeasure()!==r.getMeasure())throw new Error("Can not divide these objects!");return i.setValue(u(this.getValue(),s,t)),i},this.hasMeasure=function(){var e=this.getMeasure();return"string"==typeof e&&e.length>0},this.toPercent=function(){if(this.hasMeasure())throw new Error("Only dimensionless numbers can be representred as percents!");var e,t=this.getValue();if(this.isInteger(t))e=100*t;else{var r=t.toString()+"00",n=r.split(".");e=n[0]+n[1].substr(0,2)+"."+n[1].substr(2),e=parseFloat(e,10)}return new Unit(e,"%")},this.fromPercent=function(){if("%"!==this.getMeasure())throw new Error("The target must be in percentage form!");return new Unit(this.getValue()/100)},this.suggestMeasure=function(e){if(!this.hasMeasure())try{this.setMeasure(e)}catch(t){console.log("Suggested measure was not set. Reason: "+t.toString())}},this.floor=function(){return new Unit(Math.floor(this.getValue()),this.getMeasure())},this.isInteger=function(e){return parseInt(e,10)===e}}