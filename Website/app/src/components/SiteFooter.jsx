import './SiteFooter.css';

export default function SiteFooter({ theme = 'light' }) {
  return (
    <footer className={`site-footer ${theme}`}>
      <div className="site-footer-inner page-container">
        <span>World Foresight Framework</span>
        <span>Nguyen Viet Dung · 2026</span>
      </div>
    </footer>
  );
}
