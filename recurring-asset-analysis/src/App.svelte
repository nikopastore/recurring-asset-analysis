<script>
	// Placeholder data for dropdown and time range
	let assets = ["Gold", "SPY", "Bitcoin"];
	let selectedAsset = "Gold";
  
	// Time range values (1 month to 20 years in months)
	let timeRange = 12; // Default to 1 year
	let maxTimeRange = 240; // 20 years
  </script>
  
  <style>
	/* Basic styling for layout */
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
	  margin-bottom: 20px;
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
	  margin-right: 10px;
	}
  </style>
  
  <div class="app-container">
	<div class="header">
	  <h1>Recurring Asset Analysis</h1>
	  <p>Analyze the impact of recurring weekly investments.</p>
	</div>
  
	<div class="filters">
	  <!-- Asset Dropdown -->
	  <div>
		<label for="asset-select">Select Asset:</label>
		<select id="asset-select" bind:value={selectedAsset}>
		  {#each assets as asset}
			<option value={asset}>{asset}</option>
		  {/each}
		</select>
	  </div>
  
	  <!-- Time Range Slider -->
	  <div>
		<label for="time-range">Time Range:</label>
		<input
		  id="time-range"
		  type="range"
		  min="1"
		  max={maxTimeRange}
		  step="1"
		  bind:value={timeRange}
		/>
		<span>{timeRange} months</span>
	  </div>
	</div>
  
	<!-- Placeholder for Line Chart -->
	<div class="chart-placeholder">
	  <p>Line Chart Placeholder</p>
	</div>
  </div>
  