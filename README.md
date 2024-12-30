---

# E-Learning Platform RESTful API  

This is a RESTful API built using Node.js and Express.js for managing an e-learning platform. The platform supports user registration, course management, and enrollment functionalities.  

## Features  
- User authentication (sign up, login, and role-based access control).  
- Course management (create, update, delete, and list courses).  
- Enrollment system (enroll in courses and track progress).  
- Admin dashboard for managing users and courses.  

## Installation  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/danielkeb/dkkls.git
   cd dkkls 
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Set up environment variables in a `.env` file:  
   ```plaintext  
   PORT=3000  
   DATABASE_URL=
   JWT_SECRET=your_secret_key  
   ```  
4. Start the server:  
   ```bash  
   npm start  
   ```  

## API Endpoints  
### Authentication  
- `POST /api/users/signup` - Register a new user.  
- `POST /api/users/login` - Authenticate a user.  

### Courses  
- `GET /api/courses` - List all courses.  
- `POST /api/courses` - Create a new course (Admin only).  
- `PUT /api/courses/:id` - Update course details (Admin only).  
- `DELETE /api/courses/:id` - Delete a course (Admin only).  

### Enrollment  
- `POST /enrollments` - Enroll in a course.  
- `GET /enrollments` - View enrolled courses.  

## Technologies  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT  

## License  
This project is licensed under the dkkls License.  

---  
