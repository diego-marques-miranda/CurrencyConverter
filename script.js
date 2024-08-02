document.addEventListener('DOMContentLoaded', () => {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const firstquantity = document.getElementById('firstquantity');

    const apiKey = 'a1df859ce0ae9f6deb0688e1';
    const apiUrl = 'https://v6.exchangerate-api.com/v6/a1df859ce0ae9f6deb0688e1/latest/USD';


    function loadCurrencies() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API: ' + response.statusText);
                }
                
                return response.json();
            })
            .then(data => {
                console.log('Dados da API:', data.conversion_rates);
                if (data && data.conversion_rates) {
                    const currencies = Object.keys(data.conversion_rates);
                    currencies.forEach(currency => {
                        const option = document.createElement('option');
                        option.value = currency;
                        option.textContent = currency;
                        fromCurrency.appendChild(option);
                        toCurrency.appendChild(option.cloneNode(true));

                    });
                    
                    return data;

                } else {
                    console.error('Estrutura de dados inesperada:', data);
                }
        })
            .catch(error => console.error('Erro ao carregar as moedas:', error));
}


    function AtualizacaoResultado(data) {
        const firstquantity = document.getElementById("firstquantity").value;
        const fromCurrency = document.getElementById("fromCurrency").value;
        const toCurrency = document.getElementById("toCurrency").value;
        let secondquantity;

        secondquantity = ConversaoGeral(data.conversion_rates);

        document.getElementById('result').textContent = toCurrency + " " + secondquantity;
    }


    function ConversaoGeral(rates) {
        const fromCurrencyValue = fromCurrency.value;
        const toCurrencyValue = toCurrency.value;
        const amountInput = parseFloat(document.getElementById('firstquantity').value);

        const amount = parseFloat(amountInput);
        if (isNaN(amount) || amount < 0) {
            console.error('Valor de entrada inválido:', amountInput);
            document.getElementById('result').textContent = 'Por favor, insira um valor válido.';
            return;
        }

        if (fromCurrencyValue && toCurrencyValue && !isNaN(amount)) {
            const fromRate = rates[fromCurrencyValue];
            const toRate = rates[toCurrencyValue];

            if (fromRate && toRate) {
                const result = (amount / fromRate) * toRate;
                return result;
            } else {
                console.error('Taxas de câmbio não encontradas para as moedas selecionadas');
            }
        } else {
            console.error('Valores de entrada inválidos');
        }

    }

    

    loadCurrencies();

    document.getElementById("firstquantity").addEventListener('input', AtualizacaoResultado(loadCurrencies()));
    document.getElementById("fromCurrency").addEventListener('change', AtualizacaoResultado(loadCurrencies()));
    document.getElementById("toCurrency").addEventListener('change', AtualizacaoResultado(loadCurrencies()));
});