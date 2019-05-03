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
		return(
			<nav id='nav'className="nav-extended animated slideInDown"style={{backgroundColor:'#2196F3','animationDuration':'0.8s',position: 'fixed'}}>
				<div className="nav-wrapper"style={{marginLeft:'20px'}}>
					<a href="#" className="brand-logo">进程调度算法</a>
				</div>
				<div className="nav-content">
					<ul className="tabs tabs-transparent">
						<li className="tab" onClick={this.choice.bind(this,1)}><a className="active" href="">FCFS</a></li>
						<li className="tab" onClick={this.choice.bind(this,2)}><a href="">RR</a></li>
						<li className="tab" onClick={this.choice.bind(this,3)}><a href="">Disabled Tab</a></li>
						<li className="tab" onClick={this.choice.bind(this,4)}><a href="">Test 4</a></li>
					</ul>
				</div>
			</nav>
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
			choice:1,
			processes:[]
		}
	}
	createProcess=(processes)=>{
		this.setState({
			processes:processes
		})
	}
	choiceChange=(choice)=>{
		this.setState({
			choice:choice
		})
	}
	render(){
		return(
			<div>
				<Nav choiceChange={this.choiceChange}/>
				<div className='row' id='content'style={{marginBottom:'80px'}}>
					<Content choice={this.state.choice} processes={this.state.processes}/>
					<util.BottomBar createProcess={this.createProcess}/>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Index />, document.getElementById('root'));