export interface ActivityItem {
  endpoint: string;
  method: string;
  timestamp: Date;
}

export interface ApiItem {
  name: string;
  endpoint: string;
  method: string;
  // hits: number;
  createdAt: string;
  updatedAt: string;
  // code: string;
}