# Run log

Newest first. Format is in CLAUDE.md ("보고").

## [사고] 2026-10-27 Genie 4 글이 인스타에 2번 올라감
처리 1건 · 실패 0건
결정할 일
1. 없음 (제이미가 중복 1개 삭제, 재발 방지 수정 승인)
자세한 기록
- 21:36쯤 제이미가 Genie 4를 앱으로 직접 올림
- 1분쯤 뒤 기록용 실행 47(post=Genie 4)이 그 글을 찾지 못하고 새로 게시함
  - 차단 응답 2207051 뒤 확인해서 봇이 올린 글(https://www.instagram.com/p/DfAu87SH2a9/)을 기록함
  - 스레드와 릴스는 이 기록에 붙음
- 제이미가 앱에 올린 글을 지워 1개만 남김
- 원인 후보 (확정 못 함)
  1. 올리자마자 1분 안에 실행해서 인스타 목록에 아직 안 보였을 수 있음
  2. 첫 줄의 "DeepMind's" 따옴표가 붙여넣으며 ’로 바뀌어 글자 비교에서 다르게 나왔을 수 있음. Terra 첫 줄에는 따옴표가 없었고, 그때는 찾음
- 수정 (scripts/ig.mjs, publish.yml)
  - 같은 글인지 볼 때 첫 줄의 따옴표·대시·말줄임·공백 모양과 대소문자 차이를 무시함
  - 기록만 하는 실행(record_only=true)을 추가함. 직접 올린 글을 못 찾으면 새로 올리지 않고 실패함
  - 직접 올린 글은 "올렸어" 뒤 2분쯤 기다렸다가 이 모드로 기록함
- 가짜 API로 시험
  - 새 경우 7개: ’ 붙은 첫 줄, 공백·대소문자 차이, 다른 첫 줄은 맞추지 않음, 기록 전용 실행이 글을 못 찾으면 아무것도 안 올림, 기록 전용 실행이 글을 찾으면 기록, 차단 응답 뒤 ’ 붙은 첫 줄 확인, 릴스의 ’ 첫 줄
  - 이전 경우 10개도 결과 같음

## [결정] 2026-10-27 Genie 4 당일 게시, 저녁 제작 슬롯 시험 승인
처리 1건 (Genie 4 ready) · 실패 0건
결정할 일
1. 없음
자세한 기록
- 13:57 슬롯: 한국 AI 모델 글(10/26에서 넘어옴)을 수동 실행으로 게시하고 기록함 (실행 42/43)
- 19:57 슬롯: Cohere 글 게시 (실행 45). 차단 응답(2207051)이 왔지만 글은 올라갔고, 봇이 확인한 뒤 바로 기록함
- 밀린 한 칸 정리: 제이미가 Terra 글을 앱으로 직접 게시. 실행 46이 그 글을 찾아 기록만 하고(재게시 없음) 스레드와 릴스를 붙임
- 앱으로 직접 올릴 때는 차단 창이 뜨지 않음. 차단은 봇(API) 게시에만 걸린 것으로 보임
- Genie 4 (Google DeepMind, 10/27 17:30 발표)를 그날 올리기로 결정 (제이미 승인, 오늘 4번째 글). 커버는 Higgsfield cinematic_studio_2_5 1장 2크레딧. 일일 한도 초과분이고(오늘 합계 8/6) 제이미가 승인함. 월 한도에는 포함
- Genie 4 검수
  - hook-judge 통과 7/10, brand-safety 통과
  - fact-checker 1차 불합격 2건
    - "our first"를 업계 최초처럼 씀 (브리프에서 생긴 오류)
    - "still early days"를 인용처럼 씀
  - 고친 뒤 2차 통과. 제이미가 앱으로 직접 올리고, 봇은 기록만 할 예정
- PRD ops/prd/2026-10-27-evening-slot.md 승인: 10/28~10/30 시험
  - 아침 루틴은 1개, 저녁 제작은 19:15, 게시는 13:57/20:57
  - 큰 뉴스가 없는 저녁은 아침 후보로 채움
  - 대형 발표는 제이미 승인을 받아 그날 하나 더 올리는 예외 유지
- 루틴 변경 (서브 계정 세션)
  - 아침 루틴 대행은 1개로
  - "저녁 제작 (시험, 금요일까지)" 신설
  - 게시 슬롯 백업은 13:57/20:57
  - 금요일 인수인계 알림은 21:30

## [아침 보고] 2026-10-27
처리 2건 (ready 1 · blocked 1) · 실패 0건
성과: 어제 도달 4 · 팔로워 0 (변화 수집 안 됨) · 링크 클릭 0 · 최고 도달 php-ai-flaws (108)
결정할 일
1. OpenAI GPT-6.1 Terra 글(blocked, 2026-10-27-openai-gpt-6-1-terra): 2회 검수 뒤에도 hook-judge 불합격 (1차 5/10, 2차 6/10 "HALF THE PRICE, AI RUNS APPS": 이름이 커버에 없음). fact-checker와 brand-safety는 2차에 통과. hook-judge는 후보 4번 "OPENAI'S TERRA / RUNS A COMPUTER"를 더 낫다고 봄. 그 후보로 바꿔 올릴지 결정 필요 (바꾸면 hook-judge 재검수 후 status를 ready로)
2. 인스타 토큰(IG_USER_ID, IG_ACCESS_TOKEN)이 이 세션에 없어 참고 계정은 morning-scan의 reference.json으로 대체
3. Cohere/Qwen 글(ready)은 TechCrunch 기사 1건 기반. hook-judge 7/10 (reader-impact 후보 라벨이 정직하지 않다는 지적, 선택된 훅 아님)
4. 이 세션의 playwright 브라우저 버전이 맞지 않아 CHROMIUM_PATH=/opt/pw-browsers/chromium 으로 렌더함
자세한 기록
- 05:45 morning-scan이 main에 없어 워크플로를 직접 실행, 약 1분 안에 생성됨. metrics도 함께 수집
- 후보 6~7개 수집 (참고 계정 10/10 성공). 주제 선정: OpenAI GPT-6.1 Terra (The Next Web), Cohere의 Qwen3.8 주장 (TechCrunch). 예비: posts/_backlog/2026-10-27-*.md 5건
- 커버 Higgsfield cinematic_studio_2_5 생성: 성공 2장 + 실패 1장 재시도 (최대 6 크레딧, 일일 한도 6)
- Terra 1차: fact-checker 불합격 ("독립 검증 안 됨" 문구가 기사와 다름), hook-judge 5/10 불합격 → 수정. 2차: hook-judge 불합격 → blocked
- Cohere: 3개 검수 모두 1차 통과

## [사고] 2026-10-26 스마트 TV 광고 글이 인스타에 6번 올라감
처리 0건 · 실패 6건
결정할 일
1. 인스타 앱에서 중복 5개 삭제: 프로필 맨 위 왼쪽(가장 최근) 1개만 남기기 (제이미, 앱에서 직접)
2. 수정을 main에 머지하면 다음 게시 실행이 남은 1개를 찾아 기록만 함 (새로 올리지 않음). 한국 AI 모델 글은 그다음 슬롯으로 밀림
자세한 기록
- 14:04~17:19 publish 6번 시도 (실행 33 ×3, 34, 35 ×2). 모두 "OAuthException 4: Application request limit reached"로 실패
- 글은 매번 올라갔지만 ig.mjs가 게시 직후 오류에서 기록 없이 실패 → 글이 계속 "ready"로 남음 → 실패한 실행을 다시 돌릴 때마다 또 게시됨
- Threads, Reel 단계는 실패 뒤라 건너뜀 → 중복 없음
- 수정 (scripts/ig.mjs, publish.yml): 게시 전 최근 게시물에서 같은 글을 찾으면 기록만 하고 끝냄 (확인이 실패하면 올리지 않음), 게시되면 바로 기록하고 permalink는 나중에 채움, Record result는 Publish가 실패해도 실행. 가짜 API로 6가지 경우 시험
- 원인 조사 (18:25 ig-check, 읽기 전용): 사용량 앱 3% · 인스타 계정 1%, 게시 한도 3/100. 15:19·15:20 시도는 41초 간격인데 둘 다 마지막 단계 직전까지 모든 호출 통과 → 호출량 문제 아님
- 계정 상태: 수익화 "충분한 인지도"만 경고 (새 계정에 흔함), 기능·추천 요건·콘텐츠 삭제는 정상 → 계정 제한도 아님
- 남은 후보: 게시(media_publish) 응답 또는 직후 확인 호출만 막힘. 세부 오류 코드를 버리고 있어 확정 못 함 → 이제 실패하면 호출, 세부 코드, 사용량 헤더를 남김 (토큰은 안 찍음)
- Reel도 올리기 전에 같은 Reel이 있는지 확인. 캐러셀과 Reel은 캡션이 같아서 서로 따로 확인
- 19:57 슬롯 건너뜀 (게시 없음, 중복 없음): 13:57 예약 실행은 6시간 늦게 와서 규칙대로 건너뜀. 19:58 수동 실행은 수정 커밋 제목("publish: ...")을 3시간 내 게시 기록으로 착각. 규칙이 제목이 "publish: posts/"(일요일 모음은 "weekly: posts/")인 실제 기록만 세도록 수정
- 원인 확정 (10/27 14:15 실행 로그): media_publish가 code 4, subcode 2207051 "행동이 차단되었습니다"(인스타의 활동 제한)를 돌려주지만 글은 올라감. 호출량 한도가 아님 (사용량 1%). 이 응답 뒤 15초 기다렸다가 글이 올라갔으면 기록하고 정상 진행하도록 수정. 이 오류 뒤 글이 안 올라가는 날이 생기면 게시를 멈추고 제이미에게 보고

## [수정] 2026-10-26 한국 AI 모델 글 다시 살림
처리 1건 (ready 1) · 실패 0건
결정할 일
1. 없음
자세한 기록
- 10:57 제이미 선택: 카카오 설명 유지하고 19:57에 올리기
- check-article로 Korea Herald 원문 숫자 재확인 (전부 일치)
- fact-checker 기준 수정: CLAUDE.md가 요구하는 한 줄 기업 설명은 상식 수준이면 기사에 없어도 통과

## [아침 보고] 2026-10-26
처리 2건 (ready 1 · blocked 1) · 실패 0건
성과: 어제 도달 25 · 팔로워 0 (변화 수집 안 됨) · 링크 클릭 0 · 최고 도달 php-ai-flaws (108)
결정할 일
1. Korea 글(blocked, korea-chinese-ai-models): 2회 검수 후에도 fact-checker가 "Kakao, Korea's largest messenger company" 설명이 기사에 없다고 지적. CLAUDE.md는 낯선 기업 설명을 요구하므로, 설명을 빼고 올릴지 / 설명을 유지하고 예외로 올릴지 결정 필요 (다른 수치는 모두 일치)
2. 인스타 토큰(IG_USER_ID, IG_ACCESS_TOKEN)이 이 세션에 없어 참고 계정은 morning-scan의 reference.json으로 대체. 참고 계정 대부분이 광고성 영상 툴 게시물이라 주제 선정에 거의 쓰이지 않음
3. 두 글 모두 원문 기사가 10/20~10/21자라 24시간 기준을 벗어남 (스마트 TV 광고 건은 아직 화제, Korea Times가 10/25 재보도). 기사 날짜를 그대로 표기함
4. 이 세션의 playwright 브라우저 버전이 맞지 않아 CHROMIUM_PATH=/opt/pw-browsers/chromium 으로 렌더함
5. 스마트 TV 글 훅 7/10: 숫자·이름이 커버에 없음 (hook-judge 지적, 통과)
자세한 기록
- 05:45 morning-scan이 main에 없어 워크플로를 직접 실행, 약 1분 안에 생성됨. metrics도 함께 수집
- 후보 11개 수집 (researcher), 반복 없음. Reuters, Nikkei 원문 2건은 읽을 수 없어 제외
- 주제 선정: claude-code-tv-ads(Decrypt, GLOBAL·TOOLS, 점수 11), korea-chinese-ai-models(Korea Herald, KOREA·RESEARCH, 점수 8)
- 예비 주제 4개를 posts/_backlog/에 저장 (유럽 Mistral·DeepL, 중국 AI 수출 등록, 미국 재무부 해외투자 규칙, Nvidia 소프트웨어 구독)
- claude-code-tv-ads: 1차 fact·hook·brand 모두 통과 → ready
- korea-chinese-ai-models: 1차 fact 불합격(기간 "two years", "open" 표현) → 수정 → 2차 fact 불합격(Kakao 설명), hook 7/10·brand 통과 → 규칙대로 blocked
- 커버 2장 Higgsfield cinematic_studio_2_5로 생성 (4 크레딧; 오늘 합계 4/6)
- 게시 대상: claude-code-tv-ads만

## [수정] 2026-10-25 영국 바이오보안 글 다시 살림
처리 1건 (ready 1) · 실패 0건
결정할 일
1. 없음
자세한 기록
- 16:50 제이미 선택: 영국 글 고쳐서 19:57에 올리기
- 슬라이드 1, threads 캡션의 달러 금액에 "Der Standard 환율 기준" 표기
- Der Standard는 게시 시각이 없지만 토요일(10/24) 발표 기사임을 check-article로 확인, 날짜는 "Oct 2026" 유지
- 크레딧 추가 사용 없음

## [아침 보고] 2026-10-25
처리 2건 (ready 1 · blocked 1) · 실패 0건
성과: 어제 도달 13 · 팔로워 0 (변화 수집 안 됨) · 링크 클릭 0 · 최고 도달 php-ai-flaws (108)
결정할 일
1. UK 바이오보안 연구소 글(blocked): 2회 검수 후에도 fact-checker가 달러 환산 표기("Der Standard 환율 기준")와 Der Standard 날짜 미확인을 지적. 환산을 빼고 파운드만 쓸지, 지금 표기로 올릴지 결정 필요
2. 인스타 토큰(IG_USER_ID, IG_ACCESS_TOKEN)이 이 세션에 없어 참고 계정은 morning-scan의 reference.json으로 대체
3. 커버 이미지 2장은 Higgsfield로 생성해 cover.png로 저장하고 실제 이미지로 렌더함
자세한 기록
- 05:45 morning-scan이 main에 없어 워크플로를 직접 실행, 약 1분 안에 생성됨. metrics도 함께 수집
- 후보 8개 수집 (researcher). 선정: kimi-k3-1-pro(VentureBeat), uk-ai-biosecurity-lab(The Next Web, Der Standard). Grok/GPT 정치 편향 건은 민감해서 제외
- 예비 주제 3개를 posts/_backlog/에 저장 (SK 5GW 데이터센터, DeepSeek·MiniMax 수출 등록, Block Dessa)
- kimi-k3-1-pro: 1차 fact/hook 불합격 (DeepSeek 가격 방향, 벤치마크 출처, 훅 6/10) → 수정 후 2차 3명 모두 통과 → ready
- uk-ai-biosecurity-lab: 1차 3명 불합격 → 2차 hook·brand 통과, fact 불합격 → 규칙대로 blocked
- 카테고리 MODELS는 lint 목록에 없어 Kimi 글은 TOOLS 태그 사용
- 커버 2장 Higgsfield cinematic_studio_2_5로 생성 (4 크레딧; 오늘 합계 4/6)
- 게시 순서: kimi-k3-1-pro만 게시 대상

## [보충] 2026-10-24 루틴 대신 게시물 2개 준비
처리 2건 (ready 2) · 실패 0건
결정할 일
1. 아침 루틴이 이틀 연속 Claude 사용량 한도로 멈춤. 요금제나 루틴 부담 조정 필요할 수 있음
자세한 기록
- 05:45 루틴 시작 5분 만에 중단(USAGE_LIMIT_REACHED), PR 없음
- 09:00 제이미 선택: 지금 2개 만들기
- openai-offline-training(OpenAI 블로그, TechCrunch), korea-ai-washing(Korea Times/Yonhap): check-article로 원문 문구 확인
- Meta 약관 연기(유럽)는 The Verge, heise를 읽을 수 없어 제외
- 커버 3장 Higgsfield 6크레딧 (Meta 커버 1장은 주제 교체로 미사용, 오늘 합계 6/6)
- 게시(폴더 이름 순): 13:57 한국 AI 워싱, 19:57 OpenAI

## [보충] 2026-10-23 빠진 게시물 2개 준비
처리 2건 (ready 2) · 실패 0건
결정할 일
1. 없음
자세한 기록
- 05:45 루틴이 브리프 2개까지만 만들고 멈춤(03:51 UTC), PR 없음. 아침 검토도 API 오류로 끊김
- 22:04 제이미 요청: 오늘 못 올린 것 다 준비
- china-nvidia-35b(TNW, AI타임스), korea-ai-glasses(ZDNet Korea, 머니투데이): check-article로 원문 문구 확인
- 커버 2장 Higgsfield 4크레딧 (오늘 합계 4/6)
- 게시: 10-24 13:57 중국 Nvidia, 19:57 한국 AI 안경

## [수정] 2026-10-22 PHP 보안 글 다시 살림
처리 1건 (ready 1) · 실패 0건
결정할 일
1. 없음
자세한 기록
- 09:10 제이미 요청: blocked PHP 글 고치기
- 슬라이드 6 제목 "no breaches" → "damage unclear", OpenAI 발언은 기사대로 "researchers found them before hackers"만
- 슬라이드 2와 캡션에 일부 중단은 예방 조치였다는 점 추가 (AI타임스)
- check-article로 TechCrunch, AI타임스 원문 문구 확인. 크레딧 추가 사용 없음
- 게시 순서: 13:57 Claude Duet, 19:57 PHP

## [아침 보고] 2026-10-22
처리 2건 (ready 1 · blocked 1) · 실패 0건
성과: 어제 도달 2 · 팔로워 0 · 링크 클릭 0 · 최고 도달 spacex-ai-revenue reel (1)
결정할 일
1. `2026-10-22-php-ai-flaws` blocked: 팩트체크 2회 불합격. 남은 수정: 슬라이드 5 제목 "no breaches"→"no confirmed exploits"로, "OpenAI says no exploits in the wild" 귀속을 기사대로(TechCrunch의 "no reports of exploits in the wild" / AI타임스는 CISA) 고치기. 선택: 독일·핀란드 중단이 예방 조치였다는 점, 70%는 서버 언어가 확인된 사이트 기준이라는 단서. 훅(7/10)·브랜드 안전은 통과. 커버 이미지 생성 완료
2. 인스타 API 미설정이 아님: 참고 계정은 GitHub Actions 스캔(ops/scan/2026-10-22)으로 확인함. 스캔이 05:07에 안 돌아 morning-scan을 수동 실행했고 폴더 확인됨
3. 카테고리: 브리프의 SECURITY/PRODUCT는 lint 허용 목록에 없어 INDUSTRY/TOOLS 사용. SECURITY를 쓰려면 scripts/lint.mjs 수정 필요
4. 브랜치: 지정된 `claude/stoic-rubin-o3q7as`에 푸시 (플레이북의 daily/2026-10-22 대신)
5. 예비 주제 2건 추가: 한국 공정위 AI washing 규칙, Photon Bridge €10M
자세한 기록
- 후보 9개 수집 (403: Verge, Ars, OpenAI, Yonhap, Politico Europe; 구글뉴스 리다이렉트는 읽지 못함)
- 주제 선정: PHP 취약점(유럽), Claude Duet(미국)
- Higgsfield cinematic_studio_2_5로 커버 2장 (4 크레딧; 오늘 합계 4/6)
- claude-duet: 1차 팩트(출처 표기) 불합격 → 캡션 수정 → 3개 모두 통과, ready
- php-ai-flaws: 1차 팩트·훅 불합격 → 수정 → 2차 팩트 불합격 → blocked

## [수정] 2026-10-21 SpaceX 글 다시 살림
처리 1건 (ready 1) · 실패 0건
결정할 일
1. 없음
자세한 기록
- 07:31 제이미 요청: blocked 글을 고치고, 한도를 넘겨서라도 빠진 커버를 생성
- `2026-10-21-spacex-ai-revenue`: 2차 팩트체크 지적 4곳 수정 (Musk 예측 주체, 캡션 오타, 비트코인 문구, heavy-lift 삭제)
- 원문 대조: check-article 워크플로로 TechCrunch 원문의 숫자와 이름을 전부 확인 (WebFetch 요약은 버전이 달라 신뢰 못 함)
- 커버: Higgsfield cinematic_studio_2_5 1장, 2 크레딧. 일일 한도 초과분(오늘 합계 8/6), 제이미 승인. 월 한도에는 포함
- 게시 순서: 13:57 DeepSeek 게시 확인 후 머지 → 19:57에 SpaceX

## [아침 보고] 2026-10-21 (2차 실행)
처리 2건 (ready 0 · blocked 2) · 실패 0건
결정할 일
1. 같은 날 두 번째 실행. 오전 1차 실행(daily/2026-10-21)의 deepseek/kyobo와 겹치지 않는 주제로 새로 2건 작성. 둘 다 2회 검수 후 blocked
2. `2026-10-21-spacex-ai-revenue` blocked: 팩트체크 2회 불합격. 남은 수정: 슬라이드 6·캡션의 머스크 예측 주체를 기사 문구대로 "SpaceX's annual recurring revenue"로 (AI 부문으로 좁히지 말 것), 캡션 오타 "will hit of", 슬라이드 2 "Bitcoin gains"→"recovery of Bitcoin prices", 슬라이드 4 "heavy-lift" 확인 또는 삭제. 훅·브랜드 안전은 통과. "52% of income"은 기사 표현 그대로이며 기사 수치(7.5/14.6=51%)와 정확히 맞지 않음
3. `2026-10-21-anthropic-safety-bill` blocked: 훅 심사 2회 불합격(1차 "A LAB DRAFTS ITS OWN BRAKE" 5점, 2차 "50+ DEATHS. $1B." 6점이라 이미 일어난 일처럼 읽힘), 2차 팩트체크도 불합격(슬라이드 1 "hopes Congress will consider it"는 기사상 "might consider", 캡션 "drafted the rules" 과장). 제안: 커버를 "ANTHROPIC DRAFTS A BRAKE / FOR **50+ DEATH** RISKS"처럼 주체를 넣고 임계값으로 표현. 커버 이미지는 이미 생성됨
4. 커버 이미지: anthropic 1장만 생성 (일일 한도 6 중 1차 4 + 2차 2 = 6 소진). spacex는 이미지 없이 대체 배경 → 게시 전 "cover image needed"
5. 인스타 API 미설정 → 참고 계정 확인 못 함, TechCrunch 기사만으로 후보 8개 수집 (ops/scan/2026-10-21 없음, 유럽·한국 후보 없음)
6. 팩트체크 도구가 기사 전문이 아닌 요약만 가져옴 → 게시 전 두 기사 직접 확인 권장
7. 카테고리: MONEY 대신 ECONOMY 사용 (lint 허용 목록). 템플릿 대체 배경의 파란 빛이 DESIGN.md 팔레트에 없음 (브랜드 검수 메모)
자세한 기록
- 후보 8개 수집 (TechCrunch 8건 직접 확인, Verge 접속 실패)
- 주제 선정: Anthropic 연방 AI 안전법 초안, SpaceX AI 부문 실적. 예비 4건 posts/_backlog/ 추가
- Higgsfield cinematic_studio_2_5로 커버 1장 (2 크레딧; 오늘 합계 6/6)
- anthropic: 1차 훅 불합격 → 수정 → 2차 훅·팩트 불합격 → blocked
- spacex: 1차 팩트 불합격 → 수정 → 2차 팩트 불합격 → blocked

## [아침 보고] 2026-10-21
처리 2건 (ready 1 · blocked 1) · 실패 0건
결정할 일
1. 인스타 API 미설정(IG_USER_ID/IG_ACCESS_TOKEN 없음) → 참고 계정 확인 못 함, 뉴스 소스만으로 주제 선정
2. `2026-10-21-kyobo-ai-book-order` blocked: 팩트체크 2회 불합격. 남은 수정은 3건 (review-fact-checker.md 참고): "urge the government and National Assembly", 슬라이드 3 "verifying the intended use of bulk orders is standard practice", 슬라이드 2 "contract barred further disclosure". 고치고 재검수하면 게시 가능
3. kyobo 카테고리를 COPYRIGHT 대신 POLICY로 씀 (lint 허용 목록에 COPYRIGHT 없음)
4. 팩트체크 도구가 기사 전문이 아닌 요약만 가져옴. 게시 전 deepseek 기사를 한 번 직접 확인 권장
자세한 기록
- 후보 8개 수집 (TechCrunch, VentureBeat, Anthropic, Korea Times, Korea Herald 성공 / Verge, Reuters, Ars, Yonhap, JoongAng 접속 실패, OpenAI 403)
- 주제 선정: US DeepSeek 제거 명령, Kyobo 10만 권 주문 거절. 예비 5건은 posts/_backlog/
- Higgsfield cinematic_studio_2_5로 커버 2장 (4 크레딧, 일일 한도 6)
- us-deepseek-ban: 1차 팩트체크 불합격(DHS 표현) → 수정 → 2차 3개 모두 통과, 캡션에 기사 제목 추가, ready
- kyobo-ai-book-order: 1, 2차 팩트체크 불합격 → blocked. 훅/브랜드 안전은 통과

## [아침 보고] 2026-10-20 (setup)
처리 3건 (샘플) · 실패 0건
결정할 일
1. 샘플 3개 디자인·문구 확인
2. 인스타 API 연결 (Meta 개발자 앱)
자세한 기록
- 커버 이미지 3장 Higgsfield cinematic_studio_2_5로 생성 (6 크레딧)
- 이 클라우드 세션은 Higgsfield 이미지 CDN에 접속할 수 없어 로컬 렌더는 대체 배경 사용. 실제 이미지는 GitHub Actions 렌더에서 반영
