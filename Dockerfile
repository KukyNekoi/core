FROM microsoft/dotnet:sdk

RUN apt-get update
RUN wget https://downloads.wkhtmltopdf.org/0.12/0.12.5/wkhtmltox_0.12.5-1.stretch_amd64.deb  && dpkg -i wkhtmltox_0.12.5-1.stretch_amd64.deb  ; apt --fix-broken install -y
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs && npm i -g npm
RUN cp /usr/local/bin/wkhtmlto* /usr/bin/

WORKDIR /app
VOLUME /app/wwwroot/Repository
COPY *.csproj ./
COPY . ./

RUN dotnet publish

ENV ASPNETCORE_Environment=Production
ENV ASPNETCORE_URLS=http://*:8080 

EXPOSE 8080/tcp

ENTRYPOINT ["dotnet", "run"]
