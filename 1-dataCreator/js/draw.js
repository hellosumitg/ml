const draw = {}; // initializing the draw object

draw.path = (ctx, path, color = 'black') => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(...path[0]); // `moveTo` has typically 2 parameters `X` and `Y` coordinates (here move to the first or starting point in the path)
  // iterate through the path to path length form a line
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(...path[i]);
  }
  ctx.lineCap = 'round'; // making the corners round
  ctx.lineJoin = 'round';
  ctx.stroke();
};


// for drawing multiple paths
draw.paths = (ctx, paths, color = 'black') => {
  for (const path of paths) {
    draw.path(ctx, path, color);
  }
};
