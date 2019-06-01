import React from 'react';

const buildClamp = range => value => Math.max(range[0], Math.min(value, range[1]));

class Slider extends React.Component {
  render() {
    const {sliderName, onChange, range, value, stepSize} = this.props;
    const clamp = buildClamp(range);
    return (
      <div className="slider-container center">
        <div className="slider-label">{sliderName}</div>
        <div className="flex">
          <input
            className="range-input-slider"
            value={value}
            min={range[0]}
            max={range[1]}
            step={stepSize}
            type="range"
            onChange={x => onChange(x.target.value)}/>
          <input
            className="text-input-slider"
            onChange={x => onChange(clamp(x.target.value))}
            value={value}/>
        </div>
      </div>
    );
  }
}
Slider.displayName = 'Slider';
export default Slider;
