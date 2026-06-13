# Use official .NET 10 SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["src/Hickory.Api/Hickory.Api.csproj", "src/Hickory.Api/"]
RUN dotnet restore "src/Hickory.Api/Hickory.Api.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/src/Hickory.Api"

# Build the project
RUN dotnet build "Hickory.Api.csproj" -c Release -o /app/build

# Publish the build
FROM build AS publish
RUN dotnet publish "Hickory.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official .NET 10 ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 8080 (ASP.NET 8.0+ default port)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Hickory.Api.dll"]
