<script>
    import { onMount } from "svelte";

    // Available assets
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

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

            // Calculate averages for the default asset
            calculateAverages();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

    // Calculate averages for the selected asset
    function calculateAverages() {
        if (!assetData || assetData.length === 0) return;

        const data2023 = assetData.filter((record) => {
            const year = new Date(record.Date).getFullYear();
            return year === 2023 && record.Asset === selectedAsset;
        });

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        averages = daysOfWeek.map((day) => {
            const dayData = data2023.filter((record) => record.Day === day);
            const average =
                dayData.reduce((sum, record) => sum + record.Close, 0) / dayData.length || 0;

            return { day, average: average.toFixed(2) };
        });
    }

    // Handle asset change
    function handleAssetChange(event) {
        selectedAsset = event.target.value;
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

    select {
        padding: 8px;
        font-size: 16px;
        margin-bottom: 20px;
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
    <h1>Average Price Per Day of the Week (2023)</h1>

    <!-- Asset Selector -->
    <div>
        <label for="asset-select">Select Asset:</label>
        <select id="asset-select" bind:value={selectedAsset} on:change={handleAssetChange}>
            {#each assets as asset}
                <option value={asset}>{asset}</option>
            {/each}
        </select>
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
