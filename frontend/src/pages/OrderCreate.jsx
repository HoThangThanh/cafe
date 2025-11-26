import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Table,
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function OrderCreate() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("/products", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setMenu(res.data);
            } catch (err) {
                alert("Không thể tải menu!");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [token]);

    const addToCart = (product, qty) => {
        const key = `${product._id}-${product.name}`;
        if (qty < 0) qty = 0;

        setCart((prev) => {
            const exist = prev.find((i) => i.key === key);
            if (exist) {
                return prev.map((i) =>
                    i.key === key ? { ...i, quantity: qty } : i
                );
            } else {
                return [
                    ...prev,
                    {
                        key,
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: qty,
                    },
                ];
            }
        });
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleSubmit = async () => {
        const validItems = cart.filter((i) => i.quantity > 0);
        if (validItems.length === 0) return alert("Vui lòng chọn ít nhất 1 món!");

        if (
            !window.confirm(
                `Xác nhận đặt ${validItems.length} món, tổng ${total.toLocaleString()} ₫ ?`
            )
        )
            return;

        const payload = { tableId, items: validItems };
        try {
            await axios.post("/orders", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Đặt món thành công!");
            navigate("/tables");
        } catch {
            alert("Không thể gửi đơn hàng!");
        }
    };

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
                    "linear-gradient(120deg, #f8ede3 0%, #fffaf4 40%, #f3e1c0 100%)",
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

            {/* 🍽 Main Content */}
            <Container fluid className="py-4">
                <Row>
                    {/* Cột trái: Menu */}
                    <Col md={8} className="px-4">
                        <h3 className="text-center fw-bold text-brown mb-4">
                            Đặt món cho bàn #{tableId}
                        </h3>

                        <Row className="g-4">
                            {menu.map((item, index) => {
                                const key = `${item._id}-${item.name}`;
                                const cartItem =
                                    cart.find((c) => c.key === key) || { quantity: 0 };

                                return (
                                    <Col key={key} md={4} lg={3}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100">
                                                <div className="overflow-hidden position-relative">
                                                    <Card.Img
                                                        variant="top"
                                                        src={
                                                            item.image ||
                                                            "https://via.placeholder.com/300x200?text=No+Image"
                                                        }
                                                        alt={item.name}
                                                        style={{
                                                            height: "180px",
                                                            objectFit: "cover",
                                                            transition: "transform 0.5s ease",
                                                        }}
                                                        onMouseOver={(e) =>
                                                            (e.currentTarget.style.transform = "scale(1.08)")
                                                        }
                                                        onMouseOut={(e) =>
                                                            (e.currentTarget.style.transform = "scale(1)")
                                                        }
                                                    />
                                                </div>
                                                <Card.Body className="text-center">
                                                    <Card.Title className="fw-bold text-dark mb-2">
                                                        {item.name}
                                                    </Card.Title>
                                                    <Card.Text className="text-success fw-semibold mb-1">
                                                        {item.price.toLocaleString()} ₫
                                                    </Card.Text>
                                                    <Card.Text className="text-muted small mb-3">
                                                        {item.category || "Đồ uống"}
                                                    </Card.Text>

                                                    <div className="d-flex justify-content-center align-items-center gap-3">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() =>
                                                                addToCart(
                                                                    item,
                                                                    Math.max(cartItem.quantity - 1, 0)
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="fw-bold">{cartItem.quantity}</span>
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() =>
                                                                addToCart(item, cartItem.quantity + 1)
                                                            }
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>

                    {/* Cột phải: Tóm tắt */}
                    <Col md={4} className="px-4">
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="shadow-lg rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
                                <h4 className="text-center mb-3 fw-bold text-brown">
                                    Tóm tắt đơn hàng
                                </h4>

                                {cart.filter((i) => i.quantity > 0).length === 0 ? (
                                    <p className="text-center text-muted">
                                        Chưa có món nào được chọn
                                    </p>
                                ) : (
                                    <Table bordered size="sm" hover className="align-middle text-center">
                                        <thead className="bg-warning bg-opacity-25">
                                        <tr>
                                            <th>Món</th>
                                            <th>SL</th>
                                            <th>Tổng</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cart
                                            .filter((i) => i.quantity > 0)
                                            .map((i) => (
                                                <tr key={i.key}>
                                                    <td>{i.name}</td>
                                                    <td>{i.quantity}</td>
                                                    <td>{(i.price * i.quantity).toLocaleString()} ₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}

                                <div className="text-end fw-bold fs-5 text-success mt-3">
                                    Tổng cộng: {total.toLocaleString()} ₫
                                </div>

                                <Button
                                    variant="success"
                                    className="w-100 mt-4 py-2 fw-semibold"
                                    onClick={handleSubmit}
                                >
                                    Xác nhận đặt món
                                </Button>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
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
                © 2025 Modern Chill Coffee — Enjoy your meal with us
            </footer>
        </div>
    );
}