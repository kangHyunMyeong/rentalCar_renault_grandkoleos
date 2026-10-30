import { useState, type CSSProperties } from 'react';
import { ArrowRight, ChevronDown, Info } from 'lucide-react';
import {
  RENTAL_QUOTE_REFERENCE, resolveRentalQuote,
  type AnnualMileage, type PaymentPercent, type RentalTerm, type RentalTrim,
} from '../services/rentalQuote';
import type { RentalSelection } from '../consultation';
import ConsultationModal from './ConsultationModal';
import '../estimate.css';

type CarColor = { id: string; name: string; english: string; hex: string; image: string; glow: string };
const colors: CarColor[] = [
  { id: 'blue', name: '새틴 녹턴 블루', english: 'SATIN NOCTURNE BLUE', hex: '#274a76', image: '/assets/grand-koleos-satin-nocturne-blue.webp', glow: 'rgba(91,129,167,.21)' },
  { id: 'white', name: '새틴 유니버스 화이트', english: 'SATIN UNIVERSE WHITE', hex: '#dfdfd9', image: '/assets/새틴 유니버스 화이트.webp', glow: 'rgba(174,191,198,.23)' },
  { id: 'pearl', name: '클라우드 펄', english: 'CLOUD PEARL', hex: '#f4f3ed', image: '/assets/클라우드 펄.webp', glow: 'rgba(205,212,218,.25)' },
  { id: 'black', name: '메탈릭 블랙', english: 'METALLIC BLACK', hex: '#21272b', image: '/assets/메탈릭 블랙.webp', glow: 'rgba(132,144,158,.24)' },
  { id: 'gray', name: '어반 그레이', english: 'URBAN GREY', hex: '#828b8f', image: '/assets/어반 그레이.webp', glow: 'rgba(135,158,172,.23)' },
];
const trims: { id: RentalTrim; name: string }[] = [
  { id: 'techno', name: '테크노' }, { id: 'iconic', name: '아이코닉' },
  { id: 'iconic-4wd', name: '아이코닉 4WD' }, { id: 'esprit-alpine', name: '에스프리 알핀' },
];
const termOptions: RentalTerm[] = [36, 48, 60];
const mileageOptions: AnnualMileage[] = [10000, 20000, 30000, 'unlimited'];
const percentOptions: PaymentPercent[] = [0, 10, 20, 30];

type OptionGroupProps<T extends string | number> = {
  options: readonly T[]; value: T; onChange: (value: T) => void;
  label: (value: T) => string; name: string;
};
function OptionGroup<T extends string | number>({ options, value, onChange, label, name }: OptionGroupProps<T>) {
  return <div className="estimate-option-grid" role="group" aria-label={name}>
    {options.map(option => <button type="button" key={option} aria-pressed={option === value}
      className={`estimate-option ${option === value ? 'is-selected' : ''}`}
      onClick={() => onChange(option)}>{label(option)}</button>)}
  </div>;
}

type EstimateSectionProps = {
  selection: RentalSelection;
  onChange: (selection: RentalSelection) => void;
};

