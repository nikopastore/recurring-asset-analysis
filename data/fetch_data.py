import yfinance as yf
import pandas as pd
from datetime import datetime

# Define tickers and time range
tickers = {
    "Gold": "GC=F",  # Gold Futures
    "Bitcoin": "BTC-USD",  # Bitcoin
    "SPY": "SPY",  # S&P 500 ETF
}

start_date = "1998-01-01"  # 25 years ago
end_date = datetime.now().strftime("%Y-%m-%d")  # Today's date

# Fetch data
data_frames = {}
for asset, ticker in tickers.items():
    print(f"Fetching data for {asset}...")
    df = yf.download(ticker, start=start_date, end=end_date)
    df.reset_index(inplace=True)  # Reset the index to make Date a column
    df["Asset"] = asset  # Add an Asset column
    df = df[["Asset", "Date", "Close"]]  # Keep relevant columns
    data_frames[asset] = df

# Combine all data into one DataFrame
combined_df = pd.concat(data_frames.values())

# Adjust Bitcoin data to show full 25 years
bitcoin_start = "2009-01-01"
combined_df.loc[(combined_df["Asset"] == "Bitcoin") & (combined_df["Date"] < bitcoin_start), "Close"] = None

# Save to CSV
output_path = "historical_prices.csv"
combined_df.to_csv(output_path, index=False)
print(f"Data saved to {output_path}.")
