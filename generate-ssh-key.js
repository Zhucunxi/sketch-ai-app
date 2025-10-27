const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 创建密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {});

// 转换为OpenSSH格式
const publicKeyOpenSSH = publicKey.export({
  type: 'spki',
  format: 'pem'
});

const privateKeyOpenSSH = privateKey.export({
  type: 'pkcs8',
  format: 'pem'
});

// 保存到文件
const publicKeyPath = path.join(__dirname, 'id_ed25519.pub');
const privateKeyPath = path.join(__dirname, 'id_ed25519');

// 简单的OpenSSH格式转换
let publicKeyFormatted = 'ssh-ed25519 ';
const publicKeyData = Buffer.from(publicKeyOpenSSH.replace(/\-+BEGIN PUBLIC KEY\-+|\-+END PUBLIC KEY\-+/g, '').replace(/\s/g, ''), 'base64');
publicKeyFormatted += publicKeyData.toString('base64') + ' zhu371481@qq.com';

// 写入文件
fs.writeFileSync(privateKeyPath, privateKeyOpenSSH);
fs.writeFileSync(publicKeyPath, publicKeyFormatted);

console.log('SSH密钥已生成:');
console.log('公钥路径:', publicKeyPath);
console.log('私钥路径:', privateKeyPath);
console.log('\n公钥内容:');
console.log(publicKeyFormatted);