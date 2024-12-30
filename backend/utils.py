import requests

def get_energy_data_for_portugal(api_key):
    api_url = "https://api.electricitymap.org/v3/power-breakdown/latest"
    headers = {
        'Authorization': f'Bearer {api_key}'
    }

    try:
        return _extracted_get_energy_data_for_portugal(api_url, headers)
    except Exception as e:
        print(f"Error fetching energy data for PT: {e}")
        return None

def _extracted_get_energy_data_for_portugal(api_url, headers):
    print("Fetching energy data for PT...")
    response = requests.get(f"{api_url}?zone=PT", headers=headers)
    response.raise_for_status()
    data = response.json()

    renewable_percentage = data.get("renewablePercentage", 0)
    fossil_free_percentage = data.get("fossilFreePercentage", 0)
    base_values = {
        "optical_sensors": {"emission": 50.0, "cost": 0.08, "lifespan": 15.0},
        "radar_sensor": {"emission": 60.0, "cost": 0.10, "lifespan": 12.0},
        "weather_station": {"emission": 70.0, "cost": 0.012, "lifespan": 10.0},
        "accelerometer": {"emission": 20.0, "cost": 0.05, "lifespan": 8.0},
        "gyroscope": {"emission": 25.0, "cost": 0.06, "lifespan": 9.0},
        "heart_rate_monitor": {"emission": 30.0, "cost": 0.07, "lifespan": 7.0},
    }

    return {
        "zone": "PT",
        "renewable_percentage": renewable_percentage,
        "fossil_free_percentage": fossil_free_percentage,
        "details": base_values
    }
