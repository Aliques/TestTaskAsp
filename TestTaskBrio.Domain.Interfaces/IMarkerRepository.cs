using System.Collections.Generic;
using System.Threading.Tasks;
using TestTaskBrio.Domain.Core;

namespace TestTaskBrio.Domain.Interfaces
{
    public interface IMarkerRepository
    {
        Marker CreateMarker(Marker marker);
        void Delete(Marker marker);
        Task<List<Marker>> FindAllAsync();
        Task<int> SaveChangesAsync();

        Task<int> RemoveAll();
    }
}
