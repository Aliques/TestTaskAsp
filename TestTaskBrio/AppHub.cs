using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestTaskBrio.Domain.Core;

namespace TestTaskBrio
{
    public class AppHub : Hub
    {
        private static List<Marker> Markers = new List<Marker>();
        public async Task GetNewMarker(Marker marker)
        {
            Markers.Add(marker);
            await Clients.Others.SendAsync("GetNewMarker", marker);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("GetAllMarkers", Markers);
            await base.OnConnectedAsync();
        }
    }
}