import random
import math

class LogisticRegressionModel:
    def __init__(self, input_size):
        self.weights = [[random.gauss(0, 0.01)] for _ in range(input_size)]
        self.bias = 0.0
        
    def sigmoid(self, x):
        # Clip x to prevent overflow
        x = max(-250, min(250, x))
        return 1 / (1 + math.exp(-x))
        
    def dot_product(self, a, b):
        return sum(a[i] * b[i][0] for i in range(len(a)))
        
    def predict(self, x):
        if not isinstance(x, list):
            x = list(x)
        z = self.dot_product(x, self.weights) + self.bias
        return self.sigmoid(z)  
