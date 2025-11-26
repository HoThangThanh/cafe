import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import AdminLayout from "../layouts/AdminLayout";
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button,
    Table,
    Spinner,
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function TableAdmin() {
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState({
        id: "",
        tableNumber: "",
        capacity: "",
        location: "",
        status: "available",
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

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

    useEffect(() => {
        fetchTables();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (!editing) delete payload.id;

            if (editing) {
                await axios.put(`/tables/${form.id || form._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Cập nhật bàn thành công!");
            } else {
                await axios.post("/tables", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Thêm bàn mới thành công!");
            }

            setEditing(false);
            setForm({
                id: "",
                tableNumber: "",
                capacity: "",
                location: "",
                status: "available",
            });
            fetchTables();
        } catch {
            alert("Không thể lưu bàn!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xác nhận xóa bàn này?")) return;
        try {
            await axios.delete(`/tables/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTables();
        } catch {
            alert("Không thể xóa bàn!");
        }
    };

    const handleReset = async (id) => {
        try {
            await axios.put(`/tables/${id}/reset`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTables();
        } catch {
            alert("Không thể reset bàn!");
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="warning" />
                <span className="ms-3 text-muted">Đang tải dữ liệu...</span>
            </div>
        );

    return (
        <AdminLayout>
            <Container fluid className="py-4">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="fw-bold text-brown text-center mb-4">
                        Quản lý danh sách bàn
                    </h2>
                </motion.div>
                {/* FORM thêm / sửa */}
                <Row className="justify-content-center mb-4">
                    <Col md={10}>
                        <Card className="shadow-sm border-0 rounded-4 p-4 bg-light">
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3 align-items-end">
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Số bàn</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={form.tableNumber}
                                                onChange={(e) =>
                                                    setForm({ ...form, tableNumber: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Sức chứa</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={form.capacity}
                                                onChange={(e) =>
                                                    setForm({ ...form, capacity: e.target.value })
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Vị trí</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.location}
                                                onChange={(e) =>
                                                    setForm({ ...form, location: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Trạng thái</Form.Label>
                                            <Form.Select
                                                value={form.status}
                                                onChange={(e) =>
                                                    setForm({ ...form, status: e.target.value })
                                                }
                                            >
                                                <option value="available">Trống</option>
                                                <option value="occupied">Đang phục vụ</option>
                                                <option value="paid">Đã thanh toán</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="text-center">
                                        <Button
                                            type="submit"
                                            variant={editing ? "primary" : "success"}
                                            className="w-100"
                                        >
                                            {editing ? "Lưu thay đổi" : "Thêm bàn"}
                                        </Button>
                                        {editing && (
                                            <Button
                                                variant="secondary"
                                                className="w-100 mt-2"
                                                onClick={() => {
                                                    setEditing(false);
                                                    setForm({
                                                        id: "",
                                                        tableNumber: "",
                                                        capacity: "",
                                                        location: "",
                                                        status: "available",
                                                    });
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                {/* BẢNG danh sách bàn */}
                <Row className="justify-content-center">
                    <Col md={10}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="shadow-lg rounded-4 border-0">
                                <Card.Body>
                                    <Table striped bordered hover responsive className="align-middle text-center">
                                        <thead className="bg-warning bg-opacity-25">
                                        <tr>
                                            <th>Số bàn</th>
                                            <th>Sức chứa</th>
                                            <th>Vị trí</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tables.map((t) => (
                                            <tr key={t.id || t._id}>
                                                <td className="fw-bold text-primary">
                                                    {t.tableNumber}
                                                </td>
                                                <td>{t.capacity}</td>
                                                <td>{t.location}</td>
                                                <td
                                                    className={
                                                        t.status === "available"
                                                            ? "text-success fw-semibold"
                                                            : t.status === "occupied"
                                                                ? "text-warning fw-semibold"
                                                                : "text-info fw-semibold"
                                                    }
                                                >
                                                    {t.status === "available"
                                                        ? "Trống"
                                                        : t.status === "occupied"
                                                            ? "Đang phục vụ"
                                                            : "Đã thanh toán"}
                                                </td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        className="me-2 text-white"
                                                        onClick={() => {
                                                            setForm(t);
                                                            setEditing(true);
                                                        }}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="me-2"
                                                        onClick={() => handleDelete(t.id || t._id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="info"
                                                        onClick={() => handleReset(t.id || t._id)}
                                                    >
                                                        Reset
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </AdminLayout>
    );
}