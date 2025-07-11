using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RadiologyCenter.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace RadiologyCenter.Api.Data
{
    public class RadiologyCenterContext : IdentityDbContext<ApplicationUser>
    {
        public RadiologyCenterContext(DbContextOptions<RadiologyCenterContext> options) : base(options) { }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Examination> Examinations { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<InsuranceProvider> InsuranceProviders { get; set; }
        public DbSet<PatientInsurance> PatientInsurances { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<PatientContract> PatientContracts { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationships between tables
            modelBuilder.Entity<AppointmentExamination>()
                .HasKey(ae => new { ae.AppointmentId, ae.ExaminationId });

            modelBuilder.Entity<AppointmentExamination>()
                .HasOne(ae => ae.Appointment)
                .WithMany(a => a.AppointmentExaminations)
                .HasForeignKey(ae => ae.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AppointmentExamination>()
                .HasOne(ae => ae.Examination)
                .WithMany()
                .HasForeignKey(ae => ae.ExaminationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision configuration to avoid EF Core warnings
            modelBuilder.Entity<Appointment>()
                .Property(a => a.Discount)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Appointment>()
                .Property(a => a.TotalCost)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Contract>()
                .Property(c => c.CoveragePercent)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Contract>()
                .Property(c => c.DiscountAmount)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Examination>()
                .Property(e => e.BasePrice)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<InsuranceProvider>()
                .Property(i => i.CoveragePercent)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<InsuranceProvider>()
                .Property(i => i.DiscountAmount)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");


            // Configure audit log table
            modelBuilder.Entity<AuditLog>()
               .ToTable("AuditLogs")
               .HasNoKey();
            modelBuilder.Entity<AuditLog>()
               .Property(a => a.Id)
               .ValueGeneratedOnAdd();

            // Remove admin user seeding for custom User
        }
    }
}