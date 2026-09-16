import { getBackendUrl } from '../../utils/api';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Image as ImageIcon, UploadCloud } from 'lucide-react'
import urLogo from '../../assets/ur.png'
import { requestNotificationPermission } from '../../utils/firebase'

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    shopType: '',
    businessDocumentType: '',
    businessDocumentPhoto: '',
    photo: '',
    city: '',
    deliveryAddress: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [showPhotoOptions, setShowPhotoOptions] = useState(false)
  const [showDocPhotoOptions, setShowDocPhotoOptions] = useState(false)
  const navigate = useNavigate()

  const [error, setError] = useState('')

  const handleChange = (event) => {
    let { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      shopName: form.shopName.trim(),
    }

    if (!payload.name || !payload.email || !payload.password || !payload.shopName) {
      setError('Please provide Name, Email, Password, and Store Name')
      return
    }

    if (payload.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/auth/retailer/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        const match = text.match(/<title>(.*?)<\/title>/i);
        const errorMsg = match ? match[1] : 'Server returned an invalid HTML response';
        throw new Error(`Server Error: ${errorMsg}. Please check server limits.`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setSubmitting(false)
      localStorage.setItem('umeed-retailer', JSON.stringify(data))

      requestNotificationPermission('retailer', data.token)
      navigate('/retailer/home')
    } catch (err) {
      setSubmitting(false)
      setError(err.message)
    }
  }

  // Generic Camera/File handlers
  const handleCameraSelect = async (field) => {
    if (window.flutter_inappwebview) {
      try {
        const response = await window.flutter_inappwebview.callHandler('openCamera');
        if (response && response.success && response.base64) {
          const mimeType = response.mimeType || 'image/jpeg';
          const base64Image = `data:${mimeType};base64,${response.base64}`;
          setForm(prev => ({ ...prev, [field]: base64Image }));
        }
      } catch (err) {
        console.error('Camera error:', err);
        alert('Failed to open camera: ' + err.message);
      }
    } else {
      alert('Camera feature is only available in the Umeed Retailer App.');
    }
    setShowPhotoOptions(false);
    setShowDocPhotoOptions(false);
  }

  const handleFileSelect = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    setShowPhotoOptions(false);
    setShowDocPhotoOptions(false);
  }

  return (
    <div className="screen-shell flex h-dvh flex-col overflow-y-auto overflow-x-hidden pb-16 bg-[#F8FAFC]">
      <header className="bg-white px-5 pt-6 pb-4 flex items-center shadow-sm border-b border-slate-100">
        <button
          onClick={() => navigate('/retailer/auth')}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 transition-all active:scale-95 border border-slate-200"
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="ml-4 text-xl font-bold text-slate-800">Set up your store profile</h1>
      </header>

      <div className="px-5 pt-6 pb-12">
        <p className="text-sm text-slate-500 mb-8 text-center max-w-xs mx-auto">
          We'll use this to verify and activate your account
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-500 border border-red-200">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-600">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="E.g. Mohan Kumar"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="E.g. mohan@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
            />
          </div>

          <div>
            <label htmlFor="shopName" className="mb-2 block text-sm font-medium text-slate-600">
              Store name
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              placeholder="E.g. Mohan General Store"
              value={form.shopName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-600">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="E.g. Indore, Bhopal"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
            />
          </div>

          <div>
            <label htmlFor="deliveryAddress" className="mb-2 block text-sm font-medium text-slate-600">
              Delivery Address
            </label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              placeholder="Full address of your store"
              rows="2"
              value={form.deliveryAddress}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
            />
          </div>

          <div>
            <label htmlFor="shopType" className="mb-2 block text-sm font-medium text-slate-600">
              What type of store do you run?
            </label>
            <div className="relative">
              <select
                id="shopType"
                name="shopType"
                value={form.shopType}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
              >
                <option value="">Select Business</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="businessDocumentType" className="mb-2 block text-sm font-medium text-slate-600">
              Business document
            </label>
            <div className="relative">
              <select
                id="businessDocumentType"
                name="businessDocumentType"
                value={form.businessDocumentType}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 focus:border-[#00a877] focus:outline-none focus:ring-1 focus:ring-[#00a877]"
              >
                <option value="">Select Document</option>
                <option value="GST Certificate">GST Certificate</option>
                <option value="Trade License">Trade License</option>
                <option value="FSSAI License">FSSAI License</option>
                <option value="Shop Act License">Shop Act License</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-600">Upload document</label>
            <div className="flex flex-wrap gap-4">
              {form.businessDocumentPhoto ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img src={form.businessDocumentPhoto} alt="Business Doc" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, businessDocumentPhoto: '' }))}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => handleCameraSelect('businessDocumentPhoto')}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#00a877] text-[#00a877] hover:bg-emerald-50 rounded-xl px-3 py-2.5 text-sm font-medium transition"
                  >
                    <Camera size={18} /> Take Photo
                  </button>
                  <label className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer">
                    <UploadCloud size={18} /> From Gallery
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'businessDocumentPhoto')}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-600">Retailer Photo</label>
            <div className="flex flex-wrap gap-4">
              {form.photo ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img src={form.photo} alt="Retailer" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, photo: '' }))}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => handleCameraSelect('photo')}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#00a877] text-[#00a877] hover:bg-emerald-50 rounded-xl px-3 py-2.5 text-sm font-medium transition"
                  >
                    <Camera size={18} /> Take Photo
                  </button>
                  <label className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer">
                    <UploadCloud size={18} /> From Gallery
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'photo')}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 pb-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#7C9FC9] px-4 py-4 text-center text-[15px] font-bold text-white shadow-md active:scale-95 transition-all disabled:opacity-70"
            >
              {submitting ? 'Creating account...' : 'Continue'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signup
