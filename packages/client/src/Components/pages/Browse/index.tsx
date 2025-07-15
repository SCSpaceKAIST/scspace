import Scspace from "./Scspace";
import PageSelector, { IPage } from "../Layout/PageSelector";
import Rules from "./Rules";
import Space from "./Spaces";

export default function Browse() {
  const pages: IPage[] = [
    {
      kor: "공간위",
      eng: "SCSpace",
      preview: (<Scspace />),
      href: "/browse/scspace"
    },
    {
      kor: "공간",
      eng: "Spaces",
      preview: (<Space />),
      href: "/browse/space"
    },
    {
      kor: "세칙",
      eng: "Rules",
      preview: (<Rules />),
      href: "/browse/rules"
    },
  ];
  // { value: "Business", page: <Business /> },

  return (
    <PageSelector
      pages={pages}
    />
  );
};