#include <ESP32Servo.h>

// --- PIN ---
const int triggerA = 13;
const int release  = 12;
const int triggerB = 14;
const int vehicle1 = 26;
const int vehicle2 = 27;
const int buzzer   = 4;
const int pinServo1 = 18;
const int pinServo2 = 19;

Servo servo1;
Servo servo2;

// --- STATE MANAGEMENT ---
int pos = 0; 
bool keretaMelintas = false;
String arahDatang = ""; 
unsigned long waktuSelesaiMelintas = 0; 
const int jedaBlokirSensor = 10000; 

void setup() {
  Serial.begin(115200);
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

  Serial.println("Sistem Siap: Dengan Fitur Anti-Trigger Berulang.");
}

void loop() {
  unsigned long waktuSekarang = millis();
  bool sA = digitalRead(triggerA) == LOW;
  bool sB = digitalRead(triggerB) == LOW;
  bool sRel = digitalRead(release) == LOW;

  // 1. DETEKSI KEDATANGAN
  if (!keretaMelintas && (waktuSekarang - waktuSelesaiMelintas >= jedaBlokirSensor)) {
    if (sA) {
      arahDatang = "KIRI";
      eksekusiProsedurDatang();
    } 
    else if (sB) {
      arahDatang = "KANAN";
      eksekusiProsedurDatang();
    }
  } else if (!keretaMelintas && (sA || sB)) {
    Serial.println("Sensor terdeteksi, tapi diabaikan karena kereta sebelumnya belum menjauh.");
  }

  // 2. LOGIKA RELEASE
  if (keretaMelintas && sRel) {
    while (digitalRead(release) == LOW) {
      digitalWrite(buzzer, HIGH);
      delay(150);
      digitalWrite(buzzer, LOW);
      delay(150);
    }
    
    Serial.println("Ekor kereta lewat. Membuka palang...");
    delay(1000); 
    bukaPalang();
    
    keretaMelintas = false;
    arahDatang = "";
    waktuSelesaiMelintas = millis();
    Serial.println("Palang terbuka. Mengaktifkan masa aman 10 detik...");
  }

  // Buzzer Standby
  if (keretaMelintas && pos >= 90) {
    digitalWrite(buzzer, HIGH);
    delay(200);
    digitalWrite(buzzer, LOW);
    delay(800);
  }

  delay(50);
}


void eksekusiProsedurDatang() {
  keretaMelintas = true;
  Serial.print("KERETA TERDETEKSI DARI ");
  Serial.println(arahDatang);
  
  for (int i = 0; i < 6; i++) {
    digitalWrite(buzzer, HIGH);
    delay(250);
    digitalWrite(buzzer, LOW);
    delay(250);
  }
  tutupPalang();
}

void tutupPalang() {
  for (int i = pos; i <= 90; i++) {
    if (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW) {
      digitalWrite(buzzer, HIGH);
      while (digitalRead(vehicle1) == LOW || digitalRead(vehicle2) == LOW) { delay(100); }
      digitalWrite(buzzer, LOW);
    }
    pos = i;
    servo1.write(pos);
    servo2.write(pos);
    if (i % 15 == 0) digitalWrite(buzzer, HIGH);
    else if (i % 15 == 5) digitalWrite(buzzer, LOW);
    delay(40); 
  }
}

void bukaPalang() {
  for (int i = pos; i >= 0; i--) {
    pos = i;
    servo1.write(pos);
    servo2.write(pos);
    delay(30); 
  }
}