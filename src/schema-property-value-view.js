var React=require("react");

var JSONPointer=require("json-pointer");

/**
 * defaultDisplayValueTransformer
 */
var defaultDisplayValueTransformer=function(property, value, transformer){

   var displayValue=value;
   var type=property.getType();

   switch(type)
   {
      case "relationship" : // TODO: what about fetched?
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
   }

   return transformer(property, value, displayValue);
};

var SchemaPropertyValueView=React.createClass({

   getDefaultProps: function(){

      return {
         "value" : "",
         "displayType" : "string",
         "placeholder" : "",
         "editMode" : "form",
         "editable" : false,
         "displayValueTransformer" : function(p, v, d){ console.log("SchemaPropertyValueView.displayValueTransformer: ", arguments); return d; },
         "onWantsConfirmInlineEdit" : function(){},
         "onWantsCancelInlineEdit" : function(){},
         "onChange" : function(){}
      };
   },

   getInitialState: function(){

      return {
         "editing" : this.props.editing,
         "value" : this.props.value,
         "type" : this.props.type
      };
   },

   componentWillReceiveProps: function(nextProps){

      if(nextProps.editing)
      {
         this.setState({
            value: this.props.value
         });
      }
   },

   render: function(){

      var view;
      var editMode=this.props.editMode;
      var editable=this.props.editable;
      var editing=this.props.editing;
      var value=((editMode==="inline" && editing) ? this.state.value : this.props.value || this.state.value);
      var displayValue=defaultDisplayValueTransformer(this.props.property, value, this.props.displayValueTransformer);
      var displayType=this.props.displayType;
      var placeholder=this.props.placeholder;

      var className="rsui-property-value-container"
      editable && (className+=" rsui-property-value-container-editable");
      editing && (className+=" rsui-property-value-container-editing");

      if((editMode==="inline" && editable && !editing) || (editMode==="form" && !editing))
      {
         var v;

         if(!displayValue)
         {
            className+=" rsui-property-value-placeholder";
            displayValue=placeholder;
         }

         view=(
            <div className={className}>
               {displayValue}
            </div>
         );
      }
      else
      {
         var display;

         if(displayType==="checkbox")
         {
            display=(
               <input
                  type="checkbox"
                  onChange={this.handleChange}
                  />
            );
         }
         else
         {
            display=(
               <input
                  type="text"
                  placeholder={this.props.placeholder}
                  value={displayValue}
                  onKeyDown={this.handleKeyDown}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  autoFocus={this.props.focus ? "autofocus" : ""}
               />
            );
         }

         var inlineEditingControls;

         if(editMode==="inline" && editing===true)
         {
            inlineEditingControls=(
               <span>
                  <span className="">
                     <a href="#" onClick={this.handleClickCancelInlineEdit}><i className="ion-ios-close-outline" /></a>
                  </span>
                  <span className="">
                     <a href="#" onClick={this.handleClickConfirmInlineEdit}><i className="ion-ios-checkmark-outline" /></a>
                  </span>
               </span>
            );
         }

         view=(
            <div>
               {display}
               {inlineEditingControls}
            </div>
         );
      }

      return view;
   },

   handleKeyDown: function(e){

      var keyCode=e.keyCode;

      if(this.props.editMode==="inline")
      {
         if(keyCode===13)
         {
            var value=e.target.value;

            this.commitInlineEditChanges();

            this.props.onWantsConfirmInlineEdit(value);
         }
         else if(keyCode===27)
         {
            this.handleClickCancelInlineEdit(e);
         }
      }
   },

   handleCheckboxChange: function(e){

      this.setState({
         value: e.target.checked
      });
   },

   handleChange: function(e){

      // if the edit mode is inline, we'll apply the changes internally
      if(this.props.editMode==="inline")
      {
         this.setState({
            value: e.target.value
         });
      }
      else
      {
         this.props.onChange(e.target.value);
      }
   },

   handleBlur: function(e){

      // if we're inline editing and nothing has changed, just cancel the edit
      if(this.props.editMode==="inline" && this.props.editing && this.props.value===this.state.value)
      {
         this.props.onWantsCancelInlineEdit(e);
      }
   },

   commitInlineEditChanges: function(){

      if(this.props.editMode==="inline" && this.props.value!==this.state.value)
      {
         this.props.onChange(this.state.value);
         this.props.onWantsConfirmInlineEdit(this.state.value);
         this.setState({
            value: undefined
         });
      }
   },

   revertInlineEditChanges: function(){

      this.setState({
         value: undefined
      });
   },

   handleClickConfirmInlineEdit: function(e){

      e.preventDefault();

      if(this.props.editMode==="inline" && this.props.value!==this.state.value)
      {
         this.commitInlineEditChanges();
      }
   },

   handleClickCancelInlineEdit: function(e){

      e.preventDefault();

      this.revertInlineEditChanges();

      this.props.onWantsCancelInlineEdit(e);
   }
});

module.exports=SchemaPropertyValueView;
