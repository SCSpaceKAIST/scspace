import { ISpace } from "@scspace-depot/types/space";
import { useEffect, useState } from "react";
import { sendGet } from "./useApi";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";

export const useSpaces = (id = 0) => {
  const [spaceArray, setSpaceArray] = useState<ISpace[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [space, setSpace] = useState<ISpace>({
    id: 0,
    name: "",
    nameEng: "",
    spaceType: SpaceTypeEnum.INDIVIDUAL,
  });

  useEffect(() => {
    const getSpaces = async () => {
      const response = await sendGet<ISpace[]>(`/space/all`);
      setSpaceArray(response);
    };
    getSpaces();
  }, []);

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
