const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    this.on('filtroMateriais', async (req) => {

        const { Materiais } = this.entities;
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

    })
})    