import HelpTooltip from "@/Components/_commons/HelpTooltip";
import {
  reservationMaxDate,
  reservationMaxDayTime,
  reservationMinDate,
} from "@depot/types/reservation";
import { SpaceTypeEnum } from "@depot/types/space";

interface TimeTooltipsProps {
  spaceType: SpaceTypeEnum;
}

const TimeTooltips: React.FC<TimeTooltipsProps> = ({ spaceType }) => {
  return (
    <HelpTooltip
      message={`하루에 최대 ${reservationMaxDayTime[spaceType] / 60}시간, ${reservationMinDate[spaceType]}~${reservationMaxDate[spaceType]}일 전에 예약 가능합니다.`}
      placement="bottom"
      text="도움말"
    />
  );
};

export default TimeTooltips;
