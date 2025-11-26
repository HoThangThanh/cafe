import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Card,
    Badge,
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function OrderAdmin() {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentOrderId, setPaymentOrderId] = useState(null);

    // 🔹 Lấy danh sách đơn
    const fetchOrders = async () => {
        try {
            const res = await axios.get("/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải đơn hàng:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 🔸 Cập nhật trạng thái
    const handleStatusChange = async (id, status, paymentMethod = null) => {
        try {
            const url = paymentMethod
                ? `/orders/${id}/status?status=${status}&paymentMethod=${paymentMethod}`
                : `/orders/${id}/status?status=${status}`;

            await axios.put(url, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchOrders();
            setShowPaymentModal(false);
        } catch {
            alert("⚠️ Lỗi khi cập nhật trạng thái!");
        }
    };

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    const totalRevenue = orders
        .filter((o) => o.status === "paid")
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#0e0a08,#1b1009,#0f0906)",
                color: "#fff",
                padding: "2rem",
            }}
        >
            <Container fluid>
                <Row className="align-items-center mb-4">
                    <Col>
                        <h2 className="fw-bold text-warning">🧾 Quản lý đơn hàng</h2>
                    </Col>
                    <Col className="text-end text-success fw-semibold">
                        💰 Tổng doanh thu: {formatMoney(totalRevenue)}
                    </Col>
                </Row>

                {/* Bảng đơn hàng */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        className="shadow-lg border-0"
                        style={{ backgroundColor: "#1e1a14", color: "#f5e6cc" }}
                    >
                        <Card.Body>
                            <Table bordered hover responsive variant="dark" className="align-middle text-center">
                                <thead className="bg-gradient bg-opacity-10 text-warning">
                                <tr>
                                    <th>#</th>
                                    <th>Bàn</th>
                                    <th>Vị trí</th>
                                    <th>Số món</th>
                                    <th>Trạng thái</th>
                                    <th>Thanh toán</th>
                                    <th>Tổng</th>
                                    <th>Thời gian</th>
                                    <th>Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((o, i) => (
                                    <tr key={o.id || o._id}>
                                        <td>{i + 1}</td>
                                        <td className="fw-bold text-info">Bàn {o.tableNumber}</td>
                                        <td>{o.tableLocation || "—"}</td>
                                        <td>{o.items?.length || 0}</td>
                                        <td>
                                            <Badge
                                                bg={
                                                    o.status === "pending"
                                                        ? "warning"
                                                        : o.status === "served"
                                                            ? "info"
                                                            : "success"
                                                }
                                            >
                                                {o.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            {o.paymentMethod
                                                ? o.paymentMethod === "cash"
                                                    ? "💵 Tiền mặt"
                                                    : "📱 QR"
                                                : "—"}
                                        </td>
                                        <td className="text-success fw-bold">
                                            {formatMoney(o.totalPrice)}
                                        </td>
                                        <td>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setSelectedOrder(o)}
                                                className="me-2"
                                            >
                                                Xem
                                            </Button>
                                            {o.status !== "paid" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        className="me-2"
                                                        onClick={() => handleStatusChange(o.id, "served")}
                                                    >
                                                        Phục vụ
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() => {
                                                            setPaymentOrderId(o.id);
                                                            setShowPaymentModal(true);
                                                        }}
                                                    >
                                                        Thanh toán
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </motion.div>

                {/* Modal thanh toán */}
                <Modal
                    show={showPaymentModal}
                    onHide={() => setShowPaymentModal(false)}
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton style={{ background: "#1b1510", color: "#fff" }}>
                        <Modal.Title>💳 Chọn phương thức thanh toán</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ background: "#2a1d10", color: "#fff" }}>
                        <div className="d-grid gap-3">
                            <Button
                                variant="success"
                                size="lg"
                                onClick={() =>
                                    handleStatusChange(paymentOrderId, "paid", "cash")
                                }
                            >
                                💵 Thanh toán tiền mặt
                            </Button>

                            <div className="text-center p-3 bg-dark rounded shadow">
                                <p className="fw-semibold text-info mb-2">
                                    Quét mã QR để thanh toán:
                                </p>
                                <img
                                    src="/images/qr-momo.png"
                                    alt="QR Payment"
                                    className="rounded shadow-lg"
                                    style={{ width: 200, height: 200 }}
                                />
                                <Button
                                    variant="info"
                                    className="mt-3 fw-bold text-white"
                                    onClick={() =>
                                        handleStatusChange(paymentOrderId, "paid", "qr")
                                    }
                                >
                                    ✅ Xác nhận thanh toán QR
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ background: "#1b1510" }}>
                        <Button variant="outline-light" onClick={() => setShowPaymentModal(false)}>
                            Hủy
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Chi tiết đơn hàng */}
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-5"
                    >
                        <Card
                            className="shadow-lg border-0"
                            style={{ backgroundColor: "#1b1510", color: "#f5e6cc" }}
                        >
                            <Card.Body>
                                <h4 className="text-warning mb-3">
                                    Chi tiết đơn #{selectedOrder.id}
                                </h4>
                                <p>🪑 Bàn: {selectedOrder.tableNumber}</p>
                                <p>📍 Vị trí: {selectedOrder.tableLocation}</p>
                                <p>
                                    💳 Thanh toán:{" "}
                                    <span className="fw-semibold text-info">
                    {selectedOrder.paymentMethod || "Chưa thanh toán"}
                  </span>
                                </p>
                                <p>⏰ {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}</p>

                                <Table
                                    striped
                                    bordered
                                    hover
                                    responsive
                                    variant="dark"
                                    className="mt-3"
                                >
                                    <thead>
                                    <tr>
                                        <th>Món</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Tổng</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatMoney(item.price)}</td>
                                            <td>{formatMoney(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>

                                <div className="text-end fw-bold fs-5 text-success">
                                    Tổng cộng: {formatMoney(selectedOrder.totalPrice)}
                                </div>
                                <div className="text-end mt-3">
                                    <Button
                                        variant="outline-light"
                                        onClick={() => setSelectedOrder(null)}
                                    >
                                        Đóng
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                )}
            </Container>
        </div>
    );
}