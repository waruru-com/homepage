import Image from "next/image";

import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { Header } from "@/components/header";
import { ConversationPreview } from "@/components/conversation-preview";
import { RegistrationForm } from "@/components/registration-form";
import { isRegistrationReady } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

const faqs = [
  [
    "와루루는 어떤 서비스인가요?",
    "와루루는 가까운 곳에서 새로운 사람을 만나고, 대화와 추억을 통해 관계를 이어가는 오프라인 만남 서비스예요. 만남을 정하는 순간부터 대화 카드, 롤링페이퍼, 서로 원할 때 이어지는 친구 관계까지 하나의 경험으로 준비하고 있어요.",
  ],
  [
    "사전등록을 하면 무엇을 받나요?",
    "남겨주신 휴대폰 번호로 와루루 출시 소식을 안내해 드려요. 사전등록은 무료이며, 계정 생성이나 결제가 이루어지지 않아요. 별도의 확정된 보상이나 혜택은 아직 없어요.",
  ],
  [
    "언제, 어느 지역에서 이용할 수 있나요?",
    "정확한 출시 일정과 첫 서비스 지역은 준비 중이에요. 공개할 수 있는 시점에 사전등록하신 분들께 함께 안내해 드릴게요.",
  ],
  [
    "휴대폰 번호는 어떻게 사용되나요?",
    "와루루 출시 안내를 위한 연락처로만 사용해요. 동의일로부터 최대 1년간 보관하며, 그 전에도 개인정보 안내 페이지의 문의처로 삭제와 동의 철회를 요청할 수 있어요.",
  ],
  [
    "혼자 참여해도 괜찮을까요?",
    "그럼요. 새로운 만남이 낯선 사람도 편하게 시작할 수 있도록 준비하고 있어요. 첫 대화가 막막할 때에는 가벼운 질문이 담긴 대화 카드가 함께할 거예요.",
  ],
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art">
            <Image
              src="/images/river-welcome.webp"
              alt="서울의 보랏빛 노을과 강을 함께 바라보는 두 사람의 일러스트"
              fill
              priority
              sizes="(max-width: 700px) 100vw, 65vw"
              quality={88}
            />
          </div>
          <div className="hero-shade" />
          <div className="container hero-content">
            <div className="hero-copy">
              <span className="launch-badge">
                <span />
                우리의 첫 만남을 준비하고 있어요
              </span>
              <p className="hero-kicker">낯선 하루에, 다정한 우연 하나.</p>
              <h1 id="hero-title">
                오늘의 우연이,
                <br />
                내일의 <span className="hero-emphasis">우리</span>가
                <br className="desktop-break" /> 되는 곳
                <span className="heading-dot">.</span>
              </h1>
              <p className="hero-description">
                가까운 곳에서 만나, 조금씩 알아가는 사이.
                <br />
                당신의 일상에 새로운 이야기가 찾아와요.
              </p>
              <a
                className="button primary-button hero-button"
                href="#preregister"
              >
                우리의 첫 만남, 사전등록{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
              <p className="hero-note">가장 먼저, 와루루의 시작을 함께해요.</p>
            </div>
          </div>
          <div className="hero-postcard">
            <span className="postcard-icon">
              <MessageCircle size={19} aria-hidden="true" />
            </span>
            <div>
              <span>작은 질문으로 시작되는</span>
              <p>생각보다 잘 통하는 우리.</p>
            </div>
            <Sparkles size={19} className="postcard-spark" aria-hidden="true" />
          </div>
          <div className="hero-bottom container">
            <a href="#story">
              <span>SCROLL TO MEET</span>
              <ArrowDown size={15} aria-hidden="true" />
            </a>
            <span className="hero-location">
              <MapPin size={13} aria-hidden="true" />
              한강의 어느 저녁처럼
            </span>
          </div>
        </section>

        <section
          className="story-section section container"
          id="story"
          aria-labelledby="story-title"
        >
          <div className="section-heading">
            <p className="eyebrow">
              <span className="tiny-star">✦</span> A LITTLE CLOSER
            </p>
            <h2 id="story-title">
              스쳐 가는 인연보다,
              <br />
              <span className="text-lilac">함께할 수 있는 사이.</span>
            </h2>
            <p>
              화면 속 대화에서 한 걸음 더.
              <br className="mobile-only" /> 와루루는 함께 있는 순간을
              만들어가요.
            </p>
          </div>
          <div className="journey-grid">
            <article className="journey-item">
              <div className="journey-number">
                01 <span>MEET</span>
                <MapPin size={23} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3>가까운 곳에서 만나요</h3>
              <p>
                멀리 가지 않아도 괜찮아요.
                <br />
                우리의 일상 가까이에서 새로운 인연을 만나요.
              </p>
            </article>
            <article className="journey-item">
              <div className="journey-number">
                02 <span>TALK</span>
                <MessageCircle size={23} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3>우리의 속도로 알아가요</h3>
              <p>
                무슨 말을 할지 고민되는 순간,
                <br />
                대화 카드가 자연스러운 시작을 도와줘요.
              </p>
            </article>
            <article className="journey-item">
              <div className="journey-number">
                03 <span>REMEMBER</span>
                <Heart size={23} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <h3>좋았던 순간을 이어가요</h3>
              <p>
                롤링페이퍼에 오늘의 마음을 남기고,
                <br />
                서로 원한다면 다음 이야기를 시작해요.
              </p>
            </article>
          </div>
        </section>

        <section
          className="experience-section section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="container experience-grid">
            <div className="experience-copy">
              <p className="eyebrow">LESS AWKWARD, MORE US</p>
              <span className="section-symbol">
                <MessageCircle size={29} strokeWidth={1.2} aria-hidden="true" />
              </span>
              <h2 id="experience-title">
                첫마디는 가볍게.
                <br />
                <span className="text-lilac">대화는 어느새 깊게.</span>
              </h2>
              <p>
                처음이라 어색한 건 당연하니까.
                <br />
                취향을 묻는 작은 질문부터 <br />
                마음을 나누는 이야기까지 준비했어요.
              </p>
              <p className="experience-invitation">
                우리의 첫 질문을 골라볼까요?{" "}
                <ArrowDownRight size={20} aria-hidden="true" />
              </p>
            </div>
            <ConversationPreview />
          </div>
        </section>

        <section
          className="memory-section section container"
          aria-labelledby="memory-title"
        >
          <div className="memory-art">
            <div className="memory-image">
              <Image
                src="/images/river-night.webp"
                alt="따뜻한 불빛이 비치는 고요한 한강의 저녁 일러스트"
                fill
                sizes="(max-width: 700px) 90vw, 40vw"
                quality={85}
              />
            </div>
            <div className="memory-note">
              <div>
                <span>오늘의 롤링페이퍼</span>
                <Heart size={17} aria-hidden="true" />
              </div>
              <p>
                “처음 만났는데,
                <br />
                오래 알고 지낸 것 같았어요.
                <br />
                다음엔 그 카페, 같이 가요.”
              </p>
              <span className="memory-signature">
                만남이 남긴 작은 마음 · 예시
              </span>
            </div>
            <span className="memory-star">
              <Star size={44} strokeWidth={0.9} aria-hidden="true" />
            </span>
          </div>
          <div className="memory-copy">
            <p className="eyebrow">A MOMENT, A MEMORY</p>
            <h2 id="memory-title">
              만남이 끝나도,
              <br />
              <span className="text-rose">우리의 이야기는 남도록.</span>
            </h2>
            <p>
              헤어진 뒤에야 떠오른 다정한 말.
              <br />
              롤링페이퍼에 오늘의 마음을 담아보세요.
              <br />
              서로의 마음이 닿으면, 친구로 이어질 수 있어요.
            </p>
            <span className="small-feature">
              <Heart size={15} aria-hidden="true" />
              서로가 원할 때, 함께하는 다음.
            </span>
          </div>
        </section>

        <section
          className="registration-section section"
          id="preregister"
          aria-labelledby="signup-title"
        >
          <div className="container registration-grid">
            <div className="registration-copy">
              <span className="registration-spark">
                <Sparkles size={39} strokeWidth={1.2} aria-hidden="true" />
              </span>
              <p className="eyebrow">GOOD THINGS START WITH HELLO</p>
              <h2 id="signup-title">
                우리의 첫 만남,
                <br />
                <span className="text-rose">가장 먼저 알려드릴게요.</span>
              </h2>
              <p>
                매일 같던 하루에, 새로운 사람이 찾아오는 일.
                <br />
                와루루의 시작을 함께 기다려 주세요.
              </p>
              <div className="registration-note">
                <span className="status-dot" />
                사전등록은 무료예요
                <span className="note-separator" />
                출시 시 문자로 안내
              </div>
            </div>
            <RegistrationForm ready={isRegistrationReady(process.env)} />
          </div>
        </section>

        <section
          className="faq-section section container"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading">
            <p className="eyebrow">A FEW THINGS TO KNOW</p>
            <h2 id="faq-title">
              조금 더<br className="desktop-break" /> 궁금하다면.
            </h2>
            <span className="faq-decoration">
              <MessageCircle size={48} strokeWidth={0.8} aria-hidden="true" />
            </span>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  <span>{question}</span>
                  <Plus size={19} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing-line container">
          <Sparkles size={20} aria-hidden="true" />
          <p>작은 우연, 오래 남을 우리.</p>
          <a href="#preregister" className="text-link">
            와루루에서 만나요 <ArrowRight size={17} aria-hidden="true" />
          </a>
        </section>
      </main>
      <footer className="footer container">
        <a className="brand footer-brand" href="#">
          waruru<span className="brand-dot">.</span>
        </a>
        <p>© {new Date().getFullYear()} Waruru. All rights reserved.</p>
        <div>
          <span>일러스트는 서비스의 분위기를 담은 이미지입니다.</span>
          <a href="/privacy">
            개인정보 수집·이용 안내{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
