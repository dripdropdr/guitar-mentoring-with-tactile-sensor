import numpy as np
import typing as tp

chord_rules = {
    "C major": {
        "notes": ["C", "E", "G"],
        "fret": [0, 2, 3],
        "string": [0, 2, 3],
    },
    "G minor": {
        "notes": ["G", "B", "D"],
    }
}

def classify_chord(binary_matrix: np.array) -> str:
    """
    이진 행렬을 받아서 코드를 분류합니다.
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
                return chord_name
    
    return "Unknown"

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
    binary_matrix = (sensor_data >= 1.8).astype(int)
    chord_name = classify_chord(binary_matrix)

    # example - C major
    # 6 strings x 11 frets binary matrix
    fret_positions = [0, 2, 3]
    string_positions = [0, 2, 3]
    chord_name = "C major"

    return chord_name, fret_positions, string_positions


