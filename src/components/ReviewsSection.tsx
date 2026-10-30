import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import '../reviews.css';

// Copy supplied as sample review drafts; do not represent as verified customer submissions.
const reviewCards = [
  {
    id: '01', name: '김*현', content: '처음 장기렌트를 알아보는 거라 걱정이 많았는데, 상담부터 계약까지 생각보다 간단했어요. 궁금한 것도 하나하나 자세히 설명해 주셔서 어렵지 않게 진행할 수 있었습니다. 그랑 콜레오스도 기대했던 만큼 마음에 드네요!',
  },
  {
    id: '02', name: '박*진', content: '여러 업체에서 견적을 받아보고 비교했는데 조건이 괜찮아서 결정했습니다. 무조건 계약을 권하기보다 필요한 부분을 꼼꼼하게 설명해 주셔서 좋았어요. 차량도 만족스럽고 잘 선택했다는 생각이 듭니다.',
  },
  {
    id: '03', name: '이*준', content: '그랑 콜레오스 디자인이 마음에 들어서 계속 알아보다가 장기렌트로 진행했어요. 실제로 받아보니 사진보다 훨씬 고급스럽고 실내도 마음에 듭니다. 특히 조용한 승차감이 가장 만족스러워요.',
  },
  {
    id: '04', name: '최*우', content: '차량이 빨리 필요한 상황이었는데 진행 상황을 계속 안내해 주셔서 안심할 수 있었어요. 계약 과정도 복잡하지 않았고 출고까지 신경 써주셔서 감사합니다. 새 차를 받아보니 기다린 보람이 있네요.',
  },
  {
    id: '05', name: '정*민', content: '쏘렌토와 싼타페까지 고민하다가 그랑 콜레오스를 선택했습니다. 직접 타보니 주행할 때 안정감이 좋고 실내 분위기도 세련됐어요. 하이브리드 특유의 조용한 느낌도 마음에 들어 만족스럽게 운행하고 있습니다.',
  },
  {
    id: '06', name: '강*호', content: '월 렌트료뿐 아니라 보증금과 계약 기간까지 비교해 볼 수 있어서 좋았습니다. 처음에는 조건이 복잡하게 느껴졌는데 설명을 듣고 나니 이해하기 쉬웠어요. 덕분에 제 상황에 맞춰 결정할 수 있었습니다.',
  },
  {
    id: '07', name: '윤*서', content: '가족이 함께 탈 SUV를 찾다가 그랑 콜레오스를 선택했어요. 디자인도 예쁘고 실내도 깔끔해서 가족들 반응이 좋네요. 장기렌트는 처음이지만 상담부터 차량 인수까지 편하게 진행했습니다.',
  },
  {
    id: '08', name: '조*훈', content: '다른 곳에서도 상담을 받아봤지만 여기서는 질문할 때마다 자세하게 답변해 주셔서 믿음이 갔습니다. 차량 옵션부터 계약 조건까지 꼼꼼하게 확인할 수 있었어요. 차도 기대 이상이라 만족합니다.',
  },
  {
    id: '09', name: '임*영', content: '그랑 콜레오스 하이브리드로 선택하길 잘한 것 같아요. 주행할 때 실내가 조용하고 차체도 안정적으로 느껴집니다. 순정 내비게이션으로 티맵을 사용할 수 있다는 점도 편리하네요.',
  },
  {
    id: '10', name: '한*석', content: '기존 차량을 바꾸면서 장기렌트와 할부를 함께 고민했는데 설명을 듣고 장기렌트로 결정했습니다. 보험이나 세금 부분을 포함해 비용을 비교하기 편했어요. 차량도 마음에 들어서 만족스럽습니다.',
  },
  {
    id: '11', name: '오*빈', content: '에스프리 알핀 디자인이 마음에 들어 선택했습니다. 실제로 보니 외관이 훨씬 멋있고 실내 마감도 고급스러운 느낌이에요. 상담할 때부터 세심하게 챙겨주셔서 기분 좋게 차량을 받았습니다.',
  },
  {
    id: '12', name: '서*준', content: '온라인으로 장기렌트 계약을 진행하는 게 처음이라 조금 불안했는데 생각보다 편했습니다. 필요한 서류와 진행 과정을 차근차근 안내받을 수 있었어요. 차량도 원하는 사양으로 잘 받아서 만족합니다.',
  },
  {
    id: '13', name: '신*아', content: '차량 색상과 옵션 때문에 고민을 많이 했는데 여러 가지 조건을 비교하면서 결정할 수 있었어요. 그랑 콜레오스는 실제로 보니 디자인이 정말 마음에 드네요. 주변에서도 차 예쁘다는 이야기를 많이 합니다.',
  },
  {
    id: '14', name: '배*성', content: '업무용으로 사용할 SUV를 알아보다가 그랑 콜레오스로 결정했습니다. 월마다 나가는 차량 비용을 예상하기 편하다는 점이 좋았어요. 상담도 친절했고 차량 인수까지 무리 없이 진행돼 만족스럽습니다.',
  },
  {
    id: '15', name: '홍*동', content: '처음에는 르노 차량이라 조금 고민했는데 직접 보고 선택하길 잘했다는 생각이 들어요. 디자인도 세련됐고 승차감도 기대 이상입니다. 장기렌트 계약 과정도 어렵지 않아서 다음에도 이용하고 싶네요.',
  },
];

