using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestTaskBrio.Domain.Core;
using TestTaskBrio.Domain.Interfaces;


namespace TestTaskBrio.Infrastructure.Data
{
    public class MarkerRepository : IMarkerRepository
    {
        private readonly RepositoryContext _repositoryContext;
        public MarkerRepository(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
        }
        public Marker CreateMarker(Marker marker)
        {
            //await _repositoryContext.Database.ExecuteSqlRawAsync("delete from \"Markers\" where id not in" +
            //    "(select id from \"Markers\" order by CreationTime desc limit 10)");

            return _repositoryContext.Add(marker).Entity;
        }

        public void Delete(Marker marker)
        {
            _repositoryContext.Remove(marker);
        }

        public async Task<int> RemoveAll()
        {
            return await _repositoryContext.Database.ExecuteSqlRawAsync("TRUNCATE \"Markers\"");
        }

        public async Task<List<Marker>> FindAllAsync()
        {
            return await _repositoryContext.Markers.ToListAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _repositoryContext.SaveChangesAsync();
        }
    }
}
