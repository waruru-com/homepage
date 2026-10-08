
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "개인정보 수집·이용 안내 | 와루루",
  robots: { index: false, follow: false },
  alternates: { canonical: "/privacy" },
};
export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  const operator = process.env.PRIVACY_OPERATOR;
  const contact = process.env.PRIVACY_CONTACT_EMAIL;
  return (
    <main id="main" className="legal-page">
      <a className="brand" href="/">
        waruru<span className="brand-dot">.</span>
      </a>
      <p className="eyebrow">YOUR PRIVACY MATTERS</p>
      <h1>개인정보 수집·이용 안내</h1>
      {(!operator || !contact) && (
        <p className="legal-notice">
          사전등록 오픈을 준비 중입니다. 운영자와 문의처가 확정되기 전에는
          휴대폰 번호를 수집하지 않습니다.
        </p>
      )}
      <p>
        와루루는 사전등록 시 아래 내용을 안내하고 동의를 받은 후 출시 알림에
        필요한 정보를 수집합니다.
      </p>
      <table>
        <tbody>
          <tr>
            <th scope="row">운영자</th>
            <td>{operator || "사전등록 오픈 시 안내"}</td>
          </tr>
          <tr>
            <th scope="row">수집 항목</th>
            <td>휴대폰 번호, 동의 일시, 동의 문서 버전</td>
          </tr>
          <tr>
            <th scope="row">이용 목적</th>
            <td>와루루 사전등록 접수 및 서비스 출시 소식 안내</td>
          </tr>
          <tr>
            <th scope="row">보유 기간</th>
            <td>
              동의일로부터 최대 1년. 동의 철회 또는 삭제 요청 시 지체 없이
              삭제합니다.
            </td>
          </tr>
          <tr>
            <th scope="row">동의 거부</th>
            <td>
              동의를 거부할 수 있으며, 이 경우 사전등록 및 출시 알림을 신청할 수
              없습니다. 서비스 소개 페이지는 계속 볼 수 있습니다.
            </td>
          </tr>
          <tr>
            <th scope="row">문의·철회</th>
            <td>
              {contact ? (
                <a href={`mailto:${contact}`}>{contact}</a>
              ) : (
                "사전등록 오픈 시 안내"
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>연락처는 출시 안내에만 사용해요</h2>
      <p>
        이 신청은 회원가입, 결제 또는 휴대폰 본인 인증이 아닙니다. 등록 직후
        인증 문자를 보내지 않으며, 출시 안내 문자는 추후 발송합니다. 번호의
        소유자가 직접 신청해 주세요.
      </p>
      <h2>신청 정보를 보호해요</h2>
      <p>
        등록 정보는 서버에서 처리하며 다른 방문자에게 공개하지 않습니다. 반복
        신청을 제한하기 위해 IP 주소를 비밀키로 변환한 식별자를 일시 사용합니다.
        원본 IP 주소는 사전등록 데이터베이스에 저장하지 않으며, 변환된 식별자는
        최대 1일 후 삭제합니다.
      </p>
      <h2>언제든 마음을 바꿀 수 있어요</h2>
      <p>
        위 문의처로 신청한 번호와 함께 동의 철회 또는 삭제를 요청해 주세요.
        요청자를 확인하는 데 필요한 최소한의 절차를 거친 후 처리합니다.
      </p>
      <p>문서 버전: 2026-10-08.v1</p>
      <a href="/#preregister" className="text-link">
        ← 사전등록 페이지로 돌아가기
      </a>
    </main>
  );
}
