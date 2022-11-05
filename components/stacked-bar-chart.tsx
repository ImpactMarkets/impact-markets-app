// import React from 'react'
// import Chart from 'react-apexcharts'
// export function StackedBarChart(): JSX.Element {
//   return (
//     <React.Fragment>
//       <div className="container-fluid mb-3">
//         <h2>Holdings</h2>
//         <Chart
//           type="bar"
//           width={'200%'}
//           height={'100%'}
//           series={[
//             {
//               name: 'Available Shares',
//               data: [60],
//               color: '#48D6AB',
//             },
//             {
//               name: 'Consumed Shares',
//               data: [25],
//               color: '#000000',
//             },
//             {
//               name: 'Reserved Shares',
//               data: [15],
//               color: '#4FCDF7',
//             },
//           ]}
//           options={{
//             chart: {
//               stacked: true,
//               toolbar: {
//                 show: false,
//               },
//             },
//             plotOptions: {
//               bar: {
//                 horizontal: true,
//                 columnWidth: '100%',
//               },
//             },
//             stroke: {
//               width: 1,
//             },
//             xaxis: {
//               title: {
//                 text: 'Percentages',
//               },
//               categories: ['Holding'],
//               max: 100,
//             },
//             yaxis: {},
//             legend: {
//               position: 'bottom',
//             },
//             dataLabels: {
//               enabled: true,
//             },
//             grid: {
//               show: true,
//               xaxis: {
//                 lines: {
//                   show: false,
//                 },
//               },
//               yaxis: {
//                 lines: {
//                   show: false,
//                 },
//               },
//             },
//           }}
//         />
//       </div>
//     </React.Fragment>
//   )
// }
// export default StackedBarChart
import {
  Box,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Text,
  createStyles,
} from '@mantine/core'
import { IconArrowUpRight, IconDeviceAnalytics } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: '3px solid',
    paddingBottom: 5,
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}))

interface StackedBarChartProps {
  total: string
  data: {
    label: string
    count: string
    part: number
    color: string
  }[]
}

export function StackedBarChart({ total, data }: StackedBarChartProps) {
  const { classes } = useStyles()

  const segments = data.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part}%` : undefined,
  }))

  return (
    <Paper withBorder p="md" radius="md" style={{ width: '80%' }}>
      <Text color="dimmed" size="sm">
        Holdings
      </Text>

      <Progress
        sections={segments}
        size={34}
        classNames={{ label: classes.progressLabel }}
        mt={40}
      />
      {/* <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="xl">
        {descriptions}
      </SimpleGrid> */}
    </Paper>
  )
}
