sap.ui.define([
    "./BaseController",
<<<<<<< HEAD
    "sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
    "use strict";
    
    return BaseController.extend("projectv2.controller.Supplier", {

        onInit: function () {
            var oViewModel = new JSONModel({
                busy : false,
                delay : 0
            });

=======
    "sap/ui/model/json/JSONModel",

], function (BaseController, JSONModel){
    "use strict";

    return BaseController.extend("masterdetail.controller.Supplier", {

        onInit: function () {
            var oViewModel = new JSONModel({
                bust : false,
                delay : 0
            })
        
>>>>>>> 190bc2ebaacb91c4d268b20d89485a07efc9d18f
            this.getRouter().getRoute("supp").attachPatternMatched(this._onObjectMatched, this);

            this.setModel(oViewModel, "supplierView");
        },

        _onObjectMatched: function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            this.getModel("appView").setProperty("/layout", "OneColumn");
            this.getModel().metadataLoaded().then( function() {
<<<<<<< HEAD
                this._bindView("/Products("+ sObjectId + ")");
            }.bind(this));
        },
        _bindView: function (sObjectPatch) {
            this.getView().bindElement({
                path : sObjectPatch,
                parameters : {
                    expand : "Supplier"
                }
=======
                this._bindView("/Products("+ sObjectId + ")/Supplier");
            }.bind(this));
        },
        _bindView: function (sObjectPath) {
            this.getView().bindElement({
                path : sObjectPath
>>>>>>> 190bc2ebaacb91c4d268b20d89485a07efc9d18f
            });
        }
    })
});