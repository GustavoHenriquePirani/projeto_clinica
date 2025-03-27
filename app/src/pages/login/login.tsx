import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setEmail(storedEmail);
      setPassword("Você está logado");
    }
  }, []);

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      setMessage({ type: "success", text: "Login realizado com sucesso!" });
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
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setEmail("");
    setPassword("");
    setMessage({ type: "success", text: "Você saiu do sistema." });
  };

  return (
    <Container fluid className="container mt-4 ps-4 pe-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center">Login</h2>

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
                disabled={password === "Você está logado"}
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
                disabled={password === "Você está logado"}
              />
            </Form.Group>

            <div className="d-flex flex-column align-items-center mt-5">
              <Button
                variant="success"
                type="submit"
                className="w-50"
                disabled={loading || password === "Você está logado"}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
              </Button>

              {localStorage.getItem("token") && (
                <Button
                  variant="danger"
                  className="w-50 mt-3"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}

              <Link
                to="/register"
                className="w-50 mt-4 d-flex justify-content-center"
              >
                <Button variant="primary" type="button" className="w-100">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
