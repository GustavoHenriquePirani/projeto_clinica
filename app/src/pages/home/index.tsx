import "./index.css";
import "../../pages/global.css"
import { Container, Row, Col } from "react-bootstrap";

export const Home = () => {
  return (
    <Container fluid className="container">
      <Row className="bg-img text-center">
        <Col>
          <h1 className="fs-1">Bem-vindo à Clínica dos Olhos</h1>
        </Col>
      </Row>

     
      <Row className="section">
        <Col xs={12}>
          <h2 className="text-center">Quem Somos</h2>
        </Col>
        <Col xs={12}>
          <p className="custom-justify">
            A Clínica dos Olhos nasceu do compromisso de oferecer um atendimento
            oftalmológico humanizado e de alta qualidade. Fundada em 2001,
            nossa clínica foi idealizada por um grupo de especialistas
            apaixonados pela saúde ocular, que enxergaram a necessidade de um
            espaço onde inovação e cuidado andassem lado a lado. Desde o início,
            buscamos unir tecnologia de ponta a um atendimento personalizado,
            garantindo diagnósticos precisos e tratamentos eficazes para nossos
            pacientes.
          </p>
        </Col>
      </Row>

   
      <Row className="section">
        <Col xs={12}>
          <h2 className="text-center fw-1">Nossa Missão</h2>
        </Col>
        <Col xs={12}>
          <p className="custom-justify">
            Na Clínica dos Olhos, nossa missão é proporcionar atendimento
            oftalmológico de excelência, garantindo a saúde e o bem-estar dos
            seus olhos. Contamos com uma equipe de especialistas altamente
            qualificados e tecnologia de ponta para oferecer diagnósticos
            precisos e tratamentos eficazes. Oferecemos uma ampla gama de
            serviços, incluindo:
          </p>
          <ul className="text-start">
            <li>✅ Consultas oftalmológicas completas</li>
            <li>✅ Exames de visão e diagnóstico de doenças oculares</li>
            <li>✅ Tratamento para catarata, glaucoma e outras condições oftalmológicas</li>
            <li>✅ Cirurgias refrativas (como correção de miopia, hipermetropia e astigmatismo)</li>
            <li>✅ Adaptação de lentes de contato e óculos personalizados</li>
          </ul>
        </Col>
      </Row>

      <Row className="section contact-section">
        <Col xs={12}>
          <h2 className="text-center">Contato</h2>
        </Col>
        <Col xs={12}>
          <p className="custom-justify text-center">
            Entre em contato conosco para agendar sua consulta ou esclarecer dúvidas. Nossa equipe está pronta para atendê-lo!
          </p>
          <ul className="contact-info">
            <li><strong>📍 Endereço:</strong> Av. das Palmeiras, 123 - Centro, Cuiabá - MT</li>
            <li><strong>📞 Telefone:</strong> (65) 99999-9999</li>
            <li><strong>📧 Email:</strong> contato@clinicadosolhos.com</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};
