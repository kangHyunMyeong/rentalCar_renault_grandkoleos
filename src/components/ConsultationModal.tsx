import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { colorNames, trimNames, type RentalSelection } from '../consultation';
import { submitConsultationLead } from '../services/consultationLead';
import '../consultationModal.css';

type ConsultationModalProps = {
  selection: RentalSelection;
  estimatedMonthlyRentWon: number | null;
  onClose: () => void;
};

const mileageText = (value: RentalSelection['annualMileageKm']) =>
  value === 'unlimited' ? '무제한' : `연 ${(value / 10000).toFixed(0)}만 km`;

export default function ConsultationModal({ selection, estimatedMonthlyRentWon, onClose }: ConsultationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consented, setConsented] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  const validName = name.trim().length >= 2;
  const normalizedPhone = phone.replace(/\D/g, '');
  const validPhone = /^01[016789]\d{7,8}$/.test(normalizedPhone);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nameRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    if (!validName || !validPhone || !consented) return;

    // Intentionally a no-op until a real API endpoint and privacy policy are ready.
    const result = await submitConsultationLead({
      name: name.trim(), phone: normalizedPhone, selection,
      estimatedMonthlyRentWon, consentedAt: new Date().toISOString(),
    });
    if (result.status === 'not-configured') setNotConfigured(true);
  };

  return createPortal(
    <div className="consultation-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="consultation-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="consultation-title" aria-describedby="consultation-lead">
        <div className="consultation-header">
          <span>GRAND KOLEOS / FREE CONSULTATION</span>
          <button type="button" className="consultation-close" onClick={onClose} aria-label="상담 팝업 닫기"><X size={21} /></button>
        </div>
        <div className="consultation-body">
          <h2 id="consultation-title">무료 견적 상담 신청</h2>
          <p id="consultation-lead">선택하신 렌트 조건을 확인하고, 상담받을 정보를 입력해 주세요.</p>

          <div className="consultation-selection">
            <div className="consultation-selection-top"><strong>선택한 렌트 조건</strong><span>RENTAL DETAILS</span></div>
            <dl>
              <div><dt>차량</dt><dd>그랑 콜레오스 · {trimNames[selection.trim]}</dd></div>
              <div><dt>외장 컬러</dt><dd>{colorNames[selection.colorId] ?? '선택 컬러'}</dd></div>
              <div><dt>기간 / 주행거리</dt><dd>{selection.termMonths / 12}년 · {mileageText(selection.annualMileageKm)}</dd></div>
              <div><dt>보증금 / 선납금</dt><dd>{selection.depositPercent}% / {selection.prepaymentPercent}%</dd></div>
              <div className="consultation-selection-price"><dt>예상 월 렌트료</dt><dd>{estimatedMonthlyRentWon === null ? '상담 후 안내' : `${estimatedMonthlyRentWon.toLocaleString('ko-KR')}원`}</dd></div>
            </dl>
          </div>

          <form className="consultation-form" onSubmit={handleSubmit} noValidate>
            <div className="consultation-input-group">
              <label htmlFor="consultation-name">이름 <span>필수</span></label>
              <input ref={nameRef} id="consultation-name" type="text" autoComplete="name" maxLength={40}
                placeholder="이름을 입력해 주세요" value={name} onChange={event => {setName(event.target.value);setNotConfigured(false);}}
                aria-invalid={attempted && !validName} aria-describedby={attempted && !validName ? 'consultation-name-error' : undefined} />
              {attempted && !validName && <small className="consultation-error" id="consultation-name-error">이름을 두 글자 이상 입력해 주세요.</small>}
            </div>
            <div className="consultation-input-group">
              <label htmlFor="consultation-phone">연락처 <span>필수</span></label>
              <input id="consultation-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16}
                placeholder="010-0000-0000" value={phone} onChange={event => {setPhone(event.target.value);setNotConfigured(false);}}
                aria-invalid={attempted && !validPhone} aria-describedby={attempted && !validPhone ? 'consultation-phone-error' : undefined} />
              {attempted && !validPhone && <small className="consultation-error" id="consultation-phone-error">올바른 휴대전화 번호를 입력해 주세요.</small>}
            </div>
            <label className="consultation-consent">
              <input type="checkbox" checked={consented} onChange={event => {setConsented(event.target.checked);setNotConfigured(false);}} />
              <span>상담을 위한 개인정보 수집·이용에 동의합니다. <em>(필수)</em><small>수집 예정 항목: 이름, 연락처, 선택한 렌트 조건 · 목적: 견적 상담 안내</small></span>
            </label>
            {attempted && !consented && <small className="consultation-error">개인정보 수집·이용 동의를 확인해 주세요.</small>}
            <button type="submit" className="consultation-submit">상담 신청 <ArrowRight size={19} aria-hidden="true" /></button>
            <p className="consultation-api-notice">현재 상담 접수 API 연결 전입니다. 입력 정보는 서버에 전송·저장되지 않으며 실제 상담 신청으로 접수되지 않습니다.</p>
            {notConfigured && <p className="consultation-submit-notice" role="status">입력 항목은 확인되었습니다. 다만 현재 접수 시스템이 연결되지 않아 신청이 접수되지는 않았습니다.</p>}
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
