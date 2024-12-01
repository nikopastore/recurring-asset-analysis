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
        { label: "Past 25 Years", months: 300 },
    ];
    let selectedTimeFrame = timeFrames[2];
    let investmentAmount = 100;

    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    let assetData = [];
    let filteredData = [];
    let loading = true;
    let errorMessage = "";

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
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

        filteredData = assetData
            .filter(
                (record) =>
                    record.Asset === selectedAsset &&
                    new Date(record.Date) >= cutoffDate
            )
            .map((record) => ({
                ...record,
                WeeklyInvestment: calculateInvestment(record.Close),
            }));
    }

    function calculateInvestment(price) {
        return (investmentAmount / price).toFixed(2);
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
        font-family: Arial, sans-serif;
        margin: 0;
        background: #f9f9f9;
        color: #333;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }

    .filter-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
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
        padding: 8px 12px;
        border: 1px solid #ccc;
        background: #fff;
        border-radius: 5px;
        cursor: pointer;
    }

    .time-buttons button.active {
        background: #007acc;
        color: white;
        font-weight: bold;
    }

    .description {
        margin: 20px 0;
        font-style: italic;
    }

    .investment-input {
        margin: 20px 0;
    }

    .chart-container {
        margin-top: 30px;
    }

    .error {
        color: red;
    }
</style>

<div class="container">
    <h1>Recurring Asset Analysis</h1>

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

    <!-- Weekly Investment -->
    <div class="investment-input">
        <label for="investment-amount">Weekly Investment ($):</label>
        <input
            id="investment-amount"
            type="number"
            bind:value={investmentAmount}
            min="1"
        />
    </div>

    <!-- Asset Description -->
    <div class="description">
        {assetDescriptions[selectedAsset]}
    </div>

    <!-- Chart -->
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else}
        <div class="chart-container">
            <Chart {filteredData} {investmentAmount} />
        </div>
    {/if}
</div>
