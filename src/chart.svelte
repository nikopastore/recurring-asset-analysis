<script>
    import * as d3 from "d3";

    export let lineChartData = [];
    let lineChartContainer;

    $: if (lineChartData.length) {
        drawLineChart();
    }

    function drawLineChart() {
        // Clear the existing chart
        d3.select(lineChartContainer).selectAll("*").remove();

        const margin = { top: 20, right: 40, bottom: 30, left: 50 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
            .select(lineChartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(lineChartData, (d) => new Date(d.Date)))
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(lineChartData, (d) => d.Value) * 1.1])
            .range([height, 0]);

        // X and Y axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(12));
        g.append("g").call(d3.axisLeft(yScale));

        // Line generator
        const line = d3
            .line()
            .x((d) => xScale(new Date(d.Date)))
            .y((d) => yScale(d.Value));

        // Draw lines
        const days = d3.group(lineChartData, (d) => d.Day);
        const colorScale = d3
            .scaleOrdinal()
            .domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
            .range(d3.schemeCategory10);

        for (const [day, data] of days) {
            g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colorScale(day))
                .attr("stroke-width", 2)
                .attr("d", line);
        }

        // Hover Feature
        const hoverLine = g
            .append("line")
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "3,3")
            .attr("y1", 0)
            .attr("y2", height)
            .style("opacity", 0);

        const tooltip = d3
            .select(lineChartContainer)
            .append("div")
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        svg.on("mousemove", (event) => {
            const [mouseX] = d3.pointer(event);
            const xDate = xScale.invert(mouseX - margin.left);

            hoverLine
                .attr("x1", xScale(xDate))
                .attr("x2", xScale(xDate))
                .style("opacity", 1);

            const hoverData = [];
            days.forEach((data, day) => {
                const closest = d3.least(data, (d) =>
                    Math.abs(new Date(d.Date) - xDate)
                );
                if (closest) {
                    hoverData.push({ day, value: closest.Value });
                }
            });

            tooltip
                .html(
                    hoverData
                        .map((d) => `<strong>${d.day}:</strong> $${d.value.toFixed(2)}`)
                        .join("<br>")
                )
                .style("left", `${event.pageX + 15}px`)
                .style("top", `${event.pageY - 28}px`)
                .style("opacity", 1);
        });

        svg.on("mouseout", () => {
            hoverLine.style("opacity", 0);
            tooltip.style("opacity", 0);
        });
    }
</script>

<div bind:this={lineChartContainer}></div>
