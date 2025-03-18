using System;
using System.Security.Claims;
using _4WEBD.Identity.Shared.Data;
using _4WEBD.Identity.Shared.Models;
using _4WEBD.User.Dtos.UserDtos;
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

    /// <summary>
    /// Permet de récupérer tous les utilisateurs.
    /// </summary>
    /// <response code="200">Retourne une liste d'utilisateurs.</response>
    /// <response code="403">Si l'utilisateur n'est pas autorisé.</response>
    /// <response code="401">Si l'utilisateur n'est pas authentifié.</response>
    [HttpGet("GetAll")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetUsers()
    {
        List<UserDto> userDtos = _userManager.Users.Join(_context.UserRoles, user => user.Id, userRole => userRole.UserId, (user, userRole) => new { user, userRole })
            .Join(_context.Roles, userUserRole => userUserRole.userRole.RoleId, role => role.Id, (userUserRole, role) => new { userUserRole, role })
            .Select(x => new UserDto(x.userUserRole.user, new List<string> { x.role.Name })).ToList();

        return Ok(userDtos);
    }

    /// <summary>
    /// Permet de récupérer l'utilisateur actuellement connecté.
    /// </summary>
    /// <response code="200">Retourne l'utilisateur actuellement connecté.</response>
    /// <response code="404">Si l'utilisateur n'existe pas.</response>
    /// <response code="403">Si l'utilisateur n'est pas autorisé.</response>
    /// <response code="401">Si l'utilisateur n'est pas authentifié.</response>

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
        if (userId == "")
        {
            return NotFound("Utilisateur non trouvé.");
        }
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == Guid.Parse(userId));

        if (user == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }

        UserDto userDto = new UserDto(user, await _userManager.GetRolesAsync(user));

        return Ok(userDto);
    }


    /// <summary>
    /// Permet de récupérer un utilisateur par son id.
    /// </summary>
    /// <param name="id"></param>
    /// <response code="200">Retourne l'utilisateur correspondant à l'id.</response>
    /// <response code="404">Si l'utilisateur n'existe pas.</response>
    /// <response code="403">Si l'utilisateur n'est pas autorisé.</response>
    /// <response code="401">Si l'utilisateur n'est pas authentifié.</response>
    /// <response code="401">Si l'utilisateur n'est pas authentifié.</response>
    [HttpGet("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }

        UserDto userDto = new UserDto(user, await _userManager.GetRolesAsync(user));

        return Ok(userDto);
    }


    /// <summary>
    /// Permet de mettre à jour l'utilisateur connecté.
    /// </summary>
    /// <param name="userDto"></param>
    /// <response code="200">Retourne un message de succès et l'utilisateur mis à jour.</response>
    /// <response code="404">Si l'utilisateur n'existe pas.</response>
    /// <response code="400">Si l'email ou le nom d'utilisateur est déjà utilisé.</response>
    /// <response code="403">Si l'utilisateur n'est pas autorisé.</response>
    /// <response code="401">Si l'utilisateur n'est pas authentifié.</response>
    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateUser(UpdateUserDto userDto)
    {
        string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == Guid.Parse(userId));

        if (user == null)
        {
            return NotFound();
        }
        if (userDto.Email != null && userDto.Email != "" && await _userManager.Users.AnyAsync(x => x.Email == userDto.Email && x.Id != user.Id))
        {
            return BadRequest("Cette adresse email est déjà utilisée.");
        }
        if (userDto.UserName != null && userDto.UserName != "" && await _userManager.Users.AnyAsync(x => x.UserName == userDto.UserName && x.Id != user.Id))
        {
            return BadRequest("Ce nom d'utilisateur est déjà utilisé.");
        }

        user.Email = userDto.Email ?? user.Email;
        user.UserName = userDto.UserName ?? user.UserName;
        user.FirstName = userDto.FirstName ?? user.FirstName;
        user.LastName = userDto.LastName ?? user.LastName;
        user.PhoneNumber = userDto.PhoneNumber ?? user.PhoneNumber;


        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Utilisateur mis à jour avec succès.", user = new UserDto(user, await _userManager.GetRolesAsync(user)) });
    }

    /// <summary>
    /// Permet de mettre à jour un utilisateur par son id.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="userDto"></param>
    /// <returns></returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateUserById(Guid id, UpdateUserDto userDto)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("L'id est obligatoire.");
        }
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (user == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }
        user.UserName = userDto.UserName ?? user.UserName;
        user.FirstName = userDto.FirstName ?? user.FirstName;
        user.LastName = userDto.LastName ?? user.LastName;
        user.PhoneNumber = userDto.PhoneNumber ?? user.PhoneNumber;
        user.Email = userDto.Email ?? user.Email;

        await _userManager.UpdateAsync(user);
        return Ok(new { message = "Utilisateur mis à jour avec succès.", user = new UserDto(user, await _userManager.GetRolesAsync(user)) });
    }

    /// <summary>
    /// Permet de supprimer l'utilisateur connecté.
    /// </summary>
    /// <returns></returns>
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteUser()
    {
        string? userId = (HttpContext.User).Claims.FirstOrDefault(x => x.Type == "Id")?.Value;
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == Guid.Parse(userId));
        if (user == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }
        await _userManager.DeleteAsync(user);
        return Ok("Utilisateur supprimé avec succès.");
    }

}
