import os

import pandas as pd
import json
import requests
from io import StringIO




# 태풍 고유번호만 받고 , 태풍 정보를 가져와서 geoJSON으로 전부 파싱후 저장


url = "https://apihub.kma.go.kr/api/typ01/url/typ_data.php"
params = {
    "YY": "2024",
    "typ": "7",
    "mode": "3",
    "disp": "1",
    "help": "1",
    "authKey": "23ba_lYOSXa22v5WDkl2uA"
}
response = requests.get(url, params=params)
response.encoding = "euc-kr"  # cp949, euc-kr로도 시도 가능

# 데이터만 뽑기
lines = response.text.splitlines()
data_lines = [line for line in lines if not line.startswith('#') and line.strip()]
csv_text = "\n".join(data_lines)

df = pd.read_csv(StringIO(csv_text), header=None)

# 컬럼명 적용 (20개 기준)
col_names = [
    'FT', 'YY', 'TYP', 'SEQ', 'TMD', 'TYP_TM', 'FT_TM', 'LAT', 'LON', 'DIR',
    'SP', 'PS', 'WS', 'RAD15', 'RAD25', 'RAD', 'ED15', 'ER15', 'LOC', 'ED25', 'ER25R', 'END'
]
df.columns = col_names


print(df.head())




# 예시: df는 pandas DataFrame (이미 위도(LAT), 경도(LON), 기타 데이터 포함)
# 컬럼명: LAT(위도), LON(경도), WS(풍속), 등등

features = []

for _, row in df.iterrows():
    # 위경도 값 추출
    lon = float(row['LON'])
    lat = float(row['LAT'])
    # 반경/속성(propertyValue)로 쓸 값 (예: RAD15, RAD, WS 등)
    # property는 JS쪽에 사용할 속성명과 일치해야 함
    properties = {
        'FT' : row['FT'], # 0은 분석, 1은 예측
        'WS': float(row['WS']),
        'RAD15': float(row['RAD15']),
        'PS': float(row['PS']),
        'DIR': row['DIR'],
        'LOC': row['LOC'],
        'RAD' : row['RAD'],
        'SEQ' : row['SEQ'],
        # ... 추가 원하는 속성
    }

    # 하나의 Feature 생성
    feature = {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [lon, lat],  # [경도, 위도]
        },
        'properties': properties
    }
    features.append(feature)

# 전체 GeoJSON 객체 만들기
geojson = {
    'type': 'FeatureCollection',
    'features': features
}
yy = str(df.iloc[-1]['YY'])   # 연도
typ = str(df.iloc[-1]['TYP']) # 태풍 고유번호

save_dir = '../../../public/typhoonRoute'
os.makedirs(save_dir, exist_ok=True)
save_path = f'{save_dir}/typhoon_{yy}_{typ}.geojson'

with open(save_path, 'w', encoding='utf-8') as f:
    json.dump(geojson, f, ensure_ascii=False, indent=2)
print(f'저장 완료: {os.path.abspath(save_path)}')