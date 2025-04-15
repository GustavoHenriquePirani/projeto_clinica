import { useEffect, useState } from "react";
import { useAuth } from "../login/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import "../../pages/global.css";
import "./servicos.css";

interface Servico {
  id: number;
  name: string;
  descricao: string;
  valor: number;
  categoria: string;
}

export const Servicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [editService, setEditService] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [novoServico, setNovoServico] = useState<Servico>({
    id: 0,
    name: "",
    descricao: "",
    valor: 0,
    categoria: "",
  });

  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/clinica/servicos/listar"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar serviços");
      }
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isValidServico(novoServico)) return;

    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://localhost:8000/clinica/servicos/editar/${editing.id}`
      : "http://localhost:8000/clinica/servicos/criar";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...novoServico,
          valor: parseFloat(novoServico.valor.toString()),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar serviço");
      }

      const updatedServico = await response.json();
      setServicos((prev) =>
        editing
          ? prev.map((servico) =>
              servico.id === updatedServico.id ? updatedServico : servico
            )
          : [...prev, updatedServico]
      );
      setShowModal(false);
      setEditing(null);
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/clinica/servicos/deletar/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir serviço");
      }

      setServicos(servicos.filter((servico) => servico.id !== selectedId));
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setSelectedId(null);
    }
  };

  const isValidServico = (servico: Servico) => {
    return (
      servico.name.trim() !== "" &&
      servico.descricao.trim() !== "" &&
      servico.valor > 0 &&
      servico.categoria.trim() !== ""
    );
  };

  return (
    <Container className="container">
      <Row className="bg-img-servico text-center">
        <Col>
          <h1 className="fs-1">Nossos Serviços</h1>
        </Col>
      </Row>

      {isAuthenticated && isAdmin && (
        <Button
          variant="success"
          className="mb-3"
          onClick={() => {
            setShowModal(true);
            setEditing(null);
            setNovoServico({
              id: 0,
              name: "",
              descricao: "",
              valor: 0,
              categoria: "",
            });
          }}
        >
          Adicionar Serviço
        </Button>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {servicos.map((servico) => (
            <Col key={servico.id} xs={12} md={6} lg={4} className="mb-4">
              <Card
                className="position-relative cartao-servico"
                onClick={() => setEditService(servico.id)}
                onMouseLeave={() => setEditService(null)}
              >
                <Card.Body>
                  <Card.Title className="titulo-limitado">
                    {servico.name}
                  </Card.Title>
                  <Card.Text className="descricao-limitada">
                    {servico.descricao}
                  </Card.Text>
                  <div>
                    <p>
                      <strong>Categoria:</strong> {servico.categoria}
                    </p>
                    <p>
                      <strong>Valor:</strong> R$ {servico.valor.toFixed(2)}
                    </p>
                  </div>

                  <div className="button-container">
                    {isAuthenticated &&
                      isAdmin &&
                      editService === servico.id && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing(servico);
                              setNovoServico(servico);
                              setShowModal(true);
                            }}
                          >
                            ✏️ Editar
                          </Button>{" "}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(servico.id);
                            }}
                          >
                            🗑️ Excluir
                          </Button>
                        </div>
                      )}
                    <Button variant="primary">Agendar</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? "Editar Serviço" : "Adicionar Serviço"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={novoServico.name}
                onChange={(e) =>
                  setNovoServico({ ...novoServico, name: e.target.value })
                }
                required
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                value={novoServico.descricao}
                onChange={(e) =>
                  setNovoServico({ ...novoServico, descricao: e.target.value })
                }
                required
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={novoServico.valor}
                onChange={(e) =>
                  setNovoServico({
                    ...novoServico,
                    valor: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                value={novoServico.categoria}
                onChange={(e) =>
                  setNovoServico({ ...novoServico, categoria: e.target.value })
                }
                required
              />
              <span className="obrigatorio">Campo obrigatório*</span>
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
            disabled={!isValidServico(novoServico) || loading}
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
          <p>Tem certeza que deseja remover este serviço?</p>
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
