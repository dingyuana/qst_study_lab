# 第二章：RAG 知识库系统

## 理论讲解

### 2.1 RAG 技术概述与核心价值

检索增强生成（Retrieval-Augmented Generation，简称 RAG）是当前大语言模型应用领域最重要的技术范式之一。它将信息检索与文本生成相结合，通过先检索后生成的方式，让大模型能够基于特定知识库回答问题，从而有效解决大模型知识过时、幻觉问题以及领域知识不足等固有缺陷。RAG 技术的核心价值体现在三个方面：首先，它能够让大模型访问最新的、特定领域的信息，而无需对模型本身进行重新训练；其次，通过引用外部知识源，可以显著降低模型产生幻觉的风险；第三，企业可以将私有数据安全地用于增强模型能力，无需将敏感数据暴露给模型训练方。

QST智能学习助手 项目中的 RAG 系统是一个完整的端到端解决方案，涵盖从文档加载、文本分块、向量化存储到检索生成的完整流程。这个系统的设计充分考虑了教学和实战的平衡，既有深入的技术原理讲解，又有可直接运行的代码示例。通过学习这个系统，开发者不仅能够掌握 RAG 的核心概念，还能理解实际工程中的各种优化策略和最佳实践。

RAG 技术的应用场景非常广泛。在企业知识管理领域，RAG 可以构建智能问答系统，让员工能够自然语言查询公司内部的文档、制度和流程。在教育培训领域，RAG 可以创建基于教材和参考资料的智能辅导系统。在客户支持领域，RAG 可以构建能够回答产品相关问题的客服机器人。这些场景的共同特点是：需要基于特定领域的知识内容提供准确、可靠的回答，而通用的大语言模型往往无法满足这种需求。

### 2.2 文档处理与文本分块原理

文档处理是 RAG 系统的第一个关键环节，它决定了后续检索和生成的质量。高质量的文档处理需要解决几个核心问题：如何从不同格式的文档中提取纯文本内容、如何将长文档切分成适合检索的小块、如何保留文档的结构信息和语义完整性。QST智能学习助手 项目支持的文档格式包括 PDF、Markdown、纯文本、HTML 和 JSON，每种格式都需要专门的解析策略。

PDF 文档是实际应用中最常见的文档格式之一，但也是处理难度最大的格式。PDF 的本质是页面布局描述文件，而非结构化文本，同一页面的文字可能在源代码中分散在不同位置。QST智能学习助手 使用 pypdf 库进行 PDF 文本提取，提取后的文本需要经过清洗和重组，去除多余的换行符和无意义的符号。对于包含表格或图片的 PDF，目前主要依赖 OCR 技术进行识别，但效果仍有提升空间。

Markdown 文档的结构相对清晰，标题层级、代码块、列表等元素都有明确的标记。处理 Markdown 时，可以保留其标题结构信息，用于后续的文本分块。例如，可以按照标题层级进行分块，每个块代表一个小节的内容，这样能够更好地保持主题的一致性。HTML 文档的处理类似，需要使用 BeautifulSoup 等库解析 DOM 结构，提取正文内容，同时去除导航栏、广告等无关信息。

文本分块（Chunking）是 RAG 系统中最重要的环节之一。分块策略的选择直接影响检索效果：如果块太大，可能包含太多无关信息，增加模型的处理负担；如果块太小，可能丢失上下文信息，导致回答不完整。QST智能学习助手 采用递归字符分块策略，这是一种简单但非常有效的分块方法。它首先尝试按段落分割，如果段落太大则按句子分割，如果句子还是太大则按单词分割。这种层次化的分块方式能够在保持语义完整性的同时控制块的大小。

分块参数的选择需要根据具体场景调整。`chunk_size` 控制每个块的最大字符数，默认值通常在 500 到 1000 之间。`chunk_overlap` 控制相邻块之间的重叠字符数，设置重叠可以确保重要信息不会因为分块边界而被切断。重叠大小通常设置为块大小的 10% 到 20%。在某些场景下，还可以采用滑动窗口、语义分块等更高级的分块策略。

### 2.3 向量化与向量检索技术

向量化是将文本转换为数值向量的过程，是 RAG 系统的核心技术之一。大语言模型生成的文本向量（Embedding）能够捕捉文本的语义信息，使得语义相似的文本在向量空间中彼此接近。QST智能学习助手 使用 OpenAI 的 Embedding API，目前支持 text-embedding-3-small 和 text-embedding-3-large 两个模型。text-embedding-3-small 在性能和成本之间取得了较好的平衡，是大多数场景的首选。

Embedding 模型的选型需要考虑几个因素：首先是维度数，通常 Embedding 的维度越高，能表达的语义信息越丰富，但也会增加存储和计算成本；其次是上下文长度，不同模型支持的最大输入长度不同；第三是特定领域的适应性，某些 Embedding 模型在特定领域（如医学、法律）可能有更好的表现。QST智能学习助手 采用的 text-embedding-3-small 支持 8191 个 token 的输入上下文，输出 1536 维的向量。

向量检索是 RAG 系统的另一个核心技术。在海量的向量中快速找到与查询最相似的文档，需要专门的向量数据库和检索算法。QST智能学习助手 默认使用 FAISS（Facebook AI Similarity Search）作为向量存储方案。FAISS 提供了多种索引类型，包括 Flat（精确检索）、IVF（倒排文件索引）、HNSW（层次可导航小世界图）等。在小规模数据（几千到几万条）场景下，Flat 索引已经足够使用，精确度高且没有索引构建开销。

向量检索的核心是相似度计算。常用的相似度度量方式包括欧氏距离、余弦相似度和点积。余弦相似度衡量的是向量方向的相似性，取值范围在 -1 到 1 之间，值越大表示越相似。在文本检索场景，余弦相似度是最常用的度量方式，因为它对向量的长度不敏感，更关注语义方向的一致性。QST智能学习助手 在检索时返回相似度最高的 K 个文档，K 的值通常在 3 到 10 之间，需要根据具体场景调整。

### 2.4 RAG Agent 架构设计

