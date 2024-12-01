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
        d3.select(chart).selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const parseDate = d3.timeParse("%Y-%m-%d");

        // Preprocess data: group by weekday and calculate cumulative investment
        const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const weeklyData = weekdays.map(day => {
            let cumulativeValue = 0;
            return {
                day,
                values: filteredData
                    .filter(d => d.Day === day)
                    .map(d => {
                        cumulativeValue += d.Close * investmentAmount;
                        return { Date: parseDate(d.Date), Value: cumulativeValue };
                    })
            };
        });

        // X-axis scale
        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, d => parseDate(d.Date)))
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
            .domain([0, d3.max(weeklyData.flatMap(d => d.values), d => d.Value)])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("fill", "black")
            .text("Investment Value ($)");

        // Color scale for weekdays
        const colorScale = d3
            .scaleOrdinal()
            .domain(weekdays)
            .range(d3.schemeCategory10);

        // Add lines for each weekday
        weeklyData.forEach(dayData => {
            svg.append("path")
                .datum(dayData.values)
                .attr("fill", "none")
                .attr("stroke", colorScale(dayData.day))
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x(d => x(d.Date))
                        .y(d => y(d.Value))
                );
        });

        // Add legend
        const legend = svg
            .selectAll(".legend")
            .data(weekdays)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${width + 10},${i * 20})`);

        legend
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => colorScale(d));

        legend
            .append("text")
            .attr("x", 15)
            .attr("y", 10)
            .text(d => d)
            .attr("font-size", "12px")
            .attr("fill", "#333");
    }
</script>

<style>
    div {
        margin: 0 auto;
        max-width: 900px;
    }
</style>

<div bind:this={chart}></div>
