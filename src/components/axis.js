import React, {Component} from 'react';
import {axisLeft, axisBottom} from 'd3-axis';
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
    const axis = (which === 'x' ? axisBottom : axisLeft)(scale)
      .tickFormat("");
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