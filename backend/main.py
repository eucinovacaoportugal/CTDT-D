from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_energy_data_for_portugal
from models.component import Component, DigitalTwin
from evaluator.ecological_evaluator import EcologicalEvaluator
from train import train_model
from predict import predict
from model import LogisticRegressionModel
from data_preparation import prepare_data

app = Flask(__name__)
CORS(app)

model = LogisticRegressionModel(input_size=3) 

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
            waste_generated=sum(c.energy_consumption * 0.02 for c in components)  
        )

        evaluator = EcologicalEvaluator()
        score, classification, detailed_scores = evaluator.evaluate(twin)

        return jsonify({
            'final_score': round(score, 2),
            'classification': classification,
            'detailed_scores': {k: round(v, 2) for k, v in detailed_scores.items()}
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict', methods=['POST'])
def make_prediction():
    data = request.json
    X, _ = prepare_data(data)  
    predictions = []
    for x in X:
        pred = predict(model, x)
        predictions.append(pred)
    return jsonify({'predictions': predictions})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
