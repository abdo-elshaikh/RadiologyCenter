using System;

namespace RadiologyCenter.Api.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string Action { get; set; } = null!; // Create, Update, Delete
        public string EntityName { get; set; } = null!;
        public string EntityId { get; set; } = null!;
        public DateTime Timestamp { get; set; }
        public string? OldValues { get; set; } // JSON
        public string? NewValues { get; set; } // JSON
    }
} 