<script>
    import Chart from "./Chart.svelte";
    import { onMount } from "svelte";

    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    let filteredData = [];
    const investmentAmount = 10;

    let loading = true;

    // Load data
    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            const data = await response.json();

            console.log("Raw Data:", data);

            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            filteredData = data
                .filter((d) => d.Asset === selectedAsset && new Date(d.Date) >= oneYearAgo)
                .sort((a, b) => new Date(a.Date) - new Date(b.Date));

            console.log("Filtered Data in App:", filteredData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            loading = false;
        }
    });

    // Watch for asset selection changes
    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        console.log("Selected Asset:", selectedAsset);
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
        text-align: center;
        padding: 1rem;
    }

    h1 {
        margin-bottom: 1rem;
    }

    .description {
        margin-bottom: 1.5rem;
        font-style: italic;
    }

    select {
        padding: 0.5rem;
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }
</style>

<main>
    <h1>One Year Investment Analysis</h1>

    <select on:change={handleAssetChange}>
        {#each assets as asset}
            <option value={asset}>{asset}</option>
        {/each}
    </select>

    <div class="description">{assetDescriptions[selectedAsset]}</div>

    {#if loading}
        <p>Loading data...</p>
    {:else}
        <Chart {filteredData} {investmentAmount} />
    {/if}
</main>
