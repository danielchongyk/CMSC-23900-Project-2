import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {uniform, exponential, normal, chisquared, beta, gamma, centralF} from '../constants.js';
import {line} from 'd3-shape';
import {interpolate} from 'd3-interpolate';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {easeLinear} from 'd3-ease';
import {scaleLinear} from 'd3-scale';
import {interpolateSpectral} from 'd3-scale-chromatic';
import Clt from './clt.js';
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

export default class CltSim extends Component {
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
      numTrials: 10,
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
    numTrials: null,
    numSims: null,
    running: null
  }

  sampleMultiple() {
    const {speedUp, numTrials, numSims} = this.state;
    // Simulate animate multiple circles.
    this.setState({running: true})
    this.animateCircles(numTrials, (value) => this.setState({barData: value}), numSims, 0,
                        (a, b, c, d, e, f) => this.animateCircles(a, b, c, d, e, f),
                        () => this.setState({running: false}));
  }
  
  animateCircles(num, onEnd, simTot, simNum, contFunc, stopFunc) {
    // Import constants
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
      speedUp
    } = this.state;
    const color = interpolateSpectral(simNum / (simTot - 1));

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
        {x: meanScaled, y: endY}
      ];
    });

    const meanPath = [
      {x: meanScaled, y: endY},
      {x: meanScaled, y: endMeanY}
    ];

    // Proceed with drawing the circles.
    const svg = select(ReactDOM.findDOMNode(this.refs.wrapper));
    const lineEval = line()
      .x(d => d.x)
      .y(d => d.y);

    paths.forEach((point, i) => {
      const path = svg.append('path')
        .attr('d', lineEval(point))
        .attr('fill', 'none');

      const circ = svg.append('circle')
        .attr('cx', point[0].x)
        .attr('cy', point[0].y)
        .attr('r', 5)
        .attr('fill', color)
        .attr('stroke', '#d2a000')
        .transition()
          .delay(200 / speedUp)
          .duration(500 / speedUp)
          .ease(easeLinear)
          .attrTween('transform', translateAlong(path.node()))
          .on('end', () => {
            path.remove();
            if (i === num - 1) {
              drawMeanPath();
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
    });

    function drawMeanPath() {
      const path = svg.append('path')
        .attr('d', lineEval(meanPath))
        .attr('fill', 'none');

      const circ = svg.append('circle')
        .attr('cx', meanPath[0].x)
        .attr('cy', meanPath[0].y)
        .attr('r', 5)
        .attr('fill', '#d2a000')
        .transition()
          .delay(100 / speedUp)
          .duration(500 / speedUp)
          .ease(easeLinear)
          .attrTween('transform', translateAlong(path.node()))
          .on('end', () => {
            path.remove();
            barData.push(mean);
            onEnd(barData);
            if (simNum < simTot - 1) {
              contFunc(num, onEnd, simTot, simNum + 1, contFunc, stopFunc);
            } else {
              stopFunc();
            }
          });
          //.remove();

      function translateAlong(path) {
        const l = path.getTotalLength();
        return function(d, i, a) {
          return function(t) {
            const p = path.getPointAtLength(t * l);
            return `translate(${p.x - meanPath[0].x}, ${p.y - meanPath[0].y})`;
          };
        };
      }        
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
    const value = Math.random();
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
      numSims,
      numTrials,
      running
    } = this.state;
    
    const distFunc = distFuncs[dist];
    const distParams = Object.values(distFunc.parameters).map(d => Number(d.value));
    const peak = 1 / (Math.sqrt(2 * Math.PI * distFunc.df.variance(...distParams) / numTrials));
    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([margin.left, leftPlotWidth]);
    const yScale = scaleLinear()
      .domain([0, peak / 0.5])
      .range([0.45 * height - margin.bottom, margin.top]);

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
              numTrials={numTrials}
              bottomScale={yScale}
              >
              <BarChart
                barData={barData}
                xScale={xScale}
                yScale={yScale}
                distFunc={distFuncs[dist]}
                bins={bins}
                truncate={false}
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
              numTrials={numTrials}
              changeTrials={(value) => this.setState({barData: [], numTrials: Number(value)})}
              simFunc={() => {this.sampleMultiple()}}
              clearFunc={() => {this.setState({barData: []})}}
              running={running}
              />
          </div>
      </div>
		);
	}
}
