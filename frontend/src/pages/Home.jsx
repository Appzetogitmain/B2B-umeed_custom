import { getBackendUrl, getImageUrl } from '../utils/api';
import { useState, useEffect } from 'react'
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Plus as PlusIcon,
  ChevronRight as RightIcon,
  TrendingUp as UpIcon,
  ShoppingBasket,
  Flame,
  GlassWater,
  Sofa,
  WashingMachine,
  HeartPulse,
  ShieldCheck,
  Sun,
  GraduationCap,
  Zap,
  Droplets,
  UtensilsCrossed,
  Soup,
  Handshake,
  X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

const categories = [
  { name: 'Grocery | Kitchen', icon: <ShoppingBasket size={22} /> },
  { name: 'Oil & Ghee', icon: <Droplets size={22} /> },
  { name: 'Spices', icon: <UtensilsCrossed size={22} /> },
  { name: 'Noodles', icon: <Soup size={22} /> },
  { name: 'Masala | Oil | Ghee', icon: <Flame size={22} /> },
  { name: 'Drinks | Noodles | Snacks', icon: <GlassWater size={22} /> },
  { name: 'Home Cleaning & Decore', icon: <Sofa size={22} /> },
  { name: 'Laundry - Soft Touch', icon: <WashingMachine size={22} /> },
  { name: 'Personal Care', icon: <HeartPulse size={22} /> },
  { name: 'Personal Hygiene', icon: <ShieldCheck size={22} /> },
  { name: 'Puja Essential', icon: <Sun size={22} /> },
  { name: 'School Accessories', icon: <GraduationCap size={22} /> },
  { name: 'Electronics & Appliances', icon: <Zap size={22} /> },
  { name: 'Grocery | Kitchen', icon: <ShoppingBasket size={22} /> },
  { name: 'Oil & Ghee', icon: <Droplets size={22} /> },
  { name: 'Spices', icon: <UtensilsCrossed size={22} /> },
  { name: 'Noodles', icon: <Soup size={22} /> },
  { name: 'Masala | Oil | Ghee', icon: <Flame size={22} /> },
  { name: 'Drinks | Noodles | Snacks', icon: <GlassWater size={22} /> },
  { name: 'Home Cleaning & Decore', icon: <Sofa size={22} /> },
  { name: 'Laundry - Soft Touch', icon: <WashingMachine size={22} /> },
  { name: 'Personal Care', icon: <HeartPulse size={22} /> },
  { name: 'Personal Hygiene', icon: <ShieldCheck size={22} /> },
  { name: 'Puja Essential', icon: <Sun size={22} /> },
  { name: 'School Accessories', icon: <GraduationCap size={22} /> },
  { name: 'Electronics & Appliances', icon: <Zap size={22} /> },
]

