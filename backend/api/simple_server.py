"""
简化版 FastAPI 服务器
不依赖 agents 模块，直接提供 API 接口
"""

import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time

from config import settings, setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 60)
    logger.info(f"🚀 {settings.app_name} v{settings.app_version} 启动中...")
    logger.info("=" * 60)
    logger.info(f"📍 服务地址: http://{settings.server_host}:{settings.server_port}")
    logger.info(f"📚 API 文档: http://localhost:{settings.server_port}/docs")
    logger.info("=" * 60)
    yield
    logger.info("👋 服务已关闭")


app = FastAPI(
    title=settings.app_name,
    description="QST智能学习助手 - 基础 API",
    version=settings.app_version,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request, call_next):
    start = time.time()
    logger.info(f"📥 {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"📤 {request.method} {request.url.path} - {response.status_code} - {time.time()-start:.3f}s")
    return response


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": f"http://localhost:{settings.server_port}/docs",
        "message": "QST智能学习助手服务已启动"
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "version": settings.app_version}


@app.get("/info")
async def info():
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "model": settings.openai_model,
        "port": settings.server_port,
        "features": {
            "chat": True,
            "rag": True,
            "workflow": True,
            "deep_research": True
        }
    }


@app.get("/api/chat")
async def chat_test():
    return {
        "status": "available",
        "message": "聊天功能模块待集成",
        "hint": "需要解决 langgraph 依赖兼容性问题"
    }


@app.get("/api/rag")
async def rag_test():
    return {
        "status": "available",
        "message": "RAG 功能模块待集成",
        "documents_path": settings.data_documents_path
    }


print(f"""
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 QST智能学习助手                            ║
║                                                          ║
║   📍 服务地址: http://localhost:{settings.server_port}                        ║
║   📚 API 文档: http://localhost:{settings.server_port}/docs                   ║
║   ❤️  健康检查: http://localhost:{settings.server_port}/health                 ║
║                                                          ║
║   注意: 当前为简化版本，Agent 功能待完整集成              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
""")
