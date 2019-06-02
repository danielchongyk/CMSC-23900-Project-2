import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import {line} from 'd3-shape';
import {interpolate} from 'd3-interpolate';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {easeLinear} from 'd3-ease';
import {scaleLinear} from 'd3-scale';
import Simulation from './simulation.js';
import DropdownSlider from './dropdown-slider.js'
import BarChart from './bar-chart.js'

function checkUndefined(arr) {
  return arr.reduce((acc, cur) => {
    return acc && Object.values(cur).reduce((a, c) => {
      return a && (typeof c !== 'undefined');
    }, true)
  }, true);
}

export default class SimulationDemo extends Component {
	constructor() {
		super();
		const support = [
			'unif',
			'exp',
			'norm',
			'chisq'
		];

		this.state = {
			dist: 'norm',
      support,
      distFuncs: {
        unif: uniform,
        exp: exponential,
        norm: normal,
        chisq: chisquared
      },
      barData: []
		};
	}

	state = {
		dist: null,
		distFuncs: null,
    support: null,
    barData: null
  }

  sampleMultiple(count, speed) {
    const {barData} = this.state;
    // Simulate animate multiple circles.
    [... new Array(count)].forEach(() => {
      barData.push(this.animateCircles(speed));
    })
    setTimeout(this.setState({barData}), 1000 / speed);
  }
  
  animateCircles(speed) {
    let sim = this.simulateDraw();
    let point = sim.path;
    let count = 0;

    // Simulate until not undefined.
    while (!checkUndefined(point) && count <= 3) {
      sim = this.simulateDraw();
      point = sim.path;
      count++;
    }
    if (count > 3) {
      return null;
    }

    // Proceed with drawing the circles.
    const svg = select(ReactDOM.findDOMNode(this.refs.wrapper));
    const lineEval = line()
      .x(d => d.x)
      .y(d => d.y);

    const path = svg.append('path')
      .attr('d', lineEval(point))
      .attr('fill', 'none');

    const circ = svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', '#d2a000')
      .transition()
        .delay((d, i) => 10 * i)
        .duration(1000 / speed)
        .ease(easeLinear)
        .attrTween('transform', translateAlong(path.node()))
        .on('end', () => path.remove())
        .remove();

    function translateAlong(path) {
      const l = path.getTotalLength();
      return function(d, i, a) {
        return function(t) {
          const p = path.getPointAtLength(t * l);
          return `translate(${p.x}, ${p.y})`;
        };
      };
    }

    return sim.value;
  }

  simulateDraw() {
		const {
			height,
			width,
			margin,
    } = this.props;

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
    const xScale = scaleLinear()
      .domain(distFunc.domain)
      .range([50, 0.65 * 600]);
    const yScale = scaleLinear()
      .domain([0, 1])
      .range([height / 2 - 10, 20]);

    // Getting the coordinates
    const value = valScale(Math.random());
    const invValue = distFunc.df.inv(value, ...distFuncArgs);
    const startX = 0.65 * 600 + 50;
    const startY = yScale(value);
    const midX = xScale(invValue);
    const endY = height - 20;

    return {
      path: [
        {x: startX, y: startY},
        {x: midX, y: startY},
        {x: midX, y: endY}
      ],
      value: invValue
    };
  }

	render() {
		const {
			height,
			width,
			margin,
		} = this.props;

		const {
			dist,
      distFuncs,
      support,
      barData
    } = this.state;
    
    const xScale = scaleLinear()
      .domain(distFuncs[dist].domain)
      .range([50, 0.65 * 600]);
    const yScale = scaleLinear()
      .domain([0, distFuncs[dist].max])
      .range([height / 2 - 10, 20]);
    const bins = 10;

		return (
      <div className="flex">
        <svg width={width} height={height} ref="wrapper"
          onClick={() => {this.sampleMultiple(20, 2)}}>
          <foreignObject x={0} y={0} width={width} height={height}>
            <Simulation
              height={height / 2}
              width={600}
              margin={{top: 20, right: 0, bottom: 10, left: 50}}
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
            </Simulation>
          </foreignObject>
        </svg>
          <DropdownSlider       
            height={height}
            width={0.5 * width - margin.left - margin.right}
            margin={{top: 20, right: margin.right, bottom: margin.bottom, left: margin.left}}
            dist={dist}
            distFuncs={distFuncs}
            support={support}
            changeDist={(value) => {this.setState({dist: value, barData: []})}}
            changeDistFunc={(key, value) => this.setState({[key]: Number(value), barData: []})}
            />
      </div>
		);
	}
}