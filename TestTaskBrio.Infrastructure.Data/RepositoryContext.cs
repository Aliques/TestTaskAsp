using Microsoft.EntityFrameworkCore;
using TestTaskBrio.Domain.Core;

namespace TestTaskBrio.Infrastructure.Data
{
    public class RepositoryContext:DbContext
    {
        public DbSet<Marker> Markers { get; set; }
        public RepositoryContext(DbContextOptions<RepositoryContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }
    }
}
