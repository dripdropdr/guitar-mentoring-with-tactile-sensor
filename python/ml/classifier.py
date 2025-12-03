import numpy as np
import typing as tp

chord_rules = {
    "A minor": {
        "string": [1, 2, 3],
        "fret":   [1, 3, 3],
    },
    "C major": {
        "string": [1, 3, 4],
        "fret":   [1, 3, 5],
    },
    "D major": {
        "string": [0, 1, 3],
        "fret":   [3, 5, 3],
    },
    "E minor": {
        "string": [3, 4],
        "fret":   [3, 3],
    },
    "G major": {
        "string": [0, 4, 5],
        "fret":   [5, 3, 5],
    },
}

def classify_chord(binary_matrix: np.array) -> str:
    """
    classify the chord from the binary matrix
    """
    # extract the indices of the positions where the value is 1 in the binary_matrix
    # binary_matrix is a 6x11 matrix (6 strings x 11 frets)
    # np.where returns a tuple of (string_indices, fret_indices)
    string_indices, fret_indices = np.where(binary_matrix == 1)
    
    # keep the pairing while converting to list (do not sort - preserve pairing information)
    active_strings = string_indices.tolist()
    active_frets = fret_indices.tolist()
    
    # match the chord_rules (use the sorted version for comparison)
    active_strings_sorted = sorted(active_strings)
    active_frets_sorted = sorted(active_frets)
    
    for chord_name, chord_data in chord_rules.items():
        if "fret" in chord_data and "string" in chord_data:
            if sorted(chord_data["fret"]) == active_frets_sorted and \
               sorted(chord_data["string"]) == active_strings_sorted:
                # if a match is found, return the original pairing
                return chord_name, active_frets, active_strings
    
    # even if no matching chord is found, return the original pairing
    return "Unknown", active_frets, active_strings

previous_chord = None
previous_fret_positions = []
previous_string_positions = []

def classify_code(sensor_data: np.array) -> tp.Tuple[str, list[int], list[int]]:
    """
    Args:
        sensor_data: sensor data (numpy array)

    Returns:
        tuple: (chord_name, fret_positions, string_positions)
            - chord_name (str): classified chord name (e.g. "C major", "G minor") If unknown, return "Unknown"
            - fret_positions (list[int]): fret positions of the chord
            - string_positions (list[int]): string positions of the chord
    """
    global previous_chord, previous_fret_positions, previous_string_positions

    if sensor_data is not None:
        binary_matrix = (sensor_data <= 1.5).astype(int)
        chord_name, fret_positions, string_positions = classify_chord(binary_matrix)
        previous_chord, previous_fret_positions, previous_string_positions = chord_name, fret_positions, string_positions
        return chord_name, fret_positions, string_positions

    else:
        return previous_chord, previous_fret_positions, previous_string_positions
    


