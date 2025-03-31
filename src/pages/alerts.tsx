import { useAlerts } from '../context/alerts'
import { useWebSocket } from '../context/websocket'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { AlertTable } from '@/components/alert-table'

export default function AlertsPage() {
  const { alerts, alertCounts } = useAlerts()
  const { isConnected } = useWebSocket()

  const cheapAlerts = alerts.filter((alert) => alert.type === 'cheap')
  const solidAlerts = alerts.filter((alert) => alert.type === 'solid')
  const bigBiznisAlerts = alerts.filter((alert) => alert.type === 'bigBiznis')

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
            <p className='text-4xl font-bold'>{alertCounts.cheap}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle>Solid Orders</CardTitle>
            <CardDescription>More than 10 BTC</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>{alertCounts.solid}</p>
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
