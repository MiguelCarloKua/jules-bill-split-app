const { calculateSplit } = require('./script.js');

const assert = require('assert');

function test(description, input, expectedStr) {
    try {
        const result = calculateSplit(...input);
        const resultStr = JSON.stringify(result);
        assert.strictEqual(resultStr, expectedStr);
        console.log(`✅ ${description}`);
    } catch (e) {
        console.error(`❌ ${description}`);
        console.error(`   Input: ${JSON.stringify(input)}`);
        console.error(`   Expected: ${expectedStr}`);
        const actual = JSON.stringify(calculateSplit(...input));
        console.error(`   Actual:   ${actual}`);
        console.error(e);
        process.exit(1);
    }
}

// 1. P100/3/0% -> P33.33 * 2 + P33.34 * 1
test('P100/3/0%', ['100', '3', '0'], JSON.stringify({
    type: 'uneven',
    baseAmount: 33.33,
    numPeopleBase: 2,
    extraAmount: 33.34,
    numPeopleExtra: 1
}));

// 2. P110/3 -> evenly divisible? 11000/3 = 3666 R 2 -> 36.66 * 1 + 36.67 * 2
test('P110/3/empty tip', ['110', '3', ''], JSON.stringify({
    type: 'uneven',
    baseAmount: 36.66,
    numPeopleBase: 1,
    extraAmount: 36.67,
    numPeopleExtra: 2
}));

// 3. P1000/7 -> 100000/7 = 14285 R 5 -> 142.85 * 2 + 142.86 * 5
test('P1000/7/empty tip', ['1000', '7', ''], JSON.stringify({
    type: 'uneven',
    baseAmount: 142.85,
    numPeopleBase: 2,
    extraAmount: 142.86,
    numPeopleExtra: 5
}));

// 4. zero people
test('zero people', ['100', '0', '10'], JSON.stringify({
    error: "Number of people must be a whole number of at least 1."
}));

// 5. 3.2 people
test('3.2 people', ['100', '3.2', '10'], JSON.stringify({
    error: "Number of people must be a whole number of at least 1."
}));

// 6. negative bill
test('negative bill', ['-100', '3', '10'], JSON.stringify({
    error: "Please enter a valid non-negative total bill amount."
}));

// 7. 111110% tip
test('huge tip (>100%)', ['100', '3', '111110'], JSON.stringify({
    error: "Tip must be between 0 and 100 percent."
}));

console.log("All tests passed!");
