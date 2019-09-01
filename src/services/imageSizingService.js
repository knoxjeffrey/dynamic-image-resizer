"use strict";

class ImageSizingService {
  constructor() { }

  requestUri({ headers, params, fwdUri }) {
    // defines the allowed dimensions, default dimensions and how much variance from allowed
    // dimension is allowed.
    const variables = {
      // allowedDimension : [ {w:100,h:100}, {w:200,h:200}, {w:300,h:300}, {w:400,h:400} ],
      // defaultDimension : {w:200,h:200},
      allowedWidths : [ 360, 720, 960, 1960 ],
      defaultWidth : 960,
      variance: 20,
      webpExtension: "webp"
    };

    // read the width parameter value
    let width = params.w;

    // parse the prefix, image name and extension from the uri.
    // In this case /images/image.jpg
    const match = fwdUri.match(/(.*)\/(.*)\.(.*)/);

    let prefix = match[1];
    let imageName = match[2];
    let extension = match[3];

    // define variable to be set to true if requested dimension is allowed.
    let matchFound = false;

    // calculate the acceptable variance. If image dimension is 105 and is within acceptable
    // range, then in our case, the dimension would be corrected to 100.
    let variancePercent = (variables.variance/100);

    for (let width of variables.allowedWidths) {
      let minWidth = width - (width * variancePercent);
      let maxWidth = width + (width * variancePercent);
      if(width >= minWidth && width <= maxWidth){
        width = width;
        matchFound = true;
        break;
      }
    }
    // if no match is found from allowed dimension with variance then set to default
    //dimensions.
    if(!matchFound){
      width = variables.defaultWidth;
    }

    let url = [];
    // build the new uri to be forwarded upstream
    url.push(prefix);
    url.push(width);

    // read the accept header.
    let accept = headers["accept"]?headers["accept"][0].value:"";
    // check support for webp
    if (accept.includes(variables.webpExtension)) {
      url.push(variables.webpExtension);
    }
    else{
      url.push(extension);
    }
    url.push(imageName+"."+extension);

    return url.join("/");
  }
}

export const imageSizingService = new ImageSizingService()
