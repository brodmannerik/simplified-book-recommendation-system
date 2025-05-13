import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Typography,
  Rate,
  Button,
  Form,
  Input,
  Divider,
  List,
  Avatar,
  Empty,
  message,
  Spin,
} from "antd";
import styled from "styled-components";
import { type Book, type Review } from "../data/books";
import { fetchBookById, addReview } from "../api/bookApi";
import { useAuth } from "../context/AuthContext";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BookContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BookHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CoverContainer = styled.div`
  flex: 0 0 250px;
  margin-right: 24px;

  img {
    width: 100%;
    max-height: 375px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const BookInfo = styled.div`
  flex: 1;
`;

const ReviewForm = styled(Form)`
  margin-bottom: 32px;
`;

const ReviewsList = styled(List)`
  margin-top: 16px;
`;

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoggedIn, username } = useAuth();

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const bookData = await fetchBookById(id);

        console.log("Fetched book data:", bookData);

        if (bookData) {
          setBook(bookData);
          setError(null);
        } else {
          setError("Book not found");
        }
      } catch (err) {
        console.error("Error loading book:", err);
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleSubmitReview = async (values: {
    rating: number;
    comment: string;
  }) => {
    if (!id || !username || !book) return;

    try {
      await addReview(id, {
        username,
        rating: values.rating,
        comment: values.comment,
      });

      // Refresh book data
      const updatedBook = await fetchBookById(id);
      if (updatedBook) {
        setBook(updatedBook);
        form.resetFields();
        message.success("Review added successfully!");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      message.error("Failed to add review");
    }
  };

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" tip="Loading book details..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <Empty
        description={error || "Book not found"}
        style={{ margin: "50px 0" }}
      >
        <Button type="primary" onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </Empty>
    );
  }

  return (
    <BookContainer>
      <Button
        type="link"
        onClick={() => navigate("/home")}
        style={{ marginBottom: 16 }}
      >
        ← Back to Browse
      </Button>

      <DetailContainer>
        <BookHeader>
          <CoverContainer>
            <img src={book.coverUrl} alt={book.title} />
          </CoverContainer>

          <BookInfo>
            <Title level={2}>{book.title}</Title>
            <Text type="secondary" style={{ fontSize: 18 }}>
              by {book.author}
            </Text>

            <div style={{ margin: "16px 0" }}>
              <Rate disabled allowHalf value={getAverageRating(book.reviews)} />
              <Text style={{ marginLeft: 8 }}>
                {book.reviews.length > 0
                  ? `${getAverageRating(book.reviews).toFixed(1)} · ${
                      book.reviews.length
                    } review${book.reviews.length > 1 ? "s" : ""}`
                  : "No reviews yet"}
              </Text>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div>
              <Text strong>Genre: </Text>
              <Text>{book.genre}</Text>
            </div>

            <Paragraph style={{ marginTop: 16 }}>{book.description}</Paragraph>
          </BookInfo>
        </BookHeader>

        <Divider orientation="left">Reviews</Divider>

        {isLoggedIn && (
          <ReviewForm
            form={form}
            // @ts-ignore
            onFinish={handleSubmitReview}
            layout="vertical"
          >
            <Form.Item
              name="rating"
              label="Your Rating"
              rules={[{ required: true, message: "Please rate the book" }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Your Review"
              rules={[{ required: true, message: "Please write a review" }]}
            >
              <TextArea
                rows={4}
                placeholder="Share your thoughts about this book..."
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </Form.Item>
          </ReviewForm>
        )}

        {book.reviews.length > 0 ? (
          <ReviewsList
            itemLayout="horizontal"
            dataSource={book.reviews}
            // @ts-ignore
            renderItem={(review: Review) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar size="large">
                      {review.username.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div>
                      <span>{review.username}</span>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        style={{ marginLeft: 8, fontSize: 14 }}
                      />
                    </div>
                  }
                  description={
                    <>
                      <Paragraph>{review.comment}</Paragraph>
                      <Text type="secondary">
                        {new Date(review.date).toLocaleDateString()}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No reviews yet. Be the first to review this book!" />
        )}
      </DetailContainer>
    </BookContainer>
  );
}

export default BookDetails;
