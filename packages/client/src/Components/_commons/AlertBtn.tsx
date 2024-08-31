interface AlertBtnProps {
  ob: any;
}

const AlertBtn: React.FC<AlertBtnProps> = ({ ob }) => {
  //테스트용 버튼. ob에 원하는 객체를 입력하고 넣으면 원하는 것을 alert 해주는 버튼을 만들어줌.

  return (
    <button
      onClick={() => {
        alert(JSON.stringify(ob));
      }}
    >
      CLICK ME
    </button>
  );
};

export default AlertBtn;
