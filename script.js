
var testosteroneGauge;

function createGauge(value, min, max) {
    testosteroneGauge = new JustGage({
        id: "testosteroneGauge",
        value: value, // Initial midpoint value
        min: min,
        max: max,
        customSectors: {
            ranges: [{
                color: "#ff0000", // Red for the lower third
                lo: min,
                hi: min + (max - min) / 3
            }, {
                color: "#ffff00", // Yellow for the middle third
                lo: min + (max - min) / 3,
                hi: min + 2 * (max - min) / 3
            }, {
                color: "#00ff00", // Green for the upper third
                lo: min + 2 * (max - min) / 3,
                hi: max
            }]
        },
     gaugeWidthScale: 1
    });
}
// In pmol/l
function convertToPmolL(pg_ml) {
    const molecularWeight = 288.42; // g/mol
    return (pg_ml * (1 / molecularWeight) * 1e6) / 1000; // Convert pg/ml to pmol/L
}
// In pg/ml
function getTestosteroneRange(age) {
    // Updated testosterone ranges based on the new chart based on https://androgenhacker.com/testosterone-levels#:~:text=And%20the%20same%20data%20in,60%20552%20ng%2Fdl
    if (age < 25) return [52.5, 207];
    if (age < 30) return [50.5, 198];
    if (age < 35) return [48.5, 190];
    if (age < 40) return [46.5, 181];
    if (age < 45) return [44.6, 171];
    if (age < 50) return [42.6, 164];
    if (age < 55) return [40.6, 156];
    if (age < 60) return [38.7, 147];
    if (age < 65) return [36.7, 139];
    if (age < 70) return [34.7, 130];
    if (age < 75) return [32.8, 122];
    if (age < 80) return [30.8, 113];
    if (age < 85) return [28.8, 105];
    if (age < 90) return [26.9, 96];
    if (age < 95) return [24.9, 88];
    return [22.9, 79]; // Default for age 95-100
}
function getTRangePmolL(age) {
    // Define the testosterone ranges for different ages in pg/ml
    // Then convert each range to pmol/L
    let range = getTestosteroneRange(age)
    return [convertToPmolL(range[0]), convertToPmolL(range[1])]; // Default for age 95-100
}


function checkLevel() {
    var age = document.getElementById('age').value;
    var level = document.getElementById('testosteroneLevel').value;
    var selectedUnit = document.getElementById('unit').value;
    var range;

    if (selectedUnit === 'pgml') {
        range = getTestosteroneRange(age);
    } else {
        range = getTRangePmolL(age);
    }

    min = range[0];
    max = range[1];
    console.log(range);
    /*  if (level < range[0]) {
          position = 0;
          alert(`Your testosterone level ${level}${selectedUnit} is below the normal range for your age.`);
      } else {
          position = (level - range[0]) / (range[1] - range[0]);
          position = Math.min(Math.max(position, 0), 1);
      }*/
    testosteroneGauge.destroy();
    createGauge(level, min, max);
    displayRangeTable(selectedUnit);
}
function displayRangeTable(unit) {
    const tableContainer = document.getElementById('rangeTableContainer');
    tableContainer.innerHTML = ''; // Clear previous table

    // Table headers
    let tableHTML = '<table border="1"><tr><th>Age Range</th><th>Low (' + unit + ')</th><th>High (' + unit + ')</th></tr>';

    // Generate rows for each age range
    for (let age = 20; age <= 100; age += 5) {
        let range = unit === 'pgml' ? getTestosteroneRange(age) : getTRangePmolL(age);
        tableHTML += `<tr><td>${age}-${age + 4}</td><td>${range[0].toFixed(2)}</td><td>${range[1].toFixed(2)}</td></tr>`;
    }

    tableHTML += '</table>';
    tableContainer.innerHTML = tableHTML;
}
// Initialize the gauge when the page loads
window.onload = function () {
    createGauge(0, 0, 100);
};  