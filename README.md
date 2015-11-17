# React Schema UI
Build schema-driven UIs in seconds.

## Basic Usage

```javascript
var todoSchema={
   "title" : "Todo",
   "type" : "object",
   "properties" : {
      "description" : "string",
      "completed" : "boolean"
   }
};

var TodoView=React.createClass({

   render: function(){
      return (
         <ReactSchemaView
            schema={todoSchema}
            editable={true} />
      );
   }
});
```

## Editing
React Schema includes built-in editing functionality.

### Usage
Configure the schema view using the editing properties.

#### Form
Like a traditional HTML form, all value containers are rendered as editable and changes are submitted as a whole to `onSubmit`.

#### Inline
All value containers are rendered as readable and editable.  When touched or clicked, the `editable` value container enters the `editing` state.  Only a single value container can be editing at a time.

When changes are committed, the change will be passed along immediately via `onChangeProperty`.
