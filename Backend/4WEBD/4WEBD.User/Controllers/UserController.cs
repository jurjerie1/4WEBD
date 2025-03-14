using System;
using _4WEBD.User.Data;
using _4WEBD.User.Dtos.UserDtos;
using _4WEBD.User.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace _4WEBD.User.Controllers;


public class UserController(UserContext context, UserManager<UserModel> userManager, IConfiguration configuration, RoleManager<IdentityRole<Guid>> roleManager) : ControllerBase
{

    #region Properties

    private readonly UserContext _context = context;
    private readonly UserManager<UserModel> _userManager = userManager;
    private readonly IConfiguration _configuration = configuration;

    private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;


    #endregion

    /// <summary>
    /// Permet de se connecter
    /// </summary>
    /// <param name="userDTO"></param>
    /// <returns></returns>
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginDto userDTO)
    {
        var user = await _userManager.FindByEmailAsync(userDTO.Email);
        if (user == null)
        {
            return BadRequest("Le couple Email / mot de passe est incorrect.");
        }
        if (!await _userManager.IsEmailConfirmedAsync(user))
        {
            return BadRequest("Vous devez confirmer votre e-mail avant de pouvoir vous connecter.");
        }

        bool passwordIsGood = await _userManager.CheckPasswordAsync(user, userDTO.Password);
        if (!passwordIsGood)
        {
            return BadRequest("Le couple Email / mot de passe est incorrect.");
        }

        var role = _userManager.GetRolesAsync(user).Result.FirstOrDefault() ?? "user";

        //await _notificationProducer.SendNotification();
        // var token = _tokenService.GenerateJwtToken(user, role);
        // var refreshToken = _tokenService.GenerateRefreshToken();
        // var userAgent = Request.Headers["User-Agent"].ToString();
        // var parser = Parser.GetDefault();
        // ClientInfo clientInfo = parser.Parse(userAgent);


        // RefreshToken refreshTokenEntity = new RefreshToken
        // {
        //     Token = refreshToken,
        //     Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Jwt:RefreshTokenExpirationDays")),
        //     UserId = user.Id,
        //     IsRevoked = false,
        //     DeviceInfo = clientInfo.OS.Family.ToLower(),
        // };
        // await _context.RefreshTokens.AddAsync(refreshTokenEntity);
        await _context.SaveChangesAsync();


        return Ok(new LoginResultDto(user, role));

    }

}
