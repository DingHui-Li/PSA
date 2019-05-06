import React from "react"
import Chart from "chart.js"
import Card from '@material-ui/core/Card';

export default class CompareChart extends React.Component{
	constructor(props){
	  super(props);
	  this.state={
		chart:null
	  }
	}
	componentWillReceiveProps(newProps){//直接修改chart中的数据
	  if(this.state.chart!=null){
		  this.state.chart.data.labels=newProps.data.labels
		 this.state.chart.data.datasets[0].data=newProps.data.avgRound;
		 this.state.chart.data.datasets[1].data=newProps.data.weRound;

		  this.state.chart.update();
	  }
	}
	componentDidMount(){
	  var options = {
		  title: {
				display: true,
				text: this.props.data.chartName
		  }
	  };
	  var data={
		labels :this.props.data.labels,
		datasets:[
		  {
			label:"平均周转时间",
			data :this.props.data.avgRound,
			backgroundColor:'rgba(30,136,229, 0.5)'
		   },
		  {
			label:"平均带权周转时间",
			data : this.props.data.weRound,
			backgroundColor: 'rgba(0,200,83, 0.5)'
			}
		]
	  }
	  var ctx = document.getElementById(this.props.data.chartID);
	  var myBarChart = new Chart(ctx, {
		type:this.props.data.type,
		data:data,
		options:options
	  });
	  this.setState({
		chart:myBarChart
	  })
	}
	render(){
	  const style={
			padding:'10px',
			marginTop:'10px'
	  }
	  return(
		<div className={'col l6 s12'}>
			<Card style={style}>
		  	<canvas height='200' id={this.props.data.chartID}></canvas>
			</Card>
		</div>
	  );
	}
  }