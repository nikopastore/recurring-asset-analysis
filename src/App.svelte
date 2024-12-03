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
    let investmentGrowth = [];
    let highestDay = null;
    let errorMessage = "";

    let barChart, lineChart;

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

        highestDay = averages.reduce((max, current) => (current.average > max.average ? current : max), averages[0]);

        calculateInvestmentGrowth(filteredData, daysOfWeek);
        drawBarChart();
        drawLineChart();
    }

    function calculateInvestmentGrowth(filteredData, daysOfWeek) {
        const weeklyInvestment = 10;

        investmentGrowth = daysOfWeek.map((day) => {
            let totalUnits = 0;
            let totalValue = 0;
            const dailyGrowth = [];

            filteredData
                .filter((record) => record.Day === day)
                .forEach((record) => {
                    const unitsPurchased = weeklyInvestment / record.Close;
                    totalUnits += unitsPurchased;
                    totalValue = totalUnits * record.Close;

                    dailyGrowth.push({
                        date: new Date(record.Date),
                        value: totalValue,
                    });
                });

            return { day, growth: dailyGrowth };
        });
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        calculateAverages();
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        calculateAverages();
    }

    function drawBarChart() {
        d3.select(barChart).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(barChart)
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

        const minY = d3.min(averages, (d) => d.average) * 0.98;
        const maxY = d3.max(averages, (d) => d.average) * 1.02;

        const y = d3.scaleLinear().domain([minY, maxY]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y).ticks(3));

        svg.selectAll(".bar")
            .data(averages)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.day))
            .attr("y", (d) => y(d.average))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.average))
            .attr("fill", (d) => (d.day === highestDay.day ? "green" : "steelblue"));

        svg.selectAll(".label")
            .data(averages)
            .enter()
            .append("text")
            .attr("x", (d) => x(d.day) + x.bandwidth() / 2)
            .attr("y", (d) => y(d.average) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text((d) => `$${d.average.toFixed(2)}`);
    }

    function drawLineChart() {
        d3.select(lineChart).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(lineChart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleTime()
            .domain([
                d3.min(investmentGrowth, (d) => d3.min(d.growth, (p) => p.date)),
                d3.max(investmentGrowth, (d) => d3.max(d.growth, (p) => p.date)),
            ])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(investmentGrowth, (d) => d3.max(d.growth, (p) => p.value))])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        investmentGrowth.forEach((lineData, index) => {
            svg.append("path")
                .datum(lineData.growth)
                .attr("fill", "none")
                .attr("stroke", colors(index))
                .attr("stroke-width", 1.5)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d) => x(d.date))
                        .y((d) => y(d.value))
                );
        });

        const legend = svg
            .append("g")
            .attr("transform", `translate(${width - 100},${margin.top})`);

        investmentGrowth.forEach((lineData, index) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", index * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", colors(index));

            legend.append("text")
                .attr("x", 15)
                .attr("y", index * 20 + 10)
                .text(lineData.day)
                .style("font-size", "12px");
        });
    }
</script>

<style>
    .charts-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .chart {
        flex: 1 1 48%;
        margin: 10px;
    }

    .title {
        text-align: center;
    }
</style>

<div>
    <h1 class="title">Investment Analysis</h1>

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

    <!-- Charts -->
    <div class="charts-container">
        <div class="chart" bind:this={barChart}></div>
        <div class="chart" bind:this={lineChart}></div>
    </div>
</div>
