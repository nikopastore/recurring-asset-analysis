<script>
    import { onMount } from "svelte";
    import Chart from "./Chart.svelte";

    // Assets and default selection
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    // Time frames
    const timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 },
    ];
    let selectedTimeFrame = timeFrames[2]; // Default to 1 Year

    // Descriptions for assets
    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    let assetData = [];
    let filteredData = [];
    let investmentAmount = 100; // Default weekly investment
    let loading = true;
    let errorMessage = "";

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();
            updateFilteredData();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        } finally {
            loading = false;
        }
    });

    $: updateFilteredData();
    function updateFilteredData() {
        if (!assetData || assetData.length === 0) return;

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
        gap: 20px;
        margin: 20px auto;
    }

    select {
        padding: 8px;
        font-size: 16px;
    }

    .time-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    .time-buttons button {
        padding: 8px;
        font-size: 14px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        border-radius: 4px;
        transition: background 0.2s, color 0.2s;
        cursor: pointer;
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

    .chart-container {
        margin: 20px auto;
        max-width: 900px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
    }

    .error {
        color: red;
        text-align: center;
        margin: 20px;
    }
</style>

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

    <!-- Chart Container -->
    <div class="chart-container">
        <Chart {filteredData} {investmentAmount} />
    </div>
</div>
