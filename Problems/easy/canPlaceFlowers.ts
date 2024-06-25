function canPlaceFlowers_NotWorking(flowerbed: number[], n: number): boolean {
    if(n===0) {
        return true;
    }
     let i = 0;
    //if 1st item is 0, check next item is 0, then insert 1 to 1st item
    if(flowerbed[i] === 0 && flowerbed[i+1] === 0) {
        flowerbed[i] = 1;
        n=n-1
    }


    // Assuming, 1st item is 1
    // for n>0, iterate for all items in flowerBed
    // calculate if valid place
        // if ith item is 1, -- take next 3 items should be 0
           // then fill in the original array's 2nd item 
            // n--

    // at the end if loop, if  n>0, then return false
    
   
    while(i< flowerbed.length-3) {
        if(flowerbed[i] === 1 && flowerbed[i+1] ===0 
        && flowerbed[i+2] === 0 && flowerbed[i+3] ===0) {
            flowerbed[i+2] = 1;
            i+=2;
            n-=1;
            
        } else {
            i++;
        }
    }

    return n===0 ? true: false;
};

function canPlaceFlowers(fl: number[], n: number): boolean {
    if(n === 0) { 
        return true;
    }


    for(let i =0; i< fl.length && n>0; i++) {

        if(fl[i] === 1) {
            continue;
        }

        let lFree = false;
        let rFree = false;

        if(i === 0) {
            lFree = true;
        }
        if(i == fl.length-1) {
            rFree = true;
        }
        
        if(i>0) {
        lFree = fl[i-1] === 0;
        }
        
        if(i< fl.length-2) {
        rFree = fl[i+1] === 0;	
        }
    
        if(lFree && rFree ) {
            fl[i] = 1;
            n--;
        }
    }
        
        return n === 0;
    }
// Input: flowerbed = [1,0,0,0,1], n = 1
// Output: true

const res = canPlaceFlowers([1,0,0,0,1], 1); // true
console.log(res); // true