RAG Agent 是将检索和生成结合在一起的智能体，它不仅能够回答用户问题，还能在回答中引用来源文档。QST智能学习助手 的 RAG Agent 基于 LangChain 的 `create_agent` API 构建，将检索器封装为一个工具供 Agent 调用。这种架构的优势在于：Agent 能够根据问题的复杂程度决定是否需要检索、需要检索多少次，使得系统更加智能和高效。

RAG Agent 的核心工作流程如下：首先，Agent 理解用户的问题，判断是否需要进行知识检索；如果需要，Agent 调用检索器工具搜索相关的文档块；检索完成后，Agent 将用户问题和检索结果组合成完整的提示词；最后，Agent 调用大语言模型生成回答，并在回答中标注来源文档。这种流程与人类专家回答问题的过程非常相似：先查找资料，再基于资料组织答案。

RAG Agent 的系统提示词设计是影响其表现的关键因素。一个好的系统提示词应该明确 Agent 的角色定位（知识库问答助手）、任务要求（准确回答、引用来源）、回答规范（格式要求、限制条件）等。QST智能学习助手 的默认 RAG 系统提示词强调三个原则：准确性（严格基于文档内容）、完整性（提供详细回答）、清晰性（使用简洁明了的语言）。同时要求 Agent 在回答末尾列出参考的文档来源。

对话式 RAG 是对基础 RAG 的增强，支持多轮对话中的上下文感知。在多轮对话中，用户的当前问题可能引用了之前对话中提到的概念或实体，需要结合对话历史才能准确理解。QST智能学习助手 提供了专门的对话式 RAG Agent 实现，它在系统提示词中增加了对对话历史的说明，并要求 Agent 在回答时考虑上下文关系。这种设计使得用户可以自然地进行追问和澄清。

## 实操步骤

### 2.1 RAG 开发环境准备

RAG 系统的开发需要一些额外的依赖包。首先确保已经完成了第一章的环境配置，然后安装 RAG 相关的依赖：

```bash
# 安装 RAG 相关依赖
cd backend
pip install faiss-cpu pypdf markdown beautifulsoup4 lxml
```

对于需要处理特殊文档格式的场景，可能还需要安装额外的依赖：

```bash
# 可选依赖
pip install pandas openpyxl   # Excel 文件处理
pip install python-docx       # Word 文档处理
pip install pytesseract       # 图片 OCR 处理
```

创建 RAG 系统的目录结构：

```bash
mkdir -p data/documents       # 原始文档目录
mkdir -p data/indexes         # 向量索引目录
mkdir -p data/processed       # 处理后的文档目录
```

准备测试文档，可以放入一些 Markdown 或文本文件：

```bash
# 示例：创建测试文档
echo "# 测试文档\n\n这是一份关于人工智能的介绍。\n\n## 机器学习\n\n机器学习是人工智能的一个重要分支。" > data/documents/intro.txt
```

### 2.2 文档加载器实现

首先查看 QST智能学习助手 中的文档加载器实现：

```python
# rag/loaders.py（核心代码解析）

import os
from pathlib import Path
from typing import List, Union, Dict, Any
from langchain_core.documents import Document


class DocumentLoader:
    """文档加载器工厂类"""
    
    @staticmethod
    def load(file_path: str) -> List[Document]:
        """
        加载文档并转换为 Document 对象列表
        
        Args:
            file_path: 文档路径
            
        Returns:
            Document 对象列表
        """
        file_ext = Path(file_path).suffix.lower()
        
        if file_ext == '.pdf':
            return DocumentLoader._load_pdf(file_path)
        elif file_ext == '.md':
            return DocumentLoader._load_markdown(file_path)
        elif file_ext in ['.txt', '.text']:
            return DocumentLoader._load_text(file_path)
        elif file_ext == '.html':
            return DocumentLoader._load_html(file_path)
        elif file_ext == '.json':
            return DocumentLoader._load_json(file_path)
        else:
            raise ValueError(f"不支持的文档格式: {file_ext}")
    
    @staticmethod
    def _load_pdf(file_path: str) -> List[Document]:
        """加载 PDF 文档"""
        from pypdf import PdfReader
        
        reader = PdfReader(file_path)
        documents = []
        
        for page_num, page in enumerate(reader.pages):
            text = page.extract_text()
            if text.strip():
                doc = Document(
                    page_content=text,
                    metadata={
                        "source": file_path,
                        "page": page_num,
                        "total_pages": len(reader.pages)
                    }
                )
                documents.append(doc)
        
        return documents
    
    @staticmethod
    def _load_markdown(file_path: str) -> List[Document]:
        """加载 Markdown 文档"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 简单处理：整个文件作为一个 Document
        doc = Document(
            page_content=content,
            metadata={
                "source": file_path,
                "type": "markdown"
            }
        )
        
        return [doc]
    
    @staticmethod
    def _load_text(file_path: str) -> List[Document]:
        """加载纯文本文档"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        doc = Document(
            page_content=content,
            metadata={
                "source": file_path,
                "type": "text"
            }
        )
        
        return [doc]
    
    @staticmethod
    def _load_html(file_path: str) -> List[Document]:
        """加载 HTML 文档"""
        from bs4 import BeautifulSoup
        
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, 'lxml')
        
        # 提取正文内容（去除 script、style 等标签）
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        
        text = soup.get_text(separator='\n', strip=True)
        
        doc = Document(
            page_content=text,
            metadata={
                "source": file_path,
                "type": "html"
            }
        )
        
        return [doc]
    
    @staticmethod
    def _load_json(file_path: str) -> List[Document]:
        """加载 JSON 文档"""
        import json
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        documents = []
        
        # 递归提取 JSON 中的文本
        def extract_text(obj, path=""):
            if isinstance(obj, str):
                return [Document(
                    page_content=obj,
                    metadata={"source": file_path, "path": path}
                )]
            elif isinstance(obj, dict):
                result = []
                for key, value in obj.items():
                    result.extend(extract_text(value, f"{path}.{key}"))
                return result
            elif isinstance(obj, list):
                result = []
                for i, item in enumerate(obj):
                    result.extend(extract_text(item, f"{path}[{i}]"))
                return result
            return []
        
        return extract_text(data)


def load_document(file_path: str) -> List[Document]:
    """便捷的文档加载函数"""
    return DocumentLoader.load(file_path)
```

现在创建测试脚本：

