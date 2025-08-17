# TradeWise Backend - Complete Business Management System

A comprehensive backend system for business inventory management, sales tracking, and analytics built with Node.js, Express, and PostgreSQL.

## 🚀 **Features Overview**

### **Core Business Functions**
- ✅ **User Management**: Role-based access (User/Admin)
- ✅ **Business Profiles**: Complete company information management
- ✅ **Inventory Management**: Product stock tracking with alerts
- ✅ **Sales & Purchases**: Daily transaction recording
- ✅ **Order Processing**: Shopping cart to order conversion
- ✅ **Financial Tracking**: Revenue, expenses, and profit analysis
- ✅ **Notifications**: Low stock and out-of-stock alerts
- ✅ **Dashboard Analytics**: Real-time business insights

### **Security & Access Control**
- 🔐 JWT Authentication
- 🛡️ Role-based permissions
- 🔒 Protected API endpoints
- 💾 Secure password hashing

## 🏗️ **System Architecture**

```
Frontend → API Gateway → Controllers → Database
   ↓           ↓           ↓           ↓
React App → Express → Business Logic → PostgreSQL
```

## 📊 **Database Schema**

### **Core Tables**
- **users**: Company accounts with roles
- **business_profiles**: Detailed business information
- **products**: Inventory management
- **sales**: Sales transactions
- **purchases**: Purchase records
- **transactions**: Financial tracking
- **orders**: Shopping cart orders
- **notifications**: System alerts

### **Key Features**
- Automatic product status updates
- Order number generation
- Low stock notifications
- User data isolation

## 🔌 **API Endpoints**

### **Authentication & Users**
```
POST   /api/users/register     - User registration
POST   /api/users/login        - User login
GET    /api/users/dashboard    - User dashboard data
GET    /api/users              - Get all users (Admin)
GET    /api/users/:id          - Get user by ID
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

### **Business Profiles**
```
POST   /api/business-profile           - Create/update profile
GET    /api/business-profile/user/:id  - Get user profile
GET    /api/business-profile/all       - Get all profiles (Admin)
DELETE /api/business-profile/:id       - Delete profile
```

### **Products & Inventory**
```
GET    /api/products           - Get user's products
POST   /api/products          - Create product
GET    /api/products/:id      - Get product by ID
PUT    /api/products/:id      - Update product
DELETE /api/products/:id      - Delete product
GET    /api/products/search   - Search products
GET    /api/products/stats    - Get inventory statistics
```

### **Sales & Purchases**
```
GET    /api/sales             - Get user's sales
POST   /api/sales             - Create sale record
GET    /api/sales/:id         - Get sale by ID
PUT    /api/sales/:id         - Update sale
DELETE /api/sales/:id         - Delete sale

GET    /api/purchases         - Get user's purchases
POST   /api/purchases         - Create purchase record
GET    /api/purchases/:id     - Get purchase by ID
PUT    /api/purchases/:id     - Update purchase
DELETE /api/purchases/:id     - Delete purchase
```

### **Orders & Shopping Cart**
```
POST   /api/orders            - Create order from cart
GET    /api/orders/user/:id   - Get user's orders
GET    /api/orders/:id        - Get order details
PUT    /api/orders/:id/status - Update order status
GET    /api/orders/all        - Get all orders (Admin)
```

### **Transactions & Finance**
```
GET    /api/transactions      - Get user's transactions
POST   /api/transactions      - Create transaction
GET    /api/transactions/:id  - Get transaction by ID
PUT    /api/transactions/:id  - Update transaction
DELETE /api/transactions/:id  - Delete transaction
GET    /api/transactions/search - Search transactions
```

### **Notifications**
```
POST   /api/notifications                    - Create notification
GET    /api/notifications/user/:id           - Get user notifications
PUT    /api/notifications/:id/read           - Mark as read
PUT    /api/notifications/user/:id/read-all  - Mark all as read
DELETE /api/notifications/:id                - Delete notification
GET    /api/notifications/user/:id/unread-count - Get unread count
```

### **Dashboard & Analytics**
```
GET    /api/dashboard/data    - Get comprehensive dashboard data
GET    /api/dashboard/metrics - Get business performance metrics
```

## 🚀 **Setup Instructions**

### **1. Prerequisites**
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### **2. Installation**
```bash
# Clone repository
git clone <repository-url>
cd TradeWise/src/backend-form1

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

