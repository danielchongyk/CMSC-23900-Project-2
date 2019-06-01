import React from 'react';
import {csv} from 'd3-fetch';
import ExampleChart from './example-chart';
import DistSimulator from './dist-simulator';

const longBlock = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

class RootComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      distSimDist: null,
      loading: true
    };
  }

  componentWillMount() {
    this.setState({
      distSimDist: 'normal',
      loading: false
    });
  }

  render() {
    const {distSimDist, loading, data} = this.state;
    if (loading) {
      return <h1>LOADING</h1>;
    }
    return (
      <div className="main">
        <h1>Simulation and the Central Limit Theorem</h1>
        <div>{`In 1873, Sir Francis Galton created the device you saw above, known as the quincunx, \
               in an attempt to help his cousin Darwin in his defense of the theory of natural selection. \
               The machine served its original purpose well, seeing how popular Darwin's theories are today, \
               but it continues to be called on today to illustrate other statistical principles. In this article, \
               we will delve into the statistical principles that underly the famous quincunx, and in doing so,
               we will also show how our "quincunx" isn't necessarily unique!`
          }</div>
        <div className="relative">
        <h2>Probability Distributions</h2>
          <div className="flex">
            <div>{`Before we can dive into the main statistical theory that drives the way that the quincunx \
                   works, we first need to talk about probability distributions. Loosely speaking, a probability
                   distribution is a function that assigns a set of objects various probabilities. For example,
                   imagine you flip a coin. Then, your probability distribution function
                   will assign to heads a probability of 1/2 and to tails a probability of 1/2 as well (assuming your coin
                   isn't biased, of course!) This is an example of what's known as a Bernoulli distribution, which
                   is specifically a probability function on two events: one "success" and one "failure". Of course,
                   mathematicians over the years have come up with loads of different probability distributions. Try
                   plotting out a few of them to the right (you can even change the parameters for these functions!)`}</div>
            <DistSimulator
              dist={distSimDist}
              onChange={x => this.setState({dist: x})}
            />
          </div>
        </div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
