using System;

namespace _4WEBD.SharedClasses;

public class UserInfo
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public bool? IsValidAccount { get; set; }
}
