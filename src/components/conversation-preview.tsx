"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const cards = [
  {
    category: "가볍게 시작하기",
    question: (
      <>
        요즘, 시간 가는 줄 모르고
        <br />
        빠져 있는 게 있나요?
      </>
    ),
    hint: "작은 취향 하나가 대화의 시작이 될 수 있어요.",
    tag: "취향의 발견",
  },
  {
    category: "조금 더 알아가기",
    question: (
      <>
        나만 알고 싶은
        <br />
        동네의 장소가 있나요?
      </>
    ),
    hint: "좋아하는 장소에는 그 사람만의 이야기가 있어요.",
    tag: "우리 동네 이야기",
  },
  {
    category: "마음 나누기",
    question: (
      <>
        최근에 나를 웃게 한<br />
        작은 순간은 무엇인가요?
      </>
    ),
    hint: "평범한 하루 속, 소중했던 순간을 나눠 보세요.",
    tag: "오늘의 마음",
  },
];

export function ConversationPreview() {
  const [selected, setSelected] = useState(0);
  const card = cards[selected];
  return (
    <div className="conversation-demo">
      <div className="topic-tabs" role="group" aria-label="대화 카드 주제">
        {cards.map((item, index) => (
          <button
            key={item.category}
            className={selected === index ? "active" : ""}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {item.category}
          </button>
        ))}
      </div>
      <div className="question-card" aria-live="polite" aria-atomic="true">
        <div className="question-top">
          <span>CONVERSATION CARD</span>
          <span>
            0{selected + 1} <span className="muted">/ 03</span>
          </span>
        </div>
        <span className="question-spark">
          <Sparkles size={34} strokeWidth={1.3} aria-hidden="true" />
        </span>
        <span className="question-tag">{card.tag}</span>
        <p className="question">{card.question}</p>
        <p className="question-hint">{card.hint}</p>
        <div className="question-bottom">
          <span>waruru.</span>
          <button
            onClick={() => setSelected((selected + 1) % cards.length)}
            aria-label="다음 대화 카드 보기"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="example-caption">
        와루루에서 나눌 수 있는 대화의 예시예요.
      </p>
    </div>
  );
}
