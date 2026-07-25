import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import urLogo from '../../assets/ur.png'
import { requestNotificationPermission } from '../../utils/firebase'

function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    deliveryAddress: '',
    status: 'Pending',
    walletBalance: '',
    shopName: '',
    shopType: 'Proprietorship',
    addressAsPerAadhaar: '',
    aadhaarState: '',
    aadhaarPin: '',
    aadhaarNo: '',
    panNo: '',
    partnerNameA: '',
    partnerNameB: '',
    phone: '',
    whatsappNo: '',
    alternateContactName: '',
    alternateContactPhone: '',
    areaOfOperation: '',
    pinCode: '',
    state: '',
    gstNumber: '',
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
  })
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const [error, setError] = useState('')

  const handleChange = (event) => {
    let { name, value } = event.target
    
    // Restrict phone fields to numbers only, max 10 digits
    if (name === 'phone' || name === 'whatsappNo' || name === 'alternateContactPhone') {
      value = value.replace(/\D/g, '').substring(0, 10);
    }
    
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
      deliveryAddress: form.deliveryAddress.trim() || form.completeAddress.trim() || '',
    }

    if (!payload.name || !payload.email || !payload.password) {
      setError('Please provide Name, Email and Password')
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
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setSubmitting(false)
      // Save retailer data dynamically for profile
      localStorage.setItem('umeed-retailer', JSON.stringify(data))
      
      requestNotificationPermission('retailer', data.token)
      navigate('/retailer/home')
    } catch (err) {
      setSubmitting(false)
      setError(err.message)
    }
  }

  return (
    <div className="screen-shell flex h-dvh flex-col overflow-y-auto overflow-x-hidden pb-16 pt-4">
      <section className="brand-gradient rounded-2xl px-5 pb-12 pt-9 text-white shadow-[0_10px_24px_rgba(0,168,119,0.24)]">
        <button 
          onClick={() => navigate('/retailer/auth')}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95 border border-white/10"
          aria-label="Go Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="mb-6 inline-flex bg-white rounded-full h-24 w-24 items-center justify-center overflow-hidden shadow-md">
          <img src={urLogo} alt="Umeed Logo" className="h-full w-full object-contain mix-blend-multiply scale-110" />
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#d6f5ea]">Get Started</p>
        <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-[#d6f5ea]">
          Create your retailer account and start ordering from the wholesale catalog.
        </p>
      </section>

      <section className="card-surface -mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Create Account</h2>
        <p className="mt-1 text-sm text-slate-500">Join as a partner retailer</p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          {/* Section 1: General Shop Details */}
          <div className="border-b border-slate-100 pb-1 pt-2">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">1. General Shop Details</h3>
          </div>

          <div>
            <label htmlFor="shopName" className="mb-2 block text-xs font-medium text-slate-600">
              Store / Shop Name
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              placeholder="Enter shop name"
              value={form.shopName}
              onChange={(e) => setForm(prev => ({ ...prev, shopName: e.target.value, storeName: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-medium text-slate-600">
              Store Owner Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Store owner name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value, ownerName: e.target.value }))}
              className="input-field"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="shopType" className="mb-2 block text-xs font-medium text-slate-600">
              Shop Type
            </label>
            <select
              id="shopType"
              name="shopType"
              value={form.shopType}
              onChange={handleChange}
              className="input-field"
              style={{ padding: '8px 12px', fontSize: '12px', height: '38px' }}
              required
            >
              <option value="Proprietorship">Proprietorship</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>

          {/* Section 2: Aadhaar Verification */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">2. Aadhaar Verification</h3>
          </div>

          <div>
            <label htmlFor="aadhaarNo" className="mb-2 block text-xs font-medium text-slate-600">
              Aadhaar No.
            </label>
            <input
              id="aadhaarNo"
              name="aadhaarNo"
              type="text"
              placeholder="Enter 12 digit Aadhaar"
              value={form.aadhaarNo}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="addressAsPerAadhaar" className="mb-2 block text-xs font-medium text-slate-600">
              Aadhaar Address
            </label>
            <input
              id="addressAsPerAadhaar"
              name="addressAsPerAadhaar"
              type="text"
              placeholder="Enter address as per Aadhaar"
              value={form.addressAsPerAadhaar}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="aadhaarState" className="mb-2 block text-xs font-medium text-slate-600">
                Aadhaar State
              </label>
              <input
                id="aadhaarState"
                name="aadhaarState"
                type="text"
                placeholder="State"
                value={form.aadhaarState}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="aadhaarPin" className="mb-2 block text-xs font-medium text-slate-600">
                Aadhaar Pin
              </label>
              <input
                id="aadhaarPin"
                name="aadhaarPin"
                type="text"
                placeholder="Pin code"
                value={form.aadhaarPin}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Section 3: Tax & Identity */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">3. Tax & Identity</h3>
          </div>

          <div>
            <label htmlFor="panNo" className="mb-2 block text-xs font-medium text-slate-600">
              PAN No.
            </label>
            <input
              id="panNo"
              name="panNo"
              type="text"
              placeholder="Enter PAN Number"
              value={form.panNo}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="gstNumber" className="mb-2 block text-xs font-medium text-slate-600">
              GST No.
            </label>
            <input
              id="gstNumber"
              name="gstNumber"
              type="text"
              placeholder="Enter GST Number"
              value={form.gstNumber}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="partnerNameA" className="mb-2 block text-xs font-medium text-slate-600">
              Partner 1 Name
            </label>
            <input
              id="partnerNameA"
              name="partnerNameA"
              type="text"
              placeholder="Partner Name (if applicable)"
              value={form.partnerNameA}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="partnerNameB" className="mb-2 block text-xs font-medium text-slate-600">
              Partner 2 Name
            </label>
            <input
              id="partnerNameB"
              name="partnerNameB"
              type="text"
              placeholder="Other Partner Name (if applicable)"
              value={form.partnerNameB}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Section 4: Contact Information */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">4. Contact Information</h3>
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-medium text-slate-600">
              Official Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Official mobile number"
              value={form.phone}
              onChange={handleChange}
              onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0,10) }}
              maxLength={10}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-medium text-slate-600">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="owner@shop.com"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="whatsappNo" className="mb-2 block text-xs font-medium text-slate-600">
              WhatsApp No.
            </label>
            <input
              id="whatsappNo"
              name="whatsappNo"
              type="text"
              placeholder="WhatsApp mobile number"
              value={form.whatsappNo}
              onChange={handleChange}
              onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0,10) }}
              maxLength={10}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="alternateContactName" className="mb-2 block text-xs font-medium text-slate-600">
              Alternate Contact Name
            </label>
            <input
              id="alternateContactName"
              name="alternateContactName"
              type="text"
              placeholder="Alternate contact person"
              value={form.alternateContactName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="alternateContactPhone" className="mb-2 block text-xs font-medium text-slate-600">
              Alternate Contact Phone
            </label>
            <input
              id="alternateContactPhone"
              name="alternateContactPhone"
              type="text"
              placeholder="Alternate mobile number"
              value={form.alternateContactPhone}
              onChange={handleChange}
              onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0,10) }}
              maxLength={10}
              className="input-field"
            />
          </div>

          {/* Section 5: Operation Area */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">5. Operation Area</h3>
          </div>

          <div>
            <label htmlFor="areaOfOperation" className="mb-2 block text-xs font-medium text-slate-600">
              Area of Operation
            </label>
            <input
              id="areaOfOperation"
              name="areaOfOperation"
              type="text"
              placeholder="Area of business operation"
              value={form.areaOfOperation}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pinCode" className="mb-2 block text-xs font-medium text-slate-600">
                Pin Code
              </label>
              <input
                id="pinCode"
                name="pinCode"
                type="text"
                placeholder="Operation pin"
                value={form.pinCode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="state" className="mb-2 block text-xs font-medium text-slate-600">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                placeholder="Operation state"
                value={form.state}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Section 6: Complete Shop Address */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">6. Complete Shop Location Details</h3>
          </div>

          <div>
            <label htmlFor="retailShopName" className="mb-2 block text-xs font-medium text-slate-600">
              Retail Shop Name
            </label>
            <input
              id="retailShopName"
              name="retailShopName"
              type="text"
              placeholder="Retail shop display name"
              value={form.retailShopName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="completeAddress" className="mb-2 block text-xs font-medium text-slate-600">
              Complete Delivery Address
            </label>
            <textarea
              id="completeAddress"
              name="completeAddress"
              placeholder="Enter your complete shop delivery address"
              value={form.completeAddress}
              onChange={(e) => setForm(prev => ({ ...prev, completeAddress: e.target.value, deliveryAddress: e.target.value }))}
              rows="2"
              className="input-field py-3 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="mb-2 block text-xs font-medium text-slate-600">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="City Name"
                value={form.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="landmark" className="mb-2 block text-xs font-medium text-slate-600">
                Land Mark
              </label>
              <input
                id="landmark"
                name="landmark"
                type="text"
                placeholder="Nearby landmark"
                value={form.landmark}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="policeStation" className="mb-2 block text-xs font-medium text-slate-600">
                Police Station (P.S.)
              </label>
              <input
                id="policeStation"
                name="policeStation"
                type="text"
                placeholder="Nearest P.S."
                value={form.policeStation}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="addressPinCode" className="mb-2 block text-xs font-medium text-slate-600">
                Address Pin Code
              </label>
              <input
                id="addressPinCode"
                name="addressPinCode"
                type="text"
                placeholder="Address Pin Code"
                value={form.addressPinCode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="addressState" className="mb-2 block text-xs font-medium text-slate-600">
              Address State
            </label>
            <input
              id="addressState"
              name="addressState"
              type="text"
              placeholder="Address State"
              value={form.addressState}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Section 7: Bank Details */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">7. Bank Account Details</h3>
          </div>

          <div>
            <label htmlFor="bankName" className="mb-2 block text-xs font-medium text-slate-600">
              Bank Name
            </label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              placeholder="Enter bank name"
              value={form.bankName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ifscCode" className="mb-2 block text-xs font-medium text-slate-600">
                IFSC Code
              </label>
              <input
                id="ifscCode"
                name="ifscCode"
                type="text"
                placeholder="IFSC Code"
                value={form.ifscCode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="bankBranch" className="mb-2 block text-xs font-medium text-slate-600">
                Bank Branch
              </label>
              <input
                id="bankBranch"
                name="bankBranch"
                type="text"
                placeholder="Branch name"
                value={form.bankBranch}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="accountHolderName" className="mb-2 block text-xs font-medium text-slate-600">
              Account Holder Name
            </label>
            <input
              id="accountHolderName"
              name="accountHolderName"
              type="text"
              placeholder="Account holder name"
              value={form.accountHolderName}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="accountNo" className="mb-2 block text-xs font-medium text-slate-600">
              Bank Account No.
            </label>
            <input
              id="accountNo"
              name="accountNo"
              type="text"
              placeholder="Enter bank account number"
              value={form.accountNo}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Section 8: System Settings */}
          <div className="border-b border-slate-100 pb-1 pt-4">
            <h3 className="text-xs font-bold text-[#00a877] uppercase tracking-wider">8. System Settings & Documents</h3>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-medium text-slate-600">
              Account Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-xs font-medium text-slate-600">
              Account Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-field"
              style={{ padding: '8px 12px', fontSize: '12px', height: '38px' }}
              required
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label htmlFor="walletBalance" className="mb-2 block text-xs font-medium text-slate-600">
              Wallet Balance
            </label>
            <input
              id="walletBalance"
              name="walletBalance"
              type="text"
              placeholder="e.g. Rs 5,000"
              value={form.walletBalance}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Cloudinary Photo upload field */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-600">
              Upload Retailer Photo
            </label>
            {form.photo && (
              <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                <img src={form.photo} alt="Retailer document" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, photo: '' }))}
                  className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-bl-lg p-1.5 text-xs transition duration-150"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm(prev => ({ ...prev, photo: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="input-field"
            />
          </div>

          <button type="submit" className="primary-btn mt-6" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/retailer/auth" className="font-semibold text-[#008f67] underline-offset-2 hover:underline">
            Login
          </Link>
        </p>
      </section>
    </div>
  )
}

export default Signup