function carouselMetrics(track: HTMLDivElement) {
  const card = track.querySelector<HTMLElement>('.reviews-card');
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = (card?.getBoundingClientRect().width ?? track.clientWidth) + gap;
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  return { step, maxIndex: Math.min(reviewCards.length - 1, Math.round(maxScroll / step)), maxScroll };
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(reviewCards.length - 1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const { step, maxIndex: last, maxScroll } = carouselMetrics(track);
      setMaxIndex(last);
      setActiveIndex(Math.min(last, Math.round(Math.min(track.scrollLeft, maxScroll) / step)));
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    const first = track.querySelector('.reviews-card');
    if (first) observer.observe(first);
    track.addEventListener('scroll', update, { passive: true });
    update();
    return () => { observer.disconnect(); track.removeEventListener('scroll', update); };
  }, []);

  const moveTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const { step, maxIndex: last, maxScroll } = carouselMetrics(track);
    const target = Math.max(0, Math.min(last, index));
    track.scrollTo({ left: Math.min(target * step, maxScroll), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setActiveIndex(target);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveTo(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.reviews-intro > *', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power3.out',
        scrollTrigger: { trigger: '.reviews-intro', start: 'top 82%', once: true },
      });
      gsap.fromTo('.reviews-carousel', { opacity: 0, y: 45 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.reviews-carousel', start: 'top 85%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return <section className="reviews-section" id="reviews" ref={sectionRef} aria-labelledby="reviews-title">
    <div className="reviews-inner">
      <header className="reviews-intro">
        <div className="reviews-kicker"><span aria-hidden="true" /> 05 / CUSTOMER REVIEWS</div>
        <div className="reviews-heading-layout">
          <h2 id="reviews-title">그랑 콜레오스 장기렌트,<br /><span>고객 후기를 확인해보세요.</span></h2>
          <p>상담부터 차량 인수까지,<br />그랑 콜레오스 장기렌트 이용 경험을 살펴보세요.</p>
        </div>
      </header>

      <div className="reviews-carousel">
        <div className="reviews-carousel-heading">
          <div className="reviews-carousel-context">
            <h3>그랑 콜레오스 장기렌트 후기</h3>
          </div>
          <div className="reviews-carousel-controls" aria-label="후기 카드 슬라이드 조작">
            <span className="reviews-carousel-count" aria-live="polite"><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(reviewCards.length).padStart(2, '0')}</span>
            <button type="button" className="reviews-arrow" onClick={() => moveTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="이전 카드"><ArrowLeft size={19} aria-hidden="true" /></button>
            <button type="button" className="reviews-arrow" onClick={() => moveTo(activeIndex + 1)} disabled={activeIndex >= maxIndex} aria-label="다음 카드"><ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>

        <div ref={trackRef} className="reviews-track" role="region" aria-roledescription="carousel" aria-label="고객 후기 카드 슬라이더" tabIndex={0} onKeyDown={handleKeyDown}>
          {reviewCards.map((card) => <article className="reviews-card" key={card.id} aria-label={`고객 후기 ${card.id}, ${card.name}`}>
            <div className="reviews-card-top"><span>GRAND KOLEOS</span><span>REVIEW / {card.id}</span></div>
            <div className="reviews-card-content">
              <span className="reviews-card-status">후기</span>
              <div className="reviews-card-rating" aria-label="별점 5점"><span className="reviews-card-stars" aria-hidden="true">★★★★★</span><span>5.0 / 5.0</span></div>
              <p className="reviews-card-quote">{card.content}</p>
            </div>
            <div className="reviews-card-bottom"><span className="reviews-card-avatar" aria-hidden="true">{card.name.charAt(0)}</span><div className="reviews-card-identity"><strong>{card.name}</strong></div><span className="reviews-card-id">{card.id}</span></div>
          </article>)}
        </div>
        <div className="reviews-progress" aria-hidden="true"><div style={{ width: `${(100 * (activeIndex + 1)) / (maxIndex + 1)}%` }} /></div>
      </div>

    </div>
  </section>;
}
