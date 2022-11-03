import React from 'react';
// import logo from './logo.svg';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { pathArticles, pathFAQ, pathLexique } from '../datas/paths';

export const GeneralNavBar: React.FC = () => {
  return (
    <div
      className="general-navbar"
    >
      <Container>
      <Navbar collapseOnSelect expand="lg">
          <Navbar.Brand as={Link} to={'/'}>
            <img
              src={`/logo512.png`}
              width="40"
              height="40"
              className="d-inline-block align-top"
              alt="CPT logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link as={Link} to={'/'}>Accueil</Nav.Link> */}
              <Nav.Link as={Link} href={pathArticles} to={pathArticles}>Articles</Nav.Link>
              <Nav.Link as={Link} href={pathLexique} to={pathLexique}>Lexique</Nav.Link>
              <Nav.Link as={Link} href={pathFAQ} to={pathFAQ}>FAQ</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
      </Navbar>
        </Container>
    </div>
  );
};
