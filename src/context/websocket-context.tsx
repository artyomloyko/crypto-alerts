import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useAlerts } from './alerts-context'

const API_KEY = import.meta.env.VITE_CRYPTO_COMPARE_API_KEY

interface Order {
  id: string
  price: number
  quantity: number
  total: number
  timestamp: number
  type: string
}

interface WebSocketContextType {
  isConnected: boolean
  orders: Order[]
  connect: () => void
  disconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const { checkAndAddAlert } = useAlerts()

  const connect = useCallback(() => {
    if (socket) return

    const ws = new WebSocket(
      `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
    )

    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)

      const subRequest = {
        action: 'SubAdd',
        subs: ['8~Binance~BTC~USDT'],
      }
      ws.send(JSON.stringify(subRequest))
    }

    ws.onmessage = (event) => {
      try {
        console.log(event)
        const data = JSON.parse(event.data)

        if (
          data.TYPE === '8' &&
          data.M === 'Binance' &&
          data.FSYM === 'BTC' &&
          data.TSYM === 'USDT'
        ) {
          const timestamp = data.REPORTEDNS
            ? typeof data.REPORTEDNS === 'number'
              ? Math.floor(data.REPORTEDNS / 1000000)
              : Date.now()
            : Date.now()

          const uniqueId = `${timestamp}-${Math.floor(Math.random() * 10000)}`

          const newOrder: Order = {
            id: uniqueId,
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
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    }

    setSocket(ws)
  }, [checkAndAddAlert])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close()
      setSocket(null)
      setIsConnected(false)
    }
  }, [socket])

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket])

  return (
    <WebSocketContext.Provider
      value={{ isConnected, orders, connect, disconnect }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}
