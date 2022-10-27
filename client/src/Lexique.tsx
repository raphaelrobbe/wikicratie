import React, { useEffect, useMemo, useState } from 'react';
import './styles/lexique.css';
import { Card, Container, Form, ListGroup, Row, Tab } from 'react-bootstrap';
import { getLexiqueByLetter, glossaire } from './datas/lexique/lexique';
import { getWordWithoutAccents } from './utils/utilString';

export const Lexique: React.FC = () => {
  const [texteRecherche, setTexteRecherche] = useState('');

  const lexique = useMemo(() => {
    return getLexiqueByLetter();
  }, []);

  const availableLetters = useMemo(() => {
    return Object.keys(lexique);
  }, [lexique]);

  return (
    <div className="lexique">
      <Container>
        {availableLetters.length > 0 &&
          <Tab.Container
            defaultActiveKey={`#${availableLetters[0]}`}
          >
            <Row
              className={'d-block d-sm-none recherche'}
            >
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Rechercher..."
                  aria-label="Search"
                  onChange={(val) => setTexteRecherche(val.currentTarget.value)}
                />
              </Form>
            </Row>
            <Row
              className={'d-block d-sm-none liste-mots-petit-ecran'}
            >
              {glossaire
                .filter(motL => motL.matchingWords.map(m => getWordWithoutAccents(m.toLocaleLowerCase()))
                  .join('    ')
                  .includes(getWordWithoutAccents(texteRecherche.toLocaleLowerCase())))
                .map((mot, indexMot) => {
                  return <Card
                    key={`mot-${indexMot}`}
                    // border="light"
                    bg="light"
                  // style={{ width: '18rem' }}
                  >
                    {/* <Card.Header>{mot.wordLabel}</Card.Header> */}
                    <Card.Body>
                      <Card.Title>{mot.wordLabel}</Card.Title>
                      <Card.Text as={'div'}>
                        {mot.definition}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                })}
            </Row>
            <Row
              className={'d-none d-sm-block choix-lettre-grand-ecran'}
            >
              <ListGroup horizontal
              >
                {availableLetters.map((el, i) => {
                  return <ListGroup.Item
                    key={`categorie-mots-lettre-${el}`}
                    action href={`#${el}`}
                  >
                    {el.toLocaleUpperCase()}
                  </ListGroup.Item>
                })}
              </ListGroup>
            </Row>
            <Row
              className={'d-none d-sm-block'}
            >
              <Tab.Content>
                {availableLetters.map((el, i) => {
                  const listeMots = lexique[el];
                  return <Tab.Pane
                    key={`liste-mots-lettre-${el}`}
                    eventKey={`#${el}`}
                  >
                    {listeMots.map((mot, indexMot) => {
                      return <Card
                        key={`mot-${indexMot}`}
                        // border="light"
                        bg="light"
                      // style={{ width: '18rem' }}
                      >
                        {/* <Card.Header>{mot.wordLabel}</Card.Header> */}
                        <Card.Body>
                          <Card.Title>{mot.wordLabel}</Card.Title>
                          <Card.Text as={'div'}>
                            {mot.definition}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    })}
                  </Tab.Pane>
                })}
              </Tab.Content>
            </Row>
          </Tab.Container>
        }
      </Container>
    </div>
  );
};