### **3. Environment Configuration**
```env
# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=TradeWise

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=4000
```

### **4. Database Setup**
```bash
# Create PostgreSQL database
CREATE DATABASE "TradeWise";

# Initialize schema
npm run init-db
```

### **5. Start Application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔐 **Authentication Flow**

### **User Registration**
1. User signs up → Role defaults to 'user'
2. Redirected to `/land` page
3. Complete business profile
4. Access dashboard with full functionality

### **Role-Based Access**
- **User**: Manage own business data
- **Admin**: Access all business data + system management

### **JWT Token Usage**
```javascript
// Include in API requests
headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

## 📈 **Business Analytics Features**

### **Real-Time Dashboard**
- Daily sales/purchase metrics
- Monthly and yearly trends
- Inventory status overview
- Low stock alerts
- Recent activity feed

### **Performance Metrics**
- Revenue analysis
- Profit margins
- Customer insights
- Supplier performance
- Cash flow tracking

### **Automated Notifications**
- Low stock warnings
- Out-of-stock alerts
- Daily business summaries
- Performance milestones

## 🛒 **Shopping Cart System**

### **Cart Management**
- Add/remove products
- Quantity adjustments
- Price calculations
- Checkout process

### **Order Processing**
- Cart to order conversion
- Inventory updates
- Transaction recording
- Order tracking

## 🔔 **Notification System**

### **Alert Types**
- **Low Stock**: Products below minimum threshold
- **Out of Stock**: Products with zero quantity
- **Business Updates**: Daily summaries and alerts
- **System Notifications**: Important system events

### **Delivery Methods**
- Real-time dashboard alerts
- API notifications
- Email integration (future)
- SMS alerts (future)

## 🧪 **Testing & Development**

### **API Testing**
```bash
# Test endpoints with curl or Postman
curl -X GET http://localhost:4000/api/dashboard/data \
  -H "Authorization: Bearer <token>"
```

### **Database Queries**
```sql
-- Check user data
SELECT * FROM users WHERE role = 'admin';

-- View business profiles
SELECT bp.*, u.company_name 
FROM business_profiles bp 
JOIN users u ON bp.user_id = u.id;

-- Get inventory alerts
SELECT name, quantity, min_stock_level 
FROM products 
WHERE quantity <= min_stock_level;
```

## 📊 **Performance & Scalability**

### **Database Optimization**
- Indexed queries for fast retrieval
- Connection pooling
- Efficient joins and aggregations
- Transaction management

### **API Performance**
- Pagination for large datasets
- Caching strategies
- Rate limiting
- Error handling

## 🔒 **Security Features**

### **Data Protection**
- Password hashing with bcrypt
- JWT token expiration
- SQL injection prevention
- Input validation

### **Access Control**
- Route protection middleware
- Role-based permissions
- User data isolation
- API rate limiting

## 🚀 **Deployment**

### **Production Setup**
```bash
# Set production environment
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "tradewise-backend"

# Database backup
pg_dump TradeWise > backup.sql
```

### **Environment Variables**
- Database credentials
- JWT secrets
- API keys
- Service configurations

## 📝 **API Documentation**

### **Request/Response Format**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

### **Error Handling**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### **Code Standards**
- ESLint configuration
- Prettier formatting
- JSDoc documentation
- Error handling patterns

## 📞 **Support & Contact**

### **Documentation**
- API reference
- Database schema
- Deployment guides
- Troubleshooting

### **Community**
- GitHub issues
- Discussion forums
- Developer chat
- Email support

---

**TradeWise Backend** - Empowering businesses with comprehensive inventory and financial management solutions! 🚀
