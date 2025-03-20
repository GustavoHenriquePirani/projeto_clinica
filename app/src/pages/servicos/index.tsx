import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import "../../pages/global.css"

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

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await fetch("http://localhost:3000/clinica/servicos");
        const data = await response.json();
        setServicos(data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  return (
    <Container className="container mt-4">
      <h2 className="text-center mb-4">Nossos Serviços</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {servicos.map((servico) => (
            <Col key={servico.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{servico.name}</Card.Title>
                  <Card.Text>{servico.descricao}</Card.Text>
                  <p>
                    <strong>Categoria:</strong> {servico.categoria}
                  </p>
                  <p>
                    <strong>Valor:</strong> R$ {servico.valor.toFixed(2)}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
