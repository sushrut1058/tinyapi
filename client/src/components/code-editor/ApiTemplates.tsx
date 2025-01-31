import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  code: string;
  body: string;
  description: string;
}

interface ApiTemplatesProps {
  onTemplateSelect: (template: Template) => void;
}

const templates: Template[] = [
    {
        id: 'db-interactions',
        name: 'Database Operations',
        body: ``,
        description: 'CRUD operations on your tables',
        code: `class API:
    def __init__(self, db):
        db.connect()
        self.users = db.load("Users")

    def handler(self, Request, Response):

        # 1. INSERT operation - Adding a new user
        new_user = {"email":"sam@gmail.com", "username":"sam", "password":"ilovepizza"}
        is_insert_success, affected_rows_insert = self.users.insert(new_user)

        # 2. FETCH operation - Retrieving a user based on username and password
        search_criteria = {"username":"sam","password":"ilovepizza"}
        retrieved_users = self.users.fetch(search_criteria)

        # 3. UPDATE operation - Updating the email and username for a specific user
        update_filter = {"username":"sam"}
        updated_user = {"username":"sam_123", "email":"sam_123@gmail.com"}
        is_update_success, affected_rows_update = self.users.update(update_filter, updated_user)

        # 4. DELETE operation - Removing a user based on username
        delete_filter = {"username":"sam"}
        is_delete_success, affected_rows_delete = self.users.delete(delete_filter)        

        response_data = {
            "insert": {"success": is_insert_success, "rows_affected": affected_rows_insert},
            "fetch": {"users_found": retrieved_users},
            "update": {"success": is_update_success, "rows_affected": affected_rows_update},
            "delete": {"success": is_delete_success, "rows_affected": affected_rows_delete},
        }

        return Response(response_data, status=200) `
    },
    
    {
        id: 'parameter-extract',
        name: 'URL Parameter Extraction',
        body: ``,
        description: 'Extract query and search parameter values',
        code: `class API:
    def __init__(self, db):
        pass

    def handler(self, Request, Response):
        # Extracting query parameters (example: ?q1=value1&q2=value2)
        query_param1 = Request.query.get("q1", "default_value")  # Use default to avoid None
        query_param2 = Request.query.get("q2", "default_value")

        # Extracting path parameters (example: /items/:path1/:path2)
        path_param1 = Request.params.get("path1", "default_value")
        path_param2 = Request.params.get("path2", "default_value")

        # Example response including extracted parameters
        response_data = {
            "message": "API hit successfully",
            "query_params": {"q1": query_param1, "q2": query_param2},
            "path_params": {"path1": path_param1, "path2": path_param2},
        }

        return Response(response_data, status=200)  `
    },
  {
    id: 'user-reg',
    name: 'User Registration',
    description: 'Simple POST endpoint that registers a user',
    code: `# Nwgt7Hrp
import re, hashlib

class API:
    def __init__(self, db):
        db.connect()
        self.table = db.load("Users")

    def handler(self, Request, Response):
        # Get user details
        email = Request.body.get("email")
        password = Request.body.get("password")
        username = Request.body.get("username")

        # Validate inputs
        if not all([email, password, username]):
            return Response({"error": "Missing required fields"}, 400)
        
        # Validate username        
        if not re.match(r"^[a-zA-Z0-9_]+$", username):
            return Response({"error": "Invalid username format"}, 400)

        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return Response({"error": "Invalid email format"},400)

        # Validate password strength
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"},400)

        try:
            # Hash password
            hashed_password = hashlib.sha256(password.encode('utf-8'))

            # Store user in database (simplified)
            new_user = {
                "username": username,
                "email": email,
                "password": hashed_password.hexdigest()
            }
            status, affected_rows = self.table.insert(new_user)  # Insert data into table
            if status and affected_rows==1:
                return Response({
                    "message": "User registered successfully",
                    "username": username
                }, 200)
            else:
                return Response({"error":"Internal server error"}, 500)
            
        except Exception as e:
            return Response({"error": str(e)}, 500)`,
    body: `{
  "username":"sam",
  "email": "sam123@gmail.com",
  "password":"pizza123"
}`
  },
  {
    id: 'user-login',
    name: 'User Login',
    description: 'POST endpoint with user login along with validation',
    body:`{
  "email": "sam123@gmail.com",
  "password":"pizza123"
}`,
    code: `import re, hashlib, jwt, sys
from datetime import datetime, timedelta

class API:
    def __init__(self, db):
        db.connect()
        self.table = db.load("Users")
    
    def generate_jwt(self, email):
        """Generate a JWT for the user."""
        secret_key = "YOUR_SECRET_KEY"  # Replace with your secret key
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
        }
        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return token

    def handler(self, Request, Response):
        # Get user details
        email = Request.body.get("email")
        password = Request.body.get("password")

        # Validate inputs
        if not all([email, password]):
            return Response({"error": "Missing required fields"}, 400)
        
        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return Response({"error": "Invalid email format"},400)

        # Validate password strength
        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters"},400)
        
        try:
            hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
            rows = self.table.fetch({'email':email, 'password':hashed_password})
            if len(rows)>0:
                print(rows[0], file=sys.stderr)
                token = self.generate_jwt(email)
                return Response({"message":{"token":token}}, 200)
            else:
                return Response({"message":"Please check your credentials"}, 401)
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({"error":"Something went wrong"}, 500)  `
  },
  {
    id: 'token-generate',
    name: 'Generate & Refresh Tokens',
    body: `{
  "action":"refresh",
  "token":"jwt.goes.here"
}`,
    description: 'Endpoint for basic authentication functions',
    code: `import re, jwt, datetime

# Secret key for encoding the JWT 
SECRET_KEY = "your_super_secret_key"
ACCESS_TOKEN_EXPIRATION = 60
REFRESH_TOKEN_EXPIRATION = 60*24

class API:    
    def generate_tokens(self, data):
        now = datetime.datetime.utcnow()
        access_token = jwt.encode(
            {
                "user_id": data,
                "exp": now + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRATION)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        refresh_token = jwt.encode(
            {
                "user_id":data,
                "exp":now+datetime.timedelta(minutes=REFRESH_TOKEN_EXPIRATION)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return access_token, refresh_token

    def handler(self, Request, Response):
        try:
            action = Request.params.get('action')
            token = Request.params.get('token')
            if action=='refresh':
                try:
                    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                    new_access_token, new_refresh_token = self.generate_tokens(decoded['user_id'])
                    return Response({"message":"Token is valid", "user_id":decoded['user_id']}, 200)
                except jwt.ExpiredSignatureError:
                    return Response({"error":"Refresh token is expired"}, 401)
                except jwt.InvalidTokenError:
                    return Response({"error":"Refresh token is invalid"}, 401)
            else:
                return Response({"message":"Invalid action"}, 400)
        except Exception as e:
            return Response({"error":e}, 500)`
  }
];

export const ApiTemplates: React.FC<ApiTemplatesProps> = ({ onTemplateSelect }) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">
        <span>Templates</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="absolute bottom-full left-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className="w-full px-4 py-3 text-left hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
          >
            <div className="text-gray-200 font-medium text-sm">{template.name}</div>
            <div className="text-gray-400 text-xs">{template.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApiTemplates;