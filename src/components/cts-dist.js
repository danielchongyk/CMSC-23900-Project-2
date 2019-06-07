import React, {Component} from 'react';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import {scaleLinear} from 'd3-scale'
import DistSimulator from './dist-simulator.js';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import DropdownSlider from './dropdown-slider.js';

export default class CtsDist extends Component {
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
      }
    };
  }

  state = {
    dist: null,
    support: null,
    distFuncs: null
  }

  render() {
    const {
      height,
      width,
      margin
    } = this.props;

    const {
      dist,
      distFuncs,
      support
    } = this.state;

    const distFunc = distFuncs[dist];

    const yScale = scaleLinear()
      .domain([0, distFunc.max])
      .range([height - margin.bottom, margin.top]);

    return (
      <div className="flex" style={{width:"50%", height: `${height}px`}}>
        <DistSimulator
          height={height}
          width={0.65 * width}
          margin={{top: margin.top, right: 0, bottom: margin.bottom, left: margin.left}}
          distFunc={distFunc}
          yScale={yScale}
          which="pdf"
        />
        <DropdownSlider       
          height={height}
          width={0.35 * width}
          margin={{top: margin.top, right: margin.right, bottom: margin.bottom, left: margin.left}}
          dist={dist}
          distFuncs={distFuncs}
          support={support}
          changeDist={(value) => {this.setState({dist: value})}}
          changeDistFunc={(key, value) => this.setState({[key]: Number(value)})}
          />
      </div>
    );
  }
}