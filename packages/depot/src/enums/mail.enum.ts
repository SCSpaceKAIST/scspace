import { OrganizationStatusEnum } from "./organization.enum";


const DEFAULT_EMOJI_RESERVATION = '📅'     //reservation icon
const DEFAULT_EMOJI_FAIL = '❌'     //fail icon

export const OrgStatusMeta = {
    [OrganizationStatusEnum.REGISTER_REQUEST]: {
        color: '#17a2b8',
        emoji: '⏳',
        header: {
            kr: '조직 등록 요청 접수',
            en: 'Organization registration request received'
        },
        body: {
            kr: '조직 등록 요청이 접수되었습니다. 관리자의 승인을 기다려 주세요.',
            en: 'Your organization registration request has been received. Please wait for approval.'
        },

        benefits: [],
    },

    [OrganizationStatusEnum.REGISTERED]: {
        color: '#007bff',
        emoji: '📝',
        header: {
            kr: '조직 등록 완료',
            en: 'Organization registered'
        },
        body: {
            kr: '조직 등록이 완료되었습니다.',
            en: 'Organization registration is complete.'
        },
        benefits: [
            {
                kr: '공간 예약 신청이 가능합니다.',
                en: 'You can apply for spaces reservations.'
            }
        ],
    },

    [OrganizationStatusEnum.VERIFY_REQUEST]: {
        color: '#c99700ff',
        emoji: '🔍',
        header: {
            kr: '조직 인증 심사 중',
            en: 'Organization verification in progress'
        },
        body: {
            kr: '조직 인증을 위해 검토 중입니다. 심사 완료까지 기다려 주세요.',
            en: 'We are reviewing the organization you registered verification. Please wait for the review to complete.'
        },
        benefits: [],
    },

    [OrganizationStatusEnum.VERIFIED]: {
        color: '#28a745',
        emoji: '🎉',
        header: {
            kr: '조직 인증 승인 완료',
            en: 'Organization verification approved'
        },
        body: {
            kr: '축하합니다! 조직 인증이 승인되었습니다.',
            en: 'Congratulations! Your organization verification has been approved.'
        },
        benefits: [
            {
                kr: '세미나실 정기예약을 신청할 수 있습니다.',
                en: 'You can apply for recurring seminar room reservations.'
            },
            {
                kr: '공연집중기간 추첨에 참여할 수 있습니다.',
                en: 'You can participate in the Performance-Intensive lottery.'
            }
        ],
    },

    [OrganizationStatusEnum.REJECTED]: {
        color: '#dc3545',
        emoji: DEFAULT_EMOJI_FAIL,
        header: {
            kr: '조직 인증이 반려되었습니다',
            en: 'Organization verification rejected'
        },
        body: {
            kr: '자세한 사유는 이메일로 문의해 주세요.',
            en: 'Please contact by the email for detailed reasons.'
        },
        benefits: [],
    },
} as const;


export const ReservationMeta = {
    ReservationCompleted: {
        color: '#4CAF50',
        emoji: DEFAULT_EMOJI_RESERVATION,
        header: {
            kr: "예약 완료 안내",
            en: "Reservation Confirmed"
        },
        body: {
            kr: "귀하의 예약이 아래와 같이 정상적으로 처리되었습니다. ",
            en: "Your reservation request has been processed successfully. "
        },
        contentUpperDesc: {
            kr: "신규 예약",
            en: "New Reservation"
        }

    },

    ReservationDeleted: {
        color : '#eb4034',
        emoji: DEFAULT_EMOJI_RESERVATION,
        header : {
            kr: "예약 취소 안내",
            en: "Reservation Cancelled"
        },
        body: {
            kr: "귀하의 예약이 정상적으로 삭제되었습니다. ",
            en: "Your reservation has been deleted successfully. "
        },
        contentUpperDesc: {
            kr: "예약 취소",
            en: "Reservation Cancellation"
        }
    },
    ReservationUpdated: {
        color : '#34b4eb',
        emoji: DEFAULT_EMOJI_RESERVATION,
        header : {
            kr: "예약 수정 완료 안내",
            en: "Reservation Updated"
        },
        body: {
            kr: "귀하의 예약이 정상적으로 변경되었습니다. ",
            en: "Your reservation has been updated successfully. "
        },
        contentUpperDesc: {
            kr: "예약 수정",
            en: "Reservation Modification"
        }
    },
    MultipleReservationCompleted: {
        color: '#4CAF50',
        emoji: DEFAULT_EMOJI_RESERVATION,
        header: {
            kr: "다중 예약 처리 결과 안내",
            en: "Multi-Reservation Results"
        },
        body: {
            kr: "귀하의 다중예약 요청 처리 결과를 아래와 같이 안내드립니다.",
            en: "Your multi-reservation request results are as follows."
        },
        contentUpperDesc: {
            kr: "신규 다중 예약",
            en: "New Multi-Reservation"
        },
        templateFooter : "이 메일은 다중예약 해당 조직의 위임자 (Delegator) 에게 발송되었습니다.",
        templateFooterEn : "This email is sent to the Delegator of the multi-reservation organization.",
    },
} as const


export const LotteryMeta = {
    Seminar : {
        Win : {
            // color : "#24d7c2",
            color : "#007bff",
            emoji : '🎉',
            header : {
                kr : "세미나실 예약 추첨 결과 안내",
                en : "Seminar Room Reservation Lottery Results",
            },
            body :  {
                kr : "귀 조직의 세미나실 정기예약 신청의 추첨 결과를 아래와 같이 안내드립니다.",
                en : "The results of the lottery for the seminar room reservation of your organization are as follows.",
            },
            contentUpperDesc : {
                kr : "예약 성공 (당첨)",
                en : "Reservation Successful",      // i hate this
            },
            templatefooter :  "이 메일은 정기예약 추첨 신청 조직의 위임자 (Delegator) 에게 발송되었습니다.",
            templatefooterEn : "This email is sent to the Delegator of the reservation lottery organization.",
        },
        Lost : {
            color : "#d72424",
            emoji : DEFAULT_EMOJI_RESERVATION,
            header : {
                kr : "세미나실 예약 추첨 결과 안내",
                en : "Seminar Room Reservation Lottery Results",
            },
            body :  {
                kr : "귀 조직의 세미나실 정기예약 신청의 추첨 결과를 아래와 같이 안내드립니다.",
                en : "The results of the lottery for the seminar room reservation of your organization are as follows.",
            },
            contentUpperDesc : {
                kr : "예약 실패 (낙첨)",
                en : "Reservation Failed",      // i love this
            },
            templatefooter :  "이 메일은 정기예약 추첨 신청 조직의 위임자 (Delegator) 에게 발송되었습니다.",
            templatefooterEn : "This email is sent to the Delegator of the reservation lottery organization.",
        }
    },
} as const