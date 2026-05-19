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
      { label: 'Payments & Reports', path: 'payments-reports', icon: 'payments' },
    ],
  },
  {
    title: 'Incentive & Target',
    items: [
      { label: 'Monthly Targets', path: 'monthly-targets', icon: 'targets' },
      { label: 'Performance Tracking', path: 'performance', icon: 'performance' },
      { label: 'Gift Points', path: 'gift-points', icon: 'gifts' },
      { label: 'Rewards Distribution', path: 'rewards', icon: 'rewards' },
    ],
  },
  {
    title: 'Network System',
    items: [
      { label: 'Referral Tree', path: 'referral-tree', icon: 'referral' },
      { label: 'Commission Distribution', path: 'commission-distribution', icon: 'distribution' },
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
  performance: {
    title: 'Performance Tracking',
    subtitle: 'Track team and partner outcomes against business KPIs.',
    points: [
      'Goal vs achievement heatmaps',
      'Underperforming node detection',
      'Actionable alerts with trend summaries',
    ],
  },
  'gift-points': {
    title: 'Gift Point Management',
    subtitle: 'Manage accrual, redemption, and expiry of gift points.',
    points: [
      'Rule engine for points on order milestones',
      'Point burn and expiry scheduler',
      'Ledger and dispute tracking',
    ],
  },
  rewards: {
    title: 'Rewards & Gift Distribution',
    subtitle: 'Control reward inventory and distribution approvals.',
    points: [
      'Catalog of rewards and stock thresholds',
      'Distribution approvals and dispatch logs',
      'Campaign effectiveness reports',
    ],
  },
  'referral-tree': {
    title: 'Multi-level Referral Tree View',
    subtitle: 'Visualize role-based referral hierarchy and network growth.',
    points: [
      'Node-level drill-down of uplines and downlines',
      'Role-aware expansion limits and visibility',
      'Network performance overlays',
    ],
  },
  'commission-distribution': {
    title: 'Commission Distribution Logic',
    subtitle: 'Manage 3-level or unlimited role-based distribution models.',
    points: [
      '3-level and unlimited distribution switch by role',
      'Formula preview before publishing policy updates',
      'Audit trail for every payout calculation',
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
