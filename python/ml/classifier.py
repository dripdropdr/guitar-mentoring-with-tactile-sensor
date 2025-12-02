import numpy as np
import typing as tp

chord_rules = {
    "G major": {
        "string": [0, 4, 5],
        "fret":   [5, 3, 5],
    },
    "A minor": {
        "string": [2, 3, 4],
        "fret":   [1, 3, 3],
    },
    "C major": {
        "string": [1, 2, 4],
        "fret":   [2, 1, 0],
    },
    "D major": {
        "string": [0, 1, 2, 3, 4, 5],
        "fret":   [1, 2, 1],
    },
    "G minor": {
        "fret": [3, 7, 9],
        "string": [0, 2, 3],
    },
}

def classify_chord(binary_matrix: np.array) -> str:
    """
    classify the chord from the binary matrix
    """
    # binary_matrix에서 값이 1인 위치의 인덱스 추출
    # binary_matrix는 6x11 행렬 (6 strings x 11 frets)
    # np.where는 (string_indices, fret_indices) 튜플을 반환
    string_indices, fret_indices = np.where(binary_matrix == 1)
    
    # 리스트로 변환
    active_strings = sorted(string_indices.tolist())
    active_frets = sorted(fret_indices.tolist())
    
    # chord_rules와 매칭
    for chord_name, chord_data in chord_rules.items():
        if "fret" in chord_data and "string" in chord_data:
            # 정렬해서 비교 (순서가 중요하지 않음)
            if sorted(chord_data["fret"]) == active_frets and \
               sorted(chord_data["string"]) == active_strings:
                return chord_name, active_frets, active_strings
    
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

    # example - C major
    # 6 strings x 11 frets binary matrix
    # fret_positions = [1, 5, 7]
    # string_positions = [0, 2, 3]
    # chord_name = "C major"

    


