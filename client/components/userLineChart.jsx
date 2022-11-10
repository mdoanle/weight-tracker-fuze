import { Line } from 'react-chartjs-2';
import React from 'react';
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      isLoading: true
    };
    this.getChartData = this.getChartData.bind(this);
  }

  getChartData() {
    fetch('/api/entries')
      .then(res => res.json())
      .then(data => {
        const chartData = data;
        const dates = [];
        const weights = [];
        chartData.forEach(element => {
          const { date } = element;
          const modDate = date.split('T');
          const finalDate = modDate[0];
          const labelDate = finalDate.split('-').splice(1, 2).join('-');
          dates.unshift(labelDate);
          weights.unshift(element.weight);
        });
        this.setState(
          {
            isLoading: false,
            chartData: {
              labels: dates,
              datasets: [{
                data: weights,
                label: 'Weight',
                borderColor: '#3333ff',
                fill: false,
                lineTension: 0.5,
                pointRadius: 5,
                pointBackgroundColor: '#000000'
              }
              ]
            }
          });
      });
  }

  componentDidMount() {
    this.getChartData();
  }

  render() {
    if (this.state.isLoading) return null;
    return (
      <Line
          width={25}
          height={15}
          data={this.state.chartData}
        />
    );
  }
}
