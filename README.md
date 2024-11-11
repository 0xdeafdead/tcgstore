# User Management Engine

This project is an ongoing user management engine built with TypeScript using Nx in a monorepository setup. It enables user administration and session authentication with JWT.

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=0xdeafdead_tcgstore_api&metric=coverage)](https://sonarcloud.io/summary/new_code?id=0xdeafdead_tcgstore_api)

## Features
- Basic user API (`base-api`) for CRUD operations.
- JWT-based authentication.
- CI/CD setup with Nx.

## Prerequisites
- **Node.js**: Ensure you have the latest version installed.
- **Docker** (optional): For container deployment.

## Installation and Setup

### 1. Clone the repository
Clone the GitHub repository and navigate to the project directory:
   ```bash
   git clone https://github.com/0xdeafdead/user-management-engine.git
   cd user-management-engine
   ```
### 2. Install dependencies
Install all required dependencies by running:
  ```bash
  npm install
  ```
### 3. Set up environment variables
Create a .env file in the project root and configure the necessary variables for database connection, authentication, etc. Example:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  JWT_SECRET=yourJWTSecret
  ```
## Running the Project
### Development Mode
To run the project in development mode, use:
  ```bash
  npx nx serve base-api
  ```
### Production Build
To build the project for production, run:
  ```bash
  npx nx build base-api
  ```

## Docker Deployment
To use Docker, follow these steps:

Build the Docker image:
  ```bash
  docker build -t user-management-engine .
  ```
Run the container:
  ```bash
  docker run -p 3000:3000 user-management-engine
  ```
### Testing
To run tests, use:

  ```bash
  npx nx test base-api
  ```

## Contributing
If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature (git checkout -b [feat/fix]/new-feature).
3. Make your changes and commit them (git commit -m "[feat/fix/chore]: Add new feature").
4. Push your branch to the remote repository (git push origin [feat/fix]/new-feature).
5. Open a pull request for review.

## License
This project is licensed under the MIT License.
