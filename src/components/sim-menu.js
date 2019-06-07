import React, {Component} from 'react';
import {Button, ButtonToolbar, InputGroup, FormControl} from 'react-bootstrap';

export default class SimMenu extends Component {
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
      bins,
      changeBins,
      speed,
      changeSpeed,
      numSims,
      changeSims,
      numTrials,
      changeTrials,
      simFunc,
      clearFunc,
      running
		} = this.props;

    const binMin = 1;
    const binMax = 40;
    const simMin = 1;
    const simMax = 100;
    const speedMin = 0.1;
    const speedMax = 20;
    const trialsMin = 1;
    const trialsMax = 50;

    const trialCheck = [];
    if (numTrials) {
      trialCheck.push(0);
    }

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
            defaultValue={numSims}
            aria-label="NumSims"
            aria-describedby="basic-addon1"
            disabled={running}
            onChange={() => changeSims(this.clamp(this.refs.simInput.value, simMin, simMax))}
          />
          {
            trialCheck.map((d) => {
              return (
                <InputGroup.Prepend key={d}>
                  <InputGroup.Text id="basic-addon1">Number of Trials</InputGroup.Text>
                </InputGroup.Prepend>
                );
            })
          }
          {
            trialCheck.map((d) => {
              return (
                <FormControl
                  key={d}
                  ref={"trialInput"}
                  min={trialsMin} max={trialsMax} type="number" step="1"
                  defaultValue={numTrials}
                  aria-label="NumTrials"
                  aria-describedby="basic-addon1"
                  disabled={running}
                  onChange={() => changeTrials(this.clamp(this.refs.trialInput.value, trialsMin, trialsMax))}
                />);
            })
          }
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
            disabled={running}
            block>
            {!running ? 'Simulate' : 'Running...'}
          </Button>
          <Button
            id="nav-dropdown"
            size="lg"
            onClick={() => clearFunc()}
            disabled={running}
            block>
            {!running ? 'Clear' : 'Running...'}
          </Button>
        </ButtonToolbar>
      </div>
		);
	}
}