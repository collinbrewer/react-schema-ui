var React=require("react");
var ReactDOM=require("react-dom");
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

   // make sure the display value is renderable
   if(displayValue && typeof(displayValue)==="object")
   {
      displayValue=displayValue.toString();
   }

   return transformer(property, value, displayValue);
};

var SchemaPropertyValueViewer=React.createClass({

   getDefaultProps: function(){
      return {
         "value" : "",
         "displayType" : "string",
         "placeholder" : "",
         "displayValueTransformer" : function(p, v, d){ return d; }
      };
   },

   render: function(){

      var value=this.props.value;
      var displayValue=defaultDisplayValueTransformer(this.props.schema, value, this.props.displayValueTransformer);
      var displayType=this.props.displayType;
      var placeholder=this.props.placeholder;

      var className="rsui-property-value-viewer";

      // if no value, use the placeholder
      if(!displayValue)
      {
         displayValue=(
            <div className="rsui-property-value-placeholder">
               {placeholder}
            </div>
         );
      }

      return (
         <div className={className}>
            {displayValue}
         </div>
      );
   }
});

module.exports=SchemaPropertyValueViewer;
