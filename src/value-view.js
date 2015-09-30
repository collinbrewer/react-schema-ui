var React=require("react");

var ValueView=React.createClass({

   getDefaultProps: function(){

      return {
         "displayName" : "",
         "displayValue" : "",
         "placeholder" : "",
         "editing" : false,
         "editable" : false,
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
      var displayName=this.props.displayName;
      var displayValue=this.props.displayValue;
      var editing=this.state.editing;
      var editable=this.props.editable;

      var editableIndicator=(editable ? <i className="ion-edit"></i> : null);
      var editableIndicatorCol=(
         <div className="col-xs-1 placeholder-text-color">{editableIndicator}</div>
      );

      var className="row list-view-item";
      editable && (className+=" interactive");

      if(editing)
      {
         view=(
            <div className={className}>
               <div className="col-xs-4 primary">{displayName}</div>
               <div className="col-xs-6 subtitle">
                  <input
                     type="text"
                     placeholder={this.props.placeholder}
                     value={this.state.value}
                     onKeyDown={this.handleKeyDown}
                     onChange={this.handleChange}
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
               <div className="col-xs-4 primary">{displayName}</div>
               <div className="col-xs-7 subtitle">
                  {displayValue}
               </div>
               {editableIndicatorCol}
            </div>
         );
      }
      else
      {
         view=(
            <div className={className}>
               <div className="col-xs-4 primary">{displayName}</div>
               <div className="col-xs-8 subtitle">{displayValue}</div>
            </div>
         );
      }

      return view;
   },

   handleKeyDown: function(e){

      var keyCode=e.keyCode;

      if(keyCode===13)
      {
         var value=React.findDOMNode(this.refs.title).value;

         this.props.onChange(value);
      }
      else if(keyCode===27)
      {
         this.cancel(e);
      }
   },

   handleChange: function(e){

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

module.exports=ValueView;
