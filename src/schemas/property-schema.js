var titleCase=require('title-case');

function PropertySchema(definition) {
   this.definition = definition;
}

PropertySchema.prototype.getName = function() {
   return this.definition.name;
};

PropertySchema.prototype.getLabel = function () {
   return this.definition.label || titleCase(this.getName());
};

PropertySchema.prototype.getType = function () {
   return this.definition.type;
};

PropertySchema.prototype.getPlaceholder = function () {
   return this.definition.placeholder || this.getType();
};

module.exports=PropertySchema;
