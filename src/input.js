import React from "react"
import * as util from "./util"

export default class Input extends React.Component{
	constructor(props){
		super(props);
		this.state={
			processes:null
		}
	}
	createProcess=()=>{
		let ele=document.getElementById('inputCount');
		let val=ele.value;
		if(val=parseInt(val)){
			if(val>0){
				var processes=util.init(val);
				this.props.createProcess(processes);//状态提升
				this.setState({processes:processes});
			}
		}
	}
	componentWillReceiveProps(newProps){
		this.setState({
			processes:newProps.processes
		})
	}
	render(){
		const btnStyle={
			margin:'0 auto',
			'marginTop':'15px'
		}
		let theadList=[];
		let dataList=[];
		let thead=[];
		if(this.state.processes!=null){
			const temp=this.state.processes[0];
			thead=[];
			for(let i in temp){
				thead.push(i)
			}
			theadList=thead.map((i,index)=>
				<th key={index}>{i}</th>
			)
			dataList=this.state.processes.map((process,index)=>
				<tr key={index}>
				{thead.map((key,index)=>
					<td key={index}>{process[key]}</td>
				)}
				</tr>
			)
		}
		const tableStyle={
			'fontSize': '0.9vw',
			 color:'#757575',
			 overflow:'auto',
			
		}
		const tableAreaStyle={
			overflow:'auto',
			 height:'80%'
		}
		const inputStyle={
			height:'20%'
		}
		const style={
			padding:'10px',
			height:'100%'
		}
		return(
			<div className={'col s12 l6'} id="inputArea">
				<div style={style} className={'z-depth-1'}>
					<div className={'col s12'} style={inputStyle}>
						<div className={"input-field col s6"}>
							<input id="inputCount" type="text" className={"validate"}/>
							<label htmlFor="inputCount">输入进程数</label>
						</div>
						<div className={'col s6'}>
							<div className={'btn'} style={btnStyle} onClick={this.createProcess}>确定</div>
						</div>
					</div>
					<div className={'col s12'} style={tableAreaStyle}> 
						<table style={tableStyle} className={'centered striped'}>
							<thead>
								<tr>
									{theadList}
								</tr>
							</thead>
							<tbody>
								{dataList}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}