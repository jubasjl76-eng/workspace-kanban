# Smart Pet Feeder - Hardware Research (Stage 0)

## Project Overview
A smart pet feeder with two modes:
- **Basic Mode**: Simple mechanical feeding (timed dispensing)
- **Advanced Mode**: Wi-Fi enabled with scheduling via app/API

---

## Component Options

### Option 1: ESP32-Based (Recommended for Advanced Mode)
| Component | Recommended | Cost | Notes |
|-----------|-------------|------|-------|
| Microcontroller | ESP32 DevKit V1 | €8-12 | Wi-Fi + Bluetooth, 240MHz |
| Motor | SG90 servo or NEMA 17 stepper | €3-15 | SG90 for basic, NEMA for bulk |
| Sensor | HC-SR04 ultrasonic | €2-5 | Measures food level |
| Power | 5V 2A adapter | €5-8 | Standard phone charger |
| PCB | Custom or breadboard | €5-10 | |
| Enclosure | 3D printed | €0-15 | PLA/ABS |

**Total: €23-50**

### Option 2: ESP8266-Based (Cheaper, Wi-Fi Only)
| Component | Recommended | Cost | Notes |
|-----------|-------------|------|-------|
| Microcontroller | ESP8266 NodeMCU | €5-8 | Wi-Fi only, less GPIO |
| Motor | SG90 servo | €3-5 | |
| Sensor | HC-SR04 ultrasonic | €2-5 | |
| Power | 5V 2A adapter | €5-8 | |
| PCB | Custom | €5-10 | |

**Total: €20-36**

### Option 3: Arduino-Based (No Wi-Fi, Basic Mode)
| Component | Recommended | Cost | Notes |
|-----------|-------------|------|-------|
| Microcontroller | Arduino Nano | €6-10 | |
| Motor | SG90 servo | €3-5 | |
| Sensor | HC-SR04 ultrasonic | €2-5 | |
| Power | 5V 2A adapter | €5-8 | |
| RTC Module | DS3231 | €2-4 | For scheduling |

**Total: €18-32**

---

## Comparison Matrix

| Criteria | Option 1 (ESP32) | Option 2 (ESP8266) | Option 3 (Arduino) |
|----------|------------------|--------------------|--------------------|
| Wi-Fi | ✅ Yes | ✅ Yes | ❌ No |
| Bluetooth | ✅ Yes | ❌ No | ❌ No |
| Processing | 240MHz | 80MHz | 16MHz |
| GPIO Pins | 34 | 17 | 22 |
| Difficulty | Medium | Easy | Easy |
| Cost | €23-50 | €20-36 | €18-32 |
| Scalability | ⭐⭐⭐ | ⭐⭐ | ⭐ |

---

## Recommended Components

### For MVP (Basic + IoT Ready):
- **MCU**: ESP32 DevKit V1 (€10)
- **Motor**: SG90 servo (€3)
- **Food Sensor**: HC-SR04 ultrasonic (€3)
- **Power**: 5V 2A (€6)
- **Misc**: Wires, resistors (€5)

**Total: ~€27**

### For Production:
- **MCU**: Custom ESP32 board
- **Motor**: NEMA 17 with TB6600 driver
- **Sensors**: VL53L0X (laser ToF), weight sensor (HX711)
- **Power**: 12V 2A with LM7805 regulation

---

## Pros & Cons Summary

### ESP32 Pros:
- Built-in Wi-Fi + Bluetooth
- Fast processor for OTA updates
- Large community/support
- Can run MicroPython or Arduino framework

### ESP32 Cons:
- Slightly more expensive
- 3.3V logic (need level shifters for 5V)

### Servo (SG90) Pros:
- Cheap and simple
- Built-in gear reduction
- Easy to control with PWM

### Servo Cons:
- Not ideal for bulk food
- Can strip if overloaded

---

## Next Steps
1. Order ESP32 DevKit + SG90 + HC-SR04 (~$15 total)
2. Prototype basic dispensing mechanism
3. Develop firmware
