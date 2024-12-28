import csv
import pymysql
from datetime import datetime
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

# 데이터베이스 설정
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'charset': os.getenv('DB_CHARSET', 'utf8mb4'),
}

# 테이블 리스트 (스키마에 정의된 테이블 이름)
TABLES = [
    'users',
    'teams',
    'team_members',
    'spaces',
    'space_introductions',
    'semesters',
    'reservations',
    'passwords',
    'notices',
    'faqs',
    'asks',
]

# CSV 파일로 저장하는 함수
def export_table_to_csv(connection, table_name):
    try:
        with connection.cursor() as cursor:
            # 테이블 데이터 가져오기
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()

            if not rows:
                print(f"테이블 '{table_name}'에 데이터가 없습니다.")
                return

            # 컬럼 이름 가져오기
            column_names = [desc[0] for desc in cursor.description]

            # CSV 파일로 저장
            csv_file_name = f"{table_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            with open(csv_file_name, mode='w', newline='', encoding='utf-8') as csv_file:
                writer = csv.writer(csv_file)
                writer.writerow(column_names)  # 컬럼 헤더 작성
                writer.writerows(rows)  # 데이터 작성

            print(f"테이블 '{table_name}' 데이터를 '{csv_file_name}'로 저장했습니다.")
    except Exception as e:
        print(f"테이블 '{table_name}' 데이터를 저장하는 중 오류 발생: {e}")

def main():
    try:
        # 데이터베이스 연결
        connection = pymysql.connect(**DB_CONFIG)

        # 각 테이블을 CSV로 내보내기
        for table in TABLES:
            export_table_to_csv(connection, table)

    except Exception as e:
        print(f"데이터베이스 연결 중 오류 발생: {e}")
    finally:
        connection.close()

if __name__ == '__main__':
    main()