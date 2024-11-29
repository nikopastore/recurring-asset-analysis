<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    export let data = []; // Filtered data passed from App.svelte
    export let investmentAmount = 100; // Weekly investment amount

    let chartContainer;

    $: drawChart();

    function drawChart() {
        if (!data || data.length === 0) {
            console.log("No data to display");
            return;
        }

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Clear existing chart
        d3.select(chartContainer).select("svg").remove();

        // Create SVG container
        const svg = d3
            .select(chartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Parse the dates
        const parseDate = d3.timeParse("%Y-%m-%d");
        const formattedData = data.map(d => ({
            ...d,
            Date: parseDate(d.Date),
            InvestmentValue: d.Close * investmentAmount
        }));

        // Create scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(formattedData, d => d.Date))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(formattedData, d => d.InvestmentValue)])
            .nice()
            .range([height, 0]);

        // Add axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

        svg.append("g").call(d3.axisLeft(y));

        // Add line
        svg.append("path")
            .datum(formattedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr(
                "d",
                d3
                    .line()
                    .x(d => x(d.Date))
                    .y(d => y(d.InvestmentValue))
            );

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
    div {
        margin: 20px auto;
        max-width: 900px;
    }
</style>

<div bind:this={chartContainer}></div>
