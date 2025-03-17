import { useWebSocket } from '../context/websocket-context'
import { useAlerts } from '../context/alerts-context'
import { cn } from '../lib/utils'
import { formatDistanceToNow } from 'date-fns'

export default function MonitorPage() {
  const { orders, isConnected } = useWebSocket()
  const { alerts } = useAlerts()

  const isAlerted = (orderId: string) => {
    return alerts.some(
      (alert) =>
        alert.id === `cheap-${orderId}` ||
        alert.id === `solid-${orderId}` ||
        alert.id === `big-${orderId}`
    )
  }

  const safeFormatDistance = (timestamp: number) => {
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting date:', error, timestamp)
      return 'recently'
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Order Monitor</h1>

      {!isConnected && (
        <div className='bg-muted p-4 rounded-md mb-4'>
          <p>
            Stream is not connected. Click "Start Stream" to begin monitoring.
          </p>
        </div>
      )}

      <div className='bg-black text-green-400 font-mono p-4 rounded-md h-[calc(100vh-200px)] overflow-y-auto'>
        {orders.length === 0 ? (
          <div className='text-center py-8'>
            {isConnected ? 'Waiting for orders...' : 'Connect to see orders'}
          </div>
        ) : (
          <div className='space-y-1'>
            {orders.map((order, idx) => (
              <div
                key={idx}
                className={cn(
                  'py-1 border-b border-gray-800',
                  isAlerted(order.id) ? 'bg-red-900/30 text-white' : '',
                  order.type === 'buy' ? 'text-green-400' : 'text-red-400'
                )}
              >
                <code>
                  [{safeFormatDistance(order.timestamp)}]{' '}
                  {order.type.toUpperCase()} | Price: $
                  {order.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  | Qty:{' '}
                  {order.quantity.toLocaleString(undefined, {
                    minimumFractionDigits: 8,
                    maximumFractionDigits: 8,
                  })}{' '}
                  BTC | Total: $
                  {order.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
