//Dynamic Bar Chart showing distribution/number of beginner, intermediate, and difficult slopes across different resorts 

// Fetch data from csv and console log it
 data = fetch('https://github.com/BootcampCoderTF/Nordic-Navigators/blob/main/Resources/Processed/difficulty.csv', {
  mode: 'no-cors'
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

//x = Number of resorts
//y = Difficulty type (beginner, intermediate, advanced)

var trace1 = {
  x: data(["Easy", "Intermediate", "Difficult"]),
  y: [],
  type: "bar",
  orientation: "h"
};

var traceData = [trace1];

var layout = {
  title: "Distribution Of Resorts Accross All Difficulty Levels",
};

Plotly.newPlot("hbar-plot", traceData, layout)
