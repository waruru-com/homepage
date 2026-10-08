"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Menu, Sparkles, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
  }
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          close();
          toggle.current?.focus();
        }
      }}
    >
      <div className="nav-inner container">
        <a className="brand" href="#" aria-label="와루루 홈" onClick={close}>
          <Sparkles aria-hidden="true" size={24} />
          <span>
            waruru<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="주 메뉴">
          <a href="#story">와루루 소개</a>
          <a href="#experience">만남의 순간</a>
          <a href="#faq">자주 묻는 질문</a>
        </nav>
        <a className="button nav-cta" href="#preregister" onClick={close}>
          사전등록 <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="모바일 주 메뉴">
          <a href="#story" onClick={close}>
            와루루 소개
          </a>
          <a href="#experience" onClick={close}>
            만남의 순간
          </a>
          <a href="#faq" onClick={close}>
            자주 묻는 질문
          </a>
        </nav>
      )}
    </header>
  );
}
