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
            kr: '조직 등록이 완료되었습니다. 이제 세미나실 예약을 신청할 수 있습니다.',
            en: 'Organization registration is complete. You can now apply for seminar room reservations.'
        },
        benefits: [
            {
                kr: '세미나실 예약 신청이 가능합니다.',
                en: 'You can apply for seminar room reservations.'
            }
        ],
    },

    [OrganizationStatusEnum.VERIFY_REQUEST]: {
        color: '#ffc107',
        emoji: '🔍',
        header: {
            kr: '조직 인증 심사 중',
            en: 'Organization verification in progress'
        },
        body: {
            kr: '조직 인증을 위해 제출한 서류를 검토 중입니다. 심사 완료까지 기다려 주세요.',
            en: 'We are reviewing the documents you submitted for organization verification. Please wait for the review to complete.'
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
            kr: '제출하신 서류가 인증 기준에 부합하지 않아 반려되었습니다. 자세한 사유는 관리자에게 문의해 주세요.',
            en: 'Unfortunately, your submitted documents do not meet the verification criteria and have been rejected. Please contact the administrator for detailed reasons.'
        },
        benefits: [],
    },
} as const;
