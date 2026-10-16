import { LightningElement } from 'lwc';
import buscarContas from '@salesforce/apex/ContaController.buscarContas';

export default class BuscaContas extends LightningElement {
    termo = '';
    contas = [];
    buscou = false;
    erro;

    get buscaDesabilitada() {
        return this.termo.trim().length < 2;
    }

    get temContas() {
        return this.contas.length > 0;
    }

    get semResultado() {
        return this.buscou && !this.erro && this.contas.length === 0;
    }

    handleTermo(event) {
        this.termo = event.target.value;
    }

    async handleBuscar() {
        this.erro = undefined;
        try {
            this.contas = await buscarContas({ termo: this.termo });
        } catch (error) {
            this.contas = [];
            this.erro = error?.body?.message ?? 'Erro ao buscar contas.';
        }
        this.buscou = true;
    }
}
