# Waruru · 와루루 사전등록

첨부된 Waruru 소스의 오프라인 만남 흐름과 보랏빛 한강 아트워크를 분석해 만든 독립적인 Next.js 웹사이트입니다. GitHub 저장소를 Vercel에 연결하여 배포할 수 있습니다.

이 `homepage` 폴더가 홈페이지 저장소의 최상위 디렉터리입니다. 아래 명령은 모두 이 폴더 안에서 실행합니다. 원본 앱·분석 자료·임시 캡처는 이 폴더에 포함하지 않았습니다.

## 로컬 실행

Node.js 24를 사용합니다.

```powershell
npm ci
npm run dev
```

http://127.0.0.1:3000 에서 확인합니다. 환경변수가 없어도 디자인을 볼 수 있습니다. 실제 저장 연결 전에는 신청을 성공으로 표시하지 않습니다.

```powershell
npm test
npm run build
npm run start
```

## 구성

- 반응형 한국어 랜딩, 원본 한강 일러스트, 자체 호스팅 Noto Sans KR
- 클릭 가능한 대화 카드 3종, 모바일 메뉴, FAQ, 개인정보 안내 페이지
- 국내 010 번호 검증, 동의 확인, 중복 클릭 방지, 로딩·오류·완료 상태
- 서버 전용 Supabase RPC: 중복 번호 한 번 저장, HMAC IP 기반 10분당 5회 제한, 동의 버전 기록
- RLS와 서버 키 분리, 공개 조회 API 없음, 자동 보유기간 정리용 SQL
- 실제 문자 발송 및 번호 소유자 인증은 별도로 연결해야 합니다. 이 구현은 출시 알림 신청 접수입니다.

## 실제 신청 접수 연결

1. 사용할 Supabase 프로젝트를 준비합니다. 원본 앱에 영향을 주지 않는 별도 프로젝트를 권장합니다.
2. SQL Editor에서 `supabase/waitlist.sql`을 실행합니다. Cron 확장과 `waruru-waitlist-retention` 작업이 활성화되었는지 확인합니다.
3. `.env.example`을 `.env.local`로 복사하고 Supabase URL, **서버용 service_role 키**, 32바이트 이상의 무작위 `RATE_LIMIT_SECRET`을 입력합니다. 키를 GitHub에 올리지 마세요.
4. `PRIVACY_OPERATOR`, `PRIVACY_CONTACT_EMAIL`에 실제 운영자와 연락처를 입력합니다. 수집 목적, 최대 1년 보유, 철회 처리 및 호스팅/데이터 처리 안내를 실제 운영방식에 맞게 검토합니다. Supabase 리전·수탁자 등 서비스 운영에 필요한 추가 고지 여부도 확정하세요. 현재 문구는 이 사이트를 위한 초안입니다.
5. `REGISTRATION_OPEN=true`로 설정하고 서버를 재시작합니다. 운영 전에는 테스트 번호를 사용하여 DB 저장·중복·실패 응답을 확인하고 테스트 행을 삭제합니다.
6. 출시 문자 발송 사업자 연결과 수신거부 처리, 번호 소유 확인이 필요하면 별도 구현합니다. 이 사이트는 문자를 자동 발송하지 않습니다.

번호 보관 기간은 최초 동의 시점 기준이며 반복 제출로 연장되지 않습니다. 동의 철회 요청은 운영자가 본인 확인 후 해당 행을 삭제해야 합니다. 기본 보호는 honeypot, 동일 출처 확인, 영속적인 IP 제한이며 공개 캠페인 규모에 맞게 Vercel Firewall/봇 방어를 추가 설정할 수 있습니다.

## GitHub → Vercel → 도메인

1. 이 `homepage` 폴더 안의 파일을 GitHub 저장소에 올립니다. `.env.local`, `.next/`, `node_modules/`는 `.gitignore`로 제외됩니다. 상위 `waruru` 폴더 전체를 올리지 않아도 됩니다.
2. Vercel의 **Add New → Project → Import Git Repository**에서 연결합니다.
3. Framework **Next.js**, Root Directory **.**, Node **24.x**, Build Command **npm run build**를 사용합니다. Output Directory는 기본값을 유지합니다.
4. Settings → Environment Variables에 `.env.example`의 값을 설정합니다. 실제 접수를 켜려면 Production 환경에도 같은 설정이 필요합니다. Preview에는 별도 테스트 DB를 사용하거나 `REGISTRATION_OPEN=false`로 유지하세요.
5. 최초 배포 후 Settings → Domains에 소유한 도메인을 추가합니다. 도메인 업체에서 **Vercel 화면에 표시되는 정확한 DNS 레코드**를 등록하고 검증 상태를 확인합니다. 고정 IP를 문서에서 복사하지 마세요.
6. `SITE_URL=https://실제도메인`으로 설정하고 재배포하면 canonical/검색 메타데이터에 사용됩니다. 미설정 상태에서는 검색 인덱싱을 비활성화합니다.
7. 실도메인에서 폼 제출, 휴대폰 레이아웃, 개인정보 링크, HTTPS와 DB 저장을 최종 확인합니다.

공식 문서: [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation), [Vercel 도메인 연결](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

실제 번호 접수는 위 환경변수와 데이터베이스 설정 후 활성화됩니다. 파일 정리만으로 GitHub 푸시, Vercel 배포, 도메인 DNS 변경이나 문자 발송이 실행되지는 않습니다.

## 폴더 구성과 이미지 출처

- `src/`: 홈페이지, 개인정보 안내, 사전등록 API와 스타일
- `public/images/`: 사용자가 제공한 Waruru.zip의 Expo 아트워크. 실제 사용자 사진·실제 매칭 장면을 뜻하지 않습니다.
- `supabase/`: 사전등록 저장과 보유기간 관리용 SQL
- `tests/`: 번호 검증과 API 처리 테스트
- `.github/workflows/`: GitHub에서 실행하는 테스트·빌드 확인
- `.env.example`: Vercel과 로컬 환경변수 설정 예시

디자인 분석 문서와 검증 캡처는 상위 작업 폴더에 보관하며, 홈페이지 빌드에는 필요하지 않습니다.
