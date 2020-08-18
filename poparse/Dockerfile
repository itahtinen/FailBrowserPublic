FROM python:3.7.3
COPY . .

RUN pip install --upgrade pip
RUN pip install -r req.txt
ENTRYPOINT ["flask", "run","--host", "0.0.0.0"] 

