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

    const investmentAmount = 10;

    let filteredData = [];
    let loading = true;

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            const data = await response.json();

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

    .description {
        font-style: italic;
        margin: 1rem 0;
    }
</style>

<main>
    <h1>One Year Investment Analysis</h1>

    <div class="description">{assetDescriptions[selectedAsset]}</div>

    {#if loading}
        <p>Loading data...</p>
    {:else}
        <Chart {filteredData} {investmentAmount} />
    {/if}
</main>
