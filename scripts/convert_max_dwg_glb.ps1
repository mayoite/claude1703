param(
  [Parameter(Mandatory = $true)]
  [Alias("Input")]
  [string]$InputPath,

  [string]$OutDir = ".\converted",

  [string]$ThreeDsMaxBatchExe = "$env:ProgramFiles\Autodesk\3ds Max 2025\3dsmaxbatch.exe",

  [string]$BlenderExe = "$env:ProgramFiles\Blender Foundation\Blender 4.1\blender.exe",

  [string]$OdaFileConverterExe = "$env:ProgramFiles\ODA\ODAFileConverter\ODAFileConverter.exe",

  [switch]$PreferDwg,
  [switch]$SkipCompression
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-Exists {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Label
  )
  if (-not (Test-Path -LiteralPath $Path)) {
    throw "$Label not found: $Path"
  }
}

function Resolve-AbsolutePath {
  param([Parameter(Mandatory = $true)][string]$Path)
  return (Resolve-Path -LiteralPath $Path).Path
}

function Invoke-MaxExport {
  param(
    [Parameter(Mandatory = $true)][string]$MaxFile,
    [Parameter(Mandatory = $true)][string]$OutDwg,
    [Parameter(Mandatory = $true)][string]$OutFbx,
    [Parameter(Mandatory = $true)][string]$MaxBatchExe
  )

  Assert-Exists -Path $MaxBatchExe -Label "3ds Max batch executable"

  $msPath = [System.IO.Path]::GetTempFileName().Replace(".tmp", ".ms")
  $msContent = @"
inFile = @"$MaxFile"
outDwg = @"$OutDwg"
outFbx = @"$OutFbx"

try (
  loadMaxFile inFile quiet:true useFileUnits:true
  exportFile outDwg #noPrompt selectedOnly:false
  exportFile outFbx #noPrompt selectedOnly:false
  format "EXPORT_OK`n"
) catch (
  format "EXPORT_FAIL: %`n" (getCurrentException())
)
quitMAX #noPrompt
"@
  Set-Content -LiteralPath $msPath -Value $msContent -Encoding ASCII

  try {
    Write-Host "Running 3ds Max export (.max -> .dwg + .fbx)..."
    & $MaxBatchExe $msPath
    if (-not (Test-Path -LiteralPath $OutFbx) -and -not (Test-Path -LiteralPath $OutDwg)) {
      throw "3ds Max did not export output files. Check exporter plug-ins and logs."
    }
  }
  finally {
    if (Test-Path -LiteralPath $msPath) {
      Remove-Item -LiteralPath $msPath -Force
    }
  }
}

function Invoke-DwgToDxf {
  param(
    [Parameter(Mandatory = $true)][string]$DwgPath,
    [Parameter(Mandatory = $true)][string]$OutDirPath,
    [Parameter(Mandatory = $true)][string]$OdaExe
  )

  Assert-Exists -Path $OdaExe -Label "ODA File Converter executable"

  $inDir = Split-Path -Parent $DwgPath
  $dwgName = Split-Path -Leaf $DwgPath

  if (-not (Test-Path -LiteralPath $OutDirPath)) {
    New-Item -ItemType Directory -Path $OutDirPath | Out-Null
  }

  Write-Host "Running ODA conversion (.dwg -> .dxf)..."
  # Args format depends on ODA version. These are the common CLI params:
  # <inputFolder> <outputFolder> <inputVersion> <outputVersion> <outputType> <recurse> <audit> [filename]
  & $OdaExe $inDir $OutDirPath "ACAD2018" "ACAD2018" "DXF" "0" "1" $dwgName

  $dxf = Join-Path $OutDirPath ([System.IO.Path]::GetFileNameWithoutExtension($dwgName) + ".dxf")
  if (-not (Test-Path -LiteralPath $dxf)) {
    throw "DWG -> DXF failed. ODA converter arguments may need adjustment for your installed version."
  }
  return $dxf
}

function Invoke-BlenderToGlb {
  param(
    [Parameter(Mandatory = $true)][string]$InputModel,
    [Parameter(Mandatory = $true)][string]$OutputGlb,
    [Parameter(Mandatory = $true)][string]$BlenderPath,
    [Parameter(Mandatory = $true)][string]$ConverterScript
  )

  Assert-Exists -Path $BlenderPath -Label "Blender executable"
  Assert-Exists -Path $ConverterScript -Label "blender_to_glb.py"
  Assert-Exists -Path $InputModel -Label "Input model for Blender"

  Write-Host "Running Blender conversion ($InputModel -> $OutputGlb)..."
  & $BlenderPath --background --python $ConverterScript -- --input $InputModel --output $OutputGlb

  if (-not (Test-Path -LiteralPath $OutputGlb)) {
    throw "Blender did not generate GLB output."
  }
}

