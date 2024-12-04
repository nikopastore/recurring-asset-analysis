<script>
    import { onMount } from "svelte";
    import Chart from "./Chart.svelte";

    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    let timeFrames = [
        { label: "1 Month", months: 1 },
        { label: "3 Months", months: 3 },
        { label: "6 Months", months: 6 },
        { label: "1 Year", months: 12 },
        { label: "5 Years", months: 60 },
    ];
    let selectedTimeFrame = timeFrames[3]; // Default to 1 Year

    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    let assetData = [];
    let filteredData = [];
    let investmentAmount = 10; // Default investment amount
    let errorMessage = "";

    // Fetch and filter data
    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();
            filterData();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

    function filterData() {
        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));

        filteredData = assetData.filter((record) => {
            const recordDate = new Date(record.Date);
            return record.Asset === selectedAsset && recordDate >= cutoffDate;
        });
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        filterData();
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        filterData();
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        gap: 20px;
    }

    .page-title {
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        margin: 0;
    }

    .filter-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    select, input, button {
        padding: 10px 15px;
        font-size: 1rem;
        border-radius: 5px;
        border: 1px solid #ccc;
        outline: none;
        transition: all 0.3s ease;
    }

    select:focus, input:focus, button:focus {
        border-color: #007acc;
        box-shadow: 0 0 8px rgba(0, 122, 204, 0.5);
    }

    button {
        background-color: #007acc;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #005a99;
    }

    .chart-container {
        margin-top: 30px;
        max-width: 900px;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .error {
        color: red;
        text-align: center;
    }
</style>

<div class="container">
    <h1 class="page-title">Asset Analysis</h1>

    <!-- Filters -->
    <div class="filter-container">
        <label>
            Select Asset:
            <select on:change={handleAssetChange}>
                {#each assets as asset}
                    <option value={asset}>{asset}</option>
                {/each}
            </select>
        </label>

        <label>
            Investment Amount ($):
            <input type="number" min="1" bind:value={investmentAmount} />
        </label>

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

    <p>{assetDescriptions[selectedAsset]}</p>

    <!-- Chart -->
    <div class="chart-container">
        <Chart {filteredData} {investmentAmount} />
    </div>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
</div>
