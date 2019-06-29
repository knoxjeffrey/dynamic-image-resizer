"use strict";

const querystring = require("querystring");
import { stringManipulatorService } from "../services/stringManipulatorService"

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  // parse the querystrings key-value pairs. In our case it would be d=100x100
  const params = querystring.parse(request.querystring);

  // fetch the uri of original image
  let fwdUri = request.uri;

  // if there is no dimension attribute, just pass the request
  if(!params.d){
    callback(null, request);
    return;
  }

  // final modified url is of format /images/200x200/webp/image.jpg
  request.uri = stringManipulatorService.requestUri({ headers, params, fwdUri });
  callback(null, request);
};