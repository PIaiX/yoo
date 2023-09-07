import { memo } from "react";

const Empty = memo(({ text, mini, desc, image = false, button }) => {
  return (
    <main
      className={
        "empty d-flex flex-column align-items-center justify-content-center" +
        (mini ? " mini" : "")
      }
    >
      {image && <div className="mb-4">{image()}</div>}
      <div>
        <p className="text-center h4">{text ?? "Ничего нет"}</p>
        {desc && <p className="text-center text-muted">{desc}</p>}
        {button && (
          <div className="d-flex justify-content-center mt-4">{button}</div>
        )}
      </div>
    </main>
  );
});
export default Empty;
