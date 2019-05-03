import React from "react"
import Barchart from "./barChart"
import {status} from "./App"
import GanttChart from "./GanttChart"
import {getProcessIndex} from "./util"

var isCpuBusy=false;
var currentTime=1;
var timeSlice=1;

export class FCFS extends React.Component{
	constructor(props){
		super(props);
		this.state={
			labels:[],
			serverData:[],
			startData:[],
			arriveData: []
		}
	}
	componentWillReceiveProps(newProps){
		if(!newProps.isUpdate&&newProps.processes){
			const count=newProps.processes.length;
			const processes=newProps.processes;
			let labels=[];
			let arriveData=[];
			let serverData=[];
			let startData=[];
			for(let i=0;i<count;i++){
				setTimeout(()=>{
					if(i==0){
					processes[i].finishTime=processes[i].arriveTime+processes[i].serverTime;
					processes[i].startTime=processes[i].arriveTime;
					processes[i].runTime=processes[i].serverTime;
					}else{
						if(processes[i].arriveTime>processes[i-1].finishTime){
							processes[i].startTime=processes[i].arriveTime;
							processes[i].finishTime=processes[i].arriveTime+processes[i].serverTime;
							processes[i].runTime=processes[i].serverTime;
						}else{
							processes[i].startTime=processes[i-1].finishTime;
							processes[i].finishTime=processes[i].startTime+processes[i].serverTime;
							processes[i].runTime=processes[i].serverTime;
						}
					}
					processes[i].roundTime=processes[i].finishTime-processes[i].arriveTime;
					processes[i].avgRoundTime=parseFloat(processes[i].roundTime/processes[i].serverTime).toFixed(2);
					processes[i].status=status.done;

					newProps.updateProcess(processes);//状态提升

					labels.push(processes[i].name);
					serverData.push(processes[i].serverTime);
					startData.push(processes[i].startTime);
					arriveData.push(processes[i].arriveTime);
					this.setState({
						labels:labels,
						serverData:serverData,
						startData:startData,
						arriveData:arriveData,
					})
				},i*1000)
			}
		}
	}
	render(){
		const data={
			type:'horizontalBar',
			chartID:"FCFSchart",
			chartName:'FCFS调度状态',
			labels:this.state.labels,
			serverData:this.state.serverData ,
			arriveData:null,
			startData:this.state.startData,
			isLegend:'false'
		}
		return(
			<Barchart  data={data} />
		);
	}
}
export class RR extends React.Component{
	constructor(props){
		super(props);
		isCpuBusy=false;
		currentTime=0;
		this.state={
			labels:[],
			serverData:[],
			startData:[],
			arriveData: [],	
		}
	}
	componentWillReceiveProps(newProps){
		if(!newProps.isUpdate&&newProps.processes.length!=0){
			let processes=JSON.parse(JSON.stringify(newProps.processes));
			let processQueue=JSON.parse(JSON.stringify(newProps.processes));
			//let processQueue=newProps.processes;
			let serverData={
				processName:null,
				data:null,
				status:null,
			};
			let startData={
				labels:[],
				time:[],
			};
			let i=0;//队列顶部
			var timeInterval=setInterval(()=>{	
					processQueue[i].runTime+=timeSlice;
					if(processQueue[i].startTime===-1){
						processQueue[i].startTime=currentTime;
						startData.time.push(processQueue[i].startTime);
						startData.labels.push(processQueue[i].name);
					}
					currentTime+=timeSlice;
					if(processQueue[i].runTime>=processQueue[i].serverTime){//服务时间完成---从队列中移除
						processQueue[i].finishTime=currentTime;
						processQueue[i].runTime=processQueue[i].serverTime;
						processQueue[i].roundTime=processQueue[i].finishTime-processQueue[i].startTime;
						processQueue[i].avgRoundTime=parseFloat(processQueue[i].roundTime/processQueue[i].serverTime).toFixed(2);
						processQueue[i].status=status.done;

						let processIndex=getProcessIndex(processes,processQueue[i].name);
						if(processIndex!==-1){
							processes.splice(processIndex,1,processQueue[i]);
						}
						serverData.processName=processQueue[i].name;
						serverData.data=timeSlice;
						serverData.status=processQueue[i].status;

						//newProps.updateProcess(processes);

						processQueue.splice(i,1);
					}
					else{//未完成---移动至队尾

						let processIndex=getProcessIndex(processes,processQueue[i].name);
						if(processIndex!==-1){
							processes.splice(processIndex,1,processQueue[i]);

							let temp=JSON.parse(JSON.stringify(processes[processIndex]));
							processes.splice(processIndex,1);
							processes.push(temp);
						}
						processQueue[i].status=status.ready;
						serverData.processName=processQueue[i].name;
						serverData.data=timeSlice;
						serverData.status=processQueue[i].status;

						let temp=processQueue[i];
						processQueue.splice(i,1);
						processQueue.push(temp);
					}
					if(processQueue.length==0){//退出循环
						clearInterval(timeInterval);
					}
					newProps.updateProcess(JSON.parse(JSON.stringify(processes)));
					this.setState({
							startData:startData,
							serverData:serverData,
						})
			},500);
			
		}
	}
	shouldComponentUpdate(nextProps,nextStats){
		//return true;
		return !(this.state===nextStats);
	}
	 render(){
			let data={
			type:'horizontalBar',
			chartID:"ganttChart",
			chartName:'RR调度状态',
			labels:this.state.labels,
			serverData:this.state.serverData,
			arriveData:null,
			startData:this.state.startData,
			roundData:null,
			avgRoundData:null,
			isLegend:'false'
		  }
		// console.log(this.state.serverData.processName+":"+this.state.serverData.status)
		 return(
				<GanttChart data={data}/>
		 );
	 }
}
