from utils import get_energy_data_for_portugal

def main():
    api_key = "pnu0oRE4gsIMK" 

    print("Fetching renewable energy data for Portugal...")
    energy_data = get_energy_data_for_portugal(api_key)

    if energy_data:
        print(f"Zone: {energy_data['zone']}")
        print(f"Renewable Energy Percentage: {energy_data['renewable_percentage']}%")
        print(f"Fossil-Free Energy Percentage: {energy_data['fossil_free_percentage']}%")
        print("\nPower Consumption Breakdown:")
        for source, amount in energy_data["details"]["power_consumption"].items():
            print(f"  {source}: {amount} MW")

        print("\nPower Production Breakdown:")
        for source, amount in energy_data["details"]["power_production"].items():
            print(f"  {source}: {amount} MW")
    else:
        print("Failed to fetch renewable energy data for Portugal.")

if __name__ == "__main__":
    main()
