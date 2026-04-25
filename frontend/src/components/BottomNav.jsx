import { useLocation, useNavigate } from 'react-router-dom'

function getTabs(basePath) {
  if (basePath === '/delivery') {
    return [
      { label: 'Home', path: '/delivery/home', icon: 'home' },
      { label: 'Orders', path: '/delivery/orders', icon: 'orders' },
      { label: 'Earnings', path: '/delivery/earnings', icon: 'wallet' },
      { label: 'Profile', path: '/delivery/profile', icon: 'profile' },
    ]
  }

  return [
    { label: 'Home', path: `${basePath}/home`, icon: 'home' },
    { label: 'Orders', path: `${basePath}/orders`, icon: 'orders' },
    { label: 'Wallet', path: `${basePath}/wallet`, icon: 'wallet' },
    { label: 'Profile', path: `${basePath}/profile`, icon: 'profile' },
  ]
}

function NavIcon({ name, active }) {
  const color = active ? '#ffffff' : '#6b7280'

  if (name === 'home') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M3.75 10.5 12 3.75l8.25 6.75v8.25a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5V10.5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.75 20.25V13.5h4.5v6.75" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'orders') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" stroke={color} strokeWidth="1.8" />
        <path d="M8.25 9h7.5M8.25 12h7.5M8.25 15h4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'products') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M12 3.75 4.5 8.25v7.5L12 20.25l7.5-4.5v-7.5L12 3.75Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 12.75 4.5 8.25M12 12.75l7.5-4.5M12 12.75v7.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'wallet') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4.5 7.5A2.25 2.25 0 0 1 6.75 5.25h10.5A2.25 2.25 0 0 1 19.5 7.5v9a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 16.5v-9Z" stroke={color} strokeWidth="1.8" />
        <path d="M15.75 12h3.75" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="15.75" cy="12" r="0.9" fill={color} />
      </svg>
    )
  }

  if (name === 'performance') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path d="M4.5 18.75h15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7.5 15.75 10.5 12.75l2.25 2.25L16.5 9.75" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.5" cy="15.75" r="1" fill={color} />
        <circle cx="10.5" cy="12.75" r="1" fill={color} />
        <circle cx="12.75" cy="15" r="1" fill={color} />
        <circle cx="16.5" cy="9.75" r="1" fill={color} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="8.25" r="3" stroke={color} strokeWidth="1.8" />
      <path d="M5.25 19.5a6.75 6.75 0 0 1 13.5 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDeliveryRoute = location.pathname.startsWith('/delivery');
  const basePath = isDeliveryRoute ? '/delivery' : '/retailer';
  const tabs = getTabs(basePath);
  const activeIndex = tabs.findIndex((tab) => tab.path === location.pathname);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeIcon = tabs[safeIndex]?.icon ?? tabs[0].icon;

  return (
    <nav className="fixed bottom-2 left-1/2 z-50 w-[95%] max-w-lg -translate-x-1/2 rounded-3xl border border-white/80 bg-white/95 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.13)] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <ul
        className="relative grid items-end gap-0"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1 z-0 flex h-10 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(${safeIndex * 100}%)`,
            width: `${100 / tabs.length}%`,
          }}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
            <NavIcon name={activeIcon} active={true} />
          </span>
        </span>

        {tabs.map((tab) => (
          <li key={tab.path} className="flex-1">
            <button
              type="button"
              onClick={() => navigate(tab.path)}
              className={`relative flex min-h-16 w-full flex-col items-center justify-end rounded-2xl pb-1 text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                location.pathname === tab.path ? 'text-black' : 'text-[#6b7280]'
              }`}
            >
              <span
                className={`relative z-10 mb-1 grid h-10 w-10 place-items-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  location.pathname === tab.path
                    ? 'scale-100 opacity-0'
                    : 'scale-[0.92] bg-transparent text-[#8b949e]'
                }`}
              >
                <NavIcon name={tab.icon} active={location.pathname === tab.path} />
              </span>
              <span className="relative z-10 leading-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                {tab.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default BottomNav
