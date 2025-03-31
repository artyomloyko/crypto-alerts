import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { AlertTypes } from './../lib/constants'
import { Alert, AlertCounts, Order } from '@/lib/types'

interface AlertsContextType {
  alerts: Alert[]
  alertCounts: AlertCounts
  checkAndAddAlert: (order: Order) => void
}

const AlertsContext = createContext<AlertsContextType | null>(null)

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertCounts, setAlertCounts] = useState<AlertCounts>({
    cheap: 0,
    solid: 0,
    bigBiznis: 0,
  })

  const checkAndAddAlert = useCallback((order: Order) => {
    const [cheapAlert, solidAlert, bigBiznisAlert] = AlertTypes
    const newAlerts: Alert[] = []

    // Rule 1: "Cheap order" - price below $50000
    if (cheapAlert.validator(order)) {
      newAlerts.push({
        ...order,
        type: cheapAlert.type,
        title: cheapAlert.title,
      })
    }

    // Rule 2: "Solid order" - more than 10BTC
    if (solidAlert.validator(order)) {
      newAlerts.push({
        ...order,
        type: solidAlert.type,
        title: solidAlert.title,
      })
    }

    // Rule 3: "Big biznis here" - total value over $1M
    if (bigBiznisAlert.validator(order)) {
      newAlerts.push({
        ...order,
        type: solidAlert.type,
        title: solidAlert.title,
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
          if (alert.type === 'cheap') newCounts.cheap++
          if (alert.type === 'solid') newCounts.solid++
          if (alert.type === 'bigBiznis') newCounts.bigBiznis++
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
