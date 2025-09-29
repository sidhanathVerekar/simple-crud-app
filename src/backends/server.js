const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // replace with your MySQL user
  password: "sid55boss@A",     // replace with your MySQL password
  database: "crud_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// CREATE table (run once manually if not exists)
app.get("/createTable", (req, res) => {
  let sql = `CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send("Users table created!");
  });
});

// ➕ CREATE
app.post("/Users", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, email });
  });
});

// 📖 READ
app.get("/Users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ✏️ UPDATE
app.put("/Users/:id", (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  const sql = "UPDATE users SET name=?, email=? WHERE id=?";
  db.query(sql, [name, email, id], (err) => {
    if (err) throw err;
    res.json({ message: "User updated!" });
  });
});

// ❌ DELETE
app.delete("/Users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) throw err;
    res.json({ message: "User deleted!" });
  });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
