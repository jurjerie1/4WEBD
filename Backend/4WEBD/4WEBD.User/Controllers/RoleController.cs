using _4WEBD.Identity.Shared.Data;
using _4WEBD.Identity.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _4WEBD.User.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    [Authorize(Roles = "admin")]

    public class RoleController(IdentityContext context, RoleManager<IdentityRole<Guid>> roleManager, UserManager<UserModel> userManager) : ControllerBase
    {
        #region Properties

        private readonly IdentityContext _context = context;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
        private readonly UserManager<UserModel> _userManager = userManager;

        #endregion

        /// <summary>
        /// Crée un nouveau rôle.
        /// </summary>
        /// <param name="name">Le nom du rôle à créer.</param>
        /// <returns>Un résultat IActionResult indiquant si l'opération a réussi ou échoué.</returns>
        [HttpPost]
        public async Task<IActionResult> Create(string name)
        {
            var existingRole = await _roleManager.FindByNameAsync(name);
            if (existingRole != null)
            {
                return BadRequest("Le role existe déjà.");
            }
            var role = new IdentityRole<Guid>(name.ToLower());
            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }

        /// <summary>
        /// Permet de récupérer la liste des roles
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            var roles = await _context.Roles.ToListAsync();
            return Ok(roles);
        }

        /// <summary>
        /// Ajoute un role à un utilisateur
        /// </summary>
        /// <param name="roleID"></param>
        /// <param name="userID"></param>
        /// <returns></returns>
        [HttpPost("addRoleToUser/{roleID}")]

        public async Task<IActionResult> AddRoleToUser(Guid roleID, [FromBody] Guid userID)
        {
            var role = await _roleManager.FindByIdAsync(roleID.ToString());
            if (role == null)
            {
                return BadRequest("Le role n'existe pas.");
            }
            var user = await _userManager.FindByIdAsync(userID.ToString());
            if (user == null)
            {
                return BadRequest("L'utilisateur n'existe pas.");
            }
            if (role.Name == null)
            {
                return BadRequest("Une erreur avec le role est survenue.");
            }
            var result = await _userManager.AddToRoleAsync(user, role.Name);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
