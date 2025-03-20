// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
// import "../../pages/global.css";
// import "./index.css";

// interface Medico {
//   id: number;
//   name: string;
//   crm: string;
//   email: String;
//   descricao: string;
//   fotoPerfil: Blob;
// }

// export const Equipe = () => {
//   const [medicos, setMedicos] = useState<Medico[]>([]);
//   const [imagens, setImagens] = useState<{ [key: number]: string }>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMedicos = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/clinica/medicos");
//         const data = await response.json();
//         setMedicos(data);
//         const novasImagens: { [key: number]: string } = {};
//         await Promise.all(
//           data.map(async (medico: Medico) => {
//             try {
//               const imagemResponse = await fetch(
//                 `http://localhost:8000/clinica/medicos/${medico.id}/foto`
//               );
//               if (imagemResponse.ok) {
//                 const blob = await imagemResponse.blob();
//                 novasImagens[medico.id] = URL.createObjectURL(blob);
//               }
//             } catch (error) {
//               console.error(
//                 `Erro ao carregar imagem do médico ${medico.id}:`,
//                 error
//               );
//             }
//           })
//         );

//         setImagens(novasImagens);
//       } catch (error) {
//         console.error("Erro ao buscar os médicos:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedicos();
//   }, []);

//   return (
//     <Container className="container">
//       <Row className="bg-img-equipe text-center">
//         <Col>
//           <h1 className="fs-1">Nossa Equipe</h1>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" />
//         </div>
//       ) : (
//         <Row>
//           {medicos.map((medico) => (
//             <Col key={medico.id} md={4} className="mb-4">
//               <Card className="shadow text-center">
//                 {imagens[medico.id] ? (
//                   <Card.Img
//                     src={imagens[medico.id]}
//                     alt={`Foto de ${medico.name}`}
//                     className="foto-perfil"
//                   />
//                 ) : (
//                   <Card.Img
//                     src="/imagens/avatar.png"
//                     alt={`Foto de ${medico.name}`}
//                     className="foto-perfil"
//                   />
//                 )}
//                 <Card.Body>
//                   <Card.Title className="nome-medico">{medico.name}</Card.Title>
//                   <Card.Subtitle className="info-medico">
//                     CRM: {medico.crm}
//                   </Card.Subtitle>
//                   <Card.Text className="info-medico text-muted">
//                     {medico.descricao}
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </Container>
//   );
// };

import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import "../../pages/global.css";
import "./index.css";

interface Medico {
  id: number;
  name: string;
  crm: string;
  email: string;
  descricao: string;
  fotoPerfil?: Blob;
}

export const Equipe = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [imagens, setImagens] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Medico | null>(null);
  const [novoMedico, setNovoMedico] = useState<Medico>({
    id: 0,
    name: "",
    crm: "",
    email: "",
    descricao: "",
  });

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/clinica/medicos");
      const data = await response.json();
      setMedicos(data);
      const novasImagens: { [key: number]: string } = {};

      await Promise.all(
        data.map(async (medico: Medico) => {
          const imagemResponse = await fetch(
            `http://localhost:8000/clinica/medicos/${medico.id}/foto`
          );
          if (imagemResponse.ok) {
            const blob = await imagemResponse.blob();
            novasImagens[medico.id] = URL.createObjectURL(blob);
          }
        })
      );

      setImagens(novasImagens);
    } catch (error) {
      console.error("Erro ao buscar os médicos:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSave = async () => {
  //   if (
  //     !novoMedico.name ||
  //     !novoMedico.crm ||
  //     !novoMedico.email ||
  //     !novoMedico.descricao
  //   ) {
  //     alert("Todos os campos são obrigatórios!");
  //     return;
  //   }

  //   setLoading(true);
  //   const method = editing ? "PUT" : "POST";
  //   const url = editing
  //     ? `http://localhost:8000/clinica/medicos/${editing.id}`
  //     : "http://localhost:8000/clinica/medicos";

  //   try {
  //     await fetch(url, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(novoMedico),
  //     });
  //     fetchMedicos();
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Erro ao salvar médico:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSave = async () => {
    if (
      !novoMedico.name ||
      !novoMedico.crm ||
      !novoMedico.email ||
      !novoMedico.descricao
    ) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://localhost:8000/clinica/medicos/${editing.id}`
      : "http://localhost:8000/clinica/medicos";

    const formData = new FormData();
    formData.append("name", novoMedico.name);
    formData.append("crm", novoMedico.crm);
    formData.append("email", novoMedico.email);
    formData.append("descricao", novoMedico.descricao);
    if (novoMedico.fotoPerfil) {
      formData.append("fotoPerfil", novoMedico.fotoPerfil as Blob);
    }

    try {
      await fetch(url, {
        method,
        // Note que não precisamos definir Content-Type; o navegador adiciona o boundary automaticamente.
        body: formData,
      });
      fetchMedicos();
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar médico:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja remover este médico?")) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:8000/clinica/medicos/${id}`, {
        method: "DELETE",
      });
      fetchMedicos();
    } catch (error) {
      console.error("Erro ao remover médico:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPreviewSrc = (foto: Blob | string | undefined) => {
    if (!foto) return "";
    if (typeof foto === "string") return foto;
    // Verifica se foto tem propriedade 'size', que indica ser um Blob ou File
    if (typeof (foto as Blob).size === "number") {
      try {
        return URL.createObjectURL(foto as Blob);
      } catch (error) {
        console.error("Erro ao criar URL para blob:", error);
        return "";
      }
    }
    return "";
  };

  return (
    <Container>
      <Row className="bg-img-equipe text-center">
        <Col>
          <h1 className="fs-1">Nossa Equipe</h1>
        </Col>
      </Row>

      <Button
        onClick={() => {
          setShowModal(true);
          setEditing(null);
          setNovoMedico({ id: 0, name: "", crm: "", email: "", descricao: "" });
        }}
      >
        Adicionar Médico
      </Button>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="pt-3">
          {medicos.map((medico) => (
            <Col key={medico.id} md={4} className="mb-4">
              <Card className="shadow text-center">
                <Card.Img
                  src={imagens[medico.id] || "/imagens/avatar.png"}
                  className="foto-perfil"
                />
                <Card.Body>
                  <Card.Title>{medico.name}</Card.Title>
                  <Card.Subtitle>CRM: {medico.crm}</Card.Subtitle>
                  <Card.Text className="text-muted">
                    {medico.descricao}
                  </Card.Text>
                  <Button
                    className="me-2"
                    variant="warning"
                    onClick={() => {
                      setEditing(medico);
                      setNovoMedico(medico);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    className="ms-2"
                    variant="danger"
                    onClick={() => handleDelete(medico.id)}
                  >
                    Remover
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? "Editar Médico" : "Adicionar Médico"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={novoMedico.name}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>CRM</Form.Label>
              <Form.Control
                type="text"
                value={novoMedico.crm}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, crm: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={novoMedico.email}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                value={novoMedico.descricao}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, descricao: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Foto de Perfil</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setNovoMedico({ ...novoMedico, fotoPerfil: file });
                  }
                }}
              />
              {novoMedico.fotoPerfil && (
                <img
                  src={getPreviewSrc(novoMedico.fotoPerfil)}
                  alt="Pré-visualização"
                  className="preview-imagem"
                  style={{
                    marginTop: "10px",
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={
              !novoMedico.name ||
              !novoMedico.crm ||
              !novoMedico.email ||
              !novoMedico.descricao
            }
          >
            {editing ? "Salvar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
