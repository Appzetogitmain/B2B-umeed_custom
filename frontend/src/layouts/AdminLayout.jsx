import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { adminSidebarSections } from '../data/adminModules'
import urLogo from '../assets/ur.png'

// Icon mapping for sidebar items
function IconComponent({ name, isActive }) {
  const iconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: isActive ? '#ffffff' : '#9ca3af',
    strokeWidth: 2.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const icons = {
    dashboard: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    retailers: (
      <svg {...iconProps}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    orders: (
      <svg {...iconProps}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    products: (
      <svg {...iconProps}>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 5v-1a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1" />
      </svg>
    ),
    inventory: (
      <svg {...iconProps}>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    commission: (
      <svg {...iconProps}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    cashback: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M8 10h8" />
      </svg>
    ),
    wallet: (
      <svg {...iconProps}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    payments: (
      <svg {...iconProps}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <circle cx="18" cy="16" r="2" />
      </svg>
    ),
    targets: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    performance: (
      <svg {...iconProps}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    gifts: (
      <svg {...iconProps}>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <path d="M12 22v-6M7 12l5-5 5 5" />
      </svg>
    ),
    rewards: (
      <svg {...iconProps}>
        <polygon points="12 2 15.09 10.26 23.77 10.5 17.94 16.17 20.16 24.83 12 20.13 3.84 24.83 6.06 16.17 0.23 10.5 8.91 10.26" />
      </svg>
    ),
    referral: (
      <svg {...iconProps}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    distribution: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="5" r="1" />
        <circle cx="5" cy="5" r="1" />
        <circle cx="19" cy="19" r="1" />
        <circle cx="5" cy="19" r="1" />
        <line x1="12" y1="12" x2="19" y2="5" />
        <line x1="12" y1="12" x2="5" y2="5" />
        <line x1="12" y1="12" x2="19" y2="19" />
        <line x1="12" y1="12" x2="5" y2="19" />
      </svg>
    ),
    settings: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V22a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H2a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H8a1.7 1.7 0 0 0 1.04-1.56V2a2 2 0 0 1 4 0v.09A1.7 1.7 0 0 0 14.08 3.65a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.04H22a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04z" />
      </svg>
    ),
    logout: (
      <svg {...iconProps}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  }

  return icons[name] || null
}

function SidebarItem({ path, label, iconName, collapsed, onNavigate }) {
  return (
    <NavLink
      to={`/admin/${path}`}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out ${collapsed ? 'justify-center gap-0' : 'gap-3'
        } ${isActive
          ? 'bg-black text-white'
          : 'text-gray-600 hover:bg-gray-100'
        }`
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <IconComponent name={iconName} isActive={isActive} />
          {!collapsed ? <span className="flex-1 truncate">{label}</span> : null}
        </>
      )}
    </NavLink>
  )
}

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const routeTitles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/delivery-partners': 'Delivery Partner Management',
    '/admin/orders': 'Order Management',
    '/admin/order-management': 'Order Management',
    '/admin/products': 'Product Management',
    '/admin/products-pricing': 'Product Management',
    '/admin/retailers': 'Retailer Management',
    '/admin/categories': 'Category Management',
    '/admin/banners': 'Banner Management',
    '/admin/commission': 'Commission Management',
    '/admin/cashback-voucher': 'Cashback & Voucher Management',
    '/admin/wallet-system': 'Wallet System',
    '/admin/payments-reports': 'Payments & Reports',
    '/admin/monthly-targets': 'Monthly Targets',
    '/admin/settings': 'Settings',
  }

  const formatRouteTitle = (pathname) => {
    const segment = pathname.replace('/admin/', '')
    if (!segment || segment === pathname) {
      return 'Dashboard'
    }

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const pageTitle = routeTitles[location.pathname] || formatRouteTitle(location.pathname)

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    localStorage.removeItem('umeed-admin-auth')
    navigate('/admin/auth', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* FIXED SIDEBAR - SCROLLABLE */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-gray-200 bg-white overflow-y-auto flex flex-col transform-gpu transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'
          }`}
      >
        {/* Sidebar Header - Sticky */}
        <div className={`border-b border-gray-200 sticky top-0 bg-white z-10 transition-all duration-300 ease-in-out flex flex-col items-center justify-center ${collapsed ? 'px-2 py-3' : 'px-6 py-3'}`}>
          <img src={urLogo} alt="Umeed Logo" className={`object-contain ${collapsed ? 'h-10' : 'h-14'}`} />
        </div>

        {/* Sidebar Menu - Scrollable */}
        <nav className={`flex-1 overflow-y-auto py-3 transition-all duration-300 ease-in-out ${collapsed ? 'px-2' : 'px-4'}`}>
          <div className="space-y-6">
            {adminSidebarSections.map((section) => (
              <div key={section.title} className="space-y-2">
                {!collapsed ? (
                  <p className="px-2 text-xs font-medium uppercase tracking-wide text-gray-400">{section.title}</p>
                ) : null}
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.path}
                      path={item.path}
                      label={item.label}
                      iconName={item.icon}
                      collapsed={collapsed}
                      onNavigate={() => { }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer - Sticky */}
        <div className={`border-t border-gray-200 sticky bottom-0 bg-white transition-all duration-300 ease-in-out ${collapsed ? 'p-2' : 'p-4'}`}>
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-100 border border-gray-200 ${collapsed ? 'justify-center gap-0' : 'gap-3'
              }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <IconComponent name="logout" isActive={false} />
            {!collapsed ? <span className="flex-1 truncate">Logout</span> : null}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={`flex h-screen min-h-0 flex-col flex-1 overflow-hidden transition-[margin-left] duration-300 ease-in-out ${collapsed ? 'ml-[72px]' : 'ml-[240px]'
          }`}
      >
        {isProfileMenuOpen ? (
          <button
            type="button"
            aria-label="Close profile menu"
            className="fixed inset-0 z-[90]"
            onClick={() => setIsProfileMenuOpen(false)}
          />
        ) : null}

        {/* FIXED HEADER */}
        <header
          className={`fixed top-0 right-0 z-[100] h-14 border-b border-gray-200 bg-white px-4 shadow-sm transition-[left] duration-300 ease-in-out ${collapsed ? 'left-[72px]' : 'left-[240px]'
            }`}
        >
          <div className="flex h-full items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-all duration-300 ease-in-out hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>

              <div className="min-w-0">
                <h1 className="text-base font-semibold text-gray-700">{pageTitle}</h1>
              </div>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="relative hidden md:block w-64">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  placeholder="Search..."
                  value={new URLSearchParams(location.search).get('q') || ''}
                  onChange={(e) => {
                    const params = new URLSearchParams(location.search)
                    if (e.target.value) {
                      params.set('q', e.target.value)
                    } else {
                      params.delete('q')
                    }
                    navigate({ search: params.toString() }, { replace: true })
                  }}
                  className="h-9 w-full rounded-[8px] border border-[#e2e5e9] bg-[#f5f6f8] pl-9 pr-3 text-[13px] font-normal text-gray-700 placeholder-gray-500 focus:border-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white"
                aria-label="Open profile menu"
              >
                A
              </button>

              {isProfileMenuOpen ? (
                <div className="absolute right-0 top-12 z-[110] w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.16)]">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <p className="text-lg font-semibold leading-none text-slate-800">A</p>
                    <p className="mt-2 text-[13px] font-semibold text-slate-800">Admin_hp4270077</p>
                    <p className="mt-0.5 text-[13px] text-slate-500">admin@umeed.com</p>
                  </div>

                  <div className="px-4 py-2">
                    <button type="button" className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                      Profile Settings
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                      Notifications
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                      Preferences
                    </button>
                    <button type="button" className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
                      Change Password
                    </button>
                  </div>

                  <div className="border-t border-slate-200 px-4 py-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 min-h-0 overflow-y-auto px-8 pb-6 pt-[80px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
