import os
import pandas as pd
import json
import requests
from io import StringIO
from datetime import datetime
import logging

last_save_path = None  # 마지막 저장 파일 경로 저장용 변수

# 현재 연도
year = datetime.now().year

# # 현재 파일(fetch_typhoonRoute.py)의 절대 경로
# base_dir = os.path.dirname(os.path.abspath(__file__))




# DATA_ROOT : /var/www/myapp/dist/mockData로 설정해놓기
DATA_ROOT = os.environ.get("DATA_ROOT", "./data")
#태풍list 데이터 경로 ,태풍경로 데이터 경로 초기화



# 로그 설정
log_dir = os.path.join(DATA_ROOT, "logs")
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, "typhoonRoute.log")

logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

logging.info("태풍 Route 데이터 수집 시작")


# 태풍 route 디렉토리 초기화
os.makedirs(os.path.join(DATA_ROOT, "typhoonRoute",f"typhoon_{year}"), exist_ok=True)
# 저장디렉토리 경로
save_dir = os.path.join(DATA_ROOT , "typhoonRoute",f"typhoon_{year}" )


fileRead_path = os.path.join(
    DATA_ROOT,"typhoonList",f"typhoons_{year}.json"
)





if not os.path.exists(fileRead_path):
    logging.info(f"️ {year}년도 태풍 리스트 파일 없음: {fileRead_path}")


else:
    # JSON 읽기
    with open(fileRead_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # YY와 SEQ 추출 예시 (리스트 형태 가정)
    for item in data:
        YY = item.get("YY")
        typ = item.get("SEQ")

        #  태풍 상세 정보 요청
        url = "https://apihub.kma.go.kr/api/typ01/url/typ_data.php"
        params = {
            "YY": YY,
            "typ": typ,
            "mode": "3",
            "disp": "1",
            "help": "1",
            "authKey": "23ba_lYOSXa22v5WDkl2uA"
        }
        response = requests.get(url, params=params)
        response.encoding = "euc-kr"

        # 데이터만 뽑기
        lines = response.text.splitlines()
        data_lines = [line for line in lines if not line.startswith('#') and line.strip()]
        csv_text = "\n".join(data_lines)

        df = pd.read_csv(StringIO(csv_text), header=None)

        # 컬럼명 적용
        col_names = [
            'FT', 'YY', 'TYP', 'SEQ', 'TMD', 'TYP_TM', 'FT_TM', 'LAT', 'LON', 'DIR',
            'SP', 'PS', 'WS', 'RAD15', 'RAD25', 'RAD', 'ED15', 'ER15', 'LOC', 'ED25', 'ER25R', 'END'
        ]
        df.columns = col_names

        # GeoJSON 변환
        features = []
        for _, row in df.iterrows():
            lon = float(row['LON'])
            lat = float(row['LAT'])
            properties = {
                'FT': row['FT'],
                'YY': row['YY'],
                'TYP': row['TYP'],
                'SEQ': row['SEQ'],
                'TMD': row['TMD'],
                'TYP_TM': row['TYP_TM'],
                'FT_TM': row['FT_TM'],
                'LAT': float(row['LAT']),
                'LON': float(row['LON']),
                'DIR': row['DIR'],
                'SP': float(row['SP']),
                'WS': float(row['WS']),
                'PS': float(row['PS']),
                'RAD15': float(row['RAD15']),
                'RAD25': float(row['RAD25']),
                'RAD': float(row['RAD']),
                'ED15': row['ED15'],
                'ER15': float(row['ER15']),
                'ED25': row['ED25'],
                'ER25R': float(row['ER25R']),
                'LOC': row['LOC'],
            }

            feature = {
                'type': 'Feature',
                'geometry': {'type': 'Point', 'coordinates': [lon, lat]},
                'properties': properties
            }
            features.append(feature)

        geojson = {'type': 'FeatureCollection', 'features': features}

        # # 저장 경로 (연도/SEQ별로 저장)
        # save_dir = os.path.normpath(
        #     os.path.join(base_dir, "..", "..", "..", "public", "mockData", "typhoonRoute", f"typhoon_{YY}")
        # )
        # os.makedirs(save_dir, exist_ok=True)



        save_path = os.path.join(save_dir, f"typhoon_{YY}_{typ}.geojson")

        with open(save_path, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, ensure_ascii=False, indent=2)

        last_save_path = save_path  # 마지막 경로 갱신


# 루프 끝난 뒤에 한 번만 로깅
if last_save_path:
    logging.info(f"✅ 마지막 저장 완료: {last_save_path}")