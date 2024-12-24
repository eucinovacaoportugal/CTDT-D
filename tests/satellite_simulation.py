def get_satellite_components():
    from models.component import Component
    return[
        Component("Optical Sensor", "sensor", 1.5, 10),
        Component("Radar Sensor", "sensor", 2.0, 8),
        Component("Weather Station", "sensor", 3.0, 7)
    ]