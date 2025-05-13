import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Input, Empty, Divider } from "antd";
import styled from "styled-components";
import { Link } from "react-router";
import { type Book, getBooks } from "../data/books";
import { useAuth } from "../context/AuthContext";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

const StyledSearch = styled(Search)`
  .ant-btn {
    background-color: #d9d9d9 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.65) !important;

    &:hover {
      background-color: #bfbfbf !important;
      border-color: #bfbfbf !important;
    }
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused,
  .ant-input:focus,
  .ant-input-focused,
  .ant-input-affix-wrapper:hover,
  .ant-input:hover {
    border-color: #d9d9d9 !important;
    box-shadow: 0 0 0 2px rgba(217, 217, 217, 0.2) !important;
  }

  .ant-input-search:focus-within {
    .ant-input-affix-wrapper {
      border-color: #d9d9d9 !important;
      box-shadow: 0 0 0 2px rgba(217, 217, 217, 0.2) !important;
    }
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 32px;
`;

const WelcomeTitle = styled(Title)`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const SearchSection = styled.div`
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const GenreSection = styled.div`
  margin-bottom: 48px;
`;

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
  const [searchQuery, setSearchQuery] = useState("");
  const { username } = useAuth();

  useEffect(() => {
    // Get books from storage
    const allBooks = getBooks();

    // Add genre if not present in your data
    const booksWithGenre = allBooks.map((book) => ({
      ...book,
      genre: book.genre || getGenreForBook(book),
    }));

    setBooks(booksWithGenre);
  }, []);

  // Function to assign genres if they're not in your data model
  const getGenreForBook = (book: Book): string => {
    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();

    if (title.includes("gatsby")) return "Classics";
    if (title.includes("mockingbird")) return "Fiction";
    if (title.includes("1984")) return "Science Fiction";
    if (title.includes("pride")) return "Romance";

    // Default genres based on book ID for demonstration
    return ["Classics", "Fiction", "Science Fiction", "Romance"][book.id % 4];
  };

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  // Group books by genre
  const booksByGenre = filteredBooks.reduce((acc, book) => {
    const genre = book.genre || getGenreForBook(book);
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div>
      <WelcomeSection>
        <WelcomeTitle
          level={2}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          Happy reading, {username}!
        </WelcomeTitle>
      </WelcomeSection>

      <SearchSection>
        <StyledSearch
          placeholder="Search by title or author"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </SearchSection>

      {Object.keys(booksByGenre).length === 0 ? (
        <Empty
          description="No books found matching your search"
          style={{ marginTop: 48 }}
        />
      ) : (
        Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <GenreSection key={genre}>
            <Divider orientation="left">
              <Title level={3}>{genre}</Title>
            </Divider>

            <Row gutter={[24, 24]}>
              {genreBooks.map((book) => (
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
                              <Text ellipsis={{ rows: 2 }}>
                                {book.description}
                              </Text>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Text type="secondary">
                                {book.reviews.length}{" "}
                                {book.reviews.length === 1
                                  ? "review"
                                  : "reviews"}
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
          </GenreSection>
        ))
      )}
    </div>
  );
}

export default Home;
