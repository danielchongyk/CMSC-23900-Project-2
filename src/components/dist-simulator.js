import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {line} from 'd3-shape';
import {scaleLinear} from 'd3-scale';
import {axisLeft, axisBottom} from 'd3-axis'
import {select} from 'd3-selection';
import * as jStat from 'jStat';

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
    const {dist} = this.props;

    // Graphical parameters.
    const height = 400;
    const width = 800;
    const margin = {left: 20, right: 200, bottom: 100, top: 20};

    this.state = {
      height,
      width,
      margin,
      normal: {
        df: jStat.normal,
        parameters: {mean: 0, std: 1},
        domain: [-3, 3]
      }
    };
  }

  state = {
    height: null,
    width: null,
    margin: null,
    normal: {}
  }

  componentDidMount() {
    this.updateChart(this.props);
  }
  
  updateChart(props) {
    const {dist} = this.props;
    const {
      height,
      width,
      margin
    } = this.state;
    const distFunc = this.state[dist];

    // Sample from the function.
    const numSample = 100;
    const xData = [... new Array(numSample)].map((d, i) => {
      return scaleLinear().domain([0, 1]).range(distFunc.domain)(i / (numSample - 1));
    });
    const yData = xData.map(d => distFunc.df.pdf(d, ...Object.values(distFunc.parameters)));
    const data = xData.reduce((acc, cur, idx) => {
      acc.push({x: cur, y: yData[idx]})
      return acc;
    }, []);

    // Create scales and build axes.
    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, 1.1 * Math.max(...yData)])
      .range([height - margin.bottom, margin.top]);
    const xAxis = axisBottom(xScale);
    select(ReactDOM.findDOMNode(this.refs.xAxisContainer))
      .call(axisG => axisG.call(xAxis));
    const yAxis = axisLeft(yScale)
      .tickFormat("");
    select(ReactDOM.findDOMNode(this.refs.yAxisContainer))
      .call(axisG => axisG.call(yAxis));

    // Plot the line itself.
    const lineContainer = select(ReactDOM.findDOMNode(this.refs.plotContainer));
    const lineEval = line().x(d => xScale(d.x)).y(d => yScale(d.y));
    const lines = lineContainer.append('path')
      .attr('class', 'dist-plot')
      .attr('stroke', 'black')
      .attr('stroke-width', '2')
      .attr('fill', 'none')
      .attr('opacity', 1.0)
      .attr('d', lineEval(data));
  }

  render() {
    const {
      height,
      width,
      margin,
      dist
    } = this.state;
    return (
      <div>
        <svg width={width} height={height}>
          <g className="plot-container"
            ref="plotContainer"
          />
          <g className="axis-container x-axis"
            transform={`translate(0, ${height - margin.bottom})`}
            ref="xAxisContainer"
            />
          <g className="axis-container y-axis"
            transform={`translate(${margin.left})`}
            ref="yAxisContainer"
            />
        </svg>
      </div>
    );
  }
}