```python
# examples/ch02/01_document_loading.py
"""
文档加载示例
学习如何加载不同格式的文档
"""

import os
from rag.loaders import load_document
from config import get_logger

logger = get_logger(__name__)


def main():
    """演示各种文档格式的加载"""
    
    # 测试文档目录
    docs_dir = "./data/documents"
    
    if not os.path.exists(docs_dir):
        os.makedirs(docs_dir)
        logger.info(f"创建测试文档目录: {docs_dir}")
        
        # 创建测试文档
        create_test_documents()
    
    # 加载并显示文档信息
    for filename in os.listdir(docs_dir):
        filepath = os.path.join(docs_dir, filename)
        if os.path.isfile(filepath):
            try:
                docs = load_document(filepath)
                logger.info(f"\n📄 文件: {filename}")
                logger.info(f"   加载了 {len(docs)} 个文档块")
                
                # 显示每个块的信息
                for i, doc in enumerate(docs[:3]):  # 只显示前3个
                    content_preview = doc.page_content[:100].replace('\n', ' ')
                    logger.info(f"   块 {i+1}: {content_preview}...")
                    
                    # 显示元数据
                    if doc.metadata:
                        logger.info(f"         元数据: {doc.metadata}")
                        
            except Exception as e:
                logger.error(f"❌ 加载失败 {filename}: {e}")


def create_test_documents():
    """创建测试文档"""
    
    # 创建 Markdown 测试文档
    md_content = """# 人工智能简介

人工智能（Artificial Intelligence，简称 AI）是计算机科学的一个分支，它企图了解智能的实质，
并生产出一种新的能以人类智能相似的方式做出反应的智能机器。

## 机器学习

机器学习是人工智能的一个核心子领域，它专门研究计算机怎样模拟或实现人类的学习行为，
以获取新的知识或技能，重新组织已有的知识结构，使之不断改善自身的性能。

## 深度学习

深度学习是机器学习的一种，它基于人工神经网络，特别是深层神经网络。
深度学习在图像识别、语音识别、自然语言处理等领域取得了突破性进展。

## 应用领域

- **计算机视觉**：图像识别、目标检测、人脸识别
- **自然语言处理**：机器翻译、情感分析、智能问答
- **语音识别**：语音转文字、文字转语音
"""
    
    with open("./data/documents/ai_intro.md", 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    # 创建文本测试文档
    txt_content = """这是一份测试文档，用于验证文本加载功能。

文档中可以包含多行文本，
以及各种格式的内容。

第二段落的内容。
"""
    
    with open("./data/documents/test.txt", 'w', encoding='utf-8') as f:
        f.write(txt_content)
    
    logger.info("✅ 测试文档创建完成")


if __name__ == "__main__":
    main()
```

运行测试：

```bash
python examples/ch02/01_document_loading.py
```

### 2.3 文本分块策略实现

接下来实现文本分块功能：

```python
# rag/splitters.py（核心代码解析）

from typing import List, Optional, Callable
from langchain_core.documents import Document
from langchain_experimental.text_splitter import (
    RecursiveCharacterTextSplitter as BaseSplitter
)


class TextSplitter:
    """文本分块器"""
    
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 100,
        separators: Optional[List[str]] = None,
        length_function: Callable[[str], int] = len,
        keep_separator: bool = False
    ):
        """
        初始化分块器
        
        Args:
            chunk_size: 每个块的最大字符数
            chunk_overlap: 相邻块之间的重叠字符数
            separators: 分隔符列表
            length_function: 计算文本长度的函数
            keep_separator: 是否保留分隔符
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or [
            "\n\n",  # 段落分隔
            "\n",    # 行分隔
            "。",    # 句号
            "！",
            "？",
            "；",    # 分号
            " ",     # 单词分隔
            ""       # 字符分隔
        ]
        
        # 使用 LangChain 的递归字符分块器
        self._splitter = BaseSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=self.separators,
            length_function=length_function,
            keep_separator=keep_separator
        )
    
    def split_documents(
        self,
        documents: List[Document],
        add_start_index: bool = True
    ) -> List[Document]:
        """
        分割文档列表
        
        Args:
            documents: Document 对象列表
            add_start_index: 是否添加起始索引元数据
            
        Returns:
            分割后的 Document 列表
        """
        chunks = self._splitter.split_documents(documents)
        
        # 添加起始索引
        if add_start_index:
            for chunk in chunks:
                if "start_index" not in chunk.metadata:
                    chunk.metadata["start_index"] = 0
        
        logger.info(f"📚 分块完成: {len(documents)} 个文档 -> {len(chunks)} 个块")
        
        return chunks
    
    def split_text(
        self,
        text: str,
        add_start_index: bool = True
    ) -> List[str]:
        """
        分割单个文本
        
        Args:
            text: 要分割的文本
            add_start_index: 是否添加起始索引
            
        Returns:
            分割后的文本块列表
        """
        chunks = self._splitter.split_text(text)
        
        logger.info(f"✂️  文本分块: {len(text)} 字符 -> {len(chunks)} 个块")
        
        return chunks


def recursive_split(
    documents: List[Document],
    chunk_size: int = 1000,
    chunk_overlap: int = 100
) -> List[Document]:
    """
    便捷的递归分块函数
    
    Args:
        documents: Document 对象列表
        chunk_size: 块大小
        chunk_overlap: 重叠大小
        
    Returns:
        分割后的文档列表
    """
    splitter = TextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    return splitter.split_documents(documents)
```

创建分块测试脚本：

