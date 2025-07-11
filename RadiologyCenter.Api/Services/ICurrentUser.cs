using System.Security.Claims;

namespace RadiologyCenter.Api.Services
{
    public interface ICurrentUser
    {
        string? UserId { get; }
        string? UserName { get; }
        string? Role { get; }
        IEnumerable<Claim> Claims { get; }
    }
} 