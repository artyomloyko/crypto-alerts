import { AlertType, Order } from "./types"

interface AlertItem {
  type: AlertType
  title: string
  validator: (order: Order) => boolean
}

export const AlertTypes: AlertItem[] = [
  {
    type: 'cheap',
    title: 'Cheap order',
    validator: (order) => order.price < 50000,
  },
  {
    type: 'solid',
    title: 'Solid order',
    validator: (order) => order.quantity > 10,
  },
  {
    type: 'bigBiznis',
    title: 'Big biznis here',
    validator: (order) => order.total > 1000000,
  },
]

export const Subs = ['8~Binance~BTC~USDT']