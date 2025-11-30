"""
Local HTTP server example by FastAPI
Provide API endpoints for communication with the frontend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import numpy as np

# Add the parent directory to the path to make modules importable
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sensor.reader import read_sensor_data
from ml.classifier import classify_code

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/sensor/processed")
async def processed_code_from_sensor():
    # data = read_sensor_data()
    data = np.array([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
    chord, fret_positions, string_positions = classify_code(data)
    return {"chord": chord, "fret_positions": fret_positions, "string_positions": string_positions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


