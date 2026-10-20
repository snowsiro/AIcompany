# DESIGN.md — @ai.news.company 카드 디자인 규칙

이 파일의 값만 씁니다. 여기에 없는 색이나 글꼴을 새로 만들지 않습니다.
템플릿(`templates/card.html`)이 이 값을 그대로 구현합니다.

## 캔버스

- 1080 × 1350 px (인스타 4:5 세로)
- 바깥 여백 72px, 안전 영역 밖에는 글자를 두지 않음

## 색

| 이름 | 값 | 용도 |
| --- | --- | --- |
| ink | `#0A0A0C` | 배경 |
| paper | `#F5F5F0` | 본문 글자 |
| muted | `#9A9AA2` | 보조 글자, 출처 |
| accent | `#FFD23F` | 강조어 (커버 1단어, 본문 슬라이드당 최대 2곳) |
| line | `#2A2A30` | 구분선, 태그 테두리 |

강조색은 하나만 씁니다. 참고 계정들처럼 "한 단어만 색으로" 원칙입니다.

## 글꼴

- **Anton**: 커버 제목만. 대문자, 줄 간격 0.95
- **Inter Tight**: 그 외 전부. 제목 800, 본문 500, 태그 700

`assets/fonts/`에 포함돼 있어 어느 환경에서도 같은 결과가 나옵니다.

## 커버 (슬라이드 1)

참고 커버 16장 분석 결과(`/mnt/project-files/ai-office/reference-covers/`)를 따릅니다.

- 위 60%: 영화풍 이미지가 꽉 차게. 아래로 갈수록 ink로 어두워지는 그라데이션
- 아래 40%: 제목 2줄, Anton 대문자, 줄당 최대 16자. 강조어 1개는 accent
- 제목 위: 태그 `<REGION> AI · <CATEGORY>` (테두리 pill). REGION은 이야기의 중심 지역 하나:
  `GLOBAL`, `US`, `CHINA`, `KOREA`, `JAPAN`, `EUROPE`, `ASIA`, `MIDEAST`, `INDIA`. 여러 나라에 걸치면 `GLOBAL`
- 맨 아래 가운데: `@ai.news.company`
- 이미지 규칙: AI 생성 이미지만. 실존 인물, 실제 로고를 크게 넣지 않음. 이미지 안에 글자 없음
- 이미지가 없을 때는 템플릿의 그래픽 배경(그라데이션 + 격자)으로 대체

### 커버 문구 유형 (훅 후보는 이 중에서 만든다)

| 유형 | 예 |
| --- | --- |
| 숫자 | KOREA BETS $184M ON HOMEGROWN AI |
| 단언 | THIS CHANGES AI SEARCH |
| 통념 뒤집기 | BIGGER MODELS AREN'T WINNING |
| 대결 | SAMSUNG VS LG / OPENAI VS GOOGLE |
| 인용 | "10 YEARS" — IMF ON AI DATA CENTERS |

## 본문 슬라이드 (2 ~ n-1)

- 위: 작은 kicker `02 / 07 · THE MONEY`
- 제목: Inter Tight 800, 64px, 최대 2줄
- 본문: Inter Tight 500, 40px, 줄 간격 1.35, 최대 45단어
- `**강조**` 표시는 accent 색으로. 슬라이드당 최대 2곳
- 아래: `@ai.news.company` + 진행 점

## 마지막 슬라이드 (출처)

- 제목 `SOURCES`
- 매체명 · 날짜 · 기사 제목 (최대 3개)
- 아래: `Follow @ai.news.company for daily AI news`
