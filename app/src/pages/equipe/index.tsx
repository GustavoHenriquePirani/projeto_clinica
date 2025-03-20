import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import "../../pages/global.css";
import "./index.css";

interface Medico {
  id: number;
  name: string;
  crm: string;
  email: String,
  descricao: string;
  fotoPerfil: Blob;
}

export const Equipe = () => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [imagens, setImagens] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch("http://localhost:8000/clinica/medicos");
        const data = await response.json();
        setMedicos(data);
        const novasImagens: { [key: number]: string } = {};
        await Promise.all(
          data.map(async (medico: Medico) => {
            try {
              const imagemResponse = await fetch(`http://localhost:8000/clinica/medicos/${medico.id}/foto`);
              if (imagemResponse.ok) {
                const blob = await imagemResponse.blob();
                novasImagens[medico.id] = URL.createObjectURL(blob);
              }
            } catch (error) {
              console.error(`Erro ao carregar imagem do médico ${medico.id}:`, error);
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

    fetchMedicos();
  }, []);

  return (
    <Container className="container">
      <Row className="bg-img-equipe text-center">
        <Col>
          <h1 className="fs-1">Nossa Equipe</h1>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {medicos.map((medico) => (
            <Col key={medico.id} md={4} className="mb-4">
              <Card className="shadow text-center">
                {imagens[medico.id] ? (
                  <Card.Img
                    src={imagens[medico.id]}
                    alt={`Foto de ${medico.name}`}
                    className="foto-perfil"
                  />
                ) : (
                  <Card.Img 
                  src="/imagens/avatar.png"
                  alt={`Foto de ${medico.name}`}
                  className="foto-perfil"/>
                )}
                <Card.Body>
                  <Card.Title className="nome-medico">{medico.name}</Card.Title>
                  <Card.Subtitle className="info-medico">CRM: {medico.crm}</Card.Subtitle>
                  <Card.Text className="info-medico text-muted">{medico.descricao}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};