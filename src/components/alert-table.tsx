import { safeFormatDistance } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Alert } from '@/lib/types'

type Props = {
  alerts: Alert[]
  title: string
}

export function AlertTable({ alerts, title }: Props) {
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
                      <td className='p-4 align-middle'>{alert.title}</td>
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
