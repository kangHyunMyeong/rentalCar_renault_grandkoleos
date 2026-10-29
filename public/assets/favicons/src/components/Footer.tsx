import '../footer.css';

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="운영사 정보">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <span className="site-footer-eyebrow">GRAND KOLEOS · LONG-TERM RENTAL</span>
            <strong>FITCAR COMPANY</strong>
            <p>그랑 콜레오스 장기렌트,<br />나에게 맞는 조건으로 알아보세요.</p>
          </div>

          <div className="site-footer-company">
            <h2>운영사 정보</h2>
            <dl>
              <div><dt>상호</dt><dd>핏카컴퍼니</dd></div>
              <div><dt>대표자</dt><dd>김민철</dd></div>
              <div><dt>사업자등록번호</dt><dd>578-36-01253</dd></div>
              <div><dt>사업장 주소</dt><dd>인천 서구 파랑로 495 에이스하이테크시티 1동 1004호</dd></div>
            </dl>
          </div>
        </div>

        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} FITCAR COMPANY. ALL RIGHTS RESERVED.</span>
          <a href="#top">BACK TO TOP <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
