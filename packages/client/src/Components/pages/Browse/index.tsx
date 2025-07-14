import Scspace from "../../organisms/About/Scspace";
import PageSelector, { IPage } from "../Layout/PageSelector";
import Rules from "../../organisms/About/Rules";

export default function Browse() {
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