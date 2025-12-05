# expense-tracker-api

### Running locally

1. Install PostgreSQL (https://www.postgresql.org/download/)

2. Access PostgreSQL Command Line (psql -U postgres)

3. Create the Database (CREATE DATABASE expense_tracker;)

4. Run the following commands.
    ```bash
    npm i
    cp .env.example .env
    ```

5. If needed, adjust the env variables to link to your local database

6. Run the following commands.
    ```bash
    npx ts-node src/seed/seed.ts
    npm start
    ```

7. Check http://localhost:8080/api/categories

### Testing the APIs via Postman

1. Download and install Postman https://www.postman.com/downloads/

2. Import the postman collection found on `/postman/Expense Tracker.postman_collection.json` on Postman