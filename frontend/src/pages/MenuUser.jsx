import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Form,
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function MenuUser() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("/products", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setMenu(res.data);
            } catch (err) {
                console.error("Lỗi khi tải menu:", err);
                alert("Không thể tải danh sách menu. Vui lòng đăng nhập lại!");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [token]);

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    const filteredMenu = menu.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="warning" />
                <span className="ms-3 text-muted">Đang tải menu...</span>
            </div>
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(120deg, #f8ede3 0%, #fff9f4 40%, #f3e1c0 100%)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* 🧭 Navbar */}
            <Navbar
                expand="lg"
                sticky="top"
                className="shadow-sm"
                style={{
                    background: "linear-gradient(90deg, #6b4226, #8c5a3b, #b6885e)",
                }}
            >
                <Container>
                    <Navbar.Brand
                        as={Link}
                        to="/home"
                        className="fw-bold text-white fs-4"
                        style={{ letterSpacing: "0.5px" }}
                    >
                        Modern Chill Coffee
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar" />
                    <Navbar.Collapse id="navbar" className="justify-content-between">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/home" className="text-white">
                                Trang chủ
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/menu"
                                className="text-warning fw-semibold"
                            >
                                Menu
                            </Nav.Link>
                            <Nav.Link as={Link} to="/tables" className="text-white">
                                Đặt bàn
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

            {/* 🔍 Search bar */}
            <Container className="py-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="fw-bold text-brown mb-3">Thực đơn hôm nay</h2>
                    <p className="text-muted mb-4">
                        Hãy chọn món yêu thích và tận hưởng không gian thư giãn cùng chúng tôi
                    </p>
                    <Form className="d-flex justify-content-center">
                        <Form.Control
                            type="text"
                            placeholder="Tìm món bạn muốn..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-50 rounded-pill text-center shadow-sm"
                        />
                    </Form>
                </motion.div>
            </Container>

            {/* ☕ Menu grid */}
            <Container className="flex-grow-1 pb-5">
                {filteredMenu.length === 0 ? (
                    <p className="text-center text-secondary fs-5">
                        Không tìm thấy sản phẩm phù hợp.
                    </p>
                ) : (
                    <Row className="g-4">
                        {filteredMenu.map((item, index) => (
                            <Col key={item._id || index} md={4} lg={3}>
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <Card
                                        className="shadow-sm border-0 rounded-4 overflow-hidden h-100"
                                        style={{
                                            backgroundColor: "#fffdfa",
                                            transition: "box-shadow 0.3s",
                                        }}
                                    >
                                        <div className="overflow-hidden position-relative">
                                            <Card.Img
                                                variant="top"
                                                src={
                                                    item.image ||
                                                    "https://via.placeholder.com/400x300?text=No+Image"
                                                }
                                                alt={item.name}
                                                style={{
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    transition: "transform 0.5s ease",
                                                }}
                                                className="hover-zoom"
                                                onMouseOver={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1.08)")
                                                }
                                                onMouseOut={(e) =>
                                                    (e.currentTarget.style.transform = "scale(1)")
                                                }
                                            />
                                            <motion.div
                                                className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white fw-bold"
                                                style={{
                                                    backgroundColor: "rgba(0,0,0,0.4)",
                                                    opacity: 0,
                                                }}
                                                whileHover={{ opacity: 1 }}
                                            >
                                                {item.category || "Đồ uống"}
                                            </motion.div>
                                        </div>

                                        <Card.Body className="text-center">
                                            <Card.Title className="fw-bold text-dark mb-1">
                                                {item.name}
                                            </Card.Title>
                                            <Card.Text className="text-success fw-semibold mb-2">
                                                {formatMoney(item.price)}
                                            </Card.Text>
                                            <Button
                                                as={Link}
                                                to="/tables"
                                                variant="warning"
                                                className="text-white fw-semibold px-4 rounded-pill shadow-sm"
                                            >
                                                Đặt bàn ngay
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* 🌙 Footer */}
            <footer
                className="text-white text-center py-3 mt-auto"
                style={{
                    background: "linear-gradient(90deg, #5c3c25, #7b4b2a)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.3px",
                }}
            >
                © 2025 Modern Chill Coffee — Enjoy your moment with us
            </footer>
        </div>
    );
}