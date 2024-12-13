import moment from "moment";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import Snowfall from "react-snowfall";

const snowflake1 = document.createElement("img");
snowflake1.src = "/imgs/sw.png";
const images = [snowflake1];

const Holiday = memo(() => {
  const holidayStatus = useSelector(
    (state) => state.settings?.options?.holiday
  );
  //Если true значит отключено. Сделано так, чтобы подключно было у всех, но каждый мог отключить.

  if (holidayStatus) {
    return null;
  }

  if (
    moment().format("MM") === "12" ||
    moment().format("MM") == "01" ||
    moment().format("MM") == "02"
  ) {
    return (
      <Snowfall
        images={images}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
        snowflakeCount={25}
        speed={[0.1, 0.2]}
        rotationSpeed={[-1.0, 1.0]}
        radius={[6, 14.0]}
      />
    );
  }
});

export default Holiday;
