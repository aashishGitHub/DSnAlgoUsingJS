const addBinary = (input1, input2 ) => {
    
    // Lets have 2 pointers to indicate the last character of 2 inputs
    // so that , even if one of the input length is smaller, it will continue calculating with the other input
    let i = input1.length -1;
    let j = input2.length -1;
    let carry = 0;

    let result = "";

    while (i >= 0 || j >= 0) {
        let sum = carry;

        // For the last character in the inputs, get the sum
        if (i >= 0) { 
            sum+= input1[i] - 0;  
            i--;      
        }
        if (j >= 0) { 
            sum+= input2[j] - 0;
            j--;
       
        }

        // Carry if 2 or 3   (i.e. if >1 )
        carry = sum > 1 ? 1: 0;

        // %  will help to get the digit of sum, and we have already calculated carry
        // i.e for 0 -> 0,  1-> 1,  2->0 again, and also for 3->1  so all the cases of a binary sum is taken care
        result = (sum % 2) + result;
    }

    if(carry) {
        result = carry+result;
    }


    return result;

 }

 addBinary("1010", "1000");
 // 10010