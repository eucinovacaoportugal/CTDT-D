import numpy as np
from model import LogisticRegressionModel
from data_preparation import prepare_data

def train_model(X, y, input_size, num_epochs=100, learning_rate=0.01):
    model = LogisticRegressionModel(input_size)
    
    if isinstance(X, list):
        X = np.array(X)
    if isinstance(y, list):
        y = np.array(y).reshape(-1, 1)
    
    # Simple gradient descent training
    for epoch in range(num_epochs):
        # Forward pass
        predictions = model.predict(X)
        
        # Compute loss (binary cross-entropy)
        loss = -np.mean(y * np.log(predictions + 1e-8) + (1 - y) * np.log(1 - predictions + 1e-8))
        
        # Compute gradients
        dw = np.dot(X.T, (predictions - y)) / len(X)
        db = np.mean(predictions - y)
        
        # Update weights
        model.weights -= learning_rate * dw
        model.bias -= learning_rate * db
        
        if (epoch + 1) % 10 == 0:
            print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {loss:.4f}')
    
    return model
