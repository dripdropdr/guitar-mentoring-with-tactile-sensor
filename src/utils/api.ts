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
 * 
 * Note: fret_positions and string_positions are paired by index.
 * For example, fret_positions[0] pairs with string_positions[0]
 * to form the position (fret, string) = (fret_positions[0], string_positions[0])
 */
/**
 * Chord mapping cache - loaded from server
 * This is populated by fetchChordRules() and kept in sync with python/ml/classifier.py
 * No need to manually sync - always fetched from the single source of truth (server)
 */
let CHORD_MAPPING_CACHE: Record<string, { fret_positions: number[]; string_positions: number[] }> | null = null;

/**
 * Fetch all chord rules from the server
 * This ensures the frontend always uses the same chord definitions as the backend
 */
export async function fetchChordRules(): Promise<Record<string, { fret_positions: number[]; string_positions: number[] }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chords`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const chordRules = await response.json();
    CHORD_MAPPING_CACHE = chordRules;
    return chordRules;
  } catch (error) {
    console.error('Failed to fetch chord rules:', error);
    throw error;
  }
}

/**
 * Get fret and string positions for a given chord name
 * Fetches from server if cache is not available
 * 
 * Note: fret_positions and string_positions are paired by index.
 * For example, fret_positions[0] pairs with string_positions[0]
 * to form the position (fret, string) = (fret_positions[0], string_positions[0])
 */
export async function getChordPositions(chordName: string): Promise<{ fret_positions: number[]; string_positions: number[] } | null> {
  // If cache is not available, fetch from server
  if (!CHORD_MAPPING_CACHE) {
    await fetchChordRules();
  }
  console.log(CHORD_MAPPING_CACHE?.[chordName]);
  console.log(CHORD_MAPPING_CACHE);
  console.log(chordName);
  return CHORD_MAPPING_CACHE?.[chordName] || null;
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


