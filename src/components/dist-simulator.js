import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {line} from 'd3-shape';
import {scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import * as jStat from 'jStat';
import Slider from './slider.js';
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
  constructor(props) {
    super(props);
    
    // Graphical parameters.
    const height = 400;
    const width = 600;
    const margin = {left: 100, right: 20, bottom: 100, top: 20};

    this.state = {
      height,
      width,
      margin
    };
  }

  state = {
    height: null,
    width: null,
    margin: null
  }

  render() {
    const {
      distFunc
    } = this.props;
    const {
      height,
      width,
      margin
    } = this.state;
    
    // Sample from the function.
    const numSample = 1000;
    const xData = [... new Array(numSample)].map((d, i) => {
      return scaleLinear().domain([0, 1]).range(distFunc.domain)(i / (numSample - 1));
    });
    const yData = xData.map(d => {
      return distFunc.df.pdf(d, ...Object.values(distFunc.parameters).map(d => d.value));
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
      .domain([0, distFunc.max])
      .range([height - margin.bottom, margin.top]);
    const lineEval = line().x(d => xScale(d.x)).y(d => yScale(d.y));

    return (
      <div className="flex">
        <svg width={width} height={height}>
          <g className="plot-container"
            ref="plotContainer">
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