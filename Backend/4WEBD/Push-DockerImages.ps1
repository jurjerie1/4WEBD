# Registre Docker (Docker Hub, registre priv�, etc.)
$registry = "docker.io/jurjerie/4proj" # Exemple: docker.io/username ou myregistry.local

# Extraire les images d�finies dans le fichier docker-compose.yml
Write-Host "Extracting images from docker-compose.yml..."
$images = docker compose config | Select-String -Pattern "image:" | ForEach-Object { $_.ToString().Trim().Split(":")[1].Trim() }

# V�rifier et pousser chaque image
foreach ($image in $images) {
    $imageName = $image.Split("/")[-1] # R�cup�re uniquement le nom de l'image
    $taggedImage = "$registry/$imageName:latest"
    Write-Host "Tagging $image as $taggedImage"
    docker tag $image $taggedImage

    Write-Host "Pushing $taggedImage"
    docker push $taggedImage
}
