# Full-Stack Employee Management Application

## Overview

This project is a full-stack application consisting of a NestJS-based API for managing employee data and a React frontend for interacting with the API. The backend is integrated with MongoDB and Redis and includes features such as creating, reading, updating, and deleting employee records, as well as sending welcome emails using email templates.

## Features

- **Employee Management**: Create, read, update, and delete employee records.
- **Email Notifications**: Send welcome emails to new employees using Handlebars templates.
- **Queue Management**: Use Redis for managing email notifications asynchronously.
- **GraphQL API**: Interact with the API using GraphQL.
- **React Frontend**: A user-friendly interface to manage employees.

## Project Structure

```
project-b/
├── Dockerfile
├── docker-compose.yml
├── env-example
├── k8s/
│   ├── mongo-deployment.yaml
│   ├── mongo-pvc.yaml
│   ├── nest-app-deployment.yaml
│   ├── redis-deployment.yaml
│   └── redis-pvc.yaml
├── scripts/
│   ├── deploy-dev.sh
│   └── deploy-prod.sh
├── src/
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   ├── development.ts
│   │   └── production.ts
│   ├── email/
│   │   ├── email.module.ts
│   │   ├── email.service.spec.ts
│   │   ├── email.service.ts
│   │   └── templates/
│   │       ├── welcome-email.hbs
│   │       └── welcome-email.ts
│   ├── employee/
│   │   ├── dto/
│   │   │   ├── create-employee.input.ts
│   │   │   └── update-employee.input.ts
│   │   ├── employee.module.ts
│   │   ├── employee.resolver.spec.ts
│   │   ├── employee.resolver.ts
│   │   ├── employee.service.spec.ts
│   │   ├── employee.service.ts
│   │   └── entities/
│   │       └── employee.entity.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── main.ts
│   ├── queue/
│   │   ├── email.processor.ts
│   │   └── queue.module.ts
│   ├── schema.gql
│   └── validators/
│       └── is-email.ts
├── tsconfig.build.json
└── tsconfig.json

frontend/
├── Dockerfile
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── App.test.js
│   ├── apolloClient.js
│   ├── components/
│   │   ├── EmployeeForm.css
│   │   ├── EmployeeForm.jsx
│   │   ├── EmployeeList.css
│   │   └── EmployeeList.jsx
│   ├── graphql/
│   │   ├── mutations.js
│   │   └── queries.js
│   ├── hooks/
│   │   └── useEmployees.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   └── utils/
│       └── removeTypename.js
├── package-lock.json
└── package.json
```

## Prerequisites

- Node.js v16.x
- Docker
- Kubernetes (for production deployment)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/aminabedi1368/project_b.git
   cd project_b
   ```

2. **Install dependencies**:

   ```bash
   cd project_b
   npm install
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in both the `backend` and `frontend` directories with the following content:

   **backend/.env**

   ```env
   NODE_ENV=development
   MONGODB_URI=mongodb://root:example@mongo:27017/nest?authSource=admin
   REDIS_HOST=redis
   REDIS_PORT=6379
   EMAIL_COMPANY=aminabedi1368@gmail.com
   EMAIL_USER=
   EMAIL_PASS=
   ```

   **frontend/.env**

   ```env
   REACT_APP_GRAPHQL_URI=http://localhost:3000/graphql
   ```

## Running the Application

### Development

To start the application in a development environment using Docker Compose:

```bash
./scripts/deploy-dev.sh
```

This script will:

- Build the Docker images.
- Start the MongoDB, Redis, NestJS application, and React frontend containers.

### Production

To deploy the application in a production environment using Kubernetes:

1. **Build Docker images**:

   ```bash
   docker build -t nest-app:latest ./backend
   docker build -t react-app:latest ./frontend
   ```

2. **Apply Kubernetes configurations**:

   ```bash
   ./scripts/deploy-prod.sh
   ```

This script will:

- Apply the necessary Kubernetes configurations for MongoDB, Redis, NestJS application, and React frontend.

### Running Tests
To run the tests, use the following command:

```npm run test```

Automated Testing in Docker
The Dockerfile is configured to run tests automatically. If the tests pass, the container will start; otherwise, it will exit with an error.

## API Documentation

The API uses GraphQL. You can access the GraphQL Playground at `http://localhost:3000/graphql` for an interactive API documentation and to run queries and mutations.

### Sample Queries and Mutations

#### Create Employee

```graphql
mutation {
  createEmployee(createEmployeeInput: {
    name: "John Doe",
    jobTitle: "Developer",
    department: "IT",
    email: "john.doe@example.com"
  }) {
    id
    name
    jobTitle
    department
    email
  }
}
```

#### Get All Employees

```graphql
query {
  employees {
    id
    name
    jobTitle
    department
    email
  }
}
```

#### Get Employee by ID

```graphql
query {
  employee(id: "employee-id") {
    id
    name
    jobTitle
    department
    email
  }
}
```

#### Update Employee

```graphql
mutation {
  updateEmployee(updateEmployeeInput: {
    id: "employee-id",
    jobTitle: "Senior Developer",
    department: "Engineering"
  }) {
    id
    name
    jobTitle
    department
    email
  }
}
```

#### Delete Employee

```graphql
mutation {
  removeEmployee(id: "employee-id") {
    id
    name
    jobTitle
    department
    email
  }
}
```

## Frontend Usage

### Components

- **EmployeeForm**: A form to create or update an employee.
- **EmployeeList**: A list of all employees with options to edit or delete.

### Running the Frontend

To start the frontend in development mode:

```bash
npm start
```

The React application will be available at `http://localhost:3001`.

### Example Usage

- **Create Employee**: Fill out the form and click "Create Employee".
- **View Employees**: The list of employees will be displayed below the form.
- **Edit Employee**: Click the "Edit" button next to an employee's name to update their information.
- **Delete Employee**: Click the "Delete" button next to an employee's name to remove them from the list.

## Email Templates

Email templates are stored in the `backend/src/email/templates` directory. The current template for welcome emails uses Handlebars and can be found in `backend/src/email/templates/welcome-email.ts`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

### Dockerfile for Backend

```Dockerfile
# Use the official image as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Run tests
RUN npm run test

# Start the application
CMD ["node", "dist/main"]
```

### Dockerfile for Frontend

```Dockerfile
# Use the official Node.js image as a base image
FROM node:16-alpine

# Set the working directory


WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongo:
    image: mongo
    container_name: mongo
    restart: always
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo_data:/data/db

  app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nest-app
    restart: always
    environment:
      - NODE_ENV=development
    depends_on:
      - mongo
      - redis

  redis:
    image: redis
    container_name: redis
    restart: always
    volumes:
      - redis_data:/data

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: react-app
    restart: always
    ports:
      - '8080:80'
    environment:
      - NODE_ENV=development
    depends_on:
      - app

volumes:
  mongo_data:
    driver: local
  redis_data:
    driver: local
```
