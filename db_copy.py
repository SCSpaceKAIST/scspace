import mysql.connector
import pandas as pd
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

# .env 파일에서 데이터베이스 설정 읽기
db_config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'port': os.getenv('DB_PORT'),
}

# MySQL에 연결
connection = mysql.connector.connect(**db_config)

# 커서 생성
cursor = connection.cursor()

# 데이터베이스 내 모든 테이블 이름 가져오기
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

# 각 테이블을 CSV 파일로 내보내기
for table in tables:
    table_name = table[0]
    
    # 테이블에서 데이터 가져오기
    df = pd.read_sql(f"SELECT * FROM {table_name}", connection)
    
    # CSV 파일로 내보내기
    df.to_csv(f"{table_name}.csv", index=False)
    print(f"Table {table_name} exported to {table_name}.csv")

# 커서와 연결 닫기
cursor.close()
connection.close()