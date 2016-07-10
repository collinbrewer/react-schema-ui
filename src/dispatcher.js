var Dispatcher=require("flux").Dispatcher;
var ReactDOM=require("react-dom");
var dispatcher=new Dispatcher();

var stagedEditors=[];

// manage editing session
function updateEditSessions() {
   stagedEditors=stagedEditors.filter(function(editor){

      if(!editor.hasFocus()) {
         editor.endEditSession();
      }

      return editor.isEditing();
   });
}

// poll for changes in focus
setInterval(updateEditSessions, 250);


dispatcher.register(function(payload){
   if(payload.actionType==="beginEditSession") {

      updateEditSessions();

      stagedEditors.push(payload.editor);
   }
});

module.exports=dispatcher;
