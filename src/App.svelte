<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    // Assets and default selection
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";
    let investmentAmount = 100; // Default weekly investment amount

    // Time frames
    const timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 },
    ];
    let selectedTimeFrame = timeFrames[2]; // Default: Past 1 Year

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

    // Fetch and process data
    onMount(async () => {
        try {
            const response = await fetch("/normalized_prices.json");
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

    // Filter data dynamically
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
        drawChart(); // Re-render chart when data changes
    }

    // Draw the D3.js chart
    let chartContainer;
    function drawChart() {
        if (!filteredData || filteredData.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Remove any existing chart
        d3.select(chartContainer).select("svg").remove();

        // Create SVG
        const svg = d3
            .select(chartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Parse data for lines
        const groupedData = d3.group(filteredData, (d) => new Date(d.Date).getDay()); // Group by weekday

        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Close * investmentAmount)])
            .nice()
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Add axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Add lines
        groupedData.forEach((values, day) => {
            svg.append("path")
                .datum(values)
                .attr("fill", "none")
                .attr("stroke", color(day))
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d) => x(new Date(d.Date)))
                        .y((d) => y(d.Close * investmentAmount))
                );
        });

        // Add labels
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Time");

        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 10)
            .attr("text-anchor", "middle")
            .text("Investment Value ($)");
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background: #f9f9f9;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
    }

    .chart-container {
        margin-top: 20px;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .controls label,
    .controls input {
        margin-right: 10px;
    }

    button {
        margin: 5px;
    }
</style>

<div class="container">
    <h1>Recurring Investment Analysis</h1>
    <p>{assetDescriptions[selectedAsset]}</p>

    <!-- Controls -->
    <div class="controls">
        <div>
            <label for="asset-select">Select Asset:</label>
            <select id="asset-select" bind:value={selectedAsset}>
                {#each assets as asset}
                    <option value={asset}>{asset}</option>
                {/each}
            </select>
        </div>
        <div>
            <label>Weekly Investment ($):</label>
            <input type="number" bind:value={investmentAmount} min="1" />
        </div>
    </div>

    <!-- Time Frame Buttons -->
    <div>
        {#each timeFrames as timeFrame}
            <button
                class:selected={selectedTimeFrame === timeFrame}
                on:click={() => (selectedTimeFrame = timeFrame)}
            >
                {timeFrame.label}
            </button>
        {/each}
    </div>

    <!-- Chart -->
    <div class="chart-container" bind:this={chartContainer}></div>

    {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
    {/if}
</div>
