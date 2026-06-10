#include <ESP32Servo.h>

// --- PIN CONFIGURATION ---
const int triggerA = 13;      
const int release  = 12;      
const int triggerB = 14;      
const int vehicle1 = 26;      
const int vehicle2 = 27;      
const int buzzer   = 4;

const int pinServo1 = 18;
const int pinServo2 = 19;

const int limitOpen1  = 32; // Limit switch palang 1 saat terbuka
const int limitClose1 = 33; // Limit switch palang 1 saat tertutup
const int limitOpen2  = 21; // Limit switch palang 2 saat terbuka
const int limitClose2 = 22; // Limit switch palang 2 saat tertutup

Servo servo1;
Servo servo2;

// --- STATE MANAGEMENT ---
int pos = 0; 
bool keretaMelintas = false;
String arahDatang = ""; 
unsigned long waktuSelesaiMelintas = 0; 
const int jedaBlokirSensor = 10000; // 10 detik agar kereta benar-benar pergi

void setup() {
  Serial.begin(115200);

  // Sensor Pins
  pinMode(triggerA, INPUT_PULLUP);
  pinMode(triggerB, INPUT_PULLUP);
  pinMode(release, INPUT_PULLUP);
  pinMode(vehicle1, INPUT_PULLUP);
  pinMode(vehicle2, INPUT_PULLUP);
  
  // Limit Switch Pins
  pinMode(limitOpen1, INPUT_PULLUP);
  pinMode(limitClose1, INPUT_PULLUP);
  pinMode(limitOpen2, INPUT_PULLUP);
  pinMode(limitClose2, INPUT_PULLUP);
  
  pinMode(buzzer, OUTPUT);

  servo1.attach(pinServo1);
  servo2.attach(pinServo2);
  
  servo1.write(0);
  servo2.write(0);

  Serial.println("SISTEM PALANG PINTU OFFLINE READY");
}

void loop() {
  unsigned long waktuSekarang = millis();
  bool sA = digitalRead(triggerA) == LOW;
  bool sB = digitalRead(triggerB) == LOW;
  bool sRel = digitalRead(release) == LOW;

  // 1. DETEKSI KERETA DATANG
  if (!keretaMelintas && (waktuSekarang - waktuSelesaiMelintas >= jedaBlokirSensor)) {
    if (sA || sB) {
      keretaMelintas = true;
      arahDatang = sA ? "KIRI (A)" : "KANAN (B)";
      eksekusiProsedurDatang();
    }
  }

  // 2. LOGIKA RELEASE
  if (keretaMelintas && sRel) {
    Serial.println("Ekor kereta melintas...");
    while (digitalRead(release) == LOW) {
      digitalWrite(buzzer, HIGH); delay(100);
      digitalWrite(buzzer, LOW);  delay(400);
    }
    
    Serial.println("Jalur bersih. Membuka palang...");
    delay(1000); 
    bukaPalang();
    
    // Reset status
    keretaMelintas = false;
    arahDatang = "";
    waktuSelesaiMelintas = millis();
    Serial.println("Sistem kembali Standby.");
  }

  // 3. BUZZER STANDBY
  if (keretaMelintas && pos >= 85) {
    digitalWrite(buzzer, HIGH); delay(200);
    digitalWrite(buzzer, LOW);  delay(800);
  }

  delay(50);
}

// --- FUNGSI UTAMA ---

void eksekusiProsedurDatang() {
  Serial.print("KERETA DARI: "); Serial.println(arahDatang);
  
  for (int i = 0; i < 6; i++) {
    digitalWrite(buzzer, HIGH); delay(250);
    digitalWrite(buzzer, LOW);  delay(250);
  }
  
  tutupPalang();
}

void tutupPalang() {
  Serial.println("Proses Menutup...");
  bool p1Selesai = false;
  bool p2Selesai = false;

  for (int i = pos; i <= 90; i++) {
    // 1. Safety Stop: Cek Kendaraan
    if (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW) {
      digitalWrite(buzzer, HIGH);
      while (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW) { delay(100); }
      digitalWrite(buzzer, LOW);
    }

    // 2. Cek Limit Switch masing-masing palang
    if (digitalRead(limitClose1) == LOW) p1Selesai = true;
    if (digitalRead(limitClose2) == LOW) p2Selesai = true;

    if (!p1Selesai) servo1.write(i);
    if (!p2Selesai) servo2.write(i);

    pos = i;

    if (p1Selesai && p2Selesai) {
      Serial.println("Kedua palang tertutup rapat.");
      break;
    }

    if (i % 15 == 0) digitalWrite(buzzer, HIGH);
    else if (i % 15 == 5) digitalWrite(buzzer, LOW);
    
    delay(40);
  }
}

void bukaPalang() {
  Serial.println("Proses Membuka...");
  bool p1Selesai = false;
  bool p2Selesai = false;

  for (int i = pos; i >= 0; i--) {
    if (digitalRead(limitOpen1) == LOW) p1Selesai = true;
    if (digitalRead(limitOpen2) == LOW) p2Selesai = true;

    if (!p1Selesai) servo1.write(i);
    if (!p2Selesai) servo2.write(i);

    pos = i;

    if (p1Selesai && p2Selesai) {
      Serial.println("Kedua palang terbuka penuh.");
      break;
    }

    delay(30);
  }
}