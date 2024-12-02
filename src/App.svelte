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
    /* Styling remains unchanged */
</style>

<div class="container">
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

    <div class="investment-input">
        <label for="investment-amount">Weekly Investment ($):</label>
        <input
            id="investment-amount"
            type="number"
            bind:value={investmentAmount}
            min="1"
        />
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
