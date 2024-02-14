// Fetch data from CSV files and create the plot
Promise.all([
  fetch('http://localhost:8000/static/data/difficulty.csv').then(response => response.text()), // Fetch difficulty data
  fetch('http://localhost:8000/static/data/price.csv').then(response => response.text()), // Fetch price data
  fetch('http://localhost:8000/static/data/location2.csv').then(response => response.text()) // Fetch location data
])
.then(([difficultyCsv, priceCsv, locationCsv]) => {
  // Parse CSV data for difficulty
  const difficultyData = Papa.parse(difficultyCsv, { header: true }).data;
  
  // Extract distances for each difficulty level
  const beginnerDistances = difficultyData.map(entry => ({ distance: entry.Easy, id: entry['Resort ID'] }));
  const intermediateDistances = difficultyData.map(entry => ({ distance: entry.Intermediate, id: entry['Resort ID'] }));
  const difficultDistances = difficultyData.map(entry => ({ distance: entry.Difficult, id: entry['Resort ID'] }));
  
  // Sort distances in descending order
  beginnerDistances.sort((a, b) => b.distance - a.distance);
  intermediateDistances.sort((a, b) => b.distance - a.distance);
  difficultDistances.sort((a, b) => b.distance - a.distance);
  
  // Take the top 10 distances
  const top10BeginnerDistances = beginnerDistances.slice(0, 10);
  const top10IntermediateDistances = intermediateDistances.slice(0, 10);
  const top10DifficultDistances = difficultDistances.slice(0, 10);
  
  // Parse CSV data for price
  const priceData = Papa.parse(priceCsv, { header: true }).data;
  
  // Match Resort ID with price
  const beginnerPrices = top10BeginnerDistances.map(entry => {
      const priceEntry = priceData.find(price => price['Resort ID'] === entry.id);
      return { price: priceEntry ? priceEntry.Adult : 0, distance: entry.distance, id: entry.id };
  });
  const intermediatePrices = top10IntermediateDistances.map(entry => {
      const priceEntry = priceData.find(price => price['Resort ID'] === entry.id);
      return { price: priceEntry ? priceEntry.Adult : 0, distance: entry.distance, id: entry.id };
  });
  const difficultPrices = top10DifficultDistances.map(entry => {
      const priceEntry = priceData.find(price => price['Resort ID'] === entry.id);
      return { price: priceEntry ? priceEntry.Adult : 0, distance: entry.distance, id: entry.id };
  });
  
  // Sort the prices in descending order
  beginnerPrices.sort((a, b) => b.price - a.price);
  intermediatePrices.sort((a, b) => b.price - a.price);
  difficultPrices.sort((a, b) => b.price - a.price);
  
  // Take the top 10 values
  const top10BeginnerPrices = beginnerPrices.slice(0, 10);
  const top10IntermediatePrices = intermediatePrices.slice(0, 10);
  const top10DifficultPrices = difficultPrices.slice(0, 10);
  
  // Parse CSV data for location
  const locationData = Papa.parse(locationCsv, { header: true }).data;
  
  // Match Resort ID with resort name
  const beginnerResorts = top10BeginnerDistances.map(entry => {
      const locationEntry = locationData.find(location => location['Resort ID'] === entry.id);
      return locationEntry ? locationEntry['Resort Name'] : '';
  });
  const intermediateResorts = top10IntermediateDistances.map(entry => {
      const locationEntry = locationData.find(location => location['Resort ID'] === entry.id);
      return locationEntry ? locationEntry['Resort Name'] : '';
  });
  const difficultResorts = top10DifficultDistances.map(entry => {
      const locationEntry = locationData.find(location => location['Resort ID'] === entry.id);
      return locationEntry ? locationEntry['Resort Name'] : '';
  });
  
  // Extracting data for plotting
  const beginnerData = {
      x: top10BeginnerPrices.map(entry => entry.price),
      y: beginnerResorts.map((resort, index) => `<b>${resort}</b> - ${top10BeginnerDistances[index].distance}m`),
      text: top10BeginnerPrices.map(entry => `${entry.distance}m, ${entry.price === 0 ? 'Free!' : `£${entry.price}`}`), // Include distance, price, and resort name in the hover text
      type: 'bar',
      orientation: 'h', // Set orientation to horizontal
      width: 0.5, // Adjust the width of bars
      marker: { color: 'green' } // Set bar color to green
  };
  
  const intermediateData = {
      x: top10IntermediatePrices.map(entry => entry.price),
      y: intermediateResorts.map((resort, index) => `<b>${resort}</b> - ${top10IntermediateDistances[index].distance}m`),
      text: top10IntermediatePrices.map(entry => `${entry.distance}m, ${entry.price === 0 ? 'Free!' : `£${entry.price}`}`), // Include distance, price, and resort name in the hover text
      type: 'bar',
      orientation: 'h', // Set orientation to horizontal
      width: 0.5, // Adjust the width of bars
      marker: { color: 'blue' } // Set bar color to blue
  };
  
  const difficultData = {
      x: top10DifficultPrices.map(entry => entry.price),
      y: difficultResorts.map((resort, index) => `<b>${resort}</b> - ${top10DifficultDistances[index].distance}m`),
      text: top10DifficultPrices.map(entry => `${entry.distance}m, ${entry.price === 0 ? 'Free!' : `£${entry.price}`}`), // Include distance, price, and resort name in the hover text
      type: 'bar',
      orientation: 'h', // Set orientation to horizontal
      width: 0.5, // Adjust the width of bars
      marker: { color: 'darkred' } // Set bar color to dark red
  };
  
  // Define the layout for the plot
  const layout = {
      title: 'Top 10 Resorts by Price',
      yaxis: { title: 'Distance' }, // Set y-axis title to Distance
      xaxis: { title: 'Price' }, // Set x-axis title to Price
      margin: { t: 50, b: 50, l: 700, r: 50 } // Adjust the margin for better positioning
  };
  
  // Plot the data
  Plotly.newPlot('beginner-price-plot', [beginnerData], {...layout, title: 'Top 10 Longest Beginner Courses'});
  Plotly.newPlot('intermediate-price-plot', [intermediateData], {...layout, title: 'Top 10 Longest Intermediate Courses'});
  Plotly.newPlot('difficult-price-plot', [difficultData], {...layout, title: 'Top 10 Longest Difficult Courses'});
})