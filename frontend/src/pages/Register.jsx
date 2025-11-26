import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", form);
      setMessage("✅ Đăng ký thành công! Hãy đăng nhập.");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setMessage("❌ Lỗi: Tài khoản hoặc email đã tồn tại!");
    }
  };

  return (
      <div
          style={{
            minHeight: "100vh",
            background:
                "linear-gradient(120deg,#f8ede3 0%,#fff9f4 40%,#f3e1c0 100%)",
            display: "flex",
            alignItems: "center",
          }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
              >
                <Card className="shadow-lg rounded-4 border-0">
                  <Card.Body className="p-5">
                    <h2 className="text-center fw-bold mb-4 text-brown">
                      Tạo tài khoản mới
                    </h2>

                    {message && (
                        <Alert
                            variant={
                              message.startsWith("✅") ? "success" : "danger"
                            }
                            className="text-center"
                        >
                          {message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                      </Form.Group>

                      <Button
                          type="submit"
                          variant="warning"
                          className="w-100 fw-semibold text-white py-2 shadow-sm"
                      >
                        Đăng ký
                      </Button>
                    </Form>

                    <p className="text-center mt-4 text-muted small">
                      Đã có tài khoản?{" "}
                      <Button
                          variant="link"
                          className="p-0 text-decoration-none fw-semibold text-brown"
                          onClick={() => navigate("/")}
                      >
                        Đăng nhập ngay
                      </Button>
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
  );
}