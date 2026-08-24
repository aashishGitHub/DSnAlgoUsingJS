package matrix

import (
	"reflect"
	"slices"
	"testing"
)

func TestRotate(t *testing.T) {
	m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
	Rotate(m)
	want := [][]int{{7, 4, 1}, {8, 5, 2}, {9, 6, 3}}
	if !reflect.DeepEqual(m, want) {
		t.Errorf("Rotate = %v, want %v", m, want)
	}

	m2 := [][]int{{1, 2}, {3, 4}}
	Rotate(m2)
	if !reflect.DeepEqual(m2, [][]int{{3, 1}, {4, 2}}) {
		t.Errorf("Rotate 2x2 = %v", m2)
	}

	m3 := [][]int{{1}}
	Rotate(m3)
	if !reflect.DeepEqual(m3, [][]int{{1}}) {
		t.Errorf("Rotate 1x1 = %v", m3)
	}

	// Four rotations return to the original — a property that catches a
	// transpose loop starting at c=r instead of c=r+1.
	orig := [][]int{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}, {13, 14, 15, 16}}
	work := make([][]int, len(orig))
	for i, row := range orig {
		work[i] = slices.Clone(row)
	}
	for range 4 {
		Rotate(work)
	}
	if !reflect.DeepEqual(work, orig) {
		t.Errorf("four rotations = %v, want the original %v", work, orig)
	}
}

func TestSpiralOrder(t *testing.T) {
	cases := []struct {
		matrix [][]int
		want   []int
	}{
		{[][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}, []int{1, 2, 3, 6, 9, 8, 7, 4, 5}},
		{
			[][]int{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}},
			[]int{1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7},
		},
		{[][]int{{1, 2, 3}}, []int{1, 2, 3}},     // single row
		{[][]int{{1}, {2}, {3}}, []int{1, 2, 3}}, // single column
		{[][]int{{1}}, []int{1}},
		// 4x3: the case where a careless implementation emits the middle twice.
		{
			[][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}, {10, 11, 12}},
			[]int{1, 2, 3, 6, 9, 12, 11, 10, 7, 4, 5, 8},
		},
	}
	for _, c := range cases {
		if got := SpiralOrder(c.matrix); !slices.Equal(got, c.want) {
			t.Errorf("SpiralOrder(%v) = %v, want %v", c.matrix, got, c.want)
		}
	}
	if got := SpiralOrder(nil); got != nil {
		t.Errorf("SpiralOrder(nil) = %v", got)
	}
}

func TestSpiralOrderVisitsEveryCellOnce(t *testing.T) {
	m := [][]int{}
	next := 1
	for r := range 5 {
		row := make([]int, 4)
		for c := range 4 {
			row[c] = next
			next++
		}
		m = append(m, row)
		_ = r
	}
	got := SpiralOrder(m)
	if len(got) != 20 {
		t.Fatalf("SpiralOrder produced %d values, want 20", len(got))
	}
	sorted := slices.Clone(got)
	slices.Sort(sorted)
	for i, v := range sorted {
		if v != i+1 {
			t.Fatalf("value %d appears wrong number of times: %v", i+1, got)
		}
	}
}

func TestSetZeroes(t *testing.T) {
	cases := []struct {
		matrix, want [][]int
	}{
		{
			[][]int{{1, 1, 1}, {1, 0, 1}, {1, 1, 1}},
			[][]int{{1, 0, 1}, {0, 0, 0}, {1, 0, 1}},
		},
		{
			// A zero in row 0 and column 0 — the case the marker trick must
			// handle with its two extra booleans.
			[][]int{{0, 1, 2, 0}, {3, 4, 5, 2}, {1, 3, 1, 5}},
			[][]int{{0, 0, 0, 0}, {0, 4, 5, 0}, {0, 3, 1, 0}},
		},
		{[][]int{{1, 2}, {3, 4}}, [][]int{{1, 2}, {3, 4}}}, // no zeroes at all
		{[][]int{{0}}, [][]int{{0}}},
		{
			[][]int{{1, 0}, {1, 1}},
			[][]int{{0, 0}, {1, 0}},
		},
	}
	for _, c := range cases {
		in := make([][]int, len(c.matrix))
		for i, row := range c.matrix {
			in[i] = slices.Clone(row)
		}
		SetZeroes(c.matrix)
		if !reflect.DeepEqual(c.matrix, c.want) {
			t.Errorf("SetZeroes(%v) = %v, want %v", in, c.matrix, c.want)
		}
	}
}
