import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function TableList() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get("/tables", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTables(res.data);
            } catch {
                alert("Không thể tải danh sách bàn!");
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, [token]);

    const handleSelect = (tableId) => navigate(`/order/${tableId}`);

    const getStatusColor = (status) => {
        switch (status) {
            case "available":
                return "#4caf50"; // xanh lá
            case "occupied":
                return "#ffb300"; // vàng
            case "paid":
                return "#2196f3"; // xanh dương
            default:
                return "#9e9e9e"; // xám
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="warning" />
                <span className="ms-3 text-muted">Đang tải danh sách bàn...</span>
            </div>
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(120deg,#f8ede3 0%,#fff9f4 40%,#f3e1c0 100%)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Navbar */}
            <Navbar
                expand="lg"
                sticky="top"
                className="shadow-sm"
                style={{
                    background: "linear-gradient(90deg,#6b4226,#8c5a3b,#b6885e)",
                }}
            >
                <Container>
                    <Navbar.Brand
                        onClick={() => navigate("/home")}
                        className="fw-bold text-white fs-4"
                    >
                        Modern Chill Coffee
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-between">
                        <Nav>
                            <Nav.Link onClick={() => navigate("/home")} className="text-white">
                                Trang chủ
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate("/menu")} className="text-white">
                                Menu
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => navigate("/tables")}
                                className="text-warning fw-semibold"
                            >
                                Bàn
                            </Nav.Link>
                        </Nav>
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = "/";
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Nội dung chính */}
            <Container className="flex-grow-1 py-5">
                <motion.h2
                    className="fw-bold text-center mb-5 text-brown"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Danh sách bàn
                </motion.h2>

                {tables.length === 0 ? (
                    <p className="text-center text-muted fs-5">
                        Hiện chưa có bàn nào trong hệ thống.
                    </p>
                ) : (
                    <Row className="g-4">
                        {tables.map((t, index) => (
                            <Col key={t.id || t._id} md={4} lg={3}>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <Card
                                        className="shadow-sm border-0 rounded-4 h-100 text-center"
                                        style={{
                                            backgroundColor: "#fffdfa",
                                            borderTop: `6px solid ${getStatusColor(t.status)}`,
                                        }}
                                    >
                                        <Card.Body>
                                            <Card.Title className="fw-bold fs-4 text-dark mb-2">
                                                Bàn {t.tableNumber}
                                            </Card.Title>
                                            <Card.Text className="text-muted mb-2">
                                                Sức chứa: {t.capacity} người
                                            </Card.Text>
                                            <Card.Text className="text-muted mb-3">
                                                Vị trí: {t.location || "Không xác định"}
                                            </Card.Text>

                                            <div
                                                className="fw-bold mb-3"
                                                style={{
                                                    color: getStatusColor(t.status),
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {t.status === "available"
                                                    ? "Trống"
                                                    : t.status === "occupied"
                                                        ? "Đang phục vụ"
                                                        : t.status === "paid"
                                                            ? "Đã thanh toán"
                                                            : "Không rõ"}
                                            </div>

                                            <Button
                                                disabled={t.status !== "available"}
                                                variant={
                                                    t.status === "available" ? "success" : "secondary"
                                                }
                                                className="w-100 rounded-pill fw-semibold py-2"
                                                onClick={() => handleSelect(t.id || t._id)}
                                            >
                                                {t.status === "available"
                                                    ? "Chọn bàn"
                                                    : "Không khả dụng"}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Footer */}
            <footer
                className="text-white text-center py-3 mt-auto"
                style={{
                    background: "linear-gradient(90deg,#5c3c25,#7b4b2a)",
                    fontSize: "0.9rem",
                }}
            >
                © 2025 Modern Chill Coffee — Relax, Sip & Enjoy
            </footer>
        </div>
    );
}