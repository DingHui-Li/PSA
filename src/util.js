import {process} from "./App"
import React from "react"

export function init(count){
	var processes=new Array();
	for(let i=0;i<count;i++){
		processes.push(new process());
		processes[i].name="process"+(i+1);
		processes[i].arriveTime=(i+1);
		processes[i].serverTime=Math.floor(Math.random()*10+1);
	}
	return processes;
}
export function getProcessIndex(array,val){
	let count=array.length;
	for(let i=0;i<count;i++){
		if(array[i].name===val){
			return i;
		}
	}
	return -1;
}

export class BottomBar extends React.Component{
	constructor(props){
		super(props);
		this.state={
			disabled:false,
			resetDisplay:"hidden"
		}
	}
	createProcess=()=>{
		var processes=init(10);
		this.props.createProcess(processes);
		this.setState({
			//disabled:true,
			resetDisplay:"visible"
		});
	}
	reset=()=>{
		window.location.reload()
	}
	render(){
		const btnStyle={
			'marginTop':'15px',
			backgroundColor:"#4CAF50",
			color:'white'
		}
		const restBtnStyle={
			'marginTop':'15px',
			marginLeft:'20px',
			backgroundColor:"#D32F2F",
			color:'white',
			visibility:this.state.resetDisplay
		}
		return (
			<div className='col s12 animated slideInUp'id='bottomBar' 
				style={{
					boxShadow:"0 -1px 1px 0 rgba(0,0,0,0.4)",
					position:'fixed',
					bottom:'0',
					height:'65px',
					backgroundColor:'#2196F3',
					animationDuration:'0.5s',
					}}>
				<div className={'col s6'}>
					<div className={'btn'} style={btnStyle} onClick={this.createProcess} disabled={this.state.disabled}>初始化数据</div>
					<div className={'btn'} style={restBtnStyle} onClick={this.reset} >重置</div>
				</div>
			</div>
		)
	}
}