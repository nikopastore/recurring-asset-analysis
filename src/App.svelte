<script>
    import Chart from "./Chart.svelte";
    import { onMount } from "svelte";

    // Assets and default selection
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    // Asset Descriptions
    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    // Locked Weekly Investment
    const investmentAmount = 10; // Fixed weekly investment

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

            // Filter data for the selected asset and 1 year
            const today = new Date();
            const cutoffDate = new Date(today);
            cutoffDate.setFullYear(today.getFullYear() - 1);

            filteredData = rawData
                .filter((d) => d.Asset === selectedAsset && new Date(d.Date) >= cutoffDate)
                .sort((a, b) => new Date(a.Date) - new Date(b.Date));

            console.log("Filtered Data:", filteredData);
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
        } finally {
            loading = false;
        }
    });

    function handleAssetChange(event) {
        selectedAsset = event.target.value;

        // Refetch data when asset changes
        onMount(async () => {
            try {
                const response = await fetch("./normalized_prices_with_days.json");
                const rawData = await response.json();

                const today = new Date();
                const cutoffDate = new Date(today);
                cutoffDate.setFullYear(today.getFullYear() - 1);

                filteredData = rawData
                    .filter((d) => d.Asset === selectedAsset && new Date(d.Date) >= cutoffDate)
                    .sort((a, b) => new Date(a.Date) - new Date(b.Date));
            } catch (error) {
                errorMessage = `Error loading data: ${error.message}`;
            }
        });
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
        margin-bottom: 1.5rem;
    }

    .filters {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        margin-bottom: 2rem;
    }

    select {
        padding: 10px;
        font-size: 16px;
        margin: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .description {
        font-style: italic;
        margin: 1rem 0;
    }
</style>

<main>
    <!-- Page Title -->
    <h1>One Year Investment Analysis</h1>

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

        <!-- Asset Description -->
        <div class="description">
            {assetDescriptions[selectedAsset]}
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
