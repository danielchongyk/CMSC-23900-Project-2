import React from 'react';
import ReactDOM from 'react-dom';
import {csv} from 'd3-fetch';
import ExampleChart from './example-chart';
import CtsDist from './cts-dist.js';
import SimulationDemo from './simulation-demo.js';
import CltSim from './clt-sim.js';
import DiscDist from './disc-dist.js';

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
      loading: true
    };
  }

  componentWillMount() {
    this.setState({
      loading: false
    });
  }


  render() {
    const {loading} = this.state;
    if (loading) {
      return <h1>LOADING</h1>;
    }
    return (
      <div className="main" margin-bottom="40px">
        <div className="section" align-items="center">
          <h1 text-align="center">Simulation and the Central Limit Theorem</h1>
          <div text-align="center">A visualization by Daniel Chong, Jiayi Lin, and Chuanqi Yan</div>
        </div>
        <div className="section">
          <SimulationDemo
            height={600}
            width={1200}
            margin={{top: 20, right: 0, bottom: 30, left: 50}}
            />
          <div>{`In 1873, Sir Francis Galton created the device you saw above in order to defend his cousin Darwin's theory of \
                natural selection. Seeing how popular Darwin's theories are today, the machine, known as the quincunx, \
                evidently served its original purpose well. \
                However, it continues to be called on today, as we are doing now, to illustrate other statistical principles. \
                In this article, \
                we will delve into the statistical principles that underly the famous quincunx, and by calling upon the central limit theorem,
                we will also show exactly how the distribution of the quincunx's points comes about!`
            }</div>
          </div>
        <div className="relative">
          <h2>Probability Distributions</h2>
            <div className="flex">
              <div
                style={{width:"50%"}}
                margin-right="100px"
                overflow="auto"
                >
                {`Before we can dive into the main statistical theory that drives the way that the quincunx \
                  works, we first need to talk about probability distributions. Loosely speaking, a probability
                  distribution is a function that assigns a set of objects various probabilities. For example,
                  imagine you flip a coin. Then, your probability distribution function
                  will assign to heads a probability of `}\(\frac12\){`and to tails a probability of `}\(\frac12\){` as well \
                  (assuming your coin isn't biased, of course!) This is an example of what's known as a Bernoulli distribution, \
                  which is specifically a probability function on two events: one "success" and one "failure". Of course,
                  mathematicians over the years have come up with loads of different probability distributions. Try
                  plotting out a few of them to the right (you can even change the parameters for these functions!) Note that \
                  the Bernoulli distribution is a special case of the binomial distribution, where the number of trials is two.`}
                </div>
              <DiscDist
                height={300}
                width={550}
                margin={{top: 20, right: 0, bottom: 20, left: 50}}
              />
            </div>
        </div>
        <div className="section">
          <br></br>
          <h2>Continuous Distributions</h2>
            <div className="section">
              <div>
                {`Now, let's delve a bit deeper into the mathematics! The distributions we saw above are known as \
                  what statisticians call`} <i>discrete</i> {`probability distributions, in the sense that they only take on \
                  certain values. In the realm of statistics, there are many other distributions as well, including distributions \
                  that assign probabilities to`} <i>all</i> {`of the real numbers!`}
              </div>
              <div className="flex">
                <div
                  style={{width:"50%"}}
                  margin-right="100px"
                  overflow="auto"
                  >
                  {`You might think: that makes no sense! If you assign \
                    some non-zero probability to every single real number, how can you possibly have all the probabilities sum up to \
                    1! Well, to work around that contradiction, the values assigned to each number in a continuous distribution \
                    don't actually represent a probability, or anything at all! Mathematically speaking, if we let `}\(Pr(A)\){` represent \
                    the probability of an event `}\(A\){` occuring and let `}\(X\){` represent the distribution in question, then`}
                    $$Pr(X = x)$$
                  {`is a meaningless value! In fact, how we actually determine probabilities through this function is by looking at the \
                    probability over an`} <i>area,</i> {`which we can calculate through an integral! That is, the probability that our \
                    value falls anywhere between two real numbers`} \(a\) and \(b\) is given by:
                </div>
                <CtsDist
                  height={300}
                  width={550}
                  margin={{top: 20, right: 0, bottom: 20, left: 50}}
                  />
              </div>
              <div className="section">
                $$Pr(a \leq X \leq b) = \int_a^b Pr(X = x) dx$$
                {`You can see a few famous probability distributions to the right. Try playing around with their parameters to see \
                 what kind of shapes you can get!`}
              </div>
            </div>
        </div>
        <div className = "section">
          <h2>Simulating Distributions with a Computer</h2>
          <div className = "relative">
          {`So, you might wonder: how exactly do we go about simulating other distributions? Is there some sort of random \
            number generator for every single possible shape of distribution one can think of? The answer is, thankfully, no! \
            We can actually simulate`} <i>any</i> {`distribution through the uniform distribution alone (in other words, we can simulate \
            any distribution using your good old random number generator!) The way this works is simple: for any distribution, \
            we use something called the cumulative distribution function (CDF), which is really just the probability:`}
            $$Pr(X \leq x) = \int_{`{-\\infty}`}^x Pr(X = y) dy$$
          {`In other words, it's the probability of getting either `}\(x\){` or anything less than it given your distribution. \
            Now, the exciting thing about this funciton is that it ranges from 0 to 1, since the probability that `}\(x\){` is \
            greater than `}\(-\infty\){` is 0, while the probability that it is less than `}\(\infty\){` is 1! Thus, one way that \
            we can simulate probability distributions is by simulating what value the CDF takes on using our normal random number \
            generator, and then invert our CDF to get the value of `}\(x\){` that corresponds to this value on our \
            original distribution! Try the demonstration out below to see how this works in practice! The top plot is the CDF, while \
            the bottom plot is the distribution that we want to sample from. Try changing the number of bins and simulate a lot of \
            trials to see how the simulated data becomes closer and closer to the actual distribution!`}
          </div>
          <SimulationDemo
            height={600}
            width={1200}
            margin={{top: 20, right: 0, bottom: 30, left: 50}}
            />
        </div>
        <div className = "section">
          <h2>Illustrating the Central Limit Theorem</h2>
          <div className = "section">
          {`Now, one of the many interesting facts about the quincunx is that it actually simulates one of the probability distribution \
            functions that we saw above: the binomial distribution! Each ball represents a point being simulated, and at every single \
            one of the pegs, it has a decision to make: whether to go right or left. Each decision is taken with a probability of `}\(1 /2\){` and \
            it performs this decision a number of times equal to the number of layers of pegs we have (let's say `}\(n\){`!) We can also \
            alternatively view this as the simulation of the sum of Bernoulli distributed variables, which we described previously. Now, a famous \
            theorem in statistics states that if we have `}\(n\) simulations of the random variable \(X\), labeled \(x_1, x_2, \ldots x_n\), and
            $$\bar{`{x}`} = \frac{`{\\sum_{i=1}^nx_i}{n}`}, \qquad \hat{`\\sigma`}^2 = \frac{`{\\sum_{i=1}^n(x_i - \\bar{x})^2}{n - 1}`}$$
            then
            $$\lim_{`{n \\rightarrow \\infty}`} Pr(\sqrt{`{n}`}(\bar{`{x}`} - \mu) \leq z) = \Phi\left(\frac{`{z}{\\hat{\\sigma}}`}\right)$$
          {`(for all you rigorous mathematicans/statisticians out there, yes, the proper statement of the theorem is not based on sampled data but rather the \
            mean of `}\(n\){` observatives and the true variance of the distribution, but here we use the fact that the limit of the `}\(t\){`-distribution \
            as `}\(n\){` goes to `}\(\infty\){` is the normal distribution, and so we can apply the theorem to sampled data.) Now, we used a symbol in the \
            above expression that we haven't seen previously, namely`} \(\Phi\). {`This function represents the cumulative distribution function of the normal \
            distribution. In other words, what this theorem says is that the `}<i>mean</i>{` of a bunch of sampled data always eventually ends up \
            being normally distributed as the number of observations increases. This huge statistical theorem, known as the Central Limit Theorem was first \
            proved by the illustrious Pierre-Simon Laplace in 1810, and has until today remained one of the main cornerstones of modern statistics. \
            We won't provide a rigorous proof here, but you can convince yourself through the demo below that with a sufficient number of draws from any distribution, \
            a histogram of sampled means will always tend towards the normal distribution!`}
          </div>
          <CltSim
            height={700}
            width={1200}
            margin={{top: 20, right: 0, bottom: 30, left: 50}}
            />
          <div className = "section">
            {`Note: in the above, the number of sims denotes the number of times we calculate the mean, while the number of trials denotes \
              the number of observations we simulate every time we calculate a mean. While a simulation is running, you cannot edit the number \
              of sims/trials, simulate a new batch, or clear the data, but feel free to modify the number of bins or speed the simulation up!`}
          </div>
        </div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
