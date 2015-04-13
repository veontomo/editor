function EditorAdapter(){var t="EditorAdapter";this.getName=function(){return t},this.setName=function(e){if("string"!=typeof e)throw new Error("The name must be a string!");t=e},this.getEditorContent=function(t){throw new Error('Method "getEditorContent" of class EditorAdapter must be overridden by inheriting class!')},this.setEditorContent=function(t,e){throw new Error('Method "setEditorContent" of class EditorAdapter must be overridden by inheriting class!')},this.toNativeRange=function(t){throw new Error('Method "toNativeRange" of class EditorAdapter must be overridden by inheriting class!')},this.getEditorRanges=function(t){throw new Error('Method "getEditorRanges" of class EditorAdapter must be overridden by inheriting class!')},this.getNativeRanges=function(t){var e;try{e=this.getEditorRanges(t)}catch(r){console.log("Error ("+r.name+") detected when retrieving editor ranges: "+r.message)}if(!Array.isArray(e))return null;var i=[];return e.forEach(function(t){try{var e=this.toNativeRange(t);i.push(e)}catch(r){console.log("Error ("+r.name+") detected when converting editor-specific range into native one: "+r.message)}}.bind(this)),i},this.fillInDialog=function(t,e,r){throw new Error('Method "fillInDialog" of class EditorAdapter must be overridden by inheriting class!')},this.getDialogData=function(t,e){throw new Error('Method "getDialogData" of class EditorAdapter must be overridden by inheriting class!')},this.getCursorPosition=function(t){throw new Error('Method "getCursorPosition" of class EditorAdapter must be overridden by inheriting class!')},this.setDialogInputField=function(t,e){throw new Error('Method "setDialogInputField" of class EditorAdapter must be overridden by inheriting class!')},this.setDialogHtmlField=function(t,e){throw new Error('Method "alert" of class EditorAdapter must be overridden by inheriting class!')},this.toNativeElement=function(t){throw new Error('Method "toNativeElement" of class EditorAdapter must be overridden by inheriting class!')},this.templateToDialog=function(t,e){throw new Error('Method "templateToDialog" of class EditorAdapter must be overridden by inheriting class!')},this.dialogToTemplate=function(t,e){throw new Error('Method "dialogToTemplate" of class EditorAdapter must be overridden by inheriting class!')},this.saveExtra=function(t,e){throw new Error('Method "saveExtra" of class EditorAdapter must be overridden by inheriting class!')},this.getExtra=function(t){throw new Error('Method "getExtra" of class EditorAdapter must be overridden by inheriting class!')},this.disableField=function(t,e){throw new Error('Method "disableField" of class EditorAdapter must be overridden by inheriting class!')},this.isFieldEnabled=function(t,e){throw new Error('Method "isFieldEnabled" of class EditorAdapter must be overridden by inheriting class!')},this.getFieldValue=function(t,e){throw new Error('Method "getFieldValue" of class EditorAdapter must be overridden by inheriting class!')}}