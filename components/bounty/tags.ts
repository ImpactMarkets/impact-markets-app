import { flow, groupBy, map } from 'lodash/fp'

import { colors } from '../colors'
import { Tag, notEmpty } from '../utils'

export const TAGS: Tag[] = [
  {
    value: 'dating-doc',
    label: 'Personal dating doc',
    color: colors.bounty,
    category: 'Type of bounty',
  },
  {
    value: 'errand',
    label: 'Personal errand',
    color: colors.bounty,
    category: 'Type of bounty',
  },
  {
    value: 'service',
    label: 'Personal service',
    color: colors.bounty,
    category: 'Type of bounty',
  },
  {
    value: 'contribution',
    label: 'Altruistic contribution',
    color: colors.prize,
    category: 'Type of prize',
  },
  {
    value: 'other-bounty',
    label: 'Other type of bounty',
    color: colors.other,
    category: 'Other',
  },
  {
    value: 'other-prize',
    label: 'Other field of prize',
    color: colors.other,
    category: 'Other',
  },
  {
    value: 'effective-altruism',
    label: 'Effective Altruism',
    color: colors.community,
    category: 'Community',
  },
  {
    value: 'less-wrong',
    label: 'LessWrong',
    color: colors.community,
    category: 'Community',
  },
  {
    value: 'tpot',
    label: 'TPOT',
    color: colors.community,
    category: 'Community',
  },
  {
    value: 'vibecamp',
    label: 'Vibecamp',
    color: colors.community,
    category: 'Community',
  },
  {
    value: 'africa',
    label: 'Africa',
    color: colors.location,
    category: 'Location',
  },
  {
    value: 'asia',
    label: 'Asia',
    color: colors.location,
    category: 'Location',
  },
  {
    value: 'europe',
    label: 'Europe',
    color: colors.location,
    category: 'Location',
  },
  {
    value: 'north-america',
    label: 'North America',
    color: colors.location,
    category: 'Location',
  },
  {
    value: 'oceania',
    label: 'Oceania',
    color: colors.location,
    category: 'Location',
  },
  {
    value: 'south-america',
    label: 'South America',
    color: colors.location,
    category: 'Location',
  },
]

export const TAGS_GROUPED = flow(
  groupBy('category'),
  Object.entries, // map/each are not working here for some reason
  map(([key, value]) => ({
    group: key,
    items: value.map(
      // Remove extraneous fields because the group/items detection is recursive
      ({ value, label }: Tag) => ({
        value,
        label,
      }),
    ),
  })),
  notEmpty,
)(TAGS)
