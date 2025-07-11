using System.Threading.Tasks;
using RadiologyCenter.Api.Dto;
using RadiologyCenter.Api.Models;

namespace RadiologyCenter.Api.Services
{
    public interface IAuthService
    {
        Task<ApplicationUser> RegisterAsync(UserRegisterDto dto);
        Task<string> LoginAsync(UserLoginDto dto);
        Task ChangePasswordAsync(ChangePasswordDto dto);
        Task LogoutAsync();
    }
} 