export default function EstimateSection({ selection, onChange }: EstimateSectionProps) {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const { colorId, trim, termMonths, annualMileageKm, depositPercent, prepaymentPercent } = selection;
  const quote = resolveRentalQuote({
    trim, exteriorColor: colorId, termMonths, annualMileageKm, depositPercent, prepaymentPercent,
  });
  const estimatedMonthly = quote.status === 'ready' ? quote.monthlyRentWon : null;

  const activeColor = colors.find(item => item.id === colorId) ?? colors[0];
  const mileageLabel = (value: AnnualMileage) => value === 'unlimited' ? '무제한' : `${(value / 10000).toFixed(0)}만 km`;
  const update = <K extends keyof RentalSelection>(key: K, value: RentalSelection[K]) => onChange({ ...selection, [key]: value });

  return <section className="estimate-section" id="estimate" aria-labelledby="estimate-title">
    <div className="estimate-inner">
      <header className="estimate-intro">
        <div className="estimate-kicker"><span aria-hidden="true"/> 04 / COLOR STUDIO &amp; ESTIMATE</div>
        <div className="estimate-intro-grid"><h2 id="estimate-title">그랑 콜레오스 장기렌트,<br/><span>예상 월 렌트료를 확인하세요.</span></h2><p>원하는 컬러와 트림을 선택하고,<br/>계약기간·주행거리·초기 비용에 따른 예상 견적을 확인하세요.</p></div>
      </header>

      <div className="estimate-workspace">
      <div className="color-studio" style={{ '--studio-glow': activeColor.glow } as CSSProperties}>
        <div className="studio-meta"><span>01 / COLOR STUDIO</span><span>EXPLORE YOUR COLOR</span></div>
        <div className="studio-display">
          <span className="studio-backdrop-label" aria-hidden="true">GRAND KOLEOS</span>
          <div className="studio-car-frame" aria-live="polite" aria-atomic="true">
            <img key={activeColor.id} src={activeColor.image} className="studio-car-image"
              alt={`${activeColor.name} 컬러의 그랑 콜레오스 외관`} width={1600} height={900} decoding="async"/>
          </div>
          <span className="studio-horizon" aria-hidden="true"/>
        </div>
        <div className="studio-selector">
          <div className="studio-color-title"><span>EXTERIOR COLOR <b>0{colors.findIndex(item => item.id === colorId) + 1} / 0{colors.length}</b></span><strong>{activeColor.name}</strong><small>{activeColor.english}</small></div>
          <div className="color-swatches" role="group" aria-label="외장 컬러 선택">
            {colors.map(item => <button type="button" key={item.id} aria-pressed={colorId === item.id}
              className={`color-swatch ${colorId === item.id ? 'is-active' : ''}`}
              onClick={() => update('colorId', item.id)} aria-label={`${item.name} 선택`} title={item.name}>
              <span style={{ backgroundColor: item.hex }}/>
            </button>)}
          </div>
        </div>
        <p className="studio-footnote"><Info size={14} aria-hidden="true"/> 제공된 차량 이미지 기준입니다. 컬러별 사진의 휠·그릴 등 세부 사양은 실제 선택 트림과 다를 수 있습니다.</p>
      </div>

      <div className="estimate-configurator" aria-labelledby="config-title">
        <div className="estimate-config-heading">
          <span>02 / PERSONALIZE YOUR RENTAL</span>
          <h3 id="config-title">렌트 조건 선택</h3>
          <div className="estimate-live-price" aria-live="polite" aria-atomic="true">
            <span>선택 조건 기준 예상 월 렌트료</span>
            {estimatedMonthly !== null ? <strong>{estimatedMonthly.toLocaleString('ko-KR')}<small>원 / 월</small></strong>
              : <strong className="estimate-live-unavailable">상담 후 안내</strong>}
          </div>
          <p className="estimate-price-basis">{RENTAL_QUOTE_REFERENCE.powertrain} 공개요율 기반 참고 금액 · 확정 견적 아님
            <a href={RENTAL_QUOTE_REFERENCE.sourceUrl} target="_blank" rel="noopener noreferrer">산출 기준 보기</a>
          </p>
        </div>
        <div className="estimate-controls">
          <fieldset className="estimate-field"><legend><span>01</span> 차량 트림</legend>
            <div className="trim-select-wrap">
              <select id="rental-trim" className="trim-select" aria-label="차량 트림 선택" value={trim}
                onChange={event => update('trim', event.target.value as RentalTrim)}>
                {trims.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <ChevronDown size={19} strokeWidth={1.8} aria-hidden="true" className="trim-select-arrow" />
            </div>
            {trim === 'techno' && colorId === 'blue' && <p className="estimate-warning"><Info size={14}/> 새틴 녹턴 블루는 트림별 선택 가능 여부를 확인해야 합니다.</p>}
          </fieldset>
          <fieldset className="estimate-field"><legend><span>02</span> 계약기간</legend><OptionGroup name="계약기간" options={termOptions} value={termMonths} onChange={value => update('termMonths', value)} label={value => `${value / 12}년`}/></fieldset>
          <fieldset className="estimate-field"><legend><span>03</span> 연간 약정 주행거리</legend><OptionGroup name="연간 약정 주행거리" options={mileageOptions} value={annualMileageKm} onChange={value => update('annualMileageKm', value)} label={mileageLabel}/></fieldset>
          <fieldset className="estimate-field"><legend><span>04</span> 보증금</legend><OptionGroup name="보증금 비율" options={percentOptions} value={depositPercent} onChange={value => update('depositPercent', value)} label={value => `${value}%`}/><p className="estimate-helper">만기 시 조건에 따라 반환될 수 있는 예치금</p></fieldset>
          <fieldset className="estimate-field estimate-field-last"><legend><span>05</span> 선납금</legend><OptionGroup name="선납금 비율" options={percentOptions} value={prepaymentPercent} onChange={value => update('prepaymentPercent', value)} label={value => `${value}%`}/><p className="estimate-helper">월 렌트료 선납 · 일반적으로 미반환</p></fieldset>
          <div className="estimate-form-footer">
            <button type="button" className="estimate-apply-button" onClick={() => setConsultationOpen(true)}>무료 견적 상담 신청하기 <ArrowRight size={19}/></button>
            <p>예상 금액은 공개 견적과 내부 조건별 추정치를 조합한 참고치입니다. 무제한 주행은 별도 상담이 필요하며, 실제 금액은 옵션·보험·렌트사·심사·프로모션에 따라 달라집니다.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
    {consultationOpen && <ConsultationModal selection={selection} estimatedMonthlyRentWon={estimatedMonthly} onClose={() => setConsultationOpen(false)} />}
  </section>;
}
