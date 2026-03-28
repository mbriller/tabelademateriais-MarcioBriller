sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("tabelademateriais.controller.Table", {
        onInit() {
            this._criarModel();
            this._carregarDados();
        },

        // Cria a Model
        _criarModel: function () {
            const oModel = new JSONModel({
                tableMaterial: []
            });
            this.getView().setModel(oModel);
        },

        // Carrega dados iniciais
        _carregarDados: async function () {
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

        // Abrir popup
        onAbrirDialog: function () {
            this._inputNumMat = new sap.m.Input({ placeholder: "NumMat" });
            this._inputNome = new sap.m.Input({ placeholder: "Nome" });
            this._inputDescr = new sap.m.Input({ placeholder: "Descrição" });

            if (!this._dialog) {
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

            this._dialog.open();
        },

        // Criar material
        onCriarMaterial: async function () {
            debugger;
            const NumMat = this._inputNumMat.getValue();
            const Nome = this._inputNome.getValue();
            const Descr = this._inputNome.getValue();

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
                        NumMat: parseInt(NumMat),
                        Nome,
                        Descr
                    })
                });

                if (response.ok) {
                    MessageBox.success("Material criado com sucesso");
                    this._dialog.close();
                    this._carregarDados();
                } else {
                    const err = await response.json();
                    MessageBox.error(err.error.message);
                }

            } catch (error) {
                MessageBox.error("Erro ao criar material");
            }
        }

    });
});