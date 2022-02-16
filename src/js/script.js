const API_KEY = '8d478b10-8d29-11ec-9dcf-ab45d70362de';

const firstCurrencyEl = document.querySelector('[data-js="first-currency"]');
const secondCurrencyEl = document.querySelector('[data-js="second-currency"]');
const valueToConverter = document.querySelector('[data-js="value-to-converter"]');
const convertedCurrency = document.querySelector('[data-js="convertedCurrency"]'); 
const resultExchangeRate = document.querySelector('[data-js="result"]');

let internalExchangeData = { };

const getUrl = currency => `https://freecurrencyapi.net/api/v2/latest?apikey=${API_KEY}&base_currency=${currency}`;

const getErrorMessage = errorType => ({
    '200': 'Successful Request',
    '429': 'You have hit your rate-limit',
    '404': 'A requested resource does not exist',
    '500': 'Internal Server Error - let us know: freecurrencyapidotnet.net'
})[errorType] || 'Não foi possivel obter as informações';

const fetchExchangeRate = async (url) => {
    try {
        const response = await fetch(url);
        const exchangeRateData = await response.json();

        internalExchangeData = {...exchangeRateData}

        if (exchangeRateData.data === '') { 
            throw new Error(getErrorMessage(exchangeRateData.status));
        }

        return exchangeRateData;

    } catch (err) {
        alert(err.message);
    }
}

const showReferenceConvertedCurrency = () => {
    resultExchangeRate.textContent = 
        '1 ' + 
        firstCurrencyEl.value + 
        ' = ' + 
        internalExchangeData.data[secondCurrencyEl.value].toFixed(5) + 
        ' ' + 
        secondCurrencyEl.value;
}

const showConvertedCurrency = () => {
    convertedCurrency.textContent = 
        (valueToConverter.value * internalExchangeData.data[secondCurrencyEl.value]).toFixed(2);   
}

const addCurrencyonCurrencys = CurrentCurrency => {
    const Currency = Object.keys(internalExchangeData.data);
    Currency.push(CurrentCurrency);
    Currency.sort();

    return Currency;
}

const getOptions = (selectedCurrency, Currencys) => {
    const setSelectedAttribute = currency => 
        currency === selectedCurrency ? 'selected' : '';

    return Currencys
        .map(currency => `<option ${setSelectedAttribute(currency)}>${currency}</option>`)
        .join('');
}

const setInitialsCurrencys = Currencys => {
    firstCurrencyEl.innerHTML = getOptions('USD', Currencys);
    secondCurrencyEl.innerHTML = getOptions('BRL', Currencys); 
}

const showInitialInfo = Currencys => {
    setInitialsCurrencys(Currencys);
    showConvertedCurrency();
    showReferenceConvertedCurrency();
}

valueToConverter.addEventListener('input', e => {
    showConvertedCurrency();
})

secondCurrencyEl.addEventListener('input', e => {
    showConvertedCurrency();
    showReferenceConvertedCurrency();
})

firstCurrencyEl.addEventListener('input', async e => {
    internalExchangeData = {...(await fetchExchangeRate(getUrl(e.target.value)))};
    showConvertedCurrency();
    showReferenceConvertedCurrency();
})

const init = async () => {
    internalExchangeData = {...(await fetchExchangeRate(getUrl('USD')))};
    const Currencys = addCurrencyonCurrencys('USD');
    showInitialInfo(Currencys);
}

init();