'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

interface Order {
  id: string
  price: number
  quantity: number
  total: number
  timestamp: number
  type: string
}

interface Alert {
  id: string
  rule: string
  alertMessage: string
  price: number
  quantity: number
  total: number
  timestamp: number
}

interface AlertCounts {
  cheapOrder: number
  solidOrder: number
  bigBiznis: number
}

interface AlertsContextType {
  alerts: Alert[]
  alertCounts: AlertCounts
  checkAndAddAlert: (order: Order) => void
}

const AlertsContext = createContext<AlertsContextType | null>(null)

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertCounts, setAlertCounts] = useState<AlertCounts>({
    cheapOrder: 0,
    solidOrder: 0,
    bigBiznis: 0,
  })

  const checkAndAddAlert = useCallback((order: Order) => {
    const newAlerts: Alert[] = []

    // Rule 1: "Cheap order" - price below $50000
    if (order.price < 50000) {
      newAlerts.push({
        id: `cheap-${order.id}`,
        rule: 'cheapOrder',
        alertMessage: 'Cheap order',
        price: order.price,
        quantity: order.quantity,
        total: order.total,
        timestamp: order.timestamp,
      })
    }

    // Rule 2: "Solid order" - more than 10BTC
    if (order.quantity > 10) {
      newAlerts.push({
        id: `solid-${order.id}`,
        rule: 'solidOrder',
        alertMessage: 'Solid order',
        price: order.price,
        quantity: order.quantity,
        total: order.total,
        timestamp: order.timestamp,
      })
    }

    // Rule 3: "Big biznis here" - total value over $1M
    if (order.total > 1000000) {
      newAlerts.push({
        id: `big-${order.id}`,
        rule: 'bigBiznis',
        alertMessage: 'Big biznis here',
        price: order.price,
        quantity: order.quantity,
        total: order.total,
        timestamp: order.timestamp,
      })
    }

    if (newAlerts.length > 0) {
      setAlerts((prevAlerts) => {
        const updatedAlerts = [...newAlerts, ...prevAlerts]

        const oneMinuteAgo = Date.now() - 60000
        const filteredAlerts = updatedAlerts.filter(
          (alert) => alert.timestamp >= oneMinuteAgo
        )

        return filteredAlerts
      })

      setAlertCounts((prevCounts) => {
        const newCounts = { ...prevCounts }

        newAlerts.forEach((alert) => {
          if (alert.rule === 'cheapOrder') newCounts.cheapOrder++
          if (alert.rule === 'solidOrder') newCounts.solidOrder++
          if (alert.rule === 'bigBiznis') newCounts.bigBiznis++
        })

        return newCounts
      })
    }

    const oneMinuteAgo = Date.now() - 60000
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.timestamp >= oneMinuteAgo)
    )
  }, [])

  return (
    <AlertsContext.Provider value={{ alerts, alertCounts, checkAndAddAlert }}>
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts() {
  const context = useContext(AlertsContext)
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider')
  }
  return context
}
