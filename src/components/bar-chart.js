import React, {Component} from 'react';
import {histogram} from 'd3-array';

export default class BarChart extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const {
      barData,
      xScale,
      yScale,
      distFunc,
      bins
    } = this.props;

    // Get the actual domain of the truncated distribution.
    const distFuncArgs = Object.values(distFunc.parameters).map(d => d.value);
    const distDomain = [
      Math.max(distFunc.domain[0],
        isNaN(distFunc.df.inv(0, ...distFuncArgs)) ? -Infinity : distFunc.df.inv(0, ...distFuncArgs)),
      Math.min(distFunc.domain[1],
        isNaN(distFunc.df.inv(1, ...distFuncArgs)) ? Infinity : distFunc.df.inv(1, ...distFuncArgs)),
    ];

    // Create the histogram and evaluate the bins.
    const histEval = histogram()
      .value(d => d)
      .domain(distDomain)
      .thresholds(bins);
    const hist = histEval(barData);
    const total = hist.reduce((acc, cur) => acc + cur.length, 0);
    const binWidth = hist[1].x1 - hist[1].x0;
    const actualArea = distFunc.df.cdf(distFunc.domain[1], ...distFuncArgs) -
      distFunc.df.cdf(distFunc.domain[0], ...distFuncArgs);

    // Calculate the actual histogram densities.
    const data = hist.map(d => {
      return {
        value: total ? d.length / total / binWidth * actualArea : 0,
        x0: d.x0,
        x1: d.x1,
        length: d.length
      };
    });

    return (
      <g className = "Bar Chart">
      {
        data.map((d, idx) => {
          // We calculate the corresponding bin for the truncated distribution.
          return (
            <rect
              key={idx}
              fill="#d2a000"
              x={xScale(d.x0)}
              y={yScale(d.value)}
              width={xScale(d.x1) - xScale(d.x0)}
              height={yScale.range()[0] - yScale(d.value)}
              />
          )
        })
      }
      </g>
    );
  }
}