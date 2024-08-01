let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_filter = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let sample_panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    //Object.entries() static method, refernced Prof. Booth's instructions
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [key, value] of Object.entries(sample_filter)) {
      sample_panel.append("h6").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let sample_data = data.samples; 

    // Filter the samples for the object with the desired sample number
    let sample_info = sample_data.filter(x => x.id === sample)[0];
    console.log(sample_info);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_info.otu_ids;
    let otu_labels = sample_info.otu_labels;
    let sample_values = sample_info.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'YlOrRd',
        type: 'heatmap'
      }
    }

    // Render the Bubble Chart
    // Create data array
    let bubble_traces = [bubble_trace];

    // Bubble Chart Layout
    let bubble_layout = {
      //background color, code from chat gbt
      paper_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      plot_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      title: {
        text: 'Bacteria Cultures Per Sample',
        font: {
          color: 'white',
          size: 28
        }},
      xaxis: {
        title: 'OTU ID',
        color: "white"
        },
      yaxis: {
        title: 'Number of Bacteria',
        color: "white"
        },
      showlegend: false
    }

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", bubble_traces, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let y_bar_val = otu_ids.map(x => `OTU: ${x}`);
    //console log
    console.log(y_bar_val);

    // Build a Bar Chart
    // slice and reverse the input 
    let bar_trace = {
      x: sample_values.slice(0,10).reverse(),
      y: y_bar_val.slice(0,10).reverse(),
      type: 'bar',
      marker: {
        colorscale: 'YlOrRd',
        color: sample_values.slice(0,10).reverse()
      },
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }

    // Render the Bar Chart
    // Create data array
    let bar_traces = [bar_trace];

    // Bar Chart Layout
    // Apply a title to the layout
    let bar_layout = {
      //background color, code from chat gbt
      paper_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      plot_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      font: {
          color: 'white'
        },
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: {
          color: 'white',
          size: 28
        }},
      xaxis: {
        title: 'Number of Bacteria'
        }
    }
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", bar_traces, bar_layout);
    });
  }

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    //print received data
    console.log(data);

    // Get the names field
    let sample_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < sample_names.length; i++){
      //
      let sample_name = sample_names[i];
      //append each sample name to list
      dropdown.append("option").text(sample_name);
    }

    // Get the first sample from the list
      let first_sample = sample_names[0];
      console.log(first_sample);

    // Build charts and metadata panel with the first sample
      buildCharts(first_sample);
      buildMetadata(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();