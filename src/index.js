import React from 'react';
import ReactDOM from 'react-dom';
import Content from './App';
import * as serviceWorker from './serviceWorker';
import * as util from "./util"
import M from "materialize-css"

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
		else if(choice=='4') algoName="高响应比优先(HRRN)"
		return(
			<nav id='nav'className="nav-extended animated slideInDown"style={{backgroundColor:'#2196F3','animationDuration':'0.8s',position: 'fixed'}}>
				<div className="nav-wrapper">
					<a href="" className="brand-logo hide-on-small-only">进程调度算法</a>
					<a href="#modal2" className="brand-logo center modal-trigger" style={{whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:'1.5rem'}}>
						{algoName}<img src="./about.png" style={{height:'20px'}}/>
					</a>
				</div>
				<div className="nav-content">
					<ul className="tabs tabs-transparent">
						<li className="tab" onClick={this.choice.bind(this,1)}><a className={choice==='1'?'active':''}  href="javascript:void(0)" style={{fontWeight:'bold'}}>FCFS</a></li>
						<li className="tab" onClick={this.choice.bind(this,2)}><a className={choice==='2'?'active':''} href="javascript:void(0)" style={{fontWeight:'bold'}}>RR</a></li>
						<li className="tab" onClick={this.choice.bind(this,3)}><a className={choice==='3'?'active':''} href="javascript:void(0)" style={{fontWeight:'bold'}}>SPF</a></li>
						<li className="tab" onClick={this.choice.bind(this,4)}><a className={choice==='4'?'active':''} href="javascript:void(0)" style={{fontWeight:'bold'}}>HRRN</a></li>
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
			processes:null
		}
	}
	createProcess=()=>{
		var processes=util.init(10);
		this.props.createProcess(processes);
		this.setState({
			disabled:true,
			resetDisplay:"visible",
			processes:processes
		});
	}
	reset=()=>{
		window.location.reload()
	}
	render(){
		const btnStyle={
			'marginTop':'15px',
			marginLeft:'15px',
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
					<div className={'btn waves-effect'} style={btnStyle} onClick={this.createProcess} disabled={this.state.disabled}>初始化数据</div>
					{/* <div className={'btn waves-effect'} style={btnStyle} onClick={this.createProcess} disabled={this.state.disabled}>开始</div> */}
					<div className={'btn waves-effect'} style={restBtnStyle} onClick={this.reset} >重置</div>
				</div>
				<div className={'col s6'}style={{height:'100%',padding:'0'}}>
				
				</div>
			</div>
		)
	}
}
class Result extends React.Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		document.addEventListener('DOMContentLoaded', ()=> {
			var elems = document.querySelectorAll('.modal');
			M.Modal.init(elems);
			var elem=document.getElementById('modal1')
			var instance = M.Modal.getInstance(elem);
			//instance.open();
			this.props.getInstance(instance);
		 });
	}
	// componentWillReceiveProps(newProps){
	// 	if(newProps.isOpen){
	// 		this.state.instance.open();
	// 	}else {
	// 		this.state.instance.close();
	// 	}
	// }
	render(){
		return(
			<div className="col s2">
				{/* <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a> */}
				<div id="modal1" className="modal">
					<div className="modal-content">
						<h4 style={{color:'#4CAF50'}}>完成!</h4>
						<div style={{fontSize:'1.2rem',color:'#757575'}}>平均周转周期：<span id='avgRound'style={{fontWeight:'bold',fontSize:'1.4rem',color:'#4CAF50'}}></span></div>
						<div style={{fontSize:'1.2rem',color:'#757575'}}>平均带权周转周期：<span id='weRound'style={{fontWeight:'bold',fontSize:'1.4rem',color:'#4CAF50'}}></span></div>
					</div>
					<div className="modal-footer">
						<a href="javascript:void(0)" className="modal-close waves-effect waves-green btn-flat">确定</a>
					</div>
				</div>
			</div>
		)
	}
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

