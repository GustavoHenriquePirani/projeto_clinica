import React, { useEffect, useState, useCallback } from "react";
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
import { useAuth } from "../login/AuthContext";
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

  const { isAuthenticated, isAdmin } = useAuth();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchMedicos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/clinica/medicos/listar`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicos(data);
      const novasImagens: { [key: number]: string } = {};

      await Promise.all(
        data.map(async (medico: Medico) => {
          const imagemResponse = await fetch(
            `${baseURL}/clinica/medicos/${medico.id}/foto`
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
  }, [baseURL]);

  useEffect(() => {
    fetchMedicos();
  }, [fetchMedicos]);

  const handleSave = async () => {
    if (!isValidMedico(novoMedico)) return;
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${baseURL}/clinica/medicos/editar/${editing.id}`
      : `${baseURL}/clinica/medicos/criar`;

    const formData = new FormData();
    formData.append("name", novoMedico.name);
    formData.append("crm", novoMedico.crm);
    formData.append("email", novoMedico.email);
    formData.append("descricao", novoMedico.descricao);
    if (novoMedico.fotoPerfil) {
      formData.append("fotoPerfil", novoMedico.fotoPerfil);
    }

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchMedicos();
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

  const confirmDelete = async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/clinica/medicos/deletar/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchMedicos();
    } catch (error) {
      console.error("Erro ao remover médico:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const getPreviewSrc = (foto: Blob | string | undefined) => {
    if (!foto) return "";
    if (typeof foto === "string") return foto;
    if (foto instanceof Blob) {
      try {
        return URL.createObjectURL(foto);
      } catch (error) {
        console.error("Erro ao criar URL para blob:", error);
        return "";
      }
    }
    return "";
  };

  const isValidMedico = (medico: Medico) => {
    return (
      medico.name.trim() !== "" &&
      medico.crm.trim() !== "" &&
      medico.email.trim() !== "" &&
      medico.descricao.trim() !== ""
    );
  };

  return (
    <Container>
      <Row className="bg-img-equipe text-center">
        <Col>
          <h1 className="fs-1">Nossa Equipe</h1>
        </Col>
      </Row>

      {isAuthenticated && isAdmin && (
        <Button
          variant="success"
          onClick={() => {
            setShowModal(true);
            setEditing(null);
            setNovoMedico({
              id: 0,
              name: "",
              crm: "",
              email: "",
              descricao: "",
            });
          }}
        >
          Adicionar Médico
        </Button>
      )}

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
                    {isAuthenticated && isAdmin && editEquipe === medico.id && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <Button
                          className="me-2"
                          variant="warning"
                          onClick={(e) => {
                            e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(medico.id);
                          }}
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
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : editing ? (
              "Salvar"
            ) : (
              "Adicionar"
            )}
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
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Excluir"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
