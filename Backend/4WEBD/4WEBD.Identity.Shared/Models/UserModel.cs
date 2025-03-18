using System;
using Microsoft.AspNetCore.Identity;

namespace _4WEBD.Identity.Shared.Models;

public class UserModel : IdentityUser<Guid>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
}