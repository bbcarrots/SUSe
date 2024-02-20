import mysql from "mysql2/promise";

let mysqlconn: Promise<mysql.Connection> | null = null;

export function mysqlconnFn() {
  if (!mysqlconn) {
    mysqlconn = mysql.createConnection({
      host: "127.0.0.1",
      user: "student",
      password: "student",
      database: "SUSe",
    });
  }

  return mysqlconn;
}