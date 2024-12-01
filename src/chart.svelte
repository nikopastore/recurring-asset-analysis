<script>
    import * as d3 from "d3";

    export let filteredData = [];
    export let investmentAmount;

    let chart;

    $: if (filteredData.length) {
        drawChart();
    }

    function drawChart() {
        d3.select(chart).selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const width = 700 - margin.left - margin.right;
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
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        svg
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => +d.Close)])
            .range([height, 0]);

        svg.append("g").call(d3.axisLeft(y));

        // Line
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
                    .x((d) => x(new Date(d.Date)))
                    .y((d) => y(d.Close))
            );

        // Points
        svg
            .selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(new Date(d.Date)))
            .attr("cy", (d) => y(d.Close))
            .attr("r", 3)
            .attr("fill", "red");
    }
</script>

<div bind:this={chart}></div>

<style>
    div {
        margin: 0 auto;
        max-width: 700px;
    }
</style>
