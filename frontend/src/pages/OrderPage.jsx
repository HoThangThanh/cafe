import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
    Navbar,
    Nav,
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function OrderPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [menu, setMenu] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy danh sách món
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get("/products", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMenu(res.data);
            } catch {
                alert("Không thể tải danh sách menu!");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [token]);

    const handleAddToOrder = (item) => {
        setOrderItems((prev) => {
            const found = prev.find((i) => i.productId === item._id);
            if (found) {
                return prev.map((i) =>
                    i.productId === found.productId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            } else {
                return [
                    ...prev,
                    {
                        productId: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                    },
                ];
            }
        });
    };

    const handleChangeQty = (id, qty) => {
        if (qty < 1) qty = 1;
        setOrderItems((prev) =>
            prev.map((i) => (i.productId === id ? { ...i, quantity: qty } : i))
        );
    };

    const handleRemoveItem = (id) =>
        setOrderItems((prev) => prev.filter((i) => i.productId !== id));

    const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const handleSubmitOrder = async () => {
        if (orderItems.length === 0) return alert("Vui lòng chọn ít nhất 1 món!");
        const payload = { tableId, items: orderItems };
        try {
            await axios.post("/orders", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Đặt món thành công!");
            setOrderItems([]);
            navigate("/tables");
        } catch {
            alert("Không thể gửi đơn hàng!");
        }
    };

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

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

            {/* Nội dung */}
            <Container fluid className="py-4">
                <Row>
                    {/* Menu */}
                    <Col md={8} className="px-4">
                        <h3 className="fw-bold text-center text-brown mb-4">
                            Đặt món cho bàn #{tableId}
                        </h3>
                        <Row className="g-4">
                            {menu.map((m, idx) => (
                                <Col key={m._id} md={4} lg={3}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                            <div className="overflow-hidden position-relative">
                                                <Card.Img
                                                    variant="top"
                                                    src={
                                                        m.image ||
                                                        "https://via.placeholder.com/300x200?text=No+Image"
                                                    }
                                                    style={{
                                                        height: "180px",
                                                        objectFit: "cover",
                                                        transition: "transform 0.4s",
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
                                                    {m.name}
                                                </Card.Title>
                                                <Card.Text className="text-success fw-semibold">
                                                    {formatMoney(m.price)}
                                                </Card.Text>
                                                <Card.Text className="text-muted small mb-3">
                                                    {m.category || "Đồ uống"}
                                                </Card.Text>
                                                <Button
                                                    variant="warning"
                                                    className="text-white px-4 rounded-pill shadow-sm"
                                                    onClick={() => handleAddToOrder(m)}
                                                >
                                                    Thêm vào đơn
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Đơn hàng */}
                    <Col md={4} className="px-4">
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="shadow-lg rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
                                <h4 className="text-center fw-bold mb-3 text-brown">
                                    Đơn hàng của bạn
                                </h4>

                                {orderItems.length === 0 ? (
                                    <p className="text-center text-muted">
                                        Chưa có món nào được chọn
                                    </p>
                                ) : (
                                    <Table bordered size="sm" hover responsive>
                                        <thead className="bg-warning bg-opacity-25">
                                        <tr className="text-center">
                                            <th>Món</th>
                                            <th>SL</th>
                                            <th>Tổng</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {orderItems.map((i) => (
                                            <tr key={i.productId} className="text-center align-middle">
                                                <td>{i.name}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={i.quantity}
                                                        onChange={(e) =>
                                                            handleChangeQty(i.productId, Number(e.target.value))
                                                        }
                                                        className="form-control form-control-sm text-center"
                                                        style={{ width: "60px" }}
                                                    />
                                                </td>
                                                <td className="text-success fw-semibold">
                                                    {formatMoney(i.price * i.quantity)}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveItem(i.productId)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                )}

                                <div className="text-end fw-bold fs-5 text-success mt-3">
                                    Tổng cộng: {formatMoney(total)}
                                </div>

                                <Button
                                    variant="success"
                                    className="w-100 mt-4 py-2 fw-semibold"
                                    onClick={handleSubmitOrder}
                                >
                                    Xác nhận đặt món
                                </Button>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer
                className="text-white text-center py-3 mt-auto"
                style={{
                    background: "linear-gradient(90deg,#5c3c25,#7b4b2a)",
                    fontSize: "0.9rem",
                }}
            >
                © 2025 Modern Chill Coffee — Enjoy your meal with us
            </footer>
        </div>
    );
}