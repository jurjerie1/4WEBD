using System;
using Microsoft.AspNetCore.Identity;

namespace _4WEBD.User.Models;

public class UserModel : IdentityUser<Guid>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsGoogleAccount { get; set; }
    public DateTime DateOfBirth { get; set; }
}

