console.log("Requiring app...");
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Boot the daily CRON task
require('./src/schedulers/conflictCron')();


// This code initializes the server by importing the app from the src/app module
