from utils import get_resource_usage, get_carbon_intensity, assess_ecological_impact

def main():
    print("Fetching system usage metrics...")
    cpu_usage, memory_usage = get_resource_usage()
    print(f"CPU Usage: {cpu_usage}%, Memory Usage: {memory_usage}%")

    print("Fetching carbon intensity data...")
    carbon_intensity = get_carbon_intensity("DE")  # Example: Germany
    print(f"Carbon Intensity: {carbon_intensity} gCO2eq/kWh")

    print("Assessing ecological impact...")
    score = assess_ecological_impact(cpu_usage, memory_usage, carbon_intensity)
    print(f"Ecological Impact Score: {score}/100")

if __name__ == "__main__":
    main()
