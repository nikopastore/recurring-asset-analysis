<script>
    import * as d3 from "d3";
    export let filteredData = [];

    let chart;

    $: if (filteredData.length) {
        console.log("Filtered Data for Chart:", filteredData);
        drawChart();
    }

    function drawChart() {
        d3.select(chart).selectAll("*").remove(); // Clear previous chart

        const margin = { top: 20, right: 20, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Investment)])
            .range([height, 0]);

        // Draw axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(12));
        svg.append("g").call(d3.axisLeft(y));

        // Define colors for days
        const dayColors = d3.scaleOrdinal(d3.schemeCategory10).domain(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);

        // Group data by day of the week
        const groupedData = d3.group(filteredData, (d) => d.Day);

        // Draw a line for each day
        for (const [day, data] of groupedData) {
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", dayColors(day))
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d) => x(new Date(d.Date)))
                        .y((d) => y(d.Investment))
                );
        }

        // Add legend
        const legend = svg
            .append("g")
            .attr("transform", `translate(0, ${height + 40})`); // Position below the chart

        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].forEach((day, i) => {
            legend
                .append("circle")
                .attr("cx", i * 100)
                .attr("cy", 0)
                .attr("r", 5)
                .style("fill", dayColors(day));

            legend
                .append("text")
                .attr("x", i * 100 + 10)
                .attr("y", 5)
                .text(day)
                .attr("alignment-baseline", "middle");
        });
    }
</script>

<div bind:this={chart}></div>
