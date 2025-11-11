sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("monitorfactura.project1.controller.MainView", {

        /**
         * Inicialización del controlador
         */
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteMainView").attachPatternMatched(this._onRouteMatched, this);

            const oLocalModel = new JSONModel({
                facturas: [],
                totalFacturas: 0
            });
            this.getView().setModel(oLocalModel, "facturas");
        },

        /**
         * Método llamado cuando se accede a esta ruta
         * @private
         */
        _onRouteMatched() {
            const oFiltrosModel = this.getOwnerComponent().getModel("filtros");

            if (oFiltrosModel) {
                const oFiltros = oFiltrosModel.getData();
                console.log("Filtros recibidos en MainView:", oFiltros);

                this._mostrarFiltrosAplicados(oFiltros);

                this._cargarDatos(oFiltros);
            } else {
                MessageToast.show("No hay filtros aplicados");
            }
        },

        /**
         * Navegar de vuelta a la vista de Filtros
         */
        onNavBack() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteFiltros");
        },

        /**
         * Mostrar los filtros aplicados en un mensaje
         * @private
         * @param {object} oFiltros - Objeto con los filtros aplicados
         */
        _mostrarFiltrosAplicados(oFiltros) {
            let sMensaje = "Filtros aplicados:\n";
            sMensaje += `- Sociedad: ${oFiltros.sociedad || "N/A"}\n`;

            if (oFiltros.division || oFiltros.divisionA) {
                sMensaje += `- División: ${oFiltros.division || ""} ${oFiltros.divisionA ? "a " + oFiltros.divisionA : ""}\n`;
            }

            if (oFiltros.proveedor || oFiltros.proveedorA) {
                sMensaje += `- Proveedor: ${oFiltros.proveedor || ""} ${oFiltros.proveedorA ? "a " + oFiltros.proveedorA : ""}\n`;
            }

            sMensaje += `- Tipo: ${this._formatTipoDocumento(oFiltros.tipoDocumento)}`;

            console.log(sMensaje);
        },

        /**
         * Cargar datos basados en los filtros
         * @private
         * @param {object} oFiltros - Filtros a aplicar
         */
        _cargarDatos(oFiltros) {
            const aFacturasEjemplo = [
                {
                    id: "1",
                    selected: false,
                    estado: "Aprobada",
                    escenario: "ESC1",
                    sociedad: oFiltros.sociedad || "S001",
                    codigo: "COD001",
                    rucProveedor: "20100055517",
                    proveedor: oFiltros.proveedor || "PROVEEDOR A",
                    nombre: "EMPRESA COMERCIAL S.A.",
                    condPago: "CONTADO",
                    tipoDoc: "FACTURA",
                    referencia: "FAC-2025-001-12345",
                    fechaEmision: "01/11/2025",
                    fechaRegistro: "02/11/2025",
                    fechaVencimiento: "30/11/2025",
                    fechaBase: "01/11/2025",
                    fechaContable: "02/11/2025",
                    numeroDocLogistico: "DOC-LOG-001",
                    ejercicio: "2025"
                },
                {
                    id: "2",
                    selected: false,
                    estado: "Pendiente",
                    escenario: "ESC2",
                    sociedad: oFiltros.sociedad || "S002",
                    codigo: "COD002",
                    rucProveedor: "20100066628",
                    proveedor: oFiltros.proveedor || "PROVEEDOR B",
                    nombre: "SERVICIOS INTEGRALES S.A.C.",
                    condPago: "CREDITO",
                    tipoDoc: "BOLETA",
                    referencia: "BOL-2025-002-67890",
                    fechaEmision: "02/11/2025",
                    fechaRegistro: "03/11/2025",
                    fechaVencimiento: "02/12/2025",
                    fechaBase: "02/11/2025",
                    fechaContable: "03/11/2025",
                    numeroDocLogistico: "DOC-LOG-002",
                    ejercicio: "2025"
                },
                {
                    id: "3",
                    selected: false,
                    estado: "Observada",
                    escenario: "ESC3",
                    sociedad: oFiltros.sociedad || "S003",
                    codigo: "COD003",
                    rucProveedor: "20100077739",
                    proveedor: oFiltros.proveedor || "PROVEEDOR C",
                    nombre: "DISTRIBUIDORA NACIONAL E.I.R.L.",
                    condPago: "30 DIAS",
                    tipoDoc: "FACTURA",
                    referencia: "FAC-2025-003-54321",
                    fechaEmision: "03/11/2025",
                    fechaRegistro: "04/11/2025",
                    fechaVencimiento: "03/12/2025",
                    fechaBase: "03/11/2025",
                    fechaContable: "04/11/2025",
                    numeroDocLogistico: "DOC-LOG-003",
                    ejercicio: "2025"
                }
            ];

            const oModel = this.getView().getModel("facturas");
            oModel.setProperty("/facturas", aFacturasEjemplo);
            oModel.setProperty("/totalFacturas", aFacturasEjemplo.length);

            MessageToast.show(`Se encontraron ${aFacturasEjemplo.length} facturas`);
        },

        /**
         * Formatear el tipo de documento para mostrar
         * @private
         * @param {string} sTipo - Tipo de documento
         * @returns {string} Texto formateado
         */
        _formatTipoDocumento(sTipo) {
            const mTipos = {
                "FacturaSuministro": "Factura de Suministro",
                "FacturaServicios": "Factura de Servicios",
                "SinReferencia": "Factura sin Referencia",
                "NotaCredito": "Nota de Crédito"
            };
            return mTipos[sTipo] || sTipo;
        },

        /**
         * Evento al cambiar selección en la tabla
         * @param {sap.ui.base.Event} oEvent - Evento de selección
         */
        onSelectionChange(oEvent) {
            const oSelectedItem = oEvent.getParameter("listItem");
            if (oSelectedItem) {
                const oContext = oSelectedItem.getBindingContext("facturas");
                if (oContext) {
                    const oFactura = oContext.getObject();
                    MessageToast.show(`Factura seleccionada: ${oFactura.referencia}`);

                    const oModel = this.getView().getModel("facturas");
                    const sPath = oContext.getPath();
                    oModel.setProperty(sPath + "/selected", true);

                    this._updateSelectionState();
                }
            }
        },

        /**
         * Evento al seleccionar checkbox individual
         * @param {sap.ui.base.Event} oEvent - Evento del checkbox
         */
        onCheckboxSelect(oEvent) {
            const bSelected = oEvent.getParameter("selected");
            const oCheckBox = oEvent.getSource();
            const oContext = oCheckBox.getBindingContext("facturas");

            if (oContext) {
                const oModel = this.getView().getModel("facturas");
                const sPath = oContext.getPath();
                oModel.setProperty(sPath + "/selected", bSelected);

                this._updateSelectionState();
            }
        },

        /**
         * Evento al seleccionar/deseleccionar todos los checkboxes
         * @param {sap.ui.base.Event} oEvent - Evento del checkbox header
         */
        onSelectAll(oEvent) {
            const bSelected = oEvent.getParameter("selected");
            const oModel = this.getView().getModel("facturas");
            const aFacturas = oModel.getProperty("/facturas");

            aFacturas.forEach((oFactura, index) => {
                oModel.setProperty(`/facturas/${index}/selected`, bSelected);
            });

            this._updateSelectionState();

            MessageToast.show(bSelected ? "Todos los registros seleccionados" : "Todos los registros deseleccionados");
        },

        /**
         * Actualizar el estado de selección en el modelo
         * @private
         */
        _updateSelectionState() {
            const oModel = this.getView().getModel("facturas");
            const aFacturas = oModel.getProperty("/facturas");
            const oMainViewModel = this.getView().getModel("mainView");

            // Verificar si hay al menos un checkbox seleccionado
            const bHasSelection = aFacturas.some(oFactura => oFactura.selected === true);

            // Obtener los registros seleccionados
            const aSelected = aFacturas.filter(oFactura => oFactura.selected === true);

            oMainViewModel.setProperty("/hasSelection", bHasSelection);

            if (aSelected.length === 1) {
                oMainViewModel.setProperty("/selectedFactura", aSelected[0]);
            } else {
                oMainViewModel.setProperty("/selectedFactura", null);
            }

            console.log(`${aSelected.length} factura(s) seleccionada(s)`);
        },

        /**
         * Manejar el evento beforeRebindTable del SmartTable
         * @param {sap.ui.base.Event} oEvent - Evento beforeRebindTable
         */
        onBeforeRebindTable(oEvent) {
            // Aquí puedes manipular los binding parameters si es necesario
            const mBindingParams = oEvent.getParameter("bindingParams");
            console.log("Binding params antes del rebind:", mBindingParams);
        },

        /**
         * Manejar el evento beforeExport del SmartTable
         * @param {sap.ui.base.Event} oEvent - Evento beforeExport
         */
        onBeforeExport(oEvent) {
            // Configurar opciones de exportación si es necesario
            const oExportSettings = oEvent.getParameter("exportSettings");
            console.log("Configuración de exportación:", oExportSettings);
        },

        // Métodos de los botones (mantener los que ya tienes)
        onPosFactura() {
            MessageToast.show("Pos. Factura - Función en desarrollo");
        },

        onDocsAsignados() {
            MessageToast.show("Docs. Asignados - Función en desarrollo");
        },

        onProRegistrar() {
            MessageToast.show("Pro-Registrar - Función en desarrollo");
        },

        onContabilizar() {
            MessageToast.show("Contabilizar - Función en desarrollo");
        },

        onVerDocumentoSAP() {
            MessageToast.show("Ver Documento SAP - Función en desarrollo");
        },

        onVerLog() {
            MessageToast.show("Log de Ejecución - Función en desarrollo");
        },

        onFacturaObservada() {
            MessageToast.show("Factura Observada - Función en desarrollo");
        },

        onOpcionMas() {
            MessageToast.show("Opción Más - Función en desarrollo");
        },

        /**
         * Exportar datos a Excel (simulado)
         */
        onExportar() {
            const oModel = this.getView().getModel("facturas");
            const aFacturas = oModel.getProperty("/facturas");

            if (!aFacturas || aFacturas.length === 0) {
                MessageToast.show("No hay datos para exportar");
                return;
            }

            MessageToast.show(`Exportando ${aFacturas.length} factura(s)...`);
            console.log("Datos a exportar:", aFacturas);
        }
    });
});