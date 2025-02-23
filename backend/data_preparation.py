import pandas as pd

def prepare_data(form_data):
    # Convert form data to DataFrame
    df = pd.DataFrame(form_data)
    
    # Assuming the last column is the target variable (score)
    X = df.iloc[:, :-1].values  # Features
    y = df.iloc[:, -1].values    # Target variable (score)
    
    return X, y
