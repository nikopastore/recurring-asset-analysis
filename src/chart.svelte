<script>
    import * as d3 from "d3";

    export let filteredData = {};

    let chart;

    $: {
        if (Object.keys(filteredData).length) {
            drawChart();
        }
    }

    function drawChart() {
        d3.select(chart).selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
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
            .domain([
                d3.min(Object.values(filteredData).flatMap(d => d.values.map(v => new Date(v.date)))),
                d3.max(Object.values(filteredData).flatMap(d => d.values.map(v => new Date(v.date))))
            ])
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(Object.values(filteredData).flatMap(d => d.cumulativeInvestment))
            ])
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(12));

        svg.append("g").call(d3.axisLeft(y));

        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        Object.entries(filteredData).forEach(([day, { cumulativeInvestment, values }], i) => {
            const line = d3
                .line()
                .x((_, idx) => x(new Date(values[idx].date)))
                .y((d) => y(d));

            svg.append("path")
                .datum(cumulativeInvestment)
                .attr("fill", "none")
                .attr("stroke", colors(day))
                .attr("stroke-width", 2)
                .attr("d", line);

            // Legend
            svg.append("circle")
                .attr("cx", width + 10)
                .attr("cy", i * 20)
                .attr("r", 5)
                .style("fill", colors(day));

            svg.append("text")
                .attr("x", width + 20)
                .attr("y", i * 20 + 5)
                .text(day)
                .style("font-size", "12px")
                .style("fill", colors(day));
        });
    }
</script>

<div bind:this={chart}></div>
