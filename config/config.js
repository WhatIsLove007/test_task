module.exports = {
  "development": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "test_task_db",
    "host": "127.0.0.1",
    "port": "3307",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "test_task_db",
    "host": "127.0.0.1",
    "port": "3307",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.MYSQL_PASSWORD,
    "database": "test_task_db",
    "host": "127.0.0.1",
    "port": "3307",
    "dialect": "mysql"
  }
}
