"use strict";

const querystring = require("querystring");
import { imageSizingService } from "../services/imageSizingService"

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  // parse the querystrings key-value pairs. In our case it would be d=100x100
  const params = querystring.parse(request.querystring);

  // fetch the uri of original image
  let fwdUri = request.uri;

  // if there is no dimension attribute, just pass the request
  if(!params.w){
    callback(null, request);
    return;
  }

  // final modified url is of format /images/960/webp/image.jpg
  request.uri = imageSizingService.requestUri({ headers, params, fwdUri });
  callback(null, request);
};
