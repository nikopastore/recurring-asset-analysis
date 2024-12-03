<script>
    import * as d3 from "d3";

    let chart;

    // Static data for demonstration
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weeklyInvestment = 10;
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // Generate static data for 1 year
    const staticData = generateStaticData();

    function generateStaticData() {
        const data = [];
        const startDate = new Date("2023-01-01");
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        daysOfWeek.forEach((day, dayIndex) => {
            let totalInvestment = 0;
            for (let i = 0; i < 52; i++) {
                const date = new Date(startDate.getTime() + i * oneWeek + dayIndex * (24 * 60 * 60 * 1000));
                totalInvestment += weeklyInvestment;
                data.push({
                    Day: day,
                    Date: d3.timeFormat("%Y-%m-%d")(date),
                    Investment: totalInvestment,
                });
            }
        });

        return data;
    }

    // Draw chart
    $: drawChart();

    function drawChart() {
        if (!chart) return;

        d3.select(chart).selectAll("*").remove(); // Clear existing chart

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

        // Scales
        const x = d3
            .scaleTime()
            .domain(d3.extent(staticData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(staticData, (d) => d.Investment)])
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(daysOfWeek);

        // Add axes
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(12));
        svg.append("g").call(d3.axisLeft(y));

        // Group data by day of the week
        const groupedData = d3.group(staticData, (d) => d.Day);

        // Line generator
        const lineGenerator = d3
            .line()
            .x((d) => x(new Date(d.Date)))
            .y((d) => y(d.Investment));

        // Draw lines
        groupedData.forEach((data, day) => {
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", colorScale(day))
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);
        });

        // Add legend
        const legend = svg.append("g").attr("transform", `translate(0,${height + 40})`);
        daysOfWeek.forEach((day, i) => {
            legend
                .append("circle")
                .attr("cx", i * 150)
                .attr("cy", 0)
                .attr("r", 5)
                .style("fill", colorScale(day));

            legend
                .append("text")
                .attr("x", i * 150 + 10)
                .attr("y", 5)
                .text(day)
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle");
        });

        // Hover effect
        const hoverLine = svg.append("line").attr("stroke", "gray").attr("stroke-width", 1).style("opacity", 0);
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

            const hoverData = daysOfWeek.map((day) => {
                const dataForDay = groupedData.get(day)?.find((d) => d.Date === d3.timeFormat("%Y-%m-%d")(hoveredDate));
                return { day, value: dataForDay ? dataForDay.Investment : 0 };
            });

            hoverBox
                .style("opacity", 1)
                .style("left", `${event.pageX + 15}px`)
                .style("top", `${event.pageY - 50}px`)
                .html(
                    hoverData
                        .map((d) => `<div><strong>${d.day}:</strong> $${d.value.toFixed(2)}</div>`)
                        .join("")
                );
        });

        svg.on("mouseout", () => {
            hoverLine.style("opacity", 0);
            hoverBox.style("opacity", 0);
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
