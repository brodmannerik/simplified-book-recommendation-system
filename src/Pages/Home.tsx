import { useEffect, useState, useRef } from "react";
import { Card, Typography, Input, Empty, Divider, Spin, Button } from "antd";
import styled from "styled-components";
import { Link } from "react-router";
import { type Book } from "../data/books";
import { fetchAllCategoryBooks, categories } from "../api/bookApi";
import { useAuth } from "../context/AuthContext";
import { SearchOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAppSelector } from "../store/hooks";

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
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }

  /* Override the default Ant Design card shadow */
  &.ant-card-hoverable:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

// Add these new styled components for horizontal scrolling
const ScrollableRow = styled.div`
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
  padding: 10px 0;
`;

const ScrollButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
`;

const BookColumn = styled.div`
  flex: 0 0 auto;
  width: 250px;
  padding: 0 12px;
  transition: transform 0.3s;
`;

function Home() {
  const [categoryBooks, setCategoryBooks] = useState<Record<string, Book[]>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useAuth();

  // Create refs for each category row for scrolling
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const books = await fetchAllCategoryBooks();
        setCategoryBooks(books);
        setError(null);
      } catch (err) {
        console.error("Error loading books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Handle scroll for a category row
  const handleScroll = (direction: "left" | "right", category: string) => {
    const row = rowRefs.current[category];
    if (!row) return;

    const scrollAmount = 800; // Adjust based on how much you want to scroll
    const newPosition =
      direction === "left"
        ? row.scrollLeft - scrollAmount
        : row.scrollLeft + scrollAmount;

    row.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Get all ratings from Redux
  const allRatings = useAppSelector((state) => state.ratings.ratings);

  // Function to count ratings for a specific book
  const getBookRatingsCount = (bookId: string) => {
    return allRatings.filter((rating) => rating.bookId === bookId).length;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" tip="Loading books..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Title level={3}>Error</Title>
        <Text type="danger">{error}</Text>
      </div>
    );
  }

  // Filter books based on search query
  const filteredCategories = Object.entries(categoryBooks).reduce(
    (acc, [category, books]) => {
      if (!searchQuery) {
        acc[category] = books;
        return acc;
      }

      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (filtered.length > 0) {
        acc[category] = filtered;
      }

      return acc;
    },
    {} as Record<string, Book[]>
  );

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

      {Object.keys(filteredCategories).length === 0 ? (
        <Empty
          description="No books found matching your search"
          style={{ marginTop: 48 }}
        />
      ) : (
        // Display each category in order
        categories.map((category) => {
          const books = filteredCategories[category];
          if (!books || books.length === 0) return null;

          return (
            <GenreSection key={category}>
              <Divider orientation="left">
                <Title level={3}>{category}</Title>
              </Divider>

              <div style={{ position: "relative" }}>
                <ScrollButton
                  className="left"
                  icon={<LeftOutlined />}
                  shape="circle"
                  onClick={() => handleScroll("left", category)}
                />

                {/* @ts-ignore */}
                <ScrollableRow ref={(el) => (rowRefs.current[category] = el)}>
                  {books.map((book) => {
                    // Get ratings count for this book
                    const ratingsCount = getBookRatingsCount(book.id);

                    return (
                      <BookColumn key={book.id}>
                        <Link to={`/book/${book.id}`}>
                          <BookCard
                            hoverable
                            cover={
                              <BookCover alt={book.title} src={book.coverUrl} />
                            }
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
                                      {ratingsCount}{" "}
                                      {ratingsCount === 1
                                        ? "review"
                                        : "reviews"}
                                    </Text>
                                  </div>
                                </>
                              }
                            />
                          </BookCard>
                        </Link>
                      </BookColumn>
                    );
                  })}
                </ScrollableRow>

                <ScrollButton
                  className="right"
                  icon={<RightOutlined />}
                  shape="circle"
                  onClick={() => handleScroll("right", category)}
                />
              </div>
            </GenreSection>
          );
        })
      )}
    </div>
  );
}

export default Home;
