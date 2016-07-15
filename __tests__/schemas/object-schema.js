var ObjectSchema=require('../../src/schemas/object-schema.js');

describe('ObjectSchema', () => {

   it('returns the name as the fallback label', () => {
      var schema=new ObjectSchema({name:'object name', properties:[{}, {}]});
      expect(schema.getProperties().length).toBe(2);
   });
});
