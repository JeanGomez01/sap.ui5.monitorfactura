sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
], (Controller, MessageToast, JSONModel, Filter, FilterOperator, MessageBox) => {
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

            const oMainViewModel = new JSONModel({
                hasSelection: false,
                selectedFactura: null,
                tableWidth: "auto",
                showScrollIndicator: true,
                mostrarContabilizar: true
            });
            this.getView().setModel(oMainViewModel, "mainView");
        },

        /**
         * Método llamado cuando se accede a esta ruta
         * @private
         */
        _onRouteMatched() {
            const oFiltrosModel = this.getOwnerComponent().getModel("filtros");

            if (oFiltrosModel) {
                const oFiltros = oFiltrosModel.getData();

                this._mostrarFiltrosAplicados(oFiltros);
                this._cargarDatos(oFiltros);
                
                // Controlar visibilidad del botón Contabilizar según tipo de documento
                const oMainViewModel = this.getView().getModel("mainView");
                const bMostrarContabilizar = oFiltros.tipoDocumento !== "SinReferencia";
                oMainViewModel.setProperty("/mostrarContabilizar", bMostrarContabilizar);

                this._adjustTableWidth();
            } else {
                MessageToast.show("No hay filtros aplicados");
            }
        },

        /**
         * Ajustar el ancho de la tabla basado en el contenido
         * @private
         */
        _adjustTableWidth() {
            setTimeout(() => {
                const oTable = this.byId("tablaFacturas");
                if (oTable) {
                    const aColumns = oTable.getColumns();
                    let iTotalWidth = 0;

                    aColumns.forEach((oColumn) => {
                        iTotalWidth += this._getColumnWidth(oColumn);
                    });
                }
            }, 500);
        },

        /**
         * Obtener el ancho de una columna
         * @private
         * @param {sap.m.Column} oColumn - Columna
         * @returns {number} Ancho en píxeles
         */
        _getColumnWidth(oColumn) {
            const sWidth = oColumn.getWidth();
            if (sWidth && sWidth.endsWith("em")) {
                return parseInt(sWidth) * 16;
            } else if (sWidth && sWidth.endsWith("px")) {
                return parseInt(sWidth);
            }
            return 100;
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

            const bHasSelection = aFacturas.some(oFactura => oFactura.selected === true);

            const aSelected = aFacturas.filter(oFactura => oFactura.selected === true);

            oMainViewModel.setProperty("/hasSelection", bHasSelection);
            oMainViewModel.setProperty("/selectedCount", aSelected.length);

            if (aSelected.length === 1) {
                oMainViewModel.setProperty("/selectedFactura", aSelected[0]);
            } else {
                oMainViewModel.setProperty("/selectedFactura", null);
            }

            console.log(`${aSelected.length} factura(s) seleccionada(s)`);
        },

        /**
         * Actualizar datos
         */
        onActualizar() {
            MessageToast.show("Actualizando datos...");
            this._cargarDatos({});
        },

        /**
         * Aplicar filtros
         */
        onAplicarFiltros() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteFiltros");
        },

        /**
         * Limpiar selección
         */
        onLimpiarSeleccion() {
            const oModel = this.getView().getModel("facturas");
            const aFacturas = oModel.getProperty("/facturas");

            aFacturas.forEach((oFactura, index) => {
                oModel.setProperty(`/facturas/${index}/selected`, false);
            });

            this._updateSelectionState();
            MessageToast.show("Selección limpiada");
        },

        /**
         * Manejar el evento beforeRebindTable del SmartTable
         * @param {sap.ui.base.Event} oEvent - Evento beforeRebindTable
         */
        onBeforeRebindTable(oEvent) {
            const mBindingParams = oEvent.getParameter("bindingParams");
            console.log("Binding params antes del rebind:", mBindingParams);
        },

        /**
         * Manejar el evento beforeExport del SmartTable
         * @param {sap.ui.base.Event} oEvent - Evento beforeExport
         */
        onBeforeExport(oEvent) {
            const oExportSettings = oEvent.getParameter("exportSettings");
            console.log("Configuración de exportación:", oExportSettings);
        },

        onPosFactura() {
            const oMainViewModel = this.getView().getModel("mainView");
            const oSelectedFactura = oMainViewModel.getProperty("/selectedFactura");

            if (!oSelectedFactura) {
                MessageToast.show("Por favor, seleccione una factura primero");
                return;
            }

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDetalle");
        },

        onDocsAsignados() {
            const oMainViewModel = this.getView().getModel("mainView");
            const oSelectedFactura = oMainViewModel.getProperty("/selectedFactura");

            if (!oSelectedFactura) {
                MessageToast.show("Por favor, seleccione una factura primero");
                return;
            }

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDocsAsignados");
        },
        _procesarPreRegistro(aFacturas) {
            const oFacturasModel = this.getView().getModel("facturas");
            const aTodasFacturas = oFacturasModel.getProperty("/facturas");

            aTodasFacturas.forEach((oFactura, index) => {
                if (oFactura.selected) {
                    oFacturasModel.setProperty(`/facturas/${index}/estado`, "Aprobada");
                    oFacturasModel.setProperty(`/facturas/${index}/selected`, false);
                }
            });

            this._updateSelectionState();
        },
        onPreRegistrar() {
            const oMainViewModel = this.getView().getModel("mainView");
            const oFacturasModel = this.getView().getModel("facturas");
            const aFacturas = oFacturasModel.getProperty("/facturas");
            const oFiltrosModel = this.getOwnerComponent().getModel("filtros");
            const oFiltros = oFiltrosModel ? oFiltrosModel.getData() : {};

            const aSelectedFacturas = aFacturas.filter(oFactura => oFactura.selected === true);

            if (aSelectedFacturas.length === 0) {
                MessageToast.show("Por favor, seleccione al menos una factura para Pre-Registrar");
                return;
            }

            // Verificar si es factura sin referencia (miscelánea)
            if (oFiltros.tipoDocumento === "SinReferencia") {
                this._showPreRegistroMiscDialog(aSelectedFacturas[0]);
            } else {
                // Mostrar diálogo de confirmación normal
                this._showPreRegistroConfirmDialog(aSelectedFacturas, oMainViewModel);
            }
        },

        /**
         * Mostrar diálogo de pre-registro para facturas misceláneas
         * @private
         * @param {object} oFactura - Factura seleccionada
         */
        _showPreRegistroMiscDialog(oFactura) {
            if (!this._oPreRegistroMiscDialog) {
                this._oPreRegistroMiscDialog = sap.ui.xmlfragment(
                    "monitorfactura.project1.view.fragments.PreRegistroMiscDialog",
                    this
                );
                this.getView().addDependent(this._oPreRegistroMiscDialog);
            }

            // Crear modelo con datos iniciales
            const oMiscModel = new JSONModel({
                fechaContable: oFactura.fechaContable,
                fechaBase: oFactura.fechaBase,
                glosa: oFactura.nombre,
                referencia: oFactura.referencia,
                posiciones: [
                    {
                        posicion: 1,
                        codigoServicio: "",
                        descripcion: "",
                        cantidad: 1,
                        upm: "UN",
                        puSinIGV: 0,
                        puConIGV: 0,
                        totalConIGV: 0,
                        cuentaContable: "",
                        centroCosto: ""
                    }
                ]
            });

            this.getView().setModel(oMiscModel, "preRegistroMisc");
            this._oPreRegistroMiscDialog.open();
        },

        /**
         * Mostrar diálogo de confirmación para pre-registro
         * @private
         * @param {Array} aSelectedFacturas - Facturas seleccionadas
         * @param {sap.ui.model.json.JSONModel} oMainViewModel - Modelo de vista principal
         */
        _showPreRegistroConfirmDialog(aSelectedFacturas, oMainViewModel) {
            let sMessage = `Confirme el pre-registro de ${aSelectedFacturas.length} factura(s):\n\n`;
            
            aSelectedFacturas.forEach((oFactura, index) => {
                sMessage += `Factura Nro ${index + 1}:\n`;
          
                sMessage += `Fecha Contable: ${oFactura.fechaContable}\n`;
                sMessage += `Fecha Base: ${oFactura.fechaBase}\n`;
                sMessage += `Glosa de factura: ${oFactura.nombre}\n\n`;
            });

            MessageBox.confirm(sMessage, {
                title: "Confirmación de Pre-Registro",
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        this._ejecutarPreRegistro(aSelectedFacturas, oMainViewModel);
                    }
                },
                styleClass: "sapUiSizeCompact",
                contentWidth: "500px"
            });
        },

        /**
         * Ejecutar el pre-registro después de la confirmación
         * @private
         * @param {Array} aSelectedFacturas - Facturas seleccionadas
         * @param {sap.ui.model.json.JSONModel} oMainViewModel - Modelo de vista principal
         */
        _ejecutarPreRegistro(aSelectedFacturas, oMainViewModel) {
            MessageToast.show(`Procesando ${aSelectedFacturas.length} factura(s)...`);
            oMainViewModel.setProperty("/processing", true);
            
            setTimeout(() => {
                this._procesarPreRegistro(aSelectedFacturas);
                oMainViewModel.setProperty("/processing", false);

                MessageBox.success("El pre-registro fue creado correctamente.");
            }, 2000);
        },

        onContabilizar() {
            const oMainViewModel = this.getView().getModel("mainView");
            const oFacturasModel = this.getView().getModel("facturas");
            const aFacturas = oFacturasModel.getProperty("/facturas");

            const aSelectedFacturas = aFacturas.filter(oFactura => oFactura.selected === true);

            if (aSelectedFacturas.length === 0) {
                MessageToast.show("Por favor, seleccione al menos una factura para Contabilizar");
                return;
            }

            MessageToast.show(`Procesando ${aSelectedFacturas.length} factura(s)...`);
            oMainViewModel.setProperty("/processing", true);
            setTimeout(() => {
                this._procesarPreRegistro(aSelectedFacturas);
                oMainViewModel.setProperty("/processing", false);

                MessageBox.success("La contabilización se realizó correctamente.");
                return;
            }, 2000);
        },

        onVerDocumentoSAP() {
            MessageToast.show("Ver Documento SAP - Función en desarrollo");
        },

        onVerLog() {
            const oMainViewModel = this.getView().getModel("mainView");
            const oSelectedFactura = oMainViewModel.getProperty("/selectedFactura");

            if (!oSelectedFactura) {
                MessageToast.show("Por favor, seleccione una factura primero");
                return;
            }

            // Simular log del último registro ejecutado
            const sLogMessage = this._getLogMessage(oSelectedFactura);

            MessageBox.information(sLogMessage, {
                title: "Log de Ejecución",
                contentWidth: "500px",
                styleClass: "sapUiSizeCompact"
            });
        },

        /**
         * Obtener el mensaje de log del último registro ejecutado
         * @private
         * @param {object} oFactura - Factura seleccionada
         * @returns {string} Mensaje de log
         */
        _getLogMessage(oFactura) {
            let sLog = `Detalle del último registro ejecutado:\n\n`;
            sLog += `Referencia: ${oFactura.referencia}\n`;
            sLog += `Estado: ${oFactura.estado}\n`;
            sLog += `Fecha de registro: ${oFactura.fechaRegistro}\n\n`;
              
            return sLog;
        },

        onFacturaObservada() {
            MessageToast.show("Factura Observada - Función en desarrollo");
        },

        onOpcionMas() {
            MessageToast.show("Opción Más - Función en desarrollo");
        },

        /**
         * Calcular total con IGV cuando cambian cantidad o precio
         * @param {sap.ui.base.Event} oEvent - Evento de cambio
         */
        onCalcularTotal(oEvent) {
            const oInput = oEvent.getSource();
            const oContext = oInput.getBindingContext("preRegistroMisc");
            const oMiscModel = this.getView().getModel("preRegistroMisc");
            const oPosicion = oContext.getObject();

            const fCantidad = parseFloat(oPosicion.cantidad) || 0;
            const fPUConIGV = parseFloat(oPosicion.puConIGV) || 0;
            const fTotal = fCantidad * fPUConIGV;

            oMiscModel.setProperty(oContext.getPath() + "/totalConIGV", fTotal.toFixed(2));
        },

        /**
         * Agregar nueva posición a la tabla de misceláneas
         */
        onAgregarPosicion() {
            const oMiscModel = this.getView().getModel("preRegistroMisc");
            const aPosiciones = oMiscModel.getProperty("/posiciones");
            const iNewPos = aPosiciones.length + 1;

            aPosiciones.push({
                posicion: iNewPos,
                codigoServicio: "",
                descripcion: "",
                cantidad: 1,
                upm: "UN",
                puSinIGV: 0,
                puConIGV: 0,
                totalConIGV: 0,
                cuentaContable: "",
                centroCosto: ""
            });

            oMiscModel.setProperty("/posiciones", aPosiciones);
        },

        /**
         * Eliminar posición de la tabla
         * @param {sap.ui.base.Event} oEvent - Evento del botón
         */
        onEliminarPosicion(oEvent) {
            const oMiscModel = this.getView().getModel("preRegistroMisc");
            const aPosiciones = oMiscModel.getProperty("/posiciones");
            const oContext = oEvent.getSource().getBindingContext("preRegistroMisc");
            const iIndex = oContext.getPath().split("/").pop();

            if (aPosiciones.length > 1) {
                aPosiciones.splice(iIndex, 1);
                // Reordenar posiciones
                aPosiciones.forEach((oPos, index) => {
                    oPos.posicion = index + 1;
                });
                oMiscModel.setProperty("/posiciones", aPosiciones);
            } else {
                MessageToast.show("Debe mantener al menos una posición");
            }
        },

        /**
         * Aceptar pre-registro de factura miscelánea
         */
        onAceptarPreRegistroMisc() {
            const oMiscModel = this.getView().getModel("preRegistroMisc");
            const aPosiciones = oMiscModel.getProperty("/posiciones");

            // Validar que todas las posiciones tengan cuenta contable y centro de costo
            let bValid = true;
            aPosiciones.forEach((oPos) => {
                if (!oPos.cuentaContable || !oPos.centroCosto) {
                    bValid = false;
                }
            });

            if (!bValid) {
                MessageBox.warning("Por favor, complete la Cuenta Contable y Centro de Costo en todas las posiciones.");
                return;
            }

            // Simular procesamiento
            const oMainViewModel = this.getView().getModel("mainView");
            oMainViewModel.setProperty("/processing", true);

            setTimeout(() => {
                this._oPreRegistroMiscDialog.close();
                oMainViewModel.setProperty("/processing", false);

                // Actualizar estado de la factura
                const oFacturasModel = this.getView().getModel("facturas");
                const aFacturas = oFacturasModel.getProperty("/facturas");
                aFacturas.forEach((oFactura, index) => {
                    if (oFactura.selected) {
                        oFacturasModel.setProperty(`/facturas/${index}/estado`, "Aprobada");
                        oFacturasModel.setProperty(`/facturas/${index}/selected`, false);
                    }
                });

                this._updateSelectionState();

                MessageBox.success("El documento fue registrado correctamente.");
            }, 2000);
        },

        /**
         * Cancelar pre-registro de factura miscelánea
         */
        onCancelarPreRegistroMisc() {
            this._oPreRegistroMiscDialog.close();
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
        }
    });
});