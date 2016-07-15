var React=require('react');
var ReactDOM=require('react-dom');
var TestUtils=require('react-addons-test-utils');

var SchemaObjectView=require('../src/schema-object-view.js');

var definition={
   schemaType: 'object',
   properties: [
      {
         'schemaType' : 'property',
         'name':'firstName',
         'type':'string',
         'label': 'Label',
         'placeholder' : 'placeholder',
      }
   ]
};

describe("SchemaObjectView", function(){

   it("renders the viewer", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaObjectView
            schema={definition} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("Label");
   });
});
