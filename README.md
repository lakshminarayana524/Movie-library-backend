Here's a README file for your Movie Library Backend project:

---

# Movie Library Backend

This backend application serves as the server-side component for the Movie Library project. It provides APIs for user authentication, managing public and private playlists, and accessing user details.

## Features

- User authentication using JWT (JSON Web Tokens)
- CRUD operations for managing public and private playlists
- User model for storing user details
- Integration with MongoDB using Mongoose
- Middleware for handling CORS (Cross-Origin Resource Sharing)
- Middleware for parsing cookies and request bodies

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lakshminarayana524/Movie-library-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Movie-library-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```
   MONGO_URL=<your_mongodb_connection_string>
   SECRET_KEY=<your_secret_key_for_jwt>
   PORT=<port_number>
   ```

5. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

- `POST /signup`: Register a new user.
- `POST /login`: Authenticate user and generate JWT token.
- `POST /logout`: Clear authentication token.
- `GET /verify`: Verify user's authentication token.
- `GET /user-details/:id`: Get user details by ID.
- `POST /publiclib`: Create a new public playlist.
- `POST /privatelib`: Create a new private playlist.
- `GET /publiclibget`: Get all public playlists.
- `GET /privatelibget/:userId`: Get private playlists by user ID.
- `GET /privatelibgets`: Get all private playlists.
- `POST /add-playlist`: Add a movie to a public playlist.
- `POST /add-private`: Add a movie to a private playlist.
- `GET /publiclistgetall/:playlistname`: Get all movies in a public playlist.
- `GET /privategetall/:playlistname`: Get all movies in a private playlist.
- `GET /findtoken`: Check if authentication token is present.

## Dependencies

- [bcrypt](https://www.npmjs.com/package/bcrypt): Library for hashing passwords.
- [body-parser](https://www.npmjs.com/package/body-parser): Middleware for parsing request bodies.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Middleware for parsing cookies.
- [cors](https://www.npmjs.com/package/cors): Middleware for enabling CORS.
- [dotenv](https://www.npmjs.com/package/dotenv): Load environment variables from a `.env` file.
- [express](https://www.npmjs.com/package/express): Web application framework for Node.js.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Library for generating and verifying JSON Web Tokens.
- [mongoose](https://www.npmjs.com/package/mongoose): MongoDB object modeling tool.
- [nodemon](https://www.npmjs.com/package/nodemon): Utility for automatically restarting the server.

## Authors

- [G Lakshmi Narayana]((https://github.com/lakshminarayana524))

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README to include additional information or instructions specific to your project. If you have any questions or need further assistance, don't hesitate to reach out!
