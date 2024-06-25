function moveZeroes(nums: number[]): void {

    for(let firstZero=0, i=0; i<nums.length; i++) {
        if(nums[i]!=0) {
            [nums[firstZero], nums[i]] = [nums[i], nums[firstZero]];
            firstZero++;
        }
    }
};

// implementation 2
function moveZeroes1(nums: number[]): void {
    let insertPos = 0; // Position to insert the next non-zero element
    for (let num of nums) {
        if (num !== 0) {
            nums[insertPos++] = num; // Place non-zero at insertPos and increment insertPos
        }
    }
    // Fill the rest of the array with zeros
    while (insertPos < nums.length) {
        nums[insertPos++] = 0;
    }
}