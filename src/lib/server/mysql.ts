import mysql from "mysql2/promise";

let adminMySQLConn: Promise<mysql.Connection> | null = null;
let studentMySQLConn: Promise<mysql.Connection> | null = null;

export function connectAdminMySQL(): Promise<mysql.Connection> | null {
  if (!adminMySQLConn) {
    try {
      adminMySQLConn = mysql.createConnection({
        host: "127.0.0.1",
        user: "admin",
        password: "admin",
        database: "suse",
      });
    } 
    catch {
      return null
    }
  }

  return adminMySQLConn;
}

export function connectStudentMySQL(): Promise<mysql.Connection> | null {
  if (!studentMySQLConn) {
    try {
      studentMySQLConn = mysql.createConnection({
        host: "127.0.0.1",
        user: "student",
        password: "student",
        database: "suse",
      });
    } 
    catch {
      return null
    }
  }

  return studentMySQLConn;
}