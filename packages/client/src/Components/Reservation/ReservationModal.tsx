import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import {
  IReservation,
  ITeamMember,
  ITeam,
  isTeamContent,
  reservationCharacterOptions,
  reservationStateOptions,
  workerNeedOptions,
  ITeamMemberResponse,
  IReservationResponse,
} from "@scspace-depot/types/reservation";
import { IUser } from "@scspace-depot/types/user";
import { useLoginCheck } from "@scspace-client/Apis/auth/useLoginCheck";
import { useSpaces } from "@scspace-client/Apis/space/useSpaces";
import MultipleRadioInput from "./inputs/MultipleRadioInput";
import TextInput from "./inputs/TextInput";
import {
  ReservationStateEnum,
  ReservationWorkerNeedEnum,
} from "@scspace-depot/enums/reservation.enum";
import { enumToArray } from "@scspace-depot/utils";
import { useMutationApi } from "@scspace-client/Hooks/useApi";

interface ReservModalProps {
  reservationInfo: IReservationResponse | null;
  setReservationInfo: (reservationInfo: IReservationResponse) => void;
  reserverInfo: IUser | null;
  showHide: boolean;
  setShowHide: (showHide: boolean) => void;
  refresh: () => void;
}

const ReservModal: React.FC<ReservModalProps> = ({
  showHide,
  reservationInfo,
  setReservationInfo,
  reserverInfo,
  setShowHide,
  refresh,
}) => {
  const { userInfo, isSCS } = useLoginCheck();

  const [teamData, setTeamData] = useState<ITeam>();
  const [teamMembers, setTeamMembers] = useState<ITeamMemberResponse[]>([]);
  const { space } = useSpaces(reservationInfo ? reservationInfo.spaceId : 0);

  const { mutateAsync: sendReservationPut } = useMutationApi(
    "/api/reservation",
    "PUT",
  );

  useEffect(() => {
    if (reservationInfo && reservationInfo.teamId && teamData === undefined) {
      callApiTeam();
    }
  }, [reservationInfo, teamData]);

  const callApiTeam = async () => {
    // TODO: 팀 조회 API 호출
  };

  const onClickHide = () => {
    setShowHide(false);
  };

  const setState = (state: ReservationStateEnum) => {
    if (!userInfo || !isSCS() || !reservationInfo) return;
    setReservationInfo({
      ...reservationInfo,
      state: state,
    });
  };
  const setWorkerNeed = (workerNeed: ReservationWorkerNeedEnum) => {
    if (!userInfo || !isSCS() || !reservationInfo) return;
    setReservationInfo({
      ...reservationInfo,
      workerNeed: workerNeed,
    });
  };

  const setComment = (comment: string) => {
    if (!userInfo || !isSCS() || !reservationInfo) return;
    setReservationInfo({
      ...reservationInfo,
      comment,
    });
  };

  const handleReservationSubmit = async (
    // 제출 버튼 클릭 시 실행되도록 템플릿 잡아주기. import해서 사용되도록.
    reservation: IReservation,
    refresh: () => void,
  ): Promise<void> => {
    if (!isSCS() && userInfo?.type !== reservation.userId) return;
    await sendReservationPut(reservation);
    alert("예약 처리가 완료되었습니다.");
    setShowHide(false);
    refresh();
  };

  const reservationContent = () => {
    // first second 컴포넌트화 시킬 수 있을 것으로 보임.
    let returnResult: JSX.Element[] = [];
    const reservation = reservationInfo;

    if (
      reservation &&
      reservation.teamId &&
      teamData &&
      teamData.id === reservation.teamId &&
      reservation.content &&
      isTeamContent(reservation.content)
    ) {
      returnResult.push(
        <div className="wrap" key="team-name">
          <p className="modal-first">팀 이름</p>
          <p className="modal-second">{teamData.name}</p>
        </div>,
      );
      returnResult.push(
        <div className="wrap" key="team-members">
          <p className="modal-first">멤버</p>
          <p className="modal-second">
            {teamMembers.map(member =>
              reservation.content &&
              isTeamContent(reservation.content) &&
              reservation.content.teamMemberUserIds.includes(member.id) ? (
                <div key={member.id}>
                  학번: {member.user.userNumber} &nbsp; 이름:{" "}
                  {member.user.nameKr}
                </div>
              ) : null,
            )}
          </p>
        </div>,
      );
    } // 아래 조건 블록이랑 합쳐도 될 것 같은데? 일단 시간이 없음.

    if (reservation && reservation.content) {
      const content = reservation.content;

      if ("organizationName" in content) {
        returnResult.push(
          <div className="wrap" key="organizationName">
            <p className="modal-first">단체 이름</p>
            <p className="modal-second">{content.organizationName}</p>
          </div>,
        );
      }

      if (content.eventName) {
        returnResult.push(
          <div className="wrap" key="eventName">
            <p className="modal-first">행사 이름</p>
            <p className="modal-second">{content.eventName}</p>
          </div>,
        );
      }

      if ("participantNumber" in content) {
        returnResult.push(
          <div className="wrap" key="participantNumber">
            <p className="modal-first">예상 참여 인원</p>
            <p className="modal-second">{content.participantNumber}</p>
          </div>,
        );
      }

      if (
        "innerParticipantNumber" in content &&
        "outerParticipantNumber" in content
      ) {
        returnResult.push(
          <div className="wrap" key="innerNumber">
            <p className="modal-first">예상 참여 인원</p>
            <p className="modal-second">
              학내구성원: {content.innerParticipantNumber} 외부인:{" "}
              {content.outerParticipantNumber}
            </p>
          </div>,
        );
      }

      if ("eventPurpose" in content) {
        returnResult.push(
          <div className="wrap" key="eventPurpose">
            <p className="modal-first">행사 목적</p>
            <p className="modal-second">{content.eventPurpose}</p>
          </div>,
        );
      }

      if ("contents" in content) {
        returnResult.push(
          <div className="wrap" key="contents">
            <p className="modal-first">행사 내용</p>
            <p className="modal-second">{content.contents}</p>
          </div>,
        );
      }

      if ("character" in content && content.character) {
        returnResult.push(
          <div className="wrap" key="character">
            <p className="modal-first">행사 성격</p>
            <p className="modal-second">
              {content.character.map(character => {
                if (character in reservationCharacterOptions) {
                  // character가 reservationCharacterOptions의 key 중 하나일 때만 반환
                  return (
                    reservationCharacterOptions[
                      character as keyof typeof reservationCharacterOptions
                    ] + " "
                  );
                }
                return "";
              })}
            </p>
          </div>,
        );
      }

      if ("equipment" in content && content.equipment) {
        returnResult.push(
          <div className="wrap" key="equipment">
            <p className="modal-first">장비 사용</p>
            <p className="modal-second">
              {content.equipment.map(equipment => [equipment] + " ")}
            </p>
          </div>,
        );
      }

      if ("desk" in content && "chair" in content) {
        returnResult.push(
          <div className="wrap" key="desk-chair">
            <p className="modal-first">책상과 의자</p>
            <p className="modal-second">
              책상: {content.desk} 의자: {content.chair}
            </p>
          </div>,
        );
      }

      if ("food" in content) {
        returnResult.push(
          <div className="wrap" key="food">
            <p className="modal-first">음식</p>
            <p className="modal-second">{content.food}</p>
          </div>,
        );
      }

      if ("lobby" in content && content.lobby) {
        returnResult.push(
          <div className="wrap" key="lobby">
            <p className="modal-first">로비</p>
            <p className="modal-second">울림홀 1층 로비를 사용합니다.</p>
          </div>,
        );
      }
    }

    return returnResult;
  };

  if (!reservationInfo) return null;
  return (
    <Modal show={showHide} dialogClassName="modal-90w">
      <Modal.Header closeButton onClick={onClickHide}>
        <Modal.Title>{reservationInfo ? space.name : ""}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h5 className="modal-ttl">시간</h5>
          <hr />
          <div className="wrap">
            <p className="modal-first">예약 시간</p>
            <p className="modal-second">
              {reservationInfo
                ? moment(reservationInfo.timeFrom).format("MM월 DD일 HH:mm") +
                  "~" +
                  moment(reservationInfo.timeTo).format("MM월 DD일 HH:mm")
                : ""}
            </p>
          </div>
        </div>
        <br />
        {reserverInfo ? (
          <div>
            <h5 className="modal-ttl">예약자</h5>
            <hr />
            <div className="wrap">
              <p className="modal-first">예약자 학번</p>
              <p className="modal-second">
                {reserverInfo ? reserverInfo.userNumber : ""}
              </p>
            </div>
            <div className="wrap">
              <p className="modal-first">예약자 이름</p>
              <p className="modal-second">
                {reserverInfo ? reserverInfo.nameKr : ""}
              </p>
            </div>
            <div className="wrap">
              <p className="modal-first">예약자 이메일</p>
              <p className="modal-second">
                {reserverInfo ? reserverInfo.email : ""}
              </p>
            </div>
          </div>
        ) : null}
        <br />
        <div>
          <h5 className="modal-ttl">예약 내용</h5>
          <hr />
          {reservationInfo !== null && reservationInfo.content !== null
            ? reservationContent()
            : ""}
        </div>
        <br />{" "}
        {reserverInfo ? (
          <div>
            <div>
              {/* 예약 처리 부분 */}
              <MultipleRadioInput
                contents={enumToArray(ReservationStateEnum)} // 예약 처리의 key들
                labels={enumToArray(reservationStateOptions)} // 예약 처리에 대한 라벨들
                header="예약 처리" // 라벨로 표시될 헤더
                selected={reservationInfo.state} // 선택된 값
                setSelected={setState} // 선택값 변경 핸들러
              />

              {/* 근로 배정 부분 */}
              <MultipleRadioInput
                contents={enumToArray(ReservationWorkerNeedEnum)} // 근로 배정의 key들
                labels={enumToArray(workerNeedOptions)}
                header="근로 배정" // 헤더
                selected={reservationInfo.workerNeed} // 선택된 근로 배정 상태
                setSelected={setWorkerNeed} // 근로 배정 선택 핸들러
              />

              {/* 코멘트 입력 부분 */}
              <TextInput
                label="Comment"
                text={reservationInfo.comment ? reservationInfo.comment : ""}
                setText={setComment}
              />
            </div>
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        {isSCS() ? (
          <button
            className="modalButton2"
            onClick={() => handleReservationSubmit(reservationInfo, refresh)}
          >
            처리
          </button>
        ) : null}
        <button className="modalButton1" onClick={onClickHide}>
          닫기
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReservModal;
