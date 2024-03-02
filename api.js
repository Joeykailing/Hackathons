const axios = require('axios');

// Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
const apiKey = 'C49GO3ZJZG0PD1HM';
const symbol = 'AAPL'; // Replace with the stock symbol you want to query

const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

axios.get(apiUrl)
  .then(response => {
    // Handle the API response here
    console.log(response.data);
  })
  .catch(error => {
    // Handle errors here
    console.error('Error fetching data from Alpha Vantage:', error);
  });
