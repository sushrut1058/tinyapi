import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

const recentActivity = [
  { id: 1, endpoint: '/api/users', method: 'GET', timestamp: '2023-06-30 15:30:00' },
  { id: 2, endpoint: '/api/posts', method: 'POST', timestamp: '2023-06-30 15:25:00' },
  { id: 3, endpoint: '/api/comments', method: 'PUT', timestamp: '2023-06-30 15:20:00' },
  { id: 4, endpoint: '/api/users/1', method: 'GET', timestamp: '2023-06-30 15:15:00' },
  { id: 5, endpoint: '/api/posts/1', method: 'DELETE', timestamp: '2023-06-30 15:10:00' },
]

export function RecentActivity() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentActivity.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.endpoint}</TableCell>
              <TableCell>{activity.method}</TableCell>
              <TableCell>{activity.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

