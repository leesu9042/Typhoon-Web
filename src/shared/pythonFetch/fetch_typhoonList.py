import requests
import pandas as pd
from io import StringIO
import json
import os


#년도로 그 해 년도에 있었던 태풍 list 저장
year = 2023
authKey = "ZL-cptuMRPO_nKbbjFTzLA"
url = f"https://apihub.kma.go.kr/api/typ01/url/typ_lst.php?YY={year}&disp=1&help=1&authKey={authKey}"

res = requests.get(url)
res.encoding = 'euc-kr'

lines = res.text.splitlines()
data_lines = [line for line in lines if not line.startswith('#') and line.strip()]
csv_text = "\n".join(data_lines)

df = pd.read_csv(StringIO(csv_text), header=None)

print("컬럼 개수:", df.shape[1])
print(df.head(1))

col_names = [
    'YY', 'SEQ', 'NOW', 'EFF', 'TM_ST', 'TM_ED', 'TYP_NAME', 'TYP_EN', 'REM', 'EMPTY'
]
df.columns = col_names

# DataFrame을 dict로 변환(컬럼명 그대로 저장)
typhoon_list = df.to_dict(orient='records')

os.makedirs('public/typhoonList', exist_ok=True)

with open(f'../../public/typhoonList/typhoons_{year}.json', 'w', encoding='utf-8') as f:
    json.dump(typhoon_list, f, ensure_ascii=False, indent=2)
file_path = f'public/typhoonList/typhoons_{year}.json'

print(json.dumps(typhoon_list, ensure_ascii=False, indent=2))
print(f"저장됨: {os.path.abspath(file_path)}")