```python
# examples/ch02/02_text_splitter.py
"""
文本分块示例
学习不同的分块策略
"""

import os
from rag.loaders import load_document
from rag.splitters import recursive_split, TextSplitter
from config import get_logger

logger = get_logger(__name__)


def main():
    """演示文本分块功能"""
    
    # 首先加载文档
    doc_path = "./data/documents/ai_intro.md"
    if not os.path.exists(doc_path):
        logger.error("请先运行 01_document_loading.py 创建测试文档")
        return
    
    documents = load_document(doc_path)
    logger.info(f"📄 加载了 {len(documents)} 个文档")
    
    # 测试不同的分块参数
    test_cases = [
        {"chunk_size": 500, "chunk_overlap": 50},
        {"chunk_size": 1000, "chunk_overlap": 100},
        {"chunk_size": 200, "chunk_overlap": 20},
    ]
    
    for params in test_cases:
        print("\n" + "=" * 60)
        logger.info(f"🔧 分块参数: size={params['chunk_size']}, overlap={params['chunk_overlap']}")
        print("=" * 60)
        
        chunks = recursive_split(
            documents,
            chunk_size=params['chunk_size'],
            chunk_overlap=params['chunk_overlap']
        )
        
        for i, chunk in enumerate(chunks):
            content_preview = chunk.page_content[:80].replace('\n', ' ')
            logger.info(f"   块 {i+1} ({len(chunk.page_content)} 字符): {content_preview}...")


def advanced_splitter_demo():
    """高级分块器演示"""
    print("\n" + "=" * 60)
    print("🔧 高级分块策略演示")
    print("=" * 60)
    
    # 自定义分隔符的分块器
    custom_splitter = TextSplitter(
        chunk_size=300,
        chunk_overlap=30,
        separators=["\n\n", "\n", "。", "！", "？", "；", " ", ""]
    )
    
    test_text = """
    人工智能（AI）是计算机科学的重要分支。机器学习是AI的核心技术之一！
    深度学习在近年取得了突破性进展。自然语言处理也是AI的重要应用领域。
    计算机视觉能够识别图像中的物体；语音识别让机器听懂人类语言。
    """
    
    logger.info("📝 测试文本:")
    logger.info(f"   {test_text.strip()}")
    
    chunks = custom_splitter.split_text(test_text)
    
    for i, chunk in enumerate(chunks):
        logger.info(f"   块 {i+1}: {chunk}")


if __name__ == "__main__":
    main()
    advanced_splitter_demo()
```

### 2.4 向量索引构建与存储

现在学习如何构建和存储向量索引：

```python
# rag/embeddings.py（核心代码解析）

from typing import Optional, List
from langchain_openai import OpenAIEmbeddings
from config import settings, get_logger

logger = get_logger(__name__)


def get_embeddings(
    model: str = "text-embedding-3-small",
    dimensions: Optional[int] = None,
    **kwargs
) -> OpenAIEmbeddings:
    """
    获取 Embedding 模型实例
    
    Args:
        model: Embedding 模型名称
        dimensions: 输出维度（可选，某些模型支持降维）
        **kwargs: 其他传递给 OpenAIEmbeddings 的参数
        
    Returns:
        OpenAIEmbeddings 实例
    """
    embedding_config = {
        "model": model,
        "api_key": settings.openai_api_key,
        "base_url": settings.openai_api_base,
    }
    
    if dimensions:
        embedding_config["dimensions"] = dimensions
    
    embedding_config.update(kwargs)
    
    logger.info(f"🔢 初始化 Embedding 模型: {model}")
    
    return OpenAIEmbeddings(**embedding_config)


# rag/vector_stores.py（核心代码解析）

import os
from typing import List, Optional, Dict, Any
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_core.vectorstores import VectorStore
from rag.embeddings import get_embeddings
from config import get_logger

logger = get_logger(__name__)


class VectorStoreManager:
    """向量存储管理器"""
    
    def __init__(
        self,
        embeddings: OpenAIEmbeddings = None,
        persist_directory: str = "./data/indexes"
    ):
        """
        初始化向量存储管理器
        
        Args:
            embeddings: Embedding 模型实例
            persist_directory: 索引保存目录
        """
        self.embeddings = embeddings or get_embeddings()
        self.persist_directory = persist_directory
        
        # 确保目录存在
        os.makedirs(persist_directory, exist_ok=True)
    
    def create_from_documents(
        self,
        documents: List[Document],
        index_name: str = "default"
    ) -> FAISS:
        """
        从文档创建向量索引
        
        Args:
            documents: Document 对象列表
            index_name: 索引名称
            
        Returns:
            FAISS 向量存储实例
        """
        logger.info(f"💾 创建向量索引: {index_name}")
        logger.info(f"   文档数量: {len(documents)}")
        
        vector_store = FAISS.from_documents(
            documents=documents,
            embedding=self.embeddings
        )
        
        # 保存索引
        self._save(vector_store, index_name)
        
        logger.info(f"✅ 索引创建完成")
        
        return vector_store
    
    def save(self, vector_store: FAISS, index_name: str = "default"):
        """保存向量索引到磁盘"""
        self._save(vector_store, index_name)
    
    def _save(self, vector_store: FAISS, index_name: str):
        """内部保存方法"""
        save_path = os.path.join(self.persist_directory, index_name)
        vector_store.save_local(save_path)
        logger.info(f"   索引已保存: {save_path}")
    
    def load(
        self,
        index_name: str = "default"
    ) -> Optional[FAISS]:
        """
        从磁盘加载向量索引
        
        Args:
            index_name: 索引名称
            
        Returns:
            FAISS 向量存储实例，如果不存在返回 None
        """
        load_path = os.path.join(self.persist_directory, index_name)
        
        if not os.path.exists(load_path):
            logger.warning(f"⚠️  索引不存在: {load_path}")
            return None
        
        logger.info(f"📂 加载向量索引: {index_name}")
        
        vector_store = FAISS.load_local(
            load_path,
            self.embeddings,
            allow_dangerous_deserialization=True
        )
        
        logger.info(f"✅ 索引加载完成")
        
        return vector_store
    
    def list_indexes(self) -> List[str]:
        """列出所有可用的索引"""
        if not os.path.exists(self.persist_directory):
            return []
        
        indexes = [
            name for name in os.listdir(self.persist_directory)
            if os.path.isdir(os.path.join(self.persist_directory, name))
        ]
        
        return indexes


def create_vector_store(
    documents: List[Document] = None,
    embedding = None,
    persist_directory: str = "./data/indexes"
) -> FAISS:
    """
    创建向量存储的便捷函数
    
    Args:
        documents: Document 对象列表（可选）
        embedding: Embedding 模型
        persist_directory: 保存目录
        
    Returns:
        FAISS 向量存储实例
    """
    manager = VectorStoreManager(
        embeddings=embedding,
        persist_directory=persist_directory
    )
    
    if documents:
        return manager.create_from_documents(documents)
    else:
        return FAISS(embedding=embedding)


def load_vector_store(
    index_path: str,
    embedding = None
) -> FAISS:
    """
    加载向量存储的便捷函数
    
    Args:
        index_path: 索引路径或名称
        embedding: Embedding 模型
        
    Returns:
        FAISS 向量存储实例
    """
    manager = VectorStoreManager(persist_directory=index_path)
    return manager.load(index_path)
```

