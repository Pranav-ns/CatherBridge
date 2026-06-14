# CaterBridge

CaterBridge is a full-stack catering and tiffin-service marketplace that connects customers with local caterers. Customers can browse caterers by cuisine/location, save favourites, submit catering requests, manage tiffin subscriptions, use a wallet/payment flow, and chat with an AI support assistant. Caterers can manage their profile, menu, photos, and customer requests from a dedicated dashboard.

## Features

- **Client and caterer authentication** with JWT-based login/register flows
- **Role-based dashboards** for customers and caterers
- **Caterer discovery** with cuisine, city/location, and vegetarian-mode filtering
- **Catering request system** for customers to request service from caterers
- **Request management** for caterers to accept or decline requests
- **Reviews and ratings** for caterers
- **Favourites** so customers can save preferred caterers
- **Referral code system** for customers
- **Tiffin schedule and subscription flow** for daily/weekly/monthly meal planning
- **Wallet and Stripe payment intent integration**
- **AI chatbot support** using a small knowledge base and Gemini API
- **Responsive React UI** with a modern marketplace layout

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Stripe React SDK
- Lucide React icons
- CSS modules/files for page and component styling

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing
- Stripe API
- Google Gemini API via `@google/genai`
- Docker support

## Project Structure

```text
CaterBridge-main/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── chat.controller.js
│   ├── data/
│   │   └── knowledgeBase.json
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Caterer.js
│   │   ├── Request.js
│   │   ├── Review.js
│   │   ├── Subscription.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── caterer.routes.js
│   │   ├── chat.routes.js
│   │   ├── payment.routes.js
│   │   ├── request.routes.js
│   │   ├── review.routes.js
│   │   ├── subscription.routes.js
│   │   ├── user.routes.js
│   │   └── wallet.routes.js
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vercel.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed or configured:

- Node.js and npm
- MongoDB Atlas connection string or a local MongoDB setup
- Stripe test account for payment testing
- Gemini API key for the chatbot

## Backend Setup

Go into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5001
```

The root API route should show:

```text
CaterBridge API is running...
```

## Frontend Setup

Open a new terminal and go into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start the frontend development server:

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

## Database Seeding

The backend includes a seed script that inserts sample caterers across multiple Canadian cities.

From the `backend` folder, run:

```bash
node seed.js
```

The seed script requires a valid `MONGO_URI` in your backend `.env` file.

## Main API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a client or caterer |
| POST | `/api/auth/login` | Login as a client or caterer |
| GET | `/api/caterers` | Get all caterers |
| GET | `/api/caterers/:id` | Get one caterer by ID |
| PUT | `/api/caterers/profile` | Update caterer profile |
| POST | `/api/requests` | Create a catering request |
| GET | `/api/requests` | Get requests for the logged-in user |
| PUT | `/api/requests/:id/status` | Update request status |
| GET | `/api/reviews/:catererId` | Get reviews for a caterer |
| POST | `/api/reviews` | Create a review |
| POST | `/api/subscriptions` | Create a tiffin subscription |
| GET | `/api/subscriptions` | Get user subscriptions |
| PUT | `/api/subscriptions/:id/status` | Pause or cancel a subscription |
| POST | `/api/users/favorites/:catererId` | Add/remove a favourite caterer |
| GET | `/api/users/favorites` | Get favourite caterers |
| GET | `/api/users/referral` | Get referral code |
| GET | `/api/wallet` | Get wallet balance/history |
| POST | `/api/wallet/add` | Add funds to wallet |
| POST | `/api/payments/create-payment-intent` | Create Stripe payment intent |
| POST | `/api/chat` | Send a message to the AI chatbot |

## Deployment Notes

### Frontend on Vercel

The frontend is designed to deploy on Vercel.

From the `frontend` folder, the production build command is:

```bash
npm run build
```

If the frontend calls the backend through `/api`, update `frontend/vercel.json` so Vercel rewrites API requests to your deployed backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://YOUR_BACKEND_DOMAIN_OR_IP/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

When deploying to Vercel, also add this environment variable if you are not using rewrites:

```env
VITE_API_URL=https://your-backend-url/api
```

### Backend on AWS/EC2

For AWS EC2 deployment, make sure:

- Node.js is installed on the server
- Your backend `.env` file exists on the server
- The backend port is open in the EC2 security group
- The server process is managed with something like PM2

Example PM2 commands:

```bash
npm install -g pm2
pm2 start server.js --name caterbridge-backend
pm2 save
pm2 startup
```

If you change your Vercel frontend URL, check whether your backend uses a specific CORS origin. If it does, update the frontend URL in the backend environment/config and restart the backend.

## Docker

A Dockerfile and `docker-compose.yml` are included for the backend.

To build and run with Docker Compose:

```bash
docker compose up --build
```

Before using Docker, confirm the port in `docker-compose.yml` matches the `PORT` value used by the backend.

## Important Security Notes

- Do not commit real `.env` files to GitHub.
- Keep MongoDB, Stripe, JWT, and Gemini keys private.
- Use `.env.example` files for sharing required environment variable names.
- Rotate any secrets that were accidentally committed or shared publicly.

Recommended backend `.env.example`:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
```

Recommended frontend `.env.example`:

```env
VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Future Improvements

- Add automated tests for backend routes and frontend components
- Add stronger payment confirmation and order tracking
- Add image upload support for caterer photos
- Add admin dashboard for platform management
- Improve chatbot retrieval using embeddings/vector search
- Add email notifications for request updates
- Add production-ready logging and monitoring