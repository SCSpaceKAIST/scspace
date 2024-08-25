export type PayloadSSO = {
  ku_std_no: string | null;
  kaist_uid: string;
  mail: string;
  ku_employee_number: string | null;
  displayname: string;
  mobile: string;
  ku_kname: string;
  iat: number;
  exp: number;
  iss: 'scspace';
  sub: 'userInfo';
};

// │ {
//     │   ku_std_no: '20210044',
//     │   kaist_uid: '00117354',
//     │   mail: 'gerbera3090@kaist.ac.kr',
//     │   ku_employee_number: null,
//     │   displayname: 'KWON, Hyukwon',
//     │   mobile: '010-9379-3090',
//     │   ku_kname: '권혁원',
//     │   iat: 1724231826,
//     │   exp: 1724663826,
//     │   iss: 'scspace',
//     │   sub: 'userInfo'
//     │ }
