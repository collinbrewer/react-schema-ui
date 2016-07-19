var React=require("react");
var ReactDOM=require("react-dom");
var TestUtils=require("react-addons-test-utils");

var SchemaPropertyValueEditor=require('../src/schema-property-value-editor.js');
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

   it("renders the string value viewer", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition}
            value={'foo'} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain("foo");
   });

   it("renders the date value viewer", function(){

      let definition = {type:'date'};
      let value = new Date();

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition}
            value={value} />
      );

      var node=ReactDOM.findDOMNode(component);

      expect(node.textContent).toContain(value.toLocaleString());
   });

   it("renders the standard editor", function(){

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

   it("renders the password editor", function(){

      definition=JSON.parse(JSON.stringify(definition));
      definition.secure=true;

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editable={true}
            schema={definition}
            value={'foo'} />
      );

      var component=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      expect(component.type).toEqual('password');
   });

   it("inline mode tracks changes", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true} />
      );

      component.beginEditSession();

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.change(node, {value:'new'});

      expect(component.hasChanged()).toBeTruthy();
   });

   it("begins inline edit session on click", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            schema={definition}
            value={'foo'} />
      );

      expect(TestUtils.scryRenderedComponentsWithType(component, SchemaPropertyValueEditor).length).toEqual(0);

      var node=ReactDOM.findDOMNode(component);

      TestUtils.Simulate.click(node);

      expect(TestUtils.scryRenderedComponentsWithType(component, SchemaPropertyValueEditor).length).toEqual(1);
   });

   it("begins inline edit session on focus", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            schema={definition}
            value={'foo'} />
      );

      expect(TestUtils.scryRenderedComponentsWithType(component, SchemaPropertyValueEditor).length).toEqual(0);

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.focus(node);

      expect(TestUtils.scryRenderedComponentsWithType(component, SchemaPropertyValueEditor).length).toEqual(1);
   });

   it("ends edit session on clean blur", function(){

      jest.useRealTimers();

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            schema={definition}
            value={'foo'} />
      );

      component.beginEditSession();

      expect(component.isEditing()).toBeTruthy();

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.blur(node);

      setTimeout(function(){
         console.log('called!');
         expect(component.isEditing()).toBeFalsy();
      }, 500);
   });

   it("cancels edit on dirty blur cancel mode", function(){

      jest.useRealTimers();

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            inlineBlurMode={'cancel'}
            schema={definition}
            value={'foo'} />
      );

      component.beginEditSession();
      component.handleChange('new');

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.blur(node);

      setTimeout(function(){
         expect(component.isEditing()).toBeFalsy();
         expect(component.getValue()).toEqual('foo');
      }, 500);
   });

   it("confirms edit on dirty blur submit mode", function(){

      jest.useRealTimers();

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            inlineBlurMode={'submit'}
            schema={definition}
            value={'foo'} />
      );

      component.beginEditSession();

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.change(node, {value:'new'});
      TestUtils.Simulate.blur(node);

      setTimeout(function(){
         expect(component.isEditing()).toBeFalsy();
         expect(component.getValue()).toEqual('new');
      }, 500);
   });

   it("confirms edit session on enter", function(){

      var mockHandleChange=jest.fn();

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            schema={definition}
            value={'foo'}
            onChange={mockHandleChange}/>
      );

      component.beginEditSession();
      component.handleChange('new');

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.keyDown(node, {keyCode:13});

      expect(component.isEditing()).toBeFalsy();
      expect(mockHandleChange).toBeCalledWith('new');
   });

   it("cancels edit session on enter", function(){

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            schema={definition}
            value={'foo'} />
      );

      component.beginEditSession();

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'input');

      TestUtils.Simulate.change(node, {value:'new'});
      TestUtils.Simulate.keyDown(node, {keyCode:27});

      expect(component.getValue()).toEqual('foo');
      expect(component.isEditing()).toBeFalsy();
   });

   it("should not use default editor with intercepted edit request", function(){

      var mockedHandleWantsEdit=jest.fn().mockReturnValue(false);

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true}
            onWantsEdit={mockedHandleWantsEdit} />
      );

      component.beginEditSession();

      expect(mockedHandleWantsEdit.mock.calls.length).toEqual(1);
      expect(component.isEditing()).toBeFalsy();
   });

   it('should not lose focus on clicking container', () => {

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            editMode={'inline'}
            editable={true} />
      );

      component.beginEditSession();

      var node=TestUtils.findRenderedDOMComponentWithTag(component, 'label');

      TestUtils.Simulate.mouseDown(node);

      expect(component.isEditing()).toBeTruthy();
   });

   it('should return valid for existing required', () => {

      definition=JSON.parse(JSON.stringify(definition));
      definition.required=true;

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition}
            value={'foo'}
            editMode={'inline'}
            editable={true} />
      );

      expect(component.isValid()).toBeTruthy();
   });


   it('should return invalid for missing required', () => {

      definition=JSON.parse(JSON.stringify(definition));
      definition.required=true;

      var component=TestUtils.renderIntoDocument(
         <SchemaPropertyView
            schema={definition}
            editMode={'inline'}
            editable={true} />
      );

      expect(component.isValid()).toBeFalsy();
   });
});
