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

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => new Date(d.Date)))
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(filteredData, (d) => d.Close * investmentAmount)])
            .range([height, 0]);

        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%B")));

        svg.append("g").call(d3.axisLeft(y));

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        days.forEach((day) => {
            const dayData = filteredData.filter((d) => d.Day === day);

            const cumulativeData = [];
            let cumulativeInvestment = 0;

            dayData.forEach((d) => {
                cumulativeInvestment += investmentAmount;
                cumulativeData.push({ Date: d.Date, Value: cumulativeInvestment });
            });

            svg
                .append("path")
                .datum(cumulativeData)
                .attr("fill", "none")
                .attr("stroke", color(day))
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x((d) => x(new Date(d.Date)))
                        .y((d) => y(d.Value))
                );
        });

        // Legend
        const legend = svg
            .append("g")
            .attr("transform", `translate(0, ${height + 30})`)
            .selectAll("g")
            .data(days)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${i * 150}, 0)`);

        legend
            .append("circle")
            .attr("r", 5)
            .attr("fill", (d) => color(d));

        legend
            .append("text")
            .text((d) => d)
            .attr("x", 10)
            .attr("y", 5);
    }
</script>

<div bind:this={chart}></div>
