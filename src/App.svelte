<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

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

    let assetData = [];
    let averages = [];
    let errorMessage = "";

    let chart; // Reference to the chart container

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();

            calculateAverages();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

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

            return { day, average: parseFloat(average.toFixed(2)) };
        });

        drawChart();
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        calculateAverages();
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        calculateAverages();
    }

    function drawChart() {
        d3.select(chart).selectAll("*").remove(); // Clear previous chart

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleBand()
            .domain(averages.map((d) => d.day))
            .range([0, width])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(averages, (d) => d.average)])
            .range([height, 0]);

        // X Axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // Y Axis
        svg.append("g").call(d3.axisLeft(y));

        // Bars
        svg.selectAll(".bar")
            .data(averages)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.day))
            .attr("y", (d) => y(d.average))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.average))
            .attr("fill", "steelblue");

        // Add labels to bars
        svg.selectAll(".label")
            .data(averages)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.day) + x.bandwidth() / 2)
            .attr("y", (d) => y(d.average) - 5)
            .attr("text-anchor", "middle")
            .text((d) => `$${d.average.toFixed(2)}`);
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

    select, button {
        padding: 10px;
        margin: 10px;
        font-size: 14px;
    }

    .chart-container {
        margin-top: 20px;
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
    <div>
        {#each timeFrames as timeFrame}
            <button
                class:active={selectedTimeFrame === timeFrame}
                on:click={() => handleTimeFrameChange(timeFrame)}
            >
                {timeFrame.label}
            </button>
        {/each}
    </div>

    <!-- Error or Averages List -->
    {#if errorMessage}
        <p>{errorMessage}</p>
    {:else}
        <ul>
            {#each averages as { day, average }}
                <li><strong>{day}:</strong> ${average}</li>
            {/each}
        </ul>
    {/if}

    <!-- Chart -->
    <div class="chart-container" bind:this={chart}></div>
</div>
