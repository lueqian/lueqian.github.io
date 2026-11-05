@echo off
chcp 65001 >nul
title 蓝鹰一体化系统 - 环境一键安装脚本

echo ===================================================
echo         蓝鹰一体化系统 - 最小环境安装脚本
echo ===================================================
echo 本脚本用于在新 Windows 10/11 电脑上一键部署原型运行环境。
echo 包含以下步骤:
echo 1. 检查并安装 Node.js LTS
echo 2. 检查并安装 Python 3
echo 3. 安装 pnpm 依赖管理器
echo 4. 初始化安装项目 node_modules 依赖
echo ===================================================
echo.

:: 检查管理员权限 (使用 net session)
net session >nul 2>&1
if errorlevel 1 (
    echo [提示] 需要管理员权限以进行环境安装，正在请求提升权限...
    powershell -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/k', '\"%~f0\"' -Verb RunAs"
    exit /B
)

:: 切换到当前脚本所在目录的上一级（项目根目录）
cd /d "%~dp0.."

:: 预加载常见路径至当前会话 PATH，防止刚装好的命令无法识别
set "PATH=%APPDATA%\npm;%ProgramFiles%\nodejs;%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python310;%PATH%"

set "NEED_RESTART=0"

:: 1. 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo [1/4] 未检测到 Node.js，正在通过 winget 安装 Node.js LTS [推荐]...
    where winget >nul 2>nul
    if errorlevel 1 (
        echo [失败] 当前系统未检测到 winget 包管理器，请手动前往官网下载安装 Node.js: https://nodejs.org/
        pause
        exit /B
    )
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    if not errorlevel 1 (
        echo [OK] Node.js LTS 安装成功！
        set "NEED_RESTART=1"
    ) else (
        echo [失败] Node.js 安装失败，请手动前往官网下载安装: https://nodejs.org/
        pause
        exit /B
    )
) else (
    echo [OK] Node.js 已安装。
)

:: 2. 检查 Python
where python >nul 2>nul
if errorlevel 1 (
    echo [2/4] 未检测到 Python，正在尝试安装 Python 3...
    where winget >nul 2>nul
    if not errorlevel 1 (
        winget install Python.Python.3 --accept-package-agreements --accept-source-agreements
        if not errorlevel 1 (
            echo [OK] Python 3 安装成功！
            set "NEED_RESTART=1"
        ) else (
            echo [提示] Python 自动安装跳过（非强依赖）。
        )
    ) else (
        echo [提示] 未找到 winget，跳过 Python 自动安装。
    )
) else (
    echo [OK] Python 已安装。
)

:: 3. 若新安装了环境，提示用户重启脚本以加载系统环境变量
if "%NEED_RESTART%"=="1" (
    echo.
    echo ===================================================
    echo [重要提示] Node.js 环境已成功安装！
    echo 因 Windows 系统环境变量机制，当前窗口需重启生效。
    echo.
    echo 请关闭此窗口，然后【再次双击运行】setup_env.bat 即可继续完成依赖安装。
    echo ===================================================
    echo.
    pause
    exit
)

:: 4. 检查并安装 pnpm
where pnpm >nul 2>nul
if errorlevel 1 (
    echo [3/4] 未检测到 pnpm，正在通过 npm 安装全局 pnpm...
    call npm install -g pnpm
    :: 再次刷新当前会话 PATH 以即时识别刚安装的 pnpm.cmd
    set "PATH=%APPDATA%\npm;%ProgramFiles%\nodejs;%PATH%"
    where pnpm >nul 2>nul
    if errorlevel 1 (
        echo [失败] pnpm 安装后当前窗口未能识别，请关闭窗口后重新双击本脚本重试。
        pause
        exit /B
    )
    echo [OK] pnpm 安装成功！
) else (
    echo [OK] pnpm 已安装。
)

:: 5. 安装项目依赖
echo.
echo [4/4] 正在安装 Axhub 项目依赖 (node_modules)...
echo 这可能需要几分钟，请耐心等待...
call pnpm install
if not errorlevel 1 (
    echo.
    echo ===================================================
    echo [大功告成] 所有运行环境与依赖已成功就绪！
    echo 现在您可以双击运行 [start_service.bat] 启动原型服务了。
    echo ===================================================
) else (
    echo.
    echo [失败] 项目依赖安装未完全成功，请检查网络或重试。
)

echo.
pause
