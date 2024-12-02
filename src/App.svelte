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
    let selectedTimeFrame = timeFrames[2]; // Default: 1 Year
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
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
    }

    .container {
        text-align: center;
        margin: 20px auto;
        max-width: 800px;
    }

    h1 {
        font-size: 2em;
        margin-bottom: 20px;
    }

    .filter-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    select,
    input {
        padding: 8px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .time-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    .time-buttons button {
        padding: 10px 15px;
        font-size: 14px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        border-radius: 4px;
        cursor: pointer;
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
        font-style: italic;
        margin: 20px 0;
    }

    .error {
        color: red;
        margin: 20px 0;
    }

    .chart-container {
        margin-top: 20px;
    }
</style>

<div class="container">
    <h1>Recurring Asset Analysis</h1>

    <!-- Filters -->
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

        <div>
            <label for="investment-amount">Weekly Investment ($):</label>
            <input
                id="investment-amount"
                type="number"
                bind:value={investmentAmount}
                min="1"
            />
        </div>
    </div>

    <div class="description">
        {assetDescriptions[selectedAsset]}
    </div>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else}
        <div class="chart-container">
            <Chart {filteredData} {investmentAmount} />
        </div>
    {/if}
</div>
