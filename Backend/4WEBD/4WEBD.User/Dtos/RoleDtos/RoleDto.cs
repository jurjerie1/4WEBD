using System;
using Microsoft.AspNetCore.Identity;

namespace _4WEBD.User.Dtos.RoleDtos;

public class RoleDto
{
    #region Properties
    public Guid Id { get; set; }
    public string Name { get; set; }
    #endregion

    #region Constructors
    
    public RoleDto(IdentityRole<Guid> role)
    {
        Id = role.Id;
        Name = role.Name;
    }
    
    #endregion
}
