import { ArrowDownRight, ArrowUpRight, Clock3, MapPin, Menu, Sparkles } from "lucide-react";
import { salonSite } from "@/lib/site-config";

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Luma Studio home">luma<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#philosophy">Our philosophy</a>
          <a href="#services">Treatments</a>
          <a href="#studio">The studio</a>
        </nav>
        <a className="header-cta" href="#book">Book a moment <ArrowUpRight size={15} aria-hidden="true" /></a>
        <button className="mobile-menu" aria-label="Navigation menu" type="button" onClick={() => document.getElementById("mobile-navigation")?.classList.toggle("is-open")}><Menu size={21}/></button>
      </header>
      <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
        <a href="#philosophy">Our philosophy</a><a href="#services">Treatments</a><a href="#studio">The studio</a><a href="#book">Book a moment</a>
      </nav>

      <section id="home" className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> {salonSite.eyebrow}</p>
          <h1>Your moment.<br/><em>Your glow.</em></h1>
          <p className="hero-description">{salonSite.description}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#book">Find your ritual <ArrowUpRight size={16}/></a>
            <a className="text-link" href="#services">Explore treatments <ArrowDownRight size={16}/></a>
          </div>
          <div className="hero-note"><Sparkles size={15}/><span>Thoughtfully made for you, never one-size-fits-all.</span></div>
        </div>
        <div className="hero-visual" role="img" aria-label="Sunlit, warm-toned beauty studio interior">
          <div className="image-caption"><span>THE ART OF SLOWING DOWN</span><span>01 / 03</span></div>
          <div className="vertical-label">A LITTLE SPACE FOR YOURSELF</div>
        </div>
        <div className="hero-index"><span>RIYADH, SAUDI ARABIA</span><span>24° 42′ N — 46° 40′ E</span></div>
      </section>

      <section id="philosophy" className="philosophy section-wrap">
        <div className="section-kicker"><span>01</span><span>THE LUMA WAY</span></div>
        <div className="philosophy-main"><h2>Beauty isn’t a finish line.<br/><em>It’s how you feel.</em></h2><p>We believe the best kind of care starts with a conversation and ends with you feeling a little more like yourself. No rush. No rules. Just good people, considered details, and a ritual that’s yours.</p></div>
        <div className="values-grid">{salonSite.values.map((value) => <article className="value-item" key={value.number}><span className="value-number">{value.number}</span><h3>{value.title}</h3><p>{value.detail}</p></article>)}</div>
      </section>

      <section id="services" className="services-section">
        <div className="section-wrap">
          <div className="services-heading"><div><div className="section-kicker"><span>02</span><span>THE TREATMENT MENU</span></div><h2>Your time,<br/><em>well spent.</em></h2></div><p>A little something for where you are today. Every service is tailored to you, with room to ask, adjust, and make it your own.</p></div>
          <div className="service-list">{salonSite.services.map((service) => <article className="service-row" key={service.number}><span className="service-number">{service.number}</span><div className="service-info"><h3>{service.name}</h3><p>{service.detail}</p></div><span className="service-duration"><Clock3 size={14}/>{service.duration}</span><span className="service-price">{service.price}</span><a className="service-arrow" href="#book" aria-label={`Book ${service.name}`}><ArrowUpRight size={19}/></a></article>)}</div>
          <a className="all-services" href="#book">Let’s find your treatment <ArrowUpRight size={15}/></a>
        </div>
      </section>

      <section id="studio" className="studio-section section-wrap">
        <div className="studio-image" role="img" aria-label="Natural textures and quiet details inside the Luma Studio"></div>
        <div className="studio-copy"><div className="section-kicker"><span>03</span><span>COME AS YOU ARE</span></div><h2>A softer kind<br/>of <em>everyday.</em></h2><p>Come in for a change, stay for the feeling. We’ve created a space that feels less like an appointment and more like a deep breath in the middle of your day.</p><div className="studio-meta"><div><MapPin size={16}/><span>{salonSite.location}</span></div><div><Clock3 size={16}/><span>{salonSite.hours}</span></div></div><a className="text-link" href="#book">Find your way here <ArrowUpRight size={15}/></a></div>
      </section>

      <section id="book" className="booking-section"><div className="booking-orbit orbit-one"></div><div className="booking-orbit orbit-two"></div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Make a little<br/><em>room for you.</em></h2><p className="booking-description">A fresh start, a familiar ritual, or simply an hour to yourself. We’ll save you a seat.</p><a className="button button-light" href={`https://wa.me/${salonSite.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Let’s make it happen <ArrowUpRight size={16}/></a><span className="booking-footnote">NO PRESSURE. JUST GOOD CARE.</span></section>

      <footer className="site-footer"><a className="wordmark" href="#home">luma<span>.</span></a><p>Good care. Good energy. Always you.</p><div className="footer-links"><a href="#services">Treatments</a><a href="#studio">Visit us</a><a href="#book">Get in touch</a></div><span className="copyright">© 2026 LUMA STUDIO</span></footer>
    </main>
  );
}
