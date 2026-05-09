@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir=[System.IO.Path]::GetDirectoryName([System.IO.Path]::GetFullPath('%~f0')); $properties=[System.IO.Path]::Combine($scriptDir,'.mvn','wrapper','maven-wrapper.properties'); if(Test-Path $properties){$content=Get-Content $properties; foreach($line in $content){if($line -match '^distributionUrl=(.+)$'){$url=$matches[1]; $filename=[System.IO.Path]::GetFileName($url.Replace('/','\\')); $userHome=[System.Environment]::GetFolderPath('UserProfile'); $wrapperDir=[System.IO.Path]::Combine($userHome,'.m2','wrapper','dists',$filename.Replace('.zip','')); $mvnCmd=[System.IO.Path]::Combine($wrapperDir,'bin','mvn.cmd'); if(Test-Path $mvnCmd){Write-Output ('MVNW_CMD='+$mvnCmd)}else{Write-Output 'MVNW_CMD=DOWNLOAD'}; break}}} } 2>$null"`) DO (
  IF "%%A"=="MVNW_CMD" SET __MVNW_CMD__=%%B
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@SET __MVNW_PSMODULEP_SAVE=

@IF NOT "%__MVNW_CMD__%"=="" IF NOT "%__MVNW_CMD__%"=="DOWNLOAD" GOTO execute

@SET __MVNW_DOWNLOAD_SCRIPT__=%TEMP%\mvn-wrapper-download.ps1
@powershell -noprofile -Command "$ErrorActionPreference='Stop'; $scriptDir=[System.IO.Path]::GetDirectoryName([System.IO.Path]::GetFullPath('%~f0')); $properties=[System.IO.Path]::Combine($scriptDir,'.mvn','wrapper','maven-wrapper.properties'); $content=Get-Content $properties; $distributionUrl=''; $wrapperUrl=''; foreach($line in $content){ if($line -match '^distributionUrl=(.+)$'){$distributionUrl=$matches[1]} if($line -match '^wrapperUrl=(.+)$'){$wrapperUrl=$matches[1]} }; $userHome=[System.Environment]::GetFolderPath('UserProfile'); $filename=[System.IO.Path]::GetFileName($distributionUrl.Replace('/','\\')); $wrapperDir=[System.IO.Path]::Combine($userHome,'.m2','wrapper','dists',$filename.Replace('.zip','')); New-Item -ItemType Directory -Force -Path $wrapperDir | Out-Null; $zipPath=[System.IO.Path]::Combine($wrapperDir,$filename); if(!(Test-Path $zipPath)){ Write-Host 'Downloading Apache Maven...'; Invoke-WebRequest -Uri $distributionUrl -OutFile $zipPath }; Write-Host 'Extracting Maven...'; Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath,$wrapperDir); Write-Host 'Done.'"
@IF ERRORLEVEL 1 (
  ECHO Maven wrapper download failed. Please install Maven manually from https://maven.apache.org/download.cgi
  EXIT /B 1
)
@powershell -noprofile -Command "$userHome=[System.Environment]::GetFolderPath('UserProfile'); $scriptDir=[System.IO.Path]::GetDirectoryName([System.IO.Path]::GetFullPath('%~f0')); $properties=[System.IO.Path]::Combine($scriptDir,'.mvn','wrapper','maven-wrapper.properties'); $content=Get-Content $properties; foreach($line in $content){ if($line -match '^distributionUrl=(.+)$'){$url=$matches[1]; $filename=[System.IO.Path]::GetFileName($url.Replace('/','\\')); $wrapperDir=[System.IO.Path]::Combine($userHome,'.m2','wrapper','dists',$filename.Replace('.zip','')); Get-ChildItem $wrapperDir -Recurse -Name 'mvn.cmd' | ForEach-Object { Write-Output ('MVNW_CMD='+[System.IO.Path]::Combine($wrapperDir,$_)) }; break} }" > "%TEMP%\mvnw_path.txt"
@FOR /F "tokens=1* delims==" %%A IN (%TEMP%\mvnw_path.txt) DO (
  IF "%%A"=="MVNW_CMD" SET __MVNW_CMD__=%%B
)

:execute
@IF "%__MVNW_CMD__%"=="" (
  ECHO Error: Could not find or download Maven.
  EXIT /B 1
)
@"%__MVNW_CMD__%" %*
