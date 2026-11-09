#!/usr/bin/env python3
"""Notify do Codex: dispara o hook de voz e preserva o notify do Computer Use, se ele existir.

O Codex só aceita um comando em `notify`. Com o Computer Use instalado, o próprio Codex
coloca o cliente dele ali e passa o notify anterior em --previous-notify; este script entra
nesse lugar e chama os dois.
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

HOOK = Path(__file__).resolve().parent / 'hook.js'
PREVIOUS = Path.home() / '.codex/computer-use/Codex Computer Use.app/Contents/SharedSupport/SkyComputerUseClient.app/Contents/MacOS/SkyComputerUseClient'
# o Codex desktop roda o notify com um PATH curto: procura o node também no Homebrew
NODE = shutil.which('node', path='/opt/homebrew/bin:/usr/local/bin:' + os.environ.get('PATH', '')) or 'node'

def dispatch(args):
    env = os.environ.copy()
    env['PATH'] = '/opt/homebrew/bin:/usr/local/bin:' + env.get('PATH', '')
    comandos = [[NODE, str(HOOK), 'codex', *args]]
    if PREVIOUS.exists():
        comandos.insert(0, [str(PREVIOUS), 'turn-ended', *args])
    for command in comandos:
        try:
            subprocess.Popen(command, env=env, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        except OSError:
            continue

if __name__ == '__main__':
    dispatch(sys.argv[1:])
