import React from "react"
import { Card } from "react-bootstrap"
import { LinkContainer } from 'react-router-bootstrap';
import { prefixeUrl } from "./datas/paths";

interface CustomCardProps {
  cardTitle: string;
  cardText?: string;
  // pathLabel: string;
  path: string;
}
export const CustomCard: React.FC<CustomCardProps> = ({
  cardText,
  cardTitle,
  path,
  // pathLabel,
}) => {
  return (
    <LinkContainer to={path}>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={`${prefixeUrl}/logo512.png`} />
        <Card.Body>
          <Card.Title>{cardTitle}</Card.Title>
          {cardText &&
            <Card.Text>
              {cardText}
            </Card.Text>
          }
        </Card.Body>
        {/* <ListGroup className="list-group-flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup> */}
        {/* {path && pathLabel &&
        <Card.Body>
        <Card.Link href={path}>{pathLabel}</Card.Link>
        </Card.Body>
      } */}
      </Card>
    </LinkContainer>
  )
};