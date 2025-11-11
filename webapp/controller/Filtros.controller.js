sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("monitorfactura.project1.controller.Filtros", {

        /**
         * Inicialización del controlador
         */
        onInit() {
            // Crear modelo de datos local para la vista si es necesario
            const oLocalModel = new JSONModel({
                filtrosAplicados: false
            });
            this.getView().setModel(oLocalModel, "local");
        },

        /**
         * Evento al presionar el botón Buscar
         */
        onBuscar() {
            // Obtener valores de los filtros desde la vista
            const oView = this.getView();

            const oFiltros = {
                sociedad: oView.byId("sociedadInput").getValue().trim(),
                // division: oView.byId("divisionInput").getValue().trim(),
                // divisionA: oView.byId("divisionAInput").getValue().trim(),
                // proveedor: oView.byId("proveedorInput").getValue().trim(),
                // proveedorA: oView.byId("proveedorAInput").getValue().trim(),
                // fechaRegistroDe: oView.byId("fechaRegistroDe").getValue(),
                // fechaRegistroHasta: oView.byId("fechaRegistroHasta").getValue(),
                // fechaEmisionDe: oView.byId("fechaEmisionDe").getValue(),
                // fechaEmisionHasta: oView.byId("fechaEmisionHasta").getValue(),
                // fechaVencimientoDe: oView.byId("fechaVencimientoDe").getValue(),
                // fechaVencimientoHasta: oView.byId("fechaVencimientoHasta").getValue(),
                tipoDocumento: this._getTipoDocumentoSeleccionado()
            };

            // Validar que al menos Sociedad esté ingresada (campo obligatorio)
            if (!oFiltros.sociedad) {
                MessageBox.warning("Por favor, ingrese una Sociedad para continuar.");
                return;
            }

            // Validar rangos (que el valor "De" no sea mayor que "Hasta")
            if (!this._validarRangos(oFiltros)) {
                return;
            }

            // Guardar los filtros en un modelo compartido para usarlos en la siguiente vista
            const oFiltrosModel = new JSONModel(oFiltros);
            this.getOwnerComponent().setModel(oFiltrosModel, "filtros");

            // Mostrar mensaje de confirmación
            MessageToast.show("Buscando facturas con los criterios seleccionados...");

            // Navegar a la vista principal (MainView) con los filtros
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMainView");
        },

        /**
         * Obtener el tipo de documento seleccionado del RadioButtonGroup
         * @private
         * @returns {string} Tipo de documento seleccionado
         */
        _getTipoDocumentoSeleccionado() {
            const oView = this.getView();

            if (oView.byId("rbFacturaSuministro").getSelected()) {
                return "FacturaSuministro";
            } else if (oView.byId("rbFacturaServicios").getSelected()) {
                return "FacturaServicios";
            } else if (oView.byId("rbSinReferencia").getSelected()) {
                return "SinReferencia";
            } else if (oView.byId("rbNotaCredito").getSelected()) {
                return "NotaCredito";
            }

            return "FacturaSuministro"; // Valor por defecto
        },

        /**
         * Validar que los rangos sean correctos (De <= Hasta)
         * @private
         * @param {object} oFiltros - Objeto con los filtros
         * @returns {boolean} True si los rangos son válidos
         */
        _validarRangos(oFiltros) {
            // Validar rango de División
            if (oFiltros.division && oFiltros.divisionA) {
                if (oFiltros.division > oFiltros.divisionA) {
                    MessageBox.error("El rango de División es inválido. El valor inicial no puede ser mayor que el final.");
                    return false;
                }
            }

            // Validar rango de Proveedor
            if (oFiltros.proveedor && oFiltros.proveedorA) {
                if (oFiltros.proveedor > oFiltros.proveedorA) {
                    MessageBox.error("El rango de Proveedor es inválido. El valor inicial no puede ser mayor que el final.");
                    return false;
                }
            }

            // Validar rangos de fechas
            if (oFiltros.fechaRegistroDe && oFiltros.fechaRegistroHasta) {
                if (new Date(this._convertirFecha(oFiltros.fechaRegistroDe)) > new Date(this._convertirFecha(oFiltros.fechaRegistroHasta))) {
                    MessageBox.error("El rango de Fecha de Registro es inválido.");
                    return false;
                }
            }

            if (oFiltros.fechaEmisionDe && oFiltros.fechaEmisionHasta) {
                if (new Date(this._convertirFecha(oFiltros.fechaEmisionDe)) > new Date(this._convertirFecha(oFiltros.fechaEmisionHasta))) {
                    MessageBox.error("El rango de Fecha de Emisión es inválido.");
                    return false;
                }
            }

            if (oFiltros.fechaVencimientoDe && oFiltros.fechaVencimientoHasta) {
                if (new Date(this._convertirFecha(oFiltros.fechaVencimientoDe)) > new Date(this._convertirFecha(oFiltros.fechaVencimientoHasta))) {
                    MessageBox.error("El rango de Fecha de Vencimiento es inválido.");
                    return false;
                }
            }

            return true;
        },

        /**
         * Convertir fecha del formato dd/MM/yyyy a un formato que JavaScript pueda comparar
         * @private
         * @param {string} sFecha - Fecha en formato dd/MM/yyyy
         * @returns {string} Fecha en formato yyyy-MM-dd
         */
        _convertirFecha(sFecha) {
            if (!sFecha) return "";
            const aParts = sFecha.split("/");
            if (aParts.length === 3) {
                return `${aParts[2]}-${aParts[1]}-${aParts[0]}`;
            }
            return sFecha;
        }
    });
});
