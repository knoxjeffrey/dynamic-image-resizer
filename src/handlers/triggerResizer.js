"use strict";

import http from "http"
import https from "https"
const querystring = require("querystring");

import { s3Service } from "../services/s3Service"
import { sharpService } from "../services/sharpService"

exports.handler = (event, context, callback) => {
  let response = event.Records[0].cf.response;

  console.log("Response status code :%s", response.status);

  //check if image is not present
  if (response.status == 404) {

    let request = event.Records[0].cf.request;
    let params = querystring.parse(request.querystring);

    // if there is no dimension attribute, just pass the response
    if (!params.d) {
      callback(null, response);
      return;
    }

    // read the dimension parameter value = width x height and split it by 'x'
    let dimensionMatch = params.d.split("x");

    // read the required path. Ex: uri /images/100x100/webp/image.jpg
    let path = request.uri;

    // read the S3 key from the path variable.
    // Ex: path variable /images/100x100/webp/image.jpg
    let key = path.substring(1);

    // parse the prefix, width, height and image name
    // Ex: key=images/200x200/webp/image.jpg
    let prefix, originalKey, match, width, height, format, imageName;
    let startIndex;

    try {
      match = key.match(/(.*)\/(\d+)x(\d+)\/(.*)\/(.*)/);
      prefix = match[1];
      width = parseInt(match[2], 10);
      height = parseInt(match[3], 10);

      // correction for jpg required for 'Sharp'
      format = match[4] == "jpg" ? "jpeg" : match[4];
      imageName = match[5];
      originalKey = prefix + "/" + imageName;
    }
    catch (err) {
      // no prefix exist for image..
      console.log("no prefix present..");
      match = key.match(/(\d+)x(\d+)\/(.*)\/(.*)/);
      width = parseInt(match[1], 10);
      height = parseInt(match[2], 10);

      // correction for jpg required for 'Sharp'
      format = match[3] == "jpg" ? "jpeg" : match[3]; 
      imageName = match[4];
      originalKey = imageName;
    }

    // get the source image file
    s3Service.getObject({ Key: originalKey }).promise()
      // then perform the resize operation
      .then(data => sharpService.resizeImage({ body: data.Body, width, height, format }))
      .then(buffer => {
        // save the resized object to S3 bucket with appropriate object key.
        s3Service.putObject({ Body: buffer, format, Key: key }).promise()
        // even if there is exception in saving the object we send back the generated
        // image back to viewer below
        .catch(() => { console.log("Exception while writing resized image to bucket")});

        // generate a binary response with resized image
        response.status = 200;
        response.body = buffer.toString("base64");
        response.bodyEncoding = "base64";
        response.headers["content-type"] = [{ key: "Content-Type", value: "image/" + format }];
        callback(null, response);
      })
    .catch( err => {
      console.log("Exception while reading source image :%j", err);
    });
  } // end of if block checking response statusCode
  else {
    // allow the response to pass through
    callback(null, response);
  }
};
