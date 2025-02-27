import torch
import torch.nn as nn

class LogisticRegressionModel(nn.Module):
    def __init__(self, input_dim):
        super(LogisticRegressionModel, self).__init__()
        self.linear = nn.Linear(input_dim, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        x = self.linear(x)
        x = self.sigmoid(x)
        return x
    
    def predict(self, x):
        with torch.no_grad():
            x = torch.tensor(x, dtype=torch.float32)
            output = self.forward(x)
            return (output >= 0.5).float() 