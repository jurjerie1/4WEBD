using System;
using _4WEBD.Identity.Shared.Models;

namespace _4WEBD.Authentification.Dtos;

public class LoginResultDto
{
    #region Properties
    public string Email { get; set; }
    public string Token { get; set; }
    public string Role { get; set; }
    public string UserName { get; set; }


    #endregion
    #region Constructors
    public LoginResultDto(UserModel user, string role, string token)
    {
        Email = user.Email;
        Token = token;
        Role = role;
        UserName = user.UserName;
    }


    public LoginResultDto()
    {

    }

    #endregion
}
