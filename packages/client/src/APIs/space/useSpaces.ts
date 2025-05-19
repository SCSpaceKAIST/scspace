import { ISpace } from "@scspace-depot/types/space";
import { useEffect, useState } from "react";
import { useQueryApi } from "@scspace-client/Hooks/useApi";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";

export const useSpaces = (id = 0) => {
  const [spaceArray, setSpaceArray] = useState<ISpace[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const { data, isLoading, error, refetch, isError } = useQueryApi<ISpace[]>(
    `/space/all`,
  );
  const [space, setSpace] = useState<ISpace>({
    id: 0,
    nameKr: "",
    nameEn: "",
    spaceType: SpaceTypeEnum.INDIVIDUAL,
  });

  useEffect(() => {
    setSpaceArray(data);
  }, [data]);

  useEffect(() => {
    if (spaceArray) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [spaceArray]);

  useEffect(() => {
    if (spaceArray && id > 0) {
      setSpace(spaceArray[id - 1]);
    }
  }, [id, spaceArray]);

  return { loaded, spaceArray, space };
};
