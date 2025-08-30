import numpy as np

class LogisticRegressionModel:
    def __init__(self, input_size):
        self.weights = np.random.randn(input_size, 1) * 0.01
        self.bias = 0.0
        
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-np.clip(x, -250, 250)))  # Clip to prevent overflow
        
    def predict(self, x):
        if isinstance(x, list):
            x = np.array(x)
        z = np.dot(x, self.weights) + self.bias
        return self.sigmoid(z)  
