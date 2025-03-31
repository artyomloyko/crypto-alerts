export interface Order {
  id: string
  price: number
  quantity: number
  total: number
  timestamp: number
  type: string
}

export type AlertType = 'cheap' | 'solid' | 'bigBiznis'

export interface Alert extends Order {
  type: AlertType
  title: string
}

export interface AlertCounts {
  cheap: number
  solid: number
  bigBiznis: number
}
