from utils import get_live_metrics, get_energy_data, evaluate_digital_twin

def main():
    print("Gathering live system metrics...")
    cpu_usage, memory_usage = get_live_metrics()
    print(f"CPU usage: {cpu_usage}%, Memory usage: {memory_usage}%")
    
    print("Fetching energy data...")
    energy_data = get_energy_data("US")
    renewable_energy_percentage = energy_data.get("renewable_percentage", 0)
    print(f"Renewable energy percentage: {renewable_energy_percentage}%")
    
    #example inputs
    data_acquisition = {
        "type": "sensors",
        "energy_consumption": cpu_usage *5,
        "hardware_waste": 0.5 #kg
    }
    is_renewable = True #can be reused
    hardware_waste = 2.5 #kg
    
    #eco score
    score, classification = evaluate_digital_twin(
        data_acquisition, is_renewable, {"total_consumption": cpu_usage, "is_renewable": renewable_energy_percentage > 50}, hardware_waste
    )
    
    print(f"DT ecological score: {score/100}")
    print(f"Classification: {classification}")
    
if __name__ == "__main__":
    main()