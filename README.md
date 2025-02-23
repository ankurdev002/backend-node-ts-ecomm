# E-Commerce Backend

## Overview

This is a Node.js backend for an e-commerce platform using Express and PostgreSQL. It provides API endpoints for user management, product management, and order processing.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for PostgreSQL
- **JWT**: Authentication and authorization
- **BcryptJS**: Password hashing
- **Nodemailer**: Email service

## Project Structure

```
ecommerce-backend/
│── src/
│   │── config/           # Configuration files (DB, env, etc.)
│   │   ├── db.js         # PostgreSQL database connection
│   │   ├── dotenv.js     # Environment variables config
│   │── models/           # Database models (Sequelize/Prisma/Knex)
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │── routes/           # Express route definitions
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │── controllers/      # Request handlers (business logic)
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │── services/         # Reusable service functions (e.g., payment, auth)
│   │   ├── auth.service.js
│   │   ├── payment.service.js
│   │── middleware/       # Express middleware (auth, logging, etc.)
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │── utils/            # Utility functions/helpers
│   │   ├── logger.js
│   │   ├── responseHandler.js
│   │── app.js            # Express app setup
│   │── server.js         # Entry point (starts the server)
│── tests/                # Test cases (Jest, Mocha)
│── .env                  # Environment variables
│── package.json          # Dependencies and scripts
│── README.md             # Documentation
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ecommerce-backend.git
   cd ecommerce-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure environment variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db
   JWT_SECRET=your_secret
   ```
4. Run database migrations (if using Sequelize):
   ```sh
   npx sequelize db:migrate
   ```

## Running the Application

### Development Mode

```sh
npm run dev
```

### Production Mode

```sh
npm run build
npm start
```

## API Endpoints

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| POST   | /api/users/register | Register a new user |
| POST   | /api/users/login    | Authenticate user   |
| GET    | /api/products       | Get all products    |
| POST   | /api/orders         | Create a new order  |

## Testing

Run tests using Jest or Mocha:

```sh
npm test
```

## License

This project is licensed under the MIT License.

## Author

Your Name - ankurdev002
