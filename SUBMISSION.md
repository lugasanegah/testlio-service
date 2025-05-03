Testlio API Submission
Project Overview
The Testlio API is a backend application built with NestJS, TypeORM, and PostgreSQL, following Domain-Driven Design (DDD) principles. It provides functionality for managing issues and their revisions, with support for authentication, pagination, and revision comparison. The API is containerized using Docker Compose and includes comprehensive unit tests and Swagger documentation for ease of use and maintenance.
The project demonstrates a robust implementation of a RESTful API with a focus on clean architecture, scalability, and testability. Key features include JWT-based authentication, issue creation and updates with revision tracking, and a revision comparison endpoint to highlight changes.
Architecture
The project adopts a DDD approach, organizing code around bounded contexts (auth and issue). The structure emphasizes separation of concerns, with distinct layers for domain logic, application services, and infrastructure.
Project Structure
testlio-issue/
├── src/
│   ├── config/                  # Configuration files (Swagger, TypeORM)
│   ├── domain/
│   │   ├── auth/               # Authentication bounded context
│   │   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   ├── services/
│   │   ├── issue/              # Issue management bounded context
│   │   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   ├── entities/
│   │   │   ├── services/
│   ├── database/               # Database migrations
│   └── test/                   # E2E and integration tests
├── docs/
│   └── openapi.yaml            # Static OpenAPI specification
├── docker-compose.yml          # Docker Compose configuration
├── package.json                # Dependencies and scripts
└── SUBMISSION.md               # This file


Domain Layer: Contains entities (Issue, Revision), DTOs (CreateIssueDto, LoginDto), services (IssueService, AuthService), and controllers (IssueController, AuthController).
Infrastructure Layer: Includes TypeORM configuration (data-source.ts) and database migrations.
Tests: Unit tests are colocated in tests folders.

Key Features
The API implements the following endpoints, as defined in the Swagger documentation (docs/openapi.yaml):
Authentication

POST /auth/login: Generates a JWT token for a given email.
Input: { "email": "user@example.com" }
Output: { "access_token": "eyJ..." }



Issue Management

POST /issues: Creates a new issue with a revision.
Requires JWT and X-Client-ID header.
Input: { "title": "Test Issue", "description": "Test" }


GET /issues?page={page}&limit={limit}: Retrieves paginated issues.
Returns: { data: [issues], total, page, limit }


PATCH /issues/{id}: Updates an issue and creates a revision if changed.
Input: { "title": "Updated Issue", "description": "Updated" }


GET /issues/{id}/revisions: Lists revisions for an issue.
GET /issues/{id}/compare?revisionA={a}&revisionB={b}: Compares two revisions, highlighting differences.

Setup Instructions
To run the project locally:

Clone the Repository:
git clone <repository-url>
cd testlio-issue


Set Up Environment:

Create a .env file based on .env.example:DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=testlio
JWT_SECRET=your-secret-key


Start Docker Compose:
docker-compose up -d


Run Migrations:
docker-compose exec app npm run migration:run


Access the API:

API: http://localhost:8080
Swagger UI: http://localhost:8080/api-docs


Run Tests:
docker-compose exec app npm run test
docker-compose exec app npm run test:cov


Challenges and Solutions
Below is a summary of the key challenges encountered during development and how they were addressed:
1. Swagger UI Displaying Empty Data

