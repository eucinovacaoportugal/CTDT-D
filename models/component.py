from dataclasses import dataclass
from typing import List as TypeList

@dataclass
class Component:
    name: str
    type:str
    energy_consumption: float #kWh/day
    lifespan_years: float
    
@dataclass
class DigitalTwin:
    components: TypeList[Component]
    is_reusable: bool
    energy_source_renewable_percentage: float
    total_energy_consumption: float #kWh/day
    waste_generated: float #kg