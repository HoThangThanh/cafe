import React from "react";
import { Link } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    Button,
    Row,
    Col,
    Card,
} from "react-bootstrap";

export default function Home() {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            {/* 🌿 Navbar */}
            <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#b68973" }}>
                <Container>
                    <Navbar.Brand as={Link} to="/home" className="fw-bold fs-3 text-white">
                        🌿 Modern Chill Coffee
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar" />
                    <Navbar.Collapse id="navbar" className="justify-content-between">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/home" className="text-white">
                                Trang chủ
                            </Nav.Link>
                            <Nav.Link as={Link} to="/menu" className="text-white">
                                Menu
                            </Nav.Link>
                            <Nav.Link as={Link} to="/tables" className="text-white">
                                Đặt bàn
                            </Nav.Link>
                            <Nav.Link as={Link} to="/about" className="text-white">
                                Giới thiệu
                            </Nav.Link>
                        </Nav>

                        <div className="d-flex align-items-center gap-3">
                            <div className="text-white text-end">
                                <div className="fw-semibold">{username || "Khách"}</div>
                                <small className="opacity-75">{role}</small>
                            </div>
                            <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                Đăng xuất
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* 🏠 Hero Section */}
            <section
                className="text-center text-white d-flex align-items-center justify-content-center"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "80vh",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                ></div>
                <Container style={{ zIndex: 1 }}>
                    <h1 className="display-4 fw-bold mb-3">Chào mừng đến Modern Chill Coffee</h1>
                    <p className="fs-5 mb-4">
                        Thư giãn cùng hương vị cà phê tinh tế, không gian chill nhẹ và âm nhạc du dương 🎵
                    </p>
                    <Button as={Link} to="/menu" variant="light" size="lg" className="me-3">
                        ☕ Xem Menu
                    </Button>
                    <Button as={Link} to="/tables" variant="outline-light" size="lg">
                        🪑 Đặt bàn ngay
                    </Button>
                </Container>
            </section>

            {/* 🌸 Featured Menu */}
            <Container className="py-5">
                <h2 className="text-center fw-bold mb-4">Món được yêu thích</h2>
                <Row className="g-4 justify-content-center">
                    <Col md={4}>
                        <Card className="shadow-sm border-0">
                            <Card.Img
                                variant="top"
                                src="https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=800&q=80"
                            />
                            <Card.Body className="text-center">
                                <Card.Title>Caramel Macchiato</Card.Title>
                                <Card.Text>
                                    Sự kết hợp hoàn hảo giữa espresso, caramel và sữa tươi thơm ngậy.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm border-0">
                            <Card.Img
                                variant="top"
                                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
                            />
                            <Card.Body className="text-center">
                                <Card.Title>Cold Brew Coffee</Card.Title>
                                <Card.Text>
                                    Cà phê ủ lạnh 24h mang lại vị đậm đà, mượt mà khó quên.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm border-0">
                            <Card.Img
                                variant="top"
                                src="https://images.unsplash.com/photo-1604147706283-df3f4b1b07cb?auto=format&fit=crop&w=800&q=80"
                            />
                            <Card.Body className="text-center">
                                <Card.Title>Matcha Latte</Card.Title>
                                <Card.Text>
                                    Hương matcha Nhật Bản hòa quyện cùng sữa tươi, tạo cảm giác thư thái.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* 🌿 Footer */}
            <footer
                className="text-white text-center py-4 mt-auto"
                style={{ backgroundColor: "#5e4632" }}
            >
                <Container>
                    <Row>
                        <Col md={6}>
                            <p className="mb-1">📍 45 Trần Phú, Hải Châu, Đà Nẵng</p>
                            <p className="mb-0">📞 0905 888 999</p>
                        </Col>
                        <Col md={6}>
                            <p className="mb-1">🕒 Mở cửa: 7:00 - 22:00</p>
                            <p className="mb-0">© 2025 Modern Chill Coffee</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
}
