import React, {Component} from 'react';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import DistSimulator from './dist-simulator.js';
import {scaleLinear} from 'd3-scale';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import Slider from './slider.js';
import Axis from './axis.js';
import DropdownSlider from './dropdown-slider.js'

export default class Simulation extends Component {
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
			support
		} = this.props;

    const distFunc = distFuncs[dist];
    const scale = scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

		return (
      <div className="relative" align-items="center">
        <div className="flex">
          <DistSimulator
            height={height}
            width={0.65 * width}
            margin={{top: margin.top, right: 0, bottom: margin.bottom, left: margin.left}}
            distFunc={distFunc}
            which="cdf"
          />
          <svg width={0.35 * width} height={height}>
            <Axis
              which="unif"
              scale={scale}
              transform={{x: margin.left, y: 0}}
              />
          </svg>
        </div>
        <div className="flex" style={{width:"50%", height: `${height}px`}}>
          <DistSimulator
            height={height}
            width={0.65 * width}
            margin={{top: 20, right: 0, bottom: margin.bottom, left: margin.left}}
            distFunc={distFunc}
            which="pdf"
            >
          {this.props.children}
          </DistSimulator>
        </div>
      </div>
		);
	}
}