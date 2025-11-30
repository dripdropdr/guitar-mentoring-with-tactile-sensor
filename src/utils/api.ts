/**
 * API utils to communicate with the local Python server (Flask/FastAPI)
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface ChordData {
  chord: string;
  fret_positions: number[];
  string_positions: number[];
}

/**
 * Chord mapping: chord name -> {fret_positions, string_positions}
 * This should match the chord_rules in python/ml/classifier.py
 */
const CHORD_MAPPING: Record<string, { fret_positions: number[]; string_positions: number[] }> = {
  'C major': {
    fret_positions: [0, 2, 3],
    string_positions: [0, 2, 3],
  },
  'G minor': {
    fret_positions: [], // TODO: Add when defined in classifier.py
    string_positions: [],
  },
  // Add more chords as needed
  'G major': {
    fret_positions: [3, 0, 0, 0, 2, 3],
    string_positions: [0, 1, 2, 3, 4, 5],
  },
  'D major': {
    fret_positions: [2, 2, 2, 0],
    string_positions: [0, 1, 2, 3],
  },
  'A minor': {
    fret_positions: [0, 1, 2, 2, 0, 0],
    string_positions: [0, 1, 2, 3, 4, 5],
  },
  'E minor': {
    fret_positions: [0, 0, 0, 2, 2, 0],
    string_positions: [0, 1, 2, 3, 4, 5],
  },
  'F major': {
    fret_positions: [1, 3, 3, 2, 1, 1],
    string_positions: [0, 1, 2, 3, 4, 5],
  },
};

/**
 * Get fret and string positions for a given chord name
 */
export function getChordPositions(chordName: string): { fret_positions: number[]; string_positions: number[] } | null {
  return CHORD_MAPPING[chordName] || null;
}

/**
 * Get processed chord data from sensor
 */
export async function getProcessedChordData(): Promise<ChordData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sensor/processed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch chord data:', error);
    throw error;
  }
}

/**
 * Read sensor data
 */
export async function readSensorData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sensor/read`);
    if (!response.ok) {
      throw new Error('센서 데이터 읽기 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('센서 데이터 읽기 오류:', error);
    throw error;
  }
}


/**
 * WebSocket을 통한 실시간 센서 데이터 스트리밍
 */
export function createSensorWebSocket(onMessage: (data: any) => void) {
  const ws = new WebSocket('ws://localhost:5000/ws/sensor'); // WebSocket 엔드포인트
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket 오류:', error);
  };
  
  return ws;
}


