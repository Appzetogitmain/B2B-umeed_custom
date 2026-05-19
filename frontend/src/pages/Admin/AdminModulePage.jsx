import { useState, useEffect } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { adminModuleContent } from '../../data/adminModules'

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
  vehicleType: 'Bike',
  vehicleNumber: '',
  city: '',
  status: 'Active',
  totalDeliveries: 0,
  earnings: 'Rs 0',
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
  const [retailers, setRetailers] = useState([])
  const [partners, setPartners] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [retailerForm, setRetailerForm] = useState(retailerInitialForm)
  const [partnerForm, setPartnerForm] = useState(partnerInitialForm)
  const [categoryForm, setCategoryForm] = useState({ categoryName: '', image: '' })
  const [bannerForm, setBannerForm] = useState({ title: '', description: '', image: '' })
  const [modalError, setModalError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

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

  useEffect(() => {
    if (isRetailerModule) {
      fetchRetailers()
    }
  }, [isRetailerModule])

  const fetchRetailers = async () => {
    try {
      const response = await fetch('http://localhost:5200/api/v1/auth/admin/retailers')
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
      const response = await fetch('http://localhost:5200/api/v1/partners')
      if (!response.ok) throw new Error('Failed to fetch partners')
      const data = await response.json()
      const formatted = data.map(p => ({ ...p, id: p._id }))
      setPartners(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isCategoryModule) {
      fetchCategories()
    }
  }, [isCategoryModule])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5200/api/v1/categories')
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
      const response = await fetch('http://localhost:5200/api/v1/banners')
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

  if (!content) {
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
        response = await fetch('http://localhost:5200/api/v1/auth/admin/retailers', {
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
        response = await fetch('http://localhost:5200/api/v1/categories', {
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
        response = await fetch('http://localhost:5200/api/v1/banners', {
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
        response = await fetch('http://localhost:5200/api/v1/partners', {
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

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-medium tracking-[-0.01em] text-slate-700">{content.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{content.subtitle}</p>
      </header>

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
    </div>
  )
}

export default AdminModulePage
