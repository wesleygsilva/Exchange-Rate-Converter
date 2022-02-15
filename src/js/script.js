const firstCurrencyEl = document.querySelector('[data-js="first-currency"]');
const secondCurrencyEl = document.querySelector('[data-js="second-currency"]');
const valueToConverter = document.querySelector('[data-js="value-to-converter"]');
const convertedCurrency = document.querySelector('[data-js="convertedCurrency"]'); 
const resultExchangeRate = document.querySelector('[data-js="result"]');

let internalExchangeData = { };


const getUrl = currency => `https://freecurrencyapi.net/api/v2/latest?apikey=8d478b10-8d29-11ec-9dcf-ab45d70362de&base_currency=${currency}`;

const getErrorMessage = errorType => ({
//Mensagens de erro
})[errorType] || 'Não foi possivel obter as informações';

const fetchExchangeRate = async (url) => {
    try {
        const response = await fetch(url);
        const exchangeRateData = await response.json();

        internalExchangeData = {...exchangeRateData}

        if (exchangeRateData.data === '') { 
            throw new Error(getErrorMessage('Não foi possivel obter as informações'));
        }

        return exchangeRateData;

    } catch (err) {
        alert(err.message);
    }
}

const init = async () => {
    internalExchangeData = {...(await fetchExchangeRate(getUrl('USD')))};

    const sortArray = Object.keys(internalExchangeData.data);
    sortArray.push('USD')
    sortArray.sort();

    const getOptions = selectedCurrency => sortArray
        .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
        .join('');

    // pega taxa inicial
    firstCurrencyEl.innerHTML = getOptions('USD');
    secondCurrencyEl.innerHTML = getOptions('BRL'); 

    convertedCurrency.textContent = (valueToConverter.value * internalExchangeData.data[secondCurrencyEl.value]).toFixed(2);

    
// mostra referencia ao usuário
resultExchangeRate.textContent = '1 ' + firstCurrencyEl.value + ' = ' + internalExchangeData.data[secondCurrencyEl.value].toFixed(5) + ' ' + secondCurrencyEl.value;
    
}

//Multiplica o valor de acordo com o input
valueToConverter.addEventListener('input', e => {
    convertedCurrency.textContent = (e.target.value * internalExchangeData.data[secondCurrencyEl.value]).toFixed(2);
})


secondCurrencyEl.addEventListener('input', e => {
    convertedCurrency.textContent = (valueToConverter.value * internalExchangeData.data[secondCurrencyEl.value]).toFixed(2);
    resultExchangeRate.textContent = '1 ' + firstCurrencyEl.value + ' = ' + internalExchangeData.data[secondCurrencyEl.value].toFixed(5) + ' ' + secondCurrencyEl.value;
})

firstCurrencyEl.addEventListener('input',async e => {
    internalExchangeData = {...(await fetchExchangeRate(getUrl(e.target.value)))};
    convertedCurrency.textContent = (valueToConverter.value * internalExchangeData.data[secondCurrencyEl.value]).toFixed(2);
    resultExchangeRate.textContent = '1 ' + firstCurrencyEl.value + ' = ' + internalExchangeData.data[secondCurrencyEl.value].toFixed(5) + ' ' + secondCurrencyEl.value;
})



init();