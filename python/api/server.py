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
from ml.classifier import classify_code, chord_rules

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
    data = read_sensor_data()
    chord, fret_positions, string_positions = classify_code(data)
    return {"chord": chord, "fret_positions": fret_positions, "string_positions": string_positions}

@app.get("/api/chords")
async def get_chord_rules():
    """
    Get all chord rules from the classifier.
    Returns chord rules in a format compatible with the frontend.
    """
    # Convert chord_rules to frontend format
    # Python format: {"fret": [1, 5, 7], "string": [0, 2, 3]}
    # Frontend format: {"fret_positions": [1, 5, 7], "string_positions": [0, 2, 3]}
    chord_mapping = {}
    for chord_name, chord_data in chord_rules.items():
        chord_mapping[chord_name] = {
            "fret_positions": chord_data["fret"],
            "string_positions": chord_data["string"]
        }
    return chord_mapping

@app.get("/api/chords/{chord_name}")
async def get_chord_positions(chord_name: str):
    """
    Get fret and string positions for a specific chord.
    """
    if chord_name in chord_rules:
        chord_data = chord_rules[chord_name]
        return {
            "fret_positions": chord_data["fret"],
            "string_positions": chord_data["string"]
        }
    return {"error": "Chord not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


