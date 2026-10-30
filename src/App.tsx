import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarRange, Menu, ShieldCheck, WalletCards, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EstimateSection from './components/EstimateSection';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { defaultRentalSelection } from './consultation';

gsap.registerPlugin(ScrollTrigger);

const navigation = [
  { label: '장기렌트 장점', id: 'benefits' },
  { label: '차량 특징', id: 'highlights' },
  { label: '무료 견적', id: 'estimate' },
  { label: '고객 후기', id: 'reviews' },
  { label: '자주 묻는 질문', id: 'faq' },
];

const go = (id: string) => document.getElementById(id)?.scrollIntoView({
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  block: 'start',
});

export default function App() {
  const root = useRef<HTMLElement>(null);
  const benefitsRoot = useRef<HTMLElement>(null);
  const highlightsRoot = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [rentalSelection, setRentalSelection] = useState(defaultRentalSelection);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 30);
    check(); window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!root.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .fromTo('.eyebrow', {opacity:0,y:24}, {opacity:1,y:0,duration:.65}, .08)
        .fromTo('.headline-line > span', {yPercent:115}, {yPercent:0,duration:1.08,stagger:.18,ease:'power4.out'}, .21)
        .fromTo('.lead', {opacity:0,y:30}, {opacity:1,y:0,duration:.78}, .83)
        .fromTo('.actions', {opacity:0,y:26}, {opacity:1,y:0,duration:.75}, 1.04)
        .fromTo('.car-image', {opacity:.78,x:88,scale:.94}, {opacity:1,x:0,scale:1,duration:1.65,ease:'power3.out'}, .18);

      // Scrolling adds subtle depth without changing the original vehicle asset.
      // Mobile keeps the static composition to avoid clipped cars and heavy motion.
      if (window.innerWidth > 640) {
        gsap.to('.car-wrap', {
          scale: 1.055,
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: .65, invalidateOnRefresh: true },
        });
        gsap.to('.copy', {
          y: -36,
          opacity: .58,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: .65 },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!benefitsRoot.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.benefits-heading > *',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: .85, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.benefits-heading', start: 'top 84%', once: true } });
      gsap.fromTo('.benefit-card',
        { opacity: 0, y: 65 },
        { opacity: 1, y: 0, duration: 1, stagger: .13, ease: 'power3.out', scrollTrigger: { trigger: '.benefit-cards', start: 'top 83%', once: true } });
      gsap.fromTo('.benefits-footer',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.benefits-footer', start: 'top 90%', once: true } });
    }, benefitsRoot);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!highlightsRoot.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.highlights-intro > *',
        { opacity: 0, y: 38 },
        { opacity: 1, y: 0, duration: .85, stagger: .13, ease: 'power3.out', scrollTrigger: { trigger: '.highlights-intro', start: 'top 83%', once: true } });
      gsap.fromTo('.highlight-exterior-caption > *',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: .8, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.highlight-exterior', start: 'top 74%', once: true } });
      gsap.fromTo('.highlight-gallery-item',
        { opacity: 0, y: 65 },
        { opacity: 1, y: 0, duration: 1, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.highlight-gallery', start: 'top 83%', once: true } });
      gsap.fromTo('.highlight-power-copy > *',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: .85, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.highlight-power', start: 'top 76%', once: true } });
      if (window.innerWidth > 900) {
        gsap.fromTo('.highlight-exterior-image',
          { scale: 1.07 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: '.highlight-exterior', start: 'top bottom', end: 'bottom top', scrub: .6 } });
      }
    }, highlightsRoot);
    return () => ctx.revert();
  }, []);

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">본문으로 바로가기</a>
    <header className={`site-header ${scrolled || menuOpen ? 'is-scrolled':''}`}>
      <div className="header-inner">
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)} aria-label="그랑 콜레오스 페이지 맨 위로">
          <span className="brand-small">RENAULT</span><span>GRAND KOLEOS</span>
        </a>
        <nav id="site-navigation" className={`nav ${menuOpen?'open':''}`} aria-label="사이트 메뉴">
          {navigation.map(item => <button key={item.id} type="button" onClick={() => {setMenuOpen(false);go(item.id);}}>{item.label}</button>)}
        </nav>
        <button type="button" className="header-cta" onClick={() => go('estimate')}>무료 견적 확인 <ArrowRight size={15}/></button>
        <button type="button" className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-controls="site-navigation" aria-label={menuOpen?'메뉴 닫기':'메뉴 열기'} aria-expanded={menuOpen}>{menuOpen?<X size={24}/>:<Menu size={24}/>}</button>
      </div>
    </header>
    <main id="main-content" tabIndex={-1}>
      <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
        <div className="architecture" aria-hidden="true"/><div className="light-halo" aria-hidden="true"/><div className="floor" aria-hidden="true"/>
        <div className="car-wrap"><img className="car-image" src="/assets/grand-koleos-satin-nocturne-blue.webp" width={1600} height={900} fetchPriority="high" decoding="async" alt="" /></div>
        <div className="shade" aria-hidden="true"/>
        <div className="hero-inner">
          <div className="copy">
            <div className="eyebrow"><span className="eyebrow-line"/> GRAND KOLEOS LONG-TERM RENTAL</div>
            <h1 className="headline" id="hero-title"><span className="headline-line"><span>매일의 여정을,</span></span><span className="headline-line heading-accent"><span>더 특별하게.</span></span></h1>
            <p className="lead">르노 그랑 콜레오스 장기렌트<br/>원하는 조건으로, 부담 없이 알아보세요.</p>
            <div className="actions"><button type="button" className="button primary" onClick={() => go('estimate')}>내 조건으로 무료 견적 <ArrowRight size={19}/></button></div>
          </div>
        </div>
      </section>
      <section className="benefits" id="benefits" ref={benefitsRoot} aria-labelledby="benefits-title">
        <div className="benefits-inner">
          <div className="benefits-heading">
            <div className="benefits-label"><span className="benefits-label-line"/> 02 / A SMARTER WAY TO DRIVE</div>
            <h2 id="benefits-title">그랑 콜레오스 장기렌트,<br/><span>비용과 조건을 쉽게 비교하세요.</span></h2>
            <p className="benefits-lead">보증금·선납금부터 예상 월 렌트료, 보험·세금까지<br/>내 예산에 맞는 장기렌트 조건을 확인해보세요.</p>
          </div>

          <div className="benefit-cards">
            <article className="benefit-card benefit-card-primary">
              <div className="benefit-topline"><span>01 / 초기 비용</span><WalletCards size={25} strokeWidth={1.3} aria-hidden="true"/></div>
              <div className="benefit-content"><span className="benefit-index" aria-hidden="true">01</span><h3>초기 비용,<br/>얼마나 필요할까요?</h3><p>보증금과 선납금 선택에 따라 처음 필요한 비용이 달라집니다. 내 자금 계획에 맞는 조건을 비교해보세요.</p></div>
              <span className="benefit-keyword">INITIAL PAYMENT OPTIONS</span>
            </article>
            <article className="benefit-card benefit-card-paper">
              <div className="benefit-topline"><span>02 / 월 렌트료</span><CalendarRange size={25} strokeWidth={1.3} aria-hidden="true"/></div>
              <div className="benefit-content"><span className="benefit-index" aria-hidden="true">02</span><h3>월 렌트료,<br/>얼마일까요?</h3><p>차량 트림과 계약기간, 연간 주행거리 등에 따라 월 렌트료가 달라집니다. 원하는 조건으로 예상 금액을 확인해보세요.</p></div>
              <span className="benefit-keyword">PERSONALIZED RENTAL PLAN</span>
            </article>
            <article className="benefit-card benefit-card-mist">
              <div className="benefit-topline"><span>03 / 보험·세금</span><ShieldCheck size={25} strokeWidth={1.3} aria-hidden="true"/></div>
              <div className="benefit-content"><span className="benefit-index" aria-hidden="true">03</span><h3>보험·세금,<br/>어디까지 포함될까요?</h3><p>보험료와 자동차세 등 월 렌트료에 포함되는 항목을 확인해보세요. 상품별 계약 조건에 따라 적용 범위는 달라질 수 있습니다.</p></div>
              <span className="benefit-keyword">ALL-IN-ONE CONSIDERATION</span>
            </article>
          </div>

          <div className="benefits-footer">
            <p>중요한 건 단순히 낮은 월 납입금보다,<br/><strong>나에게 맞는 조건을 찾는 것.</strong></p>
            <button type="button" className="benefits-link" onClick={() => go('estimate')}>내 조건으로 견적 알아보기 <ArrowRight size={19}/></button>
          </div>
          <p className="benefits-notice">※ 실제 보증금·선납금 가능 여부 및 보험·세금 포함 범위 등은 렌트사, 상품, 심사 결과와 계약조건에 따라 달라질 수 있습니다.</p>
        </div>
      </section>
      <section className="highlights" id="highlights" ref={highlightsRoot} aria-labelledby="highlights-title">
        <div className="highlights-inner">
          <div className="highlights-intro">
            <span className="highlights-kicker"><i aria-hidden="true"/> 03 / FORM, SPACE &amp; PERFORMANCE</span>
            <h2 id="highlights-title">디자인에 끌리고,<br/><span>주행에서 확신하다.</span></h2>
            <p>도로 위의 존재감부터 실내의 세심한 디테일까지.<br/>그랑 콜레오스가 제안하는 새로운 일상의 기준.</p>
          </div>

          <div className="highlight-exterior">
            <img className="highlight-exterior-image" src="/assets/grand_koleos_01.webp" alt="바다를 배경으로 서 있는 화이트 그랑 콜레오스의 전면과 측면" width={1280} height={720} loading="lazy" decoding="async" />
            <div className="highlight-exterior-caption">
              <span>01 / EXTERIOR DESIGN</span>
              <h3>멀리서도, 단번에.</h3>
              <p>균형 잡힌 SUV의 실루엣과 정교한 전면 디테일이 완성하는 선명한 존재감.</p>
            </div>
          </div>

          <div className="highlight-gallery" aria-label="그랑 콜레오스 디자인과 실내 디테일">
            <article className="highlight-gallery-item">
              <div className="highlight-gallery-photo"><img src="/assets/grand_koleos_03.webp" alt="그랑 콜레오스 휠 디자인과 측면 차체를 가까이서 촬영한 모습" width={1280} height={854} loading="lazy" decoding="async" /></div>
              <span className="highlight-gallery-number">01 / DETAIL</span>
              <h3>디테일에서 드러나는 완성도.</h3>
              <p>차체의 입체적인 선과 조화를 이루는 감각적인 휠 디자인.</p>
            </article>
            <article className="highlight-gallery-item">
              <div className="highlight-gallery-photo"><img src="/assets/grand_koleos_08.webp" alt="그랑 콜레오스의 앞좌석과 뒷좌석 실내 공간" width={1280} height={720} loading="lazy" decoding="async" /></div>
              <span className="highlight-gallery-number">02 / INTERIOR</span>
              <h3>머무는 시간까지 편안하게.</h3>
              <p>운전자와 동승자 모두를 고려한 여유로운 실내 구성.</p>
            </article>
            <article className="highlight-gallery-item">
              <div className="highlight-gallery-photo"><img src="/assets/grand_koleos_07.webp" alt="그랑 콜레오스 센터 콘솔의 기어 조작부와 드라이브 모드 선택 다이얼" width={1280} height={720} loading="lazy" decoding="async" /></div>
              <span className="highlight-gallery-number">03 / DRIVING CONTROL</span>
              <h3>손끝에 닿는 주행의 감각.</h3>
              <p>드라이브 모드 선택부까지 이어지는 직관적인 조작 경험.</p>
            </article>
          </div>

          <div className="highlight-power">
            <div className="highlight-power-copy">
              <span className="highlight-power-kicker">GASOLINE 2.0 TURBO</span>
              <h3>힘과 효율을,<br/>하나의 주행 경험으로.</h3>
              <p>그랑 콜레오스 가솔린 2.0 터보 엔진은 힘 있는 주행 성능과 일상의 효율을 함께 제공합니다.</p>
              <div className="highlight-power-metrics">
                <div><strong>211<em>ps</em></strong><span>엔진 최고출력</span></div>
                <div><strong>11.1<em>km/L</em></strong><span>복합연비 · 2WD 기준</span></div>
              </div>
            </div>
            <div className="highlight-power-image-wrap"><img src="/assets/grand_koleos_06.webp" alt="블루 조명이 있는 공간에 전시된 화이트 그랑 콜레오스" width={1280} height={854} loading="lazy" decoding="async" /></div>
          </div>
          <p className="highlights-notice">※ 르노코리아 그랑 콜레오스 가솔린 2.0 터보 기준 제원입니다. 최고출력은 211ps이며, 정부 공인 복합연비는 2WD 11.1km/L, 4WD 9.8km/L(19·20인치 타이어 기준)입니다. 실제 연비는 운행 조건에 따라 달라질 수 있으며, 사진에는 특정 트림 및 선택 사양이 포함될 수 있습니다.</p>
        </div>
      </section>
      <EstimateSection selection={rentalSelection} onChange={setRentalSelection} />
      <ReviewsSection />
      <ContactSection />
    </main>
    <Footer />
    <div className="mobile-sticky"><button type="button" onClick={() => go('estimate')}>무료 견적 확인 <ArrowRight size={18}/></button></div>
  </div>;
}
