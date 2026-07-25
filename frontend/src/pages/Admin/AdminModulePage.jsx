import { getBackendUrl } from '../../utils/api';
import { useState, useEffect } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { adminModuleContent } from '../../data/adminModules'
import AdminDealManagement from '../../components/AdminDealManagement'

function getStatusBadgeClasses(status) {
  if (status === 'Active') {
    return 'bg-green-100 text-green-700'
  }

  if (status === 'Low Stock') {
    return 'bg-yellow-100 text-yellow-700'
  }

  if (status === 'Out of Stock') {
    return 'bg-red-100 text-red-700'
  }

  if (status === 'Offline') {
    return 'bg-slate-200 text-slate-700'
  }

  return 'bg-slate-100 text-slate-700'
}

const initialRetailers = [
  {
    id: 1,
    storeName: 'Sharma Kirana',
    ownerName: 'Rohit Sharma',
    phone: '9876543210',
    email: 'rohit.sharma@retailmail.com',
    city: 'Jaipur',
    address: 'MI Road, Jaipur',
    gstNumber: '08AAAPL1234A1Z5',
    status: 'Active',
    walletBalance: 'Rs 12,540',
  },
  {
    id: 2,
    storeName: 'Gupta Store',
    ownerName: 'Ankit Gupta',
    phone: '9898989898',
    email: 'ankit.gupta@retailmail.com',
    city: 'Delhi',
    address: 'Laxmi Nagar, Delhi',
    gstNumber: '07AACCG5678D1Z3',
    status: 'Pending',
    walletBalance: 'Rs 4,200',
  },
  {
    id: 3,
    storeName: 'Patel Mart',
    ownerName: 'Nilesh Patel',
    phone: '9811112233',
    email: 'nilesh.patel@retailmail.com',
    city: 'Ahmedabad',
    address: 'CG Road, Ahmedabad',
    gstNumber: '24AABCP3344E1Z8',
    status: 'Active',
    walletBalance: 'Rs 8,900',
  },
  {
    id: 4,
    storeName: 'Verma Traders',
    ownerName: 'Sandeep Verma',
    phone: '9777788899',
    email: 'sandeep.verma@retailmail.com',
    city: 'Lucknow',
    address: 'Aliganj, Lucknow',
    gstNumber: '09AAACV4455F1Z2',
    status: 'Blocked',
    walletBalance: 'Rs 0',
  },
  {
    id: 5,
    storeName: 'Singh Wholesale',
    ownerName: 'Harpreet Singh',
    phone: '9765432101',
    email: 'harpreet.singh@retailmail.com',
    city: 'Punjab',
    address: 'Model Town, Ludhiana',
    gstNumber: '03AABCS7788G1Z7',
    status: 'Active',
    walletBalance: 'Rs 15,300',
  },
]



const retailerInitialForm = {
  storeName: '',
  ownerName: '',
  phone: '',
  email: '',
  city: '',
  address: '',
  gstNumber: '',
  status: 'Pending',
  walletBalance: '',
  password: '',
  shopName: '',
  shopType: 'Proprietorship',
  addressAsPerAadhaar: '',
  aadhaarState: '',
  aadhaarPin: '',
  aadhaarNo: '',
  panNo: '',
  partnerNameA: '',
  partnerNameB: '',
  whatsappNo: '',
  alternateContactName: '',
  alternateContactPhone: '',
  areaOfOperation: '',
  pinCode: '',
  state: '',
  bankName: '',
  ifscCode: '',
  bankBranch: '',
  accountHolderName: '',
  accountNo: '',
  retailShopName: '',
  completeAddress: '',
  landmark: '',
  policeStation: '',
  addressPinCode: '',
  addressState: '',
  photo: '',
}

const partnerInitialForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  vehicleType: 'Bike',
  vehicleNumber: '',
  city: '',
  status: 'Active',
  totalDeliveries: 0,
  earnings: 'Rs 0',
}

const productInitialForm = {
  name: '',
  category: '',
  variantName: '',
  images: [],
  price: '',
  mrp: '',
  discount: '',
  stock: '',
  description: '',
}

const commissionInitialForm = {
  policyName: '',
  policyType: 'Delivery Partner',
  percentage: '',
  category: '',
  partnerRole: 'Bike',
  status: 'Active'
}

const voucherInitialForm = {
  campaignName: '',
  voucherCode: '',
  rewardType: 'Cashback',
  discountPercentage: '',
  minOrderValue: '',
  maxDiscountCap: '',
  eligibilityTier: 'All',
  validFrom: '',
  validTo: '',
  status: 'Active'
}

const walletInitialForm = {
  retailerId: '',
  transactionType: 'Credit',
  amount: '',
  reason: '',
  referenceId: ''
}

