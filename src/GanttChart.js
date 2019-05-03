import React from "react"
import Chart from "chart.js"
import {status} from "./App"

export default class GanttChart extends React.Component{
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
				}
				else{
					this.state.chart.options.legend.display=true;
				}

				if(newProps.data.startData!=null){
					this.state.chart.data.datasets[0].data=newProps.data.startData.time;
					if(newProps.data.startData.labels!=undefined){
						this.state.chart.data.labels=newProps.data.startData.labels;
					}
				}
				
				if(newProps.data.serverData!=null){
					let newData=[];
					let newData2=[];
					let labels=this.state.chart.data.labels;
					let length=labels.length;
					let serverTime=newProps.data.serverData.data;
					for(let i=0;i<length;i++){
						newData[i]=0;
						newData2[i]=serverTime;
					}
					let processIndex=-1;
					for(let i=0;i<length;i++){
						if(labels[i]===newProps.data.serverData.processName){
							processIndex=i;break;
						}
					}
					
					if(processIndex!==-1){
						newData[processIndex]=serverTime;
						newData2[processIndex]=0;
						const newDataset={
							label:"runTime",
							data:newData,
							backgroundColor:'rgba(0,200,83, 0.5)'
						}
						const newDataset2={
							label:"waitTime",
							data:newData2,
							backgroundColor:'rgba(229,57,53, 0)',
						}
						this.state.chart.data.datasets.push(newDataset);
						this.state.chart.data.datasets.push(newDataset2);
					}
				}
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
		labels :[],
		datasets:[
			{
				label:"startTime",
				data:this.props.data.startData,
				backgroundColor:'rgba(69,90,100, 0)',
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
		<div className={'col l6 s12'} >
		  <canvas className={'z-depth-1'}style={style}height='200' id={this.props.data.chartID}></canvas>
		</div>
	  );
	}
  }