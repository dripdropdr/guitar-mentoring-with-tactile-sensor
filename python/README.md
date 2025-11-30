# Python 센서 및 분류 모듈

이 폴더는 센서 입력 처리 및 코드 분류를 위한 Python 코드를 포함합니다.

## 구조 제안

```
python/
├── sensor/
│   ├── __init__.py
│   └── reader.py          # 센서 입력 읽기
├── ml/
│   ├── __init__.py
│   ├── classifier.py      # 코드 분류 모델
│   └── model.py           # ML 모델 로드/예측
├── api/
│   ├── __init__.py
│   └── server.py          # Flask/FastAPI 로컬 서버
└── requirements.txt        # Python 의존성
```

## 통신 방식

### 옵션 1: 로컬 HTTP 서버 (Flask/FastAPI)
- 프론트엔드에서 `http://localhost:5000` 또는 `http://localhost:8000`로 요청
- REST API 또는 WebSocket 사용

### 옵션 2: Electron 통합
- Electron을 사용한다면 Python을 child process로 실행
- IPC를 통해 통신

## 실행 방법

```bash
# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python api/server.py
```


