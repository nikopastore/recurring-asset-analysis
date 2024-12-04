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

    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    let assetData = [];
    let averages = [];
    let investmentGrowth = [];
    let highestDay = null;
    let filteredData = [];
    let errorMessage = "";

    let barChart, lineChart;

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();

            filterData();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

    function filterData() {
        if (!assetData || assetData.length === 0) return;

        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));

        filteredData = assetData.filter((record) => {
            const recordDate = new Date(record.Date);
            return record.Asset === selectedAsset && recordDate >= cutoffDate;
        });

        calculateAverages();
    }

    function calculateAverages() {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        averages = daysOfWeek.map((day) => {
            const dayData = filteredData.filter((record) => record.Day === day);
            const average =
                dayData.reduce((sum, record) => sum + record.Close, 0) / dayData.length || 0;

            return { day, average: parseFloat(average.toFixed(2)) };
        });

        highestDay = averages.reduce((max, current) => (current.average > max.average ? current : max), averages[0]);
        drawBarChart();
        drawLineChart();
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        filterData();
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        filterData();
    }

    function drawBarChart() {
        d3.select(barChart).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

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

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(averages, (d) => d.average)])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(averages)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.day))
            .attr("y", (d) => y(d.average))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.average))
            .attr("fill", (d) => (d.day === highestDay.day ? "green" : "steelblue"));
    }

    function drawLineChart() {
        d3.select(lineChart).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
        const width = 700 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
            .select(lineChart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleTime()
            .domain([d3.min(filteredData, (d) => new Date(d.Date)), d3.max(filteredData, (d) => new Date(d.Date))])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Close)])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", d3.line().x((d) => x(new Date(d.Date))).y((d) => y(d.Close)));

        const focus = svg.append("g").style("display", "none");

        focus.append("line")
            .attr("class", "hover-line")
            .attr("y1", 0)
            .attr("y2", height)
            .style("stroke", "black");

        focus.append("circle")
            .attr("r", 5)
            .style("fill", "steelblue");

        const tooltip = d3.select("body").append("div")
            .attr("class", "hover-tooltip")
            .style("opacity", 0);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => focus.style("display", null))
            .on("mousemove", function (event) {
                const x0 = x.invert(d3.pointer(event)[0]);
                const i = d3.bisector((d) => new Date(d.Date)).left(filteredData, x0, 1);
                const d = filteredData[i - 1];

                focus.attr("transform", `translate(${x(new Date(d.Date))},${y(d.Close)})`);
                tooltip.style("opacity", 1)
                    .html(`Date: ${d.Date}<br>Value: $${d.Close}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 28}px`);
            })
            .on("mouseout", () => {
                focus.style("display", "none");
                tooltip.style("opacity", 0);
            });
    }
</script>

<style>
/* Add your styling here */
</style>

<div>
    <h1>Asset Analysis</h1>

    <!-- Asset Dropdown -->
    <select on:change={handleAssetChange}>
        {#each assets as asset}
            <option value={asset}>{asset}</option>
        {/each}
    </select>

    <!-- Time Frame Buttons -->
    <div>
        {#each timeFrames as timeFrame (timeFrame.label)}
            <button on:click={() => handleTimeFrameChange(timeFrame)}>
                {timeFrame.label}
            </button>
        {/each}
    </div>

    <div>
        <h2>Bar Chart</h2>
        <div bind:this={barChart}></div>
        <h2>Line Chart</h2>
        <div bind:this={lineChart}></div>
    </div>
</div>
