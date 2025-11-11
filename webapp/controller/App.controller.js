sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
  "use strict";

  return BaseController.extend("monitorfactura.project1.controller.App", {
      
      /**
       * Inicialización del controlador principal de la aplicación
       */
      onInit() {
          // Aquí se pueden inicializar modelos globales o configuraciones
          // que necesiten estar disponibles en toda la aplicación
          
          // Por ejemplo, un modelo para datos globales
          const oGlobalModel = new JSONModel({
              appTitle: "Monitor de Facturas",
              currentUser: "Usuario",
              isLoading: false
          });
          this.getView().setModel(oGlobalModel, "global");
      },

      /**
       * Método para mostrar/ocultar indicador de carga global
       * @param {boolean} bShow - true para mostrar, false para ocultar
       */
      setBusy(bShow) {
          const oGlobalModel = this.getView().getModel("global");
          if (oGlobalModel) {
              oGlobalModel.setProperty("/isLoading", bShow);
          }
      }
  });
});