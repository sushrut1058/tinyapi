FROM python:3.11-slim

WORKDIR app

COPY package /app/package

# RUN chmod 700 package/core.py package/exceptions.py package/table_dict.py && chmod 777 package/script.py && chmod 755 package/main.py
WORKDIR package
RUN chmod 744 core.py utils.py table_dict.py
RUN chmod 500 script.py
RUN pip install --no-cache-dir \
    PyJWT \
    requests \
    flask \
    numpy \
    pandas 
RUN useradd -m temp_user
WORKDIR ..
USER temp_user
