import React, {Component} from 'react';
import {uniform, exponential, normal, chisquared} from '../constants.js';
import DistSimulator from './dist-simulator.js';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import Slider from './slider.js';

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
      unif: uniform,
      exp: exponential,
      norm: normal,
      chisq: chisquared
    };
  }

  state = {
    dist: null,
    support: null,
    unif: null,
    exp: null,
    norm: null,
    chisq: null
  }

  render() {
    const {
      height,
      width,
      margin
    } = this.props;

    const {
      dist,
      support
    } = this.state;

    const distFunc = this.state[dist];

    return (
      <div className="flex">
        <DistSimulator
          distFunc={distFunc}
        />
        <div className="relative">
          <DropdownButton
            id="nav-dropdown"
            title={distFunc.disp}
            >
            {
              support.map(elt => {
                return (
                  <Dropdown.Item
                    key={elt}
                    eventKey={elt}
                    onSelect={(event) => {this.setState({dist: elt})}}
                    >
                    {this.state[elt].disp}
                  </Dropdown.Item>
                );
              })
            }
          </DropdownButton>
          {Object.keys(distFunc.parameters).map(d => {
              return (<Slider
                key={d}
                value={distFunc.parameters[d].value}
                range={distFunc.parameters[d].range}
                stepSize={0.01}
                onChange={x => {
                  distFunc.parameters[d].value = x;
                  this.setState({[dist]: distFunc});
                }}
                sliderName={distFunc.parameters[d].name}
              />);
            })}
        </div>
      </div>
    );
  }
}