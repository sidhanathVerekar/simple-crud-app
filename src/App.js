import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Row, Col, Card } from "react-bootstrap";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const API = "http://localhost:5000/users";

  // Load users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: "", email: "" });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="mb-4 text-center">🚀 React + Node + MySQL CRUD</h2>
        
        {/* Form */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Col>
            <Col md={4}>
              <Button type="submit" variant={editingId ? "warning" : "primary"} className="w-100">
                {editingId ? "Update User" : "Add User"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Table */}
      <Card className="p-4 shadow mt-4">
        <h4 className="mb-3">📋 Users List</h4>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ width: "180px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => handleEdit(u)} className="me-2">
                      ✏️ Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default App;