const router = require('express').Router()
const path = require('path')
const fs = require('fs')

router.post('/api/upload', (req, res) =>{
    console.log(req.body)
  const fileName = req.body.fileName;
  const chunkIndex = req.body.chunkIndex;
  const fileChunk = req.files.fileChunk;
  const filePath = path.join('public', fileName);
 
  // 将切片保存到服务器
  fs.writeFileSync(
    `${filePath}.${chunkIndex}`,
    fileChunk.data,
    { encoding: 'base64' }
  );
 
  // 检查所有切片是否上传完毕
  for (let i = 0; i < req.body.totalSize / req.body.chunkSize; i++) {
    if (!fs.existsSync(`${filePath}.${i}`)) {
      return res.json({ success: false });
    }
  }
 
  // 重组文件
  let fileData = '';
  for (let i = 0; i < req.body.totalSize / req.body.chunkSize; i++) {
    fileData += fs.readFileSync(`${filePath}.${i}`, { encoding: 'base64' });
    fs.unlinkSync(`${filePath}.${i}`); // 删除已使用的切片
  }
 
  fs.writeFileSync(filePath, fileData, { encoding: 'base64' });
  res.json({ success: true });
})


module.exports = router