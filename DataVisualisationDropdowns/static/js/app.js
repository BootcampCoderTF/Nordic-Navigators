// Function to display top 10 most expensive resorts
function displayMostExpensiveResorts(data) {
  // Sort the data by 'Adult Price' in descending order
  data.sort((a, b) => b['Adult Price(\u00a3)'] - a['Adult Price(\u00a3)']);

  // Slice the top 10 most expensive resorts
  var top10 = data.slice(0, 10);

  // Display the table
  displayResortTable(top10);
}

// Function to display top 10 cheapest resorts
function displayCheapestResorts(data) {
  // Sort the data by 'Adult Price' in ascending order
  data.sort((a, b) => a['Adult Price(\u00a3)'] - b['Adult Price(\u00a3)']);

  // Slice the top 10 cheapest resorts
  var top10 = data.slice(0, 10);

  // Display the table
  displayResortTable(top10);
}

// Function to display top 10 countries with the most ski resorts
function displayTopCountries(data) {
  // Group the data by country
  var groupedData = d3.group(data, d => d.Country);

  // Calculate the number of resorts and average price for each country
  var countries = [];
  groupedData.forEach((resorts, country) => {
    var numResorts = resorts.length;
    var avgPrice = d3.mean(resorts, d => d['Adult Price(\u00a3)']);
    countries.push({ country: country, numResorts: numResorts, avgPrice: avgPrice });
  });

  // Sort the countries by the number of resorts in descending order
  countries.sort((a, b) => b.numResorts - a.numResorts);

  // Slice the top 10 countries
  var top10Countries = countries.slice(0, 10);

  // Display the table
  displayCountriesTable(top10Countries);
}

// Function to display resort data table or default message
function displayResortTable(resorts) {
  var panel = d3.select('#sample-metadata');

  // If there are resorts to display
  if (resorts.length > 0) {
    var table = '<table class="resort-table"><thead><tr><th>Resort Name</th><th>Country</th><th>State/Province</th><th>Adult Price</th></tr></thead><tbody>';
    resorts.forEach(resort => {
      table += `<tr><td>${resort['Resort Name']}</td><td>${resort['Country']}</td><td>${resort['State/Province']}</td><td>${formatPrice(resort['Adult Price(\u00a3)'])}</td></tr>`;
    });
    table += '</tbody></table>';
    panel.html(table);
  } else {
    // Display default message
    panel.html('<p>Please select a table to view</p>');
  }
}

// Function to display countries data table
function displayCountriesTable(countries) {
  var panel = d3.select('#sample-metadata');

  // If there are countries to display
  if (countries.length > 0) {
    var table = '<table class="countries-table"><thead><tr><th>Country</th><th>Number of Resorts</th><th>Average Price</th></tr></thead><tbody>';
    countries.forEach(country => {
      table += `<tr><td>${country.country}</td><td>${country.numResorts}</td><td>${formatPrice(country.avgPrice)}</td></tr>`;
    });
    table += '</tbody></table>';
    panel.html(table);
  } else {
    // Display default message
    panel.html('<p>No data available</p>');
  }
}

// Load JSON data and populate dropdown on page load
d3.json('http://localhost:8000/static/data/locationsPriced.json')
  .then(data => {
    var select = d3.select('#selDataset');

    // Add options to the dropdown
    var option1 = select.append('option');
    option1.text('Most Expensive Resorts (Top 10)').attr('value', 'most_expensive');

    var option2 = select.append('option');
    option2.text('Cheapest Resorts (Top 10)').attr('value', 'cheapest');

    var option3 = select.append('option');
    option3.text('Top 10 Countries with Most Resorts').attr('value', 'top_countries');
  })
  .catch(error => console.error('Error loading JSON data:', error));

// Function to handle dropdown change event
function optionChanged(option) {
  d3.json('http://localhost:8000/static/data/locationsPriced.json')
    .then(data => {
      if (option === 'most_expensive') {
        displayMostExpensiveResorts(data);
      } else if (option === 'cheapest') {
        displayCheapestResorts(data);
      } else if (option === 'top_countries') {
        displayTopCountries(data);
      }
    })
    .catch(error => console.error('Error loading JSON data:', error));
}

// Function to format the price in £00.00 format
function formatPrice(price) {
  return '£' + price.toFixed(2);
}
