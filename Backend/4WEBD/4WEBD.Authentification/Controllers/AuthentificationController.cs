using _4WEBD.Authentification.Dtos;
using _4WEBD.Identity.Shared.Data;
using _4WEBD.Identity.Shared.Models;
using _4WEBD.SharedClasses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MassTransit;
using _4WEBD.Identity.Shared.Services;

namespace _4WEBD.Authentification.Controllers
{
    [Route("[controller]s")]
    [ApiController]
    public class AuthentificationController(IdentityContext context, UserManager<UserModel> userManager,ISendEndpointProvider sendEndpointProvider ,IConfiguration configuration, RoleManager<IdentityRole<Guid>> roleManager) : ControllerBase
    {

        #region Properties

        private readonly IdentityContext _context = context;
        private readonly UserManager<UserModel> _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;

        private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
        private readonly ISendEndpointProvider _sendEndpointProvider = sendEndpointProvider;

        private readonly TokenService _tokenService = new TokenService(configuration);



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

            var role = _userManager.GetRolesAsync(user).Result;
            if(role.Count == 0)
            {
                role.Add("user");
            }

            await _context.SaveChangesAsync();
            return Ok(new LoginResultDto(user, role, _tokenService.GenerateJwtToken(user, role)));
        }

        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        /// <summary>
        /// Permet de s'inscrire en créant un nouveau compte utilisateur.
        /// </summary>
        /// <param name="registerDTO">Les informations d'inscription de l'utilisateur.</param>
        /// <returns>Un résultat indiquant si l'inscription a réussi ou échoué.</returns>
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {

            var existingUser = await _userManager.FindByEmailAsync(registerDTO.Email);
            if (existingUser != null)
            {
                return BadRequest("Cette adresse e-mail est déjà utilisée.");
            }
            var role = await _roleManager.FindByNameAsync("user");
            if (role == null)
            {
                role = new IdentityRole<Guid>("user");
                await _roleManager.CreateAsync(role);
            }


            UserModel user = new UserModel
            {
                Email = registerDTO.Email,
                UserName = registerDTO.UserName,
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                DateOfBirth = registerDTO.DateOfBirth.ToUniversalTime(),
                EmailConfirmed = false,
            };

            var success = await _userManager.CreateAsync(user, registerDTO.Password);


            if (success.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "user");

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                try
                {
                    var message = new SendMailMessage
                    {
                        To = user.Email,
                        TemplateId = TemplateId.ConfirmeEmailTemplate,
                        Url = token,
                        UserName = user.UserName,
                        UserId = user.Id
                    };

                    var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:sendMail-queue"));

                    await endpoint.Send<SendMailMessage>(message);

                }
                catch (Exception)
                {
                    await _userManager.DeleteAsync(user);
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        "Un problème est survenu lors de l'envoi de l'e-mail de confirmation.");
                }

                return Ok(new { message = "Inscription réussie, merci de valider votre compte." });
            }


            return BadRequest(success.Errors);
        }

        /// <summary>
        /// Permet de confirmer l'e-mail d'un utilisateur en utilisant l'identifiant de l'utilisateur et le code de confirmation envoyé par e-mail.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet("confirmEmail")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
            {
                return BadRequest("Une erreur est survenue lors de la confirmation de l'e-mail.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest("Utilisateur non trouvé.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                return Ok("E-mail confirmé avec succès. Vous pouvez maintenant vous connecter.");
            }

            return BadRequest("Erreur lors de la confirmation de l'e-mail.");
        }

    }
}
