import { getBackendUrl, getImageUrl } from '../utils/api';
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import useCart from '../hooks/useCart'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${getBackendUrl()}/api/v1/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.mrp,
      image: getImageUrl(product.images?.[0]) || '',
      category: product.category
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pb-4 px-4 pt-4 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500 font-medium">Product not found</p>
          <button onClick={() => navigate('/retailer/products')} className="mt-4 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold">
            Back to Catalog
          </button>
        </div>
      </div>
    )
  }

  const discount = product.discount || (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0)
  const mainImage = getImageUrl(product.images?.[0]) || ''

  return (
    <div className="pb-32 px-4 pt-4 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="h-12 w-12 grid place-items-center bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Product Details</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Catalog item</p>
          </div>
        </header>

        {/* PRODUCT IMAGE */}
        <section className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50 mb-6">
          <div className="w-full flex items-center justify-center relative bg-slate-50 min-h-[250px] max-h-[350px]">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="max-h-64 max-w-full object-contain p-4 block mx-auto" />
            ) : (
              <Package size={48} className="text-slate-200" />
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-wider">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <div key={idx} className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 border-slate-100">
                  <img src={getImageUrl(img)} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PRODUCT INFO */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{product.category}</p>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-3">{product.name}</h2>

          {product.variantName && (
            <p className="text-xs text-slate-500 font-medium mb-3">Variant: {product.variantName}</p>
          )}

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-black text-black">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <span className="text-lg text-slate-400 line-through font-medium">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>
        </section>

      {/* QUANTITY & ADD TO CART */}
      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantity</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-10 w-10 grid place-items-center bg-slate-100 rounded-xl active:scale-95 transition-all"
            >
              <Minus size={16} />
            </button>
            <span className="text-lg font-black text-[#0F172A] w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 grid place-items-center bg-slate-100 rounded-xl active:scale-95 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl ${added
            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
            : product.stock > 0
              ? 'bg-black text-white shadow-black/10'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
        >
          {added ? (
            <>
              <Check size={18} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              {product.stock > 0 ? `Add ${quantity} to Cart — ₹${(product.price * quantity).toLocaleString('en-IN')}` : 'Out of Stock'}
            </>
          )}
        </button>
      </section>
      </div>
    </div>
  )
}

export default ProductDetail
