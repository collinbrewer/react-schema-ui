var React=require('react');
var ReactDOM=require('react-dom');
var TestUtils=require('react-addons-test-utils');

var SchemaObjectView=require('../src/schema-object-view.js');
var SchemaPropertyView=require('../src/schema-property-view.js');

var definition={
   schemaType: 'object',
   properties: [
      {
         'schemaType' : 'property',
         'name':'name',
         'type':'string',
         'label': 'Label',
         'placeholder' : 'placeholder',
      },
      {
         'schemaType' : 'property',
         'name':'name2',
         'type':'boolean'
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

   it("renders only whitelisted properties", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaObjectView
            propertyNameWhitelist={['name']}
            schema={definition} />
      );

      var propertyComponents=TestUtils.scryRenderedComponentsWithType(component, SchemaPropertyView);

      expect(propertyComponents.length).toEqual(1);
   });

   it("doesn't render blacklisted properties", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaObjectView
            propertyNameBlacklist={['name']}
            schema={definition} />
      );

      var propertyComponents=TestUtils.scryRenderedComponentsWithType(component, SchemaPropertyView);

      expect(propertyComponents.length).toEqual(1);
   });

   it('receives change property callback', function(){

      var mockOnChange=jest.fn();
      var component=TestUtils.renderIntoDocument(
         <SchemaObjectView
            schema={definition}
            editable={true}
            onChangeProperty={mockOnChange} />
      );
      var input=TestUtils.scryRenderedDOMComponentsWithTag(component, 'input')[0];

      TestUtils.Simulate.change(input, {value:'a'});

      expect(mockOnChange.mock.calls.length).toEqual(1);
   });
});
