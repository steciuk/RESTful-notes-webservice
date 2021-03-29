# Simple RESTful note web service
### What is required for running the project?
 - [MongoDB](https://www.mongodb.com/try/download/community)
 - [Node.js](https://nodejs.org/en/download/)
 - Web browser (developed and tested for Google Chrome)
 - Npm dependencies listed in `package.json`
### Steps how to run scripts that will setup database for the project
- No scripts needed. `mongoose` will setup `notes` collection on the first connection to database.
### Steps how to build and run the project
- In project directory run `npm install` to install all necessary dependencies.
- In project directory run `npm run start` to start the server
### Example usages
- Server by default listens on port 3000 (You can change that by adding `PORT` variable in `.env` file in project directory.
- In your web browser go to [http://localhost:3000/](http://localhost:3000/)