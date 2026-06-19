Add-Type -AssemblyName System.Drawing

$dir = "$env:USERPROFILE\Desktop\vlmetal\img"

foreach ($file in Get-ChildItem "$dir\svc-*.png") {
    Write-Output "Fixing $($file.Name)..."
    $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
    $w = $bmp.Width; $h = $bmp.Height
    
    $nbmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $bmp.GetPixel($x, $y)
            # Remove partially transparent pixels (anti-aliasing artifacts)
            if ($p.A -gt 0 -and $p.A -lt 255) {
                $nbmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($p.A -eq 255) {
                $nbmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 106, 0))
            } else {
                $nbmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }
    
    $bmp.Dispose()
    
    # Crop to bounding box again (artifacts removed)
    $minX = $w; $minY = $h; $maxX = 0; $maxY = 0
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            if ($nbmp.GetPixel($x, $y).A -gt 0) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    
    if ($maxX -le 0) { $nbmp.Dispose(); continue }
    
    $pad = 4
    $minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
    $maxX = [Math]::Min($w - 1, $maxX + $pad); $maxY = [Math]::Min($h - 1, $maxY + $pad)
    $cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1
    
    $crop = $nbmp.Clone([System.Drawing.Rectangle]::new($minX, $minY, $cw, $ch), $nbmp.PixelFormat)
    $nbmp.Dispose()
    
    # Resize to 200x200 using nearest neighbor to prevent anti-aliasing
    $size = 200
    $ratio = [Math]::Min($size / $cw, $size / $ch)
    $nw = [int]($cw * $ratio); $nh = [int]($ch * $ratio)
    $ox = [int](($size - $nw) / 2); $oy = [int](($size - $nh) / 2)
    
    $final = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($final)
    $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $g.DrawImage($crop, $ox, $oy, $nw, $nh)
    $g.Dispose(); $crop.Dispose()
    
    $tmp = "$dir\_tmpfix.png"
    $final.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
    $final.Dispose()
    Copy-Item $tmp $file.FullName -Force
    Remove-Item $tmp -Force
    
    Write-Output "  Fixed and recropped to 200x200"
}
Write-Output "Done"