创建向量索引构建脚本：

```python
# examples/ch02/03_build_vector_index.py
"""
向量索引构建示例
学习如何创建和持久化向量索引
"""

import os
from rag.loaders import load_document
from rag.splitters import recursive_split
from rag.embeddings import get_embeddings
from rag.vector_stores import create_vector_store, VectorStoreManager
from config import get_logger

logger = get_logger(__name__)


def main():
    """构建向量索引的完整流程"""
    
    print("=" * 60)
    print("📚 向量索引构建实战")
    print("=" * 60)
    
    # 1. 准备文档
    docs_dir = "./data/documents"
    if not os.path.exists(docs_dir):
        logger.error("请先运行 01_document_loading.py 创建测试文档")
        return
    
    print("\n📄 步骤 1: 加载文档")
    all_documents = []
    
    for filename in os.listdir(docs_dir):
        filepath = os.path.join(docs_dir, filename)
        if os.path.isfile(filepath):
            try:
                docs = load_document(filepath)
                all_documents.extend(docs)
                logger.info(f"   加载 {filename}: {len(docs)} 个块")
            except Exception as e:
                logger.error(f"   加载失败 {filename}: {e}")
    
    print(f"   共加载 {len(all_documents)} 个文档块")
    
    # 2. 分块处理
    print("\n✂️  步骤 2: 文本分块")
    chunks = recursive_split(
        all_documents,
        chunk_size=500,
        chunk_overlap=50
    )
    print(f"   分块完成: {len(chunks)} 个块")
    
    # 3. 生成 Embedding
    print("\n🔢 步骤 3: 生成向量")
    print("   初始化 Embedding 模型...")
    embeddings = get_embeddings()
    
    # 4. 创建向量索引
    print("\n💾 步骤 4: 创建向量索引")
    index_dir = "./data/indexes/sample"
    
    vector_store = create_vector_store(
        documents=chunks,
        embedding=embeddings,
        persist_directory=index_dir
    )
    
    print(f"\n✅ 向量索引构建完成！")
    print(f"   索引位置: {index_dir}")
    print(f"   文档块数: {len(chunks)}")


def manage_indexes():
    """索引管理演示"""
    print("\n" + "=" * 60)
    print("🔧 索引管理功能演示")
    print("=" * 60)
    
    manager = VectorStoreManager(persist_directory="./data/indexes")
    
    # 列出所有索引
    print("\n📋 可用的索引:")
    indexes = manager.list_indexes()
    if indexes:
        for idx in indexes:
            print(f"   - {idx}")
    else:
        print("   没有找到索引")
    
    # 加载指定索引
    print("\n📂 加载索引:")
    vs = manager.load("sample")
    if vs:
        # 获取索引统计信息
        print(f"   索引文档数: {len(vs.docstore._dict)}")


if __name__ == "__main__":
    main()
    manage_indexes()
```

### 2.5 检索器配置与 RAG Agent 创建

最后，创建检索器并构建完整的 RAG Agent：

```python
# rag/retrievers.py（核心代码解析）

from typing import Dict, List, Any, Optional
from langchain_core.retrievers import BaseRetriever
from langchain_core.vectorstores import VectorStore
from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from config import get_logger

logger = get_logger(__name__)


class VectorStoreRetriever:
    """向量存储检索器封装"""
    
    def __init__(
        self,
        vector_store: VectorStore,
        search_type: str = "similarity",
        search_kwargs: Optional[Dict] = None
    ):
        """
        初始化检索器
        
        Args:
            vector_store: 向量存储实例
            search_type: 检索类型
            search_kwargs: 检索参数
        """
        self.vector_store = vector_store
        self.search_type = search_type
        self.search_kwargs = search_kwargs or {}
        
        # 创建底层的 LangChain 检索器
        self._retriever = vector_store.as_retriever(
            search_type=search_type,
            search_kwargs=search_kwargs
        )
    
    def invoke(self, query: str) -> List[Document]:
        """同步检索"""
        return self._retriever.invoke(query)
    
    async def ainvoke(self, query: str) -> List[Document]:
        """异步检索"""
        return await self._retriever.ainvoke(query)
    
    def get_relevant_documents(self, query: str) -> List[Document]:
        """获取相关文档（兼容旧接口）"""
        return self.invoke(query)
    
    def config_info(self) -> Dict[str, Any]:
        """获取检索器配置信息"""
        return {
            "search_type": self.search_type,
            "search_kwargs": self.search_kwargs,
            "docstore_count": len(self.vector_store.docstore._dict)
        }


def create_retriever(
    vector_store: VectorStore,
    search_type: str = "similarity",
    k: int = 5,
    **kwargs
) -> VectorStoreRetriever:
    """
    创建检索器的便捷函数
    
    Args:
        vector_store: 向量存储实例
        search_type: 检索类型（similarity/mmr/similarity_score_threshold）
        k: 返回的文档数量
        **kwargs: 其他检索参数
        
    Returns:
        配置好的检索器实例
    """
    # 根据检索类型设置参数
    search_kwargs = {"k": k}
    
    if search_type == "similarity_score_threshold":
        search_kwargs["score_threshold"] = kwargs.pop("score_threshold", 0.7)
    
    # 添加其他参数
    search_kwargs.update(kwargs)
    
    logger.info(f"🔍 创建检索器: type={search_type}, k={k}")
    
    return VectorStoreRetriever(
        vector_store=vector_store,
        search_type=search_type,
        search_kwargs=search_kwargs
    )


# rag/rag_agent.py（核心代码解析）

from langchain.agents import create_agent
from rag.retrievers import create_retriever
from config import get_logger

logger = get_logger(__name__)


# RAG Agent 默认系统提示词
DEFAULT_RAG_SYSTEM_PROMPT = """你是一个智能问答助手，专门回答基于知识库的问题。

你的任务：
1. 使用 knowledge_base 工具搜索相关信息
2. 基于检索到的文档内容回答用户问题
3. 如果文档中没有相关信息，诚实地告诉用户
4. 在回答中引用来源文档（如果有 source 信息）

回答要求：
- 准确：严格基于文档内容，不要编造信息
- 完整：尽可能提供详细的回答
- 清晰：使用简洁明了的语言
- 引用：在回答末尾列出参考的文档来源
"""


def create_rag_agent(
    retriever,
    model: str = None,
    system_prompt: str = None,
    tool_name: str = "knowledge_base",
    tool_description: str = None,
    **kwargs
):
    """
    创建 RAG Agent
    
    Args:
        retriever: 检索器实例
        model: 模型标识符
        system_prompt: 系统提示词
        tool_name: 检索工具名称
        tool_description: 检索工具描述
        **kwargs: 其他 create_agent 参数
        
    Returns:
        Agent 实例
    """
    from core.models import get_model_string
    
    logger.info("🤖 创建 RAG Agent")
    
    # 使用默认模型
    if model is None:
        model = get_model_string()
    
    # 使用默认系统提示词
    if system_prompt is None:
        system_prompt = DEFAULT_RAG_SYSTEM_PROMPT
    
    # 创建检索器工具
    if tool_description is None:
        tool_description = (
            "搜索知识库中的相关信息。"
            "当需要回答关于文档内容的问题时使用此工具。"
            "输入应该是一个搜索查询。"
        )
    
    retriever_tool = create_retriever_tool(
        retriever=retriever,
        name=tool_name,
        description=tool_description,
    )
    
    tools = [retriever_tool]
    
    # 创建 Agent
    agent = create_agent(
        model=model,
        tools=tools,
        system_prompt=system_prompt,
        **kwargs,
    )
    
    logger.info(f"✅ RAG Agent 创建成功")
    
    return agent


def create_retriever_tool(
    retriever,
    name: str = "knowledge_base",
    description: str = None
):
    """创建检索器工具"""
    from langchain_core.tools import create_retriever_tool
    
    if description is None:
        description = "从知识库中搜索相关文档。"
    
    tool = create_retriever_tool(
        retriever=retriever,
        name=name,
        description=description
    )
    
    return tool
```

