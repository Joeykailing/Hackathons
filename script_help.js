const apiKey = 'C49GO3ZJZG0PD1HM';
const symbol = 'AAPL';

const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

// Function to fetch data from Alpha Vantage API using fetch API
const fetchData = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data['Time Series (Daily)'];
  } catch (error) {
    console.error('Error fetching data from Alpha Vantage:', error);
    throw error;
  }
};

// Function to format data for Chart.js
const formatDataForChart = (data) => {
  const dates = Object.keys(data).reverse();
  const prices = dates.map(date => parseFloat(data[date]['4. close']));
  return { dates, prices };
};

// Function to create a line chart using Chart.js
const createLineChart = (dates, prices) => {
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Stock Price',
        data: prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      }],
    },
  });
};

// Function to compare prices based on user-inputted dates
const comparePrices = async () => {
  try {
    const rawData = await fetchData();
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (startDateInput && endDateInput) {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;

      const dataForStartDate = rawData[startDate];
      const dataForEndDate = rawData[endDate];

      const resultElement = document.getElementById('comparisonResult');

      if (dataForStartDate && dataForEndDate) {
        const priceForStartDate = parseFloat(dataForStartDate['4. close']);
        const priceForEndDate = parseFloat(dataForEndDate['4. close']);

        // Compare values
        if (priceForStartDate > priceForEndDate) {
          resultElement.textContent = `Price on ${startDate} is higher than the price on ${endDate}`;
        } else if (priceForStartDate < priceForEndDate) {
          resultElement.textContent = `Price on ${startDate} is lower than the price on ${endDate}`;
        } else {
          resultElement.textContent = `Prices on ${startDate} and ${endDate} are the same`;
        }
      } else {
        resultElement.textContent = `Data not available for one or both of the specified dates`;
      }
    }
  } catch (error) {
    console.error('Failed to compare prices:', error);
  }
};

// Execute the functions after the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const rawData = await fetchData();
  const { dates, prices } = formatDataForChart(rawData);
  createLineChart(dates, prices);
  comparePrices(); // Optional: Call this function to compare prices by default
});
