import { AskStateEnum } from "@scspace-depot/enums/ask.enum";
import { ReservationStateEnum } from "@scspace-depot/enums/reservation.enum";
import { ReservationWorkerNeedEnum } from "@scspace-depot/enums/reservation.enum";
import { ReservationHallEquipEnum } from "@scspace-depot/enums/reservation.enum";
import { ReservationCharacterEnum } from "@scspace-depot/enums/reservation.enum";

export type InputAvailableEnum = AskStateEnum | ReservationStateEnum | ReservationWorkerNeedEnum | ReservationHallEquipEnum | ReservationCharacterEnum;