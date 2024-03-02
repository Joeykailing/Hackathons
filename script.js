// script.js






const apiKey = 'C49GO3ZJZG0PD1HM';

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

// Function to predict whether the stock price will go up or down for a given date
const upOrDown = async (predictedDate) => {
  try {
    // Fetch data for the specified symbol
    const rawData = await fetchData();

    // Format data for Chart.js
    const { dates, prices } = formatDataForChart(rawData);

    // Find the index of the predicted date in the array
    const predictedDateIndex = dates.indexOf(predictedDate);

    if (predictedDateIndex !== -1 && predictedDateIndex >= 63) {
      // Extract prices for the past 3 months (approximately 63 days)
      const pastThreeMonthsPrices = prices.slice(predictedDateIndex - 63, predictedDateIndex);

      // Calculate the average price for the past 3 months
      const averagePastThreeMonths = pastThreeMonthsPrices.reduce((sum, price) => sum + price, 0) / pastThreeMonthsPrices.length;

      // Extract prices for the recent past two weeks (approximately 10 days)
      const recentTwoWeeksPrices = prices.slice(predictedDateIndex - 10, predictedDateIndex);

      // Check if the average price of the past 3 months is below the average of the predicted date
      // and if the recent past two weeks prices are increasing
      const isPredictedToGoUp =
        prices[predictedDateIndex] > averagePastThreeMonths &&
        recentTwoWeeksPrices.every((price, index) => index === 0 || price > recentTwoWeeksPrices[index - 1]);

      return isPredictedToGoUp;
    } else {
      console.error('Insufficient data for prediction.');
      return null;
    }
  } catch (error) {
    console.error('Failed to predict:', error);
    return null;
  }
};



const comparePrices = async () => {
  try {
    const rawData = await fetchData();
    const { dates, prices } = formatDataForChart(rawData);

    const symbol = document.getElementById('type');

    const endDateInput = document.getElementById('endDate');

    const endDate = endDateInput.value;

    const resultElement = document.getElementById('comparisonResult');

    const dataForEndDate = rawData[endDate];

    if (dataForEndDate) {
      // Predict whether the stock price will go up or down for the endDate
      const predictedResult = await upOrDown(endDate);

      // Display the prediction result
      if (predictedResult !== null) {
        const predictionText = predictedResult ? 'Predicted to go up' : 'Predicted to go down';
        resultElement.textContent += ` | ${predictionText}`;
      }
    } else {
      resultElement.textContent = `Data not available for one or both of the specified dates`;
    }
  } catch (error) {
    console.error('Failed to compare prices:', error);
  }
};


const initializeChart = async () => {
  try {
    const rawData = await fetchData();
    const { dates, prices } = formatDataForChart(rawData);
    createLineChart(dates, prices);
  } catch (error) {
    console.error('Failed to initialize chart:', error);
  }
};


// Execute functions after the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await initializeChart();
  comparePrices();

  // Example usage
  const predictedDate = '2023-01-31'; // Replace with the desired date
  const predictionResult = await upOrDown(predictedDate);
  console.log(`Predicted to go up: ${predictionResult}`);

});




















// const apiKey = 'C49GO3ZJZG0PD1HM';
// const symbol = 'AAPL';

// const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

// // Function to fetch data from Alpha Vantage API using fetch API
// const fetchData = async () => {
//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data['Time Series (Daily)'];
//   } catch (error) {
//     console.error('Error fetching data from Alpha Vantage:', error);
//     throw error;
//   }
// };

// // Function to format data for Chart.js
// const formatDataForChart = (data) => {
//   const dates = Object.keys(data).reverse();
//   const prices = dates.map(date => parseFloat(data[date]['4. close']));
//   return { dates, prices };
// };

// // Function to create a line chart using Chart.js
// const createLineChart = (dates, prices) => {
//   const ctx = document.getElementById('myChart').getContext('2d');
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: dates,
//       datasets: [{
//         label: 'Stock Price',
//         data: prices,
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//         fill: false,
//       }],
//     },
//   });
// };

