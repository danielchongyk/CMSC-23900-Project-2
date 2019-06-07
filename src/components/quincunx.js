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
import BarChart from './bar-chart.js';
import SimMenu from './sim-menu.js'

function polarToCart(center, angle, radius) {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y - radius * Math.sin(angle)
  };
}

function calculateArc(center, radius, direction) {
  const ticks = 10;

  const angleScale = scaleLinear()
    .domain([0, ticks - 1])
    .range([Math.PI / 2, Math.PI / 2 - direction * Math.PI / 2]);

  const anglePath = [... new Array(ticks)].map((d, i) => {
    return angleScale(i);
  });

  // Get the path.
  return anglePath.map((d) => {
    return polarToCart(center, d, radius);
  })
}

export default class Quincunx extends Component {
	constructor(props) {
    super(props);

    const {width} = this.props;

    const leftWidth = 0.9 * width;
    const leftPlotWidth = 0.65 * leftWidth;

	this.state = {
      leftWidth,
      histHeight: 300,
      leftPlotWidth,
      barData: [],
      speedUp: 1,
      layers: 3,
      bins: 3,
      pegRad: 30,
      levelX: 50,
      levelY: 50,
		};
	}

	state = {
    leftWidth: null,
    histHeight: null,
		leftPlotWidth: null,
		barData: null,
    speedUp: null,
    layers: null,
    bins: null,
    pegRad: null,
    levelX: null,
    levelY: null
	}

	animateCircles() {
		// setting some variables and scales
		const {
	      height,
	      width,
		  	margin,
		} = this.props;

		const {
	      leftWidth,
        histHeight,
        leftPlotWidth,
	      barData,
	      speedUp,
        layers,
        pegRad,
        levelX,
        levelY
      } = this.state;

		const xScale = scaleLinear()
				.domain([-levelX * Math.pow(2, layers), levelX * Math.pow(2, layers)])
				.range([margin.left, leftPlotWidth - margin.right]);
		const yScale = scaleLinear()
				.domain([0, levelY * layers])
        .range([margin.top, height - margin.bottom - histHeight]);
    const lineEval = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    const shotRad = levelX - pegRad;

		// Setting the path points
    const point = this.simulatePath();
    console.log(point)
		// create circle and make it transform along the path
		// copied the code from clt-sim and simulation-demo, but not sure
    const svg = select(ReactDOM.findDOMNode(this.refs.wrapper));

    const path = svg.append('path')
      .attr('d', lineEval(point))
      .attr('fill', 'none')
      .attr('stroke', 'gray');

		const circ = svg.append('circle')
      .attr('cx', xScale(0))
      .attr('cy', yScale(0))
      .attr('r', shotRad)
      .attr('fill', '#d2a000')
      .transition()
        .delay(200 / speedUp)
        .duration(100 / speedUp / layers)
        .ease(easeLinear)
        .attrTween('transform', translateAlong(path.node()))
        .on('end', () => path.remove())
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
  
  simulatePath() {
    const {layers, levelX, levelY} = this.state;
    const path = [... new Array(layers)].map(() => {
      return 2 * Math.round(Math.random()) - 1;
    });

    // Let each peg be spaced levelX horizontally and levelY vertically.
    // Generate the initial path. (note we will translate everything later.)
    const mainPoints = path.reduce((acc, cur) => {
      const prev = acc[acc.length - 1];
      const anglePath = calculateArc({
        x: prev.x,
        y: prev.y + levelX
      }, levelX, cur);
      acc.push(...anglePath);

      acc.push({
        x: prev.x + cur * levelX,
        y: prev.y + levelY
      })
      return acc;
    }, [{x: 0, y: 0}]);

    return mainPoints;
  }

	render() {
		const {
	    height,
	    width,
		  margin,
		} = this.props;

		const {
        leftWidth,
        histHeight,
	      leftPlotWidth,
	      barData,
	      speedUp,
	      bins
    	} = this.state;

	    const xScale = scaleLinear()
	    	.domain([0,1])
	    	.range([margin.left, leftPlotWidth]);
	    const yScale = scaleLinear()
	    	.domain([0,1])
	    	.range([margin.top*1.5,height - margin.bottom- histHeight]);

	    const level = bins;
	    const spacing = 0.8/ (bins*2);

	    const strokew = (height - margin.bottom * 2.5 - histHeight) / (bins+1);

	    let data = (new Array(bins+1).fill(0)).map((d,i) => (1/2 - i * spacing));
	    const triangles = data.map(function(start, i) {
	    	const starting = start;
	    	console.log(starting);
	    	const arr = new Array(i+1).fill(0);
	    	const result = arr.map((d,j) => (starting+ j * 2 * spacing));
	    	return result;
	    })
	    const triangledata = [];
	   	triangles.forEach(function(row,i) {
	   		row.forEach(function createcoord(element) {
	   			triangledata.push({x:element, y: i/level})
	   		})
	   	})
			// console.log('triangles:\n');
			// console.log(triangles);
       console.log(triangledata)

		return (
	    <div className="flex">
	      <svg width={leftWidth} height={height} ref="wrapper"
          onClick={() => this.animateCircles()}>
          <g className="plot-container"
                ref="plotContainer">
                {this.props.children}
                {
                triangledata.map((d, idx) => {
                return (
                  // <path
                  //   key={idx}
                  //   fill="#d2a000"
                  //   className="dist-plot"
                  //   stroke="steelblue"
                  //   strokeWidth={strokew/1.8}
                  //   fill="steelblue"
                  //   opacity="1"
                  //   d = {'M ' + xScale(d.x) +' '+ yScale(d.y) + ' l 0.1 0.1 l -0.2 0 z'}
                  //   />
                  <circ
                    key={idx}
                    fill='steelblue'
                    className='peg'
                    x={xScale(d.x)}
                    y={yScale(d.y)}
                    cx={pegRad}
                    cy={pegRad}
                  />
                    )
                })
              }
          	  </g>
	        </svg>
	          <div className="relative">
	            <SimMenu
	              height={height}
	              width={width - leftPlotWidth - margin.left - margin.right}
	              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
	              bins={bins}
	              changeBins={(value) => this.setState({bins: Number(value)})}
	              speed={speedUp}
	              changeSpeed={(value) => this.setState({speedUp: Number(value)})}
	              simFunc={() => {this.sampleMultiple(numSims, speedUp)}}
	              clearFunc={() => {this.setState({barData: []})}}
	              />
	          </div>
	      </div>
			);
		}
}
