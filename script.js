document.addEventListener('DOMContentLoaded', () => {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const firstquantity = document.getElementById('firstquantity');

    const apiKey = 'a1df859ce0ae9f6deb0688e1';
    const apiUrl = 'https://v6.exchangerate-api.com/v6/a1df859ce0ae9f6deb0688e1/latest/USD';

    let conversionRates = {};

    function loadCurrencies() {
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados da API:', data.conversion_rates);
                if (data && data.conversion_rates) {
                    conversionRates = data.conversion_rates;
                    const currencies = Object.keys(data.conversion_rates);

                    currencies.forEach(currency => {
                        const option = document.createElement('option');
                        option.value = currency;
                        option.textContent = currency;
                        fromCurrency.appendChild(option);
                        toCurrency.appendChild(option.cloneNode(true));
                    });
                    
                    AtualizacaoResultado(); // Atualiza o resultado após carregar as moedas

                } else {
                    console.error('Estrutura de dados inesperada:', data);
                }
            })
            .catch(error => console.error('Erro ao carregar as moedas:', error));
    }

    function AtualizacaoResultado() {
        const amountInput = parseFloat(firstquantity.value);
        const fromCurrencyValue = fromCurrency.value;
        const toCurrencyValue = toCurrency.value;
        let secondquantity;

        secondquantity = ConversaoGeral(conversionRates);

        if (!isNaN(secondquantity)) {
            document.getElementById('result').textContent = toCurrencyValue + " " + secondquantity.toFixed(2);
        }
    }

    function ConversaoGeral(rates) {
        const fromCurrencyValue = fromCurrency.value;
        const toCurrencyValue = toCurrency.value;
        const amountInput = parseFloat(firstquantity.value);

        if (isNaN(amountInput) || amountInput < 0) {
            console.error('Valor de entrada inválido:', amountInput);
            document.getElementById('result').textContent = 'Por favor, insira um valor válido.';
            return;
        }

        if (fromCurrencyValue && toCurrencyValue && !isNaN(amountInput)) {
            const fromRate = rates[fromCurrencyValue];
            const toRate = rates[toCurrencyValue];

            if (fromRate && toRate) {
                const result = (amountInput / fromRate) * toRate;
                return result;
            } else {
                console.error('Taxas de câmbio não encontradas para as moedas selecionadas');
            }
        } else {
            console.error('Valores de entrada inválidos');
        }
    }

    loadCurrencies();

    firstquantity.addEventListener('input', AtualizacaoResultado);
    fromCurrency.addEventListener('change', AtualizacaoResultado);
    toCurrency.addEventListener('change', AtualizacaoResultado);
});
