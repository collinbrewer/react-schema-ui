var React=require("react");
var ReactDOM=require("react-dom");
var TestUtils=require("react-addons-test-utils");


var SchemaPropertyView=require("../src/schema-property-view.js");

var schema={
   "schemaType" : "property",
   "name":"firstName",
   "type":"string",
   "label": "Date",
   "placeholder" : "date record was created",
};

describe("SchemaPropertyView", function(){

   it("renders the placeholder", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={schema} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("date record was created");
   });

   it("renders the viewer", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={schema}
            value={'foo'} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("foo");
   });

   it("renders the editor", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editable={true}
            schema={schema}
            value={'foo'} />
      );

      var component=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(component).toBeDefined();
      expect(component.value).toEqual('foo');
   });
})
