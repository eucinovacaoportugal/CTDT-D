Algorithm Steps

    Inputs:
    - Data acquisition: type of components used (sensors, monitors...) and their energy consumption.
    - Renewability: boolean or score for whether the twin can be reused.
    - Energy metrics: total energy consumed and whether the energy source is renewable.
    - Hardware metrics: amount of waste generated (in kilograms or units).

    Weight and scoring:
    -Assign a weight to each criterion based on importance.
    -Normalize input values to a score (0-100).
    -Calculate a composite score based on weighted averages.

    Output:
    -A final score (0–100) and classification:
        Ecologic: Score ≥ 75.
        Moderate: Score 50–74.
        Not Ecologic: Score < 50.
