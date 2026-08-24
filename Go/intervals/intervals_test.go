package intervals

import (
	"reflect"
	"testing"
)

func TestMerge(t *testing.T) {
	cases := []struct {
		in, want [][]int
	}{
		{[][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}, [][]int{{1, 6}, {8, 10}, {15, 18}}},
		{[][]int{{1, 4}, {4, 5}}, [][]int{{1, 5}}},         // touching counts as overlap
		{[][]int{{1, 4}, {2, 3}}, [][]int{{1, 4}}},         // fully nested needs max()
		{[][]int{{5, 6}, {1, 2}}, [][]int{{1, 2}, {5, 6}}}, // unsorted input
		{[][]int{{1, 4}}, [][]int{{1, 4}}},
	}
	for _, c := range cases {
		if got := Merge(c.in); !reflect.DeepEqual(got, c.want) {
			t.Errorf("Merge(%v) = %v, want %v", c.in, got, c.want)
		}
	}
	if got := Merge(nil); got != nil {
		t.Errorf("Merge(nil) = %v, want nil", got)
	}
}

func TestMergeDoesNotMutateCaller(t *testing.T) {
	// copy() on [][]int is shallow — this guards the aliasing trap.
	in := [][]int{{1, 3}, {2, 6}}
	want := [][]int{{1, 3}, {2, 6}}
	Merge(in)
	if !reflect.DeepEqual(in, want) {
		t.Errorf("Merge mutated its input: %v, want %v", in, want)
	}
}

func TestInsert(t *testing.T) {
	cases := []struct {
		in       [][]int
		newIv    []int
		want     [][]int
		scenario string
	}{
		{[][]int{{1, 3}, {6, 9}}, []int{2, 5}, [][]int{{1, 5}, {6, 9}}, "overlaps the first"},
		{
			[][]int{{1, 2}, {3, 5}, {6, 7}, {8, 10}, {12, 16}},
			[]int{4, 8},
			[][]int{{1, 2}, {3, 10}, {12, 16}},
			"swallows three intervals",
		},
		{nil, []int{5, 7}, [][]int{{5, 7}}, "empty list"},
		{[][]int{{1, 5}}, []int{6, 8}, [][]int{{1, 5}, {6, 8}}, "appends after"},
		{[][]int{{3, 5}}, []int{1, 2}, [][]int{{1, 2}, {3, 5}}, "prepends before"},
		{[][]int{{1, 5}}, []int{2, 3}, [][]int{{1, 5}}, "already contained"},
	}
	for _, c := range cases {
		if got := Insert(c.in, c.newIv); !reflect.DeepEqual(got, c.want) {
			t.Errorf("Insert(%v,%v) [%s] = %v, want %v", c.in, c.newIv, c.scenario, got, c.want)
		}
	}
}

func TestEraseOverlapIntervals(t *testing.T) {
	cases := []struct {
		in   [][]int
		want int
	}{
		{[][]int{{1, 2}, {2, 3}, {3, 4}, {1, 3}}, 1},
		{[][]int{{1, 2}, {1, 2}, {1, 2}}, 2},
		{[][]int{{1, 2}, {2, 3}}, 0}, // touching is not overlapping here
		{[][]int{{1, 100}, {11, 22}, {1, 11}, {2, 12}}, 2},
		{nil, 0},
	}
	for _, c := range cases {
		if got := EraseOverlapIntervals(c.in); got != c.want {
			t.Errorf("EraseOverlapIntervals(%v) = %d, want %d", c.in, got, c.want)
		}
	}
}

func TestCanAttendMeetings(t *testing.T) {
	if CanAttendMeetings([][]int{{0, 30}, {5, 10}, {15, 20}}) {
		t.Error("expected a conflict")
	}
	if !CanAttendMeetings([][]int{{7, 10}, {2, 4}}) {
		t.Error("expected no conflict")
	}
	if !CanAttendMeetings([][]int{{1, 2}, {2, 3}}) {
		t.Error("back-to-back meetings are attendable")
	}
	if !CanAttendMeetings(nil) {
		t.Error("no meetings is attendable")
	}
}

func TestMinMeetingRooms(t *testing.T) {
	cases := []struct {
		in   [][]int
		want int
	}{
		{[][]int{{0, 30}, {5, 10}, {15, 20}}, 2},
		{[][]int{{7, 10}, {2, 4}}, 1},
		{[][]int{{1, 5}, {2, 6}, {3, 7}}, 3},
		{[][]int{{1, 2}, {2, 3}, {3, 4}}, 1}, // a room freed at 2 is reusable at 2
		{[][]int{{9, 10}, {4, 9}, {4, 17}}, 2},
		{nil, 0},
	}
	for _, c := range cases {
		if got := MinMeetingRooms(c.in); got != c.want {
			t.Errorf("MinMeetingRooms(%v) = %d, want %d", c.in, got, c.want)
		}
	}
}

func TestIntervalIntersection(t *testing.T) {
	a := [][]int{{0, 2}, {5, 10}, {13, 23}, {24, 25}}
	b := [][]int{{1, 5}, {8, 12}, {15, 24}, {25, 26}}
	want := [][]int{{1, 2}, {5, 5}, {8, 10}, {15, 23}, {24, 24}, {25, 25}}
	if got := IntervalIntersection(a, b); !reflect.DeepEqual(got, want) {
		t.Errorf("IntervalIntersection = %v, want %v", got, want)
	}
	if got := IntervalIntersection(nil, b); len(got) != 0 {
		t.Errorf("IntervalIntersection(nil,b) = %v", got)
	}
	// Disjoint lists intersect nowhere.
	if got := IntervalIntersection([][]int{{1, 2}}, [][]int{{5, 6}}); len(got) != 0 {
		t.Errorf("disjoint = %v", got)
	}
}
