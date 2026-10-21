# Run log

Newest first. Format is in CLAUDE.md ("보고").

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
