import { createContext, useContext, useMemo, useReducer, useCallback } from 'react'

// ---------------------------------------------------------------------------
// In-memory cart (NO localStorage — per brief, state lives only in React).
// ---------------------------------------------------------------------------

const CartContext = createContext(null)

const initialState = { items: [] } // items: { id, name, price, veg, qty }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i,
        ),
      }
    case 'DECREMENT':
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const add = useCallback((item) => dispatch({ type: 'ADD', item }), [])
  const increment = useCallback((id) => dispatch({ type: 'INCREMENT', id }), [])
  const decrement = useCallback((id) => dispatch({ type: 'DECREMENT', id }), [])
  const remove = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const count = useMemo(
    () => state.items.reduce((n, i) => n + i.qty, 0),
    [state.items],
  )
  const total = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [state.items],
  )

  // Quick lookup of a single item's qty (used by menu cards to show steppers)
  const qtyOf = useCallback(
    (id) => state.items.find((i) => i.id === id)?.qty ?? 0,
    [state.items],
  )

  const value = useMemo(
    () => ({
      items: state.items,
      count,
      total,
      add,
      increment,
      decrement,
      remove,
      clear,
      qtyOf,
    }),
    [state.items, count, total, add, increment, decrement, remove, clear, qtyOf],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
