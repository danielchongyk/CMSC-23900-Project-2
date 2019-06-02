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

    const histEval = histogram()
      .value(d => d)
      .domain(xScale.domain())
      .thresholds(bins);
    const hist = histEval(barData);
    const total = hist.reduce((acc, cur) => acc + cur.length, 0);
    const binWidth = hist[0].x1 - hist[0].x0;
    const distFuncArgs = Object.values(distFunc.parameters).map(d => d.value);
    const actualArea = distFunc.df.cdf(xScale.domain()[1], ...distFuncArgs) -
      distFunc.df.cdf(xScale.domain()[0], ...distFuncArgs);
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
          // We calculate the corresponding bin for the censored distribution.
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