var PropertySchema=require('../../src/schemas/property-schema.js');

describe('PropertySchema', () => {

   it('returns the name', () => {
      var schema=new PropertySchema({name:'property name'});

      expect(schema.getName()).toEqual('property name');
   });

   it('returns the type', () => {
      var schema=new PropertySchema({type:'string'});

      expect(schema.getType()).toEqual('string');
   });

   it('returns the placeholder', () => {
      var schema=new PropertySchema({placeholder:'property placeholder'});

      expect(schema.getPlaceholder()).toEqual('property placeholder');
   });

   it('returns the type as the fallback placeholder', () => {
      var schema=new PropertySchema({type:'string'});

      expect(schema.getPlaceholder()).toEqual('string');
   });

   it('returns the label', () => {
      var schema=new PropertySchema({label:'property label'});

      expect(schema.getLabel()).toEqual('property label');
   });

   it('returns the name as the fallback label', () => {
      var schema=new PropertySchema({name:'property name'});

      expect(schema.getLabel()).toEqual('Property Name');
   });
});