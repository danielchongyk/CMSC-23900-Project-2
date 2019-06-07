import React, {Component} from 'react';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import DistSimulator from './dist-simulator.js';
import {scaleLinear} from 'd3-scale';
import Axis from './axis.js';

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
    const yScale = scaleLinear()
      .domain([0, distFunc.max])
      .range([height - margin.bottom, margin.top]);

		return (
      <div className="relative" align-items="center">
        <div className="flex">
          <DistSimulator
            height={height}
            width={0.65 * width}
            margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
            distFunc={distFunc}
            yScale={scale}
            which="cdf"
          />
        </div>
        <div className="flex" style={{width:"50%", height: `${height}px`}}>
          <DistSimulator
            height={height}
            width={0.65 * width}
            margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
            distFunc={distFunc}
            yScale={yScale}
            which="pdf"
            >
          {this.props.children}
          </DistSimulator>
        </div>
      </div>
		);
	}
}