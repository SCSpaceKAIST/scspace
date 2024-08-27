import Link from "next/link";
import React from "react";

export interface PageHeaderProps {
  link_to_prop: string;
  page_name: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ link_to_prop, page_name }) => {
  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h3>FAQ</h3>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href={link_to_prop}>FAQ</Link>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <section>
        <div className="section-header">
          <h2>{page_name}</h2>
          <p>{page_name}</p>
        </div>
        <hr></hr>
      </section>
    </div>
  );
};

export default PageHeader;
