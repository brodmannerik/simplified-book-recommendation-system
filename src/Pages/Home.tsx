import { useEffect, useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import styled from "styled-components";
import { Link } from "react-router";
import { type Book, getBooks } from "../data/books";

const { Title, Text } = Typography;

const BookCard = styled(Card)`
  margin-bottom: 24px;
  transition: transform 0.3s;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getBooks());
  }, []);

  return (
    <div>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Browse Books
      </Title>

      <Row gutter={[24, 24]}>
        {books.map((book) => (
          <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
            <Link to={`/book/${book.id}`}>
              <BookCard
                hoverable
                cover={<BookCover alt={book.title} src={book.coverUrl} />}
              >
                <Card.Meta
                  title={book.title}
                  description={
                    <>
                      <Text type="secondary">{book.author}</Text>
                      <div style={{ marginTop: 8 }}>
                        {/* @ts-ignore */}
                        <Text ellipsis={{ rows: 2 }}>{book.description}</Text>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                          {book.reviews.length}{" "}
                          {book.reviews.length === 1 ? "review" : "reviews"}
                        </Text>
                      </div>
                    </>
                  }
                />
              </BookCard>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
