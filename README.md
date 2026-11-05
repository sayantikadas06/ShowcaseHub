# ShowcaseHub – Student Project Showcase

ShowcaseHub is a full-stack web application where students can submit their projects, and administrators can review, approve, or reject them. Visitors can explore approved projects through a public gallery.

## Features

- Student project submission with title, name, description, tags, GitHub link and Live Demo link.
- Admin login with JWT authentication.
- Admin dashboard to view all project submissions.
- Approve or reject pending projects.
- Public gallery displays only approved projects.
- Search projects by title.
- Filter projects by tags.
- Validation for GitHub and Live Demo URLs.

## Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Axios
- CSS
- JWT
- Bcrypt.js

## Project Structure

```text
ShowcaseHub/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seedAdmin.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── screenshots/
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ShowcaseHub
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the Backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Create the admin account:

```bash
node seedAdmin.js
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/submit` | Submit a new project |
| GET | `/api/projects/approved` | Get approved projects |
| GET | `/api/projects/all` | Get all projects (Admin) |
| PATCH | `/api/projects/:id/status` | Update project status (Admin) |
| POST | `/api/admin/login` | Admin login |

Admin routes require JWT authentication.

## Project Workflow

1. Students submit their projects.
2. Submitted projects are stored with Pending status.
3. Admin reviews the submissions.
4. Admin approves or rejects projects.
5. Only approved projects appear in the public gallery.

## Screenshots

Application screenshots are available in the `screenshots` folder.

## Live Demo

- Frontend: To be added
- Backend: To be added

## Author

**Sayantika Das**  
 
GitHub: [sayantikadas06](https://github.com/sayantikadas06)

Developed as part of the CodeNova Full Stack Development Internship.