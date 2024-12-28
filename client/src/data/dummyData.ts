import { ActivityItem, ApiItem } from '../types/profile';

export const dummyActivity: ActivityItem[] = [
  { endpoint: '/api/users', method: 'GET', timestamp: new Date() },
  { endpoint: '/api/products', method: 'POST', timestamp: new Date(Date.now() - 3600000) },
  { endpoint: '/api/orders', method: 'PUT', timestamp: new Date(Date.now() - 7200000) },
];

export const dummyApis: ApiItem[] = [
  {
    endpoint: '/api/users',
    method: 'GET',
    hits: 1234,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
    code: 'export default function handler(req, res) {\n  res.status(200).json({ users: [] });\n}',
  },
  {
    endpoint: '/api/products',
    method: 'POST',
    hits: 567,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 3600000),
    code: 'export default function handler(req, res) {\n  res.status(201).json({ message: "Product created" });\n}',
  },
];