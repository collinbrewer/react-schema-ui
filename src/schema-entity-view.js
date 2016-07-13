/**
 * A configurable react view component, generated from a given object.
 */

var React=require("react");
var classnames=require("classnames");
var SchemaPropertyView=require("./schema-property-view.js");
var RSUISchema=require("./schemas/rsui-schema.js");

var SchemaEntityView=React.createClass({

   getDefaultProps: function(){

      return {
         schema: undefined,
         value: undefined,
         editMode: "form",
         editing: false,
         editable: false,
         editors: {},
         onWantsEditProperty: function(){},
         onChange: function(){}
      }
   },

   render: function(){

      var props=this.props;
      var schema=props.schema;
      var editMode=props.editMode;
      var editable=props.editable;
      var editing=props.editing;
      var handleWantsEditProperty=props.onWantsEditProperty;
      var value=props.value;
      var propertyNameWhitelist=props.propertyNameWhitelist;
      var propertyNameBlacklist=(props.propertyNameBlacklist || []);
      var properties;
      var value;

      schema.getProperties || (schema=new RSUISchema(schema));

      // pull in explicity whitelisted or all
      if(propertyNameWhitelist)
      {
         properties=[];

         propertyNameWhitelist.map(function(propertyName){

            var propertySchema=schema.getPropertyWithName(propertyName);

            if(property)
            {
               properties.push(property);
            }
         });
      }
      else
      {
         properties=schema.getProperties();
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

      var propertyViews=properties.map(function(propertySchema, i){

         var propertyName=propertySchema.getName();

         propertyValue=value ? value[propertyName] : undefined;

         var fn;

         if(handleChangeProperty)
         {
            fn=handleChangeProperty.bind(null, propertySchema);
         }

         return (
            <SchemaPropertyView
               key={i}
               schema={propertySchema}
               value={propertyValue}
               editMode={editMode}
               editable={editable}
               editing={editing}
               propertyEditorClass={props.editors[propertySchema.getType()]}
               inlineCancelComponent={props.inlineCancelComponent}
               inlineConfirmComponent={props.inlineConfirmComponent}
               displayValueTransformer={props.displayValueTransformer}
               onWantsEdit={handleWantsEditProperty}
               onChange={fn} />
         );
      });

      var className=classnames(
         {
            "rsui-schema-container" : true,
            "rsui-schema-container-editing" : editing
         },
         this.props.className
      );

      return (
         <div className={className}>
            {propertyViews}
         </div>
      );
   }
});

module.exports=SchemaEntityView;
