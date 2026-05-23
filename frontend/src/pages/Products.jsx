import { useState, useEffect } from 'react'
import { Plus, Search, SlidersHorizontal, ShoppingCart, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

const categories = ['All', 'Grocery', 'Oil & Ghee', 'Masala', 'Snacks', 'Drinks']

const products = [
  { 
    id: '1', 
    category: 'Grocery', 
    name: 'Sharbati Atta 10kg', 
    price: 540, 
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300'
  },
  { 
    id: '2', 
    category: 'Grocery', 
    name: 'Basmati Rice 25kg', 
    price: 2340, 
    originalPrice: 2600,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
  },
  { 
    id: '3', 
    category: 'Oil & Ghee', 
    name: 'Sunflower Oil 1L', 
    price: 168, 
    originalPrice: 190,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
  },
  { 
    id: '4', 
    category: 'Oil & Ghee', 
    name: 'Refined Oil 5L', 
    price: 810, 
    originalPrice: 900,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
  },
  { 
    id: '5', 
    category: 'Masala', 
    name: 'Chilli Powder 1kg', 
    price: 420, 
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300'
  },
  { 
    id: '6', 
    category: 'Snacks', 
    name: 'Potato Chips Box', 
    price: 1200, 
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527ec087?auto=format&fit=crop&q=80&w=300'
  },
]

function Products() {
  const { addToCart, totalItems } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [addedId, setAddedId] = useState(null)
  const [dynamicCategories, setDynamicCategories] = useState([])

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
        console.log('[Retailer Products] Fetching categories from:', url)
        const res = await fetch(url)
        console.log('[Retailer Products] Categories response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('[Retailer Products] Categories data:', data)
          if (data && data.length > 0) {
            setDynamicCategories(data.map(c => c.categoryName))
          } else {
            console.warn('[Retailer Products] Fetched categories array is empty.')
          }
        } else {
          console.error('[Retailer Products] Categories response was not ok.')
        }
      } catch (err) {
        console.error('[Retailer Products] Error fetching categories:', err)
      }
    }
    fetchCats()
  }, [])

  const displayedCategories = ['All', ...(dynamicCategories.length > 0 ? dynamicCategories : categories.slice(1))]

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => {
        const catLower = selectedCategory.toLowerCase().trim()
        const prodCatLower = p.category.toLowerCase().trim()
        
        // Direct matching
        if (prodCatLower.includes(catLower) || catLower.includes(prodCatLower)) {
          return true
        }
        
        // Dynamic intersection matching (e.g. "Snacks & Biscuits" matches "Drinks | Noodles | Snacks" by matching "snacks")
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
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Catalog</h1>
          <p className="text-[11px] text-slate-400 font-medium">Wholesale bulk items</p>
        </div>
        <div className="flex gap-3">
          <Link to="/retailer/cart" className="relative h-10 w-10 grid place-items-center bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-90">
            <ShoppingCart size={18} className="text-[#0F172A]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-[9px] font-bold grid place-items-center rounded-full ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="h-10 w-10 grid place-items-center bg-white rounded-xl shadow-sm border border-slate-100">
            <SlidersHorizontal size={18} className="text-slate-600" />
          </button>
        </div>
      </header>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search items..." 
          className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-slate-100 shadow-sm outline-none focus:border-black text-xs transition-all"
        />
      </div>

      {/* CATEGORIES */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {displayedCategories.map((cat, idx) => (
          <button
            key={`${cat}-${idx}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              selectedCategory === cat 
              ? 'bg-black text-white shadow-lg shadow-black/10' 
              : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl p-2 shadow-sm border border-slate-50 flex flex-col hover:shadow-md transition-all duration-200 group">
            {/* IMAGE CONTAINER */}
            <div className="relative h-28 w-full bg-slate-50 rounded-lg overflow-hidden mb-2">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* PRODUCT INFO */}
            <div className="flex flex-col flex-1">
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
        ))}
      </div>
    </div>
  )
}

export default Products
