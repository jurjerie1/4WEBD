# # Consultez https://aka.ms/customizecontainer pour savoir comment personnaliser votre conteneur de débogage et comment Visual Studio utilise ce Dockerfile pour générer vos images afin d’accélérer le débogage.

# # Cet index est utilisé lors de l’exécution à partir de VS en mode rapide (par défaut pour la configuration de débogage)
# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# USER $APP_UID
# WORKDIR /app
# EXPOSE 8080


# # Cette phase est utilisée pour générer le projet de service
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# ARG BUILD_CONFIGURATION=Release
# WORKDIR /src
# COPY ["4WEBD.Event/4WEBD.Event.csproj", "4WEBD.Event/"]
# RUN dotnet restore "./4WEBD.Event/4WEBD.Event.csproj"
# COPY . .
# WORKDIR "/src/4WEBD.Event"
# RUN dotnet build "./4WEBD.Event.csproj" -c $BUILD_CONFIGURATION -o /app/build

# # Cette étape permet de publier le projet de service à copier dans la phase finale
# FROM build AS publish
# ARG BUILD_CONFIGURATION=Release
# RUN dotnet publish "./4WEBD.Event.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# # Cette phase est utilisée en production ou lors de l’exécution à partir de VS en mode normal (par défaut quand la configuration de débogage n’est pas utilisée)
# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "4WEBD.Event.dll"]

# Consultez https://aka.ms/customizecontainer pour savoir comment personnaliser votre conteneur de d�bogage et comment Visual Studio utilise ce Dockerfile pour g�n�rer vos images afin d'acc�l�rer le d�bogage.
# Cet index est utilis� lors de l'ex�cution � partir de VS en mode rapide (par d�faut pour la configuration de d�bogage)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Cette phase est utilis�e pour g�n�rer le projet de service
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["4WEBD.Event/4WEBD.Event.csproj", "4WEBD.Event/"]
RUN dotnet restore "./4WEBD.Event/4WEBD.Event.csproj"
COPY . .
WORKDIR "/src/4WEBD.Event"
RUN dotnet build "./4WEBD.Event.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Cette �tape permet de publier le projet de service � copier dans la phase finale
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./4WEBD.Event.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Cette phase est utilis�e en production ou lors de l'ex�cution � partir de VS en mode normal (par d�faut quand la configuration de d�bogage n'est pas utilis�e)
FROM base AS final
WORKDIR /app
# Create uploads directory with proper permissions and ownership
RUN mkdir -p /app/Uploads/Images && chmod -R 777 /app/Uploads
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "4WEBD.Event.dll"]