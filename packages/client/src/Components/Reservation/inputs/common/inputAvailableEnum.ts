import { AskStateEnum } from "@depot/enums/ask.enum";
import { ReservationStateEnum } from "@depot/enums/reservation.enum";
import { ReservationWorkerNeedEnum } from "@depot/enums/reservation.enum";
import { ReservationHallEquipEnum } from "@depot/enums/reservation.enum";
import { ReservationCharacterEnum } from "@depot/enums/reservation.enum";

export type InputAvailableEnum = AskStateEnum | ReservationStateEnum | ReservationWorkerNeedEnum | ReservationHallEquipEnum | ReservationCharacterEnum;