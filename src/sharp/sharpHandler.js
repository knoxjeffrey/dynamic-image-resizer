const Sharp = require('sharp');

class SharpHandler {
  constructor() { }

  resizeImage({ body, width, height, format }) {
    return (
      Sharp(body)
        .resize(width, height)
        .toFormat(format)
        .toBuffer()
    )
  }
}

export const sharpHandler = new SharpHandler()