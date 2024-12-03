<script>
    import Chart from "./Chart.svelte";
    import { onMount } from "svelte";

    // Default values
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";
    let timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 },
    ];
    let selectedTimeFrame = timeFrames[2]; // Default: 1 Year
    let investmentAmount = 10; // Default weekly investment

    // Data
    let filteredData = [];
    let loading = true;
    let errorMessage = "";

    // Fetch and filter data
    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            const rawData = await response.json();

            // Filter and sort data
            updateFilteredData(rawData);
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
        } finally {
            loading = false;
        }
    });

    function updateFilteredData(rawData) {
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setMonth(today.getMonth() - selectedTimeFrame.months);

        filteredData = rawData
            .filter((d) => d.Asset === selectedAsset && new Date(d.Date) >= cutoffDate)
            .sort((a, b) => new Date(a.Date) - new Date(b.Date));

        console.log("Filtered Data:", filteredData);
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        updateFilteredData(filteredData);
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        updateFilteredData(filteredData);
    }
</script>

<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
    }

    main {
        padding: 1rem;
        text-align: center;
    }

    h1 {
        margin-bottom: 2rem;
    }

    .filters {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-bottom: 2rem;
    }

    select,
    input {
        padding: 10px;
        font-size: 16px;
        margin: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
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
        border-radius: 4px;
        background: #f5f5f5;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;
    }

    .time-buttons button:hover {
        background: #007acc;
        color: white;
    }

    .time-buttons button.active {
        background: #007acc;
        color: white;
    }

    .description {
        margin-bottom: 1rem;
        font-style: italic;
    }
</style>

<main>
    <!-- Page Title -->
    <h1>Investment Analysis</h1>

    <!-- Filters Section -->
    <div class="filters">
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

        <!-- Weekly Investment Input -->
        <div>
            <label for="investment-amount">Weekly Investment ($):</label>
            <input
                id="investment-amount"
                type="number"
                bind:value={investmentAmount}
                min="1"
                step="1"
            />
        </div>
    </div>

    <!-- Chart Section -->
    {#if loading}
        <p>Loading data...</p>
    {:else if errorMessage}
        <p>{errorMessage}</p>
    {:else}
        <Chart {filteredData} {investmentAmount} />
    {/if}
</main>
