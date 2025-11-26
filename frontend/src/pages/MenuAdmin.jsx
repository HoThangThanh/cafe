import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Table,
} from "react-bootstrap";

export default function MenuAdmin() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        _id: "",
        name: "",
        price: "",
        image: "",
        category: "",
    });
    const [editing, setEditing] = useState(false);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (role !== "ADMIN") {
            alert("Bạn không có quyền truy cập trang này!");
            window.location.href = "/home";
        }
    }, [role]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Lỗi tải sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`/products/${form._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Cập nhật sản phẩm thành công!");
            } else {
                await axios.post("/products", form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Thêm sản phẩm thành công!");
            }
            setForm({ _id: "", name: "", price: "", image: "", category: "" });
            setEditing(false);
            fetchProducts();
        } catch (err) {
            alert("Không thể lưu sản phẩm!");
        }
    };

    const handleEdit = (p) => {
        setForm(p);
        setEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xác nhận xóa sản phẩm này?")) return;
        try {
            await axios.delete(`/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Đã xóa sản phẩm!");
            fetchProducts();
        } catch (err) {
            alert("Lỗi khi xóa sản phẩm!");
        }
    };

    const formatMoney = (n) =>
        n?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "0 ₫";

    return (
        <AdminLayout>
            <Container className="py-4">
                <h2 className="fw-bold text-center mb-4 text-uppercase text-primary">
                    Quản lý sản phẩm
                </h2>

                {/* Form thêm/sửa sản phẩm */}
                <Card className="shadow-sm mb-5">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="gy-3 align-items-center">
                                <Col md={3}>
                                    <Form.Control
                                        placeholder="Tên sản phẩm"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </Col>
                                <Col md={2}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Giá (VNĐ)"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        required
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Control
                                        placeholder="Link ảnh (URL)"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    />
                                </Col>
                                <Col md={2}>
                                    <Form.Control
                                        placeholder="Phân loại"
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm({ ...form, category: e.target.value })
                                        }
                                    />
                                </Col>
                                <Col md={2} className="text-end">
                                    <Button type="submit" variant="success" className="w-100">
                                        {editing ? "Lưu thay đổi" : "Thêm mới"}
                                    </Button>
                                </Col>
                            </Row>
                            {editing && (
                                <div className="text-center mt-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setEditing(false);
                                            setForm({
                                                _id: "",
                                                name: "",
                                                price: "",
                                                image: "",
                                                category: "",
                                            });
                                        }}
                                    >
                                        Hủy chỉnh sửa
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </Card.Body>
                </Card>

                {/* Danh sách sản phẩm */}
                <Row className="g-4">
                    {products.map((p) => (
                        <Col key={p._id} md={4} lg={3}>
                            <Card className="shadow-sm h-100 border-0">
                                <Card.Img
                                    variant="top"
                                    src={
                                        p.image ||
                                        "https://via.placeholder.com/300x200?text=No+Image"
                                    }
                                    style={{ height: "180px", objectFit: "cover" }}
                                />
                                <Card.Body className="text-center">
                                    <Card.Title className="fw-bold text-dark mb-1">
                                        {p.name}
                                    </Card.Title>
                                    <Card.Text className="text-success fw-semibold mb-1">
                                        {formatMoney(p.price)}
                                    </Card.Text>
                                    <Card.Text className="text-muted small mb-3">
                                        {p.category || "Không phân loại"}
                                    </Card.Text>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleEdit(p)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(p._id)}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <footer className="text-center text-muted small mt-5">
                    © 2025 CoffeeTime Admin — Hệ thống quản lý sản phẩm
                </footer>
            </Container>
        </AdminLayout>
    );
}