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