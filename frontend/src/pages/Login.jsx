import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      setError("");

      if (res.data.role === "ADMIN") {
        navigate("/menu-admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("❌ Sai tài khoản hoặc mật khẩu!");
      console.error(err);
    }
  };

  return (
      <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f7e1c0, #e3b582)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={4}>
              <Card className="shadow-lg border-0 rounded-4">
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark">☕ CoffeeTime Login</h2>
                    <p className="text-muted small">
                      Đăng nhập để bắt đầu trải nghiệm
                    </p>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label>Tên đăng nhập</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Nhập tên đăng nhập..."
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                          type="password"
                          placeholder="Nhập mật khẩu..."
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-100 py-2 fw-semibold border-0 rounded-3"
                        style={{
                          background:
                              "linear-gradient(90deg, #6b4226, #a76f50, #d3a77b)",
                        }}
                    >
                      Đăng nhập
                    </Button>
                  </Form>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Chưa có tài khoản?{" "}
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Đăng ký ngay
                      </Link>
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
}
