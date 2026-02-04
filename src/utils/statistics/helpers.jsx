/**
 * Get human-readable description of effect size
 * @param {number} value - Effect size value
 * @param {string} type - Type of effect size (anova, cohens_d, epsilon_squared, cramers_v, z_effect, r_effect)
 * @returns {string} Description of effect size magnitude
 */
export function getEffectSizeDescription(value, type) {
  switch (type) {
    case 'anova':
    case 'epsilon_squared':
      // Eta-squared / Epsilon-squared: 0.01 = small, 0.06 = medium, 0.14 = large
      if (value < 0.01) return 'negligible';
      if (value < 0.06) return 'small';
      if (value < 0.14) return 'medium';
      return 'large';
    
    case 'cohens_d':
      // Cohen's d: 0.2 = small, 0.5 = medium, 0.8 = large
      if (value < 0.2) return 'negligible';
      if (value < 0.5) return 'small';
      if (value < 0.8) return 'medium';
      return 'large';
    
    case 'cramers_v':
      // Cramér's V: 0.1 = small, 0.3 = medium, 0.5 = large
      if (value < 0.1) return 'negligible';
      if (value < 0.3) return 'small';
      if (value < 0.5) return 'medium';
      return 'large';
    
    case 'z_effect':
      // Z-score based effect: 0.1 = small, 0.3 = medium, 0.5 = large
      const absZ = Math.abs(value);
      if (absZ < 0.2) return 'negligible';
      if (absZ < 0.5) return 'small';
      if (absZ < 0.8) return 'medium';
      return 'large';
    
    case 'r_effect':
      // r effect size: 0.1 = small, 0.3 = medium, 0.5 = large
      if (value < 0.1) return 'negligible';
      if (value < 0.3) return 'small';
      if (value < 0.5) return 'medium';
      return 'large';
    
    default:
      return 'unknown';
  }
}

/**
 * Get correlation strength description
 * @param {number} rValue - Correlation coefficient absolute value (0-1)
 * @returns {string} Description of correlation strength
 */
export function getCorrelationStrength(rValue) {
  if (rValue < 0.1) return 'negligible';
  if (rValue < 0.3) return 'weak';
  if (rValue < 0.5) return 'moderate';
  if (rValue < 0.7) return 'strong';
  return 'very strong';
}
