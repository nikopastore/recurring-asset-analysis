<script>
    import { onMount } from "svelte";

    // Define assets and default selection
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    // Define time frames
    const timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 },
    ];
    let selectedTimeFrame = timeFrames[2]; // Default: Past 1 Year

    // Asset descriptions
    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    // Data storage
    let assetData = [];
    let filteredData = [];
    let loading = true;
    let errorMessage = "";

    // Fetch data on mount
    onMount(async () => {
        try {
            const response = await fetch("/normalized_prices.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();
            console.log("Data loaded:", assetData);
            updateFilteredData();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        } finally {
            loading = false;
        }
    });

    // Update filtered data based on selected asset and time frame
    $: updateFilteredData();
    function updateFilteredData() {
        if (!assetData || assetData.length === 0) {
            filteredData = [];
            return;
        }

        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));

        filteredData = assetData.filter(
            (record) =>
                record.Asset === selectedAsset &&
                new Date(record.Date) >= cutoffDate
        );
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
    }
</script>

<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
    }

    h1 {
        text-align: center;
        margin-top: 20px;
    }

    .filter-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        margin: 20px auto;
    }

    select, button {
        padding: 8px;
        font-size: 16px;
        cursor: pointer;
    }

    .time-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    .time-buttons button {
        border: 1px solid #ccc;
        background: #f5f5f5;
        border-radius: 4px;
        transition: background 0.2s, color 0.2s;
    }

    .time-buttons button:hover {
        background: #007acc;
        color: white;
    }

    .time-buttons button.active {
        background: #007acc;
        color: white;
        font-weight: bold;
    }

    .description {
        text-align: center;
        font-style: italic;
        margin: 20px;
    }

    .data-list {
        max-width: 800px;
        margin: 20px auto;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        background-color: #fff;
        max-height: 300px;
        overflow-y: auto;
    }

    .data-list ul {
        padding: 0;
        list-style: none;
    }

    .data-list li {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }

    .data-list li:last-child {
        border-bottom: none;
    }

    .error {
        color: red;
        text-align: center;
        margin: 20px;
    }
</style>

<!-- HTML Structure -->
<div>
    <!-- Page Title -->
    <h1>Recurring Asset Analysis</h1>

    <!-- Filters -->
    <div class="filter-container">
        <!-- Asset Dropdown -->
        <div>
            <label for="asset-select">Select Asset:</label>
            <select id="asset-select" on:change={handleAssetChange}>
                {#each assets as asset}
                    <option value={asset}>{asset}</option>
                {/each}
            </select>
        </div>

        <!-- Time Frame Buttons -->
        <div class="time-buttons">
            {#each timeFrames as timeFrame (timeFrame.label)}
                <button
                    class:selected={selectedTimeFrame === timeFrame}
                    on:click={() => handleTimeFrameChange(timeFrame)}
                >
                    {timeFrame.label}
                </button>
            {/each}
        </div>
    </div>

    <!-- Asset Description -->
    <div class="description">
        {assetDescriptions[selectedAsset]}
    </div>

    <!-- Error Message -->
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <!-- Data Display -->
    <div class="data-list">
        {#if loading}
            <p>Loading data...</p>
        {:else if filteredData.length === 0}
            <p>No data available for {selectedAsset} in the selected time frame.</p>
        {:else}
            <ul>
                {#each filteredData as { Date, Close }}
                    <li>
                        <strong>{Date}:</strong> ${Close.toFixed(2)}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