function Invoke-CompressGlb {
  param(
    [Parameter(Mandatory = $true)][string]$InputGlb,
    [Parameter(Mandatory = $true)][string]$OutputGlb
  )

  $gltfpack = Get-Command gltfpack -ErrorAction SilentlyContinue
  if (-not $gltfpack) {
    Write-Warning "gltfpack not found in PATH. Skipping compression."
    return
  }

  Write-Host "Compressing GLB with gltfpack..."
  & $gltfpack.Source -i $InputGlb -o $OutputGlb -cc
  if (Test-Path -LiteralPath $OutputGlb) {
    Write-Host "Compressed GLB: $OutputGlb"
  }
}

$inputAbs = Resolve-AbsolutePath -Path $InputPath
$ext = [System.IO.Path]::GetExtension($inputAbs).ToLowerInvariant()
$base = [System.IO.Path]::GetFileNameWithoutExtension($inputAbs)
$outAbs = if ([System.IO.Path]::IsPathRooted($OutDir)) {
  [System.IO.Path]::GetFullPath($OutDir)
}
else {
  [System.IO.Path]::GetFullPath((Join-Path (Get-Location).Path $OutDir))
}
$converterScript = Join-Path (Split-Path -Parent $PSCommandPath) "blender_to_glb.py"

if (-not (Test-Path -LiteralPath $outAbs)) {
  New-Item -ItemType Directory -Path $outAbs | Out-Null
}

$dwgOut = Join-Path $outAbs "$base.dwg"
$fbxOut = Join-Path $outAbs "$base.fbx"
$dxfOutDir = Join-Path $outAbs "dxf"
$glbOut = Join-Path $outAbs "$base.glb"
$glbCompressed = Join-Path $outAbs "$base.compressed.glb"

switch ($ext) {
  ".max" {
    Invoke-MaxExport -MaxFile $inputAbs -OutDwg $dwgOut -OutFbx $fbxOut -MaxBatchExe $ThreeDsMaxBatchExe

    if ($PreferDwg) {
      try {
        $dxf = Invoke-DwgToDxf -DwgPath $dwgOut -OutDirPath $dxfOutDir -OdaExe $OdaFileConverterExe
        Invoke-BlenderToGlb -InputModel $dxf -OutputGlb $glbOut -BlenderPath $BlenderExe -ConverterScript $converterScript
      }
      catch {
        Write-Warning "DWG path failed: $($_.Exception.Message)"
        Write-Warning "Falling back to FBX path (.max -> .fbx -> .glb)."
        Invoke-BlenderToGlb -InputModel $fbxOut -OutputGlb $glbOut -BlenderPath $BlenderExe -ConverterScript $converterScript
      }
    }
    else {
      Invoke-BlenderToGlb -InputModel $fbxOut -OutputGlb $glbOut -BlenderPath $BlenderExe -ConverterScript $converterScript
    }
    break
  }

  ".dwg" {
    if (-not $PreferDwg) {
      Write-Warning "Input is DWG. Enabling DWG route automatically."
    }
    $dxf = Invoke-DwgToDxf -DwgPath $inputAbs -OutDirPath $dxfOutDir -OdaExe $OdaFileConverterExe
    Invoke-BlenderToGlb -InputModel $dxf -OutputGlb $glbOut -BlenderPath $BlenderExe -ConverterScript $converterScript
    break
  }

  ".fbx" {
    Invoke-BlenderToGlb -InputModel $inputAbs -OutputGlb $glbOut -BlenderPath $BlenderExe -ConverterScript $converterScript
    break
  }

  default {
    throw "Unsupported input extension '$ext'. Use .max, .dwg, or .fbx."
  }
}

if (-not $SkipCompression) {
  Invoke-CompressGlb -InputGlb $glbOut -OutputGlb $glbCompressed
}

Write-Host ""
Write-Host "Done."
Write-Host "Primary GLB: $glbOut"
if (Test-Path -LiteralPath $glbCompressed) {
  Write-Host "Compressed GLB: $glbCompressed"
}
