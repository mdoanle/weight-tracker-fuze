import { Line } from 'react-chartjs-2';
import React from 'react';
import 'chart.js/auto';

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
    fetch('/api/entries?order=date')
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
          dates.push(labelDate);
          weights.push(element.weight);
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
                lineTension: 0.3,
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

  componentDidUpdate(prevState) {
    if (this.state.chartData !== prevState.chartData) {
      this.getChartData();
    }
  }

  render() {
    if (this.state.isLoading) return null;
    return (
      <Line
          width={25}
          height={10}
          data={this.state.chartData}
          options={{
            animation: false
          }}
        />
    );
  }
}
