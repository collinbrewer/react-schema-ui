var React=require("react");
var ReactDOM=require("react-dom");
var classnames=require("classnames");

var SchemaAttributeView=require("./schema-attribute-view.js");
var SchemaRelationshipView=require("./schema-relationship-view.js");
var SchemaPropertyValueViewer=require("./schema-property-value-viewer.js");
var SchemaPropertyValueEditor=require("./schema-property-value-editor.js");
var camelCaseToTitleCase=require("./util/camel-case-to-title-case.js");
var dispatcher=require("./dispatcher.js");

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
         "inlineBlurMode" : "submit", // "submit", "cancel", ""
         "onWantsEdit" : function(){},
         "onChange" : function(){}
      };
   },

   getInitialState: function(){
      return {
         "editing" : this.props.editing
      };
   },

   // componentWillReceiveProps: function(nextProps){
   //    if(this.props.value!==nextProps.value) {
   //       this.setState({
   //          stagedValue: undefined
   //       });
   //    }
   // },

   render: function(){

      var props=this.props;
      var editMode=props.editMode;
      var editable=this.props.editable;
      var editing=this.state.editing;
      var schema=props.schema;
      var value=this.state.stagedValue || this.props.value;
      var displayName=schema.displayName || camelCaseToTitleCase(schema.getName());
      var placeholder=schema.getPlaceholder();
      var inlineEditingControls;
      var className=classnames(
         {
            "rsui-property-container" : true,
            "rsui-editable": editable,
            "rsui-editing" : editing,
            "rsui-has-value" : !!value,
            "rsui-has-changed" : this.hasChanged()
         },
         schema.getName(),
         "rsui-edit-mode-" + editMode
      );

      // if
      if(editMode==="inline" && editing)
      {
         inlineEditingControls=this.renderInlineEditingControls();
      }

      // we'll make this tabbable if it's inline mode, editable, but not editing
      var tabIndex=((editMode==="inline" && editable && !editing) ? "0" : undefined);
      var focusInput;
      var editorContainer;

      if(editMode==="inline" && editable && !editing)
      {
         focusInput=(<input ref="fakeInput" onFocus={this.handleFocus} style={{position:"absolute", opacity:0}} />);
      }

      if((editMode==="inline" ? editing : editable))
      {
         editorContainer=(
            <div className="rsui-property-value-editor-container" onKeyDown={this.handleKeyDown} key="editor">
               {this.renderValueEditor()}
               {inlineEditingControls}
            </div>
         );
      }

      return (
         <div
            className={className}
            onMouseDown={this.handleMouseDownContainer}
            onClick={this.handleClickContainer}
            ref="container">
            <label className="rsui-property-label" htmlFor={schema.getName()}>{displayName}</label>
            {focusInput}
            <div className="rsui-property-value-container">
               <SchemaPropertyValueViewer
                  value={value}
                  placeholder={placeholder}
                  schema={schema}
                  displayValueTransformer={this.props.displayValueTransformer} />
               {editorContainer}
            </div>
         </div>
      );
   },

   renderValueEditor: function(){

      var props=this.props;
      var editorProps={
         ref: props.schema.getName(),
         value: this.getValue(),
         displayType: getDisplayTypeForProperty(props.schema),
         placeholder: props.placeholder,
         editMode: props.editMode,
         editable: props.editable,
         editing: this.state.editing,
         schema: props.schema,
         displayValueTransformer: this.props.displayValueTransformer,
         onChange: this.handleChange,
         autoFocus: this.state.editing
      };

      return React.createElement((props.propertyEditorClass || SchemaPropertyValueEditor), editorProps);
   },

   renderInlineEditingControls: function(){

      var inlineCancelComponent=this.props.inlineCancelComponent || ("cancel")
      var inlineConfirmComponent=this.props.inlineConfirmComponent || ("confirm");

      var confirmControl;

      if(this.hasChanged())
      {
         confirmControl=(<button className="rsui-inline-confirm" tabIndex="-1" onClick={this.confirmInlineEdit}>{inlineConfirmComponent}</button>);
      }
      else
      {
         confirmControl=(<span className="rsui-inline-confirm">{inlineConfirmComponent}</span>);
      }

      return (
         <span className="rsui-inline-controls-container">
            <button className="rsui-inline-cancel" tabIndex="-1" onMouseDown={this.cancelInlineEdit}>{inlineCancelComponent}</button>
            {confirmControl}
         </span>
      );
   },

   handleKeyDown: function(e){

      var keyCode=e.keyCode;

      if(keyCode===13) // enter > explicit confirm
      {
         this.confirmInlineEdit(e);
      }
      else if(keyCode===27) // escape > explicity confirm
      {
         this.cancelInlineEdit(e);
      }
      // else if(keyCode===9) // tab > implicit based on blur mode
      // {
      //    this.endEditSession();
      // }
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

      // if the edit mode is inline, we'll apply the changes internally
      if(this.props.editMode==="inline")
      {
         this.setState({
            stagedValue: value
         });
      }
      else
      {
         this.props.onChange(value);
      }
   },

   handleMouseDownContainer: function(e){
      // if(this.props.editMode==="inline")
      // {
      //    if(this.state.editing)
      //    {
      //       e.preventDefault();
      //    }
      // }
   },

   handleClickContainer: function(e){

      if(this.props.editMode==="inline")
      {
         if(this.state.editing)
         {
            e.preventDefault();
         }
         else if(this.props.editable)
         {
            this.beginEditSession(e);
         }
      }
   },

   handleFocus: function(e){

      this.beginEditSession(e);
   },

   beginEditSession: function(e){

      var shouldEdit=this.props.onWantsEdit(this.props.schema, e);

      if(shouldEdit!==false)
      {
         // this.setState({
         //    editing: true
         // });
         // FIXME: this may come as a prop from the editor store instead
         this.setState({
            editing: true
         });

         dispatcher.dispatch({
           actionType: "beginEditSession",
           editor: this
         });
      }
      else
      {
         this.refs.fakeInput.blur();
         // this.refs.container.blur();
         e.preventDefault();
      }
   },

   endEditSession: function(){

      // if we're inline editing and nothing has changed, just cancel the edit
      if(this.props.editMode==="inline" && this.state.editing)
      {
         if(!this.hasChanged())
         {
            this.cancelInlineEdit();
         }
         else if(this.props.inlineBlurMode==="cancel")
         {
            this.cancelInlineEdit();
         }
         else if(this.props.inlineBlurMode==="submit")
         {
            this.confirmInlineEdit();
         }
      }
   },

   /**
    * @return Boolean Returns true if the component or one of it's descendants has focus
    */
   hasFocus: function(){
      var el=document.activeElement;
      var us=ReactDOM.findDOMNode(this.refs.container);
      while(el=el.parentElement){
         if(el===us){
            return true;
         }
      }
      return false;
   },

   /**
    * @return Boolean True if the component is being edited
    */
   isEditing: function(){
      return this.state.editing;
   },

   confirmInlineEdit: function(e){
      e && e.preventDefault();

      if(this.props.editMode==="inline")
      {
         this.setState({
            stagedValue: undefined,
            editing: false
         });

         this.props.onChange(this.getValue());
      }
   },

   cancelInlineEdit: function(){
      this.setState({
         stagedValue: undefined, // revert
         editing: false
      });
   },

   getValue: function(){
      return (this.state.stagedValue!==undefined ? this.state.stagedValue : this.props.value);
   },

   // this is meant to be used only in inline edit mode
   hasChanged: function(){
      return (this.getValue()!==this.props.value);
   }
});

module.exports=SchemaPropertyView;
