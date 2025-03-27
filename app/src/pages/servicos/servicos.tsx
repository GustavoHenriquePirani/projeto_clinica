import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
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
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    fetchServicos();
    verificarAdmin();
  }, []);

  // Função para verificar se o usuário logado é admin
  const verificarAdmin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.email === "admin@admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/clinica/servicos/listar"
      );
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

    const formData = new FormData();
    formData.append("name", novoServico.name);
    formData.append("descricao", novoServico.descricao);
    formData.append("valor", novoServico.valor.toFixed(2));
    formData.append("categoria", novoServico.categoria);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoServico),
      });

      if (response.ok) {
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
      } else {
        console.error("Erro ao salvar serviço.");
      }
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
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

      {isAdmin && (
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
                    {isAdmin && editService === servico.id && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => {
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
                          onClick={() => handleDelete(servico.id)}
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
              />
              <span className="obrigatorio">Campo obrigatório*</span>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                value={novoServico.valor}
                onChange={(e) =>
                  setNovoServico({
                    ...novoServico,
                    valor: parseFloat(e.target.value),
                  })
                }
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
            Salvar
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
                    `http://localhost:8000/clinica/servicos/deletar/${selectedId}`,
                    {
                      method: "DELETE",
                    }
                  );
                  fetchServicos();
                } catch (error) {
                  console.error("Erro ao remover serviço:", error);
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
