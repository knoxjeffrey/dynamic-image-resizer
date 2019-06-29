"use strict";

import * as AWS from "aws-sdk"

const S3 = new AWS.S3({
  signatureVersion: "v4",
});
// const BUCKET = process.env.BUCKET;
const BUCKET = "serverless-dynamic-image-resizer"

class S3Service {
  constructor() { }

  getObject({ Key }) {
    return S3.getObject({ Bucket: BUCKET, Key })
  }

  putObject({ Body, format, Key }) {
    return (
      S3.putObject({
        Body,
        Bucket: BUCKET,
        ContentType: "image/" + format,
        CacheControl: "max-age=31536000",
        Key,
        StorageClass: "STANDARD"
      })
    )
  }
}

export const s3Service = new S3Service()