import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout'
import MonitorPage from './pages/monitor'
import AlertsPage from './pages/alerts'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <MonitorPage />,
        },
        {
          path: '/monitor',
          element: <MonitorPage />,
        },
        {
          path: '/alerts',
          element: <AlertsPage />,
        },
      ],
    },
  ],
  {
    basename: '/crypto-alerts',
  }
)
