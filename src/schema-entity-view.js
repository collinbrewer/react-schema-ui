/**
 * A configurable react view component, generated from a given object.
 */

var React=require("react");
var SchemaPropertyView=require("./schema-property-view.js");

var SchemaEntityView=React.createClass({

   getDefaultProps: function(){

      return {
         entity: undefined,
         object: undefined,
         editing: false,
         onWantsEditProperty: function(){}
      }
   },

   render: function(){

      var entity=this.props.entity;
      var editing=this.props.editing;
      var object=this.props.object;
      var propertyNameWhitelist=(this.props.propertyNameWhitelist || []);
      var propertyNameBlacklist=(this.props.propertyNameBlacklist || []);
      var value;
      var properties;

      // whitelist
      if(propertyNameWhitelist)
      {
         properties=[];

         propertyNameWhitelist.map(function(propertyName){

            var property=entity.getPropertyWithName(propertyName);

            if(property)
            {
               properties.push(property);
            }
         });
      }

      // blacklist
      if(propertyNameBlacklist)
      {
         properties=properties.filter(function(property){
            return (propertyNameBlacklist.indexOf(property.getName())===-1);
         });
      }

      // render!
      var handleWantsEditProperty=this.props.onWantsEditProperty;

      var propertyViews=properties.map(function(property, i){

         value=object[property.getName()];

         return (
            <SchemaPropertyView
               key={i}
               property={property}
               value={value}
               editing={editing}
               onWantsEdit={handleWantsEditProperty} />
         );
      });

      return (
         <div className="">
            {propertyViews}
         </div>
      );
   }
});

module.exports=SchemaEntityView;
