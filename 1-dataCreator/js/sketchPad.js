class SketchPad {
  constructor(container, size = 400) {
    // container here is pointing to `<div id="sketchPadContainer"></div>`
    this.canvas = document.createElement('canvas'); // creating a HTML `<canvas>` element
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
      background-color: white;
      box-shadow: 0px 0px 10px 2px black;
    `;
    container.appendChild(this.canvas); // appending this `canvas` to the `container`(i.e. to the `div`)

    const lineBreak = document.createElement('br'); // creating a HTML `<br>` (line break) element
    container.appendChild(lineBreak);

    // Implementing and Undo Button to the container
    this.undoBtn = document.createElement('button'); // creating HTML `<button>` element
    this.undoBtn.innerHTML = 'UNDO';
    container.appendChild(this.undoBtn);

    // to draw on this canvas or container
    this.ctx = this.canvas.getContext('2d');

    this.reset();

    // adding event listeners to detect the mouse actions
    this.#addEventListeners(); // if we add `#` in-front of any method or attribute then it becomes `private field` (i.e. it cannot be called from outside of this class)
  }

  // public method
  reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#redraw(); // to keep the `UNDO` button disabled whenever we refresh or restart
  }

  // private methods starts with `#`
  #addEventListeners() {
    this.canvas.onmousedown = (event) => {
      // using this we will figure out the coordinates
      const mouse = this.#getMouse(event);
      // console.log(mouse);
      this.paths.push([mouse]); // is an array of arrays that contains the mouse when we just click on the canvas that's what we get one point added into this paths array
      this.isDrawing = true; // this marks drawing has started
    };

    this.canvas.onmousemove = (event) => {
      // we will process this event only if we are drawing
      if (this.isDrawing) {
        // using this we will figure out the coordinates
        const mouse = this.#getMouse(event);
        const lastPath = this.paths[this.paths.length - 1];
        lastPath.push(mouse); // adding last path to paths array
        // as it was checked earlier with if condition that we are drawing so we don't need that
        // console.log(this.paths.length);
        this.#redraw(); // to draw on canvas
      }
    };

    // To address the issue of the `mouseup` event not triggering when moving out and back into the canvas we would use 
    // this.canvas.onmouseup = () => { // earlier
    document.onmouseup=()=>{
      // this is for telling mouse to move your nib up
      this.isDrawing = false;
    };

    // As the above event listeners are for the mouse so they only works on Desktop but on mobile like devices we work with touch not click so let's create some event listeners for that
    this.canvas.ontouchstart = (event) => {
      const location = event.touches[0]; // getting location start from the first touch as multi touch is also possible on mobiles
      this.canvas.onmousedown(location); // so as to use the same above code
    };

    this.canvas.ontouchmove = (event) => {
      const location = event.touches[0];
      this.canvas.onmousemove(location);
    };
// To address the issue of the `ontouchend` event not triggering when moving out and back into the canvas we would use 
    // this.canvas.ontouchend = () => { // earlier
    document.ontouchend = () => {
      this.canvas.onmouseup();
    };

    this.undoBtn.onclick = () => {
      this.paths.pop(); // removing the last drawn element
      this.#redraw();
    };
  }

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // starting from top left corner to bottom right end
    draw.paths(this.ctx, this.paths);
    // we shouldn't be able to undo things after the canvas or container or drawing area is empty so
    if (this.paths.length > 0) {
      this.undoBtn.disabled = false;
    } else {
      this.undoBtn.disabled = true;
    }
  }

  #getMouse = (event) => {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(event.clientX - rect.left), // X-coordinates
      Math.round(event.clientY - rect.top), // Y-coordinates
    ];
  };
}
