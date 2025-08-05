import { OrganizationStatusEnum } from "./organization.enum";

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
        emoji: '❌',
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
    ReservationCompleted : {
        color : '#4CAF50',
        emoji: '📅',
        header: {
            kr: "예약 완료 안내",
            en: "Reservation Confirmed"
        },
        body : {
            kr : "귀하의 예약이 아래와 같이 정상적으로 처리되었습니다. ",
            en : "Your reservation request has been processed successfully. Details are as follows. "
        }
    }
} as const