<script>
    import * as d3 from "d3";

    export let filteredData = [];
    export let investmentAmount = 10;

    let chart;

    $: {
        console.log("Filtered Data in Chart:", filteredData);
        if (filteredData.length) {
            drawChart();
        }
    }

    function drawChart() {
        console.log("Drawing Chart...");

        // Remove previous chart content
        d3.select(chart).selectAll("*").remove();

        // Dimensions
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

        // Scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Close * investmentAmount)])
            .range([height, 0]);

        // Axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Add Line
        const line = d3
            .line()
            .x((d) => x(new Date(d.Date)))
            .y((d) => y(d.Close * investmentAmount));

        svg
            .append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }
</script>

<div bind:this={chart}></div>
