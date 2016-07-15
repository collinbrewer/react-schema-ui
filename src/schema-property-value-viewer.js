var React=require("react");

/**
 * Provides a full featured value viewer capable of handling most cases without
 * the need for a custom viewer.
 */
var SchemaPropertyValueViewer=React.createClass({

   getDefaultProps: function(){
      return {
         "value" : "",
         "displayType" : "string",
      };
   },

   render: function(){

      var displayValue=this.props.displayValue;

      return (
         <div className={'rsui-property-value-viewer'}>
            {displayValue}
         </div>
      );
   }
});

module.exports=SchemaPropertyValueViewer;
