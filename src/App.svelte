<script>
    import { onMount } from "svelte";

    // Data and state
    let assetData = [];
    let averages = [];
    let errorMessage = "";

    // Fetch data on mount
    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();

            // Calculate averages
            averages = calculateAverages(data);
        } catch (error) {
            errorMessage = `Error loading data: ${error.message}`;
            console.error(errorMessage);
        }
    });

    function calculateAverages(data) {
        const data2023 = data.filter((record) => {
            const year = new Date(record.Date).getFullYear();
            return year === 2023;
        });

        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        return daysOfWeek.map((day) => {
            const dayData = data2023.filter((record) => record.Day === day);
            const average =
                dayData.reduce((sum, record) => sum + record.Close, 0) / dayData.length || 0;

            return { day, average: average.toFixed(2) };
        });
    }
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        background: #f9f9f9;
        color: #333;
    }

    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        padding: 10px;
        background: #fff;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .error {
        color: red;
    }
</style>

<div class="container">
    <h1>Average Price Per Day of the Week (2023)</h1>

    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {:else if averages.length === 0}
        <p>Loading data...</p>
    {:else}
        <ul>
            {#each averages as { day, average }}
                <li>
                    <strong>{day}:</strong> ${average}
                </li>
            {/each}
        </ul>
    {/if}
</div>
