import S3 from 'aws-sdk/clients/s3'


/** @description S3 config */

const s3 = new S3({
  accessKeyId: 'cw50994',
  secretAccessKey: 'd0066ce569287e8ec11617bcbfdcddc4',
  endpoint: 'https://s3.timeweb.com',
  s3ForcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})