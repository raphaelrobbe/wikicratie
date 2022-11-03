import React, { useEffect, useMemo, useState } from 'react';
import './styles/articles.css';
import { Col, Container, ListGroup, Row, Tab } from 'react-bootstrap';
import { AfficheParagraphe } from './AfficheParagraphe';
// import { listeArticles } from './datas/articles/listeArticles';
import { AudiosArticlesWrapper } from './AudiosArticlesWrapper';
import { useArticlesContext } from './contexts/ArticlesContext';
import { ArticleTitreDescription } from './ArticleTitreDescription';
import { usePdfContext } from './contexts/PdfContext';

export const Articles: React.FC = () => {
  const {
    directToArticle,
    articles,
    indexArticleEnCours,
  } = useArticlesContext();
  const {
    pdfGeneration,
  } = usePdfContext();

  const keyArticleDefault = useMemo(() => {
    return articles.length > 0 ? `#${articles[0].numero}` : ``;
  }, [articles]);

  const [key, setKey] = useState(keyArticleDefault);

  useEffect(() => {
    if (indexArticleEnCours < articles.length) {
      setKey(`#${articles[indexArticleEnCours].numero}`)
    }
  }, [
    articles,
    indexArticleEnCours,
  ])

  return (
    <div className="articles">
      <Container>
        {articles.length > 0 &&
          <Tab.Container
            defaultActiveKey={`#${articles[0].numero}`}
            activeKey={key}
          >
            <Row
              className={''}
            >
              <Col
                xl={2}
                className={'d-block d-xl-none affichage-petit-ecran choix-article'}
              >
                {!pdfGeneration && <AudiosArticlesWrapper />}
                <ListGroup>
                  {articles.map((el, i) => {
                    const {
                      titre,
                      description,
                      numero,
                    } = el;
                    return <ListGroup.Item
                      onClick={() => directToArticle({ index: i })}
                      key={`choix-article-${i}`}
                      action href={`#${numero}`}
                      // ref={reftabsRefs[i]}
                    >
                      <ArticleTitreDescription
                        article={el}
                      />
                    </ListGroup.Item>
                  })}
                </ListGroup>
              </Col>
              <Col
                sm={2}
                className={'d-none d-xl-block affichage-grand-ecran choix-article'}
              >
                {!pdfGeneration && <AudiosArticlesWrapper />}
                <ListGroup
                >
                  {articles.map((el, i) => {
                    const {
                      titre,
                      description,
                      numero,
                    } = el;
                    return <ListGroup.Item
                      // id={numero}
                      onClick={() => directToArticle({ index: i })}
                      key={`choix-article-${i}`}
                      action href={`#${numero}`}
                    >
                      <ArticleTitreDescription
                        article={el}
                      />
                    </ListGroup.Item>
                  })}
                </ListGroup>
              </Col>
              <Col
                className={'texte-article'}
              >
                <Tab.Content>
                  {articles.map((el, i) => {
                    const {
                      titre,
                      description,
                      numero,
                      paragraphes,
                    } = el;
                    return <Tab.Pane
                      key={`texte-article-${i}`}
                      eventKey={`#${numero}`}
                    >
                      <ArticleTitreDescription
                        article={el}
                      />
                      {paragraphes.map((p, j) => <AfficheParagraphe
                        key={`para-${j}`}
                        paragraphe={p}
                        diffTime={0}
                      />)}
                    </Tab.Pane>
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        }
      </Container>
    </div>
  );
};
