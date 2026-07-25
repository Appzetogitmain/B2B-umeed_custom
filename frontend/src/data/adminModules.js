export const adminSidebarSections = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', path: 'dashboard', icon: 'dashboard' }],
  },
  {
    title: 'Management',
    items: [
      { label: 'Retailer Management', path: 'retailers', icon: 'retailers' },
      { label: 'Delivery Partners', path: 'delivery-partners', icon: 'retailers' },
      { label: 'Category Management', path: 'categories', icon: 'products' },
      { label: 'Banner Management', path: 'banners', icon: 'products' },
      { label: 'Product & Pricing', path: 'products-pricing', icon: 'products' },
      { label: 'Order Management', path: 'order-management', icon: 'orders' },
      { label: 'Inventory Visibility', path: 'inventory', icon: 'inventory' },
      { label: 'Commission', path: 'commission', icon: 'commission' },
      { label: 'Cashback & Voucher', path: 'cashback-voucher', icon: 'cashback' },
      { label: 'Wallet System', path: 'wallet-system', icon: 'wallet' },
      { label: 'Deal Management', path: 'deal-management', icon: 'retailers' },
      { label: 'Payments & Reports', path: 'payments-reports', icon: 'payments' },
    ],
  },
  {
    title: 'Incentive & Target',
    items: [
      { label: 'Monthly Targets', path: 'monthly-targets', icon: 'targets' },
    ],
  },

  {
    title: 'System',
    items: [{ label: 'Settings', path: 'settings', icon: 'settings' }],
  },
]

export const adminModuleContent = {
  categories: {
    title: 'Category Management',
    subtitle: 'Manage wholesale product categories and catalogs.',
    points: [
      'Create new product categories with custom names and cover images',
      'Upload images to Cloudinary dynamically',
      'Edit category details and delete category records'
    ]
  },
  banners: {
    title: 'Banner Management',
    subtitle: 'Manage promotional banners and advertisements for the retailer app.',
    points: [
      'Create and publish dynamic promotional banners',
      'Add custom titles, descriptions, and high-quality cover images',
      'Upload promotional images to Cloudinary dynamically',
      'Edit banner details and delete inactive banners'
    ]
  },
  retailers: {
    title: 'Retailer Management',
    subtitle: 'Manage onboarding, KYC, activation, and retailer lifecycle.',
    points: [
      'Retailer approvals and profile verification queue',
      'Retailer segmentation by city, volume, and active status',
      'Credit limit and wallet threshold controls',
    ],
  },
  'delivery-partners': {
    title: 'Delivery Partner Management',
    subtitle: 'Manage partner coverage, capacity, and assignment quality.',
    points: [
      'Partner onboarding with route and zone mapping',
      'Active shift tracking and dispatch allocation',
      'Performance SLA and failed-attempt analytics',
    ],
  },
  'products-pricing': {
    title: 'Product & Pricing Management',
    subtitle: 'Manage catalog pricing, margins, and promotional strategies for retailers.',
    points: [
      'Category-wise product catalog with activation control',
      'Region-based dynamic pricing for retailers',
      'Margin and profit preview before publishing',
      'Bulk product upload and pricing updates',
      'Time-based promotional pricing engine',
    ],
    quickActions: ['Add New Product', 'Update Pricing', 'Export Product Report', 'View Audit Logs'],
    topProducts: [
      {
        name: 'Basmati Rice 25kg',
        category: 'Grocery',
        price: 'Rs 2,340',
        margin: '18%',
        status: 'Active',
      },
      {
        name: 'Sunflower Oil 1L',
        category: 'Edible Oil',
        price: 'Rs 168',
        margin: '12%',
        status: 'Active',
      },
      {
        name: 'Red Chilli Powder 500g',
        category: 'Spices',
        price: 'Rs 210',
        margin: '22%',
        status: 'Low Stock',
      },
      {
        name: 'Cow Ghee 1L',
        category: 'Dairy',
        price: 'Rs 640',
        margin: '15%',
        status: 'Active',
      },
    ],
    pricingInsights: {
      avgMargin: '16.8%',
      bestSellingCategory: 'Grocery',
      lowStockAlerts: '12 products',
      activeSkus: '248',
    },
  },
  'order-management': {
    title: 'Order Management',
    subtitle: 'Review and control inbound orders with approval actions.',
    points: [
      'Approve or reject pending retailer orders with reason logs',
      'Order status pipeline from packed to delivered',
      'Escalation queue for delayed and high-value orders',
    ],
  },
  'deal-management': {
    title: 'Deal Management',
    subtitle: 'Manage custom rate and bulk quantity deals requested by retailers.',
    points: [
      'Review requested deals and expected prices from retailers',
      'Accept deals or send a counter offer',
      'Track deal status (Pending, Countered, Accepted, Rejected)',
    ],
  },
  inventory: {
    title: 'Inventory Visibility',
    subtitle: 'Optional live inventory view across warehouses and routes.',
    points: [
      'Real-time stock by SKU, warehouse, and reserved quantity',
      'Low-stock alerts and reorder recommendations',
      'Stock movement audit for returns and adjustments',
    ],
  },
  commission: {
    title: 'Commission Management',
    subtitle: 'Configure role-based commission slabs like 2%, 1%, and custom tiers.',
    points: [
      'Commission policy by role and category',
      'Settlement summary with hold and release controls',
      'Transparent payout report exports',
    ],
  },
  'cashback-voucher': {
    title: 'Cashback & Voucher Management',
    subtitle: 'Control cashback and voucher campaigns with 5% reward logic.',
    points: [
      '5% cashback campaigns with validity windows',
      'Voucher issuance, redemption, and fraud-safe caps',
      'Eligibility rules by retailer tier and order value',
    ],
  },
  'wallet-system': {
    title: 'Wallet System',
    subtitle: 'Track wallet credits, debits, reversals, and payment offsets.',
    points: [
      'Ledger view for every credit and debit transaction',
      'Manual adjustment with maker-checker workflow',
      'Wallet freeze and unlock controls',
    ],
  },
  'payments-reports': {
    title: 'Payment Tracking & Reports',
    subtitle: 'Consolidate online, COD, and settlement reports in one place.',
    points: [
      'Daily payment reconciliation and mismatch alerts',
      'Gateway success and failure analytics',
      'Downloadable GST and settlement reports',
    ],
  },
  'monthly-targets': {
    title: 'Monthly Target Setup',
    subtitle: 'Set targets from Rs 2L to Rs 5L with role-wise goals.',
    points: [
      'Monthly target slabs with branch-level assignment',
      'Auto-progress projection based on run rate',
      'Target lock and approval workflow',
    ],
  },

  settings: {
    title: 'Admin Settings',
    subtitle: 'Central control for panel behavior and governance defaults.',
    points: [
      'Role permissions and route access toggles',
      'Notification thresholds and escalation matrix',
      'Branding, localization, and export settings',
    ],
  },
}
