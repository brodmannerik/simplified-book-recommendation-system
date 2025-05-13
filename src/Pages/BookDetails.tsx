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
import { type Book } from "../data/books";
import { fetchBookById } from "../api/bookApi";
import { useAuth } from "../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addRating,
  selectRatingsByBookId,
  selectAverageRating,
  type Rating,
} from "../store/ratingsSlice";

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

  // Redux hooks
  const dispatch = useAppDispatch();
  const bookRatings = useAppSelector((state) =>
    id ? selectRatingsByBookId(state, id) : []
  );
  const averageRating = useAppSelector((state) =>
    id ? selectAverageRating(state, id) : 0
  );

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const bookData = await fetchBookById(id);

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
      // Add rating to Redux store
      dispatch(
        addRating({
          bookId: id,
          username,
          rating: values.rating,
          comment: values.comment,
          date: new Date().toISOString(),
        })
      );

      // Reset form and show success message
      form.resetFields();
      message.success("Review added successfully!");
    } catch (err) {
      console.error("Error adding review:", err);
      message.error("Failed to add review");
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large">
          {/* Use the nest pattern instead of the tip prop */}
          <div style={{ padding: "50px", textAlign: "center", opacity: 0 }}>
            Loading book details...
          </div>
        </Spin>
      </div>
    );
  }

  // For the error state Empty component
  if (error || !book) {
    return (
      <Empty
        image=""
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
              <Rate disabled allowHalf value={averageRating} />
              <Text style={{ marginLeft: 8 }}>
                {bookRatings.length > 0
                  ? `${averageRating.toFixed(1)} · ${
                      bookRatings.length
                    } review${bookRatings.length > 1 ? "s" : ""}`
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

        {bookRatings.length > 0 ? (
          <ReviewsList
            itemLayout="horizontal"
            dataSource={bookRatings}
            renderItem={(review: Rating) => (
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
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                marginBottom: "16px",
                fontSize: "16px",
                color: "rgba(0, 0, 0, 0.45)",
              }}
            >
              No reviews yet. Be the first to review this book!
            </div>
          </div>
        )}
      </DetailContainer>
    </BookContainer>
  );
}

export default BookDetails;
