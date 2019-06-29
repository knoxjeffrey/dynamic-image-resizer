"use strict";

const Sharp = require("sharp");

class SharpService {
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

export const sharpService = new SharpService()