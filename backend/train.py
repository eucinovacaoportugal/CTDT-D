import math
from model import LogisticRegressionModel
from data_preparation import prepare_data

def train_model(X, y, input_size, num_epochs=100, learning_rate=0.01):
    model = LogisticRegressionModel(input_size)
    
    # Convert to lists if needed
    if not isinstance(X, list):
        X = list(X)
    if not isinstance(y, list):
        y = list(y)
    
    # Simple gradient descent training
    for epoch in range(num_epochs):
        predictions = []
        losses = []
        
        # Forward pass for all samples
        for i in range(len(X)):
            pred = model.predict(X[i])
            predictions.append(pred)
            
            # Compute loss for this sample
            loss = -(y[i] * math.log(pred + 1e-8) + (1 - y[i]) * math.log(1 - pred + 1e-8))
            losses.append(loss)
        
        # Compute average loss
        avg_loss = sum(losses) / len(losses)
        
        # Compute gradients
        for j in range(input_size):
            gradient = sum((predictions[i] - y[i]) * X[i][j] for i in range(len(X))) / len(X)
            model.weights[j][0] -= learning_rate * gradient
        
        # Update bias
        bias_gradient = sum(predictions[i] - y[i] for i in range(len(X))) / len(X)
        model.bias -= learning_rate * bias_gradient
        
        if (epoch + 1) % 10 == 0:
            print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {avg_loss:.4f}')
    
    return model
