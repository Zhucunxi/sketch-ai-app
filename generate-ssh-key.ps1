# 简单的SSH密钥生成脚本
$sshDir = "$env:USERPROFILE\.ssh"
$keyPath = "$sshDir\id_ed25519"

# 创建目录
if (!(Test-Path -Path $sshDir)) {
    New-Item -ItemType Directory -Force -Path $sshDir
}

# 生成密钥
Write-Host "生成密钥中..."
ssh-keygen -t ed25519 -C "zhu371481@qq.com" -N "" -f "$keyPath"

# 显示结果
if (Test-Path -Path "$keyPath.pub") {
    Write-Host "密钥生成成功！"
    Get-Content -Path "$keyPath.pub"
}