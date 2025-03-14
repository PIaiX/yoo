import { memo } from "react";
import { useTranslation } from "react-i18next";
import { statusData } from "../helpers/all";

const Status = memo((props) => {
  const { t } = useTranslation();
  const active =
    props?.statuses?.length > 0
      ? props.statuses.find((e) => e.end === null) ?? props?.statuses[0]
      : false;
  const statusIcon = statusData[active?.status?.value ?? "new"]?.icon;

  const statusBg = active?.status?.color
    ? active?.status?.color
    : statusData[active?.status?.value]?.statusBg
    ? statusData[active?.status?.value]?.statusBg
    : "#222";

  const statusImage = statusData[active?.status?.value ?? "new"]?.image;

  const statusText = t(statusData[active?.status?.value ?? "new"]?.text);

  return (
    <div
      className={"d-flex align-items-center status" + (active ? " active" : "")}
      style={statusBg && { backgroundColor: statusBg }}
    >
      {active && statusImage ? (
        <div className="img">
          <img  draggable="false" src={statusImage} />
        </div>
      ) : (
        statusIcon && statusIcon
      )}
      <div className="fw-5">{statusText}</div>
    </div>
  );
});
export default Status;
