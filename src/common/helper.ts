export class Helper {
  static customFileName(req, file, cb) {
    var str = file.mimetype;
    var fileType = str.substring(str.lastIndexOf("/") + 1, str.length);
    const originalName = file.originalname.split(".")[0];
    //   cb(null, originalName + '-' + uniqueSuffix+"."+fileExtension);
    cb(null, originalName + "." + fileType);
  }
}