// db.js
const sql = require("mssql");

const config = {
    user: "taladhub-adm",
    password: "taladhub-adm@db#2024",
    server: "172.16.0.161\\SQL2019_DEV", 
    database: "TaladHub_DEV",
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Connected to the database successfully.");
  } catch (err) {
    console.error("Database connection failed: ", err);
  }
}

module.exports = {
  sql,
  connectToDatabase,
};

// Call the function to test the connection
// connectToDatabase();
