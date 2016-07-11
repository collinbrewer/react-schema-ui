var React=require("react");
var SchemaEntityView=require("../../dist/index.js").SchemaEntityView;
var DateValueEditor=require("./date-value-editor.js");

var Demo=React.createClass({

   render: function(){

      var schema={
         schemaType: "object",
         properties: [
            {
               "schemaType" : "property",
               "name":"firstName",
               "type":"string"
            },

            {
               "schemaType" : "property",
               "name":"lastName",
               "type":"string"
            },

            {
               "schemaType" : "property",
               "name": "age",
               "type" : "number"
            },

            {
               "schemaType" : "property",
               "name":"dateCreated",
               "type":"date",
               "meta" : {
                  "displayName" : "Created On"
               }
            },

            {
               "schemaType" : "property",
               "name":"completed",
               "type":"boolean"
            }
         ]
      };

      var object=this.object;

      if(!object)
      {
         object={
            firstName: "Chris",
            lastName: "Ericson"
         };

         this.object=object;
      }

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
         else if(p.getType()==="boolean")
         {
            d=v ? "Yes" : "No";
         }

         return d;
      };

      return (
         <div className="container" style={{paddingTop:"64px"}}>
            <div className="row">
               <div className="col-xs-12 text-center">
                  <h1>React Schema UI</h1>
               </div>
            </div>
            <div className="row" style={{paddingTop:"64px"}}>
               <div className="col-xs-12 col-sm-4">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h2 className="panel-title">Readonly Viewer</h2>
                     </div>
                     <div className="panel-body">
                        <SchemaEntityView
                           key={1}
                           schema={schema}
                           displayValueTransformer={dateTransformer}
                           value={object} />
                     </div>
                  </div>
               </div>
               <div className="col-xs-12 col-sm-4">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h2 className="panel-title">Form Editor</h2>
                     </div>
                     <div className="panel-body">
                        <SchemaEntityView
                           key={2}
                           schema={schema}
                           value={object}
                           editMode="form"
                           editable={true}
                           displayValueTransformer={dateTransformer}
                           onChangeProperty={this.handleChangeProperty} />
                     </div>
                  </div>
               </div>
               <div className="col-xs-12 col-sm-4">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h2 className="panel-title">Inline Editor</h2>
                     </div>
                     <div className="panel-body">
                        <SchemaEntityView
                           key={3}
                           schema={schema}
                           value={object}
                           editMode="inline"
                           editable={true}
                           displayValueTransformer={dateTransformer}
                           onChangeProperty={this.handleChangeProperty}
                           onWantsEditProperty={this.handleWantsEditProperty} />
                     </div>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-xs-12 col-sm-4">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h2 className="panel-title">Floating Labels Editor</h2>
                        <span className="text-muted">Using Custom CSS</span>
                     </div>
                     <div className="panel-body">
                        <SchemaEntityView
                           className="floating-label"
                           key={3}
                           schema={schema}
                           value={object}
                           editMode="inline"
                           inlineCancelComponent={<i className="icon ion-ios-close-outline" />}
                           inlineConfirmComponent={<i className="icon ion-ios-checkmark-outline" />}
                           editable={true}
                           displayValueTransformer={dateTransformer}
                           onChangeProperty={this.handleChangeProperty}
                           onWantsEditProperty={this.handleWantsEditProperty} />
                     </div>
                  </div>
               </div>
               <div className="col-xs-12 col-sm-4">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h2 className="panel-title">Styled Viewer</h2>
                        <span className="text-muted">Using Custom CSS</span>
                     </div>
                     <div className="panel-body">
                        <SchemaEntityView
                           className="styled-viewer"
                           key={3}
                           schema={schema}
                           value={object}
                           displayValueTransformer={dateTransformer} />
                     </div>
                  </div>
               </div>
               <div className="col-xs-12 col-sm-4">
                  <div className="panel panel-default">
                     <div className="panel-heading">
                        <h2 className="panel-title">Custom Inline Editors</h2>
                     </div>
                     <div className="panel-body">
                        <SchemaEntityView
                           key={3}
                           schema={schema}
                           value={object}
                           editMode="inline"
                           editable={true}
                           editors={{
                              "date" : DateValueEditor
                           }}
                           displayValueTransformer={dateTransformer}
                           onChangeProperty={this.handleChangeProperty}
                           onWantsEditProperty={this.handleWantsEditProperty} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   },

   handleWantsEditProperty: function(property){

      var propertyName=property.getName();

      if(propertyName==="completed")
      {
         var d=prompt("Intercepted request to edit property!! \n\nPlease type yes or no:");

         if(d)
         {
            this.object["completed"]=(d.toLowerCase()==="yes");

            this.forceUpdate();
         }

         return false;
      }
   },

   handleChangeProperty: function(property, value){

      this.object[property.getName()]=value;

      this.forceUpdate();
   }
});

module.exports=Demo;
