import React from "react"
import Chart from "chart.js"

export default class Barchart extends React.Component{
	constructor(props){
	  super(props);
	  this.state={
		chart:null
	  }
	}
	componentWillReceiveProps(newProps){//直接修改chart中的数据
	  if(this.state.chart!=null){
				this.state.chart.options.legend.display=false;
				if(newProps.data.isLegend=='false'){
					this.state.chart.options.legend.display=false;
					this.state.chart.data.datasets[0].backgroundColor='rgba(0,0,0,0)';
				}
				else{
					this.state.chart.options.legend.display=true;
				}
			this.state.chart.data.labels=newProps.data.labels; 
			this.state.chart.data.datasets[0].data=newProps.data.startData;
		  this.state.chart.data.datasets[1].data=newProps.data.serverData;
			this.state.chart.data.datasets[2].data=newProps.data.runData;
			this.state.chart.data.datasets[3].data=newProps.data.avgRoundData;
			this.state.chart.data.datasets[4].data=newProps.data.roundData;
		  this.state.chart.update();
	  }
	}
	componentDidMount(){
	  var options = {
		  scales: {
			  xAxes: [{
				  stacked: true,
			  }],
			  yAxes: [{
				  stacked: true,
			  }]
			},
		  title: {
				display: true,
				text: this.props.data.chartName
		  }
	  };
	  var data={
		labels :this.props.data.labels,
		datasets:[
		  {
			label:"startTime",
			data :this.props.data.startData,
			backgroundColor:'rgba(30,136,229, 0.5)'
		   },
		  {
			label:"serverTime",
			data : this.props.data.serverData,
			backgroundColor: 'rgba(0,200,83, 0.5)'
			},  	
			{
			label:"runTime",
			data : this.props.data.runData,
			backgroundColor: 'rgba(255,110,64, 0.5)',
		  },
			{
				label:"avgRoundTime",
				data:this.props.data.avgRoundData,
				backgroundColor:'rgba(97,97,97, 0.5)',
			},
			{
				label:"roundTime",
				data:this.props.data.roundData,
				backgroundColor:'rgba(69,90,100, 0.5)'
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
	shouldComponentUpdate(newProps){
		return !newProps.isDone;
	}
	render(){
	  const style={
			padding:'10px',
			marginTop:'10px'
	  }
	  return(
		<div className={'col l6 s12'} >
		  <canvas className={'z-depth-1'}style={style}height='200' id={this.props.data.chartID}></canvas>
		</div>
	  );
	}
  }