import psutil
import requests

def get_live_metrics():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_usage = psutil.virtual_memory().percent
    return cpu_usage, memory_usage

def get_energy_data(region):
    try:
        api_url = f"https://api.example.com/energy?region={region}"
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        
        return {
            "renewable_percentage": data.get("renewablePercentage", 0)
        }
    except Exception as e:
        print(f"Error fetching energy data: {e}")
        return{"renewable_percentage": 0}

def evaluate_digital_twin(data_acquisition, is_renewable, energy_metrics, hardware_waste):
    WEIGHTS = {
        "data_acquisition": 0.3,
        "renewability": 0.2,
        "energy_usage": 0.3,
        "hardware_waste": 0.2
    }
    
    acquisition_score = 100 - (data_acquisition["energy_consumption"] / 10) - (data_acquisition["hardware_waste"] * 10)
    acquisition_score = max(0, min(acquisition_score, 100))
    renewability_score = 100 if is_renewable else 0
    energy_score = 200 - (energy_metrics["total_consumption"] / 10)
    if energy_metrics["is_renewable"]:
        energy_score += 20
    energy_score = max(0, min(energy_score, 100))
    
    waste_score = 100 - (hardware_waste * 20)
    waste_score = max(0, min(waste_score, 100))
    
    final_score = (
        WEIGHTS["data_acquisition"] * acquisition_score +
        WEIGHTS["renewability"] * renewability_score +
        WEIGHTS["energy_usage"] * energy_score +
        WEIGHTS["hardware_waste"] * waste_score
    )
    
    if final_score >= 75:
        classification = "Ecologic"
    elif final_score >= 50:
        classification = "Moderate"
    else:
        classification = "Not ecologic"
        
    return round(final_score, 2), classification