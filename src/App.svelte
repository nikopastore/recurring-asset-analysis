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
    let selectedTimeFrame = timeFrames[2]; // Default: 1 Year

    // Weekly investment amount
    let investmentAmount = 10; // Default to $10 per week

    // Descriptions for assets
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

    // Fetch data
    onMount(async () => {
    try {
        const response = await fetch("/normalized_prices.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        assetData = await response.json();
        console.log("Data successfully loaded:", assetData); // Debugging line
        updateFilteredData();
    } catch (error) {
        errorMessage = `Error loading data: ${error.message}`;
        console.error(errorMessage);
    } finally {
        loading = false;
    }
});


    // Update filtered data dynamically
    $: updateFilteredData();
    function updateFilteredData() {
        if (!assetData.length) return;

        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));

        const groupedData = {};

        // Initialize grouped data for each weekday
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach(day => {
            groupedData[day] = { cumulativeInvestment: [], values: [] };
        });

        assetData
            .filter(
                (record) =>
                    record.Asset === selectedAsset &&
                    new Date(record.Date) >= cutoffDate
            )
            .forEach((record, index) => {
                const day = new Date(record.Date).toLocaleString("en-US", { weekday: "long" });
                if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day)) {
                    const lastInvestment = groupedData[day].cumulativeInvestment.slice(-1)[0] || 0;
                    groupedData[day].cumulativeInvestment.push(lastInvestment + investmentAmount);
                    groupedData[day].values.push({ date: record.Date, close: record.Close });
                }
            });

        filteredData = groupedData;
    }
</script>

<!-- Preserved Styles -->
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

    .investment-input {
        text-align: center;
        margin-bottom: 20px;
    }

    .investment-input input {
        padding: 5px;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #ccc;
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
            <select id="asset-select" bind:value={selectedAsset}>
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
                    on:click={() => (selectedTimeFrame = timeFrame)}
                >
                    {timeFrame.label}
                </button>
            {/each}
        </div>
    </div>

    <!-- Weekly Investment Input -->
    <div class="investment-input">
        <label for="investment-amount">Weekly Investment ($):</label>
        <input
            type="number"
            id="investment-amount"
            bind:value={investmentAmount}
            min="1"
            step="1"
        />
    </div>

    <!-- Asset Description -->
    <div class="description">
        {assetDescriptions[selectedAsset]}
    </div>

    <!-- Error Message -->
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <!-- Chart -->
    <Chart {filteredData} />
</div>
