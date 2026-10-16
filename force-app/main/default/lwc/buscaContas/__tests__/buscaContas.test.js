import { createElement } from '@lwc/engine-dom';
import BuscaContas from 'c/buscaContas';
import buscarContas from '@salesforce/apex/ContaController.buscarContas';

// Troca o Apex de verdade por uma função falsa: o teste roda sem org.
jest.mock(
    '@salesforce/apex/ContaController.buscarContas',
    () => ({ default: jest.fn() }),
    { virtual: true }
);

const CONTAS = [
    { Id: '001000000000001AAA', Name: 'Acme Brasil' },
    { Id: '001000000000002AAA', Name: 'Acme Portugal' }
];

// Espera o LWC terminar o que está pendente (chamada ao Apex, nova renderização).
// eslint-disable-next-line @lwc/lwc/no-async-operation
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

function criarComponente() {
    const element = createElement('c-busca-contas', { is: BuscaContas });
    document.body.appendChild(element);
    return element;
}

async function digitar(element, termo) {
    const input = element.shadowRoot.querySelector('lightning-input');
    input.value = termo;
    input.dispatchEvent(new CustomEvent('change'));
    await flushPromises();
}

async function clicarBuscar(element) {
    element.shadowRoot.querySelector('lightning-button').click();
    await flushPromises();
}

describe('c-busca-contas', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('desabilita o botão com menos de 2 letras', async () => {
        const element = criarComponente();
        await digitar(element, 'a');

        const botao = element.shadowRoot.querySelector('lightning-button');
        expect(botao.disabled).toBe(true);
    });

    it('mostra as contas encontradas', async () => {
        buscarContas.mockResolvedValue(CONTAS);
        const element = criarComponente();

        await digitar(element, 'Acme');
        await clicarBuscar(element);

        expect(buscarContas).toHaveBeenCalledWith({ termo: 'Acme' });
        const itens = element.shadowRoot.querySelectorAll('li.conta');
        expect(itens.length).toBe(2);
        expect(itens[0].textContent).toBe('Acme Brasil');
    });

    it('avisa quando nenhuma conta é encontrada', async () => {
        buscarContas.mockResolvedValue([]);
        const element = criarComponente();

        await digitar(element, 'Inexistente');
        await clicarBuscar(element);

        const aviso = element.shadowRoot.querySelector('p.vazio');
        expect(aviso).not.toBeNull();
    });

    it('mostra o erro quando o Apex falha', async () => {
        buscarContas.mockRejectedValue({ body: { message: 'Falha no servidor' } });
        const element = criarComponente();

        await digitar(element, 'Acme');
        await clicarBuscar(element);

        const erro = element.shadowRoot.querySelector('p.erro');
        expect(erro.textContent).toBe('Falha no servidor');
    });
});
