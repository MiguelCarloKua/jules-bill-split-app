/**
 * Calculates the exact split of a bill among a given number of people.
 * It ensures the total sum of shares perfectly equals the total bill + tip up to the centavo.
 * Returns an object with the result details or an error message.
 * @param {string|number} totalBillStr - The total bill
 * @param {string|number} numPeopleStr - Number of people to split by
 * @param {string|number} tipPercentStr - The tip percentage
 * @returns {object} { error: string } OR { type: 'even'|'uneven', amount: number, numPeople?: number, baseAmount?: number, numPeopleBase?: number, extraAmount?: number, numPeopleExtra?: number, total?: number }
 */
function calculateSplit(totalBillStr, numPeopleStr, tipPercentStr) {
    const totalBill = parseFloat(totalBillStr);
    const numPeople = Number(numPeopleStr);
    const tipPercent = tipPercentStr === '' || tipPercentStr === undefined || tipPercentStr === null
                       ? 0
                       : parseFloat(tipPercentStr);

    if (isNaN(totalBill) || totalBill < 0) {
        return { error: "Please enter a valid non-negative total bill amount." };
    }

    if (!Number.isInteger(numPeople) || numPeople < 1) {
        return { error: "Number of people must be a whole number of at least 1." };
    }

    if (isNaN(tipPercent) || tipPercent < 0 || tipPercent > 100) {
        return { error: "Tip must be between 0 and 100 percent." };
    }

    const tipAmount = totalBill * (tipPercent / 100);
    const totalWithTip = totalBill + tipAmount;

    // Work in centavos to avoid floating point issues
    const totalCentavos = Math.round(totalWithTip * 100);
    const baseShareCentavos = Math.floor(totalCentavos / numPeople);
    const remainderCentavos = totalCentavos % numPeople;

    if (remainderCentavos === 0) {
        return {
            type: 'even',
            amount: baseShareCentavos / 100
        };
    } else {
        const extraShareCentavos = baseShareCentavos + 1;
        const numPeopleExtra = remainderCentavos;
        const numPeopleBase = numPeople - remainderCentavos;

        return {
            type: 'uneven',
            baseAmount: baseShareCentavos / 100,
            numPeopleBase: numPeopleBase,
            extraAmount: extraShareCentavos / 100,
            numPeopleExtra: numPeopleExtra
        };
    }
}

// Ensure it can be exported for Node.js testing without breaking the browser script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateSplit };
}

// Browser logic
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const calculateBtn = document.getElementById('calculate-btn');
        const totalBillInput = document.getElementById('total-bill');
        const numPeopleInput = document.getElementById('num-people');
        const tipPercentInput = document.getElementById('tip-percent');
        const resultSection = document.getElementById('result-section');
        const resultContent = document.getElementById('result-content');

        function clearResult() {
            resultSection.style.display = 'none';
            resultContent.innerHTML = '';
        }

        [totalBillInput, numPeopleInput, tipPercentInput].forEach(input => {
            input.addEventListener('input', clearResult);
        });

        calculateBtn.addEventListener('click', () => {
            clearResult();

            const result = calculateSplit(
                totalBillInput.value,
                numPeopleInput.value,
                tipPercentInput.value
            );

            if (result.error) {
                alert(result.error);
                return;
            }

            const formatCurrency = (val) => {
                return val.toLocaleString('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            };

            if (result.type === 'even') {
                resultContent.innerHTML = `
                    <h2>Each Person Pays</h2>
                    <div class="amount">${formatCurrency(result.amount)}</div>
                `;
            } else if (result.type === 'uneven') {
                const p1 = result.numPeopleBase === 1 ? 'person pays' : 'people pay';
                const p2 = result.numPeopleExtra === 1 ? 'person pays' : 'people pay';

                resultContent.innerHTML = `
                    <h2>Split Breakdown</h2>
                    <div class="split-detail">
                        ${result.numPeopleBase} ${p1} ${formatCurrency(result.baseAmount)},<br>
                        ${result.numPeopleExtra} ${p2} ${formatCurrency(result.extraAmount)}
                    </div>
                `;
            }

            resultSection.style.display = 'block';
        });
    });
}
