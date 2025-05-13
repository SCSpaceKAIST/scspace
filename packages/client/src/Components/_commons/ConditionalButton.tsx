import Link from "next/link";

interface ConditionalButtonProps {
  condition: boolean;
  onClick?: () => void;
  btnLink?: string;
  className?: string;
  children: React.ReactNode;
}

const ConditionalButton: React.FC<ConditionalButtonProps> = ({
  condition,
  onClick,
  btnLink = "",
  className = "modalButton1",
  children,
}) => {
  return (
    <div className="text-end">
      {condition ? (
        onClick ? (
          <button type="button" className={className} onClick={onClick}>
            {children}
          </button>
        ) : (
          <button type="button" className={className}>
            <Link href={btnLink}>{children}</Link>
          </button> // onClick이 없을 경우 children만 렌더링
        )
      ) : (
        <div />
      )}
    </div>
  );
};

export default ConditionalButton;