Issue: Swagger UI (http://localhost:8080/api-docs) showed no endpoints, and openapi.yaml was not parsed correctly.
Resolution:
Added @nestjs/swagger decorators to AuthController and IssueController to document endpoints explicitly.
Updated swagger.ts with proper security schemes (JWT, X-Client-ID) and debug logging.
Fixed syntax errors in openapi.yaml and aligned it with the dynamic Swagger spec.
Ensured main.ts initialized Swagger correctly.


Trade-off: Decorators increase code verbosity but ensure accurate documentation. Dynamic spec generation simplifies maintenance but requires manual openapi.yaml updates.
Recommendation: Automate openapi.yaml validation in CI/CD and use a static file for external sharing.

2. TypeScript Error in AuthController (TS2693)

Issue: TS2693: 'LoginDto' only refers to a type, but is being used as a value here in auth.controller.ts due to using an interface for LoginDto.
Resolution:
Replaced LoginDto interface with a class in login.dto.ts using class-validator for email validation.
Updated auth.controller.ts to import the class and apply ValidationPipe for request validation.


Trade-off: Using a class adds slight complexity but enables Swagger schema generation and runtime validation.
Recommendation: Use classes for all DTOs to maintain consistency and robustness.

3. Unit Test Placement in DDD

Issue: Uncertainty about where to place unit tests in a DDD structure, initially stored in test/.
Resolution:
Restructured unit tests to reside in tests folder.

Trade-off: The new structure requires Jest configuration changes but improves modularity and aligns with DDD principles.
Recommendation: Keep test/ for E2E or integration tests.

4. TypeScript Errors in IssueService Unit Test (TS2322)

Issue: TS2322 errors in issue.service.spec.ts due to missing revisions property in mockIssue for the Issue entity.
Resolution:
Added revisions: [] to mockIssue and linked it to mockRevision to match the Issue entity’s @OneToMany relation.
Ensured mockRevision.issueEntity referenced the updated mockIssue with revisions.


Trade-off: Explicitly mocking relations adds complexity but ensures type safety and consistency.
Recommendation: Consider using test factories or libraries like typeorm-fixtures for complex mock data.

5. Initial Project Setup

Issue: Setting up a new NestJS project with DDD, TypeORM, and Docker Compose.
Resolution:
Created project structure with DDD-based domains (auth, issue) and configured TypeORM with PostgreSQL.
Implemented AuthModule and IssueModule with services, controllers, and entities.
Added unit tests for services and controllers.


Trade-off: DDD adds initial setup complexity but improves maintainability and scalability.
Recommendation: Document domain boundaries clearly to guide future developers.

Trade-offs

DDD Complexity vs. Scalability: Adopting DDD increases initial setup effort but ensures clear domain boundaries, making the codebase easier to scale and maintain.
Dynamic Swagger vs. Static YAML: Using @nestjs/swagger for dynamic spec generation simplifies development but requires manual synchronization with openapi.yaml. A static YAML file is better for external sharing but needs validation.
Class-based DTOs vs. Interfaces: Using classes for DTOs (LoginDto, CreateIssueDto) enables validation and Swagger integration but adds boilerplate compared to interfaces.
Colocated Tests vs. Centralized Tests: Placing unit tests in __tests__ subdirectories aligns with DDD but requires Jest configuration changes. Centralized test/ is simpler for small projects but less modular.

Recommendations

CI/CD Integration:

Add a CI/CD pipeline to automate linting, testing, and openapi.yaml validation.
Use tools like GitHub Actions to run npm run test and npm run build on each commit.


Enhanced Testing:

Implement E2E tests in test/ to cover full API workflows (e.g., login → create issue → compare revisions).
Use typeorm-fixtures or similar libraries to simplify mock data creation for tests.


Monitoring and Logging:

Integrate a logging library (e.g., winston) to capture detailed application logs.
Add monitoring with tools like Prometheus and Grafana for production deployments.


Security Enhancements:

Implement rate limiting and input sanitization to prevent abuse.
Rotate JWT_SECRET regularly and store it securely (e.g., AWS Secrets Manager).


Documentation:

Maintain openapi.yaml as the single source of truth for external consumers.
Add API usage examples in SUBMISSION.md or a separate API_GUIDE.md.


Assumptions

The project is intended for local development and testing, with PostgreSQL running in Docker.
The X-Client-ID header is a placeholder for client identification, with no specific validation logic.
The JWT secret is stored in .env for simplicity; production would use a secrets management solution.
Unit tests focus on core functionality (IssueService, AuthService); additional edge cases can be added as needed.

Conclusion
The Testlio API successfully implements a DDD-based backend with robust authentication, issue management, and revision tracking. All challenges, including Swagger setup, TypeScript errors, and test organization, were resolved systematically, resulting in a maintainable and well-documented codebase. The project is ready for local testing and can be extended with additional features or deployed to production with the recommended enhancements.
For any questions or further clarification, please contact the developer. Thank you for reviewing this submission!
