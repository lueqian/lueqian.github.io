@echo off
chcp 65001 >nul
title 蓝鹰一体化系统 - 服务启动脚本

:: 切换到当前脚本所在目录的上一级（项目根目录）
cd /d "%~dp0.."

:: 预加载常见路径至当前会话 PATH，防止偶发性找不到 pnpm
set "PATH=%APPDATA%\npm;%ProgramFiles%\nodejs;%PATH%"

echo ===================================================
echo         蓝鹰一体化系统 - 原型服务启动工具
echo ===================================================
echo 本脚本将定位到项目目录并启动开发服务，局域网内的团队成员可以
echo 共同访问。
echo.

:: 检查 pnpm 环境
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 pnpm 依赖管理工具。
    echo 请先运行 [setup_env.bat] 进行依赖环境的初始化安装。
    echo.
    pause
    exit /B
)

:: 打印本机访问与局域网 IP
echo.
echo ===================================================
echo [服务访问地址]
echo 1. 本机浏览器访问:
echo    - http://localhost:51720
echo.
echo 2. 局域网内团队成员访问:
setlocal enabledelayedexpansion
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=%%i"
    set "ip=!ip: =!"
    echo    - http://!ip!:51720
)
endlocal
echo.
echo 提示：
echo 1. 团队成员连接到【同一个局域网 / Wi-Fi】后即可直接在浏览器打开。
echo 2. 如局域网无法访问，请确保 Windows 防火墙允许端口 51720 或 Node.js 通信。
echo ===================================================
echo.
echo 正在启动原型服务 (pnpm run dev)...
echo ===================================================
echo.

call pnpm run dev

pause
