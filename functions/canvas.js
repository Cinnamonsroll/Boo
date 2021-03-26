module.exports = {
  roundRect(ctx, x, y, width, height, radius, fill, stroke, fillstyle) {
    if (typeof stroke === "undefined") {
      stroke = true;
    }

    if (typeof radius === "undefined") {
      radius = 5;
    }

    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fillstyle;
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  },
  canvasUsername(
    ctx,
    canvas,
    username,
    discrim,
    x,
    font,
    textAlignment,
    paddingLeft,
    paddingRight
  ) {

    if (!ctx) throw new Error("Please provide a canvas context. (Option 1)");
    if (!canvas)
      throw new Error("Please provide the canvas workspace. (Option 2)");
    if (!username)
      throw new Error("Please provide a username to shorten. (Option 3)");
    if (!discrim)
      throw new Error("Please provide a user discriminator. (Option 4)");
    if (!x)
      throw new Error(
        "Please provide an X value for me to start the measurement from! (Option 5)"
      );
    if (!font) throw new Error("Please provide a font + font size. (Option 6)");
    if (!textAlignment) textAlignment = "left";
    if (!paddingLeft) paddingLeft = 0;
    if (!paddingRight) paddingRight = 0;

    ctx.font = font;
    ctx.textAlign = textAlignment;
    const width = ctx.measureText(username + "#" + discrim).width;
    let smallest = "";

    if (textAlignment == "left") {
      if (width + x + paddingRight > canvas.width) {
        for (let i = 0; i < username.length; i++) {
          let temp = `${username.substring(
            0,
            username.length - i
          )}...#${discrim}`;
          let widthTemp = ctx.measureText(temp).width;
          if (widthTemp + x + paddingRight < canvas.width && temp.length != 0) {
            if (
              smallest.length != 0 &&
              widthTemp + x + paddingRight < canvas.width &&
              widthTemp > ctx.measureText(smallest).width
            ) {
              smallest = temp;
            } else if (smallest.length == 0) {
              smallest = temp;
            }
          }
        }
        return smallest;
      } else {
        smallest = username + "#" + discrim;
        return smallest;
      }
    } else if (textAlignment == "right") {
      if (x - width - paddingLeft < 0) {
        for (let i = 0; i < username.length; i++) {
          let temp = `${username.substring(
            0,
            username.length - i
          )}...#${discrim}`;
          let widthTemp = ctx.measureText(temp).width;
          if (x - widthTemp - paddingLeft < canvas.width && temp.length != 0) {
            if (
              smallest.length != 0 &&
              x - widthTemp - paddingLeft < 0 &&
              widthTemp < ctx.measureText(smallest).width
            ) {
              smallest = temp;
            } else if (smallest.length == 0) {
              smallest = temp;
            }
          }
        }
        return smallest;
      } else {
        smallest = username + "#" + discrim;
        return smallest;
      }
    } else if (textAlignment == "center") {
      if (width / 2 + x + paddingRight > canvas.width) {
        for (let i = 0; i < username.length; i++) {
          let temp = `${username.substring(
            0,
            username.length - i
          )}...#${discrim}`;
          let widthTemp = ctx.measureText(temp).width / 2;
          if (widthTemp + x + paddingRight < canvas.width && temp.length != 0) {
            if (
              smallest.length != 0 &&
              widthTemp + x + paddingRight < canvas.width &&
              widthTemp > ctx.measureText(smallest).width
            ) {
              smallest = temp;
            } else if (smallest.length == 0) {
              smallest = temp;
            }
          }
        }
        return smallest;
      } else if (x - width / 2 - paddingLeft < 0) {
        for (let i = 0; i < username.length; i++) {
          let temp = `${username.substring(
            0,
            username.length - i
          )}...#${discrim}`;
          let widthTemp = ctx.measureText(temp).width / 2;
          if (x - widthTemp - paddingLeft < canvas.width && temp.length != 0) {
            if (
              smallest.length != 0 &&
              x - widthTemp - paddingLeft < 0 &&
              widthTemp < ctx.measureText(smallest).width
            ) {
              smallest = temp;
            } else if (smallest.length == 0) {
              smallest = temp;
            }
          }
        }
        return smallest;
      } else {
        smallest = username + "#" + discrim;
        return smallest;
      }
    } else {
      throw new Error(
        "The convertUsername function only supports text alignments of right, left and center."
      );
    }
  }
};
