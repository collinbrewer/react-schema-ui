var RSUISchema=require('../../src/schemas/rsui-schema.js');

describe('RSUISchema', () => {

   it('can handle objects', () => {
      var schema=new RSUISchema({schemaType:'object'});

      expect(schema.getProperties).toBeDefined();
   });

   it('can handle properties', () => {
      var schema=new RSUISchema({schemaType:'property'});

      expect(schema.getName).toBeDefined();
   });
});
