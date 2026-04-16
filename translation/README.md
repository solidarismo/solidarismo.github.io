# Tradução do `Solidarité.pdf` para PT-BR (HTML)

Este fluxo evita “gastar” processamento do Codex para traduzir: a tradução em si roda via API de terceiros (ex.: Google Cloud Translate), e o Codex ajuda só na automação.

## 1) Extrair o texto em francês

```bash
python3 scripts/solidarite.py extract-fr --pdf "Solidarité.pdf" --out translation/solidarite.fr.txt
```

Opcional (por páginas, útil para ir aos poucos):

```bash
python3 scripts/solidarite.py extract-fr --first-page 1 --last-page 20 --out translation/parts/solidarite.fr.p001-020.txt
python3 scripts/solidarite.py extract-fr --first-page 21 --last-page 40 --out translation/parts/solidarite.fr.p021-040.txt
```

## 2) Traduzir via Google Cloud Translate (v2)

Pré-requisito: criar uma chave para a API do Google Cloud Translate e exportar no ambiente:

```bash
export GOOGLE_TRANSLATE_API_KEY="SUA_CHAVE_AQUI"
```

Rodar a tradução (com cache em `translation/cache/google_ptbr.jsonl`):

```bash
python3 scripts/solidarite.py translate-google \
  --input translation/parts/solidarite.fr.p001-020.txt \
  --out translation/parts/solidarite.ptbr.p001-020.txt
```

## 2b) (Gratis) Traduzir offline com Argos Translate

Isso roda localmente (sem API paga). A qualidade costuma ser boa o suficiente para rascunho + revisão humana.

1) Instalar a lib:

```bash
python3 -m venv .venv
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install argostranslate
```

Opcional (recomendado em ambientes “sandbox”/CI): manter os dados do Argos dentro do repositório (evita erro de “read-only file system” em `~/.local/...`):

```bash
export XDG_DATA_HOME="$PWD/translation/.xdg/data"
export XDG_CONFIG_HOME="$PWD/translation/.xdg/config"
export XDG_CACHE_HOME="$PWD/translation/.xdg/cache"
```

2) Instalar o pacote de tradução `fr -> pt` (via Argos Translate GUI/CLI) ou baixar o arquivo do pacote e passar no comando:

```bash
./.venv/bin/python scripts/solidarite.py translate-argos \
  --input translation/parts/solidarite.fr.p001-020.txt \
  --out translation/parts/solidarite.ptbr.p001-020.txt \
  --argos-package /caminho/para/fr_pt.argosmodel
```

Alternativa (mais fácil, mas precisa de internet): baixar e instalar automaticamente do índice do Argos:

```bash
./.venv/bin/python scripts/solidarite.py translate-argos \
  --install-missing \
  --pivot en \
  --input translation/parts/solidarite.fr.p001-020.txt \
  --out translation/parts/solidarite.ptbr.p001-020.txt
```

## 3) Gerar o HTML paginado (estilo A4)

```bash
python3 scripts/solidarite.py to-html \
  --input translation/parts/solidarite.ptbr.p001-020.txt \
  --out translation/parts/solidarite.ptbr.p001-020.html \
  --title "Solidarité — Tradução PT-BR"
```

## Notas importantes

- O HTML fica “tipo PDF” no sentido de páginas A4 para leitura/impressão, mas a tradução muda o comprimento do texto, então não dá para manter a diagramação original 1:1.
- A API do Google é paga por caractere; o cache evita retraduzir os mesmos parágrafos.