创建 RAG Agent 测试脚本：

```python
# examples/ch02/04_rag_agent.py
"""
RAG Agent 示例
学习如何构建完整的知识库问答系统
"""

import os
from rag.loaders import load_document
from rag.splitters import recursive_split
from rag.embeddings import get_embeddings
from rag.vector_stores import load_vector_store
from rag.retrievers import create_retriever, create_retriever_tool
from rag.rag_agent import create_rag_agent
from config import get_logger

logger = get_logger(__name__)


def main():
    """运行完整的 RAG 问答示例"""
    
    print("=" * 60)
    print("🎯 RAG 知识库问答系统")
    print("=" * 60)
    
    # 1. 加载向量索引
    index_dir = "./data/indexes/sample"
    
    if not os.path.exists(index_dir):
        logger.error("请先运行 03_build_vector_index.py 创建索引")
        return
    
    print("\n📂 加载向量索引...")
    embeddings = get_embeddings()
    vector_store = load_vector_store(index_dir, embeddings)
    
    if vector_store is None:
        logger.error("索引加载失败")
        return
    
    doc_count = len(vector_store.docstore._dict)
    print(f"   索引包含 {doc_count} 个文档块")
    
    # 2. 创建检索器
    print("\n🔍 创建检索器...")
    retriever = create_retriever(
        vector_store=vector_store,
        search_type="similarity",
        k=3  # 返回最相似的 3 个文档
    )
    
    # 显示检索器配置
    info = retriever.config_info()
    print(f"   检索类型: {info['search_type']}")
    print(f"   返回数量: {info['search_kwargs']['k']}")
    
    # 3. 创建 RAG Agent
    print("\n🤖 创建 RAG Agent...")
    agent = create_rag_agent(retriever=retriever)
    
    # 4. 测试问答
    print("\n" + "=" * 60)
    print("💬 问答测试")
    print("=" * 60)
    
    questions = [
        "什么是人工智能？",
        "机器学习和深度学习有什么区别？",
        "人工智能有哪些应用领域？",
        "这个问题文档中没有涉及",
    ]
    
    for question in questions:
        print(f"\n📝 问题: {question}")
        print("-" * 40)
        
        try:
            response = agent.invoke(question)
            print(f"🤖 回答:\n{response}")
        except Exception as e:
            print(f"❌ 错误: {e}")


def test_retrieval():
    """直接测试检索功能"""
    print("\n" + "=" * 60)
    print("🔍 检索功能测试")
    print("=" * 60)
    
    index_dir = "./data/indexes/sample"
    embeddings = get_embeddings()
    vector_store = load_vector_store(index_dir, embeddings)
    
    if vector_store is None:
        return
    
    retriever = create_retriever(vector_store, k=3)
    
    test_queries = [
        "机器学习",
        "深度学习",
        "计算机视觉",
    ]
    
    for query in test_queries:
        print(f"\n📝 查询: {query}")
        print("-" * 40)
        
        docs = retriever.invoke(query)
        
        for i, doc in enumerate(docs, 1):
            content_preview = doc.page_content[:100].replace('\n', ' ')
            print(f"   结果 {i} (相似度相关): {content_preview}...")
            
            if doc.metadata:
                print(f"         来源: {doc.metadata.get('source', 'unknown')}")


if __name__ == "__main__":
    main()
    test_retrieval()
```

## 教学要点

### 3.1 分块策略的选择与优化

分块策略是 RAG 系统中最重要的超参数之一。块大小的选择需要权衡检索精度和上下文完整性。较大的块（如 1000-2000 字符）包含更丰富的上下文信息，但可能引入更多噪声；较小的块（如 200-500 字符）检索精度更高，但可能丢失重要的上下文。实际应用中，通常建议从中等大小（如 500-800 字符）开始，然后根据实际效果调整。

重叠大小是另一个需要仔细调整的参数。设置重叠可以确保重要信息不会因为分块边界而被切断。但过大的重叠会增加检索的冗余性和成本。一般建议重叠大小设置为块大小的 10% 到 20%。例如，如果块大小是 1000 字符，重叠可以设置为 100-200 字符。

