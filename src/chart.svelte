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

        // Line path for Monday
        const mondayData = filteredData.filter((d) => d.Day === "Monday");

        let cumulativeInvestment = 0;
        const cumulativeData = mondayData.map((d) => {
            cumulativeInvestment += investmentAmount;
            return { Date: d.Date, Value: cumulativeInvestment };
        });

        svg
            .append("path")
            .datum(cumulativeData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr(
                "d",
                d3
                    .line()
                    .x((d) => x(new Date(d.Date)))
                    .y((d) => y(d.Value))
            );

        // Hover interaction
        const focus = svg.append("g").style("display", "none");

        focus.append("line").attr("class", "hover-line").attr("y1", 0).attr("y2", height).style("stroke", "black");

        svg
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => focus.style("display", null))
            .on("mousemove", (event) => {
                const bisectDate = d3.bisector((d) => new Date(d.Date)).left;
                const x0 = x.invert(d3.pointer(event)[0]);
                const i = bisectDate(cumulativeData, x0, 1);
                const d = cumulativeData[i - 1];

                focus.attr("transform", `translate(${x(new Date(d.Date))},0)`);
                console.log("Hover Data:", d);
            })
            .on("mouseout", () => focus.style("display", "none"));
    }
</script>

<div bind:this={chart}></div>
