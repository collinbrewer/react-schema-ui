var React=require("react");

var SchemaAttributeView=require("./schema-attribute-view.js");
var SchemaRelationshipView=require("./schema-relationship-view.js");
var SchemaPropertyValueView=require("./schema-property-value-view.js");
var camelCaseToTitleCase=require("./util/camel-case-to-title-case.js");

var getDisplayTypeForProperty=function(property){

   var displayType="string";

   if(property.getType()==="attribute")
   {
      if(property.getAttributeType()==="boolean")
      {
         displayType="checkbox";
      }
   }

   return displayType;
};

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
         "onWantsEdit" : function(){},
         "onChange" : function(){}
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
      var displayName=props.displayName || meta.displayName || camelCaseToTitleCase(property.getName());
      // var displayValue=defaultDisplayValueTransformer(property, value, this.props.displayValueTransformer);//props.displayValue || meta.displayValue || value;
      var displayType=getDisplayTypeForProperty(property);
      var placeholder=props.placeholder || meta.placeholder || (property.getType()==="attribute" ? property.getAttributeType() : property.getDestinationEntity().getName());

      var className="rsui-property-container";
      editable && (className+=" rsui-property-container-editable");
      editing && (className+=" rsui-property-container-editing");

      return (
         <div className={className} onClick={this.handleClick}>
            <label className="rsui-property-label" htmlFor={property.getName()}>{displayName}</label>
            <SchemaPropertyValueView
               displayName={displayName}
               value={value}
               displayType={displayType}
               placeholder={placeholder}
               editMode={editMode}
               editable={editable}
               editing={editing}
               property={property}
               displayValueTransformer={this.props.displayValueTransformer}
               onWantsCancelInlineEdit={this.cancelInlineEdit}
               onWantsConfirmInlineEdit={this.confirmInlineEdit}
               onChange={this.handleChange}
               focus={editMode==="inline"} />
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

      this.props.onChange(this.props.property, value);
   },

   handleClick: function(e){

      if(this.props.editable && this.props.editMode==="inline" && !this.state.editing)
      {
         var shouldEdit=this.props.onWantsEdit(this.props.property, e);

         if(shouldEdit!==false)
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
