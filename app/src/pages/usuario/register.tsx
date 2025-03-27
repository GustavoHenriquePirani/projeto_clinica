// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import "../../pages/global.css";

// export const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{
//     type: "success" | "danger";
//     text: string;
//   } | null>(null);
//   const [novoUser, setNovoUser] = useState({
//     id: 0,
//     name: "",
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async () => {
//     setLoading(true);
//     setMessage(null);
//     if (!novoUser.name || !novoUser.email || !novoUser.password) return;

//     const formData = new FormData();
//     formData.append("name", novoUser.name);
//     formData.append("email", novoUser.email);
//     formData.append("password", novoUser.password);

//     try {
//       const response = await fetch("http://localhost:8000/user/criar", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setMessage({
//           type: "danger",
//           text: data.message || "Erro ao cadastrar usuário.",
//         });
//       } else {
//         setMessage({
//           type: "success",
//           text: "Usuário cadastrado com sucesso!",
//         });
//         setName("");
//         setEmail("");
//         setPassword("");
//       }
//     } catch (error) {
//       console.error("Erro ao cadastrar usuário:", error);
//       setMessage({
//         type: "danger",
//         text: "Erro ao cadastrar usuário. Tente novamente.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="container mt-4 ps-4 pe-4">
//       <Row className="justify-content-center">
//         <Col md={6}>
//           <h2 className="text-center">Cadastro de Usuário</h2>

//           {message && <Alert variant={message.type}>{message.text}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Nome</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Digite seu nome"
//                 value={novoUser.name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <span className="obrigatorio">Campo obrigatório*</span>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>E-mail</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Digite seu e-mail"
//                 value={novoUser.email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <span className="obrigatorio">Campo obrigatório*</span>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Senha</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Digite sua senha"
//                 value={novoUser.password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span className="obrigatorio">Campo obrigatório*</span>
//             </Form.Group>

//             <Button
//               variant="success"
//               type="submit"
//               className="w-100 mt-4"
//               disabled={loading}
//             >
//               {loading ? <Spinner animation="border" size="sm" /> : "Cadastrar"}
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

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
      const response = await fetch("http://localhost:8000/clinica/user/criar", {
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
