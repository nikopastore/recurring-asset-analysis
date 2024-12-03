<script>
    import * as d3 from "d3";

    let chart;

    // Minimal test data
    const staticData = [
        { Day: "Monday", Date: "2023-01-01", Investment: 10 },
        { Day: "Tuesday", Date: "2023-01-02", Investment: 20 },
        { Day: "Wednesday", Date: "2023-01-03", Investment: 30 },
        { Day: "Thursday", Date: "2023-01-04", Investment: 40 },
        { Day: "Friday", Date: "2023-01-05", Investment: 50 },
    ];

    $: {
        console.log("Loaded Data for Chart:", staticData);
        drawChart();
    }

    function drawChart() {
        if (!chart) return;

        d3.select(chart).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 50, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3
            .scalePoint()
            .domain(staticData.map((d) => d.Day))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(staticData, (d) => d.Investment)])
            .range([height, 0]);

        // Axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        // Draw line
        svg.append("path")
            .datum(staticData)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr(
                "d",
                d3.line()
                    .x((d) => x(d.Day))
                    .y((d) => y(d.Investment))
            );
    }
</script>

<div bind:this={chart}></div>
