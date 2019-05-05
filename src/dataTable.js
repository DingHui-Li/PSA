import React from "react"
import {status} from "./App"
import Card from '@material-ui/core/Card';

export default class DataTable extends React.Component{
	constructor(props){
		super(props);
		this.state={
			processes:null
		}
	}
	componentWillReceiveProps(newProps){
		this.setState({
			processes:newProps.processes
		})
	}
	render(){
		
		let theadList=[];
		let dataList=[];
		let thead=[];
		const trStyle={
			backgroundColor:'rgba(76,175,80, 0.2)',
		}
		if(this.state.processes!=null){
			const temp=this.state.processes[0];
			thead=[];
			for(let i in temp){
				thead.push(i)
			}
			theadList=thead.map((i,index)=>//生成表头
				<th key={index}>{i}</th>
			)
			dataList=this.state.processes.map((process,index)=>{//生成列表
				let styleName='none';
				if(process.status==status.done){
					return <tr key={index} style={trStyle}>
					{thead.map((key,index)=>
						<td key={index}>{process[key]}</td>	
					)}
				</tr>
				}else return <tr key={index}>
						{thead.map((key,index)=>
							<td key={index}>{process[key]}</td>	
						)}
					</tr>
			}	
			)
		}
		const tableStyle={
			'fontSize': '0.9vw',
			 color:'#757575',
			 overflow:'auto',
			height:'100%'
		}
		const tableAreaStyle={
			overflow:'auto',
			 height:'100%',
			 padding:'0'
		}
		const style={
			padding:'10px',
			marginTop:'10px'
		}
		return(
			<div className={'col l6 s12'} >
				<Card style={style} id="inputArea">
					<div className={'col s12'} style={tableAreaStyle}>
						<table style={tableStyle} className={'table table-stripedv centered'}>
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
				</Card>
			</div>
		);
	}
}