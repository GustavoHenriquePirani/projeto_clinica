import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../pages/global.css"

interface Medico {
  id: number;
  nome: string;
  especialidade: string;
  crm: string;
}

export const Equipe = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch("http://localhost:3000/clinica/medicos"); 
        const data = await response.json();
        setMedicos(data);
      } catch (error) {
        console.error("Erro ao buscar os médicos:", error);
      }
    };

    fetchMedicos();
  }, []);

  return (
    <Container className="container mt-4">
      <h2 className="text-center">Nossa Equipe Médica</h2>
      <Row>
        {medicos.map((medico) => (
          <Col key={medico.id} md={4} className="mb-4">
            <Card className="shadow">
              <Card.Body>
                <Card.Title>{medico.nome}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{medico.especialidade}</Card.Subtitle>
                <Card.Text>
                  <strong>CRM:</strong> {medico.crm}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
