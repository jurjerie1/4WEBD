using System;
using System.ComponentModel.DataAnnotations;

namespace _4WEBD.Authentification.Dtos;

public class RegisterDTO
{
    /// <summary>
    /// Doit être unique
    /// </summary>
    [Required(ErrorMessage = "L'eamil est obligatoire.")]
    [EmailAddress(ErrorMessage = "L'eamil est invalide.")]

    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    [Compare("Password", ErrorMessage = "Les mots de passe ne correspondent pas.")]
    public string PasswordConfirmation { get; set; }
    [Required]
    [MinLength(4, ErrorMessage = "Le nom d'utilisateur doit contenir au moins 4 caractères.")]
    public string UserName { get; set; }

    [Required]
    [DataType(DataType.Date)]

    /// <summary>
    /// L'utilisateur doit avoir au moins 13 ans
    /// </summary>
    [CustomValidation(typeof(RegisterDTO), nameof(ValidateAge))]
    public DateTime DateOfBirth { get; set; }

    public static ValidationResult? ValidateAge(DateTime dateOfBirth, ValidationContext context)
    {
        var age = DateTime.Today.Year - dateOfBirth.Year;
        if (dateOfBirth > DateTime.Today.AddYears(-age)) age--;
        return age >= 13 ? ValidationResult.Success : new ValidationResult("L'âge doit être supérieur ou égal à 13 ans.");
    }

    [Required]
    [MinLength(2, ErrorMessage = "Le nom doit contenir au moins 2 caractères.")]
    public string LastName { get; set; }
    [Required]
    [MinLength(2, ErrorMessage = "Le prénom doit contenir au moins 2 caractères.")]
    public string FirstName { get; set; }
}
