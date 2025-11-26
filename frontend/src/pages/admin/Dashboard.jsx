import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";
import { motion } from "framer-motion";

const COLORS = ["#facc15", "#34d399", "#60a5fa", "#f87171", "#a78bfa"];

export default function Dashboard() {
    const [overview, setOverview] = useState({});
    const [daily, setDaily] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [o, d, t] = await Promise.all([
                    axios.get("/stats/overview", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/stats/daily", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/stats/top-products", { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                setOverview(o.data);
                setDaily(d.data);
                setTopProducts(t.data);
            } catch (err) {
                console.error("❌ Lỗi khi tải thống kê:", err);
            }
        };
        fetchData();
    }, [token]);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0e0a08,#2a1d10,#0f0906)", color: "#fff" }}>
            {/* Navbar */}
            <Navbar
                expand="lg"
                style={{
                    background: "linear-gradient(90deg,#3d1f0f,#1b1009)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.5)",
                }}
                className="px-4 py-3"
            >
                <Navbar.Brand href="/admin/dashboard" className="fw-bold text-warning fs-4">
                    Luxury Café Admin
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link href="/admin/dashboard" className="text-light">Dashboard</Nav.Link>
                        <Nav.Link href="/menu-admin" className="text-light">Menu</Nav.Link>
                        <Nav.Link href="/table-admin" className="text-light">Bàn</Nav.Link>
                        <Nav.Link href="/admin/orders" className="text-light">Đơn hàng</Nav.Link>
                    </Nav>
                    <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}
                    >
                        Đăng xuất
                    </Button>
                </Navbar.Collapse>
            </Navbar>

            <Container fluid className="py-5">
                <motion.h2
                    className="text-center fw-bold text-warning mb-5"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Thống kê tổng quan
                </motion.h2>

                {/* Tổng quan */}
                <Row className="g-4 mb-5 px-4">
                    {[
                        { title: "Tổng doanh thu", value: `${overview.totalRevenue?.toLocaleString()} ₫`, color: "#34d399" },
                        { title: "Tổng đơn hàng", value: overview.totalOrders || 0, color: "#60a5fa" },
                        { title: "Đơn đã thanh toán", value: overview.totalPaidOrders || 0, color: "#facc15" },
                    ].map((item, i) => (
                        <Col md={4} key={i}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card
                                    className="text-center border-0 shadow-lg"
                                    style={{
                                        backgroundColor: "#1e1a14",
                                        color: "#fff",
                                        borderTop: `4px solid ${item.color}`,
                                    }}
                                >
                                    <Card.Body>
                                        <Card.Title className="text-secondary">{item.title}</Card.Title>
                                        <Card.Text className="fs-3 fw-bold" style={{ color: item.color }}>
                                            {item.value}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>

                {/* Biểu đồ doanh thu */}
                <Row className="px-4 mb-5">
                    <Col lg={8} className="mb-4">
                        <Card
                            className="shadow-lg border-0"
                            style={{ backgroundColor: "#1b1510", color: "#f5e6cc" }}
                        >
                            <Card.Body>
                                <Card.Title className="fw-semibold text-warning mb-4">
                                    Doanh thu theo ngày
                                </Card.Title>
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={daily}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#3b2d1f" />
                                        <XAxis dataKey="date" stroke="#d1b075" />
                                        <YAxis stroke="#d1b075" />
                                        <Tooltip contentStyle={{ backgroundColor: "#2a1d10", border: "1px solid #d1b075" }} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#facc15" strokeWidth={3} dot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Biểu đồ top món */}
                    <Col lg={4}>
                        <Card
                            className="shadow-lg border-0"
                            style={{ backgroundColor: "#1b1510", color: "#f5e6cc" }}
                        >
                            <Card.Body>
                                <Card.Title className="fw-semibold text-warning mb-4">
                                    Top 5 món bán chạy
                                </Card.Title>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={topProducts}
                                            dataKey="quantity"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {topProducts.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: "#2a1d10", border: "1px solid #d1b075" }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <footer className="text-center text-muted small mt-4">
                    © 2025 Luxury Café Admin — Dashboard Night Mode 🌙
                </footer>
            </Container>
        </div>
    );
}