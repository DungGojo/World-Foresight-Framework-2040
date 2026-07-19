import { useLocation } from 'react-router-dom';
import useSmoothNavigate from '../hooks/useSmoothNavigate';
import './SiteHeader.css';

function Mark() {
  return (
    <svg className="site-mark" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="14.5" />
      <path d="M3.5 18h29M18 3.5c4.7 4.1 7 8.9 7 14.5s-2.3 10.4-7 14.5M18 3.5c-4.7 4.1-7 8.9-7 14.5s2.3 10.4 7 14.5M7 9.5c3.1 1.8 6.8 2.7 11 2.7s7.9-.9 11-2.7M7 26.5c3.1-1.8 6.8-2.7 11-2.7s7.9.9 11 2.7" />
    </svg>
  );
}

export default function SiteHeader({ theme = 'light', active }) {
  const location = useLocation();
  const smoothNavigate = useSmoothNavigate();
  const current = active || (
    location.pathname === '/data' ? 'data' :
    location.pathname === '/about' ? 'about' :
    location.pathname === '/forces' || location.pathname.startsWith('/topic/') ? 'forces' : 'framework'
  );

  const links = [
    { id: 'framework', label: 'Framework', to: '/framework' },
    { id: 'forces', label: 'Forces', to: '/forces' },
    { id: 'data', label: 'Data', to: '/data' },
    { id: 'about', label: 'About', to: '/about' },
  ];

  const follow = (event, to) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    smoothNavigate(to);
  };

  return (
    <header className={`site-header ${theme}`}>
      <a className="site-brand" href="#/framework" onClick={(event) => follow(event, '/framework')} aria-label="World Foresight Framework home">
        <Mark />
        <span>World Foresight<br className="brand-break" /> Framework</span>
      </a>
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map((item) => (
          <a
            key={item.id}
            href={`#${item.to}`}
            onClick={(event) => follow(event, item.to)}
            className={current === item.id ? 'active' : ''}
            aria-current={current === item.id ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
