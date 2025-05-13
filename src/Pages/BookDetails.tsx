import styled from "styled-components";
import "./../App.css";

function BookDetails() {
  const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: #bf4f74;
  `;

  const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
  `;

  return (
    <>
      <Wrapper>
        <Title>BookDetails</Title>
      </Wrapper>
    </>
  );
}

export default BookDetails;
