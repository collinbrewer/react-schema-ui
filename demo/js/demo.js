var React=require("react");
var ObjectGraphSchema=require("object-graph-schema");

var ReactSchemaUI=require("../../index.js");
var SchemaEntityView=ReactSchemaUI.SchemaEntityView;

var Demo=React.createClass({

   render: function(){

      var objectGraphSchema=new ObjectGraphSchema({
         entities: [
            {
               "name":"Todo",
               "properties":[
                  {
                     "name":"title",
                     "type":"string"
                  },

                  {
                     "name" : "description",
                     "type" : "string",
                     "meta" : {
                        "placeholder" : "A short description",
                        "displayType" : "textarea"
                     }
                  },

                  {
                     "name":"dateCreated",
                     "type":"date",
                     "meta" : {
                        "displayName" : "Created On",
                        "placeholder" : "mm-dd-yy"
                     }
                  },

                  {
                     "name":"completed",
                     "type":"boolean"
                  }
               ]
            }
         ]
      });

      var todo={
         title: "Use RSUI!",
      };

      var todoEntitySchema=objectGraphSchema.getEntitiesByName()["Todo"];

      return (
         <div className="container">
            <div className="row">
               <div className="col-xs-12">
                  <h1>Readonly</h1>
                  <SchemaEntityView
                     entity={todoEntitySchema}
                     object={todo} />
               </div>
            </div>
            <div className="row">
               <div className="col-xs-12">
                  <h1>Form Editing</h1>
                  <SchemaEntityView
                     entity={todoEntitySchema}
                     object={todo}
                     editMode="form"
                     editing={true}
                     onChangeProperty={this.handleChangeProperty} />
               </div>
            </div>
            <div className="row">
               <div className="col-xs-12">
                  <h1>Inline Editing</h1>
                  <SchemaEntityView
                     entity={todoEntitySchema}
                     object={todo}
                     editMode="inline"
                     editable={true}
                     onChangeProperty={this.handleChangeProperty} />
               </div>
            </div>
         </div>
      );
   },

   handleChangeProperty: function(property, value){

      console.log(arguments);

   }
});

module.exports=Demo;
