import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { AlertsProvider } from './context/alerts'
import { OrdersProvider } from './context/orders'
import { WebSocketProvider } from './context/websocket'
import { router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AlertsProvider>
      <OrdersProvider>
        <WebSocketProvider>
          <RouterProvider router={router} />
        </WebSocketProvider>
      </OrdersProvider>
    </AlertsProvider>
  </React.StrictMode>
)
