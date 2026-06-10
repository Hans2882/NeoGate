---
sidebar_position: 6
title: Pengendalian Sistem
---

# Pengendalian Sistem

Halaman ini digunakan untuk mengatur mode operasi sistem.

## Mode Otomatis

Pada mode otomatis, sistem bekerja berdasarkan data sensor.

### Cara Kerja

1. Sensor mendeteksi kereta.
2. Data dikirim ke ESP32.
3. Data diteruskan ke Firebase.
4. Dashboard menerima pembaruan data.
5. Palang bergerak secara otomatis.

## Mode Manual

Mode manual digunakan ketika operator ingin mengambil alih kendali sistem.

### Langkah Mengaktifkan

1. Klik tombol **Ubah ke Manual**.
2. Status mode berubah menjadi MANUAL.
3. Operator dapat mengendalikan sistem secara langsung.

:::warning

Gunakan mode manual hanya jika diperlukan.

:::

## Menonaktifkan Sensor

### Langkah

1. Klik tombol **Matikan Sensor**.
2. Sensor akan dinonaktifkan sementara.

:::danger

Jangan menonaktifkan sensor saat jalur kereta aktif digunakan.

:::