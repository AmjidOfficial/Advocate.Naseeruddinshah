Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$srcDir  = Join-Path $PSScriptRoot "assets\images"
$imgDir  = Join-Path $PSScriptRoot "assets\img"
$gallery = Join-Path $imgDir "gallery"
New-Item -ItemType Directory -Force -Path $gallery | Out-Null

# --- gallery copies (already web-sized; keep original pixels) ---
$map = @{
  "scbap-lounge-executive.jpg.jpg"     = "scbap-lounge.jpg"
  "advocate-chamber-office.jpg.jpg"    = "chambers-office.jpg"
  "advocate-standing-portrait.jpg.jpg" = "standing-portrait.jpg"
  "kp-judicial-academy.jpg.jpg"        = "kp-judicial-academy.jpg"
  "award-certificate-ceremony.jpg.jpg" = "certificate-ceremony.jpg"
  "document-handover-ceremony.jpg.jpg" = "document-handover.jpg"
}
foreach ($k in $map.Keys) {
  Copy-Item (Join-Path $srcDir $k) (Join-Path $gallery $map[$k]) -Force
  Write-Output ("copied " + $map[$k])
}

# --- hero portrait: EXIF-normalize, centre-crop to 4:5, resize 720x900 ---
$src = [System.Drawing.Image]::FromFile((Join-Path $srcDir "hero-portrait-hd.jpg.jpg"))
if ($src.PropertyIdList -contains 274) {
  switch ($src.GetPropertyItem(274).Value[0]) {
    3 { $src.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
    6 { $src.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    8 { $src.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
  }
}
$TW = 720; $TH = 900; $ratio = $TW / $TH
$w = $src.Width; $h = $src.Height
if (($w / $h) -gt $ratio) {
  $newW = [int]($h * $ratio); $newH = $h; $x = [int](($w - $newW) / 2); $y = 0
} else {
  $newW = $w; $newH = [int]($w / $ratio); $x = 0; $y = [int](($h - $newH) / 2)
}
$bmp = New-Object System.Drawing.Bitmap($TW, $TH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$dstRect = New-Object System.Drawing.Rectangle(0, 0, $TW, $TH)
$srcRect = New-Object System.Drawing.Rectangle($x, $y, $newW, $newH)
$g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose(); $src.Dispose()

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)
$out = Join-Path $imgDir "portrait.jpg"
if (Test-Path $out) { Remove-Item $out -Force }
$bmp.Save($out, $jpeg, $ep)
$bmp.Dispose()
Write-Output ("portrait.jpg " + $TW + "x" + $TH + " written")

# --- report final sizes ---
Get-ChildItem $imgDir -Recurse -File | ForEach-Object { Write-Output ($_.FullName.Replace($imgDir, "img") + " :: " + $_.Length + " bytes") }
