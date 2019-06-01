import * as jStat from 'jStat';

// Define standard distrbutions
export const uniform = {
  disp: 'Uniform',
  df: jStat.uniform,
  parameters: {
    a: {name: 'Minimum', value: -1, range: [-3, 3]},
    b: {name: 'Maximum', value: 1, range: [-3, 3]}
  },
  domain: [-3.01, 3.01],
  max: 1.5
}

export const exponential = {
  disp: 'Exponential',
  df: jStat.exponential,
  parameters: {
     rate: {name: "Rate", value: 1, range: [0.01, 10]}
  },
  domain: [0, 5],
  max: 0.5
}

export const normal = {
  disp: 'Normal',
  df: jStat.normal,
  parameters: {
    mean: {name: "Mean", value: 0, range: [-3, 3]},
    std: {name: "Standard Deviation", value: 1, range: [0.01, 10]}
  },
  domain: [-3, 3],
  max: 0.5
};

export const chisquared = {
  disp: 'Chi Squared',
  df: jStat.chisquare,
    parameters: {
    dof: {name: "Degrees of Freedom", value: 1, range: [0.01, 10]}
  },
  domain: [0.01, 10],
  max: 0.5
}