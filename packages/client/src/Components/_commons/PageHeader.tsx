"use client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

export interface PageHeaderProps {
  link_to_prop: string;
  page_name: string;
  sub_name: string;
  parent_name?: string;
}

const LineHeader: React.FC<PageHeaderProps> = ({
  link_to_prop = "",
  page_name,
  sub_name,
}) => {
  const { t } = useTranslation();
  return (
    <section>
      <div className="section-header">
        <h2>{t(page_name)}</h2>
        <p>{t(sub_name)}</p>
      </div>
      <hr></hr>
    </section>
  );
};

const PageHeader: React.FC<PageHeaderProps> = ({
  link_to_prop,
  page_name,
  sub_name,
  parent_name,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <LineHeader
        page_name={page_name}
        sub_name={sub_name}
        link_to_prop=""
      ></LineHeader>
      <div className="breadcrumbs">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h3>{t(page_name)}</h3>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href={link_to_prop}>
                  {t(parent_name ? parent_name : page_name)}
                </Link>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
