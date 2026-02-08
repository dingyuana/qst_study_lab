"""
简化版服务器启动脚本
直接运行 FastAPI，绕过 agent 依赖问题
"""

import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import uvicorn
from config import settings

if __name__ == "__main__":
    print("🚀 启动 QST智能学习助手服务器...")
    print(f"📍 地址: http://{settings.server_host}:{settings.server_port}")
    print(f"📚 API 文档: http://localhost:{settings.server_port}/docs")
    
    uvicorn.run(
        "api.simple_server:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=settings.server_reload,
    )
