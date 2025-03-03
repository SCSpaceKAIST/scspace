import { useBoardData } from "@/Hooks/useBoardData";
import React, { useState, useEffect } from "react";
import { IPassword, IPasswordValidation } from '@depot/types/password';
import { IUser } from '@depot/types/user';
import { sendGet } from '@/Hooks/useApi';
import PasswordBar from './PasswordBar';
import { useSpaces } from '@/Hooks/useSpaces';

interface PasswordProps {
  userInfo: IUser;
  forManage?: boolean;
}

const PasswordView: React.FC<PasswordProps> = ({
  userInfo,
  forManage = false,
}) => {
  const [validationList, setValidationList] = useState<
    IPasswordValidation[]
  >([]);
  const { spaceArray } = useSpaces();
  useEffect(() => {
    if (forManage) {
      setValidationList(
        spaceArray?.map((space) => ({
          spaceId: space.id,
          valid: true,
        })) || []
      );
    } else {
      sendGet<IPasswordValidation[]>('/password/validSpaces', {
        userId: userInfo.id,
      }).then((response) => {
        if (response) {
          setValidationList(response);
        }
      });
    }
  }, [userInfo, spaceArray, forManage]);

  const { list } = useBoardData<IPassword>({
    apiEndpoint: '/api/password/validAll',
  });

  return (
    <div>
      {validationList.map((val, idx) => {
        if (val.valid) {
          return list.map((ptype) => {
            if (ptype.spaceId === val.spaceId) {
              return (
                <PasswordBar password={ptype} key={`key${ptype.spaceId}`} />
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
