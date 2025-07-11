using Microsoft.AspNetCore.Mvc;
using RadiologyCenter.Api.Dto;
using RadiologyCenter.Api.Services;
using RadiologyCenter.Api.Exceptions;
using Microsoft.Extensions.Logging;

namespace RadiologyCenter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="dto">User registration data.</param>
        /// <returns>User info if successful.</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(new { success = false, errors = ModelState });
            try
            {
                var user = await _authService.RegisterAsync(dto);
                _logger.LogInformation("User registered: {UserName}", user.UserName);
                return Ok(new { success = true, user = new { user.Id, user.UserName, user.FullName, user.Role } });
            }
            catch (AuthException ex)
            {
                _logger.LogWarning("Registration failed for {UserName}: {Error}", dto.Username, ex.Message);
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during registration for {UserName}", dto.Username);
                return StatusCode(500, new { success = false, error = "An unexpected error occurred." });
            }
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        /// <param name="dto">User login data.</param>
        /// <returns>JWT token if successful.</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(new { success = false, errors = ModelState });
            try
            {
                var token = await _authService.LoginAsync(dto);
                _logger.LogInformation("User logged in: {UserName}", dto.Username);
                return Ok(new { success = true, token });
            }
            catch (AuthException ex)
            {
                _logger.LogWarning("Login failed for {UserName}: {Error}", dto.Username, ex.Message);
                return Unauthorized(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login for {UserName}", dto.Username);
                return StatusCode(500, new { success = false, error = "An unexpected error occurred." });
            }
        }

        /// <summary>
        /// Logs out the current user (JWT stateless, client-side only).
        /// </summary>
        /// <returns>Success response.</returns>
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // For JWT, logout is handled client-side (token removal). This is a stub for future use.
            _logger.LogInformation("User logged out.");
            return Ok(new { success = true });
        }

        /// <summary>
        /// Changes the password for a user.
        /// </summary>
        /// <param name="dto">Change password data.</param>
        /// <returns>Success response if password changed.</returns>
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(new { success = false, errors = ModelState });
            try
            {
                await _authService.ChangePasswordAsync(dto);
                _logger.LogInformation("Password changed for user: {UserName}", dto.Username);
                return Ok(new { success = true });
            }
            catch (AuthException ex)
            {
                _logger.LogWarning("Change password failed for {UserName}: {Error}", dto.Username, ex.Message);
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during password change for {UserName}", dto.Username);
                return StatusCode(500, new { success = false, error = "An unexpected error occurred." });
            }
        }
    }
}