function Home() {
  const { addToCart, totalItems } = useCart()
  const [addedId, setAddedId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [dynamicCategories, setDynamicCategories] = useState([])
  const [dynamicBanners, setDynamicBanners] = useState([])
  const [dynamicProducts, setDynamicProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  
  // Deal Modal state
  const [dealModalOpen, setDealModalOpen] = useState(false)
  const [dealProduct, setDealProduct] = useState(null)
  const [dealQuantity, setDealQuantity] = useState(10)
  const [dealPrice, setDealPrice] = useState(0)
  const [dealMessage, setDealMessage] = useState('')
  const [isSubmittingDeal, setIsSubmittingDeal] = useState(false)

  // Get logged-in retailer name from localStorage
  const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || '{}')
  const retailerName = retailerData?.name || 'Umeed Retailer'

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const url = `${getBackendUrl()}/api/v1/categories`
        console.log('[Retailer Home] Fetching categories from:', url)
        const res = await fetch(url)
        console.log('[Retailer Home] Categories response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('[Retailer Home] Categories data:', data)
          if (data && data.length > 0) {
            setDynamicCategories(data)
          } else {
            console.warn('[Retailer Home] Fetched categories array is empty.')
          }
        } else {
          console.error('[Retailer Home] Categories response was not ok.')
        }
      } catch (err) {
        console.error('[Retailer Home] Error fetching categories:', err)
      }
    }
    const fetchBanners = async () => {
      try {
        const url = `${getBackendUrl()}/api/v1/banners`
        console.log('[Retailer Home] Fetching banners from:', url)
        const res = await fetch(url)
        console.log('[Retailer Home] Banners response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('[Retailer Home] Banners data:', data)
          if (data && data.length > 0) {
            setDynamicBanners(data)
          } else {
            console.warn('[Retailer Home] Fetched banners array is empty.')
          }
        } else {
          console.error('[Retailer Home] Banners response was not ok.')
        }
      } catch (err) {
        console.error('[Retailer Home] Error fetching banners:', err)
      }
    }
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const url = `${getBackendUrl()}/api/v1/products`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setDynamicProducts(data.map(p => ({
              id: p._id,
              category: p.category,
              name: p.name,
              variantName: p.variantName,
              description: p.description,
              price: p.price,
              originalPrice: p.mrp,
              discount: p.discount ? `${p.discount}% OFF` : '',
              image: p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
              stock: p.stock
            })))
          }
        }
      } catch (err) {
        console.error('[Retailer Home] Error fetching products:', err)
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchCats()
    fetchBanners()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (dynamicBanners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % dynamicBanners.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [dynamicBanners])

  // Search products from DB (case-insensitive, debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const query = encodeURIComponent(searchQuery.trim())
        const [prodRes, catRes] = await Promise.all([
          fetch(`${getBackendUrl()}/api/v1/products?search=${query}`),
          fetch(`${getBackendUrl()}/api/v1/categories`)
        ])

        let results = []

        // Get matching products by name/SKU
        if (prodRes.ok) {
          const prodData = await prodRes.json()
          results = prodData.map(p => ({
            id: p._id,
            category: p.category,
            name: p.name,
            variantName: p.variantName,
            description: p.description,
            price: p.price,
            originalPrice: p.mrp,
            discount: p.discount ? `${p.discount}% OFF` : '',
            image: p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
            stock: p.stock
          }))
        }

        // Also search by category name (case-insensitive)
        if (catRes.ok) {
          const catData = await catRes.json()
          const matchingCats = catData.filter(c =>
            c.categoryName.toLowerCase().includes(searchQuery.trim().toLowerCase())
          )
          if (matchingCats.length > 0) {
            // Fetch all products and filter by matching category names
            const allProdRes = await fetch(`${getBackendUrl()}/api/v1/products`)
            if (allProdRes.ok) {
              const allProds = await allProdRes.json()
              const catNames = matchingCats.map(c => c.categoryName.toLowerCase())
              const catProducts = allProds
                .filter(p => catNames.some(cn => p.category.toLowerCase().includes(cn) || cn.includes(p.category.toLowerCase())))
                .map(p => ({
                  id: p._id,
                  category: p.category,
                  name: p.name,
                  variantName: p.variantName,
                  description: p.description,
                  price: p.price,
                  originalPrice: p.mrp,
                  discount: p.discount ? `${p.discount}% OFF` : '',
                  image: p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
                  stock: p.stock
                }))
              // Merge without duplicates
              const existingIds = new Set(results.map(r => r.id))
              catProducts.forEach(p => {
                if (!existingIds.has(p.id)) {
                  results.push(p)
                }
              })
            }
          }
        }

        setSearchResults(results)
      } catch (err) {
        console.error('Search error:', err)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const displayedCategories = dynamicCategories.length > 0
    ? dynamicCategories.map(cat => ({
      name: cat.categoryName,
      image: cat.image,
      isDynamic: true
    }))
    : categories.map(cat => ({
      name: cat.name,
      icon: cat.icon,
      isDynamic: false
    }))

  const activeProducts = dynamicProducts;

  const filteredProducts = searchResults !== null
    ? searchResults
    : selectedCategory === 'All'
      ? activeProducts
      : activeProducts.filter(p => {
        const catLower = selectedCategory.toLowerCase().trim()
        const prodCatLower = p.category.toLowerCase().trim()
        
        // Direct matching
        if (prodCatLower.includes(catLower) || catLower.includes(prodCatLower)) {
          return true
        }
        
        // Dynamic intersection matching
        const catWords = catLower.split(/[\s&|,-]+/).filter(w => w.length > 2)
        const prodWords = prodCatLower.split(/[\s&|,-]+/).filter(w => w.length > 2)
        
        return catWords.some(cw => prodWords.some(pw => pw.includes(cw) || cw.includes(pw)))
      })

  const handleAdd = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1000)
  }

  const openDealModal = (product) => {
    setDealProduct(product)
    setDealQuantity(10) // default bulk qty
    setDealPrice(product.price)
    setDealMessage('')
    setDealModalOpen(true)
  }

  const submitDealRequest = async () => {
    if (!dealProduct || dealQuantity < 1 || dealPrice <= 0) return
    setIsSubmittingDeal(true)
    
    try {
      const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || '{}')
      const token = retailerData.token
      
      const res = await fetch(`${getBackendUrl()}/api/v1/deals/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: dealProduct.id,
          requestedQuantity: dealQuantity,
          requestedRate: dealPrice,
          retailerMessage: dealMessage
        })
      })
      
      if (res.ok) {
        alert('Deal request sent successfully! You can track it in My Deals.')
        setDealModalOpen(false)
      } else {
        const error = await res.json()
        alert(`Failed to send request: ${error.message}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error sending deal request')
    } finally {
      setIsSubmittingDeal(false)
    }
  }

  return (
    <div className="px-4 pt-2 bg-[#F8FAFC]">
      {/* COMPACT HEADER */}
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Welcome back,</p>
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">{retailerName}</h1>
        </div>
        <Link to="/retailer/cart" className="relative h-10 w-10 grid place-items-center bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-90">
          <CartIcon size={18} className="text-[#0F172A]" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-[9px] font-bold grid place-items-center rounded-full ring-2 ring-white">
              {totalItems}
            </span>
          )}
        </Link>
      </header>

      {/* COMPACT SEARCH */}
      <div className="relative mb-5">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); if (!e.target.value.trim()) setSelectedCategory('All'); }}
          className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-slate-100 shadow-sm outline-none focus:border-black text-xs transition-all"
        />
      </div>

      {/* COMPACT BANNER CAROUSEL */}
      {dynamicBanners.length > 0 ? (
        <div className="relative overflow-hidden w-full rounded-2xl mb-6 shadow-lg shadow-black/10 min-h-[120px]">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {dynamicBanners.map((banner, idx) => (
              <section
                key={banner._id || idx}
                className="relative shrink-0 w-full min-h-[120px] bg-black text-white p-5 flex flex-col justify-center"
              >
                {banner.image && (
                  <div className="absolute inset-0 z-0">
                    <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                  </div>
                )}
                <div className="relative z-10 pr-20">
                  <h2 className="text-lg font-bold mb-0.5 leading-tight">{banner.title}</h2>
                  <p className="text-gray-300 text-[10px] mb-0 opacity-90 leading-tight">{banner.description}</p>
                </div>
              </section>
            ))}
          </div>

          {/* INDICATOR DOTS */}
          {dynamicBanners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {dynamicBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentBannerIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <section className="relative overflow-hidden bg-black text-white p-5 rounded-2xl mb-6 shadow-lg shadow-black/10">
          <div className="relative z-10 pr-20">
            <h2 className="text-lg font-bold mb-0.5 leading-tight">Today's Hot Deal</h2>
            <p className="text-gray-400 text-[10px] mb-0 opacity-90 leading-tight">Save 15% on bulk orders this week.</p>
          </div>
          <UpIcon className="absolute -right-4 -top-4 text-white/5 w-32 h-32 -rotate-12" />
        </section>
      )}

      {/* CATEGORIES */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-[#0F172A]">Categories</h3>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-black text-[10px] font-bold flex items-center gap-1 ${selectedCategory === 'All' ? 'underline' : ''}`}
          >
            See all <RightIcon size={12} />
          </button>
        </div>
        <div className="flex md:flex-wrap gap-3 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {displayedCategories.map((cat, idx) => (
            <button 
              key={`${cat.name}-${idx}`} 
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 w-16 md:w-24 group outline-none"
            >
              <div className={`h-14 w-14 md:h-20 md:w-20 rounded-2xl shadow-sm border transition-all overflow-hidden active:scale-95 grid place-items-center ${
                selectedCategory === cat.name 
                ? 'bg-black text-white border-black shadow-md' 
                : 'bg-white text-slate-600 border-slate-100'
              }`}>
                {cat.isDynamic ? (
                  cat.image ? (
                    <img 
                      src={getImageUrl(cat.image)} 
                      alt={cat.name} 
                      className="h-full w-full object-cover rounded-2xl p-1"
                    />
                  ) : (
                    <ShoppingBasket size={22} />
                  )
                ) : (
                  cat.icon
                )}
              </div>
              <span className={`text-[9px] md:text-[11px] font-bold uppercase tracking-tighter text-center leading-tight transition-colors w-full ${
                selectedCategory === cat.name ? 'text-black' : 'text-slate-500'
              }`}>
                {(cat.name || '').split(' | ')[0].split(' - ')[0].split(' & ')[0]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* COMPACT PRODUCTS */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-[#0F172A]">
            {selectedCategory === 'All' ? 'Popular Items' : selectedCategory}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {isLoadingProducts ? (
            <div className="col-span-full py-10 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-all duration-200 group">
              <Link to={`/retailer/product/${product.id}`} className="block flex-1 flex flex-col">
                <div className="relative h-32 sm:h-40 md:h-48 w-full bg-slate-50 rounded-lg overflow-hidden mb-3">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-white text-[9px] font-black uppercase tracking-tighter">
                    {product.discount}
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-1">
                  <h4 className="text-xs font-bold text-[#0F172A] mb-1 line-clamp-2 leading-tight h-8">
                    {product.name}
                  </h4>

                  {product.variantName && (
                    <span className="text-[10px] font-semibold text-slate-600 mb-1 block">
                      {product.variantName}
                    </span>
                  )}
                  
                  {product.description && (
                    <p className="text-[9px] text-slate-500 mb-2 line-clamp-2 leading-tight">
                      {product.description}
                    </p>
                  )}
                </div>
              </Link>

              <div className="mt-auto pt-1 flex items-center justify-between px-1">
                <div>
                  <span className="text-xs font-bold text-black block">₹{product.price}</span>
                  <span className="text-[9px] text-slate-400 line-through">₹{product.originalPrice}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDealModal(product); }}
                    className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                    title="Request Deal (Bulk)"
                  >
                    <Handshake size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(product); }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all active:scale-90 ${
                      addedId === product.id 
                      ? 'bg-slate-100 text-black border border-slate-200' 
                      : 'bg-black text-white'
                    }`}
                  >
                    {addedId === product.id ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 py-10 text-center">
              <p className="text-xs text-slate-400">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* DEAL MODAL */}
      {dealModalOpen && dealProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setDealModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-black"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                <img src={getImageUrl(dealProduct.image)} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">{dealProduct.name}</h3>
                <p className="text-xs text-slate-500">Current Price: ₹{dealProduct.price}</p>
              </div>
            </div>

            <h2 className="text-lg font-black mb-4">Request Custom Deal</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Bulk Quantity Expected</label>
                <input 
                  type="number" 
                  min="1"
                  value={dealQuantity}
                  onChange={(e) => setDealQuantity(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-black text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Your Expected Price (₹)</label>
                <input 
                  type="number" 
                  min="1"
                  value={dealPrice}
                  onChange={(e) => setDealPrice(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-black text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Message for Admin (Optional)</label>
                <textarea 
                  value={dealMessage}
                  onChange={(e) => setDealMessage(e.target.value)}
                  placeholder="E.g., Ready to pay upfront if given this rate."
                  className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-black text-xs resize-none"
                />
              </div>
            </div>

            <button 
              onClick={submitDealRequest}
              disabled={isSubmittingDeal}
              className="w-full h-12 bg-black text-white font-bold rounded-xl mt-5 hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmittingDeal ? 'Sending Request...' : 'Send Deal Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home