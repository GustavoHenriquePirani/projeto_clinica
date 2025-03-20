import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Modal, Form } from "react-bootstrap";
import "../../pages/global.css";
import "./index.css";

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
  const [hoveredServico, setHoveredServico] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServico, setNewServico] = useState<Servico>({
    id: 0,
    name: "",
    descricao: "",
    valor: 0,
    categoria: "",
  });

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const response = await fetch("http://localhost:8000/clinica/servicos");
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateServico = async () => {
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:8000/clinica/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newServico),
      });
  
      if (response.ok) {
        const createdServico = await response.json();
        setServicos((prev) => [...prev, createdServico]); // Atualiza a lista
        setShowCreateModal(false);
      } else {
        console.error("Erro ao criar serviço.");
      }
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const response = await fetch(`http://localhost:8000/clinica/servicos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServicos((prev) => prev.filter((servico) => servico.id !== id)); 
      } else {
        console.error("Erro ao excluir serviço.");
      }
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  };

  const handleEdit = (servico: Servico) => {
    setSelectedServico(servico);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedServico) return;

    try {
      const response = await fetch(`http://localhost:8000/clinica/servicos/${selectedServico.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedServico),
      });

      if (response.ok) {
        setServicos((prev) =>
          prev.map((s) => (s.id === selectedServico.id ? selectedServico : s))
        );
        setShowEditModal(false);
      } else {
        console.error("Erro ao atualizar serviço.");
      }
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
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

      <Button variant="success" className="mb-3" onClick={() => setShowCreateModal(true)}>
  Criar Novo Serviço
</Button>


      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {servicos.map((servico) => (
            <Col key={servico.id} xs={12} md={6} lg={4} className="mb-4 text-center">
              <Card
                className="shadow-sm position-relative card-fixo"
                onMouseEnter={() => setHoveredServico(servico.id)}
                onMouseLeave={() => setHoveredServico(null)}
              >
                <Card.Body>
                  <Card.Title>{servico.name}</Card.Title>
                  <Card.Text>{servico.descricao}</Card.Text>
                  <p>
                    <strong>Categoria:</strong> {servico.categoria}
                  </p>
                  <p>
                    <strong>Valor:</strong> R$ {servico.valor.toFixed(2)}
                  </p>

                  {hoveredServico === servico.id && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <Button variant="warning" size="sm" onClick={() => handleEdit(servico)}>
                        ✏️ Editar
                      </Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(servico.id)}>
                        🗑️ Excluir
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal de Edição */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Serviço</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedServico && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedServico.name}
                  onChange={(e) =>
                    setSelectedServico({ ...selectedServico, name: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  value={selectedServico.descricao}
                  onChange={(e) =>
                    setSelectedServico({ ...selectedServico, descricao: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Valor</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedServico.valor}
                  onChange={(e) =>
                    setSelectedServico({ ...selectedServico, valor: parseFloat(e.target.value) })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedServico.categoria}
                  onChange={(e) =>
                    setSelectedServico({ ...selectedServico, categoria: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={!selectedServico || !isValidServico(selectedServico)}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Criar Novo Serviço</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="name">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          value={newServico.name}
          onChange={(e) => setNewServico({ ...newServico, name: e.target.value })}
        />
      </Form.Group>

      <Form.Group controlId="descricao">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={newServico.descricao}
          onChange={(e) => setNewServico({ ...newServico, descricao: e.target.value })}
        />
      </Form.Group>

      <Form.Group controlId="valor">
        <Form.Label>Valor</Form.Label>
        <Form.Control
          type="number"
          value={newServico.valor}
          onChange={(e) => setNewServico({ ...newServico, valor: parseFloat(e.target.value) })}
        />
      </Form.Group>

      <Form.Group controlId="categoria">
        <Form.Label>Categoria</Form.Label>
        <Form.Control
          type="text"
          value={newServico.categoria}
          onChange={(e) => setNewServico({ ...newServico, categoria: e.target.value })}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
      Cancelar
    </Button>
    <Button variant="success" onClick={handleCreateServico} disabled={!isValidServico(newServico) || loading}>
      {loading ? "Criando..." : "Criar"}
    </Button>
  </Modal.Footer>
</Modal>
    </Container>
  );
};


