<script>
    import { onMount } from "svelte";
    import Chart from "./Chart.svelte";

    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    const timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 }
    ];
    let selectedTimeFrame = timeFrames[2];

    let investmentAmount = 100;
    let assetData = [];
    let filteredData = [];
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
        } finally {
            loading = false;
        }
    });

    $: updateFilteredData();
    function updateFilteredData() {
        if (!assetData.length) return;
        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));
        filteredData = assetData.filter(
            record =>
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
        list-style: none;
        padding: 0;
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

<div>
    <h1>Recurring Asset Analysis</h1>

    <div class="filter-container">
        <div>
            <label for="asset-select">Select Asset:</label>
            <select id="asset-select" on:change={handleAssetChange}>
                {#each assets as asset}
                    <option value={asset}>{asset}</option>
                {/each}
            </select>
        </div>

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

    <div>
        <label for="investment-input">Weekly Investment ($):</label>
        <input
            id="investment-input"
            type="number"
            bind:value={investmentAmount}
            min="1"
        />
    </div>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <Chart {filteredData} {investmentAmount} />
</div>
