import sys
import os

# Adiciona o diretório 'afiliadohub' ao path do Python para encontrar modules
# Adiciona o diretório 'afiliadohub' ao path do Python para encontrar modules
current_dir = os.path.dirname(os.path.abspath(__file__))
# O backend real está em ../afiliadohub
afiliadohub_path = os.path.join(current_dir, '..', 'afiliadohub')

# PRIORIDADE: Adiciona afiliadohub no INÍCIO do path para que 'import api'
# encontre 'afiliadohub/api' (backend) ao invés de 'root/api' (este arquivo)
if afiliadohub_path not in sys.path:
    sys.path.insert(0, afiliadohub_path)

# Importa a aplicação do backend original
try:
    # Tenta importar como se estivesse no path raiz (comportamento padrão do código original)
    from api.index import app
except ImportError:
    # Fallback caso a estrutura de pacotes exija ser explícito
    from afiliadohub.api.index import app

# Necessário para Vercel Serverless
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
