//用于取整数的最大值 例如  7取10    15取20等等
export function getBigNumMethod(n){
	n = Math.floor(n) + "";
	let len = n.length - 1;
	let firstNum = n.slice(0, 1);
	let arr = [1];
	let arr2 = [parseInt(firstNum)];
	let i = 0;
	while (len > i) {
		arr.push(0);
		arr2.push(0);
		i++
	}
	let newArr = arr.join("");
	let newArr2 = arr2.join("")
	let num = parseInt(newArr) + parseInt(newArr2);
	if (num < 10) {
		return 10
	} else {
		return num
	}
}