<script>
    import * as d3 from "d3";

    export let filteredData = [];
    export let investmentAmount = 100;

    let chart;

    $: {
        if (filteredData.length) {
            drawChart();
        }
    }

    function drawChart() {
        d3.select(chart).selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, d => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(filteredData, d => d.Close * investmentAmount)
            ])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg
            .append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr(
                "d",
                d3
                    .line()
                    .x(d => x(new Date(d.Date)))
                    .y(d => y(d.Close * investmentAmount))
            );

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

<div bind:this={chart}></div>
