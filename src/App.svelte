<script>
    let assets = ["Gold", "SPY", "Bitcoin"];
    let selectedAsset = "Gold";

    const timeFrames = [
        { label: "Past Month", months: 1 },
        { label: "Past 6 Months", months: 6 },
        { label: "Past 1 Year", months: 12 },
        { label: "Past 5 Years", months: 60 },
        { label: "Past 10 Years", months: 120 },
        { label: "Past 25 Years", months: 300 },
    ];

    let selectedTimeFrame = timeFrames[2]; // Default: Past 1 Year
    let theme = "light"; // Default theme

    const toggleTheme = () => {
        theme = theme === "light" ? "dark" : "light";
        document.body.className = theme; // Apply theme globally
    };

    const assetDescriptions = {
        Gold: "A precious metal often seen as a hedge against inflation.",
        SPY: "An ETF tracking the S&P 500 Index, a benchmark for US equities.",
        Bitcoin: "A decentralized digital currency powered by blockchain technology.",
    };
</script>

<style>
    /* Global Light/Dark Theme Styles */
    body.light {
        background-color: #ffffff;
        color: #000000;
    }

    body.dark {
        background-color: #1e1e1e;
        color: #ffffff;
    }

    .app-container {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: background 0.3s, color 0.3s;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
    }

    .filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .time-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .time-buttons button {
        padding: 5px 10px;
        font-size: 0.9em;
        border: 1px solid #ccc;
        background: #f5f5f5;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.2s, color 0.2s;
    }

    .time-buttons button:hover {
        background: #007acc;
        color: #fff;
    }

    .time-buttons button.active {
        background: #007acc;
        color: #fff;
        font-weight: bold;
    }

    .theme-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        background: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 1em;
    }

    .description {
        text-align: center;
        margin: 20px 0;
        font-style: italic;
    }

    .chart-placeholder {
        border: 2px dashed #ccc;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        background: #f9f9f9; /* Light mode background */
    }

    body.dark .chart-placeholder {
        background: #2a2a2a; /* Dark mode background */
        color: #bbb;
    }

    label {
        margin-bottom: 5px;
    }
</style>

<div class="app-container">
    <button class="theme-toggle" on:click={toggleTheme}>
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
    </button>

    <div class="header">
        <h1>Recurring Asset Analysis</h1>
        <p>Analyze the impact of recurring weekly investments.</p>
    </div>

    <div class="filters">
        <div class="filter-group">
            <label for="asset-select">Select Asset:</label>
            <select id="asset-select" bind:value={selectedAsset}>
                {#each assets as asset}
                    <option value={asset}>{asset}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="filter-group">
        <label for="time-frame-select">Time Frame:</label>
        <div class="time-buttons" id="time-frame-select">
            {#each timeFrames as timeFrame (timeFrame.label)}
                <button
                    on:click={() => (selectedTimeFrame = timeFrame)}
                    class:selected={selectedTimeFrame === timeFrame}
                >
                    {timeFrame.label}
                </button>
            {/each}
        </div>
    </div>

    <div class="description">
        {assetDescriptions[selectedAsset]}
    </div>

    <div class="chart-placeholder">
        <p>Line Chart Placeholder for {selectedTimeFrame.label}</p>
    </div>
</div>
