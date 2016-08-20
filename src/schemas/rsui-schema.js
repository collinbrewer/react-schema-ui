var Schema = require('schema');
var ObjectSchema = require('./object-schema.js');
var PropertySchema = require('./property-schema.js');

// TODO: these need to be registered in a new namespace
Schema.register('object', ObjectSchema);
Schema.register('property', PropertySchema);

module.exports = Schema;
