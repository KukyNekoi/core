FROM tambase

WORKDIR app/

COPY ClientAPP/package*.json *.csproj ./

COPY . .

ENV ASPNETCORE_Environment=Production
ENV ASPNETCORE_URLS=http://*:8080 

EXPOSE 8080/tcp

CMD ["dotnet", "run"]
