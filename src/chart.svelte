<script>
    import * as d3 from "d3";

    export let filteredData = [];
    export let investmentAmount = 10;

    let chart;

    $: if (filteredData.length) {
        drawChart();
    }

    function drawChart() {
        d3.select(chart).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 50, left: 50 };
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
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Close * investmentAmount)])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Line Chart
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(daysOfWeek);

        daysOfWeek.forEach((day) => {
            const dayData = filteredData.filter((d) => d.Day === day);

            const line = d3
                .line()
                .x((d) => x(new Date(d.Date)))
                .y((d) => y(d.Close * investmentAmount));

            svg
                .append("path")
                .datum(dayData)
                .attr("fill", "none")
                .attr("stroke", colorScale(day))
                .attr("stroke-width", 2)
                .attr("d", line);
        });

        // Tooltip
        const tooltip = d3.select(chart)
            .append("div")
            .attr("class", "hover-tooltip")
            .style("display", "none");

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mousemove", (event) => {
                const [mouseX] = d3.pointer(event);
                const hoveredDate = x.invert(mouseX);

                const hoveredData = filteredData.filter((d) => {
                    const dateDiff = Math.abs(new Date(d.Date) - hoveredDate);
                    return dateDiff < 86400000; // Filter within 1 day
                });

                tooltip
                    .style("display", "block")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`)
                    .html(hoveredData.map((d) => `<p>${d.Day}: $${d.Close.toFixed(2)}</p>`).join(""));
            })
            .on("mouseout", () => tooltip.style("display", "none"));
    }
</script>

<style>
    .hover-tooltip {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
        pointer-events: none;
        font-size: 0.9rem;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    div {
        position: relative;
        width: 100%;
        height: 500px;
        margin: auto;
    }
</style>

<div bind:this={chart}></div>
