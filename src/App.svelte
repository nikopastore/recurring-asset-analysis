<script>
    import { onMount } from "svelte";
    import Chart from "./chart.svelte"; // Import the new chart component

    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";
    let investmentAmount = 100; // Default weekly investment amount

    const timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 },
    ];
    let selectedTimeFrame = timeFrames[2];

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
    /* Same styles as before */
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

    <div class="description">
        {assetDescriptions[selectedAsset]}
    </div>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}

    <Chart {filteredData} {investmentAmount} />
</div>
