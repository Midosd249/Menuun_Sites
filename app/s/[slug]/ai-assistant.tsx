"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, X, Sparkles, LoaderCircle } from "lucide-react";
import styles from "./ai-assistant.module.css";

type Message = { role: "user" | "assistant"; content: string };

export default function SalonAiAssistant({ slug, language }: { slug: string; language: "ar" | "en" }) {
  const english = language === "en";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const text = {
    title: english ? "Ask the salon" : "اسأل مساعد الصالون",
    welcome: english ? "Hi! I can help with salon services, prices and booking steps." : "مرحبًا! أستطيع مساعدتك في معرفة الخدمات والأسعار وخطوات الحجز.",
    placeholder: english ? "Ask about services or booking…" : "اسأل عن الخدمات أو الحجز…",
    send: english ? "Send message" : "إرسال الرسالة",
    busy: english ? "Thinking…" : "جارٍ تجهيز الرد…",
    unavailable: english ? "I couldn't reply right now. Please try again or contact the salon directly." : "لم أتمكن من الرد الآن. حاول مجددًا أو تواصل مع الصالون مباشرة.",
    limit: english ? "Please keep each message under 700 characters." : "اجعل الرسالة أقصر من 700 حرف.",
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, busy, open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || busy) return;
    if (content.length > 700) {
      setMessages((old) => [...old, { role: "assistant", content: text.limit }]);
      return;
    }
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/public-salon-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, language, messages: next.slice(-8) }),
      });
      const payload = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !payload.answer) throw new Error(payload.error || "assistant_unavailable");
      setMessages((old) => [...old, { role: "assistant", content: payload.answer! }]);
    } catch {
      setMessages((old) => [...old, { role: "assistant", content: text.unavailable }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.root} dir={english ? "ltr" : "rtl"} lang={language}>
      {open && (
        <section className={styles.panel} aria-label={text.title} aria-live="polite">
          <header className={styles.header}>
            <span className={styles.avatar}><Sparkles size={18} aria-hidden="true" /></span>
            <span className={styles.heading}><strong>{text.title}</strong><small>Menuun AI</small></span>
            <button className={styles.close} type="button" onClick={() => setOpen(false)} aria-label={english ? "Close assistant" : "إغلاق المساعد"}><X size={19} /></button>
          </header>
          <div className={styles.messages} role="log" aria-relevant="additions text">
            {!messages.length && <p className={styles.welcome}>{text.welcome}</p>}
            {messages.map((message, index) => <p className={message.role === "user" ? styles.userMessage : styles.assistantMessage} key={index}>{message.content}</p>)}
            {busy && <p className={styles.assistantMessage}><LoaderCircle className={styles.spinner} size={16} /> {text.busy}</p>}
            <div ref={endRef} />
          </div>
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.srOnly} htmlFor={`salon-ai-input-${slug}`}>{text.placeholder}</label>
            <input id={`salon-ai-input-${slug}`} value={input} onChange={(event) => setInput(event.target.value)} maxLength={700} placeholder={text.placeholder} disabled={busy} autoComplete="off" />
            <button type="submit" disabled={busy || !input.trim()} aria-label={text.send}><Send size={18} /></button>
          </form>
          <p className={styles.disclaimer}>{english ? "AI answers may be incomplete. Confirm booking details with the salon." : "قد تكون إجابات الذكاء الاصطناعي غير مكتملة؛ أكّد تفاصيل الحجز مع الصالون."}</p>
        </section>
      )}
      <button className={styles.launcher} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? (english ? "Close AI assistant" : "إغلاق مساعد الذكاء الاصطناعي") : text.title}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span>{english ? "Ask us" : "اسألنا"}</span>}
      </button>
    </div>
  );
}
