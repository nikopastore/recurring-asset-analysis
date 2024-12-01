import json
from datetime import datetime

# Load the existing JSON file
with open("normalized_prices.json", "r") as file:
    data = json.load(file)

# Add a "Day" field to each record
for record in data:
    if record["Date"]:
        date_obj = datetime.strptime(record["Date"], "%Y-%m-%d")
        record["Day"] = date_obj.strftime("%A")  # e.g., "Monday"

# Save the updated data to a new file
with open("normalized_prices_with_days.json", "w") as file:
    json.dump(data, file, indent=4)

print("Updated JSON saved as normalized_prices_with_days.json")
