import React from "react"
import Barchart from "./barChart"
import {status} from "./App"
import GanttChart from "./GanttChart"
import * as util from "./util"
import { nullLiteral } from "@babel/types";

export class FCFS extends React.Component{
	constructor(props){
		super(props);
		this.state={
			labels:[],
			serverData:[],
			startData:[],
			arriveData: [],
			interval:null
		}
	}
	componentWillReceiveProps(newProps){
		if(!newProps.isUpdate&&newProps.processes.length>0&&newProps.isStart){
			const count=newProps.processes.length;
			const processes=JSON.parse(JSON.stringify(newProps.processes));
			let labels=[];
			let arriveData=[];
			let serverData=[];
			let startData=[];
			let i=0;
			let interval=setInterval(()=>{
					if(i==0){
						processes[i].startTime=processes[i].arriveTime;
						processes[i].finishTime=processes[i].arriveTime+processes[i].serverTime;
					}else{
						if(processes[i].arriveTime>processes[i-1].finishTime){
							processes[i].startTime=processes[i].arriveTime;
							processes[i].finishTime=processes[i].arriveTime+processes[i].serverTime;
						}else{
							processes[i].startTime=processes[i-1].finishTime;
							processes[i].finishTime=processes[i].startTime+processes[i].serverTime;	
						}
					}
					processes[i].runTime=processes[i].serverTime;
					processes[i].roundTime=processes[i].finishTime-processes[i].arriveTime;
					processes[i].avgRoundTime=parseFloat(processes[i].roundTime/processes[i].serverTime).toFixed(2);
					processes[i].status=status.done;

					if(i==count-1){
						newProps.updateProcess(processes,true);
					}
					else newProps.updateProcess(processes,false);

					labels.push(processes[i].name);
					serverData.push(processes[i].serverTime);
					startData.push(processes[i].startTime);
					arriveData.push(processes[i].arriveTime);
					i++;
					if(i==count){
						clearInterval(interval);
					}
					this.setState({
						labels:labels,
						serverData:serverData,
						startData:startData,
						arriveData:arriveData,
						interval:interval
					})
				},1000)
		}
	}
	componentWillUnmount(){
		clearInterval(this.state.interval);
	}
	render(){
		const data={
			type:'horizontalBar',
			chartID:"FCFSchart",
			chartName:'FCFS调度状态',
			labels:this.state.labels,
			serverData:this.state.serverData ,
			startData:this.state.startData,
			roundData:[],
			avgRoundData:[],
			roundData:[],
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
		this.state={
			labels:[],
			serverData:[],
			startData:[],
			arriveData: [],	
			isRestart:true,
			interval:null
		}
	}
	componentWillReceiveProps(newProps){
		if(!newProps.isUpdate&&newProps.processes.length>0&&newProps.isStart){
			this.setState({
				isRestart:true
			})
			let currentTime=1;
			let timeSlice=1;
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
			var interval=setInterval(()=>{	
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
						processQueue[i].roundTime=processQueue[i].finishTime-processQueue[i].arriveTime;
						processQueue[i].avgRoundTime=parseFloat(processQueue[i].roundTime/processQueue[i].serverTime).toFixed(2);
						processQueue[i].status=status.done;

						let processIndex=util.getProcessIndex(processes,processQueue[i].name);
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

						let processIndex=util.getProcessIndex(processes,processQueue[i].name);
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
						newProps.updateProcess(JSON.parse(JSON.stringify(processes)),true);
						clearInterval(interval);
					}
					else newProps.updateProcess(JSON.parse(JSON.stringify(processes)),false);
					
					this.setState({
							startData:startData,
							serverData:serverData,
							isRestart:false,
							interval:interval
						})
			},500);
			
		}
	}
	shouldComponentUpdate(nextProps,nextStats){
		//return true;
		return !(this.state==nextStats);
	}
	componentWillUnmount(){
		clearInterval(this.state.interval)
	}
	 render(){
			let data={
			type:'horizontalBar',
			chartID:"ganttChart",
			chartName:'RR调度状态',
			labels:this.state.labels,
			serverData:this.state.serverData,
			startData:this.state.startData,
			isLegend:'false'
		  }
		// console.log(this.state.serverData.processName+":"+this.state.serverData.status)
		 return(
				<GanttChart data={data} isStart={this.state.isRestart}/>
		 );
	 }
}
export class SPF extends React.Component{
	constructor(props){
		super(props);
		this.state={
			labels:[],
			startData:[],
			serverData:[],
			interval:null
		}
	}
	componentWillReceiveProps(newProps){
		if(!newProps.isUpdate&&newProps.processes.length>0&&newProps.isStart){
			let i=0;//完成顺序
			let labels=[];
			let startData=[];
			let serverData=[];
			let processes=JSON.parse(JSON.stringify(newProps.processes));
			let processesQueue=JSON.parse(JSON.stringify(newProps.processes));
			let interval=setInterval(()=>{
				let index=util.getIndexMinServertime(processesQueue);
				if(i==0){
					processesQueue[index].startTime=processesQueue[index].arriveTime;
				}
				else{
					if(processesQueue[index].arriveTime>processes[i-1].finishTime){
						processesQueue[index].startTime=processesQueue[index].arriveTime;
					}else{
						processesQueue[index].startTime=processes[i-1].finishTime;
					}
					
				}
				processesQueue[index].finishTime=processesQueue[index].startTime+processesQueue[index].serverTime;
				processesQueue[index].runTime=processesQueue[index].serverTime;
				processesQueue[index].roundTime=processesQueue[index].finishTime-processesQueue[index].arriveTime;
				processesQueue[index].avgRoundTime=parseFloat(processesQueue[index].roundTime/processesQueue[index].serverTime).toFixed(2);
				processesQueue[index].status=status.done;

				let processIndex=util.getProcessIndex(processes,processesQueue[index].name);
				if(processIndex!==-1){
					if(processes[i].name==processesQueue[index].name){
						processes.splice(i,1,processesQueue[index]);	
					}
					else{
						let temp=JSON.parse(JSON.stringify(processes[i]));
						processes.splice(i,1,processesQueue[index]);
						processes.splice(processIndex,1);
						processes.push(temp);
					}
					labels.push(processesQueue[index].name);
					startData.push(processesQueue[index].startTime);
					serverData.push(processesQueue[index].serverTime);
					this.setState({
						labels:labels,
						startData:startData,
						serverData:serverData,
						interval:interval
					})
					processesQueue.splice(index,1);
					i++;
				}
				if(processesQueue.length==0){
					newProps.updateProcess(processes,true);
					clearInterval(interval);
				}else {
					newProps.updateProcess(processes,false);
				}
			},1000);
		}
	}
	componentWillUnmount(){
		clearInterval(this.state.interval)
	}
	render(){
		const data={
			type:'horizontalBar',
			chartID:"SPFchart",
			chartName:'SPF调度状态',
			labels:this.state.labels,
			serverData:this.state.serverData,
			startData:this.state.startData,
			runData:this.state.runData,
			avgRoundData:[],
			isLegend:'false'
		}
		return(
			 <Barchart data={data}/>
		);
	}
}
export class HRRN extends React.Component{
	constructor(props){
		super(props);
		this.state={
			labels:[],
			startData:[],
			serverData:[],
			interval:null
		}
	}
	componentWillReceiveProps(newProps){
		if(!newProps.isUpdate&&newProps.processes.length>0&&newProps.isStart){
			let processQueue=JSON.parse(JSON.stringify(newProps.processes));
			let processes=JSON.parse(JSON.stringify(newProps.processes));
			let i=0;
			let currentTime=0;
			let labels=[];
			let startData=[];
			let serverData=[];
			let interval=setInterval(()=>{
				util.calcPriority(processQueue,currentTime);
				let index=util.getIndexMaxPriority(processQueue);
				if(i==0){
					processQueue[index].startTime=processQueue[index].arriveTime;
				}else{
					if(processQueue[index].arriveTime>processes[i-1].finishTime){
						processQueue[index].startTime=processQueue[index].arriveTime;
					}
					else{
						processQueue[index].startTime=processes[i-1].finishTime;
					}
				}
				
				processQueue[index].finishTime=processQueue[index].startTime+processQueue[index].serverTime;
				currentTime=processQueue[index].finishTime;

				processQueue[index].runTime=processQueue[index].serverTime;
				processQueue[index].roundTime=processQueue[index].finishTime-processQueue[index].arriveTime;
				processQueue[index].avgRoundTime=parseFloat(processQueue[index].roundTime/processQueue[index].serverTime).toFixed(2);
				processQueue[index].status=status.done;
				
				let processIndex=util.getProcessIndex(processes,processQueue[index].name);
				if(processIndex!==-1){
					if(processes[i].name==processQueue[index].name){
						processes.splice(i,1,processQueue[index]);	
					}
					else{
						let temp=JSON.parse(JSON.stringify(processes[i]));
						processes.splice(i,1,processQueue[index]);
						processes.splice(processIndex,1);
						processes.push(temp);
					}
					labels.push(processQueue[index].name);
					startData.push(processQueue[index].startTime);
					serverData.push(processQueue[index].serverTime);
					this.setState({
						labels:labels,
						startData:startData,
						serverData:serverData,
						interval:interval
					})
					processQueue.splice(index,1);
					i++;
				}
				if(processQueue.length==0){
					newProps.updateProcess(processes,true);
					clearInterval(interval);
				}else newProps.updateProcess(processes,false);
				
			},1000)
		}
	}
	componentWillUnmount(){
		clearInterval(this.state.interval);
	}
	render(){
		const data={
			type:'horizontalBar',
			chartID:"HRRNchart",
			chartName:'HRRN调度状态',
			labels:this.state.labels,
			serverData:this.state.serverData,
			startData:this.state.startData,
			runData:this.state.runData,
			avgRoundData:[],
			isLegend:'false'
		}
		return(
			<Barchart data={data}/>
		)
	}
}
