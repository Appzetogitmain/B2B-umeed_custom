import { useMemo, useState, useEffect } from 'react'
import { CartContext } from './cartContextObject'

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('umeed-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem('umeed-cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        originalPrice: product.originalPrice || product.price,
        discount: product.discount || 0,
        quantity: 1, 
        image: product.image,
        stock: product.stock || 100, // fallback stock if undefined
        deliveryFee: product.deliveryFee || 0,
        platformFee: product.platformFee || 0,
        gst: product.gst || 0
      }]
    })
  }

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + 1;
          if (newQty > item.stock) {
            alert(`Only ${item.stock} units available in stock!`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    )
  }

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCartItems([])

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    const totalDeliveryFee = cartItems.reduce((sum, item) => sum + ((item.deliveryFee || 0) * item.quantity), 0)
    const totalPlatformFee = cartItems.reduce((sum, item) => sum + ((item.platformFee || 0) * item.quantity), 0)
    const totalGST = cartItems.reduce((sum, item) => {
      const itemGstAmount = (item.price * ((item.gst || 0) / 100))
      return sum + (itemGstAmount * item.quantity)
    }, 0)

    const grandTotal = subtotal + totalDeliveryFee + totalPlatformFee + totalGST

    return { 
      totalItems, 
      subtotal,
      totalDeliveryFee,
      totalPlatformFee,
      totalGST,
      grandTotal 
    }
  }, [cartItems])

  const value = {
    cartItems,
    totalItems: totals.totalItems,
    totalPrice: totals.grandTotal, // Expose grandTotal as totalPrice for backwards compatibility
    subtotal: totals.subtotal,
    totalDeliveryFee: totals.totalDeliveryFee,
    totalPlatformFee: totals.totalPlatformFee,
    totalGST: totals.totalGST,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartProvider }
