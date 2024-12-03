<script>
    import { onMount } from "svelte";

    // Available assets and time frames
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

    // Data and state
    let assetData = [];
    let averages = [];
    let errorMessage = "";

    // Fetch data on mount
    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();

            // Calculate averages for the default asset and time frame
            calculateAverages();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

    // Calculate averages for the selected asset and time frame
    function calculateAverages() {
        if (!assetData || assetData.length === 0) return;

        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));

        const filteredData = assetData.filter((record) => {
            const recordDate = new Date(record.Date);
            return record.Asset === selectedAsset && recordDate >= cutoffDate;
        });

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        averages = daysOfWeek.map((day) => {
            const dayData = filteredData.filter((record) => record.Day === day);
            const average =
                dayData.reduce((sum, record) => sum + record.Close, 0) / dayData.length || 0;

            return { day, average: average.toFixed(2) };
        });
    }

    // Handle asset and time frame changes
    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        calculateAverages();
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        calculateAverages();
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background: #f9f9f9;
        color: #333;
    }

    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }

    .buttons-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-top: 10px;
    }

    button {
        padding: 10px 15px;
        font-size: 14px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;
    }

    button:hover {
        background: #007acc;
        color: white;
    }

    button.active {
        background: #007acc;
        color: white;
        font-weight: bold;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        padding: 10px;
        background: #fff;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .error {
        color: red;
    }
</style>

<div class="container">
    <h1>Average Price Per Day of the Week</h1>

    <!-- Asset Selector -->
    <div>
        <label for="asset-select">Select Asset:</label>
        <select id="asset-select" bind:value={selectedAsset} on:change={handleAssetChange}>
            {#each assets as asset}
                <option value={asset}>{asset}</option>
            {/each}
        </select>
    </div>

    <!-- Time Frame Buttons -->
    <div class="buttons-container">
        {#each timeFrames as timeFrame}
            <button
                class:active={selectedTimeFrame === timeFrame}
                on:click={() => handleTimeFrameChange(timeFrame)}
            >
                {timeFrame.label}
            </button>
        {/each}
    </div>

    <!-- Error Message -->
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if averages.length === 0}
        <p>Loading data...</p>
    {:else}
        <!-- Averages List -->
        <ul>
            {#each averages as { day, average }}
                <li>
                    <strong>{day}:</strong> ${average}
                </li>
            {/each}
        </ul>
    {/if}
</div>