对于特殊类型的文档，可以采用更精细的分块策略。例如，对于技术文档，可以按照标题层级进行分块，每个块对应一个小节；对于代码文档，可以保持代码块的完整性，不在代码内部进行分割；对于对话记录，可以按照轮次进行分块，保持对话的连贯性。

### 3.2 检索效果评估与优化

检索效果的评估通常使用命中率（Hit Rate）和平均倒数排名（MRR）等指标。命中率指检索结果中包含正确答案的比例；MRR 衡量正确答案在检索结果中的平均排名位置。在实际应用中，可以通过人工评估或自动评估（如使用另一个语言模型判断检索结果是否相关）来量化检索效果。

检索优化的常见策略包括：查询改写（将用户问题改写为更适合检索的形式）、混合检索（结合关键词检索和向量检索）、结果重排序（使用更复杂的模型对初步检索结果进行重新排序）、查询扩展（将一个查询扩展为多个相关查询）等。这些策略可以根据具体场景组合使用。

向量数据库的选择也会影响检索效果。FAISS 适合小规模数据和精确检索场景。对于更大规模的数据，可以考虑使用 Milvus、Weaviate、Chroma 等专业的向量数据库。这些数据库提供了分布式架构、更好的可扩展性和更丰富的功能。

### 3.3 RAG 系统的常见问题

上下文窗口溢出是大语言模型应用中的常见问题。当检索到的文档内容太长，超过了模型的上下文窗口限制时，需要进行截断或压缩。常用的策略包括：选择性截断（保留最相关的内容）、摘要压缩（使用语言模型生成摘要）、分层检索（先检索摘要，再检索详细内容）。

检索结果的多样性也是一个挑战。相似度最高的几个文档往往内容相似，无法提供足够的信息。MMR（最大边际相关性）检索是解决这个问题的有效方法，它在相关性和多样性之间取得平衡，返回的内容既相关又不重复。

冷启动问题是新用户或新文档场景下的挑战。对于新用户，系统没有足够的历史数据来理解用户意图；对于新文档，向量索引中可能没有足够的相关内容。解决方案包括：使用用户画像和推荐系统改善用户体验；采用渐进式索引策略，新文档逐步加入索引。

## 课后作业

### 基础作业

**作业 1：多格式文档加载器**

扩展文档加载器，支持更多文档格式。要求：
- 实现 Word 文档（.docx）加载功能
- 实现 Excel 文件（.xlsx）加载功能
- 实现 CSV 文件加载功能
- 为每种格式设计合适的元数据提取策略
- 编写测试用例验证各种格式的加载效果

**作业 2：智能分块策略**

实现自定义的分块策略。要求：
- 实现按段落分块（保持段落完整性）
- 实现按句子分块（适合短文本）
- 实现语义分块（使用模型判断语义边界）
- 比较不同策略的检索效果

### 中级作业

**作业 3：混合检索系统**

构建混合检索系统。要求：
- 实现关键词检索（使用 BM25 或 TF-IDF）
- 实现向量检索（使用 FAISS）
- 实现结果融合策略
- 评估混合检索 vs 单一检索的效果差异

**作业 4：检索结果重排序**

实现检索结果重排序功能。要求：
- 使用交叉编码器（Cross-Encoder）进行重排序
- 实现批量重排序优化
- 比较重排序前后的效果差异
- 分析重排序的计算成本

### 高级作业

**作业 5：可配置的 RAG 框架**

设计一个可配置的 RAG 框架。要求：
- 支持运行时切换分块策略
- 支持运行时切换检索器类型
- 支持自定义检索流程（单轮/多轮/迭代）
- 提供 Web 配置界面

**作业 6：增量索引系统**

实现增量索引更新系统。要求：
- 支持文档的增删改查
- 实现增量向量化（只处理变化的文档）
- 支持索引版本管理
- 提供索引备份和恢复功能

## 代码示例

### 示例 1：高级检索器配置

```python
# rag/advanced_retrievers.py
"""
高级检索器配置
提供多种检索策略的实现
"""

from typing import List, Dict, Any
from langchain_core.retrievers import EnsembleRetriever
from langchain_core.vectorstores import VectorStore
from langchain_core.documents import Document
from rag.retrievers import create_retriever
from config import get_logger

logger = get_logger(__name__)


class MMRRetriever:
    """最大边际相关性检索器"""
    
    def __init__(
        self,
        vector_store: VectorStore,
        k: int = 5,
        fetch_k: int = 20,
        lambda_mult: float = 0.5
    ):
        """
        初始化 MMR 检索器
        
        Args:
            vector_store: 向量存储实例
            k: 最终返回的文档数
            fetch_k: 初步检索的候选文档数
            lambda_mult: 控制相关性和多样性的平衡
                        值越小越倾向于多样性
        """
        self.vector_store = vector_store
        self.k = k
        self.fetch_k = fetch_k
        self.lambda_mult = lambda_mult
        
        # 创建底层检索器
        self._retriever = vector_store.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": k,
                "fetch_k": fetch_k,
                "lambda_mult": lambda_mult
            }
        )
    
    def invoke(self, query: str) -> List[Document]:
        """执行 MMR 检索"""
        return self._retriever.invoke(query)
    
    def config_info(self) -> Dict[str, Any]:
        """获取配置信息"""
        return {
            "type": "MMR",
            "k": self.k,
            "fetch_k": self.fetch_k,
            "lambda_mult": self.lambda_mult
        }


class ThresholdRetriever:
    """阈值过滤检索器"""
    
    def __init__(
        self,
        vector_store: VectorStore,
        score_threshold: float = 0.7,
        k: int = 10
    ):
        """
        初始化阈值检索器
        
        Args:
            score_threshold: 相似度阈值
            k: 最大返回文档数
        """
        self.vector_store = vector_store
        self.score_threshold = score_threshold
        self.k = k
        
        self._retriever = vector_store.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={
                "score_threshold": score_threshold,
                "k": k
            }
        )
    
    def invoke(self, query: str) -> List[Document]:
        """执行阈值检索"""
        return self._retriever.invoke(query)


class EnsembleRetriever:
    """集成检索器"""
    
    def __init__(
        self,
        retrievers: List,
        weights: List[float] = None
    ):
        """
        初始化集成检索器
        
        Args:
            retrievers: 检索器列表
            weights: 各检索器的权重
        """
        if weights is None:
            weights = [1.0 / len(retrievers)] * len(retrievers)
        
        self.retrievers = retrievers
        self.weights = weights
        
        # 创建 LangChain 集成检索器
        self._retriever = EnsembleRetriever(
            retrievers=[r._retriever for r in retrievers],
            weights=weights
        )
    
    def invoke(self, query: str) -> List[Document]:
        """执行集成检索"""
        return self._retriever.invoke(query)


def create_mmr_retriever(
    vector_store: VectorStore,
    k: int = 5,
    **kwargs
) -> MMRRetriever:
    """创建 MMR 检索器的便捷函数"""
    return MMRRetriever(
        vector_store=vector_store,
        k=k,
        **kwargs
    )


def create_threshold_retriever(
    vector_store: VectorStore,
    score_threshold: float = 0.7,
    k: int = 10
) -> ThresholdRetriever:
    """创建阈值检索器的便捷函数"""
    return ThresholdRetriever(
        vector_store=vector_store,
        score_threshold=score_threshold,
        k=k
    )
```

