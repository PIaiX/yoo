import { memo } from "react";
import { statusData } from "../helpers/all";

const Status = memo((props) => {
  const active =
    props?.statuses?.length > 0
      ? props.statuses.find((e) => e.end === null) ?? props?.statuses[0]
      : false;

  let status = active?.status?.value
    ? statusData[active.status.value] ?? false
    : false;

  const statusImage = status?.image;
  const statusIcon = status?.icon;
  const statusText = active?.name ?? status?.text;
  const bg = status?.bg;

  return (
    <div
      className={"d-flex align-items-center status" + (active ? " active" : "")}
      style={bg && { backgroundColor: bg }}
    >
      {active && statusImage ? (
        <div className="img">
          <img src={statusImage} />
        </div>
      ) : (
        statusIcon && statusIcon
      )}
      <div className="fw-5">{statusText}</div>
    </div>
  );
});
export default Status;
