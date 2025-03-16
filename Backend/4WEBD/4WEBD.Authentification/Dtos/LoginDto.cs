using System;
using System.ComponentModel.DataAnnotations;

namespace _4WEBD.Authentification.Dtos;

public class LoginDto
{
    [Required(ErrorMessage = "L'eamil est obligatoire.")]
    [EmailAddress(ErrorMessage = "L'eamil est invalide.")]
    public string Email { get; set; }
    [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
    public string Password { get; set; }
}
