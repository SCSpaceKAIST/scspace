import { useBoardData } from "@scspace-client/Hooks/useBoardData";
import React, { useState, useEffect } from "react";
import { IPassword, IPasswordValidation } from "@scspace-depot/types/password";
import { IUser } from "@scspace-depot/types/user";
import { useSpaces } from "@scspace-client/APIs/space/useSpaces";
import { useQueryApi } from "@scspace-client/Hooks/useApi";
import PasswordBar from "./PasswordBar";

interface PasswordProps {
  userInfo: IUser;
  forManage?: boolean;
}

const PasswordView: React.FC<PasswordProps> = ({
  userInfo,
  forManage = false,
}) => {
  const { spaceArray } = useSpaces();

  const { data: validationList } = useQueryApi<IPasswordValidation[]>(
    "/password/validSpaces",
    {
      userId: userInfo.id,
    },
  );

  const { list } = useBoardData<IPassword>({
    apiEndpoint: "/api/password/validAll",
  });

  return (
    <div>
      {validationList?.map((val, idx) => {
        if (val.valid) {
          return list.map(ptype => {
            if (ptype.spaceId === val.spaceId) {
              return (
                <PasswordBar password={ptype} key={`key${ptype.spaceId}`} />
              );
            }
            return null; // if 조건이 일치하지 않을 때 아무것도 반환하지 않음
          });
        }
        return null; // if val.valid가 false일 경우 아무것도 반환하지 않음
      }) ?? ""}
    </div>
  );
};

export default PasswordView;
