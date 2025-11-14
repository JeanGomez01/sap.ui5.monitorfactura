sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("monitorfactura.project1.controller.Detalle", {

        onInit: function () {
            const oDetalleModel = new JSONModel({
                items: [],
                totalItems: 0,
                facturaSeleccionada: {}
            });
            this.getView().setModel(oDetalleModel, "detalle");
            this._cargarDetalleFactura();
        },

        _cargarDetalleFactura: function () {
            const oComponentModel = this.getOwnerComponent().getModel("mainView");
            if (oComponentModel) {
                const oFacturaSeleccionada = oComponentModel.getProperty("/selectedFactura");

                if (oFacturaSeleccionada) {
                    const oDetalleModel = this.getView().getModel("detalle");
                    oDetalleModel.setProperty("/facturaSeleccionada", oFacturaSeleccionada);

                    // Cargar datos de ejemplo para el detalle
                    this._cargarDatosDetalle(oFacturaSeleccionada);
                } else {
                    MessageToast.show("No hay factura seleccionada");
                }
            }
        },

        _cargarDatosDetalle: function (oFactura) {
            const aDetalles = [
                {
                    posFactura: "0010",
                    descripcion: "LAPTOP DELL LATITUDE 5430 CORE I5 8GB 256GB SSD",
                    cantidad: "2.000",
                    umb: "UN",
                    puSinIGV: "1,250.00",
                    puConIGV: "1,475.00",
                    totalConIGV: "2,950.00"
                },
                {
                    posFactura: "0020",
                    descripcion: "MOUSE INALAMBRICO LOGITECH M185",
                    cantidad: "5.000",
                    umb: "UN",
                    puSinIGV: "25.00",
                    puConIGV: "29.50",
                    totalConIGV: "147.50"
                },
                {
                    posFactura: "0030",
                    descripcion: "TECLADO USB STANDARD NEGRO",
                    cantidad: "3.000",
                    umb: "UN",
                    puSinIGV: "35.00",
                    puConIGV: "41.30",
                    totalConIGV: "123.90"
                }
            ];

            const oDetalleModel = this.getView().getModel("detalle");
            oDetalleModel.setProperty("/items", aDetalles);
            oDetalleModel.setProperty("/totalItems", aDetalles.length);

            this.byId("detallePage").setTitle(`Detalle - ${oFactura.referencia || oFactura.numeroFactura}`);
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainView");
        },

        onExportarDetalle: function () {
            const oDetalleModel = this.getView().getModel("detalle");
            const aItems = oDetalleModel.getProperty("/items");

            if (!aItems || aItems.length === 0) {
                MessageToast.show("No hay datos para exportar");
                return;
            }

            MessageToast.show(`Exportando ${aItems.length} items del detalle...`);
            console.log("Detalles a exportar:", aItems);
        },

        onBeforeExportDetalle: function (oEvent) {
            const oExportSettings = oEvent.getParameter("exportSettings");
            console.log("Configuración de exportación detalle:", oExportSettings);
        }
    });
});