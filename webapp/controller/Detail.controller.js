sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
    "sap/m/library"
    
], function (BaseController, JSONModel, formatter, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("projectv2.controller.Detail", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy : true,
                delay : 0,
                lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
            });

            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

            this.getView().setModel(oViewModel, "detailView");

            this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        handleRowPress: function(oEvent){
            this.getModel('detailView').setProperty("/busy", true);
            const clickedItem = oEvent.getSource().getBindingContext().getObject()

            this.getRouter().navTo("supp", {
                objectId : clickedItem.ID
            })
        },

        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        onSendEmailPress: function () {
            var oViewModel = this.getModel("detailView");

            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        },

        
        /**
         * Updates the item count within the line item table's header
         * @param {object} oEvent an event containing the total number of items in the list
         * @private
         */
        
        onListUpdateFinished: function (oEvent) {
            var sTitle,
            iTotalItems = oEvent.getParameter("total"),
            oViewModel = this.getModel("detailView");
            
            // only update the counter if the length is final
            if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
                if (iTotalItems) {
                    sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
                } else {
                    //Display 'Line Items' instead of 'Line items (0)'
                    sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
                }
                oViewModel.setProperty("/lineItemListTitle", sTitle);
            }
        },
        
        
        handleRowPress: function(oEvent){
            this.getModel('detailView').setProperty("/busy", true);
            const clickedItem = oEvent.getSource().getBindingContext().getObject()
        
            this.getRouter().navTo("supp", {
                objectId: clickedItem.ID
            })
        },
        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */

        /**
         * Binds the view to the object path and expands the aggregated line items.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        /**
         * Binds the view to the object path. Makes sure that detail view displays
         * a busy indicator while data for the corresponding element binding is loaded.
         * @function
         * @param {string} sObjectPath path to the object to be bound to the view.
         * @private
         */

        _onObjectMatched: function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            this.getModel().metadataLoaded().then( function() {
                var sObjectPath = this.getModel().createKey("Categories", {
                    ID:  sObjectId
                });
                this._bindView("/" + sObjectPath);
            }.bind(this));
        },

        _bindView: function (sObjectPath) {
            // Set busy indicator during view binding
            var oViewModel = this.getModel("detailView");
            // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
            oViewModel.setProperty("/busy", false);
            this.getView().bindElement({
                path : sObjectPath,
                events: {
                    change : this._onBindingChange.bind(this),
                    dataRequested : function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    
                    },
                parameters : {
                    expand : "Supplier"
                }
                }
            });
        },
         /**
         * ------------------------------------------------------------------------------------------------------------
         * DELETE Product
         */
        // onDeleteClickP: function(oEvent){
        //     const clickedItemPath = oEvent.getSource().getBindingContext().getPath()
        //     var oModel = this.getView().getModel();
        //         debugger;
        //     oModel.remove(clickedItemPath, {
        //         success: function(data){
        //             MessageBox.success("Product has been deleted!", {
        //                 title: "Success!"
        //             })
        //         },
        //         error: function(e){
        //             alert("Error!");
        //         }
        //     });
        // },
        _onButtonPress: function(oEvent) {
            
            
          //  
            var sssd = oEvent.getSource().getBindingContext().getPath();
			var oSource = oEvent.getSource();
			var oSourceBindingContext = oSource.getBindingContext();
            var oCtxo = oSourceBindingContext.getDeepPath();
            var cooto = oSourceBindingContext.getModel().getBindings();
            var watafaq = oSourceBindingContext.getModel();
           
			return new Promise(function(fnResolve, fnReject) {
				if (oSourceBindingContext) {
					var oModel = oSourceBindingContext.getModel();
					 oModel.remove(oSourceBindingContext.getPath() /*oSourceBindingContext.getPath()*/, {
						success: function() {
							oModel.refresh();
							fnResolve();
						},
						error: function() {
							oModel.refresh();
							fnReject(new Error("remove failed"));
						}
					});
				}
			}).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
              
        /*------------------------------------------------------------------------------------------------------------
        */
        _onBindingChange: function () {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("detailObjectNotFound");
                // if object could not be found, the selection in the list
                // does not make sense anymore.
                this.getOwnerComponent().oListSelector.clearListListSelection();
                return;
            }

            var sPath = oElementBinding.getPath(),
                oResourceBundle = this.getResourceBundle(),
                oObject = oView.getModel().getObject(sPath),
                sObjectId = oObject.ID,
                sObjectName = oObject.Name,
                oViewModel = this.getModel("detailView");

            this.getOwnerComponent().oListSelector.selectAListItem(sPath);

            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        _onMetadataLoaded: function () {
            // Store original busy indicator delay for the detail view
            var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
                oViewModel = this.getModel("detailView"),
                oLineItemTable = this.byId("lineItemsList"),
                iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

            // Make sure busy indicator is displayed immediately when
            // detail view is displayed for the first time
            oViewModel.setProperty("/delay", 0);
            oViewModel.setProperty("/lineItemTableDelay", 0);

            oLineItemTable.attachEventOnce("updateFinished", function() {
                // Restore original busy indicator delay for line item table
                oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
            });

            // Binding the view will set it to not busy - so the view is always busy if it is not bound
            oViewModel.setProperty("/busy", true);
            // Restore original busy indicator delay for the detail view
            oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
        },

        /**
         * Set the full screen mode to false and navigate to list page
         */
        onCloseDetailPress: function () {
            this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
            // No item should be selected on list after detail page is closed
            this.getOwnerComponent().oListSelector.clearListListSelection();
            this.getRouter().navTo("list");
        },

        /**
         * Toggle between full and non full screen mode.
         */
        toggleFullScreen: function () {
            var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
            if (!bFullScreen) {
                // store current layout and go full screen
                this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
                this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
            } else {
                // reset to previous layout
                this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
            }
        },

        /**
         * create new product (name, description, release date, discontinued date, rating, price, category, supplier)
         */
        onAddProductClick: function(oEvent) {
            this.getRouter().navTo("form", null)
        },

        onCategoryUpdateClick: function(){
            this.oApproveDialog = new Dialog({
                type: DialogType.Message,
                title: "Update Category",
                content: new Input({
                    id: "nameInput",
                    value: prevname
                }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Submit",
                    press: function(){
                        const newName = this.oApproveDialog.getContent()[0].getValue()
                        oModel.read("/Categories", {
                            success: function(data){
                                console.log(data.results)
                                const isNameFree = !data.results?.find(cat => cat.Name === newName);

                                if(isNameFree){
                                    this._updateConfirmDialog(prevName, newName, itemPath);
                                } else{
                                    console.log("is not free")
                                    MessageBox.error("Category with that name already exists!", {
                                        title: "Error"
                                    })
                                }
                                this.oApproveDialog.destroy();
                            }.bind(this),
                            error: function (error) {
                                console.log(error)
                            }
                        });
                    }.bind(this)
                }),
                endButhon: new Button({
                    text: "Cancel",
                    press: function () {
                        this.oApproveDialog.destroy();
                    }.bind(this)
                })
                }),
                this.oApproveDialog.open();
        },

        _updateConfirmDialog: function(prevName,newName){
            var oModel = this.getView().getModel();
            
            this.oConfirmDialog = new Dialog({
                    type: DialogType.Message,
                    title: "Confirmation",
                    content: new Text({
                        text: `Are you sure you want to rename category from ${prevName} to ${newName}?`
                    }),
                    beginButton: new Button({
                        type: ButtonType.Accept,
                        text: "Yes",
                        press: function(){
                            var oCat = {"Name": newName}
                            oModel.update(this.getPath(), oCat, {
                                merge: true,
                                success: function () {MessageToast.show("Success!");},
                                error: function (oError) {MessageToast.show("Something went wrong :c");}
                            });
                            this.oConfirmDialog.destroy();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "No",
                        type: ButtonType.Reject,
                        press: function () {
                            this.oConfirmDialog.destroy();
                        }.bind(this)
                    })
            });
            this.oConfirmDialog.open();
        },

        onCategoryUpdateClick1: function(oEvent){
            var oModel = this.getView().getModel();
            const itemContext = oEvent.getSource().getBindingContext()
            const itemPath = itemContext.getPath();
            const itemObject = itemContext();
            const prevName = itemObject.Name;

            this.oApproveDialog = new Dialog({
                type: DialogType.Message,
                title: "Update",
                content: new Input({
                    id: "nameInput",
                    value: prevname
                }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Submit",
                    press: function() {
                        const newName = this.oApproveDialog.getContent()[0].getValue()
                        oModel.read("/Categories", {
                            success: function(data){
                                console.log(data.results)
                                const isNameFree = !data.results?.find(cat => cat.Name === newName);

                                if(isNameFree){
                                    this._updateConfirmDialog(prevName, newName, itemPath);
                                } else{
                                    console.log("is not free")
                                    MessageBox.error("Category with that name already exists!", {
                                        title: "Error"
                                    })
                                }
                                this.oApproveDialog.destroy();
                            }.bind(this),
                            error: function (error) {
                                console.log(error)
                            }
                        });
                    }.bind(this)
                }),
                endButhon: new Button({
                    text: "Cancel",
                    press: function () {
                        this.oApproveDialog.destroy();
                    }.bind(this)
                })
                }),
                this.oApproveDialog.open();
        },

        _updateConfirmDialog1: function(prevName,newName,itemPath){
            var oModel = this.getView().getModel();
            
            this.oConfirmDialog = new Dialog({
                    type: DialogType.Message,
                    title: "Confirmation",
                    content: new Text({
                        text: `Are you sure you want to rename category from ${prevName} to ${newName}?`
                    }),
                    beginButton: new Button({
                        type: ButtonType.Accept,
                        text: "Yes",
                        press: function(){
                            var oCat = {"Name": newName}
                            oModel.update(itemPath, oCat, {
                                merge: true,
                                success: function () {MessageToast.show("Success!");},
                                error: function (oError) {MessageToast.show("Something went wrong :c");}
                            });
                            this.oConfirmDialog.destroy();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "No",
                        type: ButtonType.Reject,
                        press: function () {
                            this.oConfirmDialog.destroy();
                        }.bind(this)
                    })
            });
            this.oConfirmDialog.open();
        }
    });

});