const API_KEY = "063d87d13514636754c6f749"; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

document.getElementById("arbitrage-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fromCurrency = document.getElementById("arbit-from-currency").value;
    const toCurrency = document.getElementById("arbit-to-currency").value;

    // Clear previous results
    const resultContainer = document.getElementById("arbitrage-text");
    resultContainer.innerText = "Calculating arbitrage opportunities...";

    try {
        // 1. Fetch conversion rates for 'fromCurrency'
        const response = await fetch(`${BASE_URL}/${fromCurrency}`);
        if (!response.ok) throw new Error(`Error fetching data: ${response.status}`);
        
        const data = await response.json();
        console.log("API Response:", data); // Debug the API response

        if (data.result !== "success") {
            throw new Error(`API Error: ${data["error-type"]}`);
        }

        const rates = data.conversion_rates;
        if (!rates) throw new Error("Missing conversion_rates in API response.");

        // 2. Check conversion rates and calculate arbitrage opportunities
        const arbitrageOptions = calculateTopArbitrage(rates, fromCurrency, toCurrency);

        // 3. Display results
        displayArbitrageResults(arbitrageOptions, resultContainer);
    } catch (error) {
        console.error("Error fetching data:", error);
        resultContainer.innerText = `Error: ${error.message}`;
    }
});

// Function to calculate top 3 arbitrage paths
function calculateTopArbitrage(rates, fromCurrency, toCurrency) {
    const results = [];

    // Iterate over all currencies for potential arbitrage paths
    Object.keys(rates).forEach((midCurrency) => {
        if (midCurrency !== fromCurrency && midCurrency !== toCurrency) {
            // 1. Direct conversion: from -> midCurrency -> toCurrency
            const rateThroughMidCurrency = rates[midCurrency] * (1 / rates[toCurrency]);

            results.push({
                path: `${fromCurrency} → ${midCurrency} → ${toCurrency}`,
                rate: rateThroughMidCurrency.toFixed(5), // Limit to 5 decimal places
            });
        }
    });

    // Sort by the best arbitrage rates and select top 3
    results.sort((a, b) => b.rate - a.rate);
    return results.slice(0, 3);
}

// Function to display arbitrage results
function displayArbitrageResults(arbitrageOptions, container) {
    if (arbitrageOptions.length === 0) {
        container.innerText = "No arbitrage opportunities found.";
        return;
    }

    container.innerHTML = "<strong>Top Arbitrage Opportunities:</strong><br>";
    arbitrageOptions.forEach((option, index) => {
        container.innerHTML += `${index + 1}. Path: ${option.path}, Rate: ${option.rate}<br>`;
    });
}
