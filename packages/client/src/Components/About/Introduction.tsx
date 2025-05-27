import Scspace from "./Scspace";
import PageSelector, { IPage } from "../PageSelector/PageSelector";
import Rules from "./Rules";

export default function Introduction() {
  const pages: IPage[] = [
    {
      kor: "공간위",
      eng: "SCSpace",
      preview: (<Scspace />),
      href: "/about/scspace"
    },
    {
      kor: "세칙",
      eng: "Rules",
      preview: (<Rules />),
      href: "/about/rules"
    },
  ];
  // { value: "Business", page: <Business /> },

  return (
    <PageSelector
      pages={pages}
    />
  );
};