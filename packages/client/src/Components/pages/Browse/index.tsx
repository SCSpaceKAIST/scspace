import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import Archive from "./Archive";
import Rules from "./Rules";
import Space from "./Spaces";

export default function Browse() {
  const pages: IPage[] = [
    {
      kor: "자료실",
      eng: "Archive",
      preview: (<Archive />),
      href: "/browse/archive"
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

  return (
    <PageSelector
      pages={pages}
    />
  );
};