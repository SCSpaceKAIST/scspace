import { useBoardData } from "@/Hooks/useBoardData";
import React, { useState, useEffect } from "react";
import { PasswordType, PasswordValidationType } from "@depot/types/password";
import { UserType } from "@depot/types/user";
import { sendGet } from "@/Hooks/useApi";
import PasswordBar from "./PasswordBar";
import { useSpaces } from "@/Hooks/useSpaces";

interface PasswordProps {
  userInfo: UserType;
  forManage?: boolean;
}

const PasswordView: React.FC<PasswordProps> = ({
  userInfo,
  forManage = false,
}) => {
  const [validationList, setValidationList] = useState<
    PasswordValidationType[]
  >([]);
  const { spaceArray } = useSpaces();
  useEffect(() => {
    if (forManage) {
      setValidationList(
        spaceArray?.map((space) => ({
          space_id: space.space_id,
          valid: true,
        })) || []
      );
    } else {
      sendGet<PasswordValidationType[]>("/password/validSpaces", {
        user_id: userInfo.user_id,
      }).then((response) => {
        if (response) {
          setValidationList(response);
        }
      });
    }
  }, [userInfo, spaceArray, forManage]);

  const { list } = useBoardData<PasswordType>({
    apiEndpoint: "/api/password/validAll",
  });

  return (
    <div>
      {validationList.map((val, idx) => {
        if (val.valid) {
          return list.map((ptype) => {
            if (ptype.space_id === val.space_id) {
              return (
                <PasswordBar password={ptype} key={`key${ptype.space_id}`} />
              );
            }
            return null; // if 조건이 일치하지 않을 때 아무것도 반환하지 않음
          });
        }
        return null; // if val.valid가 false일 경우 아무것도 반환하지 않음
      })}
    </div>
  );
};

export default PasswordView;
