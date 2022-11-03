import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import './styles/FAQ.css';
import { Accordion, Badge, Col, Container, Form, ListGroup, Row, Tab, ToggleButton } from 'react-bootstrap';
import { AfficheParagraphe } from './AfficheParagraphe';
import { listeQuestions } from './datas/FAQ/listeQuestions';
import { getWordWithoutAccents } from './utils/utilString';
import { Paragraphe } from '../../common/types/typesArticles';
import { DOMPurifySanitize } from './utils/security/secureDOM';

type ChercherDans = 'titre' | 'texte';

export const FAQ: React.FC = () => {
  const [texteRecherche, setTexteRecherche] = useState('');
  const [chercherDans, setChercherDans] = useState<ChercherDans[]>(['titre', 'texte']);
  const [chercherDansTexteChecked, setChercherDansTexteChecked] = useState(true);
  const [chercherDansTitreChecked, setChercherDansTitreChecked] = useState(true);

  useEffect(() => {
    setChercherDans(etat => {
      const ret: ChercherDans[] = [];
      if (chercherDansTexteChecked) {
        ret.push('texte');
      }
      if (chercherDansTitreChecked) {
        ret.push('titre');
      }
      return ret;
    });
  }, [
    chercherDansTexteChecked,
    chercherDansTitreChecked,
  ]);


  // const [key, setKey] = useState(`#${listeArticles[0].numero}`);

  // useEffect(() => {
  //   setKey(`#${listeArticles[indexArticleEnCours].numero}`)
  // }, [
  //   indexArticleEnCours,
  // ])

  const filtreRecherche = useCallback((para: string | JSX.Element | Paragraphe[], _texteRecherche: string): boolean => {
    if (Array.isArray(para)) {
      let _ret = false;
      for (let i = 0; i < para.length; i += 1) {
        _ret = _ret || filtreRecherche(para[i].texte, _texteRecherche);
      }
      return _ret;
    } else {
      let _texte: string;
      if (typeof para === 'string') {
        _texte = getWordWithoutAccents(para.toLocaleLowerCase());
      } else {
        _texte = getWordWithoutAccents(renderToStaticMarkup(para).toLocaleLowerCase());
      }
      return _texte.includes(getWordWithoutAccents(_texteRecherche.toLocaleLowerCase()));
    }
  }, []);

  const listeQuestionsFiltree = useMemo(() => {
    const ret = listeQuestions.filter(quest => {
      const {
        titre,
        texte,
      } = quest;
      let _ret = false;
      if (chercherDans.includes('texte')) {
        _ret = _ret || filtreRecherche(texte, texteRecherche);
      }
      if (chercherDans.includes('titre')) {
        _ret = _ret || filtreRecherche(titre, texteRecherche);
      }
      return _ret;
    })
    return ret;
  }, [
    filtreRecherche,
    chercherDans,
    texteRecherche,
  ])

  return (
    <div className="FAQ">
      <Container>
        <Row
          // className={'d-block d-sm-none recherche'}
          className={'recherche w-100'}
        >
          <Row
            xs={1}
            sm={2}
          >
            <Col
              sm={8}
            >
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Rechercher..."
                  aria-label="Search"
                  onChange={(val) => setTexteRecherche(DOMPurifySanitize(val.currentTarget.value))}
                />
              </Form>
            </Col>
            <Col
              xs={17}
              sm={4}
              >
              <Row
                className={'chercher-dans'}
                xs={15}
                sm={3}
              >
                <Col
                  xs={4}
                >
                  {`Chercher dans...`}
                </Col>
                <Col
                  xs={4}
                >
                  <ToggleButton
                    // as={Badge}
                    className="mb-2 btn-sm"
                    id="toggle-check-titre"
                    type="checkbox"
                    variant="outline-primary"
                    checked={chercherDansTitreChecked}
                    value="2"
                    onChange={(e) => setChercherDansTitreChecked(e => !e)}
                  >
                    {`le titre`}
                  </ToggleButton>
                </Col>
                <Col
                  xs={4}
                >
                  <ToggleButton

                    // as={Badge}
                    className="toggle-chercher-dans mb-2 btn-sm"
                    id="toggle-check-texte"
                    type="checkbox"
                    variant="outline-primary"
                    checked={chercherDansTexteChecked}
                    value="1"
                    onChange={(e) => setChercherDansTexteChecked(e => !e)}
                  >
                    {`le texte`}
                  </ToggleButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </Row>
        <Accordion
        // className={([] as string[])
        //   .concat(Array.isArray(texte) ? [] : 'dernier-niveau')
        //   .concat(highlighted ? 'highlighted' : [])
        //   .join(' ')
        // }
        // defaultActiveKey="0"
        >
          {listeQuestionsFiltree.map((el, i) => {
            const {
              titre,
              texte,
            } = el;
            return (
              <Accordion.Item
                key={`question-FAQ-${i}`}
                eventKey={`${i}`}
              >
                <Accordion.Header>{titre}</Accordion.Header>
                <Accordion.Body>
                  {texte.map((p, j) => <AfficheParagraphe
                    key={`para-${j}`}
                    paragraphe={p}
                    diffTime={0}
                  />)}

                </Accordion.Body>
              </Accordion.Item>
            )
          })
          }
        </Accordion>
      </Container>
    </div>
  );
};
