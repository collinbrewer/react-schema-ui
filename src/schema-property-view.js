var React=require("react");

var SchemaAttributeView=require("./schema-attribute-view.js");
var SchemaRelationshipView=require("./schema-relationship-view.js");
var SchemaPropertyValueViewer=require("./schema-property-value-viewer.js");
var SchemaPropertyValueEditor=require("./schema-property-value-editor.js");
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
         "schema" : {},
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
      var schema=props.schema;
      // var meta=schema.getDefinition().meta || {};
      var value=props.value;
      var type=schema.getType();
      // var displayName=props.displayName || meta.displayName || camelCaseToTitleCase(schema.getName());
      var displayName=schema.displayName || camelCaseToTitleCase(schema.getName());
      // var displayValue=defaultDisplayValueTransformer(property, value, this.props.displayValueTransformer);//props.displayValue || meta.displayValue || value;
      var displayType=getDisplayTypeForProperty(schema);
      // var placeholder=props.placeholder || meta.placeholder || (schema.getType()==="attribute" ? schema.getAttributeType() : schema.getDestinationEntity().getName());
      var placeholder=schema.getPlaceholder();

      var className="rsui-property-container";
      className+=(" rsui-edit-mode-" + editMode);
      className+=(" " + schema.getName());
      editable && (className+=" rsui-editable");
      editing && (className+=" rsui-editing");
      !!value && (className+=" rsui-has-value");

      return (
         <div className={className} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>
            <label className="rsui-property-label" htmlFor={schema.getName()}>{displayName}</label>
            <div className="rsui-property-value-container">
               <SchemaPropertyValueViewer
                  displayName={displayName}
                  value={value}
                  displayType={displayType}
                  placeholder={placeholder}
                  schema={schema}
                  displayValueTransformer={this.props.displayValueTransformer} />
               <SchemaPropertyValueEditor
                  displayName={displayName}
                  value={value}
                  displayType={displayType}
                  placeholder={placeholder}
                  editMode={editMode}
                  editable={editable}
                  editing={editing}
                  inlineCancelComponent={props.inlineCancelComponent}
                  inlineConfirmComponent={props.inlineConfirmComponent}
                  schema={schema}
                  displayValueTransformer={this.props.displayValueTransformer}
                  onWantsCancelInlineEdit={this.cancelInlineEdit}
                  onWantsConfirmInlineEdit={this.confirmInlineEdit}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  onChange={this.handleChange}
                  autoFocus={editing} />
            </div>
         </div>
      );
   },

   handleWantsEdit: function(){

      var schema=this.props.schema;
      var type=schema.getType();

      var allowedToEdit=this.props.onWantsEdit(schema);
      var shouldInlineEdit=allowedToEdit;

      if(type==="relationship" || type==="fetched")
      {
         shouldInlineEdit=false;
      }

      return shouldInlineEdit;
   },

   handleChange: function(value){
      this.props.onChange(this.props.schema, value);
   },

   handleMouseDown: function(e){
      if(this.props.editMode==="inline")
      {
         if(this.state.editing)
         {
            e.preventDefault();
         }
      }
   },

   handleClick: function(e){

      if(this.props.editMode==="inline")
      {
         if(this.state.editing)
         {
            e.preventDefault();
         }
         else if(this.props.editable)
         {
            var shouldEdit=this.props.onWantsEdit(this.props.schema, e);

            if(shouldEdit!==false)
            {
               this.setState({
                  editing: true
               });
            }
         }
      }
   },

   handleFocus: function(){
      this.setState({
         editing: true
      });
   },

   handleBlur: function(){
      this.setState({
         editing: false
      });
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
