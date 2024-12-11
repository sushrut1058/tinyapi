import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Eye, Trash } from 'lucide-react'

const apiData = [
  { id: 1, endpoint: '/api/users', method: 'GET', hits: 1000, createdAt: '2023-01-01', updatedAt: '2023-06-15' },
  { id: 2, endpoint: '/api/posts', method: 'POST', hits: 500, createdAt: '2023-02-15', updatedAt: '2023-06-20' },
  { id: 3, endpoint: '/api/comments', method: 'PUT', hits: 250, createdAt: '2023-03-10', updatedAt: '2023-06-25' },
]

export function ApiList() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Endpoint</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Source Code</TableHead>
            <TableHead>Hits</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiData.map((api) => (
            <TableRow key={api.id}>
              <TableCell>{api.endpoint}</TableCell>
              <TableCell>{api.method}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </TableCell>
              <TableCell>{api.hits}</TableCell>
              <TableCell>{api.createdAt}</TableCell>
              <TableCell>{api.updatedAt}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

