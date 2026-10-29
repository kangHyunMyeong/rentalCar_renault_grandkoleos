import { useState } from 'react';
import { ChevronDown, CircleHelp } from 'lucide-react';
import '../contact.css';

const faqItems = [
  {
    question: '그랑 콜레오스 월 렌트료는 어떻게 정해지나요?',
    answer: '차량 트림, 계약기간, 연간 약정 주행거리, 보증금·선납금, 렌트사별 상품과 심사조건 등을 종합해 결정됩니다. 같은 차량이라도 선택 조건에 따라 금액이 달라지므로 실제 렌트료는 개별 견적으로 확인해야 합니다.',
  },
  {
    question: '보증금과 선납금은 어떤 차이가 있나요?',
    answer: '보증금은 계약 조건에 따라 만기 시 반환될 수 있는 예치금입니다. 선납금은 렌트료 일부를 미리 납부하는 금액으로 일반적으로 반환되지 않습니다. 월 납입금과 초기 비용에 미치는 영향도 다르므로 계약서를 확인해야 합니다.',
  },
  {
    question: '약정한 주행거리를 초과하면 어떻게 되나요?',
    answer: '주행거리 제한이 있는 상품에서는 계약 종료 시 초과 운행에 따른 정산 비용이 발생할 수 있습니다. 적용 기준과 km당 정산 금액은 상품마다 다르므로 계약 전 확인이 필요합니다.',
  },
  {
    question: '계약이 끝난 뒤 차량을 인수할 수도 있나요?',
    answer: '인수 가능 여부는 선택한 렌트 상품과 계약 조건에 따라 달라집니다. 인수 선택권과 만기 정산 조건을 원하신다면 계약 전 해당 사항을 확인하는 것이 좋습니다.',
  },
  {
    question: '견적 상담을 받을 때 어떤 조건을 확인하나요?',
    answer: '희망 트림과 색상, 계약기간, 연간 주행거리, 보증금·선납금 조건 등을 기준으로 렌트사 상품별 이용 가능 여부와 예상 납입 조건을 확인하게 됩니다. 실제 안내 범위는 상담 연결 및 상품 상황에 따라 달라질 수 있습니다.',
  },
];

export default function ContactSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return <section id="faq" className="contact-section" aria-label="그랑 콜레오스 장기렌트 자주 묻는 질문">
    <div className="contact-faq-wrap">
      <div className="contact-inner contact-faq-grid">
        <div className="contact-faq-title"><span className="contact-faq-kicker"><CircleHelp size={17} aria-hidden="true" /> FREQUENTLY ASKED QUESTIONS</span><h2>궁금하신 점,<br/><span>여기서 확인하세요.</span></h2><p>그랑 콜레오스 장기렌트를 알아볼 때 자주 궁금해하는 내용을 정리했습니다.</p></div>
        <div className="contact-faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return <div className={`contact-faq-item ${isOpen ? 'is-open' : ''}`} key={item.question}>
              <h3><button type="button" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} id={`faq-question-${index}`} onClick={() => setOpenFaq(isOpen ? null : index)}><span className="contact-faq-number">{String(index + 1).padStart(2, '0')}</span><span>{item.question}</span><ChevronDown size={21} aria-hidden="true" /></button></h3>
              <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={!isOpen}><p>{item.answer}</p></div>
            </div>;
          })}
        </div>
      </div>
    </div>
  </section>;
}
