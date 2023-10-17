import { flow, groupBy, map } from 'lodash/fp'

import { colors } from '../colors'
import { IMTag } from '../utils'

export const TAGS: IMTag[] = [
  // Types of work
  {
    value: 'communication',
    label: 'Communication',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'research',
    label: 'Research',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'education',
    label: 'Education',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'organization',
    label: 'Organization',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'individual',
    label: 'Individual',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'infrastructure',
    label: 'Infrastructure',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'other_type_of_work',
    label: 'Other type of work',
    color: colors.other,
    group: 'Type of work',
  },
  // Fields of work
  {
    value: 'corrigibility',
    label: 'Corrigibility',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'decision_theory',
    label: 'Decision theory',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'embedded_agency',
    label: 'Embedded agency',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'infra-bayesianism',
    label: 'Infra-bayesianism',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'inner_alignment',
    label: 'Inner alignment',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'multipolar_scenarios',
    label: 'Multipolar scenarios',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'outer_alignment',
    label: 'Outer alignment',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'symbol_grounding',
    label: 'Symbol grounding',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'agent_foundations',
    label: 'Agent foundations',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'ai-assisted_alignment',
    label: 'AI-assisted alignment',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'ai_boxing',
    label: 'AI boxing (containment)',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'debate',
    label: 'Debate (AI safety technique)',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'eliciting_latent_knowledge',
    label: 'Eliciting latent knowledge (ELK)',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'factored_cognition',
    label: 'Factored cognition',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'inverse_reinforcement_learning',
    label: 'Inverse reinforcement learning',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'iterated_amplification',
    label: 'Iterated amplification ',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'mild_optimization',
    label: 'Mild optimization',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'oracle_ai',
    label: 'Oracle AI',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'rlhf',
    label: 'RLHF',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'shard_theory',
    label: 'Shard theory',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'interpretability',
    label: 'Transparency/interpretability',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'tripwire',
    label: 'Tripwire',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'value_learning',
    label: 'Value learning',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'field-building',
    label: 'Field-building ',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'ai_governance',
    label: 'AI governance',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'ai_persuasion',
    label: 'AI persuasion',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'ai_services',
    label: 'AI services (CAIS)',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'restrain_ai_development',
    label: 'Restrain AI development',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'compute_governance',
    label: 'Compute governance',
    color: colors.field,
    group: 'Field of AI safety',
  },
  {
    value: 'evaluations',
    label: 'Evaluations',
    color: colors.field,
    group: 'Field of AI safety',
  },
  // Cause areas
  {
    value: 'existential_and_suffering_risks',
    label: 'Existential and suffering risks',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'ai_safety',
    label: 'AI safety',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'biosecurity',
    label: 'Biosecurity',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'civilizational_resilience',
    label: 'Civilizational resilience',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'climate_change',
    label: 'Climate change',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'democractic_decision-making',
    label: 'Democractic decision-making',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'farmed_animal_welfare',
    label: 'Farmed animal welfare',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'forecasting',
    label: 'Forecasting',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'global_priorities_research',
    label: 'Global priorities research',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'great_power_conflict',
    label: 'Great power conflict',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'healthcare',
    label: 'Healthcare',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'medicine',
    label: 'Medicine',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'information_security',
    label: 'Information security',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'institutional_decision-making',
    label: 'Institutional decision-making',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'international_development',
    label: 'International development',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'development_economics',
    label: 'Development economics',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'longevity',
    label: 'Longevity',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'mental_health',
    label: 'Mental health',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'metascience',
    label: 'Metascience',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'moral_enhancement',
    label: 'Moral enhancement',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'nuclear_security',
    label: 'Nuclear security',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'progress_studies',
    label: 'Progress studies',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'wild_animal_welfare',
    label: 'Wild animal welfare',
    color: colors.causearea,
    group: 'Cause area',
  },
  {
    value: 'other_field_of_work',
    label: 'Other cause area',
    color: colors.other,
    group: 'Cause area',
  },
]

export const TAGS_GROUPED = flow(
  groupBy('group'),
  Object.entries, // map/each are not working here for some reason
  map(([key, value]) => ({
    group: key,
    items: value.map(
      // Remove extraneous fields because the group/items detection is recursive
      ({ value, label }: { value: string; label: string }) => ({
        value,
        label,
      }),
    ),
  })),
)(TAGS)
