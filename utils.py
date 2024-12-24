import requests

def get_energy_data_for_portugal(api_key):
    api_url = "https://api.electricitymap.org/v3/power-breakdown/latest"
    headers = {
        'Authorization': f'Bearer {api_key}'
    }

    try:
        print(f"Fetching energy data for PT...")
        response = requests.get(f"{api_url}?zone=PT", headers=headers)
        response.raise_for_status()
        data = response.json()
        
        renewable_percentage = data.get("renewablePercentage", 0)
        fossil_free_percentage = data.get("fossilFreePercentage", 0)
        emissions = data.get("emissions", {})
        energy_cost = { #cost per kWh
            "wind": 0.04,
            "solar": 0.05,
            "hydro": 0.03,
            "gas": 0.08,
            "coal": 0.10
        }
        component_lifespan = { #years
            "wind": 20,
            "solar": 25,
            "hydro": 50,
            "gas": 15,
            "coal":30
        }

        return {
            "zone": "PT",
            "renewable_percentage": renewable_percentage,
            "fossil_free_percentage": fossil_free_percentage,
            "details": {
                "power_consumption": data.get("powerConsumptionBreakdown", {}),
                "power_production": data.get("powerProductionBreakdown", {}),
                "emissions": emissions,
                "energy_cost": energy_cost,
                "component_lifespan": component_lifespan
            }
        }
    except Exception as e:
        print(f"Error fetching energy data for PT: {e}")
        return None
