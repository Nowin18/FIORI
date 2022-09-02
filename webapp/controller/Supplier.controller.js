sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
    
    
], function(BaseController, JSONModel) {
    "use strict";
    
    return BaseController.extend("projectv2.controller.Supplier", {

        onInit: function () {
            var oViewModel = new JSONModel({
                busy : false,
                delay : 0
            });

            this.getRouter().getRoute("supp").attachPatternMatched(this._onObjectMatched, this);

            this.getView().setModel(oViewModel, "supplierView");
        },

        onPressBack: function(oEvent){
            this.getModel('supplierView').setProperty("/busy", true);
            const clickedItem = oEvent.getSource().getBindingContext().getObject()
        
            this.getRouter().navTo("list", {
                objectId: clickedItem.ID
            })
        },
        
        _onObjectMatched: function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            this.getModel("appView").setProperty("/layout", "OneColumn");
            this.getModel().metadataLoaded().then( function() {
                this._bindView("/Products("+ sObjectId + ")");
            }.bind(this));
        },
        _bindView: function (sObjectPatch) {
            this.getView().bindElement({
                path : sObjectPatch,
                parameters : {
                    expand : "Supplier"
                }
            });
        }
    })
});