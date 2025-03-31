import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { Subs } from '@/lib/constants'
import { useOrders } from './orders'

const API_KEY = import.meta.env.VITE_CRYPTO_COMPARE_API_KEY
const URL = `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`

interface WebSocketContextType {
  isSubscribed: boolean
  subscribe: () => void
  unsubscribe: () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { checkAndAddOrder } = useOrders()

  useEffect(() => {
    if (socket) return

    const ws = new WebSocket(URL)

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        checkAndAddOrder(data)
      } catch (error) {
        console.error('Error processing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    setSocket(ws)

    return () => {
      ws.close()
      setSocket(null)
    }
  }, [])

  const subscribe = useCallback(() => {
    if (!socket) return

    const subRequest = {
      action: 'SubAdd',
      subs: Subs,
    }
    socket.send(JSON.stringify(subRequest))
    setIsSubscribed(true)
  }, [socket])

  const unsubscribe = useCallback(() => {
    if (!socket) return

    const subRequest = {
      action: 'SubRemove',
      subs: Subs,
    }
    socket.send(JSON.stringify(subRequest))
    setIsSubscribed(false)
  }, [socket])

  return (
    <WebSocketContext.Provider value={{ isSubscribed, subscribe, unsubscribe }}>
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
