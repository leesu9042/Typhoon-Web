# 1. 프로젝트 소개 (Introduction)


프로젝트 이름 : 태풍 데이터 3D 시각화 웹


2주간 일경험 인턴을 하며 본부장님께서 요구하신 기능들이 들어가있는 프로젝트

※ 연결 도메인 URL
http://typhoon.ctrl-f.co.kr/


### 실제 화면
<img width="1919" height="880" alt="image" src="https://github.com/user-attachments/assets/14638a7e-299b-4a52-8abd-ace41689f6f3" />




# 2. 주요 기능 (Features)

## 2-1. 태풍 데이터 선택 및 시각화
<img width="1321" height="823" alt="image" src="https://github.com/user-attachments/assets/294e5a9f-64c1-4b8f-80e8-192a064b0d1e" />

원하는 태풍과 시퀀스 (태풍에 대해 기상청이 발표한 차례 번호)를 선택하면
해당 태풍 데이터의 경로, 예측경로 , 강풍 반경 , 폭풍반경 등의 데이터가 시각화 된다.

시퀀스란? 
typ = 9 + seq = 3
→ “2011년 9호 태풍의 3번째 발표 내용”

## 2-2. 정보 팝업창 , 범례 팝업창
<img width="1424" height="817" alt="image" src="https://github.com/user-attachments/assets/7a05e063-99b5-4555-86de-daacbc3e06c5" />
<img width="924" height="692" alt="image" src="https://github.com/user-attachments/assets/05d6d593-6859-49b1-b6b4-08a36ae8195c" />

<p align="center">
  <sub><sup>회전하거나 확대/축소해도 팝업이 항상 사용자를 향하도록 유지되어, 3D 지구본 상에서도 일관되게 보임</sup></sub>
</p>
태풍 아이콘을 클릭하면 상세 정보를 표시하는 빌보드 형태의 팝업창을 제공합니다.



# 3. 기술 스택 (Tech Stack)

- 주요언어 : JavaScript , python
- 빌드도구 : Vite
- 라이브러리 <br>
Cesium.js - 3D 지구 시각화 및 지리공간 데이터 렌더링<br>
Turf.js - GeoJSON 데이터 조작 및 지리공간 연산<br>
Lit - 경량 웹 컴포넌트 라이브러리 (템플릿 렌더링)<br>

- API :
기상청 태풍 API - 실시간 태풍 관측/예측 데이터




# 4. 프로젝트 구조


```plaintext
src/
├── domain/typhoon/           # 태풍 관련 핵심 로직
│   ├── dropDown/             # UI 드롭다운 컴포넌트
│   ├── errorRadius/          # 태풍 예측 반경 처리
│   ├── infoPopup/            # 정보창 및 범례 팝업
│   ├── rad15/                # 강풍반경 시각화
│   ├── rad25/                # 폭풍반경 시각화
│   └── shared/               # 공통 유틸리티
│       ├── polygonUtils/     # GeoJSON 폴리곤 조작
│       ├── service/          # 데이터 관리 서비스
│       └── visualize/        # 시각화 렌더링
├── shared/                   # 공통 컴포넌트
│   ├── cesium/               # Cesium 초기화 및 설정
│   ├── components/           # 재사용 가능한 UI 컴포넌트
│   └── pythonFetch/          # 데이터 수집 스크립트
└── main.js                   # 애플리케이션 진입점
