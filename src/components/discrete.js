import React, {Component} from 'react';
import {line} from 'd3-shape';
import {scaleLinear, scaleBand} from 'd3-scale';
import {select} from 'd3-selection';
import Axis from './axis.js';

export default class DiscreteSimulator extends Component {
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
    const xData = [... new Array(distFunc.domain(distFunc))].map((d, i) => i);
    const yData = xData.map(d => {
      return distFunc.df[which](d, ...Object.values(distFunc.parameters).map(d => d.value));
    });
    function checking (d) {
    	if (isNaN (d)) {
    		return 0;
    	}
    	return d;
    }
    const check = yData.map(d =>  checking(d));

    const data = xData.reduce((acc, cur, idx) => {
      acc.push({x: cur, y: check[idx]})
      return acc;
    }, []);

    const xScale = scaleBand()
    	.domain(xData)
    	.range([margin.left, width - margin.right])
    	.paddingInner(0.5);

    const yScale = scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    return (
      <div className="flex">
        <svg width={width} height={height}>
          <g className="plot-container"
            ref="plotContainer">
            {this.props.children}
            {
	          data.map((d, idx) => {
	            // We calculate the corresponding bin for the truncated distribution.
	            return (
	              <rect
	                key={idx}
	                fill="#d2a000"
	                x={xScale(d.x)}
	                y={yScale(d.y)}
	                width={xScale.bandwidth()}
	                height={height - margin.bottom - yScale(d.y)}
	                />
	            )
	          })
	        }
          </g>
          <Axis
              which="x"
              scale={xScale}
              transform={{x: 0, y: height - margin.bottom}}
              label={true}
            />
          <Axis
              which="y"
              scale={yScale}
              transform={{x: margin.left, y: 0}}
              label={true} 
            />
        </svg>
      </div>
    );
  }
}

