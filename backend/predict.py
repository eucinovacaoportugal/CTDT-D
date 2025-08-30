import numpy as np

def predict(model, input_data):
    if isinstance(input_data, list):
        input_data = np.array(input_data)
    return model.predict(input_data)
