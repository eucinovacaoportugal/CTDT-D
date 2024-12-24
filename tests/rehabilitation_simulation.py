def get_rehabilitation_components():
    from models.component import Component
    return[
        Component("Accelerometer", "sensor", 0.5, 5),
        Component("Gyroscope", "sensor", 0.5, 5),
        Component("Heart Rate Monitor", "sensor", 0.3, 4)
    ]