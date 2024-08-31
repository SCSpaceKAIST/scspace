import Link from "next/link";

interface BoardPageSelectorProps {
  totalPageNumber: number;
  pageNumber: number;
  setPageNumber: (pageNum: number) => void;
}

const BoardPageSelector: React.FC<BoardPageSelectorProps> = ({
  totalPageNumber,
  pageNumber,
  setPageNumber,
}) => {
  return (
    <section className="blog">
      <div className="blog-pagination">
        <ul className="justify-content-center">
          {[...Array(totalPageNumber)]
            .map((_, i) => i + 1)
            .map((pageNum) => (
              <li
                key={pageNum}
                className={pageNumber === pageNum ? "active" : ""}
                onClick={() => setPageNumber(pageNum)}
              >
                <Link href="#">{pageNum}</Link>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default BoardPageSelector;
