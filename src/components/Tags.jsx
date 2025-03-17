import { memo } from "react";
import { tagsData } from "../helpers/all";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Tags = memo(({ data, mini = false }) => {
  return data.map((item) => {
    let e = tagsData.find((e) => e.name === item);
    return e ? (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={"tag_" + e.name}>{e.title}</Tooltip>}
      >
        <a className={"tag" + (mini ? " mini" : "")}>
          <img draggable="false" src={e.value} />
        </a>
      </OverlayTrigger>
    ) : null;
  });
});
export default Tags;
