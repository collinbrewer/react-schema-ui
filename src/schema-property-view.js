var React=require("react");
var SchemaAttributeView=require("./schema-attribute-view.js");
var SchemaRelationshipView=require("./schema-relationship-view.js");
var JSONPointer=require("json-pointer");
var ValueView=require("./value-view.js");

function camelCaseToTitleCase(camelCase){

   if (camelCase == null || camelCase == "")
   {
      return camelCase;
   }

   camelCase = camelCase.trim();

   var newText = "";

   for (var i = 0; i < camelCase.length; i++)
   {
      if (/[A-Z]/.test(camelCase[i]) && i != 0 && /[a-z]/.test(camelCase[i-1]))
      {
         newText += " ";
      }

      if (i == 0 && /[a-z]/.test(camelCase[i]))
      {
        newText += camelCase[i].toUpperCase();
      }
      else
      {
        newText += camelCase[i];
      }
   }

   return newText;
}

var SchemaPropertyView=React.createClass({

   getDefaultProps: function(){

      return {
         "property" : {},
         "title" : "",
         "placeholder" : "",
         "value" : undefined,
         "displayValue" : "",
         "editable" : false,
         "editing" : false,
         "onWantsEdit" : function(){}
      };
   },

   getInitialState: function(){

      return {
         "editing" : this.props.editing,
         "value" : this.props.value
      };
   },

   render: function(){

      var view;
      var props=this.props;
      var property=props.property;
      var meta=property.getDefinition().meta;
      var value=props.value;
      var type=property.getType();
      var displayValue=props.displayValue || (meta ? meta.displayValue : value);
      var displayName=props.displayName || (meta ? meta.displayName : camelCaseToTitleCase(property.getName()));

      switch(type)
      {
         case "relationship" :
         {
            var entityName=property.getEntityName();
            var destinationEntity=property.getDestinationEntity();
            var definition=destinationEntity.getDefinition();
            var meta=definition.meta;

            if(meta && meta.displayValuePointer)
            {
               if(property.toMany)
               {
                  displayValue=value.length + " " + entityName + "(s)";
               }
               else
               {
                  displayValue=JSONPointer.evaluate(meta.displayValuePointer, value, {delimiter:"."});
               }


            }
            else
            {
               if(property.toMany)
               {
                  displayValue=value.length + " " + entityName + "(s)";
               }
               else
               {

                  displayValue=value || "";
               }
            }

            break;
         }

         default :
         {

         }
      }

      return (
         <ValueView
            displayName={displayName}
            displayValue={displayValue}
            editable={this.props.editing}
            onWantsEdit={this.handleWantsEdit}
            onChange={this.handleChange} />
      );
   },

   handleWantsEdit: function(){

      var property=this.props.property;
      var type=property.getType();

      var allowedToEdit=this.props.onWantsEdit(property);
      var shouldInlineEdit=allowedToEdit;

      if(type==="relationship" || type==="fetched")
      {
         shouldInlineEdit=false;
      }

      return shouldInlineEdit;
   },

   handleChange: function(){

      console.log("changed!", arguments);


      // apply the change, dispatch across the board and trigger ui re-render
      // ParseReact.Mutation.Set(this.account, {title:title}).dispatch();
   },

   confirm: function(e){

      e.preventDefault();

      this.props.onChange(this.props.property, this.state.value);

      this.setState({
         editing: false
      });
   },

   cancel: function(e){

      e.preventDefault();

      this.setState({
         editing: false
      });
   }
});

module.exports=SchemaPropertyView;
