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
  const [novoUser, setNovoUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoUser({ ...novoUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setLoading(true);
    setMessage(null);

    if (!novoUser.name || !novoUser.email || !novoUser.password) {
      setMessage({ type: "danger", text: "Todos os campos são obrigatórios." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseURL}/clinica/user/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoUser),
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
        setNovoUser({ name: "", email: "", password: "" });
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
                name="name"
                placeholder="Digite seu nome"
                value={novoUser.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={novoUser.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Digite sua senha"
                value={novoUser.password}
                onChange={handleChange}
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
