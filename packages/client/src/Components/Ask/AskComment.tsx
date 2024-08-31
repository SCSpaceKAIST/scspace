import { AskType } from "@depot/types/ask";

interface ShowCommentProps {
  content: AskType;
}

const ShowComment: React.FC<ShowCommentProps> = ({ content }) => {
  return content ? (
    <div>
      <br />
      <article className="blog-details">
        <h4 className="title">문의에 대한 답변입니다.</h4>
        <div className="meta-top" />
        <div className="content">
          <p>{content.comment}</p>
        </div>
      </article>
    </div>
  ) : (
    <div>
      <br />
      <article className="blog-details">
        <h4 className="title">아직 답변이 작성되지 않았습니다.</h4>
      </article>
    </div>
  );
};

export default ShowComment;
