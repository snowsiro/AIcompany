# Run log

Newest first. Format is in CLAUDE.md ("보고").

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
