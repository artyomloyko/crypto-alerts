import { useAlerts } from '../context/alerts-context'
import { useWebSocket } from '../context/websocket-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { formatDistanceToNow } from 'date-fns'

export default function AlertsPage() {
  const { alerts, alertCounts } = useAlerts()
  const { isConnected } = useWebSocket()

  const cheapAlerts = alerts.filter((alert) => alert.rule === 'cheapOrder')
  const solidAlerts = alerts.filter((alert) => alert.rule === 'solidOrder')
  const bigBiznisAlerts = alerts.filter((alert) => alert.rule === 'bigBiznis')

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Alerts Dashboard</h1>

      {!isConnected && (
        <div className='bg-muted p-4 rounded-md mb-4'>
          <p>
            Stream is not connected. Click "Start Stream" to begin monitoring
            for alerts.
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle>Cheap Orders</CardTitle>
            <CardDescription>Price below $50,000</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>{alertCounts.cheapOrder}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle>Solid Orders</CardTitle>
            <CardDescription>More than 10 BTC</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>{alertCounts.solidOrder}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle>Big Biznis</CardTitle>
            <CardDescription>Total value over $1M</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>{alertCounts.bigBiznis}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='cheap' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='cheap'>Cheap Orders</TabsTrigger>
          <TabsTrigger value='solid'>Solid Orders</TabsTrigger>
          <TabsTrigger value='big'>Big Biznis</TabsTrigger>
        </TabsList>

        <TabsContent value='cheap'>
          <AlertTable alerts={cheapAlerts} title='Cheap Orders' />
        </TabsContent>

        <TabsContent value='solid'>
          <AlertTable alerts={solidAlerts} title='Solid Orders' />
        </TabsContent>

        <TabsContent value='big'>
          <AlertTable alerts={bigBiznisAlerts} title='Big Biznis' />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AlertTable({ alerts, title }: { alerts: any[]; title: string }) {
  const safeFormatDistance = (timestamp: number) => {
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true })
    } catch (error) {
      console.error('Error formatting date:', error, timestamp)
      return 'recently'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Showing alerts from the last minute ({alerts.length} alerts)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className='text-center py-4 text-muted-foreground'>
            No alerts in the last minute
          </p>
        ) : (
          <div className='rounded-md border'>
            <div className='w-full overflow-auto'>
              <table className='w-full caption-bottom text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Alert
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Price
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Quantity
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Total
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium'>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      className='border-b transition-colors hover:bg-muted/50'
                    >
                      <td className='p-4 align-middle'>{alert.alertMessage}</td>
                      <td className='p-4 align-middle'>
                        $
                        {alert.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className='p-4 align-middle'>
                        {alert.quantity.toLocaleString(undefined, {
                          minimumFractionDigits: 8,
                          maximumFractionDigits: 8,
                        })}{' '}
                        BTC
                      </td>
                      <td className='p-4 align-middle'>
                        $
                        {alert.total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className='p-4 align-middle'>
                        {safeFormatDistance(alert.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
