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

        const margin = { top: 20, right: 20, bottom: 60, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.values.reduce((sum, v) => sum + v.value, 0))])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(12));

        svg.append("g").call(d3.axisLeft(y));

        daysOfWeek.forEach((day, i) => {
            const line = d3
                .line()
                .x((d) => x(new Date(d.Date)))
                .y((d) => y(d.values[i].value));

            svg.append("path")
                .datum(filteredData)
                .attr("fill", "none")
                .attr("stroke", colors(day))
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

        // Add hover effect
        const hoverLine = svg.append("line").style("stroke", "gray").style("stroke-width", 1).style("opacity", 0);

        const hoverBox = d3.select(chart).append("div").attr("class", "hover-box").style("opacity", 0);

        svg.on("mousemove", function (event) {
            const [mouseX] = d3.pointer(event, this);
            const hoveredDate = x.invert(mouseX);

            hoverLine
                .attr("x1", mouseX)
                .attr("x2", mouseX)
                .attr("y1", 0)
                .attr("y2", height)
                .style("opacity", 1);

            hoverBox
                .style("opacity", 1)
                .style("left", `${event.pageX + 15}px`)
                .style("top", `${event.pageY - 50}px`)
                .html(
                    daysOfWeek
                        .map((day, i) => {
                            const value = filteredData.find((d) => new Date(d.Date).getTime() === hoveredDate.getTime())?.values[i]?.value || 0;
                            return `<div><strong>${day}:</strong> $${value.toFixed(2)}</div>`;
                        })
                        .join("")
                );
        });

        svg.on("mouseout", () => {
            hoverLine.style("opacity", 0);
            hoverBox.style("opacity", 0);
        });

        // Add legend
        const legend = svg.append("g").attr("transform", `translate(0,${height + 20})`);
        daysOfWeek.forEach((day, i) => {
            legend
                .append("circle")
                .attr("cx", i * 100)
                .attr("cy", 0)
                .attr("r", 5)
                .style("fill", colors(day));

            legend
                .append("text")
                .attr("x", i * 100 + 10)
                .attr("y", 5)
                .text(day)
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle");
        });
    }
</script>

<style>
    .hover-box {
        position: absolute;
        background: white;
        border: 1px solid gray;
        border-radius: 5px;
        padding: 10px;
        pointer-events: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }
</style>

<div bind:this={chart}></div>
