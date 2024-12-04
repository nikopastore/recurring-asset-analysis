<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    let timeFrames = [
        { label: "1 Month", months: 1 },
        { label: "3 Months", months: 3 },
        { label: "6 Months", months: 6 },
        { label: "1 Year", months: 12 },
        { label: "5 Years", months: 60 },
    ];
    let selectedTimeFrame = timeFrames[3]; // Default to 1 Year

    const assetDescriptions = {
        Gold: "Gold is a precious metal often considered a hedge against inflation.",
        SPY: "SPY is an ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "Bitcoin is a decentralized digital currency created in 2009.",
    };

    let assetData = [];
    let averages = [];
    let investmentGrowth = [];
    let highestDay = null;
    let errorMessage = "";

    let barChart, lineChart;

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            assetData = await response.json();

            calculateAverages();
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

    function calculateAverages() {
        if (!assetData || assetData.length === 0) return;

        const today = new Date();
        const cutoffDate = new Date(today.setMonth(today.getMonth() - selectedTimeFrame.months));

        const filteredData = assetData.filter((record) => {
            const recordDate = new Date(record.Date);
            return record.Asset === selectedAsset && recordDate >= cutoffDate;
        });

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        averages = daysOfWeek.map((day) => {
            const dayData = filteredData.filter((record) => record.Day === day);
            const average =
                dayData.reduce((sum, record) => sum + record.Close, 0) / dayData.length || 0;

            return { day, average: parseFloat(average.toFixed(2)) };
        });

        highestDay = averages.reduce((max, current) => (current.average > max.average ? current : max), averages[0]);

        calculateInvestmentGrowth(filteredData, daysOfWeek);
        drawBarChart();
        drawLineChart();
    }

    function calculateInvestmentGrowth(filteredData, daysOfWeek) {
        const weeklyInvestment = 10;

        investmentGrowth = daysOfWeek.map((day) => {
            let totalUnits = 0;
            let totalValue = 10; // Start at $10
            const dailyGrowth = [];

            filteredData
                .filter((record) => record.Day === day)
                .forEach((record) => {
                    const unitsPurchased = weeklyInvestment / record.Close;
                    totalUnits += unitsPurchased;
                    totalValue = totalUnits * record.Close;

                    dailyGrowth.push({
                        date: new Date(record.Date),
                        value: totalValue,
                    });
                });

            return { day, growth: dailyGrowth };
        });
    }

    function handleAssetChange(event) {
        selectedAsset = event.target.value;
        calculateAverages();
    }

    function handleTimeFrameChange(timeFrame) {
        selectedTimeFrame = timeFrame;
        calculateAverages();
    }

    function drawBarChart() {
        // Existing bar chart drawing logic
    }

    function drawLineChart() {
        // Existing line chart drawing logic
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-height: 100vh;
        padding: 20px;
        gap: 20px;
    }

    .controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    select {
        padding: 10px;
        font-size: 16px;
        border-radius: 8px;
        border: 1px solid #ccc;
        outline: none;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    select:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }

    .time-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .time-button {
        padding: 10px 20px;
        font-size: 14px;
        border: none;
        border-radius: 8px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .time-button:hover {
        background-color: #0056b3;
        transform: scale(1.05);
    }

    .time-button.selected {
        background-color: #0056b3;
        font-weight: bold;
    }

    .charts {
        width: 100%;
        max-width: 900px;
    }

    .chart-title {
        font-size: 1.5rem;
        margin: 20px 0;
        font-weight: bold;
        color: #555;
    }

    .error {
        color: red;
        text-align: center;
    }
</style>

<div class="container">
    <!-- Asset Selection -->
    <div class="controls">
        <select bind:value={selectedAsset} on:change={handleAssetChange}>
            {#each assets as asset}
                <option value={asset}>{asset}</option>
            {/each}
        </select>

        <div class="time-buttons">
            {#each timeFrames as frame}
                <button
                    class="time-button {frame === selectedTimeFrame ? 'selected' : ''}"
                    on:click={() => handleTimeFrameChange(frame)}
                >
                    {frame.label}
                </button>
            {/each}
        </div>
    </div>

    <!-- Bar Chart -->
    <h2 class="chart-title">Average Closing Prices by Day of the Week</h2>
    <div class="charts" bind:this={barChart}></div>

    <!-- Line Chart -->
    <h2 class="chart-title">Investment Growth Over Time</h2>
    <div class="charts" bind:this={lineChart}></div>

    <!-- Error Message -->
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
</div>
