What is React Schema UI?
========================
**Build schema-driven UIs, *in seconds*.**

Simplest Usage
-----------

```javascript
// The schema describes the value that should be displayed
var schemaDefinition={
   schemaType : "object",
   properties: [
      {
         schemaType: "property",
         name: "title",
         type: ""
      }
   ]
};

let TodoView=React.createClass({
   render() {
      return (
         <ReactSchemaView
            schema={schemaDefinition}
            value={todo}
            editable={true} />
      );
   }
});
```

Editing
-------
React Schema UI includes built-in editing functionality and acts as a [controlled component](https://facebook.github.io/react/docs/forms.html).

#### Form
The default editing mode, `form`, behaves like a traditional HTML form; that is, all value containers are rendered as editable and changes are submitted as a whole to `onChange`.

```js
let TodoView=React.createClass({
   render() {
      return (
         <ReactSchemaView
            schema={schema}
            editable={true}
            value={todo}
            onChange={this.handleChange}
             />
      );
   }

   handleChange(e) {
      todoStore.upsert(e.getValue()); // this will trickle back down
   }
});
```

#### Inline
All value containers are rendered as readable and editable.  When touched or clicked, the `editable` value container enters the `editing` state.  Only a single value container can be editing at a time.

When changes are committed, the change will be passed along immediately via `onChangeProperty`.


Extensibility
-------------

### Value Modifiers
It is not uncommon for raw data to need modification before presentation to the end user.  RSUI supports value modifiers to handle these needs:

```js
let TodoView=React.createClass({
   render() {
      return (
         <ReactSchemaView
            schema={todoSchema}
            editable={true} />
      );
   }
});
```

### Custom Viewers and Editors
Often custom viewers or editors are desired for dealing with specialized data types.  For this, the `viewers` and `editors` props can be used to provide custom components for viewing and editing data.

These components must conform to the `ValueViewer` protocol and if needed, the `ValueEditor` protocol.

```js
let TodoView=React.createClass({
   render() {
      return (
         <ReactSchemaView
            schema={todoSchema}
            editable={true}
            viewers={
               "custom-datatype" : CustomDatatypeViewer
            }
            editors={
               "custom-datatype" : CustomDatatypeEditor
            }
         />
      );
   }
});
```

If more fine-grained control is needed, the `renderValueViewer` and `renderValueEditor` props will be called to render the respective component.
