var React=require("react");
var SchemaAttributeView=require("./schema-attribute-view.js");
var SchemaRelationshipView=require("./schema-relationship-view.js");
var JSONPointer=require("json-pointer");
var SchemaPropertyValueView=require("./schema-property-value-view.js");

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
         "editMode" : "form",
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
      var editMode=props.editMode;
      var editable=props.editable;
      var editing=this.state.editing;
      var property=props.property;
      var meta=property.getDefinition().meta || {};
      var value=props.value;
      var type=property.getType();
      var displayValue=props.displayValue || meta.displayValue || value;
      var displayName=props.displayName || meta.displayName || camelCaseToTitleCase(property.getName());
      var displayType;
      var placeholder=props.placeholder || meta.placeholder;

      switch(type)
      {
         case "relationship" :
         {
            var entityName=property.getEntityName();
            var destinationEntity=property.getDestinationEntity();
            var definition=destinationEntity.getDefinition();
            var meta=definition.meta;

            displayType="string";

            if(meta && meta.displayValuePointer)
            {
               if(property.toMany)
               {
                  displayValue=value.length + " " + entityName + "(s)";
               }
               else
               {
                  displayValue=JSONPointer.evaluate(meta.displayValuePointer, value, {delimiter:".", strict:false, defaultValue:""});
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

         // attribute
         default :
         {
            var attributeType=property.getAttributeType();

            if(attributeType==="boolean")
            {
               displayType="checkbox";
            }
            else
            {
               displayType="string";
            }

            placeholder===undefined && (placeholder=attributeType);
         }
      }

      var className="rsui-property-container";
      editable && (className+=" rsui-property-container-editable");
      editing && (className+=" rsui-property-container-editing");

      return (
         <div className={className} onClick={this.handleClick}>
            <label className="rsui-property-label" htmlFor={property.getName()}>{displayName}</label>
            <SchemaPropertyValueView
               displayName={displayName}
               value={displayValue}
               displayType={displayType}
               placeholder={placeholder}
               editMode={editMode}
               editable={editable}
               editing={editing}
               onWantsCancelInlineEdit={this.cancelInlineEdit}
               onWantsConfirmInlineEdit={this.confirmInlineEdit}
               onChange={this.handleChange} />
         </div>
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

   handleChange: function(value){

      this.props.onChange(value);
   },

   handleClick: function(e){

      if(this.props.editable && this.props.editMode==="inline" && !this.state.editing)
      {
         var shouldEdit=this.props.onWantsEdit(this.props.property, e);

         if(shouldEdit===false)
         {

         }
         else
         {
            this.setState({
               editing: true
            });
         }
      }
   },

   confirmInlineEdit: function(value, e){

      this.setState({
         editing: false
      });
   },

   cancelInlineEdit: function(){

      this.setState({
         editing: false
      })
   },
});

module.exports=SchemaPropertyView;
