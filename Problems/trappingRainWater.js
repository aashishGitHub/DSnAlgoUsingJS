// Trapping Rain problem
// Max water container
//	Find the maximum area where the maximum water can be trapped

const getWidthForMaxWaterContainer = ( input) => {
			
    let startIndex = 0;
    let endIndex = input.length - 1;
    let Hmin = 0;
    let HminIndex = 0;

    // Assign the Hmin
    if (input[startIndex] <= input[endIndex]) {
        Hmin = input[startIndex];
        HminIndex = startIndex;
    } else {
        Hmin = input[endIndex];
        HminIndex = endIndex;
    }

    let width = endIndex - startIndex; // +1
    let area = width * Hmin;

    while (width > 0) {
        // Case 1
        if (HminIndex == startIndex) {
            
            // Increase the HminIndex until the next index is smaller, and stop for a greater value
            HminIndex++;
            while (input[HminIndex] <= Hmin && HminIndex < endIndex) {
                HminIndex++;
            }
            // As new greater Value is found for startIndex, reassign it
            startIndex = HminIndex;
            Hmin = input[HminIndex];

            // Assign the Hmin value, by comparing the reassigned HminIndex/ StartIndex with the endIndex
            if (input[startIndex] <= input[endIndex]) {
                Hmin = input[startIndex];
                HminIndex = startIndex;
            } else {
                Hmin = input[endIndex];
                HminIndex = endIndex;
            }

            width = endIndex - startIndex;
            area = Math.max(area, width * Hmin);

        }

        // Case 2, just as above       
        if (HminIndex == endIndex) {
            HminIndex--;
            while (input[HminIndex] <= Hmin && HminIndex > startIndex) {
                HminIndex--;
            }
            endIndex = HminIndex;

        }

        Hmin = input[HminIndex];

        // Assign the Hmin
        if (input[startIndex] <= input[endIndex]) {
            Hmin = input[startIndex];
            HminIndex = startIndex;
        } else {
            Hmin = input[endIndex];
            HminIndex = endIndex;
        }
        width = endIndex - startIndex;
        area = Math.max(area, width * Hmin);

    }

    return area;
}

let input = [1, 8, 6, 2, 5, 4, 8, 3, 7]
let result = getWidthForMaxWaterContainer(input);
console.log(result);

