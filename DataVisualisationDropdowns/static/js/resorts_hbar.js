// Fetch data from CSV files and create the plot
Promise.all([
  fetch('http://localhost:8000/static/data/difficulty.csv').then(response => response.text()), // Fetch difficulty data
  fetch('http://localhost:8000/static/data/price.csv').then(response => response.text()) // Fetch price data
])
.then(([difficultyCsv, priceCsv]) => {
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
      return { price: priceEntry ? priceEntry.Adult : 0, distance: entry.distance };
  });
  const intermediatePrices = top10IntermediateDistances.map(entry => {
      const priceEntry = priceData.find(price => price['Resort ID'] === entry.id);
      return { price: priceEntry ? priceEntry.Adult : 0, distance: entry.distance };
  });
  const difficultPrices = top10DifficultDistances.map(entry => {
      const priceEntry = priceData.find(price => price['Resort ID'] === entry.id);
      return { price: priceEntry ? priceEntry.Adult : 0, distance: entry.distance };
  });
  
  // Sort the prices in descending order
  beginnerPrices.sort((a, b) => b.price - a.price);
  intermediatePrices.sort((a, b) => b.price - a.price);
  difficultPrices.sort((a, b) => b.price - a.price);
  
  // Take the top 10 values
  const top10BeginnerPrices = beginnerPrices.slice(0, 10);
  const top10IntermediatePrices = intermediatePrices.slice(0, 10);
  const top10DifficultPrices = difficultPrices.slice(0, 10);
  
  // Extracting data for plotting
  const beginnerData = {
      x: top10BeginnerPrices.map(entry => entry.price),
      y: top10BeginnerPrices.map(entry => entry.distance),
      text: top10BeginnerPrices.map(entry => entry.distance),
      type: 'bar',
      orientation: 'h',
      width: 0.5 // Adjust the width of bars
  };
  
  const intermediateData = {
      x: top10IntermediatePrices.map(entry => entry.price),
      y: top10IntermediatePrices.map(entry => entry.distance),
      text: top10IntermediatePrices.map(entry => entry.distance),
      type: 'bar',
      orientation: 'h',
      width: 0.5 // Adjust the width of bars
  };
  
  const difficultData = {
      x: top10DifficultPrices.map(entry => entry.price),
      y: top10DifficultPrices.map(entry => entry.distance),
      text: top10DifficultPrices.map(entry => entry.distance),
      type: 'bar',
      orientation: 'h',
      width: 0.5 // Adjust the width of bars
  };
  
  // Define the layout for the plot
  const layout = {
      title: 'Top 10 Resorts by Price',
      yaxis: { title: 'Distance' }
  };
  
  // Plot the data
  Plotly.newPlot('beginner-price-plot', [beginnerData], layout);
  Plotly.newPlot('intermediate-price-plot', [intermediateData], layout);
  Plotly.newPlot('difficult-price-plot', [difficultData], layout);
})
