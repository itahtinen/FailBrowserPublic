FROM mcr.microsoft.com/dotnet/core/aspnet:2.1 AS base


FROM mcr.microsoft.com/dotnet/core/sdk:2.1 AS build

COPY ./FBrowser/FBrowser.csproj FBrowser/
RUN dotnet restore "FBrowser/FBrowser.csproj"
COPY . .
WORKDIR /FBrowser

FROM build AS publish
RUN dotnet publish "FBrowser.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FBrowser.dll"]



