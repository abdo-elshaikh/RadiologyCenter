using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RadiologyCenter.Api.Models;
using RadiologyCenter.Api.Data;
using RadiologyCenter.Api.Dto;
using RadiologyCenter.Api.Exceptions;
using System.Text.RegularExpressions;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace RadiologyCenter.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        private const string PasswordStrengthRegex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$";
        private const string JwtKeyConfig = "Jwt:Key";
        private const string JwtIssuerConfig = "Jwt:Issuer";
        private const string JwtAudienceConfig = "Jwt:Audience";

        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration config, ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _logger = logger;
        }

        /// <summary>
        /// Checks if the provided password meets strength requirements.
        /// </summary>
        /// <param name="password">The password to check.</param>
        /// <returns>True if strong, false otherwise.</returns>
        private bool IsPasswordStrong(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6) return false;
            return Regex.IsMatch(password, PasswordStrengthRegex);
        }

        /// <summary>
        /// Registers a new user with the provided registration data.
        /// </summary>
        /// <param name="dto">User registration data.</param>
        /// <returns>The created ApplicationUser.</returns>
        public async Task<ApplicationUser> RegisterAsync(UserRegisterDto dto)
        {
            var normalizedUsername = dto.Username.ToLowerInvariant();
            if (!IsPasswordStrong(dto.Password))
                throw new AuthException("Password must be at least 6 characters and contain uppercase, lowercase, and a digit.");
            var user = new ApplicationUser
            {
                UserName = normalizedUsername,
                FullName = dto.FullName,
                Role = dto.Role,
                IsActive = false
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                throw new AuthException(string.Join("; ", result.Errors.Select(e => e.Description)));
            await _userManager.AddToRoleAsync(user, dto.Role);
            return user;
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token if successful.
        /// </summary>
        /// <param name="dto">User login data.</param>
        /// <returns>JWT token string.</returns>
        public async Task<string> LoginAsync(UserLoginDto dto)
        {
            var normalizedUsername = dto.Username.ToLowerInvariant();
            var user = await _userManager.FindByNameAsync(normalizedUsername);
            if (user == null)
                throw new AuthException("Invalid username or password");
            if (!user.IsActive)
                throw new AuthException("User is not active");
            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                throw new AuthException("Invalid username or password");
            return GenerateJwtToken(user);
        }

        /// <summary>
        /// Generates a JWT token for the specified user.
        /// </summary>
        /// <param name="user">The user for whom to generate the token.</param>
        /// <returns>JWT token string.</returns>
        private string GenerateJwtToken(ApplicationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config[JwtKeyConfig]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _config[JwtIssuerConfig],
                Audience = _config[JwtAudienceConfig]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Changes the password for a user.
        /// </summary>
        /// <param name="dto">Change password data.</param>
        public async Task ChangePasswordAsync(ChangePasswordDto dto)
        {
            var normalizedUsername = dto.Username.ToLowerInvariant();
            var user = await _userManager.FindByNameAsync(normalizedUsername);
            if (user == null)
                throw new AuthException("User not found.");
            if (!user.IsActive)
                throw new AuthException("User is not active.");
            if (!IsPasswordStrong(dto.NewPassword))
                throw new AuthException("New password must be at least 6 characters and contain uppercase, lowercase, and a digit.");
            var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);
            if (!result.Succeeded)
                throw new AuthException(string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        /// <summary>
        /// Logs out the current user (no-op for JWT stateless auth).
        /// </summary>
        /// <returns>Completed task.</returns>
        public Task LogoutAsync()
        {
            return Task.CompletedTask;
        }
    }
} 