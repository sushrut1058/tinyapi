"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { ArrowLeft, Copy } from 'lucide-react'
import { ScrollArea } from "../components/ui/scroll-area"

const templates = [
  {
    name: "Insert into db",
    code: `
const insertIntoDB = async (data) => {
  try {
    const result = await db.collection('users').insertOne(data);
    console.log('Inserted document:', result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error('Error inserting into DB:', error);
    throw error;
  }
};
    `.trim()
  },
  {
    name: "Fetch from db",
    code: `
const fetchFromDB = async (query) => {
  try {
    const result = await db.collection('users').find(query).toArray();
    console.log('Fetched documents:', result);
    return result;
  } catch (error) {
    console.error('Error fetching from DB:', error);
    throw error;
  }
};
    `.trim()
  },
  {
    name: "Simple API response",
    code: `
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello, World!',
    timestamp: new Date().toISOString()
  });
});
    `.trim()
  }
];

export function StandardTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg h-[200px] flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Standard Templates</h2>
      <ScrollArea className="flex-grow">
        {selectedTemplate ? (
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedTemplate(null)}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
            </Button>
            <div className="relative">
              <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto text-sm">
                <code>{selectedTemplate.code}</code>
              </pre>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(selectedTemplate.code)}
              >
                <Copy className="mr-2 h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {templates.map((template) => (
              <li key={template.name}>
                <Button
                  variant="ghost"
                  className="w-full text-left text-sm py-1"
                  onClick={() => setSelectedTemplate(template)}
                >
                  {template.name}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}

