# KULINASTOCK V2

## Product Requirement Document (PRD) & Business Requirement Document (BRD)

### Project

KulinaStock - Inventory Forecasting and Restock Recommendation System

### Version

2.0 (Post-Discussion Revision)

### Status

Approved for Implementation

---

# 1. BUSINESS OBJECTIVE

Membantu pelaku usaha kuliner mengelola persediaan bahan baku dan menentukan kebutuhan pembelian berdasarkan hasil forecasting menggunakan metode:

* Single Exponential Smoothing (SES)
* Holt Exponential Smoothing
* Holt-Winters Exponential Smoothing

Sistem tidak hanya menghasilkan prediksi, tetapi juga menghasilkan rekomendasi restock yang dapat digunakan untuk pengambilan keputusan.

---

# 2. BUSINESS PROBLEM

Permasalahan yang ingin diselesaikan:

1. Kesulitan menentukan jumlah pembelian bahan baku.
2. Risiko kehabisan stok saat permintaan meningkat.
3. Risiko overstock akibat pembelian berlebih.
4. Tidak adanya evaluasi metode forecasting yang digunakan.
5. Tidak tersedianya laporan stok dan rekomendasi pembelian secara otomatis.

---

# 3. SYSTEM PRINCIPLE

## Forecast Result Is Not Stored

Forecast bersifat realtime.

Setiap proses forecasting dihitung langsung dari data historis.

Forecast tidak disimpan ke database.

Tidak terdapat tabel forecast_results.

---

## Report Is Generated Realtime

Semua laporan dihitung ulang berdasarkan:

* Item
* Stock History
* Forecast Engine

---

## Forecast Based on Consumption

Forecast hanya menggunakan transaksi:

TYPE = KELUAR

Transaksi masuk tidak digunakan dalam perhitungan forecasting.

---

# 4. FINAL MENU STRUCTURE

Dashboard

Items

Stock History

Forecast

Reports

---

# 5. ITEMS MODULE

## Purpose

Master data inventory.

## Fields

* Item Name
* Category
* Unit
* Minimum Stock

## Unit Example

* Kg
* Liter
* Butir
* Botol
* Pcs

## Notes

Current Stock tidak diinput manual.

Current Stock dihitung otomatis dari transaksi history.

Formula:

Current Stock =
Total Masuk - Total Keluar

---

# 6. STOCK HISTORY MODULE

## Purpose

Mencatat seluruh pergerakan stok.

## Transaction Types

* Item Masuk
* Item Keluar

## Input Form

Tanggal

Jenis Transaksi

Dynamic Row Input

| Item  | Qty |
| ----- | --- |
| Ayam  | 20  |
| Beras | 10  |

User dapat:

* Tambah Baris
* Hapus Baris

Save dilakukan sekaligus.

## UX Principle

POS-like Input

Cepat untuk banyak item.

---

# 7. FORECAST MODULE

## Purpose

Analisis forecasting dan evaluasi metode.

## Input

Item

Historical Start Date

Forecast Horizon

1 sampai 7 hari

## Rules

Historical period minimal 7 hari.

Forecast horizon:

1 hari

2 hari

3 hari

4 hari

5 hari

6 hari

7 hari

---

## Forecast Engine

Semua metode dijalankan otomatis:

* SES
* Holt
* Holt-Winters

User tidak memilih metode.

---

## Output

### Summary

* Best Method
* MAE
* MAPE
* RMSE
* Forecast Total
* Restock Recommendation

### Forecast Table

| Date | SES | Holt | HW | Final |
| ---- | --- | ---- | -- | ----- |

### Chart

Historical Data

Forecast D+1 sampai D+N

---

## Restock Formula

Restock Recommendation =
Forecast Total
+
Safety Stock
------------

Current Stock

---

## Safety Stock

Global Safety Stock

10%

Formula:

Safety Stock =
Forecast Total × 10%

---

# 8. DASHBOARD MODULE

## Top Cards

1. Total Items

2. Current Stock

3. Low Stock Items

4. Today's Transactions

---

## Alert Section

Low Stock Warning

| Item | Current | Minimum |
| ---- | ------: | ------: |

---

## Forecast Summary Section

Menampilkan item paling kritis.

Contoh:

Minyak Goreng

Current Stock:
10 Liter

Forecast 3 Hari:
50 Liter

Recommendation:
45 Liter

Action:

View Forecast Detail

Redirect ke halaman Forecast dengan item terpilih.

---

# 9. REPORTS MODULE

## Principle

Report bersifat realtime.

Tidak membaca tabel forecast_results.

Data dihitung ulang saat report dibuat.

---

## Report Type 1

Inventory Movement Report

### Filter

Tanggal Awal

Tanggal Akhir

Item (Opsional)

### Output

| Date | Item | Type | Qty |

### Export

Excel

PDF (Opsional)

---

## Report Type 2

Forecast Evaluation Report

### Filter

Historical Period

Item

Forecast Horizon

### Output

| Metric | SES | Holt | HW |

Forecast

MAE

MAPE

RMSE

### Additional Information

Best Method

Reason

### Export

Excel

PDF

---

## Report Type 3

Restock Recommendation Report

### Filter

Historical Period

Forecast Horizon

### Output

| Item | Stock | Forecast | Safety | Restock |

### Export

Excel

PDF (Optional)

---

# 10. EXPORT PRINCIPLE

## Excel

Primary Export Format

Library:

SheetJS (xlsx)

---

## PDF

Table Based

Library:

jsPDF + AutoTable

---

## Not Allowed

html2canvas

Screenshot PDF

Image-based PDF

---

# 11. REMOVED FEATURES

Removed:

* Results Page
* Forecast Save Mechanism
* forecast_results Table
* Automatic Save on Forecast Page
* Screenshot PDF Export

---

# 12. THESIS ALIGNMENT

System directly supports:

* Inventory Forecasting
* Forecast Method Comparison
* Accuracy Evaluation
* Automatic Report Generation
* Restock Recommendation

System output directly answers operational inventory problems and supports decision making for procurement activities.
