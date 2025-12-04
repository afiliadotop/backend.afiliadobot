import os
import json
from telegram import Update
from telegram.ext import Application, ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = os.getenv("BOT_TOKEN")

if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN não definido nas variáveis de ambiente")

# Cria a aplicação do bot (sem rodar .run_polling, porque usamos webhook)
application: Application = ApplicationBuilder().token(BOT_TOKEN).build()


# ===== COMANDOS =====
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Olá! Eu sou o afiliadoTOP_bot.\n"
        "Peça cupons usando: /cupom\n"
        "Promoções diárias: /promo"
    )


async def cupom(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # TODO: integrar com banco / API (AfiliadoHub) no futuro
    await update.message.reply_text(
        "🎉 Aqui está seu cupom: https://afiliado.top/cupons"
    )


async def promo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # TODO: integrar com banco / API (AfiliadoHub) no futuro
    await update.message.reply_text(
        "🔥 Promoção do momento: https://afiliado.top/promo"
    )


# Registra handlers de comando
application.add_handler(CommandHandler("start", start))
application.add_handler(CommandHandler("cupom", cupom))
application.add_handler(CommandHandler("promo", promo))


# ===== FUNÇÃO VERCEL (WEBHOOK) =====
async def handler(request, *args, **kwargs):
    """
    Handler para Vercel.

    - GET  /            -> healthcheck
    - POST /            -> webhook do Telegram (update)
    """

    if request.method == "GET":
        return {
            "statusCode": 200,
            "body": "AfiliadoTop_bot OK"
        }

    if request.method == "POST":
        body = await request.json()
        update = Update.de_json(body, application.bot)
        await application.process_update(update)
        return {
            "statusCode": 200,
            "body": json.dumps({"ok": True})
        }

    return {
        "statusCode": 405,
        "body": json.dumps({"error": "method not allowed"})
    }
