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
import "./equipe.css";

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
  const [editEquipe, setEditEquipe] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
      const response = await fetch(
        "http://localhost:8000/clinica/medicos/listar"
      );
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

  const handleSave = async () => {
    if (!isValidMedico(novoMedico)) return;
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://localhost:8000/clinica/medicos/editar/${editing.id}`
      : "http://localhost:8000/clinica/medicos/criar";

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

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const getPreviewSrc = (foto: Blob | string | undefined) => {
    if (!foto) return "";
    if (typeof foto === "string") return foto;
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

  const isValidMedico = (medico: Medico) => {
    return (
      novoMedico.name.trim() !== "" &&
      novoMedico.crm.trim() !== "" &&
      novoMedico.email.trim() !== "" &&
      novoMedico.descricao.trim() !== ""
    );
  };

  return (
    <Container>
      <Row className="bg-img-equipe text-center">
        <Col>
          <h1 className="fs-1">Nossa Equipe</h1>
        </Col>
      </Row>

      <Button
        variant="success"
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
            <Col key={medico.id} xs={12} md={6} lg={4} className="mb-4">
              <Card
                className="shadow text-center cartao-equipe"
                onClick={() => setEditEquipe(medico.id)}
                onMouseLeave={() => setEditEquipe(null)}
              >
                <Card.Img
                  src={imagens[medico.id] || "/imagens/avatar.png"}
                  className="foto-perfil"
                />
                <Card.Body>
                  <Card.Title className="titulo-limitado">
                    {medico.name}
                  </Card.Title>
                  <Card.Subtitle>CRM: {medico.crm}</Card.Subtitle>
                  <Card.Text className="text-muted">
                    {medico.descricao}
                    {editEquipe === medico.id && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <Button
                          className="me-2"
                          variant="warning"
                          onClick={() => {
                            setEditing(medico);
                            setNovoMedico(medico);
                            setShowModal(true);
                          }}
                        >
                          ✏️ Editar
                        </Button>
                        <Button
                          className="ms-2"
                          variant="danger"
                          onClick={() => handleDelete(medico.id)}
                        >
                          🗑️ Excluir
                        </Button>
                      </div>
                    )}
                  </Card.Text>
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
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>CRM</Form.Label>
              <Form.Control
                type="text"
                value={novoMedico.crm}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, crm: e.target.value })
                }
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={novoMedico.email}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, email: e.target.value })
                }
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                value={novoMedico.descricao}
                onChange={(e) =>
                  setNovoMedico({ ...novoMedico, descricao: e.target.value })
                }
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>
            <Form.Group className="mt-3">
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
            disabled={!isValidMedico(novoMedico) || loading}
          >
            {editing ? "Salvar" : "Adicionar"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja remover este médico?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (selectedId) {
                setLoading(true);
                try {
                  await fetch(
                    `http://localhost:8000/clinica/medicos/deletar/${selectedId}`,
                    {
                      method: "DELETE",
                    }
                  );
                  fetchMedicos();
                } catch (error) {
                  console.error("Erro ao remover médico:", error);
                } finally {
                  setLoading(false);
                }
              }
              setShowDeleteConfirm(false);
            }}
          >
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
