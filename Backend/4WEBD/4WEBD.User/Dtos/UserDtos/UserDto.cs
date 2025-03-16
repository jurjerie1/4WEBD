using System;
using _4WEBD.Identity.Shared.Models;
using _4WEBD.User.Dtos.RoleDtos;
using Microsoft.AspNetCore.Identity;

namespace _4WEBD.User.Dtos.UserDtos;

public class UserDto
{
    #region Properties
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Role { get; set; }
    #endregion

    #region Constructors
    public UserDto(UserModel user,ICollection<string> roles)
    {
        Id = user.Id;
        Email = user.Email;
        UserName = user.UserName;
        FirstName = user.FirstName;
        LastName = user.LastName;
        PhoneNumber = user.PhoneNumber;
        Role = roles != null ? string.Join(" ", roles) : string.Empty;
    }

    public UserDto()
    {

    }
    #endregion
}
