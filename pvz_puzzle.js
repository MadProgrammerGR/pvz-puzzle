let list = document.getElementById("list");
console.log(list);
let sortable = Sortable.create(list, {animation: 200});

function onClickSolve() {
	let a = [];
  $("#list").children().each(function(idx, val){
  	a.push($(this).attr("alt"));
  });
  let moves = solve(a);
  console.log({"original:": a, "goal:": a.slice().sort(), "constructed:": applyMoves(a, moves)});

  $("#output-moves-label").show();
  $("#output-moves-label b").html(moves.length);

  let outputTxt = $("#output-moves");
  outputTxt.show();
  outputTxt.attr("cols", 3);
  outputTxt.attr("rows", moves.length);
  let out = moves.replace(/[LMR]/g, function(c) {
    return (c == "L" ? "L  " : c == "M" ? " M " : "  R") + "\n";
  });
  outputTxt.text(out);
}

// solve on each rotation to find shortest move sequence
function solve(a){
  let minMoves = [];
  let minLength = Number.MAX_VALUE;
  for (var i = 0; i < a.length; i++) {
    let moves = rotations(a.length - i, a.length) + _solve(a);
    if(moves.length < minLength){
      minMoves = moves;
      minLength = moves.length;
    }
    a.push(a.shift());
  }
  return minMoves;
}

// puzzle rules: sort it only by rotating left/right
// and swapping 3rd with 5th
function _solve(a) {
  let n = a.length;
  // traverse array by 2 steps
  let b = traverseWithStep(a, 2);
  let goal = traverseWithStep(a.slice().sort(), 2);
  for (let i = 0; i < b.length; i++) {
    b[i] = goal.indexOf(b[i]);
  }

  // sort it with bubblesort
  // (because only adjacent swaps are allowed)
  let moves = "";
  let pos = 0; // total rotations position
  for (let i = n - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      if (b[j] > b[j + 1]) {
        let tmp = b[j];
        b[j] = b[j + 1];
        b[j + 1] = tmp;
        // print moves of the (j,j+1) swap
        let numLefts = (pos + 2 * j - 2 + n) % n;
        let numRights = n - numLefts;
        moves += rotations(numRights, n);
        pos = (pos + numRights) % n;
        moves += "M";
      }
    }
  }

  // last rotations fix
  let rightsNeeded = n - pos;
  moves += rotations(rightsNeeded, n);
  return moves;
}

function traverseWithStep(arr, step) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let index = (step * i) % arr.length;
    result.push(arr[index]);
  }
  return result;
}

// right rotations to RRR or LLL etc
function rotations(r, n) {
  if (r < n - r) {
    return "R".repeat(r);
  } else {
    return "L".repeat(n - r);
  }
}

function applyMoves(arr, moves) {
  let result = arr.slice();
  for (let i = 0; i < moves.length; i++) {
    if (moves[i] == "M") {
      let tmp = result[2];
      result[2] = result[4];
      result[4] = tmp;
    } else if (moves[i] == "L") {
      let head = result.shift();
      result.push(head);
    } else {
      let tail = result.pop();
      result.unshift(tail);
    }
  }
  return result;
}
