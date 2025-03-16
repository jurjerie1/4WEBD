using System;
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using _4WEBD.Identity.Shared.Models;
using Microsoft.IdentityModel.Tokens;

namespace _4WEBD.Authentification.Services;

public class TokenService
{
    #region Properties
    private readonly IConfiguration _configuration;
    #endregion

    #region Constructor
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    #endregion

    /// <summary>
    /// Génère un jeton JWT (JSON Web Token) pour un utilisateur spécifié.
    /// </summary>
    /// <param name="user">L'utilisateur pour lequel le jeton JWT est généré.</param>
    /// <returns>Le jeton JWT généré sous forme de chaîne de caractères.</returns>
    /// <remarks>
    /// Cette méthode crée un jeton JWT en utilisant les informations de l'utilisateur spécifié, y compris l'ID de l'utilisateur et son email.
    /// Le jeton est signé en utilisant l'algorithme HMAC SHA256.
    /// </remarks>
    public string GenerateJwtToken(UserModel user, string role)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();


        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                    new Claim("Id", user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("role", role),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }),
            Audience =  "User",
            Expires = DateTime.UtcNow.AddHours(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        };

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);

        var jwtToken = jwtTokenHandler.WriteToken(token);

        return jwtToken;
    }

}
