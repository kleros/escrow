export const PERIOD_ENUM = [
    'activation', // When juror can activate their tokens and parties give evidences
    'draw', // When jurors are drawn at random, note that this period is fast
    'vote', // Where jurors can vote on disputes
    'appeal', // When parties can appeal the rulings
    'execution' // When where token redistribution occurs and Kleros call the arbitrated contracts
  ]