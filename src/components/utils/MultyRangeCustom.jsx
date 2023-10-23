import React, {useState} from 'react';

const MultyRangeCustom = ({
    minRange=0, 
    maxRange=1000,
    valueMin=0,
    valueMax=1000
}) => {
    const [valMin, setValMin] = useState(valueMin);
    const [valMax, setValMax] = useState(valueMax);

    const handleMinChange = (e) => {
        if (e.target.value > valMax) {
            setValMin(valMax)
        } else {
            setValMin(e.target.value)
        }
    }

    const handleMaxChange = (e) => {
        if (e.target.value < valMin) {
            setValMax(valMin)
        } else {
            setValMax(e.target.value)
        }
    }

    let leftIndent = Number(valMin) / Number(maxRange) * 100
    let rangeWidth = (Number(valMax) - Number(valMin)) / Number(maxRange) * 100

    let style = {
        left: leftIndent+'%',
        width: rangeWidth+'%'
    };

    return (
        <div className="range">
            <div className="range-values mb-4">
                <input 
                    type="number" 
                    placeholder="от" 
                    min={minRange} 
                    max={maxRange}
                    value={valMin}
                    onChange={handleMinChange}
                />
                <hr />
                <input 
                    type="number" 
                    placeholder="до" 
                    min={minRange} 
                    max={maxRange}
                    value={valMax}
                    onChange={handleMaxChange}
                />
            </div>
            <div className="range-slider">
                <div className="range-slider-diapason" style={style}></div>
                <input 
                    className="range-input-min"
                    type="range" 
                    min={minRange} 
                    max={maxRange} 
                    value={valMin}
                    onChange={handleMinChange}
                />
                <input
                    className="range-input-max"
                    type="range" 
                    min={minRange} 
                    max={maxRange}
                    value={valMax}
                    onChange={handleMaxChange}
                />
            </div>
        </div>
    )
}

export default MultyRangeCustom