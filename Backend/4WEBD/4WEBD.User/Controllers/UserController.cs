using System;
using _4WEBD.Identity.Shared.Data;
using _4WEBD.Identity.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace _4WEBD.User.Controllers;


[Route("[controller]s")]
[ApiController]
public class UserController(IdentityContext context, UserManager<UserModel> userManager, IConfiguration configuration, RoleManager<IdentityRole<Guid>> roleManager) : ControllerBase
{

    #region Properties

    private readonly IdentityContext _context = context;
    private readonly UserManager<UserModel> _userManager = userManager;
    private readonly IConfiguration _configuration = configuration;

    private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;


    #endregion

    [HttpGet]
    [Route("users")]
    [Authorize]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpGet]
    [Route("test")]
    [Authorize(Roles = "user")]
    public IActionResult Test()
    {
        return Ok("Test");
    }

}
