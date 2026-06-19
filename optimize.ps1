Add-Type -AssemblyName System.Drawing

$dir = "$env:USERPROFILE\Desktop\vlmetal\img"
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]80)
$tmp = "$dir\_tmp.jpg"

function Optimize-Jpg($path, $maxW, $maxH) {
    $img = [System.Drawing.Image]::FromFile($path)
    $w = $img.Width; $h = $img.Height
    if ($w -gt $maxW -or $h -gt $maxH) {
        $ratio = [Math]::Min($maxW / $w, $maxH / $h)
        $nw = [int]($w * $ratio); $nh = [int]($h * $ratio)
    } else { $nw = $w; $nh = $h }
    $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $nw, $nh)
    $g.Dispose(); $img.Dispose()
    if (Test-Path $tmp) { Remove-Item $tmp -Force }
    $bmp.Save($tmp, $codec, $params)
    $bmp.Dispose()
    Copy-Item $tmp $path -Force
    Remove-Item $tmp -Force
    Write-Output "$(Split-Path $path -Leaf): ${w}x${h} -> ${nw}x${nh}, $((Get-Item $path).Length/1KB)KB"
}

Get-ChildItem "$dir\gal-*.jpg" | ForEach-Object { Optimize-Jpg $_.FullName 640 640 }
Get-ChildItem "$dir\port-*.jpg" | ForEach-Object { Optimize-Jpg $_.FullName 800 600 }
Get-ChildItem "$dir\hero-*.jpg" | ForEach-Object { Optimize-Jpg $_.FullName 1200 900 }
