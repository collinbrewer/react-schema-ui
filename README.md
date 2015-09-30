# React Schema UI
Build Schema-driven UIs in seconds

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
