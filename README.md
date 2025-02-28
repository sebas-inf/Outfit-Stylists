# Simple small database creation and routing query
Simply run node src/database.js after setup described below, instead of index.
Visit /user/wardrobe to find returned json describing several pieces of clothing,
Visit /user/wardrobe/show to run an example of returning an html image element using the base64 string in the first wardrobe item.

# Simple test with modified sample code using MongoDB and Mongoose.js
- Install Mongodb Community Ed. on your computer, preferably with Compass for ease of viewing, but you can also use
    the Mongodb plugin in vscode
- Run mongod.exe with the --dbpath parameter set to the sample_database folder path
    - This runs a local database connection with the data right inside the project.
- install and run mongosh, and copy the connection string from there into index.js
- run "node index.js" in the commandline to change the database with the provided sample code
- You should see a new test database with kittens collection in it
- Two kittens should be made, fluffy and terrible the cutest
- Important kitten information should be printed in the console window.
- You can use Compass GUI to easily view the changes to the database after doing View-Reload Data
- Simply do Ctrl-c in the terminal in VS Code (on windows, or however you end terminal programs) to stop the program.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
