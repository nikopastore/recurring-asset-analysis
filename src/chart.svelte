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
        // Clear any existing chart
        d3.select(chart).selectAll("*").remove();

        // Chart dimensions and margins
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

        // Parse the dates and calculate values
        const parseDate = d3.timeParse("%Y-%m-%d");
        const processedData = filteredData.map(d => ({
            ...d,
            Date: parseDate(d.Date), // Convert string to Date object
            Value: d.Close * investmentAmount // Calculate investment value
        }));

        // X-axis scale
        const x = d3
            .scaleTime()
            .domain(d3.extent(processedData, d => d.Date))
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("fill", "black")
            .text("Date");

        // Y-axis scale
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(processedData, d => d.Value)])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("fill", "black")
            .text("Investment Value ($)");

        // Add line to the chart
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

        // Add hover effect with tooltip
        const tooltip = d3
            .select(chart)
            .append("div")
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("display", "none")
            .style("pointer-events", "none");

        svg.selectAll("circle")
            .data(processedData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Value))
            .attr("r", 3)
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip.style("display", "block")
                    .html(`Date: ${d.Date.toDateString()}<br>Value: $${d.Value.toFixed(2)}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
            });
    }
</script>

<style>
    div {
        margin: 0 auto;
        max-width: 900px;
    }
</style>

<div bind:this={chart}></div>
