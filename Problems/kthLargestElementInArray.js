/*
https://www.techiedelight.com/find-kth-largest-element-array/

Find k’th largest element in an array
Given an integer array, find k’th largest element in the array where k is a positive integer less than or equal to the length of array.

For example,

Input:
 
arr = [7, 4, 6, 3, 9, 1]
k = 2
 
Output:
 
The 2nd largest array element is 7
Practice this problem


A simple solution would be to use an efficient sorting algorithm to sort the array in descending order and return the element at (k-1)'th index. The worst-case time complexity of this approach will be O(n.log(n)), where n is the size of the input. We can improve the time complexity using the following methods:

Using Min Heap
We can easily solve this problem in O(n.log(k)) by using a min-heap. The idea is to construct a min-heap of size k and insert the first k elements of array A[0…k-1] into the min-heap. Then for each of the remaining array elements A[k…n-1], if that element is more than the min-heap’s root, replace the root with the current element. Repeat this process until the array is exhausted. Now we will be left with top k largest array elements in the min-heap, and k'th largest element will reside at the root of the min-heap.

The algorithm can be implemented as follows in C++, Java, and Python:


Using Max Heap
We can easily solve this problem in O(n + k.log(n)) by using a max-heap. The idea is to simply construct a max-heap of size n and insert all the array elements [0…n-1] into it. Then pop first k-1 elements from it. Now k'th largest element will reside at the root of the max-heap.

The algorithm can be implemented as follows in C++, Java, and Python:
*/