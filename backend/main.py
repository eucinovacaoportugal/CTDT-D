from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_energy_data_for_portugal
from models.component import Component, DigitalTwin
from evaluator.ecological_evaluator import EcologicalEvaluator

app = Flask(__name__)
CORS(app)

@app.route('/evaluate', methods=['POST'])
def evaluate_digital_twin():
    try:
        data = request.json
        application = data.get('application')
        components_data = data.get('components', [])

        components = [
            Component(
                name=comp['name'],
                type=comp['type'],
                energy_consumption=float(comp['consumption']),
                lifespan_years=float(comp['lifespan'])
            )
            for comp in components_data
        ]

        api_key = "pnu0oRE4gsIMK"
        energy_data = get_energy_data_for_portugal(api_key)
        renewable_percentage = energy_data['renewable_percentage'] if energy_data else 50.0

        twin = DigitalTwin(
            components=components,
            is_reusable=True,
            energy_source_renewable_percentage=renewable_percentage,
            total_energy_consumption=sum(c.energy_consumption for c in components),
            waste_generated=sum(c.energy_consumption * 0.02 for c in components)  
        )

        evaluator = EcologicalEvaluator()
        score, classification, detailed_scores = evaluator.evaluate(twin)

        return jsonify({
            'final_score': round(score, 2),
            'classification': classification,
            'detailed_scores': {k: round(v, 2) for k, v in detailed_scores.items()}
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
    
    
# # main.py
# from fastapi import FastAPI, Depends, HTTPException, status
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# from database import engine, get_db
# from models import Base, User, UserCreate, UserLogin, UserResponse
# from auth import verify_password, get_password_hash, create_access_token, get_current_user
# from datetime import timedelta

# # Create database tables
# Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace with your React app's URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/register", response_model=UserResponse)
# async def register(user_data: UserCreate, db: Session = Depends(get_db)):
#     # Check if user exists
#     db_user = db.query(User).filter(User.email == user_data.email).first()
#     if db_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )
    
#     # Create new user
#     hashed_password = get_password_hash(user_data.password)
#     db_user = User(
#         email=user_data.email,
#         name=user_data.name,
#         hashed_password=hashed_password
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
    
#     return UserResponse(
#         id=db_user.id,
#         email=db_user.email,
#         name=db_user.name
#     )

# @app.post("/login")
# async def login(user_data: UserLogin, db: Session = Depends(get_db)):
#     # Find user
#     user = db.query(User).filter(User.email == user_data.email).first()
#     if not user or not verify_password(user_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     # Create access token
#     access_token_expires = timedelta(minutes=30)
#     access_token = create_access_token(
#         data={"sub": user.email}, expires_delta=access_token_expires
#     )
    
#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user": {
#             "id": user.id,
#             "email": user.email,
#             "name": user.name
#         }
#     }

# @app.get("/me", response_model=UserResponse)
# async def read_users_me(current_user: User = Depends(get_current_user)):
#     return UserResponse(
#         id=current_user.id,
#         email=current_user.email,
#         name=current_user.name
#     )

# # Your existing evaluate endpoint
# @app.post("/evaluate")
# async def evaluate_twin(data: dict, current_user: User = Depends(get_current_user)):
#     # Your existing evaluation logic here
#     pass