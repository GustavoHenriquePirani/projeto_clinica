import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import bcrypt from "bcryptjs";
import "../../pages/global.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
  
    try {
      if (!email || !password) {
        setMessage({ type: "danger", text: "E-mail e senha são obrigatórios." });
        setLoading(false);
        return;
      }
  
      const response = await fetch(`http://localhost:3000/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log("Status da resposta:", response.status); 
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Erro ao converter resposta em JSON:", e);
        throw new Error("Resposta inesperada do servidor.");
      }
  
      if (!response.ok) {
        setMessage({ type: "danger", text: data.message || "Erro ao realizar login." });
        setLoading(false);
        return;
      }
  
      setMessage({ type: "success", text: "Login realizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setMessage({ type: "danger", text: "Erro ao realizar login. Tente novamente." });
    } finally {
      setLoading(false);
    }
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

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
