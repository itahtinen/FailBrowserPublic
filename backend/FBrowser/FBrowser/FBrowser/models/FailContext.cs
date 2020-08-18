using Microsoft.EntityFrameworkCore;

namespace FBrowser.models
{
    public class FailContext : DbContext
    {
        public DbSet<Suite> Suites { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<Sample> Samples { get; set; }
        public DbSet<Log> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Suite>();
            modelBuilder.Entity<Case>();
            modelBuilder.Entity<Sample>();
            modelBuilder.Entity<Log>();
        }

        public FailContext(DbContextOptions<FailContext> options)
            : base(options)
        {

        }
    }
}
