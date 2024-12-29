export interface TableField {
    name: string;
    type: string;
  }
  
  export interface Table {
    name: string;
    fields: TableField[];
    data: Record<string, any>[];
  }