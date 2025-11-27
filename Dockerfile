FROM python

WORKDIR /app

COPY requeriments.txt .

RUN pip install --no-cache-dir -r requeriments.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:main", "--host", "0.0.0.0", "--port", "8000"]