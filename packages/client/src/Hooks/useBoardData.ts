import { useState, useEffect } from "react";
import axios from "axios";
import { useLoginCheck } from "@/Hooks/useLoginCheck";

// T는 제네릭 타입으로, 컴포넌트마다 다를 수 있는 데이터 타입을 나타냅니다.
// EX: AskType, FAQType,
export const useBoardData = <T extends { time_post: string | Date }>({
  apiEndpoint,
  initialPageNumber = 1,
  itemsPerPage = 10,
}: {
  apiEndpoint: string;
  initialPageNumber?: number;
  itemsPerPage?: number;
}) => {
  const { login, userInfo } = useLoginCheck();

  const [list, setList] = useState<T[]>([]);
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const [totalPageNumber, setTotalPageNumber] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(apiEndpoint);
      const sortedData = res.data.sort(
        (a: T, b: T) =>
          new Date(b.time_post).getTime() - new Date(a.time_post).getTime()
      );
      setList(sortedData);
      setTotalPageNumber(Math.ceil(sortedData.length / itemsPerPage));
    };

    fetchData();
  }, [apiEndpoint, login]);

  return {
    list,
    pageNumber,
    totalPageNumber,
    setPageNumber,
    login,
    userInfo,
  };
};