### 示例 2：查询处理管道

```python
# rag/query_pipeline.py
"""
查询处理管道
实现查询改写、扩展和后处理
"""

from typing import List, Dict, Any
from langchain_core.documents import Document
from config import get_logger

logger = get_logger(__name__)


class QueryProcessor:
    """查询处理器"""
    
    def __init__(self):
        """初始化查询处理器"""
        pass
    
    def process(self, query: str) -> str:
        """
        处理查询
        
        Args:
            query: 原始查询
            
        Returns:
            处理后的查询
        """
        # 子类实现具体处理逻辑
        return query


class QueryRewriter(QueryProcessor):
    """查询改写器"""
    
    def __init__(self, model=None):
        super().__init__()
        self.model = model
    
    def process(self, query: str) -> str:
        """
        改写查询为更适合检索的形式
        
        Args:
            query: 原始查询
            
        Returns:
            改写后的查询
        """
        if self.model is None:
            return query
        
        # 使用 LLM 改写查询
        prompt = f"""将以下查询改写为更适合知识库检索的形式。
保持原意，但使用更正式、更具体的表述。

原始查询: {query}
改写查询:"""
        
        # 调用模型生成改写查询
        rewritten = self.model.invoke(prompt)
        
        return rewritten.strip()


class QueryExpander(QueryProcessor):
    """查询扩展器"""
    
    def __init__(self, model=None, num_expansions: int = 3):
        super().__init__()
        self.model = model
        self.num_expansions = num_expansions
    
    def process(self, query: str) -> List[str]:
        """
        扩展查询为多个相关查询
        
        Args:
            query: 原始查询
            
        Returns:
            扩展后的查询列表
        """
        if self.model is None:
            return [query]
        
        prompt = f"""为以下查询生成 {self.num_expansions} 个不同的表述形式。
每个表述应该从不同角度或使用不同词汇表达相同的查询意图。

原始查询: {query}

表述1:
表述2:
表述3:"""
        
        # 调用模型生成扩展查询
        response = self.model.invoke(prompt)
        
        # 解析响应
        expansions = [
            line.strip()
            for line in response.split('\n')
            if line.strip() and not line.startswith('表述')
        ]
        
        if not expansions:
            return [query]
        
        return [query] + expansions[:self.num_expansions]


class QueryPipeline:
    """查询处理管道"""
    
    def __init__(self):
        """初始化查询管道"""
        self.processors: List[QueryProcessor] = []
    
    def add_processor(self, processor: QueryProcessor):
        """添加处理器"""
        self.processors.append(processor)
    
    def process(self, query: str) -> Dict[str, Any]:
        """
        执行完整的查询处理流程
        
        Args:
            query: 原始查询
            
        Returns:
            处理结果字典
        """
        result = {
            "original_query": query,
            "processed_queries": [query],
            "steps": []
        }
        
        current_query = query
        
        for processor in self.processors:
            step_result = {
                "processor": processor.__class__.__name__,
                "input": current_query
            }
            
            if isinstance(processor, QueryExpander):
                expansions = processor.process(current_query)
                current_query = expansions[0]  # 使用第一个作为主查询
                result["processed_queries"] = expansions
                step_result["output"] = expansions
            else:
                current_query = processor.process(current_query)
                step_result["output"] = current_query
            
            result["steps"].append(step_result)
        
        result["final_query"] = current_query
        
        return result


def create_query_pipeline(use_rewriting: bool = True, use_expansion: bool = False):
    """
    创建查询管道的便捷函数
    
    Args:
        use_rewriting: 是否使用查询改写
        use_expansion: 是否使用查询扩展
        
    Returns:
        配置好的查询管道
    """
    from langchain_openai import ChatOpenAI
    from config import settings
    
    pipeline = QueryPipeline()
    
    if use_rewriting:
        model = ChatOpenAI(model=settings.openai_model)
        pipeline.add_processor(QueryRewriter(model))
    
    if use_expansion:
        if 'model' not in locals():
            model = ChatOpenAI(model=settings.openai_model)
        pipeline.add_processor(QueryExpander(model))
    
    return pipeline
```

## 参考资料

### 官方文档

- LangChain RAG 文档：https://docs.langchain.com/oss/python/langchain/text_splitters
- FAISS 官方文档：https://github.com/facebookresearch/faiss
- OpenAI Embeddings 文档：https://platform.openai.com/docs/guides/embeddings

### 技术论文

- Retrieval-Augmented Generation 原始论文：https://arxiv.org/abs/2005.11401
- BGE Embedding 论文：https://arxiv.org/abs/2309.16541
- RAG 评估基准：https://github.com/Retrieval-Enhanced-Generative-Process/benchmark

### 进阶资源

- Awesome RAG 资源集合：https://github.com/huggingface/awesome-rag
- LangChain RAG 教程：https://github.com/langchain-ai/rag-chunking
- 向量数据库比较：https://github.com/vecs xyz/vector-db-benchmark
