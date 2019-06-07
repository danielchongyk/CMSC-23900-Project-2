import * as jStat from 'jStat';

// Define standard distrbutions
export const uniform = {
  disp: 'Uniform',
  df: jStat.uniform,
  parameters: {
    a: {name: 'Minimum', value: -1, range: [-3, 0], step: 0.01},
    b: {name: 'Maximum', value: 1, range: [0.01, 3], step: 0.01}
  },
  domain: [-3.01, 3.01],
  max: 1.5
}

export const exponential = {
  disp: 'Exponential',
  df: jStat.exponential,
  parameters: {
    rate: {name: "Rate", value: 1, range: [0.01, 10], step: 0.01}
  },
  domain: [0, 5],
  max: 0.5
}

export const normal = {
  disp: 'Normal',
  df: jStat.normal,
  parameters: {
    mean: {name: "Mean", value: 0, range: [-3, 3]},
    std: {name: "Standard Deviation", value: 1, range: [0.01, 10], step: 0.01}
  },
  domain: [-3, 3],
  max: 0.5
};

export const chisquared = {
  disp: 'Chi Squared',
  df: jStat.chisquare,
  parameters: {
    dof: {name: "Degrees of Freedom", value: 1, range: [0.01, 10], step: 0.01}
  },
  domain: [0.01, 10],
  max: 0.5
}

export const beta = {
  disp: 'Beta',
  df: jStat.beta,
  parameters: {
    alpha: {name: "Alpha", value: 2, range: [0.01, 10], step: 0.01},
    beta: {name: "Beta", value: 2, range: [0.01, 10], step: 0.01}
  },
  domain: [0.01, 0.99],
  max: 5
}

export const gamma = {
  disp: 'Gamma',
  df: jStat.gamma,
  parameters: {
    shape: {name: "Shape", value: 2, range: [0.01, 10], step: 0.01},
    scale: {name: "Scale", value: 2, range: [0.01, 10], step: 0.01}
  },
  domain: [0.01, 12],
  max: 1
}

export const centralF = {
  disp: 'F Distribution',
  df: jStat.centralF,
  parameters: {
    df1: {name: "Deg. of Freedom 1", value: 2, range: [0.01, 10], step: 0.01},
    df2: {name: "Deg. of Freedom 2", value: 5, range: [4.01, 10], step: 0.01}
  },
  domain: [0.01, 5],
  max: 1
}

// Discrete Distributions
export const binomial = {
  disp: 'Binomial',
  df: jStat.binomial,
  parameters: {
    n: {name: 'Number of Trials', value: 5, range: [1,20], step: 1},
    p: {name: 'Prob. of Success', value: 0.5, range: [0,1], step: 0.01}
  },
  domain: (dist) => {return dist.parameters.n.value + 1;} 
}

export const poisson = {
  disp: 'Poisson',
  df: jStat.poisson,
  parameters: {
    lambda: {name: 'Rate', value: 5, range: [1,10], step: 0.01}
  },
  domain: (dist) => {return 2 * Math.ceil(dist.parameters.lambda.value) + 1;} 
}

// Note: the parameterization of the negative binomial in the package seems
// to be that of a geometric distribution, rather than a full negative binomial.
export const negbino = {
  disp: 'Geometric',
  df: jStat.negbin,
  parameters: {
    n: {name: 'Number of Failures', value: 5, range: [1,20], step: 1},
    p: {name: 'Prob. of Success', value: 0.5, range: [0,1], step: 0.01}
  },
  domain: (dist) => {return dist.parameters.n.value + 2;} 
}
