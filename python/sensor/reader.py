try:
    import serial
    SERIAL_AVAILABLE = True
except ImportError:
    SERIAL_AVAILABLE = False
    serial = None
import random
import numpy as np
import time

# # UI test
SERIAL_PORT = '/dev/tty.usbserial-0001'    # Change this based on your ESP32 port
BAUD_RATE = 250000       # Match the ESP32 code
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.05)
# ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.01, 
#                     write_timeout=0.01, inter_byte_timeout=0.001)

def read_sensor_data():
    """
    Read sensor data from the sensor and return the data as a numpy array.
    
    Returns:
        numpy array: sensor data (6x11 matrix) or None if not available
    """
    if not SERIAL_AVAILABLE:
        return None
    
    try:
        # Note: ser is not defined here - would need to be initialized elsewhere
        # This is a placeholder for when actual hardware is connected
        line = ser.readline().decode('utf-8', errors='ignore').strip()  # Read a line from serial, decode it
        if "Matrix updated:" in line:                          # If the trigger line is received
            # 6 lines to the pre-allocated list to minimize memory allocation
            rows = [None] * 6
            for i in range(6):
                rows[i] = ser.readline().decode('utf-8', errors='ignore').strip()
            try:
                new_matrix = np.array([list(map(float, row.split(','))) for row in rows], dtype=np.float32)
                if new_matrix.shape == (6, 11):
                    return new_matrix
                else:
                    print(f"Invalid matrix shape: {new_matrix.shape}")
            except (ValueError, IndexError):
                pass
    except Exception as e:
        print(f"Serial read error: {e}")
    
    return None

def start_sensor_stream(callback):
    """
    Start the sensor stream and pass the data to the callback function.
    
    Args:
        callback: callback function to receive sensor data
    """
    # example: real-time streaming implementation
    while True:
        data = read_sensor_data()
        callback(data)
        time.sleep(0.1)

    # import python.ml.classifier as classifier
    # chord, fret_positions, string_positions = classifier.classify_code(data)
    # print(chord, fret_positions, string_positions)