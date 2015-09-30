var React=require("react");
var JSONPointer=require("json-pointer");

var ValueView=require("./value-view.js");

var SchemaRelationshipRow=React.createClass({

   getDefaultProps: function(){

      return {
         "value" : undefined,
         "editing" : false,
         "titlePointer" : null,
         "subtitlePointer" : null,
         "onClick" : function(){}
      };
   },

   render: function(){

      var editing=this.props.editing;
      var editingIndicatorIcon=(editing ? <i className="ion-edit"></i> : null);
      var editingIndicatorCol=(
         <div className="col-xs-1 placeholder-text-color">{editingIndicatorIcon}</div>
      );

      var className="row list-view-item";
      editing && (className+=" interactive");
      var name=this.props.title || this.props.schema.title || this.props.schema.name;

      var rows;
      var titlePointer=this.props.titlePointer;
      var subtitlePointer=this.props.subtitlePointer;

      console.assert(titlePointer, "ToManyRelationshipRow should have prop *titlePointer*");
      console.assert(subtitlePointer, "ToManyRelationshipRow should have prop *subtitlePointer*");

      if(this.props.value.length!==0)
      {
         var title;
         var subtitle;

         rows=this.props.value.map(function(o, i){

            try
            {
               title=JSONPointer.evaluate(titlePointer, o, {delimiter:"."});
               subtitle=JSONPointer.evaluate(subtitlePointer, o, {delimiter:"."});
            }
            catch(e){}

            return (
               <div className="row" key={i}>
                  <div className="col-xs-4 primary">{title}</div>
                  <div className="col-xs-8 subtitle">{subtitle}</div>
               </div>

            );
         });
      }
      else
      {
         var placeholder=this.props.placeholder || ("None");

         rows=(
            <div className="row">
               <div className="col-xs-4 primary">{name}</div>
               <div className="col-xs-8 subtitle">{placeholder}</div>
            </div>
         );
      }



      return (
         <div className={className} onClick={this.wantsEdit}>
            <div className="col-xs-11">
               {rows}
            </div>
            {editingIndicatorCol}
         </div>
      );
   },

   wantsEdit: function(e){

      if(this.props.editing)
      {
         this.props.onClick(this.props.property, e);
      }
   }
});

module.exports=SchemaRelationshipRow;
