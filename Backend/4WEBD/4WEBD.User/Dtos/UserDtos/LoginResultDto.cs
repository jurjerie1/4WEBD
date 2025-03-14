using System;
using _4WEBD.User.Models;

namespace _4WEBD.User.Dtos.UserDtos;

public class LoginResultDto
{
    #region Properties
    public string Email { get; set; }
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public string Role { get; set; }
    public string UserName { get; set; }

    #endregion
    #region Constructors
    public LoginResultDto(UserModel user, string role)
    {
        Email = user.Email;
        Token = "";
        RefreshToken = "";
        Role = role;
        UserName = user.UserName;
    }

    public LoginResultDto()
    {

    }

    #endregion
}
