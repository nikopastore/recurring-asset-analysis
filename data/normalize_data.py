import pandas as pd

# Load the original CSV
input_csv = "historical_prices.csv"
df = pd.read_csv(input_csv)

# Melt the Close, Close.1, Close.2 columns into rows
df_melted = pd.melt(
    df,
    id_vars=["Date"],
    value_vars=["Close", "Close.1", "Close.2"],
    var_name="AssetColumn",
    value_name="TempClose"  # Temporary name to avoid conflicts
)

# Map asset names to the melted columns
asset_mapping = {
    "Close": "Gold",
    "Close.1": "Bitcoin",
    "Close.2": "SPY"
}
df_melted["Asset"] = df_melted["AssetColumn"].map(asset_mapping)

# Drop rows with no closing price
df_melted = df_melted.dropna(subset=["TempClose"])

# Convert the TempClose column to numeric
df_melted["TempClose"] = pd.to_numeric(df_melted["TempClose"], errors="coerce")

# Rename TempClose back to Close
df_melted = df_melted.rename(columns={"TempClose": "Close"})

# Keep only relevant columns
df_melted = df_melted[["Asset", "Date", "Close"]]

# Save the normalized data to JSON
output_json = "normalized_prices.json"
df_melted.to_json(output_json, orient="records", date_format="iso")
print(f"Normalized data saved to {output_json}.")
