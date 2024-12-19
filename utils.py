import psutil
import requests

def get_resource_usage():
    """Fetches system CPU and memory usage."""
    cpu_usage = psutil.cpu_percent()
    memory_usage = psutil.virtual_memory().percent
    return cpu_usage, memory_usage

def get_carbon_intensity(location):
    """Fetches carbon intensity data from an API."""
    try:
        # Replace with a real API endpoint
        response = requests.get(f'https://api.electricitymaps.com/v1/latest?location={location}')
        data = response.json()
        return data.get('carbonIntensity', 0)  # Default to 0 if key is missing
    except Exception as e:
        print(f"Error fetching carbon intensity: {e}")
        return 0

def assess_ecological_impact(cpu_usage, memory_usage, carbon_intensity):
    """Calculates an ecological impact score."""
    efficiency_score = 100 - (cpu_usage + memory_usage) / 2
    carbon_score = 100 - carbon_intensity / 10
    return max((efficiency_score + carbon_score) / 2, 0)  # Ensure score is non-negative
