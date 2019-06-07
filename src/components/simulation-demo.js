import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {uniform, exponential, normal, chisquared, beta, gamma, centralF} from '../constants.js';
import {line} from 'd3-shape';
import {interpolate} from 'd3-interpolate';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {easeLinear} from 'd3-ease';
import {scaleLinear} from 'd3-scale';
import Simulation from './simulation.js';
import DropdownSlider from './dropdown-slider.js';
import BarChart from './bar-chart.js';
import SimMenu from './sim-menu.js';

function checkUndefined(arr) {
  return arr.reduce((acc, cur) => {
    return acc && Object.values(cur).reduce((a, c) => {
      return a && (typeof c !== 'undefined');
    }, true)
  }, true);
}

export default class SimulationDemo extends Component {
	constructor(props) {
    super(props);
    
    const {width} = this.props;

		const support = [
      'unif',
      'beta',
      'exp',
      'gamma',
      'norm',
      'chisq',
      'centralF'
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
        beta,
        exp: exponential,
        gamma,
        norm: normal,
        chisq: chisquared,
        centralF
      },
      barData: [],
      speedUp: 1,
      bins: 10,
      numSims: 20,
      running: false
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
    numSims: null,
    running: null
  }

  sampleMultiple() {
    const {speedUp, numSims} = this.state;
    // Simulate animate multiple circles.
    this.setState({running: true})
    // Simulate animate multiple circles.
    this.animateCircles((value) => this.setState({barData: value}), numSims, 0,
                        (a, b, c, d, e) => this.animateCircles(a, b, c, d, e),
                        () => this.setState({running: false}));

  }
  
  animateCircles(onEnd, simTot, simNum, contFunc, stopFunc) {
		const {
			height,
			width,
			margin,
    } = this.props;

    const {
      barData,
      leftPlotWidth,
      dist,
      distFuncs,
      speedUp,
    } = this.state;

    const distFunc = distFuncs[dist];
    const distFuncArgs = Object.values(distFunc.parameters).map(d => Number(d.value));

    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([margin.left, leftPlotWidth]);
    const yScale = scaleLinear()
      .domain([0, 1])
      .range([height / 2 - margin.bottom, margin.top]);

    const sim = this.simulateDraw();
    const startX = margin.left;
    const startY = yScale(sim.value);
    const midX = xScale(sim.invValue);
    const endY = height / 2 + yScale(0);

    const point = [
      {x: startX, y: startY},
      {x: midX, y: startY},
      {x: midX, y: endY}
    ];

    // Proceed with drawing the circles.
    const svg = select(ReactDOM.findDOMNode(this.refs.wrapper));
    const lineEval = line()
      .x(d => d.x)
      .y(d => d.y);

    const path = svg.append('path')
      .attr('d', lineEval(point))
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('opacity', 0.5);

    const circ = svg.append('circle')
      .attr('cx', point[0].x)
      .attr('cy', point[0].y)
      .attr('r', 5)
      .attr('fill', '#d2a000')
      .transition()
        .delay(200 / speedUp)
        .duration(1000 / speedUp)
        .ease(easeLinear)
        .attrTween('transform', translateAlong(path.node()))
        .on('end', () => {
          path.remove();
          barData.push(sim.invValue);
          onEnd(barData);
          if (simNum < simTot - 1) {
            contFunc(onEnd, simTot, simNum + 1, contFunc, stopFunc)
          } else {
            stopFunc();
          }
        })
        .remove();

    function translateAlong(path) {
      const l = path.getTotalLength();
      return function(d, i, a) {
        return function(t) {
          const p = path.getPointAtLength(t * l);
          return `translate(${p.x - point[0].x}, ${p.y - point[0].y})`;
        };
      };
    }
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

    return {value, invValue};
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
      numSims,
      running
    } = this.state;

    const xScale = scaleLinear()
      .domain(distFuncs[dist].domain)
      .range([margin.left, leftPlotWidth]);
    const yScale = scaleLinear()
      .domain([0, distFuncs[dist].max])
      .range([height / 2 - margin.bottom, margin.top]);

		return (
      <div className="flex">
        <svg width={leftWidth} height={height} ref="wrapper">
          <foreignObject x={0} y={0} width={leftWidth} height={height}>
            <Simulation
              height={height / 2}
              width={leftWidth}
              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
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
                truncate={true}
              />
            </Simulation>
          </foreignObject>
        </svg>
          <div className="relative">
            <DropdownSlider       
              height={height}
              width={width - leftPlotWidth - margin.left - margin.right}
              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
              dist={dist}
              distFuncs={distFuncs}
              support={support}
              changeDist={(value) => {this.setState({dist: value, barData: []})}}
              changeDistFunc={(key, value) => this.setState({[key]: Number(value), barData: []})}
              />
            <SimMenu
              height={height}
              width={width - leftPlotWidth - margin.left - margin.right}
              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
              bins={bins}
              changeBins={(value) => this.setState({bins: Number(value)})}
              speed={speedUp}
              changeSpeed={(value) => this.setState({speedUp: Number(value)})}
              numSims={numSims}
              changeSims={(value) => this.setState({numSims: Number(value)})}
              simFunc={() => {this.sampleMultiple()}}
              clearFunc={() => {this.setState({barData: []})}}
              running={running}
              />
          </div>
      </div>
		);
	}
}