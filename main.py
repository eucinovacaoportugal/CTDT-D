from utils import get_energy_data_for_portugal
from models.component import Component, DigitalTwin
from evaluator.ecological_evaluator import EcologicalEvaluator

def evaluate_digital_twin(api_key: str) -> None:
    energy_data = get_energy_data_for_portugal(api_key)
    if not energy_data:
        print("Failed to fetch energy data. Using default values.")
        renewable_percentage = 50.0
    else:
        renewable_percentage = energy_data['renewable_percentage']
        
    components = [
        Component("Temperature Sensor", "sensor", 0.5, 5),
        Component("Pressure Sensor", "sensor", 0.3, 5),
        Component("Display Monitor", "monitor", 2.0, 3),
    ]
    
    twin = DigitalTwin(
        components=components,
        is_reusable=True,
        energy_source_renewable_percentage=renewable_percentage,
        total_energy_consumption=sum(c.energy_consumption for c in components),
        waste_generated=1.5 #kg
    )
    
    evaluator = EcologicalEvaluator()
    score, classification, detailed_scores = evaluator.evaluate(twin)
    
    print("\nDigital Twin Ecological Evaluation Results:")
    print(f"Final Score: {score:.2f}/100")
    print(f"Classification: {classification}")
    print("\nDetailed Scores:")
    for criterion, score in detailed_scores.items():
        print(f"    {criterion}: {score:.2f}/100")

if __name__ == "__main__":
    api_key = "pnu0oRE4gsIMK" 
    evaluate_digital_twin(api_key)
