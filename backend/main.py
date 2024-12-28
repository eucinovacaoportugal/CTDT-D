from flask import Flask, app, request, jsonify
from utils import get_energy_data_for_portugal
from models.component import Component, DigitalTwin
from evaluator.ecological_evaluator import EcologicalEvaluator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/evaluate', methods=['POST'])
def evaluate_digital_twin():
    try:
        data = request.json
        application = data.get('application')
        components_data = data.get('components', [])
        
        components = [
            Component(
                name=comp['name'],
                type=comp['type'],
                energy_consumption=float(comp['consumption']),
                lifespan_years=float(comp['lifespan'])
            )
            for comp in components_data
        ]
        
        api_key = "pnu0oRE4gsIMK" 
        energy_data = get_energy_data_for_portugal(api_key)
        renewable_percentage = energy_data['renewable_percentage'] if energy_data else 50.0
        
        twin = DigitalTwin(
            components=components,
            is_reusable=True, 
            energy_source_renewable_percentage=renewable_percentage,
            total_energy_consumption=sum(c.energy_consumption for c in components),
            waste_generated=1.5
        )
        
        evaluator = EcologicalEvaluator()
        score, classification. detailed_scores = evaluator.evaluate(twin)
        
        return jsonify({
            'final_score': round(score,2),
            'classification': classification,
            'detailed_scores': {k: round (v, 2) for k, v in detailed_scores.items()}
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
