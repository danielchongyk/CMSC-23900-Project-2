import React, {Component} from 'react';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import DistSimulator from './dist-simulator.js';
import {scaleLinear} from 'd3-scale';
import Axis from './axis.js';
import * as jStat from 'jStat';

export default class Simulation extends Component {
	constructor() {
		super();

		this.state = {
		};
	}

	state = {
  }
  
  normalDist(mean, variance, domain, max) {
    return {
      disp: 'Normal',
      df: jStat.normal,
      parameters: {
        mean: {name: "Mean", value: mean, range: [-3, 3]},
        std: {name: "Standard Deviation", value: Math.sqrt(variance), range: [0.01, 10]}
      },
      domain,
      max
    };
  }

	render() {
		const {
      height,
      axisHeight,
			width,
			margin,
      dist,
      distFuncs,
			support,
    } = this.props;

    const distFunc = distFuncs[dist];
    const distParams = Object.values(distFunc.parameters).map(d => Number(d.value));
    const scale = scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);
    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([margin.left, 0.65 * width - margin.right])

		return (
      <div className="relative" align-items="center">
        <div className="flex">
          <DistSimulator
            height={(height - axisHeight) / 2}
            width={0.65 * width}
            margin={{top: margin.top, right: 0, bottom: margin.bottom, left: margin.left}}
            distFunc={distFunc}
            which="pdf"
          />
        </div>
        <svg width={0.65 * width} height = {axisHeight}>
          <Axis
              which="x"
              scale={xScale}
              transform={{x: 0, y: axisHeight / 2}}
              label={true}
            />
        </svg>
        <div className="flex" style={{width:"50%", height: `${height}px`}}>
          <DistSimulator
            height={(height - axisHeight) / 2}
            width={0.65 * width}
            margin={{top: margin.top, right: 0, bottom: margin.bottom, left: margin.left}}
            distFunc={this.normalDist(distFunc.df.mean(...distParams),
                                      distFunc.df.variance(...distParams),
                                      distFunc.domain,
                                      distFunc.max)}
            which="pdf"
            >
            {this.props.children}
            </DistSimulator>
        </div>
      </div>
		);
	}
}