"""
Audio player for guitar chords
Plays audio files when chords are detected
"""

import os
import sys
import time
import warnings
from pathlib import Path
from contextlib import redirect_stderr
from io import StringIO

try:
    import pygame
    PYGAME_AVAILABLE = True
    # Suppress pygame initialization messages
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'
except ImportError:
    PYGAME_AVAILABLE = False
    print("Warning: pygame not installed. Install with: pip install pygame")


class ChordPlayer:
    """Plays audio files for detected chords"""
    
    def __init__(self, audio_folder: str = "audio"):
        """
        Initialize the chord player
        
        Args:
            audio_folder: Path to folder containing chord audio files
        """
        self.audio_folder = Path(audio_folder)
        self.current_sound = None
        
        if PYGAME_AVAILABLE:
            pygame.mixer.init(frequency=22050, size=-16, channels=2, buffer=512)
    
    def player(self, chord: str = None, blocking: bool = False):
        """
        Play audio file for the given chord
        
        Args:
            chord: Name of the chord to play (e.g., "A", "Am", "E", "G")
            blocking: If True, wait for audio to finish. If False, play and return immediately.
        """
        if chord is None:
            return
        
        # Try multiple filename patterns to match the actual files
        chord_lower = chord.lower()
        possible_files = [
            f"{chord_lower}.mp3",                    # e.g., "a.mp3"
            f"{chord_lower} chord.mp3",              # e.g., "a chord.mp3"
            f"{chord.capitalize()} chord.mp3",       # e.g., "Am chord.mp3"
            f"{chord} chord.mp3",                    # e.g., "Am chord.mp3" (original case)
        ]
        
        audio_file = None
        for filename in possible_files:
            test_path = self.audio_folder / filename
            if test_path.exists():
                audio_file = test_path
                break
        
        # Check if file exists
        if audio_file is None:
            print(f"Audio file not found for chord '{chord}'. Tried: {possible_files}")
            return
        
        # Play the audio
        if PYGAME_AVAILABLE:
            try:
                # Stop any currently playing sound (this cuts to the new chord)
                pygame.mixer.music.stop()
                
                # Suppress ID3 and other library warnings
                with redirect_stderr(StringIO()):
                    # Load and play MP3 file using mixer.music (better for MP3)
                    pygame.mixer.music.load(str(audio_file))
                    pygame.mixer.music.play()
                
                print(f"Playing: {chord}")
                
                # Only wait if blocking mode is enabled
                if blocking:
                    while pygame.mixer.music.get_busy():
                        time.sleep(0.1)
                    
            except Exception as e:
                print(f"Error playing audio: {e}")
        else:
            print(f"Would play: {audio_file} (pygame not available)")
    
    def stop(self):
        """Stop currently playing audio"""
        if PYGAME_AVAILABLE:
            pygame.mixer.music.stop()


# Global player instance to reuse
_global_player = None

def player(chord: str = None):
    """
    Play audio for detected chord
    
    Args:
        chord: Name of the chord to play
    """
    global _global_player
    if _global_player is None:
        _global_player = ChordPlayer()
    _global_player.player(chord)


if __name__ == "__main__":
    # Keyboard to chord mapping
    KEY_CHORD_MAP = {
        'a': 'Am',
        'e': 'Em',
        'g': 'g',
        'f': 'f',
        'b': 'Bm',
        'c': 'c',
        'q': 'a',  # Q for A major
    }
    
    # Initialize pygame for keyboard input
    if not PYGAME_AVAILABLE:
        print("Error: pygame is required for keyboard input")
        sys.exit(1)
    
    pygame.init()
    pygame.display.init()  # Need display for keyboard events
    
    # Create player instance
    test_player = ChordPlayer()
    
    print("=" * 50)
    print("Guitar Chord Player - Keyboard Controls")
    print("=" * 50)
    print("\nPress keys to play chords:")
    for key, chord in KEY_CHORD_MAP.items():
        print(f"  {key.upper()} -> {chord}")
    print("\nPress ESC or Q to quit")
    print("=" * 50)
    print("\nListening for keyboard input...\n")
    
    # Main loop for keyboard input
    running = True
    clock = pygame.time.Clock()
    
    # Create a visible window to capture keyboard events (needs focus to work)
    screen = pygame.display.set_mode((300, 100))
    pygame.display.set_caption("Chord Player - Click window and press keys")
    
    # Fill with a simple background
    screen.fill((30, 30, 30))
    font = pygame.font.Font(None, 24)
    text = font.render("Click here, then press keys", True, (255, 255, 255))
    text_rect = text.get_rect(center=(150, 50))
    screen.blit(text, text_rect)
    pygame.display.flip()
    
    print("IMPORTANT: Click on the 'Chord Player' window to give it focus!")
    print("Then press keys to play chords.\n")
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
                else:
                    # Get the key name
                    key_name = pygame.key.name(event.key).lower()
                    
                    # Check if this key maps to a chord
                    if key_name in KEY_CHORD_MAP:
                        chord = KEY_CHORD_MAP[key_name]
                        # Play chord (non-blocking, so it can be interrupted)
                        test_player.player(chord, blocking=False)
                    elif key_name == 'q' and pygame.key.get_mods() & pygame.KMOD_SHIFT:
                        # Allow Q to quit when shift is held
                        running = False
        
        clock.tick(60)  # Limit to 60 FPS
    
    pygame.quit()
    print("\nExiting...")

