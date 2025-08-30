def prepare_data(form_data):
    # Convert form data to a structured format without pandas
    if isinstance(form_data, dict):
        # If it's a dictionary, convert to list format
        values = list(form_data.values())
        X = [values[:-1]]  # All but last as features
        y = [values[-1]]   # Last as target
    elif isinstance(form_data, list):
        # If it's already a list of dictionaries or lists
        X = []
        y = []
        for item in form_data:
            if isinstance(item, dict):
                values = list(item.values())
                X.append(values[:-1])  # All but last as features
                y.append(values[-1])   # Last as target
            elif isinstance(item, list):
                X.append(item[:-1])    # All but last as features
                y.append(item[-1])     # Last as target
            else:
                X.append([item])
                y.append(0)  # Default target
    else:
        # If it's already in the right format
        X = form_data
        y = [0] * len(form_data) if isinstance(form_data, list) else [0]
    
    return X, y
