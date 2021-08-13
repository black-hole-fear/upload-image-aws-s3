const mongoose = require('mongoose')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3()

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String, //hash
  url: String, //caminho s3
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

//salvar nome da url como local se estiver vazia
PostSchema.pre('save', function(){
  if(!this.url){
    this.url = `${process.env.APP_URL}/files/${this.key}`
  }
})

//deletar os arquivos do s3
PostSchema.pre('remove', function(){
  if(process.env.STORAGE_TYPE == 's3'){
    return s3.deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: this.key,
    }).promise()
  } else {
    return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key))
  }
})



module.exports = mongoose.model('Post', PostSchema)