import torch

def predict(model, input_data):
    model.eval()  # Set the model to evaluation mode
    with torch.no_grad():
        input_tensor = torch.FloatTensor(input_data)
        output = model(input_tensor)
        return output.numpy()  # Return the predicted probabilities
