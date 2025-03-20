import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./index.css"; 

export const CustomNavbar = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
       
        <Navbar.Brand href="#" className="navbar-brand fs-3">
          Clínica dos Olhos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> 
          <Nav.Link as={Link} to="/"  className={location.pathname === "/" ? "active-link" : ""}>Home</Nav.Link>
            <Nav.Link as={Link} to="/servicos" className={location.pathname === "/servicos" ? "active-link" : ""}>Serviços</Nav.Link>
            <Nav.Link as={Link} to="/equipe" className={location.pathname === "/equipe" ? "active-link" : ""}>Equipe</Nav.Link>
            <Nav.Link as={Link} to="/login" className={location.pathname === "/login" ? "active-link" : ""}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
