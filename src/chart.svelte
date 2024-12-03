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
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat("%B")));
        svg.append("g").call(d3.axisLeft(y));

        // Color scheme for days
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Debugging: Display only Monday's data
        const mondayData = filteredData.filter((d) => d.Day === "Monday");

        // Calculate cumulative investment
        const cumulativeData = [];
        let cumulativeInvestment = 0;
        mondayData.forEach((d) => {
            cumulativeInvestment += investmentAmount;
            cumulativeData.push({ Date: d.Date, Value: cumulativeInvestment });
        });

        console.log("Cumulative Data for Monday:", cumulativeData);

        // Add line for Monday
        svg
            .append("path")
            .datum(cumulativeData)
            .attr("fill", "none")
            .attr("stroke", color("Monday"))
            .attr("stroke-width", 2)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => x(new Date(d.Date)))
                    .y((d) => y(d.Value))
            );

        // Hover feature
        const focus = svg.append("g").style("display", "none");

        focus.append("line").attr("class", "hover-line").attr("y1", 0).attr("y2", height).style("stroke", "black").style("stroke-width", 1);

        const tooltip = d3.select(chart).append("div").attr("class", "tooltip").style("opacity", 0);

        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => {
                focus.style("display", null);
                tooltip.style("opacity", 1);
            })
            .on("mousemove", (event) => {
                const bisectDate = d3.bisector((d) => new Date(d.Date)).left;
                const x0 = x.invert(d3.pointer(event)[0]);
                const i = bisectDate(cumulativeData, x0, 1);
                const d0 = cumulativeData[i - 1];
                const d1 = cumulativeData[i];
                const d = x0 - new Date(d0.Date) > new Date(d1.Date) - x0 ? d1 : d0;

                focus.attr("transform", `translate(${x(new Date(d.Date))},0)`);
                tooltip
                    .html(`<strong>${d.Date}</strong><br>Value: $${d.Value.toFixed(2)}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`);
            })
            .on("mouseout", () => {
                focus.style("display", "none");
                tooltip.style("opacity", 0);
            });
    }
</script>

<div bind:this={chart}></div>

<style>
    .tooltip {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 4px;
        pointer-events: none;
        font-size: 12px;
    }
</style>
