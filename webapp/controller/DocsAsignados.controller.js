sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("monitorfactura.project1.controller.DocsAsignados", {

        onInit: function () {
            const oDocsModel = new JSONModel({
                documentos: [],
                totalDocumentos: 0,
                facturaSeleccionada: {}
            });
            this.getView().setModel(oDocsModel, "docs");
            this._cargarDocumentosAsignados();
        },

        _cargarDocumentosAsignados: function () {
            const oComponentModel = this.getOwnerComponent().getModel("mainView");
            if (oComponentModel) {
                const oFacturaSeleccionada = oComponentModel.getProperty("/selectedFactura");

                if (oFacturaSeleccionada) {
                    const oDocsModel = this.getView().getModel("docs");
                    oDocsModel.setProperty("/facturaSeleccionada", oFacturaSeleccionada);
                    this._cargarDatosDocumentos(oFacturaSeleccionada);
                } else {
                    MessageToast.show("No hay factura seleccionada");
                }
            }
        },

        _cargarDatosDocumentos: function (oFactura) {
            const aDocumentos = [
                {
                    pedido: "4500012345",
                    posPedido: "000010",
                    fechaIngreso: "15/10/2025",
                    guiaRemision: "T001-123456",
                    docMaterialPosic: "MAT-001-001",
                    descripcion: "LAPTOP DELL LATITUDE 5430 CORE I5",
                    cantidadSinIGV: "2.000",
                    moneda: "USD"
                },
                {
                    pedido: "4500012345",
                    posPedido: "000020",
                    fechaIngreso: "15/10/2025",
                    guiaRemision: "T001-123456",
                    docMaterialPosic: "MAT-002-001",
                    descripcion: "MOUSE INALAMBRICO LOGITECH",
                    cantidadSinIGV: "5.000",
                    moneda: "USD"
                },
                {
                    pedido: "4500012346",
                    posPedido: "000010",
                    fechaIngreso: "16/10/2025",
                    guiaRemision: "T001-123457",
                    docMaterialPosic: "MAT-003-001",
                    descripcion: "TECLADO USB STANDARD NEGRO",
                    cantidadSinIGV: "3.000",
                    moneda: "USD"
                }
            ];

            const oDocsModel = this.getView().getModel("docs");
            oDocsModel.setProperty("/documentos", aDocumentos);
            oDocsModel.setProperty("/totalDocumentos", aDocumentos.length);

            this.byId("docsAsignadosPage").setTitle(`Docs. Asignados - ${oFactura.referencia || oFactura.numeroFactura}`);
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainView");
        },

        onExportarDocs: function () {
            const oDocsModel = this.getView().getModel("docs");
            const aDocumentos = oDocsModel.getProperty("/documentos");

            if (!aDocumentos || aDocumentos.length === 0) {
                MessageToast.show("No hay datos para exportar");
                return;
            }

            MessageToast.show(`Exportando ${aDocumentos.length} documentos...`);
            console.log("Documentos a exportar:", aDocumentos);
        },

        onBeforeExportDocs: function (oEvent) {
            const oExportSettings = oEvent.getParameter("exportSettings");
            console.log("Configuración de exportación documentos:", oExportSettings);
        }
    });
});