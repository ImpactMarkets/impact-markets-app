import { flow, groupBy, map } from 'lodash/fp'

import { colors } from '../colors'
import { IMTag } from '../utils'

export const TAGS: IMTag[] = [
  {
    value: 'dating-doc',
    label: 'Personal dating doc',
    color: colors.bounty,
    group: 'Type of bounty',
  },
  {
    value: 'errand',
    label: 'Personal errand',
    color: colors.bounty,
    group: 'Type of bounty',
  },
  {
    value: 'service',
    label: 'Personal service',
    color: colors.bounty,
    group: 'Type of bounty',
  },
  {
    value: 'contribution',
    label: 'Altruistic contribution',
    color: colors.prize,
    group: 'Type of prize',
  },
  {
    value: 'other-bounty',
    label: 'Other type of bounty',
    color: colors.other,
    group: 'Other',
  },
  {
    value: 'other-prize',
    label: 'Other field of prize',
    color: colors.other,
    group: 'Other',
  },
  {
    value: 'effective-altruism',
    label: 'Effective Altruism',
    color: colors.community,
    group: 'Community',
  },
  {
    value: 'less-wrong',
    label: 'LessWrong',
    color: colors.community,
    group: 'Community',
  },
  {
    value: 'tpot',
    label: 'TPOT',
    color: colors.community,
    group: 'Community',
  },
  {
    value: 'vibecamp',
    label: 'Vibecamp',
    color: colors.community,
    group: 'Community',
  },
  {
    value: 'africa',
    label: 'Africa',
    color: colors.location,
    group: 'Location',
  },
  {
    value: 'asia',
    label: 'Asia',
    color: colors.location,
    group: 'Location',
  },
  {
    value: 'europe',
    label: 'Europe',
    color: colors.location,
    group: 'Location',
  },
  {
    value: 'north-america',
    label: 'North America',
    color: colors.location,
    group: 'Location',
  },
  {
    value: 'oceania',
    label: 'Oceania',
    color: colors.location,
    group: 'Location',
  },
  {
    value: 'south-america',
    label: 'South America',
    color: colors.location,
    group: 'Location',
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