// // Function to predict whether the stock price will go up or down for a given date
// const upOrDown = async (predictedDate) => {
//   try {
//     // Fetch data for the specified symbol
//     const rawData = await fetchData();

//     // Format data for Chart.js
//     const { dates, prices } = formatDataForChart(rawData);

//     // Find the index of the predicted date in the array
//     const predictedDateIndex = dates.indexOf(predictedDate);

//     if (predictedDateIndex !== -1 && predictedDateIndex >= 63) {
//       // Extract prices for the past 3 months (approximately 63 days)
//       const pastThreeMonthsPrices = prices.slice(predictedDateIndex - 63, predictedDateIndex);

//       // Calculate the average price for the past 3 months
//       const averagePastThreeMonths = pastThreeMonthsPrices.reduce((sum, price) => sum + price, 0) / pastThreeMonthsPrices.length;

//       // Extract prices for the recent past two weeks (approximately 10 days)
//       const recentTwoWeeksPrices = prices.slice(predictedDateIndex - 10, predictedDateIndex);

//       // Check if the average price of the past 3 months is below the average of the predicted date
//       // and if the recent past two weeks prices are increasing
//       const isPredictedToGoUp =
//         prices[predictedDateIndex] > averagePastThreeMonths &&
//         recentTwoWeeksPrices.every((price, index) => index === 0 || price > recentTwoWeeksPrices[index - 1]);

//       return isPredictedToGoUp;
//     } else {
//       console.error('Insufficient data for prediction.');
//       return null;
//     }
//   } catch (error) {
//     console.error('Failed to predict:', error);
//     return null;
//   }
// };



// const comparePrices = async () => {
//   try {
//     const rawData = await fetchData();
//     const { dates, prices } = formatDataForChart(rawData);

//     const startDateInput = document.getElementById('startDate');
//     const endDateInput = document.getElementById('endDate');

//     const startDate = startDateInput.value;
//     const endDate = endDateInput.value;

//     const resultElement = document.getElementById('comparisonResult');

//     const dataForStartDate = rawData[startDate];
//     const dataForEndDate = rawData[endDate];

//     if (dataForStartDate && dataForEndDate) {
//       const priceForStartDate = parseFloat(dataForStartDate['4. close']);
//       const priceForEndDate = parseFloat(dataForEndDate['4. close']);

//       // Compare values
//       if (priceForStartDate > priceForEndDate) {
//         resultElement.textContent = `Price on ${startDate} is higher than the price on ${endDate}`;
//       } else if (priceForStartDate < priceForEndDate) {
//         resultElement.textContent = `Price on ${startDate} is lower than the price on ${endDate}`;
//       } else {
//         resultElement.textContent = `Prices on ${startDate} and ${endDate} are the same`;
//       }

//       // Predict whether the stock price will go up or down for the endDate
//       const predictedResult = await upOrDown(endDate);

//       // Display the prediction result
//       if (predictedResult !== null) {
//         const predictionText = predictedResult ? 'Predicted to go up' : 'Predicted to go down';
//         resultElement.textContent += ` | ${predictionText}`;
//       }
//     } else {
//       resultElement.textContent = `Data not available for one or both of the specified dates`;
//     }
//   } catch (error) {
//     console.error('Failed to compare prices:', error);
//   }
// };


// const initializeChart = async () => {
//   try {
//     const rawData = await fetchData();
//     const { dates, prices } = formatDataForChart(rawData);
//     createLineChart(dates, prices);
//   } catch (error) {
//     console.error('Failed to initialize chart:', error);
//   }
// };


// // Execute functions after the DOM is ready
// document.addEventListener('DOMContentLoaded', async () => {
//   await initializeChart();
//   comparePrices();

//   // Example usage
//   const predictedDate = '2023-01-31'; // Replace with the desired date
//   const predictionResult = await upOrDown(predictedDate);
//   console.log(`Predicted to go up: ${predictionResult}`);

// });






