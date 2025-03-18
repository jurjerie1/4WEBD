using System;

namespace _4WEBD.User.Dtos.UserDtos;

public class UpdateUserDto
{
    #region Properties
    public string Email { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    #endregion
}
