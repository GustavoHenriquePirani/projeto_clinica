import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import "../../pages/global.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!name || !email || !password) {
        setMessage({
          type: "danger",
          text: "Todos os campos são obrigatórios.",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/user/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          type: "danger",
          text: data.message || "Erro ao cadastrar usuário.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Usuário cadastrado com sucesso!",
        });
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setMessage({
        type: "danger",
        text: "Erro ao cadastrar usuário. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="container mt-4 ps-4 pe-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center">Cadastro de Usuário</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 mt-4"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Cadastrar"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
