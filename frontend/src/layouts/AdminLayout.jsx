import React, { useState } from "react";
import { Container, Navbar, Nav, Offcanvas, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLayout({ children }) {
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#0e0a08,#1b1510,#2a1d10)",
                color: "#f5e6cc",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* 🌟 Navbar trên cùng */}
            <Navbar
                expand="lg"
                bg="dark"
                variant="dark"
                className="shadow-lg border-bottom border-warning"
                style={{ backgroundColor: "#1b1510 !important" }}
            >
                <Container fluid>
                    <Navbar.Brand
                        as={Link}
                        to="/admin/dashboard"
                        className="fw-bold text-warning"
                    >
                        ☕ Luxury Café Admin
                    </Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="offcanvasNavbar"
                        onClick={() => setShowSidebar(true)}
                        className="border-warning"
                    />
                </Container>
            </Navbar>

            {/* 🧭 Sidebar (Offcanvas cho mobile) */}
            <Offcanvas
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                backdrop="static"
                scroll
                style={{
                    backgroundColor: "#1b1510",
                    color: "#f5e6cc",
                    width: "260px",
                }}
            >
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title className="fw-bold text-warning">
                        ☕ Admin Panel
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column gap-3">
                        <Nav.Link
                            as={Link}
                            to="/admin/dashboard"
                            onClick={() => setShowSidebar(false)}
                            className="text-light fw-semibold hover:text-warning"
                        >
                            📊 Dashboard
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/menu-admin"
                            onClick={() => setShowSidebar(false)}
                            className="text-light fw-semibold hover:text-warning"
                        >
                            🍽️ Menu
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/table-admin"
                            onClick={() => setShowSidebar(false)}
                            className="text-warning fw-bold bg-opacity-10 bg-warning rounded px-2 py-1"
                        >
                            🪑 Bàn
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/admin/orders"
                            onClick={() => setShowSidebar(false)}
                            className="text-light fw-semibold hover:text-warning"
                        >
                            🧾 Đơn hàng
                        </Nav.Link>
                    </Nav>

                    <div className="mt-auto pt-4 border-top border-secondary text-center">
                        <Button
                            variant="danger"
                            className="w-100 fw-semibold"
                            onClick={handleLogout}
                        >
                            🚪 Đăng xuất
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* 📦 Nội dung chính */}
            <Container fluid className="flex-grow-1 py-4">
                <header className="d-flex justify-content-between align-items-center border-bottom border-warning pb-3 mb-4">
                    <h2 className="fw-bold text-warning m-0">Khu vực quản lý</h2>
                    <span
                        className="bg-dark bg-opacity-50 px-3 py-2 rounded text-light border border-secondary small"
                        style={{ letterSpacing: "0.5px" }}
                    >
            👤 Admin
          </span>
                </header>

                <div className="text-light">{children}</div>

                <footer className="text-center text-muted mt-5 pt-3 border-top border-secondary small">
                    © 2025 Hồ Thăng Thành ☕
                </footer>
            </Container>
        </div>
    );
}
