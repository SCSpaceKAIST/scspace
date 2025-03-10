export interface UserSSOType2025 {
    kaist_uid: string; // KAIST UID
    user_nm: string; // 한글이름
    user_eng_nm: string; // 영문 이름
    email: string; // KAIST 이메일 주소
    user_id: string; // 사용자 아이디
    emp_no: string; // 사번
    std_no: string; // 학번
  }
  
  export interface UserSSOType2022 {
    ku_std_no: string | null;
    kaist_uid: string;
    mail: string;
    ku_employee_number: string | null;
    displayname: string;
    mobile: string;
    ku_kname: string;
  }
  