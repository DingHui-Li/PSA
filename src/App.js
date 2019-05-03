import React from 'react';
import * as controlAlgo from "./controlAlgorithm"
import Chart from 'chart.js'
import * as util from "./util"
import { stringLiteral } from '@babel/types';
import Barchart from "./barChart"
import DataTable from "./dataTable"

export const status={
  ready:'就绪',
  run:'运行',
  done:'完成'
};
export class process{
    name="undefined";//进程名
    status=status.ready;//状态 true：就绪 false：
    arriveTime=-1;//到达时间
    startTime=-1;//开始时间
    serverTime=-1;//服务时间
    runTime=-1;//已运行时间
    finishTime=-1;//完成时间
    roundTime=-1;//周转时间
    avgRoundTime=0.0;//带权周转时间
    priority=1;//优先级
}
export default class Content extends React.Component{
  constructor(props){
    super(props);
    this.state={
      processes:[],
      isUpdate:false
    };
  }
  updateProcess=(processes)=>{
    this.setState(()=>({
      processes:processes,
      isUpdate:true
    }))
  }
  componentWillReceiveProps(newProps){
    //console.log(newProps.choice)
    this.setState(()=>({
      processes:newProps.processes,
      isUpdate:false
    }))
  }
  render(){
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
    let algoChart=null;
    if(this.props.choice===1){
      algoChart= <controlAlgo.FCFS processes={this.props.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate}/>
    }
    else if(this.props.choice===2){
      algoChart= <controlAlgo.RR processes={this.state.processes} updateProcess={this.updateProcess} isUpdate={this.state.isUpdate}/>
    }
    return(
      <div className={'col s12'} >
        <DataTable processes={this.state.processes}/>
        <Barchart data={data}/>
        {algoChart}
         <Barchart data={data2}/>
      </div>
    );
  }
}




