# Energy Monitor Backend

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

---

## Table of Contents

1. [Project Description](#project-description)
2. [Requirements](#requirements)
3. [Installation and Setup](#installation-and-setup)
4. [Project Structure](#project-structure)
5. [REST API Endpoints](#rest-api-endpoints)
6. [Sample Data](#sample-data)
7. [Testing](#testing)
8. [Authors](#authors)

---

## Project Description

The backend of the Energy Monitor App is built using Java and Spring Boot. It provides RESTful APIs to manage and monitor energy usage data. The backend connects to a MySQL database to store and retrieve data efficiently.

---

## Requirements

- Java 17 or higher
- Maven 3.8+
- MySQL 8.0+

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lukaszaw/energy-monitor-app.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd energy-monitor-app/backend
   ```

3. Configure the database:
   - Update the `application.properties` file in `src/main/resources` with your MySQL credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/energy_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

4. Build the project:
   ```bash
   ./mvnw clean install
   ```

5. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

---

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/energy/
│   │   │       ├── model/          # Contains entity classes representing the database tables
│   │   │       ├── repository/     # Interfaces for data access using Spring Data JPA
│   │   │       ├── service/        # Business logic and service layer implementations
│   │   │       ├── controller/     # REST controllers to handle HTTP requests
│   │   │       └── config/         # Configuration classes for security, CORS, and other settings
│   │   └── resources/
│   │       └── application.properties  # Configuration file for Spring Boot
│   └── test/
│       └── java/
│           └── com/energy/  # Contains test cases for the backend application
├── pom.xml         # Maven configuration file
├── energy_db.sql   # SQL script to set up the database schema
└── README.md       # Documentation for the backend
```

### Model
The `model` package contains entity classes that map to the database tables. These classes use JPA annotations to define relationships, constraints, and table structures.

### Repository
The `repository` package includes interfaces that extend Spring Data JPA repositories. These interfaces provide methods for CRUD operations and custom queries.

### Service
The `service` package contains the business logic of the application. Services interact with repositories to fetch and manipulate data and are called by controllers.

### Controller
The `controller` package includes REST controllers that handle HTTP requests. Each controller maps to specific endpoints and interacts with the service layer to process requests and return responses.

### Config
The `config` package contains configuration classes for the application. This includes security configurations, CORS settings, and other application-level settings.

---

## REST API Endpoints

### Devices
- **GET** `/api/devices` - Retrieve all devices (Admin only).
- **GET** `/api/devices/user/{userId}` - Retrieve devices for a specific user (User or Admin).
- **POST** `/api/devices` - Add a new device for the logged-in user (User or Admin).
- **PUT** `/api/devices/{deviceId}` - Update an existing device for the logged-in user (User or Admin).
- **DELETE** `/api/devices/{deviceId}` - Delete a device for the logged-in user (User or Admin).
- **GET** `/api/devices/user/me` - Retrieve devices for the currently logged-in user (User or Admin).
- **GET** `/api/devices/summary` - Retrieve a summary of all connected devices.
- **GET** `/api/devices/creation-stats` - Retrieve device creation statistics for the last 14 days (Admin only).

### Energy Usage
- **GET** `/api/energy-usage/{deviceId}` - Retrieve energy usage data for a specific device (User or Admin).
- **GET** `/api/energy-usage/{deviceId}/range` - Retrieve energy usage data for a specific device within a date range (User or Admin).
- **DELETE** `/api/energy-usage/{energyUsageId}` - Delete a specific energy usage record (User or Admin).
- **POST** `/api/energy-usage/generate-missing` - Generate missing energy usage entries for all devices (Admin only).
- **GET** `/api/energy-usage/user/me/history` - Retrieve energy usage history for the logged-in user (User or Admin).
- **GET** `/api/energy-usage/user/me/device-share` - Retrieve energy usage share by device for the logged-in user (User or Admin).
- **GET** `/api/energy-usage/user/me/type-summary` - Retrieve energy usage summary by device type for the logged-in user (User or Admin).
- **GET** `/api/energy-usage/user/me/type/{type}/devices` - Retrieve energy usage by device type for the logged-in user (User or Admin).
- **GET** `/api/energy-usage/summary` - Retrieve the total energy usage tracked.

### Users
- **GET** `/api/users` - Retrieve all users (Admin only).
- **GET** `/api/users/{id}` - Retrieve a user profile by ID (Admin only).
- **GET** `/api/users/email/{email}` - Retrieve a user profile by email (Admin only).
- **GET** `/api/users/role/{role}` - Retrieve users by role (Admin only).
- **PUT** `/api/users/set-energy-cost` - Set the energy cost per kWh for the logged-in user (User or Admin).
- **GET** `/api/users/me` - Retrieve the profile of the currently logged-in user (User or Admin).
- **PUT** `/api/users/me` - Update the profile of the currently logged-in user (User or Admin).
- **GET** `/api/users/summary` - Retrieve a summary of user statistics.
- **DELETE** `/api/users/{id}` - Delete a user by ID (Admin only).
- **GET** `/api/users/signup-stats` - Retrieve user signup statistics for the last 14 days (Admin only).

---

## Sample Data

To populate the database with sample data, use the `energy_db.sql` file located in the `backend/` directory. Import it into your MySQL database:

```bash
mysql -u your_username -p energy_db < energy_db.sql
```

---

## Testing

Run the test cases using Maven:

```bash
./mvnw test
```

---

## Testing Endpoints with Postman

Postman is a powerful tool for testing and interacting with RESTful APIs. I used it to test the endpoints of this backend application.

### Test with Postman

1. **Base URL**:
   - Use the base URL of your running backend application, e.g., `http://localhost:8080/api`.

2. **Authentication**:
   - For endpoints requiring authentication, include the necessary headers (e.g., `Authorization: Bearer <token>`).


---

## Authors

- **Lukas** - [GitHub Profile](https://github.com/LukasZaw)

---

Feel free to contribute to this project by submitting issues or pull requests!
