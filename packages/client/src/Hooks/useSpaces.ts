import { SpaceType } from "@depot/types/space";
import { useEffect, useState } from "react";
import { sendGet } from "./useApi";

export const useSpaces = (id = 0) => {
  const [spaceArray, setSpaceArray] = useState<SpaceType[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [space, setSpace] = useState<SpaceType>({
    space_id: 0,
    name: "",
    name_eng: "",
    space_type: "individual",
  });

  useEffect(() => {
    const getSpaces = async () => {
      const response = await sendGet<SpaceType[]>(`/space/all`);
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
