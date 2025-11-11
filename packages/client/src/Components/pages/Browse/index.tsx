import PageSelector, { IPage } from "../../molecules/page/PageSelector";
import Rules from "./Rules";
import Space from "./Spaces";

export default function Browse() {
  const pages: IPage[] = [
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