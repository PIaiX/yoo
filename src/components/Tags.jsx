import { memo } from "react";
import { tagsData } from "../helpers/all";

const Tags = memo(({ data, mini = false}) => {
  return data.map((item) => {
    let img = tagsData.find((e) => e.name === item);
    return img ? (
      <a className={"tag" + (mini ? ' mini' : '')}>
        <img src={img.value} />
      </a>
    ) : null;
  });
});
export default Tags;
