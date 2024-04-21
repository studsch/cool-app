FROM python:3.9-slim


RUN apt-get update && \
    apt-get install -y wget bzip2 gcc && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip

workdir /app
RUN mkdir -p /app/models /app/data/raw /app/data/ratings
RUN mkdir src
RUN mkdir config
COPY config ./config
COPY src ./src
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 50051

CMD ["python", "src/logic/data_execution/execute.py", "&&", "ls", "data/raw"]