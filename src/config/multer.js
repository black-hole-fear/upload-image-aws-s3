const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) cb(err)
        //nome da imagem
        file.key = `${hash.toString('hex')}-${file.originalname}`
        cb(null, file.key)
      })
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_NAME, //nome da pasta no s3
    contentType: multerS3.AUTO_CONTENT_TYPE, // abre o arquivo do s3 em tela e nao baixa ele
    acl: 'public-read',//permissao de leitura
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) cb(err)
        //nome da imagem
        const fileName = `${hash.toString('hex')}-${file.originalname}`
        cb(null, fileName)
      })
    }
  })
}

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'), //caminho das imgs
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024, //2mg
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ]

    if(allowedMimes.includes(file.mimetype)){
      cb(null, true)
    } else {
      cb(new Error('Invalid file type.'))
    }

  }
}