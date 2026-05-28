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
  Soup
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

const products = [
  {
    id: '1',
    category: 'Grocery',
    name: 'Sharbati Atta 10kg',
    price: 540,
    originalPrice: 600,
    discount: '10% OFF',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '2',
    category: 'Grocery',
    name: 'Basmati Rice 25kg',
    price: 2340,
    originalPrice: 2600,
    discount: 'SAVE ₹260',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '3',
    category: 'Oil & Ghee',
    name: 'Sunflower Oil 1L',
    price: 168,
    originalPrice: 190,
    discount: 'BEST',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '4',
    category: 'Oil & Ghee',
    name: 'Refined Oil 5L',
    price: 810,
    originalPrice: 900,
    discount: 'BULK',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
  },
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

  // Get logged-in retailer name from localStorage
  const retailerData = JSON.parse(localStorage.getItem('umeed-retailer') || '{}')
  const retailerName = retailerData?.name || 'Umeed Retailer'

  const getBackendUrl = () => {
    const hostname = window.location.hostname;
    // Safe fallback for localhost / 127.0.0.1 / file URIs
    if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5200';
    }
    // Dynamic IP handling (like 192.168.x.x) for physical device / emulator testing
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) {
      return `http://${hostname}:5200`;
    }
    return 'http://localhost:5200';
  }

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
              price: p.price,
              originalPrice: p.mrp,
              discount: p.discount ? `${p.discount}% OFF` : '',
              image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
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
            price: p.price,
            originalPrice: p.mrp,
            discount: p.discount ? `${p.discount}% OFF` : '',
            image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
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
                  price: p.price,
                  originalPrice: p.mrp,
                  discount: p.discount ? `${p.discount}% OFF` : '',
                  image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
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

  const products = [
    // Grocery | Kitchen
    { id: '1', category: 'Grocery | Kitchen', name: 'Sharbati Atta 10kg', price: 540, originalPrice: 600, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300' },
    { id: '2', category: 'Grocery | Kitchen', name: 'Basmati Rice 25kg', price: 2340, originalPrice: 2600, discount: 'SAVE ₹260', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300' },
    { id: '3', category: 'Grocery | Kitchen', name: 'Non-Stick Pan 24cm', price: 899, originalPrice: 1200, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1584990344468-58fc9460c4a1?auto=format&fit=crop&q=80&w=300' },

    // Masala | Oil | Ghee
    { id: '4', category: 'Masala | Oil | Ghee', name: 'Sunflower Oil 5L', price: 810, originalPrice: 900, discount: '10% OFF', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300' },
    { id: '5', category: 'Masala | Oil | Ghee', name: 'Pure Cow Ghee 1L', price: 650, originalPrice: 720, discount: 'SAVE ₹70', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=300' },
    { id: '6', category: 'Masala | Oil | Ghee', name: 'Turmeric Powder 500g', price: 120, originalPrice: 150, discount: '20% OFF', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300' },

    // Drinks | Noodles | Snacks
    { id: '7', category: 'Drinks | Noodles | Snacks', name: 'Instant Noodles Pack', price: 120, originalPrice: 140, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=300' },
    { id: '8', category: 'Drinks | Noodles | Snacks', name: 'Cola 2L Bottle', price: 95, originalPrice: 110, discount: 'SAVE ₹15', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300' },
    { id: '9', category: 'Drinks | Noodles | Snacks', name: 'Potato Chips 150g', price: 50, originalPrice: 60, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=300' },

    // Home Cleaning & Decore
    { id: '10', category: 'Home Cleaning & Decore', name: 'Floor Cleaner 1L', price: 180, originalPrice: 220, discount: '18% OFF', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300' },
    { id: '11', category: 'Home Cleaning & Decore', name: 'Lobby Vase Modern', price: 450, originalPrice: 600, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=300' },

    // Laundry - Soft Touch
    { id: '12', category: 'Laundry - Soft Touch', name: 'Detergent Gel 2L', price: 420, originalPrice: 480, discount: '12% OFF', image: 'https://images.unsplash.com/photo-1610557870699-14a571da2cca?auto=format&fit=crop&q=80&w=300' },
    { id: '13', category: 'Laundry - Soft Touch', name: 'Fabric Conditioner', price: 210, originalPrice: 250, discount: '16% OFF', image: 'https://images.unsplash.com/photo-1582733075958-a037a67df4af?auto=format&fit=crop&q=80&w=300' },

    // Personal Care
    { id: '14', category: 'Personal Care', name: 'Face Wash 150ml', price: 299, originalPrice: 350, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=300' },
    { id: '15', category: 'Personal Care', name: 'Moisturizer Box', price: 450, originalPrice: 550, discount: '18% OFF', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=300' },

    // Personal Hygiene
    { id: '16', category: 'Personal Hygiene', name: 'Hand Sanitizer 500ml', price: 150, originalPrice: 200, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1584305323448-899459b71ee7?auto=format&fit=crop&q=80&w=300' },
    { id: '17', category: 'Personal Hygiene', name: 'Hygiene Soap Pack', price: 180, originalPrice: 220, discount: '18% OFF', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=300' },

    // Puja Essential
    { id: '18', category: 'Puja Essential', name: 'Incense Sticks Box', price: 85, originalPrice: 100, discount: '15% OFF', image: 'https://images.unsplash.com/photo-1602881917760-7379db593981?auto=format&fit=crop&q=80&w=300' },
    { id: '19', category: 'Puja Essential', name: 'Premium Puja Oil', price: 240, originalPrice: 280, discount: 'SAVE ₹40', image: 'https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0?auto=format&fit=crop&q=80&w=300' },

    // School Accessories
    { id: '20', category: 'School Accessories', name: 'Notebooks Set (6)', price: 350, originalPrice: 420, discount: '16% OFF', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=300' },
    { id: '21', category: 'School Accessories', name: 'Ergonomic Backpack', price: 1250, originalPrice: 1800, discount: '30% OFF', image: 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=300' },

    // Electronics & Appliances
    { id: '22', category: 'Electronics & Appliances', name: 'Electric Kettle 1.5L', price: 1150, originalPrice: 1500, discount: '23% OFF', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?auto=format&fit=crop&q=80&w=300' },
    { id: '23', category: 'Electronics & Appliances', name: 'Power Bank 20000mAh', price: 1499, originalPrice: 2000, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1609091839311-d5364f512c58?auto=format&fit=crop&q=80&w=300' },
  ]

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

  const activeProducts = dynamicProducts.length > 0 ? dynamicProducts : products;

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
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-50" />
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
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayedCategories.map((cat, idx) => (
            <button 
              key={`${cat.name}-${idx}`} 
              onClick={() => setSelectedCategory(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 w-16 group outline-none"
            >
              <div className={`h-14 w-14 rounded-2xl shadow-sm border transition-all overflow-hidden active:scale-95 grid place-items-center ${
                selectedCategory === cat.name 
                ? 'bg-black text-white border-black shadow-md' 
                : 'bg-white text-slate-600 border-slate-100'
              }`}>
                {cat.isDynamic ? (
                  cat.image ? (
                    <img 
                      src={cat.image} 
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
              <span className={`text-[9px] font-bold uppercase tracking-tighter text-center leading-tight transition-colors w-full ${
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
        <div className="grid grid-cols-2 gap-3 pb-4">
          {isLoadingProducts ? (
            <div className="col-span-2 py-10 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-2 shadow-sm border border-slate-50 flex flex-col hover:shadow-md transition-all duration-200 group">
              <div className="relative h-28 w-full bg-slate-50 rounded-lg overflow-hidden mb-2">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-white text-[7px] font-black uppercase tracking-tighter">
                  {product.discount}
                </div>
              </div>

              <div className="flex flex-col flex-1 px-1">
                <h4 className="text-[10px] font-bold text-[#0F172A] mb-1 line-clamp-2 leading-tight h-6">
                  {product.name}
                </h4>
                
                <div className="mt-auto pt-1 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-black block">₹{product.price}</span>
                    <span className="text-[9px] text-slate-400 line-through">₹{product.originalPrice}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleAdd(product)}
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
    </div>
  )
}

export default Home