function PropertySchema(definition) {
   this.definition = definition;
}

PropertySchema.prototype.getName = function() {
   return this.definition.name;
};

PropertySchema.prototype.getType = function () {
   return this.definition.type;
};

PropertySchema.prototype.getPlaceholder = function () {
   return this.definition.placeholder || this.getType();
};

module.exports=PropertySchema;
