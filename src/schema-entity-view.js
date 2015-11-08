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
         editMode: "form",
         editing: false,
         editable: false,
         onWantsEditProperty: function(){},
         onChange: function(){}
      }
   },

   render: function(){

      var props=this.props;
      var entity=props.entity;
      var editMode=props.editMode;
      var editable=props.editable;
      var editing=props.editing;
      var handleWantsEditProperty=props.onWantsEditProperty;
      var object=props.object;
      var propertyNameWhitelist=props.propertyNameWhitelist;
      var propertyNameBlacklist=(props.propertyNameBlacklist || []);
      var properties;
      var value;

      // pull in explicity whitelisted or all
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
      else
      {
         properties=entity.getProperties();
      }

      // filter out the blacklist
      if(propertyNameBlacklist)
      {
         properties=properties.filter(function(property){
            return (propertyNameBlacklist.indexOf(property.getName())===-1);
         });
      }

      // render the property views
      var handleChangeProperty=this.props.onChangeProperty;

      var propertyViews=properties.map(function(property, i){

         var propertyName=property.getName();

         value=object ? object[propertyName] : undefined;

         return (
            <SchemaPropertyView
               key={i}
               property={property}
               value={value}
               editMode={editMode}
               editable={editable}
               editing={editing}
               onWantsEdit={handleWantsEditProperty}
               onChange={handleChangeProperty} />
         );
      });

      var className="rsui-entity-container";
      editing && (className+=" rsui-entity-container-editing");


      return (
         <div className={className}>
            {propertyViews}
         </div>
      );
   }
});

module.exports=SchemaEntityView;
