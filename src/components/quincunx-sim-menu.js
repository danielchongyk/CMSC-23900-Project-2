import React, {Component} from 'react';
import {Button, ButtonToolbar, InputGroup, FormControl} from 'react-bootstrap';

export default class QsimMenu extends Component {
	constructor() {
    super();

		this.state = {
		};
	}

	state = {
  }

  clamp(value, min, max) {
    if (Number(value) < min) {
      value = min;
      return(min);
    } else if (Number(value) > max) {
      value = max;
      return(max);
    }
    
    return Number(value);
  }

	render() {
		const {
			height,
			width,
      margin,
      sims,
      changeSims,
      bins,
      changeBins,
      speed,
      changeSpeed,
      simFunc,
      clearFunc
		} = this.props;

    const simMin = 1;
    const simMax = 20;
    const binMin = 1;
    const binMax = 20;
    const speedMin = 0.1;
    const speedMax = 10;

		return (
      <div
        className="relative"
        style={{
          width:`${width}px`,
          height:`${height}px}`,
          margin:`${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
        }}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Number of Sims</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={"simInput"}
            min={simMin} max={simMax} type="number" step="1"
            defaultValue={sims}
            aria-label="NumSims"
            aria-describedby="basic-addon1"
            onChange={() => changeSims(this.clamp(this.refs.simInput.value, simMin, simMax))}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Number of Bins</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={"binInput"}
            min={binMin} max={binMax} type="number" step="1"
            defaultValue={bins}
            aria-label="NumBins"
            aria-describedby="basic-addon1"
            onChange={() => changeBins(this.clamp(this.refs.binInput.value, binMin, binMax))}
          />
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Speed</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={"speedInput"}
            min={speedMin} max={speedMax} type="number" step="0.1"
            defaultValue={speed}
            aria-label="speed"
            aria-describedby="basic-addon1"
            onChange={() => changeSpeed(this.clamp(this.refs.speedInput.value, speedMin, speedMax))}
            />
        </InputGroup>
        <ButtonToolbar>
          <Button
            id="nav-dropdown"
            size="lg"
            onClick={() => simFunc()}
            block>
            Simulate
          </Button>
          <Button
            id="nav-dropdown"
            size="lg"
            onClick={() => clearFunc()}
            block>
            Clear
          </Button>
        </ButtonToolbar>
      </div>
		);
	}
}