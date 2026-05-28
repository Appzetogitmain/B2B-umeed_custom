import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

const getBackendUrl = () => {
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:5200';
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(hostname)) return `http://${hostname}:5200`;
  return 'http://localhost:5200';
}

function Products() {
  const { addToCart, totalItems } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [addedId, setAddedId] = useState(null)
  const [categories, setCategories] = useState(['All'])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${getBackendUrl()}/api/v1/categories`),
          fetch(`${getBackendUrl()}/api/v1/products`)
        ])

        if (catRes.ok) {
          const catData = await catRes.json()
          if (catData && catData.length > 0) {
            setCategories(['All', ...catData.map(c => c.categoryName)])
          }
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json()
          if (prodData && prodData.length > 0) {
            setProducts(prodData.map(p => ({
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
        console.error('Error fetching products/categories:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = products.filter(p => {
    // Category filter
    if (selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase().trim()
      const prodCatLower = p.category.toLowerCase().trim()
      if (!prodCatLower.includes(catLower) && !catLower.includes(prodCatLower)) {
        const catWords = catLower.split(/[\s&|,-]+/).filter(w => w.length > 2)
        const prodWords = prodCatLower.split(/[\s&|,-]+/).filter(w => w.length > 2)
        const match = catWords.some(cw => prodWords.some(pw => pw.includes(cw) || cw.includes(pw)))
        if (!match) return false
      }
    }
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-white rounded-xl border border-slate-100 shadow-sm outline-none focus:border-black text-xs transition-all"
        />
      </div>

      {/* CATEGORIES */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat, idx) => (
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
        {isLoading ? (
          <div className="col-span-2 py-10 text-center">
            <div className="h-6 w-6 border-2 border-slate-200 border-t-black rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
          <Link to={`/retailer/product/${product.id}`} key={product.id} className="bg-white rounded-xl p-2 shadow-sm border border-slate-50 flex flex-col hover:shadow-md transition-all duration-200 group">
            <div className="relative h-28 w-full bg-slate-50 rounded-lg overflow-hidden mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {product.discount && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-white text-[7px] font-black uppercase tracking-tighter">
                  {product.discount}
                </div>
              )}
            </div>

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
          </Link>
        )) : (
          <div className="col-span-2 py-10 text-center">
            <p className="text-xs text-slate-400">No items found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
