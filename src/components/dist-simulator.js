import React, {Component} from 'react';
import {line} from 'd3-shape';
import {scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import Axis from './axis.js';

/*
 * Distributions supported:
 *  - Uniform
 *  - Binomial
 *  - Beta
 *  - Poisson
 *  - Exponential
 *  - Normal
 */
export default class DistSimulator extends Component {
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
      distFunc,
      which
    } = this.props;
    
    // Sample from the function.
    const numSample = 1000;
    const xData = [... new Array(numSample)].map((d, i) => {
      return scaleLinear().domain([0, 1]).range(distFunc.domain)(i / (numSample - 1));
    });
    const yData = xData.map(d => {
      return distFunc.df[which](d, ...Object.values(distFunc.parameters).map(d => d.value));
    });

    const data = xData.reduce((acc, cur, idx) => {
      acc.push({x: cur, y: yData[idx]})
      return acc;
    }, []);

    // Create scales and build axes.
    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, which === "cdf" ? 1 : distFunc.max])
      .range([height - margin.bottom, margin.top]);
    const lineEval = line().x(d => xScale(d.x)).y(d => yScale(d.y));

    return (
      <div className="flex">
        <svg width={width} height={height}>
          <g className="plot-container"
            ref="plotContainer">
            {this.props.children}
            <path
              className="dist-plot"
              stroke="black"
              strokeWidth="2"
              fill="none"
              opacity="1"
              d={lineEval(data)}
            />
          </g>
          <Axis
              which="x"
              scale={xScale}
              transform={{x: 0, y: height - margin.bottom}}
            />
          <Axis
              which="y"
              scale={yScale}
              transform={{x: margin.left, y: 0}}
            />
        </svg>
      </div>
    );
  }
}