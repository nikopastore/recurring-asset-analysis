import pandas as pd

# Load CSV
input_csv = "historical_prices.csv"
df = pd.read_csv(input_csv)

# Save as JSON
output_json = "historical_prices.json"
df.to_json(output_json, orient="records", date_format="iso")
print(f"Data saved to {output_json}.")
