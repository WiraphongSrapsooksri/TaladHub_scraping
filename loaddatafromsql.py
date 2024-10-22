import pyodbc
import pandas as pd
import os

# ตั้งค่าการเชื่อมต่อกับฐานข้อมูล
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=172.16.0.161\\SQL2019_DEV;'
    'DATABASE=TaladHub_DEV;'
    'UID=taladhub-rw;'
    'PWD=taladhub-rw@db#2024'
)

# รายชื่อตารางที่ต้องการดึงข้อมูล
tables = [
    'Market',
    'DetailMarket',
    'TypeOfShops',
    'MarketHighlights',
    'AdditionalInfo',
    'DetailMarketTextTextContent',
    'NearbyPlaces',
    'MarketContract',
    # 'ImageMarket',
    'EmptyPanel'
]

# ตรวจสอบหรือสร้างโฟลเดอร์สำหรับเก็บไฟล์ CSV ในโฟลเดอร์ csv
output_directory = 'csv'
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# ดึงข้อมูลจากแต่ละตารางและส่งออกเป็นไฟล์ CSV
for table in tables:
    query = f"SELECT * FROM {table}"
    df = pd.read_sql(query, conn)
    csv_file_path = os.path.join(output_directory, f"{table}.csv")
    df.to_csv(csv_file_path, index=False, encoding='utf-8-sig')
    print(f"Exported {table} to {csv_file_path}")

# ปิดการเชื่อมต่อกับฐานข้อมูล
conn.close()
