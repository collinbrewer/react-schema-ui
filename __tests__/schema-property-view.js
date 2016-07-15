var React=require("react");
var ReactDOM=require("react-dom");
var TestUtils=require("react-addons-test-utils");

var SchemaPropertyView=require("../src/schema-property-view.js");

var definition={
   "schemaType" : "property",
   "name":"firstName",
   "type":"string",
   "label": "Label",
   "placeholder" : "placeholder",
};

describe("SchemaPropertyView", function(){

   it("renders the placeholder", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("placeholder");
   });

   it("renders the label", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("Label");
   });

   it("renders the viewer", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition}
            value={'foo'} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("foo");
   });

   it("renders the editor", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editable={true}
            schema={definition}
            value={'foo'} />
      );

      var component=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(component).toBeDefined();
      expect(component.value).toEqual('foo');
   });
})
