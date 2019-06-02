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

    if (barData.length === 0) return null;
    // Get the actual domain of the truncated distribution.
    const distFuncArgs = Object.values(distFunc.parameters).map(d => Number(d.value));
    const distDomain = [
      Math.max(distFunc.domain[0],
        isNaN(distFunc.df.inv(0, ...distFuncArgs)) ? -Infinity : distFunc.df.inv(0, ...distFuncArgs)),
      Math.min(distFunc.domain[1],
        isNaN(distFunc.df.inv(1, ...distFuncArgs)) ? Infinity : distFunc.df.inv(1, ...distFuncArgs)),
    ];

    // Create the histogram and evaluate the bins.
    const binWidth = (distDomain[1] - distDomain[0]) / bins;
    const binArray = [... new Array(bins)].map((d, i) => i * binWidth + distDomain[0]);
    const histEval = histogram()
      .value(d => d)
      .domain(distDomain)
      .thresholds(binArray);
    const hist = histEval(barData);
    const total = hist.reduce((acc, cur) => acc + cur.length, 0);
    const actualArea = distFunc.df.cdf(distFunc.domain[1], ...distFuncArgs) -
      distFunc.df.cdf(distFunc.domain[0], ...distFuncArgs);
    // Calculate the actual histogram densities.
    const data = hist.map(d => {
      return {
        value: d.length / total / binWidth * actualArea,
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
              stroke='white'
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