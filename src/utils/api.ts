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
 * Get fret and string positions for a given chord name
 * Always fetches directly from server (no cache) - ensures latest data from classifier.py
 * 
 * Note: fret_positions and string_positions are paired by index.
 * For example, fret_positions[0] pairs with string_positions[0]
 * to form the position (fret, string) = (fret_positions[0], string_positions[0])
 */
export async function getChordPositions(chordName: string): Promise<{ fret_positions: number[]; string_positions: number[] } | null> {
  try {
    // URL 인코딩: 공백을 %20으로 변환 (예: "C major" -> "C%20major")
    const encodedChordName = encodeURIComponent(chordName);
    const response = await fetch(`${API_BASE_URL}/api/chords/${encodedChordName}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Chord "${chordName}" not found on server`);
        return null;
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    
    // 서버에서 에러 응답이 오는 경우 처리
    if (data.error) {
      console.warn(`Chord "${chordName}" not found:`, data.error);
      return null;
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch chord positions for "${chordName}":`, error);
    return null;
  }
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


