import React from 'react';
import ReactDOM from 'react-dom';
import Content from './App';
import * as serviceWorker from './serviceWorker';
import * as util from "./util"

class Nav extends React.Component{
	choice(index){
		this.props.choiceChange(index);
	}
	render(){
		let choice=sessionStorage.getItem("choice");
		let algoName="";
		if(choice=='1') algoName="先来先服务(FCFS)";
		else if(choice=='2') algoName="时间片轮转(RR)"
		else if(choice=='3') algoName="最短进程优先(SPF)"
		return(
			<nav id='nav'className="nav-extended animated slideInDown"style={{backgroundColor:'#2196F3','animationDuration':'0.8s',position: 'fixed'}}>
				<div className="nav-wrapper">
					<a href="" className="brand-logo hide-on-small-only">进程调度算法</a>
					<a href="" className="brand-logo center"style={{whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:'1.5rem'}}>{algoName}</a>
				</div>
				<div className="nav-content">
					<ul className="tabs tabs-transparent">
						<li className="tab" onClick={this.choice.bind(this,1)}><a id="tab1" className={choice==='1'?'active':''}  href="javascript:void(0)">FCFS</a></li>
						<li className="tab" onClick={this.choice.bind(this,2)}><a id="tab2" className={choice==='2'?'active':''} href="javascript:void(0)">RR</a></li>
						<li className="tab" onClick={this.choice.bind(this,3)}><a id="tab3" className={choice==='3'?'active':''} href="javascript:void(0)">SPF</a></li>
						<li className="tab" onClick={this.choice.bind(this,4)}><a id="tab4" className={choice==='4'?'active':''} href="javascript:void(0)">Test 4</a></li>
					</ul>
				</div>
			</nav>
		)
	}
}
class BottomBar extends React.Component{
	constructor(props){
		super(props);
		this.state={
			disabled:false,
			resetDisplay:"hidden",
		}
	}
	createProcess=()=>{
		var processes=util.init(10);
		this.props.createProcess(processes);
		this.setState({
			disabled:true,
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
					padding:'0'
					}}>
				<div className={'col s6'}>
					<div className={'btn'} style={btnStyle} onClick={this.createProcess} disabled={this.state.disabled}>初始化数据</div>
					<div className={'btn'} style={restBtnStyle} onClick={this.reset} >重置</div>
				</div>
				<div className={'col s6'}style={{height:'100%',padding:'0'}}>
				
				</div>
			</div>
		)
	}
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

class Index extends React.Component{
	constructor(props){
		super(props);
		this.state={
			choice:sessionStorage.getItem('choice'),
			processes:[],
			isReset:false
		}
	}
	createProcess=(processes)=>{
		this.setState({
			processes:processes
		})
	}
	choiceChange=(choice)=>{
		sessionStorage.setItem('choice',choice);
		this.setState({
			choice:choice+''
		})
	}
	render(){
		return(
			<div>
				<Nav choiceChange={this.choiceChange}/>
				<div className='row' id='content'style={{marginBottom:'80px'}}>
					<Content choice={this.state.choice} processes={this.state.processes}/>
					<BottomBar createProcess={this.createProcess}/>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Index />, document.getElementById('root'));