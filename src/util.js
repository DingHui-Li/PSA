import {process} from "./App"

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
export function getIndexMinServertime(processes){
	let min=0;
	let count=processes.length;
	for(let i=0;i<count;i++){
		if(processes[i].serverTime<processes[min].serverTime){
			min=i;
		}
	}
	return min;

}
export function calcPriority(processes,currentTime){
	let length=processes.length;
	for(let i=0;i<length;i++){
		processes[i].priority=parseFloat((currentTime-processes[i].arriveTime+processes[i].serverTime)/processes[i].serverTime).toFixed(2);
	}
}
export function getIndexMaxPriority(processes){
	let max=0;
	let length=processes.length;
	for(let i=0;i<length;i++){
		if(processes[i].priority>processes[max].priority){
			max=i;
		}
	}
	return max;
}