/* @legume
 * @name test
 * @require ./build/stdio-primer.js as stdio
 */

// So that there's no jittering when changing the text and awaiting createImageBitmap
let oldFile, bitmap;

stdio
  .loadStyleSheet()
  .title("stdio.js")
  .add(
    { type: "heading", size: 1, text: "test" },
    {
      type: "textInput",
      name: "inp",
      transform: str =>
        str
          .split("")
          .reverse()
          .join("")
    },
    { type: "output", link: "inp" },
    {
      type: "checkbox",
      name: "check",
      options: ["a", "b", "c"]
    },
    {
      type: "output",
      link: "check"
    },
    {
      type: "radio",
      options: ["1", { val: "2", label: "h" }, "3"],
      name: "group"
    },
    { type: "output", link: "group" },
    {
      type: "textInput",
      name: "tocanvas",
      label: "this will be put on the canvas"
    },
    {
      type: "file",
      name: "file",
      label: "if this is an image it will be put on the canvas"
    },
    {
      type: "canvas",
      name: "canv",
      draw: async (ctx, { tocanvas, file }, canvas) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(tocanvas, 10, 10);
        if (file !== oldFile && file) {
          bitmap = await createImageBitmap(file);
          oldFile = file;
        }
        if (bitmap) ctx.drawImage(bitmap, 20, 20);
      }
    },
    { type: "button", label: "click", handler: () => alert("hey"), name: "btn" }
  );

window.stdio = stdio;
