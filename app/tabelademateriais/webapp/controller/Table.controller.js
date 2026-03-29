sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("tabelademateriais.controller.Table", {
        onInit() {
            this.criarModel();
            this.carregarDados();
        },

        // Cria a Model
        criarModel: function () {
            const oModel = new JSONModel({
                tableMaterial: []
            });
            this.getView().setModel(oModel);
        },

        // Carrega dados iniciais
        carregarDados: async function () {
            debugger;
            try {
                const response = await fetch("/odata/v4/cad-mat/Materiais");
                const data = await response.json();

                this.getView().getModel().setProperty("/tableMaterial", data.value);

            } catch (error) {
                MessageBox.error("Erro ao carregar dados");
            }
        },

        // Filtro
        onFiltrar: async function () {
            debugger;
            const qtd = this.byId("inputQtd").getValue();

            if (!qtd) {
                MessageBox.warning("Informe a quantidade");
                return;
            }

            try {
                const response = await fetch(`/odata/v4/cad-mat/filtroMateriais(QTD=${qtd})`);
                const data = await response.json();

                this.getView().getModel().setProperty("/tableMaterial", data.value);

            } catch (error) {
                MessageBox.error("Erro no filtro");
            }
        },

        resetDialog: function () {
            this._inputNumMat.setValue("");
            this._inputNome.setValue("");
            this._inputDescr.setValue("");
        },

        // Abrir popup
        onAbrirDialog: function () {
            debugger;
            if (!this._dialog) {

                this._inputNumMat = new sap.m.Input({ placeholder: "NumMat" });
                this._inputNome = new sap.m.Input({ placeholder: "Nome" });
                this._inputDescr = new sap.m.Input({ placeholder: "Descrição" });

                this._dialog = new sap.m.Dialog({
                    title: "Novo Material",
                    content: [
                        this._inputNumMat,
                        this._inputNome,
                        this._inputDescr
                    ],
                    beginButton: new sap.m.Button({
                        text: "Salvar",
                        press: this.onCriarMaterial.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancelar",
                        press: function () {
                            this._dialog.close();
                        }.bind(this)
                    })
                });
                this.getView().addDependent(this._dialog);
            }
            this.resetDialog();
            this._dialog.open();
        },

        // Criar material
        onCriarMaterial: async function () {
            debugger;
            const NumMat = this._inputNumMat.getValue();
            const Nome = this._inputNome.getValue();
            const Descr = this._inputDescr.getValue();

            if (!NumMat || !Nome || !Descr) {
                MessageBox.error("Preencha todos os campos");
                return;
            }

            try {
                const response = await fetch("/odata/v4/cad-mat/adicionarMaterial", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        NumMat: Number(NumMat),
                        Nome,
                        Descr
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    MessageBox.success("Material criado com sucesso");
                    this._dialog.close();
                    this.carregarDados();
                } else {
                    MessageBox.error(data.error?.message || "Erro ao criar material");                
                }                
            } catch (error) {
                MessageBox.error("Erro ao criar material");
            }
        }

    });
});