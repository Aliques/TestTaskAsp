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
        public async Task<Marker> CreateMarker(Marker marker)
        {
            var mark = _repositoryContext.Add(marker).Entity;
            await _repositoryContext.Database.ExecuteSqlRawAsync("delete from \"Markers\" where \"Markers\".\"Id\" " +
                "not in (select \"Markers\".\"Id\" from \"Markers\" order by \"Markers\".\"CreationTime\" desc limit 20)");

            return mark;
        }

        public int Delete(Marker marker)
        {
            int id = marker.Id;
            _repositoryContext.Remove(marker);
            return id;
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
