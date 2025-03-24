import { useSpaces } from "@scspace-client/Apis/space/useSpaces";
import { IPassword } from "@scspace-depot/types/password";
import React from "react";

interface PasswordBarProps {
  password: IPassword;
}

const PasswordBar: React.FC<PasswordBarProps> = ({ password }) => {
  const { space } = useSpaces(password.spaceId);

  return (
    <div>
      <div className="password-container">
        <h2>{`${space.name} 비밀번호 : ${password.password}`}</h2>
      </div>
    </div>
  );
};

export default PasswordBar;
