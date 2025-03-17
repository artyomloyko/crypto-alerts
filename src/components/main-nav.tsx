'use client'

import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { useWebSocket } from '../context/websocket-context'

export function MainNav() {
  const location = useLocation()
  const { isConnected, connect, disconnect } = useWebSocket()

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4 justify-center'>
        <nav className='flex items-center space-x-4 lg:space-x-6 mr-4'>
          <Link
            to='/monitor'
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname === '/monitor'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Monitor
          </Link>
          <Link
            to='/alerts'
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              location.pathname === '/alerts'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Alerts
          </Link>
        </nav>
        <Button
          onClick={isConnected ? disconnect : connect}
          variant={isConnected ? 'destructive' : 'default'}
        >
          {isConnected ? 'Stop Stream' : 'Start Stream'}
        </Button>
      </div>
    </div>
  )
}
