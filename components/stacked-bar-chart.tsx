import React from 'react'
import Chart from 'react-apexcharts'

export function StackedBarChart(): JSX.Element {
  return (
    <React.Fragment>
      <div className="container-fluid mb-3">
        <h2>Holdings</h2>
        <Chart
          type="bar"
          width={'200%'}
          height={'100%'}
          series={[
            {
              name: 'Available Shares',
              data: [60],
              color: '#48D6AB',
            },
            {
              name: 'Consumed Shares',
              data: [25],
              color: '#000000',
            },
            {
              name: 'Reserved Shares',
              data: [15],
              color: '#4FCDF7',
            },
          ]}
          options={{
            chart: {
              stacked: true,
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                columnWidth: '100%',
              },
            },
            stroke: {
              width: 1,
            },
            xaxis: {
              title: {
                text: 'Percentages',
              },
              categories: ['Holding'],
              max: 100,
            },
            yaxis: {},
            legend: {
              position: 'bottom',
            },
            dataLabels: {
              enabled: true,
            },
            grid: {
              show: true,
              xaxis: {
                lines: {
                  show: false,
                },
              },
              yaxis: {
                lines: {
                  show: false,
                },
              },
            },
          }}
        />
      </div>
    </React.Fragment>
  )
}
export default StackedBarChart
