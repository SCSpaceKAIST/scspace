import os
import mysql.connector
import pandas as pd
from dotenv import load_dotenv
import argparse

# .env 파일 로드
load_dotenv()

# .env 파일에서 데이터베이스 설정 읽기
db_config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PWD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'port': os.getenv('DB_PORT'),
}


def export_tables_to_csv(output_dir='./csv_files'):
    """
    MySQL 데이터베이스의 모든 테이블을 CSV 파일로 내보냅니다.
    """
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    for table_name in tables:
        table_name = table_name[0]
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        columns = [i[0] for i in cursor.description]

        df = pd.DataFrame(rows, columns=columns)
        df.to_csv(os.path.join(output_dir, f"{table_name}.csv"), index=False, encoding='utf-8') 
        print(f"Table {table_name} exported to {os.path.join(output_dir, f'{table_name}.csv')}")

    cursor.close()
    connection.close()


def import_csv_to_tables(input_dir='./csv_files'):
    """
    CSV 파일을 MySQL 테이블로 가져옵니다.
    """
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    csv_files = [f for f in os.listdir(input_dir) if f.endswith('.csv')]

    for csv_file in csv_files:
        table_name = os.path.splitext(csv_file)[0]
        file_path = os.path.join(input_dir, csv_file)
        df = pd.read_csv(file_path, encoding='utf-8')
        print(f"Uploading {csv_file} to {table_name} table...")

        for _, row in df.iterrows():
            columns = ', '.join(row.index)
            values = ', '.join([f"'{str(x).replace('nan', 'NULL')}'" for x in row.values])
            insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({values})"
            try:
                cursor.execute(insert_query)
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                connection.rollback()
                continue
        input()
        connection.commit()
        print(f"Data from {csv_file} uploaded to {table_name} table.")

    cursor.close()
    connection.close()


def main():
    parser = argparse.ArgumentParser(description="MySQL Database Utility")
    parser.add_argument(
        "--exports", 
        action="store_true", 
        help="Export all tables from MySQL database to CSV files"
    )
    parser.add_argument(
        "--imports", 
        action="store_true", 
        help="Import all CSV files from a directory to MySQL database tables"
    )
    parser.add_argument(
        "--dir", 
        type=str, 
        default="./csv_files", 
        help="Directory to store or load CSV files (default: ./csv_files)"
    )

    args = parser.parse_args()

    if args.exports:
        export_tables_to_csv(args.dir)
    elif args.imports :
        import_csv_to_tables(args.dir)
    else:
        print("Please specify either --export or --import")

if __name__ == "__main__":
    main()

## db to CSV
# python database_utils.py --export --dir=./exported_csv_files
## CSV to db
# python database_utils.py --import --dir=./import_csv_files

# 파일 폴더에서
# scp -i ../2024SCSpace.pem -r ubuntu@3.36.210.28:~/scspace/exported_csv_files ./exported_csv_files