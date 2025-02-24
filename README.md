# Full-Stack Coding Challenge

# Task Management Application

This is a Task Management application built with Node.js, Express, PostgreSQL, and EJS for server-side rendering. The application allows users to register, log in, and manage their tasks (create, read, update, and delete).

**Features:**

* User registration and login with Passport.js and bcrypt for password hashing.
* CRUD operations for tasks.
* Protected routes that require authentication.
* Simple and intuitive UI using EJS templates and Skeleton CSS.

**Technologies Used:**
* Backend: Node.js, Express, PostgreSQL
* Authentication: Passport.js, bcrypt
* Frontend: EJS (Embedded JavaScript templates)
* Styling: Skeleton CSS
* Database: PostgreSQL


node_login/
├── dbConfig.js          # Database configuration
├── passportConfig.js    # Passport.js configuration
├── server.js            # Main server file
├── views/
│   ├── dashboard.ejs    # Dashboard page (task management)
│   ├── edit.ejs         # Edit task page
│   ├── index.ejs        # Home page
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
├── .env                 # Environment variables
├── package.json         # Node.js dependencies
├── README.md            # Project documentation

**Setup Instructions**
Prerequisites
  1. Node.js (v14 or higher)
  2. PostgreSQL (v12 or higher)
  3. npm or yarn

**Step 1:** Clone the Repository

**Step 2:** Set Up the Database
  1. Create a PostgreSQL database named nodelogin (or any name you prefer).
  2. Run the following SQL commands to create the necessary tables:
CREATE TABLE users
    (id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    UNIQUE (email)
);

CREATE TABLE tasks
    ( id SERIAL PRIMARY KEY, 
    title VARCHAR(255) NOT NULL, 
    description TEXT, 
    is_complete BOOLEAN DEFAULT FALSE, 
    user_id INT REFERENCES users(id) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

**Step 3:** Configure Environment Variables
  1. Create a .env file in the root directory and add the following variables:
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=nodelogin
Replace your_db_username, your_db_password with your actual values.

**Step 4:** Install Dependencies
  Run the following command to install the required dependencies:
    **npm install**
    
**Step 5:** Run the Application
  Start the server using the following command:
    **npm run dev**
  The application will be running at http://localhost:4000

**Usage**

_Register a new user:_
  * Navigate to http://localhost:4000/users/register and fill in the form to create a new account.

_Log in:_
  * Use your credentials to log in at http://localhost:4000/users/login. Upon successful login, you will be redirected to the dashboard.

_Manage tasks:_
  * Create a task: Fill in the form on the dashboard to add a new task.
  * Edit a task: Click the "Edit" button to update a task's details or mark it as complete.
  * Delete a task: Click the "Delete" button to remove a task.

Notes
- The application uses bcrypt for password hashing and Passport.js for authentication.
- Tasks are linked to users via the user_id foreign key in the tasks table.
- The frontend is minimal and uses EJS for server-side rendering and Skeleton CSS for styling.

**Video Demo:**
https://drive.google.com/file/d/1ItlyAlhWgrVbyMn8WE-fZr7Aw051_-1q/view?usp=drive_link

**Salary Expectations:**
My salary expectation for this role is $20/hr to $25/hr.


