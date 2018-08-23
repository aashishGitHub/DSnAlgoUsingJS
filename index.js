var myLibrary = {};
 		myLibrary.sumBigIntegers = function(stringFirstNum,stringSecondNum){			
			let bigIntString,smallIntString = null;
			let reversedBigIntStrArray,reversedSmallIntStrArray,reversedAdditionStrArray = [];
			let carryOver = 0;
 			if(typeof(stringFirstNum) === "number" && typeof(stringSecondNumb) === "number"){
				stringFirstNum = stringFirstNum.toString();
				stringSecondNum = stringSecondNum.toString();
			}
			let lengthFirstNumStr = stringFirstNum.length;
			let lengthSecondNumStr = stringSecondNum.length;
			if(lengthFirstNumStr>lengthSecondNumStr || lengthFirstNumStr === lengthSecondNumStr)
			{
				bigIntString = stringFirstNum;
				smallIntString  =stringSecondNum;
			}
			else{
				bigIntString = stringSecondNum;
				smallIntString = stringFirstNum;
			}
			reversedBigIntStrArray = bigIntString.split("").reverse();
			reversedSmallIntStrArray = smallIntString.split("").reverse();
			for(let i=0,j=0;i<reversedBigIntStrArray.length;i++,j++){
 				var smallIntStringChar = reversedSmallIntStrArray[j] === undefined ? "0" : reversedSmallIntStrArray[j];
 				var total = parseInt(reversedBigIntStrArray[i])+parseInt(smallIntStringChar)+carryOver;
				var digit = total % 10;
				carryOver = Math.floor(total/10);
 				reversedAdditionStrArray.push(digit);
			}
			if(carryOver>0)
				reversedAdditionStrArray.push(carryOver);
			var finalAdditionResult = reversedAdditionStrArray.reverse().join("");
			return finalAdditionResult.replace(/^0+/, '');
		}
