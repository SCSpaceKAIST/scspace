import { useSpaces } from "@/Hooks/useSpaces";
import { PasswordType } from "@depot/types/password";
import React from "react";

interface PasswordBarProps {
  password: PasswordType;
}

const PasswordView: React.FC<PasswordBarProps> = ({ password }) => {
  const { space } = useSpaces(password.space_id);

  return (
    <div>
      <div className="password-container">
        <h2>{`${space.name} 비밀번호 : ${password.password}`}</h2>
      </div>
    </div>
  );
};

export default PasswordView;
