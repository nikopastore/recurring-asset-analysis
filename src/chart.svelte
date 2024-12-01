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

        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 700 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Group data by weekday
        const groupedData = d3.groups(filteredData, (d) => d.Day);

        const colors = d3.schemeTableau10;
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const colorScale = d3.scaleOrdinal().domain(days).range(colors);

        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const xAxis = d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%b %d"));
        svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Close * investmentAmount / 100)])
            .range([height, 0]);

        svg.append("g").call(d3.axisLeft(y));

        groupedData.forEach(([day, data], i) => {
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colorScale(day))
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d) => x(new Date(d.Date)))
                        .y((d) => y(d.WeeklyInvestment))
                );
        });

        // Add hover interactivity
        const hoverLine = svg
            .append("line")
            .attr("stroke", "gray")
            .attr("stroke-dasharray", "4")
            .attr("opacity", 0)
            .attr("y1", 0)
            .attr("y2", height);

        svg.on("mousemove", (event) => {
            const [mouseX] = d3.pointer(event);
            const hoverDate = x.invert(mouseX);
            hoverLine.attr("x1", mouseX).attr("x2", mouseX).attr("opacity", 1);

            // Add a tooltip to display values at the hovered date
            // Implement this logic based on your specific requirements
        });

        // Legend
        const legend = svg
            .append("g")
            .attr("transform", `translate(0,${height + 30})`);

        days.forEach((day, i) => {
            legend
                .append("circle")
                .attr("cx", i * 100 + 10)
                .attr("cy", 10)
                .attr("r", 5)
                .style("fill", colorScale(day));

            legend
                .append("text")
                .attr("x", i * 100 + 20)
                .attr("y", 15)
                .text(day)
                .style("font-size", "12px");
        });
    }
</script>

<div bind:this={chart}></div>
