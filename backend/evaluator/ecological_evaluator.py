from typing import Dict, Tuple
from models.component import DigitalTwin
from scoring.criteria import EcologicalCriteria

class EcologicalEvaluator:
    def __init__(self, weights=None):
        self.criteria = EcologicalCriteria(weights)
        
    def evaluate(self, twin: DigitalTwin) -> Tuple[float, str, Dict[str, float]]:
        
        component_score = self.criteria.normalize_component_score(twin.components)
        reusability_score = self.criteria.normalize_reusability_score(twin.is_reusable)
        energy_score = self.criteria.normalize_energy_source_score(twin.energy_source_renewable_percentage)
        waste_score = self.criteria.normalize_waste_score(twin.waste_generated)
        
        scores = {
            'component_efficiency': component_score,
            'reusability': reusability_score,
            'energy_source': energy_score,
            'waste': waste_score
        }
        
        final_score = (
            component_score * self.criteria.weights['component_efficiency'] +
            reusability_score * self.criteria.weights['reusability'] +
            energy_score * self.criteria.weights['energy_source'] +
            waste_score * self.criteria.weights['waste'] 
        )
        
        classification = self.classify(final_score)
        return final_score, classification, scores

    def classify(self, final_score: float) -> str:
        if final_score >= 75:
            return "Ecologic"
        elif final_score >= 50:
            return "Moderate"
        else:
            return "Not ecologic"