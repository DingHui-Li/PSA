import React from 'react';
import * as controlAlgo from "./controlAlgorithm"
import { stringLiteral } from '@babel/types';
import Barchart from "./barChart"
import DataTable from "./dataTable"

export const status={
  ready:'就绪',
  done:'完成',
};
export class process{
    name="undefined";//进程名
    status=status.ready;
    arriveTime=-1;//到达时间
    startTime=-1;//开始时间
    serverTime=-1;//服务时间
    runTime=0;//已运行时间
    finishTime=-1;//完成时间
    roundTime=-1;//周转时间
    avgRoundTime=0.0;//带权周转时间
    priority=0;//优先级
}
export default class Content extends React.Component{
  constructor(props){
    super(props);
    this.state={
      processes:[],
      isUpdate:false
    };
  }
  updateProcess=(processes,isDone)=>{
    if(isDone){
      this.props.done();
      let avgRound=0;
      let weRound=0.0;
      const length=processes.length; 
      for(let i=0;i<length;i++){
        avgRound+=processes[i].roundTime;
        weRound+=parseFloat(processes[i].avgRoundTime);
      }
      avgRound=parseFloat(avgRound/length).toFixed(2);
      weRound=parseFloat(weRound/length).toFixed(2);
      
      let choice=sessionStorage.getItem("choice");
      let algoName="";
      if(choice=='1') algoName="先来先服务(FCFS)";
      else if(choice=='2') algoName="时间片轮转(RR)"
      else if(choice=='3') algoName="最短进程优先(SPF)"
      else if(choice=='4') algoName="高响应比优先(HRRN)"
      var myDate = new Date();
      const data={
        algoName:algoName,
        avgRound:avgRound,
        weRound:weRound,
        time:myDate.toLocaleTimeString()
      }
      this.props.addCompareData(data);
      document.getElementById("avgRound").innerHTML=avgRound;
      document.getElementById("weRound").innerHTML=weRound;

      this.props.instance.open()
    }
    this.setState(()=>({
      processes:processes,
      isUpdate:true,
    }))
  }
  componentWillReceiveProps(newProps){
    this.setState(()=>({
      processes:newProps.processes,
      isUpdate:false,
    }))
  }
  // shouldComponentUpdate(newProps){
  //   return !newProps.isOpen;
  // }
  render(){
    const labels=this.state.processes.map((p)=> p.name);
    const serverData=this.state.processes.map((p)=>p.serverTime);
    const runData=this.state.processes.map((p)=>p.runTime);
    const roundData=this.state.processes.map((p)=>p.roundTime);
    const avgRoundData=this.state.processes.map((p)=>p.avgRoundTime);
    const data={
      type:'horizontalBar',
			chartID:"initChart",
			chartName:'概览',
      labels:labels,
      startData:[],
			serverData:serverData,
			runData:runData,
      avgRoundData:avgRoundData,
      roundData:[],
      isLegend:'true'
    }
    const data2={
      type:'line',
			chartID:"roundChart",
			chartName:'周转时间',
			labels:labels,
      serverData:[],
      runData:[],
      startData:[],
      roundData:roundData,
      avgRoundData:avgRoundData,
      isLegend:'false'
    }
    let algoChart=null;
    if(this.props.choice==='1'){
      algoChart= <controlAlgo.FCFS processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate} isStart={this.props.isStart}/>
    }
    else if(this.props.choice==='2'){
      algoChart= <controlAlgo.RR processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate} isStart={this.props.isStart}/>
    }
    else if(this.props.choice==='3'){
      algoChart=  <controlAlgo.SPF processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate} isStart={this.props.isStart}/>
    }
    else if(this.props.choice==='4'){
      algoChart=  <controlAlgo.HRRN processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate} isStart={this.props.isStart}/>
    }
    return(
      <div className={'col s12'}>
        <DataTable processes={this.state.processes} />
        <Barchart data={data} />
        {algoChart} 
        <Barchart data={data2} />
      </div>
    );
  }
}




