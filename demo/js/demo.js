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
                        "displayName" : "Created On"
                     }
                  },

                  {
                     "name":"creator",
                     "type":"relationship",
                     "entityName" : "User",
                  },

                  {
                     "name":"completed",
                     "type":"boolean"
                  }
               ]
            },

            {
               "name" : "User",
               "properties" : [
                  {
                     "name" : "name",
                     "type" : "string"
                  }
               ],
               "meta" : {
                  displayValuePointer: "name"
               }
            }
         ]
      });

      var todo=this.todo;

      if(!todo)
      {
         todo={
            title: "Use RSUI!",
            creator : {
               name: "Chris Ericson"
            }
         };

         this.todo=todo;
      }

      var todoEntitySchema=objectGraphSchema.getEntitiesByName()["Todo"];

      var dateTransformer=function(p, v, d){

         if(p.getType()==="attribute" && p.getAttributeType()==="date")
         {
            if(v)
            {
               console.log("custom transformer: ", arguments);
               console.log("transforming: ", v);
               d=["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][v.getMonth()] + " " +
                 v.getDate() + ", " + v.getFullYear();
            }
         }

         return d;
      };

      return (
         <div className="container">
            <div className="row">
               <div className="col-xs-12">
                  <h1>Readonly</h1>
                  <SchemaEntityView
                     key={1}
                     entity={todoEntitySchema}
                     displayValueTransformer={dateTransformer}
                     object={todo} />
               </div>
            </div>
            <div className="row">
               <div className="col-xs-12">
                  <h1>Form Editing</h1>
                  <SchemaEntityView
                     key={2}
                     entity={todoEntitySchema}
                     object={todo}
                     editMode="form"
                     editing={true}
                     displayValueTransformer={dateTransformer}
                     onChangeProperty={this.handleChangeProperty} />
               </div>
            </div>
            <div className="row">
               <div className="col-xs-12">
                  <h1>Inline Editing</h1>
                  <SchemaEntityView
                     key={3}
                     entity={todoEntitySchema}
                     object={todo}
                     editMode="inline"
                     editable={true}
                     displayValueTransformer={dateTransformer}
                     onChangeProperty={this.handleChangeProperty}
                     onWantsEditProperty={this.handleWantsEditProperty} />
               </div>
            </div>
         </div>
      );
   },

   handleWantsEditProperty: function(property){

      var propertyName=property.getName();

      if(propertyName==="dateCreated")
      {
         var d=prompt("Intercepted request to edit property!! \n\nPlease type a date in format YYYY-MM-DD:");

         if(d)
         {
            this.todo["dateCreated"]=new Date(d.substr(0, 4), (+d.substr(5, 2))-1, d.substr(8, 2));

            this.forceUpdate();
         }

         return false;
      }
   },

   handleChangeProperty: function(property, value){

      this.todo[property.getName()]=value;

      this.forceUpdate();
   }
});

module.exports=Demo;
