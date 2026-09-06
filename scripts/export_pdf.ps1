param([string]$name = "pre-ag1-kurz")
$ErrorActionPreference = 'Stop'
$inputFile = "B:\vscht_uceni_web\$name.pptx"
$outputFile = "B:\vscht_uceni_web\$name.pdf"
$tempPptx = "$env:TEMP\$name.pptx"
$tempPdf = "$env:TEMP\$name.pdf"

Write-Host "Copying PPTX to local temp: $tempPptx"
Copy-Item -Path $inputFile -Destination $tempPptx -Force

Write-Host "Opening PowerPoint Application..."
$ppt = New-Object -ComObject PowerPoint.Application
try {
    Write-Host "Opening presentation: $tempPptx"
    $pres = $ppt.Presentations.Open($tempPptx, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    Write-Host "Exporting to PDF: $tempPdf"
    $pres.SaveAs($tempPdf, 32)
    $pres.Close()
    Write-Host "Copying PDF back to: $outputFile"
    Copy-Item -Path $tempPdf -Destination $outputFile -Force
    Write-Host "PDF Export complete!"
} finally {
    $ppt.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
