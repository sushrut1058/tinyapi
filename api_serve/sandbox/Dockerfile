FROM python:3.11-slim

WORKDIR app

COPY package /app/package

# RUN chmod 700 package/core.py package/exceptions.py package/table_dict.py && chmod 777 package/script.py && chmod 755 package/main.py
WORKDIR package
RUN chmod 744 core.py utils.py table_dict.py
RUN chmod 500 script.py
RUN pip install --no-cache-dir \
    # Auth & Security
    PyJWT \
    bcrypt \
    cryptography \
    python-dotenv \
    authlib \
    oauthlib \
    # HTTP & API Frameworks
    requests \
    httpx \
    aiohttp \
    flask \
    fastapi \
    uvicorn \
    websockets \
    # Bot Frameworks
    discord.py \
    python-telegram-bot \
    slack-sdk \
    tweepy \
    # Payment Processing
    stripe \
    paypalrestsdk \
    # Communication
    twilio \
    sendgrid \
    # AI & ML
    openai \
    anthropic \
    scikit-learn \
    # Data Processing
    numpy \
    pandas \
    python-dateutil \
    arrow \
    # Database
    psycopg2-binary \
    pymongo \
    redis \
    sqlalchemy \
    # File Handling
    openpyxl \
    pypdf \
    python-docx \
    PyYAML \
    # Utilities
    pydantic \
    python-multipart \
    pillow \
    beautifulsoup4 \
    lxml \
    validators \
    qrcode \
    schedule \
    feedparser \
    python-magic \
    # Cloud & Services
    boto3 \
    google-cloud-storage \
    # Web Scraping
    selenium \
    scrapy \
    # Finance & Crypto
    yfinance \
    ccxt \
    # Misc
    icalendar \
    geopy \
    faker \
    markdown \
    jinja2 
RUN useradd -m temp_user
WORKDIR ..
USER temp_user
