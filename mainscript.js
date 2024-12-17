document.getElementById('currency-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = document.getElementById('amount').value;
    const resultElement = document.getElementById('conversion-text');

    if (!amount || isNaN(amount)) {
        resultElement.textContent = "Please enter a valid amount.";
        return;
    }

    try {
        
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();

        const exchangeRate = data.rates[toCurrency];
        if (!exchangeRate) {
            resultElement.textContent = "Conversion rate not available.";
            return;
        }

        const convertedAmount = (amount * exchangeRate).toFixed(2);

        
        resultElement.textContent = `${amount} ${fromCurrency} is ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        resultElement.textContent = "An error occurred. Please try again later.";
    }
});





