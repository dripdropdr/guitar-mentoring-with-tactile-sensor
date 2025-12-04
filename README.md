# Guitar Mentoring with Tactile Sensor

A full-stack application for guitar learning that uses tactile sensors to detect chord fingerings and provides real-time feedback and audio playback.

## Features

- 🎸 **Real-time Chord Detection**: Uses tactile sensor data to detect guitar chord fingerings
- 🎵 **Audio Playback**: Plays chord audio files when chords are detected
- 🎯 **Practice Mode**: Guided practice sessions with chord-specific exercises
- 📊 **ML Classification**: Machine learning-based chord classification from sensor data
- 🎨 **Modern UI**: React-based frontend with intuitive user interface
- 🔌 **Sensor Integration**: Ready for tactile sensor hardware integration

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **TypeScript** - Type safety

### Backend
- **FastAPI** - Python web framework
- **NumPy** - Numerical computing
- **Uvicorn** - ASGI server

### Audio
- **Pygame** - Audio playback (for standalone player)

## Project Structure

```
guitar-chords/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components (Home, Practice)
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts
│   └── utils/             # Utility functions (API client)
├── python/                # Python backend
│   ├── api/               # FastAPI server
│   │   └── server.py      # Main API server
│   ├── ml/                # Machine learning
│   │   └── classifier.py   # Chord classification logic
│   └── sensor/            # Sensor integration
│       └── reader.py       # Sensor data reader
├── public/                # Static assets
│   └── sounds/            # Chord audio files
├── player.py              # Standalone audio player
└── requirements.txt       # Python dependencies
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8 or higher
- npm or yarn

### Frontend Setup

```bash
# Install Node.js dependencies
npm install
```

### Backend Setup

```bash
# Install Python dependencies
pip install -r python/requirements.txt

# Or install specific packages:
pip install fastapi uvicorn numpy
```

### Audio Player (Optional)

The standalone audio player requires pygame:

```bash
pip install pygame
```

## Running the Application

### Start the Backend Server

```bash
# From the project root
python python/api/server.py
```

The API server will run on `http://127.0.0.1:8000`

### Start the Frontend

In a separate terminal:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Using the Standalone Audio Player

```bash
python player.py
```

This will open a window where you can press keys to play chords:
- `a` → Am
- `e` → Em
- `g` → G
- `c` → C
- `d` → D
- Press `ESC` to quit

**Note**: Click on the player window to give it focus before pressing keys.

## API Endpoints

### POST `/api/sensor/processed`
Processes sensor data and returns detected chord information.

**Response:**
```json
{
  "chord": "C major",
  "fret_positions": [0, 2, 3],
  "string_positions": [0, 2, 3]
}
```

## Chord Detection

The ML classifier recognizes the following chords:
- **C major**
- **G major**
- **D major**
- **A minor**
- **E minor**

Chord detection is based on binary matrix patterns from the tactile sensor, matching finger positions (string and fret) against predefined chord rules.

## Sound Files

Chord audio files are located in `public/sounds/`:
- `am.mp3` - A minor
- `c.mp3` - C major
- `d.mp3` - D major
- `em.mp3` - E minor
- `g.mp3` - G major

## Development

### Frontend Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

The FastAPI server includes automatic reloading. Modify `python/api/server.py` and the server will reload automatically.

API documentation is available at `http://127.0.0.1:8000/docs` when the server is running.

### Adding New Chords

1. **Update Classifier**: Add chord rules in `python/ml/classifier.py`:
   ```python
   "New Chord": {
       "string": [0, 1, 2],
       "fret": [0, 2, 3],
   }
   ```

2. **Add Audio File**: Place the MP3 file in `public/sounds/` with the appropriate name (e.g., `newchord.mp3`)

3. **Update Frontend**: Add chord mapping in `src/utils/api.ts` if needed

## Sensor Integration

The sensor reader (`python/sensor/reader.py`) is designed to work with tactile sensor hardware. Currently, it's set up to work with mock data for development.

To integrate real hardware:
1. Install `pyserial`: `pip install pyserial`
2. Configure the serial port in `python/sensor/reader.py`
3. Uncomment and configure the serial connection code

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with React and FastAPI
- Audio playback powered by Pygame
- Chord detection using pattern matching and ML classification
