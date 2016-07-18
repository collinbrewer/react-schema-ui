var React=require('react');
var TestUtils=require("react-addons-test-utils");

var SchemaPropertyValueEditor=require("../src/schema-property-value-editor.js");

describe("PropertyValueEditor", function(){

   it('should render a text input', function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyValueEditor />
      );
      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(node.type).toEqual('text');
   });

   it('should render a password input', function(){
      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyValueEditor
            displayType={'password'} />
      );
      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(node.type).toEqual('password');
   });

   it('should render a checkbox', function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyValueEditor
            displayType={'checkbox'} />
      );
      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(node.type).toEqual('checkbox');
   });

   it('receives change property callback', function(){

      var mockOnChange=jest.fn();
      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyValueEditor
            displayType={'checkbox'}
            onChange={mockOnChange} />
      );
      var input=TestUtils.scryRenderedDOMComponentsWithTag(component, 'input')[0];

      TestUtils.Simulate.change(input, {value:'a'});

      expect(mockOnChange.mock.calls.length).toEqual(1);
   });
});
