Add-Type -AssemblyName System.Drawing
$folder = "$env:USERPROFILE\Desktop\vlmetal\img\original"
foreach ($f in Get-ChildItem "$folder\*.png") {
    $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
    Write-Output "$($f.Name): $($bmp.Width)x$($bmp.Height) px"
    $bmp.Dispose()
}
