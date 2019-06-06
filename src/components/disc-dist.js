import React, {Component} from 'react';
import {binomial} from '../constants.js';
import DiscreteSimulator from './discrete.js';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import DropdownSlider from './dropdown-slider.js';

export default class DiscDist extends Component {
  constructor() {
    super();
    const support = [
      'bino'
    ];

    this.state = {
      dist: 'bino',
      support,
      distFuncs: {
        bino: binomial
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

    return (
      <div className="flex" style={{width:"50%", height: `${height}px`}}>
        <DiscreteSimulator
          height={height}
          width={0.65 * width}
          margin={{top: margin.top, right: 0, bottom: margin.bottom, left: margin.left}}
          distFunc={distFunc}
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