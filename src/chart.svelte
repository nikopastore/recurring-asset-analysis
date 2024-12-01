<script>
    import * as d3 from "d3";

    export let filteredData = [];
    export let investmentAmount = 100;

    let chart;

    $: {
        if (filteredData.length) {
            console.log("Chart Data:", filteredData); // Log to verify the data passed to the chart
            drawChart();
        }
    }

    function drawChart() {
        // Clear the previous chart
        d3.select(chart).selectAll("*").remove();

        // Chart dimensions
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Parse and prepare data
        const parseDate = d3.timeParse("%Y-%m-%d");
        const processedData = filteredData.map(d => ({
            ...d,
            Date: parseDate(d.Date),
            Value: d.Close * investmentAmount,
        }));

        // Set up scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(processedData, d => d.Date))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(processedData, d => d.Value)])
            .range([height, 0]);

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("fill", "black")
            .text("Date");

        // Add Y-axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("fill", "black")
            .text("Investment Value ($)");

        // Add the line
        svg.append("path")
            .datum(processedData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr(
                "d",
                d3
                    .line()
                    .x(d => x(d.Date))
                    .y(d => y(d.Value))
            );

        // Add dots for each data point
        svg.selectAll("circle")
            .data(processedData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Value))
            .attr("r", 4)
            .attr("fill", "steelblue")
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .on("mouseover", (event, d) => {
                const tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("background", "#fff")
                    .style("border", "1px solid #ccc")
                    .style("padding", "5px")
                    .style("pointer-events", "none")
                    .html(`Date: ${d.Date.toDateString()}<br>Value: $${d.Value.toFixed(2)}`);
                
                tooltip.style("left", `${event.pageX + 10}px`)
                       .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => d3.select("body").select("div").remove());
    }
</script>

<style>
    div {
        margin: 20px auto;
        max-width: 900px;
    }
</style>

<div bind:this={chart}></div>
