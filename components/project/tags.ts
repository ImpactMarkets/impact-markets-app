import { sortBy } from 'lodash/fp'

import { colors } from '../colors'
import { IMTag } from '../utils'

// Tags partially from here: https://www.alignmentforum.org/tags/all
export const TAGS: IMTag[] = sortBy('label', [
  // Types of work
  {
    value: 'article',
    label: 'Article',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'book',
    label: 'Book',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'broadcast',
    label: 'Broadcast',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'catalog',
    label: 'Catalog',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'chapter',
    label: 'Chapter',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'conference_article',
    label: 'Conference article',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'encyclopedia_article',
    label: 'Encyclopedia article',
    color: colors.work,
    group: 'Type of work',
  },
  { value: 'film', label: 'Film', color: '#4fcdf7', group: 'Type of work' },
  {
    value: 'historical_document',
    label: 'Historical document',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'journal_article',
    label: 'Journal article',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'legal_document',
    label: 'Legal document',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'magazine_article',
    label: 'Magazine article',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'manuscript',
    label: 'Manuscript',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'metastudy',
    label: 'Metastudy',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'news_article',
    label: 'News article',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'opinion_piece',
    label: 'Opinion piece',
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
    value: 'personal_communication',
    label: 'Personal communication',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'presentation',
    label: 'Presentation',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'research_summary',
    label: 'Research summary',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'scholarly_book',
    label: 'Scholarly book',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'study_report',
    label: 'Study report',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'textbook',
    label: 'Textbook',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'thesis',
    label: 'Thesis',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'website',
    label: 'Website',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'working_paper',
    label: 'Working paper',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'public_goods_infrastructure',
    label: 'Public goods infrastructure',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'service',
    label: 'Service',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'campaign',
    label: 'Campaign',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'study',
    label: 'Study',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'workshop',
    label: 'Workshop',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'course',
    label: 'Course',
    color: colors.work,
    group: 'Type of work',
  },
  {
    value: 'training',
    label: 'Training',
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
  { value: 'aixi', label: 'AIXI', color: colors.field, group: 'Field' },
  {
    value: 'coherent_extrapolated_volition',
    label: 'Coherent Extrapolated Volition',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'complexity_of_value',
    label: 'Complexity of Value',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'corrigibility',
    label: 'Corrigibility',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'deceptive_alignment',
    label: 'Deceptive Alignment',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'decision_theory',
    label: 'Decision Theory',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'embedded_agency',
    label: 'Embedded Agency',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'fixed_point_theorems',
    label: 'Fixed Point Theorems',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'goodharts_law',
    label: 'Goodhart’s Law',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'goal-directedness',
    label: 'Goal-Directedness',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'gradient_hacking',
    label: 'Gradient Hacking',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'infra-bayesianism',
    label: 'Infra-Bayesianism',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'inner_alignment',
    label: 'Inner Alignment',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'instrumental_convergence',
    label: 'Instrumental Convergence',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'intelligence_explosion',
    label: 'Intelligence Explosion',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'logical_induction',
    label: 'Logical Induction',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'logical_uncertainty',
    label: 'Logical Uncertainty',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'mesa-optimization',
    label: 'Mesa-Optimization',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'multipolar_scenarios',
    label: 'Multipolar Scenarios',
    color: colors.field,
    group: 'Field',
  },
  { value: 'myopia', label: 'Myopia', color: colors.field, group: 'Field' },
  {
    value: 'newcombs_problem',
    label: 'Newcomb’s Problem',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'optimization',
    label: 'Optimization',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'orthogonality_thesis',
    label: 'Orthogonality Thesis',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'outer_alignment',
    label: 'Outer Alignment',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'squiggle_paperclip_maximizer',
    label: 'Squiggle/Paperclip Maximizer',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'power_seeking',
    label: 'Power Seeking (AI)',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'recursive_self-improvement',
    label: 'Recursive Self-Improvement',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'simulator_theory',
    label: 'Simulator Theory',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'sharp_left_turn',
    label: 'Sharp Left Turn',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'solomonoff_induction',
    label: 'Solomonoff Induction',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'superintelligence',
    label: 'Superintelligence',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'symbol_grounding',
    label: 'Symbol Grounding',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'transformative_ai',
    label: 'Transformative AI',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'treacherous_turn',
    label: 'Treacherous Turn',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'utility_functions',
    label: 'Utility Functions',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'whole_brain_emulation',
    label: 'Whole Brain Emulation',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'agent_foundations',
    label: 'Agent Foundations',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai-assisted_ai_automated_alignment',
    label: 'AI-assisted/AI automated Alignment',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_boxing',
    label: 'AI Boxing (Containment)',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'conservatism',
    label: 'Conservatism (AI)',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'debate',
    label: 'Debate (AI safety technique)',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'eliciting_latent_knowledge',
    label: 'Eliciting Latent Knowledge (ELK)',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'factored_cognition',
    label: 'Factored Cognition',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'humans_consulting_hch',
    label: 'Humans Consulting HCH',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'impact_measures',
    label: 'Impact Measures',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'inverse_reinforcement_learning',
    label: 'Inverse Reinforcement Learning',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'iterated_amplification',
    label: 'Iterated Amplification ',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'mild_optimization',
    label: 'Mild Optimization',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'oracle_ai',
    label: 'Oracle AI',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'reward_functions',
    label: 'Reward Functions',
    color: colors.field,
    group: 'Field',
  },
  { value: 'rlhf', label: 'RLHF', color: colors.field, group: 'Field' },
  {
    value: 'shard_theory',
    label: 'Shard Theory',
    color: colors.field,
    group: 'Field',
  },
  { value: 'tool_ai', label: 'Tool AI', color: colors.field, group: 'Field' },
  {
    value: 'transparency_interpretability',
    label: 'Transparency/Interpretability',
    color: colors.field,
    group: 'Field',
  },
  { value: 'tripwire', label: 'Tripwire', color: colors.field, group: 'Field' },
  {
    value: 'value_learning',
    label: 'Value Learning',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_alignment_fieldbuilding',
    label: 'AI Alignment Fieldbuilding ',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_governance',
    label: 'AI Governance',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_persuasion',
    label: 'AI Persuasion',
    color: colors.field,
    group: 'Field',
  },
  { value: 'ai_risk', label: 'AI Risk', color: colors.field, group: 'Field' },
  {
    value: 'ai_risk_concrete_stories',
    label: 'AI Risk Concrete Stories',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_safety_public_materials',
    label: 'AI Safety Public Materials ',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_services',
    label: 'AI Services (CAIS)',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_success_models',
    label: 'AI Success Models ',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_takeoff',
    label: 'AI Takeoff',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_timelines',
    label: 'AI Timelines',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'computing_overhang',
    label: 'Computing Overhang',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'regulation_and_ai_risk',
    label: 'Regulation and AI Risk',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'restrain_ai_development',
    label: 'Restrain AI Development',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_alignment_intro_materials',
    label: 'AI Alignment Intro Materials ',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_capabilities',
    label: 'AI Capabilities',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'ai_questions_open_thread',
    label: 'AI Questions Open Thread',
    color: colors.field,
    group: 'Field',
  },
  { value: 'compute', label: 'Compute ', color: colors.field, group: 'Field' },
  { value: 'dall-e', label: 'DALL-E', color: colors.field, group: 'Field' },
  { value: 'gpt', label: 'GPT', color: colors.field, group: 'Field' },
  {
    value: 'language_models',
    label: 'Language Models',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'machine_learning',
    label: 'Machine Learning',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'narrow_ai',
    label: 'Narrow AI',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'neuromorphic_ai',
    label: 'Neuromorphic AI',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'prompt_engineering',
    label: 'Prompt Engineering',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'reinforcement_learning',
    label: 'Reinforcement Learning',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'research_agendas',
    label: 'Research Agendas',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'agi_moratorium',
    label: 'AGI moratorium',
    color: colors.field,
    group: 'Field',
  },
  {
    value: 'suffering_and_existential_risks',
    label: 'Suffering and existential risks',
    color: colors.field,
    group: 'Field',
  },
  // Other fields of work
  {
    value: 'biosecurity',
    label: 'Biosecurity',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'civilizational_resilience',
    label: 'Civilizational resilience',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'climate_change',
    label: 'Climate change',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'democractic_decision-making',
    label: 'Democractic decision-making',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'farmed_animal_welfare',
    label: 'Farmed animal welfare',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'global_priorities_research',
    label: 'Global priorities research',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'great_power_conflict',
    label: 'Great power conflict',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'healthcare',
    label: 'Healthcare',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'medicine',
    label: 'Medicine',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'information_security',
    label: 'Information security',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'institutional_decision-making',
    label: 'Institutional decision-making',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'international_development',
    label: 'International development',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'development_economics',
    label: 'Development economics',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'longevity',
    label: 'Longevity',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'mental_health',
    label: 'Mental health',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'metascience',
    label: 'Metascience',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'moral_enhancement',
    label: 'Moral enhancement',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'nuclear_security',
    label: 'Nuclear security',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'progress_studies',
    label: 'Progress studies',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'wild_animal_welfare',
    label: 'Wild animal welfare',
    color: colors.other,
    group: 'Other field',
  },
  {
    value: 'other_field_of_work',
    label: 'Other field',
    color: colors.other,
    group: 'Other field',
  },
])
