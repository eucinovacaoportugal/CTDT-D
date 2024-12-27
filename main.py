import os
from utils import get_energy_data_for_portugal
from models.component import Component, DigitalTwin
from evaluator.ecological_evaluator import EcologicalEvaluator

def evaluate_digital_twin(api_key: str, application: str) -> None:
    energy_data = get_energy_data_for_portugal(api_key)
    if not energy_data:
        print("Failed to fetch energy data. Using default values.")
        renewable_percentage = 50.0
        details = {}
    else:
        renewable_percentage = energy_data['renewable_percentage']
        details = energy_data['details']

    if application == "satellite":
        print("\nSatellite Simulation")
        from tests.satellite_simulation import get_satellite_components
        components = get_satellite_components()
        application_factor = 1.2
    elif application == "rehabilitation":
        print("\nRehabilitation Simulation")
        from tests.rehabilitation_simulation import get_rehabilitation_components
        components = get_rehabilitation_components()
        application_factor = 1.0
    else:
        print("Unknown application type.")
        return

    twin = DigitalTwin(
        components=components,
        is_reusable=True,
        energy_source_renewable_percentage=renewable_percentage,
        total_energy_consumption=sum(c.energy_consumption for c in components),
        waste_generated=1.5 * application_factor
    )

    evaluator = EcologicalEvaluator()
    score, classification, detailed_scores = evaluator.evaluate(twin)

    print("\nDigital Twin Ecological Evaluation Results:")
    print(f"Final Score: {score:.2f}/100")
    print(f"Classification: {classification}")
    print("\nDetailed Scores:")
    for criterion, score in detailed_scores.items():
        adjusted_score = score / application_factor
        print(f"    {criterion}: {adjusted_score:.2f}/100")

if __name__ == "__main__":
    api_key = "pnu0oRE4gsIMK" 
    application = os.getenv("APPLICATION_TYPE", "rehabilitation")  # choose  
    evaluate_digital_twin(api_key, application)
