# Note-App

A full-stack note-taking application built with Node.js and Express that allows users to create, edit, search, and manage their notes with tagging capabilities.

##  Description

Note-App is a web-based application that provides a complete note management system. Users can register, login, create notes with tags, perform full-text searches, and organize their thoughts efficiently. The application features a clean, responsive interface built with Bootstrap and EJS templating.

##  Features

- **User Authentication:** Secure signup and login system
- **Note Management:** Create, read, update, and delete notes
- **Tagging System:** Organize notes with custom tags
- **Full-Text Search:** Search through note titles and content
- **ID-based Search:** Direct note access using MongoDB ObjectId
- **Responsive Design:** Mobile-friendly interface with Bootstrap
- **Real-time Updates:** Automatic timestamps for creation and modification

##  Technologies Used

### Backend
- Node.js: JavaScript runtime environment
- Express.js ^4.21.2: Web application framework
- MongoDB: NoSQL database for data storage
- Mongoose ^8.9.5: MongoDB object modeling library

### Templating & Middleware
- EJS ^3.1.10: Embedded JavaScript templating engine
- Body-parser ^1.20.3: Middleware for parsing request bodies

### Frontend
- Bootstrap 3.3.7: CSS framework for responsive design (via CDN)
- Custom CSS: Additional styling in `public/css/style.css`
- HTML5: Markup language for web pages

### Database Features
- Text Indexing: Full-text search capabilities on titles and content
- Schema Validation: Data validation with Mongoose schemas
- Referential Integrity: User-note relationships with ObjectId references

## 📁 Project Structure

- **Note-App/**
  - **public/**
    - **css/**
      - `style.css` _# Custom stylesheets_
  - **views/**
    - **partials/**
      - `header.ejs` _# HTML head and navigation_
      - `footer.ejs` _# Footer content_
    - `signup.ejs` _# User registration page_
    - `login.ejs` _# User login page_
    - `home.ejs` _# Notes dashboard_
    - `create.ejs` _# Note creation form_
    - `post.ejs` _# Individual note view_
    - `edit.ejs` _# Note editing form_
    - `failure.ejs` _# Login failure page_
    - `searchFailure.ejs` _# Search failure page_
  - `app.js` _# Main application server_
  - `package.json` _# Project dependencies_
  - `package-lock.json` _# Locked dependency versions_
  - `.gitignore` _# Git ignore rules_

##  Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm (comes with Node.js)

### Steps

1. **Clone the repository**
    ```
    git clone https://github.com/Sainava/Note-App.git
    cd Note-App
    ```
2. **Install dependencies**
    ```
    npm install
    ```
3. **Start MongoDB**
    ```
    # For local MongoDB installation
    mongod
    ```
4. **Run the application**
    ```
    node app.js
    ```
5. **Access the application**
    - Open your browser and navigate to `http://localhost:3000`

## 💾 Database Schema

### User Schema
- name: String (required, trimmed)
- email: String (required, unique, validated)
- password: String (required)
- notes: Array of Note ObjectIds

### Note Schema
- title: String (required, 3-100 characters)
- content: String (required)
- user_id: ObjectId reference to User
- creationDate: Date (auto-generated, immutable)
- lastUpdate: Date (auto-updated)
- tags: Array of Strings
- collaborators: Array of User ObjectIds

## 🔍 API Routes

### Authentication
- `GET /` - Signup page
- `POST /signup` - User registration
- `GET /login` - Login page
- `POST /login` - User authentication
- `POST /failure` - Handle login failure

### Notes Management
- `GET /home` - Display all notes
- `POST /home` - Create new note
- `GET /create` - Note creation form
- `GET /:postName` - View specific note by title
- `GET /edit/:noteId` - Edit note form
- `POST /edit/:noteID` - Update note
- `POST /delete/:noteID` - Delete note

### Search
- `POST /search` - Search notes by text or ID

## 🔧 Configuration

The application connects to MongoDB at `mongodb://localhost:27017/noteDB` by default. To use a different database:

1. Modify the connection string in `app.js`:
    ```
    mongoose.connect("your-mongodb-connection-string");
    ```
2. Set the `PORT` environment variable for different port:
    ```
    export PORT=8080
    node app.js
    ```

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  Author

**Sainava Modak**  
GitHub: [@Sainava](https://github.com/Sainava)

---

⭐ Star this repository if you found it helpful!
