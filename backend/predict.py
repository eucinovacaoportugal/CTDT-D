def predict(model, input_data):
    if not isinstance(input_data, list):
        input_data = list(input_data)
    return model.predict(input_data)
