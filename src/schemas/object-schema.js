var PropertySchema = require("./property-schema.js");

function ObjectSchema(definition) {
   this.definition = definition;
}

ObjectSchema.prototype.getProperties = function() {
   return this.definition.properties.map(function(propertyDefinition) {
      return new PropertySchema(propertyDefinition);
   });
};

module.exports=ObjectSchema;
