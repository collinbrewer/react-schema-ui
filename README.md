What is React Schema UI?
------------------------
[![npm](https://img.shields.io/npm/v/react-schema-ui.svg?maxAge=2592000)](https://www.npmjs.com/package/react-schema-ui)
[![Build Status](https://img.shields.io/travis/collinbrewer/react-schema-ui/master.svg)](https://travis-ci.org/collinbrewer/react-schema-ui)
[![Coverage Status](https://img.shields.io/coveralls/collinbrewer/react-schema-ui/master.svg)](https://coveralls.io/github/collinbrewer/react-schema-ui?branch=master)
[![Dependency Status](https://img.shields.io/david/collinbrewer/react-schema-ui/master.svg)](https://david-dm.org/collinbrewer/react-schema-ui.svg)

Build schema-driven UIs, *in seconds*.

React Schema UI offers:
- Outputs beautiful, semantic viewers and editors
- Plain JSON schemas offer portability and flexible output
- Easy to style with CSS
- Extensible viewers/editors

Usage
-------

**Install the package**
```sh
npm install react-schema-ui -S
```

**Import sensible CSS default**
```css
@import url('./src/css/core.css');
```

**Provide a schema**

```javascript
// The schema describes the value that should be displayed
var schemaDefinition={
   schemaType : 'object',
   properties: [
      {
         schemaType: 'property',
         name: 'title',
         type: 'string'
      }
   ]
};
```

**Generate a UI!**
```js
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
            value={this.props.todo}
            onChange={this.handleChange}
             />
      );
   }

   handleChange(e) {
      todoStore.upsert(e.getValue());
   }
});
```

#### Inline
All value containers are rendered as readable and editable.  When touched or clicked, the `editable` value container enters the `editing` state.  This mode aims to keep only a single value container in the editing state at any given time.

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
            propertyEditors={
               'propertyName' : CustomEditor
            }
         />
      );
   }
});
```

If more fine-grained control is needed, the `renderValueViewer` and `renderValueEditor` props will be called to render the respective component.

```js
let renderCustomViewer = (propertySchema, value) {
   return (<div id='#custom'>{value}</div>);
};

<ReactSchemaView
   schema={todoSchema}
   renderValueViewer={renderCustomViewer} />
```

#### ValueViewer and ValueEditor Protocol
The protocol is very simple:

- Viewers are provided with a `value` prop to be displayed.
- Editors are provided an `onChange` prop that should be called when changes are made to the value.
