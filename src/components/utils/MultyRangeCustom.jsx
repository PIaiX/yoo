import { memo } from "react";

const MultyRangeCustom = memo(
  ({
    minRange = 0,
    maxRange = 1000,
    valueMin = 0,
    valueMax = 1000,
    onChange,
  }) => {
    let leftIndent =
      ((Number(valueMin) - Number(minRange)) /
        (Number(maxRange) - Number(minRange))) *
      100;
    let rangeWidth =
      ((Number(valueMax) - Number(valueMin)) /
        (Number(maxRange) - Number(minRange))) *
      100;

    let style = {
      left: leftIndent + "%",
      width: rangeWidth + "%",
    };

    return (
      <div className="range">
        <div className="range-values mb-4">
          <input
            type="number"
            placeholder="от"
            min={minRange}
            max={maxRange}
            value={valueMin}
            onChange={(e) =>
              onChange({ max: Number(valueMax), min: Number(e.target.value) })
            }
          />
          <hr />
          <input
            type="number"
            placeholder="до"
            min={minRange}
            max={maxRange}
            value={valueMax}
            onChange={(e) =>
              onChange({ max: Number(e.target.value), min: Number(valueMin) })
            }
          />
        </div>
        <div className="range-slider">
          <div className="range-slider-diapason" style={style}></div>
          <input
            className="range-input-min"
            type="range"
            min={minRange}
            max={maxRange}
            value={valueMin}
            onChange={(e) =>
              onChange({ max: Number(valueMax), min: Number(e.target.value) })
            }
          />
          <input
            className="range-input-max"
            type="range"
            min={minRange}
            max={maxRange}
            value={valueMax}
            onChange={(e) =>
              onChange({ max: Number(e.target.value), min: Number(valueMin) })
            }
          />
        </div>
      </div>
    );
  }
);

export default MultyRangeCustom;
