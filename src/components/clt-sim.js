import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import {line} from 'd3-shape';
import {interpolate} from 'd3-interpolate';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {easeLinear} from 'd3-ease';
import {scaleLinear} from 'd3-scale';
import Clt from './clt.js';
import DropdownSlider from './dropdown-slider.js'
import BarChart from './bar-chart.js'
import SimMenu from './sim-menu.js'

function checkUndefined(arr) {
  return arr.reduce((acc, cur) => {
    return acc && Object.values(cur).reduce((a, c) => {
      return a && (typeof c !== 'undefined');
    }, true)
  }, true);
}

export default class CltSim extends Component {
	constructor(props) {
    super(props);
    
    const {width} = this.props;

		const support = [
			'unif',
			'exp',
			'norm',
			'chisq'
		];

    const leftWidth = 0.9 * width;
    const leftPlotWidth = 0.65 * leftWidth;

		this.state = {
      leftWidth,
      leftPlotWidth,
			dist: 'norm',
      support,
      distFuncs: {
        unif: uniform,
        exp: exponential,
        norm: normal,
        chisq: chisquared
      },
      barData: [],
      speedUp: 2,
      bins: 10,
      numSims: 20
		};
	}

	state = {
    leftWidth: null,
    leftPlotWidth: null,
		dist: null,
		distFuncs: null,
    support: null,
    barData: null,
    speedUp: null,
    bins: null,
    numSims: null
  }

  sampleMultiple(count, speed) {
    const {barData} = this.state;
    // Simulate animate multiple circles.
    barData.push(this.animateCircles(20))
    setTimeout(this.setState({barData}), 1000 / speed);
  }
  
  animateCircles(num) {
    // Import constants
		const {
			height,
			width,
			margin,
    } = this.props;

    const {
      leftPlotWidth,
      dist,
      distFuncs,
      speedUp
    } = this.state;

    const distFunc = distFuncs[dist];
    const distFuncArgs = Object.values(distFunc.parameters).map(d => Number(d.value));

    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([margin.left, leftPlotWidth]);
    const yScale = scaleLinear()
      .domain([0, distFunc.max])
      .range([height * 0.45 - margin.bottom, margin.top]);
    const endY = 0.5 * height;
    const endMeanY = height - margin.bottom;

    const sims = [...new Array(num)].map(d => this.simulateDraw());
    const mean = sims.reduce((acc, cur) => {
      return acc + cur;
    }, 0) / num;
    const meanScaled = xScale(mean);
    const paths = sims.map(d => {
      const startX = xScale(d);
      const startY = yScale(distFunc.df.pdf(d, ...distFuncArgs));

      return [
        {x: startX, y: startY},
        {x: startX, y: endY},
        {x: meanScaled, y: endY},
        {x: meanScaled, y: endMeanY}
      ]
    });

    // Proceed with drawing the circles.
    const svg = select(ReactDOM.findDOMNode(this.refs.wrapper));
    const lineEval = line()
      .x(d => d.x)
      .y(d => d.y);
    
    const path = svg.selectAll('newPath')
      .data(paths)
      .enter().append('path')
        .attr('class', 'newPath')
        .attr('d', d => lineEval(d))
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .attr('opacity', 0.1);
    path.enter()[0].forEach(function(d) {
      console.log(d.__data__);
    });
    const circ = svg.selectAll('circle')
      .data(paths)
      .enter().append('circle')
        .attr('cx', d => d[0].x)
        .attr('cy', d => d[0].y)
        .attr('r', 5)
        .attr('fill', '#d2a000')
        .attr('opacity', 1)
        .transition()
          .delay(200 / speedUp)
          .duration(1000 / speedUp)
          .ease(easeLinear)
          //.attrTween('transform', (d, i) => {
          //  return translateAlong(select(`.newPath:nth-child(${i + 2})`).node());
          //})
          //.on('end', (d, i) => select(`.newPath:nth-child(${i + 1})`).node().remove())
          .remove();

    function translateAlong(path) {
      const l = path.getTotalLength();
      return function(d, i, a) {
        return function(t) {
          const p = path.getPointAtLength(t * l);
          return `translate(${p.x - paths[i][0].x}, ${p.y - paths[i][0].y})`;
        };
      };
    }

    return mean;
  }

  simulateDraw() {
    const {
      dist,
      distFuncs
    } = this.state;
    const distFunc = distFuncs[dist];
    const distFuncArgs = Object.values(distFunc.parameters).map(d => Number(d.value));

    // A few scales. Note we're sampling from the censored distribution.
    const distFuncMin = distFunc.df.cdf(distFunc.domain[0], ...distFuncArgs);
    const distFuncMax = distFunc.df.cdf(distFunc.domain[1], ...distFuncArgs);
    const valScale = scaleLinear()
      .domain([0, 1])
      .range([distFuncMin, distFuncMax]);

    // Getting the coordinates
    const value = valScale(Math.random());
    const invValue = distFunc.df.inv(value, ...distFuncArgs);

    return invValue;
  }

	render() {
		const {
      height,
      width,
			margin,
		} = this.props;

		const {
      leftWidth,
      leftPlotWidth,
			dist,
      distFuncs,
      support,
      barData,
      speedUp,
      bins,
      numSims
    } = this.state;
    
    const xScale = scaleLinear()
      .domain(distFuncs[dist].domain)
      .range([margin.left, leftPlotWidth]);
    const yScale = scaleLinear()
      .domain([0, distFuncs[dist].max])
      .range([height * 0.45 - margin.bottom, margin.top]);

		return (
      <div className="flex">
        <svg width={leftWidth} height={height} ref="wrapper">
          <foreignObject x={0} y={0} width={leftWidth} height={height}>
            <Clt
              height={height}
              axisHeight={0.1 * height}
              width={leftWidth}
              margin={{top: margin.top, right: 0, bottom: margin.bottom, left: margin.left}}
              dist={dist}
              distFuncs={distFuncs}
              support={support}
              >
              <BarChart
                barData={barData}
                xScale={xScale}
                yScale={yScale}
                distFunc={distFuncs[dist]}
                bins={bins}
              />
            </Clt>
          </foreignObject>
        </svg>
          <div className="relative">
            <DropdownSlider       
              height={height}
              width={width - leftPlotWidth - margin.left - margin.right}
              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: 0}}
              dist={dist}
              distFuncs={distFuncs}
              support={support}
              changeDist={(value) => {this.setState({dist: value, barData: []})}}
              changeDistFunc={(key, value) => this.setState({[key]: Number(value), barData: []})}
              />
            <SimMenu
              height={height}
              width={width - leftPlotWidth - margin.left - margin.right}
              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: 0}}
              bins={bins}
              changeBins={(value) => this.setState({bins: Number(value)})}
              speed={speedUp}
              changeSpeed={(value) => this.setState({speedUp: Number(value)})}
              numSims={numSims}
              changeSims={(value) => this.setState({numSims: Number(value)})}
              simFunc={() => {this.sampleMultiple(numSims, speedUp)}}
              clearFunc={() => {this.setState({barData: []})}}
              />
          </div>
      </div>
		);
	}
}