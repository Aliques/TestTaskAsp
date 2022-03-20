using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace TestTaskBrio.Infrastructure.Data
{
    public class AppHub : Hub
    {
        public async Task GetNewMarker(object message)
        {
            await this.Clients.All.SendAsync("GetNewMarker", message);
        }
    }
}
