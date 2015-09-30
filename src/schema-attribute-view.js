var React=require("react");

var SchemaAttributeView=React.createClass({

   getDefaultProps: function(){

      return {
         "title" : "",
         "placeholder" : "",
         "value" : undefined,
         "displayValue" : "",
         "editable" : false,
         "onWantsEdit" : function(){}
      };
   },

   getInitialState: function(){

      return {
         "editing" : false,
         "value" : this.props.value
      };
   },

   render: function(){

      var view;
      var property=this.props.property;
      var attributeType=property.getAttributeType();
      var title=this.props.title || property.getName();
      var value=this.props.value;
      var displayValue=this.props.displayValue || value;
      var editing=this.state.editing;
      var editable=this.props.editable;

      var editableIndicator=(editable ? <i className="ion-edit"></i> : null);
      var editableIndicatorCol=(
         <div className="col-xs-1 placeholder-text-color">{editableIndicator}</div>
      );

      var className="row list-view-item";
      editable && (className+=" interactive");

      // <div className="row">
      //    <div className="col-xs-12">
      //       {descriptionRow}
      //    </div>
      // </div>

      if(attributeType==="string")
      {
         if(editing)
         {
            view=(
               <div className={className}>
                  <div className="col-xs-4 primary">{title}</div>
                  <div className="col-xs-6 subtitle">
                     <input
                        type="text"
                        placeholder={this.props.placeholder}
                        value={this.state.value}
                        onChange={this.inputChanged}
                        autoFocus
                        />
                  </div>
                  <div className="col-xs-1">
                     <a href="#" onClick={this.cancel}><i className="ion-ios-close-outline" /></a>
                  </div>
                  <div className="col-xs-1">
                     <a href="#" onClick={this.confirm}><i className="ion-ios-checkmark-outline" /></a>
                  </div>
               </div>
            );
         }
         else if(editable)
         {
            view=(
               <div className={className} onClick={this.handleClick}>
                  <div className="col-xs-4 primary">{title}</div>
                  <div className="col-xs-7 subtitle">
                     {value}
                  </div>
                  {editableIndicatorCol}
               </div>
            );
         }
         else
         {
            view=(
               <div className={className}>
                  <div className="col-xs-4 primary">{title}</div>
                  <div className="col-xs-8 subtitle">{displayValue}</div>
               </div>
            );
         }
      }
      else
      {
         return (
            <div className={className} onClick={this.handleClick}>
               <div className="col-xs-4 primary">{title}</div>
               <div className="col-xs-7 subtitle">{displayValue}</div>
               {editableIndicatorCol}
            </div>
         );
      }

      return view;
   },

   inputChanged: function(e){

      this.setState({
         value: e.target.value
      });
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
   },

   handleClick: function(e){

      if(this.props.editable)
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
   }
});

module.exports=SchemaAttributeView;
