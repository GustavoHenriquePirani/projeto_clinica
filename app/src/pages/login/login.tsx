import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../../pages/global.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, logout, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setEmail(user.email);
      setPassword("********");
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!email || !password) {
        setMessage({
          type: "danger",
          text: "E-mail e senha são obrigatórios.",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/clinica/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "danger",
          text: data.message || "Erro ao realizar login.",
        });
        setLoading(false);
        return;
      }

      login(data.token, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        admin: data.user.admin,
      });

      setMessage({
        type: "success",
        text: `Login realizado com sucesso! ${
          data.user.admin ? "(Admin)" : ""
        }`,
      });

      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Erro ao realizar login. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setEmail("");
    setPassword("");
    setMessage({ type: "success", text: "Você saiu do sistema." });
  };

  return (
    <Container fluid className="container mt-4 ps-4 pe-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center">Login</h2>

          {isAuthenticated && isAdmin && (
            <Alert variant="warning" className="text-center">
              <Badge bg="danger">ADMIN</Badge> Modo administrador ativo
            </Alert>
          )}

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAuthenticated}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isAuthenticated}
              />
            </Form.Group>

            <div className="d-flex flex-column align-items-center mt-5">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="success"
                    type="submit"
                    className="w-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Entrar"
                    )}
                  </Button>

                  <Link
                    to="/register"
                    className="w-50 mt-4 d-flex justify-content-center"
                  >
                    <Button variant="primary" type="button" className="w-100">
                      Cadastrar
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant="danger"
                    className="w-50"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-50 mt-3"
                    onClick={() => navigate("/")}
                  >
                    Ir para Página Inicial
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
