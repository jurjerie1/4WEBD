FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Étape de build avec le SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["4WEBD.SharedClasses/4WEBD.SharedClasses.csproj", "4WEBD.SharedClasses/"]
COPY ["4WEBD.NotificationService.Razor.Template/4WEBD.NotificationService.Razor.Template.csproj", "4WEBD.NotificationService.Razor.Template/"]

COPY ["4WEBD.NotificationService/4WEBD.NotificationService.csproj", "4WEBD.NotificationService/"]
RUN dotnet restore "4WEBD.NotificationService/4WEBD.NotificationService.csproj"
COPY . .
WORKDIR "/src/4WEBD.NotificationService"
RUN dotnet build "4WEBD.NotificationService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "4WEBD.NotificationService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "4WEBD.NotificationService.dll"]


