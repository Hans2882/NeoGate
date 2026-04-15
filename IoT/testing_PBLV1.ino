#include <ESP32Servo.h>

// Definisi Pin Sensor & Output
const int triggerA = 13;
const int release  = 12;
const int triggerB = 14;
const int vehicle1 = 26;
const int vehicle2 = 27;
const int buzzer   = 4;

// Definisi Pin Servo
const int pinServo1 = 18;
const int pinServo2 = 19;

Servo servo1;
Servo servo2;

// Variabel State
int pos = 0;             
bool palangTertutup = false;
bool keretaMelintas = false;

void setup() {
  Serial.begin(115200);

  // Inisialisasi Pin Sensor
  pinMode(triggerA, INPUT_PULLUP);
  pinMode(triggerB, INPUT_PULLUP);
  pinMode(release, INPUT_PULLUP);
  pinMode(vehicle1, INPUT_PULLUP);
  pinMode(vehicle2, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);

  servo1.attach(pinServo1);
  servo2.attach(pinServo2);
  
  servo1.write(0);
  servo2.write(0);

  Serial.println("Sistem Palang Pintu Otomatis Berjalan...");
}

void loop() {
  bool statusA = digitalRead(triggerA) == LOW;
  bool statusB = digitalRead(triggerB) == LOW;
  bool statusRelease = digitalRead(release) == LOW;
  bool adaKendaraan = (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW);

  // 1. Logika Kereta Datang (Menutup Palang)
  if ((statusA || statusB) && !keretaMelintas) {
    keretaMelintas = true;
    Serial.println("KERETA DATANG! Menutup palang perlahan...");
    tutupPalang(adaKendaraan); 
  }

  // 2. Logika Kereta Pergi (Membuka Palang)
  if (statusRelease && keretaMelintas) {
    keretaMelintas = false;
    Serial.println("KERETA LEWAT. Membuka palang...");
    bukaPalang();
    digitalWrite(buzzer, LOW);
  }

  // Efek Buzzer saat kereta melintas
  if (keretaMelintas && pos >= 90) {
    digitalWrite(buzzer, HIGH);
    delay(200);
    digitalWrite(buzzer, LOW);
    delay(200);
  }

  delay(50);
}

// FUNGSI MENUTUP PERLAHAN
void tutupPalang(bool cekKendaraan) {
  for (int i = pos; i <= 90; i++) {
n
    if (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW) {
      Serial.println("DARURAT: Kendaraan terdeteksi! Berhenti menutup.");
      digitalWrite(buzzer, HIGH);
      while (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW) {
        delay(100); 
      }
      digitalWrite(buzzer, LOW);
    }
    
    pos = i;
    servo1.write(pos);
    servo2.write(pos);
    delay(30);
  }
}

// FUNGSI MEMBUKA PERLAHAN 
void bukaPalang() {
  for (int i = pos; i >= 0; i--) {
    pos = i;
    servo1.write(pos);
    servo2.write(pos);
    delay(20); 
  }
}