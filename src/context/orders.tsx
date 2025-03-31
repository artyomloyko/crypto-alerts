import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useAlerts } from './alerts'
import { Order } from '@/lib/types'

interface OrdersContextType {
  orders: Order[]
  checkAndAddOrder: (data: any) => void
}

const OrdersContext = createContext<OrdersContextType | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const { checkAndAddAlert } = useAlerts()

  const checkAndAddOrder = useCallback(
    (data: any) => {
      if (
        data.TYPE !== '8' ||
        data.M !== 'Binance' ||
        data.FSYM !== 'BTC' ||
        data.TSYM !== 'USDT'
      )
        return

      const timestamp = data.REPORTEDNS
        ? typeof data.REPORTEDNS === 'number'
          ? Math.floor(data.REPORTEDNS / 1000000)
          : Date.now()
        : Date.now()

      const newOrder: Order = {
        id: data.CCSEQ,
        price: data.P || 0,
        quantity: data.Q || 0,
        total: (data.P || 0) * (data.Q || 0),
        timestamp: timestamp,
        type: data.SIDE === 1 ? 'sell' : 'buy',
      }

      checkAndAddAlert(newOrder)

      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders].slice(0, 500)
        return updatedOrders
      })
    },
    [setOrders, checkAndAddAlert]
  )

  return (
    <OrdersContext.Provider value={{ orders, checkAndAddOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within a OrdersProvider')
  }
  return context
}
