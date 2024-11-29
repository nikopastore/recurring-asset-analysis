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

    const assetDescriptions = {
        Gold: "A precious metal often seen as a hedge against inflation.",
        SPY: "An ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "A decentralized digital currency powered by blockchain technology.",
    };

    // Data fetching
    let assetData = [];
    let loading = true;

    fetch("./historical_prices.json")
        .then((response) => response.json())
        .then((data) => {
            assetData = data;
            loading = false;
            console.log("Data loaded:", assetData);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            loading = false;
        });
</script>

<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        color: #000000;
    }

    .header {
        text-align: center;
        margin: 20px 0;
    }

    .filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px auto;
        max-width: 800px;
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

    .description {
        text-align: center;
        margin: 20px 0;
        font-style: italic;
    }

    .chart-placeholder {
        border: 2px dashed #ccc;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        background: #f9f9f9;
        margin: 20px auto;
        width: calc(100% - 40px); /* Spans almost the full width */
        max-width: 1200px; /* Prevents it from becoming too wide on large screens */
    }

    .data-list {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #ccc;
        margin: 20px auto;
        padding: 10px;
        width: calc(100% - 40px);
        max-width: 800px;
        background: #f9f9f9;
        border-radius: 4px;
    }

    label {
        margin-bottom: 5px;
    }
</style>

<div>
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

    <!-- Asset Description -->
    <div class="description">
        {assetDescriptions[selectedAsset] || "No description available."}
    </div>

    <!-- Placeholder for Line Chart -->
    <div class="chart-placeholder">
        <p>Line Chart Placeholder for {selectedTimeFrame.label}</p>
    </div>

    <!-- Data Display -->
    <div class="data-list">
        {#if loading}
            <p>Loading data...</p>
        {:else if assetData.length === 0}
            <p>No data available.</p>
        {:else}
            <ul>
                {#each assetData.filter(record => record.Asset === selectedAsset) as { Asset, Date, Close }}
                    <li>
                        <strong>{Asset}</strong>: {Date} - ${Close ? Close.toFixed(2) : "N/A"}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
