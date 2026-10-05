document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const totalBillInput = document.getElementById('total-bill');
    const numPeopleInput = document.getElementById('num-people');
    const tipPercentInput = document.getElementById('tip-percent');
    const resultSection = document.getElementById('result-section');
    const amountPerPersonDisplay = document.getElementById('amount-per-person');

    calculateBtn.addEventListener('click', () => {
        // Get values
        const totalBill = parseFloat(totalBillInput.value);
        let numPeople = parseInt(numPeopleInput.value);
        let tipPercent = parseFloat(tipPercentInput.value);

        // Validation
        if (isNaN(totalBill) || totalBill < 0) {
            alert("Please enter a valid total bill amount.");
            return;
        }

        if (isNaN(numPeople) || numPeople < 1) {
            alert("Please enter a valid number of people (at least 1).");
            return;
        }

        if (isNaN(tipPercent) || tipPercent < 0) {
            tipPercent = 0; // Default to 0 if empty or invalid
        }

        // Calculation
        const tipAmount = totalBill * (tipPercent / 100);
        const totalWithTip = totalBill + tipAmount;
        const amountPerPerson = totalWithTip / numPeople;

        // Formatting and Displaying
        // Format to 2 decimal places and add commas for thousands
        const formattedAmount = amountPerPerson.toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        amountPerPersonDisplay.textContent = formattedAmount;
        resultSection.style.display = 'block';
    });
});
