from torch import nn, optim
import torch
from model import LogisticRegressionModel
from data_preparation import prepare_data

def train_model(X, y, input_size, num_epochs=100, learning_rate=0.01):
    model = LogisticRegressionModel(input_size)
    criterion = nn.BCELoss()  
    optimizer = optim.SGD(model.parameters(), lr=learning_rate)

    X_tensor = torch.FloatTensor(X)
    y_tensor = torch.FloatTensor(y).view(-1, 1) 

    for epoch in range(num_epochs):
        model.train()
        optimizer.zero_grad() 

        outputs = model(X_tensor)
        loss = criterion(outputs, y_tensor)

        loss.backward()
        optimizer.step()

        if (epoch + 1) % 10 == 0:
            print(f'Epoch [{epoch + 1}/{num_epochs}], Loss: {loss.item():.4f}')

    return model
