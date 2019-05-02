import React from 'react';
import * as controlAlgo from "./controlAlgorithm"
import Chart from 'chart.js'
import * as util from "./util"
import { stringLiteral } from '@babel/types';
import Barchart from "./barChart"
import Input from "./input"

export const status={
  ready:'就绪',
  run:'运行',
  done:'完成'
};
export class process{
    name="undefined";//进程名
    arriveTime=0;//到达时间
    startTime=0;//开始时间
    serverTime=0;//服务时间
    runTime=0;//已运行时间
    finishTime=0;//完成时间
    roundTime=0;//周转时间
    avgRoundTime=0.0;//带权周转时间
    priority=1;//优先级
    status=status.true;//状态 true：就绪 false：
}
export default class Index extends React.Component{
  constructor(props){
    super(props);
    this.state={
      processes:[],
      isUpdate:false
    };
  }
  getProcess=(processes)=>{
    this.setState({
      processes:processes,
      isUpdate:false 
    })
  }
  updateProcess=(processes)=>{
    this.setState({
      processes:processes,
      isUpdate:true
    })
  }
  // shouldComponentUpdate(nextProps,nextState){
  //   return !nextState.isUpdate;
  // }
  render(){
    // console.log(JSON.stringify(this.state.processes))
    const labels=this.state.processes.map((p)=> p.name);
    const serverData=this.state.processes.map((p)=>p.serverTime);
    const arriveData=this.state.processes.map((p)=>p.arriveTime);
    const startData=this.state.processes.map((p)=>p.startTime);
    const roundData=this.state.processes.map((p)=>p.roundTime);
    const avgRoundData=this.state.processes.map((p)=>p.avgRoundTime);
    const data={
      type:'horizontalBar',
			chartID:"initChart",
			chartName:'概览',
			labels:labels,
			serverData:serverData,
			arriveData:arriveData,
      startData:startData,
      avgRoundData:avgRoundData,
      isLegend:'true'
    }
    const data2={
      type:'line',
			chartID:"roundChart",
			chartName:'周转时间',
			labels:labels,
			serverData:null,
			arriveData:null,
      startData:null,
      roundData:roundData,
      avgRoundData:avgRoundData,
      isLegend:'false'
    }
    return(
      <div className={'col l12 s12'} >
        <Input createProcess={this.getProcess} processes={this.state.processes}/>
        <Barchart data={data2}/>
        <Barchart data={data}/>
        {/* <controlAlgo.FCFS processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate}/> */}
        <controlAlgo.RR processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate}/>
        
      </div>
    );
  }
}




