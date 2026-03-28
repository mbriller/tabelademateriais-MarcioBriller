const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

        const { Materiais } = this.entities;

        this.on('filtroMateriais', async (req) => {

        const Quantidade = req?.data?.QTD;

        if (!Quantidade) {
            return req.error(400, 'Não foi informado a quantidade de registros para filtro')
        }

        const materiais = await SELECT.from(Materiais).limit(Quantidade);

        if (!materiais || materiais.length === 0) {
            return req.error(400, 'Dados não encontrados');
        } else {
            return materiais
        }

    }),

        this.on('adicionarMaterial', async (req) => {
            debugger;
            const { NumMat, Nome, Descr } = req.data;

            if (!NumMat || !Nome || !Descr) {
                return req.error(400, 'Campos obrigatórios não preenchidos');
            }

            // Verificar duplicidade 
            const matExistente = await SELECT.one.from(Materiais).Where({ NumMat });
            if (matExistente) {
                return req.error(400, 'Material já cadastro com esse número de material');
            }

            // Buscar último ID
            const ultimo = await SELECT.one.from(Materiais).columns('max(ID) as maxID');
            const novoID = (ultimo.maxID || 0) + 1;

            // Inserir novo material
            try {
                await INSERT.into(Materiais).entries({
                    ID: novoID,
                    NumMat,
                    Nome,
                    Descr
                });

                // Retorno de sucesso
                return `Material ${NumMat} criado com sucesso com ID ${novoID}`;
            } catch (err) {
                // Retorno de erro
                return req.reject(500, 'Erro ao inserir material na tabela');
            }
        })
})    