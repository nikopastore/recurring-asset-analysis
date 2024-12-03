<script>
    import Chart from "./Chart.svelte";
    import { onMount } from "svelte";

    let filteredData = [];
    let investmentAmount = 10; // Default weekly investment amount

    onMount(async () => {
        try {
            const response = await fetch("./normalized_prices_with_days.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            const rawData = await response.json();

            // Process data for one year
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            // Filter, sort, and calculate investment
            filteredData = rawData
                .filter((d) => new Date(d.Date) >= oneYearAgo)
                .sort((a, b) => new Date(a.Date) - new Date(b.Date)) // Ensure proper date ordering
                .map((d, i, arr) => {
                    const weeksSinceStart = Math.floor(i / 5); // Group every 5 entries as a week
                    const dayInvestment = investmentAmount * (weeksSinceStart + 1);
                    return { ...d, Investment: dayInvestment };
                });

            console.log("Filtered and Processed Data:", filteredData);
        } catch (error) {
            console.error("Error loading data:", error.message);
        }
    });
</script>

<main>
    <h1>One Year Investment Analysis</h1>
    <Chart {filteredData} />
</main>

<style>
    main {
        font-family: Arial, sans-serif;
        padding: 1rem;
        text-align: center;
    }

    h1 {
        margin-bottom: 2rem;
    }
</style>
