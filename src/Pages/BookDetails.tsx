import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
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
} from "antd";
import styled from "styled-components";
import { type Book, getBook, addReview } from "../data/books";
import { useAuth } from "../context/AuthContext";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const BookContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CoverContainer = styled.div`
  flex: 0 0 300px;

  @media (max-width: 767px) {
    margin: 0 auto;
  }
`;

const BookCover = styled.img`
  width: 100%;
  max-width: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const DetailContainer = styled.div`
  flex: 1;
`;

const ReviewCard = styled(Card)`
  margin-bottom: 16px;
`;

const ReviewForm = styled(Form)`
  margin-top: 24px;
  margin-bottom: 24px;
` as typeof Form;

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoggedIn, username } = useAuth();

  useEffect(() => {
    if (id) {
      const bookData = getBook(parseInt(id));
      if (bookData) {
        setBook(bookData);
      } else {
        message.error("Book not found");
        navigate("/home");
      }
    }
  }, [id, navigate]);

  const handleSubmitReview = (values: { rating: number; comment: string }) => {
    if (!id || !username) return;

    addReview(parseInt(id), {
      username,
      rating: values.rating,
      comment: values.comment,
    });

    // Refresh book data
    const updatedBook = getBook(parseInt(id));
    if (updatedBook) {
      setBook(updatedBook);
      form.resetFields();
      message.success("Review added successfully!");
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button
        type="link"
        onClick={() => navigate("/home")}
        style={{ marginBottom: 16, padding: 0 }}
      >
        ← Back to Books
      </Button>

      <BookContainer>
        <CoverContainer>
          <BookCover src={book.coverUrl} alt={book.title} />
        </CoverContainer>

        <DetailContainer>
          <Title level={2}>{book.title}</Title>
          <Text type="secondary" style={{ fontSize: 18 }}>
            by {book.author}
          </Text>

          <Paragraph style={{ marginTop: 16 }}>{book.description}</Paragraph>

          <Divider orientation="left">Reviews</Divider>

          {isLoggedIn && (
            <ReviewForm<{ rating: number; comment: string }>
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

          {book.reviews.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={book.reviews.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )}
              renderItem={(review) => (
                <ReviewCard>
                  <List.Item.Meta
                    avatar={<Avatar>{review.username[0].toUpperCase()}</Avatar>}
                    title={review.username}
                    description={
                      <>
                        <Rate disabled defaultValue={review.rating} />
                        <div>
                          <Text type="secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </Text>
                        </div>
                      </>
                    }
                  />
                  <Paragraph style={{ margin: "16px 0 0" }}>
                    {review.comment}
                  </Paragraph>
                </ReviewCard>
              )}
            />
          ) : (
            <Empty description="No reviews yet. Be the first to share your thoughts!" />
          )}
        </DetailContainer>
      </BookContainer>
    </div>
  );
}

export default BookDetails;
