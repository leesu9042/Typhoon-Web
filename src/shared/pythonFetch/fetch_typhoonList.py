import logging

import requests
import pandas as pd
from io import StringIO
import json
import os
from datetime import datetime




#requests
# pandas 라이브러리 설치하기

#현재년도 태풍 list 불러오기


# mockdata 루트 : /var/www/myapp/dist/mockData로 설정해놓기
DATA_ROOT = os.environ.get("DATA_ROOT", "./data")
#태풍list 데이터 경로 ,태풍경로 데이터 경로 초기화



# 로그 디렉토리 생성
log_dir = os.path.join(DATA_ROOT, "logs")
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, "typhoonList.log")

# 로그 설정 (파일 + 콘솔 출력 둘 다)
handlers = [
    logging.FileHandler(log_file, encoding="utf-8"),
    logging.StreamHandler()
]
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=handlers
)

logging.info("태풍 List 데이터 수집 시작")



os.makedirs(os.path.join(DATA_ROOT, "typhoonList"), exist_ok=True)



year = datetime.now().year
authKey = "ZL-cptuMRPO_nKbbjFTzLA"
url = f"https://apihub.kma.go.kr/api/typ01/url/typ_lst.php?YY={year}&disp=1&help=1&authKey={authKey}"

res = requests.get(url)
res.encoding = 'euc-kr'

lines = res.text.splitlines()
data_lines = [line for line in lines if not line.startswith('#') and line.strip()]
csv_text = "\n".join(data_lines)

df = pd.read_csv(StringIO(csv_text), header=None)



col_names = [
    'YY', 'SEQ', 'NOW', 'EFF', 'TM_ST', 'TM_ED', 'TYP_NAME', 'TYP_EN', 'REM', 'EMPTY'
]
df.columns = col_names

# DataFrame을 dict로 변환(컬럼명 그대로 저장)
typhoon_list = df.to_dict(orient='records')





# 리눅스서버용 json 저장

file_path = os.path.join(DATA_ROOT, "typhoonList", f"typhoons_{year}.json")

# JSON 저장 (절대경로 사용)
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(typhoon_list, f, ensure_ascii=False, indent=2)


# 로그저장

log_dir = os.path.join(DATA_ROOT, "logs")
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, "typhoonList.log")

logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

logging.info(" 태풍 데이터 수집 시작")

try:
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(typhoon_list, f, ensure_ascii=False, indent=2)
    logging.info(f" 저장 완료: {file_path}")
except Exception as e:
    logging.error(f" 저장 실패: {e}")




# # 현재 파일 기준 → 5단계 위로 올라감 (프로젝트 루트)
# ROOT_DIR = os.path.abspath(
#     os.path.join(os.path.dirname(__file__),"..", "..", "..") # os.path.dirname(__file__) → 그 파일이 들어 있는 폴더
# )
#
# # 루트 기준으로 경로 설정
# file_path = os.path.join(
#     ROOT_DIR, "public", "mockData", "typhoonList", f"typhoons_{year}.json"
# )
#
# # JSON 저장 (절대경로 사용)
# with open(file_path, "w", encoding="utf-8") as f:
#     json.dump(typhoon_list, f, ensure_ascii=False, indent=2)
#
# # 확인 출력
# print(json.dumps(typhoon_list, ensure_ascii=False, indent=2))
# print(f"저장됨: {file_path}")