class Index extends React.Component{
	constructor(props){
		super(props);
		this.state={
			choice:sessionStorage.getItem('choice'),
			processes:[],
			isReset:false,
			instance:null
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
	getInstance=(instance)=>{
		this.setState(()=>({
			instance:instance
		}))
	}
	render(){
		let choice=this.state.choice;
		let info;
		if(choice=='1'){
			info=<div>
				<h4>先来先服务FCFS</h4>
				<p>先来先服务是最简单的策略，也成为先进先出FIFO。首先它是一个非抢占的。如字面的意思，它根据进程到达时间决定先运行哪一个进程。</p>
				<h5>优缺点</h5>
				<li>有利于长作业（进程）而不利于短作业（进程）</li>
				<li>有利于CPU繁忙型作业（进程）而不利于I/O繁忙型作业（进程）</li>
			</div>
		}
		else if(choice=='2'){
			info=<div>
				<h4>时间片轮转RR</h4>
				<p>时间片轮转调度是一种最古老，最简单，最公平且使用最广的算法。每个进程被分配一时间段，称作它的时间片，
					即该进程允许运行的时间。在使用完一个时间片后，即使进程并未完成其运行，它也必须释放出（被剥夺）处理机给下一个就绪的进程，
					而被剥夺的进程返回到就绪队列的末尾重新排队，等候再次运行。</p>
				<h5>优缺点</h5>
				<ul>
					<li>时间片设得太短会导致过多的进程切换，降低了CPU效率；而设得太长会退化为FCFS。</li>
				</ul>
				
			</div>
		}
		else if(choice=='3'){
			info=<div>
				<h4>最短进程优先SPF</h4>
				<p>短进程优先算法是以作业的长短来计算优先级，作业越短，其优先级越高。作业的长短是以作业所要求的运行时间来衡量的。
					在把短作业优先调度算法用于作业调度时，它将从外存的作业后备队列中选择若干个估计运行时间最短的作业，优先将它们调入内存运行。</p>
				<h5>优缺点</h5>
				<li>不利于长作业</li>
				<li>该算法完全未考虑作业的紧迫程度，因而不能保证紧迫性作业会被及时处理。</li>
			</div>
		}
		else if(choice=='4'){
			info=<div>
				<h4>高响应比优先HRRN</h4>
				<p>高响应比优先调度算法主要用于作业调度，该算法是对FCFS调度算法和SJF调度算法的一种综合平衡，同时考虑每个作业的等待时间和估计的运行时间。
					在每次进行作业调度时，先计算后备作业队列中每个作业的响应比，从中选出响应比最高的作业投入运行。</p>
				<h5>优缺点</h5>
				<li>当作业的等待时间相同时，则要求服务时间越短，其响应比越高，有利于短作业。</li>
				<li>当要求服务时间相同时，作业的响应比由其等待时间决定，等待时间越长，其响应比越高，因而它实现的是先来先服务。</li>
				<li>对于长作业，作业的响应比可以随等待时间的增加而提高，当其等待时间足够长时，其响应比便可升到很高，从而也可获得处理机。克服了饥饿状态，兼顾了长作业。</li>
			</div>
		}
		return(
			<div>
				<Nav choiceChange={this.choiceChange}/>
				<div className='row' id='content'style={{marginBottom:'80px'}}>
					<Content choice={this.state.choice} processes={this.state.processes} instance={this.state.instance}/>
					<BottomBar createProcess={this.createProcess}/>
				</div>
				<Result processes={this.state.processes} getInstance={this.getInstance}/>
				<div id="modal2" class="modal">
						<div class="modal-content">
							{info}
						</div>
						<div class="modal-footer">
							<a href="javascript:void(0)" class="modal-close waves-effect btn-flat" style={{backgroundColor:'#4CAF50',color:'white'}}>Agree</a>
						</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Index />, document.getElementById('root'));