import React, {Component} from 'react';
import {scaleLinear} from 'd3-scale';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import Slider from './slider.js';
import Axis from './axis.js';

export default class DropdownSlider extends Component {
	constructor() {
    super();

		this.state = {
		};
	}

	state = {
	}

	render() {
		const {
			height,
			width,
      margin,
      dist,
      distFuncs,
      support,
      changeDist,
      changeDistFunc
		} = this.props;

    const distFunc = distFuncs[dist];
    const scale = scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

		return (
      <div
        className="relative"
        style={{
          width:`${width}px`,
          height:`${height}px}`,
          margin:`${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
        }}>
        <DropdownButton
          id="nav-dropdown"
          title={distFunc.disp}
          >
          {
            support.map(elt => {
              return (
                <Dropdown.Item
                  key={elt}
                  eventKey={elt}
                  onSelect={() => {changeDist(elt)}}
                  >
                  {distFuncs[elt].disp}
                </Dropdown.Item>
              );
            })
          }
        </DropdownButton>
        {Object.keys(distFunc.parameters).map(d => {
            return (<Slider
              key={d}
              value={distFunc.parameters[d].value}
              range={distFunc.parameters[d].range}
              stepSize={distFunc.parameters[d].step}
              onChange={x => {
                distFunc.parameters[d].value = Number(x);
                changeDistFunc(dist, distFunc);
              }}
              sliderName={distFunc.parameters[d].name}
            />);
          })}
      </div>
		);
	}
}