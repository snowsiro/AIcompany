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
  `GLOBAL`, `US`, `CHINA`, `KOREA`, `JAPAN`, `EUROPE`, `ASIA`, `OCEANIA`, `MIDEAST`, `INDIA`. 여러 나라에 걸치면 `GLOBAL`. 호주·뉴질랜드는 `OCEANIA` (2026-10-29 제이미 결정)
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
| 독자 영향 | YOUR AI BILL IS ABOUT TO DROP |

`post.json`의 `cover.hook_types`에는 영문 키를 씁니다: number, claim, myth-flip, rivalry, quote, reader-impact.
독자 영향형은 "그래서 나한테 뭐가 바뀌지?"에 답하는 훅입니다. 그 영향이 원문 기사에 있을 때만 씁니다.
기사에 일반 독자에게 미치는 영향이 없으면 독자 영향 훅을 억지로 만들지 않습니다. 주주처럼 좁은 집단만을 위한 훅에도 이 라벨을 붙이지 않습니다. 대신 `hook_pick_reason`에 "No reader-impact hook:"으로 시작하는 이유를 씁니다 (2026-10-28 제이미 결정).

## 본문 슬라이드 (2 ~ n-1)

- 위: 작은 kicker `02 / 07 · THE MONEY`, 같은 줄 오른쪽에 커버와 같은 태그 pill (`US AI · POLICY`)
- 제목: Inter Tight 800, 76px, 최대 2줄. 제목 위에 accent 막대 (72 × 8px)
- 본문: Inter Tight 500, 44px, 줄 간격 1.36, 최대 45단어
- `**강조**` 표시는 accent 색으로. 슬라이드당 최대 2곳
- 인용 슬라이드: 인용문 위에 큰 accent 따옴표(Anton), 말한 사람 앞에 짧은 accent 선. 인용문 안에는 따옴표를 따로 넣지 않음
- 아래: `@ai.news.company` + 진행 점

### 장식 (템플릿이 자동으로 그림)

- 오른쪽 위 빈 공간에만: accent 빛 번짐, 점 격자, 외곽선만 있는 큰 장 번호(Anton)
- 글자를 가리지 않게 낮은 대비로만 그림. 글자 크기, 위치, 색은 장식 때문에 바꾸지 않음
- 안쪽 카드에는 사진이나 생성 이미지를 넣지 않음. 그래픽은 템플릿 코드(CSS, SVG)로만 그려 크레딧을 쓰지 않음

## 마지막 슬라이드 (팔로우 + 출처)

팔로워 증가가 목표라 마지막 장은 팔로우 유도가 중심이고, 출처는 작게 남깁니다 (2026-10-20 결정).

- kicker `07 / 07 · FOLLOW` + 태그 pill
- 제목 `Never miss a day of AI news.` (`AI news.`만 accent), 보조 문구 `Two stories a day, from around the world.`
- 팔로우 박스: `@ai.news.company` + accent `+ FOLLOW` 버튼 모양. 아래에 `Save for later`, `Share with a friend`
- 맨 아래(푸터 위): 작은 글씨로 출처. 매체명, "기사 제목" (날짜), 최대 3개. 캡션 끝에도 같은 출처를 적음

## 주간 모음 (일요일, 2026-10-26)

`post.json`에 `"kind": "weekly"`가 있으면 템플릿이 아래처럼 그립니다. 색, 글꼴, 크기는 위 규칙 그대로입니다.

| 장 | 내용 |
| --- | --- |
| 1 커버 | 태그 `GLOBAL AI · WEEKLY`, 2줄 훅 (대표 이야기로 시작, 커버 규칙 그대로), 그 아래 muted 작은 줄 `+N more stories inside` (숫자만 accent). 이미지는 대표 이야기 글의 커버 재사용 (크레딧 0) |
| 2~8 항목 | 1장에 글 1개. kicker `02 / 09 · STORY 1`, 오른쪽 pill은 원래 글의 태그. 제목은 원래 글의 커버 제목, 본문은 원래 글 캡션의 첫 줄. 본문 아래 작은 출처 줄 (매체명, "기사 제목" (날짜), 최대 2개) |
| 마지막 | 팔로우 장 그대로. 출처 블록 대신 `Sources are on each card.` |

- 항목은 3~7개. 출처 줄도 넘침 검사 안에 있어서, 넘치면 렌더가 실패합니다.
- Reel 길이: 2.5 + 7 × 3.5 + 2.5 = 29.5초.

## Reel (2026-10-22)

`scripts/reel.mjs`가 렌더된 슬라이드로 1080×1920 영상을 만듭니다. 4:5 슬라이드를 가운데 두고 위아래는 ink 배경입니다.
커버 2.5초, 본문 3.5초, 마지막 장 2.5초, 무음입니다. 새 디자인이나 새 이미지는 없습니다. 캐러셀을 게시한 뒤 Trial Reel로 올립니다.
