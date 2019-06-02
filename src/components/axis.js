import React, {Component} from 'react';
import {axisLeft, axisBottom, axisRight} from 'd3-axis';
import {select} from 'd3-selection';

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const {
      which,
      scale,
      transform
    } = this.props;
    const axis = (which === 'x' ? axisBottom : which === 'y' ? axisLeft : axisRight)(scale);
    
    if (which === 'y'){
      axis.tickFormat("");
    }
    select(this.axisG).call(axis);
  }

  render() {
    const {
      which,
      transform
    } = this.props;

    return (
      <g
        className={`axis-container ${which}-axis`}
        ref={x => {this.axisG = x}}
        transform={`translate(${transform.x}, ${transform.y})`}
      />
    );
  }
}