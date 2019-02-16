import * as mysql from "mysql2";

require('dotenv').config(); // loads environment variables from .env file (if available - eg dev env)

class Database {

  async connect() {
    // create the connection to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      charset: 'utf8mb4',
    });
    return connection
  }

  async get() {
    const connection = await this.connect();

    // // query database
    // const [rows, fields] = await connection.execute(
    //   'SELECT * FROM test_table');

    // query database
    const [rows, fields] = await connection.query(
      'SELECT * FROM test_table');

    console.log(rows);

    // // simple query
    // connection.query(
    //   'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
    //   function(err, results, fields) {
    //     console.log(results); // results contains rows returned by server
    //     console.log(fields); // fields contains extra meta data about results, if available
    //   }
    // );
  }

}
export const db = new Database();
