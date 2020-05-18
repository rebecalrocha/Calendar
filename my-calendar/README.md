<div align="center">
  <img src="/image.png" style="width: 50%; max-width: 640px;">
</div>

## Preparando Back-End

**Necessário instalar:**

* python3
* pip `sudo apt install python3-pip`

**Na pasta events-api:**

* Criar venv `python3 -m venv venv`
* Ativar venv `source venv/bin/activate`
* Instalar dependecias `pip install -r requirements.txt`
* Setar variavel de ambiente `export FLASK_APP=events.py`
* Executar as migrações do banco `flask db upgrade`
* Rodar a API `flask run`

## Preparando Front-End

**Necessário instalar:**

* node
* npm

**Na pasta my-calendar:**

* Instalar as dependências `npm install`
* Rodar o projeto`npm start`
