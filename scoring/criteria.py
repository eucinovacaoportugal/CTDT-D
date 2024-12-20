from typing import List as TypeList 
from models.component import Component

class EcologicalCriteria:
    def __init__(self):
        self.weights = {
            'component_efficiency': 0.25,
            'reusability': 0.25,
            'energy_source': 0.4,
            'waste': 0.2
        }
        
    def normalize_component_score(self, components: TypeList[Component]) -> float:
        total_consumption = sum(c.energy_consumption for c in components)
        normalized = max(0, 100 - (total_consumption / len(components)))
        return min (normalized, 100)    
    
    def normalize_reusability_score(self, is_reusable: bool) -> float:
        return 100 if is_reusable else 0
    
    def normalize_energy_source_score(self, renewable_percentage: float) -> float:
        return min(renewable_percentage, 100)
    
    def normalize_waste_score(self, waste_kg: float) -> float:
        normalized = max(0, 100 - (waste_kg * 10))
        return min(normalized, 100)