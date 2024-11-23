<script>
	let assets = ["Gold", "SPY", "Bitcoin"];
	let selectedAsset = "Gold";
  
	const timeFrames = [
	  { label: "Past Month", months: 1 },
	  { label: "Past 6 Months", months: 6 },
	  { label: "Past 1 Year", months: 12 },
	  { label: "Past 5 Years", months: 60 },
	  { label: "Past 10 Years", months: 120 },
	  { label: "Past 25 Years", months: 300 },
	];
  
	let selectedTimeFrame = timeFrames[2]; // Default: Past 1 Year
  </script>
  
  <style>
	.app-container {
	  font-family: Arial, sans-serif;
	  margin: 20px;
	}
  
	.header {
	  text-align: center;
	  margin-bottom: 20px;
	}
  
	.filters {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 20px;
	}
  
	.filter-group {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
  
	.time-buttons {
	  display: flex;
	  gap: 10px;
	  flex-wrap: wrap;
	  justify-content: center;
	}
  
	.time-buttons button {
	  padding: 5px 10px;
	  font-size: 0.9em;
	  border: 1px solid #ccc;
	  background: #f5f5f5;
	  cursor: pointer;
	  border-radius: 4px;
	  transition: background 0.2s, color 0.2s;
	}
  
	.time-buttons button:hover {
	  background: #007acc;
	  color: #fff;
	}
  
	.time-buttons button.active {
	  background: #007acc;
	  color: #fff;
	  font-weight: bold;
	}
  
	.chart-placeholder {
	  border: 2px dashed #ccc;
	  height: 400px;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  color: #888;
	}
  
	label {
	  margin-bottom: 5px;
	}
  </style>
  
  <head>
	<link rel="icon" href="/graph-favicon.png" type="image/png" />
  </head>
  
  <div class="app-container">
	<div class="header">
	  <h1>Recurring Asset Analysis</h1>
	  <p>Analyze the impact of recurring weekly investments.</p>
	</div>
  
	<div class="filters">
	  <!-- Asset Dropdown -->
	  <div class="filter-group">
		<label for="asset-select">Select Asset:</label>
		<select id="asset-select" bind:value={selectedAsset}>
		  {#each assets as asset}
			<option value={asset}>{asset}</option>
		  {/each}
		</select>
	  </div>
	</div>
  
	<!-- Time Filter Buttons -->
	<div class="filter-group">
	  <label for="time-frame-select">Time Frame:</label>
	  <div class="time-buttons" id="time-frame-select">
		{#each timeFrames as timeFrame (timeFrame.label)}
		  <button
			on:click={() => (selectedTimeFrame = timeFrame)}
			class:selected={selectedTimeFrame === timeFrame}
		  >
			{timeFrame.label}
		  </button>
		{/each}
	  </div>
	</div>
  
	<!-- Placeholder for Line Chart -->
	<div class="chart-placeholder">
	  <p>Line Chart Placeholder for {selectedTimeFrame.label}</p>
	</div>
  </div>
  