var Dispatcher=require("flux").Dispatcher;
var ReactDOM=require("react-dom");
var dispatcher=new Dispatcher();

var stagedEditors=[];

// manage editing session
function updateEditSessions() {
   stagedEditors=stagedEditors.filter(function(editor){

      var keep=true;

      if(editor.isMounted()) {
         if(!editor.hasFocus()) {
            editor.endEditSession();
         }

         keep=editor.isEditing();
      }
      else {
         keep=false;
      }

      return keep;
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
