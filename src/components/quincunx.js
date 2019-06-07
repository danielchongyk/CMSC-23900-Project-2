import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {normal} from 'jStat';
import {line} from 'd3-shape';
import {interpolate} from 'd3-interpolate';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {easeLinear} from 'd3-ease';
import {scaleLinear, scaleBand} from 'd3-scale';
import Simulation from './simulation.js';
import BarChart from './bar-chart.js';
import QsimMenu from './quincunx-sim-menu.js';
import Axis from './axis.js';

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
    const leftPlotWidth = 0.65 * width;

  	this.state = {
      histHeight: 300,
      leftPlotWidth,
      barData: [],
      speedUp: 1,
      numSims: 20,
      bins: 10,
      pegRad: 6,
      levelX: 10,
      levelY: 10,
      running: false
    };
	}

	state = {
    histHeight: null,
		leftPlotWidth: null,
		barData: null,
    speedUp: null,
    numSims: null,
    bins: null,
    pegRad: null,
    levelX: null,
    levelY: null,
    running: null
  }

  createHist(bins, barData){
    const total = barData.length;
    const bincountinit = new Array(bins).fill(0).map((d,i) => i)
    const perbincount = bincountinit.map(d => 
      barData.filter(element => (element == d)).length);
    if (total == 0){
      const arr = perbincount.map((d, i) => {
        return {
          value: 0,
          x: i
        }
      });
      return arr;
    }
    else {
      const arr = perbincount.map((d, i) => {
        return {
          value: d / total,
          x: i
        }
      });
      return arr;
    }
}

	animateCircles(count) {
		// setting some variables and scales
		const {
	      height,
	      width,
		  	margin,
		} = this.props;

		const {
        histHeight,
        leftPlotWidth,
	      barData,
	      speedUp,
        bins,
        pegRad,
        levelX,
        levelY,
        running
    } = this.state;

    this.setState({running: true});

    const lineEval = line()
      .x(d => d.x)
      .y(d => d.y);
		const xScale = scaleLinear()
				.domain([-levelX * bins, levelX * bins])
				.range([margin.left, leftPlotWidth - margin.right]);
		const yScale = scaleLinear()
				.domain([0, levelY * (bins - 1)])
        .range([margin.top, height - margin.bottom - histHeight]);

    const shotRad = pegRad;

		// Setting the path points
    const simulations = [... new Array(count)].map(() => this.simulatePath());
    const point = simulations.map(d => d.path);
		// create circle and make it transform along the path
		// copied the code from clt-sim and simulation-demo, but not sure
    const svg = select(ReactDOM.findDOMNode(this.refs.wrapper));

    point.forEach((d, i) => {
      const path = svg.append('path')
        .attr('d', lineEval(d))
        .attr('fill', 'none');

      const circ = svg.append('circle')
        .attr('cx', xScale(0))
        .attr('cy', yScale(0))
        .attr('r', shotRad)
        .attr('fill', '#d2a000')
        .attr('opacity', 0.8)
        .transition()
          .attr('opacity', 1)
          .delay((200 + i * 100) / speedUp)
          .duration(100 / speedUp * bins)
          .ease(easeLinear)
          .attrTween('transform', translateAlong(path.node()))
          .on('end', () => {
            path.remove();
            barData.push(simulations[i].binVal);
            this.setState({barData});
            if (i === count - 1) {
              this.setState({running: false});
            }
          })
          .remove();      
    })

		function translateAlong(path) {
			const l = path.getTotalLength();
			return function(d, i, a) {
				return function(t) {
					const p = path.getPointAtLength(t * l);
					return `translate(${p.x - xScale(0)}, ${p.y - yScale(0)})`;
				};
			};
		}

  }
  
  simulatePath() {
    const {height, margin} = this.props;
    const {histHeight, leftPlotWidth, bins, levelX, levelY} = this.state;
    const path = [... new Array(bins - 1)].map(() => {
      return 2 * Math.round(Math.random()) - 1;
    });

		const xScale = scaleLinear()
				.domain([-levelX * (bins - 1), levelX * (bins - 1)])
				.range([margin.left, leftPlotWidth - margin.right]);
		const yScale = scaleLinear()
				.domain([0, levelY * (bins - 1)])
        .range([margin.top, height - margin.bottom - histHeight]);

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

    const transformPoints = mainPoints.map(d => {
      return {
        x: xScale(d.x),
        y: yScale(d.y)
      };
    });
    const last = transformPoints[transformPoints.length - 1];
    transformPoints.push({x: last.x, y: height - margin.bottom});

    return {
      path: transformPoints,
      binVal: (path.reduce((acc, cur) => acc + cur, 0) + bins - 1) / 2
    };
  }

	render() {
		const {
	    height,
	    width,
		  margin,
		} = this.props;

		const {
      histHeight,
	    leftPlotWidth,
	    barData,
	    speedUp,
      bins,
      numSims,
      pegRad,
      levelX,
      levelY,
      running
    } = this.state;

		const xScale = scaleLinear()
				.domain([-levelX * bins, levelX * bins])
				.range([margin.left, leftPlotWidth - margin.right]);
		const yScale = scaleLinear()
				.domain([0, levelY * (bins - 1)])
        .range([margin.top, height - margin.bottom - histHeight]);

    const layers = bins - 1;
    const startOffset = pegRad * 2;

    const circleCenters = [];
    [... new Array(layers)].forEach((d, i) => {
      const numPegs = i + 1;
      const scale = scaleLinear()
        .domain([0, numPegs - 1])
        .range([- (numPegs - 1) * levelX, (numPegs - 1) * levelX]);

      [... new Array(numPegs)].forEach((cur, ind) => {
        circleCenters.push({
          x: xScale(scale(ind)),
          y: yScale(i * levelY)
        })
      })
    });

    const overallScale = scaleLinear()
      .domain([0, bins])
      .range([-bins * levelX, bins * levelX]);
    const binchart = this.createHist(bins, barData);

    const barScalex = scaleBand()
      .domain([... new Array(bins)].map((d, i) => i))
      .range([xScale(overallScale(0)), xScale(overallScale(bins))])
      .paddingInner(0);

    const barScaley = scaleLinear()
      .domain([0, 1])
      .range([histHeight - margin.bottom, 0]);

    // Create a normal distribution path.
    const numSample = 1000;
    const mean = bins * 0.5;
    const stdev = Math.sqrt(bins * 0.25);
    const xData = [... new Array(numSample)].map((d, i) => {
      return scaleLinear().domain([0, 1]).range([mean - 3 * stdev, mean + 3 * stdev])(i / (numSample - 1));
    });
    const yData = xData.map(d => {
      return normal.pdf(d, bins * 0.5, Math.sqrt(bins * 0.25));
    });
    const xNormScale = scaleLinear()
      .domain([Math.min(...xData), Math.max(...xData)])
      .range([margin.left, leftPlotWidth - margin.right])
    const data = xData.reduce((acc, cur, idx) => {
      acc.push({x: cur, y: yData[idx]})
      return acc;
    }, []);

    const lineEval = line().x(d => xNormScale(d.x)).y(d => height - histHeight + barScaley(d.y));

		return (
      <div className="flex">
	      <svg width={leftPlotWidth} height={height} ref="wrapper">
          <g className="plot-container"
                ref="plotContainer">
                {this.props.children}
                {
                  circleCenters.map((d, idx) => {
                    return (
                      <circle
                        key={idx}
                        fill='gray'
                        className='peg'
                        cx={d.x}
                        cy={startOffset + d.y}
                        r={pegRad}
                      />
                      );
                    }
                  )
                }
                {
                  binchart.map((d, idx) => {
                  // We calculate the corresponding bin for the truncated distribution.
                  return (
                    <rect
                      key={idx}
                      fill="#d2a000"
                      stroke='white'
                      x={barScalex(d.x)}
                      y={height - histHeight + barScaley(d.value)}
                      width={barScalex.bandwidth()}
                      height={histHeight - margin.bottom - barScaley(d.value)}
                    />
                  )
                  })
                }
              }
              <path
                d={lineEval(data)}
                stroke='black'
                fill='none'
                />
          	</g>
            <Axis
              which="x"
              scale={barScalex}
              transform={{x: 0, y: height - margin.bottom}}
              label={true}
              />
            <g className="Bottom"
              translate={`transform(${0}, ${height - histHeight})`}>
              {
                [... new Array(bins + 1)].map((d, idx) => {
                  return (
                    <line
                      key={idx}
                      stroke='gray'
                      strokeWidth={2}
                      className={'bin'}
                      x1={xScale(overallScale(idx))}
                      y1={height - margin.bottom}
                      x2={xScale(overallScale(idx))}
                      y2={height - histHeight}
                    />
                  )
                })
              }
            </g>
	        </svg>
	          <div className="relative">
	            <QsimMenu
	              height={height}
	              width={0.35 * width - margin.left - margin.right}
	              margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
	              sims={numSims}
	              changeSims={(value) => this.setState({numSims: Number(value), barData: []})}
	              bins={bins}
	              changeBins={(value) => {
                  this.setState({
                    bins: Number(value),
                    pegRad: ((height - margin.bottom * 4.5 - histHeight) / (2*(bins+1))),
                    barData: []
                  });
                }}
	              speed={speedUp}
	              changeSpeed={(value) => this.setState({speedUp: Number(value)})}
	              simFunc={() => {this.animateCircles(numSims)}}
	              clearFunc={() => {this.setState({barData: []})}}
                running={running}
	              />
	          </div>
	      </div>
			);
		}
}