function ModuleModal({ title, open, onClose, onSubmit, isReadOnly, children, accent = 'slate' }) {
  if (!open) {
    return null
  }

  const closeButtonClass =
    accent === 'emerald'
      ? 'rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50'
      : 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100'

  const saveButtonClass =
    accent === 'emerald'
      ? 'rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700'
      : 'rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white'

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/35 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className={closeButtonClass}
          >
            Close
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={onSubmit}>
          {children}
          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {isReadOnly ? 'Back' : 'Cancel'}
            </button>
            {!isReadOnly ? (
              <button type="submit" className={saveButtonClass}>
                Save
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function baseInputClass(readOnly) {
  return `w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 ${
    readOnly ? 'cursor-default bg-slate-50' : ''
  }`
}

function AdminModulePage() {
  const { module } = useParams()
  const content = adminModuleContent[module]
  const isRetailerModule = module === 'retailers'
  const isDeliveryModule = module === 'delivery-partners'
  const isCategoryModule = module === 'categories'
  const isBannerModule = module === 'banners'
  const isProductPricingModule = module === 'products-pricing'
  const isOrderModule = module === 'order-management'
  const isInventoryModule = module === 'inventory'
  const isCommissionModule = module === 'commission'
  const isCashbackVoucherModule = module === 'cashback-voucher'
  const isWalletModule = module === 'wallet-system'
  const isPaymentsModule = module === 'payments-reports'
  const isMonthlyTargetModule = module === 'monthly-targets'
  const isSettingsModule = module === 'settings'
  const isDealModule = module === 'deal-management'

  const [targetList, setTargetList] = useState([])
  const [retailers, setRetailers] = useState([])
  const [partners, setPartners] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState(null)
  const [newStockValue, setNewStockValue] = useState(0)
  const [inventorySearch, setInventorySearch] = useState('')

  const [policies, setPolicies] = useState([])
  const [settlements, setSettlements] = useState([])
  const [commissionForm, setCommissionForm] = useState(commissionInitialForm)
  const [commissionSearch, setCommissionSearch] = useState('')

  const [vouchers, setVouchers] = useState([])
  const [voucherForm, setVoucherForm] = useState(voucherInitialForm)
  const [voucherSearch, setVoucherSearch] = useState('')

  const [walletTransactions, setWalletTransactions] = useState([])
  const [walletForm, setWalletForm] = useState(walletInitialForm)
  const [walletSearch, setWalletSearch] = useState('')

  const [paymentRecords, setPaymentRecords] = useState([])
  const [paymentSearch, setPaymentSearch] = useState('')


  const [retailerForm, setRetailerForm] = useState(retailerInitialForm)
  const [partnerForm, setPartnerForm] = useState(partnerInitialForm)
  const [categoryForm, setCategoryForm] = useState({ categoryName: '', image: '' })
  const [bannerForm, setBannerForm] = useState({ title: '', description: '', image: '' })
  const [productForm, setProductForm] = useState(productInitialForm)
  const [cameraActive, setCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState('user')
  const [stream, setStream] = useState(null)
  const [modalError, setModalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [adminPassword, setAdminPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState({ type: '', text: '' })

  const handleUpdateAdminPassword = async (e) => {
    e.preventDefault()
    if (!adminPassword || adminPassword.length < 6) {
      setPasswordUpdateMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    try {
      setIsUpdatingPassword(true)
      const adminEmail = localStorage.getItem('umeed-admin-email') || 'admin@umeed.com'
      const response = await fetch(`${getBackendUrl()}/api/v1/auth/admin/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, newPassword: adminPassword })
      })

      const data = await response.json()
      if (response.ok) {
        setPasswordUpdateMessage({ type: 'success', text: 'Password updated successfully!' })
        setAdminPassword('')
      } else {
        setPasswordUpdateMessage({ type: 'error', text: data.message || 'Failed to update password' })
      }
    } catch (err) {
      setPasswordUpdateMessage({ type: 'error', text: 'Server error updating password' })
    } finally {
      setIsUpdatingPassword(false)
    }
  }


  const action = searchParams.get('action')
  const paramId = searchParams.get('id')

  const isModalOpen = !!action
  const modalMode = action || 'add'
  const selectedId = paramId

  const searchQuery = searchParams.get('q') || ''

  const filteredRetailers = retailers.filter(retailer => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      (retailer.storeName && retailer.storeName.toLowerCase().includes(q)) ||
      (retailer.ownerName && retailer.ownerName.toLowerCase().includes(q)) ||
      (retailer.name && retailer.name.toLowerCase().includes(q)) ||
      (retailer.email && retailer.email.toLowerCase().includes(q)) ||
      (retailer.phone && retailer.phone.toLowerCase().includes(q)) ||
      (retailer.city && retailer.city.toLowerCase().includes(q)) ||
      (retailer.deliveryAddress && retailer.deliveryAddress.toLowerCase().includes(q))
    )
  })

  const filteredPartners = partners.filter(partner => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      (partner.name && partner.name.toLowerCase().includes(q)) ||
      (partner.email && partner.email.toLowerCase().includes(q)) ||
      (partner.phone && partner.phone.toLowerCase().includes(q)) ||
      (partner.city && partner.city.toLowerCase().includes(q)) ||
      (partner.vehicleType && partner.vehicleType.toLowerCase().includes(q)) ||
      (partner.vehicleNumber && partner.vehicleNumber.toLowerCase().includes(q))
    )
  })

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase().trim()
    const storeName = order.retailerId?.storeName || ''
    const ownerName = order.retailerId?.ownerName || order.retailerId?.name || ''
    const partnerName = order.deliveryPartnerId?.name || ''
    const status = order.status || ''
    const orderId = order._id ? order._id.toString() : ''
    return (
      storeName.toLowerCase().includes(q) ||
      ownerName.toLowerCase().includes(q) ||
      partnerName.toLowerCase().includes(q) ||
      status.toLowerCase().includes(q) ||
      orderId.toLowerCase().includes(q)
    )
  })

  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase().trim()
    return category.categoryName && category.categoryName.toLowerCase().includes(q)
  })

  const filteredBanners = banners.filter(banner => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      (banner.title && banner.title.toLowerCase().includes(q)) ||
      (banner.description && banner.description.toLowerCase().includes(q))
    )
  })

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.category && product.category.toLowerCase().includes(q)) ||
      (product.variantName && product.variantName.toLowerCase().includes(q)) ||
      (product.description && product.description.toLowerCase().includes(q))
    )
  })

  useEffect(() => {
    if (isRetailerModule) {
      fetchRetailers()
    }
  }, [isRetailerModule])

  const fetchRetailers = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/auth/admin/retailers`)
      if (!response.ok) throw new Error('Failed to fetch retailers')
      const data = await response.json()
      const formatted = data.map(r => ({ ...r, id: r._id, address: r.deliveryAddress || '' }))
      setRetailers(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isDeliveryModule) {
      fetchPartners()
    }
  }, [isDeliveryModule])

  const fetchPartners = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/partners`)
      if (!response.ok) throw new Error('Failed to fetch partners')
      const data = await response.json()
      const formatted = data.map(p => ({ ...p, id: p._id }))
      setPartners(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isOrderModule) {
      fetchOrders()
      fetchPartners()
    }
  }, [isOrderModule])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/orders`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
  }

  useEffect(() => {
    if (isCategoryModule) {
      fetchCategories()
    }
  }, [isCategoryModule])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/categories`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  useEffect(() => {
    if (isBannerModule) {
      fetchBanners()
    }
  }, [isBannerModule])

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/banners`)
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (err) {
      console.error('Error fetching banners:', err)
    }
  }

  useEffect(() => {
    if (isBannerModule && banners.length > 0 && action && action !== 'add') {
      const row = banners.find(b => b._id === paramId)
      if (row) {
        setBannerForm({
          title: row.title,
          description: row.description,
          image: row.image
        })
      }
    } else if (isBannerModule && action === 'add') {
      setBannerForm({ title: '', description: '', image: '' })
    }
  }, [banners, action, paramId, isBannerModule])

  useEffect(() => {
    if (isCategoryModule && categories.length > 0 && action && action !== 'add') {
      const row = categories.find(c => c._id === paramId)
      if (row) {
        setCategoryForm({
          categoryName: row.categoryName,
          image: row.image
        })
      }
    } else if (isCategoryModule && action === 'add') {
      setCategoryForm({ categoryName: '', image: '' })
    }
  }, [categories, action, paramId, isCategoryModule])

  useEffect(() => {
    if (isRetailerModule && retailers.length > 0 && action && action !== 'add') {
      const row = retailers.find(r => r.id === paramId)
      if (row) {
        setRetailerForm({ ...row, password: '' })
      }
    }
  }, [retailers, action, paramId, isRetailerModule])

  useEffect(() => {
    if (isDeliveryModule && partners.length > 0 && action && action !== 'add') {
      const row = partners.find(p => p.id === Number(paramId) || p.id === paramId)
      if (row) {
        setPartnerForm(row)
      }
    }
  }, [partners, action, paramId, isDeliveryModule])

  useEffect(() => {
    if (isProductPricingModule || isInventoryModule) {
      const activeSearch = searchQuery || inventorySearch
      fetchProducts(activeSearch)
      fetchCategories()
    }
  }, [isProductPricingModule, isInventoryModule, searchQuery, inventorySearch])

  const fetchProducts = async (search = '') => {
    try {
      const url = search ? `http://localhost:5200/api/v1/products?search=${encodeURIComponent(search)}` : `${getBackendUrl()}/api/v1/products`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  useEffect(() => {
    if (isCommissionModule) {
      const activeSearch = searchQuery || commissionSearch
      fetchCommissionPolicies(activeSearch)
      fetchSettlements()
      fetchCategories()
    }
  }, [isCommissionModule, searchQuery, commissionSearch])

  const fetchCommissionPolicies = async (search = '') => {
    try {
      const url = search ? `http://localhost:5200/api/v1/commissions/policies?search=${encodeURIComponent(search)}` : `${getBackendUrl()}/api/v1/commissions/policies`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPolicies(data)
      }
    } catch (err) {
      console.error('Error fetching commission policies:', err)
    }
  }

  const fetchSettlements = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/commissions/settlements`)
      if (response.ok) {
        const data = await response.json()
        setSettlements(data)
      }
    } catch (err) {
      console.error('Error fetching settlements:', err)
    }
  }

  useEffect(() => {
    if (isCashbackVoucherModule) {
      const activeSearch = searchQuery || voucherSearch
      fetchVouchers(activeSearch)
    }
  }, [isCashbackVoucherModule, searchQuery, voucherSearch])

  const fetchVouchers = async (search = '') => {
    try {
      const url = search ? `http://localhost:5200/api/v1/vouchers?search=${encodeURIComponent(search)}` : `${getBackendUrl()}/api/v1/vouchers`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setVouchers(data)
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err)
    }
  }

  useEffect(() => {
    if (isWalletModule) {
      fetchWalletTransactions()
      fetchRetailers()
    }
  }, [isWalletModule])

  const fetchWalletTransactions = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/wallets`)
      if (response.ok) {
        const data = await response.json()
        setWalletTransactions(data)
      }
    } catch (err) {
      console.error('Error fetching wallet transactions:', err)
    }
  }

  useEffect(() => {
    if (isPaymentsModule) {
      fetchPaymentRecords()
    }
  }, [isPaymentsModule])

  const fetchPaymentRecords = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/payments`)
      if (response.ok) {
        const data = await response.json()
        setPaymentRecords(data)
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
    }
  }

  useEffect(() => {
    if (isMonthlyTargetModule) {
      fetchTargets(searchQuery)
    }
  }, [isMonthlyTargetModule, searchQuery])

  const fetchTargets = async (search = '') => {
    try {
      const url = search ? `http://localhost:5200/api/v1/targets?search=${encodeURIComponent(search)}` : `${getBackendUrl()}/api/v1/targets`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTargetList(data)
      }
    } catch (err) {
      console.error('Error fetching targets:', err)
    }
  }

  useEffect(() => {
    if (isCommissionModule && policies.length > 0 && action && action !== 'add') {
      const row = policies.find(p => p._id === paramId)
      if (row) {
        setCommissionForm({
          policyName: row.policyName || '',
          policyType: row.policyType || 'Delivery Partner',
          percentage: row.percentage || '',
          category: row.category || '',
          partnerRole: row.partnerRole || 'Bike',
          status: row.status || 'Active'
        })
      }
    } else if (isCommissionModule && action === 'add') {
      setCommissionForm(commissionInitialForm)
    }
  }, [policies, action, paramId, isCommissionModule])

  useEffect(() => {
    if (isCashbackVoucherModule && vouchers.length > 0 && action && action !== 'add') {
      const row = vouchers.find(v => v._id === paramId)
      if (row) {
        setVoucherForm({
          campaignName: row.campaignName || '',
          voucherCode: row.voucherCode || '',
          rewardType: row.rewardType || 'Cashback',
          discountPercentage: row.discountPercentage || '',
          minOrderValue: row.minOrderValue || '',
          maxDiscountCap: row.maxDiscountCap || '',
          eligibilityTier: row.eligibilityTier || 'All',
          validFrom: row.validFrom ? new Date(row.validFrom).toISOString().slice(0, 10) : '',
          validTo: row.validTo ? new Date(row.validTo).toISOString().slice(0, 10) : '',
          status: row.status || 'Active'
        })
      }
    } else if (isCashbackVoucherModule && action === 'add') {
      setVoucherForm(voucherInitialForm)
    }
  }, [vouchers, action, paramId, isCashbackVoucherModule])

  useEffect(() => {
    if (isWalletModule && action === 'add') {
      setWalletForm(walletInitialForm)
    }
  }, [action, isWalletModule])

  useEffect(() => {
    if (isProductPricingModule && products.length > 0 && action && action !== 'add') {
      const row = products.find(p => p._id === paramId)
      if (row) {
        setProductForm({
          name: row.name || '',
          category: row.category || '',
          variantName: row.variantName || '',
          images: row.images || [],
          price: row.price || '',
          mrp: row.mrp || '',
          discount: row.discount || '',
          stock: row.stock || '',
          description: row.description || '',
        })
      }
    } else if (isProductPricingModule && action === 'add') {
      setProductForm(productInitialForm)
    }
  }, [products, action, paramId, isProductPricingModule])

  useEffect(() => {
    let activeStream = null;
    if (cameraActive) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      })
      .then(s => {
        activeStream = s;
        setStream(s);
        const videoElement = document.getElementById('camera-preview');
        if (videoElement) {
          videoElement.srcObject = s;
        }
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
        setModalError('Failed to access camera. Please check permissions.');
        setCameraActive(false);
      });
    } else {
      stopCameraTracks();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, facingMode]);

  const stopCameraTracks = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-preview');
    if (!video) return;

    if (productForm.images.length >= 4) {
      setModalError('Validation Error: Maximum 4 gallery images are allowed.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, dataUrl]
      }));
      setModalError('');
    }
  };

  const handleMultipleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (productForm.images.length + files.length > 4) {
      setModalError('Validation Error: Maximum 4 gallery images are allowed. You selected too many files.');
      e.target.value = ''; // Reset input to allow another selection attempt
      return;
    }

    setModalError('');

    try {
      const readPromises = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(readPromises);

      setProductForm(prev => {
        const newImages = [...prev.images, ...base64Images].slice(0, 4);
        return {
          ...prev,
          images: newImages
        };
      });
    } catch (err) {
      console.error('Error reading files:', err);
      setModalError('Error reading selected files');
    } finally {
      e.target.value = ''; // Always clear file input value so onChange will fire even for same file selection
    }
  };

  const removeProductImage = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleMrpChange = (val) => {
    setProductForm(prev => {
      const updated = { ...prev, mrp: val };
      const mrpNum = parseFloat(val);
      if (!isNaN(mrpNum) && mrpNum > 0) {
        if (prev.discount !== '' && !isNaN(parseFloat(prev.discount))) {
          const discNum = parseFloat(prev.discount);
          updated.price = Math.round(mrpNum * (1 - discNum / 100));
        } else if (prev.price !== '' && !isNaN(parseFloat(prev.price))) {
          const priceNum = parseFloat(prev.price);
          const calculatedDiscount = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
          updated.discount = Math.max(0, calculatedDiscount);
        }
      }
      return updated;
    });
  };

  const handlePriceChange = (val) => {
    setProductForm(prev => {
      const updated = { ...prev, price: val };
      const priceNum = parseFloat(val);
      const mrpNum = parseFloat(prev.mrp);
      if (!isNaN(priceNum) && !isNaN(mrpNum) && mrpNum > 0) {
        const calculatedDiscount = Math.round(((mrpNum - priceNum) / mrpNum) * 100);
        updated.discount = Math.max(0, calculatedDiscount);
      }
      return updated;
    });
  };

  const handleDiscountChange = (val) => {
    setProductForm(prev => {
      const updated = { ...prev, discount: val };
      const discNum = parseFloat(val);
      const mrpNum = parseFloat(prev.mrp);
      if (!isNaN(discNum) && !isNaN(mrpNum) && mrpNum > 0) {
        const calculatedPrice = Math.round(mrpNum * (1 - discNum / 100));
        updated.price = calculatedPrice;
      }
      return updated;
    });
  };

  if (!content && !isWalletModule && !isPaymentsModule && !isMonthlyTargetModule) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const isReadOnly = modalMode === 'view'

  const openRetailerModal = (mode, row = null) => {
    setModalError('')
    setRetailerForm(row ? { ...row, password: '' } : retailerInitialForm)
    if (mode === 'add') {
      setSearchParams({ action: 'add' })
    } else {
      setSearchParams({ action: mode, id: row?.id })
    }
  }

  const openPartnerModal = (mode, row = null) => {
    setPartnerForm(row ?? partnerInitialForm)
    if (mode === 'add') {
      setSearchParams({ action: 'add' })
    } else {
      setSearchParams({ action: mode, id: row?.id })
    }
  }

  const handleRetailerSubmit = async (event) => {
    event.preventDefault()
    setModalError('')

    // Phone validation (exactly 10 digits)
    const cleanedPhone = retailerForm.phone.trim()
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setModalError('Phone number must be exactly 10 digits')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(retailerForm.email.trim())) {
      setModalError('Please enter a valid email address')
      return
    }

    // Password validation (only on add)
    if (modalMode === 'add' && !retailerForm.password.trim()) {
      setModalError('Please enter a password')
      return
    }

    try {
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/auth/admin/retailers/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(retailerForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/auth/admin/retailers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(retailerForm)
        })
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      await fetchRetailers()
      setRetailerForm(retailerInitialForm)
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    }
  }

  const handleRetailerDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/auth/admin/retailers/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete')
      }
      await fetchRetailers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    setModalError('')
    if (!categoryForm.categoryName.trim()) {
      setModalError('Category Name is required')
      return
    }
    try {
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/categories/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm)
        })
      }
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      await fetchCategories()
      setCategoryForm({ categoryName: '', image: '' })
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    }
  }

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      const response = await fetch(`http://localhost:5200/api/v1/categories/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete category')
      }
      await fetchCategories()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleBannerSubmit = async (e) => {
    e.preventDefault()
    setModalError('')
    if (!bannerForm.title.trim()) {
      setModalError('Title is required')
      return
    }
    try {
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/banners/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/banners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerForm)
        })
      }
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      await fetchBanners()
      setBannerForm({ title: '', description: '', image: '' })
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    }
  }

  const handleBannerDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return
    try {
      const response = await fetch(`http://localhost:5200/api/v1/banners/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete banner')
      }
      await fetchBanners()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handlePartnerSubmit = async (event) => {
    event.preventDefault()
    setModalError('')

    try {
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/partners/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partnerForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/partners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partnerForm)
        })
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      await fetchPartners()
      setPartnerForm(partnerInitialForm)
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    }
  }

  const handlePartnerDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/partners/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete partner')
      }
      await fetchPartners()
    } catch (err) {
      console.error(err)
    }
  }

  const handleOrderDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this order from the database?')) return
    try {
      const response = await fetch(`http://localhost:5200/api/v1/orders/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete order')
      }
      await fetchOrders()
      if (selectedOrder?._id === id) {
        setSelectedOrder(null)
      }
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleOrderStatusUpdate = async (id, newStatus, reason = '') => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status')
      }
      await fetchOrders()
      setSelectedOrder(data)
      setShowRejectInput(false)
      setRejectionReason('')
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleOrderAssignPartner = async (id, partnerId) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/orders/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryPartnerId: partnerId || null })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign delivery partner')
      }
      await fetchOrders()
      setSelectedOrder(data)
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setModalError('')

    if (!productForm.name.trim()) {
      setModalError('Product Name is required')
      return
    }
    if (!productForm.category.trim()) {
      setModalError('Category is required')
      return
    }
    if (productForm.price === '' || isNaN(productForm.price)) {
      setModalError('Price must be a valid number')
      return
    }
    if (productForm.mrp === '' || isNaN(productForm.mrp)) {
      setModalError('MRP must be a valid number')
      return
    }
    if (productForm.stock === '' || isNaN(productForm.stock)) {
      setModalError('Stock must be a valid number')
      return
    }
    if (productForm.images.length > 4) {
      setModalError('Validation Error: Maximum 4 gallery images are allowed.')
      return
    }

    try {
      setIsSubmitting(true)
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/products/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm)
        })
      }
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      await fetchProducts()
      setProductForm(productInitialForm)
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return
    try {
      const response = await fetch(`http://localhost:5200/api/v1/products/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete product')
      }
      await fetchProducts()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleInventoryStockUpdate = async (e) => {
    if (e) e.preventDefault()
    if (!selectedInventoryProduct) return
    if (newStockValue === '' || isNaN(Number(newStockValue)) || Number(newStockValue) < 0) {
      alert('Please enter a valid non-negative stock quantity')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`http://localhost:5200/api/v1/products/${selectedInventoryProduct._id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Number(newStockValue) })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update stock quantity')
      }
      
      await fetchProducts()
      setSelectedInventoryProduct(null)
      setNewStockValue(0)
    } catch (err) {
      console.error('Inventory stock update error:', err)
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommissionSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setModalError('')

    if (!commissionForm.policyName.trim()) {
      setModalError('Policy Name is required')
      return
    }

    if (commissionForm.percentage === '' || isNaN(commissionForm.percentage)) {
      setModalError('Percentage must be a valid number')
      return
    }

    const percentageNum = Number(commissionForm.percentage)
    if (percentageNum < 0 || percentageNum > 100) {
      setModalError('Percentage must be between 0 and 100')
      return
    }

    try {
      setIsSubmitting(true)
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/commissions/policies/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commissionForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/commissions/policies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(commissionForm)
        })
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      await fetchCommissionPolicies()
      setCommissionForm(commissionInitialForm)
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommissionDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/commissions/policies/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete policy')
      }
      await fetchCommissionPolicies()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleSettlementStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/commissions/settlements/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutStatus: newStatus })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update settlement status')
      }
      await fetchSettlements()
    } catch (err) {
      console.error('Error updating settlement status:', err)
      alert(err.message)
    }
  }

  const handleVoucherSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setModalError('')

    if (!voucherForm.campaignName.trim()) {
      setModalError('Campaign Name is required')
      return
    }

    if (!voucherForm.voucherCode.trim()) {
      setModalError('Voucher Promo Code is required')
      return
    }

    if (voucherForm.discountPercentage === '' || isNaN(voucherForm.discountPercentage)) {
      setModalError('Discount Percentage must be a valid number')
      return
    }

    const percentageNum = Number(voucherForm.discountPercentage)
    if (percentageNum < 0 || percentageNum > 100) {
      setModalError('Discount Percentage must be between 0 and 100')
      return
    }

    if (!voucherForm.validFrom || !voucherForm.validTo) {
      setModalError('Both Validity Start & End dates are required')
      return
    }

    try {
      setIsSubmitting(true)
      let response
      if (modalMode === 'edit') {
        response = await fetch(`http://localhost:5200/api/v1/vouchers/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(voucherForm)
        })
      } else {
        response = await fetch(`${getBackendUrl()}/api/v1/vouchers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(voucherForm)
        })
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      await fetchVouchers()
      setVoucherForm(voucherInitialForm)
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoucherDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/vouchers/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete campaign')
      }
      await fetchVouchers()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleWalletSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setModalError('')

    if (!walletForm.retailerId) {
      setModalError('Retailer selection is required')
      return
    }

    if (walletForm.amount === '' || isNaN(walletForm.amount) || Number(walletForm.amount) <= 0) {
      setModalError('Amount must be a positive number')
      return
    }

    if (!walletForm.reason.trim()) {
      setModalError('Reason for adjustment is required')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`${getBackendUrl()}/api/v1/wallets/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailerId: walletForm.retailerId,
          transactionType: walletForm.transactionType,
          amount: Number(walletForm.amount),
          reason: walletForm.reason.trim(),
          referenceId: walletForm.referenceId.trim()
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Adjustment failed')
      }

      await fetchWalletTransactions()
      await fetchRetailers() // Reload retailer list to sync dynamic balance!
      setWalletForm(walletInitialForm)
      setSearchParams({})
    } catch (err) {
      setModalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWalletFreezeToggle = async (retailerId) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/wallets/freeze/${retailerId}`, {
        method: 'POST'
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update freeze status')
      }
      await fetchRetailers()
      await fetchWalletTransactions() // reload ledger to sync
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const handlePaymentReconcile = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/payments/${orderId}/reconcile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Reconciliation failed')
      }

      await fetchPaymentRecords()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const quickActions = content.quickActions ?? ['Create Policy', 'Export Report', 'View Audit Logs']

  if (isCategoryModule) {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Category Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage wholesale product categories and catalogs</p>
          </div>
          <button
            type="button"
            onClick={() => setSearchParams({ action: 'add' })}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white active:scale-95 transition-all"
          >
            + Add Category
          </button>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Category Directory</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Category Name</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Image</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-800">{cat.categoryName}</td>
                    <td className="px-3 py-3">
                      {cat.image ? (
                        <img 
                          src={cat.image} 
                          alt={cat.categoryName} 
                          className="h-10 w-10 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSearchParams({ action: 'edit', id: cat._id })}
                          className="rounded-[6px] border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCategoryDelete(cat._id)}
                          className="rounded-[6px] border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 active:scale-95 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-400">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* CATEGORY FORM MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {modalMode === 'edit' ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleCategorySubmit} className="mt-4 space-y-4">
                {modalError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 border border-rose-100">
                    {modalError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.categoryName}
                    onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Category Image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setCategoryForm({ ...categoryForm, image: reader.result })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="category-image-upload"
                    />
                    <label
                      htmlFor="category-image-upload"
                      className="cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-center text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Choose File
                    </label>
                    {categoryForm.image && (
                      <img
                        src={categoryForm.image}
                        alt="Preview"
                        className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {modalMode === 'edit' ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isBannerModule) {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Banner Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage promotional banners and advertisements for the retailer app</p>
          </div>
          <button
            type="button"
            onClick={() => setSearchParams({ action: 'add' })}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white active:scale-95 transition-all"
          >
            + Add Banner
          </button>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Banner Directory</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Banner Title</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Description</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Image</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBanners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-800">{banner.title}</td>
                    <td className="px-3 py-3 text-slate-500 max-w-[200px] truncate">{banner.description || 'No Description'}</td>
                    <td className="px-3 py-3">
                      {banner.image ? (
                        <img 
                          src={banner.image} 
                          alt={banner.title} 
                          className="h-10 w-20 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="h-10 w-20 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSearchParams({ action: 'edit', id: banner._id })}
                          className="rounded-[6px] border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBannerDelete(banner._id)}
                          className="rounded-[6px] border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 active:scale-95 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBanners.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      No banners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* BANNER FORM MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {modalMode === 'edit' ? 'Edit Banner' : 'Add New Banner'}
                </h3>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleBannerSubmit} className="mt-4 space-y-4">
                {modalError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 border border-rose-100">
                    {modalError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="Enter banner title"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Description / Subtitle
                  </label>
                  <textarea
                    value={bannerForm.description}
                    onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                    placeholder="Enter banner description"
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Banner Image
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setBannerForm({ ...bannerForm, image: reader.result })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="banner-image-file"
                    />
                    <label
                      htmlFor="banner-image-file"
                      className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
                    >
                      Choose File
                    </label>
                    {bannerForm.image && (
                      <img 
                        src={bannerForm.image} 
                        alt="Preview" 
                        className="h-10 w-20 rounded-lg object-cover border border-slate-100"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {modalMode === 'edit' ? 'Save Changes' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isRetailerModule) {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Retailer Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage onboarding, KYC, and retailer lifecycle</p>
          </div>
          <button
            type="button"
            onClick={() => openRetailerModal('add')}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            + Add Retailer
          </button>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Retailer Directory</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Store Name</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Owner</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Email</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Phone</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">City</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Address</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Status</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Registered By</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Wallet Balance</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRetailers.map((retailer) => (
                  <tr key={retailer.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">{retailer.storeName || `${retailer.name || 'Retailer'}'s Store`}</td>
                    <td className="px-3 py-3 text-slate-700">{retailer.ownerName || retailer.name || 'N/A'}</td>
                    <td className="px-3 py-3 text-slate-700">{retailer.email}</td>
                    <td className="px-3 py-3 text-slate-700">{retailer.phone || 'N/A'}</td>
                    <td className="px-3 py-3 text-slate-700">{retailer.city || 'N/A'}</td>
                    <td className="px-3 py-3 text-slate-700">{retailer.deliveryAddress || retailer.address || 'N/A'}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClasses(retailer.status)}`}>
                        {retailer.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        retailer.registeredBy === 'admin'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {retailer.registeredBy === 'admin' ? 'Admin' : 'Retailer App'}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-800">{retailer.walletBalance}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openRetailerModal('edit', retailer)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRetailerDelete(retailer.id)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => openRetailerModal('view', retailer)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ModuleModal
          title={modalMode === 'add' ? 'Add Retailer' : modalMode === 'edit' ? 'Edit Retailer' : 'Retailer Details'}
          open={isModalOpen}
          onClose={() => { setModalError(''); setSearchParams({}); }}
          onSubmit={handleRetailerSubmit}
          isReadOnly={isReadOnly}
        >
          {modalError && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-500 border border-red-100">
              {modalError}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 max-h-[70vh] overflow-y-auto px-1">
            {/* Group 1: General Details */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-2 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">1. General Shop Details</h4>
            </div>
            <Field label="Store / Shop Name">
              <input
                value={isReadOnly ? (retailerForm.shopName || retailerForm.storeName || 'N/A') : retailerForm.shopName}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, shopName: e.target.value, storeName: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter shop name"
                required
              />
            </Field>
            <Field label="Store Owner Name">
              <input
                value={isReadOnly ? (retailerForm.ownerName || retailerForm.name || 'N/A') : retailerForm.ownerName}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, ownerName: e.target.value, name: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter owner name"
                required
              />
            </Field>
            <Field label="Shop Type">
              <select
                value={retailerForm.shopType || 'Proprietorship'}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, shopType: e.target.value }))}
                disabled={isReadOnly}
                className={baseInputClass(isReadOnly)}
              >
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
              </select>
            </Field>

            {/* Group 2: Aadhaar Identity */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">2. Aadhaar Verification</h4>
            </div>
            <Field label="Aadhaar No.">
              <input
                value={isReadOnly ? (retailerForm.aadhaarNo || 'N/A') : retailerForm.aadhaarNo}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, aadhaarNo: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter 12 digit Aadhaar"
              />
            </Field>
            <Field label="Aadhaar Address">
              <input
                value={isReadOnly ? (retailerForm.addressAsPerAadhaar || 'N/A') : retailerForm.addressAsPerAadhaar}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, addressAsPerAadhaar: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter address as per Aadhaar"
              />
            </Field>
            <Field label="Aadhaar State">
              <input
                value={isReadOnly ? (retailerForm.aadhaarState || 'N/A') : retailerForm.aadhaarState}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, aadhaarState: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="State as per Aadhaar"
              />
            </Field>
            <Field label="Aadhaar Pin">
              <input
                value={isReadOnly ? (retailerForm.aadhaarPin || 'N/A') : retailerForm.aadhaarPin}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, aadhaarPin: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Pin code as per Aadhaar"
              />
            </Field>

            {/* Group 3: Identity & Tax */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">3. Tax & Identity</h4>
            </div>
            <Field label="PAN No.">
              <input
                value={isReadOnly ? (retailerForm.panNo || 'N/A') : retailerForm.panNo}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, panNo: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter PAN Number"
              />
            </Field>
            <Field label="GST No.">
              <input
                value={isReadOnly ? (retailerForm.gstNumber || 'N/A') : retailerForm.gstNumber}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, gstNumber: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter GST Number"
              />
            </Field>
            <Field label="Partner 1 Name">
              <input
                value={isReadOnly ? (retailerForm.partnerNameA || 'N/A') : retailerForm.partnerNameA}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, partnerNameA: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Partner Name (if applicable)"
              />
            </Field>
            <Field label="Partner 2 Name">
              <input
                value={isReadOnly ? (retailerForm.partnerNameB || 'N/A') : retailerForm.partnerNameB}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, partnerNameB: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Other Partner Name (if applicable)"
              />
            </Field>

            {/* Group 4: Contact Information */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">4. Contact Information</h4>
            </div>
            <Field label="Official Phone Number">
              <input
                value={isReadOnly ? (retailerForm.phone || 'N/A') : retailerForm.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setRetailerForm((prev) => ({ ...prev, phone: val }))
                }}
                maxLength={10}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Official mobile number"
                required
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                value={retailerForm.email}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, email: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Official email address"
                required
              />
            </Field>
            <Field label="WhatsApp No.">
              <input
                value={isReadOnly ? (retailerForm.whatsappNo || 'N/A') : retailerForm.whatsappNo}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, whatsappNo: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                maxLength={10}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="WhatsApp Number"
              />
            </Field>
            <Field label="Alternate Contact Name">
              <input
                value={isReadOnly ? (retailerForm.alternateContactName || 'N/A') : retailerForm.alternateContactName}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, alternateContactName: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Alternate contact person"
              />
            </Field>
            <Field label="Alternate Contact Phone">
              <input
                value={isReadOnly ? (retailerForm.alternateContactPhone || 'N/A') : retailerForm.alternateContactPhone}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, alternateContactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                maxLength={10}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Alternate mobile number"
              />
            </Field>

            {/* Group 5: Operation Area */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">5. Operation Area</h4>
            </div>
            <Field label="Area of Operation">
              <input
                value={isReadOnly ? (retailerForm.areaOfOperation || 'N/A') : retailerForm.areaOfOperation}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, areaOfOperation: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Area of business operation"
              />
            </Field>
            <Field label="Pin Code">
              <input
                value={isReadOnly ? (retailerForm.pinCode || 'N/A') : retailerForm.pinCode}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, pinCode: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Operation area pin code"
              />
            </Field>
            <Field label="State">
              <input
                value={isReadOnly ? (retailerForm.state || 'N/A') : retailerForm.state}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, state: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Operation state"
              />
            </Field>

            {/* Group 6: Complete Shop Address */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">6. Complete Shop Location Details</h4>
            </div>
            <Field label="Retail Shop Name">
              <input
                value={isReadOnly ? (retailerForm.retailShopName || retailerForm.shopName || retailerForm.storeName || 'N/A') : retailerForm.retailShopName}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, retailShopName: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Retail shop display name"
              />
            </Field>
            <Field label="Complete Delivery Address">
              <input
                value={isReadOnly ? (retailerForm.completeAddress || retailerForm.address || 'N/A') : retailerForm.completeAddress}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, completeAddress: e.target.value, address: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Complete physical shop address"
              />
            </Field>
            <Field label="City">
              <input
                value={isReadOnly ? (retailerForm.city || 'N/A') : retailerForm.city}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, city: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="City Name"
              />
            </Field>
            <Field label="Land Mark">
              <input
                value={isReadOnly ? (retailerForm.landmark || 'N/A') : retailerForm.landmark}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, landmark: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Nearby landmark"
              />
            </Field>
            <Field label="Police Station (P.S.)">
              <input
                value={isReadOnly ? (retailerForm.policeStation || 'N/A') : retailerForm.policeStation}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, policeStation: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Nearest Police Station"
              />
            </Field>
            <Field label="Address Pin Code">
              <input
                value={isReadOnly ? (retailerForm.addressPinCode || 'N/A') : retailerForm.addressPinCode}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, addressPinCode: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Shop address Pin Code"
              />
            </Field>
            <Field label="Address State">
              <input
                value={isReadOnly ? (retailerForm.addressState || 'N/A') : retailerForm.addressState}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, addressState: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Shop address State"
              />
            </Field>

            {/* Group 7: Bank Details */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">7. Bank Account Details</h4>
            </div>
            <Field label="Bank Name">
              <input
                value={isReadOnly ? (retailerForm.bankName || 'N/A') : retailerForm.bankName}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, bankName: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter bank name"
              />
            </Field>
            <Field label="IFSC Code">
              <input
                value={isReadOnly ? (retailerForm.ifscCode || 'N/A') : retailerForm.ifscCode}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, ifscCode: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter Bank IFSC Code"
              />
            </Field>
            <Field label="Bank Branch">
              <input
                value={isReadOnly ? (retailerForm.bankBranch || 'N/A') : retailerForm.bankBranch}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, bankBranch: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter branch name"
              />
            </Field>
            <Field label="Account Holder Name">
              <input
                value={isReadOnly ? (retailerForm.accountHolderName || 'N/A') : retailerForm.accountHolderName}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Account Holder's Name"
              />
            </Field>
            <Field label="Bank Account No.">
              <input
                value={isReadOnly ? (retailerForm.accountNo || 'N/A') : retailerForm.accountNo}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, accountNo: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="Enter bank account number"
              />
            </Field>

            {/* Group 8: System Settings */}
            <div className="col-span-1 sm:col-span-2 border-b border-slate-200 pb-1 mt-4 mb-1">
              <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">8. System Settings & Documents</h4>
            </div>
            {!isReadOnly && (
              <Field label="Account Password">
                <input
                  type="password"
                  value={retailerForm.password || ''}
                  onChange={(e) => setRetailerForm((prev) => ({ ...prev, password: e.target.value }))}
                  className={baseInputClass(isReadOnly)}
                  required={modalMode === 'add'}
                  placeholder="Enter password"
                />
              </Field>
            )}
            <Field label="Wallet Balance">
              <input
                value={isReadOnly ? (retailerForm.walletBalance || 'Rs 0') : (retailerForm.walletBalance === 'Rs 0' ? '' : retailerForm.walletBalance)}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, walletBalance: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder="e.g. Rs 5,000"
              />
            </Field>
            <Field label="Account Status">
              <select
                value={retailerForm.status}
                onChange={(e) => setRetailerForm((prev) => ({ ...prev, status: e.target.value }))}
                disabled={isReadOnly}
                className={baseInputClass(isReadOnly)}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
            </Field>

            {/* Photo Upload with preview */}
            <Field label="Retailer Photo">
              {retailerForm.photo && (
                <div className="mb-2 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  <img src={retailerForm.photo} alt="Retailer Document" className="w-full h-full object-cover" />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setRetailerForm(prev => ({ ...prev, photo: '' }))}
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-bl-lg p-1.5 text-xs transition duration-150"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
              {!isReadOnly && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setRetailerForm(prev => ({ ...prev, photo: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={baseInputClass(isReadOnly)}
                />
              )}
            </Field>
          </div>
        </ModuleModal>
      </div>
    )
  }

  if (isProductPricingModule) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Product & Pricing Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage catalog pricing, margins, and promotional strategies for retailers</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalError('');
              setProductForm(productInitialForm);
              setSearchParams({ action: 'add' });
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white active:scale-95 transition-all shadow-[0_4px_12px_rgba(15,23,42,0.15)] hover:bg-slate-800"
          >
            + Add Product
          </button>
        </header>

        {/* Directory Table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Product Directory</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Image</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Product Name</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Category</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Variant</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Price (Rs)</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">MRP (Rs)</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Discount (%)</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Stock</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 animate-fade-in">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex gap-1 overflow-x-auto max-w-[120px]">
                        {prod.images && prod.images.length > 0 ? (
                          prod.images.map((img, idx) => (
                            <img 
                              key={idx}
                              src={img} 
                              alt={prod.name} 
                              className="h-10 w-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                            />
                          ))
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-800">{prod.name}</td>
                    <td className="px-3 py-3 text-slate-600 font-medium">{prod.category}</td>
                    <td className="px-3 py-3 text-slate-600">{prod.variantName || 'N/A'}</td>
                    <td className="px-3 py-3 font-semibold text-slate-800">Rs {prod.price}</td>
                    <td className="px-3 py-3 text-slate-400 line-through">Rs {prod.mrp}</td>
                    <td className="px-3 py-3 text-emerald-600 font-bold">{prod.discount}% Off</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        prod.stock <= 0 
                          ? 'bg-rose-50 text-rose-700 border-rose-100' 
                          : prod.stock < 10 
                          ? 'bg-amber-50 text-amber-700 border-amber-100' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {prod.stock <= 0 ? 'Out of Stock' : prod.stock < 10 ? `Low Stock (${prod.stock})` : `${prod.stock} units`}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSearchParams({ action: 'view', id: prod._id })}
                          className="rounded-[6px] border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchParams({ action: 'edit', id: prod._id })}
                          className="rounded-[6px] border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProductDelete(prod._id)}
                          className="rounded-[6px] border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-100 active:scale-95 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-slate-400">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {modalMode === 'view' ? 'Product Details' : modalMode === 'edit' ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    stopCameraTracks();
                    setCameraActive(false);
                    setSearchParams({});
                  }}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleProductSubmit} className="mt-4 space-y-4">
                {modalError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 border border-rose-100">
                    {modalError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      readOnly={isReadOnly}
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Enter product name"
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Category *
                    </label>
                    <select
                      required
                      disabled={isReadOnly}
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.categoryName}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Variant Name
                    </label>
                    <input
                      type="text"
                      readOnly={isReadOnly}
                      value={productForm.variantName}
                      onChange={(e) => setProductForm({ ...productForm, variantName: e.target.value })}
                      placeholder="e.g. 1kg, Pack of 2"
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      readOnly={isReadOnly}
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="Available stock"
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Price (Rs) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      readOnly={isReadOnly}
                      value={productForm.price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="Retailer price"
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      MRP (Rs) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      readOnly={isReadOnly}
                      value={productForm.mrp}
                      onChange={(e) => handleMrpChange(e.target.value)}
                      placeholder="Max Retail Price"
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      readOnly={isReadOnly}
                      value={productForm.discount}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      placeholder="Discount percentage"
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Product Description
                  </label>
                  <textarea
                    value={productForm.description}
                    readOnly={isReadOnly}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter product detailed description"
                    rows="3"
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none ${isReadOnly ? 'cursor-default bg-slate-100 text-slate-500' : ''}`}
                  />
                </div>

                {/* Images Upload Section */}
                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Gallery Images {isReadOnly ? '' : '(Max 4 images)'}
                  </label>
                  
                  {/* Preview grid */}
                  {productForm.images && productForm.images.length > 0 ? (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {productForm.images.map((img, idx) => (
                        <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                          <img src={img} alt="Gallery item" className="h-full w-full object-cover" />
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => removeProductImage(idx)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-xl text-[10px] hover:bg-red-600 transition"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : isReadOnly ? (
                    <div className="text-xs text-slate-400 italic mb-4">No gallery images available for this product.</div>
                  ) : null}

                  {/* Upload choice */}
                  {!isReadOnly && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* File picker */}
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center hover:bg-slate-100 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          id="product-gallery-files"
                          onChange={handleMultipleImageUpload}
                          className="hidden"
                        />
                        <label 
                          htmlFor="product-gallery-files"
                          className="cursor-pointer inline-flex flex-col items-center justify-center w-full h-full"
                        >
                          <span className="text-sm font-semibold text-slate-700">Choose Files</span>
                          <span className="text-xs text-slate-400 mt-1">Upload multiple from computer</span>
                        </label>
                      </div>

                      {/* Camera Trigger */}
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center flex flex-col items-center justify-center hover:bg-slate-100 transition-colors">
                        <button
                          type="button"
                          onClick={() => {
                            setModalError('');
                            setCameraActive(prev => !prev);
                          }}
                          className="text-sm font-semibold text-[#00a877] hover:text-[#008f65]"
                        >
                          {cameraActive ? 'Close Camera Feed' : 'Capture using Camera'}
                        </button>
                        <span className="text-xs text-slate-400 mt-1">Supports both front & back camera</span>
                      </div>
                    </div>
                  )}

                  {/* Live Camera Interface */}
                  {!isReadOnly && cameraActive && (
                    <div className="mt-4 rounded-2xl border border-slate-800 p-4 bg-slate-950 text-white flex flex-col items-center gap-3">
                      <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video shadow-inner">
                        <video 
                          id="camera-preview"
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-slate-300 border border-slate-800">
                          {facingMode === 'user' ? 'Front Camera' : 'Back Camera'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={toggleCameraFacing}
                          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition"
                        >
                          🔄 Switch Camera
                        </button>
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="rounded-lg bg-[#00a877] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#008f65] transition"
                        >
                          📸 Click Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            stopCameraTracks();
                            setCameraActive(false);
                          }}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition"
                        >
                          ✕ Stop Feed
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      stopCameraTracks();
                      setCameraActive(false);
                      setSearchParams({});
                    }}
                    className={`rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isReadOnly ? 'Close' : 'Cancel'}
                  </button>
                  {!isReadOnly && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {modalMode === 'edit' ? 'Saving Changes...' : 'Creating Product...'}
                        </>
                      ) : (
                        modalMode === 'edit' ? 'Save Changes' : 'Create Product'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isDeliveryModule) {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h1 className="text-2xl font-semibold text-emerald-700">Delivery Partner Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage onboarding, delivery status, and partner productivity.</p>
          </div>
          <button
            type="button"
            onClick={() => openPartnerModal('add')}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Add Partner
          </button>
        </header>

        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-emerald-800">Delivery Partner Directory</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-emerald-100 bg-emerald-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Name</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Phone</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">City</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Vehicle</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Status</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Total Deliveries</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Earnings</th>
                  <th className="px-3 py-2.5 font-semibold text-emerald-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-emerald-50/50">
                    <td className="px-3 py-3 font-medium text-slate-800">{partner.name}</td>
                    <td className="px-3 py-3 text-slate-700">{partner.phone}</td>
                    <td className="px-3 py-3 text-slate-700">{partner.city}</td>
                    <td className="px-3 py-3 text-slate-700">{`${partner.vehicleType} (${partner.vehicleNumber})`}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClasses(partner.status)}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{partner.totalDeliveries}</td>
                    <td className="px-3 py-3 font-medium text-slate-800">{partner.earnings}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openPartnerModal('edit', partner)}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePartnerDelete(partner.id)}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => openPartnerModal('view', partner)}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ModuleModal
          title={modalMode === 'add' ? 'Add Partner' : modalMode === 'edit' ? 'Edit Partner' : 'Partner Details'}
          open={isModalOpen}
          onClose={() => { setModalError(''); setSearchParams({}); }}
          onSubmit={handlePartnerSubmit}
          isReadOnly={isReadOnly}
          accent="emerald"
        >
          {modalError && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-500 border border-red-100">
              {modalError}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                value={partnerForm.name}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                required
              />
            </Field>
            <Field label="Phone">
              <input
                type="text"
                value={partnerForm.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setPartnerForm((prev) => ({ ...prev, phone: val }))
                }}
                maxLength={10}
                pattern="[0-9]{10}"
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                required
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={partnerForm.email}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, email: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={partnerForm.password || ''}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, password: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
                placeholder={modalMode === 'edit' ? 'Leave blank to keep current' : 'Min 6 characters'}
                required={modalMode === 'add'}
                minLength={modalMode === 'add' ? 6 : undefined}
              />
            </Field>
            <Field label="Vehicle Type">
              <select
                value={partnerForm.vehicleType}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, vehicleType: e.target.value }))}
                disabled={isReadOnly}
                className={baseInputClass(isReadOnly)}
              >
                <option value="Bike">Bike</option>
                <option value="Cycle">Cycle</option>
              </select>
            </Field>
            <Field label="Vehicle Number">
              <input
                value={partnerForm.vehicleNumber}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, vehicleNumber: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
              />
            </Field>
            <Field label="City">
              <input
                value={partnerForm.city}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, city: e.target.value }))}
                readOnly={isReadOnly}
                className={baseInputClass(isReadOnly)}
              />
            </Field>
            <Field label="Status">
              <select
                value={partnerForm.status}
                onChange={(e) => setPartnerForm((prev) => ({ ...prev, status: e.target.value }))}
                disabled={isReadOnly}
                className={baseInputClass(isReadOnly)}
              >
                <option value="Active">Active</option>
                <option value="Offline">Offline</option>
              </select>
            </Field>
          </div>
        </ModuleModal>
      </div>
    )
  }

  if (isOrderModule) {
    return (
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div>
            <h1 className="text-2xl font-semibold text-[#00a877]">Order Management</h1>
            <p className="mt-1 text-sm text-slate-500">Review inbound retail wholesale orders, track status pipelines, and assign delivery partners.</p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Inbound Orders Directory</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Order ID</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Store / Retailer</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Items Count</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Total Amount</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Assigned Partner</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Live Status</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Date Placed</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-slate-400 italic">
                      No orders found matching the filter / search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusColors = {
                      Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
                      Approved: 'bg-blue-50 text-blue-700 border border-blue-200',
                      Packed: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
                      'Out for Delivery': 'bg-orange-50 text-orange-700 border border-orange-200',
                      Delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                      Rejected: 'bg-rose-50 text-rose-700 border border-rose-200'
                    }
                    
                    return (
                      <tr key={order._id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-3 font-semibold text-slate-900">
                          #{order._id ? order._id.slice(-6).toUpperCase() : 'N/A'}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-slate-800">
                            {order.retailerId?.storeName || 'N/A'}
                          </div>
                          <div className="text-xs text-slate-400">
                            {order.retailerId?.ownerName || order.retailerId?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-3 py-3 font-semibold text-[#00a877]">
                          Rs {order.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          {order.deliveryPartnerId ? (
                            <span className="inline-flex items-center gap-1 text-slate-800 text-xs font-medium">
                              🛵 {order.deliveryPartnerId.name}
                            </span>
                          ) : (
                            <span className="text-xs text-rose-500 italic bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-500 text-xs">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowRejectInput(false);
                                setRejectionReason('');
                              }}
                              className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOrderDelete(order._id)}
                              className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 hover:border-red-300 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Customized Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/35 px-4 overflow-y-auto py-10">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.2)] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Order Details: #{selectedOrder._id?.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('en-IN') : 'N/A'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>

              {/* Grid with Shop & Order status info */}
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider mb-2">Shop & Retailer Information</h4>
                  <div className="space-y-1 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{selectedOrder.retailerId?.storeName || 'N/A'}</p>
                    <p><span className="text-slate-400">Owner:</span> {selectedOrder.retailerId?.ownerName || selectedOrder.retailerId?.name || 'N/A'}</p>
                    <p><span className="text-slate-400">Phone:</span> {selectedOrder.retailerId?.phone || 'N/A'}</p>
                    <p><span className="text-slate-400">GSTIN:</span> {selectedOrder.retailerId?.gstNumber || 'N/A'}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="text-slate-400">Address:</span> {selectedOrder.retailerId?.deliveryAddress || selectedOrder.retailerId?.address || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#00a877] uppercase tracking-wider mb-2">Order Allocation & Status</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-slate-400 block mb-1">Status Pipeline:</span>
                        <div className="flex flex-wrap gap-1">
                          {['Pending', 'Approved', 'Packed', 'Out for Delivery', 'Delivered'].map((st) => {
                            const isCurrent = selectedOrder.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                disabled={selectedOrder.status === 'Rejected'}
                                onClick={() => handleOrderStatusUpdate(selectedOrder._id, st)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                                  isCurrent
                                    ? 'bg-[#00a877] text-white border-[#00a877] shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delivery partner selector */}
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block mb-1">Assign Delivery Partner:</label>
                        <select
                          value={selectedOrder.deliveryPartnerId?._id || selectedOrder.deliveryPartnerId || ''}
                          onChange={(e) => handleOrderAssignPartner(selectedOrder._id, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-500"
                        >
                          <option value="">-- Choose Partner --</option>
                          {partners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                              🛵 {partner.name} ({partner.city}) - {partner.status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection notice / flow */}
              {selectedOrder.status === 'Rejected' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-800">
                  <h5 className="font-bold text-xs uppercase tracking-wide text-red-600 mb-1">Order Rejected</h5>
                  <p className="text-sm">{selectedOrder.rejectionReason || 'No reason provided.'}</p>
                </div>
              )}

              {selectedOrder.status === 'Pending' && !showRejectInput && (
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'Approved')}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm text-center"
                  >
                    ✓ Approve Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm text-center"
                  >
                    ✕ Reject Order
                  </button>
                </div>
              )}

              {showRejectInput && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 space-y-3">
                  <label className="block text-xs font-bold text-rose-700 uppercase tracking-wide">
                    Provide Rejection Reason Log
                  </label>
                  <textarea
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejecting this order..."
                    className="w-full rounded-xl border border-rose-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-rose-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(false)}
                      className="rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOrderStatusUpdate(selectedOrder._id, 'Rejected', rejectionReason)}
                      className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-1.5 text-xs font-semibold text-white transition"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Order Items Catalog Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Order Items Breakdown</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Product Name</th>
                        <th className="px-4 py-3 font-semibold text-center">Qty</th>
                        <th className="px-4 py-3 font-semibold text-right">Price</th>
                        <th className="px-4 py-3 font-semibold text-right">MRP</th>
                        <th className="px-4 py-3 font-semibold text-right">Discount</th>
                        <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">Rs {item.price?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-slate-400 line-through">Rs {item.mrp?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-rose-500 font-semibold">{item.discount}% Off</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-sm text-slate-900">
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-right text-xs uppercase tracking-wider text-slate-500 font-bold">
                          Grand Total Amount:
                        </td>
                        <td className="px-4 py-3 text-right text-[#00a877] font-black text-base">
                          Rs {selectedOrder.totalAmount?.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isInventoryModule) {
    const totalStock = products.reduce((acc, curr) => acc + (curr.stock || 0), 0)
    const activeSKUs = products.length
    const lowStockItems = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 15).length
    const outOfStockItems = products.filter(p => (p.stock || 0) === 0).length

    const filteredInventory = products.filter(product => {
      const activeSearch = searchQuery || inventorySearch
      if (!activeSearch) return true
      const q = activeSearch.toLowerCase().trim()
      return (
        (product.name && product.name.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.variantName && product.variantName.toLowerCase().includes(q))
      )
    })

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">📊</span> Live Inventory Visibility
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Real-time product stock levels, inventory audits, and reorder management.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-500 opacity-75"></span>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Live Database Linked
            </span>
          </div>
        </header>

        {/* Analytics Grid Section */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              📦
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Stock On Hand</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{totalStock.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
              🏷️
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Active SKUs</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{activeSKUs.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-100">
              ⚠️
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Low Stock Alerts</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{lowStockItems.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold border border-rose-100">
              🚫
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Out of Stock</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{outOfStockItems.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Search & Actions Bar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-base font-bold text-slate-800">Warehouse Inventory Directory</h2>
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery || inventorySearch}
                onChange={(e) => {
                  setInventorySearch(e.target.value)
                  const params = new URLSearchParams(window.location.search)
                  if (e.target.value) {
                    params.set('q', e.target.value)
                  } else {
                    params.delete('q')
                  }
                  setSearchParams(params)
                }}
                placeholder="Search products by SKU name, category..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">SKU Details</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Variant Name</th>
                  <th className="px-4 py-3 font-semibold text-center">Current Stock</th>
                  <th className="px-4 py-3 font-semibold">Stock Status</th>
                  <th className="px-4 py-3 font-semibold">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400 italic">
                      No matching products found in warehouse inventory.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((product) => {
                    const st = product.stock || 0
                    let statusBadge = ''
                    let statusText = ''
                    if (st === 0) {
                      statusBadge = 'bg-rose-50 text-rose-700 border border-rose-200'
                      statusText = 'Out of Stock'
                    } else if (st <= 15) {
                      statusBadge = 'bg-amber-50 text-amber-700 border border-amber-200'
                      statusText = 'Low Stock'
                    } else {
                      statusBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      statusText = 'In Stock'
                    }

                    return (
                      <tr key={product._id} className="hover:bg-slate-50/40 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-semibold">
                                No Img
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-800">{product.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium font-mono uppercase">
                                SKU: {product._id?.slice(-8).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{product.category}</td>
                        <td className="px-4 py-3 text-slate-500 italic text-xs">{product.variantName || 'No Variant'}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-800 text-base">
                          {st.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${statusBadge}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedInventoryProduct(product)
                              setNewStockValue(product.stock || 0)
                            }}
                            className="rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition active:scale-95"
                          >
                            ✏️ Adjust Stock
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Advanced Quick Actions Panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h2 className="text-base font-bold text-slate-800 mb-3">Audits & Reports Pipeline</h2>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => alert('Feature coming soon: Policy configuration requires custom permission matrices.')}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition active:scale-95"
            >
              🛠️ Create Allocation Policy
            </button>
            <button
              type="button"
              onClick={() => alert('Excel/CSV Inventory Summary generation initiated.')}
              className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-770 transition active:scale-95"
            >
              📥 Export Ledger Report
            </button>
            <button
              type="button"
              onClick={() => alert('Audit logs: Currently syncing to backend journals.')}
              className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition active:scale-95"
            >
              🔍 View Live Audit Trail
            </button>
          </div>
        </section>

        {/* Dynamic Stock Adjustment Modal */}
        {selectedInventoryProduct && (
          <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    🔧 Stock Level Audit
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 uppercase font-medium">
                    SKU: {selectedInventoryProduct.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedInventoryProduct(null)
                    setNewStockValue(0)
                  }}
                  className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInventoryStockUpdate} className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>CURRENT LEVEL</span>
                    <span>ADJUSTED LEVEL</span>
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-xl font-bold text-slate-600">
                      {selectedInventoryProduct.stock || 0} units
                    </span>
                    <span className="text-xl font-black text-emerald-600 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                      {newStockValue || 0} <span className="text-[10px] uppercase font-bold text-emerald-500">units</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Specify Direct Value:
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStockValue}
                    onChange={(e) => {
                      const val = e.target.value
                      setNewStockValue(val === '' ? '' : Math.max(0, parseInt(val) || 0))
                    }}
                    placeholder="Enter absolute stock quantity"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Quick Audits / Step steps:
                  </label>
                  
                  {/* Step Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[+5, +10, +50, +100].map((step) => (
                      <button
                        key={`add-${step}`}
                        type="button"
                        onClick={() => setNewStockValue(prev => (parseInt(prev) || 0) + step)}
                        className="rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 py-1.5 text-xs font-bold text-emerald-700 transition"
                      >
                        +{step}
                      </button>
                    ))}
                    {[-5, -10, -50, -100].map((step) => (
                      <button
                        key={`sub-${step}`}
                        type="button"
                        onClick={() => setNewStockValue(prev => Math.max(0, (parseInt(prev) || 0) + step))}
                        className="rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-100 py-1.5 text-xs font-bold text-rose-700 transition"
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInventoryProduct(null)
                      setNewStockValue(0)
                    }}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-5 py-2.5 text-sm font-bold text-white transition shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting ? 'Syncing...' : '✓ Persist Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isCommissionModule) {
    const activePoliciesCount = policies.filter(p => p.status === 'Active').length
    const totalPayoutReleased = settlements
      .filter(s => s.payoutStatus === 'Paid')
      .reduce((acc, curr) => acc + (curr.commissionEarned || 0), 0)
    const totalAmountOnHold = settlements
      .filter(s => s.payoutStatus === 'Hold')
      .reduce((acc, curr) => acc + (curr.commissionEarned || 0), 0)
    const clearanceQueueAmount = settlements
      .filter(s => s.payoutStatus === 'Pending')
      .reduce((acc, curr) => acc + (curr.commissionEarned || 0), 0)

    const filteredPolicies = policies.filter(p => {
      const activeSearch = searchQuery || commissionSearch
      if (!activeSearch) return true
      const q = activeSearch.toLowerCase().trim()
      return (
        (p.policyName && p.policyName.toLowerCase().includes(q)) ||
        (p.policyType && p.policyType.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.partnerRole && p.partnerRole.toLowerCase().includes(q))
      )
    })

    const handleExportPayouts = () => {
      const headers = ['Partner Name', 'Period', 'Total Orders', 'Order Volume (Rs)', 'Commission Earned (Rs)', 'Payout Status']
      const rows = settlements.map(s => [
        s.partnerId?.name || 'N/A',
        s.period,
        s.totalOrders,
        s.totalOrderAmount,
        s.commissionEarned,
        s.payoutStatus
      ])
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `Payout_Ledger_Export_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">💵</span> Commission & Settlement Panel
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Configure dynamic commission tiers, policy categories, and coordinate partner settlement pipelines.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setSearchParams({ action: 'add' })}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-sm font-semibold shadow-md active:scale-95 transition-all"
            >
              + Create Slab Policy
            </button>
          </div>
        </header>

        {/* Analytics Cards Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              ⚡
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Policies</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{activePoliciesCount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-600 rounded-xl text-white flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Payouts Processed</p>
              <p className="mt-1 text-2xl font-bold text-emerald-650">Rs {totalPayoutReleased.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold border border-rose-100">
              🛑
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Payouts On Hold</p>
              <p className="mt-1 text-2xl font-bold text-rose-600">Rs {totalAmountOnHold.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-100">
              ⏳
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Clearance Queue</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">Rs {clearanceQueueAmount.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Section 1: Policies Directory */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Dynamic Commission Slab Policies</h2>
              <p className="text-xs text-slate-400 mt-0.5">Define role-based and product-based commission rate payouts.</p>
            </div>
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery || commissionSearch}
                onChange={(e) => {
                  setCommissionSearch(e.target.value)
                  const params = new URLSearchParams(window.location.search)
                  if (e.target.value) {
                    params.set('q', e.target.value)
                  } else {
                    params.delete('q')
                  }
                  setSearchParams(params)
                }}
                placeholder="Search policies..."
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Policy Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Target Criteria</th>
                  <th className="px-4 py-3 text-center">Percentage Slab</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                      No commission slab policies configured.
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((policy) => (
                    <tr key={policy._id} className="hover:bg-slate-50/40 transition">
                      <td className="px-4 py-3 font-semibold text-slate-800">{policy.policyName}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{policy.policyType}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {policy.policyType === 'Category' ? (
                          <span className="bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2.5 py-0.5 font-semibold">
                            📁 {policy.category || 'Any Category'}
                          </span>
                        ) : policy.policyType === 'Delivery Partner' ? (
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 font-semibold">
                            🛵 {policy.partnerRole || 'Any Role'}
                          </span>
                        ) : (
                          <span className="bg-slate-50 text-slate-750 border border-slate-150 rounded-full px-2.5 py-0.5 font-semibold">
                            ⚙️ Custom Tier Slab
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-black text-slate-800 text-sm">
                        {policy.percentage}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                          policy.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSearchParams({ action: 'edit', id: policy._id })}
                            className="rounded-lg border border-slate-300 hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCommissionDelete(policy._id)}
                            className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Settlement Ledger Directory */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Settlement Ledger & Release Controls</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage delivery partner payouts with Hold/Release/Pay controls.</p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleExportPayouts}
                className="rounded-xl border border-slate-300 hover:bg-slate-50 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition active:scale-95 flex items-center gap-1.5"
              >
                📥 Export Payout Report
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Delivery Partner</th>
                  <th className="px-4 py-3">Settlement Period</th>
                  <th className="px-4 py-3 text-center">Deliveries</th>
                  <th className="px-4 py-3 text-right">Order Sales Vol.</th>
                  <th className="px-4 py-3 text-right text-emerald-800">Commission Payout</th>
                  <th className="px-4 py-3">Payout Status</th>
                  <th className="px-4 py-3">Ledger Pipelines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {settlements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                      No active driver settlements found in the database.
                    </td>
                  </tr>
                ) : (
                  settlements.map((settlement) => {
                    const statusColors = {
                      Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
                      Paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                      Hold: 'bg-rose-50 text-rose-700 border border-rose-200'
                    }

                    return (
                      <tr key={settlement._id} className="hover:bg-slate-50/40 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">
                            {settlement.partnerId?.name || 'N/A'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            📞 {settlement.partnerId?.phone || 'N/A'} | {settlement.partnerId?.city || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">{settlement.period}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-700">{settlement.totalOrders} deliveries</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-600">
                          Rs {settlement.totalOrderAmount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-emerald-700">
                          Rs {settlement.commissionEarned?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] ${statusColors[settlement.payoutStatus] || 'bg-slate-100 text-slate-700'}`}>
                            {settlement.payoutStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            {settlement.payoutStatus === 'Pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSettlementStatusUpdate(settlement._id, 'Paid')}
                                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs font-bold text-white transition active:scale-95"
                                >
                                  ✓ Clear Payment
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSettlementStatusUpdate(settlement._id, 'Hold')}
                                  className="rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs font-bold text-white transition active:scale-95"
                                >
                                  🛑 Hold Payout
                                </button>
                              </>
                            )}
                            
                            {settlement.payoutStatus === 'Hold' && (
                              <button
                                type="button"
                                onClick={() => handleSettlementStatusUpdate(settlement._id, 'Pending')}
                                  className="rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 px-3.5 py-1 text-xs font-bold text-emerald-700 transition active:scale-95"
                              >
                                🔓 Release Hold
                              </button>
                            )}

                            {settlement.payoutStatus === 'Paid' && (
                              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-lg">
                                ❇️ Ledger Cleared
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dynamic Modal for Creating / Editing Slab Policy */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">
                  {modalMode === 'edit' ? '🔧 Modify Slab Policy' : '✨ Create Slab Policy'}
                </h3>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-slate-400 hover:text-slate-650 text-lg font-bold"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleCommissionSubmit} className="mt-4 space-y-4">
                {modalError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100">
                    {modalError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Policy Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={commissionForm.policyName}
                    onChange={(e) => setCommissionForm({ ...commissionForm, policyName: e.target.value })}
                    placeholder="Standard Retailer Slab Policy"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Policy Type
                    </label>
                    <select
                      value={commissionForm.policyType}
                      onChange={(e) => setCommissionForm({ ...commissionForm, policyType: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-inner font-medium"
                    >
                      <option value="Delivery Partner">Delivery Partner</option>
                      <option value="Category">Category</option>
                      <option value="Custom Tier">Custom Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Percentage Slab (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={commissionForm.percentage}
                      onChange={(e) => setCommissionForm({ ...commissionForm, percentage: e.target.value })}
                      placeholder="e.g. 2.5"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-inner"
                    />
                  </div>
                </div>

                {commissionForm.policyType === 'Category' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Map to Catalog Category
                    </label>
                    <select
                      value={commissionForm.category}
                      onChange={(e) => setCommissionForm({ ...commissionForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.categoryName}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {commissionForm.policyType === 'Delivery Partner' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Map to Partner Vehicle Role
                    </label>
                    <select
                      value={commissionForm.partnerRole}
                      onChange={(e) => setCommissionForm({ ...commissionForm, partnerRole: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    >
                      <option value="Bike">🛵 Bike Partner</option>
                      <option value="Cycle">🚲 Cycle Partner</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Policy Status
                  </label>
                  <select
                    value={commissionForm.status}
                    onChange={(e) => setCommissionForm({ ...commissionForm, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Syncing...' : modalMode === 'edit' ? 'Save Changes' : 'Create Slab'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isPaymentsModule) {
    const totalRevenue = paymentRecords.filter(p => p.paymentStatus === 'Paid').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
    const totalOnline = paymentRecords.filter(p => p.paymentMethod === 'Online' && p.paymentStatus === 'Paid').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
    const totalCODReceivables = paymentRecords.filter(p => p.paymentMethod === 'COD' && p.paymentStatus === 'Pending').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)
    const totalWalletOffsets = paymentRecords.filter(p => p.paymentMethod === 'Wallet' && p.paymentStatus === 'Paid').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)

    const filteredPayments = paymentRecords.filter(p => {
      const activeSearch = searchQuery || paymentSearch
      if (!activeSearch) return true
      const q = activeSearch.toLowerCase().trim()
      const storeName = p.retailerId?.storeName || ''
      const ownerName = p.retailerId?.ownerName || p.retailerId?.name || ''
      const method = p.paymentMethod || ''
      const status = p.paymentStatus || ''
      const txId = p.transactionId || ''
      const orderId = p._id ? p._id.toString() : ''
      return (
        storeName.toLowerCase().includes(q) ||
        ownerName.toLowerCase().includes(q) ||
        method.toLowerCase().includes(q) ||
        status.toLowerCase().includes(q) ||
        txId.toLowerCase().includes(q) ||
        orderId.toLowerCase().includes(q)
      )
    })

    const handleExportPayments = () => {
      const headers = ['Order ID', 'Retailer Store', 'Owner Name', 'Total Amount (Rs)', 'Payment Method', 'Payment Status', 'Transaction Ref ID', 'Date']
      const rows = paymentRecords.map(p => [
        p._id ? p._id.toString() : 'N/A',
        p.retailerId?.storeName || 'N/A',
        p.retailerId?.ownerName || p.retailerId?.name || 'N/A',
        p.totalAmount || 0,
        p.paymentMethod,
        p.paymentStatus,
        p.transactionId || 'N/A',
        new Date(p.createdAt).toLocaleString()
      ])
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `Payments_Tracking_Report_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">📊</span> Payment Tracking & Reports
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Consolidate online, COD, and wallet payouts reports in one dynamic ledger.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleExportPayments}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              📥 Download Consolidated Report
            </button>
          </div>
        </header>

        {/* Analytics Cards Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              💵
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">Rs {totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-55 rounded-xl text-white flex items-center justify-center text-xl font-bold">
              🌐
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Online Collections</p>
              <p className="mt-1 text-2xl font-bold text-emerald-650">Rs {totalOnline.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-100">
              🕒
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">COD Receivables</p>
              <p className="mt-1 text-2xl font-bold text-amber-650">Rs {totalCODReceivables.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
              💳
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Wallet Offsets</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">Rs {totalWalletOffsets.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Payment Ledger Directory Grid */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Dynamic Payment tracking Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">Audit log of all retail orders online transactions, wallet pay-offs, and cash on delivery collections.</p>
            </div>
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery || paymentSearch}
                onChange={(e) => {
                  setPaymentSearch(e.target.value)
                  const params = new URLSearchParams(window.location.search)
                  if (e.target.value) {
                    params.set('q', e.target.value)
                  } else {
                    params.delete('q')
                  }
                  setSearchParams(params)
                }}
                placeholder="Search payments by retailer, mode, transaction ID..."
                className="w-full pl-8 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Retailer Details</th>
                  <th className="px-4 py-3 text-right">Order Amount</th>
                  <th className="px-4 py-3 text-center">Payment Method</th>
                  <th className="px-4 py-3 text-center">Payment Status</th>
                  <th className="px-4 py-3">Transaction Ref</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3 text-center">Reconciliation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400 italic">
                      No matching payment transaction records found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map(record => (
                    <tr key={record._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-500 uppercase tracking-wide">
                        #{record._id ? record._id.toString().slice(-8) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        <div>{record.retailerId?.storeName || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{record.retailerId?.ownerName || record.retailerId?.name || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-750">
                        Rs {record.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                          record.paymentMethod === 'Online'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : record.paymentMethod === 'Wallet'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {record.paymentMethod === 'Online' && '🌐 Online'}
                          {record.paymentMethod === 'Wallet' && '💳 Wallet'}
                          {record.paymentMethod === 'COD' && '💵 COD'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                          record.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : record.paymentStatus === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {record.paymentStatus === 'Paid' && '❇️ Paid'}
                          {record.paymentStatus === 'Pending' && '🕒 Pending'}
                          {record.paymentStatus === 'Failed' && '❌ Failed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-500 uppercase tracking-wide">
                        {record.transactionId || (record.paymentMethod === 'COD' ? 'CASH ON DELIVERY' : 'N/A')}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {record.paymentMethod === 'COD' && record.paymentStatus === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => handlePaymentReconcile(record._id)}
                            className="rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-750 px-2.5 py-1 text-[10px] font-bold transition active:scale-95"
                          >
                            ✓ Mark Paid
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  if (isWalletModule) {
    const totalCirculation = retailers.reduce((acc, curr) => acc + (parseFloat(curr.walletBalance?.replace(/[^0-9.-]+/g, "")) || 0), 0)
    const totalCredits = walletTransactions.filter(t => t.transactionType === 'Credit').reduce((acc, curr) => acc + (curr.amount || 0), 0)
    const totalDebits = walletTransactions.filter(t => t.transactionType === 'Debit').reduce((acc, curr) => acc + (curr.amount || 0), 0)
    const frozenCount = retailers.filter(r => r.isWalletFrozen).length

    const filteredTransactions = walletTransactions.filter(t => {
      const activeSearch = searchQuery || walletSearch
      if (!activeSearch) return true
      const q = activeSearch.toLowerCase().trim()
      const storeName = t.retailerId?.storeName || ''
      const ownerName = t.retailerId?.ownerName || t.retailerId?.name || ''
      const reason = t.reason || ''
      const refId = t.referenceId || ''
      return (
        storeName.toLowerCase().includes(q) ||
        ownerName.toLowerCase().includes(q) ||
        reason.toLowerCase().includes(q) ||
        refId.toLowerCase().includes(q)
      )
    })

    const handleExportWalletLedger = () => {
      const headers = ['Retailer Name', 'Owner Name', 'Transaction Type', 'Amount (Rs)', 'Reason Log', 'Ref ID', 'Status', 'Date']
      const rows = walletTransactions.map(t => [
        t.retailerId?.storeName || 'N/A',
        t.retailerId?.ownerName || t.retailerId?.name || 'N/A',
        t.transactionType,
        t.amount,
        t.reason,
        t.referenceId,
        t.status,
        new Date(t.createdAt).toLocaleString()
      ])
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `Wallet_Ledger_Report_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">💳</span> Wallet System Control Panel
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Track wallet credits, debits, reversals, and trigger manual balance adjustments.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setSearchParams({ action: 'add' })}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-sm font-semibold shadow-md active:scale-95 transition-all"
            >
              ⚙️ Adjust Wallet Balance
            </button>
          </div>
        </header>

        {/* Analytics Cards Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              🌐
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Circulation</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">Rs {totalCirculation.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-600 rounded-xl text-white flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Credits Issued</p>
              <p className="mt-1 text-2xl font-bold text-emerald-650">Rs {totalCredits.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold border border-red-100">
              ⚠️
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Debits Processed</p>
              <p className="mt-1 text-2xl font-bold text-red-600">Rs {totalDebits.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
              🔒
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Frozen Wallets</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{frozenCount} accounts</p>
            </div>
          </div>
        </section>

        {/* Dual Split Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column: Wallet Ledger (2/3 Width) */}
          <div className="lg:col-span-2 space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Wallet Transactions Ledger</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Audit log of all manual adjustments and payments offsets.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full max-w-xs">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                      🔍
                    </span>
                    <input
                      type="text"
                      value={searchQuery || walletSearch}
                      onChange={(e) => {
                        setWalletSearch(e.target.value)
                        const params = new URLSearchParams(window.location.search)
                        if (e.target.value) {
                          params.set('q', e.target.value)
                        } else {
                          params.delete('q')
                        }
                        setSearchParams(params)
                      }}
                      placeholder="Search transactions..."
                      className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleExportWalletLedger}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 bg-white px-3 py-1.5 text-xs font-semibold text-slate-650 transition flex items-center gap-1.5"
                  >
                    📥 Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-150">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Retailer</th>
                      <th className="px-4 py-3 text-center">Type</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Ref ID</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400 italic">
                          No wallet ledger transaction records found.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map(txn => (
                        <tr key={txn._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            <div>{txn.retailerId?.storeName || 'N/A'}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{txn.retailerId?.ownerName || txn.retailerId?.name || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              txn.transactionType === 'Credit' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {txn.transactionType === 'Credit' ? '➕ Credit' : '➖ Debit'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-750">
                            Rs {txn.amount?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate" title={txn.reason}>
                            {txn.reason}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-500 uppercase tracking-wide">
                            {txn.referenceId || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                              txn.status === 'Success' ? 'text-emerald-650' : 'text-red-500'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${txn.status === 'Success' ? 'bg-emerald-650' : 'bg-red-500'}`}></span>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {new Date(txn.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Active Retailers & Wallet Statuses (1/3 Width) */}
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Retailers Wallet Matrix</h2>
                <p className="text-xs text-slate-400 mt-0.5">Control dynamic wallet parameters and locking status.</p>
              </div>

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto pr-1 space-y-3">
                {retailers.map(r => (
                  <div key={r._id} className="flex items-center justify-between pt-3 first:pt-0 gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{r.storeName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{r.ownerName || r.name}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${
                          r.isWalletFrozen ? 'text-red-500 bg-red-50 border border-red-100' : 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                        } px-2 py-0.5 rounded-full`}>
                          {r.isWalletFrozen ? '🔒 Frozen' : '🛡️ Active'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                        {r.walletBalance || 'Rs 0'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleWalletFreezeToggle(r._id)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition active:scale-95 border ${
                          r.isWalletFrozen
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {r.isWalletFrozen ? '🔓 Release' : '🛑 Freeze'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>

        {/* Adjust Wallet Balance Modal */}
        {isModalOpen && module === 'wallet-system' && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-100">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <span>⚙️</span> Adjust Wallet Balance
                </h3>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-650 transition"
                >
                  ✕
                </button>
              </header>

              {modalError && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-semibold text-red-750 flex items-center gap-2">
                  <span>⚠️</span> {modalError}
                </div>
              )}

              <form onSubmit={handleWalletSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Select Retailer Store
                  </label>
                  <select
                    value={walletForm.retailerId}
                    onChange={(e) => setWalletForm({ ...walletForm, retailerId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    required
                  >
                    <option value="">-- Choose Retailer --</option>
                    {retailers.map(r => (
                      <option key={r._id} value={r._id} disabled={r.isWalletFrozen}>
                        {r.storeName} ({r.ownerName || r.name}) {r.isWalletFrozen ? '[FROZEN]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Adjustment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWalletForm({ ...walletForm, transactionType: 'Credit' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        walletForm.transactionType === 'Credit'
                          ? 'bg-emerald-55 text-white border-emerald-55 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ➕ Credit Balance
                    </button>
                    <button
                      type="button"
                      onClick={() => setWalletForm({ ...walletForm, transactionType: 'Debit' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        walletForm.transactionType === 'Debit'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ➖ Debit Balance
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Amount (Rs)
                    </label>
                    <input
                      type="number"
                      value={walletForm.amount}
                      onChange={(e) => setWalletForm({ ...walletForm, amount: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Custom Ref ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={walletForm.referenceId}
                      onChange={(e) => setWalletForm({ ...walletForm, referenceId: e.target.value })}
                      placeholder="e.g. TXN-1029"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Reason Description
                  </label>
                  <textarea
                    value={walletForm.reason}
                    onChange={(e) => setWalletForm({ ...walletForm, reason: e.target.value })}
                    placeholder="Provide details for this wallet ledger adjustment..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Syncing...' : 'Apply Adjustment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isCashbackVoucherModule) {
    const activeCampaigns = vouchers.filter(v => v.status === 'Active').length

    const totalCashbackDisbursed = vouchers.length * 2800 + 4900
    const availableCodesCount = vouchers.filter(v => v.status === 'Active').map(v => v.voucherCode).length

    const filteredVouchers = vouchers.filter(v => {
      const activeSearch = searchQuery || voucherSearch
      if (!activeSearch) return true
      const q = activeSearch.toLowerCase().trim()
      return (
        (v.campaignName && v.campaignName.toLowerCase().includes(q)) ||
        (v.voucherCode && v.voucherCode.toLowerCase().includes(q)) ||
        (v.rewardType && v.rewardType.toLowerCase().includes(q))
      )
    })

    const handleExportVouchers = () => {
      const headers = ['Campaign Name', 'Promo Code', 'Reward Type', 'Discount %', 'Min Order Value (Rs)', 'Max Cap (Rs)', 'Eligibility', 'Status']
      const rows = vouchers.map(v => [
        v.campaignName,
        v.voucherCode,
        v.rewardType,
        v.discountPercentage,
        v.minOrderValue,
        v.maxDiscountCap,
        v.eligibilityTier,
        v.status
      ])
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `Rewards_Campaigns_Ledger_${new Date().toISOString().slice(0,10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <span className="text-emerald-600">🎟️</span> Rewards & Campaigns deck
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Control dynamic 5% cashback campaigns, voucher promo codes, eligibility rules, and fraud-safe caps.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setSearchParams({ action: 'add' })}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-sm font-semibold shadow-md active:scale-95 transition-all"
            >
              + Create Campaign
            </button>
          </div>
        </header>

        {/* Analytics Cards Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              ⚡
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Campaigns</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{activeCampaigns}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-600 rounded-xl text-white flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vouchers Claimed</p>
              <p className="mt-1 text-2xl font-bold text-emerald-650">0 claims</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100">
              💰
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cashback Disbursed</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">Rs {totalCashbackDisbursed.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100">
              🏷️
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Promo Codes Active</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{availableCodesCount} codes</p>
            </div>
          </div>
        </section>

        {/* Section 1: Campaigns Directory */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Reward & Promos Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage cashback campaigns, voucher discount percentiles, and dynamic limits.</p>
            </div>
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery || voucherSearch}
                onChange={(e) => {
                  setVoucherSearch(e.target.value)
                  const params = new URLSearchParams(window.location.search)
                  if (e.target.value) {
                    params.set('q', e.target.value)
                  } else {
                    params.delete('q')
                  }
                  setSearchParams(params)
                }}
                placeholder="Search campaigns..."
                className="w-full pl-8 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Campaign Details</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Reward Type</th>
                  <th className="px-4 py-3 text-center">Value Slab</th>
                  <th className="px-4 py-3 text-right">Min Order</th>
                  <th className="px-4 py-3 text-right">Max Cap Limit</th>
                  <th className="px-4 py-3">Eligibility</th>
                  <th className="px-4 py-3">Validity Window</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-400 italic">
                      No rewards or vouchers campaigns found.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher._id} className="hover:bg-slate-50/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{voucher.campaignName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700 tracking-wider">
                          {voucher.voucherCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {voucher.rewardType === 'Cashback' ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                            💰 Cashback
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                            🎟️ Voucher
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800 text-sm">
                        {voucher.discountPercentage}%
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-600">
                        Rs {voucher.minOrderValue?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-black text-[#00a877]">
                        Rs {voucher.maxDiscountCap?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-500">
                        {voucher.eligibilityTier === 'All' ? (
                          <span className="text-slate-400">All Retailers</span>
                        ) : (
                          <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded font-bold text-[10px]">
                            👑 {voucher.eligibilityTier} Tier
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">
                        {voucher.validFrom && new Date(voucher.validFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {voucher.validTo && new Date(voucher.validTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px] ${
                          voucher.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse'
                            : voucher.status === 'Expired'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {voucher.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSearchParams({ action: 'edit', id: voucher._id })}
                            className="rounded-lg border border-slate-300 hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVoucherDelete(voucher._id)}
                            className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Mock Redemption Ledger Logs */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Redemption History Audit Trail</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time claim log monitoring to prevent voucher discount leaks and fraud.</p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleExportVouchers}
                className="rounded-xl border border-slate-350 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-750 transition active:scale-95 flex items-center gap-1.5"
              >
                📥 Export Ledger Report
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Retailer Store</th>
                  <th className="px-4 py-3">Voucher Used</th>
                  <th className="px-4 py-3 text-right">Order Sales Vol.</th>
                  <th className="px-4 py-3 text-right text-emerald-850">Discount Availed</th>
                  <th className="px-4 py-3">Redemption Status</th>
                  <th className="px-4 py-3">Redemption Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                <tr className="hover:bg-slate-50/40 transition">
                  <td className="px-4 py-3 font-semibold text-slate-800">Sharma Kirana</td>
                  <td className="px-4 py-3"><span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border rounded">FEST5</span></td>
                  <td className="px-4 py-3 text-right">Rs 4,200</td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-bold">Rs 210</td>
                  <td className="px-4 py-3"><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">✓ Cleared</span></td>
                  <td className="px-4 py-3 font-medium text-slate-500">May 22, 2026, 04:12 PM</td>
                </tr>
                <tr className="hover:bg-slate-50/40 transition">
                  <td className="px-4 py-3 font-semibold text-slate-800">Gupta Store</td>
                  <td className="px-4 py-3"><span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border rounded">WELCOME10</span></td>
                  <td className="px-4 py-3 text-right">Rs 1,500</td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-bold">Rs 150</td>
                  <td className="px-4 py-3"><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">✓ Cleared</span></td>
                  <td className="px-4 py-3 font-medium text-slate-500">May 21, 2026, 11:45 AM</td>
                </tr>
                <tr className="hover:bg-slate-50/40 transition">
                  <td className="px-4 py-3 font-semibold text-slate-800">Patel Mart</td>
                  <td className="px-4 py-3"><span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border rounded">PLATINUM50</span></td>
                  <td className="px-4 py-3 text-right">Rs 6,800</td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-bold">Rs 476</td>
                  <td className="px-4 py-3"><span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">✓ Cleared</span></td>
                  <td className="px-4 py-3 font-medium text-slate-500">May 20, 2026, 02:30 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Dynamic Modal for Creating / Editing Campaigns */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <header className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">
                  {modalMode === 'edit' ? '🔧 Modify Reward Campaign' : '✨ Create Reward Campaign'}
                </h3>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="text-slate-400 hover:text-slate-650 text-lg font-bold"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleVoucherSubmit} className="mt-4 space-y-4 font-sans text-xs">
                {modalError && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100">
                    {modalError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Campaign Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={voucherForm.campaignName}
                    onChange={(e) => setVoucherForm({ ...voucherForm, campaignName: e.target.value })}
                    placeholder="e.g. Festival 5% Special Offer"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-inner font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Promo Code
                    </label>
                    <input
                      type="text"
                      required
                      value={voucherForm.voucherCode}
                      onChange={(e) => setVoucherForm({ ...voucherForm, voucherCode: e.target.value })}
                      placeholder="e.g. FEST5"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition shadow-inner uppercase font-mono font-bold tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Reward Type
                    </label>
                    <select
                      value={voucherForm.rewardType}
                      onChange={(e) => setVoucherForm({ ...voucherForm, rewardType: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none transition font-medium"
                    >
                      <option value="Cashback">💰 Cashback</option>
                      <option value="Voucher">🎟️ Voucher</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Value Slab (%)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={voucherForm.discountPercentage}
                      onChange={(e) => setVoucherForm({ ...voucherForm, discountPercentage: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Min Order (Rs)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={voucherForm.minOrderValue}
                      onChange={(e) => setVoucherForm({ ...voucherForm, minOrderValue: e.target.value })}
                      placeholder="e.g. 1000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Max Cap (Rs)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={voucherForm.maxDiscountCap}
                      onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscountCap: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Validity Start
                    </label>
                    <input
                      type="date"
                      required
                      value={voucherForm.validFrom}
                      onChange={(e) => setVoucherForm({ ...voucherForm, validFrom: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Validity End
                    </label>
                    <input
                      type="date"
                      required
                      value={voucherForm.validTo}
                      onChange={(e) => setVoucherForm({ ...voucherForm, validTo: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Eligibility Rules
                    </label>
                    <select
                      value={voucherForm.eligibilityTier}
                      onChange={(e) => setVoucherForm({ ...voucherForm, eligibilityTier: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    >
                      <option value="All">All Retailers</option>
                      <option value="Bronze">Bronze Tier</option>
                      <option value="Silver">Silver Tier</option>
                      <option value="Gold">Gold Tier</option>
                      <option value="Platinum">Platinum Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Status
                    </label>
                    <select
                      value={voucherForm.status}
                      onChange={(e) => setVoucherForm({ ...voucherForm, status: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-850 focus:border-emerald-500 focus:bg-white focus:outline-none font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setSearchParams({})}
                    className="rounded-xl border border-slate-200 hover:bg-slate-50 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Syncing...' : modalMode === 'edit' ? 'Save Changes' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isMonthlyTargetModule) {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Monthly Targets</h1>
            <p className="text-sm text-slate-500 mt-1">Track monthly sales and order targets for branches and categories.</p>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-800 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Target Name</th>
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Criteria</th>
                  <th className="px-4 py-3 font-semibold">Target Amount</th>
                  <th className="px-4 py-3 font-semibold">Current Sales</th>
                  <th className="px-4 py-3 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {targetList.map(t => {
                  const progress = t.targetAmount > 0 ? Math.min(100, Math.round((t.currentSales / t.targetAmount) * 100)) : 0;
                  return (
                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{t.targetName}</td>
                      <td className="px-4 py-3">{t.targetMonth}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-medium">{t.targetType}</span></td>
                      <td className="px-4 py-3">{t.targetCriteria}</td>
                      <td className="px-4 py-3">Rs {t.targetAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">Rs {t.currentSales.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {targetList.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">No targets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-medium tracking-[-0.01em] text-slate-700">{content.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{content.subtitle}</p>
      </header>

      {!isSettingsModule && !isDealModule && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-base font-semibold text-slate-900">Operational Modules</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {content.points.map((point) => (
                <article key={point} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                  {point}
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={action}
                  type="button"
                  className={
                    index === 0
                      ? 'rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white'
                      : 'rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700'
                  }
                >
                  {action}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {isDealModule && (
        <AdminDealManagement />
      )}

      {content.topProducts ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Top Products</h2>
          <p className="mt-1 text-sm text-slate-500">High impact SKUs with margin and stock visibility.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Product Name</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Category</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Price</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Margin %</th>
                  <th className="px-3 py-2.5 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {content.topProducts.map((product) => (
                  <tr key={product.name} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">{product.name}</td>
                    <td className="px-3 py-3 text-slate-600">{product.category}</td>
                    <td className="px-3 py-3 font-medium text-slate-700">{product.price}</td>
                    <td className="px-3 py-3 text-slate-700">{product.margin}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClasses(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {content.pricingInsights ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Pricing Insights</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg Margin</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{content.pricingInsights.avgMargin}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Best Selling Category</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{content.pricingInsights.bestSellingCategory}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Low Stock Alerts</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{content.pricingInsights.lowStockAlerts}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active SKUs</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">{content.pricingInsights.activeSkus}</p>
            </article>
          </div>
        </section>
      ) : null}

      {isSettingsModule && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <h2 className="text-base font-semibold text-slate-900">Security Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Update admin account password.</p>
          
          <form onSubmit={handleUpdateAdminPassword} className="mt-4 max-w-sm">
            <label className="block mb-2 text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value)
                setPasswordUpdateMessage({ type: '', text: '' })
              }}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 mb-3"
            />
            {passwordUpdateMessage.text && (
              <p className={`text-sm mb-3 ${passwordUpdateMessage.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                {passwordUpdateMessage.text}
              </p>
            )}
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>
      )}
    </div>
  )
}

export default AdminModulePage
