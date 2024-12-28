export interface ActivityItem {
  endpoint: string;
  method: string;
  timestamp: Date;
}

export interface ApiItem {
  endpoint: string;
  method: string;
  hits: number;
  createdAt: Date;
  updatedAt: Date;
  code: string;
}